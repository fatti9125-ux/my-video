# Character Style Guide (house style for our videos)

Derived from the user's model sheets in `public/characters/sheets/`:
`gerald-ford.webp`, `richard-nixon.webp`, `henry-kissinger.webp`, `courtroom-1973.webp` (ensemble), `quill-owl.webp` (narrator mascot).
**User-supplied sheets are canon.** Cut and rig them; never redraw a character the user has already provided.

## 1. Overall look
- **Caricature, not generic.** The bodies are simple cartoon shapes, but the **faces are likeness caricatures** of real people. Recognition comes from the face, hair, glasses and suit colours.
- **Ink:** a hand-inked black outline with slight thickness variation and a gentle wobble, like a marker.
  - Outer contour ≈ 6–7 px on a 380 px-tall figure (≈1.7% of height).
  - Inner detail lines (wrinkles, lapels, ear curls) are thinner, ≈ 3–4 px.
  - Line ends are rounded.
- **Colour:** flat fills plus **one soft shade tone** on the far side of faces, hair and suits.
  - Forehead lines and folds are drawn in a slightly darker skin tone, not black.
  - There are no hard highlights, and the colours are not neon.
- **Background of sheets:** transparent, so parts can be cut directly.

## 2. Proportions (front pose, ~380 px tall)
| Part | Share of height | Notes |
|---|---|---|
| Head | **45–50%** | Wider than the torso. The chin overlaps the shirt collar, so there is **no neck**. |
| Torso | ~32% | A bell or trapezoid suit shape, wider at the hem, with a square bottom edge. |
| Legs | ~22% | Two straight stick strokes about 58 px apart. |
| Feet | — | Small L-strokes pointing outward. |

Arms are single strokes split into upper arm and forearm. They emerge from the torso sides just under the collar. The default stance is **hands on hips** (elbows out) or arms hanging.

## 3. Faces: the likeness system
Every head uses the same template:
- skin #F5C38F–#F2BE8A
- big C-shaped ears with an inner curl
- small bead eyes
- thick dark brows that carry the emotion
- a strong, characteristic **nose**
- a mouth line with smile or jowl folds
- light forehead wrinkles

Likeness comes from 4–6 **likeness keys** per person, exaggerated 20–40%:

| Character | Likeness keys |
|---|---|
| Gerald Ford | Bald dome with a brown/grey side fringe; broad rounded "J" nose; wide friendly smile with deep smile folds; big ears; heavy brows; slate-blue suit, red striped tie |
| Richard Nixon | Dark slicked-back hair with a widow's peak; **ski-jump bulb nose**; heavy jowls and five-o'clock shadow; furrowed brows; navy suit, blue tie |
| Henry Kissinger | Dense curly dark-grey hair; **thick black rectangular glasses**; heavy-lidded eyes; broad nose; downturned mouth; dark brown/black suit, olive tie |
| Federal judge | Bald with white side tufts; wire glasses; long gaunt face; black robe; gavel |
| Prosecutor | Young, brown side-parted hair; determined brows; navy suit, red tie; files and paper |
| Defense lawyer A | Balding grey; black glasses; worried brows; charcoal suit, maroon tie; open book |
| Defense lawyer B | Black hair; **thick black moustache**; brown suit, navy tie; briefcase; whispers behind a hand |
| Investigator | Dark skin; short black hair; steady serious look; olive suit, black tie; notepad and pen |
| Contractor | Sandy side-swept hair; nervous look; tan suit, mustard tie; rolled blueprints and envelope (bribe) |

**Expressions on the sheets:**
- Main characters: Neutral, Speaking (open mouth), Reaction or Surprised (round "o" mouth, raised brows). Ensemble characters get two heads each.
- For talking, alternate **Neutral ↔ Speaking every 4–6 frames**, as an instant head swap with no tween. Use Reaction on beats.

## 4. Hands, feet and props
- **Hands** are 3–5 ink strokes, not mitts:
  - `relaxed`: fingers down
  - `open`: fan, drawn fingers-up on the Ford sheet
  - `point`
  - `grip`: curl, for holding props
- **Feet** are small L-strokes.
- **Props** (envelopes, papers marked with a name, books, briefcases, gavel, notepad, pocket watch, name dominoes) are drawn in the same ink and shade style. They should be layered **in front of the torso**, held by a `grip` hand.

## 5. Sheet layout convention (what the user sends)
**Single-character sheet:**
- Title "NAME • YEARS" plus the role.
- Row 1: **Front / 3/4 / Profile** turnaround, then **Neutral / Speaking / Reaction** heads, **Front torso / 3/4 torso**, arm segments (L/R upper and forearm), 4 hand shapes, thigh and shin strokes, feet.
- Row 2: three **story poses** (for example Nominated / VP Oath / President). Use them as full-body pose swaps for key beats.
- Props row.

**Ensemble sheet:**
- A labelled header chip per character, two full poses per character, and two expression heads each.
- A shared props row, plus loose limb strokes.

## 6. Narrator mascot: Quill the owl (original, the user's character)
- **Body and face:** an egg-shaped brown body with a cream **heart-shaped face disk** and a centre seam line.
- **Head details:** round wire **glasses**; half-lidded, sceptical eyes with flat brows (separate brow parts); a small orange beak, with closed and open parts for lip-sync.
- **Clothing:** a **green waistcoat** with buttons and a pocket holding a note.
- **Limbs:** wings work as hands (rest and open, left and right). He has a small tail and bird legs with 3-toe feet.
- **Personality:** dry, knowing, a little suspicious, like a detective-narrator.
- **Signature beats:**
  - Open envelope, then peek, then close it (a reveal).
  - Hand to camera.
  - Checking the pocket watch (time pressure).
  - **Cliffhanger** (raised wing finger).
- **Motif:** name **dominoes** (AGNEW → NIXON → FORD) show the chain of succession; topple them for transitions.
- Quill is the stand-in for the analysed video's on-screen host: he appears in most segments, reacts, and presents captions and props.

## 7. How these combine with the explainer style
- **Text styles:** keep the explainer video grammar from `explainer-style-guide.md`: darkened name cards, Montserrat ExtraBold captions, grunge "LAST" stamps, a slow push on every shot, painted backgrounds, a mono VO-first mix.
  - The sheets' hand-lettered marker caps are for sheet labels only.
  - Use comic lettering on screen only if the user asks.
- **Scale:** keep the characters' on-screen scale consistent, because all sheets are drawn at the same ~380 px front-pose height. Use the same `scale` for everyone in a shot unless it's a deliberate close-up.
- **Story context of this set (1973–74):**
  1. Agnew's bribery case: the courtroom, contractor envelopes.
  2. Agnew's resignation letter is delivered to Secretary of State Kissinger.
  3. Nixon nominates Ford under the 25th Amendment.
  4. Ford takes the VP oath.
  5. Nixon resigns, and Ford becomes president.
