"""Import a pose-swap character pack (Poses / Head_Swaps / Reusable_Bodies / Tags) into public/<dir> and build metadata.

Usage: python3 -I import_pose_pack.py <unzipped_pack> public/tg2 src/<Project>

- copies Poses / Head_Swaps / Reusable_Bodies / Tags (512x512 transparent sprites)
- sprites.json: { "<folder>/<name>": [x0, y0, x1, y1] } content bbox per sprite (for feet registration)
- Quill beak swaps: for each talking pose writes <pose>__open.png and <pose>__closed.png
  (the drawn beak is replaced by the closed / open beak taken from the reference poses)
- boards.json: dark chalkboard rectangle inside the two scoreboard poses (for overlay text)
"""
import json, os, shutil, sys
import numpy as np
from PIL import Image, ImageFilter

Z, OUT, SRC = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(OUT, exist_ok=True)
for d in ["Poses", "Head_Swaps", "Reusable_Bodies", "Tags"]:
    shutil.copytree(os.path.join(Z, d), os.path.join(OUT, d), dirs_exist_ok=True)
shutil.copy(os.path.join(Z, "Scene_Guide.md"), os.path.join(SRC, "SCENE_GUIDE.md"))


def rgba(p):
    return np.asarray(Image.open(p).convert("RGBA")).astype(np.int16)


def beak_mask(a):
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    orange = (al > 150) & (r > 190) & (g > 110) & (g < 200) & (b < 110)
    red = (al > 150) & (r > 140) & (g < 110) & (b < 110)
    return orange, red


def region(a, y_from):
    """beak (orange + red mouth) plus its ink outline, below y_from."""
    orange, red = beak_mask(a)
    m = orange | red
    ys, xs = np.nonzero(orange)
    cx, top = xs.mean(), ys.min()
    box = np.zeros_like(m)
    box[int(top) - 6:int(ys.max()) + 14, int(cx) - 24:int(cx) + 25] = True
    m &= box
    dil = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(11))) > 0
    dil &= box
    dil[: int(y_from)] = False
    return dil, cx, top


def face_colour(a, cx, cy):
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    cream = (al > 200) & (r > 230) & (g > 205) & (b > 180) & (r - b > 15)
    ys, xs = np.nonzero(cream)
    near = (abs(xs - cx) < 40) & (abs(ys - cy) < 40)
    return np.median(a[ys[near], xs[near]], axis=0)


Q = os.path.join(OUT, "Poses", "quill")
donor_closed = rgba(os.path.join(Q, "deadpan_wings_folded.png"))
donor_open = rgba(os.path.join(Q, "speaking_facing_right.png"))


def donor_patch(d):
    orange, red = beak_mask(d)
    ys, xs = np.nonzero(orange)
    cx, top = xs.mean(), ys.min()
    m, _, _ = region(d, top + 3)          # patch only below the glasses bridge
    near = (abs(xs - cx) < 20) & (ys < top + 45)
    bot = ys[near].max()
    yy = np.arange(m.shape[0])[:, None]; xx = np.arange(m.shape[1])[None, :]
    m &= (yy <= bot + 6) & (abs(xx - cx) <= 22)
    return m, cx, top


DC = donor_patch(donor_closed)
DO = donor_patch(donor_open)


def face_area(a):
    """closed blob of the cream face disk (beak and glasses inside it), shrunk off the outline."""
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    cream = (al > 200) & (r > 225) & (g > 200) & (b > 175) & (r - b > 12)
    orange, red = beak_mask(a)
    m = Image.fromarray(((cream | orange | red) * 255).astype(np.uint8))
    m = m.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.MinFilter(15)).filter(ImageFilter.MinFilter(5))
    return np.asarray(m) > 0


def swap(target, donor, dp):
    a = target.copy()
    face = face_area(target)
    orange, _ = beak_mask(a)
    ys, xs = np.nonzero(orange)
    cx, top = xs.mean(), ys.min()
    o2, r2 = beak_mask(a)
    bys, bxs = np.nonzero((o2 | r2) & (abs(np.arange(a.shape[1])[None, :] - cx) < 20) & (np.arange(a.shape[0])[:, None] < top + 45))
    bot = bys.max()
    cover = np.zeros(a.shape[:2], bool)
    cover[int(top) + 3:int(bot) + 6, int(cx) - 22:int(cx) + 23] = True   # the beak's own box, nothing more
    cover &= face
    fc = face_colour(a, cx, top + 15)
    a[cover] = fc
    m, dcx, dtop = dp
    dy, dx = int(round(top - dtop)), int(round(cx - dcx))
    yy, xx = np.nonzero(m)
    ty, tx = yy + dy, xx + dx
    ok = (ty >= 0) & (ty < a.shape[0]) & (tx >= 0) & (tx < a.shape[1])
    ok[ok] &= face[ty[ok], tx[ok]]
    src = donor[yy[ok], xx[ok]]
    keep = src[:, 3] > 60
    a[ty[ok][keep], tx[ok][keep]] = src[keep]
    return a


talk_poses = ["speaking_facing_right", "deadpan_wings_folded", "nervous_side_glance", "scoreboard_facing_left", "pardon_plea"]
for p in talk_poses:
    t = rgba(os.path.join(Q, p + ".png"))
    native_open = p == "speaking_facing_right"  # the only pose drawn with an open beak
    o = t if native_open else swap(t, donor_open, DO)
    c = swap(t, donor_closed, DC) if native_open else t
    Image.fromarray(o.clip(0, 255).astype(np.uint8)).save(os.path.join(Q, p + "__open.png"))
    Image.fromarray(c.clip(0, 255).astype(np.uint8)).save(os.path.join(Q, p + "__closed.png"))

meta = {}
for d in ["Poses", "Head_Swaps", "Reusable_Bodies", "Tags"]:
    for root, _, files in os.walk(os.path.join(OUT, d)):
        for f in files:
            if f.endswith(".png"):
                p = os.path.join(root, f)
                key = os.path.relpath(p, OUT)[:-4]
                meta[key] = list(Image.open(p).getbbox())
json.dump(meta, open(os.path.join(SRC, "sprites.json"), "w"), indent=0)

boards = {}
for p in ["scoreboard_facing_left", "scoreboard_celebration"]:
    a = rgba(os.path.join(Q, p + ".png"))
    dark = (a[..., 3] > 200) & (a[..., :3].max(axis=2) < 70)
    # largest dark filled block = the chalkboard face (ink lines are thin, the board is solid)
    sol = np.asarray(Image.fromarray((dark * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(9))) > 0
    ys, xs = np.nonzero(sol)
    boards[p] = [int(xs.min()) - 4, int(ys.min()) - 4, int(xs.max()) + 4, int(ys.max()) + 4]
json.dump(boards, open(os.path.join(SRC, "boards.json"), "w"))
print(len(meta), "sprites;", boards)
