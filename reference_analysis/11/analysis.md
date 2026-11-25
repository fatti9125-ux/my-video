# Clip 11 — Nixon Moon Landing (1050 frames, 35.0 s, 426x240, 30 fps)

Evidence paths are relative to `reference_analysis/11/`. Labels: **observed** = seen on frames or measured; **estimated** = measurement inside visible uncertainty; **inferred** = plausible implementation. Camera numbers come from an ORB similarity fit (`crops/camfit.py`). Mouth cadence comes from camera-compensated dark-pixel counts (`crops/mouth.py`). VO comes from `vo_words.csv` (pocketsphinx ASR, approximate; many words are wrong).

## Shot table

| shot | first–last frame | start–end s | type | story purpose / motivating VO (ASR approx.) |
|---|---|---|---|---|
| S01 | 0–349 | 0.000–11.667 | staged environment + presenter composition (+ name card, date caption) | Oval Office phone call. "...the worst Richard Nixon" (F107-137) → name card; "on July twentieth 1969 he picked up the phone in the Oval Office" (F212-343) |
| S02 | 350–466 | 11.667–15.567 | staged environment (space plate) | "...talk to [the astronauts] standing on the moon" (F346-414); the phone motif carries across the cut |
| S03 | 467–526 | 15.567–17.567 | diagram/graphic (emblem + particles) | "...it'll cost a fortune" (F493-505) |
| S04 | 527–668 | 17.567–22.300 | staged environment (crowd cutaway) | "the public got bored of it" (F537-570), "so the last three missions got cancelled" (F602-650) |
| S05 | 669–910 | 22.300–30.367 | staged environment callback + mission label + stamp | "in December 1972 Apollo 17 lifted off, making [Nixon] the last president to put [Americans on the moon]" (F674-879) |
| S06 | 911–981 | 30.367–32.733 | staged environment (press podium) | lead-in to resignation (ASR unreliable, F893-987) |
| S07 | 982–1049 | 32.733–35.000 | staged environment with nested TV screen + date caption + second stamp (cut off) | "in August 1974" (F999-1040) → stamp "THE LAST PRESIDENT TO RESIGN FROM OFFICE" |

The name card (F113-150) and the stamp (F844+) are overlays inside S01 and S05, not cuts. The 7 shots are separated by 6 hard cuts (F350, 467, 527, 669, 911, 982); none are dissolves.

---

## S01 — Oval Office phone call (F0–349)

**Blocking and reveal order (observed).** Wide frontal office with a symmetric plate:
- Back wall: gold drapes alternating with tall multi-pane windows showing snowy bare trees; the US flag left of centre and the navy presidential flag right of centre.
- Nixon is seated centre-right in a dark-blue high-back chair, holding a white phone receiver to his right ear with his left hand (stick arm).
- The eagle mascot stands at frame-left behind the desk.
- A large wooden desk is the foreground occluder across the bottom third, hiding everyone below chest height.
- The eye goes first to Nixon and the phone (highest contrast: white receiver against the navy flag).

**Layers (back to front):** sky/trees in the windows → window frames and drapes → flags → chair → Nixon puppet / eagle puppet → desk (FG matte) → captions/overlays. Inferred: the drapes, flags, desk and characters are separate layers, but no parallax is used. The whole frame scales uniformly (similarity-fit residuals stay small).

**States and events:**
- **F0–100 (observed):** Nixon in an eyes-closed frown (squeezed lids), receiver at his ear. The eagle is neutral with stick arms out, palms up (a shrug).
  - Idle: eagle head 0 → −3 px (0.0125 H) and back on a ~36-frame cycle, with ~4-frame holds at the extremes. Nixon bobs ±1 px on ~31 frames (`track.py` F0-112).
  - This looks like the tail of a previous beat.
- **F101 (observed):** both characters swap in a single frame, with no in-betweens. The eagle gets worried raised inner brows and arms down at its sides; Nixon gets open eyes and a neutral face. VO "with" @F100 (+1 f). Evidence: `crops/s1_nixonface_99-110.png`, `crops/s1_eagle_99-110.png`.
- **F103–109:** Nixon's mouth opens (black oval with a tongue hint) for 7 frames and closes at F110.
- **F113–150 name card (observed).**
  - The whole frame dims to 0.245x brightness (about 75% darker), uniformly, with no vignette.
  - Text: "RICHARD NIXON", one line, all caps, white (249,249,248), bold geometric sans (Montserrat-like, estimated), no visible outline.
  - Position: x 0.204, w 0.570, y 0.429, h 0.083 (cap height ≈ 20 px = 0.083 H), centred.
  - The dim and the text cut on and off with no fade. The card appears at F113, 4 f before VO "richard" @F117, and holds 38 f (1.27 s).
  - The characters are frozen under the card (region diff ≤ 0.8).
  - At F151 the scene returns at the same framing with Nixon's mouth open.
