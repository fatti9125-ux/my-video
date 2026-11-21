"""Auto-rig stick-limb pose sprites: split each drawing into a body layer + swinging limb layers.

Usage: python3 -I autorig_sticks.py <public_root> <sprites_glob_dir> <out_json>
  e.g.  python3 -I autorig_sticks.py public tg2/Poses src/Thanksgiving3/rig.json

Stick limbs are thin strokes (6-8 px at 512 px); bodies, heads and props are filled shapes.
A morphological opening (erode then dilate, 11 px) keeps the filled shapes and removes the
strokes. Each remaining stroke component is a limb:
  - leg  : touches the body once, at the coat/dress hem, and reaches the ground
  - arm  : touches the body once, above the hem
  - fixed: touches the body twice or more (hand on hip, hand holding a prop) -> left in the body
Free limbs are written as separate cropped PNGs with a pivot = where the stroke meets the body,
so the renderer can rotate them about that joint: they can never detach (ATTACHMENT RULE).
Output JSON per sprite key: {"body": {file,x,y,w,h}, "limbs": [{kind, side, file, x,y,w,h, pivot:[x,y], len}]}.
"""
import json, os, sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

root, subdir, out_json = sys.argv[1], sys.argv[2], sys.argv[3]
OUT_DIR = os.path.join(root, subdir.split("/")[0], "rig")
# RIG_SCALE: sprite size relative to the 512-px pack (e.g. 3 for the 3x-upscaled VP sheets); scales every filter/threshold
K = float(os.environ.get("RIG_SCALE", "1"))
odd = lambda v: int(round(v * K)) | 1


def mask_img(m):
    return Image.fromarray((m * 255).astype(np.uint8))


def label(mask):
    H, W = mask.shape
    lab = np.zeros((H, W), np.int32); n = 0
    ys, xs = np.nonzero(mask)
    for y0, x0 in zip(ys, xs):
        if lab[y0, x0]: continue
        n += 1; lab[y0, x0] = n; q = deque([(y0, x0)])
        while q:
            y, x = q.popleft()
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not lab[ny, nx]:
                        lab[ny, nx] = n; q.append((ny, nx))
    return lab, n


def save_crop(rgba, m, path):
    ys, xs = np.nonzero(m)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    out = np.zeros((y1 - y0, x1 - x0, 4), np.uint8)
    sub = rgba[y0:y1, x0:x1].copy()
    sub[..., 3] = np.where(m[y0:y1, x0:x1], sub[..., 3], 0)
    out[:] = sub
    os.makedirs(os.path.dirname(path), exist_ok=True)
    Image.fromarray(out).save(path, optimize=True)
    return int(x0), int(y0), int(x1 - x0), int(y1 - y0)


def rig(path, key):
    rgba = np.asarray(Image.open(path).convert("RGBA")).copy()
    A = rgba[..., 3] > 100
    core = np.asarray(mask_img(A).filter(ImageFilter.MinFilter(odd(11))).filter(ImageFilter.MaxFilter(odd(11)))) > 0
    core &= A
    near_core = np.asarray(mask_img(core).filter(ImageFilter.MaxFilter(odd(5)))) > 0
    thin = A & ~(np.asarray(mask_img(core).filter(ImageFilter.MaxFilter(odd(3)))) > 0)
    lab, n = label(thin)
    ground = np.nonzero(A.any(1))[0].max()
    # hem: lowest row where the core is wider than 40 px (coat / dress bottom)
    widths = core.sum(1)
    rows = np.nonzero(widths > 40 * K)[0]
    hem = rows.max() if len(rows) else ground
    cx = np.nonzero(core.any(0))[0].mean() if core.any() else np.nonzero(A.any(0))[0].mean()
    leg_cx = np.nonzero(core[max(0, hem - int(20 * K)):hem + 1].any(0))[0].mean() if core[max(0, hem - int(20 * K)):hem + 1].any() else cx
    limbs = []; body = A.copy()
    for k in range(1, n + 1):
        m = lab == k
        cnt = m.sum()
        ys, xs = np.nonzero(m)
        if cnt < 70 * K * K or max(np.ptp(ys), np.ptp(xs)) < 28 * K: continue
        # attachment: stroke pixels next to the body; cluster them
        att = m & (np.asarray(mask_img(core).filter(ImageFilter.MaxFilter(odd(7)))) > 0)
        alab, an = label(att)
        clusters = [np.argwhere(alab == i) for i in range(1, an + 1)]
        clusters = [c for c in clusters if len(c) >= 3 * K]
        if len(clusters) != 1:
            continue  # fixed limb (two contacts: prop in hand / hand on hip) -> stays in body
        py, px = clusters[0].mean(0)
        reaches_ground = ys.max() >= ground - 6 * K
        kind = "leg" if (py >= hem - 12 * K and reaches_ground) else "arm"
        side = "L" if px < (leg_cx if kind == "leg" else cx) else "R"
        far = np.argmax((ys - py) ** 2 + (xs - px) ** 2)
        length = float(np.hypot(ys[far] - py, xs[far] - px))
        name = f"{kind}{side}{len([l for l in limbs if l['kind']==kind and l['side']==side]) or ''}"
        rel = f"{subdir.split('/')[0]}/rig/{key}/{name}.png"
        x, y, w, h = save_crop(rgba, m, os.path.join(root, rel))
        limbs.append({"kind": kind, "side": side, "file": rel, "x": x, "y": y, "w": w, "h": h,
                      "pivot": [round(float(px), 1), round(float(py), 1)], "len": round(length, 1)})
        body &= ~m
    rel = f"{subdir.split('/')[0]}/rig/{key}/body.png"
    x, y, w, h = save_crop(rgba, body, os.path.join(root, rel))
    return {"body": {"file": rel, "x": x, "y": y, "w": w, "h": h}, "limbs": limbs, "ground": int(ground), "hem": int(hem)}


if __name__ == "__main__":
    base = os.path.join(root, subdir)
    only = set(sys.argv[4].split(",")) if len(sys.argv) > 4 else None
    res = {}
    for ch in sorted(os.listdir(base)):
        if only and ch not in only: continue
        for f in sorted(os.listdir(os.path.join(base, ch))):
            if not f.endswith(".png") or "__" in f: continue
            key = f"{ch}/{f[:-4]}"
            res[key] = rig(os.path.join(base, ch, f), key)
            kinds = [l["kind"] + l["side"] for l in res[key]["limbs"]]
            print(f"{key:55} {' '.join(kinds)}")
    json.dump(res, open(out_json, "w"), indent=0)
