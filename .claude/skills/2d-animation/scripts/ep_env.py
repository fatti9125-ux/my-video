# Usage: python3 -I ep_env.py <force_aligned.json> <vo.mp3> <ep_out.json>  -> adds env (100 Hz, 0..9 for mouthAt) + stress beats
import sys, json, subprocess, numpy as np
fa, vo, out = sys.argv[1:4]
D = json.load(open(fa))
pcm = np.frombuffer(subprocess.run(["ffmpeg","-v","error","-i",vo,"-ac","1","-ar","16000","-f","s16le","-"],capture_output=True).stdout, np.int16).astype(np.float32)
n = len(pcm) // 160
rms = np.sqrt((pcm[: n * 160].reshape(n, 160) ** 2).mean(1) + 1e-6)
db = 20 * np.log10(rms + 1e-6)
env = np.clip((db - (np.median(db) - 18)) / 30, 0, 1)
D["env"] = [int(round(float(v) * 9)) for v in env]   # 0..9: mouthAt() treats >=3 as voiced
D["dur"] = round(len(pcm) / 16000, 2)
sm = np.convolve(env * 9, np.ones(7) / 7, "same")
thr = np.percentile(sm, 60)
pk = [i for i in range(1, n - 1) if sm[i] >= sm[i - 1] and sm[i] > sm[i + 1] and sm[i] > thr]
st = []
for i in sorted(pk, key=lambda i: -sm[i]):
    if all(abs(i - j) >= 45 for j in st): st.append(i)
D["stress"] = sorted(round(i / 100, 2) for i in st)
json.dump(D, open(out, "w"), separators=(",", ":"))
print(D["dur"], len(D["stress"]), len(D["words"]), len(D["lines"]))
