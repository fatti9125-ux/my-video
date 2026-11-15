# Reference Style Analysis

Breakdown of the five reference files (one skill package + four videos): the editing grammar, motion-graphics techniques and timing. Every observation comes from frame-by-frame sampling at 10 fps around each transition and 1–2 fps across each full clip.

---

## 0. Shared DNA across all references

| Trait | How it shows up |
|---|---|
| **Desaturated photo + one or two accent colours** | B&W or sepia cut-outs, with colour used only for meaning (red = danger/debt, yellow = highlight, green = money) |
| **Cut-out collage** | People and objects are background-removed and layered on a flat or textured board, never shown as full-frame stock video |
| **Kinetic type that follows the voice** | Words appear one at a time, in sync with narration; the key word gets a colour or style change |
| **Fast cadence** | A new visual event every 0.3–0.8 s; full scene changes every 1.5–4 s |
| **Paper / print texture** | Grain, paper fibre, halftone, torn edges, grid paper, vignetting |
| **Overshoot "pop" entrances** | Elements land slightly oversized (≈108–125 %) and settle to 100 % in 3–6 frames |
| **Continuous slow camera drift** | A subtle push-in or rotation, so no frame is ever static |

---

## 1. `vox-collage-explainer.skill`: the production system

This is a complete Claude skill (Remotion engine + Python CLI + p5.brush) that builds Vox-style collage explainers from a `storyboard.json`.

**Palette:** board `#E4DFD3`, ink `#1D1C20`, the single accent yellow `#EDBD2E`, beige sheet `#D8CBB0`, paper `#EEEAE1`. The rules are no red/orange and no dark background.

**Fonts:** Libre Caslon Text (serif titles), Permanent Marker (hand notes), Special Elite (typewriter tags), Anton (ransom letters).

**Motion techniques (from `engine/src/Video.tsx` and `kit.tsx`):**
- **Animating on twos:** `useStepped(2)` holds every pose for 2 frames, which gives a stop-motion feel.
- **Boil:** each piece gets a tiny random x/y/rotation offset (±0.8–1.5 px) that changes every 6 frames, like hand-placed paper.
- **Slapped:** elements enter at scale 1.08 and ease out (cubic) to 1.0 over 6 frames, with a drop shadow.
- **Camera:** a slow stepped push-in (~3 % per beat) plus hand-held jitter every 6 frames.
- **Typed text:** 2 characters per frame. Tags type at 3 characters per frame.
- **Hand notes:** a marker-font word revealed left to right with a `clip-path` wipe.
- **Ransom note:** one letter per frame. Each letter gets a random paper style, ±6° rotation and a 1.25→1 pop.
- **Brush layers (p5.brush):** each mark is rendered 3 times and the versions are cycled every 8 frames ("line boil"). Marks are revealed along the stroke path with a `destination-in` mask.
- **Transitions:** `cut`, `wipe` (yellow charcoal scribbles cover the frame) and `slide` (a torn-edge sheet slides in from the right in 7 frames).
- **Overlay:** screen-print mesh lines, paper specks that shift every 12 frames, and a warm vignette.
- **SFX:** slap, slide, marker, scribble and type, auto-cued to element entrances.

**Beat types:** `subject`, `diagram`, `chart`, `stat`, `closer`. The pacing is about 2.6 words/s and one sentence per beat.

---

## 2. `videoplayback_3` (46.8 s, 640×360, 30 fps): data-journalism explainer

**Genre:** an "editorial newspaper" data explainer about CO₂, then US debt. It ends with a "Made with Opus 5.5" promo outro. This is the clip closest to the skill's look, but it has its own variations.

**Look**
- Warm off-white paper board with a heavy vignette and grain.
- Fonts: an italic serif (Playfair/Caslon-like) for the narration line, a typewriter face for small labels, and a condensed heavy sans (Anton/Bebas-like) for big numbers.
- Accents: **red `#D7261E`** (bad/now) plus **highlighter yellow** behind key words. One section switches to a **black background** for the emotional "future → past" beat.
- Illustrated cut-outs (a painted landscape, a factory, a jar, the Capitol, money stacks, an hourglass) with white sticker edges.

