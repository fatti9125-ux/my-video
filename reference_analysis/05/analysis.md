# Clip 05: Fillmore fire and territory map (05_Fillmore_Fire_and_Territory_Map)

Source: 426x240, 30 fps, 1050 frames (F000000-F001049, 0.000-34.967 s). All 88 seq sheets opened. Native crops are in `crops/`.
Labels: **obs** = observed, **est** = estimated measurement, **impl** = inferred implementation.
VO lane = `vo_words.csv` (pocketsphinx ASR, approximate; many words are misrecognised, so the intended phrase is sometimes given in brackets as an inference).

## Shot table

| shot | first | last | start s | end s | type | story purpose / motivating VO (ASR, approx.) |
|---|---:|---:|---:|---:|---|---|
| S01 | 0 | 121 | 0.000 | 4.067 | staged environment + stamp | Fillmore segment punchline: the Whig Party "door" blows up; the stamp reads THE LAST PRESIDENT FROM THE WHIG PARTY. VO "the last president ..." F4-F34. |
| S02 | 122 | 261 | 4.067 | 8.733 | staged environment + caption | Fugitive Slave Act: a kind northerner offers water, then slave catchers take the woman away. VO "...signed a fugitive slave act" F151-F192, "northern ... never good" F209-F253 |
| S03 | 262 | 345 | 8.733 | 11.533 | staged environment (FX-heavy) | Riot/fire: "[the Whig] party split over slavery" F269-F307 |
| S04 | 346 | 472 | 11.533 | 15.767 | presenter composition | Fillmore and the eagle in front of a burning White House: "every president since has been a democrat or republican" F368-F448 |
| S05 | 473 | 561 | 15.767 | 18.733 | staged environment + name card | FRANKLIN PIERCE title over a dimmed rally, then the rally plays: VO "franklin pierce" F487-F503 |
| S06 | 562 | 732 | 18.733 | 24.433 | staged environment (panorama) | Railroad men want the southern route to the Pacific, but the ground was over the Mexican border (F565-F725). |
| S07 | 733 | 966 | 24.433 | 32.233 | map | "December thirtieth 1853 ... [Gadsden] purchase ... thirty thousand square miles ... ten million dollars" (F756-F949) |
| S08 | 967 | 1049 | 32.233 | 35.000 | map + presenter + stamp | "making [Pierce] the last president ..." stamp THE LAST PRESIDENT TO ADD LAND TO THE LOWER 48 |

All edits are hard cuts. Cuts are at F122, F262, F346, F473 (into the name card), F562, F733 and F967. F534 is not a cut: the name card switches off and the plate brightens in one frame, with the same plate and the animation carrying on.

---

## S01 (F0-121): door blast, then stamp 1
- **Blocking/reveal (obs):** Close shot of a wooden doorway. The door is dark brown with 3 panels. A beige stone wall sits right with a hand-lettered cursive sign "The WHIG PARTY" (x~0.86-1.0, y~0.08-0.45). A blue-sky slice sits left, with a stoop in the foreground. The plate holds from F0 to F19 with a very slow push (est. ECC scale 1.017 over 19 f).
- **Blast (obs, F20-25):** The blast has no anticipation frame. On F20 the door jumps about 0.35 W left and tilts. Flat layered flames fill the doorway: a red outer layer, orange, and a yellow core, with jagged horizontal tongues. Horizontal speed streaks in white, yellow and red shoot leftward across the sky. The door keeps rotating and dropping toward the lower left and has left the frame by about F25. That is 4-6 frames of travel, about 5-10°/frame.
- **Stamp 1 (obs, F24-29):** The text is "THE LAST PRESIDENT / FROM THE WHIG / PARTY": 3 lines, centred, white bold geometric sans caps with a grunge texture. It sits on a translucent dark-grey box with a thick grungy white border, rotated about -10° (counter-clockwise).
  - Scale (est., from the white-pixel bbox): F24 is at least full frame (about 2.2x), with the text cropped by the frame edges. F26 has bbox width 0.92 (about 1.9x), F27 width 0.74 (1.5x) and F28 width 0.61 (1.27x). On F29 it is settled at x 0.03-0.51, y 0.02-0.47.
  - So it lands in **5 frames** with no overshoot or bounce. The motion reads as ease-out. It lands while the door is still exiting.
  - Red claw/splatter shapes flash in the lower left on F27-29 (obs).
