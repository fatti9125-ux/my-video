# Clip 10 progress

source: 10_Roosevelt_Election_Timeline.mp4 (426x240, 30 fps, 1050 frames, audio start 0.000)
frames decoded: 1050
frames inspected: 1050/1050 on seq sheets (inspected (sheet)); 129 of them also on native crops (inspected (sheet+crop))
sheets opened: overview.png, wave.png, all 88 seq sheets (F000000-F001049)
crops: crops/*.png (16 montages, native crops resized x1-x3 LANCZOS)
shots verified: S01 0-174, S02 175-230, S03 231-528, S04 529-1049 (all 4)
last verified frame: 1049
measurement scripts: _work/build_csv.py (CSV generation); camera/pop/stamp measurements done with ad-hoc ORB-affine and template/bbox scripts (values recorded in events.csv)
audio: not played (no playback); audio_cues.csv = waveform onsets only, unverified
deliverables: frames.csv, events.csv (31 events), audio_cues.csv (12 cues) written; analysis.md text handed to lead in the final reply (subagent write of analysis.md is blocked by hook)

## Log
- overview.png, wave.png opened.
- seq sheets F000000-F001049 opened in order (88 sheets).
- crops + measurements: S01 push curve, S02 dim ratio + text box, S03 Franklin mouth cadence (10 on/10 off), Washington gesture/angry/smug/exit track, camera pull-out curve, S04 pop-in bbox curves (1940, 1944), face swaps (679, 741), 1951 cut-on, stamp scale/rotation/position, layer pan-down curve.

## Uncertain
- Identity of founders other than Washington/Franklin (orange-vest = likely Jefferson, grey-wig scowler = likely Adams) - visual guess only.
- Washington's raised-hand sign at F346 (two fingers for "two terms"?) not resolvable at 240p.
- Whether S04 BG has a subtle animated noise texture or just compression shimmer (no measurable motion).
- All sound identities; onsets at F417/F679/F732/F998-1010 may be SFX or VO syllables.
- Stamp oversize at F998/F999 (3.3x/2.9x) estimated from partially cropped text.
