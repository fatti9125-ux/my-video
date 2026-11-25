# Clip 04: Van Buren Maps and Dialogue: frame analysis

Source: `04_Van_Buren_Maps_and_Dialogue(2).mp4`, 426x240, 30 fps, 930 frames (F000000-F000929, 0-30.967 s). Every frame was inspected on seq sheets (78/78). 131 frames were also checked on native crops (`crops/`). Measurements come from small numpy/cv2 scripts on the lossless PNGs, using pixel-colour components, region diffs and luma samples. Positions are normalised top-left (x/426, y/240).

Labels: **observed** = seen or measured on frames. **estimated** = measured within visible uncertainty. **inferred** = a plausible implementation.

VO lane: pocketsphinx ASR, approximate, about 0.1 s timing, and the words are often wrong. The likely narration is: "...maybe it's time to make a comeback. ... [Van Buren] was born in Kinderhook, New York, in an old Dutch farming town ... Dutch was the only language spoken at home ... English was a second language, picked up at the village schoolhouse, making him the last president to have to learn English on the way up ... and a man who finally ... the request ... 1773 ...". Phrase reconstruction is inferred.

## Shot table

| shot | first | last | start s | end s | type | story purpose / motivating VO (ASR approx) |
|---|---|---|---|---|---|---|
| S01 | 0 | 51 | 0.000 | 1.733 | presenter composition + diagram (tail of clip 03) | Jackson and the eagle presenter at a board with a falling red line: "maybe it's time to make a comeback" |
| S02 | 52 | 163 | 1.733 | 5.467 | map | New York State county map with the home county in red; Van Buren slides in: "...US president..." |
| S03 | 164 | 214 | 5.467 | 7.167 | name card over the S02 plate | MARTIN VAN BUREN title |
| S04 | 215 | 441 | 7.167 | 14.733 | map (local zoom) + place label | zoom from county to township map, caption KINDERHOOK, NEW YORK: "Van Buren was born in Kinderhook (ASR 'kindergarten'), New York" |
| S05 | 442 | 602 | 14.733 | 20.100 | staged environment, dialogue two-shot | Dutch-speaking Van Buren and a confused eagle; Dutch speech bubble: "Dutch ... spoken at home" |
| S06 | 603 | 929 | 20.100 | 31.000 | staged environment (classroom) + stamp + date label | child Van Buren learns English; LAST stamp; officer arrives and rips the paper; date FEBRUARY 9, 1773: "picked up at the village schoolhouse, making him the last president to have to learn English on the way up ... and a man who ..." |

---

## S01 (F0-51): board two-shot, tail of clip 03
- **Blocking (observed):**
  - Jackson (white hair, sour half-lidded eyes, dark coat) is at the left, x 0.02-0.38.
  - The eagle presenter (white head, glasses, half-lidded eyes, yellow beak, black suit and tie) stands centre-left, x 0.33-0.68. He holds a long black pointer aimed at a white board at the right, x 0.74-1.0, which shows a red zig-zag downward line.
  - The background is a pale grey office with grey cabinets. Close framing, cropped at the chest.
- **Motion (observed, measured):**
  - The board and the red line are static (board edge x = 321 px; red pixel centroid unchanged).
  - Jackson's head top moves between y 20 and 26 px. The eagle's head top moves between y 36 and 42 px.
  - Both bob about 6 px peak-to-peak (0.025 h) on a ~26-frame (0.87 s) period, per frame (smooth), in **opposite phase**.
  - There are no blinks or mouth changes.
- **Cut:** hard cut at F52, which coincides with a waveform onset at 1.74 s (delta 0).
- **Mascot role:** the eagle with glasses is the presenter at the board.

## S02 (F52-163): New York State map + presenter entry
- **Layers (back to front):**
  1. Textured mottled bright-blue painted "water" (approx. RGB 7,128,190, cloudy darker blotches). It does not move.
  2. State map: beige fill (approx. 211,195,165), thin dark county lines, thick black outer outline.
  3. Selected county filled red at x ~0.66-0.70, y ~0.55-0.65.
  4. Van Buren puppet.
- **Camera (observed):** completely static. Frame diff is 0.0 except for encoder pulses every ~7 frames. This **corrects** the prior notes, which claimed a slow push.
- **Van Buren entry (observed, measured):**
  - F157: only a hand shows at the right edge. F158-161: he slides in from the right.
  - Head centroid x is 416 (partial), 399, 377, 365, 363 px, so the per-frame deltas are -22, -22, -13, -2, 0. That is an ease-out over about 5 frames.
  - He settles in the lower right: figure x 0.77-0.95, y 0.45 to the bottom edge, legs cropped.
  - Pose: 3/4 front, arms out with open palms (shrug/presenting).
