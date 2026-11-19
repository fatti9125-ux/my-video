"""Real forced alignment of a known script to a VO with pocketsphinx (pip install pocketsphinx; model bundled).
Usage: python3 force_align.py ep.json vo.mp3 [out.json]
Reads the script lines from ep.json, aligns every word to the audio, and prints, for each line, the
current start vs the measured start. With out.json, writes a corrected ep json (lines + words retimed)."""
import json, re, subprocess, sys, os
import numpy as np
from pocketsphinx import Decoder, get_model_path
sys.path.insert(0, os.path.dirname(__file__))
from align_words import say

ep, vo = sys.argv[1], sys.argv[2]
D = json.load(open(ep))
mp = get_model_path()
dic = {}
for l in open(os.path.join(mp, "en-us", "cmudict-en-us.dict")):
    w = l.split()[0]; dic.setdefault(re.sub(r"\(\d+\)$", "", w), 1)

def toks(word):
    w = word.lower().replace("’", "'")
    w = re.sub(r"(\d+)(st|nd|rd|th)\b", r"\1", w)
    m = re.fullmatch(r"\W*(\d\d)(\d)0s\W*", w)  # decades: 1920s -> nineteen twenties
    if m:
        t = say(m.group(2) + "0").split()
        return say(m.group(1)).split() + [t[0][:-1] + "ies"]
    out = []
    for p in re.findall(r"[a-z']+|\d+", w):
        if p.isdigit():
            sp = say(p)
            if os.environ.get("YEAR_AND") and 2001 <= int(p) <= 2009: sp = sp.replace("thousand", "thousand and")
            out += sp.split()
        else:
            p = p.strip("'")
            if p in dic: out.append(p)
            elif p.endswith("'s") and p[:-2] in dic: out.append(p[:-2])
    return out

# one entry per script word: (line, word, tokens)
# chapter numbers / "Ending." in headings are written in the script but not spoken
NUM = r"^(?:(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|ending)\.\s+)"
spoken = [re.sub(NUM, "", t, flags=re.I) for _, t in D["lines"]]
for i in os.environ.get("SKIP_LINES", "").split(","):  # lines in the script that the narrator skips
    if i: spoken[int(i)] = ""
W = []
for li, text in enumerate(spoken):
    for w in text.split():
        W.append((li, w, toks(w)))
seq = [t for _, _, ts in W for t in ts]
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", vo, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(pcm, np.int16).astype(np.float32)
e = np.sqrt((x[: len(x) // 160 * 160].reshape(-1, 160) ** 2).mean(1))  # 100 Hz energy
floor = np.percentile(e, 20)

def quiet_runs(t, span=3.0):
    """centres of quiet runs (>=0.12 s) within +-span of t, longest first"""
    lo, hi = max(1, int((t - span) * 100)), min(len(e) - 1, int((t + span) * 100))
    q = e[lo:hi] < floor * 3; runs = []; run = 0
    for i, v in enumerate(list(q) + [False]):
        if v: run += 1
        else:
            if run >= 12: runs.append((run, (lo + i - run / 2) / 100))
            run = 0
    return [c for _, c in sorted(runs, reverse=True)]

def align(text, a, b):
    dec = Decoder(samprate=16000, loglevel="FATAL", beam=1e-100, wbeam=1e-80, pbeam=1e-100)
    dec.set_align_text(text)
    dec.start_utt(); dec.process_raw(pcm[int(a * 16000) * 2: int(b * 16000) * 2], full_utt=True); dec.end_utt()
    sg = dec.seg()
    if sg is None: return None
    return [(re.sub(r"\(\d+\)$", "", s.word), a + s.start_frame / 100) for s in sg if s.word not in ("<s>", "</s>", "<sil>", "[NOISE]")]

L = len(D["lines"])
HEAD = re.compile(r"^(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|ending|cold open)\b", re.I)
RNG = os.environ.get("RANGE")
if RNG:
    l0, l1, ra, rb = RNG.split(","); l0, l1, ra, rb = int(l0), int(l1), float(ra), float(rb)
    W = [w for w in W if l0 <= w[0] <= l1]; seq = [t for _, _, ts in W for t in ts]
    D["lines"] = [l if l0 <= i <= l1 else l for i, l in enumerate(D["lines"])]
    seg = align(" ".join(seq), ra, rb)
    if seg is None or len(seg) != len(seq): sys.exit("range does not align")
else:
    seg = align(" ".join(seq), 0, len(x) / 16000)
if seg is None or len(seg) != len(seq):
    # line-by-line: for each group of 1-3 lines try every pause near the next line's estimate
    seg, a, lo = [], 0.0, 0
    while lo < L:
        done = False
        for n in (1, 2, 3, 4):
            hb = min(L, lo + n)
            words = [t for (li, _, ts) in W if lo <= li < hb for t in ts]
            if not words: done = True; break
            cands = [len(x) / 16000] if hb == L else quiet_runs(D["lines"][hb][0], 3.0)
            for cut in cands:
                if cut <= a + 0.2: continue
                r = align(" ".join(words), a, cut)
                if r is not None and len(r) == len(words):
                    seg += r; a, lo, done = cut, hb, True; break
            if done: break
        if not done:
            sys.exit(f"line {lo} from {a:.1f}s does not align: {D['lines'][lo][1]}")
assert len(seg) == len(seq), f"aligned {len(seg)} of {len(seq)} tokens"
k = 0; times = []
for li, w, ts in W:
    times.append(seg[k][1] if ts else None); k += len(ts)
# fill OOV words from the next timed word
nxt = None
for i in range(len(times) - 1, -1, -1):
    if times[i] is None: times[i] = nxt
    else: nxt = times[i]
newlines = []
for li, (old, text) in enumerate(D["lines"]):
    if not any(l == li for l, _, _ in W): newlines.append([old, text]); continue
    st = next(t for (l, _, _), t in zip(W, times) if l == li)
    newlines.append([round(st, 2), text])
    flag = "  <-- OFF" if abs(st - old) > 0.6 else ""
    print(f"{li:3d} old {old:7.2f} new {st:7.2f} diff {st-old:+6.2f}{flag}  {text[:50]}")
if len(sys.argv) > 3:
    D["lines"] = newlines
    D["words"] = [[re.sub(r"[^a-z0-9'-]", "", w.lower().replace("’", "'")).strip("-"), l, round(t, 2)] for (l, w, _), t in zip(W, times)]
    json.dump(D, open(sys.argv[3], "w"))
