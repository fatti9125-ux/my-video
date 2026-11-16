#!/usr/bin/env bash
# Break a reference video into evidence for style analysis.
# Usage: analyze_video.sh <video.mp4> <out_dir> [sheet_interval_seconds=5]
# Produces: probe.txt, scenes.txt, sheets/*.png (timestamped contact sheets),
#           spectrum_first60.png, audio_stats.txt, motion_stats.txt
set -euo pipefail
VIDEO="$1"; OUT="$2"; STEP="${3:-5}"
mkdir -p "$OUT/sheets" "$OUT/seq"

ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate,sample_rate,channels \
  -of compact "$VIDEO" > "$OUT/probe.txt"

# Shot cuts (timestamps in seconds)
ffmpeg -hide_banner -i "$VIDEO" -vf "select='gt(scene,0.3)',showinfo" -an -f null - 2>&1 \
  | grep -o "pts_time:[0-9.]*" | cut -d: -f2 > "$OUT/scenes.txt" || true

# Contact sheets: one frame every $STEP seconds, 30 per sheet, timestamped
ffmpeg -hide_banner -loglevel error -i "$VIDEO" \
  -vf "fps=1/$STEP,drawtext=text='%{pts\:hms}':x=4:y=4:fontsize=16:fontcolor=yellow:box=1:boxcolor=black@0.7,scale=320:-1,tile=5x6" \
  -an "$OUT/sheets/sheet_%02d.png"

# Motion: how many frames are (near-)duplicates -> animating on 1s vs 2s/3s
TOTAL=$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of csv=p=0 "$VIDEO")
UNIQUE=$(ffmpeg -hide_banner -i "$VIDEO" -vf mpdecimate -an -f null - 2>&1 | grep -o "frame= *[0-9]*" | tail -1 | grep -o "[0-9]*")
echo "total_frames=$TOTAL unique_frames=$UNIQUE" > "$OUT/motion_stats.txt"

# Audio: loudness, silences, spectrogram of first minute
{
  ffmpeg -hide_banner -i "$VIDEO" -af "ebur128=framelog=quiet" -f null - 2>&1 | grep -A3 "Integrated loudness" || true
  echo "silences(-40dB,>0.3s): $(ffmpeg -hide_banner -i "$VIDEO" -af silencedetect=n=-40dB:d=0.3 -f null - 2>&1 | grep -c silence_end || true)"
} > "$OUT/audio_stats.txt"
ffmpeg -hide_banner -loglevel error -t 60 -i "$VIDEO" \
  -lavfi "showspectrumpic=s=1600x500:legend=1:scale=log:fscale=log" "$OUT/spectrum_first60.png" -y

echo "Done. Cuts: $(wc -l < "$OUT/scenes.txt"). Sheets: $(ls "$OUT/sheets" | wc -l). See $OUT"
