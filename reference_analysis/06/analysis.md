# Clip 06 — Lincoln Battlefield Action (1050 frames, 35.0 s, 426x240 @ 30 fps)

Evidence folder: `reference_analysis/06/`. All frames 0-1049 inspected on seq sheets (`sheets/seq_*.png`); key frames on native crops (`crops/`). Mouth/impact timings are pixel-count measurements (`crops/redtrack.json`). Labels: **observed** = seen/measured; **estimated** = measured with visible uncertainty; **inferred** = implementation guess. VO lane = `vo_words.csv` (ASR transcript, approximate; word spellings are machine guesses, e.g. "falklands", "legends"). Audio: no playback, waveform onsets only (unverified).

## Shot table

| shot | first | last | start s | end s | type | story purpose / motivating VO (ASR, approx.) |
|---|---|---|---|---|---|---|
| S01 | 0 | 188 | 0.000 | 6.300 | map | Union troops leave Washington; Confederates march on the capital — "soldier out of washington ... general (Jubal) Early march ten thousand men at the capitol" |
| S02 | 189 | 310 | 6.300 | 10.367 | staged environment (crowd) | Capital defended by clerks and convalescents — "records were held like clerks and men's three out of hospital beds" |
| S03 | 311 | 530 | 10.367 | 17.700 | archive insert + date / name card / place | Set the scene: "on july 12 1864 ... lincoln road out of fort stevens and find them on the wall" |
| S04 | 531 | 688 | 17.700 | 22.967 | staged environment (presenter-style medium) | Lincoln standing defiantly on the parapet under fire — "when I worked in his ... don't ... I can't watch for a few ..." |
| S05 | 689 | 775 | 22.967 | 25.867 | staged environment, wide + camera reframe | Scale: tiny Lincoln exposed on the wall; a man nearby is hit — "like a surgeon just a few feet away" |
| S06 | 776 | 967 | 25.867 | 32.267 | archive insert + cartoon overlay + speech bubble | Holmes intro and his famous shout — "legends ... a young officer named oliver wendell holmes ... 'get down, you fool'" |
| S07 | 968 | 1049 | 32.267 | 35.000 | staged environment + stamp | Lincoln finally ducks; stamp payoff — "so only thing I've done ... in ... sin(ce)" |

Cuts: F189, F311, F531, F689, F776, F968 (hard cuts, single-frame metric spikes 53-77 mean_absdiff). F728-733 is a fast in-shot camera move, not a cut (metric ramps 16.7→47.1→41.5 over 6 frames). The earlier coarse notes ("8 cuts") overcounted.

---

## S01 — Eastern U.S. map (F0-188)

**Blocking / reveal order (observed, `crops/s1_map_keys.png`, `crops/s1_figs.png`).** Opens already composed: grey-tone state map (states in 4-5 light/mid greys, dark grey internal borders, thick dark-brown coastline outline), textured cloudy blue water at right/top (Great Lakes too). Red map pin with white centre ring at Washington DC (F0 box x0.69-0.72, y0.40-0.45). Confederate battle flag (x0.34-0.45, y0.55-0.70) with 3 grey-uniform soldier sprites to its right; US flag (x0.64-0.75, y0.60-0.76) with blue Union soldiers and one dark officer figure below it. Flags have a wavy cloth silhouette with dark outline (static drawings; any wave is too small to see at 240p).
1. F0-20: the Union group (US flag + blue soldiers) slides down/south, away from DC, with an ease-out (region diff 9.7 → 0.2). US flag ends y0.70-0.85 (observed motion, estimated values). Motivated by "a soldier out of washington" (F4-47).
2. F21-55: hold (mean_absdiff 0.1-0.4).
3. F56-188: camera eases into a push + pan toward the pin (content translation -48,+23 px cumulative at 240p, zoom ~1.36x judged from flag width 0.11W → 0.15W; mean_absdiff 0.5 at F56 → 4.1 at F120 → 2.4 at F188 = ease-in, still moving at the cut) (estimated). The Confederate group advances toward the pin, ending right next to it (flag-to-pin gap in map units shrinks ~30% F100→F188, estimated). Motivated by "early march ten thousand men at the capitol" (F110-190).
**Layers (back→front):** water texture; state fills + borders + coastline (one plate); pin; flags; soldier sprites. Map and markers scale together (camera move on a flat comp).
**Character design:** tiny chibi soldier sprites (~0.08H): big round heads, kepis, rifles held diagonally, stick legs.
**Camera:** see above; no shake.

