"""Attachment check for a SheetPuppet rig: every body part must be attached, nothing floating.

Usage: python3 -I check_rig.py <RIG_NAME> [src/rig/characters.ts]
Reads the RigDef numbers from characters.ts and the part PNGs from public/<dir>/, then checks:
  - each shoulder joint lies INSIDE the opaque torso silhouette (>= MARGIN units in from the edge)
  - each hip joint lies inside the torso (legs start under the jacket, not below the hem)
  - the head's chin overlaps the torso top (no gap / no neck gap), and the head bottom is opaque there
  - legs reach the ground (hipY + thigh + shin ~= 0) so feet don't float or sink
  - the torso exists at the shoulder height on both sides (symmetry)
Exit code 1 on any FAIL, with a suggested fix value.
"""
import re, sys
import numpy as np
from PIL import Image

MARGIN = 4.0  # puppet units the joint must sit inside the silhouette


def num(body, key):
    m = re.search(rf"\b{key}\s*:\s*(-?[\d.]+)", body)
    return float(m.group(1)) if m else None


def pair(body, key):
    m = re.search(rf"\b{key}\s*:\s*\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]", body)
    return (float(m.group(1)), float(m.group(2))) if m else None


def main():
    name = sys.argv[1]; path = sys.argv[2] if len(sys.argv) > 2 else "src/rig/characters.ts"
    src = open(path).read()
    m = re.search(rf"export const {name}\s*:\s*RigDef\s*=\s*\{{(.*?)\n\}};", src, re.S)
    if not m:
        sys.exit(f"rig {name} not found in {path}")
    b = m.group(1)
    d = re.search(r'dir:\s*"([^"]+)"', b).group(1)
    torso_file = re.search(r'torsos:\s*\{[^}]*?front:\s*"([^"]+)"', b).group(1)
    head_file = re.search(r'heads:\s*\{[^}]*?neutral:\s*"([^"]+)"', b).group(1)
    s = num(b, "partScale"); top = num(b, "torsoTop"); chin = num(b, "chinY")
    sx, sy = num(b, "shoulderX"), num(b, "shoulderY")
    hx, hy = num(b, "hipX"), num(b, "hipY")
    thigh, shin = num(b, "thigh"), num(b, "shin")
    ta = np.asarray(Image.open(f"public/{d}/{torso_file}.png"))[..., 3] > 128
    ha = np.asarray(Image.open(f"public/{d}/{head_file}.png"))[..., 3] > 128
    tw = ta.shape[1]
    fails = 0

    def inside(px, py):
        """distance (units) from point to the torso edge along x; >0 = inside."""
        r = int(round((py - top) / s))
        if r < 0 or r >= ta.shape[0]:
            return None, None
        xs = np.nonzero(ta[r])[0]
        if not len(xs):
            return None, None
        left, right = (xs.min() - tw / 2) * s, (xs.max() - tw / 2) * s
        return min(px - left, right - px), (left, right)

    def report(ok, msg, fix=""):
        nonlocal fails
        fails += 0 if ok else 1
        print(("PASS " if ok else "FAIL ") + msg + (f"  -> fix: {fix}" if not ok and fix else ""))

    for side in (-1, 1):
        dist, edges = inside(side * sx, sy)
        if dist is None:
            report(False, f"shoulder y={sy} is above/below the torso", "move shoulderY into the torso")
        else:
            safe = (edges[1] if side == 1 else -edges[0]) - MARGIN
            report(dist >= MARGIN, f"{'R' if side == 1 else 'L'} shoulder ({side*sx:.0f},{sy:.0f}) inside torso by {dist:.1f}", f"shoulderX <= {safe:.0f}")
        dist, edges = inside(side * hx, hy)
        if dist is None:
            # find the lowest torso row still wide enough for this hip
            report(False, f"hip ({side*hx:.0f},{hy:.0f}) is below the torso hem (legs float under the jacket)",
                   f"hipY ~= {top + ta.shape[0] * s - 14:.0f} (and lengthen thigh/shin to keep feet on the ground)")
        else:
            report(dist >= MARGIN, f"{'R' if side == 1 else 'L'} hip inside torso by {dist:.1f}", "move hipX inward / hipY up")
    overlap = chin - top
    report(overlap >= MARGIN, f"chin overlaps torso top by {overlap:.1f}", f"chinY >= {top + MARGIN + 4:.0f}")
    hw = ha.shape[1]
    report(ha[-8:, hw // 2 - 10: hw // 2 + 10].any(), "head PNG is opaque at its bottom-centre (chin anchor)", "re-cut the head tighter")
    ground = hy + thigh + shin
    report(abs(ground) <= 3, f"legs end at y={ground:.1f} (ground = 0)", f"thigh+shin = {-hy:.0f}")

    # Hands: each hand PNG's wrist anchor must sit ON the ink (so it is glued to the forearm end),
    # and the declared size must match the file (otherwise the anchor lands off the drawing).
    hands = re.findall(r'(\w+):\s*\{\s*file:\s*"([^"]+)",\s*size:\s*\[(\d+),\s*(\d+)\],\s*anchor:\s*\[(\d+),\s*(\d+)\]', b)
    if not hands:
        report(False, "no hands declared with {file, size, anchor, dir}", "measure each hand's wrist pixel on a gridded zoom")
    for hname, hfile, w, h, ax, ay in hands:
        im = Image.open(f"public/{d}/{hfile}.png"); al = np.asarray(im)[..., 3] > 100
        w, h, ax, ay = int(w), int(h), int(ax), int(ay)
        report(im.size == (w, h), f"hand '{hname}' size {im.size} matches declared {(w, h)}", f"size: [{im.size[0]}, {im.size[1]}]")
        y0, y1, x0, x1 = max(0, ay - 1), ay + 2, max(0, ax - 1), ax + 2
        on_ink = al[y0:y1, x0:x1].any() if 0 <= ax < im.size[0] and 0 <= ay < im.size[1] else False
        report(bool(on_ink), f"hand '{hname}' wrist anchor ({ax},{ay}) is on the ink", "move the anchor onto the stroke where the fingers converge")

    # Arm poses: arms are drawn BEHIND the torso. A pose is "floating" if the visible part
    # of arm+hand is broken into pieces, or the hand shows while (almost) no arm leads to it.
    ua, fa = num(b, "upperArm"), num(b, "foreArm"); hs = num(b, "handSize") or 22
    pm = re.search(r"export const ARM_POSES\s*=\s*\{(.*?)\}\s*as const", src, re.S)
    poses = re.findall(r"(\w+)\s*:\s*\{\s*shoulder:\s*(-?[\d.]+),\s*elbow:\s*(-?[\d.]+)([^}]*)\}", pm.group(1)) if pm else []
    for pname, sh, el, rest in poses:
        if "front: true" in rest:
            report(True, f"arm pose '{pname}' drawn in front of the torso from an inside shoulder joint")
            continue
        sh, el = float(sh), float(el)
        a1, a2 = np.radians(sh), np.radians(sh + el)
        ex, ey = sx + np.sin(a1) * ua, sy + np.cos(a1) * ua
        wx, wy = ex + np.sin(a2) * fa, ey + np.cos(a2) * fa
        pts = [(sx + (ex - sx) * t, sy + (ey - sy) * t, "arm") for t in np.linspace(0, 1, 30)]
        pts += [(ex + (wx - ex) * t, ey + (wy - ey) * t, "arm") for t in np.linspace(0, 1, 30)]
        pts += [(wx + np.sin(a2) * hs * t, wy + np.cos(a2) * hs * t, "hand") for t in np.linspace(0.1, 1, 8)]
        vis = []
        for px, py, kind in pts:
            dist, _ = inside(px, py)
            vis.append((dist is None or dist < 0, kind))
        pieces = sum(1 for i, (v, _) in enumerate(vis) if v and (i == 0 or not vis[i - 1][0]))
        arm_vis = sum(1 for v, k in vis if v and k == "arm") / 60 * (ua + fa)
        hand_vis = any(v for v, k in vis if k == "hand")
        ok = pieces <= 1 and (not hand_vis or arm_vis >= 0.3 * (ua + fa))
        why = "visible arm broken into pieces" if pieces > 1 else f"hand visible but only {arm_vis:.0f} units of arm show"
        report(ok, f"arm pose '{pname}' attached (visible arm {arm_vis:.0f} units, hand {'shown' if hand_vis else 'tucked'})",
               f"{why}: increase shoulder angle so the arm leaves the torso side early, or tuck the hand fully")
    print(f"\n{name}: {'OK' if not fails else f'{fails} problem(s)'}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
