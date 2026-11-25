# Clip 07 – Cleveland: Archive to Animation (F000000–F001049, 35.0 s, 426×240 @30 fps)

Evidence: `frames/`, `sheets/seq_*.png` (all 88 opened), `crops/*.png`, `metrics.csv`, `events.csv`, `audio_cues.csv`. Labels: **observed** (seen and/or measured), **estimated** (measurement with visible uncertainty), **inferred implementation** (how to build it).
VO lane = `vo_words.csv` (ASR transcript, approximate; garbled in places, e.g. "who announcing the dvd sex abuse" ≈ "who in 1886 … get married").

## Shot table

| shot | first–last frame | start–end s | type | story purpose / motivating VO (ASR approx.) |
|---|---|---|---|---|
| S01 | 0–209 | 0.000–7.000 | staged environment + name card (dim) + date caption | Bachelor Cleveland drinking in a restaurant: "…forty-nine-year-old bachelor, an introvert, **Cleveland** … [1886] get married" |
| S02 | 210–434 | 7.000–14.500 | archive insert (boxed sepia portrait) | Frances Folsom introduced: "…was twenty-one … read [the] day she was born because her father was a…" |
| S03 | 435–618 | 14.500–20.633 | archive insert (full-frame wedding engraving) + date caption | The wedding itself: "…so on **June second eighty-six** they married in the Blue Room with…" |
| S04 | 619–700 | 20.633–23.367 | archive insert (boxed sepia portrait) | "**John Philip Sousa** leading [the band] and…" |
| S05 | 701–1049 | 23.367–35.000 | staged environment (cartoon reenactment) + stamp + mascot + year caption | Punchline: "**it's still the only wedding** a sitting president has ever had in the house", then "Cleveland lost in 1888 … won it back in **1892**…" (continues into clip 08) |

Cuts (all hard, 1 frame): 209→210, 434→435, 618→619, 700→701. Metric spikes at 93 and 145 are the name-card dim on/off inside S01, not cuts.

---

## S01 – Restaurant (F0–209)

**Blocking and reveal order (observed).** The clip opens on an established medium-wide two-shot. Eagle (mascot, left, x≈0.22–0.40) and Cleveland (right, x≈0.58–0.80) sit at a round dark-red table with 4 champagne bottles (glowing yellow liquid). Empty bottles lie on the floor at the lower right (gluttony gag). The eye goes first to Cleveland's talking mouth, then to the waiter entering from frame left (F48–68). Name card at F93–144, then the "1886" caption at F150–202. Hard cut at F210.

**Layers, back to front (observed; parallax separation inferred).**
1. Tall arched windows with warm cream-yellow glowing panes and soft bokeh lamp dots, plus dark-red/brown pillars.
2. Floor with a warm gradient.
3. Chairs.
4. Waiter: walks behind the eagle and behind the table.
5. Eagle and Cleveland seated.
6. Table and bottles.
7. Floor bottles at the lower right.

No parallax is observed: the camera move is a uniform scale.

**Character design (observed).**
- Head:body ratio is about 1:1.6 (big heads, seated).
- Black outline about 1–1.5 px at 240p.
- Flat fills.
- Cleveland: bald, brown side hair, grey-brown moustache, pink oval blush, heavy brows, frown, tux and bow tie.
- Eagle: white head, yellow hooked beak, half-lidded eyes with a single flat lid/brow line, pink blush (drunk), black suit and tie, stick-arm hand holding a beer/champagne glass.
- Waiter: black hair, round smiling face with dot eyes, tux, one hand raised palm-up carrying a silver cloche, stick legs.

**Acting (observed unless noted).**
- **Cleveland talking (F0–209):** the mouth is a fixed open/closed loop. It is closed F0–3, then repeats **6 frames open / 5 frames closed** (open starts 4, 15, 26, 37, 48, 59, 70, 81, 92 … 147, 158, 169, 180, 191, 202). The period is exactly 11 frames and is not synced to the VO syllables. The phase is unbroken across the dim F93–144, so the animation keeps running under the card. The open drawing also changes head tilt a little (separate open-head and closed-head drawings, inferred). Brows stay angry throughout. Evidence: `crops/cleve_mouth_000-046.png`.
- **Eagle idle (F0–209):** the face drawing is constant (half-lidded, blush). The head and torso bob smoothly every frame. Beak y varies 102.3–104.2 px (≈1.9 px p-p = 0.008 H), period ≈19.5 frames (0.65 s). Evidence: `crops/eagle_rest_000-023.png`.
- **Waiter walk-in (F48–68):** the cloche tip shows at F48–49 and the body enters at F52. Cloche centroid x: 0.015 (F49) → 0.098 (52) → 0.178 (54) → 0.385 (59) → 0.511 (63) → 0.560 (65) → 0.593 (67) → 0.598 (68), then stop.
  - Speed is constant at ≈0.037 W/frame (≈16 px/f), with a 4–5 frame ease-out (F64–68). Cloche y stays 0.355 ±0.002, so there is almost no body bob on the tray hand.
  - Stick legs scissor (estimated 2–3 frame leg-swap holds).
  - He passes behind the eagle's head (cloche hidden F56–58). He ends between eagle and Cleveland, behind the table, cloche hovering over Cleveland's head (x≈0.60, y≈0.355). He holds a smile; no further change F69–209.
  - Nobody reacts to his arrival. Evidence: `crops/waiter_walk_048-079.png`, `crops/key_000-092.png`.

