"""FACE SWAP (not head swap): bake every expression into a full-body image whose head is the sheet's OWN
drawing. The head outline, hair, ears, glasses, beard and the neck join come from the body PNG exactly as
drawn on the sheet; only the facial FEATURES (brows, eyes, nose, mouth, cheek lines) are taken from the
expression head. Nothing is placed on top of the body at render time, so a head can never float, double or
separate (user rule: "perfectly attached, like in the pngs and sheets"), and expressions are not lost.

Usage: python3 -I face_swap.py <vp_heads.json (head_fit)> <vp_rig.json> <public_dir> <out faces.json> <char>:<body>:<neutral,h1,...> [...]
For char c and each head h it writes
  public/tg2/vp/<c>/<body>_f<h>.png (+ __blink)       full sprite with that face
  public/tg2/rig/vp_<c>/<body>/body_f<h>.png (+ __blink)   the rigged body layer with that face
and faces.json {c: {h: {sprite, rig, ...}, "_rect": [x, y, w, h] of the head on the body}}.

How:
  1. FIT the neutral head to the body by its FEATURES (blurred ink of eyes/brows/nose/mouth, scale search):
     the features are what must coincide.
  2. FIT every expression head to the neutral head by SILHOUETTE (same hair/head shape), scale 0.92-1.08.
  3. Body face = the head's skin area (+ lens interiors for glasses), holes filled. Fill it with skin (this
     removes the neutral features), remove a neutral mouth drawn inside a beard, then paste the expression's
     features: (a) non-skin ink enclosed by skin and not connected to the expression head's outline/hair,
     (b) black blobs in the central face zone (mouth inside a beard / under a moustache).
Check: everything outside the head's inner area is pixel-identical to the sheet PNG (prints BAD if not).
"""
import sys, json, os, numpy as np, cv2
from PIL import Image
from scipy import ndimage as nd

INITJ, RJ, PUB, OUT = sys.argv[1:5]
INIT = json.load(open(INITJ)); R = json.load(open(RJ))
faces = json.load(open(OUT)) if os.path.exists(OUT) else {}
bad = 0


def rgba(p): return np.array(Image.open(p).convert("RGBA"))


def skin_of(img, m):
    px = img[m & (img[..., :3].astype(int).sum(2) > 450)]
    return np.median(px[:, :3], axis=0) if len(px) else np.array([250, 214, 186.0])


