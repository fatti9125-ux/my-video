"""Assemble a corrected ep json from forced-aligned ranges + anchor-only lines.
Usage: python3 build_ep.py ep.json vo.mp3 plan.json out.json
plan = {"ranges": [[l0, l1, a, b], ...], "anchors": {"line": start_sec, ...}, "skip": [line, ...]}
Ranges go through force_align.py (pocketsphinx). Anchored lines (VO wording differs from the script) get
their words spread by syllables up to the next line's start."""
import json, os, subprocess, sys, tempfile, re
sys.path.insert(0, os.path.dirname(__file__))
from align_words import syl
ep, vo, plan, out = sys.argv[1:5]
D = json.load(open(ep)); P = json.load(open(plan))
L = len(D["lines"]); start = [None] * L; words = {}
here = os.path.dirname(os.path.abspath(__file__))
for l0, l1, a, b in P["ranges"]:
    tmp = tempfile.mktemp(suffix=".json")
    env = dict(os.environ, RANGE=f"{l0},{l1},{a},{b}", SKIP_LINES=",".join(map(str, P.get("skip", []))))
    r = subprocess.run([sys.executable, os.path.join(here, "force_align.py"), ep, vo, tmp], env=env, capture_output=True, text=True)
    if r.returncode: sys.exit(f"range {l0}-{l1} failed: {r.stdout[-300:]} {r.stderr[-300:]}")
    R = json.load(open(tmp))
    for i in range(l0, l1 + 1):
        if i in P.get("skip", []): continue
        start[i] = R["lines"][i][0]; words[i] = [w for w in R["words"] if w[1] == i]
for k, v in P.get("anchors", {}).items(): start[int(k)] = v
for i in P.get("skip", []):  # skipped heading: card starts with the next spoken line
    start[i] = start[i + 1] - 0.05 if i + 1 < L and start[i + 1] is not None else start[i - 1]
missing = [i for i in range(L) if start[i] is None]
if missing: sys.exit(f"lines without timing: {missing}")
for i in range(L):
    if i in words and words[i]: continue
    txt = D["lines"][i][1].split(); end = start[i + 1] if i + 1 < L else D["dur"]
    s = [max(1, syl(w)) for w in txt]; tot = sum(s); t = start[i]; ws = []
    for w, n in zip(txt, s):
        ws.append([re.sub(r"[^a-z0-9'-]", "", w.lower().replace("’", "'")).strip("-"), i, round(t, 2)]); t += (end - start[i]) * 0.9 * n / tot
    words[i] = ws
for i in range(1, L):
    if start[i] < start[i - 1]: print(f"WARNING line {i} starts before line {i-1}")
D["lines"] = [[round(start[i], 2), D["lines"][i][1]] for i in range(L)]
D["words"] = [w for i in range(L) for w in words[i]]
json.dump(D, open(out, "w"))
print("ok", L, "lines")
