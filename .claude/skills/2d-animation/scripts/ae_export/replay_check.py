"""Replay check for an AE package: rebuild given frames from layers.json with the SAME transform math the
.jsx sets up (camera nulls, anchors, scales, rig nulls, keyframes), using footage/BG.mp4 + FX frames, and put
each next to the real Remotion still. Text layers (captions/labels) are not drawn here.
Usage: python3 -I replay_check.py <pkg_dir> <remotion_stills_dir (f00123.png at 1920)> <out.png> frame [frame ...]
"""
import json, math, subprocess, sys, os
import numpy as np
from PIL import Image

pkg, still_dir, out = sys.argv[1], sys.argv[2], sys.argv[3]
frames = [int(f) for f in sys.argv[4:]]
L = json.load(open(f"{pkg}/layers.json"))
cams = {c["id"]: c for c in L["cams"]}


def cam_scale(c, f):
    s = c["from"] + (c["to"] - c["from"]) * min(1, max(0, (f - c["s0"]) / c["dur"]))
    p = 1.0
    if c["punch"] and f >= c["punch"]["at"]:
        q = min(1, (f - c["punch"]["at"]) / c["punch"]["frames"])
        p = 1 + (c["punch"]["to"] - 1) * (1 - (1 - q) ** 3)
    return s, p


def cam_affine(cid, f):
    """3x3 matrix: layer-local (cam child space) -> comp."""
    if cid is None:
        return np.eye(3), (0, 0)
    c = cams[cid]
    s, p = cam_scale(c, f)
    O1 = np.array([c["ox"], c["oy"]])
    A = np.array([[s, 0, O1[0]], [0, s, O1[1]], [0, 0, 1.0]])
    origin = (c["ox"], c["oy"])
    if c["punch"]:
        d = np.array([c["punch"]["ox"], c["punch"]["oy"]]) - O1
        A = A @ np.array([[p, 0, d[0]], [0, p, d[1]], [0, 0, 1.0]])
        origin = (c["punch"]["ox"], c["punch"]["oy"])
    return A, origin


def T(x, y): return np.array([[1, 0, x], [0, 1, y], [0, 0, 1.0]])
def S(a, b): return np.array([[a, 0, 0], [0, b, 0], [0, 0, 1.0]])
def Rz(deg):
    r = math.radians(deg); return np.array([[math.cos(r), -math.sin(r), 0], [math.sin(r), math.cos(r), 0], [0, 0, 1.0]])


def paste(canvas, img, M):
    """Draw RGBA img with footage->comp matrix M onto canvas (PIL affine uses comp->footage inverse)."""
    inv = np.linalg.inv(M)
    t = Image.new("RGBA", canvas.size)
    w = img.transform(canvas.size, Image.AFFINE, tuple(inv[:2].flatten()), resample=Image.BILINEAR)
    canvas.alpha_composite(w)


def ease_val(f, a, b, va, vb, cubic=True):
    if f <= a: return va
    if f >= b: return vb
    q = (f - a) / (b - a); q = 1 - (1 - q) ** 3 if cubic else q
    return va + (vb - va) * q


def frame_of(video, f):
    return Image.open(subprocess.run(["ffmpeg", "-v", "error", "-ss", str(f / 30 + 0.001), "-i", video, "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"],
                                     capture_output=True).stdout).convert("RGBA")


