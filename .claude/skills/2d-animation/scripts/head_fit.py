# Fit expression heads onto a body pose: ink-outline template match over scale. Prints [x,y,w,h] in body sprite px.
import sys, json, numpy as np, cv2
from PIL import Image
D = "public/tg2/vp"
def ink(p):
    a = np.array(Image.open(p).convert("RGBA")).astype(np.float32)
    lum = a[..., :3].mean(2)
    m = ((lum < 90) & (a[..., 3] > 128)).astype(np.float32)
    return cv2.GaussianBlur(m, (0, 0), 3), a.shape[1], a.shape[0]
out = json.load(open(sys.argv[1])) if len(sys.argv) > 1 and sys.argv[1].endswith(".json") and __import__("os").path.exists(sys.argv[1]) else {}
for spec in sys.argv[2:]:
    key, body, heads = spec.split(":"); heads = heads.split(",")
    B, bw, bh = ink(f"{D}/{key}/{body}.png")
    top = B[: int(bh * 0.6)]
    for h in heads:
        Hm, hw, hh = ink(f"{D}/{key}/{h}.png")
        best = (-1,)
        for s in np.arange(0.70, 1.30, 0.01):
            t = cv2.resize(Hm, (int(hw * s), int(hh * s)))
            if t.shape[0] >= top.shape[0] or t.shape[1] >= top.shape[1]: continue
            r = cv2.matchTemplate(top, t, cv2.TM_CCOEFF_NORMED)
            _, v, _, loc = cv2.minMaxLoc(r)
            if v > best[0]: best = (v, s, loc)
        v, s, (x, y) = best
        out[f"vp/{key}/{body}|{h}"] = [x, y, round(hw * s), round(hh * s)]
        print(key, body, h, round(v, 3), out[f"vp/{key}/{body}|{h}"])
json.dump(out, open(sys.argv[1], "w"), indent=0)