**Editing and motion catalogue (with timings)**

| Time | Technique |
|---|---|
| 0.0–1.8 s | **Split-screen A/B compare:** "200 YEARS AGO" vs "TODAY". The jar fills with dots one at a time while a **counter rolls** 69→172→234→…→420. The changed dots turn red. |
| 1.7–1.9 s | **Torn-paper slide transition:** a new sheet with a torn left edge slides across in about 4 frames. |
| 2–5 s | **Line-chart draw-on:** an 800,000-year CO₂ wiggle draws left to right, then a **red spike** shoots up at "today". A dashed "previous peak" reference line appears. |
| 2–5 s | **Word-by-word subtitle build:** "the **highest** in 800,000 years". The key word gets a yellow highlighter swipe, and a grey word fades in last. |
| 5–6 s | **Fake video player UI** (a frame-within-frame) with a play button, which sets up the "before this video ends" gimmick. |
| 6–37 s | **Persistent live ticker:** a torn-paper badge in the top-right corner counts "borrowed since you hit play" upward every frame for the rest of the video. |
| 7–11 s | **Progress bar** (NOW → END flag) fills in red, with a hand-drawn red arrow pointing to an "OVER $2 MILLION" red stamp label. |
| 10.9 s | **Blur/defocus dissolve** out of the scene. |
| 11–12 s | **Staggered drop-in:** money stacks pop in left to right (about 1 every 2 frames) with an opacity flash. A second row drops on top. |
| 12–13 s | **Slam text:** "$40 TRILLION" letters pop in from below with overshoot. |
| 13–15 s | **Scale-morph to unit chart:** the stacks shrink and dissolve into a grid of person icons. The bills **scatter like particles** onto the icons, then the heading **blurs out and rolls** to "$117,000" in red. One icon gets a **red marker circle**. |
| 17–23 s | **Animated timeline chart:** the axis draws, then a red line grows along it with a black **year tag riding the tip** (1801→2012→2017). Event labels (Civil War, WWI, WWII) drop in. The y-axis rescales as the camera zooms into the recent years. |
| 23–27 s | **Paper document prop:** the "U.S. Federal Budget" sheet with the INTEREST row highlighted yellow. **Bar race:** a red interest bar grows past a black defense bar, with a fighter-jet cut-out and a money stack sitting on top. |
| 27.8–28.3 s | **Split-flap / odometer year counter** "BY 2038→2048", each digit flipping on a black tile, easing out to a stop. |
| 30–33 s | **Brush-stroke bar chart:** black ink bars with icons, and the red INTEREST bar slides to the top as **#1**. A yellow "BIGGEST BILL" stamp is added. |
| 34–37 s | **Cut to black:** an hourglass engraving, "We're **not** paying for the" + "FUTURE" **struck through**, then "We're paying for the **PAST**" (yellow block, ransom-style slam) and a red final counter. |
| 38–41 s | **Recap montage:** money stacks → "$40 TRILLION" → bill-scatter → "$117,000", replayed faster. |
| 42–46 s | **Outro:** the video shrinks into a browser/YouTube mock-up, with typed captions "You can easily use content like…", "Made with **Opus 5.5**" and the "social" word in colour. |

**Rhythm:** narration-driven, about 2.5–3 words/s. Audio sits around −15 to −20 dB RMS with almost no gaps, so voice and music run continuously.

---

## 3. `patio plants` (14.1 s, 736×414, 24 fps): surreal pop-art collage (horror/film-history theme)

