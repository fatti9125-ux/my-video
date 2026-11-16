# Style Analysis: "Every Presidential Last Explained in 23 Minutes"

Source: 426x240, 30 fps, 23:05 (1385.6 s), stereo AAC at 44.1 kHz.
Method: ffmpeg scene detection (306 cuts); contact sheets with one frame every 5 s across the whole video (277 frames); 30 fps strips of sample shots (title card, dialogue, face swap, stamp beat); per-frame pixel-difference measurements; loudness, stereo and spectrogram analysis of the audio.
Limits: at 240p, fine line detail is approximate. The audio was measured, not listened to, and there is no transcript.

---

## 1. Format and structure

- **Type:** Educational comedy explainer. A narrator voices it over cartoon reenactments, one segment per president in chronological order (Washington, J. Adams, Jefferson, Monroe, JQA, Jackson, Van Buren, W.H. Harrison, Tyler, Taylor, ... Nixon, Ford, Reagan, Carter, ...).
- **Repeating segment template (about 30–60 s each):**
  1. **Name title card.** The opening shot is darkened by a black overlay of about 50–60%. The president's name sits centered in white, bold, all-caps geometric sans (Gotham or Montserrat Bold style). It holds for about 0.8 s (about 24 frames), then hard-cuts to the full-brightness shot. There is no fade.
  2. Context beats: date or keyword captions, a map, an archival photo.
  3. **The punchline "LAST" stamp.** A rotated rubber-stamp graphic (for example "THE LAST PRESIDENT TO LEAD AN ARMY PERSONALLY") appears over the comedic payoff shot.
  4. A gag reaction, then a cut to the next name card.
- **Pacing:** 306 cuts in 23 min, so the average shot lasts about **4.5 s**. Gag beats cut faster (1–2 s). Map and archival shots hold longer (5–8 s).
- **Cold open:** a battle scene, then the title "EVERY PRESIDENTIAL LAST" in white caps with a drop shadow over a waving US flag, with the mascot in front. The ending is a big group shot of all the presidents on the White House lawn with the mascot, followed by an outro.

## 2. Character design

- **Construction:** simple "bean" bodies. The head is large (about 40–50% of body height in mid shots). The torso is a rounded coat shape. **Arms and legs are single black stick lines** with no hands or feet, or only tiny nubs.
- **Faces:** minimal and expressive.
  - Eyes are small black dots or short dashes. Shock or emphasis gets wide round eyes with a dot pupil.
  - Eyebrows are thick black strokes and carry most of the emotion: angled down for anger or smugness, raised for worry.
  - The nose is a single "L" or "J" hook line.
  - The mouth is a single line. It opens into a dark shape with a tongue for shouting, or a big "D" grin.
  - Sweat drops (light blue teardrops), blushing cheeks (pink ovals) and tears are used as emotion markers.
  - Dead or knocked-out characters get "X X" eyes.
