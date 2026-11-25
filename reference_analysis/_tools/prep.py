"""Decode one reference clip into the analysis folder (resumable).
usage: python3 prep.py <clip.mp4> <NN> <out_root>
Writes <out_root>/<NN>/: probe.json, frame_timestamps.json, frames/%06d.png (0-based, lossless),
mix.wav (pcm_s24le, native rate/channels), metrics.csv, frames.csv (skeleton), audio_onsets.csv,
sheets/overview.png (~1 fps), sheets/seq_FAAAAAA-FBBBBBB.png (every frame, 4x3 per sheet, labels outside the picture),
sheets/wave.png (audio envelope + onset ticks with frame numbers), progress.md."""
import json, os, subprocess, sys, csv
import numpy as np
from PIL import Image, ImageDraw, ImageFont

src, NN, root = sys.argv[1], sys.argv[2], sys.argv[3]
D = os.path.join(root, NN); os.makedirs(f"{D}/frames", exist_ok=True); os.makedirs(f"{D}/sheets", exist_ok=True)
run = lambda a: subprocess.run(a, check=True, capture_output=True)
probe = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", src]).stdout)
json.dump(probe, open(f"{D}/probe.json", "w"), indent=1)
ft = json.loads(run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_frames", "-show_entries",
                     "frame=best_effort_timestamp_time,pts_time,pkt_duration_time", "-of", "json", src]).stdout)["frames"]
json.dump(ft, open(f"{D}/frame_timestamps.json", "w"))
if len([f for f in os.listdir(f"{D}/frames") if f.endswith(".png")]) != len(ft):
    run(["ffmpeg", "-v", "error", "-y", "-i", src, "-map", "0:v:0", "-an", "-fps_mode", "passthrough", "-start_number", "0", f"{D}/frames/%06d.png"])
if not os.path.exists(f"{D}/mix.wav"):
    run(["ffmpeg", "-v", "error", "-y", "-i", src, "-map", "0:a:0", "-vn", "-c:a", "pcm_s24le", f"{D}/mix.wav"])
frames = sorted(f for f in os.listdir(f"{D}/frames") if f.endswith(".png"))
N = len(frames); assert N == len(ft), (N, len(ft))
pts = [float(f.get("pts_time", f.get("best_effort_timestamp_time", 0))) for f in ft]
v = next(s for s in probe["streams"] if s["codec_type"] == "video")
fps = eval(v["r_frame_rate"]) if "/" in v["r_frame_rate"] else float(v["r_frame_rate"])