- **F151–349 phone talk (observed).**
  - Nixon's mouth alternates open/closed on an exact 7/7-frame loop: open 159-165, 173-179, …, 341-347; closed 152-158, 166-172, …
  - The closed mouth alternates between two drawings, a slight smile curve and a neutral line (`crops/s3_mouth_variants.png`).
  - Brows, eyes and head stay fixed, so only the mouth part swaps. The loop is not synced to syllables.
  - The eagle holds worried brows and looks toward Nixon, with its 36-f bob continuing. No sweat drop was found (the prior-pass note is not confirmed).
- **F202–349 camera push (observed).** A centred zoom from scale 1.000 to 1.212.
  - The window goes from (0, 0, 1.0) to x 0.087, y 0.088, w 0.825; the zoom centre stays at the frame centre (0.50, 0.50).
  - Ease-in-out: about 0.001 scale/f at the start, peaking at about 0.0025/f around F250-292, and about 0.0005/f at the cut.
  - It starts on VO "cause on July" (F200-212).
- **F211–349 date caption (observed).**
  - Text: "JULY 20, 1969" in white bold caps with a thin dark outline / drop shadow.
  - Glyph bbox x 0.261, w 0.477, y 0.817, h 0.104; centre x 0.498.
  - Hard on at F211 (VO "july" @F212, leads by 1 f), held until the shot cut.
  - Screen-locked: it does not scale with the push.

**Character design and rig (observed / inferred).**
- **Nixon:**
  - Large head, about 40% of his visible seated height. Estimated head : body about 1 : 1.5 above the desk line.
  - Thick, uniform black outline, about 2 px at 240p (0.008 H).
  - Flat fills: tan-pink skin, dark grey swept hair with a lighter rim, black suit, white shirt, purple tie with a dot pattern.
  - Caricature: jowls, big bulbous nose, heavy dark brows.
  - Front view. Inferred separate parts: brows, eyes/lids, mouth, cheek accessory (tear/sweat), stick-line arm holding the receiver. Head and body are one piece in this shot: the whole puppet bobs.
- **Eagle mascot:**
  - White head, yellow-orange hooked beak.
  - Black suit with white shirt and black tie.
  - Thin black stick arms with small hands, so the joints are hidden in the line.
  - Swappable brows (neutral or worried) and arm poses (shrug or down).

**Mascot role:** a silent listener / reactor at frame-left. Its expression is set once per beat (worried from F101) and held.

## S02 — Astronauts on the phone (F350–466)

**Hard cut at F350 (observed).** Full-frame diff 100.8; brightness 119 → 57.
- The phone motif carries attention across the edit: Nixon's white receiver (screen right-centre, x ≈ 0.62) becomes a white receiver held by the right astronaut at about the same screen position (x ≈ 0.52).
- So the cut reads as "the other end of the call".

**Plate:** a deep navy starfield with a lighter centre glow and darker edges (radial vignette), and small static white dot stars. No ground line.

**Characters:**
- Two astronauts: white suits, white helmets with open visors showing cartoon faces, red shoulder patch, orange chest badge, stick legs.
- The right astronaut is about 1.3x larger (nearer). He holds the receiver to his helmet with his left hand and has his right arm raised in a wave (held).
- The left astronaut is smaller and stands listening.

**Acting (observed):**
- The right astronaut's mouth runs a 7-open / 8-closed loop (15-frame cycle): open 351-357, 366-372, 381-387, 396-402, 411-417, 426-432, 441-447, 456-462.
- Idle float: right helmet 0 → +3 px, left helmet 0 → −3 px (0.0125 H), opposite phase, 18-frame cycle with soft holds at the extremes.

**Camera:** static.

## S03 — Apollo emblem and money (F467–526)