## S02 — Street of walking clerks/convalescents (F189-310)

**Layers (observed, `crops/s2_street_keys.png`):** orange-red brick buildings with white-framed windows and teal trim (back plate); bg row 2 and row 1 of duplicated walkers (two designs alternate: dark-haired man in brown coat holding papers/satchel; brown-haired man in blue coat); grey crutch sticks among the rows; fg pair large (left: dark-haired brown coat, angry V-brows, small "o" mouth; right: brown-haired blue coat, flat brows, line mouth, white plaster cast on one leg). Grey street ground.
**Motion:** everyone walks in place toward camera; stick legs swing, heads bob. Head-region diff minima ~F204, F218, F231, F244 → step ~13-14 frames, drawn on 1s (no zero-diff frames) (estimated). Rows appear to share one cycle with offsets (inferred: duplicated walk-cycle layers). Very slow camera drift: content shift -10,-7 px over 121 f (estimated).
**Acting:** no lip sync, no blinks seen on sheets; expressions held. Purpose is the visual joke of a defending army of desk clerks and men out of hospital beds (cast, crutches).
**Character design / rig (inferred):** heads ~45-50% of the visible figure; thick black outlines (~2 px at 240p); flat fills; stick limbs with no visible joints; trapezoid coat bodies; legs are single black strokes.

## S03 — Fort Stevens archive photo (F311-530)

**Treatment (observed, `crops/cuts_a.png`):** sepia photograph of a fort with guns and soldiers, centred box x0.15-0.85, y0.04-0.95 over black/dark-brown side mats, dark vignette, vertical scratch lines and grain that flicker per frame (old-film look). Slow push: photo width 0.700W (F311) → 0.765W (F530), linear, continuing straight through the name-card dim (observed bounds).
**Text sequence (all hard on/off, 1 frame):**
- F332-400 "JULY 12, 1864": white bold rounded-sans uppercase, dark outline/drop shadow, bottom-centre x0.27-0.73, y0.80-0.90. Appears 2 f after ASR "july" (F330). 69 f.
- F401-453 name card: whole image dims to ~30% brightness (mean 93 → 28) and "ABRAHAM LINCOLN" appears centred x0.15-0.85, y0.45-0.56, white bold uppercase. 53 f (1.77 s); appears 9 f before ASR "lincoln" (F410). Undims in 1 frame at F454.
- F455-523 "FORT STEVENS": same style/position as the date; appears with ASR "stevens" (F454). 69 f. F524-530: clean photo for 7 f before the cut.

## S04 — Lincoln defiant on the parapet (F531-688)

