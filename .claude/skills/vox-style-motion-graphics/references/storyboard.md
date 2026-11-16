# storyboard.json

The storyboard is the only file you write by hand. `vox.py build` turns it into a timed, positioned scene. This page covers every field, the screen regions each beat type uses, and a complete example.

## Contents
1. Top level
2. Fields every beat can use
3. Cues (when things happen)
4. Points (where things point)
5. Beat types: subject, diagram, chart, stat, closer
6. Text length limits
7. Full example

## 1. Top level

```json
{
  "title": "Why you can't tickle yourself",        // also names the output file
  "source": "Blakemore, Wolpert & Frith, Nature Neuroscience (1998)",   // printed on the closer
  "voice": "audio/vo.mp3",                          // path inside <project>/public
  "beats": [ ... ]                                  // in script order
}
```

## 2. Fields every beat can use

| field | meaning |
|---|---|
| `type` | `subject`, `diagram`, `chart`, `stat` or `closer` |
| `line` | **exactly** this beat's sentence from the voiceover script. Timing comes from matching these words to the audio, so keep them identical (punctuation is ignored). |
| `enter` | how the beat starts: `cut` (default), `wipe` (yellow charcoal scribbles cover the previous beat), `slide` (a sheet slides in; charts always do this) |
| `fig` | small yellow tag, e.g. `"FIG. 02"`. Number figures in order. |
| `title`, `title_cues` | serif title lines and when each types on (see the beat type for size limits) |
| `note` | handwritten black marker note: `{ "text": "nothing.", "cue": "yourself" }`. Lower-case reads best; the font is all caps. `\n` makes a second line (diagram notes). |
| `points` | named points in **source image px**, e.g. `{ "face": [645, 195] }` |
| `prop` | name of a props cut-out to decorate the beat (feather, stopwatch...) |

## 3. Cues

A cue says when something happens. Use the word that triggers it:

- `"cerebellum"`: the moment that word starts in this beat's line. Matching is by prefix and ignores case and punctuation, so `"copy"` matches "copy,". Several words work too (`"a copy"`).
- `"turns+6"` / `"yourself-4"`: N frames after or before that word (30 frames = 1 s). Things that should *already be there* when a word is said need a small negative offset.
- `12`: a plain number is frames from the beat's start.
- `"end-12"`: frames before the beat ends.
- If a cue is missing, a sensible default is used. If a word isn't found, `build` prints a warning and uses the default.

Ink marks take about 8–15 frames to draw, so cue them on the word they illustrate.

## 4. Points

All coordinates in the storyboard are in the **source image's pixels**: the PNG you generated, as labelled in its `_grid.jpg` from `VOX grid`. The engine maps them through the cut-out's scale and crop. Read them off the grid, because guessed points miss.

A point can be a name from `points` or a literal `[x, y]`. Sizes (`"size": [rx, ry]`) are ellipse radii in source px; a face is usually about [100, 125].

## 5. Beat types

### subject: a cut-out photo on a yellow block

Screen: the cut-out is centred around x≈880 and fitted inside 1000×900. If the photo runs off its bottom edge it is anchored to the frame bottom. A grid panel sits top-left, a clipping bottom-left, a prop top-left, and a scribble above the subject's shoulder. The text column starts at x=1420.

```json
{
  "type": "subject",
  "line": "You can't tickle yourself.",
  "subject": "man",                                  // cut-out name (VOX cutout ... man ...)
  "points": { "face": [645, 195], "fingers": [553, 545] },
  "fig": "FIG. 01",
  "title": ["Self-tickle", "Result:"],               // up to 3 lines, ≤ 12 characters each
  "title_cues": [null, "yourself-12"],
  "note": { "text": "nothing.", "cue": "yourself-4", "arrow_to": "face" },   // arrow from the note to a point
  "annotate": [
    { "marks": "fingers", "cue": 8, "dir": "right" }, // three motion arcs (wiggle, vibration, sound)
    { "circle": "face", "size": [100, 124], "cue": "tickle-4" },
    { "underline": [[300, 600], [520, 610]], "cue": "..." }
  ],
  "wiggle": { "from": 6, "to": 48 },                  // only if the cut-out was made with --wiggle
  "clipping": {                                       // optional newspaper column (real, sourced copy)
    "headline": "Why can't we tickle ourselves?",
    "dek": "The brain predicts its own touch, scientists find",
    "body": "60–80 words of accurate copy..."
  },
  "prop": "feather"
}
```

### diagram: an engraving on a yellow disc, with arrows, circles and labels

Screen: the image is fitted into 880×700, centred at (700, 533), with a yellow disc behind. The right column starts at x=1300 over a grid panel. The note sits under the title. A prop goes bottom-right.