- **Character design (observed):** body is about 2.2 heads tall. Head:body is about 1:1.2, a big egg head on a short rectangular black coat with stick legs. Bald with grey side tufts, white shirt and bow tie. Line weight is about 1.5-2 px at 240p (≈0.7-0.8% of height). Arms are thin black lines with mitten hands. Hiding the shoulder joint under the coat outline is inferred.

## S03 (F164-214): name card
- Hard cut to the same S02 composition multiplied dark. Measured channel gains are R 0.246, G 0.234, B 0.232, with offset ≈0, so the plate drops to about 24% (≈76% darkening). The water reads deep navy (1,30,46).
- Text MARTIN VAN BUREN: white, bold geometric sans caps with a soft dark shadow, single line, centred. Bounding box x 0.148-0.850, y 0.458-0.538 (centre 0.50, 0.50); cap height ≈0.08 h.
- Entry and exit are both hard: 0 frames in and out. Hold is 51 frames (1.70 s). The underlying plate looks held; only minimal Van Buren idle shows under the dim.
- Waveform onsets: 5.53 s (F166, delta +2) and 7.25 s (F218, delta +2 to the cut back at F215). Unverified.

## S04 (F215-441): map return, county zoom, place label
- **F215-305:** the map holds. Van Buren holds his shrug with an idle bob: head top y 107-114 px, ≈3-4 px (0.015 h), period ~27 frames, per frame.
- **County zoom, F306-314 (9 frames, observed, measured):**
  - Map hierarchy: the county inset (township lines, a red town blob = Kinderhook) appears at F306 as a faint, tiny copy at the red county's position. It then scales up toward the upper left and centre over the state map.
  - Red town marker path: (290,152) → F308 (256,110) → (246,98) → (234,88) → (222,77) → (210,66) → (199,54) → F314 (193,50). That is about -12/-11 px per frame, constant, with a single deceleration frame at F314 (nearly linear, with a hard ease-out only at the end).
  - Marker area goes from 4 to 40 px. The county grows about 9x from its inset size.
  - Final county bbox is about x 0.29-0.71, y 0.08-0.97. I saw no clear rotation; the skew is the county's own shape (estimated).
  - The red county on the state layer stays visible beside the growing inset. The inset is on a layer above the state map, not a recolour of the county.
- **F315-316:** short hold with both maps at full opacity.
- **F317-324:** the state map fades. The sampled pixel R value goes 98, 80, 76, 60, 51, 36, 26, 13, 1, an approximately linear fade over 8 frames. Mid-fade it reads as a blue-grey ghost because the water shows through. It is gone at F324.
- **F347:** the caption KINDERHOOK, NEW YORK appears hard. White bold caps with dark outline/shadow, bottom centre, bbox x ≈0.09-0.93, y ≈0.83-0.90. It holds 95 frames to the cut and overlaps Van Buren's feet area.
- **VO sync:** the zoom starts on ASR "his Van Buren" (F305-313). The caption lands 3 frames after ASR "kinder-" (F344). Onsets at 10.08 s (F302), 10.45 s (F314, lands with the zoom end) and 11.52 s (F346, caption) are unverified.
- **Layer order (inferred):** water BG, state map (fade group), county inset (scale group, anchor at the red county), presenter, caption.

## S05 (F442-602): Dutch street dialogue
- **Background:** painted Dutch red-brick facades with tall white-framed windows and a step-gable silhouette at the top. A cobbled square in purple-grey; horizon at about y 0.55. Flat lighting.
- **Blocking (observed):**
  - The eagle (no glasses here) is full-body at the left, x 0.16-0.40, facing right toward Van Buren.
  - Van Buren is full-body at the right, x 0.55-0.78, in 3/4 view facing left toward the eagle.
  - Their eye lines meet in the middle of the frame. Both stand on the same ground line, feet at y ≈0.92-0.97.
- **Van Buren acting (observed, measured):**
  - Arms are raised wide in a proclaiming pose from F442 to F584. At F585 they swap in 1 frame to a low open-palm shrug as the sentence finishes typing (the text completes at F588).
  - **Mouth:** open (black oval) and closed (smile) alternate on an almost mechanical cycle.
    - Open: 444-451, 460-467, 475-482, 491-498, 506-513, 522-529, 537-544, 553-560, 568-575, 584-591, 599-602.
    - Hold lengths repeat 8, 8, 8, 7, about 7.75 frames per state (cycle ≈15.5 frames, 0.52 s), independent of word boundaries.
  - Head bob: head top y 91-95 px, period ~22 frames.