**Composition (observed, `crops/s5_vs_s9_plate.png`):** Lincoln centred (x0.40-0.60 incl. arms, hat top y0.07, feet y0.80), standing on the pale-grey parapet top (wide band y~0.70-0.95, dark top edge line). Back→front: blue sky with white streak clouds; dark-blue-grey distant hill + green hill; bare brown-red trees (left) and a dark-green pine cluster (right) on the mid plane; parapet top surface; fg dark-green bush clumps bottom-left and bottom-right corners; FX overlay of translucent yellow radial light rays (fanning from above/behind Lincoln across the ground and trees) and white diagonal sky streaks; red impact FX. Parallax-ready layers: sky, hills, trees, parapet, fg bushes (inferred; no camera move occurs).
**Character design (observed):** Lincoln head (face + beard) ~0.21H, stovepipe hat ~0.16H, coat body ~0.20H, stick legs ~0.15H → head+hat : body+legs ≈ 1:1. Dark beard frame around a pale face, small black dot eyes under thick angry V brows, long nose line, grey frock coat with white bow-tie shirt front, stick arms held straight out sideways with black mitten hands, black stick legs planted wide. Outline ~2 px at 240p.
**Acting:** angry brows held throughout. Mouth loop (observed pixel count): open (dark-red shout shape) F536-544, 553-561, 571-579, 588-596, 606-614, 623-631, 641-649, 658-666, 676-684 — 9 frames each; closed frown 8-9 f between. Cycle ≈17.5 f, metronomic (not word-synced). Small whole-body bob: hat top y 10-14 px at 240p (~1.7%H) (estimated). No flinch at impacts (the gag).
**FX — impacts (observed):** red (pure ~#F21C1C) jagged splash/flame shapes, about 0.10-0.15W wide, pop on the ground left or right of Lincoln, change shape each frame, hard on/off. Left on: 531-535, 554-558, 574-578, 599-603, 619-623, 637-642, 657-662, 675-679. Right on: 541-547, 561-570, 586-590, 606-615, 624-629, 631-635, 644-654, 662-666, 669-674, 682-688. → alternate sides about every 10 f; each lasts 5-10 f.
**FX — rays:** ray and sky-streak regions change 1-4 per frame with no cumulative drift → looping shimmer (inferred: noise/turbulence or a 2-3-drawing loop).
**Camera:** locked.

## S05 — Wide wall view, reframe, Holmes is hit (F689-775)

**F689-727 wide (observed):** side view along the wall. Back→front: pale blue sky; dark-green tree left edge; Lincoln small (≈0.38H) standing on the wall top at x≈0.54-0.64; grey parapet face band (top line y≈0.57); fg tall grass/weed tufts along the bottom edge. Impacts: thin red spikes in the fg grass, popping in simultaneous left+right pairs: 690-693, 702-705, 707-711, 719-723, 725-728. Lincoln's shout mouth swaps continue (seen on sheets).
**F728-733 whip reframe + entrance (observed, `crops/s7_entry_hit.png`):** fast camera move (tilt down / pull back) reveals a lawn below the wall: wall top y≈0.58 → 0.33, Lincoln shrinks to ≈0.19H and moves to x≈0.80. On the same frames young Holmes slides in large from the left edge (F730 x<0.06, half off frame; F731 head and shoulders at left; F733 settled at x0.30-0.53, y0.13-0.88). Metric: 16.7, 23.2, 27.7, 39.2, 47.1, 41.5 → accelerating move, settles F734.
**Holmes design:** round head with brown hair, big round white eyes with black dot pupils, small mouth, white shirt, navy trousers, black stick arms with mitten hands, stick legs. Head ≈40% of height.
**F733-747 acting:** Holmes looks up-right at Lincoln (eye line to the wall top), worried: sweat drop on his temple, one hand raised, pointing. Small idle on 1s (region diff 0.4-3.3). Impacts multiply on the lawn (L 737-745, R 734-745, up to 6 at once).
**Hit (observed):** F748-750: big red horizontal jagged burst (x0.38-0.74, y0.13-0.59) strikes his head from the right, the direction of fire; 3 f. F751: one tumble frame (body rotated mid-air, red mark on head). F752-775: lying face-down, rotated ~90°, bottom-left (x0.03-0.43, y0.55-0.95), red splat on head, legs bent; impacts continue; Lincoln still standing far right. Pose swaps with no in-betweens except the single tumble frame.
**Motivating VO:** wide shot on "like a surgeon" (F691); reframe on "away" (F728); hit on ASR "falklands" (F748, probably "fell").

## S06 — Holmes portrait, talking photo, shout bubble (F776-967)

**Treatment (observed):** greyscale portrait (older Holmes, white moustache, robe) in a centred pillar box x0.27-0.73, full height, over side panels with a dark gradient (black top → brown-grey bottom). Vertical scratch lines flicker per frame. No push (box bounds identical F776-967).
**Caption:** "OLIVER WENDELL HOLMES JR." white bold rounded-sans uppercase, dark soft shadow, bottom-centre x0.09-0.91, y0.85-0.95, F776-893 (118 f). Cut and caption on ASR "legends" (F776). The name is spoken around F845-870.
**Cartoon face overlay (observed, sheets F888-967):** F893: drawn eyes appear on the photo face (white ovals, black dot pupils, thick black angry V brows) plus a small frown mouth; the caption leaves one frame later (F894). First open mouth F897. Open mouth = tall rounded black-maroon shape with white teeth top and bottom. Loop: open 897-899, 905-908, 914-916, 922-925, 931-933, 939-942, 948-950, 956-959, 965-967 (3-4 f alternating); closed 5 f between; cycle ≈8.5 f. The overlay is locked to the photo (it does not move).
**Shout bubble (observed):** white jagged/spiky bubble with thick black outline, text "Get down, / you fool" (black bold sans, sentence case, 2 centred lines). It grows from a point left of the face toward the top-left corner: F909 x0.15-0.23 (text already present, tiny); F910 x0.12-0.27; F911 x0.07-0.30; F912 x0.0-0.34; F913 full x0-0.39, y0-0.62, bleeding off the top-left edge. That is 5 frames with ease-out (scale ≈0.15, 0.35, 0.6, 0.85, 1.0, estimated). It holds 55 f to the cut, overlapping the photo's left edge. The text scales with the bubble (no type-on).

## S07 — Lincoln alarmed, ducks; stamp (F968-1049)

**Plate (observed):** the same background and Lincoln position as S04, but the yellow ray overlay and white sky streaks are removed (soft clouds remain). The heroic glow is switched off for the deflation beat. Lincoln's eyes are now big round whites with small pupils plus a pink cheek dot (alarmed), brows still angled.
**Mouth loop:** open 970-974, 980-984, 990-994, 1000; closed 975-979, 985-989, 995-999 → 5/5, cycle 10 f (faster than S04's 17.5 f = more panicked). Bob: hat top y 12-17 px (estimated).
**Impacts:** L 968, 984-988, 1009-1013, 1029-1033, 1047-1049; R 971-980, 996-1000, 1016-1025, 1034-1045. One right impact fades semi-transparent F1041-1046 instead of popping off.
**Duck (observed, `crops/s9_duck.png`):** no squash anticipation pose. The cue is FX: F998-1000, three thin white curved motion arcs (arcs curving down, x≈0.25-0.40, y0.30-0.75) appear beside his left side while he still stands; F1000 mouth opens. F1001: 1-frame swap to the crouched pose: hat top y0.07H → 0.36H (drop ≈0.30H). Only the hat, eyes/upper face and two mitten hands gripping the edge show above the parapet top line (y≈0.68); the parapet top acts as a foreground matte hiding the body. The arcs trail above his head on F1001 only. On ASR "done" (F1000); waveform onset F1000.
**Peek hold F1002-1049:** small eye/head changes on 1s (face-region diff 3-7, brief holds F1010, F1018, F1024-25, F1034-35); eyes shift side to side (estimated).
**Stamp (observed / estimated, `crops/s9_stamp.png`):** red ink, rectangular thick outline with no fill (scene visible through), grunge texture, red bold uppercase 3 centred lines "THE LAST PRESIDENT / TO COME UNDER / ENEMY FIRE". It enters oversized at F1026 (text runs off both edges) and shrinks: scale ≈2.6 (F1026), 2.3, 2.1, 1.9, 1.55, 1.2, then settles at F1032 (1.0). Settled box x0.30-0.81, y0.01-0.46 (top-centre-right, above Lincoln's hat), rotated ≈+8° clockwise (right side lower). It holds 18 f to the clip end. No scene dim or flash (brightness 115 → 119). Lincoln shows no reaction beyond the ongoing peek idle; impacts keep popping under the stamp.

---

## Character / rig notes (all clip)
- Single-drawing puppets with swappable face parts: mouth (closed/open) and eyes (dot/round) swap while the head, hat and body stay fixed (observed S04/S07 face crops). Brows are drawn with the eyes (they change together).
- Arms are stick strokes held in one pose per shot. Pose changes (duck, fall) are whole-drawing swaps with at most 1 in-between (F751) (observed).
- Line: black ~2 px at 240p (≈0.8%H); flat fills; no shading except the hill gradients and ray overlay.
- Inferred implementation: mouth/eye as sprite-swap layers parented to the head; whole puppet bob as a transform on the root.

## Audio findings (waveform only, unverified; see audio_cues.csv)
- Onsets at hard cuts: F311 (Δ0), F531 (+2), F689 (+1), F776 (+1).
- Onsets near graphics: date F331 vs F332 (-1); name dim F402 vs F401 (+1); place F453 vs F455 (-2).
- Impact-like onsets lie within ±2 f of S04 impact pops (F572/574, F608/606, F623/624, F663/662) but overlap VO.
- Whip reframe F727 (-1 vs F728); Holmes hit F750 (+2 vs F748); duck F1000 (-1 vs F1001).
- Stamp: onset F1032 = the settle frame, 6 f after the stamp first appears (estimated thud on landing).
- Sound identities are not verified.

## Reusable mechanics

1. **Hero-vs-deflated plate swap** — Reuse the same background and puppet position. Add a translucent radial ray overlay + sky streaks (shimmer per frame, no drift) for bravado. Remove it, widen the eyes and speed up the shout loop for the "uh-oh" callback. Evidence: F531-688 vs F968-1000. Starting values: ray opacity ~35% yellow, loop shimmer 2-3 drawings on 1s.
2. **Metronomic shout loop (not lip-sync)** — Mouth open/closed on a fixed cycle while a character yells. Calm defiance: 9 open / 8-9 closed (F536-684). Panic: 5/5 (F970-1000). Archive face: 3-4 open / 5 closed (F897-967). Editable: open_frames, closed_frames.
3. **Ground-impact FX** — Red jagged splash shapes, ~0.10-0.15W, hard pop on and off. Each lasts 5-10 f, redrawn per frame, alternating sides every ~10 f. In wides, use simultaneous pairs in the foreground grass. The target never flinches (deadpan). Evidence: F531-688, F690-728. One may fade out over 6 f instead of popping (F1041-1046).
4. **Hit = burst → 1 tumble frame → fallen hold** — 3-frame horizontal red jagged burst from the direction of fire, 1 rotated in-between, then a face-down hold rotated 90° with a red mark. Evidence: F748-775.
5. **Whip reframe with simultaneous entrance** — 6-frame accelerating camera move (tilt/pull) revealing a new foreground plane while the new character slides in from the frame edge and settles on the last frame. Evidence: F728-733. Values: wall y 0.58→0.33; subject scale 0.5x; ease-in.
6. **Duck behind a foreground matte** — 3 frames of white curved motion arcs beside the body as the anticipation cue, then a 1-frame pose swap down ~0.30H. The arcs trail for 1 frame. The parapet top line masks everything but the hat, eyes and hands, then a peek hold with small eye shifts. Evidence: F998-1049.
7. **Talking archive photo** — Static greyscale portrait in a centred pillar box over a dark gradient, name caption ~4 s. Cartoon eyes and mouth then appear on the photo face (1 frame before the caption leaves). First mouth-open 4 f later, then a spiky shout bubble grows in 5 frames (ease-out) from a point near the face into the top-left corner, with the text scaling with it. Evidence: F776-967.
8. **Archive establishing sequence** — Sepia photo with mats, vignette and flickering scratches. Continuous linear push +9.3%/219 f (≈0.03%W per frame) through all text beats. Date caption bottom-centre (69 f) → name card: global dim to ~30% + centred white name (53 f, hard on/off) → place caption (69 f) → 7 f clean → cut. Captions land 0-9 f from their word (date +2 after the word, name 9 before, place with the word). Evidence: F311-530.
9. **Tilted conclusion stamp** — Oversized ≈2.6x → 1.0 in 6 f (decelerating: 2.6, 2.3, 2.1, 1.9, 1.55, 1.2, 1.0), rotation +8°, settled top-centre-right (x0.30-0.81, y0.01-0.46) clear of the hidden character. Red outline + red text, no fill, no dim. Hold to the end of the beat. Audio onset at the settle frame. Evidence: F1026-1049.
10. **Map approach** — Composed map holds; one side's group eases away from the target (21 f ease-out). After a ~1 s hold the camera eases into a push/pan toward the pin (~1.36x) while the other side's group advances, still moving at the cut. Evidence: F0-188.
11. **Crowd of duplicates walking in place** — Two alternating character designs repeated in 2-3 depth rows, fg pair large, step ~13-14 f on 1s, with a very slow camera drift. Story props (cast, crutches) carry the joke. Evidence: F189-310.