**Camera (estimated).** A slow continuous push across the whole shot, including under the dim. Scale vs F0: 1.008 @46, 1.023 @92, 1.043 @145, 1.071 @209, about linear (≈0.00034/frame). Fixed point ≈(0.50, 0.41).

**Text.**
- **Name card F93–144 (52 f, observed).** A 1-frame cut to a dimmed scene: mean luminance 104.8 → 31.2 (×≈0.24 on the lower band) and back to 104.3 at F145, with no fade. Centred white "GROVER CLEVELAND", all caps, geometric extra-bold sans (Montserrat ExtraBold-like, estimated), no visible outline. Box x 0.141–0.869, y 0.454–0.542 (cap height ≈0.088 H). VO "introvert" F88 → "Cleveland" F109: the card leads the name by about 16 frames.
- **"1886" F150–202 (53 f, observed).** Bottom-centre caption, x 0.425 w 0.150, y 0.804 h 0.083. White extra-bold with a thin (~1 px) dark outline and a soft dark drop shadow down-right. Hard on and off. Evidence: `crops/captions_x3.png`.

---

## S02 – Frances Folsom portrait (F210–434)

**Archive treatment (observed).**
- Sepia studio photo in a centred upright box (x 0.265–0.732, y 0.042–0.954) on a dark brown-to-black plate.
- A fixed rounded dark vignette/frame overlay (the box top and bottom edges stay at y 0.042/0.954 while the photo scales: inferred overlay mask above the photo layer).
- Thin vertical film-scratch lines that change every frame (F300/301/302 differ).
- No measurable luminance flicker (brightness std 0.8).
- Evidence: `crops/folsom_300-302_x2.png`, `crops/archive_keys.png`.

**Camera (estimated).** Slow push: scale 1.028 @300, 1.062 @434 vs F210, centred. The box widens to x 0.249–0.749.

**Text (observed).** "FRANCES FOLSOM" bottom-centre F213–262 (50 f), appearing 3 frames after the cut. x 0.164 w 0.650, y 0.804 h 0.083, same style as "1886". The image holds uncaptioned F263–434 (5.7 s) under the VO backstory.

## S03 – Wedding engraving (F435–618)

**Observed.** A full-frame sepia engraving of the White House wedding (guests at left, minister, Cleveland and Frances with veil at right, palms). Rounded heavy black vignette border, same scratch overlay.

**Camera (estimated).** Push 1.045 @526 and 1.088 @617 vs F435. Fixed point ≈(0.10, 0.89), so the push is anchored at the lower left and the couple drift up and right.

**Text (observed).**
- "JUNE 2, 1886" bottom-centre F507–570 (64 f; VO "June" F505, +2 f). x 0.268 w 0.441, y 0.804.
- "JOHN PHILIP SOUSA" appears at **F617, 2 frames before the picture cut** (rides over the engraving F617–618). It continues over the Sousa portrait to F680 (64 f total), x 0.134 w 0.711, y 0.804. VO "John" F614.

## S04 – Sousa portrait (F619–700)

**Observed.** Same boxed-portrait template as S02: Sousa in band cap and uniform, painted-cloud backdrop, box x 0.249–0.749. Caption off at F681; uncaptioned hold F681–700.
**Camera (estimated).** Push 1.012 @660, 1.032 @700.

---

## S05 – Cartoon Blue Room wedding (F701–1049)

**Cut (observed).** A hard cut at F701, exactly on VO "it's still the only wedding". The audio is near-silent for 4 frames before it (F697–700 at −37 to −45 dB), and the level jumps to −22 dB at F701. The archive engraving and the cartoon share the same staging: couple at centre-right, guests in front. The edit is a "same scene, now animated" match. This is the archive-to-animation pivot.

