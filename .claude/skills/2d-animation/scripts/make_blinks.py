"""Make closed-eye (blink) variants of sprites whose eyes are open dot eyes.
Usage: python3 -I make_blinks.py <sprites_json> <public_dir> <prefix> [--check out.png]
For every sprite key starting with <prefix> (e.g. vp/john_adams/), find the eyes: a PAIR of small, round,
near-black blobs at about the same height in the top part of the drawing (head). Paint each over with the
skin colour sampled around it and draw a short closed-eye arc. Writes <file>__blink.png + meta key "<key>__blink".
Drawings with closed/squinting eyes (no dot pair found) get no blink variant.
"""
import sys, json, os, numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as nd

meta_path, pub, prefix = sys.argv[1], sys.argv[2], sys.argv[3]
check = sys.argv[sys.argv.index("--check") + 1] if "--check" in sys.argv else None
M = json.load(open(meta_path))
made, tiles = 0, []
for key in sorted(k for k in M if k.startswith(prefix) and "__" not in k and not k.endswith("_nohead")):
    path = f"{pub}/tg2/{key}.png"
    if not os.path.exists(path): continue
    im = np.array(Image.open(path).convert("RGBA"))
    H, W = im.shape[:2]
    lum = im[..., :3].mean(2)
    dark = (lum < 60) & (im[..., 3] > 200)
    lab, n = nd.label(dark)
    if n == 0: continue
    objs = nd.find_objects(lab)
    cands = []
    head_h = H if H < W * 1.3 else H * 0.45          # heads: whole image; full bodies: top 45 %
    for i, sl in enumerate(objs, 1):
        h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        area = (lab[sl] == i).sum()
        cy, cx = (sl[0].start + sl[0].stop) / 2, (sl[1].start + sl[1].stop) / 2
        if cy > head_h: continue
        size = max(h, w)
        lo, hi = (0.025, 0.14) if H < W * 1.3 else (0.012, 0.07)
        if not (H * lo < size < H * hi): continue          # dot-eye scale relative to the drawing (heads vs full bodies)
        if not (0.6 < h / max(w, 1) < 1.7): continue          # round-ish
        if area < 0.55 * h * w: continue                      # solid, not a ring or stroke
        cands.append((cx, cy, w, h, i))
    best = None
    for a in range(len(cands)):
        for b in range(a + 1, len(cands)):
            A, B = cands[a], cands[b]
            dy, dx = abs(A[1] - B[1]), abs(A[0] - B[0])
            sz = (A[2] + A[3] + B[2] + B[3]) / 4
            if dy < sz * 0.8 and sz * 1.8 < dx < sz * 9 and abs(A[2] * A[3] - B[2] * B[3]) < 0.6 * max(A[2] * A[3], B[2] * B[3]):
                score = dy + abs(A[2] - B[2]) * 2
                if best is None or score < best[0]: best = (score, A, B)
    if not best: continue
    # GLASSES: a dark ring (component with an enclosed hole) around either eye -> lenses; the dot detector
    # confuses rims/lens glints, so never fake a blink on glasses-wearers (it drew wrong eyes on Truman/TR).
    holes = nd.binary_fill_holes(dark) & ~dark
    ringed = False
    for (cx, cy, w, h, i) in best[1:]:
        r = int(max(w, h) * 2.2)
        y0, y1, x0, x1 = int(max(0, cy - r)), int(min(H, cy + r)), int(max(0, cx - r)), int(min(W, cx + r))
        if holes[y0:y1, x0:x1].sum() > (w * h) * 1.5: ringed = True
    if ringed: continue
    out = im.copy()
    img = Image.fromarray(out); d = ImageDraw.Draw(img)
    for (cx, cy, w, h, i) in best[1:]:
        m = nd.binary_dilation(lab == i, iterations=max(2, int(min(w, h) * 0.18)))
        ring = nd.binary_dilation(m, iterations=4) & ~m & (im[..., 3] > 200) & (lum > 120)
        skin = np.median(im[ring][:, :3], axis=0).astype(int) if ring.any() else np.array([250, 214, 186])
        arr = np.array(img); arr[m, :3] = skin; img = Image.fromarray(arr); d = ImageDraw.Draw(img)
        r = max(w, h) * 0.75; lw = max(3, int(h * 0.32))
        d.arc([cx - r, cy - r * 0.55, cx + r, cy + r * 0.75], 15, 165, fill=(20, 16, 12, 255), width=lw)
    img.save(path.replace(".png", "__blink.png"), optimize=True)
    M[key + "__blink"] = M[key]
    made += 1
    if check and len(tiles) < 40:
        a = Image.open(path).convert("RGBA"); b = img
        t = Image.new("RGBA", (a.width * 2, a.height), (150, 200, 150, 255)); t.alpha_composite(a, (0, 0)); t.alpha_composite(b, (a.width, 0))
        t.thumbnail((360, 220)); tiles.append(t)
json.dump(M, open(meta_path, "w"), separators=(",", ":"))
print("blink variants:", made)
if check and tiles:
    cols = 5; rows = -(-len(tiles) // cols)
    sheet = Image.new("RGB", (cols * 360, rows * 220), (90, 90, 90))
    for k, t in enumerate(tiles): sheet.paste(t, ((k % cols) * 360, (k // cols) * 220), t)
    sheet.save(check)
