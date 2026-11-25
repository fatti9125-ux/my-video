# Clip 03 — Jackson Battle and Debt: frame analysis

Source: `03_Jackson_Battle_and_Debt` — 426×240 at 30 fps, 1050 frames (F0–F1049, 0–35.000 s).

Labels used below:
- **observed**: I can see it in the frames.
- **estimated**: a measurement with visible uncertainty.
- **inferred implementation**: a plausible way it was built.

The VO lane is the ASR transcript (approximate, about 0.1 s timing, garbled in places). No audio was played, so all sound cues are unverified (waveform only).

Evidence: `sheets/seq_*.png` (every frame), and the crops listed per item in `crops/`.

## Shot table

| shot_id | first–last frame | start–end s | type | story purpose / motivating VO (ASR, approx.) |
|---|---|---|---|---|
| S01 | F0–F63 | 0.000–2.133 | staged environment with presenter (Jackson on podium, eagle mascot) | Establishes 1828 and a popular Jackson; "eighteen twenty eight … big" (F3–F60). Opens mid-beat (the caption is already on screen). |
| S02 | F64–F342 | 2.133–11.433 | staged environment (night battle), two pull-back reveals, stamp | Flashback: "the last president [who] fought in the revolutionary war" ("last" F96, "president" F110, "revolutionary war" F143–F170). Stamp 1. |
| S03 | F343–F646 | 11.433–21.567 | combination: staged environment plus a stylized turn-based "battle" interface graphic | Jackson versus DEBT: "sold off … western [land]" (F423–F474), "the national bank" (F514–F533), "nearly every spending bill" (F566–F608). |
| S04 | F647–F865 | 21.567–28.867 | same set and camera as S03 (no editorial cut): victory pose, date caption, pan, stamp | "January of [18]35" (F644–F692); "[Jackson became the] last president to take our debt to zero" (F752–F831). Stamp 2. |
| S05 | F866–F1049 | 28.867–35.000 | presenter composition plus diagram (board with a line chart) | "and it lasted about a year, then the economy crashed" ("and" F867, "then" F918, "crashed" F944). Clip ends mid-beat. |

The clip has 3 hard cuts: F64, F343 and F866. S03 and S04 are joined by a puppet swap inside a continuous camera push.

---

## S01 — F0–F63: 1828 rally

**Blocking and reveal order (observed)**
- The shot is fully built at F0.
- The eye lands first on the "1828" caption at top centre.
- It then goes to the two characters on the podium:
  - the eagle at about x 0.28, y 0.42;
  - Jackson at about x 0.33–0.37, y 0.33–0.45, a 3/4 view facing right.
- After that, the dense crowd fills the bottom 45% and the red cheer marks blink over it.
- Nothing enters or exits during the shot.

**Layers, back to front (observed)**
1. Sky with clouds.
2. White House (centre right, small).
3. Treeline and green lawn.
4. Two US flags on poles at upper left and right; they flutter using cycled art (dx 1–4 px).
5. Podium with red-white bunting, with Jackson and the eagle behind it.
6. Crowd: many duplicated small head-and-shoulder sprites with varied hair, all static.
7. Red "hand-wave" scribble marks (FX).
8. The caption.

Parallax could be split as sky, then White House and trees, then flags and podium, then crowd. The camera is static (the podium moves 2 px or less).

**Acting**

*Cheer marks* (red pixel counts per frame; observed):
- The marks cycle through 3 states, each held about 4 frames:
  - set A (left and right of the crowd);
  - off;
  - set B (centre).
- There is a one-frame half-blend between states.
- Period: 12–13 frames.
- State timings:
  - A: F10–13, F21–24, F33–37, F46–49, F58–61.
  - Off: F14–16, F26–29, F38–41, F51–53.
  - B: F5–8, F17–20, F30–32, F42–45, F54–57.

*Jackson's mouth* (observed):
- Alternates between a closed grin and an open shout.
- Open spans: F4–7, F16–20, F29–32, F41–44, F53–56.
- Each open hold is 4–5 frames and each closed hold 8–12 frames.
- The mouth opens one frame before the B marks appear, so both are probably one looping precomp (inferred implementation).

