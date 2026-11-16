"""Approximate sentence-level alignment of a known script to a voiceover, without ASR.

Usage: python3 -I align_script.py <audio> <script.txt> <out.json> [--lead 0]
  script.txt: the exact text spoken in this audio file, one sentence/beat per line.

Method: estimate each line's spoken length from syllables (numbers/years expanded), scale
to the measured speech time, then snap every line boundary to the nearest detected breath
(a dip in the loudness envelope) within +-0.9 s. Output: [{"i", "text", "start", "end"}] in
seconds. Good for cutting shots on sentences; not word-accurate. Also writes
<out>.env.json: 100 Hz loudness envelope (0..1) for driving mouth flaps.
"""
import json, re, subprocess, sys
import numpy as np

SR = 16000


def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def say(n):
    n = int(n)
    if n < 20: return ONES[n]
    if n < 100: return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
    if 1100 <= n <= 2099 and n % 100 != 0 or 1100 <= n < 2000:  # years: 1789 -> seventeen eighty nine
        hi, lo = divmod(n, 100)
        return say(hi) + " " + ("hundred" if lo == 0 else ("oh " + ONES[lo] if lo < 10 else say(lo)))
    if n < 1000: return ONES[n // 100] + " hundred " + (say(n % 100) if n % 100 else "")
    return say(n // 1000) + " thousand " + (say(n % 1000) if n % 1000 else "")


def syllables(text):
    text = re.sub(r"(\d+)(st|nd|rd|th)\b", r"\1", text)
    text = re.sub(r"\d+", lambda m: " " + say(m.group()) + " ", text)
    words = re.findall(r"[a-zA-Z']+", text.lower())
    total = 0
    for w in words:
        v = re.findall(r"[aeiouy]+", w)
        c = len(v) - (1 if w.endswith("e") and len(v) > 1 and not w.endswith(("le", "ee")) else 0)
        if w.endswith("ed") and len(v) > 1 and not w.endswith(("ted", "ded")):
            c -= 1  # silent -ed: "mailed", "signed"
        total += max(1, c)
    return total, len(words)


def syllable_peaks(x):
    """Times (s) of syllable nuclei: band-limited loudness peaks with >= 2.5 dB dips between."""
    spec_h = SR // 100
    n = len(x) // spec_h
    fr = x[: n * spec_h].reshape(n, spec_h) * np.hanning(spec_h)
    F = np.abs(np.fft.rfft(fr, axis=1))
    f = np.fft.rfftfreq(spec_h, 1 / SR)
    band = F[:, (f > 300) & (f < 3000)].sum(1)
    db = 20 * np.log10(band + 1e-9)
    db = np.convolve(db, np.ones(3) / 3, mode="same")
    floor = np.median(db) - 6
    peaks = []
    last_t = -1
    for i in range(2, n - 2):
        if db[i] < floor or db[i] < db[i - 1] or db[i] < db[i + 1]:
            continue
        # prominence: dip of >= 2.5 dB on both sides within 120 ms
        lw = db[max(0, i - 12):i].min(); rw = db[i + 1:i + 13].min()
        if db[i] - lw < 2.5 or db[i] - rw < 2.5:
            continue
        if i - last_t < 8:  # >= 80 ms apart
            if peaks and db[i] > db[int(peaks[-1] * 100)]:
                peaks[-1] = i / 100; last_t = i
            continue
        peaks.append(i / 100); last_t = i
    return np.array(peaks)


def main():
    audio, script, out = sys.argv[1:4]
    lines = [l.strip() for l in open(script) if l.strip()]
    x = load(audio); h = SR // 100
    n = len(x) // h
    env = np.sqrt((x[: n * h].reshape(n, h) ** 2).mean(1))
    db = 20 * np.log10(env + 1e-9)
    thr = np.median(db) - 18
    speech = db > thr
    first = np.argmax(speech) / 100; last = (n - np.argmax(speech[::-1])) / 100
    # breath candidates: centres of quiet runs >= 80 ms
    gaps = []; i = 0
    while i < n:
        if not speech[i]:
            j = i
            while j < n and not speech[j]: j += 1
            if j - i >= 8: gaps.append(((i + j) / 200, (j - i) / 100))
            i = j
        else:
            i += 1
    syl = np.array([syllables(l)[0] for l in lines], float)
    # sentence-final punctuation gets a small expected pause weight
    pause = np.array([0.35 if re.search(r"[.!?:]\W*$", l) else 0.15 for l in lines])
    dur = last - first
    rate = (dur - pause.sum()) / syl.sum()
    # Syllable clock: detect syllable nuclei (peaks of the 300-3000 Hz loudness envelope with a
    # >= 2.5 dB dip between neighbours). The k-th script syllable is mapped onto the matching
    # fraction of detected peaks, so slow dramatic passages and fast lists both stay in sync.
    # Each line end is then snapped to a breath within 0.45 s if there is one.
    peaks = syllable_peaks(x)
    cum = np.cumsum(syl) / syl.sum()
    ends = []
    for k in range(len(lines) - 1):
        pos = cum[k] * (len(peaks) - 1)
        lo, hi = int(np.floor(pos)), min(len(peaks) - 1, int(np.floor(pos)) + 1)
        t = (peaks[lo] + peaks[hi]) / 2  # between the line's last syllable and the next line's first
        near = [(abs(g - t) - 0.2 * d, g) for g, d in gaps if abs(g - t) < 0.45 and (not ends or g > ends[-1] + 0.25)]
        e = min(near)[1] if near else t
        ends.append(max(e, (ends[-1] + 0.25) if ends else first + 0.25))
    print(f"syllable clock: {len(peaks)} peaks for {int(syl.sum())} script syllables")
    ends.append(last)
    res = []; start = first
    for k, l in enumerate(lines):
        res.append({"i": k, "text": l, "start": round(start, 2), "end": round(ends[k], 2)})
        start = ends[k]
    json.dump(res, open(out, "w"), indent=1)
    envn = np.clip((db - thr) / 30, 0, 1)
    json.dump([round(float(v), 2) for v in envn], open(out.replace(".json", ".env.json"), "w"))
    print(f"{len(lines)} lines, speech {first:.2f}-{last:.2f}s, {rate*1000:.0f} ms/syllable, {len(gaps)} breaths")
    for r in res: print(f"{r['start']:7.2f} {r['end']:7.2f}  {r['text'][:70]}")


if __name__ == "__main__":
    main()
