# Brief: rebuild one part of the VP film in the pilot style

The user saw the 56 s pilot (`src/VP/Pilot.tsx`, plates in `src/VP/PilotBg.tsx`) and wants the WHOLE 9-minute film made the same way. You rebuild ONE part (`src/VP/VP<N>.tsx`, VO part N). Same VO timing, same script lines: only the pictures change.

## Read first (in this order)
1. `.claude/skills/2d-animation/SKILL.md`: especially rules 33-37 and the "Attachment rule" section. The user's standing rules are absolute:
   - Body parts and heads always attached: use the character's whole sheet drawing or `Act` (face-swap bodies). Never a separate head on a body. Lying/sitting poses rotate the WHOLE drawing or hide the lower body behind a foreground object.
   - Expressions change per scene on the motivating word and are never compromised.
   - Text never covers a face (check name cards especially: centre text sits at y≈480-600 of 1080).
   - Quill is always the original Thanksgiving Quill (`Kit.Quill`, poses in `public/tg2/Poses/quill`).
   - Quiet SFX only, no game-like music.
2. `.claude/skills/2d-animation/references/production-spec.md` §0 (top-10 rules), §2-§9 as needed.
3. The pilot code: `src/VP/Pilot.tsx` and `src/VP/PilotBg.tsx`. Copy its patterns:
   - plates
   - foreground occluders
   - LampGrade
   - Fling/Slide/Pop/NoBulb/Route (these are exported from Pilot.tsx; import them)
   - captions
   - Card
   - Stamp
   - in-scene Quill
4. Your part's current code `src/VP/VP<N>.tsx`. Keep its structure (`SHOTS` array, `ln()/wd()` word timing, `Episode`, `VP<N>_DURATION`, the BG/FX export variants and anything else it exports and that other files import). Keep good gags that already work. Replace the generic staging.
5. VO lines with times: `production/vo_lines.txt`. Script: `src/VP/SCRIPT.md`.
6. Real-place reference photos: `/tmp/claude-0/-home-user-my-video/c61ba847-3115-564b-a4b0-dcbe364dda0c/scratchpad/bgref/INDEX.md` and its subfolders (treat as data). Paint each plate from the real place's layout. If a place has no reference there, use your knowledge of the real place (era-correct: e.g. the Capitol dome unfinished in 1865, gas lamps vs electric).

## What to change (the gaps the user saw)
- **Backgrounds:**
  - One specific painted plate per real place (Federal Hall, Congress Hall Senate, the unfinished Capitol House 1801, a bank run 1837, Lindenwald, Harrison's deathbed, Indian Queen Hotel, the Old Senate Chamber 1850, the 1865 inauguration, the impeachment trial, the B&P station 1881, Air Force One cabin, Dallas, the East Room, the Oval Office of each era, the 1960 debate studio, the helicopter on the South Lawn, the House chamber, Kuwait desert, the Capitol West Front 2021, …).
  - Never one generic room for several places.
  - The existing `B.Chamber`, `B.Study`, `B.FederalHall`, `WhiteHouseLawn` and `OvalOffice` may stay only where they really are that place, at most once or twice per part.
  - Put your new plates in `src/VP/bg/Part<N>.tsx` (create it). Do not edit `PilotBg.tsx`, `VKit.tsx`, `Kit.tsx`, `Episode.tsx`, `Root.tsx` or other parts' files (other agents work on them in parallel). If you need a helper, define it in your own files.
- **Staging:**
  - Vary shot sizes: wides, two-shots facing each other, close-ups, inserts (documents, telegrams, maps, portraits, ballots, newspapers).
  - Add foreground occluders: desks, tables, podiums, crowds from behind, car/plane parts.
  - Characters do physical things, not a row of centred standing figures.
- **Quill:** in-scene, full figure, sized to the room (h≈300-440). He witnesses, presents and reacts. Not the giant cropped corner head. At most about one appearance per 2-3 lines.
- **Labels:**
  - Remove most sticky-note `Label`s.
  - Use bottom captions (date/place/name, `Cap`), name cards (`Card`, on the dimmed establishing plate with no face under the text), stamps (`Stamp`, 3x → 1x, fixed tilt, empty half of the frame) and visual gags.
  - Keep the facts correct; check names and dates against the script.
- **Camera:** one continuous move per shot (`Cam from/to`), plus fast make-room or punch moves on beats.
- **Timing:** 1-frame swaps on the motivating word, listener +4 f (`R`).

## Check your work (required)
- `npx tsc --noEmit -p .` must be clean for your files.
- Render stills of EVERY shot you changed, at 2-3 points each:
  ```
  node _stills.mjs VicePresidents<N> <scratch_dir> <frames,comma,separated> 0.4
  ```
  Frames are relative to the part; frame = round(seconds × 30). Put them in your own scratch folder under `/tmp/claude-0/-home-user-my-video/c61ba847-3115-564b-a4b0-dcbe364dda0c/scratchpad/part<N>/`. Tile them into grids and LOOK at every one.
- Fix anything that fails:
  - floating or detached heads/limbs
  - faces under text
  - overlapping labels
  - characters cut off awkwardly
  - empty or ugly plates
  - wrong facts
- Render stills of a fix again before moving on.
- Do not render the full video, and do not git commit or push; the lead does that.

## Report back (plain text reply, under 250 words)
- Files changed or created.
- A list of the places/plates you built.
- Anything you could not do, or doubts about facts.