*Eagle* (estimated): holds still with only minor face changes (region diff 4 or less). No blink was confirmed at 240p.

**Mascot role:** the eagle stands beside the subject on stage as a companion. He has no speaking role here.

**Text:** "1828" sits at x 0.427–0.570, y 0.117–0.163. It is white heavy rounded sans, all digits, with a dark outline of about 2 px. It is on screen for the whole shot, with no entry or exit visible (crops/s01_1828.png).

**Cut:** a hard cut at F64.

---

## S02 — F64–F342: night battle (two reveals, stamp 1)

**Visual states**
- S02a F64–96: close-up march.
- S02b F97–105: pull-back 1.
- S02c F106–111: stamp lands.
- S02d F112–213: medium march.
- S02e F214–225: pull-out 2.
- S02f F226–342: wide battle.

**Blocking and reveal order (observed)**
1. *Tight framing.* Young Jackson is centre-left, 3/4 view facing right: dark wavy hair, a confident smirk, blue coat with red trim, and a musket with bayonet. Continental soldiers in tricorns surround him.
2. *Pull-back 1 (F97–105).* Reveals the eagle mascot marching in the ranks behind Jackson, a wooden palisade on the right, and more troops.
3. *Stamp 1 (F106).*
4. *Pull-back 2 (F214–225).* Reveals a redcoat cannon crew on a rampart at upper right, firing at Continentals massed at lower left. The palisade runs diagonally from the centre to the bottom right.

**Layers (observed / inferred)**
1. Navy night sky.
2. Dark treeline band.
3. Dark-green field with brush-stroke texture.
4. Palisade.
5. Rampart with cannon and redcoat crew.
6. Continental troop groups.
7. Red impact FX.
8. Stamp (screen-locked).

**Motion**

*March bob, S02a (observed):*
- Jackson's head moves dy −5 to +12 px (17 px peak-to-peak, 0.07 of the height).
- The period is about 24 frames: peaks at F72–73 and F97, trough at F85.
- The motion is a smooth per-frame sine, not held drawings.
- The background is fixed, so there is no camera tracking (this corrects the earlier notes).
- The soldier on the right bobs in phase; the soldier on the left drifts up-screen by 17 px over 30 frames.

*Pull-back 1, F97–105 (observed):*
- Scale goes from 1.0 to 0.415 (2.4x) in 9 frames.
- Per-frame factors: .974, .935, .919, .906, .894, .883, .873, .871, .911.
- The fixed point drifts from (0.44, 0.45) to (0.15, 0.57), so it is a zoom combined with a pan.
- Speed is nearly linear with a quick stop.
- The stamp enters on the very next frame.

*S02d hold (estimated):* troops, Jackson and the eagle keep marching in place with bobs and open shouting mouths. Background float is 2 px or less.

*Pull-out 2, F214–225 (observed):*
- Scale goes from 1.0 to 0.488 (2.05x) over 12 frames.
- Per-frame factors: .968, .957, .946, .937, .928, .925, .920, .921, .926, .937, .957, .984.
- This is a clean ease-in-out with peak speed at F219–221, anchored at the left edge (0.06, 0.42).

*S02f (estimated):* the whole plate drifts slowly (2.4 px or less, rotation 0.8° or less, period about 50 frames). Troops and cannon crew share this motion.

**FX: impacts (observed, red pixel counts; crops/s02_blasts.png)**

The impacts are flat red jagged splash shapes that pop on, hold static with no scale animation, and pop off.

| Span | What happens | Hold |
|---|---|---|
| F258–267 | Impact among the Continentals, left of centre | 10 frames |
| F283–292 | Impact at a new position | 10 frames |
| F315–316 | Small red muzzle flash at the cannon mouth | 2 frames |
| F317–326 | Field impact; the drawing swaps once at F320 | 10 frames |
| F338–342 | Large impact that runs into the cut | 5+ frames |

Firing reads as "muzzle flash, then 10-frame impact hold."

