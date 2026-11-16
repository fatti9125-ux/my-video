---
name: 2d-animation
description: 2D cartoon explainer animation for this Remotion repo. Use when the user asks to analyze an animation/video's style (frame by frame, characters, backgrounds, graphics, sound effects), or to design, script, storyboard or build 2D animated explainer scenes, characters, backgrounds, title cards, stamps or sound plans in that style. Triggers: "2d animation", "analyze this animation", "animation style", "make a scene/character/episode in this style", Google Drive or video links to study.
---

# 2D Animation (explainer-cartoon style)

This repo is a **Remotion** project (`src/Root.tsx`, 1920x1080 @ 30 fps; `npm run dev`, `npx remotion render src/index.ts <Id> out/<name>.mp4`). Installed helpers: `@remotion/shapes`, `@remotion/paths`, `@remotion/transitions`, `@remotion/noise`, `@remotion/motion-blur`, `@remotion/lottie`, `@remotion/google-fonts`.

The house style is documented in `references/explainer-style-guide.md` (derived from a frame-by-frame study of a 23-min comedy history explainer). **Read it before designing or building anything.**

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

Workflow: script → shot list (timecodes, shot type, characters, BG, text, SFX) → build components under `src/<ProjectName>/` → register a `<Composition>` in `src/Root.tsx` → render a short check (`--frames=0-90`) and inspect stills before full render → commit and push.
