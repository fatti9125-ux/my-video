"""Search Wikimedia Commons for bitmap files; print title, size, license, url."""
import json, sys, time, urllib.parse, urllib.request

API = "https://commons.wikimedia.org/w/api.php"
UA = {"User-Agent": "video-research-bot/1.0"}


def get(params):
    url = API + "?" + urllib.parse.urlencode(params)
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                return json.loads(r.read())
        except Exception as e:
            time.sleep(2 + i * 3)
    return {}


for q in sys.argv[1:]:
    d = get({"action": "query", "generator": "search", "gsrsearch": f"filetype:bitmap {q}", "gsrnamespace": 6, "gsrlimit": 8,
             "prop": "imageinfo", "iiprop": "url|size|extmetadata", "iiurlwidth": 1600, "format": "json"})
    print("==", q)
    for p in sorted(d.get("query", {}).get("pages", {}).values(), key=lambda p: p.get("index", 0)):
        ii = p["imageinfo"][0]; md = ii.get("extmetadata", {})
        lic = md.get("LicenseShortName", {}).get("value", "?")
        print(f"  {p['title'][:90]} | {ii['width']}x{ii['height']} | {lic} | {ii.get('thumburl', ii['url'])}")
    time.sleep(1.5)