**Stamp 1: "LAST PRESIDENT / WHO FOUGHT IN THE / REVOLUTIONARY WAR"**
- Three lines, centred, all caps.
- White geometric sans with a distressed/grunge texture (observed).
- The box is a white grunge outline rectangle with a translucent fill. There is no separate flash; brightness rises from 62 to 101 at F106 only because of the large white stamp area.

*Landing (estimated):*

| Frame | Approximate scale vs. settled | Note |
|---|---|---|
| F106 | more than 3.4x | spans x 0.04 to off-screen right, y above the top to 0.73 |
| F107 | about 3x | |
| F108 | about 2.5x | |
| F109 | about 2x | |
| F110 | about 1.3x | |
| F111 | about 1.05x | |
| F112 | 1.0 | settled |

*Settled (observed):*
- Bbox x 0.660–0.942, y 0.537–0.949.
- Rotated rectangle 0.281 W × 0.344 H.
- Tilt +10° clockwise (text descends to the right).
- Held F112–342 (7.7 s), screen-locked across pull-out 2 and the whole battle.
- Timing vs. VO: the stamp's first frame is 10 frames after ASR "last" (F96) and 4 frames before "president" (F110).

**Character design (observed)**
- Head-to-body ratio about 1:2.5.
- Line weight about 2 px black at 240p.
- Simple dot or short-line eyes, a single-stroke mouth, stick legs, and tube arms ending in mitten hands.
- Coats are flat colour with red trim dots.

---

## S03 — F343–F646: "Jackson vs DEBT" turn-based interface parody

**Set (observed)**
- A dim palace hall with a warm grey-brown palette.
- Back wall with pilasters and columns, dark doorways, and a round wall ornament.
- A chandelier cut off by the top edge.
- A red carpet band at y about 0.55.
- A dark stained, checkered floor.

Old Jackson stands at left, x about 0.15–0.32, full figure, 3/4 view facing right. He has a white hair blob and a black coat. The camera is static until F636.

**Reveal order and timing (all observed; crops/s03_*.png)**

*Enemy appears*
1. **Slot (F343–351).** A flat white ellipse at x 0.563–0.958, y about 0.45, height about 0.04 H, fades in at full width over 9 frames. It does not grow.
2. **Word rises (F353–367).** Orange 3D word-art letters with black outlines rise out of the slot, masked by the ellipse line, with a slight rotation wobble.
   - D: F353–357. E: F355–360. B: F358–363. T: F361–366.
   - Stagger 2–3 frames; each letter rises over 5–6 frames.
   - Settled F366–367 at about x 0.575–0.95, y 0.30–0.47.

*Jackson reacts*
3. **Face swap (F378).** His face changes from stern (furrowed brows, flat mouth) to a squint-scowl with an open grimace, in one frame. Head and hair art are unchanged. Motivated by ASR "he" at F377 (+1 frame).

*Command menu*
4. **UI slides up (F381–386).** It slides in from below the bottom edge over 6 frames, ease-out, with its text already filled in.
   - Text box: x 0.164–0.561, y 0.725–0.941. Navy fill, gold border, thin white inner rule. Pixel monospace text in white: "What will / ANDREW JACKSON do?".
   - Menu: x about 0.555–0.855, same y band. White rounded box with lavender border. Options "FIGHT BAG / SWITCH ▶RUN".
5. **Cursor jump (F403).** The cursor starts on RUN (a gag) and jumps to FIGHT, instantly.

*HP boxes*
6. **Menu out (F426–429).** The menu slides off to the right over 4 frames.
7. **HP boxes in (F429–434).** Both slide in over 6 frames with ease-out (step sizes 33, 29, 27, 21, 12, 1 px).
   - "JACKSON" box: from the left to the top-left corner, about x 0.03–0.38, y 0.03–0.14.
   - "DEBT" box: from the right to below the word, about x 0.64–0.90, y 0.46–0.60.
   - Both are pale yellow with a dark frame, an "HP" label and a green bar.
8. **Back view (F435).** Jackson swaps to a back view in the same position. The background and framing are unchanged, so this is not a camera reverse (corrects the earlier notes).

*Three attacks*

