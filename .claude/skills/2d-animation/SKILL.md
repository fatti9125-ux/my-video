---
name: 2d-animation
description: 2D cartoon history-explainer animation for this Remotion repo, in the house style measured frame by frame from the user's 18 reference clips ("Every Presidential Last" style), with Quill the owl playing the reference's "Flappy" mascot role. Use when the user asks to make or fix animated scenes or episodes, characters, expressions, talking/walking/war/slapstick animation, archive photo shots, maps, charts, timelines, captions, name cards, LAST stamps, FX or SFX; when they send character sheets or layered character packs to cut or rig; when they want historical figures as caricatures; or when they ask to analyze a reference animation. Triggers: "2d animation", "make chapter/scene/episode", "character sheet", "rig", "flappy", "Quill", "stamp", "map", "archive", "analyze this animation", Drive/video links to study.
---

# 2D Animation: house style + production pipeline

This repo is a **Remotion** project (`src/Root.tsx`, 1920×1080 @ 30 fps).
- **Preview:** `npx remotion studio src/index.ts --port 3000`.
- **Render:** `npx remotion render src/index.ts <Id> out/<name>.mp4`.
- **Fonts:** come from `src/fonts.ts` (Montserrat 800, Oswald 700, bundled in `public/fonts`). Google Fonts is blocked in the cloud sandbox.

**Before building anything, read the references:**
| File | What it holds |
|---|---|
| `references/style-bible.md` | **The house style.** Measured frame by frame from the 18 reference clips: acting, expressions, talk/walk/war/slapstick timing, entrances, camera, Flappy→Quill, text, the LAST stamp, maps/charts/timelines, transitions, FX library, archive treatment, backgrounds, sound. Every recipe has frame counts. Look up the section for the beat you're building and match it exactly |
| `references/clip-notes.md` | The raw per-clip observations (timestamps, frame numbers) behind the bible. Open it to see how a specific effect was used in context |
| `references/character-style-guide.md` | The user's own character sheets: likeness caricatures, proportions, Quill's design |

## The style in one screen (details and frame counts in style-bible.md)

- **Motion:** everything moves on 1s (fire on 2s). Every shot slowly pushes or pans. Expressions, mouths and poses are **1-frame swaps**; violent actions are **FX smears plus a swap to the result**, never animated in-betweens. Comedy is **deadpan**.
- **Talking:** only the speaker's mouth moves, in **3–5-frame open/closed holds** with 2 closed variants. The mouth is closed in pauses and the brows are locked. Listeners hold and react **about 4 frames after** each beat.
- **Expressions:**
  - Sweat drops (worry), tears, red anger vein, red "?" marks, pink blush.
  - "X X" eyes plus a spirit whoosh (death); a grey-purple tint on one character (sulking).
  - Shocked: huge round eyes with tiny pupils.
- **Walking:** 16-frame stride with a 2–3% body bob and no lip movement. Tracking walks scroll the background; crowds walk in 2–3 depth rows.
- **War:**
  - Armies are grids of duplicated sprites.
  - Red jagged muzzle blasts (2–3 f) and impacts (2–4 f); a red spiky splat (4–5 f) when someone is shot.
  - Ducking uses white speed lines (3 f). Pull-back reveals take 9 f.
- **Slapstick:** a red crescent smear (6 f) for a kick or punch, then a 1-frame swap to fallen with **legs flailing every frame**. The get-up is a 1-frame swap.
- **Camera:** emphasis push-ins of 4–12 f land on the gag; reveal pans of about 36 f; a 5 f re-frame to a close-up before a stamp.
- **Quill = Flappy:** in story scenes **Quill's beak stays closed**. He is the small (70–80% height) reactor, peeker, presenter (glasses plus pointer), companion and skeptic, often cropped in the bottom-left foreground. His signatures are the sweat drop and the side-eye. He lip-syncs **only** when narrating to camera in his studio.
- **Text:**
  - **Captions:** white Montserrat ExtraBold caps with a thin black outline and a shadow, **hard on/off**, swapped in place. Dates and places bottom-centre, years top-centre.
  - **Name cards:** the shot darkened about 70%, 1–2 s, then a hard cut back.
  - **Bubbles:** pop in 4 f with **typewriter text at about 15 characters/second**; shout bubbles are spiky.
