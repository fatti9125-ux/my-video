# Clip 10 - Franklin D. Roosevelt: election timeline (10_Roosevelt_Election_Timeline)

Source: 426x240, 30 fps, 1050 frames (0-1049, 0.000-34.967 s), audio starts at 0.000. All frames were inspected on seq sheets. Native crops are in `crops/`. Labels: **observed** (seen or measured), **estimated** (a measurement with visible uncertainty), **inferred** (a guess at how it was implemented). VO = `vo_words.csv` (ASR transcript, approximate). Positions are normalised x/width and y/height from the top-left.

## Shot table

| shot | first | last | start s | end s | type | story purpose / motivating VO (ASR, approx.) |
|---|---|---|---|---|---|---|
| S01 | 0 | 174 | 0.000 | 5.833 | staged environment + presenter composition (mascot) | FDR's hidden disability: "couldn't stand in the receiving line without the country finding out what polio had done to his legs" (0.08-4.93 s) |
| S02 | 175 | 230 | 5.833 | 7.700 | name card over the dimmed S01 plate | introduction: "...Franklin D. Roosevelt" (6.24-7.2 s) |
| S03 | 231 | 528 | 7.700 | 17.633 | staged environment (interior group) | the two-term tradition: "broke the one rule nobody had ever broken. Washington walked away after two terms, and for a hundred fifty years every president treated them like law" (7.57-16.72 s) |
| S04 | 529 | 1049 | 17.633 | 35.000 | timeline / diagram + ending stamp | FDR's four elections, the 22nd Amendment (1951) and the punchline stamp: "nineteen forty... (again)... forty four... passed the twenty second amendment... which means that the... last president" (17.88-34.66 s) |

There are 3 hard cuts (F175, F231, F529) and no dissolves or wipes. The clip ends mid-hold on the stamp (F1009-1049), so the beat may continue into clip 11.

---

## S01 (F0-174): FDR in a wheelchair on the White House lawn, with the eagle

**Blocking and reveal order (observed):** The shot opens on a fully built tableau with no entrances. The eye goes first to FDR, slightly right of centre (head ~0.55-0.6w, ~0.3h at F0), then to the white eagle head to his right (~0.8w). FDR sits in a wheelchair turned three-quarter to the left, chin resting on his hand (a weary or brooding pose). The eagle mascot stands behind the chair's right side with one hand on FDR's shoulder (a supportive gesture). No one speaks on screen: the VO narrates over a held tableau.