- **Eagle acting (observed):**
  - F442-521: raised brow, open eye, one hand raised near the beak (a puzzled "hmm"), the other arm low.
  - **F522: 1-frame swap** to a half-lidded deadpan eye (lid line, lowered brow) with both hands on hips, held to the cut. This lands 8-10 frames after the question marks complete.
  - Idle bob: beak y 117.0-120.3 px, about 3 px, period ~21 frames.
- **Speech bubble (observed, measured):**
  - First frame F463 is a dot near Van Buren's head at about (0.57, 0.42).
  - Width grows 85, 110, 134, 154, 167, 171 px over F467-472 (ease-out). Full size at F472: bbox x 0.167-0.568, y 0.004-0.416.
  - It is a white ellipse with a thick black outline (≈3 px) and a tail pointing down-right to Van Buren. It grows **from the tail-tip anchor** over 10 frames.
  - The bubble sits **behind the eagle's head**: the eagle overlaps its lower edge.
- **Type-on (observed):**
  - The text starts at F471 ("H") and completes at F588.
  - Final text, 4 centred lines: "Hoe minder de overheid / zich bemoeit met particuliere / zaken, hoe beter voor / de algemene welvaart" (96 characters).
  - Rate: 0.81 characters per frame (≈24 characters/s). Within words it adds 1 character per frame; at spaces and the comma it holds 2-3 frames (e.g. "zaken," held F543-545).
  - Lines are laid out in their final centred positions and never reflow. Inferred implementation: a character-index reveal on pre-laid-out text.
  - Type: black bold rounded sans, cap height ≈0.035 h.
- **Question marks (observed, measured):**
  - Two red hand-drawn "?" marks pop beside the eagle's head. The right one grows F509-512 and the left one F511-514, so they are staggered by 2 frames with 4 frames each. They scale up from the dot (bottom anchor).
  - Size ≈0.042 w x 0.117 h. Right mark at x 0.366-0.408, y 0.44-0.56; left mark at x 0.117-0.155, y 0.45-0.57.
  - They hold until the cut and do not wobble.
- **Mascot role:** the eagle stands in for the confused English-speaking audience as listener; the question marks and deadpan face are his reactions.
- **Cut:** hard cut at F603.

## S06 (F603-929): classroom, stamp, villain entry
- **Background and layers (back to front):**
  1. Warm beige/tan classroom wall and wood wainscot; light-blue window panes at the left; a dark doorway/cabinet at the centre.
  2. Teacher: bald, grey tufts, black coat, leaning in from the right, holding a thin stick.
  3. Child Van Buren: black bowl hair, red coat, left-centre.
  4. Brown wood-grain desk occluding lower bodies below y ≈0.8.
  5. Later the officer, overlapping the teacher.
  6. Stamp and dim layer.
  7. Date caption.

  The foreground desk is a separate occluding layer: bodies end behind it, which hides the legs entirely.
- **F603-707, child talks (observed, measured):**
  - Open: 603-608, 618-625, 634-641, 651-658, 667-674, 685-691, 700-707. Closed: 609-617, 626-633, 642-650, 659-666, 675-684, 692-699. Holds are 8-9 frames.
  - Speech stops at F708 and a closed smile is held.
  - The teacher listens with eyes down-left toward the child and desk. His face is static; only his body bobs (head top y 28-33 px, ≈5 px, period ~22 frames).
- **Left-side dim ramp (observed, measured):**
  - Starting about F636 (≈1.5 s before the stamp), the left and top darken progressively. Top-left luma goes 143 → 70 by F675, then about 30 after the push (F691), then 4 by F760. Bottom-left goes 101 → 1.
  - The right side is untouched. Overall brightness goes 125 → 81.
  - Inferred implementation: a gradient/vignette solid from the left whose opacity is animated, placed behind the stamp.
- **Push-in, F677-691 (observed, measured):**
  - Teacher head width goes 82 → 100 px (x1.22) and centroid x 272.7 → 321.2, so the push is anchored toward the upper right.
  - Ease in-out over 14 frames. It starts 4 frames before the first stamp frame.
