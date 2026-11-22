"""Make HEADLESS bodies for expression-head swaps, with NO leftover outline of the body's own head.

Usage: python3 -I head_less.py <heads_json> <sprites_json> <rig_json> <public_dir> <char>:<body>:<h0,h1,...> [...]

Why: a swapped head is never pixel-identical to the head drawn on the body (each expression head is drawn a
little differently, and the head bobs/tilts while acting). Erasing only the neutral head's silhouette left
slivers of the old outline (arcs beside the ears / over the hair / at the jaw) = "double outlines".
Rule used here:
  1. erase EVERY body pixel above the chin cut (head top .. head_y + 0.80 * head_h), full width;
  2. below that, down to the chin + margin, erase the UNION of all the character's expression heads
     (each at its fitted rect), dilated by ~3 % of the head height;
  3. do the same for the rigged body layer (rig.json bodyNoHead) so rigs match sprites.
Then `check`: compose every head on the headless body and verify no body ink remains outside the head
silhouette within the head band (prints FAIL with a pixel count).
"""
import sys, json, numpy as np
from PIL import Image
from scipy import ndimage as nd

HJ, SJ, RJ, PUB = sys.argv[1:5]
H = json.load(open(HJ)); M = json.load(open(SJ)); R = json.load(open(RJ))


def head_union(c, body, heads, shape, off=(0, 0)):
    """Union mask of all fitted heads in body (or rig-body) pixel space."""
    m = np.zeros(shape, bool)
    for h in heads:
        x, y, w, hh = H[f"vp/{c}/{body}|{h}"]
        a = np.array(Image.open(f"{PUB}/tg2/vp/{c}/{h}.png").convert("RGBA").resize((w, hh)))[..., 3] > 20
        x -= off[0]; y -= off[1]
        ys, xs = slice(max(0, y), min(shape[0], y + hh)), slice(max(0, x), min(shape[1], x + w))
        m[ys, xs] |= a[ys.start - y: ys.stop - y, xs.start - x: xs.stop - x]
    return m


def strip(img, c, body, heads, off=(0, 0)):
    b = np.array(img.convert("RGBA"))
    x, y, w, hh = H[f"vp/{c}/{body}|{heads[0]}"]
    y -= off[1]
    u = head_union(c, body, heads, b.shape[:2], off)
    u = nd.binary_dilation(u, iterations=max(4, int(hh * 0.03)))
    cut = int(y + hh * 0.80)
    b[: max(0, cut), :, 3] = 0                       # 1. everything above the chin cut
    low = np.zeros_like(u); low[max(0, cut): int(y + hh * 1.02)] = True
    b[..., 3][u & low] = 0                           # 2. union of heads around the chin
    return Image.fromarray(b), u, cut


fails = 0
for spec in sys.argv[5:]:
    c, body, heads = spec.split(":"); heads = heads.split(",")
    src = f"{PUB}/tg2/vp/{c}/{body}.png"
    out, u, cut = strip(Image.open(src), c, body, heads)
    out.save(src.replace(".png", "_nohead.png"), optimize=True)
    M[f"vp/{c}/{body}_nohead"] = M[f"vp/{c}/{body}"]
    rk = f"vp_{c}/0"
    if body == "0" and rk in R:
        r = R[rk]; bf = f"{PUB}/{r['body']['file']}"
        ro, _, _ = strip(Image.open(bf), c, body, heads, off=(r["body"]["x"], r["body"]["y"]))
        ro.save(bf.replace("body.png", "body_nohead.png"), optimize=True)
        r["bodyNoHead"] = r["body"]["file"].replace("body.png", "body_nohead.png")
    # check: no remaining body ink in the head band outside the (undilated) union of heads
    b = np.array(out)[..., 3] > 60
    raw = head_union(c, body, heads, b.shape)
    x, y, w, hh = H[f"vp/{c}/{body}|{heads[0]}"]
    band = np.zeros_like(b); band[max(0, y - 10): int(y + hh * 0.80)] = True
    left = int((b & band & ~raw).sum())
    status = "OK" if left == 0 else "FAIL"
    fails += status == "FAIL"
    print(f"{c:24} {status} leftover={left}")
json.dump(M, open(SJ, "w"), separators=(",", ":"))
json.dump(R, open(RJ, "w"), indent=0)
sys.exit(1 if fails else 0)
