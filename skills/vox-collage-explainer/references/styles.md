# Styles

A storyboard picks one look with a top-level `"style"`. The default is `vox`, the original paper collage. The other four were built from reference videos. Each has its own palette, fonts, background, motion feel and beat types. Every beat type works in every style, so you can mix them (for example, a `stat` beat in an editorial video). The look stays coherent if you mostly use the beats listed for the style.

| style | look | motion | best beats |
|---|---|---|---|
| `vox` | warm-white board, B&W halftone cut-outs, one yellow, ink notes | stop-motion on twos, hand-drawn boil | subject, diagram, chart, stat, closer |
| `editorial` | newspaper paper with a heavy vignette, red for "now / bad", yellow highlighter, italic serif + condensed numbers | snappy pops, numbers that roll, lines that draw on | counter, stacks, linechart, bars, flip |
| `popart` | light grid paper or charcoal, B&W cut-outs, red interiors with yellow rims | 3D board tilt, glitch slices, zoom-throughs, explosions | burst, hero, tunnel |
| `cinematic` | dark concrete wall, dim B&W subject, glowing green numbers, cyan lower-third | slow push-in, rise-ins, digits that fly in and assemble | hero (with `number`, `pill`, `darken`) |
| `retro` | flat khaki / lime / red grounds, sepia cut-outs, teal and dark-red geometry, yellow sticker labels | smooth eased slides, parallax pans, text tucked behind the subject | pan, hero, split, callouts |

Pick the style from the topic and tone. Use `editorial` for numbers and policy, `popart` for film, culture or anything dramatic and surreal, `cinematic` for a person or brand story, and `retro` for history and "how it was discovered". Use `vox` for science mechanisms. If the user names a reference, match it.

## Contents
1. Caption markup
2. Transitions (`enter`)
3. Fields every style beat can use
4. Beat types: hero, counter, flip, stacks, bars, linechart, callouts, split, pan, burst, tunnel
5. The `hud` live counter
6. Raw `fx` elements (escape hatch)
7. Cut-outs per style
8. Full examples

## 1. Caption markup

Every `caption` (and `headline`, `note` in the style beats) is a line of words that appear one at a time. **A word that also appears in the beat's spoken `line` lands exactly when it is spoken.** Other words follow 3 frames after the previous one.

| markup | effect |
|---|---|
| `*word*` | yellow highlighter swipes in behind it |
| `!word!` | accent colour (red in editorial/popart, dark red in retro, green in cinematic) |
| `+word+` | second accent (yellow; cyan in cinematic) |
| `~word~` | a red line strikes through it |
| `_word_` | muted grey |
| `^word^` | 1.45× bigger (for size hierarchy, e.g. `_He noticed_ / +Something+ / ^Strange^`) |
| `/` | line break |

Markers can span words: `*speeding up.*`. Keep captions short, about 2–6 words per line.

## 2. Transitions: `"enter"` on the incoming beat

| value | what happens | good in |
|---|---|---|
| `cut` | hard cut (default) | all |
| `wipe` | yellow charcoal scribbles cover the frame | vox |
| `slide` | the new beat slides in from the right with a torn paper edge | vox, editorial |
| `glitch` | the frame breaks into horizontal strips that swap to the new beat | popart, editorial |
| `zoom` | the camera dives into a point of the previous beat, then cuts. Write it as an object: `{"type": "zoom", "at": [x, y]}` with the point in screen px on the previous beat | popart |
| `blur` | the previous beat defocuses and brightens; the new one comes back into focus | editorial, cinematic, retro |
| `dark` | the previous beat dims to black, then cuts | cinematic |
| `iris` | the new beat opens in a growing circle while it spins upright. Optional `"at"` sets the centre | popart |
| `shape` | an accent-coloured diagonal band sweeps across and reveals the new beat | retro |

Each transition can take `"n"` (length in frames, 8–10 by default), e.g. `{"type": "glitch", "n": 12}`.

## 3. Fields every style beat can use

| field | meaning |
|---|---|
| `bg` | background colour: a theme name (`board`, `dark`, `paper`, `accent`…), a preset (`khaki`, `lime`, `red`, `cream`, `teal`, `black`, `white`) or a hex |
| `dark` | `true` uses the theme's dark board (popart charcoal, cinematic black) |
| `grid` | `false` hides popart grid paper |
| `cam` | camera: `{"push": 0.06, "pan": [dx, dy], "rot": 2, "tilt": [rx0, ry0, rx1, ry1]}`. Tilt is a 3D board tilt in degrees that eases from the first pair to the second |
| `shapes` | flat plates: `[{"kind": "circle", "at": [x, y], "r": 220, "color": "accent3", "cue": "word"}]`. Kinds are `circle`, `ring` (`thick`), `semi`, `tri`, `glow`, `rect`/`rounded` (`w`, `h`) and `streaks`. Optional `drift` `{x, y, s, r}` and `pulse` `{hz, amp}` |
| `props` | floating cut-outs: `[{"name": "knife", "at": [x, y], "size": 260, "rot": -20, "cue": "word", "anim": "pop", "drift": {"y": -30, "r": 8}}]` |
| `fx` | raw engine elements (section 6) |