- **Stamp, F681-687 (observed; scale estimated):**
  - Text "LAST PRESIDENT WHO / HAD TO LEARN ENGLISH / ON THE WAY UP": white bold geometric caps, 3 centred lines.
  - Box: grainy, noisy white border about 0.02 h thick around a dark translucent fill (≈60% black over the scene).
  - Rotation ≈ -8°, rising to the right.
  - Scale: F681-683 is about 2.5x final, semi-transparent, overflowing the frame (the frame mean rises from 88.7 to 131.9 because of the large white border). F685 is about 1.35x, F686 about 1.1x, and it is settled at F687 (≈7 frames, accelerating in).
  - Final position: top-left, box x ≈0.02-0.52, y ≈0.08-0.50, over the darkest part of the dim.
  - The child keeps talking under the stamp until F707. Nobody reacts to the stamp.
  - Waveform onset at 22.61 s (F678, delta -3 vs F681). Unverified; a stamp thud is estimated.
- **Hold:** F688-764 (77 frames from the first stamp frame).
- **Exit, F765-~781 (observed):**
  - The stamp fades out (fully transparent by about F781) while the dim lifts (top-left 4 → 146, F761-784).
  - At the same time the **camera pans right and pulls back slightly**, F760-818: teacher centroid 321 → 251 px (-0.165 w), width 100 → 92 (x0.92), ease in-out, 58 frames. This opens space at the right.
- **Officer entry, F797-804 (observed, measured):**
  - A grey-wigged officer (navy coat, gold braid stripes, angry slanted brows, sly smirk) slides in from the right edge.
  - Coat left edge: 408, 386, 368, 352, 340, 332, 328 px, an ease-out over 7 frames. After that he drifts only with the pan.
  - He overlaps the teacher's head on its right side (officer layer in front). His head is about the same size as the teacher's.
  - Onset at 26.50 s (F795, delta -2). A whoosh is estimated; unverified.
- **Paper, F814:** a white sheet pops into the officer's hands in 1 frame with no scale-in, then rises and rotates slightly over about 6 frames. The officer then freezes (region diff < 0.5, F821-850): no idle for the villain while he "presents".
- **Reaction, F822 (observed):** 8 frames after the paper pop, the teacher and child swap faces in 1 frame.
  - Teacher: sad up-slanted brows, light-blue tear blobs under both eyes, frown.
  - Child: flat brows, flat mouth, eyes side-glancing right toward the paper, a light-blue sweat drop at the temple.
  - Both hold to the end. The teacher's sob bob is about 6 px (y 18-24) on a ~22-frame period.
- **Rip, F853 (observed):**
  - Anticipation: the paper lifts slightly at F851-852.
  - F853 is a 1-frame swap. The paper becomes a torn half with a zig-zag edge, held centre-left; I could not tell whose hand holds it. The officer's face becomes a manic laugh: one huge round white eye, a wide open red mouth with teeth.
  - Red jagged slash shapes appear for **2 frames (F853-854)** at the tear.
  - Onset at 28.43 s (F853, delta 0). Unverified; a rip/hit is estimated.
- **Laugh loop, F855-929:** the officer's head bounces continuously, head top y 28-36 px (≈8 px, 0.033 h), period ~20 frames, per frame and smooth. The teacher (~22 frames) and child (~22 frames, ≈3 px) keep their own bobs, out of phase.
- **Date caption, F878:** FEBRUARY 9, 1773 appears hard. White bold caps with dark outline/shadow, bbox x 0.153-0.782, y ≈0.79-0.91 (lower centre, slightly left). It holds past the clip end (52+ frames).

## Character rig notes (all shots; inferred implementation unless noted)
- **Style:** flat cartoon puppets with a uniform black outline of ≈1.5-2 px at 240p. Skin is peach (≈240,205,185). Big egg heads with small dot eyes, a curved C nose, and a single-line mouth or a black open-mouth shape.
- **Independently changing parts (observed):**
  - Mouth: open/closed swaps.
  - Eye/brow set: lids, angle, tears, sweat drops. These swap as whole face states in 1 frame.
  - Arm set: whole-arm pose swaps, no in-betweens (Van Buren's shrug at F585, the eagle's hands-on-hips at F522).
  - Props: hard pop-in (paper F814).
- **What stays fixed:** head outline and hair stay fixed through expression swaps; the face states are overlays on the same head. Whole-body idle is a translate bob, not a joint rotation, so there are no visible joint breaks. Limbs are lines that join under the coat outline.
- **Eagle mascot:** white head, yellow beak, black suit and tie. Glasses appear only in presenter mode (S01). Stick legs and black line arms with mitten hands.

