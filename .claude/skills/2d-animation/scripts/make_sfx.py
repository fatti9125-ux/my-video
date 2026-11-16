"""Synthesize a cartoon SFX kit + a bouncy music bed (no external assets needed).

Usage: python3 make_sfx.py <out_dir> [music_seconds=30]
Writes mono 44.1 kHz WAVs: whoosh, thud, pop, gunburst, squawk, boing,
sad_trombone, music_bed.
"""
import sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def t(sec):
    return np.arange(int(SR * sec)) / SR


def env(n, attack=0.005, release=None):
    e = np.ones(n)
    a = max(1, int(SR * attack))
    e[:a] = np.linspace(0, 1, a)
    if release:
        r = min(n, int(SR * release))
        e[-r:] *= np.linspace(1, 0, r)
    return e


def lowpass(x, alpha):
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += alpha * (v - acc); y[i] = acc
    return y


def save(path, x, peak=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def whoosh():
    n = t(0.45); x = rng.standard_normal(len(n))
    # sweep a simple resonant-ish filter by varying lowpass amount
    out = np.zeros_like(x); acc = 0.0
    alphas = 0.02 + 0.25 * np.sin(np.pi * n / n[-1]) ** 2
    for i, v in enumerate(x):
        acc += alphas[i] * (v - acc); out[i] = acc
    return out * np.sin(np.pi * n / n[-1]) ** 1.5


def thud():
    n = t(0.5)
    f = 110 * np.exp(-n * 9) + 45
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-n * 7)
    click = rng.standard_normal(len(n)) * np.exp(-n * 120) * 0.6
    return body + lowpass(click, 0.3)


def pop():
    n = t(0.12)
    f = 900 * np.exp(-n * 25) + 250
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-n * 30)


def gunburst(shots=6, gap=0.09):
    out = np.zeros(int(SR * (shots * gap + 0.4)))
    for k in range(shots):
        n = t(0.25); s = int(SR * k * gap)
        crack = rng.standard_normal(len(n)) * np.exp(-n * 40)
        low = np.sin(2 * np.pi * 70 * n) * np.exp(-n * 18) * 0.8
        out[s:s + len(n)] += crack + low
    return out


def squawk():
    n = t(0.35)
    f = 520 + 180 * np.sin(2 * np.pi * 28 * n) - 300 * n
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = 2 * ((ph / (2 * np.pi)) % 1) - 1
    return lowpass(saw, 0.35) * env(len(n), 0.01, 0.12)


def boing():
    n = t(0.5)
    f = 180 + 220 * np.exp(-n * 6) * (1 + 0.3 * np.sin(2 * np.pi * 14 * n))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-n * 5)


def sad_trombone():
    notes = [(311, 0.45), (294, 0.45), (277, 0.45), (262, 1.3)]
    parts = []
    for f0, d in notes:
        n = t(d)
        vib = 1 + (0.02 * np.sin(2 * np.pi * 6 * n) if d > 1 else 0)
        f = f0 * vib * (1 - 0.06 * (n / d) if d > 1 else 1)
        ph = 2 * np.pi * np.cumsum(f) / SR
        saw = 2 * ((ph / (2 * np.pi)) % 1) - 1
        parts.append(lowpass(saw, 0.12) * env(len(n), 0.03, 0.08))
    return np.concatenate(parts)


def music_bed(seconds=30, bpm=128):
    beat = 60 / bpm; total = np.zeros(int(SR * seconds) + SR)
    # C - G - Am - F, oom-pah bass + staccato pluck melody + light shaker
    prog = [(130.81, [523.25, 659.25, 783.99]), (98.00, [493.88, 587.33, 783.99]),
            (110.00, [523.25, 659.25, 880.00]), (87.31, [440.00, 523.25, 698.46])]
    melody = [0, 2, 1, 2, 0, 1, 2, 1]
    nbeats = int(seconds / beat)
    for b in range(nbeats):
        bass_f, chord = prog[(b // 4) % 4]
        s = int(SR * b * beat)
        n = t(beat * 0.9)
        f = bass_f if b % 2 == 0 else bass_f * 1.5
        bass = np.sign(np.sin(2 * np.pi * f * n)) * 0.5 + np.sin(2 * np.pi * f * n)
        total[s:s + len(n)] += lowpass(bass, 0.08) * np.exp(-n * 5) * 0.55
        for half in (0, 1):  # eighth-note plucks
            hs = s + int(SR * half * beat / 2); hn = t(beat / 2)
            mf = chord[melody[(b * 2 + half) % 8]]
            pl = (np.sin(2 * np.pi * mf * hn) + 0.3 * np.sin(4 * np.pi * mf * hn)) * np.exp(-hn * 14)
            total[hs:hs + len(hn)] += pl * 0.28
            sh = rng.standard_normal(len(hn)) * np.exp(-hn * 60) * 0.06
            total[hs:hs + len(hn)] += sh - lowpass(sh, 0.5)
    x = total[: int(SR * seconds)]
    fade = int(SR * 1.0); x[-fade:] *= np.linspace(1, 0, fade)
    return x


if __name__ == "__main__":
    out = sys.argv[1]; secs = float(sys.argv[2]) if len(sys.argv) > 2 else 30
    for name, fn in [("whoosh", whoosh), ("thud", thud), ("pop", pop), ("gunburst", gunburst),
                     ("squawk", squawk), ("boing", boing), ("sad_trombone", sad_trombone)]:
        save(f"{out}/{name}.wav", fn())
    save(f"{out}/music_bed.wav", music_bed(secs), peak=0.7)
    print("wrote SFX kit to", out)
