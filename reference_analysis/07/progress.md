# Clip 07 progress

source: 07_Cleveland_Archive_to_Animation.mp4
frames decoded: 1050 (F000000-F001049), 30 fps, 426x240
sheets: 88 seq sheets, ALL opened in order (F000000-F001049), plus overview.png and wave.png
frames inspected: 1050/1050 on seq sheets; 127 of them also on native/x2-x3 crops (see frames.csv inspection_status)
shots verified: S01 0-209, S02 210-434, S03 435-618, S04 619-700, S05 701-1049 (all 5)
last verified frame: F001049
deliverables: frames.csv, events.csv (30 events), audio_cues.csv, crops/*.png written. analysis.md content handed to lead in final reply (subagent write hook).
audio: not played (no playback). VO lane from vo_words.csv (ASR, approximate, heavily garbled in places). SFX cues are waveform-only, unverified.

## Log
- Opened overview, wave, all 88 seq sheets.
- Cut/dim candidates from metrics confirmed: 93/145 are dim on/off inside S01 (not cuts); cuts at 210, 435, 619, 701.
- Camera measured with ORB similarity fits (scale, fixed point) for every shot; per-frame pull-out curve 701-744.
- Mouth loop (11f), eagle/Cleveland bob periods, waiter and eagle slide tracks measured from pixel masks.
- Caption on/off frames measured from white-pixel masks (all hard cuts, 1-frame).
- Stamp landing 723-729, hold 730-903, fade 904-917 measured from red-pixel masks; BG wash 708-770 / unwash 903-920 from saturation/brightness.

## Remaining uncertainty
- Stamp per-frame scale values are estimated (stamp overflows the frame 723-725).
- Whether any SFX exists at the stamp landing / eagle stop / name card (waveform only).
- ASR words around 4-7 s and 14-16 s are garbled; motivating phrases there are inferred.
- Prior clip-notes claims of a couple wave/arm swaps after 1892 were NOT observed (couple only bob).
