# Clip 02 — Adams & Jefferson Reactions: frame analysis

Source: `02_Adams_Jefferson_Reactions`, 426x240, 30 fps, 1,050 frames (F0–F1049, 0–35.000 s). Every frame was inspected on the seq sheets, and 139 frames also with native crops (`crops/`). Labels: **observed**, **estimated**, **inferred implementation**. Times are local. `end_s` is exclusive.
VO lane = `vo_words.csv` (pocketsphinx ASR, approximate, several mis-hearings). Audio was not played, so all sound cues are waveform-only and unverified.

## Shot table

| shot | first | last | start s | end s | type | story purpose / motivating VO (ASR, approximate) |
|---|---|---|---|---|---|---|
| S01 | 0 | 174 | 0.000 | 5.833 | staged environment (interior) + stamp | Tail of the previous punchline: Jefferson laughs over the fallen Adams. The stamp states the fact: "…the last and only president to lose his job to his own vice president" (VO 0.03–5.66 s) |
| S02 | 175 | 311 | 5.833 | 10.400 | staged environment (White House lawn), mascot presenter + name card | Question beat: "what was their role… also how [did] Jefferson [get] to the White House [in the first] place". The eagle is puzzled, the camera reveals Jefferson, and the name card lands on "Jefferson" |
| S03 | 312 | 570 | 10.400 | 19.033 | staged environment (columned interior), dialogue two-shot | "'cause in 1796 he ran for president against Adams and lost… which made him the vice president" |
| S04 | 571 | 720 | 19.033 | 24.033 | archive insert (oil portrait) | "then in 1800 Jefferson ran with his own running mate, Aaron Burr…" |
| S05 | 721 | 837 | 24.033 | 27.933 | staged environment (curtained room), reaction gag | "…it went to the House… thirty-six ballots…" Burr taunts and the foreground Jefferson is angry |
| S06 | 838 | 1049 | 27.933 | 35.000 | staged close-up (desk) + labels + stamp + mascot peek | "then in 1804… the twelfth amendment… the VP is all on one ballot, making Jefferson the last guy…" |

Edit grammar (observed): all transitions are hard cuts. The name card is an in-shot dim, not a cut. The cuts sit 1–3 frames before the VO word that starts the new beat (F175 vs "what" F178, F312 vs "cause" F315).

---

## S01 (F0–F174): fallen Adams, laughing Jefferson, stamp 1

**Blocking / reveal order (observed).** The clip opens mid-hold in a cool grey-blue room: panelled wall, white fireplace, curtain at right, pink patterned rug. Jefferson stands left of centre by the fireplace (x≈0.36–0.52, y≈0.25–0.85), laughing with an open toothy mouth, squeezed eyes and arms raised. Adams lies face-down at lower right (x≈0.58–0.92, y≈0.55–0.98): red coat, bent stick legs, a white wig blob at the head end. The eye goes first to Jefferson (motion, face), then the push carries it to Adams.
- F0–F2 are identical (the clip starts inside a hold). Jefferson moves every frame from F3 (head-region diff 2.1–4.7 per frame). **observed**
- **Correction to the prior notes:** Adams's legs do not flail. The leg and body regions are identical frame to frame for the whole shot. The only changes are codec blips at F43–44 and F67–68, which also appear in the BG. **observed** (`crops/k_s01.png`)
- **Push-in F13–F28 (observed, ECC):** scale 1.00 (F12) → 1.031 (F14) → 1.150 (F16) → 1.324 (F18) → 1.516 (F20) → 1.691 (F22) → 1.809 (F24) → ≈1.84 (F28). It eases in and out, with peak speed ≈0.095/frame at F18–20. The zoom anchor is near the lower right (≈0.75, 0.80), so Jefferson leaves frame left. There is no rotation.
- After the push, the laugh keeps looping as a sliver at the extreme top-left edge (motion minima every ≈11.5 frames: F36, 47, 59, 70, 82…). **observed / estimated period**
- **Stamp 1, F25–F31 (observed):** "THE LAST PRESIDENT / TO LOSE HIS JOB TO / HIS VICE PRESIDENT". Three centred lines in white heavy geometric sans caps.
  - At F25 the box is ≥432 px wide (≥2.0x, cropped by both frame edges). F30 is ≈1.20x. F31 is settled.
  - Settled box: 210x81 px = 0.493W x 0.338H, centre (0.352, 0.275), so top-left; rotation −8°.
  - No overshoot and no flash or dim of the scene. The scale ramp accelerates into the landing.
  - The push is still finishing (F25–F28) while the stamp lands.
  - Border and text are white with a speckled grain texture ("rubber stamp ink"). The box fill is a dark translucent grey-purple (estimated 40–50% black). The stamp holds still for F31–F174 (4.8 s), to the cut.
