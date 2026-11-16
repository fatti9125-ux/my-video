"""Measure layered puppet parts (Rig_*.png + Positions_720px.csv) and emit rig metadata JSON.

Usage: python3 -I layer_rig_meta.py <public_dir_with_character_folders> <out.json>

For every character folder that contains Rig_torso.png, measures from the real alpha:
  - every part's size
  - limb segments (upper arm, forearm, thigh, shin): joint ends = centre of the opaque pixels
    in the top / bottom 3 rows (the shoulder/elbow, elbow/wrist, hip/knee, knee/ankle ends)
  - hands / feet: attach point = centre of the topmost opaque rows (the wrist / ankle)
  - head: chin = lowest opaque pixel near the centre; centre x
  - torso: top row, bottom row, silhouette left/right edge per row (sampled every 4 px)
These feed `LayerPuppet`, which builds a joint chain so parts can never float.
"""
import csv, json, os, sys
import numpy as np
from PIL import Image


def alpha(path):
    return np.asarray(Image.open(path).convert("RGBA"))[..., 3] > 110


def end_centre(a, which):
    ys = np.nonzero(a.any(axis=1))[0]
    rows = ys[:3] if which == "top" else ys[-3:]
    xs = np.nonzero(a[rows].any(axis=0))[0]
    y = float(rows.mean())
    return [round(float(xs.mean()), 1), round(y, 1)]


def measure(folder):
    parts = {}
    for f in sorted(os.listdir(folder)):
        if not (f.startswith("Rig_") and f.endswith(".png")):
            continue
        name = f[4:-4]
        a = alpha(os.path.join(folder, f))
        h, w = a.shape
        ys, xs = np.nonzero(a)
        p = {"file": f[:-4], "size": [w, h], "bbox": [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]}
        low = name.lower()
        if any(k in low for k in ("upper_arm", "forearm", "thigh", "shin")):
            p["top"] = end_centre(a, "top"); p["bottom"] = end_centre(a, "bottom")
        elif low.endswith("hand") or low.endswith("foot"):
            p["attach"] = end_centre(a, "top")
        elif low.endswith("head") or low.endswith("head_base"):
            col = a[:, w // 2 - w // 8: w // 2 + w // 8]
            chin = int(np.nonzero(col.any(axis=1))[0].max())
            p["chin"] = [round(w / 2, 1), chin]
        elif "torso" in low or "vest" in low:
            top = int(ys.min()); bot = int(ys.max())
            prof = []
            for y in range(top, bot + 1, 4):
                r = np.nonzero(a[y])[0]
                prof.append([y, int(r.min()), int(r.max())] if len(r) else [y, None, None])
            p["top"] = top; p["bottom"] = bot; p["profile"] = prof
        parts[name] = p
    pos = {}
    csvp = os.path.join(folder, "Positions_720px.csv")
    if os.path.exists(csvp):
        for r in csv.DictReader(open(csvp)):
            pos[r["file"][4:-4]] = [int(r["left"]) - 6, int(r["top"]) - 6]  # CSV is before the 6 px padding
    return {"parts": parts, "pos": pos}


if __name__ == "__main__":
    root, out = sys.argv[1], sys.argv[2]
    meta = {}
    for d in sorted(os.listdir(root)):
        f = os.path.join(root, d)
        if os.path.isdir(f) and (os.path.exists(os.path.join(f, "Rig_torso.png")) or os.path.exists(os.path.join(f, "Rig_front_vest.png"))):
            meta[d] = measure(f)
    json.dump(meta, open(out, "w"), separators=(",", ":"))
    print("rig meta for:", ", ".join(meta))