import io
tiles = []
for f in frames:
    can = Image.new("RGBA", (1920, 1080), (0, 0, 0, 255))
    shot = [s for s in L["shots"] if s["s0"] <= f < s["s1"]][0]
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(f / 30 + 0.001), "-i", f"{pkg}/footage/BG.mp4", "-frames:v", "1", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    bg = Image.open(io.BytesIO(raw)).convert("RGBA")
    segcam = None
    for c in L["cams"]:
        if c["parent"] is None and c["win"][0] <= f < c["win"][1]: segcam = c["id"]
    A, _ = cam_affine(segcam, f)
    O = np.array(cams[segcam]["punch"] and [cams[segcam]["punch"]["ox"], cams[segcam]["punch"]["oy"]] or [cams[segcam]["ox"], cams[segcam]["oy"]]) if segcam is not None else np.zeros(2)
    paste(can, bg, A @ T(-O[0], -O[1]))
    for l in sorted(L["layers"], key=lambda q: q["z"]):
        if not (l["win"][0] <= f < l["win"][1]) or l["kind"] not in ("spr", "rig"): continue
        A, origin = cam_affine(l["cam"], f)
        x0, y0, x1, y1 = l["meta"][:4]; k = l["h"] / (y1 - y0); cx = (x0 + x1) / 2
        P = np.array([l["x"] - origin[0], l["y"] - origin[1]]) if l["cam"] is not None else np.array([l["x"], l["y"]], float)
        fl = -1 if l["flip"] else 1
        if l["kind"] == "spr":
            off = np.zeros(2)
            e = l.get("enter")
            if e:
                d = e.get("dist", 1200)
                v = {"left": (-d, 0), "right": (d, 0), "top": (0, -d), "bottom": (0, l["h"] * 1.1)}[e["from"]]
                off += np.array(v) * (1 - ease_val(f, l["at"], l["at"] + e["frames"], 0, 1))
            if l.get("drop"):
                off[1] -= l["drop"]["height"] * (1 - ease_val(f, l["at"], l["at"] + l["drop"]["frames"], 0, 1, False))
            if l.get("walk"): off[0] += l["walk"] * (f - l["at"])
            Mx = A @ T(*(P + off)) @ S(fl * k, k) @ T(-cx, -y1)
            paste(can, Image.open(f"{pkg}/{'footage/' + l['file']}").convert("RGBA"), Mx)
            for i, h in enumerate(l.get("heads") or []):
                j = f - l["openFrom"]
                o = l["open"][j] if 0 <= j < len(l["open"]) else 0
                if (i == 0 and o) or (i == 1 and not o): continue
                hx, hy, hw, hh = h["rect"]
                paste(can, Image.open(f"{pkg}/footage/{h['file']}").convert("RGBA"), Mx @ T(hx, hy) @ S(hw / h["wh"][0], hh / h["wh"][1]))
        else:
            r = l["rig"]; legs = [q for q in r["limbs"] if q["kind"] == "leg"]
            Lg = max([q["len"] for q in legs] or [0]); stride = 2 * Lg * math.sin(math.radians(17))
            v = 0 if l["walk"] == 0 else math.copysign(abs(l["walk"]) * stride * k / 16, l["walk"])
            stop = 1e9 if l["walkUntil"] is None else l["walkUntil"] - l["at"]
            lf = f - l["at"]; walking = l["walk"] != 0 and lf < stop
            tW = min(max(lf, 0), stop) if l["walk"] else 0
            th = 17 * math.sin(2 * math.pi * lf / 32) if walking else 0
            drop = Lg * (1 - math.cos(math.radians(th)))
            RIGm = A @ T(P[0] + v * tW, P[1]) @ Rz(2 * math.copysign(1, l["walk"]) if walking else 0) @ S(fl * k, k)
            HIP = RIGm @ T(-cx, -y1 + drop)
            for q in r["limbs"]:
                ang = (th if q["side"] == "L" else -th) if q["kind"] == "leg" else ((-th * 0.6 if q["side"] == "L" else th * 0.6) if walking else 0)
                px, py = q["pivot"]
                paste(can, Image.open(f"{pkg}/footage/{q['file']}").convert("RGBA"), HIP @ T(px, py) @ Rz(ang) @ T(-(px - q["x"]), -(py - q["y"])) @ T(0, 0))
            paste(can, Image.open(f"{pkg}/footage/{r['body']['file']}").convert("RGBA"), HIP @ T(r["body"]["x"], r["body"]["y"]))
    fxp = f"{pkg}/footage/FX/fx_{f:04d}.png"
    if os.path.exists(fxp):
        fx = Image.open(fxp).convert("RGBA")
        paste(can, fx, A @ T(-O[0], -O[1]) if segcam is not None else np.eye(3))
    ref = Image.open(f"{still_dir}/f{f:05d}.png").convert("RGBA").resize((1920, 1080))
    pair = Image.new("RGB", (3840, 1080)); pair.paste(can.convert("RGB"), (0, 0)); pair.paste(ref.convert("RGB"), (1920, 0))
    tiles.append(pair.resize((1280, 360)))
sheet = Image.new("RGB", (1280, 360 * len(tiles)))
for i, t in enumerate(tiles): sheet.paste(t, (0, i * 360))
sheet.save(out)
print("saved", out)