Each attack follows the same pattern:
- icon drops in from the top (1–2 frames);
- red jagged hit burst across the base of the word (2–3 frames);
- text box clears;
- DEBT HP bar drops instantly (one frame, no tween, the bar stays green);
- the description types on.

| Attack | Icon in | Hit | HP drop | Type-on | Text |
|---|---|---|---|---|---|
| 1 | US map F439–440 | F441–442 | F443: 100% → 66% | F444–462, about 2.4 chars/frame | "He sold off millions of acres of western land" |
| 2 | Bank F507 (map fell out F503–505 with white speed streaks; F506 clean) | F508–510 | F511: → 29% | F509–526, about 1.5 chars/frame | "Killed the national bank" |
| 3 | Bill/paper F555–556 (text cleared F550; bank out F552–553; streaks F553–556) | F558–559 | F560: → 0% | F551–569, about 1.5–1.8 chars/frame | "Blocked nearly every spending bill" |

From F560 the DEBT letters are drawn broken.

*Defeat and clear-out*
- F626–630: the text clears, the bill falls away and reveals crumbled DEBT letters, with white streaks at F629–630.
- F631–634: HP boxes slide out (4 frames).
- F636–640: the text box slides down and out (5 frames).
- F641–646: broken letters and slot fade out (opacity, about 6–7 frames).

*Camera:* a slow push-in starts at F636 under the UI exit (see S04).

**Order of attention (observed):** enemy word, then the Jackson reaction, then the prompt, then for each attack the icon, the hit and the HP bar, then the text. Each attack text is held about 1.3–2 s (F463–502, F527–549, F570–625).

**Acting and VO**
- The scowl lands on the line start (+1 frame).
- Icons and text arrive near the matching VO phrase:
  - Map: dropped at F439, about 1 s before "western" (F474), and typed over "sold off… western".
  - Bank: F507, about 0.4 s before "national bank" (F518).
  - Bill: F555, about 0.4 s before "nearly" (F566).

**Design note (from the brief):** treat this as an example of a stylized interface. Build a fresh graphic identity for a new subject.

---

## S04 — F647–F865: victory beat, date caption, stamp 2 (same set, no editorial cut)

**Pose swap and push**
- F647: the back view swaps to a front victory pose, instantly. Both arms are raised with fists, brows sly, smile smug, head facing 3/4 right.
- The camera push that began at F636 continues. Total about 1.46x (F636→650 ×1.074, F650→700 ×1.357).
- Per-frame push is ×1.003 to ×1.007, decaying to zero by about F705–710. The anchor moves from bottom-left to bottom-centre. Then the frame holds.

**Idle (observed F760–800, consistent on sheets across F647–865):** the whole character bobs smoothly by 4 px (0.017 H) with a period of about 16 frames.

**Caption "JANUARY, 1835" (observed)**
- White, bold geometric sans, all caps, with a dark outline and soft shadow, bottom centre.
- Position: x 0.228–0.754, y 0.81–0.91; cap height about 0.1 H.
- Hard on at F653, hard off at F734 (81 frames, 2.7 s).
- Screen-locked while the camera pushes.
- Appears 9 frames after ASR "january" (F644).

**Pan right (F744–753, observed):** the content shifts −83 px (0.195 W) over 10 frames, ease in-out (per-frame px: 4, 8, 9.5, 10, 10, 9.6, 8.7, 8.1, 7.1, 5). Jackson ends at the left third, leaving empty space on the right for the stamp.

**Stamp 2: "LAST PRESIDENT / TO TAKE OUR DEBT / TO ZERO"**
- Same style as stamp 1, but larger and placed top-right.
- Landing (estimated):

| Frame | Approximate scale vs. settled | Note |
|---|---|---|
| F752 | about 2.2x or more | fills the frame, bbox x 0.05–1.0, y 0–1.0 |
| F753–756 | about 2.0x shrinking slowly to 1.85x | |
| F757 | about 1.2x | |
| F758 | 1.0 | settled |