- **Caricature by silhouette:** each president is identified by **hair shape and colour, facial hair and costume**: the white powdered-wig puff, Lincoln's top hat and chin beard, Grant's full beard, Arthur's mutton chops, Taft's moustache, Carter's teeth, Reagan's pompadour. The base face template barely changes. Only the "identity props" change.
- **Costume:** flat period clothes with 1–2 tone cel shading: colonial coats with orange waistcoats, black suits with red ties for the modern era. Shapes are simple, with a few seam and fold lines.
- **Mascot:** a **bald eagle in a black suit and tie** (sometimes with an eyepatch). It is the narrator's on-screen stand-in and the comic foil. It reacts, points at charts, gets stamped on, and is in nearly every segment.
- **Line:** a thick, uniform black outline (about 3–4 px at 1080p scale) with rounded caps, like a vector brush. The inner detail lines are thinner.
- **Colour:** flat fills, a cel shadow on hair and clothes, no gradients on characters. Skin is a pale peach (#F5D5B8-ish). Darks are near-black, not pure black.

## 3. Animation style and timing (frame by frame findings)

- **Technique:** **rigged cut-out / puppet animation** (Adobe Animate, Moho or After Effects with Duik style rigs), **not** frame-by-frame drawing.
- **On 1s:** the per-frame difference never drops to 0 inside a held shot (it measured 0.4–1.9 every frame). Everything moves every frame at 30 fps through smooth interpolated tweens. Only 1,468 of 41,567 frames were detected as near-duplicates.
- **Constant camera drift:** almost every shot has a slow digital **push-in or pan** (about 2–5% scale over the shot). This "Ken Burns on vector art" keeps static poses alive and is the main source of motion.
- **Idle and breathing:** characters keep a subtle sway or head tilt while held, so they never freeze completely.
- **Expression and pose swaps:** expressions change by **instant replacement** (a face or mouth swap on a single frame), not by in-betweens.
  - Example from the dialogue strip: the eyebrows snap from neutral to angry in 1 frame, then hold.
  - Mouth flaps for dialogue use 2–4 simple mouth shapes, swapped about every 3–6 frames, loosely synced.
- **Cuts over in-betweens:** acting beats are often handled by cutting to a new pose or a closer shot instead of animating the transition. The face-swap strip shows a **hard cut on 1 frame** from one president close-up to another, with the same background and camera.
- **Comedic physics:** characters fall over stiffly, flip upside down with legs flailing, and get squashed under objects. These are mostly rotate and translate tweens with ease-in/out, plus snappy holds.
- **Crowds:** troops and audiences are **duplicated instances** of the same rig in grids, with small offsets. Battles use mass duplication (tiny soldier sprites in blocks) plus red slash or explosion overlays.
- **Effects:** cartoon fire (flat yellow/orange/red shapes), red energy streaks, a smoke puff, a dust trail, a "?" keyhole silhouette, sparkles, speech bubbles. Effects are flat and graphic, not particle-realistic.

## 4. Backgrounds

There are four distinct background types:

1. **Painted illustrative environments** (the main look). These are semi-detailed, softly rendered backgrounds that are **more detailed and textured than the characters**: the White House lawn with a blue sky, puffy clouds and leafy trees; log cabins; meadows with pine forests and mountains; a desert with a covered wagon. Colours are saturated but slightly muted, and edges are softer than on the characters, which keeps the figures popping.
2. **Interior sets:** the Oval Office (gold curtains, flags, a wooden Resolute-style desk), the House chamber, a Congress hall with columns and a chandelier, a tavern, a bedroom. Warm brown and gold palette, with sets reused heavily across segments.
3. **Infographic or flat graphic plates:**
   - A solid **bright blue (#1E90FF-ish) background with a beige or grey map** (US states, NY counties, the Gadsden Purchase) with the highlighted region in red or yellow.
   - A whiteboard with a red line chart.
   - A solid red flash frame.
   - A US or UK flag full-frame with a waving distortion.
4. **Archival media:** real photos and engravings (Frances Folsom, Sousa, the Constitution, war etchings, Reagan/Mondale debate footage) graded **sepia or monochrome** with a film-grain or scratch texture and a dark vignette. Text sits on top in the same white caps.

The darkened version of any of these is used for the name cards.

## 5. Typography and on-screen graphics

- **Primary font:** a bold geometric sans in all caps, white with a soft dark drop shadow (Montserrat ExtraBold or Gotham Black style). It is used for names, dates ("JUNE 28, 1836", "SEPTEMBER 11, 1841"), places and key terms ("12TH AMENDMENT", "CORRUPT BARGAIN").
  - Placement is usually lower-center or top-center, about 8–10% of frame height.
  - Name cards are center-screen.
- **"LAST" stamps (the signature graphic):**
  - Rectangular rubber-stamp frames, rotated ±5–15°, with distressed or grunge ink texture.
  - Two colourways: **red ink on light backgrounds** and **white or grey on dark**. Text is 3–4 lines of condensed all caps.
  - They pop or slam in (scale overshoot) at the punchline and sit in an empty corner.
- **Parody UI:** a retro **RPG battle menu** (Jackson vs DEBT: "FIGHT / BAG / SWITCH / RUN", HP bars, a "Blocked" textbox in a pixel font) with a 3D-styled yellow "DEBT" word-art title.
- **Speech bubbles:** white with a black outline, used for gags. One shows a Dutch-language line at 4:35, likely a translation or localisation gag.

## 6. Colour and lighting

- Characters use flat colour with one shadow tone. Backgrounds are softly painted.
- Night and battle scenes use a desaturated blue-green grade. Interiors are warm amber. Exteriors are bright high-key greens and blues.
- Mood is shown with full-frame tints: darkening for the name cards, red flashes for violence or anger, and a vignette on archival plates.

## 7. Sound design (from audio measurements)

- **Mix:** essentially **mono**. The side-to-mid energy ratio is 0.018, so everything sits in the centre.
  - Integrated loudness is **−16.4 LUFS** (YouTube-normalised).
  - Median short-term level is about −21.5 dB. The 90th percentile is −15.8 dB, a tight dynamic range: compressed voiceover-first mixing.
- **Voiceover:** a single male narrator dominates throughout, with harmonic speech formants at 150–3 kHz across the whole spectrogram. Delivery is rapid and continuous. Brief gaps (100–300 ms near-silence) at **11.5 s, 23.5 s, 42 s, 53.8 s** etc. mark comedic beat pauses and segment boundaries, where the music also briefly drops.
- **Music bed:** a low-level background score runs under the narration, ducked well below the voice. The intro (0–11 s) is noticeably fuller and bass-heavy: the title music sting plus battle sounds.
- **SFX:** about **477 transient spikes** (sudden jumps of more than 12 dB) across the video, roughly one every 2.9 s, which is about one per shot. Their timing lines up with cuts and gags, so the likely uses are:
  - Low-frequency **booms or impacts**: cannon fire at about 7 s, and the stamp slams.
  - **Whooshes** on pans and transitions.
  - Pops for text and stamp reveals.
  - Cartoon stingers for falls and hits, crowd murmurs, and occasional retro game bleeps in the RPG parody.
- **Pattern:** the narration carries the information, music gives continuity, and short punchy SFX accent every gag and graphic, typically in sync with the stamp or cut frame.

## 8. Recreating this style (production recipe)

1. **Characters:** build one reusable rig (bean body, stick limbs, swappable eyes, brows, mouths and hair) and make variants by swapping hair, facial hair and costume.
2. **Animation:** use tweened puppet animation on 1s at 30 fps. Hold poses with a subtle idle, swap expressions instantly, and handle big beats with cuts instead of in-betweens.
3. **Camera:** give every shot a slow 2–5% push or pan, and cut every 3–5 s.
4. **Backgrounds:** use painted, softer, more detailed environments behind flat, bold-outlined characters. Keep a small library of reused sets: lawn, office, chamber, map plate.
5. **Graphics:** white bold all-caps sans with a shadow for facts, darkened name cards for about 0.8 s, and grunge rubber-stamp punchline cards that pop in with a thud.
6. **Mixed media:** add sepia-graded archival photos with grain and a vignette.
7. **Audio:** use one energetic VO with tight compression at about −16 LUFS, a ducked mono music bed, and one SFX hit per gag: boom, whoosh, pop, or stamp-thud.

## 9. Character animation, measured frame by frame (second pass)

From 30 fps frame strips of talking, gesturing, fall and stamp moments:

- **Talking:**
  - Mouth swaps are held 3–5 frames (example run at 30 fps: open ×3, closed ×4, open ×5, closed ×4…).
  - The mouth is closed in pauses, and the brows stay locked to the expression.
  - Per-frame change is 4–12 while talking, never 0.
- **Gestures:**
  - Talking characters hold arms up and out.
  - Arms jitter slightly every frame (per-frame change 2–8 on an arm crop), and the head gives tiny nods on accents.
- **Two-shots:** only the speaker animates their mouth. The listener holds, with eye or brow changes at most.
- **Falls and gags:**
  - Tip-over in about 3 frames, then held upside-down or on the ground with legs and arms wiggling for the rest of the shot.
  - The stamp lands during the hold.
- **Stamps:**
  - Frame 0 fills the screen (text larger than the frame).
  - By frame 3 it has settled to its spot, with the scene darkened behind it.
- **Close-ups:** many talking beats are head-and-shoulders crops; wide shots are for setups, crowds and the eagle-mascot reactions.