# ---- metrics: full-frame and per-region (8x6 grid) change vs previous frame, brightness
rows = []; prev = None
for i, f in enumerate(frames):
    a = np.asarray(Image.open(f"{D}/frames/{f}").convert("RGB"), np.int16)
    g = a.mean(2); br = float(g.mean())
    if prev is None: rows.append((i, pts[i], 0.0, 0.0, 0.0, 0, br)); prev = g; continue
    d = np.abs(g - prev); H, W = d.shape
    cells = [d[y * H // 6:(y + 1) * H // 6, x * W // 8:(x + 1) * W // 8].mean() for y in range(6) for x in range(8)]
    rows.append((i, pts[i], float(d.mean()), float((d > 40).mean()), float(max(cells)), int(np.argmax(cells)), br)); prev = g
with open(f"{D}/metrics.csv", "w", newline="") as o:
    w = csv.writer(o); w.writerow(["frame", "pts_s", "mean_absdiff", "changed_frac_gt40", "max_cell_diff", "max_cell_idx_8x6", "brightness"])
    for r in rows: w.writerow([r[0], f"{r[1]:.3f}", f"{r[2]:.2f}", f"{r[3]:.4f}", f"{r[4]:.2f}", r[5], f"{r[6]:.1f}"])
if not os.path.exists(f"{D}/frames.csv"):
    with open(f"{D}/frames.csv", "w", newline="") as o:
        w = csv.writer(o); w.writerow(["frame", "pts_s", "image", "shot_id", "visual_state_id", "event_ids", "inspection_status"])
        for i in range(N): w.writerow([i, f"{pts[i]:.3f}", f"frames/{i:06d}.png", "", "", "", "decoded only"])

# ---- audio: envelope + spectral-flux onset candidates (waveform-derived: UNVERIFIED, identity blank)
import scipy.io.wavfile as wf
sr, au = wf.read(f"{D}/mix.wav"); au = au.astype(np.float64)
if au.ndim > 1: mono = au.mean(1)
else: mono = au
mono /= (np.abs(mono).max() + 1e-9)
hop = int(sr / 100); win = hop * 4
nf = (len(mono) - win) // hop
spec = np.abs(np.fft.rfft(np.stack([mono[i * hop:i * hop + win] * np.hanning(win) for i in range(nf)]), axis=1))
flux = np.maximum(np.diff(np.log1p(spec * 50), axis=0), 0).sum(1)
flux = np.concatenate([[0], flux]); thr = np.median(flux) + 2.5 * np.std(flux)
rms = np.sqrt(np.convolve(mono ** 2, np.ones(hop) / hop, "same"))[::hop][:nf]
ons = [i for i in range(2, nf - 2) if flux[i] > thr and flux[i] == flux[i - 2:i + 3].max()]
astart = float(next((s.get("start_time", 0) for s in probe["streams"] if s["codec_type"] == "audio"), 0))
with open(f"{D}/audio_onsets.csv", "w", newline="") as o:
    w = csv.writer(o); w.writerow(["onset_s", "mapped_frame", "flux", "rms_db", "verification"])
    for i in ons:
        t = i * hop / sr + astart
        w.writerow([f"{t:.3f}", int(round(t * fps)), f"{flux[i]:.1f}", f"{20*np.log10(rms[i]+1e-9):.1f}", "unverified (waveform-derived)"])
# wave image: 1 row per 5 s
secs = len(mono) / sr; rowsN = int(np.ceil(secs / 5)); Wd = 1500; Hr = 90
img = Image.new("RGB", (Wd, rowsN * Hr), "white"); dr = ImageDraw.Draw(img)
env = rms / (rms.max() + 1e-9)
for r in range(rowsN):
    y0 = r * Hr; dr.text((2, y0 + 2), f"{r*5}-{r*5+5}s", fill="black")
    for px in range(Wd):
        t = r * 5 + px / Wd * 5; k = int(t * 100)
        if k < len(env): h = env[k] * (Hr - 20); dr.line([(px, y0 + Hr - 5), (px, y0 + Hr - 5 - h)], fill=(70, 110, 200))
    for i in ons:
        t = i * hop / sr
        if r * 5 <= t < r * 5 + 5:
            px = (t - r * 5) / 5 * Wd; dr.line([(px, y0 + 14), (px, y0 + Hr - 5)], fill="red"); dr.text((px + 2, y0 + 14), f"F{int(round((t+astart)*fps))}", fill="red")
img.save(f"{D}/sheets/wave.png")

# ---- sheets
def tile(i):
    im = Image.open(f"{D}/frames/{frames[i]}").convert("RGB"); return im
w0, h0 = Image.open(f"{D}/frames/{frames[0]}").size; LB = 18; G = 6
def sheet(idx, cols, path, scale=1.0):
    tw, th = int(w0 * scale), int(h0 * scale); rws = (len(idx) + cols - 1) // cols
    S = Image.new("RGB", (cols * (tw + G), rws * (th + LB + G)), (235, 235, 235)); d = ImageDraw.Draw(S)
    for k, i in enumerate(idx):
        x = (k % cols) * (tw + G); y = (k // cols) * (th + LB + G)
        d.text((x + 2, y + 3), f"F{i:06d}  {pts[i]:.3f}s", fill="black")
        S.paste(tile(i).resize((tw, th)), (x, y + LB))
    S.save(path)
step = max(1, int(round(fps)))
sheet(list(range(0, N, step)), 8, f"{D}/sheets/overview.png", 0.5)
for a in range(0, N, 12):
    idx = list(range(a, min(N, a + 12))); p = f"{D}/sheets/seq_F{idx[0]:06d}-F{idx[-1]:06d}.png"
    if not os.path.exists(p): sheet(idx, 4, p)
if not os.path.exists(f"{D}/progress.md"):
    open(f"{D}/progress.md", "w").write(f"# Clip {NN} progress\n\nsource: {os.path.basename(src)}\nframes decoded: {N}\nsheets: {(N+11)//12} seq sheets (12 frames each)\nlast verified frame: none\n\n## Log\n")
print(NN, "frames", N, "fps", fps, "dur", probe["format"]["duration"], "onsets", len(ons))