- **Acting:** Adams stays frozen in his fallen pose (the comedy is the stillness); Jefferson's laugh keeps looping. No camera move after F28.

## S02 (F175–F311): eagle puzzled, reveal of Jefferson, name card

**Layers (back to front, inferred):** sky with clouds → White House with flag → trees left and right → lawn → eagle (mid) → Jefferson (right, nearer) → dim/text overlay. The plate is bright and saturated: blue sky, green lawn, white building.
- **F175 (observed):** the eagle mascot is in mid close-up, centre-left. White head, yellow beak, black suit and tie. One hand is on the side of his head, brows are worried, and there are blue sweat drops on his head. He looks screen-right toward where Jefferson stands (the eye line pre-motivates the reveal). He has a small continuous idle (region diff 0.3–2.3 per frame).
- **Pull-back F185–F224 (observed, ECC on the top-left tree):** scale 1.00 (F184) → 0.962 (F190) → 0.882 (F196) → 0.748 (F204) → 0.611 (F212) → 0.520 (F220) → 0.502 (F224).
  - That is an ease-in-out over 40 frames, with peak speed ≈0.018/frame at F200–208. There is a tiny roll (≤0.7°, estimated).
  - Jefferson stands at the right (hand on chin, smug squint, arms folded). Mapping his left edge back through the camera transform gives the same world x at F204 and F224 (≈447–448 px), so he does not move: the camera alone reveals him. **observed/estimated**
  - Final framing: eagle small at x≈0.22–0.35, Jefferson at x≈0.55–0.82 (two-shot with the building between them).
- **Name card F232–F263 (observed):**
  - The whole frame is multiplied to ≈0.245 brightness in RGB, a hard one-frame switch on and off.
  - "THOMAS JEFFERSON" is centred in white bold caps: text box x 0.129–0.866, y 0.454–0.537, cap height ≈0.083H. No outline is visible on the dark plate; there is a soft shadow at most.
  - Duration 32 frames (1.07 s). It starts at VO "Jefferson" (ASR F230, +2 f) and ends at "white" (F263).
  - **The picture freezes under the card:** character region diff is ≤0.7 during the card vs 1.3–2.3 before and after. The scene resumes from nearly the frozen frame (F231 vs F264 diff 4.9, vs 7.9 for F231 vs F300).
- F264–F311: both characters sway continuously (speed minima every ≈14 frames). No new expression.

## S03 (F312–F570): 1796 two-shot, speaker vs listener, spotlight on "lost"

**Correction to the prior notes:** the left character is **Jefferson** (sandy hair, brown coat, orange vest, arms at hips) and he is the **listener**. The right character is **Adams** (grey curly wig, dark red coat) and he is the **speaker**.
- **Setting (observed):** a cream columned hall with a red carpet strip, dark wood door centre and a round medallion above it. Warm. The figures are cropped at mid-shin.
- **Adams speaking (observed):**
  - Mouth loop: strict **5 frames open / 5 frames closed**, starting 1 frame after the cut (F313). It runs to F570 without pausing for VO gaps.
  - Arm pose swaps on single frames: raised/open → hands on hips at F385; back to raised at F429; to hips at F470; to raised at F522, held to the cut.
  - The raised arm also waves continuously per frame between swaps (arm region diff 3–7 per frame).
  - Eyes look at Jefferson or the camera; eyebrows raised, cheerful.
- **Jefferson listening (observed):** squinting side-eye toward Adams, mouth closed throughout, no blink seen. Continuous vertical bob: wig centroid y 55.3–60.9 px, peak-to-peak ≈5 px = 0.021H, period ≈16–17 frames (≈0.55 s). The amplitude is smaller after F458.
- **Camera (observed):** a slow pull-back across the shot, measured from the medallion area 675 → 461 → 432 px². Scale 1.00 (F312) → 0.826 (F456) → 0.80 (≈F505, then still). It is roughly linear at −0.0012/frame and eases out at the end.
- **Date label F333–F379 (observed):** "1796", bottom-centre (x≈0.42–0.58, y≈0.81–0.89), white bold numerals, dark soft drop shadow. Hard on and off, 47 frames. It starts 4 frames after VO "seventeen" (F329).
- **Lighting change F458 (observed, one frame), on VO "lost" (ASR F450, +8 f):**
  - The whole frame is multiplied to ≈0.60, except a soft-edged vertical wedge of warm light falling on Adams, which keeps brightness 1.0.
  - The wedge spans x≈0.57–0.70 at the top and widens to x≈0.51–0.83 at the floor, with a soft edge of about 20 px.
  - Jefferson is also desaturated to grey-purple: face BGR (184,210,253) → (130,122,144).
  - It holds to the cut (F570). Adams keeps talking in full colour. Meaning: the loser is greyed out and the winner is spotlit.