- **LAST stamp:**
  - **Entry:** frame 0 at about 3× size, settling to a corner in **5–6 frames, ease-out**, rotated −3 to −15°.
  - **Background:** darkens about 40% over 6–8 f *after* landing; the character reacts about 4 f later.
  - **Variants:** red ink with no box on light scenes; white ink with a translucent dark box on dark scenes.
  - **Sound and exit:** a sub-bass thump on landing; it holds or fades out over 4–6 f.
- **Graphics:**
  - **Maps:** mottled blue water, beige land with white coastline rings, red target fill or a colour cross-fade fill, pins and waving flag icons, sprite armies marching, an 18 f zoom into a region.
  - **Charts:** red-up and blue-down zig-zag arrows drawing on in 10–12 f.
  - **Money:** stacks dropping in 8 f.
  - **Timelines:** head icons on a dark-teal plate, popping in over 7 f with overshoot.
  - **Placement:** over the **dimmed location backdrop**.
- **Archive:** portraits in a small centred box on black; engravings full-frame with a thick black vignette. Sepia or black-and-white, grain, scratches and flicker, always a slow push. Occasionally **cartoon eyes and mouth are composited on the photo** to make it talk. Cut hard from archive to cartoon.
- **Backgrounds:** painted, softer and more detailed than the characters, with **heavy motivated lighting** (candle glow, moonlight, light beams, spotlights). Vehicles are more detailed than the characters.
- **Sound:** −16 to −17.5 LUFS, near mono, one narrator. The music bed sits about 18 dB under the VO and never goes silent, except a drop-out just before a reveal. Each SFX lands on the visual's frame:
  - **Sub-bass thump:** stamp, kick or punch.
  - **Gunshot:** boom plus crack.
  - **Engulfed in fire:** a fire whoomp.
  - **Vehicle crash-in:** rumble plus whoosh.
  - **Deadpan gags:** no SFX at all.

## Attachment rule: nothing floats (every character, body part and prop)

Every body part must stay visibly connected to its parent in **every frame**: at rest, at the extremes of every motion, and in every in-between.
- **Arms:** start at a shoulder joint placed **inside** the torso silhouette (at least 4 units in from the edge) and are drawn **behind** the torso. An arm crossing in front of the body uses `front: true` and still starts from that joint.
- **Hands:** **glued to the arm's end, especially while talking or gesturing.**
  - Each hand declares its wrist anchor (the pixel on the ink where the fingers converge), its finger direction and its exact PNG size: `{ file, size, anchor, dir }`.
  - The puppet pins the anchor to the forearm's end and continues the forearm's curve tangent. Never place a hand by bounding box or a guessed offset.
  - Never show a hand whose arm is hidden.
- **Legs:** start at hip joints inside the torso, above the hem, and end exactly on the ground line. Feet attach to the ankle end.
- **Head:** overlaps the collar (the chin below the torso top), with no gap and no neck unless the sheet draws one. Tilt rotates around the chin pivot.
- **Props:** parented to the hand that holds them; never placed independently. Wings, tails, hats and glasses are anchored to their parent.
- **Joints:** rotate; parts never translate apart. Squash and bob apply to the whole parent group.

**Enforce it:**
1. Run `python3 -I .claude/skills/2d-animation/scripts/check_rig.py <RIG>` (sheet rigs) or `check_layer_rig.py` (layered packs, Mode D) after any rig or pose change, and fix every FAIL.
2. Check the extreme angles of any custom motion.
3. Render full-resolution stills and zoom into the shoulders, hips, wrists and neck before the full render.

## Live preview before rendering (always)

1. Run `npx remotion studio src/index.ts --port 3000` in the background and call `report_preview_port` with port 3000 (name "studio").
2. Also render a **half-resolution preview** (`--scale=0.5 --crf=28`) and send it with `SendUserFile`, because the Studio may not open in the app.
3. Render 1080p **only after the user approves** the preview. Normalise the audio to −16 LUFS (`ffmpeg -c:v copy -af loudnorm=I=-16:TP=-1.5:LRA=9`).

## Mode D: episode from script + voiceover + layered character packs (the production pipeline)

