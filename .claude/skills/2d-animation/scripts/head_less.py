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


def strip(img, c, body, heads, off=(0, 0), pivots=()):
    b = np.array(img.convert("RGBA"))
    x, y, w, hh = H[f"vp/{c}/{body}|{heads[0]}"]
    y -= off[1]
    u = head_union(c, body, heads, b.shape[:2], off)
    u = nd.binary_dilation(u, iterations=max(4, int(hh * 0.03)))
    cut = int(y + hh * 0.80)
    orig = b[..., 3] > 100
    base = np.array(img.convert("RGBA"))
    # neutral head chin row (the drawing's own chin): the collar BELOW it is never erased
    na = np.array(Image.open(f"{PUB}/tg2/vp/{c}/{heads[0]}.png").convert("RGBA").resize((w, hh)))[..., 3] > 100
    rows = np.nonzero(na[:, int(w * 0.32): int(w * 0.68)].any(1))[0]
    nchin = y + (int(rows.max()) if len(rows) else hh)
    ux = np.nonzero(u.any(0))[0]
    c0, c1 = (max(0, ux.min() - 6), ux.max() + 7) if len(ux) else (0, b.shape[1])
    b[: max(0, cut), c0:c1, 3] = 0                   # 1. above the chin cut, within the heads' columns only
    low = np.zeros_like(u); low[max(0, cut): max(0, nchin - 2)] = True
    b[..., 3][u & low] = 0                           # 2. union of heads between chin cut and the neutral chin
    # 3. no floating fragments (bits of old hair / outline no longer joined to the body)
    m = b[..., 3] > 60
    lab, n = nd.label(m, structure=np.ones((3, 3)))
    if n > 1:
        sizes = nd.sum(m, lab, range(1, n + 1)); main = int(np.argmax(sizes)) + 1
        for i in range(1, n + 1):
            if i != main and sizes[i - 1] < 0.02 * sizes[main - 1]: b[..., 3][lab == i] = 0
    # 4. limb joints (shoulders / hips) keep their original pixels so limbs stay attached
    yy, xx = np.ogrid[: b.shape[0], : b.shape[1]]
    for (px, py) in pivots:
        disk = (xx - (px - off[0])) ** 2 + (yy - (py - off[1])) ** 2 <= 22 ** 2
        b[disk & orig] = base[disk & orig]
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
        ro, _, _ = strip(Image.open(bf), c, body, heads, off=(r["body"]["x"], r["body"]["y"]), pivots=[tuple(l["pivot"]) for l in r["limbs"]])
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