- The scale curve is ease-in: hang big, then snap.
- During the landing (F753–758) the camera recoils with a small pull-back of about −1.4% (estimated).
- Settled (observed): centre (0.715, 0.311); rotated rectangle 0.495 W × 0.340 H; bbox x 0.453–0.981, y 0.013–0.617; tilt +19° clockwise.
- Held F758–865 (3.6 s) to the cut.
- Timing: the stamp lands about 25 frames before ASR "last" (F777). Here it leads its phrase; stamp 1 lagged its phrase by 10 frames.
- Reaction: Jackson keeps the same victory pose and bob. There is no new expression after the stamp.

---

## S05 — F866–F1049: presenter board, falling line

**Set (observed)**
- A light-grey office/presentation room: pale wall panels and window frames, and a mid-grey floor band at y about 0.80.

**Blocking (observed)**
- Jackson is at far left (x about 0.0–0.20), 3/4 view facing right: squint-frown, small open "ugh" mouth.
- The eagle presenter overlaps him at x about 0.17–0.40. He wears round glasses, a black suit and tie, his beak is closed, and he holds a long black pointer stick.
- A white board with a dark grey frame sits at x about 0.47–0.94, y 0.13–0.64, on a single post at x about 0.70.
- The eye goes first to the empty board, because the pointer aims at it, then to Jackson's frown.

**Mascot role:** the eagle is the presenter and explainer, the "Flappy" role. He points and does not speak on screen (beak closed throughout).

**Idle (observed):**
- Smooth breathing in counter-phase: Jackson sinks while the eagle rises.
- Amplitude 3 px (0.0125 H), period about 26 frames.
- Jackson's head moves +3 px and his body +2 px, which reads as a squash (inferred: a scale-Y breathe pivoting at the feet).
- No blinks or mouth changes were found (eye-region pixel counts are steady).

**Line chart (observed)**
- A red zigzag line reveals stroke by stroke from the top-left of the board, starting at F917. This is about on ASR "then" (F918), 1 frame before.
- Start point (0.505, 0.204).
- The tip moves at about 2.2 px per frame (0.005 W per frame) along the downward strokes.
- The short up-ticks appear in jumps of 1–2 frames (F929–930, and F955–956 where x jumps 299→314). The line therefore reads as being drawn in segments.
- It reaches (0.838, 0.475) at F978.
- The arrowhead appears in pieces from F979 to F985; its tip is at (0.876, 0.525).
- The finished chart holds static to the end.
- This is a conceptual "economy falls" line: no axes, no data labels.

**Pointer (observed):** rotates from about 48° to 7° over the shot, near-linear (about 0.22° per frame after F885). The tip moves from (0.594, 0.267) to (0.671, 0.525). It points generally toward where the line is being drawn but does not track the line tip exactly.

**End:** the clip ends at F1049 mid-hold.

---

## Character design and rig notes (all shots)

**Construction (observed)**
- Flat colour, black outlines of about 2 px at 240p, no shading except darker coat panels.
- Heads are large: about 1:2.5 head-to-body for young Jackson, about 1:2 for old Jackson in the victory pose.
- Legs are single stick lines; arms are tube lines with round fists.

**Old Jackson**
- White cloud-shaped hair silhouette and a pinkish-peach face.
- Simple brows and eyes, a nose drawn as a single line.
- Black coat with grey lapels and a white shirt.

**How parts change (observed)**
- The face is swapped as a whole drawing: brows, eyes and mouth change together (F378); hair and head outline stay.
- Front, back and pose views are separate drawings swapped in a single frame (F435, F647).

**Eagle**
- White head, yellow beak, small dot eyes; in S05, glasses and a suit.

**Rig (inferred implementation)**
- Cut-out puppets moved as whole groups: bob, breathe and squash.
- Swappable face and pose drawings.
- Very few joint animations visible apart from the pointer's arm and stick rotation.

## Audio findings (waveform only, unverified; see audio_cues.csv)

| Visual event | Frame | Nearest onset | delta_frames | Note |
|---|---|---|---|---|
| Stamp 1 | F106 | 3.52 s (−17.9 dB) | 0 | |
| Blast 2 | F283 | F280 | −3 | |
| Cannon / impact | F317 | F318 (−10.3 dB, loudest) | +1 | |
| Blast 4 | F338 | F337 | −1 | |
| Cursor jump | F403 | F404 | +1 | |
| HP boxes slide in | F429 | F430 | +1 | |
| Hit 1 | F441 | F442 | +1 | |
| Stamp 2 | F752 | F750 | −2 | |
| Second onset during stamp 2 | — | F756 | — | |
| DEBT defeat | F626 | F629 | — | |
| Text box out | F636 | F638 | — | |

