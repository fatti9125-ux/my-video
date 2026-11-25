# Clip 13: Clinton Budget Graphics, frame analysis

Source: `13_Clinton_Budget_Graphics.mp4`, 426x240, 30 fps, 930 frames (F000000-F000929, 0.000-30.967 s).
All 930 frames viewed on the 78 seq sheets. 155 frames were also checked on native-resolution crops (see `crops/c13_*.png`, `crops/s01_overview.png`). Measurements were taken from colour masks, centroid tracks and ORB affine fits on the native frames.
Labels: **observed** = seen or measured directly; **estimated** = measured, but with visible uncertainty; **inferred** = a likely implementation.
VO lane = `vo_words.csv` (pocketsphinx ASR, approximate; many words are garbled). Audio is from the waveform only and is not verified.

## Shot table

| shot | frames | seconds | type | purpose / motivating VO (ASR) |
|---|---|---|---|---|
| S01 | 0-82 | 0.000-2.767 | staged environment (Oval Office wide) | The previous beat's sad aftermath: the eagle salutes in tears and Clinton sits with eyes closed. The clip opens mid-beat. VO "...replace them and get a different..." |
| S02 | 83-192 | 2.767-6.433 | combination: location plate + diagram (money stack) + date label | Era setup. "1998-2001" caption, then cash piles up next to the president. VO "...from nineteen ninety..." |
| S03 | 193-241 | 6.433-8.067 | presenter composition / name card | Full-frame dim with a centred "BILL CLINTON". The card appears 1 frame after the ASR word "killed" (≈"Bill"), F192. |
| S04 | 242-763 | 8.067-25.467 | combination: dimmed location plate + diagram (trend arrows) + fact captions | Surplus story. The money leaves, a red up-arrow grows, then "SURPLUS" and "$236 BILLION". The red arrow falls away after "tech boom". Clinton frowns and a blue down-arrow grows on "cause a recession". |
| S05 | 764-929 | 25.467-31.000 | staged environment (Oval Office close) + conclusion stamp | Payoff: Clinton reads a paper and smiles. The stamp reads "THE LAST PRESIDENT TO ACHIEVE A BUDGET SURPLUS". The VO says "last president" only at F863, so the stamp comes about 3 s before the line. |

There are 4 hard cuts: F83, F193 (dim/card on), F242 (dim/card off) and F764. S03 reuses the S02/S04 composition: the same plate and stack sit under a dim layer. An affine fit of F242 vs F760 gives scale 1.0003, so there is no camera change.

## S01 (0-82): Oval Office wide, push-in
- **Layers (back to front):** window with bare winter trees; gold drapes and wall; US flag (left) and presidential flag (right); Clinton seated (torso visible); desk (foreground mask hiding his lower body); eagle standing at the left edge of the desk. The eagle's legs are visible, and its body overlaps the desk's left end.
- **Camera (observed):** one uniform push-in. Scale goes from 1.000 to 1.232 over 82 frames, linear at ~0.0028 per frame (+0.028 per 10 f, constant). The fixed point is the frame centre (≈0.50, 0.50). ORB affine fits at F10-F82 give the same fixed point. No easing is visible at either end, and the shot is cut while the camera is still moving.
- **Acting (observed):** this is a held tableau. The eagle salutes (hand at brow) with worried brows and 2-3 light-blue tear marks on the cheek. Clinton's eyes are closed (lid lines), his mouth turns down and his head is lowered. No mouth swaps or blinks are seen in the 3-frame-step crops (`crops/c13_s01_faces.png`).
- **Design:** thick black outline (~2 px at 240p, so ~9 px at 1080p), flat fills and no shading on the characters. The room has soft painted light (diagonal light band on the desk). Clinton has a large white/grey hair mass, a big nose and a moustache-like upper lip line. Head:body is ~1:2.5 for the standing eagle.
- **Mascot role:** the eagle is a mourning companion beside the president (saluting in tears). It does not speak on camera.

