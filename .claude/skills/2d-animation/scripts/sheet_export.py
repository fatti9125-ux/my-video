import sys, json, glob, os, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
S, OUT = sys.argv[1], sys.argv[2]
meta = {}
for sheet in sorted(glob.glob(f"{S}/vp*/*/[0-9]*/character_sheet.png")):
    name = sheet.split("/")[-2]; key = name.split("_", 1)[1].lower()
    im = np.array(Image.open(sheet).convert("RGBA")).astype(np.float32)
    a = im[..., 3]; core = a >= 100
    lab, _ = nd.label(nd.binary_dilation(core, iterations=7))
    parts = json.load(open(f"{S}/vpcut/{name}/_parts.json"))
    os.makedirs(f"{OUT}/{key}", exist_ok=True)
    for k, (x0, y0, x1, y1, _) in enumerate(parts):
        p = 4; X0, Y0, X1, Y1 = max(0, x0 - p), max(0, y0 - p), min(im.shape[1], x1 + p), min(im.shape[0], y1 + p)
        ids = np.unique(lab[y0:y1, x0:x1][core[y0:y1, x0:x1]])
        m = np.isin(lab[Y0:Y1, X0:X1], ids)
        c = im[Y0:Y1, X0:X1].copy()
        al = c[..., 3] * m
        al[al < 45] = 0                                    # drop the smudge haze
        al = np.clip((al - 45) * 255 / (255 - 45), 0, 255)
        c[..., 3] = al
        img = Image.fromarray(c.astype(np.uint8))
        img = img.resize((img.width * 3, img.height * 3), Image.LANCZOS)
        r, g, b, aa = img.split()
        rgb = Image.merge("RGB", (r, g, b)).filter(ImageFilter.UnsharpMask(2, 60, 2))
        aa = aa.point(lambda v: 0 if v < 70 else min(255, int((v - 70) * 255 / 120)))  # crisp edge
        out = Image.merge("RGBA", (*rgb.split(), aa))
        bb = out.getbbox() or (0, 0, 1, 1); out = out.crop(bb)
        out.save(f"{OUT}/{key}/{k}.png", optimize=True)
        meta[f"vp/{key}/{k}"] = [0, 0, out.width, out.height, out.width, out.height]
json.dump(meta, open(f"{OUT}/../vp_sprites.json", "w"), separators=(",", ":"))
print(len(meta))
