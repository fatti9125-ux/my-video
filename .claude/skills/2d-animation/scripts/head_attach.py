"""ATTACH swapped expression heads: every head's CHIN is placed on the NEUTRAL head's chin (+OVERLAP down),
so no expression can float above the collar. Then CHECK every char x head on the headless body.

Usage: python3 -I head_attach.py <vp_heads.json> <public_dir> <char>:<body>:<neutral,h1,...> [...]
  (run head_fit.py first: the neutral head's fit matches the drawing's own head, so its chin sits on the collar)
Why: heads were scaled and aligned by the TOP of the head; a head drawn shorter at the chin (open-mouth
smile) ended above the collar -> background between chin and body (Ford, floating head).
CHECK (exit 1 on FAIL): compose headless body + head; in the neck columns (head centre +/- 18 %) there must
be no transparent row between the head and the body, i.e. the chin overlaps the collar in every expression.
"""
import sys, json, numpy as np
from PIL import Image

HJ, PUB = sys.argv[1], sys.argv[2]
H = json.load(open(HJ))
OVER = 0.03          # chin sinks this fraction of head height below the neutral chin (into the collar)
fails = 0


def chin(a):
    w = a.shape[1]; rows = np.nonzero(a[:, int(w * 0.32): int(w * 0.68)].any(1))[0]
    return int(rows.max()) if len(rows) else a.shape[0] - 1


def mask(c, h, w, hh):
    return np.array(Image.open(f"{PUB}/tg2/vp/{c}/{h}.png").convert("RGBA").resize((w, hh)))[..., 3] > 100


for spec in [a for a in sys.argv[3:] if not a.startswith("--")]:
    c, body, heads = spec.split(":"); heads = heads.split(",")
    nx, ny, nw, nh = H[f"vp/{c}/{body}|{heads[0]}"]
    nchin = ny + chin(mask(c, heads[0], nw, nh))
    cx = nx + nw / 2
    for h in heads[1:]:
        x, y, w, hh = H[f"vp/{c}/{body}|{h}"]
        hc = chin(mask(c, h, w, hh))
        H[f"vp/{c}/{body}|{h}"] = [int(round(cx - w / 2)), int(round(nchin + nh * OVER - hc)), w, hh]
    if "--nocheck" in sys.argv: continue
    try:
        B = np.array(Image.open(f"{PUB}/tg2/vp/{c}/{body}_nohead.png").convert("RGBA"))[..., 3] > 100
    except FileNotFoundError:
        continue
    for h in heads:
        x, y, w, hh = H[f"vp/{c}/{body}|{h}"]
        A = mask(c, h, w, hh)
        comp = np.zeros((max(B.shape[0], y + hh) + 2, B.shape[1]), bool); comp[: B.shape[0]] |= B
        Y0, X0, Y1, X1 = max(0, y), max(0, x), y + hh, min(B.shape[1], x + w)
        comp[Y0:Y1, X0:X1] |= A[Y0 - y:, X0 - x: X1 - x][: Y1 - Y0]
        c0, c1 = int(cx - nw * 0.18), int(cx + nw * 0.18)
        r0 = y + chin(A) - 4
        below = np.nonzero(B[r0:, c0:c1].any(1))[0]
        top = r0 + (below[0] if len(below) else 0)
        gap = int((~comp[r0: top + 1, c0:c1].any(1)).sum())
        if gap:
            fails += 1; print(f"{c:24} {h:9} FAIL neck gap rows={gap}")
    print(f"{c:24} attached")
json.dump(H, open(HJ, "w"), indent=0)
print("FAILS", fails)
sys.exit(1 if fails else 0)