## S02 (83-192) + S03 (193-241): dusk lawn, date, money stack, name card
- **Establishing (F83, observed):** a hard cut to the White House north facade at dusk. Sky, clouds, the building and trees form one painted plate, and the lawn is a flat dark green. The **plate is pre-dimmed**: facade ≈ RGB 48, while the eagle's white stays at 255. This means the dim is a BG-only layer and the characters and graphics are undimmed (inferred implementation: a black solid at ~60-65% over the BG group only).
- **Characters:** the eagle (x≈0.03-0.17, standing, profile right, looking at Clinton) and Clinton (x≈0.16-0.29) are small at the bottom-left. Head top is at y≈0.56, and both are cut by the bottom edge at the shins. Clinton's eyes are slightly squinted, with a small smile line. The eagle's brows are worried. The eagle is the listener; the narrator is off-screen.
- **Date caption "1998-2001" (observed):** hard on at F83 (already present on the cut frame), hard off at F171. It sits top-centre at x0.324 y0.117 w0.345 h0.079, in white heavy geometric sans, all caps/numerals, with a dark soft outline/shadow and no box. Hold is 88 f (2.93 s).
- **Money drop (observed, `crops/c13_s02_money_in.png`):** green banded cash bundles fall in **side-by-side pairs** from above the frame. Each bundle is a flat-green parallelogram slab with a dark outline and a lighter $ sign. The mask detects 4 pairs, spawning at F117, F122, F127 and F131 (one every 4-5 f); the sheet reads as about 5 bands. The fall is ease-out. Pair 1's top y in px runs 2, 34, 58, 78, 94, 107, 116, 124, 130, 134, 138, 140, 140, 141, 144, 147, 148, so it covers 75% of the distance in 5 f and settles over ~16 f. Each higher layer lands ~4-6 px further right, which gives a **staggered, right-leaning pile**. The pile settles at F141 with bbox x0.50-0.82, y0.33-0.64. There is no bounce or squash beyond lower bundles being covered.
- **Name card (S03, observed):** at F193 the *whole* frame, characters included, dims in one frame. Mean brightness goes 46 → 15, and the eagle's white goes 218 → 55 (×0.25). A centred white "BILL CLINTON" sits at x0.258 y0.454 w0.481 h0.083, in the same font as the captions with no outline box. Hold is 49 f (1.63 s). Card and dim both cut off at F242, with no fade.
- **Idle (estimated):** both lawn characters bob continuously and independently. The eagle's bright-pixel centroid moves y 157.2-159.7 px (2.6 px p-p = 0.011 H) with a period of ~27 f. Clinton moves 1.4 px p-p with a period of ~30 f. The diff pulses in the head regions repeat every ~13-15 f, which matches the two halves of the bob. No mouth swaps are seen: the narrator is off-screen.

## S04 (242-763): trend arrows on the dimmed lawn
- **Money exit (F245-256, observed):** the pile does **not** lift up (this corrects the prior note). It **drops out the bottom of the frame pair by pair, bottom pair first**, one pair every ~4 f. Each pair accelerates (ease-in): the top pair's y runs 82, 106, 144, 178 at F253-256. The pile is gone at F257, and the plate holds clean for 12 f (257-268).
- **Red up-arrow (F269-278, observed; `crops/c13_red_grow.png`):** the shape is a thick red zig-zag (up, dip, up) ending in an open chevron head, with flat red fill and no outline. It grows as **one complete shape scaled from its tail** at the lower-left (≈0.38, 0.84). The whole zig-zag and chevron are visible at every size, and the stroke width scales with it (1.9 → 9.3 px). That is a grouped scale, **not** a progressive line draw. A faint speck shows at F269. The head's x position runs 193, 215, 239, 263, 285, 307, 331, 355, 377 px: linear, +22-24 px per frame, with no overshoot or settle. Best-fit scale rises ~0.11 per frame, about 9 frames total (0.3 s). The final bbox is x0.394-0.885, y0.175-0.821 (the diagonal crosses the facade toward the top-right trees).
- **Fact captions (observed):** "SURPLUS" is on at F312 (+4 f after ASR "surplus", F308), at x0.343 y0.117 w0.312 h0.079. At F338 it swaps in one frame to "$236 BILLION" (+1 f after ASR "two"), at x0.265 y0.108 w0.467 h0.100. It goes off at F404. The style matches the date caption: top-centre, white, outlined, no box. They sit above the arrow head's y range, so text and graphic don't collide.
- **Clinton gesture (observed, `crops/c13_gestures.png`):** at F391 his far arm (screen-right) swaps in one frame to a raised forearm with an open hand, with no inbetweens. This lands on the end of "...two hundred and thirty-six billion" (ASR F376-390). The pose holds 281 f and swaps down at F672.
- **Red arrow exit (F607-615, observed):** the arrow falls out the bottom of the frame. Its top y runs 42, 62, 82, 102, 123, 144, 164, 184, 202, 222, which is **~20 px per frame linear** (0.083 H per frame), with a small rightward drift (bbox x-min +2 px per frame, x-max +8 px per frame). That suggests a slight clockwise turn, estimated at a few degrees. The pixel count stays constant until it is clipped, so there is no fade or scale. It is gone at F616. This comes just after ASR "tech boom" (F579-593). The plate holds clean for 28 f.
- **Clinton expression swap (F640, observed):** a 1-frame swap to an angry frown: brows angled down toward the nose, mouth corners down, and 2 blue-grey marks on the cheek (an anxiety/embarrassment accent). The arm stays raised. It lands 8 f **before** ASR "cause a recession" (F648) and 4 f before the blue arrow. The eagle (listener) does not change: worried brows, eyes on Clinton.
- **Blue down-arrow (F644-669, observed; `crops/c13_blue_grow.png`):** the shape mirrors the red one in sky-blue (≈RGB 70, 190, 240): down, small rise, down to a chevron. It grows from its tail at the top-left, near the flag (≈0.40, 0.16), again as a **whole scaled shape** with the stroke growing 1.9 → 11 px. It is slower than the red arrow and eases out. The head's x position moves ~+9 px per frame over F645-662, then by 7, 6, 5, 4, 4, 2, 1 px per frame. Best-fit scale is 0.22 (F648), 0.39 (F652), 0.59 (F656), 0.78 (F660), 0.93 (F664) and 1.0 (F670): 26 f total (0.87 s) against 9 f for the red arrow. The final bbox is x0.40-0.88, y0.16-0.85. The blue arrow then holds 94 f with Clinton's arm down (from F672) and the frown held to the cut.
- **Layer order (inferred):** BG plate → BG dim → arrows / characters → captions on top. The arrows never overlap the characters, so their relative order is undetermined.

