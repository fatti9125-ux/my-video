# Split merged expression-head strips into single heads (column gaps in the opaque core); same clean/upscale as vpexport.
import sys, json, glob, numpy as np
from PIL import Image, ImageFilter
S, OUT = sys.argv[1], sys.argv[2]
meta = json.load(open(sys.argv[3]))
for name, idx in [(a.split(":")[0], int(a.split(":")[1])) for a in sys.argv[4:]]:
    key = name.split("_", 1)[1].lower()
    sheet = glob.glob(f"{S}/vp*/*/{name}/character_sheet.png")[0]
    im = np.array(Image.open(sheet).convert("RGBA")).astype(np.float32)
    x0, y0, x1, y1, _ = json.load(open(f"{S}/vpcut/{name}/_parts.json"))[idx]
    sub = im[y0:y1, x0:x1]
    col = (sub[..., 3] >= 100).sum(0)
    segs, inn = [], False
    for x, c in enumerate(col):
        if c > 0 and not inn: s0, inn = x, True
        if c == 0 and inn: segs.append((s0, x)); inn = False
    if inn: segs.append((s0, len(col)))
    segs = [s for s in segs if s[1] - s[0] > 40]
    print(name, len(segs), segs)
    for k, (a, b) in enumerate(segs):
        c = sub[:, max(0, a - 3):b + 3].copy()
        al = c[..., 3]; al[al < 45] = 0; c[..., 3] = np.clip((al - 45) * 255 / 210, 0, 255)
        img = Image.fromarray(c.astype(np.uint8)); img = img.resize((img.width * 3, img.height * 3), Image.LANCZOS)
        r, g, bb, aa = img.split()
        rgb = Image.merge("RGB", (r, g, bb)).filter(ImageFilter.UnsharpMask(2, 60, 2))
        aa = aa.point(lambda v: 0 if v < 70 else min(255, int((v - 70) * 255 / 120)))
        out = Image.merge("RGBA", (*rgb.split(), aa)); out = out.crop(out.getbbox())
        out.save(f"{OUT}/{key}/head{k}.png", optimize=True)
        meta[f"vp/{key}/head{k}"] = [0, 0, out.width, out.height, out.width, out.height]
json.dump(meta, open(sys.argv[3], "w"), separators=(",", ":"))
