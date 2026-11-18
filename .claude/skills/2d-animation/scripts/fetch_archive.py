"""Download public-domain archive images from Wikimedia Commons (needs commons/upload.wikimedia.org allowed).

Usage: python3 -I fetch_archive.py <out_dir> <name>=<File:Title.jpg> [...]
Saves <out_dir>/<name>.jpg (max 1600 px wide) and appends source + license to <out_dir>/CREDITS.txt.
Search titles with: python3 -I arch_search.py "query"  (filetype:bitmap, shows license).
"""
import json, os, sys, time, urllib.parse, urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "video-research-bot/1.0"}


def req(url, binary=False):
    for i in range(5):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                b = r.read()
                return b if binary else json.loads(b)
        except Exception as e:
            err = e; time.sleep(15 + 15 * i)
    raise err


out = sys.argv[1]; os.makedirs(out, exist_ok=True)
cred = open(os.path.join(out, "CREDITS.txt"), "a")
for arg in sys.argv[2:]:
    name, title = arg.split("=", 1)
    d = req(API + "?" + urllib.parse.urlencode({"action": "query", "titles": title, "prop": "imageinfo",
            "iiprop": "url|extmetadata", "iiurlwidth": 1600, "format": "json"}))
    p = next(iter(d["query"]["pages"].values()))
    if "imageinfo" not in p:
        print("MISSING", title); continue
    ii = p["imageinfo"][0]
    url = ii["url"]  # original file: thumbnails redirect to thumb.wikimedia.org, which the sandbox proxy blocks
    lic = ii.get("extmetadata", {}).get("LicenseShortName", {}).get("value", "?")
    try:
        data = req(url, binary=True)
    except Exception as e:
        print("FAILED", name, e); continue
    path = os.path.join(out, name + ".jpg")
    from io import BytesIO
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    im = Image.open(BytesIO(data)).convert("RGB")
    im.thumbnail((1800, 1800))
    im.save(path, quality=88)
    cred.write(f"{name}.jpg\t{title}\t{lic}\t{ii['descriptionurl']}\n")
    print(f"{name:22} {os.path.getsize(path)//1024:5d} KB  {lic}", flush=True)
    time.sleep(60)