**Layers, back to front (observed).**
1. Room plate: cream wallpaper with gold dot motif, light-blue striped wainscot with a gold rail, brown wood doors, small framed paintings, blue patterned carpet.
2. Couple: Cleveland left, Frances right, holding hands.
3. Foreground row of about 10 slate-blue round audience heads seen from behind (#55557A-ish fill, thick black outline, a few ear/hair shapes) across the bottom 25%.
4. Eagle (enters F867), in front of the heads.
5. Stamp and captions on top.

The room and the heads scale slightly differently during the pull (see camera), so they are separable layers.

**Character design (observed).**
- Cleveland: tux, happy closed arc eyes, pink blush, moustache, no mouth line, stick arms with a black mitten hand reaching to Frances.
- Frances: black bun hair, white dress (bell shape with scalloped hem lines), white veil behind, dot eyes looking left toward him, small smile.
- Head:body ratio about 1:1.5.

**Camera (observed).**
- **Pull-out F701–744**, fast and eased. Scale vs F701: .992 @704, .975 @707, .937 @712, .882 @717, .820 @722, .754 @727, .696 @732, .647 @737, .630 @740, .617 @744. Ease-in F701–712, peak ≈0.012/frame F712–732, ease-out F732–744. Fixed point ≈(0.54, 0.55).
- Chained per-layer estimate: wall 0.664 vs foreground heads 0.630, so the foreground shrinks about 5% more (mild parallax, estimated). The pull "widens the composition" to reveal doors, framed pictures and an empty upper-left wall for the stamp.
- Static F744–1026 (scale 0.998–1.005).
- **Push-in F1027–1049**, accelerating: 1.010 @1033, 1.033 @1040, 1.067 @1049 (≈0.0016 → 0.0037/frame). Content moves up (fixed point below frame). It runs past the clip end into clip 08.

**Stamp (observed / estimated).**
- Wording: "THE LAST PRESIDENT / TO GET MARRIED AT / THE WHITE HOUSE". 3 lines, all caps, centred, red (~#E8262A) grungy rubber-stamp texture, thick red rectangular border. Lines tilted CCW about **−8°**.
- No pre-roll: F722 is clean.
- F723 enters oversized at about **3.0×** (text overflows all frame edges, translucent ink). Then 2.7× (724), 2.3× (725), 1.9× (726), 1.6× (727), 1.15× (728), **1.0× at F729** (7 frames, strong ease-out, estimated per-frame values).
- Settled rect centre (0.259, 0.231), size 0.495 W × 0.34 H including the border. Its left edge touches x≈0.
- It lands while the pull-out is still moving (the stamp is screen-locked; the scene shrinks under it).
- No flash, no screen shake, no character reaction.
- Hold F730–903 (174 f = 5.8 s).
- **Fade-out F904–917** in place, no scale. Red-pixel count 6079 → 5714 → 4872 → 2472 → 981 → 287 → 45 → 0 at F918 (accelerating opacity fade), on VO "eighteen eighty-eight" (F884–917).
- VO: "still" F713, "the" F722, "only" F729; the stamp enters on "the" and settles on "only".
- Evidence: `crops/stamp_722-731.png`.

**Background wash (observed).**
- Starts during the pull (about F708) and plateaus at F770.
- Frame brightness 115 → 168. Carpet saturation 139 (clean) → 87 (F722) → 33 (F770). Wall RGB (174,170,155) → (232,230,227).
- **Only the room plate is washed.** The couple (black suit stays black) and the foreground heads (constant RGB ≈85,85,105) are untouched. Inferred implementation: a white solid at about 60–70% opacity between the room and character layers, or a levels/desaturate effect on the room layer only.
- **Reverses F903–920** in parallel with the stamp fade: brightness 165.7 → 157.5 (906) → 147.9 (911) → 137.0 (916) → 127.4 (920).
- Evidence: `crops/wash_vs_clean_800_930.png`.

**Mascot (observed).**
- The eagle (black suit, white shirt, black tie, deadpan half-lidded eyes, single flat brow line, profile facing right toward the couple) **slides in horizontally from frame left** in front of the audience heads.
- Beak centroid x: 0.007 (867) → 0.045 (869) → 0.116 (871) → 0.191 (873) → 0.267 (875) → 0.304 (876). Constant ≈0.037 W/frame, **hard stop with no ease or overshoot**, small rise (head top 98 → 90 px). Final head bbox about x 0.07–0.30, top y 0.375. One stick arm is raised near the heads (x≈0.25, y≈0.82).
- VO: "Cleveland lost" (F854/868); the eagle arrives on "lost".
- Afterwards: idle bob only. Beak y 133.3–138.2 px (≈4.5 px p-p = 0.019 H), period ≈22 frames (highs 884, 906, 928, 951, 974, 997, 1018). No blinks and no expression change through F1049.
- Role: deadpan witness / comic deflation of the "romantic" stamp.

**Couple acting (observed).**
- Cleveland: slow vertical bob ≈1.2–1.5 px p-p, period ≈27–30 frames (F772/805/832/859; F927/954/981/1008).
- Frances: static.
- No blinks, mouth changes or arm waves observed F701–1049. The earlier notes' "couple wave" is not supported.

**Text (observed).** "1892" **top-centre** F946–1002 (57 f), hard on/off. x 0.425 w 0.150, y 0.117 h 0.083: same size and style as "1886" but moved to the top because the eagle and heads occupy the bottom. VO "in" F946, "eighty" F952, "ninety" F964, "two" F976; the caption leads "eighty" by 6 frames.

---

## Audio findings (unverified, waveform only)

- Cuts with onsets at delta 0: F210 (−19 dB), F435 (weak), F619. F701 is preceded by a 4-frame near-silence and then a −22 dB jump.
- Name-card dim F93 has a strong onset at the same frame (−19.9 dB); its type is undetermined (VO or whoosh).
- Stamp: a small rise at F723, a dip at F726–729, then a rise at F730–731 as it settles. Possibly a stamp thud (estimated) or VO "only".
- Eagle stop F876: onset at F875 (−17.3 dB).
- Push-in F1027: onset at F1026.
- Music bed and ambience are not separable from the mixed track.

---

## Reusable mechanics

1. **Archive sandwich, then a matched cartoon payoff.** Present the facts on archive stills (portrait → event engraving → portrait). Then hard-cut on the punchline phrase to a cartoon restaging of the same event with matching composition. Evidence: F435–618 vs F701. Starting values: archive holds 2.7–7.5 s each; cartoon cut exactly on the VO word; a 3–5 frame audio gap before the cut.
2. **Archive treatment template.** Photo layer with a slow push (+3% to +9% over 2.7–7.5 s, linear). Fixed rounded dark vignette overlay above it. Per-frame randomized thin vertical scratch lines. Dark brown plate behind boxed portraits (box ≈0.47 W × 0.91 H centred). No brightness flicker. Evidence: F210–700.
3. **Pull-out reveal under the stamp.** After a cut, ease-out the camera from 1.0 to 0.62 over about 43 frames, peak 0.012/frame. Fire the stamp about 22 frames into the pull so it lands while the scene is still widening. Foreground layer scale ≈5% more than the BG for parallax. Evidence: F701–744.
4. **Stamp land.** Screen-locked. Starts at about 3× final size, lands in 7 frames (3.0 → 2.7 → 2.3 → 1.9 → 1.6 → 1.15 → 1.0). Rotated −8°, upper-left, centre (0.26, 0.23), width 0.50 W, red grungy ink, 3 caps lines plus a border. No flash or shake. Hold about 5.8 s. Exit with a ~13-frame accelerating opacity fade in place. Evidence: F723–729, F904–917.
5. **Selective BG wash behind the stamp.** Wash only the room plate (saturation ×0.25, toward white, brightness +45%) over about 60 frames starting with the pull. Keep the characters and foreground crowd at full colour. Reverse it over about 17 frames together with the stamp fade. Evidence: F708–770, F903–920.
6. **Name card.** A 1-frame cut to about 24% scene brightness with centred white extra-bold caps (cap height ≈0.088 H). Hold about 52 frames, then a 1-frame return. Keep character loops running underneath. Evidence: F93–144.
7. **Captions.** White extra-bold caps or digits, cap height ≈0.083 H, ~1 px dark outline plus a soft drop shadow, hard on/off.
   - Names and dates sit at the bottom (y≈0.80). Years move to the top (y≈0.12) when the lower frame is occupied.
   - Durations 50–64 frames.
   - Captions may lead the picture cut by about 2 frames, or appear about 3 frames after it.
   - Evidence: F150, F213, F507, F617, F946.
8. **Cheap talk loop.** The speaker alternates mouth-open (6 frames) and mouth-closed (5 frames) drawings in a fixed 11-frame loop. The open drawing has a slight head tilt. It is not lip-synced, and listeners hold. Evidence: F0–209.
9. **Mascot slide-in.** The mascot enters from the frame edge at a constant ≈0.037 W/frame (16 px/f at 240p), stops dead in about 10 frames, takes a foreground position in front of the crowd (head ≈0.23 W), and stays deadpan with half-lidded eyes. Idle bob 4.5 px p-p over a ≈22-frame period, no blinks. Evidence: F867–1049.
10. **Background walk-on.** A secondary character walks in at constant speed (≈0.037 W/frame) with a 4–5 frame ease-out. The prop hand stays level (±0.002 H). Layered behind the mascot and the table. Main characters do not react. Evidence: F48–68.
11. **Idle breathing.** Seated or standing characters bob 1.5–4.5 px p-p with periods of 20–30 frames, all sine-smooth on 1s. Different characters use different periods so they never sync. Evidence: eagle F0–209 (19.5 f), Cleveland F760–1026 (27 f), eagle F876–1026 (22 f).
12. **Exit push.** End the beat with an accelerating push (0.0016 → 0.0037/frame) that carries over the next VO sentence into the next clip. Evidence: F1027–1049.