- Hard cut to the NASA Apollo program emblem, centred: a grey ring with "APOLLO" / "NASA" lettering, a gold moon, Earth, and a black "A" glyph. It is real logo artwork on a navy starfield.
- **Particles (observed):** green paper-money rectangles fall across the whole frame and tumble.
  - About 56 visible blobs at F467, thinning to about 31 by F526.
  - Median motion: dy ≈ +2.5 px/f (0.010 H/f), dx ≈ 0, p90 speed 4-6 px/f. Each piece rotates frame to frame (inferred: a particle emitter above the frame with random spin).
- **Camera:** static (scale 1.0000 ± 0.0001). The prior-pass note of a slow push is not confirmed.
- **Purpose:** a visual pun for "cost a fortune" (VO F493-505).

## S04 — Congress audience (F527–668)

**Plate (observed):**
- Beige wall with pale panel mouldings, and a brown bench/desk band.
- About 9 near-identical congressmen in 2-3 depth rows: black helmet hair, jowly cream faces, dark suits with white shirts and black ties, one grey suit. Inferred: duplicated rigs with small variations.
- Two large brown leather chair backs fill the bottom as a foreground occluding layer.

**Camera:** a slow push from scale 1.000 to 1.174 over 141 frames, centred around (0.465, 0.50), slightly accelerating (about 0.0006 → 0.0013 /f).

**Idle:** heads bob on staggered phases. The centre head moves up to ±3 px on a ~20-frame cycle; the left head moves ±1 px.

**Reaction (observed):** individual heads swap to half-closed or closed (drowsy) lids, one after another, right to left:
- F554: far right
- F561: centre-right
- F568: left
- F589: centre-left, back row

This is −4 to +31 frames around VO "bored" (@F558). Evidence: `crops/s6_bored_pairs.png`. After that the bored/sleepy faces hold to the cut.

## S05 — Office callback, mission label, stamp (F669–910)

**Callback (observed):** the hard cut at F669 returns to the office at exactly the pushed framing where S01 ended (scale 1.214, window x 0.088, y 0.085, vs 1.212 at F346). Same plate, same puppets, same eagle worried face.

**Nixon:**
- F669–729: talks with the same 7/7 mouth loop (open 669, 677-683, 691-697, 705-711, 719-725).
- F730: swaps to stern neutral (flat brows, straight mouth line). The mouth stops, 5 f after VO "two" (@F725, "1972").
- F766: swaps to eyes-closed sad: squeezed lids with heavy lowered brows, downturned frown, and a small grey-blue tear/sweat mark on the left cheek. This is 10 f after VO "seventeen" (@F756) and before "lifted off" (@F776).
- He holds this face through the stamp (`crops/s7_face_states.png`).

**Eagle:** worried brows held through the shot; periodic bob with motion bursts every ~18 f (a 36-f up/down cycle).

**Mission caption (observed):**
- Text: "APOLLO 17", same style as the date caption (white bold caps, dark outline/shadow).
- Glyph bbox x 0.310, w 0.380, y 0.817, h 0.083; centre x 0.499.
- On at F740 (VO "apollo" @F742, leads by 2 f), off at F814 (hard). 74 f.

**Fast push into the stamp (observed).**
- F837–849: push/pan toward Nixon, from scale 1.0 to 1.24 by F843. The speed accelerates (0.017 → 0.041 scale/f) and then decelerates to 1.38 at F848, settling at about 1.365 from F849.
- The window centre moves to about (0.72, 0.46), pushing the eagle out of frame left by F843.
- The push starts at F837, between VO "last" (@F831) and "president" (@F846).

**Stamp (observed, `crops/s9_stamp_844-851.png`).**
- Text: "THE LAST PRESIDENT / TO PUT AMERICANS / ON THE MOON", 3 centred lines, white bold geometric caps.
- Inside a white rectangular outline box with no fill. Both text and border carry grunge speckle (ink-stamp texture).
- First frame F844 is huge, with letters overflowing the frame.
- Scale relative to the settled size (binary-mask matching): F844 ≈ 3.8 (estimated), F845 3.2, F846 2.7, F847 2.2, F848 1.75, F849 1.25, F850 1.0. That is a near-linear shrink of about 0.5/f with a half-step into the landing, so 6 frames to land.
- Centre path: about (0.51, 0.47) → (0.697, 0.31).
- Settled (F850–910): rotated clockwise about +10° (lines slope down to the right). Rotated bbox x 0.465, w 0.465, y 0.092, h 0.438; box about 185 x 106 px (0.43 W x 0.44 H, minAreaRect). It sits top-right, beside Nixon's head, not covering his face.
- No flash.
- It lands with VO "president" (F846). Hold: 61 f (2.0 s) to the cut.