def features(E, k):
    """feature mask of a head image E (RGBA): enclosed non-skin ink + black blobs in the central zone"""
    sil = nd.binary_fill_holes(E[..., 3] > 100)
    rgb = E[..., :3].astype(int)
    eskin = skin_of(E, sil)
    nonskin = sil & (np.abs(rgb - eskin.astype(int)).sum(2) >= 75)
    ring = sil & ~nd.binary_erosion(sil, iterations=max(3, k // 2))
    fl, fn = nd.label(nonskin, structure=np.ones((3, 3)))
    touch = set(np.unique(fl[ring])) - {0}
    a = np.isin(fl, [i for i in range(1, fn + 1) if i not in touch])
    black = sil & (rgb.sum(2) < 130)
    bl, bn = nd.label(black, structure=np.ones((3, 3)))
    btouch = set(np.unique(bl[ring])) - {0}
    h, w = sil.shape
    zone = np.zeros_like(sil); zone[int(h * 0.25): int(h * 0.98), int(w * 0.18): int(w * 0.82)] = True
    sizes = nd.sum(black, bl, range(1, bn + 1)) if bn else []
    keep = [i for i in range(1, bn + 1) if i not in btouch and sizes[i - 1] < 0.08 * sil.sum() and (zone & (bl == i)).sum() > 0.9 * sizes[i - 1]]
    b = nd.binary_fill_holes(np.isin(bl, keep))
    return nd.binary_dilation(nd.binary_fill_holes(a) | b, iterations=2) & sil, sil


def blur(m, s=4): return cv2.GaussianBlur(m.astype(np.float32), (0, 0), s)


for spec in sys.argv[5:]:
    c, body, heads = spec.split(":"); heads = heads.split(",")
    B = rgba(f"{PUB}/tg2/vp/{c}/{body}.png")
    N = rgba(f"{PUB}/tg2/vp/{c}/{heads[0]}.png")
    k0 = max(6, int(N.shape[0] * 0.035))
    Nf, Nsil = features(N, k0)
    # 1. neutral head -> body: start from the whole-ink fit (head_fit.py -> vp_heads.json), then REFINE on the
    #    features: neutral features vs the body's own features (dark ink inside the head, away from its outline)
    ix0, iy0, iw0, ih0 = INIT[f"vp/{c}/{body}|{heads[0]}"]
    s0 = iw0 / N.shape[1]
    sil0 = np.zeros(B.shape[:2], bool)
    m0 = np.array(Image.fromarray((Nsil * 255).astype(np.uint8)).resize((iw0, ih0))) > 127
    Y0, X0 = max(0, iy0), max(0, ix0); Y1, X1 = min(B.shape[0], iy0 + ih0), min(B.shape[1], ix0 + iw0)
    sil0[Y0:Y1, X0:X1] = m0[Y0 - iy0:Y1 - iy0, X0 - ix0:X1 - ix0]
    in0 = nd.binary_erosion(sil0, iterations=max(6, int(ih0 * 0.05))) & (B[..., 3] > 200)
    bskin = skin_of(B, in0)
    bdark = in0 & (np.abs(B[..., :3].astype(int) - bskin.astype(int)).sum(2) >= 75)
    ring0 = in0 & ~nd.binary_erosion(in0, iterations=4)
    dl, dn = nd.label(bdark, structure=np.ones((3, 3)))
    dt = set(np.unique(dl[ring0])) - {0}
    bfeat = np.isin(dl, [i for i in range(1, dn + 1) if i not in dt])
    img = blur(bfeat, 3)
    best = (-1, s0, (ix0, iy0))
    mx = int(iw0 * 0.14)
    for s in np.arange(s0 * 0.93, s0 * 1.075, s0 * 0.01):
        t = cv2.resize(blur(Nf, 3 / s), (int(N.shape[1] * s), int(N.shape[0] * s)))
        x0, y0 = ix0 - mx, iy0 - mx
        canvas = np.zeros((t.shape[0] + 2 * mx, t.shape[1] + 2 * mx), np.float32)
        ys0, xs0 = max(0, y0), max(0, x0); ys1, xs1 = min(B.shape[0], y0 + canvas.shape[0]), min(B.shape[1], x0 + canvas.shape[1])
        canvas[ys0 - y0: ys1 - y0, xs0 - x0: xs1 - x0] = img[ys0:ys1, xs0:xs1]
        r = cv2.matchTemplate(canvas, t, cv2.TM_CCOEFF_NORMED); _, v, _, loc = cv2.minMaxLoc(r)
        if v > best[0]: best = (v, s, (x0 + loc[0], y0 + loc[1]))
    score, sN, (nx, ny) = best
    if score < 0.25: score, sN, (nx, ny) = score, s0, (ix0, iy0)          # no clear feature match: keep the ink fit
    nw, nh = int(round(N.shape[1] * sN)), int(round(N.shape[0] * sN))
    k = max(6, int(nh * 0.035))

    def put(dst, m, x, y):
        Y0, X0 = max(0, y), max(0, x); Y1, X1 = min(dst.shape[0], y + m.shape[0]), min(dst.shape[1], x + m.shape[1])
        if Y1 > Y0 and X1 > X0: dst[Y0:Y1, X0:X1] |= m[Y0 - y:Y1 - y, X0 - x:X1 - x]

    def scaled(m, w, h): return np.array(Image.fromarray((m * 255).astype(np.uint8)).resize((w, h), Image.BILINEAR)) > 127

    inner = np.zeros(B.shape[:2], bool); put(inner, nd.binary_erosion(scaled(Nsil, nw, nh), iterations=k), nx, ny)
    inner &= B[..., 3] > 200
    skin0 = skin_of(B, inner)
    near = (np.abs(B[..., :3].astype(int) - skin0.astype(int)).sum(2) < 75) & inner
    lab, n = nd.label(near)
    face = np.zeros_like(near)
    if n:
        sz = nd.sum(near, lab, range(1, n + 1)); big = int(np.argmax(sz)) + 1
        face = lab == big
        cms = nd.center_of_mass(near, lab, range(1, n + 1))
        for i in range(1, n + 1):          # glasses: skin inside the lenses belongs to the face too
            if i == big: continue
            cy, cx = cms[i - 1]; fr = sz[i - 1] / float(nw * nh)
            if 0.003 < fr < 0.06 and nx + nw * 0.15 < cx < nx + nw * 0.85 and ny + nh * 0.25 < cy < ny + nh * 0.7:
                face |= lab == i
    face = nd.binary_fill_holes(face) & inner
    zone = np.zeros_like(face); zone[int(ny + nh * 0.25): int(ny + nh * 0.98), int(nx + nw * 0.18): int(nx + nw * 0.82)] = True
    # base body with the neutral features removed
    # erase ONLY the neutral features (enclosed non-skin ink not joined to the outline/hair/glasses); every other
    # pixel of the sheet's head stays untouched. Erased pixels take the nearest untouched colour.
    Base = B.copy()
    ringF = inner & ~nd.binary_erosion(inner, iterations=max(3, k // 2))
    nsk = inner & (np.abs(B[..., :3].astype(int) - skin0.astype(int)).sum(2) >= 75)
    nl, nn = nd.label(nsk, structure=np.ones((3, 3)))
    nt = set(np.unique(nl[ringF])) - {0}
    old = np.isin(nl, [i for i in range(1, nn + 1) if i not in nt]) & face
    old = nd.binary_dilation(nd.binary_fill_holes(old), iterations=4) & inner
    keepc = inner & ~old & ~nsk
    if old.any() and keepc.any():
        _, (iy, ix) = nd.distance_transform_edt(~keepc, return_indices=True)
        Base[old, :3] = B[iy[old], ix[old], :3]
    ringB = inner & ~nd.binary_erosion(inner, iterations=max(3, k // 2))
    allblack = inner & (B[..., :3].astype(int).sum(2) < 130)
    al, an = nd.label(allblack, structure=np.ones((3, 3)))
    edge_ids = set(np.unique(al[ringB])) - {0}
    mouth = np.zeros_like(face)                                  # neutral mouth drawn inside a beard
    for i in range(1, an + 1):
        comp = al == i
        if i in edge_ids or comp.sum() > 0.05 * inner.sum(): continue
        if (comp & zone & ~face).sum() > 0.9 * comp.sum(): mouth |= comp
    if mouth.any():
        mouth = nd.binary_dilation(nd.binary_fill_holes(mouth), iterations=3) & inner & ~face
        ok = inner & ~mouth & ~face & (B[..., :3].astype(int).sum(2) >= 130)
        if ok.any():
            _, (iy, ix) = nd.distance_transform_edt(~ok, return_indices=True)
            Base[mouth, :3] = B[iy[mouth], ix[mouth], :3]
    allow = (face | (inner & zone))
    rig = R.get(f"vp_{c}/{body}")
    rb = rgba(f"{PUB}/{rig['body']['file']}") if rig else None
    faces[c] = {"_rect": [int(nx), int(ny), int(nw), int(nh)], "_fit": round(float(score), 3)}
    Ne = blur(cv2.Canny((Nsil * 255).astype(np.uint8), 50, 150) > 0, 3)
    for h in heads:
        entry = {}
        for blink in ("", "__blink"):
            hp = f"{PUB}/tg2/vp/{c}/{h}{blink}.png"
            if not os.path.exists(hp): continue
            E = rgba(hp)
            Ef, Esil = features(E, k0)
            # 2. expression head -> neutral head, by silhouette
            pad = 60
            canvas = np.zeros((N.shape[0] + 2 * pad, N.shape[1] + 2 * pad), np.float32); canvas[pad:-pad, pad:-pad] = Ne
            bst = (-1, 1.0, (pad, pad))
            Ee0 = (cv2.Canny((Esil * 255).astype(np.uint8), 50, 150) > 0)
            for r_ in np.arange(0.92, 1.085, 0.01):
                t = cv2.resize(blur(Ee0, 3), (int(E.shape[1] * r_), int(E.shape[0] * r_)))
                if t.shape[0] > canvas.shape[0] or t.shape[1] > canvas.shape[1]: continue
                res = cv2.matchTemplate(canvas, t, cv2.TM_CCOEFF_NORMED); _, v, _, loc = cv2.minMaxLoc(res)
                if v > bst[0]: bst = (v, r_, loc)
            _, r_, (lx, ly) = bst
            w, hh = int(round(E.shape[1] * r_ * sN)), int(round(E.shape[0] * r_ * sN))
            ex, ey = int(round(nx + (lx - pad) * sN)), int(round(ny + (ly - pad) * sN))
            Es = np.array(Image.fromarray(E).resize((w, hh), Image.LANCZOS))
            fm = scaled(Ef, w, hh)
            mask = np.zeros(B.shape[:2], bool); put(mask, fm, ex, ey); mask &= allow
            Efull = np.zeros_like(B)
            Y0, X0 = max(0, ey), max(0, ex); Y1, X1 = min(B.shape[0], ey + hh), min(B.shape[1], ex + w)
            if Y1 > Y0 and X1 > X0: Efull[Y0:Y1, X0:X1] = Es[Y0 - ey:Y1 - ey, X0 - ex:X1 - ex]
            Bo = Base.copy(); Bo[mask, :3] = Efull[mask, :3]
            name = f"{body}_f{h}{blink}"
            Image.fromarray(Bo).save(f"{PUB}/tg2/vp/{c}/{name}.png", optimize=True)
            diff = np.abs(Bo.astype(int) - B.astype(int)).max(2); diff[inner] = 0
            if diff.max() > 0: bad += 1; print(f"{c} {h}{blink}: changed outside the head interior! {diff.max()}")
            entry["sprite" + blink] = f"tg2/vp/{c}/{name}.png"
            if rb is not None:
                ox, oy = rig["body"]["x"], rig["body"]["y"]
                Ro = rb.copy()
                sub = lambda a: a[oy: oy + rb.shape[0], ox: ox + rb.shape[1]]
                ch = sub(inner) & (Ro[..., 3] > 200)
                Ro[ch, :3] = sub(Bo)[ch, :3]
                rn = rig["body"]["file"].replace("body.png", f"body_f{h}{blink}.png")
                Image.fromarray(Ro).save(f"{PUB}/{rn}", optimize=True)
                entry["rig" + blink] = rn
        faces[c][h] = entry
    print(f"{c:24} faces {len(heads)} feature-fit {score:.2f} scale {sN:.2f}")
json.dump(faces, open(OUT, "w"), indent=0)
print("BAD", bad)
sys.exit(1 if bad else 0)
