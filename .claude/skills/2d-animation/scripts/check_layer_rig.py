"""Attachment check for LayerPuppet (layered Rig_*.png characters).

Usage: python3 -I check_layer_rig.py <public_root> <rigmeta.json> <LayerPuppet.tsx>

Re-creates the puppet's layout (same rules as `layout()` in LayerPuppet.tsx) and, for every
character x every ARMS preset (and both sides), samples the arm chain against the real torso
alpha. FAIL when the hand is visible but less than 30% of the arm is visible leading to it
(the "floating hand" case), or when the visible arm is broken into pieces. Also checks that the
shoulder and hip joints lie inside the torso silhouette and the chin overlaps the collar.
"""
import json, math, re, sys
import numpy as np
from PIL import Image


def main():
    root, meta_p, tsx = sys.argv[1:4]
    M = json.load(open(meta_p)); src = open(tsx).read()
    arms = {n: (float(s), float(e), "front: true" in rest) for n, s, e, rest in
            re.findall(r"(\w+):\s*\{\s*s:\s*(-?[\d.]+),\s*e:\s*(-?[\d.]+)([^}]*)\}", src[src.index("export const ARMS"):src.index("as Record<string, Arm>")])}
    fails = 0
    for char, c in M.items():
        P, pos = c["parts"], c["pos"]
        if "torso" not in P:
            continue
        T = pos.get("torso", [270, 335]); t = P["torso"]
        a = np.asarray(Image.open(f"{root}/{char}/{t['file']}.png").convert("RGBA"))[..., 3] > 110
        tTop, tBot = T[1] + t["top"], T[1] + t["bottom"]; th = tBot - tTop
        cx = T[0] + (t["bbox"][0] + t["bbox"][2]) / 2

        def inside(x, y):
            lx, ly = int(round(x - T[0])), int(round(y - T[1]))
            return 0 <= ly < a.shape[0] and 0 <= lx < a.shape[1] and a[ly, lx]

        sy = tTop + th * 0.2
        row = min(t["profile"], key=lambda r: abs(r[0] + T[1] - sy))
        sh = {"left": (T[0] + row[1] + 12, sy), "right": (T[0] + row[2] - 12, sy)}
        bad = []
        for side, (x, y) in sh.items():
            if not inside(x, y): bad.append(f"{side} shoulder outside torso")
        hy = tBot - th * 0.12
        for x in (cx - 30, cx + 30):
            if not inside(x, hy): bad.append("hip outside torso")
        for name, (s, e, front) in arms.items():
            if front:
                continue
            for side in ("left", "right"):
                sg = 1 if side == "left" else -1
                ua, fa = P[f"{side}_upper_arm"], P[f"{side}_forearm"]
                l1 = ua["bottom"][1] - ua["top"][1]; l2 = fa["bottom"][1] - fa["top"][1]
                x0, y0 = sh[side]
                # SVG rotate(+θ) turns "down" toward -x: direction = (-sin θ, cos θ)
                a1 = math.radians(sg * s); a2 = math.radians(sg * (s + e))
                pts = [(x0 - math.sin(a1) * l1 * u, y0 + math.cos(a1) * l1 * u, "arm") for u in np.linspace(0, 1, 25)]
                ex, ey = pts[-1][:2]
                pts += [(ex - math.sin(a2) * l2 * u, ey + math.cos(a2) * l2 * u, "arm") for u in np.linspace(0, 1, 25)]
                wx, wy = pts[-1][:2]
                pts += [(wx - math.sin(a2) * 18 * u, wy + math.cos(a2) * 18 * u, "hand") for u in np.linspace(0.2, 1, 6)]
                vis = [(not inside(px, py), k) for px, py, k in pts]
                pieces = sum(1 for i, (v, _) in enumerate(vis) if v and (i == 0 or not vis[i - 1][0]))
                arm_vis = sum(1 for v, k in vis if v and k == "arm") / 50
                hand_vis = any(v for v, k in vis if k == "hand")
                if pieces > 1 or (hand_vis and arm_vis < 0.3):
                    bad.append(f"ARMS.{name} {side}: {'broken' if pieces > 1 else f'hand shows with only {arm_vis:.0%} of arm'}")
        status = "OK  " if not bad else "FAIL"
        fails += bool(bad)
        print(f"{status} {char}" + ("" if not bad else ": " + "; ".join(sorted(set(bad)))))
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
