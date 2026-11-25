# Clip 11 progress

source: 11_Nixon_Moon_Landing.mp4
frames decoded: 1050 (F0-F1049, 30 fps, 426x240)
frames inspected: 1050/1050 on seq sheets (all 88 sheets opened in order); 79 frames also checked with native crops (see crops/)
sheets opened: overview.png, wave.png, seq_F000000-F000011 ... seq_F001044-F001049 (88/88); also ../12/sheets/seq_F000000-F000011 (boundary check)
shots verified: S01-S07 (7 hard cuts incl. clip start; name card and stamp are overlays inside S01/S05)
last verified frame: F1049
audio: not played (no playback). VO lane = vo_words.csv (pocketsphinx ASR, approximate, many words wrong). SFX = waveform onsets only, unverified.

## Tools written (in crops/)
regdiff.py (region diff), track.py (template track), camfit.py (ORB similarity fit = camera scale/window), mouth.py (camera-compensated dark-pixel count), trackcomp.py, strip.py / grid.py (crop sheets).

## Log
- S01 0-349 office: pose swap F101, name card 113-150, mouth loop 7/7, push 202-349 measured, caption 211.
- S02 350-466 astronauts: mouth 7/8 loop, opposite-phase bob 18 f.
- S03 467-526 Apollo emblem + falling bills; no camera move.
- S04 527-668 Congress: push 1.174, staggered lid swaps 554/561/568/589.
- S05 669-910 office callback, face swaps 730/766, APOLLO 17 caption 740-813, fast push 837-849, stamp 844-850, dim 851-856.
- S06 911-981 podium, push 1.187, FG FX holds.
- S07 982-1049 family/TV pull-back, AUGUST, 1974 982-1015, pre-dim 1047-1048, stamp 2 starts F1049 (lands outside clip).

## Uncertain
- Stamp scale at F844 (~3.8x) estimated (mask match ambiguous); F845-850 measured.
- Identity of S06 foreground blobs (flame vs foliage) and S03 particle type (bills) from shape/colour only.
- S07 family pose changes: none seen on sheets; region metrics noisy from drifting smoke.
- All sound identities unverified; ASR words unreliable after ~25 s.
- analysis.md: content delivered in the final report (subagent write blocked by hook); lead saves it.