- **Dim (obs):** After the landing, a dark gradient vignette grows from the left between F30 and F34. Mean luma of the left third falls from 86 to 27. It then holds, with the left ~55% near black and the fire still bright at right.
- **Hold:** The stamp holds from F35 to F121 (2.9 s). The flames keep flickering, with new shapes every ~2-3 frames (est.). The push is negligible (1.014). Hard cut at F122.
- **impl:** The door is a separate sprite on a rotate+translate tween. The flames are a looping flipbook. The streaks are short-lived stretched sprites. The stamp is a scale tween from 2.2 to 1.0 over 5 f with ease-out, at fixed rotation. A left-anchored black gradient fades in over 5 f after landing.

## S02 (F122-261): Fugitive Slave Act vignette
- **Layers (obs, back to front):** Sky with clouds, then a bush band, then a plank wall + open doorway as a left panel (x 0-0.42). The wall edge is a hard vertical split. Characters stand on one shared front plane, with the caption on top. The wall panel and the sky are separate planes; the edge acts as a natural matte for entrances.
- **Camera (est.):** Slow push-in, scale about 1.02 by F232, then accelerating to about 1.06 by F252.
- **Establishing (F122-138):** The enslaved woman stands alone, centre-right (x~0.55-0.75). She has dark skin, black curly hair and a ragged grey dress with stains. Her expression is sad: tilted brows and a small frown.
- **Caption (obs):** "FUGITIVE SLAVE ACT" is white, bold, all caps, with a thin dark outline/shadow. It sits bottom-centre (x~0.12-0.88, y~0.80-0.92). It switches on hard at F139 and off hard at F187, for **48 f (1.6 s)**. A pixel check shows the white coverage goes 0 → 0.17 in one frame. It is timed to the VO "signed a fugitive slave act" (F151-F192).
- **Entrance (obs, F148-163):** The kind woman (brown hair, blue dress) slides in from the left frame edge in front of the doorway. The glass-of-water prop leads: the glass is visible at F148 and her face at F153, and she settles about F163 (~15 f, ease-out). She stands 3/4 facing right with a closed smile and her arm extended with the glass.
- **Reaction (obs):** The enslaved woman swaps sad → soft smile at **F193** in a 1-frame swap (VO "act" ~F192).
- **Threat entrance (obs, F219-233):** Two slave catchers slide in symmetrically from the left and right edges. They wear wide-brim black hats and have black beards and black coats. Their stick arms reach inward and enter first (F219-220); the hats show at F222. They settle about F233 (~14 f, ease-out). In the settled framing they overlap the frame edges, with only half of each body visible (crop `crops/push_231_240_248_256.png`).
- **Expression beats (obs):**
  - **F236**: the victim swaps to a scream: eyes squeezed into ><, black oval open mouth (VO "never" ~F234).
  - **F239**: the kind woman swaps to worried: raised inner brows, flat mouth. The listener reacts **3 f after** the victim.
- **Exit (obs, F240-261):** The right catcher drags the woman off the right edge; she is gone by about F259. The left catcher and the kind woman slide left until only the glass is visible at F260-261. Two frames of empty plate, then a hard cut at F262.
- **Rig notes (obs/impl):** The house style holds across characters:
  - Bodies are flat-colour shapes with ~2 px black outlines. Arms and legs are stick lines with small 3-finger hands.
  - Heads are large (head:body about 1:2 for these adults, measured with the dress as the body). Eyes are dots, the nose is a "c" stroke, and the mouth is a single line.
  - Expressions change as whole face-part swaps: brows+mouth (+eyes for the scream). There are no in-betweens.
  - Bodies do not change pose while faces swap.