## Audio findings (waveform only; audio not played)
- All entries in audio_cues.csv are "unverified (waveform only)". Of 72 onsets, 16 fall within 6 frames of a visual hit:
  - cuts at F52 (0), F442 (0), F603 (+1)
  - name card on/off (+2/+2)
  - Van Buren slide-in (+3)
  - county zoom start/land (-4/-1)
  - caption (-1)
  - bubble pop (-2)
  - stamp (-3)
  - officer slide-in (-2)
  - reaction (+5)
  - rip (0)
- No onsets were found for the question marks (F509), the paper pop (F814) or the date caption (F878).
- Most remaining onsets are probably VO syllables or music. Sound identities are left blank or estimated only.

## Reusable mechanics
1. **Talk mouth = fixed toggle.** Open and closed alternate in ~8-frame holds (pattern 8,8,8,7), not lip-synced per phoneme; stop with a closed smile when the line ends. Evidence: F444-602 (Van Buren), F603-707 (child). Start value: `holdFrames = 8` (range 7-9).
2. **Continuous idle bob on every visible character.** Vertical translate, sine, per frame, amplitude 3-6 px at 240p (0.013-0.025 h), period 20-27 frames. Use opposite or offset phase for pairs. Evidence: F0-51 (antiphase, 26 frames), F215-441 (27 frames), F442-602 (21-22 frames), F603-929 (22 frames). Start values: `amp = 0.02 h`, `period = 24 f`, `phaseOffset = 0.5` between partners.
3. **Slide-in entrance from the frame edge.** Ease-out over 5-7 frames with per-frame deltas decaying from about 0.05 w to 0, and no overshoot. Evidence: F157-161 (Van Buren), F797-804 (officer). Start values: `duration = 6 f`, `easing = outCubic`, `startX = offscreen + 0.05 w`.
4. **Name card.** Hard-cut to the same plate multiplied by ≈0.24, with a centred one-line white caps name (cap height ≈0.08 h, soft shadow). Hold ≈1.7 s, then hard-cut back. Evidence: F164-214. Start values: `dimGain = 0.24`, `hold = 51 f`, `textY = 0.50`.
5. **Map zoom-from-region.** A detailed inset of the selected region scales from its location on the parent map up to about 9x in 9 frames (near-linear, hard stop with a 1-frame ease-out). Hold 2 frames, then fade the parent map linearly over 8 frames. The place caption hard-cuts on about 30 frames later. Evidence: F306-324, F347. Start values: `zoomFrames = 9`, `parentFade = 8 f`, `captionDelay = 33 f`.
6. **Speech bubble from the tail anchor, then type-on.** Bubble scale 0 → 1 over 10 frames, anchored at the tail tip, ease-out. The text starts on the bubble's 9th frame. Type 1 character per frame with 2-3 frame pauses at spaces and punctuation (net 0.8 characters per frame) into pre-laid-out centred lines. The bubble can sit behind a foreground listener's head. Evidence: F463-588.
7. **Confusion accent plus delayed listener swap.** Two red "?" marks pop with a bottom-anchored 4-frame scale, staggered by 2 frames, one each side of the listener's head, and hold. The listener's face and arm pose swap in 1 frame about 8-10 frames later. Evidence: F509-522.
8. **Stamp package.** The dim ramp starts about 45 frames before the stamp, from one side, opposite the subjects. A 14-frame push starts 4 frames before the stamp. The stamp starts at about 2.5x, semi-transparent, and settles in 7 frames, rotated about -8°, top-left, with a grainy white border, dark translucent fill and 3 white caps lines. The scene keeps playing under it, and the dim keeps deepening during a ≈2.5 s hold. Exit: the stamp opacity fades over about 17 frames while the dim lifts over about 23 frames and the camera pans and pulls to make room for the next beat. Evidence: F636-818.
9. **Make room, then enter.** The camera pans and pulls (58 frames, ease in-out) to open the side of frame the new character will enter from, and the slide-in happens during the pan. Evidence: F760-818, F797-804.
10. **Story-beat reactions are 1-frame face swaps.** Tears and sweat are light-blue drop shapes added to the face state. The listener's reaction comes about 8 frames after the visual cause (paper pop F814 → F822). The villain freezes while presenting the prop.
11. **Impact or rip.** A 1-2 frame anticipation lift, then a 1-frame pose swap with 2 frames of red jagged slash shapes. Then a continuous laugh bounce: about 8 px (0.033 h) on a 20-frame period. Evidence: F851-855 and F855-929.
12. **Date and place captions.** White bold caps with dark outline/shadow, lower area (y ≈0.79-0.91). They hard-cut on with 0 frames of animation and hold to the cut. Evidence: F347, F878.
