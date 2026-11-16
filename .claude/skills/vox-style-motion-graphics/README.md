# Vox style motion graphics (a Claude skill)

Give Claude a topic, and it makes a short animated explainer in one of five styles: `vox` (the default), `editorial` (newspaper data explainer with rolling counters, charts and a live ticker), `popart` (surreal grid-paper collage with heads that split open and glitch cuts), `cinematic` (dark B&W creator promo with glowing numbers) and `retro` (mid-century flat-colour collage with parallax pans and sticker labels). The default look is a hand-made mixed-media collage: black-and-white halftone cut-outs, yellow paint, ink notes drawn with p5.brush, grid paper, newspaper clippings and ransom-note type. Claude researches the topic, writes a fact-checked script, generates the narration and pictures, and renders an MP4.

> "Make a Vox-style video about why the sky is blue"
> "Explainer animation: how do noise-cancelling headphones work? 20 seconds"
> "Short collage video on why onions make you cry"
> "Editorial-style explainer on how big the national debt is"
> "Retro collage video about how penicillin was discovered"

## Install

- **This repo:** it is already installed as a project skill at `.claude/skills/vox-style-motion-graphics/`. Claude Code picks it up automatically in this repo; run it with `/vox-style-motion-graphics <topic>` or just ask for a Vox-style video.
- **Other projects / Claude desktop (Code tab):** unzip `vox-style-motion-graphics.skill` into `~/.claude/skills/` (you should end up with `~/.claude/skills/vox-style-motion-graphics/SKILL.md`), or ask Claude to install the `.skill` file for you.
- **Claude apps with skill upload:** upload the `.skill` file in Settings → Capabilities → Skills.

Claude does the rest on first use: it runs `scripts/vox.py setup`, which installs the render engine into `~/.vox-collage-explainer` (about 1 minute).

## What the computer needs

- A Claude environment that can run shell commands (Claude Code, the desktop app's Code tab, or Cowork).
- Node.js 18+, ffmpeg and Python 3. If headless Chrome can't be downloaded, set `CHROME_PATH` to any Chrome/Chromium (a Playwright install is found automatically). On a Mac: `brew install node ffmpeg`. Claude will tell you if they're missing.
- Recommended: the **ElevenLabs connector** in Claude, for the voiceover and the images. Any other text-to-speech and image tools Claude has will also work. Without any, Claude falls back to the system voice and public-domain archival images (it asks before downloading).
- macOS gives the cleanest cut-outs (Apple Vision); other systems use a colour-key fallback that works well with the plain backdrops the prompts ask for.

## Cost

A 10-second video on ElevenLabs is roughly 1,000–1,500 credits: about 200 for the voice, about 190 per image (3–4 images), and about 17 per extra sound effect. Paper, marker, typewriter and scribble sounds come bundled. A music bed is optional, about 1,650 credits, and Claude asks first.

## What's inside

```
SKILL.md                    the workflow Claude follows
references/storyboard.md    the storyboard format (beat types: subject, diagram, chart, stat, closer)
references/styles.md        editorial / popart / cinematic / retro styles and their beat types
references/image-prompts.md prompts that produce clean cut-outs
scripts/vox.py              setup, cut-outs, timing, layout, brush rendering, final render
scripts/layout.py           beat layouts
scripts/render_brush.mjs    p5.brush renderer (headless Chrome)
engine/                     Remotion project that draws the scenes
assets/sfx/                 bundled sound effects
examples/tickle/            a complete worked example
```

## Credits and licences

- [p5.brush](https://github.com/acamposuribe/p5.brush) by Alejandro Campos (MIT) draws every mark.
- [Remotion](https://www.remotion.dev) renders the video. It is free for individuals and small teams; larger companies need a Remotion company licence (see remotion.dev/license).
- Fonts (Libre Caslon Text, Permanent Marker, Special Elite, Anton, Playfair Display, Courier Prime, Montserrat, Plus Jakarta Sans) are from Google Fonts (SIL Open Font License).
- The paper textures are generated in code. The bundled sound effects were made with ElevenLabs by the skill's author.
