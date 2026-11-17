"""Word-level alignment of a known script to a voiceover (no ASR available in the sandbox).

Usage: python3 -I align_words.py <audio> <script.txt> <out.json>
  script.txt: exactly what is spoken in this file, one sentence/beat per line.

1. Pauses = quiet runs measured against BOTH absolute silence and the local noise floor
   (VO files may carry a quiet bed/room tone, so "silence" is often -45 dB, not -80 dB).
2. Sentence boundaries: dynamic programming picks one pause per boundary, minimising the
   squared log-ratio between each sentence's actual and expected duration (expected from its
   syllable count at the local speaking rate), with a bonus for longer pauses.
3. Words: inside each sentence, the script's syllables are mapped onto the detected syllable
   nuclei of that span in order (syllable clock), so each word gets a start time (~±0.1 s).
Output JSON: {"lines":[{"text","start","end"}], "words":[{"w","line","start","end"}]}
Always eyeball the result against the envelope around 2-3 known landmarks (headings, long pauses).
"""
import json, re, subprocess, sys
import numpy as np

SR = 16000
HOP = SR // 100

ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def say(n):
    n = int(n)
    if n < 20: return ONES[n]
    if n < 100: return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
    if 1100 <= n < 2100 and n % 100 != 0:
        hi, lo = divmod(n, 100)
        return say(hi) + " " + ("oh " + ONES[lo] if lo < 10 else say(lo))
    if n < 1000: return ONES[n // 100] + " hundred" + (" " + say(n % 100) if n % 100 else "")
    return say(n // 1000) + " thousand" + (" " + say(n % 1000) if n % 1000 else "")


def syl(word):
    w = re.sub(r"(\d+)(st|nd|rd|th)\b", r"\1", word.lower()).strip(".,;:!?\"'()—-")
    if re.fullmatch(r"\d+", w):
        return sum(syl(x) for x in say(w).split())
    w = re.sub(r"[^a-z']", "", w)
    if not w: return 0
    c = len(re.findall(r"[aeiouy]+", w))
    if w.endswith("e") and c > 1 and not w.endswith(("le", "ee")): c -= 1
    if w.endswith("ed") and c > 1 and not w.endswith(("ted", "ded")): c -= 1
    return max(1, c)


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def analyse(x):
    n = len(x) // HOP
    fr = x[: n * HOP].reshape(n, HOP)
    db = 20 * np.log10(np.sqrt((fr ** 2).mean(1)) + 1e-9)
    floor = np.array([np.percentile(db[max(0, i - 300):i + 300], 3) for i in range(0, n, 25)])
    floor = np.repeat(floor, 25)[:n]
    q = (db < np.median(db) - 20) | (db < floor + 9)
    pauses = []; i = 0
    while i < n:
        if q[i]:
            j = i
            while j < n and q[j]: j += 1
            if j - i >= 12: pauses.append((i / 100, (j - i) / 100))
            i = j
        else:
            i += 1
    F = np.abs(np.fft.rfft(fr * np.hanning(HOP), axis=1)); f = np.fft.rfftfreq(HOP, 1 / SR)
    band = np.convolve(20 * np.log10(F[:, (f > 300) & (f < 3000)].sum(1) + 1e-9), np.ones(3) / 3, mode="same")
    fl = np.median(band) - 6
    nuc = []; last = -99
    for i in range(2, n - 2):
        if q[i] or band[i] < fl or band[i] < band[i - 1] or band[i] < band[i + 1]: continue
        if band[i] - band[max(0, i - 12):i].min() < 2.5 or band[i] - band[i + 1:i + 13].min() < 2.5: continue
        if i - last < 8:
            if nuc and band[i] > band[int(round(nuc[-1] * 100))]: nuc[-1] = i / 100; last = i
            continue
        nuc.append(i / 100); last = i
    speech = ~q
    t0 = int(np.argmax(speech)) / 100; t1 = (n - int(np.argmax(speech[::-1]))) / 100
    return np.array(nuc), pauses, t0, t1


def main():
    audio, script, out = sys.argv[1:4]
    lines = [l.strip() for l in open(script) if l.strip()]
    x = load(audio)
    nuc, pauses, t0, t1 = analyse(x)
    words = []
    for li, line in enumerate(lines):
        for raw in line.split():
            core = raw.strip("\"“”'()")
            k = syl(core)
            if k: words.append({"w": core.strip(".,;:!?—-"), "line": li, "syl": k})
    S = np.array([sum(w["syl"] for w in words if w["line"] == li) for li in range(len(lines))], float)
    L = len(lines)
    # candidate boundaries: real pauses (bonus by length) + every gap between two nuclei (small penalty),
    # because narrators often run sentences together without a measurable pause
    cands = [(p, p + d, min(d / 0.3, 2.0)) for p, d in pauses if t0 + 0.3 < p < t1 - 0.3]
    mids = [((nuc[i] + nuc[i + 1]) / 2, (nuc[i] + nuc[i + 1]) / 2 + 0.01, -0.6) for i in range(len(nuc) - 1)]
    cands = sorted(cands + [m for m in mids if not any(c[0] - 0.12 < m[0] < c[1] + 0.12 for c in cands)])
    G = len(cands)
    ce = np.array([c[0] for c in cands]); cs = np.array([c[1] for c in cands]); cb = np.array([c[2] for c in cands])
    rate = (t1 - t0) / S.sum()
    ratio = len(nuc) / S.sum()
    strong = [len(re.findall(r"[.!?](?=\s)", l)) for l in lines]          # sentence stops inside the line
    soft = [len(re.findall(r"[,;:—](?=\s)", l)) for l in lines]
    pst = np.array([p for p, d in pauses])
    def seg(k, a_, b_):
        d = b_ - a_
        if d <= 0.15: return 1e9
        n = np.searchsorted(nuc, b_) - np.searchsorted(nuc, a_)
        inner = int(((pst > a_ + 0.1) & (pst < b_ - 0.1)).sum())
        miss = max(0, strong[k] - inner); extra = max(0, inner - strong[k] - soft[k])
        return 6.0 * np.log((n + 1) / (S[k] * ratio + 1)) ** 2 + 0.3 * np.log(d / (S[k] * rate)) ** 2 + 0.8 * miss + 0.6 * extra
    INF = 1e18
    cost = np.full((L, G), INF); back = np.full((L, G), -1)
    nidx = np.searchsorted(nuc, ce)
    for j in range(G):
        cost[0, j] = seg(0, t0, ce[j]) - 0.5 * cb[j]
    for k in range(1, L - 1):
        need = S[k] * ratio
        for j in range(G):
            best, arg = INF, -1
            # only consider starts whose nucleus count is plausible for this line
            lo = np.searchsorted(nidx, nidx[j] - need * 3 - 3); hi = np.searchsorted(nidx, nidx[j] - need * 0.3 + 1, side="right")
            for i in range(max(0, lo), min(j, hi)):
                if cost[k - 1, i] >= INF: continue
                c = cost[k - 1, i] + seg(k, cs[i], ce[j]) - 0.5 * cb[j]
                if c < best: best, arg = c, i
            cost[k, j] = best; back[k, j] = arg
    best, arg = INF, -1
    for i in range(G):
        c = cost[L - 2, i] + seg(L - 1, cs[i], t1)
        if c < best: best, arg = c, i
    chosen = [arg]
    for k in range(L - 2, 0, -1):
        chosen.append(back[k, chosen[-1]])
    chosen = chosen[::-1]
    bounds = [(t0, ce[chosen[0]])]
    for k in range(1, L - 1):
        bounds.append((cs[chosen[k - 1]], ce[chosen[k]]))
    bounds.append((cs[chosen[-1]], t1))
    out_lines = []
    for li, (a, b) in enumerate(bounds):
        ws = [w for w in words if w["line"] == li]
        nn = nuc[(nuc >= a - 0.02) & (nuc <= b + 0.02)]
        tot = sum(w["syl"] for w in ws); acc = 0
        for w in ws:
            frac0 = acc / tot; acc += w["syl"]; frac1 = acc / tot
            if len(nn) >= 2:
                i0 = frac0 * (len(nn) - 1); i1 = frac1 * (len(nn) - 1)
                st = np.interp(i0, np.arange(len(nn)), nn) - 0.06
                en = np.interp(i1, np.arange(len(nn)), nn) + 0.1
            else:
                st = a + frac0 * (b - a); en = a + frac1 * (b - a)
            w["start"] = round(float(max(a, st)), 2); w["end"] = round(float(min(b, en)), 2)
        if ws: ws[0]["start"] = round(a, 2)
        out_lines.append({"text": lines[li], "start": round(a, 2), "end": round(b, 2)})
    for w in words: w.pop("syl", None)
    json.dump({"lines": out_lines, "words": words}, open(out, "w"), indent=0)
    print(f"{len(words)} words, {L} lines, {len(nuc)} nuclei, {len(pauses)} pauses, speech {t0:.2f}-{t1:.2f}s, {rate*1000:.0f} ms/syl")
    for l in out_lines: print(f"{l['start']:7.2f} {l['end']:7.2f}  {l['text'][:64]}")


if __name__ == "__main__":
    main()