- No clear onset was found at hit 3 (F558).
- Sound identities are left as "estimated" (stamp thud, cannon, UI blip) only where the visual makes the type obvious.
- VO lane = vo_words.csv (ASR, approximate).

## Reusable mechanics

1. **Stamp slam.**
   - First frame at about 2–3.5x the final size, partly off-frame.
   - Shrinks to final size in 6 frames (F106–111; F752–757), with an ease-in "hang then snap" in S04. Settled on frame 7.
   - Tilt +10° to +19° clockwise.
   - White grunge text with a translucent outline box.
   - Held screen-locked for 3.6–7.7 s, even across camera moves (F112–342).
   - Starting values: start scale 3.0, 6 frames, ease-in, rotation +12° to +20°, final width 0.28–0.50 W, placed in the negative space created by a camera move.
2. **Reveal with a fast pull-back right before a graphic.**
   - Scale 2.0–2.4x over 9–12 frames.
   - Either ease-in-out (F214–225) or near-linear with a hard stop (F97–105).
   - The anchor sits near the frame edge that keeps the subject.
   - The stamp lands on the frame after the pull ends (F105→F106).
   - Starting values: 10 frames, scale 1→0.45, anchor (0.1, 0.45).
3. **Make room before the stamp.** Pan by 0.2 W over 10 frames, ease in-out, so the subject sits in the left third, then stamp into the empty right (F744–753 then F752).
4. **Looping crowd excitement without animating the crowd.** A static crowd plus 3 overlay states of red cheer marks (A / off / B) held 4 frames each, 12–13 frame period, with the speaker's mouth-open drawing locked to state B (F0–63).
5. **Marching and idle bobs are smooth per-frame offsets, not held drawings.**
   - March: 0.07 H peak-to-peak, period 24 frames (F64–96).
   - Victory bounce: 0.017 H, period 16 frames (F760–800).
   - Two-character breathe in counter-phase: 0.0125 H, period 26 frames (F866–1049).
6. **Expression, view and pose changes are one-frame swaps** of the whole face or body drawing, landing within about 1 frame of the motivating VO word. The new state is then held for seconds (F378, F435, F647).
7. **Impact FX are flat red jagged shapes popped on for a fixed hold** of 10 frames in battle (F258–267, F283–292, F317–326) or 2–3 frames as interface hit flashes (F441–442, F508–510, F558–559). They have no scale animation. A muzzle flash runs 2 frames before its impact (F315–317).
8. **Interface/graphic pattern for listing a character's achievements** (fresh identity needed):
   - Spawn slot fades in (9 frames).
   - Title word rises letter by letter: 5–6 frames per letter, 2–3 frame stagger (F343–367).
   - Panels slide in or out over 4–6 frames with ease-out (F381–386, F429–434, F631–640).
   - Each "attack": icon drops 1–2 frames, hit 2–3 frames, instant bar step, type-on at 1.5–2.4 chars per frame, held 1.3–2 s (F439–625).
   - Defeat: swap to broken art, then fade over 6–7 frames (F626–646).
9. **Date caption.** White bold caps with a dark outline, bottom centre (y 0.81–0.91, width 0.53 W). Hard cut on and off, held 2.7 s, screen-locked during a push (F653–733).
10. **Explainer line chart.** A red stroke reveals at about 0.005 W per frame, with short reversals as 1–2 frame jumps and the arrowhead last (about 7 frames). Total 69 frames (2.3 s), started on the VO word (F917–985). The presenter's pointer rotates linearly toward the drawing area (48°→7° over 6 s) instead of following the tip exactly.
11. **Slow push to land a payoff.** About 1.46x over about 70 frames, decaying to a hold, starting while the interface clears so that the pose swap happens inside the move (F636–705).