**Dim (observed).**
- F851–856: the scene (not the stamp) darkens. Mean frame brightness goes 121 → 61 over 6 f (about −10/f, linear).
- Regional ratios: about 0.44 top-left, 0.65 lower-left. The stamp stays bright at about 215 grey-white.
- The dim holds to the cut (`crops/s9_dim_851-857.png`).

**Reaction after landing:** Nixon is already in the eyes-closed sad face (swapped at F766, 78 f earlier), so there is no new swap. The body bob continues at 0 → +4 px (0.017 H) on a ~30-f cycle (F857-910).

## S06 — Press podium (F911–981)

**Plate (observed):**
- Dark-blue velvet curtain with vertical folds and a lighter centre (spot-lit pool).
- US flag on a pole at the left; a brown podium/desk with a small microphone.
- Nixon stands behind it holding a white paper in both hands, with a grimace (eyes squeezed, deep frown). He is held, with no face swap (region diff < 3.3).
- The paper does not shake (prior-pass claim not confirmed).

**Foreground FX (observed):**
- Translucent, out-of-focus olive-green and orange jagged shapes at the bottom corners and right side.
- They swap drawings on irregular holds: changes at 914, 918, 922, 924, 928, 932, 939, 942, 943, 946, 953, 957 (holds of 1-7 f, mostly 4).
- Identity estimated: blurred foreground flames/foliage used as a depth/mood overlay.

**Camera:** a centred push from 1.000 to 1.187 over 70 f, about linear (0.0027/f).

## S07 — Family watching on TV (F982–1049)

**Plate (observed):**
- Cream living-room wall with panel mouldings.
- A flat TV on a grey box stand at the right. Nested screen: it shows the S06 podium plate (curtain, flag, Nixon with paper, FG blobs).
- A drifting purple-grey smoke/dust cloud frames the edges like a vignette.

**Characters:** a family of three, crude round-head style with stick limbs, a different (simpler) character style from the presidents. Poses are held through the shot (no swaps seen on the sheets; region metrics are noisy from the smoke):
- Boy in front: eyes squeezed, mouth open crying, sweat drop.
- Bald bearded dad: wide eyes, mouth open in shock, red shirt, holding a brown sofa back.
- Mom in a blue dress: both hands over her mouth, eyes glancing aside.

**Camera:** a pull-back from scale 1.0 to 0.725 over 66 f (window w 1.0 → 1.38). Ease-in-out: about 0.001/f at the start, about 0.006/f mid-shot, about 0.0013/f at the end. It reveals more of the TV and the room.

**Caption:** "AUGUST, 1974", same lower-centre style. Glyph bbox x 0.246, w 0.481, y 0.787, h 0.100. On at the cut (F982, 17 f before VO "august" @F999); hard off at F1016 (34 f).

**Second stamp:**
- F1047–1048: pre-dim, brightness 1.00 → 0.95 → 0.85. Here the darkening starts 2 frames before the stamp, the reverse of S05.
- F1049: the stamp's first frame, oversized (estimated 3-4x): "THE LAST PRESIDENT / TO RESIGN FROM OFFICE", white grunge, rotated counter-clockwise about −10° (opposite tilt to stamp 1).
- The clip ends here, and clip 12 starts on a different scene (Bush name card), so this landing is not observed.

---

## Audio findings

- **VO lane:** ASR transcript, approximate (`vo_words.csv`). It is continuous narration across the whole clip; the motivating words are in the shot table. ASR is reliable for "Richard Nixon", "July twentieth nineteen sixty nine", "phone in the Oval Office", "cost a fortune", "public got bored", "last three missions got cancelled", "December of nineteen seventy two", "Apollo seventeen lifted off", "the last president to put", "August nineteen seventy four". It is unreliable elsewhere.
- **SFX/music:** waveform-only, unverified (`audio_cues.csv`).
  - The strongest candidate is an onset at 28.08 s (F842, −18.9 dB), 2 f before the stamp's first frame (delta −2). It is estimated to be a stamp whoosh/thud, unverified.
  - Onsets near the cuts are within ±6 f (F350 −4, F467 +1, F669 +5, F911 +2, F982 +2) and could be transition swishes or VO syllables.
  - No sound identities are claimed.

