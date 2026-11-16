---
name: vox-style-motion-graphics
description: Turn any topic into a short animated explainer video, end to end, in one of five collage styles (Vox paper collage, newspaper data editorial, surreal pop-art collage, cinematic creator, retro mid-century). Claude researches the topic, writes a fact-checked voiceover script, generates the narration and archival-style collage images, then renders a hand-made mixed-media animation (black-and-white halftone cut-outs, yellow paint blocks, ink notes drawn with p5.brush, grid paper, newspaper clippings, ransom-note type, stop-motion feel) to an MP4 with Remotion. Use this whenever someone says "vox style motion graphics" or asks for a Vox-style video, a data explainer with live counters and charts, a pop-art or surreal collage edit, a cinematic creator or brand promo, a retro or vintage collage story, an explainer animation, a collage or paper-cut-out style video, a short science, history or "why does X happen" video, an animated reel or short about a topic, or says "make a video about" some subject, even if they don't say "Vox" or name any tool.
---

# Vox style motion graphics

Invoke with `/vox-style-motion-graphics <topic or request>`, or just ask for a video in one of the styles below. In this repo the skill lives at `.claude/skills/vox-style-motion-graphics` (that is `SKILL_DIR`).

The user gives a topic. You deliver a finished MP4 (1920x1080, H.264/AAC, default ~10 s) in the house collage style, plus the script and sources. The user should not have to do anything else: install, research, write, generate and render yourself, and only stop to ask when something genuinely needs their decision (for example, approving a download from a website, or spending a lot of credits).

## The look (why it works)

