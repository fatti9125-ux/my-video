---
name: 2d-animation
description: 2D cartoon explainer animation for this Remotion repo. Use when the user asks to analyze an animation/video's style (frame by frame, characters, backgrounds, graphics, sound effects), sends character/model sheets to analyze, cut or rig, asks for historical figures as caricature characters, or wants to design, script, storyboard or build 2D animated explainer scenes, characters, backgrounds, title cards, stamps or sound plans in that style. Triggers: "2d animation", "character sheet", "model sheet", "rig this character", presidents/politicians as cartoons, "analyze this animation", "animation style", "make a scene/character/episode in this style", Google Drive or video links to study.
---

# 2D Animation (explainer-cartoon style)

This repo is a **Remotion** project (`src/Root.tsx`, 1920x1080 @ 30 fps; `npm run dev`, `npx remotion render src/index.ts <Id> out/<name>.mp4`). Installed helpers: `@remotion/shapes`, `@remotion/paths`, `@remotion/transitions`, `@remotion/noise`, `@remotion/motion-blur`, `@remotion/lottie`, `@remotion/google-fonts`.

The house style is documented in `references/explainer-style-guide.md` (derived from a frame-by-frame study of a 23-min comedy history explainer). **Read it before designing or building anything.** Characters follow `references/character-style-guide.md` (house character style from the user's model sheets: likeness caricatures, head ≈47% of height, ink strokes, Quill the owl narrator). **Read it before making or rigging any character.**

## Attachment rule — nothing floats (applies to EVERY character, body part and prop)

Every body part must stay visibly connected to its parent in **every frame** of the animation — at rest, at the extremes of every motion, and in every in-between:
- **Arms** start at a shoulder joint placed **inside** the torso silhouette (≥4 units in from the edge) and are drawn **behind** the torso, so they always emerge from the body. An arm that crosses in front of the body (holding a prop, hand on chest) uses `front: true` and still starts from that inside joint.
- **Hands are glued to the arm's end in every frame, especially while talking or gesturing**, when arms move the most.
  - Every hand part declares its **wrist anchor**: the pixel on the ink where the fingers converge. It also declares its finger direction and its exact PNG size: `{ file, size, anchor, dir }` in the `RigDef`.
  - The puppet pins that anchor pixel to the forearm's end point and rotates the hand to continue the forearm's **curve tangent**. The hand moves *with* the arm and can never drift, gap or point the wrong way.
  - Never place a hand by bounding box, padding or a guessed offset; that is what makes hands float.
  - Never show a hand whose arm is hidden. If the arm runs behind the torso, swing it out so the arm visibly leads to the hand, or tuck the hand away too.
- **Legs** start at hip joints **inside** the torso, above the hem (hidden under the jacket), and end exactly on the ground line (hipY + thigh + shin = 0). Feet attach to the ankle end of the shin.
- **Head** overlaps the torso/collar (chin below the torso top). There must be no gap and no visible neck unless the sheet draws one. Head tilt rotates around the chin/neck pivot so the head never slides off the body.
- **Props** are parented to the hand that holds them (`grip` hand, position from `armEnd()`), never placed independently in screen space.
- **Wings, tails, ears, hats and glasses** (e.g. Quill) are anchored by their root to the body or head and move with that parent.
- Joints rotate and parts never translate apart. Squash, stretch or bobbing apply to the whole parent group, so children follow.

**Enforce it:**
1. Run `python3 -I .claude/skills/2d-animation/scripts/check_rig.py <RIG_NAME>` after creating or editing any `RigDef` or `ARM_POSES`, and fix every FAIL using the suggested values. It checks the joints against the real part PNG alpha, the chin overlap, the ground contact, the hand wrist anchors (on the ink, size matches the file), and that each arm pose reads as one connected piece.
2. When an animation drives angles beyond the presets (waves, swings, walk cycles), check the extreme angles too.
3. Render stills at full resolution and zoom in on the shoulders, hips, wrists and neck before rendering the full video.
4. The same rule applies to hand-built SVG characters (`Person`, `Emu` in `src/EmuWar/Characters.tsx`): limb strokes start inside the body shape.

## Mode C — Characters (sheets, rigs, likeness)

**C1. The user provides a character sheet (preferred — sheets are canon, never redraw them):**
1. Save it to `public/characters/sheets/<name>.<ext>`.
2. `python3 -I .claude/skills/2d-animation/scripts/extract_parts.py detect <sheet> public/characters/<name> --min 400` → Read `_boxes.png` (numbered blobs).
3. Write `public/characters/<name>/parts.json` mapping names → blob numbers (or `[x,y,w,h]`), using the standard names: `pose_front|pose_three_quarter|pose_profile|pose_<story>`, `head_neutral|head_speaking|head_reaction`, `torso_front|torso_three_quarter`, `hand_relaxed|hand_open|hand_point|hand_grip`, `prop_<thing>`; then `extract_parts.py cut <sheet> public/characters/<name> parts.json`. Labels under drawings are stripped automatically; transparent sheets keep their alpha, white-paper sheets get the paper keyed out.
4. Review all parts on a coloured background (montage) before use.
5. Add a `RigDef` in `src/rig/characters.ts` (measure on a gridded `pose_front`: `torsoTop`, `chinY`, shoulders, hips, limb lengths, `partScale` ≈ pose-head-width / head-png-width), measure each hand's wrist anchor and finger direction on a 5x gridded zoom of the hand PNGs, run `check_rig.py` until it reports OK (attachment rule above), render the `HandTest` composition (every hand, both sides, an angle sweep) and zoom in on the wrists, then check side-by-side in the `RigTest` composition (sheet pose vs puppet) and iterate until they match.
6. Animate with `<SheetPuppet>` (`src/rig/SheetPuppet.tsx`): head swaps for expressions/lip-flap (neutral↔speaking every 4–6 f), `ARM_POSES` presets (down, hips, wave, point, shrug, hold), `walk` phase, `headTilt`/`bob` idle, `props` slot. For big story beats, hard-cut to the sheet's full `pose_<story>` PNG instead of puppeting.
   Gerald Ford is fully cut and rigged (`GERALD_FORD`); Nixon, Kissinger, the courtroom ensemble and Quill have `_boxes.png` ready — cut them when first needed.

**C2. No sheet — build the likeness from reference:**
1. Find public-domain reference portraits (official portraits / Wikimedia Commons) with WebSearch; if the image host is blocked, propose `upload.wikimedia.org` / `commons.wikimedia.org` via the environment tools or ask the user to upload photos.
2. List 4–6 likeness keys (hairline/hair mass, nose shape, brows, jaw/jowls, glasses, ears) and exaggerate them 20–40% on the house head template (see the guide's table for format).
3. Draw as layered SVG matching the sheet conventions (head, torso, stroke limbs, 3 expressions), render a turnaround still, show the user, iterate.
4. Be honest: hand-built SVG caricatures are approximate; for exact matches ask the user for a sheet (C1). Caricature real public figures respectfully (educational/comedy), never private individuals.

## Mode D — Episode from script + voiceover + layered character packs (the production pipeline)

Used for "Every President's Thanksgiving" (`src/Thanksgiving/`, composition `ThanksgivingCh1to3`). Repeat it for later chapters.

1. **Inputs.**
   - Read the script (`.docx`: unzip, read `word/document.xml` text).
   - Note the VO files and their durations.
   - Unzip the character pack into the scratchpad. Each character folder has `Cutouts/` (finished poses, heads, torso) and `Puppet_Layers/` (`Rig_*.png` parts + `Positions_720px.csv`). Shared props are in `Shared_Props/`.
   - Copy only the PNGs/CSV into `public/<project>/<character>/` and the props into `public/<project>/props/`. Never commit PSDs or 8K sheets: they are references, palette-mode upscales with no extra detail.
2. **VO → timings (no ASR is available here).**
   - Write one script line per sentence/beat for each audio file, then run `python3 -I .claude/skills/2d-animation/scripts/align_script.py <audio> <lines.txt> <out.json>`.
   - It maps the script's syllables onto detected syllable peaks and snaps line ends to breaths. It also writes `<out>.env.json`, a 100 Hz loudness envelope for beak/mouth flaps.
   - Check chapter starts by reading the loudness envelope around the predicted heading (look for the pause pattern), and trim with ffmpeg `-ss`.
   - Accuracy is ±0.5 s, fine for shot cuts. Say so to the user.
3. **Rig metadata.**
   - `python3 -I .claude/skills/2d-animation/scripts/layer_rig_meta.py public/<project> src/<Project>/rigmeta.json` measures every part: limb joint ends, the head's chin, and the torso outline.
   - The CSV positions are only *proposals*. Assembled raw, the head floats above the collar and the arms sit outside the coat, which breaks the attachment rule. `LayerPuppet` re-lays the parts:
     - the chin overlaps the collar;
     - shoulders sit 12 px inside the torso edge, hips under the hem;
     - each limb is a **nested joint chain** (shoulder > upper arm > elbow > forearm > wrist > hand; hip > thigh > knee > shin > ankle > foot), so parts cannot detach.
4. **Attachment check.**
   - Run `python3 -I .claude/skills/2d-animation/scripts/check_layer_rig.py public/<project> src/<Project>/rigmeta.json src/<Project>/LayerPuppet.tsx`. Every character must report OK for every `ARMS` preset.
   - Wide coats need about 36° of shoulder swing for a hanging arm to emerge from the coat.
   - Props that must be *held* while moving come from the finished pose cutouts (e.g. "Carrying a letter"), never floated next to a puppet.
5. **Shots.** One entry per script sentence in `SHOTS`, `{ a, b, el, sfx }`, in global seconds. House grammar:
   - **Chapter headings:** darkened name card ("NAME" + "N · SUBTITLE") over the first shot, held while the heading is read.
   - **Every shot:** a slow camera push; fact captions in Montserrat caps; grunge rubber-stamp punchlines; blue info plates for abstract beats.
   - **Characters:** finished pose cutouts for story beats, `LayerPuppet` for walking/gesturing/expression swaps, `QuillPuppet` for the host, with the beak flapping on the VO envelope.
   - **Sound:** one SFX per beat (whoosh on cut, pop on caption, thud on stamp, paper/scribble for letters, ding for the scoreboard); music bed at about 0.09 under the VO.
6. **Backgrounds** (`src/Thanksgiving/Backgrounds.tsx`): painted SVG sets.
   - Interiors: Studio (Quill), Chamber, Study (`sepia` for flashbacks), EditorOffice, LincolnOffice, Prison.
   - Exteriors: FederalHall, Chapel, Hills, Village.
   - Plate: PlateBg.
   - Reuse and extend them; keep the soft painted look (gradients, light beams, texture, vignette).
7. **Review.** Render a quarter-scale draft, then pull one mid-frame per shot into contact sheets and fix overlaps and overflowing text. Then render key puppet frames at full resolution and zoom into the joints. Only then render 1080p.

## Mode A — Analyze a reference video

1. **Get the file.** Drive links: `curl -sSL -o <dir>/video.mp4 "https://drive.usercontent.google.com/download?id=<FILE_ID>&export=download&confirm=t"` into a fresh scratchpad folder (hosts `drive.usercontent.google.com`, `drive.google.com` are allowed in the "2d animation" environment). If blocked, check proxy status and propose the host via environment tools.
2. **Run** `bash .claude/skills/2d-animation/scripts/analyze_video.sh <video> <outdir> [step_s]` → cuts, timestamped contact sheets, motion stats, loudness, spectrogram.
3. **Look** at every contact sheet (Read the PNGs). Then pick 4–6 representative moments (title card, dialogue, gag, transition, effect) and run `scripts/frame_strip.sh` on each to see every frame and per-frame change (YDIF 0 = held frame → reveals animating on 1s/2s/3s, holds, pose swaps, camera moves).
4. **Report** under these headings: Format & structure · Character design · Animation & timing (frame-level evidence) · Backgrounds · Typography & graphics · Colour & lighting · Sound design (measured: loudness, mono/stereo, VO/music/SFX density) · Production recipe. Be honest about limits (resolution, audio is measured not heard, sampled not all frames).
5. Save the report as a `.md` in the repo and commit/push to the session branch.

## Mode B — Build animation in the style (Remotion)

Follow the style guide; key rules:

- **Characters**: original designs only (never copy a specific show's characters/mascot). Bean body, big head (~45% height), thick uniform black outline (~6–8 px at 1080p), stick-line limbs with no hands, dot eyes, thick brow strokes carrying emotion, hook nose, line mouth. Identity via hair/facial hair/costume props on a shared face template. Build as SVG React components with props: `expression`, `mouth` (2–4 shapes), `hair`, `outfit`, `colors`.
- **Animation**: rigged/puppet feel on 1s — use `interpolate`/`spring` with easing for transforms; idle sway (`@remotion/noise` or small sine on rotation ±1–2°); **expressions & mouths swap instantly** (switch by frame ranges, no tween); big beats = cut to new pose/shot.
- **Camera**: every shot gets a slow push/pan (scale 1.0→1.03–1.05 over the shot). Shots 3–5 s; gags 1–2 s.
- **Backgrounds**: softer, more detailed painted look than characters (gradients, texture, muted saturation); reusable sets (exterior lawn/sky, office interior, chamber) plus flat infographic plates (solid blue `#1E90FF` with beige map, red highlight).
- **Name/title card**: shot darkened by 55% black overlay, centered white ALL-CAPS bold geometric sans (Montserrat ExtraBold via `@remotion/google-fonts/Montserrat`) with soft shadow, held ~24 frames, hard cut.
- **Fact captions**: same font, white + drop shadow, lower or upper centre.
- **Punchline stamp**: rotated (±5–15°) rectangle-bordered rubber-stamp text, 3–4 lines condensed caps, grunge texture (SVG turbulence filter mask), red-on-light or white-on-dark; enters with scale overshoot (spring, 1.4→1.0 in ~6 frames) synced to a thud SFX.
- **Archival look**: sepia filter + grain + vignette for photo plates.
- **Sound plan**: single VO is king; ducked music bed; one SFX per gag/cut (whoosh on moves, pop on text, thud on stamp, boom on impacts); mix mono-ish, target −16 LUFS. Use `<Audio>`/`<Sequence>` to place SFX on exact frames; list needed SFX if files are missing.

Reusable pieces already in the repo (start from these):
- `src/EmuWar/Characters.tsx` — `Person` (bean puppet: hats, moustache, brows/eyes/mouth swaps, arms, sweat, tears) and `Emu` (walk cycle, peck, smug).
- `src/EmuWar/Scenery.tsx` — `Camera` (push/pan/shake), `Outback` painted BG, `Plate`, `NameCard`, `Caption`, `StampCard`, `SpeechBubble`, `MuzzleFlash`, `DustPuffs`.
- `src/fonts.ts` — Montserrat 800 / Oswald 700 loaded from `public/fonts` (Google Fonts is blocked in the cloud sandbox; don't use `@remotion/google-fonts`).
- SFX: `python3 -I .claude/skills/2d-animation/scripts/make_sfx.py public/sfx <seconds>` → whoosh, thud, pop, gunburst, squawk, boing, sad_trombone, music_bed. No TTS is installed, so without user-supplied VO, carry information with captions.

Workflow: script → shot list (timecodes, shot type, characters, BG, text, SFX) → build components under `src/<ProjectName>/` → register a `<Composition>` in `src/Root.tsx` → render a short check (`--frames=0-90`) and inspect stills before full render → commit and push.
