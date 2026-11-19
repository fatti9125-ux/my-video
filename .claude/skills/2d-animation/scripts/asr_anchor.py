"""Fallback when forced alignment fails (VO deviates from the script): run pocketsphinx recognition over
[a,b] and place each script line at the best fuzzy match of its first words in the recognised stream.
Usage: python3 asr_anchor.py ep.json vo.mp3 first_line last_line a b  -> prints line starts"""
import json, re, subprocess, sys, difflib
from pocketsphinx import Decoder
sys.path.insert(0, __import__("os").path.dirname(__file__))
from align_words import say
ep, vo, l0, l1, a, b = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), float(sys.argv[5]), float(sys.argv[6])
D = json.load(open(ep))
pcm = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(a), "-t", str(b - a), "-i", vo, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
d = Decoder(samprate=16000, loglevel="FATAL"); d.start_utt(); d.process_raw(pcm, full_utt=True); d.end_utt()
R = [(re.sub(r"\(\d+\)$", "", s.word), a + s.start_frame / 100) for s in d.seg() if not s.word.startswith(("<", "["))]
def norm(t):
    t = re.sub(r"^(?:(?:fourteen|fifteen|sixteen|ending|eleven|twelve|thirteen)\.\s+)", "", t, flags=re.I).lower()
    out = []
    for p in re.findall(r"[a-z']+|\d+", t): out += say(p).split() if p.isdigit() else [p]
    return out
pos = 0; res = {}
for li in range(l0, l1 + 1):
    w = norm(D["lines"][li][1])[:4]; best = (0, None)
    for j in range(pos, len(R)):
        cand = [x for x, _ in R[j:j + len(w)]]
        sc = difflib.SequenceMatcher(None, " ".join(w), " ".join(cand)).ratio()
        if sc > best[0] + 0.05 or (best[1] is None): best = (sc, j)
        if R[j][1] > R[pos][1] + 12: break
    j = best[1]; res[li] = R[j][1]; pos = j + 1
    print(f"{li:3d} {R[j][1]:7.2f} score {best[0]:.2f}  {' '.join(w)!r:40} ~ {' '.join(x for x, _ in R[j:j+4])!r}")
json.dump(res, open("/dev/stdout", "w")) if False else None
