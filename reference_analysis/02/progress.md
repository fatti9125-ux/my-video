# Clip 02 progress

source: 02_Adams_Jefferson_Reactions.mp4
frames decoded: 1050 (F0-F1049)
frames inspected: 1050/1050 on seq sheets (all 88 sheets + overview + wave opened in order); 139 also with native crops (crops/)
shots verified: S01 0-174, S02 175-311, S03 312-570, S04 571-720, S05 721-837, S06 838-1049 (6 shots, 5 hard cuts + 1 name-card dim)
last verified frame: F1049
audio: not played (no playback); waveform/onset + RMS/low-frequency share only -> all cues "unverified (waveform only)"
deliverables: frames.csv, events.csv (41 events), audio_cues.csv (15 cues) written; analysis.md delivered to lead in final reply (Write hook blocks subagent).
validate.py: only error = analysis.md missing (lead saves it).

## Log
- Metric cuts: 175, 232 (dim on), 264 (dim off), 312, 571, 721, 838. Stamp1 25-31, push 13-28, pull 185-224, light change 458, swap 775, FG entry 777-821, pullback 999-1011 + stamp2 1008-1013, eagle pop 1025-1028.
- Mouth loops measured: Adams S03 5 open/5 closed; Jefferson S06 closed 5-6/open 7.
- Note: shared scratchpad collision with clip 01 analyst (their strip.py overwrote mine); two stray files I created in 01/crops (k_s01.png, k_s02.png) were deleted immediately. Scripts now in scratchpad/clip02/.

## Uncertain
- Sound identity of all cues (no playback). Stamp-hit timing only from low-frequency share.
- S06 F840-F998 BG drift (~3%) vs character sway not separable with ECC (head in mask).
- Exact stamp scale per frame between oversized start and landing (box clipped by frame at F25-F29, F1008-F1011).
- VO words are pocketsphinx ASR (approximate, several mis-hearings, e.g. "Aaron Burr" -> "you're in or").