Animation names (`anim`) are `pop`, `slam`, `grow`, `rise`, `drop`, `up`, `left`, `right`, `top`, `zoom`, `blur`, `fade` and `none`.

## 4. Beat types

### hero: a subject on a shape plate, with words (all styles)

```json
{ "type": "hero", "line": "Scientist Alexander Fleming", "subject": "fleming", "side": "right",
  "points": { "face": [640, 210] },
  "plate": { "kind": "ring", "at": "face", "r": 150, "thick": 34, "color": "accent", "cue": "Alexander" },
  "caption": "Scientist / !Alexander! / Fleming", "caption_size": 110,
  "label": { "text": "1881–1955", "cue": "Fleming" } }
```

- `side`: `right` (subject right, words left), `left`, or `center` (words on top). The default is `center` for cinematic/popart and `right` otherwise.
- `behind`: words sit **behind** the subject (a depth sandwich). This is the default for `center`.
- `plate`: one shape behind the subject. `at` is a point name (source px) or omitted for centre-of-subject. `dx`/`dy` nudge it, `r` sets the radius and `streaks: true` adds rain/film scratches.
- `rays`: `true` or `{n, r1, cue}`. Grey sticks burst out from behind (popart).
- `number`: `{"to": 1000000000, "prefix": "$", "cue": "billion"}`. In cinematic it glows green and the digits fly in and assemble behind the head. Set `assemble`/`glow` to change that.
- `pill`: a cinematic lower-third, `{"text": "THE CHANNEL", "cue": "channel", "out_cue": "end-10", "x": 300, "y": 360}`.
- `darken`: a word cue. The background dims to black from there (cinematic "light-down").
- `anim`: how the subject arrives. Use `"none"` when the previous beat already showed the same subject (no re-entrance on a cut).
- `echo`: `{"n": 7, "dx": 120, "from": 0, "to": 18}`. Copies trail beside the subject and collapse into it.
- `back_props`: props placed behind the subject (e.g. a banknote on the wall).

### counter: one rolling number with editorial furniture

```json
{ "type": "counter", "line": "Before this video ends, America will borrow over two million dollars.",
  "caption": "_Before this video ends,_ / America will *borrow*", "label": "Borrowed since you hit play",
  "number": { "from": 0, "to": 308420, "prefix": "$", "cue": "America", "dur": 60, "ease": "linear" },
  "icon": "capitol", "progress": { "cue": "America", "fill": 0.35 },
  "stamp": { "text": "OVER $2 MILLION", "sub": "BY THE END", "cue": "two" } }
```

`number` also takes `suffix`, `dec`, `size`, `color`, `rate` (it keeps counting at N per second after `dur`) and `assemble`. `stamp.arrow` (default true) draws a red line from the stamp to the progress flag.

### flip: split-flap year

```json
{ "type": "flip", "line": "By 2048 it doubles.", "label": "BY", "from": 2026, "to": 2048, "cue": "2048", "dur": 22, "note": "it !doubles.!" }
```

### stacks: things dropping into rows, a slammed headline, then a unit chart

```json
{ "type": "stacks", "line": "The debt is forty trillion dollars, about 117 thousand for every American.",
  "prop": "money", "count": 8, "rows": 2, "headline": "$40 TRILLION", "headline_cue": "forty",
  "units": { "cue": "about", "cols": 22, "rows": 6, "highlight": 70, "headline": "!$117,000!", "caption": "_for every American_", "caption_cue": "every" } }
```

When `units` is present, the stacks shrink away on its cue. Person icons then fill a grid, "bills" fly from the centre onto each one, and the `highlight` icon turns red with a ring. Leave out `units` for stacks only.

### bars: ranked bars, one promoted to the top

```json
{ "type": "bars", "line": "Interest is now the government's biggest bill.", "caption": "the government's *biggest bill*",
  "items": [ {"label": "Social Security", "value": 1.6}, {"label": "Medicare", "value": 1.1}, {"label": "Defense", "value": 0.9},
             {"label": "Interest", "value": 1.8, "highlight": true} ],
  "promote": { "cue": "biggest" }, "stamp": { "text": "BIGGEST BILL" } }
```

### linechart: crisp axes, a red line that grows with a value tag riding its tip

```json
{ "type": "linechart", "line": "And it's speeding up.", "caption": "And it's *speeding up.*",
  "values": [1, 1.2, 1.5, 2, 3, 4.2, 6, 9, 14, 20, 28, 40], "xlabels": ["1800", "1900", "2000", "2025"],
  "ref": { "value": 20, "text": "$20 TRILLION" }, "tag": { "from": 1801, "to": 2025 }, "cue": 2, "dur": 40,
  "events": [ { "at": 0.45, "text": "World War II" } ], "stamp": { "text": "RECORD", "cue": "up" } }
```

`ylabels` is `[{"value": 20, "text": "$20T"}]`, `color` defaults to accent and `zero: false` drops the zero baseline.

### callouts: an image with leader-line labels

