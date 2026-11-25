# Clip 09: Coolidge Night Swearing-In: frame analysis

Source: `09_Coolidge_Night_Swearing_In` · 1,020 frames · 426×240 · 30 fps · 34.0 s. Timeline is local, zero-based (F000000 = 0.000 s).
Coverage: all 1,020 frames viewed on the 85 sequence sheets (`sheets/seq_*.png`). 140 frames were also checked with close-up crops (`crops/`). Last verified frame: F1019.
Labels: **observed** = seen or measured on the frames. **estimated** = a measurement within visible uncertainty. **inferred** = a likely implementation.
How the numbers were measured:
- Camera moves: feature matching between frames, fitting a scale/rotation/shift (scratchpad `cam.py`).
- Oath-room acting: each frame was aligned back to F572, then small regions around each face were compared frame to frame.
- Walk: the moving figure was separated from the static background (median of the shot's frames).
VO lane = `vo_words.csv` (ASR transcript, approximate, ±0.1 s). I could not play the audio, so every sound cue comes from the waveform only and is unverified.

## Shot table

| shot | first–last | start–end s | type | story purpose / motivating VO (ASR, approximate) |
|---|---|---|---|---|
| S01 | F0–F37 | 0.000–1.267 | staged environment + held stamp | End of the previous Harding beat: parade car, stamp "THE LAST PRESIDENT ELECTED ON HIS BIRTHDAY" still on screen. VO "…it's a day…" |
| S02 | F38–F161 | 1.267–5.400 | staged environment (interior) | Harding dies in office. Push-in, X eyes, spirit spike, wife keeps reading obliviously, then exits. VO "…when Harding died in office…" ("hoarding died in office", F52–F90) |
| S03 | F162–F571 | 5.400–19.067 | staged environment + date / name / place text + impact FX | Coolidge asleep in the cool-blue farmhouse bedroom. Date, name card and place label appear, then a car crashes through the wall to deliver the news. VO "…on the night of August 2, 1923, Calvin Coolidge was asleep at his father's farmhouse in Plymouth Notch, Vermont, which had no telephone and no electricity… a messenger… with the telegram…" |
| S04 | F572–F831 | 19.067–27.733 | staged environment (oath room) + time label | 2:47 a.m. Coolidge's father swears him in by kerosene lamp. VO "…at 2:47 in the morning, Coolidge's own father, a notary public [ASR 'republican'], swore him in as president… [joke line]" |
| S05 | F832–F908 | 27.733–30.300 | staged environment (bedroom plate reused) | Coolidge walks sleepily back to bed. VO "…Coolidge then went back to bed" ("been cool which went back to bed", F832–F886) |
| S06 | F909–F1007 | 30.300–33.600 | staged environment (closer crop) + stamp | Payoff: the stamp lands as he flops asleep. VO "…making him the last [president] sworn in by his father" ("last", F911–F923) |
| S07 | F1008–F1019 | 33.600–34.000 | staged environment (next segment) | Hard cut to a bright White House lawn line-up (next beat begins). |

Cuts (observed): F38, F162, F572, F832, F909 (a one-frame blend under the stamp), F1008. All are hard cuts except F909.

---

## S01 · F0–F37 · previous-beat tail (staged environment + held stamp)

- **Blocking (observed):** a cream open-top car (black fenders, whitewall spoked wheels) fills the lower frame. Harding stands in it waving with both arms, white hair, smiling. The background is an olive night street with crowd silhouettes, diagonal light shafts (#ebe0bf on street #85732e) and falling confetti.
- **Motion (observed):** the street, confetti and wheels change every frame. Mean frame difference is a steady ~7–9 per frame, so this is a continuous loop: the background scrolls and the wheels spin.
- **Stamp (observed, measured):** "THE LAST PRESIDENT / ELECTED ON HIS / BIRTHDAY".
  - Three centred lines of white bold rounded sans caps on a near-black box, with a grainy white border.
  - Centre (0.703, 0.266). Box 210×82 px, i.e. 0.49 of frame width × 0.34 of frame height. Tilted +12° clockwise.
  - Held through the end of the shot; it does not exit before the cut.
- **Edit:** hard cut at F38. The stamp leaves with the cut.

## S02 · F38–F161 · Harding death gag (staged interior)

**Layers, back to front (observed):**
1. Taupe/brown wall with vertical stripe panels (#7c6e6b / #645244), curtains, and a cream window strip at the right edge (#cebba0).
2. Wife, seated behind the bed: grey hair bun, pink blush, navy dress (#201e2c), holding a newspaper.
3. Bed: lavender-grey blanket and pillow (#92909c).
4. Harding lying with his head on the pillow, lower left: grey hair, pink blush, frown, navy collar.

**Timeline:**
- **F38–F79:** wide two-shot hold (observed).
  - Wife's mouth is a small "o".
  - Small 2–5 level changes in Harding's face region (estimated: slight bob or breathing on a rig).
  - **F69:** Harding's brows and eyes swap to a steeper, pained slant in a single frame (region difference 12.5, observed in `crops/harding_F066-071_face_x3.png`).
- **F80–F83 camera push (observed, measured):** scale 1.074 → 1.217 → 1.361 → 1.438, then held at about 1.436 until F161.
  - Fixed point around (0.13, 0.22) (upper left), so Harding's head grows toward frame centre.
  - Per-frame increments of .074 / .143 / .144 / .077 give an ease-in-out over 4 frames.
  - It starts on the VO word "office" (ASR F80).
- **F83:** the wife's mouth swaps to a big black open oval: she keeps reading aloud (observed). The oval is held until her exit, with only slow drift (dark fraction 0.30–0.36).
- **F84:** on the frame the push lands, Harding's eyes swap to **X X** (dead) (observed).
- **F84–F87 spirit spike (FX, observed):**
  - A white/pale-lavender jagged multi-point spike shoots right from his chest across the blanket, spanning about x 0.55–1.0, y 0.35–0.55.
  - It lasts 4 frames and is gone at F88. It reads as the soul leaving. No inbetweens in or out.
- **F132–F141:** the wife and newspaper slide out of frame to the right over 10 frames, accelerating (ease-in; frame difference 9–11) (observed).
- **F142–F161:** dead Harding alone, completely static (difference <1.5), held 20 frames before the cut.
- **Acting note:** deadpan contrast. The listener (wife) never reacts, and her exit is the punchline.

## S03 · F162–F571 · Coolidge bedroom: sleep → text cards → car crash (staged environment)

### Bedroom plate: layers back to front (observed)

| # | Layer | Description | Colour (sampled) |
|---|---|---|---|
| 1 | Wall | flat blue-grey, two wall planes meeting at a vertical corner line (x≈0.73) | #4d5565 left / #555d70 right |
| 2 | Window glow | soft radial pale-blue halo around the window frame | up to #7a86a8 |
| 3 | Window | dark frame; navy sky #1d2b6c; near-black city skyline #171521; small full moon (x≈0.47, y≈0.24) with a moonlit streak on the water below | |
| 4 | Curtain | teal-grey drape hanging over the left edge of the window | #2c3c49 |
| 5 | Door (right wall) | closed dark door with handle, in perspective | #2f353b |
| 6 | Floor | darker blue-grey, horizontal floor line at y≈0.80 | #343c4a |
| 7 | Bed | left half of frame: draped sheet with folds, pillow mound, blanket hump | sheet #4b5366; lit blanket pale lavender |
| 8 | Coolidge | asleep at the left (pillow) end, head facing camera, eyes closed, dark hair, skin tinted cool | skin ~#736967 (desaturated mauve-grey) |

- **Grade (observed):** the whole scene is one cool blue-grey family. Skin is pulled toward grey, and the only "light source" is the window halo.
- **Inferred implementation:** a blue multiply/colour layer over neutral artwork plus a radial glow behind the window.

### Camera and text

- **Camera F162–F475 (observed, measured):** slow push-in, scale 1.000 → 1.075 over 313 frames.
  - S-curve speed: about 0.00008/frame for the first and last 30 frames, about 0.0003/frame in the middle.
  - Fixed point around (0.10, 0.23): the frame closes on the sleeper and the window.
- **Sleeper acting:** static drawing. Cell differences are under 2, so there is no visible breathing; the push supplies all the motion.
- **Text (observed):** white bold rounded sans caps with a dark outline/shadow. All three are centred horizontally and switch on and off in a single frame.

| Text | Frames | Position | VO sync |
|---|---|---|---|
| "AUGUST 2, 1923" | F196–F261 (66 f) | box ≈ x 0.21–0.79, y 0.78–0.90 (bottom centre) | appears on "August"; ASR "nineteen twenty three" F218–F255 |
| "CALVIN COOLIDGE" | F262–F296 (35 f) | centred, ≈ x 0.16–0.83, y 0.44–0.54 | starts exactly on "Calvin" (ASR F261) |
| "PLYMOUTH NOTCH, VERMONT" | F348–F413 (66 f) | ≈ x 0.10–0.90, y 0.84–0.95 | ASR place words F344–F385 |

- **Name card dim:** the whole frame is darkened (mean brightness 77.2 → 23.5, about ×0.30) for exactly the 35 frames the name is on screen.

### Crash interruption, F476–F485 (observed, measured)

- **F476:** Coolidge swaps in one frame from asleep to propped up on one arm, head raised.
  - One eye becomes a wide white circle, the other squints behind a pince-nez lens, and the mouth becomes a jagged line, looking right.
  - The first white streak wedges appear at the right edge, on the door.
- **F476–F484 FX:**
  - White and pale-blue jagged horizontal wedge streaks burst in from the right edge and point left, covering x 0.55–1.0, plus grey wall-debris chunks.
  - The longest streaks reach past the window (x≈0.35).
- **F478–F485:** a black vintage car (spoked wheels, black body) pushes in from the right through the wall.
  - The **closed door is replaced by a jagged dark hole** (#1c1f2e).
  - At F485 the streaks are gone and the car is parked at the right edge (≈ x 0.68–1.0, y 0.42–0.97), showing only hood, fender and two wheels.
- **Camera shake and punch-in, F476–F483** (relative to F475):

| Frame | 476 | 477 | 478 | 479 | 480 | 481 | 482 | 483 |
|---|---|---|---|---|---|---|---|---|
| scale | 1.024 | 1.097 | 1.138 | 1.130 | 1.085 | 1.073 | 1.077 | 1.072 |
| rotation | +0.9° | +2.6° | +4.5° | +0.9° | −1.6° | −2.3° | −0.8° | 0° |

  The camera then holds the tighter 1.072 crop until F571: a punch-in that is never released.
- **F486–F516:** the car wheels keep spinning (about 15/frame difference in the wheel cell), then stop.
- **F486–F571:** Coolidge's awake pose is held static. Face differences of 2–6 are compression shimmer, checked in `crops/coolidge_awake_F505-516_face_x3.png`.
- The VO continues over the crash ("…a messenger… with the telegram"). The crash starts about 10 frames after "electricity" ends (ASR F465).

## S04 · F572–F831 · Oath room by kerosene lamp (staged environment)

This is the key beat for the user's film. It is documented in full below.

### Set build: layers back to front (observed at F572, `crops/oath_F000572_x3.png`; push end at F831, `crops/oath_F000831_x3.png`)

| # | Layer | Description, normalized position at F572 | Colour |
|---|---|---|---|
| 1 | Back wall | flat brown-olive panelling; vertical pilaster/beam strips at x≈0.16, 0.43, 0.75; a horizontal rail at y≈0.09; corners fall to near-black | edges #25201b, mid #433829–#51422f |
| 2 | Light pool on the wall | broad soft radial warm glow centred on the lamp (≈0.56, 0.48), radius ≈0.35 of frame width; brightest just above and behind the lamp/father | peak #564530 (≈2.2× edge luminance) |
| 3 | Back row behind the table | **Father** (John Coolidge) x 0.42–0.52, head top y 0.36; **young man** (dark hair, angry brows, white shirt and tie) x 0.57–0.66; **far-right grey bald man** x 0.90–0.98, feet higher (y≈0.76) = farther back, outside the pool | |
| 4 | Right chair | tall red-brown high-back chair partly behind the bald man, x 0.73–0.79, y 0.45–0.85 | #834f27 |
| 5 | Round table | wooden ellipse top x 0.38–0.66, y 0.64–0.79; two lighter diagonal light bands crossing it (upper right to lower left); dark legs/pedestal below | lit #8f5327, band #b08034, rim #875326 |
| 6 | Kerosene lamp | on the table centre, x 0.535–0.585, y 0.49–0.70: tulip-shaped glass chimney glowing pale yellow, thin stem, round brass base; a small soft halo around the glass | core #ffe477 / glass #fce579 |
| 7 | Front row | **Grace** x 0.165–0.265 (feet y 0.86); **Calvin** x 0.27–0.40; **eagle mascot** x 0.62–0.76 (in front of the table, feet off the bottom edge); **bald heavy-jowled man** x 0.78–0.87 | |
| 8 | Left foreground chair | red-brown high-back chair cropped by the left edge, x 0.02–0.17, y 0.54–0.97, nearly black | #2b1008 |
| 9 | Overlay | "2:47 A.M." text (see below) | white with black outline |

### Who stands where, and what they do (observed)

- **Calvin**, left-centre front:
  - Black suit, dark hair, stern flat brows, eyes on his father (turned three-quarter to the right).
  - **Right hand raised, palm out** (the oath gesture), at ≈(0.40, 0.57).
  - He is the only animated part of the scene (see acting).
- **Father**, behind the table, left of the lamp, facing Calvin:
  - White hair, round wire glasses, frowning mouth with moustache.
  - Left arm extended toward Calvin holding a white **Bible held flat** at ≈(0.42–0.47, 0.61).
  - Stands in the hottest part of the light pool (face #fadfbf).
- **Grace**, far left front:
  - Black curly updo, pink blush, pale grey-white dress with scalloped hem (#8b9088), hands clasped at her chest.
  - Small "o" mouth, eyes toward Calvin. Her face is partly shadowed (#877070).
- **Young man**, behind the table right of the lamp: frowning, eyes to the left, toward the oath.
- **Eagle mascot**, front right of the table:
  - White head, yellow beak (#fcea70), black suit, back three-quarters to camera.
  - Faces left toward Calvin and his father, one wing-hand resting toward the table edge.
  - **Role:** an in-world witness/presenter with no reaction during this beat.
- **Bald man** (front right) and **far-right grey man** (back right): scowling officials.
  - The far-right man sits outside the light pool, desaturated and darker (face #766b66).
  - He is pushed out of frame by the camera push (fully out by about F800).

### Lighting and grade (observed, measured)

- The only motivated light is the lamp. Brightness falls off radially: wall row at y = 0.30 goes #25201b (x 0) → #433829 (0.3) → #564530 (0.6) → #3b3126 (0.8) → #27201b (1.0).
- Faces are lit by their distance from the lamp: father and Calvin are brightest, Grace and the bald man mid, the far-right man dark.
- The light hits the near side of objects, e.g. the table bands and the chairs' inner edges.
- **No flicker:** the lamp region stays at 233–236 brightness for all 260 frames, and the lamp region changes by at most 2.0.
- Overall frame brightness is about 53–55, compared with 70–77 for the bedroom.
- **Inferred implementation:**
  - Neutral artwork under a warm brown multiply.
  - A large soft radial "light pool" glow (screen/add) centred on the lamp.
  - A dark radial vignette to the corners.
  - Painted lighter diagonal bands on the table top.
  - A small bright halo on the chimney.

### Acting (observed, measured on frames aligned to F572)

- **Calvin's mouth (talk loop):** open (black oval) for 8 frames, closed (frown line) for 11 frames, repeating every **19 frames**.
  - Openings at F572, 591, 610, 629, 648, 667, 686, 705, 724, 743, 762, 781, 800, 819: 14 cycles.
  - The loop is mechanical and not lip-synced to the narrator: Calvin "repeats the oath" under the VO.
- **Everything else is static:** no blinks, eye shifts, brow changes, arm moves, or lamp/flame animation.
  - Registered region differences for the other faces peak at 5–7 (resampling noise only).
  - Calvin's raised hand and the father's Bible arm never move (maximum difference 3.8 and 5.9 respectively, both noise).
- Eye lines all converge on the Calvin–father–Bible triangle around the lamp. That gives the composition its focus without any motion.

### Camera (observed, measured)

- Static for F572–F579, then a slow push-in. Scale: 1.011 @F590, 1.024 @F610, 1.060 @F660, 1.101 @F720, 1.141 @F780, 1.169 @F820, 1.174 @F831.
- Roughly linear at about 0.0007/frame, with a soft start. No ease-out: the cut interrupts it.
- Fixed point around (0.61, 0.65) (lamp/eagle). The frame closes from the right and bottom, cropping out the far-right man.

### Text (observed)

- "2:47 A.M." in white bold rounded sans caps with a thick black outline, single line, top centre (≈ x 0.34–0.66, y 0.11–0.20).
- On from the first frame of the cut (F572) until F633 (62 f, 2.07 s); hard off at F634.
- It appears about 14 frames before the narrator says "47" (ASR "forty seven" F586–F606), so the text leads the VO.
- No dim behind it: it sits over the dark wall, which keeps it readable.

## S05 · F832–F908 · Return to bed (bedroom plate reused)

- **Plate match (observed, measured):** F832 has exactly the original F162 framing (scale 0.9975 vs F162). The F162–F475 push and the crash punch-in are both reset.
  - Same wall, curtain, window, moon, bed and floor.
  - **Continuity details:** the car is gone, but the **jagged hole where the door was remains** (#1c1f2e). The bed is empty.
- **Walk (observed, measured):**
  - Coolidge walks right to left in front of the bed toward the pillow end, from bounding-box left x 0.469 (F832) to 0.230 (F907).
  - Speed is constant at −0.00323 of frame width per frame (1.38 px/frame at 426 px wide, about 0.10 of frame width per second). Linear, with no ease in or out.
  - The figure is about 0.39 of frame height. The top of his head rises from 116 to 101 px during F832–F870 (estimated: drifting slightly upstage), then stays level.
  - **Pose:** half-closed purple-lidded eyes, head drooped forward, jaw slack, arms hanging, black suit.
  - The legs rotate every frame (rigged), giving a slow shuffle. Stride period is estimated at about 20 frames per step (low confidence).
- **F908:** the camera starts pushing in (scale 1.06, shifted 9 px down) on the last frame before the stamp.

## S06 · F909–F1007 · Stamp payoff (closer crop of the same plate)

- **F909 (observed):** a single blended frame. The standing walk-shot Coolidge and the lying close-shot Coolidge are superimposed under the oversized stamp: a one-frame dissolve hidden by the stamp.
- **Close framing (estimated):** about 1.35× the F162 plate, tilted lower. Bed fills the lower left, window/curtain top centre, moon partly hidden behind the stamp.
- **Sleeper:**
  - Lying on his side under the blanket, head on the pillow at left (x≈0.17–0.33).
  - Eyes closed, mouth open as a dark snoring shape (static).
  - **F910–F911:** three white curved motion arcs over the blanket hump show that he has just flopped into bed (2 frames).
- **Stamp (observed, measured):** "THE LAST PRESIDENT / SWORN IN BY HIS / FATHER", three centred lines, white bold rounded sans caps on a near-black box with a grainy white speckled border.

| Frame | F909 | F910 | F911 | F912 |
|---|---|---|---|---|
| scale | ≈2.9× (text clipped by frame edge, estimated) | ≈2.0× | ≈1.38× | 1.00 |
| box | see-through, scene visible | see-through | see-through | **opaque** |

  - Scale drops by about ×0.7 per frame: 3 frames to land, no overshoot, no bounce.
  - The centre travels from about frame centre to (0.684, 0.262).
  - Settled size: 210×82 px rotated rectangle, i.e. 0.49 of frame width × 0.34 of frame height, top-right (≈ x 0.44–0.93, y 0.09–0.43). Tilt +7° clockwise.
  - Held F912–F1007 (96 f, 3.2 s), static. The border grain does not boil (cell differences under 4).
  - Lands on the VO word "last" (ASR F911).
- No dim or flash on landing (observed).

## S07 · F1008–F1019 · Next segment start

Hard cut to a bright, saturated White House lawn: a grey White House façade, hedge, green grass, and a line of cartoon guests (Coolidge with Grace among staff and kids). Figures shift slightly every frame (bob/idle). Brightness jumps from 72 to 118.

---

## Character design and rig notes (observed / inferred)

- **House style:**
  - Large rounded-rectangle heads on narrow bodies.
  - Stick-thin black legs and arms ending in small 3–4 finger mitten hands.
  - Uniform heavy black outline (about 2 px at 240p, about 0.8% of frame height).
  - Flat fills plus soft shading. Pink blush ovals on women and on Harding.
- **Head-to-body ratio (estimated, standing figures):**
  - Oath-room Calvin: head ≈0.16 of frame height, total figure ≈0.62 of frame height, so about 1:3.9 including legs.
  - Walk figure: head ≈1/3.3 of total height.
- **Faces:**
  - Eyes, brows and mouths are separate swap drawings: X-eyes, wide circle eye, half-lid eyes, open oval mouth, frown line.
  - Swaps are single-frame with no inbetweens: Harding F69, F84; Coolidge F476; mouths in S02 and S04.
- **Inferred rig:**
  - Cut-out puppet: head as one group with face swaps, torso, and limb lines rotated at shoulder/hip.
  - The F832–F907 legs are rotated every frame, while poses such as the F476 awake pose are whole-pose swaps.
- **Calvin's three states in this clip:** asleep (eyes-closed swap); alarmed (propped-up pose swap); sleepy walk (half-lids); and the oath-room standing pose with raised palm.

## Audio findings (waveform only, unverified)

- **VO:** continuous narration throughout (ASR above).
- **Candidate SFX onsets** (delta = audio frame − visual frame):

| Visual event | Audio onset | Delta | Note |
|---|---|---|---|
| Name card / dim, F262 | 8.72 s (strongest flux of the clip) | 0 | estimated whoosh/hit, but it also coincides with "Calvin" |
| Crash burst, F476 | F479 | +3 | |
| Car settles, F485 | F486, −13.8 dB | +1 | estimated crash/thud |
| Stamp entry, F909 | 30.31 s | 0 | estimated stamp hit |
| Cut to oath room, F572 | F574 | +2 | |
| Cut to bedroom, F832 | F833 | +1 | |
| Cut to lawn, F1008 | F1003 | −5 | audio leads |

- No onset was found at the Harding X-eyes/spike (F84).
- Onsets during the walk every 5–9 frames (F843…F891) may be footsteps or VO syllables (low confidence).
- Full list in `audio_cues.csv`. No sound type is confirmed.

## Reusable mechanics

Starting values are editable. Evidence frames are in brackets.

1. **Lamp-lit oath tableau** [F572–F831, observed]
   - Build order, back to front: dark brown back wall with vertical beams → large soft radial warm light pool on the wall (radius ≈0.35 W, centred on the lamp, peak ≈2.2× edge luminance) → back row behind a round table → chair silhouettes → table with 2 lighter diagonal light bands → glowing glass lamp at table centre (≈x 0.56, y 0.48–0.70) → front row → dark foreground chair cut by the frame edge → dark vignette in the corners.
   - Colours: edge #25201b, pool #564530, lamp #ffe477, lit skin #f4ddb7, unlit skin #766b66.
   - Stage the officiant behind the table in the hottest light, holding a white Bible toward the oath-taker. Put the oath-taker front-left with a raised right palm, the spouse at the far left, the mascot front-right with its back three-quarters to camera, and the farthest official outside the pool.
2. **Stillness as staging** [F572–F831, observed]
   - In a solemn beat, animate only the speaker's mouth on a mechanical loop: open 8 f / closed 11 f (period 19 f, editable 15–24 f).
   - Hold every other face, the flame and the hands still. No blinks are needed when a slow push carries the shot.
   - Push from 1.00 to 1.17 over 8.7 s (≈0.0007/frame), fixed point on the lamp (0.61, 0.65), letting the frame edge crop the outermost figure.
3. **Cool night bedroom vs warm oath room** [F162 vs F572, observed]
   - Use the same flat-colour artwork under two grades.
   - Night: blue-grey wall #4d5565, navy sky #1d2b6c, skin pulled to #736967, the only glow a pale halo #7a86a8 around the window.
   - Oath: amber/brown with a single radial pool.
   - Cut hard between them; no colour transition (F571→F572, F831→F832).
4. **Plate reuse with a continuity scar** [F162 vs F832, measured]
   - Return to the exact original framing of the bedroom plate (scale 1.00, all earlier pushes reset).
   - Remove the intruding prop (car) but keep the damage (the jagged hole replaces the door). This rewards attentive viewers at no animation cost.
   - The payoff shot reuses the same plate at a ≈1.35× crop [F909+].
5. **Slow establishing push under text cards** [F162–F475]
   - Scale 1.00→1.075 over about 10 s with an S-curve, fixed point on the subject's quarter of the frame (0.10, 0.23).
   - Date and place labels: bottom-centre white bold caps with dark outline, single-frame on/off, about 66 f each.
   - Name card: centred caps over a whole-frame dim to ×0.30 brightness, about 35 f, starting on the name word [F262].
6. **Impact entrance (crash through the wall)** [F476–F485]
   - 1-frame wake pose swap on the first impact frame.
   - 9 frames of white jagged wedge streaks from the entry edge plus grey debris.
   - Prop pushes in over 8 frames and parks at the frame edge.
   - Camera shake: scale peak +14% at frame 3, rotation +4.5° then −2.3°. Settle by frame 8 into a held +7% punch-in. Wheels spin about 1 s after parking.
7. **Death gag** [F80–F88]
   - 4-frame eased push to ×1.44 (fixed point near the victim's head).
   - On the landing frame, swap eyes to X X and fire a white jagged spike from the chest for 4 frames.
   - Keep the oblivious listener talking (open-oval mouth hold), then slide her out over 10 frames with ease-in. Hold the corpse alone for about 20 frames before cutting.
8. **Sleepy walk back to bed** [F832–F907]
   - Linear travel of 0.0032 W/frame (≈0.1 W/s) toward the bed.
   - Half-lid purple eyes, drooped head, hanging arms, legs rotated every frame.
   - Start a push (×1.06) on the last frame, then a one-frame blend into the close "in bed" pose, hidden under the stamp.
9. **Stamp landing** [F909–F912; compare the held stamp at F0–F37]
   - Start at ≈2.9× near frame centre with the box see-through. Scale ×0.7 per frame (2.0, 1.38, 1.0) while moving to the top-right.
   - Box turns opaque on the landing frame. Tilt +7° to +12° clockwise. Settled size 0.49 W × 0.34 H, centre ≈(0.69, 0.26).
   - White bold rounded caps, 3 centred lines, near-black box, grainy white border.
   - No overshoot. Add 2 frames of white plop arcs on the character. Hold about 3.2 s. Land on the word "last".
10. **Time label without a dim** [F572–F633]
    - When a cut lands in a dark room, put the white outlined time stamp at top centre ("2:47 A.M.", ≈0.32 W × 0.09 H) on the first frame of the cut.
    - Hold about 2 s and cut it off in one frame. It may lead the spoken time by about 0.5 s.
