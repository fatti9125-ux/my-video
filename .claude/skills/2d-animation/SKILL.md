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

## User production rules (from review feedback — always apply)

1. **Voiceover sync:** time every beat to WORD starts, never to estimated sentence midpoints.
   - Run `python3 -I .claude/skills/2d-animation/scripts/align_words.py <vo> <lines.txt> <out.json>`.
   - It pins sentences to real pauses, measured against the local noise floor (VO files can carry a quiet bed). The fit is tempo-free (script syllables vs detected syllable peaks), and internal "." pauses count. Words are mapped by syllable clock.
   - Check two or three landmarks by hand: chapter headings, and the longest pauses.
   - Numbers must be read with punctuation stripped ("1789." is 6 syllables).
2. **Characters face each other** in every dialogue or two-shot. Know each pose's facing and `flip` the listener toward the speaker.
3. **Expressions and poses change with the script:** swap the pose on the motivating word (`Swap t={word}`). The listener reacts about 4 frames later. Never hold one pose through a story turn.
4. **Stick-figure limbs for every character** (the user's sheets).
   - Rig each pose with `python3 -I .claude/skills/2d-animation/scripts/autorig_sticks.py public tg2/Poses <rig.json> [chars]`.
   - It splits the drawing into body + free arm/leg layers with joint pivots. Limbs touching the body twice (prop in hand, hand on hip) stay fixed.
   - `Rig` (src/Thanksgiving3/Kit.tsx) rotates limbs only about their joints, so **nothing detaches**.
5. **Walk = reference walk:**
   - Legs swing ±17° about the hip on a 32-frame cycle (16-frame step).
   - The body dips L·(1−cos θ) so the planted foot stays on the ground, and travel speed equals stride per 16 frames (no foot sliding).
   - Arms swing opposite, with a 2° lean.
   - Walk only where the script moves someone (arrivals, exits, travel); otherwise stand.
6. **Arms move a little where needed:** a small lift on stressed words (`gesture` 8–12°) while a character is the subject. Otherwise keep only the breathing idle.
7. **Sound:**
   - SFX are quiet: 0.10–0.25 linear, with the stamp thump at 0.3 at most.
   - **No synthesized music bed:** it sounded like a game. Add music only if the user supplies a track.

8. **Characters always use their own pose sprites** at normal (small) scale. Never use the `Reusable_Bodies` costume templates or oversized head-swap bodies. If a needed character or pose is missing, use the nearest existing pose or an archive photo.
9. **Text never covers a face.** Speech bubbles sit above the speaker's head (bubble bottom at least 80 px above the hair), with the tail pointing to the mouth. Captions stay in the bottom or top bands.
10. **No blank shots.** Every graphic or plate shot shows its main element by frame 2. Only extra items may pop in on later words.
11. **Archive, not drawn scrolls.** Letters, proclamations, amendments, newspapers and portraits use real public-domain scans via the `Arch` component (Kit.tsx: sepia/grain/scratches/flicker/vignette, slow push).
   - Find them with `python3 -I .claude/skills/2d-animation/scripts/arch_search.py "query"`.
   - Download with `python3 -I .claude/skills/2d-animation/scripts/fetch_archive.py public/tg2/archive name="File:Title.jpg" ...`.
   - The downloader takes originals and resizes them locally, because thumbnails redirect to the blocked `thumb.wikimedia.org`. It throttles to avoid HTTP 429; it is slow (about 30 s per file).
   - Sources and licences are written to `public/tg2/archive/CREDITS.txt`.
   - Drawn scrolls only when no scan exists.
12. **One composition per VO file.** Use `Episode` (src/Thanksgiving3/Episode.tsx): `ep/<k>.json` holds the env, stresses, lines and words. Write shots with `ln(i)` and `wd(i, "word")`, so every cut lands on a word. A shot ends where the next begins.
13. **SFX and GFX are built in. Do not add them twice.** `Cap` pops at 0.06, `Card` whooshes at 0.12, and `Stamp` thumps (`sub_thump` at at+5, 0.3). `Spr`/`Rig` with `enter` draw speed-line wedges. Add per-shot `sfx` only for story beats (cheer, ding, boing, whoosh on flights). Use quiet levels of ≤0.15.
14. **No repeated look.** Rotate Quill's studio with `<B.Studio v={k%4} />`, which changes the wall, curtain, prop and portrait. Never put a character in a shot without a script reason (no random turkeys). Use every expression the sheet/zip provides at least once, on the line its scene guide names.
15. **Ending:** at "Happy Thanksgiving", show Quill's happy pose (`closing_hoo`) on `HappyThanksgiving` (Bg2: sunset, bunting, pumpkins, falling leaves) with a cheer. Keep that background for the sign-off only.
16. **Final delivery:** `ThanksgivingFinal` (src/Thanksgiving3/Final.tsx) chains every part with `Series`. For 4K, render each part with `--scale=2 --crf=18`, `ffmpeg concat -c copy`, then loudnorm I=-16 (see out/final/render.sh pattern). Run it detached (`nohup setsid`), because 4K takes hours.
17. **Verify every VO before building on it. Never trust syllable estimates.** First transcribe the start of each file (`pocketsphinx`; `pip install pocketsphinx` bundles an English model) and confirm which chapters it really holds. A file named for one chapter can start at another: "ch7_9" was actually ch8–10, and that shifted whole chapters. Time lines with `scripts/force_align.py ep.json vo.mp3 out.json`, which does real forced alignment. Where the read differs from the script, use `RANGE=` sub-ranges plus `scripts/asr_anchor.py` anchors, combined by `scripts/build_ep.py`. Narrators skip chapter numbers and "Ending."; the aligner drops them (`SKIP_LINES` for other unspoken lines). Old hand-timed comps get a `warp.json` time map instead of a rewrite.
18. **Review script vs picture before rendering.** Render one still per shot at its middle and contact-sheet each still with the line being spoken at that moment. Fix any shot whose picture doesn't fit its line. A turkey (or any recurring prop) appears only when the line is about it: audit with a regex over the shot code against the line text.
19. **No cut-off art.** Some pack sprites are cropped flat at an edge (the treehouse tree was cut straight across the top). Audit with a longest-opaque-run check on each sprite's bbox edges (>70 px = cut). Complete the art in the sprite's own style (ink-outlined canopy, same sampled colours), save over the PNG, and update `sprites.json` bbox (and the shot's `h` so the scale stays right). Never let a sprite's cut edge show inside the frame.
20. **Captions go where the space is.** If the subject fills the lower half (bathtub, crate, desk), use `pos="top"`. A caption may never sit on the character or prop.
21. **Animals walk too.** A "walks" pose must move its legs, never slide. Split quadruped walk sprites into body + 4 leg layers (pivot at the belly, see `rig.json` `rebecca/walks_on_leash`), alternate sides L/R/L/R for a trot, and animate with `Rig walk={1}` (travel = stride, so feet don't slide). Face the direction of travel.
22. **SFX are automatic on visual events.** `Kit.tsx` `AutoSfx` plays: `whoosh` on `enter` (Spr/Rig), `thud` on `drop` landing, `pop` on `Tag`/`PopIn`, `paper` on `Note`, `boing` on `QMarks`, unless the shot already lists an sfx within ±5 frames (no doubles; the shot's `sfx` is passed via `ShotCtx`). Only add per-shot `sfx` for story beats with no visual component.
23. **Upload-safe delivery encode.** The 4K master is `yuvj420p` (full range) and plain x264 at 4K picks level 6.0; many players can't decode that and show leftover blocks from the previous scene (a green lawn patch over the next shot). Final encode: `-vf scale=in_range=pc:out_range=tv,format=yuv420p -profile:v high -level:v 5.1 -x264-params keyint=60:min-keyint=1:scenecut=40:ref=4` plus bt709 tags, 2-pass, ~3100k for a 16.5-min film under 400 MiB. Check with ffprobe (`level=51`, `pix_fmt=yuv420p`). When only a few shots change, delete just their 600-frame chunks (plus `audio.wav` if sound changed) and rerun `run.sh`.
24. **Coverage check first, and say it up front.** Before building anything, list every chapter heading in the script and map each one to the VO file (and timestamp) that holds it, using ASR on each file's opening and at each heading. Tell the user in your first reply, plainly and at the top, which chapters have **no** voiceover yet ("Chapter 7, Harding, is missing: please send it"), and do it again before every final render. Never deliver a "complete" video with a chapter silently missing. To add a late chapter: align it into its own `ep/<k>.json` (`force_align.py`; build `env` and `stress` like `ep/h.json`), write a `Ch<n>.tsx` Episode, insert it in `Final.tsx`, then splice instead of re-rendering everything: re-render only from the 600-frame chunk where it is inserted through the end of the new chapter, reuse the old chunks after it, and re-render the audio.

25. **Flat single-sheet packs (VP project, `src/VP/`).** Sheets are one PNG per character on a smudgy low-alpha backdrop, layout: 0 front, 1 three-quarter (faces right), 2 side, 3 blank head, 4 torso, 5..11 script poses, six expression heads (neutral/talk/angry/shocked/sad/happy), mouth bits, limbs, props.
   - `sheet_detect.py <sheet> <scratch>/vpcut/<NN_Name>` numbers every part (`_boxes.png`); read the boxes before naming parts.
   - `sheet_export.py <scratch> public/tg2/vp` cuts all parts (alpha ≥45 kept only inside each part, 3× Lanczos + crisp edge) to `vp/<character>/<n>.png` and writes `vp_sprites.json`. Heads drawn touching come out as one strip: `sheet_split_heads.py ... NN_Name:<idx>` gives `head0..5`.
   - Talking/expression swaps: `head_fit.py vp_heads.json <char>:<body>:<heads>` (ink template match) then `head_less.py <char>:<body>:<neutral>` (body without its own head, so tufts/hair never double). `VKit.Quill` lip-syncs this way.
   - Walks: `RIG_SCALE=3 autorig_sticks.py public tg2/vpsel src/VP/vprig.json` on copies named `vp_<char>/<n>.png`; use `<Rig c="vp_<char>" pose="1" walk>`. Match a walk's travel to where the next pose stands (no jumps).
   - Studio for non-Thanksgiving films: `<B.Studio art="whitehouse" />` (no turkey portrait). 1920s Avenue has cars: never use it before 1900.

26. **VO envelope is 0..9.** `mouthAt()` treats a 3-5 f block averaging ≥3 as voiced, so `ep/<k>.json` `env` must be integers 0..9 (`scripts/ep_env.py` writes it). A 0..1 envelope silently keeps every talking mouth/beak shut: after building an ep, check `sum(env>=3)/len ≈ 0.7`.
27. **Editable project export.** Every finished part also gets an After Effects package (`scripts/ae_export`): a `.jsx` that rebuilds the comp with native layers (backgrounds, each character pose, rig limbs with walk expressions, captions/labels as text, camera nulls, VO and each SFX). Keep it saved; hand it over only when the user asks.

28. **Quill is the same mascot in every video.** Always the original Thanksgiving Quill: `Kit.Quill` with the poses in `public/tg2/Poses/quill` (speaking_facing_right, nervous_side_glance, deadpan_wings_folded, startled_recoil, scoreboard_*, pardon_plea, closing_hoo, blink). Never use an owl drawn on a new project's character sheet (the VP pack's green-vest "Quill" was rejected), even if the pack names it Quill. Peeks: `nervous_side_glance` cropped bottom-left (it already has sweat drops; don't add more).

29. **Head swaps must never show a double outline.** A swapped expression head is never pixel-identical to the head drawn on the body, and it bobs/tilts while acting, so erasing only the neutral head's silhouette leaves arcs of the old outline beside the ears, over the hair and at the jaw. Always build headless bodies with `scripts/head_less.py <vp_heads.json> <vp_sprites.json> <vprig.json> public <char>:0:<all six heads>`: it erases everything above the chin cut plus the dilated union of ALL the character's heads, for both the sprite body and the rigged body, and FAILs if any body ink is left in the head band. Never ship with a FAIL. Then contact-sheet every actor x every expression (+ blink) on a light background and look at it before rendering.
30. **Check the double outline at full size before rendering.** Render a 1080p still of each actor shot and crop the head at 2x: any arc of outline outside the head (beside the ears, over the hair, at the jaw) means the headless body is stale. Re-run `head_less.py` after ANY head re-fit or new expression head.
31. **Eyes must stay right.** Generated blinks (`make_blinks.py`) skip glasses automatically (a lens ring around the eye); never hand-add blinks to glasses-wearers. Some sheet expression heads are mis-drawn (Theodore Roosevelt happy head 19 and pose 13 have a squinted, wrong eye): check the actor contact sheet and remap a bad head in `VKit.HEAD` instead of using it. A character whose head fit is poor (fit score < 0.4, e.g. Washington) is never an `Act`; use his pose sprites.
32. **Full film = one continuous voiceover.** Parts are timed against slices of the master VO; the full film places every part at its offset in the master file and plays the master once (Episode `noAudio`), so there are no gaps or double pauses at part joins.

33. **ALWAYS: every body part stays attached in every frame (the user's #1 rule; a floating head went out across a whole film).** Before ANY render that has swapped heads or rigged limbs, run all three and never render with a FAIL:
   - `head_attach.py <vp_heads.json> public <char>:0:<neutral,...>` places every expression head with its CHIN on the neutral head's chin (+3 % into the collar), then checks the neck columns from chin to collar have no transparent row. Heads used to be scaled and aligned by their top, so an open-mouth head ended above the collar.
   - `head_less.py ... <char>:0:<all heads>` erases the old head only inside the heads' columns and only down to the neutral chin (the collar is never cut), drops detached fragments (old hair ribbons, outline slivers) and keeps every limb pivot's pixels.
   - `check_vp_rig.py src/VP/vprig.json public` checks every limb pivot is on the body ink (both the body and the headless body), so limbs rotating about it can never detach.
   Order: head_fit, then head_attach --nocheck, then head_less, then head_attach (check), then check_vp_rig. Then look at the all-actors x all-expressions contact sheet AND a 1080p crop of the neck of a few rendered frames. In code: the head never translates on its own (no separate head bob); it only tilts about the chin. Walkers use a rigged `Act`/`Rig` (legs move), never a sliding sprite.

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

### Pose-swap packs (sprites + head swaps + bodies + tags): current build `src/Thanksgiving3/`, composition `ThanksgivingFull` (cold open + ch 1–3)
- **Import:** `python3 -I .claude/skills/2d-animation/scripts/import_pose_pack.py <pack> public/tg2 src/<Project>`. It writes:
  - `sprites.json`: the drawing's bounding box per sprite, for feet registration.
  - Quill `__open` / `__closed` beak variants of his talking poses, for lip-sync swaps.
  - `boards.json`: the scoreboard's chalkboard rectangle.
  - A copy of the pack's `Scene_Guide.md`. **Follow its performance order per beat.**
- **Measure collars:** measure body collars and head chins into `collars.json` (see `Thanksgiving2/index.tsx` `HB`), so the chin sits just inside the collar.
- **Animate with `Kit.tsx`:**
  - **`Spr`** draws a pose swap with the feet registered, plus breathing and a **rise-and-settle on VO stresses** (`stress`). It also handles `enter`, `walk`, `drop` and `shake`.
  - **`Quill`** has a closed beak unless `talk`, and supports `blinkHold`.
  - **Text, camera and FX:** `Cap` (hard on/off), `Card` (70% darken), `Stamp` (bible §5), `Cam` (push plus `punch`), `QMarks`, `Cheer`, `Speed`, `Puff`, `Note` (typewriter text), `Tag`, `PopIn`.
- **Supporting cast:** use the old layered pack's cutouts (`OLD/...` keys) when the new pack lacks someone (the debtor, the delegates).

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