## S03 (F262-345): riot fire
- **obs:** A street crowd fills the frame: bowler hats, frowns, placards. The whole plate is graded hot red/orange with heavy glow and blur. Large looping foreground flame swirls (yellow core, orange, red edge) and ember flecks sit in front of the crowd.
- **Cadence (obs, metrics):** The flame drawings change on 2s. Mean absdiff alternates high/low (about 16-18 on even frames vs 8-10 on odd frames, e.g. F311/313/315/317 are low). The crowd/camera layer drifts on 1s. The ECC scale estimate is unreliable because of the FX.
- **impl:** A crowd still drifts under a full-frame additive fire flipbook on 2s, plus a red colour grade and glow. Hard cut at F346.

## S04 (F346-472): Fillmore + eagle, burning White House
- **Layers (obs, back to front):**
  1. Dark purple-maroon smoky sky
  2. White House facade tinted red, with smoke clouds
  3. Eagle mascot (left, x~0.38-0.60), white head, yellow beak, black tux and tie
  4. Fillmore (right, x~0.62-0.90): white swept hair, black coat, white shirt, round yellow "WHIG PARTY" badge. Both are framed waist-up.
  5. Foreground flat flame tongues in red/orange/yellow, lower left. Flame tongues also sit in front of the eagle's lower body.
- **Camera (est.):** Linear push-in, scale 1.00 → 1.167 over 126 f (~0.13%/frame). There is also parallax: the White House BG moves -15 px over F346-397 while the characters move +5 px. The background and character layers therefore move separately.
- **Idle (est.):** Both characters bob vertically on a sine. Fillmore's head moves about ±4 px at 240p (0.017 H) with a period of about 24 f. Region-diff minima fall every 12 f (F355, 367, 379, 391 ...), i.e. at the turning points. The eagle follows the same cycle.
- **Acting (obs):**
  - From the start, Fillmore grimaces (raised brows, wavy frown) and the eagle has worried brows; the eagle's hand is raised near its beak at F346.
  - **F419**: Fillmore swaps to SWEAT, with light-blue teardrop drops across his forehead and temple. The swap lands exactly on the VO "democrat" (F419, delta 0).
  - The eagle's arm extends outward to the left around F417-421 (est.).
  - There is no lip-sync. These are reaction holds under the VO.

## S05 (F473-561): Pierce name card over the rally
- **Name card (obs):** F473 cuts into the street-rally plate, already dimmed: mean luma 88 → 29, about x0.33 (~67% darkening). "FRANKLIN PIERCE" is white, bold, all caps, centred at x~0.5, y~0.50, with cap height about 0.07 H. There is no box and no visible outline, only a slight shadow.
  - It holds for **61 f (2.03 s)**. VO "franklin pierce" falls at F487-F503.
  - Under the dim the animation keeps running: Pierce's mouth swaps and the crowd moves.
  - At F534 the dim and the text switch off together in one frame (hard).
- **Plate (obs):** Victorian facades. A dense crowd of townsfolk (frowning, pink blush cheeks, some heads duplicated) fills the lower left. The eagle stands in the crowd wearing a brown hat. Pierce (black hair, black coat) stands at a wooden lectern at right, three-quarter view facing left toward the crowd.
- **Speech (obs, crop `crops/pierce_mouth_534_561.png`):** The mouth alternates open/closed on a strict **9-frame** cycle:
  - open F534-536, closed F537-545, open F546-554, closed F555-561
  - Region-diff spikes under the dim (F483, 492, 501, 510, 519, 528) show the same cycle.
  - The head and torso also sway slightly every frame, and his free hand is raised in a gesture.
  - **impl:** a looping 2-state mouth cycle, not phoneme sync.
- **Camera (est.):** Slow push, scale 1.034 over F534-561. Hard cut at F562.

## S06 (F562-732): desert wagon panorama
- **Layers (obs, back to front):**
  1. Pale sky
  2. Painted ochre mesas with hatched shading
  3. Mid-ground trail and scrub bushes
  4. Saguaro cactus on the left edge
  5. Wagons: grey-canvas covered wagons pulled by white horses, with riders
  6. Foreground group lower left: cowboy on a brown horse, the eagle on horseback, Pierce on a white horse, and two walkers (grey-haired, black hats)
  7. Foreground barrels, a campfire and a pot. These are revealed at the bottom right as the camera pulls back.