## S04 (F571–F720): archive portrait of Aaron Burr

- **Treatment (observed):** an oil portrait (dark brown ground, white cravat) as a centred rectangle on pure black. The painting's own colour is kept, with no added sepia. Thin vertical film-scratch lines and edge flicker change every frame. The edges are soft and dark.
- **Ken Burns push (observed):** portrait width 215 px (0.505W) → 233 px (0.547W), a scale of 1.00 → 1.084. Roughly linear from F571, settling by ≈F695.
- **Labels (observed):** both are bottom-centre, white bold, at the same baseline (y 0.808–0.887, cap height ≈0.079H), with hard on and off.
  - "1800" runs F587–F631 (45 f), x 0.418–0.578. It **leads** VO "eighteen hundred" (ASR F596) by about 9 frames.
  - "AARON BURR" runs F698–F720, x 0.261–0.735, and exits with the cut. It starts with the VO name (ASR "you're in" F691).
- Why cut back to cartoon: the portrait introduces the real person, and the cartoon then carries the comic beat.

## S05 (F721–F837): Burr taunts, foreground Jefferson fumes

- **Setting (observed):** dark olive vertical curtain stripes, a darker doorway behind Burr, and a diagonal warm light patch on the floor at lower left. Burr is drawn with white hair, black coat and white cravat.
- **F721–F774, stern (observed):** brows down, mouth flat, eyes to screen-left. Continuous bob, with turning points at F728 and F738 (≈20-frame cycle) and wig-top y between 23 and 35 px.
- **Pull-back (observed, from Burr's size):** wig width 96 px (F741) → 87 (F763) → 79 (F774) → 70 (F787) → 58 (F805) → 53 (F820). Scale 1.00 → 0.55, ease-in-out from ≈F742 to F820, peak speed ≈F775–795. Burr drifts right from x≈0.56 to x≈0.65 as the frame widens.
- **F775 instant pose swap (observed, 1 frame):** stern → "nyah-nyah" taunt: tongue out, hands raised beside the ears, smug half-lidded eyes looking left. It lands on VO "ballots" (ASR F766, +9 f). It is held to the cut with a small bob and hand waggle.
- **Foreground entry F777–F821 (observed):**
  - The back of Jefferson's head (sandy hair, pink ear) plus a raised black fist enter from the left edge. F777 is a sliver; at F778 the head is mostly in.
  - It keeps travelling right with ease-out: the anger-mark centroid moves x 23 → 56 (F790) → 81 (F800) → 102 (F811) → 113 px (F821), then stays still.
  - Because it moves faster than the BG during the pull-back, this reads as foreground parallax. It sits 2 frames after the taunt swap (reaction delay ≈2 f).
- **Anger mark (observed):** a red four-stroke "cross-popping vein" on the back of the head, visible F778–F837. It shrinks with the pull and pulses about ±10% per frame.
- Staging: an over-the-shoulder two-shot. The listener is in the foreground, back to camera, at lower left, and the provoker is in the midground, right of centre.

## S06 (F838–F1049): Jefferson at the desk, 1804 → 12th Amendment, stamp 2, eagle peek

- **Setting (observed):** a warm gold interior with blurred columns and doors (BG out of focus = shallow-depth look), and a green-cloth desk with a paper in the foreground.
  - Jefferson in close-up: eyes closed, brows angled down/inward (proud), head slightly tilted, declaiming.
  - The camera is near static (BG drifts ≈3% scale, estimated, plus a slight character sway).
- **Mouth loop (observed):** closed 5–6 frames / open 7 frames, strictly alternating (period ≈12.5 f): 838–842 closed, 843–849 open, 850–854 closed, 855–861 open… It continues through the pull-back and stamp to F1049. The open mouth is a solid black oval.
- **Labels (observed):** both are hard on and off, bottom-centre, white bold.
  - "1804" is on from the cut frame, F838–F887 (50 f), at x≈0.43–0.63. It appears 13 frames before VO "eighteen" (ASR F851).
  - It hard-swaps to "12TH AMENDMENT" (superscript TH, x 0.197–0.803) at F888 on VO "twelfth" (F887, +1 f). That label is removed at F951 (63 f).
- **Pull-back / reframe F999–F1011 (observed):** Jefferson's wig width 152 → 147 (F1000) → 126 (F1003) → 105 (F1006) → ≈88 px (F1012). Scale ≈0.58, ease-in-out over 13 frames. He moves from centre to the right third (wig x 202 → 290 px), revealing the desk and paper at left and empty space top-left for the stamp. It starts on VO "making" (F1000).
- **Stamp 2, F1008–F1013 (observed):** "LAST MAN TO / WIN VP BY FINISHING / RUNNER-UP".
  - F1008–F1011 run off the frame; F1012 ≈372x131 px (1.76x); F1013 settled at 211x81 px = 0.495W x 0.338H, centre (0.324, 0.283), −8°.
  - That is 5 frame intervals, accelerating into the landing, with no overshoot.
  - It overlaps the last 4 frames of the pull-back. The stamp is the same size and rotation as stamp 1 (a template).
  - Fill: near-transparent or a slight tint on the warm scene (estimated). It holds to the end.
- **Eagle peek F1025–F1028 (observed):** the eagle rises from behind the desk between the paper and Jefferson. Visible white area ≈400 → 1230 → 2070 → 2265 px², so 4 frames, ease-out, no overshoot.
  - Wide blank eyes, one raised brow, beak closed, hand (black) on the desk edge. The desk cloth masks his body (foreground matte).
  - He holds still F1029–F1049 while Jefferson keeps talking. The reaction lands about 18 frames after the stamp settles. VO here: "the last guy" (F1031–1049).

---

## Character design / rig notes (estimated from 240p)
- **Line and palette:**
  - Thick black outlines: ≈2–3 px at 240p ≈ 1% of H, the same weight on faces, bodies and props.
  - Flat fills with no cel shading on characters; lighting is done with global multiplies and wedges, not per-character shading.
  - Faces are pale peach (BGR ≈184,210,253).
- **Proportions:** big oval heads; the eagle full-body is head ≈1/3 of total height. Bodies are rounded-rectangle coats with stick legs (single thick black lines) and simple black line arms with mitten or fist hands. Necks are hidden by the collar/cravat.
- **Faces:**
  - Eyes are black dots or arcs (squint lines when smug); brows are separate short strokes.
  - The mouth is a separate swap layer: a flat line (closed) or a black oval (open, sometimes with teeth).
  - Expression changes swap eyes, brows and mouth together while head outline and hair stay fixed (Burr F775, Jefferson F838 vs S03).
- **Independent parts seen:**
  - mouth (loops)
  - whole-arm pose (swap: raised vs hips, Adams S03)
  - arm wave between swaps
  - whole-body bob (vertical translate, possibly slight scale)
  - full-pose swap (Burr F775: arms, face and tongue all change in one frame)
- **Pivots (inferred):** body bob reads as translation from the feet or hips; there is no visible joint bending at 240p. Arms attach behind the coat edge (joints hidden by overlap).
- **Mascot (eagle):** white head and yellow beak; worried state = hand on head + blue sweat drops; peek state = wide eyes + one raised brow. He has two roles here: puzzled host (S02) and silent reaction gag at the punchline (S06).

## Camera and compositing summary (observed)
| move | frames | scale | easing |
|---|---|---|---|
| push-in to the gag subject before stamp 1 | F13–28 | 1.00 → 1.84 | ease-in-out |
| pull-back reveal | F185–224 | 1.00 → 0.50 | ease-in-out |
| slow pull under dialogue | F312–505 | 1.00 → 0.80 | linear, ease-out |
| Ken Burns on archive | F571–695 | 1.00 → 1.08 | linear |
| pull to fit foreground listener | F742–820 | 1.00 → 0.55 | ease-in-out |
| pull/reframe for stamp 2 | F999–1011 | 1.00 → 0.58 | ease-in-out |

Global dims: name card ×0.245 with a frozen picture; emotional relight ×0.60 with a light wedge. No shakes, flashes or vignettes, except the archive's dark edge.

## Text and stamps summary
- **Info labels:** white bold geometric sans caps or numerals, bottom-centre, cap height ≈0.08H, soft dark shadow, hard cut on and off. Holds of 45–63 frames. A label may lead its VO word by up to ≈13 frames or land within ±2 frames. A swap between consecutive labels is a single-frame replace (F887 → F888).
- **Name card:** a larger white bold line centred vertically (y≈0.45), over a ≈75% darken with a frozen picture, ≈1.07 s.
- **Stamps:** three-line white caps inside a white rectangular border with ink-grain texture, rotated −8°.
  - Settled at ≈0.49W x 0.34H, in the upper-left quadrant (centre ≈0.33–0.35, 0.28).
  - Enter at ≥2x, partly off-frame, and land in 5–6 frames with no overshoot.
  - Fill: dark translucent over a dark/cool scene, near-clear over a warm scene.
  - Held to the next cut or the clip end.

## Audio findings (waveform only, unverified)
- VO is continuous across the clip (`vo_words.csv`, approximate).
- Stamp 1: onset at 0.830 s = F25 (delta 0 vs stamp entry), plus a level and low-frequency rise at F29–31 near the landing. **Estimated:** stamp hit.
- Stamp 2: the low-frequency share rises at F1007–1010 (0.16–0.43), with an onset at 33.69 s = F1011 (+3 vs entry F1008). **Estimated:** stamp hit.
- Archive cut F571: the strongest onset flux (19.08 s, F572, +1), low-level and low-frequency-heavy. Possibly a soft whoosh or thump; identity blank.
- No onset is aligned with the tongue-out swap (F775) or the eagle peek (nearest onset F1030, +5). Gags appear to be carried by VO and visuals only, but this is unverified.
- See `audio_cues.csv` for all 15 candidates with deltas.

---

## Reusable mechanics (editable starting values)
1. **Stamp slam** (F25–31, F1008–1013).
   - Start scale 2.2–2.6x (box exceeds the frame), land in 5–6 frames with an accelerating ease (ease-in, e.g. cubic-in).
   - Overshoot 0, rotation −8°, settled box 0.49W x 0.34H centred at (0.34, 0.28), held to the cut.
   - White text and border with a grain texture; dark 45% fill on cool or dark scenes, near-clear on warm.
2. **Camera move into a stamp** (F13–28; F999–1011). Before a stamp, run an eased push of 1.8x over about 15 frames toward the gag subject, or an eased pull to 0.58x over about 13 frames that moves the subject to the right third. Overlap the stamp entry with the last 3–4 frames of the move.
3. **Name card = dim + freeze** (F232–263). Multiply the frame to 0.25 and freeze the underlying animation. Centred white caps, cap height 0.08H, 30–35 frames. Hard on at the name's VO onset (±2 f); resume the scene where it froze.
4. **Reveal by camera, not by entry** (F185–224). Keep the newcomer static in the world outside the frame. Pull back 2x over 40 frames, ease-in-out. The on-screen character's eye line points at the hidden one before the reveal.
5. **Dialogue two-shot with a fixed-cadence mouth loop** (F313–570; F838–1049).
   - The speaker's mouth alternates 5 open / 5 closed (or 7 open / 5–6 closed for slower declaiming) from the first frame of the shot, regardless of VO pauses.
   - The speaker's arms swap between 2 poses every 40–90 frames (F385, 429, 470, 522), with a continuous small arm wave in between.
   - The listener holds a side-eye squint with a vertical bob of ±2.5 px at 240p (≈±1% H) and a period of 16 frames.
6. **Emotional relight** (F458). On the loss word, use a one-frame global multiply of 0.60 plus a soft vertical light wedge (≈0.13–0.30W wide, widening toward the floor) on the winner. Tint the loser grey-purple (desaturate 70%, shift toward #907A82). Hold to the cut.
7. **Slow drift under talk** (F312–505). A linear camera pull of −0.12%/frame, reaching ≈0.80 over about 6 s, eased out.
8. **Archive insert** (F571–720). The portrait as a centred card on black at ≈0.5W, with a linear push of 1.00 → 1.08 over about 4 s. Per-frame vertical scratch lines and a soft dark edge, no sepia. Bottom-centre white labels: date first, then name, each 1–1.5 s, the name exiting with the cut.
9. **Taunt / anger reaction** (F775–821).
   - Taunt: a one-frame full-pose swap (stern → tongue out with hands at ears) during an eased pull-back of 1.00 → 0.55 over 78 frames.
   - Reaction: 2 frames later, the listener's back-of-head enters from the left edge as a foreground layer and travels right with ease-out over about 44 frames (faster than the BG = parallax).
   - A red anger-vein glyph sits on the back of the head, about 0.06H, pulsing ±10%.
10. **Mascot punchline peek** (F1025–1028). After the stamp settles (+12 frames), the mascot rises from behind a foreground prop (desk as matte) in 4 frames with ease-out and no overshoot. Wide blank eyes and one raised brow, then a dead-still hold to the end while the main character keeps talking.
11. **Label timing** (F333, F587, F838, F888, F951). Labels hard-cut on and off. A date may appear with the cut, up to 13 frames before its spoken word; a term label swaps within ±1 frame of its word. Hold 45–63 frames at bottom-centre (y≈0.81–0.89).
12. **Hard cuts lead the VO** (F175, F312). Cut 1–3 frames before the first word of the new beat.
