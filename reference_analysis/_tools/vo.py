"""VO word timings for one clip via offline pocketsphinx ASR (approximate words; timings ~0.1 s).
usage: python3 vo.py <clip.mp4> <NN> <root>  -> <root>/<NN>/vo_words.csv"""
import sys, subprocess, csv, re
from pocketsphinx import Decoder
src, NN, root = sys.argv[1:4]
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
d = Decoder(samprate=16000, loglevel="FATAL"); d.start_utt(); d.process_raw(pcm, full_utt=True); d.end_utt()
with open(f"{root}/{NN}/vo_words.csv", "w", newline="") as o:
    w = csv.writer(o); w.writerow(["start_s", "end_s", "start_frame", "word", "source"])
    for s in d.seg():
        if s.word in ("<s>", "</s>", "<sil>") or s.word.startswith("[") or s.word.startswith("<"): continue
        a, b = s.start_frame / 100, s.end_frame / 100
        w.writerow([f"{a:.2f}", f"{b:.2f}", int(round(a * 30)), re.sub(r"\(\d+\)$", "", s.word), "pocketsphinx ASR, approximate"])
print(NN, "ok")