It is a paper collage animated by hand. On a dull warm-white board, a black-and-white photo or engraving is cut out with a thin white edge and a newspaper halftone dot screen, and slapped down on a painted yellow block. Black felt-pen notes circle and point at things, yellow highlighter swipes sit under key words, a grid panel and a clipped newspaper column sit behind, and big serif titles type on. The last beat lands on a ransom-note word. Everything moves "on twos", while the textures and line jitter move slowly, so it feels handmade rather than jittery. Yellow (#EDBD2E) is the only accent colour. Don't add orange or red, and don't use a dark background. The engine handles all of this; your job is the story, the pictures and where the notes point.

## Styles

The section above describes the default `vox` look. Four more styles are built in and are set with `"style"` at the top of the storyboard:

| style | when to use it | look |
|---|---|---|
| `vox` (default) | science or "why does X happen" mechanisms | paper collage, one yellow, ink notes |
| `editorial` | numbers, money, policy, "how big is X" | newspaper paper and vignette; red + yellow highlighter; rolling counters, charts, stamps, live ticker |
| `popart` | film, culture, psychology, anything dramatic or surreal | grid paper or charcoal; B&W cut-outs with red/yellow insides; heads that split open; glitch and zoom-through cuts |
| `cinematic` | a person, creator or brand story, one big reveal | dark concrete; dim B&W subject; glowing green numbers behind the head; cyan lower-third |
| `retro` | history, inventions, "how it was discovered" | flat khaki/lime/red grounds; sepia cut-outs; teal and red geometry; yellow sticker labels; parallax pans |

Choose from the topic, or match a reference the user gives. **Read `references/styles.md` before storyboarding any style other than `vox`.** It has the beat types (`hero`, `counter`, `flip`, `stacks`, `bars`, `linechart`, `callouts`, `split`, `pan`, `burst`, `tunnel`), caption markup, transitions (`glitch`, `zoom`, `blur`, `dark`, `iris`, `shape`, `slide`, `wipe`) and cut-out flags per style. The palette rule in "The look" applies to `vox` only. Each other style has its own palette, so don't add colours beyond it.

## Workflow

Paths below use `SKILL_DIR` for this skill's folder and `VOX` for `python3 "$SKILL_DIR/scripts/vox.py"`.

### 1. Set up (first run only)

Run `VOX doctor`. If anything is missing, run `VOX setup`. It installs the engine (Remotion, p5.brush, headless Chrome) and a Python venv into `~/.vox-collage-explainer` and takes about a minute. It needs Node 18+ and ffmpeg. If those are missing, install them (on macOS `brew install node ffmpeg`) and re-run.

### 2. Research the topic

Use web search to find how the thing actually works. Aim for 3–5 solid sources: primary papers, university or agency pages, reputable journalism. Pick **one** surprising, concrete mechanism or fact that fits in the time. A good explainer answers a question the viewer already half-wonders about ("why can't you tickle yourself?"). Save notes with links to `<project>/research.md`. Every claim in the script must trace to a source. If a fact is contested, either say so or pick a different fact.

### 3. Write the script

- About 2.6 spoken words per second: 10 s ≈ 25 words in 4 beats, 20 s ≈ 50 words in 6–7 beats, 30 s ≈ 75 words in 9–10 beats. Default to 10 s unless the user asks for another length.
- One beat = one short sentence (one breath). Use a hook, then the mechanism, then a payoff that echoes the hook.
- Plain words. Name the key term once if it matters ("the cerebellum"). The final card credits the main source.
- Show the user the script in one line before generating anything paid. Don't wait for approval unless they asked to review it.

### 4. Storyboard

Create the project with `VOX new <project> --title "<title>"`, then write `<project>/storyboard.json`. Read `references/storyboard.md` now for the beat types, every field and a complete example (and `references/styles.md` for any non-vox style). In short, for `vox`:

| beat type | use it for | centre of the frame |
|---|---|---|
| `subject` | the hook, a person or object doing the thing | a cut-out photo on a yellow block, title column on the right |
| `diagram` | how it works inside (anatomy, machine, map) | an engraving on a yellow disc, with ink arrows, circles and labels |
| `chart` | a signal, a trend, before/after numbers | graph paper with a yellow highlight series and an ink series |
| `stat` | one striking number | ransom-note number on a yellow block, caption |
| `closer` | the payoff, usually last | a cut-out on yellow, beige sheet with headline + ransom word + source |

Each beat's `line` must be exactly its sentence of the script, in order, because timings come from matching those words. Cues like `"cue": "cerebellum"` fire when that word is spoken. Images are listed per beat and generated next.

### 5. Voiceover

Use the ElevenLabs connector if it is available (`creative_list_voices`, then `creative_generate_speech` with `eleven_v4`). Pick a warm, conversational narrator (search "narrator", use case `informative_educational`). Generate 1 take, or 2 if you want to choose. Light direction tags such as `[curious]` and `[matter-of-fact]` help. Use `...` for a beat pause. Keep the spoken words identical to the storyboard lines (tags aren't spoken). Get the file URL with `creative_get_flow_run_status` and download it to `<project>/public/audio/vo.mp3`.

Without ElevenLabs, use any TTS tool you have. As a last resort, `VOX say <project>` uses the operating system's voice.

### 6. Images

Read `references/image-prompts.md` for prompt templates that cut out cleanly (it has a section per style). Typically you need 1–2 **photos** (people, waist-up, plain grey studio backdrop), 1 **engraving** (the "inside" diagram) and 1 **props** sheet (2–3 small objects for decoration). Generate them with the ElevenLabs connector (`creative_generate_image`, model `gpt-image-2.5-sunburst`, `generations_count: 1`) or any image tool available. Download each to `<project>/work/src/<name>.png`.

For each image:
1. Run `VOX grid <image>` and **look at the `_grid.jpg`** to read the source-pixel coordinates of the points you will annotate (face, hands, the part of a diagram you circle, where arrows start and end).
2. Cut it out:
   - `VOX cutout <project> <name> <image> --kind photo`. Add `--wiggle x0,y0,x1,y1 --pivot px,py` to cut a hand or small part as a separate piece that wiggles.
   - `--kind engraving` for illustrations on plain paper.
   - `--kind props --names a,b,c` for a sheet of objects, named left to right.
   - Non-vox styles: add `--halftone 0`, plus `--edge 0` (cinematic, retro) or `--color` (editorial colour illustrations). See `styles.md` §7.
3. Put the points in the storyboard (source px, as read from the grid).

If no image generator is available, use public-domain archival images (Wikimedia Commons, Library of Congress, Smithsonian Open Access) **after asking the user** before downloading.

### 7. Render and check

Run `VOX make <project>`. It aligns the timings, lays out the scene, renders the p5.brush layers (cached, so only changed layers re-render) and writes the video. Use `--draft` for a fast half-resolution pass while iterating. Then **look at `<project>/out/contact.jpg`** and check:
- nothing important overlaps (titles vs subject, notes vs arrows), and no text runs off the frame;
- arrows and circles land on the right spot, and notes read in order with the voice;
- the style's palette holds (vox: yellow, black and warm white);
- captions land on the spoken words, and the same subject doesn't re-enter on a cut (`"anim": "none"`).

Fix by editing points, cues or text in the storyboard and running `make` again. `VOX sheet <project> <frames…>` shows specific frames. Expect one or two passes.

### 8. Deliver

Give the user:
- the final MP4 from `<project>/out/<slug>.mp4` (send the file if a file-sending tool exists);
- the script;
- 2–4 source links;
- what was generated, with an approximate credit cost. Rough guide on ElevenLabs: a voice take is ~200 credits, an image ~190 (a reference-image edit ~430), a sound effect ~17.

Offer an obvious next step, such as another length, a different voice, or a music bed. Music costs ~1,650 credits, so ask first.

## Good judgment calls

- **Fewer, bigger ideas.** One mechanism per video. If the research is rich, save the rest for a follow-up rather than cramming it in.
- **Real copy only.** Clipping text, labels and numbers must be true and sourced. Never invent a statistic to fill a `stat` beat. Use one from the research, or pick another beat type.
- **People and likeness.** Generated "archival" people are fictional. Don't generate images of real, identifiable people or brand logos. For a real historical figure, use a genuine public-domain photo (ask before downloading), or show their work or objects instead.
- **Points come from looking.** Always read coordinates off the grid image rather than guessing. A circle that misses the face looks broken.
- **When something looks off,** prefer changing the storyboard over editing engine code. The beat layouts are tuned. If you do change the engine, the source is in `engine/`, and `VOX setup` copies it into place.

## Files

- `scripts/vox.py`: the CLI for everything above (`VOX -h`).
- `scripts/layout.py`: beat layouts, mapping storyboard to scene.
- `scripts/render_brush.mjs`: p5.brush layer renderer.
- `engine/`: the Remotion project that draws scenes (`Video.tsx` vox elements and transitions, `fx.tsx` style elements, `theme.ts` palettes).
- `references/storyboard.md`: the storyboard format with a full example (read before step 4).
- `references/image-prompts.md`: image prompt templates (read before step 6).
- `references/styles.md`: the editorial, popart, cinematic and retro styles, their beat types, caption markup and transitions.
- `examples/styles/`: one layout-reference storyboard per style.
- `examples/tickle/`: a complete worked example (research, script, storyboard).
- `assets/sfx/`: paper, marker, typewriter and scribble sounds, cued automatically.