```json
{ "type": "callouts", "line": "Mold was killing the bacteria.", "image": "dish", "bg": "cream",
  "labels": [ { "text": "Mold", "at": [600, 450], "dx": 360, "dy": -200, "cue": "Mold" },
              { "text": "Bacteria", "at": "colony", "dx": -220, "dy": -120, "cue": "bacteria" } ] }
```

- `image` is a cut-out, so label `at` points are in source px (or names from `points`).
- `photo` (e.g. `"img/dish.jpg"` in `public/`) is a full-bleed picture instead, and its points are screen px.
- The camera slowly pushes and rotates.

### split: colour panel with stacked words, plus a photo

```json
{ "type": "split", "line": "He noticed something strange.", "panel": "red", "subject": "fleming",
  "caption": "He noticed / +Something+ / ^Strange^", "caption_size": 84 }
```

The other fields are `side` (`left`/`right` panel), `panel_w` (0.42), `photo` instead of `subject`, and `text` colour (`light`).

### pan: a wide scene tracking sideways with parallax

```json
{ "type": "pan", "line": "In 1928, in a busy London lab...", "scene": "skyline", "pan": 600,
  "shapes": [ {"kind": "semi", "at": [1250, 760], "r": 330, "color": "accent3", "drift": {"x": -200}} ],
  "mover": { "name": "car", "size": 380 }, "number": { "from": 1, "to": 1928, "cue": "1928" },
  "label": { "text": "Accidental Discovery", "cue": "lab", "x": 640, "y": 560 } }
```

`scene` is a wide cut-out (an engraving cut with `--kind engraving --edge 0`). Its `height` defaults to 620. `ground_y` (980) and `ground` (colour) set the road strip. A `mover` drives across. Shapes with a smaller `drift` than `pan` give parallax.

### burst: popart head that splits open over rays

```json
{ "type": "burst", "line": "Some films get inside your head.", "subject": "head", "split": "inside",
  "props": [ {"name": "knife", "at": [420, 300], "size": 300, "rot": -20}, {"name": "eye", "at": [1500, 280], "size": 160} ] }
```

The head is cut into `bands` (3) that drift apart by `gap` (140 px), showing a red interior with a yellow rim. `cuts` sets band edges as fractions (e.g. `[0, 0.3, 0.62, 1]` to cut above the eyes and at the mouth). Props pop in at the split. The board tilts in 3D by default (`cam.tilt`).

### tunnel: dark board, frames rushing past, subject with an echo trail

```json
{ "type": "tunnel", "line": "And he is always watching.", "subject": "man", "caption": "No one will be admitted after the start." }
```

## 5. `hud`: a live counter that runs across beats (editorial)

```json
"hud": { "label": "BORROWED SINCE YOU HIT PLAY", "prefix": "$", "rate": 77105, "start": 0, "from_beat": 2, "cue": 2, "until_beat": 5 }
```

`rate` is per second. Use a real, sourced rate.

## 6. Raw `fx` elements

Any beat can add engine elements directly, in screen px, with `cue` for timing:

```json
"fx": [
  { "t": "shape", "kind": "glow", "x": 960, "y": 400, "r": 300, "color": "accent2", "cue": "Forever" },
  { "t": "caption", "text": "Medicine / !Forever!", "x": 700, "y": 330, "size": 110, "cue": "Medicine" },
  { "t": "pic", "cutout": "hand", "x": -40, "y": 380, "scale": 0.8, "anim": "left", "cue": 2 },
  { "t": "stamp", "text": "NEW", "x": 1500, "y": 200, "size": 50, "cue": "new" },
  { "t": "leader", "pts": [[400, 500], [460, 420], [700, 420]], "cue": "here", "color": "accent" },
  { "t": "rays", "x": 960, "y": 540, "n": 16, "r0": 200, "r1": 500, "cue": 4 },
  { "t": "frames", "x": 960, "y": 560, "n": 5 },
  { "t": "counter", "x": 960, "y": 200, "size": 160, "align": "center", "from": 0, "to": 1928, "sep": false, "cue": "1928" }
]
```

Element types are `pic`, `shape`, `caption`, `counter`, `flip`, `bar`, `stamp`, `progress`, `line`, `label`, `leader`, `panel`, `pill`, `units`, `rays`, `slice` and `frames`. Their fields are listed in `engine/src/fx.tsx`.

## 7. Cut-outs per style

| style | cut-out flags | what the engine adds |
|---|---|---|
| vox | defaults (halftone, white edge) | nothing |
| editorial | `--color --edge 0` for coloured illustrations (money, buildings, icons); defaults for B&W photos | nothing |
| popart | `--halftone 0` (keep the white sticker edge) | grayscale filter |
| cinematic | `--halftone 0 --edge 0` | dim B&W filter |
| retro | `--halftone 0 --edge 0`; scenes with `--kind engraving --edge 0` | sepia filter |

See `image-prompts.md` for prompts per style.

## 8. Full examples

`examples/styles/` has one complete storyboard per style (`editorial.json`, `popart.json`, `cinematic.json`, `retro.json`). They are **layout references**. Their numbers and claims are placeholders, so research and source your own copy before using any of them.