```json
{
  "type": "diagram",
  "enter": "wipe",
  "line": "Your brain sends your cerebellum a copy of every move.",
  "image": "brain",
  "points": { "motor": [615, 62], "cereb": [862, 522] },
  "fig": "FIG. 02",
  "title": ["The efference", "copy."],               // ≤ 14 characters per line
  "title_cues": [6, "copy"],
  "note": { "text": "a copy of\nevery move", "cue": "copy" },
  "arrows": [
    { "path": [[615, 70], [650, 330], [790, 470], [778, 700], [790, 880]], "cue": "sends-4", "spark": true },
    { "path": [[702, 330], [910, 90], [1280, 230], [1150, 470], [980, 460]], "cue": "copy-6", "dashed": true }
  ],
  "circles": [{ "at": "cereb", "size": [152, 96], "cue": "cerebellum-2", "label": "CEREBELLUM" }],
  "tags": [{ "text": "MOTOR CORTEX", "at": "motor", "cue": "brain", "dx": -225, "dy": -106 }],
  "prop": "neuron"
}
```

- `path` is a smooth curve through the listed points: the first is the start, the last gets the arrowhead. Points can sit outside the image (e.g. an arrow leaving the brain toward the body). `spark` adds a small burst at the start (a signal firing). `dashed` makes a dashed line, good for copies, predictions and invisible things.
- A circle's `label` adds a leader line to the right with a yellow tag.
- A tag is placed at the point plus `dx, dy` in screen px (default up-left of it).

### chart: graph paper with series

Screen: a sheet slides in. The plot is x 230–1690, y 360–840, with the title top-left, the note at (1420, 246) and the prop bottom-right. All series share one y-range.

```json
{
  "type": "chart",
  "line": "It predicts the touch... and turns it down.",
  "fig": "FIG. 03",
  "title": "What you feel",                           // one line, ≤ 28 characters
  "series": [
    { "values": "burst", "style": "highlight", "cue": "predicts",
      "label": { "text": "predicted", "at": 0.2, "dy": -228 } },          // at = 0..1 along x; dy in px
    { "values": "burst", "noise": 0.18, "style": "ink", "cue": "touch-2", "tag": "FELT",
      "morph": [ { "scale": 0.55, "cue": "and+2" }, { "scale": 0.25, "cue": "and+8" }, { "scale": 0.06, "cue": "and+14" } ] }
  ],
  "xlabels": ["1950", "1975", "2000", "2025"],        // optional, spread evenly (or {text, at})
  "zero": true,                                       // optional: include 0 in the y-range (data charts)
  "note": { "text": "turned down.", "cue": "turns", "arrow_to": [1, 0.65] },   // [series index, 0..1 along x]
  "prop": "stopwatch"
}
```

- `values`: real numbers, e.g. `[3.1, 3.4, 4.0, 5.8]` for yearly data (add `"dots": true` to stamp points), or `"burst"` for a signal-like oscillation.
- `style`: `highlight` (thick yellow, the thing to notice or the expected value), `ink` (thin black pen), or `dashed`.
- `morph`: later states of the same series, swapped in on their cues, in stop-motion steps. Use `scale` (multiplies around `baseline`, default 0) or full `values`.

### stat: one number

Screen: the number is centred on a yellow block across the middle top, the caption sits centred below, the note bottom-right, a prop bottom-left and a grid panel bottom-right.

```json
{
  "type": "stat",
  "line": "Only about 1 in 10 people can do it.",
  "fig": "FIG. 04",
  "number": "1 in 10",                                // ≤ 8 characters reads best
  "number_cue": "1",
  "caption": ["people can roll their", "tongue into a clover"],   // 1–2 lines, ≤ 28 characters each
  "note": { "text": "rare!", "cue": "do" },
  "prop": "stopwatch"
}
```

Only use a number that is in your research notes.

### closer: payoff with headline and ransom word

Screen: the cut-out sits on the left on a yellow block (fitted to 1180×900). On the right is a beige sheet with 1–2 headline lines (≤ 9 characters each, caps read best), a ransom-note word (≤ 10 characters), a yellow underline and the source credit. A prop and a scribble sit on the sheet.

```json
{
  "type": "closer",
  "line": "Tickling needs surprise.",
  "subject": "laugh",
  "points": { "hands": [870, 455] },
  "headline": ["TICKLING", "NEEDS"],
  "headline_cues": ["Tickling", "needs"],
  "ransom": "SURPRISE.",
  "ransom_cue": "surprise",
  "annotate": [{ "circle": "hands", "size": [109, 78], "cue": "surprise+4" }],
  "note": { "text": "not you.", "cue": "surprise+12" },   // placed under the first circle (or set "under")
  "prop": "feather"
}
```

If the subject has something entering from the right edge of its photo (another person's hands), the beige sheet hides the cut end, which works well.

## 6. Text length limits

| element | fits |
|---|---|
| subject title | 1–3 lines × ≤ 12 characters |
| diagram title | 1–2 lines × ≤ 14 characters |
| chart title | 1 line ≤ 28 characters |
| closer headline | 1–2 lines × ≤ 9 characters, plus a ransom word ≤ 10 |
| notes | ≤ 12 characters per line (shrinks to fit, but short is better) |
| tags | ≤ 16 characters |

## 7. Full example

`examples/tickle/storyboard.json` is the complete storyboard for "Why you can't tickle yourself" (4 beats, 10.6 s), with its script and research notes alongside.
