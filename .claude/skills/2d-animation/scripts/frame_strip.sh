#!/usr/bin/env bash
# Every frame of a short window, numbered, tiled into one image — for timing study.
# Usage: frame_strip.sh <video.mp4> <start hh:mm:ss or seconds> <duration_s> <out.png> [crop=W:H:X:Y]
set -euo pipefail
VIDEO="$1"; START="$2"; DUR="$3"; OUTPNG="$4"; CROP="${5:-}"
VF=""; [ -n "$CROP" ] && VF="crop=$CROP,"
ffmpeg -hide_banner -loglevel error -ss "$START" -t "$DUR" -i "$VIDEO" \
  -vf "${VF}drawtext=text='%{n}':x=4:y=4:fontsize=22:fontcolor=yellow:box=1:boxcolor=black,scale=256:-1,tile=9x5" \
  -frames:v 1 -an "$OUTPNG" -y
# Per-frame pixel change (0 = held frame). Pattern of zeros reveals 1s/2s/3s timing.
ffmpeg -hide_banner -ss "$START" -t "$DUR" -i "$VIDEO" -vf "${VF}signalstats,metadata=print:key=lavfi.signalstats.YDIF" \
  -an -f null - 2>&1 | grep -o "YDIF=[0-9.]*" | cut -d= -f2 | awk '{printf "%.1f ", $1} END {print ""}'