## S05 (764-929): Oval Office close-up + conclusion stamp
- **Cut (F764):** a hard cut to a tighter warm framing. The window with bare trees is behind; a flag sits left of centre; gold drapes; the desk runs across the bottom ~0.1 H as a foreground mask. Clinton is at right (head x≈0.60-0.82, y≈0.15-0.55). The eagle's head and shoulders are cropped at the bottom-left (x 0-0.22), in profile facing right and looking up at Clinton.
- **F764 single frame (observed):** for one frame the characters still show the S01 sad states (Clinton's eyes closed, the eagle's blue tear marks). At F765 Clinton swaps to a small smile, holding a white sheet of paper in both hands, and the eagle's face is neutral. This may be an editorial leftover or an intended "sad → pleased" pose swap on the cut. Treat it as an artifact unless you want the gag.
- **Stamp (F770-775, observed / estimated scale; `crops/c13_stamp.png`):** the text is "THE LAST PRESIDENT / TO ACHIEVE A / BUDGET SURPLUS": 3 centred lines, all caps, heavy sans. It is styled as white ink with a grainy/speckled (rubber-stamp) texture, inside a grainy white rectangular border with a translucent dark inner box. Rotation is ≈ -9° (the baseline rises to the right; minAreaRect on F776).
  - F770: oversized. The lines span the whole frame width, an estimated ~2.6-3x the landed size, and the text is already fully opaque.
  - F771-774: it shrinks toward the top-left: est. ~2.4x, 1.9x, 1.5x, 1.2x.
  - F775: landed. Centre (0.26, 0.33), size w0.56 h0.45 incl. border. No overshoot, bounce or shake; it then stays fixed to the end (154 f, 5.1 s).
- **Dim with the stamp (F772-775, observed):** the **background only** (wall, drapes, window, flag) darkens to ≈25% (curtain R 196 → 49). Clinton's face, the paper, the eagle and the desk keep full brightness (pixel means unchanged F769 vs F776/F800). So the dim layer sits between the BG group and the character + desk groups. It ramps over the last 4 landing frames (frame mean 170 → 82) and holds.
- **Acting after landing (estimated):** none: the smile and paper are held with no blinks or mouth swaps on crops at F776-F929. There is an idle bob only. The eagle's centroid moves 1.2 px p-p with a period of ~24 f; Clinton's moves ≈0.4 px.

