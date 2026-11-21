import sys, json, numpy as np, cv2
from PIL import Image
D = "public/tg2/vp"; H = json.load(open("src/Thanksgiving3/vp_heads.json")); M = json.load(open("src/Thanksgiving3/vp_sprites.json"))
for spec in sys.argv[1:]:
    key, body, neutral = spec.split(":")
    b = np.array(Image.open(f"{D}/{key}/{body}.png").convert("RGBA"))
    x, y, w, h = H[f"vp/{key}/{body}|{neutral}"]
    hd = np.array(Image.open(f"{D}/{key}/{neutral}.png").convert("RGBA").resize((w, h)))[..., 3] > 20
    m = np.zeros(b.shape[:2], np.uint8)
    y1, x1 = min(b.shape[0], y + h), min(b.shape[1], x + w)
    m[y:y1, x:x1] = hd[: y1 - y, : x1 - x]
    m = cv2.dilate(m, np.ones((9, 9), np.uint8))
    m[int(y + h * 0.80):] = 0                      # keep the collar under the chin
    b[..., 3][m > 0] = 0
    Image.fromarray(b).save(f"{D}/{key}/{body}_nohead.png", optimize=True)
    M[f"vp/{key}/{body}_nohead"] = M[f"vp/{key}/{body}"]
json.dump(M, open("src/Thanksgiving3/vp_sprites.json", "w"), separators=(",", ":"))
