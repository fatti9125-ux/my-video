import sys, subprocess
from pocketsphinx import Decoder
f, a, b = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
pcm = subprocess.run(["ffmpeg","-v","error","-ss",str(a),"-t",str(b-a),"-i",f,"-ac","1","-ar","16000","-f","s16le","-"],capture_output=True).stdout
d = Decoder(samprate=16000, loglevel="FATAL")
d.start_utt(); d.process_raw(pcm, full_utt=True); d.end_utt()
print(f"{a:.0f}-{b:.0f}:", " ".join(f"{s.word}@{a+s.start_frame/100:.1f}" for s in d.seg() if s.word not in ("<s>","</s>","<sil>")))