## Audio findings (waveform only, unverified)
- The onset list is dominated by VO syllables. Candidates that coincide with visuals: F85 (cut at F83, +2), F123 (money drop pairs F117-131), F194 (name card F193, +1), F278 (red arrow reaches full size), F316 (SURPLUS, +4), F338 (caption swap, 0), F391 (arm swap, 0), F648 (blue arrow start F644, +4), F773 (stamp entry F770, +3).
- There is no onset at the start of the red arrow exit (F607); the nearest is F624.
- The VO continues through the stamp hold. ASR reads "so Clinton is the last president whose books came out..." from F834.
- Sound identities are left blank, except "estimated: stamp thud if present" at F773. See `audio_cues.csv`.

## Corrections to the earlier coarse notes
- The money pile leaves by **dropping down** out of frame (F245-256), not by lifting up.
- Both arrows **scale as whole shapes from the tail** (the stroke grows too). Neither is a stroke-reveal draw-on.
- The red arrow exits **downward** (~20 px per frame), not down-right with easing.
- There is no cut at 2.6 s inside S01. The opening is one 83-frame push-in.
- The stamp dim affects the BG only (characters and desk stay bright). The name-card dim affects everything.

## Reusable mechanics
1. **Pre-dimmed location plate for data graphics.** Keep characters at full brightness and multiply only the BG group to ≈35-40% luminance. Graphics then pop without leaving the location. Evidence: F83-F763 (facade RGB≈48 vs eagle white 255). Start values: BG dim black solid at 60%, characters and graphics above it.
2. **Name card = global hard dim + centred white caps.** Both appear in one frame and both leave in one frame. Evidence: F193-F241 (×0.25 brightness, 49 f). Start values: dim to 25%, text centred at y≈0.45, height ≈0.083 H, 1.5-1.7 s hold.
3. **Fact/date captions.** Top-centre, white heavy sans with a dark outline/shadow and no box. Hard cut on at the word (0 to +4 f after the word starts), swap in place for the follow-up number, hard off. Evidence: F83-170, F312-337, F338-403. Start values: y=0.11 H, cap height ≈0.08-0.10 H.
4. **Trend arrow = grouped scale from the tail.** The whole zig-zag and chevron (stroke included) scales 0 → 1 about the tail point. Use a linear 9 f for the "good news" red arrow (F269-278) and 26 f with ease-out for the "bad news" blue arrow (F644-669). Up-trend: tail bottom-left, head top-right. Down-trend: tail top-left, head bottom-right. Each covers ≈0.49 W × 0.65-0.69 H. Final stroke ≈9-11 px at 240p (≈0.04 H). No overshoot.
5. **Graphic exits by falling.** Arrows and money leave downward out of the frame instead of fading. Arrow: linear ~0.083 H per frame for 9 f with a slight clockwise drift (F607-615). Money: pairs drop bottom-first, 4 f each, staggered 4 f, ease-in (F245-256). Hold the clean plate for 12-28 f before the next graphic (F257-268, F616-643).
6. **Cash stack build.** Pairs of bundles spawn above the frame every 4-5 f, fall with ease-out (~75% of the distance in 5 f, settled by ~16 f), and land offset +4-6 px right per layer for a hand-stacked lean. Evidence: F117-F141.
7. **Listener/subject reactions as 1-frame swaps ahead of the word.** The arm gesture lands at the end of the number phrase (F391). The frown and cheek marks swap 8 f before "recession" and 4 f before the bad-news graphic (F640). Holds are long (281 f arm, 124 f frown). No inbetweens on face or arm swaps.
8. **Conclusion stamp.** It enters already opaque at ~2.6-3x, shrinks to land in 6 f (F770-775), tilts ≈ -9°, and parks top-left (centre 0.26, 0.33; w0.56). Use grainy white text and border over a translucent dark box. Simultaneously dim **BG only** to ~25% over the last 4 frames. Hold 5 s on a single pleased expression. The stamp can lead the VO line it states (here by ≈3 s).
9. **Idle life during long holds.** Use a slow, independent vertical bob per character: ~1-2.6 px at 240p (0.005-0.011 H), with periods of 24-30 f that differ per character. No blinks are used in this clip. Evidence: F242-F329, F776-F929.
10. **Opening drift.** One linear centred push of +23% over 83 f (≈0.28% per frame), cut while still moving. Evidence: F0-F82.

## Unverified / uncertain
- Audio identity and SFX presence: no playback.
- Exact stamp start scale: the oversized frames are cropped by the frame edges.
- Whether F764 is intended.
- Money pair count: 4 in the mask, about 5 bands visually.
- Exact rotation during the red arrow exit.
- Arrow-vs-character layer order: they never overlap.
