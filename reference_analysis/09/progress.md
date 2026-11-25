# Clip 09 progress

source: 09_Coolidge_Night_Swearing_In.mp4
frames decoded: 1020
sheets: 85 seq sheets (12 frames each)
last verified frame: none

## Log
- Opened overview.png, wave.png, and all 85 seq sheets F000000-F001019 in order (first pass).
- Working notes (from sheets 516-1019): bedroom wake hold to F571; hard cut F572 to warm oath room "2:47 A.M." (text gone F634); slow push-in through oath room; hard cut F832 to wide bedroom with jagged wall hole at right, sleepy walk R->L to bed; F909 stamp+cut to closer bed shot with white whoosh arcs F909-911, stamp settles ~F911-912, holds to F1007; F1008 hard cut to White House lawn line-up (next segment).
- Notes 0-88 (key_A re-check): F0-37 previous segment tail: Harding in cream open car (black fenders, whitewall wheels) waving, olive night street, diagonal light shafts, confetti, held stamp "THE LAST PRESIDENT ELECTED ON HIS BIRTHDAY" top right (white grainy border, black box, rotated ~-12 deg i.e. rises to right? check). F38 hard cut: Harding bedroom (taupe/brown wall, curtains, window right edge); Harding in bed (grey hair, pink blush, frown), wife (grey hair bun, blush, dark blue dress) sitting behind reading newspaper. F80-83 4-frame push-in (scale up ~1.35x, anchor ~ Harding head); F84 settled: Harding eyes = X X, white jagged spirit spike shoots right from chest F84-87 (4 f), gone F88; wife mouth open (big black oval) from F83.
- Notes 89-161 (key_B): wife keeps mouth open (talking, oblivious) to dead X-eyed Harding; F132-141 wife slides out to the right (10 f, accelerating, ease-in), newspaper goes with her; F142-161 static hold of dead Harding alone (no motion, diff ~0).
- Notes 162-414 (key_C): F162 hard cut to Coolidge bedroom (cool blue-grey; teal curtain left of window; window with navy sky, moon, dark city skyline + moon reflection streak; CLOSED dark door with handle at right; bed with draped sheet; Coolidge asleep facing left/front, eyes closed). Date "AUGUST 2, 1923" F196-261 bottom centre, hard on/off. F262-296 name card "CALVIN COOLIDGE" centred, whole frame darkened (brightness 77->23.5), hard on/off. "PLYMOUTH NOTCH, VERMONT" bottom centre F348-413 hard on/off.
- Notes 415-516 (key_D): sleeper hold to F475 (subtle breathing?). F476 one-frame pose swap: Coolidge propped up on arm, head raised, eyes wide (glasses), looking right; first white streak wedges appear at right edge on door. F477-484 white jagged speed-streak wedges from right edge pointing left (wall burst) + grey debris chunks; car (black, spoked wheels) pushes in from right F478-484; door replaced by jagged dark hole; F485 streaks gone, car parked at right edge (x~0.68-1.0); wheels keep spinning F486-~516 (cell 38 diff ~15/frame) then stop.
- Measured camera (ORB similarity, cam.py in scratchpad): Harding push F80-83 scale 1.074/1.217/1.361/1.438 then hold (anchor ~0.13,0.22). Coolidge bedroom slow push F162-475 scale 1.000->1.075, S-curve (anchor ~0.10,0.23). Crash shake F476-482: scale 1.024/1.097/1.138/1.130/1.085/1.073 rot +0.9/+2.6/+4.5/+0.9/-1.6/-2.3/-0.8 deg, settles F483 at 1.072 (held punch-in). Oath room push F572-831 linear-ish 1.000->1.174, anchor (0.61,0.65) (lamp/eagle area), starts ~F580. Walk shot F832-907 static; F908 starts push (1.06) into F909 blended transition to close bed shot.
- Stamp F909-912: scale ~2.9/2.0/1.38/1.0 (x0.7 per frame), panel translucent until F912, centre travels from ~frame centre to (0.684,0.262); settled box 210x82 px (0.49w x 0.34h), rot +7 deg clockwise; white whoosh arcs over blanket F910-911. Prev-segment stamp F0-37 same size, rot +12 deg, centre (0.703,0.266).
- Measured oath-room acting (warped to F572, region diffs): only Calvin's mouth changes (open 8 f / closed 11 f, period 19 f, 14 cycles); all other characters, lamp and table static (no blinks, no flicker). Apparent brightness differences between sheet columns are not in the frames (lamp region 233-236 constant).
- Bedroom plate reuse: F832 framing = F162 framing (scale 0.9975); stamp shot F909+ = ~1.35x crop tilted down. Door -> jagged hole after crash persists in F832-908.
- Walk F832-907: linear travel -0.00323 w/frame, legs rotate per frame.

## Status (final)
- frames decoded: 1020; inspected on seq sheets: 1020 (880 sheet only, 140 sheet+crop).
- sheets opened: overview, wave, all 85 seq sheets; custom key sheets crops/key_A-D.png, oath, stamp, walk, face crops.
- shots verified: S01-S07 (all).
- last verified frame: F1019.
- deliverables written: frames.csv, events.csv (35), audio_cues.csv (17). analysis.md content handed to the lead in the final report (a hook blocks subagent writes to analysis.md); validate.py currently reports only "analysis.md missing".
- Uncertain: audio identities (no playback, waveform only); exact walk step period (legs per-frame, ~20 f per stride estimated); stamp scale at F909 (text clipped, ~2.9x estimated); camera matrix for F909/F912 close shot (few inliers); the identities of the young man and two bald officials in the oath room (not labelled on screen).
