"""Cut a character/model sheet (white background) into transparent PNG parts for rigging.

Step 1 – detect:  python3 -I extract_parts.py detect <sheet.png|webp> <out_dir> [--min 900]
    Finds every separate drawing (connected non-white blob, merged when close),
    writes out_dir/_boxes.png (numbered overlay) and out_dir/_boxes.json.
    Look at _boxes.png, then name the parts you need.

Step 2 – cut:     python3 -I extract_parts.py cut <sheet> <out_dir> <parts.json>
    parts.json = {"head_neutral": [x, y, w, h], "torso_front": 12, ...}
    (a box, or a blob number from _boxes.json). Each part is cropped, the white
    background connected to the crop edge becomes transparent (interior whites such
    as shirt collars, eyes and paper stay opaque), edges are anti-aliased, and it is
    saved as out_dir/<name>.png. Labels under drawings are excluded if you box tightly.
"""
import json, sys
from collections import deque
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

WHITE = 232  # luminance above this (and low saturation) counts as paper


def load(path):
    """RGBA image. Sheets exported with transparency keep it; flat sheets get alpha=255."""
    return Image.open(path).convert("RGBA")


def paper_mask(a):
    """True where background: transparent pixels, or near-white low-saturation paper."""
    if (a[..., 3] < 250).mean() > 0.05:  # sheet already has a transparent background
        return a[..., 3] < 40
    a = a[..., :3]
    lum = a.mean(axis=2)
    sat = a.max(axis=2) - a.min(axis=2)
    return (lum > WHITE) & (sat < 28)


def detect(sheet, out, min_area=900, gap=6):
    img = load(sheet); a = np.asarray(img).astype(np.int16)
    ink = ~paper_mask(a)
    # dilate so strokes of one drawing (and hand/limb gaps) merge into one blob
    m = Image.fromarray((ink * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(gap * 2 + 1))
    ink_d = np.asarray(m) > 0
    h, w = ink_d.shape
    seen = np.zeros_like(ink_d); boxes = []
    for y0 in range(0, h, 2):
        for x0 in range(0, w, 2):
            if not ink_d[y0, x0] or seen[y0, x0]:
                continue
            q = deque([(y0, x0)]); seen[y0, x0] = True
            xs = [x0, x0]; ys = [y0, y0]; n = 0
            while q:
                y, x = q.popleft(); n += 1
                xs[0] = min(xs[0], x); xs[1] = max(xs[1], x); ys[0] = min(ys[0], y); ys[1] = max(ys[1], y)
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and ink_d[ny, nx] and not seen[ny, nx]:
                        seen[ny, nx] = True; q.append((ny, nx))
            if n >= min_area:
                boxes.append([xs[0], ys[0], xs[1] - xs[0] + 1, ys[1] - ys[0] + 1])
    boxes.sort(key=lambda b: (b[1] // 120, b[0]))
    ov = Image.new("RGB", img.size, "white"); ov.paste(img, mask=img.split()[3]); d = ImageDraw.Draw(ov)
    for i, (x, y, bw, bh) in enumerate(boxes):
        d.rectangle([x, y, x + bw, y + bh], outline=(255, 0, 80), width=2)
        d.rectangle([x, y, x + 30, y + 18], fill=(255, 0, 80)); d.text((x + 3, y + 3), str(i), fill="white")
    ov.save(f"{out}/_boxes.png")
    json.dump(boxes, open(f"{out}/_boxes.json", "w"))
    print(f"{len(boxes)} blobs -> {out}/_boxes.png")


def cut_one(img, box, pad=4):
    x, y, w, h = box
    x0, y0 = max(0, x - pad), max(0, y - pad)
    crop = img.crop((x0, y0, min(img.width, x + w + pad), min(img.height, y + h + pad)))
    a = np.asarray(crop).astype(np.int16); paper = paper_mask(a)
    H, W = paper.shape; bg = np.zeros_like(paper); q = deque()
    for yy in range(H):
        for xx in (0, W - 1):
            if paper[yy, xx] and not bg[yy, xx]: bg[yy, xx] = True; q.append((yy, xx))
    for xx in range(W):
        for yy in (0, H - 1):
            if paper[yy, xx] and not bg[yy, xx]: bg[yy, xx] = True; q.append((yy, xx))
    while q:
        yy, xx = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = yy + dy, xx + dx
            if 0 <= ny < H and 0 <= nx < W and paper[ny, nx] and not bg[ny, nx]:
                bg[ny, nx] = True; q.append((ny, nx))
    fg = ~bg
    fg &= ~_label_mask(fg)
    alpha = Image.fromarray((fg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))
    alpha = Image.fromarray(np.minimum(np.asarray(alpha), np.asarray(crop.split()[3])))
    out = crop.copy(); out.putalpha(alpha)
    return out.crop(out.getbbox() or (0, 0, W, H))


def _label_mask(fg, max_text_h=34, min_gap=2):
    """Mask of caption lines under the drawing: short bottom bands of rows separated
    from the content above by empty rows. Stripped repeatedly (multi-line labels)."""
    drop = np.zeros_like(fg)
    rows = fg.any(axis=1).copy()
    while True:
        ys = np.nonzero(rows)[0]
        if len(ys) == 0:
            break
        bottom = ys[-1]; y = bottom
        while y >= 0 and rows[y]:
            y -= 1
        band_top = y + 1
        gap = 0
        while y >= 0 and not rows[y]:
            gap += 1; y -= 1
        has_above = y >= 0
        if not has_above or gap < min_gap or bottom - band_top + 1 > max_text_h:
            break
        drop[band_top:bottom + 1] = fg[band_top:bottom + 1]
        rows[band_top:bottom + 1] = False
    return drop


def cut(sheet, out, parts_json):
    img = load(sheet); parts = json.load(open(parts_json))
    boxes = None
    for name, spec in parts.items():
        if isinstance(spec, int):
            boxes = boxes or json.load(open(f"{out}/_boxes.json")); spec = boxes[spec]
        p = cut_one(img, spec); p.save(f"{out}/{name}.png")
        print(f"{name}: {p.width}x{p.height}")


if __name__ == "__main__":
    mode, sheet, out = sys.argv[1], sys.argv[2], sys.argv[3]
    if mode == "detect":
        mn = int(sys.argv[sys.argv.index("--min") + 1]) if "--min" in sys.argv else 900
        detect(sheet, out, mn)
    else:
        cut(sheet, out, sys.argv[4])
