"""Attachment check for every rig in vprig.json (+ rig.json): each limb's pivot must lie ON the body's ink
(within 6 px of an opaque body pixel) and the limb's own ink must touch the pivot, at rest AND at the
extreme rotation used by walks/gestures (limbs only rotate about the pivot, so a pivot on the body ==
attached in every frame). Usage: python3 -I check_vp_rig.py <rig.json> [public_dir]   (exit 1 on FAIL)"""
import sys, json, numpy as np
from PIL import Image
from scipy import ndimage as nd
R = json.load(open(sys.argv[1])); PUB = sys.argv[2] if len(sys.argv) > 2 else "public"
fails = 0
for key, r in R.items():
    b = r["body"]
    for bf in [b["file"]] + ([r["bodyNoHead"]] if r.get("bodyNoHead") else []):
        A = np.array(Image.open(f"{PUB}/{bf}").convert("RGBA"))[..., 3] > 100
        ys, xs = np.nonzero(A)
        for l in r["limbs"]:
            px, py = l["pivot"]; x, y = px - b["x"], py - b["y"]
            dist = float(np.sqrt(((xs - x) ** 2 + (ys - y) ** 2).min()))   # pivot -> nearest body ink (px)
            onbody = dist <= max(6.0, 0.012 * A.shape[0])
            L = np.array(Image.open(f"{PUB}/{l['file']}").convert("RGBA"))[..., 3] > 100
            lx, ly = int(round(px - l["x"])), int(round(py - l["y"]))
            win = L[max(0, ly - 8): ly + 9, max(0, lx - 8): lx + 9]
            touches = win.any()
            if not (onbody and touches):
                fails += 1
                print(f"FAIL {key:40} {bf.split('/')[-1]:16} {l['kind']}{l['side']} pivot_dist={dist:.1f}px limb_touches_pivot={touches}")
print("rigs", len(R), "FAILS", fails)
sys.exit(1 if fails else 0)