**Layers, back to front (observed):**
1. Sky band (light blue ~#9dd2f2) with cartoon clouds.
2. Tree line of rounded green trees at the horizon (~0.17-0.25h).
3. A row of tiny duplicated crowd figures along the horizon, like a distant formation or receiving line.
4. Lawn: saturated yellow-green (~#8da318) with darker mown stripes and a soft shadow ellipse under the group.
5. Wheelchair: dark grey frame, black spoked wheels, footrest.
6. FDR: grey-blue pinstripe suit, white shirt, tie, grey-white hair.
7. The eagle: black suit and tie, white head, yellow beak.

All layers move together. No parallax was measured; the camera scales everything as one flat picture.

**Character design (observed / estimated):** The art is flat colour with a uniform black outline of ~2 px at 240p (≈0.008h); fills have no shading.
- **FDR:** a large head (head:torso about 1:1.5 while seated) with a long nose, heavy lids, down-turned mouth and a sweat drop on the temple. His arm is a thin black stick-like limb ending in a mitten hand at the chin. He has no visible elbow joint; the arm is drawn as one curve.
- **Eagle (mascot):** a big white head with a yellow beak (head ≈ 40% of figure height), worried curved brows, a black suit body and stick legs.

**Acting (observed):** FDR, the eagle and the background never visibly change. There is no blink, no brow change, no lip motion and no idle bob. I checked stabilised region diffs; the peaks at F057 and F162 are compression and registration noise (crops/s01_faces.png, s01_c57.png). The coarse notes claimed "the eagle shifts expression at about 5.2 s"; that is **not confirmed**, because the worried brows are present from F0. The emotion is carried entirely by the held drawings and the slow push.

**Mascot role:** a silent, sympathetic companion with a hand on the shoulder and worried brows. He is a listener figure, not a pointer.

**Camera (observed, measured with ORB affine):** One continuous push-in for the whole shot, with no hold before the cut.
- Scale goes from 1.000 to 1.319 at F170, about +0.0019 per frame, nearly linear (slightly slower over the first ~10 frames).
- The zoom's fixed point is about (0.84, 0.47), near the eagle, so FDR drifts left (x 245 → 209 px at 426 width) as the frame tightens on him.
- Rotation stays under 0.6° (noise). There is no shake.

**Text:** none.

---

## S02 (F175-230): name card "FRANKLIN D. ROOSEVELT"

- **Edit (observed):** A hard cut at F175. The plate is the S01 composition pushed ~2.7% further than F174, then frozen: the camera scale stays at 1.000±0.001 over F175-230.
- **Dim (observed):** The plate is darkened to ~24-25% of its brightness (a sampled BG patch goes from RGB ~(138,163,24) to ~(35,40,6)). There is no blur and no vignette; the dim is uniform.
- **Text (observed):** "FRANKLIN D. ROOSEVELT" in all caps, one line, centred.
  - Heavy geometric sans (Montserrat ExtraBold-like, estimated), pure white, soft dark drop shadow, no outline stroke.
  - Box: x 0.085-0.915, y 0.454-0.533; cap height ≈ 0.07h.
  - Full size and full opacity on its first frame, with no scale-in or fade. It holds 56 frames (1.87 s) and is removed by the hard cut at F231.
- **VO sync (estimated):** The card appears ~0.4 s before ASR "franklin" (6.24 s), so the name is read while it is spoken.

---

## S03 (F231-528): founders' room, two-term tradition

**Blocking (observed):** A warm interior: tall dark-paned windows with cream mullions, beige drapes with scalloped valances, a US flag on a pole, a polished red-brown table across the lower frame (~0.75-1.0h) and a striped wood floor. At F231 three figures stand behind the table:
- **Franklin-like founder** at left (white side-hair, red-brown coat). He is the speaker.
- **Washington** at centre (white wig, navy coat with gold trim, arms crossed, closed smile).
- **Jefferson-like founder** at right (orange vest, brown coat).
- A **grey-wigged founder** cut off at the right edge (arms crossed, scowling); call him Adams-like.

Identities other than Washington and Franklin are visual guesses only. As the camera pulls back it reveals a **grey-haired founder in a navy coat** at the far left (fully in frame by ~F400) and the whole of the Adams-like figure at right.

**Layers, back to front (inferred):** windows/night exterior → wall, drapes, flag → characters → table (foreground matte that hides the characters' lower bodies; no legs are needed behind it) → floor edge. The camera moves all layers together; no parallax was measured.

**Camera (observed, ORB affine):** One continuous centred pull-out from F231 to F528.
- Scale goes from 1.000 to 0.693 by F516 (-30.7%), with a fixed point of about (0.50, 0.49).
- Easing is ease-in-out: the per-15-frame scale change is ~0.007 at the start, ~0.024 mid-shot and ~0.004-0.011 near the end.
- There is no pan. The coarse note "camera pans right at 14.0" is **wrong**: at 14.0 s the motion is Washington sliding right while the slow pull-out continues.

**Acting timeline (observed):**

| frames | layer | change | trigger (VO ASR) |
|---|---|---|---|
| 231-236 | all | establishing hold; Franklin's mouth closed | "broke the one rule" (7.57 s) |
| 237-346 | Franklin's mouth | strict loop: open D-mouth 10 frames, closed smile 10 frames (opens start at 237, 257, 277, 297, 317, 337). Only the mouth changes; head, eyes and arm are fixed | narration "...nobody had ever broken. Washington..." (not lip-synced; generic "he's talking" flap) |
| 346 | Washington's arms | single-frame swap from arms crossed to one hand raised beside the shoulder (possibly a two-finger "two terms" sign, unresolvable at 240p) with the other hand on the hip; face unchanged | "walked away" (11.49 s) |
| 346 | Jefferson's face | same-frame swap from neutral to worried: arched brows, small "o" mouth, sweat drop; held to the end of the shot | 0-frame reaction delay (a synchronous swap) |
| 347 | Franklin's mouth | the loop stops closed; attention hands over to Washington | - |
| 347-415 | Washington | gesture held 69 frames, no idle | "after two terms" (12.02-12.61 s) |
| 416 | Washington's face | **one-frame** angry face (V brows, flat mouth) | - |
| 417 | Washington | swaps to a smug pose: closed arc eyes, nose up, hand up at the head (a dismissive "I'm off" pose) | "for a hundred" (13.57-13.79 s) |
| 417-446 | Washington | slides right as a rigid cutout (no walk cycle, no bob) and passes BEHIND the Jefferson/Adams pair, then out of frame. Face x: 201.5 → 304.5 px from F417 to F434, per-frame dx 1, 2, 2, 3.5, 4, 5, 5, 6, 6.5, 7, 8, 8, 8, 8, 10, 9, 10 (ease-in / accelerating exit). Wig last seen at the right edge ~F444-446 | "fifty years" (14.15-14.4 s) |
| 447-528 | group | hold on the remaining founders while the pull-out finishes; the empty centre emphasises Washington's absence | "every president treated them like law" (14.99-16.72 s) |

Throughout, the Adams-like founder keeps an arms-crossed scowl (no swap). There are no blinks in this shot.

**Character design (observed):** Same house style as the other clips.
- Big heads (head:body ≈ 1:1.5-2 visible above the table).
- Dot eyes; the nose is a single J-curve; mouths are swap shapes (closed smile, open D, small "o", flat line).
- Wig and hair are simple cloud shapes in grey or white with a black outline.
- Arms are thin black stick limbs with mitten hands. Hands and arms swap as whole drawings; no elbow bend is ever shown.

---

## S04 (F529-1049): FDR election timeline and stamp

**Plate (observed):** A flat, very dark teal-navy (~#08171c, RGB ≈ 8,23,28) with faint blotchy texture or compression. There is no grid, no axis line and no tick marks.

**Items (observed, bbox measured at F700):**
- **FDR head icons:** cartoon head cut-outs with white hair and a smiling open mouth, black outline, no neck.
  - Each head is ~0.087w wide; the heads sit at 0.23-0.42h.
- **Year labels:** white heavy geometric sans with a dark soft drop shadow, centred under each head.
  - Labels sit at 0.49-0.58h, ~0.157w wide, glyph height ≈ 0.09h.
- **Row positions:** left-anchored, starting at x = 0.082. Label boxes in px: 35-101 (1932), 130-197 (1936), 219-291 (1940), 310-380 (1944). Pitch ≈ 92 px ≈ 0.216w.
- The row **never re-centres** when items are added; the coarse note claiming it does is wrong. There is no idle motion on any head.

**Build order (observed):**

| frames | event |
|---|---|
| 529 | hard cut in with **1932 and 1936 already in place** (no entrance animation) during ASR "nineteen [thirty-six]" |
| 541-551 | **1940 pop-in**: head and label grow together as one group from a dot to full size, centred on the final position (~0.60, 0.40). Group width (px): 8, 12, 17, 24, 32, 40, 50, 58, 65, 70, 72, final 73, i.e. scale 0.11, 0.16, 0.23, 0.33, 0.44, 0.55, 0.68, 0.79, 0.89, 0.96, 0.99, 1.0 (S-curve over 11 frames, **no overshoot**). The head is a different drawing: **neutral/serious** face, closed mouth. VO ASR "nineteen forty" (17.88-18.55 s) |
| 679 | the 1940 head swaps from neutral to the shared smile (single frame), 4.3 s after its pop, on a strong waveform onset (22.63 s) at VO ASR "oh/didn't get" (garbled; likely "...ran again") |
| 732-742 | **1944 pop-in**, identical mechanics. Width (px): 10, 14, 19, 26, 36, 45, 53, 60, 67, 71, final 71. It starts with the neutral face and **swaps to the smile at F741**, while still growing. VO ASR "...forty four" (24.3-25.55 s) |
| 848 | **"1951"** cuts on (one frame, no animation) below the row. Box x 181-240 (centred ~0.494w), y 0.79-0.88h. Same type style as the year labels, no head. VO ASR "passed the twenty second amendment" (28.33-29.74 s) |
| 998-1003 | **stamp slam** (see below) |
| 998-1008 | the whole timeline layer slides **down** by 56 px (0.233h) with no scale change. Per-frame dy: 2, 4, 7, 8, 9, 9, 7, 6, 3, 1 (ease-in-out over 10 frames). It starts on the stamp's first frame, ends 5 frames after the landing, and pushes "1951" off the bottom (gone by ~F1006). This makes room for the stamp at the top |
| 1009-1049 | final hold, 41 frames, to clip end |

**Stamp (observed / estimated):**
- **Wording:** "THE LAST PRESIDENT / WHO'LL EVER SERVE / MORE THAN TWICE". All caps, 3 centred lines, a geometric sans in bold. The text is light grey with a grainy rubber-ink texture.
- **Frame:** a thick light-grey grainy rectangular border (≈0.017h). The interior is dark, the same as the plate, so the fill is transparent or dark.
- **Landed geometry:** centre (0.515, 0.237); rotated box ≈ 0.427w × 0.29h; rotation ≈ **-4°** (right side higher), constant through the slam.
- **Scale over time** (from the "THE LAST PRESIDENT" text width relative to its landed size): ~3.3x at F998, ~2.9x at F999, 2.46x at F1000, 2.0x at F1001, 1.48x at F1002, 1.0x at F1003. It lands in **5 frames**, accelerating slightly, with no bounce.
- **No** white flash, **no** scene dim (a BG corner patch stays at RGB ≈ 7,25,30 before and after) and **no** shake.
- **Layering (inferred):** the head icons stay fully visible over the stamp's letters and border during the slam (F1000-1003), so the stamp sits behind the icon layer or uses a lighten/screen blend.
- **VO:** the stamp lands at "means that" (33.19-33.42 s), about 25 frames **before** ASR "last" (34.28 s). The text is read while the punchline is spoken.

**Data vs. shorthand:** The years are literal election years plus the amendment year. The heads are shorthand: one drawing per term, with expression swaps instead of real ageing.

---

## Audio findings (waveform only; no playback)
- **VO lane:** a continuous narrator from 0.08 s to the end (ASR transcript, approximate). No on-screen character lip-syncs to it; Franklin's 10/10 mouth loop is generic.
- **SFX / music:** sound identities are unknown. These onsets fall on visual events (see `audio_cues.csv`; all unverified):
  - F346/347: Washington gesture (-11 dB; probably a VO syllable).
  - F417: Washington's smug swap and exit start (Δ0).
  - F529: cut to the timeline (Δ-1).
  - F679: 1940 face swap (Δ0, -15 dB).
  - F730: the 1944 pop (Δ-2).
  - F851: "1951" (Δ+3).
  - F1000: stamp appears (Δ+2).
  - F1008-1010: just after the stamp lands at F1003 (Δ+5 to +7, -15.6 dB).
- F176 is near-silent (RMS -145 dB) at the name-card cut, which suggests a short gap or duck in the mix at the edit. This is unverified.
- A music bed cannot be identified without playback.

---

## Reusable mechanics

1. **Held emotional tableau plus slow push (observed, F0-174).** For a sombre fact, hold the characters completely still (no blinks or idle) and let a single linear push carry the shot. Starting values: scale 1.00 → 1.32 over 5.8 s (+0.0019/frame), anchored on the mascot side so the subject drifts toward the opposite third. Cut without settling.
2. **Name card over a frozen, dimmed plate (observed, F175-230).** Hard cut to the previous composition, pushed slightly further and frozen.
   - Dim to 25% brightness.
   - White caps in a heavy geometric sans with a soft drop shadow, centred at y ≈ 0.45-0.53, cap height 0.07h, width up to 0.83w.
   - No text animation. Hold ~56 frames (1.9 s); hard cut out.
3. **Continuous pull-out to reveal context (observed, F231-528).** Scale 1.00 → 0.69 over ~9.5 s with ease-in-out, centred anchor. Edge characters are revealed by the camera, not by entrances. Use it to widen from "who" to "the room" while the beat plays.
4. **Generic talk loop (observed, F237-346).** A background speaker that isn't voicing the VO flaps on a strict 10-frames-open / 10-frames-closed cycle using one open-mouth drawing. Stop the loop on the frame the focus character acts (F347).
5. **Same-frame reaction (observed, F346).** A listener's expression swap (worried brows, "o" mouth, sweat drop) can land on the **same frame** as the focal gesture (0-frame delay), so the two actions read as one beat. Hold both for over 2 s.
6. **Comic exit (observed, F416-446).**
   - Show a 1-frame "attitude flash" expression (angry) first.
   - Swap to a smug pose (closed arc eyes, nose up).
   - Slide the rigid cutout off-frame with an accelerating ease-in: 1 → 10 px/frame at 426 px width (≈0.002w → 0.023w per frame) over ~30 frames.
   - Pass behind foreground characters so the exit is occluded. No walk cycle is needed for a gag exit.
7. **Timeline icon-plus-year pop-in (observed, F541-551 and F732-742).**
   - Group head and label, anchor at the group centre, and scale 0 → 1 over 11 frames on an S-curve: 0.11, 0.16, 0.23, 0.33, 0.44, 0.55, 0.68, 0.79, 0.89, 0.96, 0.99, 1.0. No overshoot.
   - Lay out left-anchored with a fixed pitch (~0.216w at 4 items, starting x 0.08). Never re-centre.
   - Earlier items may already be on screen at the cut (F529).
8. **Expression upgrade after a pop (observed, F679 and F741).** A new icon enters with a neutral face and later swaps to the house smile: either a delayed punch on a VO beat (+4.3 s) or in-flight on the last growing frame.
9. **Outcome label as a plain cut-on (observed, F848).** A follow-up fact (the amendment year) appears in one frame, centred below the row, in the same type style, with no icon.
10. **Stamp plus layer pan to make room (observed, F998-1008).**
    - The stamp lands in 5 frames: 3.3x → 2.9 → 2.46 → 2.0 → 1.48 → 1.0, with fixed rotation -4°. Landed centre (0.515, 0.237), size 0.43w × 0.29h.
    - Grainy light-grey border and caps; transparent interior. No flash, dim or shake on a dark graphic plate.
    - At the same time, slide the existing graphic layer down 0.233h with ease-in-out over 10 frames (dy 2, 4, 7, 8, 9, 9, 7, 6, 3, 1), pushing low items off-frame.
    - Keep the icons above the stamp layer, or blend it with lighten.
    - Hold at least 40 frames.
11. **Stamp leads the spoken punchline (estimated, F1003 vs VO "last" at F1028).** Land the stamp about 0.8 s before the key words so the text is already on screen as they are said.
