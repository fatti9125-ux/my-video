"""Lead-side helper: extract the analysis.md text an analyst returned (between ===BEGIN analysis.md=== and
===END analysis.md===) from its transcript and save it. usage: python3 save_handback.py <transcript.jsonl> <out.md>"""
import json, sys
B, E = "===BEGIN analysis.md===", "===END analysis.md==="
best = None
def walk(o):
    global best
    if isinstance(o, str):
        if B in o and E in o:
            t = o[o.rindex(B) + len(B):]; t = t[:t.index(E)]
            best = t
    elif isinstance(o, dict): [walk(v) for v in o.values()]
    elif isinstance(o, list): [walk(v) for v in o]
for line in open(sys.argv[1]):
    try: walk(json.loads(line))
    except Exception: pass
if not best or len(best) < 500: sys.exit("no analysis text found")
lines = best.strip("\n").split("\n")
ind = min((len(l) - len(l.lstrip(" ")) for l in lines if l.strip()), default=0)
open(sys.argv[2], "w").write("\n".join(l[ind:] for l in lines).strip() + "\n")
print("saved", sys.argv[2], len(best), "chars")
