# Image prompts that cut out cleanly

The collage needs pictures that look archival and **separate cleanly from their background**. A plain, even backdrop is what makes the cut-out work, both with Apple Vision on macOS and with the colour-key fallback elsewhere. Use 16:9 at about 1280×720 or larger, and one generation per image unless the user wants options.

Always end prompts with: `No text, no letters, no numbers, no watermark, no border.` Generated lettering comes out garbled, and all text in the video is set by the engine.

## Photo: people, hands, objects in use (`--kind photo`)

```
Authentic 1950s black-and-white documentary photograph. A middle-aged man in a plain white
button-up shirt and dark tie, waist-up, facing camera, <ACTION, e.g. wiggling the fingers of his
own right hand against his own ribs>. His face is <EXPRESSION, e.g. completely deadpan>.
Plain light grey studio backdrop. Silver gelatin print, strong film grain, slightly faded
contrast, soft studio light. Landscape framing with the subject centred. No text, no letters,
no watermark, no border.
```

- Waist-up and cropped by the bottom edge is good: the engine anchors such cut-outs to the bottom of the frame.
- Keep the whole head and both hands inside the frame. Leave space around the subject.
- **Same person in two beats** (the hook and the payoff): generate the first photo, then generate the second *with the first as a reference image* (ElevenLabs: `creative_attach_reference_file` with the first image's URL on the same flow, then `creative_generate_image` with `connect_from`). Use a prompt like "Same man, same shirt and tie, same grey studio backdrop and same 1950s photo style. Now <new action/expression>." This costs more (~430 credits) but the continuity sells the story.
- Hands or objects entering from a frame edge (someone else tickling him) are fine in a `closer`, where the right edge goes under the beige sheet.
- Swap the era or people freely (a 1960s scientist at a bench, a 1970s family at a table) but keep it black-and-white, studio-plain and documentary.

## Engraving: the "how it works inside" picture (`--kind engraving`)

```
19th-century anatomical copperplate engraving of <SUBJECT, e.g. a human brain in exact lateral
side view, front facing left>. <WHAT MUST BE VISIBLE, e.g. the ribbed cerebellum clearly visible at
the lower back right, with the brainstem descending below it>. Fine black ink line work with dense
cross-hatching, printed on aged cream paper, the subject isolated in the middle of the sheet with
generous empty margins. Scientific textbook plate style. No text, no labels, no letters, no
numbers, no leader lines, no border.
```

- This works for anatomy, machines ("cutaway engraving of a steam engine"), plants, animals, maps ("antique engraved map of …" — keep the land shapes and drop the labels), buildings and tools.
- Name the parts you will point at so they are clearly drawn and easy to locate on the grid.
- Generous margins plus plain paper give a clean key. If the cut-out swallows paper or drops thin parts, adjust `--tol` (lower keeps more paper; higher keeps less).

## Props sheet: 2–3 small decorative objects (`--kind props`)

```
Three separate vintage objects photographed in black and white, laid out far apart from each other
on a plain flat pure white background, nothing touching, generous white space around each: on the
left <OBJECT 1>; in the middle <OBJECT 2>; on the right <OBJECT 3>. Old halftone newspaper print
look, high contrast, film grain. No text, no letters, no numbers, no shadows touching each other.
```

- Pick objects that echo the topic (feather and stopwatch for tickling; magnifier, test tube, compass, old radio, coin, key, light bulb, globe...). An engraved scientific illustration of one small thing (a neuron, a cell, a gear) also works as a prop.
- Name them left to right in `--names feather,stopwatch,neuron`.

## Checking a cut-out

After `VOX cutout`, open `<project>/public/img/<name>.png`. You want a clean silhouette with a thin white edge and no background left over. If it's wrong:
- background left over → regenerate with a plainer backdrop, or for engravings raise `--tol`;
- parts missing → for engravings lower `--tol`; for photos make sure the subject contrasts with the backdrop;
- a cut-out that is too big or small doesn't matter, because the layout scales it. `--height` only sets the resolution.

## Prompts for the other styles

The cut-out rules are the same for every style: a plain, even backdrop, no text, and a clear silhouette. Only the look of the picture changes. See `styles.md` for the cut-out flags.

**editorial**: clean illustrated objects in colour, like stickers in a newspaper graphic.
```
Flat editorial illustration of <OBJECT, e.g. a tall stack of green US-style banknotes>, slightly textured gouache
style, soft shadow, isolated on a plain white background with generous margins. No text, no letters, no numbers,
no watermark, no border.
```
Also generate a B&W photo or engraving of a building or object (`--kind engraving`) for icons such as a capitol dome or a factory.

**popart**: high-contrast B&W photos of faces, eyes, mouths and hands, ready to be sliced.
```
High-contrast black-and-white 1960s studio photograph of <SUBJECT, e.g. a man's head and face, front view, wearing
thick black-framed glasses, slight smirk>, plain light grey backdrop, hard light, film grain, the whole head inside
the frame with space around it. No text, no letters, no watermark, no border.
```
For a `burst` beat, frame the head alone (no shoulders), so the bands read as slices of the head.

**cinematic**: a moody B&W portrait, waist-up, dark grey studio wall.
```
Cinematic black-and-white studio portrait of <PERSON, fictional>, waist-up, hands in pockets, looking slightly off
camera, plain mid-grey concrete wall behind, soft top light, high dynamic range. No text, no logos, no watermark.
```

**retro**: sepia or B&W mid-century photos, plus wide skyline and street scenes for `pan`.
```
Vintage 1920s black-and-white photograph of <SUBJECT, e.g. a city skyline of stone skyscrapers, seen straight on
from street level>, isolated against a plain pale sky, crisp edges, no people. Wide panoramic framing.
No text, no letters, no watermark, no border.
```
Use separate images for a vehicle (side view, plain backdrop) and for hands holding an object (cut from the wrist).
Never generate a real, identifiable person. For a historical figure, use a genuine public-domain photo (ask before downloading).