- **Camera (est.):** **Pull-back**. ECC scale falls from 1.0 to 0.836 over 170 f with ease-in: about 0.2%/10 f at the start, 1.2%/10 f at the end. Crop: `crops/wagon_562_647_732.png`.
- **Motion (obs):**
  - The near wagon travels down the trail toward the camera, from x~0.45 to ~0.80, and grows even though the camera is pulling back.
  - A second wagon appears far behind the bush (~x0.35) from about F600.
  - The foreground group holds.
  - The campfire flame flickers once it is visible (F700-731).
- Hard cut at F733.

## S07 (F733-966): Gadsden map
- **Basemap (obs):**
  - Water: a textured blue backdrop (#1E8FD5-ish with cloud-like noise).
  - Land: Arizona + New Mexico in light blue #96C3E2, with a dark grey ~1.5 px outline and the state border.
  - Strip: the Gadsden strip, mid-blue #53A3EE.
  - Cities: dot + dark sans label (Phoenix, Yuma, Tucson, Sierra Vista, Santa Fe, Alamogordo, Las Cruces), label height about 0.035 H.
  - The map occupies x~0.12-0.88, y~0.12-0.88.
- **Caption (obs):** "DECEMBER 30, 1853" is white, bold, all caps, with a thick black outline, top-centre (y~0.05-0.17, x~0.17-0.83). It holds F733-831. At **F832** it hard-swaps in place to "GADSDEN PURCHASE", which holds to F966.
- **Region recolour (obs, pixel-sampled):** From **F843 to F864 (22 f, 0.73 s)** the strip fill moves linearly in RGB from #53A3EE to #F0DC4F. It passes through grey-green (#99BBAE at about F852). Outline and labels stay unchanged. The change starts on the VO "purchase" (F843), and the yellow holds to the cut.
- **Camera (est.):** Very slow linear push, scale 1.02 over 233 f. Otherwise static. Hard cut at F967.

## S08 (F967-1049): US map + presenters + stamp 2
- **Layers (obs):**
  - Blue textured water.
  - A green (#7DBB5A-ish) lower-48 state map with thin dark borders, occupying x~0.05-0.95, y~0.05-0.95. The Gadsden strip is shown in dark grey.
  - A flat US flag icon centre-left (x~0.27-0.46, y~0.42-0.62) and a Mexico flag icon lower-left (x~0.12-0.30, y~0.75-0.95).
  - Pierce (x~0.53-0.72) and the eagle (x~0.72-0.94) in the right foreground, full body.
- **Acting (obs/est.):**
  - Pierce: eyes closed, smug smile, hands on hips.
  - Eagle: neutral, looking left.
  - Idle bob: Pierce ±1.2 px with a period of about 27 f; eagle ±1.4 px with a period of about 28 f, offset about 3 f. The two never move in sync.
  - No face swaps.
- **Stamp 2 (obs, F1014-1020):** "THE LAST PRESIDENT / TO ADD LAND TO / THE LOWER 48" in white bold caps on a translucent dark-green box with a grungy white border, rotated about -8°.
  - On F1014 it is at least full frame (~2.2x). It settles on F1019-1020 at top-left, x~0.05-0.50, y~0.07-0.51. That is **6 f**, with no overshoot.
  - The left-side dark vignette grows at the same time as the landing (left luma ~72 → 47). In stamp 1 the dim came after the landing.
  - There is no splatter this time.
  - The characters do not react, and the idle bob continues to the end of the clip (F1049).

---

## Audio findings (waveform only; nothing was listened to)
See `audio_cues.csv`. All entries are "unverified (waveform only)". The stated sound identities are estimates.
- Door blast F20: onsets at 0.51 s (F15, loud) and 0.64 s (F19). The audio leads by 5 and 1 frames (est. whoosh into blast).
- Stamp 2: onset at 33.76 s (F1013, -16.7 dB), 1 f before entry. A second loud onset at 34.03 s (F1021, -13.9 dB) is +1 f after the settle (est. slam/thud pair).
- Stamp 1 (F24) has no separate onset; it is probably masked by the blast.
- Several cuts have onsets 2-6 frames before the cut (F120→122, F340→346, F531→534). This is consistent with VO-driven cuts and audio pre-lap (est.).
- The fire scenes (S03, S04) produce no distinct onsets, which suggests a continuous bed (est.).
- VO-to-visual sync points:
  - sweat swap on "democrat" (delta 0)
  - recolour start on "purchase" (delta 0)
  - caption on F139 with VO "no more ... signed" running

---

## Reusable mechanics
1. **Stamp slam:** The stamp starts at ~2.2x (cropped by the frame) and scales to 1.0 in 5-6 frames, ease-out, with no overshoot. The rotation is fixed throughout. It settles top-left with its box at about x 0.03-0.51, y 0.02-0.51. Style: white grunge caps, 3 lines, on a translucent dark box with a grungy white border, rotated -8° to -10°. Evidence: F24-29, F1014-1020. Starting values: `scale 2.2→1.0, 5f, easeOutCubic, rot -9°, anchor (0.27,0.25)`.
2. **Post-stamp dim:** A left-anchored black gradient vignette goes from 0 to about 0.7 opacity over 5-6 frames, then holds. It can follow the landing (F30-34) or run at the same time as it (F1014-1020). Luma drops from 86 to 27 (stamp 1) and from 72 to 47 (stamp 2). Starting values: `gradient 0→60% width, opacity 0→0.7, 5f`.
3. **Prop-led entrance from the frame edge:** The prop or hands appear 3-5 f before the face. The slide lasts 14-15 f with ease-out, and the character ends partly cropped by the frame edge. Evidence: F148-163 (glass) and F219-233 (catchers' arms; symmetrical from both sides).
4. **1-frame expression swaps on the motivating word.** A listener reacts about 3 frames after the speaker or victim. Brows+mouth (+eyes) swap as a set and the body does not change. Evidence: F193 smile, F236 scream → F239 worried, F419 sweat (delta 0 to "democrat").
5. **Name card = the next shot's plate dimmed to x0.33 luma** with centred white bold caps and no box. The animation keeps running underneath. Card and dim both switch off in one frame after about 2 s, and the shot continues. Evidence: F473-533 → F534.
6. **Two-state talk loop:** The mouth alternates open/closed on a fixed 9-frame cycle and is not phoneme-synced, while the head and torso sway continuously. Evidence: F483-561, crop pierce_mouth.
7. **Idle bob in presenter compositions:** a vertical sine of ±1-4 px at 240p (0.005-0.017 H) with a period of 24-28 f. Characters are offset in phase. The background moves on its own layer for parallax during a push. Evidence: S04 F346-472 and S08 F967-1013. Starting values: `amp 0.012H, period 26f, phase offset 3-4f per character`.
8. **Map region highlight = linear RGB lerp of the fill over ~22 f (0.73 s)**, blue to yellow through grey-green. Outline and labels are untouched, the change starts on the keyword, and the caption swaps hard in place about 11 f earlier. Evidence: F832 (caption), F843-864 (fill).
9. **Camera:** slow linear pushes on dialogue and fire plates (+0.13%/f, up to about 1.17x over 4 s; evidence S04). The panorama instead pulls back with ease-in to about 0.84 to reveal foreground props (evidence S06, F562-732). The maps get only about 1.02 per 8 s.
10. **FX loops on 2s over a plate moving on 1s:** flipbook flames with layered red/orange/yellow and a hot grade. Evidence: S03 F262-345 (metrics alternate on even/odd frames) and the S01 doorway fire.
11. **Clear-frame exit before a cut:** characters slide out at both edges and leave 2 frames of empty plate before the hard cut. Evidence: F240-261.

## Uncertainties
- Audio identities and envelopes are not verified, because the audio was not listened to.
- The ASR words are unreliable; the bracketed phrases are inferred.
- Stamp scale per frame comes from the white-pixel bbox (est. ±10%). The F24-25 frames are clipped.
- ECC camera scales in S02 and S06 are affected by character motion (est. ±2%). S03 could not be measured.
- The eagle's arm change at F417-421 was judged from the sheets only.
- Exact hex colours are sampled from compressed 240p frames.