Used for "Every President's Thanksgiving" (`src/Thanksgiving/`, composition `ThanksgivingCh1to3`). Repeat it for later chapters.

1. **Inputs.**
   - Read the script (`.docx`: unzip, read the text of `word/document.xml`).
   - Note the VO files and their durations.
   - Unzip the character pack into the scratchpad. Each character has `Cutouts/` (finished poses, heads, torso) and `Puppet_Layers/` (`Rig_*.png` plus `Positions_720px.csv`); props are in `Shared_Props/`.
   - Copy only the PNGs and the CSV into `public/<project>/<character>/`. Never commit PSDs or 8K sheets.
2. **VO → timings** (no ASR here).
   - Write one script line per sentence for each audio file, then run `python3 -I .claude/skills/2d-animation/scripts/align_script.py <audio> <lines.txt> <out.json>`.
   - It outputs sentence times (±0.5 s; tell the user) and `<out>.env.json`, a 100 Hz loudness envelope for mouth timing.
   - Trim chapter starts with ffmpeg `-ss` at the heading's pause.
3. **Rig metadata.**
   - Run `python3 -I .claude/skills/2d-animation/scripts/layer_rig_meta.py public/<project> src/<Project>/rigmeta.json`.
   - The CSV positions are only proposals. `LayerPuppet` re-lays the parts so the chin overlaps the collar, shoulders sit 12 px inside the torso edge and hips sit under the hem, with each limb a nested joint chain.
4. **Attachment check.**
   - Run `python3 -I .claude/skills/2d-animation/scripts/check_layer_rig.py public/<project> src/<Project>/rigmeta.json src/<Project>/LayerPuppet.tsx`. Every character must be OK for every `ARMS` preset.
   - Held props come from the finished pose cutouts.
5. **Shot list.**
   - One entry per script sentence in `SHOTS` (`{ a, b, el, sfx }`, global seconds).
   - Build every beat from the matching style-bible recipe: name card on chapter headings, captions, stamps on the "last" punchlines, maps and archives for history beats, Flappy-style Quill beats, and an FX plus SFX on every action.
   - **Characters:**
     - The shot's subject is a `LayerPuppet` with `speak`.
     - Finished pose cutouts are only for 1–3 s action beats.
     - `QuillPuppet` has its beak closed in story scenes and lip-syncs only on narration-to-camera shots.
6. **Backgrounds** (`src/Thanksgiving/Backgrounds.tsx`): painted SVG sets.
   - **Interiors:** Studio, Chamber, Study (`sepia`), EditorOffice, LincolnOffice, Prison.
   - **Exteriors:** FederalHall, Chapel, Hills, Village.
   - **Plate:** PlateBg.
   - **Extending them:** add sets in the bible's lighting-heavy painted style.
7. **Review.**
   - Render a quarter-scale draft and pull one mid-frame per shot into contact sheets.
   - Fix overlaps and overflowing text.
   - Zoom into the joints at full resolution.
   - Do the **live preview** (above) before the 1080p render.

## Mode C: characters (sheets, rigs, likeness)

**C1. The user provides a character sheet** (preferred; sheets are canon and are never redrawn):
1. Save it to `public/characters/sheets/<name>.<ext>`.
2. Run `python3 -I .claude/skills/2d-animation/scripts/extract_parts.py detect <sheet> public/characters/<name> --min 400`, then read `_boxes.png`.
3. Write `parts.json` with standard names: `pose_*`, `head_neutral|head_speaking|head_reaction`, `torso_*`, `hand_relaxed|open|point|grip`, `prop_*`. Then run `extract_parts.py cut <sheet> public/characters/<name> parts.json`.
4. Review the parts as a montage on a coloured background.
5. Add a `RigDef` in `src/rig/characters.ts`:
   - Measure on a gridded `pose_front`, and measure the hand wrist anchors on a 5× gridded zoom.
   - Run `check_rig.py` until it reports OK.
   - Render `HandTest` and `RigTest` and compare with the sheet.
6. Animate with `<SheetPuppet>` (`src/rig/SheetPuppet.tsx`). Gerald Ford is rigged (`GERALD_FORD`). Nixon, Kissinger, the courtroom set and the original Quill sheet have `_boxes.png` ready.