---

## Reusable mechanics

1. **Stamp slam = 6-frame linear shrink.** Start at about 3.5-4x the settled scale, overflowing the frame, and shrink by about 0.5x per frame: 3.2, 2.7, 2.2, 1.75, 1.25, 1.0. Translate from near the frame centre (0.51, 0.47) to the settled spot (0.70, 0.31). No flash, no overshoot. Starting values: `scale = [3.8,3.2,2.7,2.2,1.75,1.25,1.0]`, `rotation = +10° (or −10°)`. Evidence F844-850 (observed; F844 estimated).
2. **Stamp style.** White grunge-speckled text, 3 short centred lines of bold geometric caps, inside a white outline box with no fill. It sits top-right beside the subject's head (box ≈ 0.43 W x 0.44 H rotated bbox at x 0.465, y 0.09), tilted ±10°. Consecutive stamps alternate tilt direction (F850 clockwise, F1049 counter-clockwise).
3. **Push into the stamp.** A fast camera push toward the subject starts about 7 f before the stamp and finishes under it (1.0 → 1.37 over F837-849, accelerating then stopping). The subject ends up framed left-of-centre so the stamp has the right half. Evidence F837-849.
4. **Dim after landing.** Darken the scene layer (not the stamp) to about 50% brightness linearly over the 6 frames after landing, then hold about 2 s to the cut. A variant pre-dims 2 f before the slam (F1047-1049). Evidence F851-856.
5. **Name card.** A uniform full-frame dim to about 25% brightness plus centred white bold caps (cap height ≈ 0.083 H, no outline). Hard on/off, appearing about 4 f before the name in the VO, held about 1.3 s, with the puppets frozen underneath. Evidence F113-150.
6. **Lower captions** (date / mission / label). White bold caps with a dark outline/shadow, centred at y ≈ 0.79-0.82, cap height ≈ 0.08-0.10 H. Screen-locked during camera moves; hard on, 0-2 f before their VO word (or at the cut), hard off. Evidence F211, F740-813, F982-1015.
7. **Mouth loop for phone/dialogue.** A fixed open/closed loop of 7/7 frames (or 7/8), not lip-synced, alternating two closed drawings for variety. Brows/eyes/head stay fixed during talk. Stop the loop on a beat change and swap the whole face. Evidence F151-349, F669-729, F350-466.
8. **Expression swaps** are single-frame replacements of brows + eyes + mouth (+ tear/sweat accessory), landing 1-10 f after the motivating word, then held for seconds. Evidence F101, F730, F766.
9. **Idle bob on every visible puppet.**
   - Main characters: 1-4 px at 240p (0.004-0.017 H), 30-36 f cycles.
   - Paired or crowd characters: opposite or staggered phase (astronauts ±3 px / 18 f opposite phase; congressmen staggered ~20 f).
   - Evidence F0-112, F350-466, F527-668, F857-910.
10. **Every shot has a slow camera move.** Centred pushes of 1.17-1.21x over 2.3-5 s (ease-in-out or linear), or a 0.725x pull-back that reveals context (TV). Hold the static setup for about 1.7 s before starting a push (F151-201). Evidence: S01, S04, S06, S07.
11. **Callback framing.** When returning to an earlier setting, cut back in at the exact framing the previous visit's push ended on, so the sequence feels continuous. Evidence F346 vs F669.
12. **Motif bridge across a cut.** Keep a salient prop (the white phone receiver) at a similar screen position across the cut to explain a location jump (office → space). Evidence F349/F350.
13. **Staggered crowd reaction.** Duplicated extras react one by one (lid swaps every ~7 f, right to left, plus a late fourth), starting around the motivating word. Evidence F554-589.
14. **Graphic pun insert.** A centred emblem with a full-frame particle layer (green bills falling about 0.01 H/f with per-frame spin, density thinning over 2 s) and a static camera. Evidence F467-526.
15. **Nested screen reaction.** Show reaction characters in the foreground and the earlier event shot playing on an in-world TV, with a drifting smoke vignette and a pull-back to reveal it. Evidence F982-1048.