Despite the filename, the content is a Hitchcock/*Psycho* collage edit.

**Look**
- **Light grid-paper** board (light grey with a darker grid). Some scenes switch to a **dark charcoal textured** background.
- **B&W photo cut-outs** with **red + yellow** accents: halved heads show a red interior with a yellow rim, and a red sun disc sits behind the house.
- Grey "sticks/rays" and floating props (knife, eye, mouth, shower head) surround the cut-outs.

**Editing and motion catalogue**

| Time | Technique |
|---|---|
| 0.0–0.5 s | **Exploding-head opener:** sliced head halves, mouths, knife and eye float and drift outward in a **slow 3D tilt/rotation** of the whole board, with parallax per layer. |
| 0.5–0.7 s | **Zoom-through match cut:** the camera dives into the small eye cut-out, which fills the frame as a **real macro eye**, then cuts. |
| 0.8–2.4 s | **Hero composite:** a house on a floating island over a red disc, with the BATES MOTEL sign. The board **rotates/skews in 3D** (perspective tilt) and settles; a subtle **rain/scratch overlay** runs on top. |
| 2.4–3.7 s | **Dark collage:** the director holds a clapperboard, flanked by **screaming mouths**, with concentric-circle sonar rings behind. Mouths **pulse in scale**. |
| 3.7–4.5 s | **Horizontal slice / glitch transition:** the frame breaks into horizontal bars that slide out of phase (a "venetian-blind" displacement wipe) and reveal the next shot. |
| 4.5–5.7 s | **Spiral/vortex tunnel:** a radial shower-head image, then concentric rings **iris open** to reveal a woman's face upside down, which **rotates upright** while zooming forward. |
| 5.5–6.6 s | A face on a dark board with a yellow glow behind; a hanging bulb and bird props **swing**. |
| 6.8–7.3 s | **Face-echo/clone trail transition:** the woman's face is duplicated into a horizontal row of repeated masks that **slide and collapse** into the next character's face. A red blob briefly covers the face. |
| 7.5–9.3 s | **Nested-frame zoom:** white rectangle outlines (frames inside frames) expand outward past the camera, like a corridor. Small caption text ("…be admitted to the theatre…") is pinned left. |
| 9.3–10.4 s | Live-action-style B&W shot: a knife silhouette, a light and a defocus blur. |
| 10.4–11.0 s | **Blur → face reveal:** the light blooms out of focus and a face emerges from the blur as a cut-out on grid paper. |
| 11–12 s | **Burst rays + split:** grey rays spray outward, the head **slices horizontally** into pieces that separate (a "head-explode" reveal of red insides), and the pieces fly toward the camera. |
| 12.5–14 s | **Loop:** it returns to the opening props and the house shot, so the clip loops seamlessly for Pinterest/shorts. |

**Rhythm:** the most aggressive edit of the set, with a cut or transformation every 0.4–1.2 s. Quieter audio (−25 to −30 dB) suggests a music/SFX bed and no VO.

---

## 4. `dessert table` (9.5 s, 736×414, 15 fps): creator promo, cinematic B&W + glow type

The person shown is a creator lookalike and is not related to desserts.

**Look**
- **Dark grey concrete wall** texture with a heavy vignette.
- A **B&W studio portrait cut-out** of a man in a black tee.
- Accents: a **cyan gradient pill** (a channel lower-third) and **glowing neon-green numbers**. A colour photo of a $100 bill sits against the monochrome.

**Editing and motion catalogue**

| Time | Technique |
|---|---|
| 0.0–0.4 s | **Rise-in:** the subject cut-out rises from below the frame edge with a whip-line streak. |
| 0.5–1.0 s | **Prop slide-in:** the $100 bill slides in from the top-left with motion blur. A **black disc grows** behind the subject (a circular "spotlight plate"). |
| 1–3 s | A slow **push and parallax** pan right: the bill, disc and subject move at different speeds. |
| 3.0–3.5 s | **Circle wipe-out:** the disc and bill exit to the right, leaving the subject on the plain wall. |
| 3.5–5.0 s | **Lower-third pill:** a dark pill grows horizontally with the logo, then **colour-fills cyan** left to right while the text appears. It drifts with the camera. |
| 5.0–5.5 s | **Light-down:** the wall darkens toward black (exposure ramp) and the pill fades. |
| 5.5–6.5 s | **Particle number assembly:** "$1,000,000,000" builds from **glowing green digits that fly in from random depths** (defocused → sharp, scale and position converge). The digits sit **behind the subject's head** (depth layering: text between the background and the cut-out). |
| 6.5–9.5 s | Hold with a slow push-in. The green glow flickers subtly. |

**Rhythm:** slower and cinematic, built on one hero subject. The audio jumps to about −7 dB at 5 s (a music drop/whoosh synced with the number reveal).

---

## 5. `mood captions` (15.5 s, 736×414, 30 fps): retro mid-century collage storytelling

The subject is the penicillin discovery (Fleming, 1928).

**Look**
- **Flat muted backgrounds** that change per scene: khaki `#D6CF8C`, then lime `#D8DC6E`, then deep red `#A11208`, then cream/sepia.
- **Sepia/B&W photo cut-outs** (skyline, vintage car, scientist, hands, test tube) with **flat geometric shapes** behind them: a teal semicircle, a triangle, a dark-red ring, a soft yellow glow disc.
- Typography: a **heavy rounded geometric sans** (Gilroy/Satoshi-like) in charcoal, dark red and orange. Labels sit on **yellow sticker boxes**.

**Editing and motion catalogue**

| Time | Technique |
|---|---|
| 0–2.4 s | **Horizontal tracking pan** across a skyline. A **car drives** across the ground strip; the teal sun disc and triangle move with parallax. The year "1928" **counts/types** in (1 → 1928). |
| 2.4–2.6 s | **Push-in:** the camera scales into the skyline (about 1.4×). |
| 2.5–3.3 s | **Circular photo inset** (a scientist in the lab) **scales up from a dot** with overshoot. A **yellow label box grows** from a small square to full width, then the text "Accidental Discovery" types in. |
| 3.3–3.6 s | **Whip-pan down/out:** the skyline slides down and away, leaving a plain background. |
| 3.4–4.0 s | **Object entrance:** a hand holding a red test tube **slides in from the left** and rotates into place. A second hand enters from the right, as if passing it. |
| 3.8–4.5 s | **Text mask reveal:** "Medicine" slides up and is partly **occluded by the tube** (depth layering). "Forever" appears in red below. A **glowing yellow circle** blooms behind. |
| 4.6 s | **Background colour cut** (khaki → lime) with a quick blank frame. |
| 4.6–5.4 s | **Zoom-from-tiny text:** "Scientist" scales from about 5 % to 100 % (a fast ease-out). The portrait **rises from the bottom** at the same time. |
| 5.5–6.0 s | A **dark-red ring scales in** behind the head (a halo). "Alexander" **slides in from the left** in orange and **colour-shifts to dark red**; "Fleming" fades in on the right in orange. Words tuck **behind** the head. |
| 7.4–7.6 s | **Diagonal shape wipe:** a red rounded shape sweeps up from the bottom-right and fills the frame. |
| 7.6–8.0 s | **Camera move** on the new layout: a red panel on the left, a sepia lab photo on the right (split layout). |
| 8.5–9.7 s | **Word-by-word stacked caption:** "He" → "noticed" (small, white) → "**Something**" (yellow, bigger) → "**Strange**" (white, biggest). Each word slides up and fades in, and scale increases with importance. |
| 10–15.5 s | **Macro petri dish** (3D-ish render): a slow orbit/rotation. **Callout labels** "Bacteria" and "Mold" appear with **leader lines that draw on**, and the yellow label boxes grow from the line end. A slow pull-back ends the clip. |

**Rhythm:** smooth, eased motion (not stepped), with one idea per 2–3 s and a very tight word-to-VO sync. Audio is steady at about −20 to −25 dB (VO + bed).

---

## 6. Technique index (reusable in Remotion)

| # | Technique | Seen in | Remotion approach |
|---|---|---|---|
| 1 | Pop/overshoot entrance | all | `spring({damping: 12})` or `interpolate` 1.1→1 with `Easing.out(Easing.back)` |
| 2 | Stepped "on twos" motion + boil | skill, V1 | `Math.floor(frame/2)*2`, `random(key+step)` offsets |
| 3 | Rolling number counter | V1 (ppm, ticker, $117k) | `Math.round(interpolate(...))` + `toLocaleString()` |
| 4 | Split-flap/odometer digits | V1 (2038→2048) | per-digit vertical translate in an overflow-hidden tile |
| 5 | Torn-paper slide transition | skill, V1 | `@remotion/transitions` `slide()` + torn `clip-path` polygon |
| 6 | Line-chart draw-on | V1, skill | `@remotion/paths` `evolvePath()` on SVG path |
| 7 | Tip-riding label on chart | V1 | `getPointAtLength()` from `@remotion/paths` |
| 8 | Staggered grid drop-in | V1 (stacks, icons) | `Sequence` / delay = `i*2` frames |
| 9 | Particle scatter (bills → icons) | V1 | per-particle seeded `random()` paths, interpolate from source to target |
| 10 | Highlighter swipe under word | V1, skill | a `scaleX` 0→1 yellow div behind the word, origin left |
| 11 | Word-by-word caption, size hierarchy | V1, V4 | split words, each in a `Sequence` at its VO timestamp |
| 12 | Strikethrough reveal | V1 (FUTURE) | red line `scaleX` over the text |
| 13 | Blur dissolve / defocus reveal | V1, V2, V3 | `filter: blur()` interpolated + opacity |
| 14 | Horizontal slice glitch transition | V2 | N strips, each `translateX` with a random offset/delay |
| 15 | Zoom-through match cut | V2 (eye) | scale a layer 1→20 with ease-in, cut on the peak |
| 16 | Clone-trail / echo faces | V2 | the same image repeated with staggered `translateX` and opacity |
| 17 | Nested frame tunnel | V2 | several outlined rects scaling outward with an offset phase |
| 18 | Iris/vortex reveal | V2 | `clip-path: circle()` growing + rotation |
| 19 | Head-split / slice explode | V2 | an image clipped into bands, each translating/rotating apart |
| 20 | 3D board tilt + parallax | V2, V4 | `perspective` + `rotateX/Y` on the container, depth-scaled layers |
| 21 | Shape plate behind subject (disc, ring, glow) | V2, V3, V4 | an SVG circle `scale` 0→1 with spring, placed behind the cut-out |
| 22 | Text behind subject (depth sandwich) | V3, V4 | z-order: background → text → cut-out PNG |
| 23 | Glowing digit assembly | V3 | per-character random z-start, blur→0, `text-shadow` glow |
| 24 | Lower-third pill fill | V3 | width spring + a gradient `background-size` wipe |
| 25 | Diagonal colour-shape wipe | V4 | a rotated rounded rect translating across the frame |
| 26 | Callout with leader line | V4, skill | SVG line `strokeDashoffset` draw, then a label box `scaleX` |
| 27 | Tracking pan + vehicle cross | V4 | container `translateX` + a separate layer moving faster |
| 28 | Persistent HUD ticker | V1 | a component outside the scene `Sequence`s, frame-driven value |
| 29 | Paper grain / vignette / specks overlay | all | a top `AbsoluteFill` with a noise texture (`@remotion/noise`) + radial gradient |
| 30 | Seamless loop ending | V2 | the last scene matches the first frame |

---

## 7. Style families, side by side

| | V1 Data editorial | V2 Surreal pop collage | V3 Cinematic creator | V4 Retro mid-century | Skill (Vox collage) |
|---|---|---|---|---|---|
| Background | warm paper + vignette | grid paper / charcoal | dark concrete | flat khaki/lime/red | warm-white board |
| Accent | red + yellow | red + yellow | neon green + cyan | teal, dark red, yellow | yellow only |
| Type | italic serif + condensed sans | minimal | rounded sans glow | heavy geometric sans | Caslon + marker + typewriter |
| Motion feel | snappy, stepped pops | aggressive, 3D, glitchy | smooth, cinematic | smooth eased, parallax | stop-motion on twos |
| Cut rate | ~1.5–3 s | ~0.5–1 s | ~3 s | ~2–3 s | ~2.5 s per beat |
| Signature move | live counters + charts | slice/explode heads | glowing number behind subject | text-behind-subject + label boxes | brush notes + ransom word |

## 8. Notes for production
- The current repo already has `@remotion/paths`, `shapes`, `transitions`, `noise` and `motion-blur` installed, which covers almost every technique above.
- V2, V3 and V4 use real people (film stills, a known creator, a historical scientist). For original videos, use generated or fictional people, or public-domain archival photos, and avoid copyrighted film frames and logos.
- The skill's engine targets 1920×1080. The Pinterest references are 16:9 at 736×414, so the same compositions work at 1080p. A 9:16 variant would need relaid layouts.
