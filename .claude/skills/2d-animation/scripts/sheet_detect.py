# Cut every part from a VP sheet: alpha>=100 core, merge strokes within 7px, crop with soft alpha kept.
import sys, json, numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as nd
sheet, out = sys.argv[1], sys.argv[2]
im = np.array(Image.open(sheet).convert("RGBA"))
a = im[..., 3]
core = a >= 100
grow = nd.binary_dilation(core, iterations=7)
lab, n = nd.label(grow)
parts = []
for i, sl in enumerate(nd.find_objects(lab), 1):
    m = (lab[sl] == i) & core[sl]
    if m.sum() < 250: continue
    y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
    parts.append([x0, y0, x1, y1, int(m.sum())])
parts.sort(key=lambda p: (round((p[1] + p[3]) / 2 / 120), p[0]))
import os; os.makedirs(out, exist_ok=True)
vis = Image.new("RGB", (im.shape[1], im.shape[0]), (200, 225, 235))
vis.paste(Image.fromarray(im), (0, 0), Image.fromarray(im))
d = ImageDraw.Draw(vis)
f = ImageFont.load_default(size=22)
for k, (x0, y0, x1, y1, _) in enumerate(parts):
    d.rectangle([x0, y0, x1, y1], outline=(255, 0, 0), width=2)
    d.text((x0 + 2, y0 + 1), str(k), fill=(255, 0, 0), font=f, stroke_width=2, stroke_fill=(255, 255, 255))
vis.save(f"{out}/_boxes.png")
json.dump(parts, open(f"{out}/_parts.json", "w"))
print(sheet.split("/")[-2], len(parts))