**C2. No sheet: build the likeness from reference.**
- **References:** find public-domain portraits (official portraits, Wikimedia Commons). If the image host is blocked, propose the host via the environment tools or ask the user for photos.
- **Exaggerate:** pick 4–6 likeness keys and exaggerate them 20–40% on the house head template.
- **Draw and approve:** draw as layered SVG, render a turnaround still and get approval.
- **Be honest:** these are approximate. For exact matches ask for a sheet. Caricature public figures respectfully only.

## Mode A: analyze a new reference video

1. **Get the files.**
   - **Uploads:** copy them into a fresh scratchpad folder.
   - **Drive links:** `curl -sSL -o <dir>/video.mp4 "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t"` (Drive hosts are allowed in the "2d animation" environment).
2. **Overview:** `bash .claude/skills/2d-animation/scripts/analyze_video.sh <video> <outdir> [step_s]` gives cuts, timestamped contact sheets, motion stats, loudness and a spectrogram. Use 4 fps sheets (`step_s` 0.25) for short clips. Read **every** sheet.
3. **Frame level:**
   - Run `scripts/frame_strip.sh <video> <start> <dur> <out.png> [crop]` on every distinct technique: talk, walk, entrance, gag, FX, stamp, map move, chart, transition.
   - It shows every frame plus per-frame change: 0 means a held frame, a spike means a swap or cut, constant means a pan or scroll, alternating high/low means animation on 2s.
4. **Sound per beat:** compare band energy (30–150 / 150–600 / 600–3000 / 3000+ Hz) 0.5 s before and 0.4 s after each visual beat, plus loudness (`ebur128`), stereo side/mid and the noise floor in pauses.
5. **Write it up:**
   - Add raw notes per clip to `references/clip-notes.md`.
   - Fold new or changed techniques into `references/style-bible.md` with frame counts.
   - Update the summary above if a core rule changes.
   - State the limits (resolution, audio measured not heard).
   - Commit and push.

## Reusable code

| Area | Where |
|---|---|
| Layered puppets | `src/Thanksgiving/LayerPuppet.tsx`: `LayerPuppet` (`speak`, `fall`, `walk`, `ARMS` presets, expression heads), `QuillPuppet`, `mouthAt`, `TalkContext` |
| Sheet puppets | `src/rig/SheetPuppet.tsx`, `src/rig/characters.ts` |
| Hand-built SVG puppets | `src/EmuWar/Characters.tsx` (`Person`, `Emu`) |
| Camera, cards, stamp, bubbles | `src/EmuWar/Scenery.tsx`: `Camera` (push/pan/shake), `NameCard`, `Caption`, `StampCard`, `SpeechBubble`, `MuzzleFlash`, `DustPuffs` |
| Graphics | `src/Thanksgiving/Graphics.tsx`: proclamation, calendar, book, pie, church/state, state grid, scoreboard, letter stack, war split, bubbles |
| Backgrounds | `src/Thanksgiving/Backgrounds.tsx` |
| SFX | `python3 -I .claude/skills/2d-animation/scripts/make_sfx.py <dir> <seconds>`: whoosh, thud, pop, gunburst, squawk, boing, sad_trombone, paper, scribble, ding, music_bed |

**Bringing existing code up to the bible** (do it when the feature is next used, and check against style-bible.md §11):
- `StampCard`: 3 f → **5–6 f** ease-out, ink variants, darken *after* landing, optional fade-out.
- `Caption`: spring pop → **hard on/off** with a thin black outline.
- `NameCard`: 58% → **about 70%** darkening.
- `LayerPuppet` talking: arms out and open with small adjustments (current wobble OK), listeners frozen except on beats; `fall` → 1-frame swap to fallen plus flailing.
- `QuillPuppet`: add closed-beak story mode, glasses, pointer, sunglasses, sweat drop and side-eye swaps.
- **New FX components:** smear, splat, speed lines, sparks, flames on 2s, smoke, puffs, "?", anger vein, X-eyes.
- **New graphics:** map, region zoom, chart arrow, money stack, timeline.
- **SFX kit:** sub-thump, boom plus crack, fire whoomp, crash-in, typewriter.
