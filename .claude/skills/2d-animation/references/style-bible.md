# Style Bible: measured frame by frame from the 18 reference clips

Source: 18 clips cut from "Every Presidential Last Explained" (8.5 min total, 426×240, 30 fps):
- Clips 01–13: Washington, Adams & Jefferson, Jackson, Van Buren, Fillmore & Pierce, Lincoln, Cleveland, T. Roosevelt, Coolidge, FDR, Nixon, Bush, Clinton.
- Five 15 s cuts: tarring and feathering, Washington's march, Adams' kick, Jefferson's intro, Monroe.

**Method**
- Contact sheets at 4 fps for every second of every clip.
- 30 fps frame strips with per-frame pixel change (YDIF: 0 = held frame) for about 40 key moments.
- Audio measured per beat: band levels, loudness, stereo width.
- Raw per-clip notes are in `clip-notes.md`.

**Limits**
- The clips are 240p, so line weights and small text are estimates.
- The audio was measured, not listened to. Sound-effect types are inferred from their spectra.

**How to use this file:** every section is a recipe with frame counts. When a scene needs, say, a kick, a fire or a map zoom, open that section and build exactly that. Frame numbers are at 30 fps.

---

## 1. Global rules (apply to every shot)

| Rule | Measured evidence |
|---|---|
| Everything moves on 1s (a new image every frame), except fire FX, which is on 2s | per-frame change is never 0 inside a shot; fire alternates high/low (18, 5, 16, 3…) |
| Every shot drifts: slow push-in or pan, about 3–6% over the shot | constant per-frame change of 1–2.5 on held shots |
| Expressions, mouths and poses change by 1-frame swaps, never by in-betweens | e.g. Washington smug → worried in 1 frame; Roosevelt lying → standing in 1 frame |
| Violent or fast actions are not animated; they are an FX smear plus a swap to the result pose | kick = 6-frame red smear, then a fallen pose |
| Comedy is deadpan: victims and bystanders often do not react | feathered tax collector, the bodyguard walking on, the wife reading on |
| Average shot about 4 s; gag beats 1–2 s; maps and archives 5–8 s | cut lists of all 18 clips |
| One fact on screen at a time | captions swap rather than stack |

## 2. Characters: acting and expression

### 2.1 Talking
- The mouth is a whole-head or mouth swap: **open ↔ closed, each held 3–5 frames** (measured run: 3, 4, 5, 4, 3…). The mouth stays closed in pauses.
- Use **2 closed variants**, a smile line and a neutral line, so long talks don't look looped (Nixon on the phone).
- **Brows are locked** while talking; only the mouth changes.
- Talkers raise one or both arms out and open; the other arm often sits on the hip. Arms make small adjustments.
- **Only the speaker's mouth moves.** Listeners hold, and change expression only on story beats.
- Proclaiming gets eyes closed with the head tilted up (Jefferson, 1804). Excited talking gets arms wide and a big open mouth, in a spotlight (Adams, 1796).
- **Talking through a prop:** a phone held at the ear (Nixon, Armstrong) or a paper held in both hands (reading). Props stay in the hand and shake slightly.

### 2.2 Expression vocabulary (all 1-frame swaps)
| Emotion | Drawing |
|---|---|
| Smug | Brows down-in, half smile, half-lidded eyes |
| Worried | Brows raised and slanted, flat mouth, **light-blue sweat drop** at the temple |
| Panic or strain | Many sweat drops, wide eyes, clenched teeth showing (Bush in the burning cockpit) |
| Angry | Thick brows in a V, open shouting mouth (black with red tongue); **red anger-vein cross** on the temple or back of the head |
| Shocked | Huge round white eyes with tiny pupils; mouth a tiny line or an "O" |
| Sad or crying | Brows up, mouth down; **light-blue tear drops or streaks** under the eyes |
| Maniacal laugh | Wide eyes, huge open grin with teeth (the officer ripping the paper) |
| Taunting | Tongue out, hands at the ears (Burr) |
| Drunk or flustered | **Pink blush ovals** on the cheeks, half-lidded eyes |
| Dead | **"X X" eyes** plus a white spirit spike shooting out of the body (4 frames) |
| Confused | **Red "?" marks** popping in at both sides of the head and staying; eyes squint |
| Sulking or excluded | **The whole character tinted grey-purple** (desaturated) while others stay in colour; 1-frame swap |
| Asleep | Eyes closed, tiny breathing bob |

- **Reaction timing:** a character reacts **about 4 frames after** the event (stamp landing, a reveal) with a 1-frame expression swap, then holds it.

### 2.3 Walking and marching
- **Stride about 16 frames per step pair.** Stick legs scissor, the body **bobs 2–3% of its height** each step, arms swing opposite to the legs, and the head tilts slightly.
- Faces stay neutral or determined with eyes ahead, and **no lip movement while walking**.
- **Tracking walk:** characters stay roughly in place on screen while the **background scrolls** behind them (constant per-frame change of 3.5–5.7). Crowds walk in **2–3 depth rows**, with large foreground figures and smaller ones behind.
- **Walk-in entrance:** a full walk cycle from the frame edge to the mark in about 14 frames (the waiter), with the camera starting its push at the same time.
- **Sleepy walk:** slower, eyes half-closed, about 1.5 s across.
- **Horse riding:** the horse's legs cycle in place while the background scrolls, and the rider bobs with the horse.

### 2.4 War and battle
- **Armies are grids of one duplicated sprite** (5 × 10 columns, for example) on a painted field. Top-down or high-angle views show the formation.
- **Charges:** a close tracking shot of the hero among soldiers, a musket with bayonet held forward. Then a 9-frame eased camera pull-back reveals the field.
- **Cannon and musket fire:** a red jagged muzzle-blast shape for 2–3 frames.
- **Bullet impacts in the grass:** red jagged splats popping at random spots for 2–4 frames each, every 4–8 frames.
- **Being shot:** a red spiky splat burst on the body for 4–5 frames, then the character is removed or swapped to the fallen pose. A white speed-line wedge burst follows for 4 frames.
- **Under fire but defiant:** stands tall, arms akimbo, shouting; does not flinch. Then **ducks**: 3 frames of white speed lines, then held crouching behind cover with only the hat and eyes showing.
- **Diving or getting hit:** a 1-frame swap to lying face-down, rotated 90°, with **legs kicking every frame**.
- **The hero stays calm** while explosions happen behind (the eagle in sunglasses walking away from fire).

### 2.5 Falls, hits and slapstick
- **Kick or punch:** the limb is replaced by a **red curved crescent smear for about 6 frames**. The victim swaps to a shocked face on the first smear frame. Then a **1-frame swap to the fallen pose**.
- **Fallen pose:** face-down or on the back, **legs flailing every frame**, wig or hat as a separate blob on the floor. Hold for the rest of the shot (the stamp often lands during this hold).
- **Get-up:** a 1-frame swap from lying to standing. Never animate it.
- **Grab or abduction:** grabbers slide in from both edges in about 6 frames, stick arms stretch to the victim, the victim swaps to a scream, then everyone is yanked off-frame in 3–4 frames.
- **Projectiles at a character** (tar, feathers): a grey puff flies in over 2 frames, then a 1-frame swap to a "more messed-up" state of the character. Repeat 2–3 times with increasing mess, while the victim stays deadpan.
- **Paper ripping:** a torn zigzag edge, with the two halves pulled apart.

### 2.6 Entrances and exits
| Move | Frames | Notes |
|---|---|---|
| Slide in from the edge | 3–8, eased out | A head can slide up from the bottom in 3 frames; full figures take 6–8 |
| Pop up from the bottom foreground | 9, eased | Profile, half-lidded eyes; the eagle in the Blue Room |
| Peek | Head only, in a corner or from behind furniture | Holds; may blink |
| Fade out | About 30 frames | The character "leaves" (Washington leaving the army) |
| Dive or hide | 2–3 frames with speed lines | Hides behind something |
| Vehicle crash-in | About 8 frames of white speed-streak wedges | Then the vehicle is parked |
| Yanked off-frame | 3–4 frames | |

### 2.7 Camera
- **Ambient:** slow constant push or pan on every shot.
- **Emphasis push-in:** 4–12 frames, eased, from wide to close-up, landing exactly on the gag. Examples: the fallen Adams, the dead Harding.
- **Reveal pan:** about 36 frames (1.2 s), decelerating, revealing a new character.
- **Pull-back reveal:** about 9 frames, eased, showing that the hero is in a big battle or field.
- **Big zoom-out:** about 1 s, from a character to a tiny army in a landscape.
- **Re-frame:** about 5 frames, to a tighter close-up just before a stamp lands.
- **Close-ups:** talking and reacting beats are often extreme close-ups, with the face filling the frame.

## 3. "Flappy" (the eagle mascot), which our Quill becomes

In the reference, Flappy is in almost every scene, but he is **the audience's stand-in, not the speaker**. His beak is closed nearly all the time. He reacts, presents and gets into situations. Use **Quill exactly this way in story scenes**. Quill only lip-syncs when he is narrating to camera in the studio.

| Role | How Flappy does it (copy for Quill) | Clip |
|---|---|---|
| Reactor pop-in | Small, pops in at the bottom-left corner of a close-up, reacts, stays | 01 |
| Worried bystander | Hand on chin, sweat drop, looking off | 02, 08, 11 |
| Peeker | Head only, rising from behind a desk or poking in at a frame corner | 02, 08 |
| Presenter | **Glasses plus a long pointer stick** beside a whiteboard or easel; the pointer follows a chart as it draws on | 03, 08 |
| Lab or diagram presenter | Pointing at a cutaway diagram | 08 |
| Confused foreigner gag | Red "?" marks at both sides of the head while someone talks in another language (typewriter bubble) | 04 |
| Embedded in history | Stands among soldiers, crowds, wedding guests and parlours like he belongs there | 03, 05, 09 |
| Supportive friend | Hand on a president's shoulder | 10 |
| Deadpan companion | Walks along with the group, unaware of chaos | 08 |
| Partying | Drunk, pink blush, at a table covered in bottles | 07 |
| Formal | Saluting beside the desk | 13 |
| Skeptic | Foreground profile, half-lidded eyes, side-eye at the president | 07, 13 |
| Cool guy | **Sunglasses**, unbothered in front of an explosion | cut 0 |
| Back to camera | Foreground, turning his head to look | 09 |
| Talking to a president | Side by side at the bottom-left of a graphic backdrop, the president listening | 13 |

**Flappy's acting rules (Quill's in story scenes)**
- **Size:** smaller than the presidents (about 70–80% of their height), often cropped by the frame edge (bottom-left foreground is his favourite spot).
- **Expressions** swap on beats like everyone else's. **Sweat drop and side-eye are his signatures.**
- **Never steals focus:** small idle only, no gestures, unless he's presenting.
- **Props he uses:** pointer stick, glasses, sunglasses, chart.

## 4. Text and typography

| Element | Spec |
|---|---|
| Font | Montserrat ExtraBold or Gotham-Black style, ALL CAPS, white |
| Caption style | White with a **thin black outline** and a soft dark drop shadow; about 7–8% of frame height |
| Position | **Dates and places:** bottom-centre. **Years and section facts:** top-centre or bottom-centre. Never both at once |
| Animation | **Hard cut on, hard cut off** (no pop or fade); swapped in place to the next fact ("DECEMBER 30, 1853" → "GADSDEN PURCHASE"). Held 1.5–4 s |
| Details | Superscript ordinals ("12TH"); two-line captions stack centred (crew names) |
| Name card | The current shot **darkened about 70%**, the name centred in white caps (no outline, soft shadow), held 1–2 s (30–60 frames), then a **hard cut** back to full brightness on the same shot |
| Graphic labels (timelines) | White ExtraBold, **no outline** on dark plates |
| Speech bubble | White ellipse with an outline and a tail to the speaker; **scales 0 → 1 in about 4 frames**; text **types on letter by letter at about 15 characters/second** in a plain black sans |
| Shout bubble | **Spiky jagged white bubble**, scales up from a point over about 6 frames, bold black text ("Get down, you fool") |
| Signs in the world | Hand-lettered cursive on painted signs ("The WHIG PARTY"); real labels ("USS FINBACK" as a caption) |
| Parody UI | RPG battle box: rounded blue box, gold border, **white pixel/monospace font typing on letter by letter**, a ▶ cursor moving through "FIGHT / BAG / SWITCH / RUN", light-yellow HP plates with green bars |

## 5. The "LAST" stamp (signature graphic)

| Phase | Spec |
|---|---|
| Frame 0 | **Huge: about 3× final size**, text overflowing the frame, roughly centred |
| Frames 1–5 (sometimes 6) | Scales down and slides to its corner, **decelerating** (ease-out). No bounce |
| Settled | Top-left (most often), top-right, top-centre or lower-right; rotated **−3° to −15°** (occasionally +15°) |
| Lines | 3–4 lines of condensed caps inside a rectangular border |
| Background | Usually **darkens about 40%** over 6–8 frames after landing, and stays dark (dark or neutral scenes). Light scenes may **desaturate or wash out** instead, or do nothing |
| Character | Re-framed to a close-up just before landing. **Reacts about 4 frames after landing** (sweat, worried brows, eyes closed) |
| Hold | 2–5 s; continues across the next action if the narration continues |
| Exit | Hard cut with the shot, or a **fade out over 4–6 frames** before the next beat (the background brightens back) |
| Sound | **Sub-bass thump on the landing frame** (+6 to +24 dB at 30–150 Hz) |

**Stamp ink variants**
| Variant | When |
|---|---|
| **Red ink, red border, no box** (see-through grunge ink) | Light, bright scenes |
| **White ink, white border, translucent dark-grey box** | Dark or busy scenes (the most common) |
| **White ink and border, translucent white box** | Warm or mid scenes |
| **Red ink, translucent pinkish-white box** | Bright exteriors |

## 6. Motion graphics (GFX)

### 6.1 Maps
- **Water:** **textured, mottled bright blue**, cloudy and painted, never flat.
- **Land:**
  - Beige (#e6d9b0), or light grey-tones per state, or green for the modern US.
  - Thin dark internal borders and a thick outer outline.
  - **White offset coastline rings** (contour lines around coasts and islands).
- **Highlight:** the target region **filled red**. Or a **colour cross-fade fill** (blue → green → yellow over about 22 frames), which then stays.
- **Markers:** a red dot; a red-white ring target; a map pin (white ring). City labels in small black sans with a dot.
- **Icons:** flat flag icons (US, Confederate, Mexican) placed on the map, gently waving with a sine warp.
- **Movement on maps:** tiny sprite armies march across the map toward a pin, with the camera following slowly.
- **Zoom into a region (about 18 frames):** the selected region scales up and rotates slightly out of the parent map, while the rest **fades to a desaturated blue-grey ghost** and dissolves. The region becomes the new map.
- **Characters can stand beside the map** at about 1/3 frame height (the presenter).

### 6.2 Charts and data
- **Line-chart arrow:** a thick zig-zag with an arrowhead, **red for up/good** and **light blue for down/bad**. It **draws on** from left to right over 10–12 frames (stroke reveal), with the arrowhead last.
  - **Exit:** it slides off down-right in about 12 frames (eased); it does not fade.
- **Whiteboard chart:** a red line drawn progressively over about 2.5 s on an easel. The presenter's pointer follows the line tip.
- **Money:** green banded bill bundles (white $, dark outline).
  - **Entry:** they **drop from above in pairs**, each falling about 8 frames with ease-out, stacking 2 wide × 5 high.
  - **Exit:** the stack flies up out of frame in about 10 frames.
- **Money confetti:** small green bills fluttering down across the frame, each rotating. Used over a logo for "money spent".
- **Timeline:**
  - **Plate:** a flat **dark teal/navy plate (#0d1b20)** with subtle noise.
  - **Items:** cartoon head icons (about 6% of frame) with white year labels under them, in a row.
  - **Entry:** each new item **pops 0 → 1 in about 7 frames with a small overshoot**, and the row re-centres over about 10 frames. Heads age or change expression per item.
  - **Extra label:** a key year can appear centred below.
- **Cutaway or X-ray diagram:** layers as vertical bands on a near-black background with dark-red blobs. A projectile with a flame-wisp tail creeps in slow motion, and yellow spark bursts mark the contacts.
- **Logos and real emblems:** centred on a themed background (the Apollo logo on space) with a particle overlay.
- **Graphics backdrop:** graphics usually sit over **the location background dimmed and desaturated about 50%**, not a separate plate. Characters stay small at the bottom-left.

### 6.3 Transitions
| Transition | Spec |
|---|---|
| Hard cut | 95% of all transitions |
| Name card | Darken the shot about 70% (see §4) |
| Cobweb | Caption pops, a thin white spiderweb (about 30% of frame) fades in over 10 frames **while the scene fades to black**, leaving the web on black for about 1 s. Means "dead or forgotten" |
| Region zoom | §6.1 |
| Archive → cartoon | Hard cut, with an accelerating push-in starting on the cartoon |
| Fade to black | Only for endings or solemn beats |

## 7. Effects library (GFX FX)

All FX are **flat, ink-outlined shapes**, never realistic particles. Durations are in frames.

| FX | Look | Duration |
|---|---|---|
| Red motion smear | Curved crescent replacing a fast limb | 6 |
| Red spiky splat | Radial red jagged strokes plus a soft red glow (gunshot or hit) | 4–5 |
| Red jagged impact | Red spiky blotch in the grass or ground (bullet) | 2–4 |
| Red muzzle blast | Jagged red shape at a gun or cannon mouth | 2–3 |
| Red flak comet | Red streak with a white trail hitting a vehicle | 4 |
| White impact spikes | 3–4 white jagged lines at a hit | 4 |
| White speed lines | Thin white arcs (dive or duck) or white wedge streaks (impact, crash-in) | 3–8 |
| Yellow spark burst | Radial yellow jagged spikes | 3–4 |
| Fire | Red outer, orange, yellow core, jagged tongues, soft glow, black smoke tips, ember dots; **animated on 2s**, with shapes cycling every 2–3 frames | loop |
| Fire blast | Flames burst from behind an object and the object flies off (tilts and drops in 4 frames) | 4 + loop |
| Engulfed in fire | 1-frame swap to a fully burning vehicle or building | swap |
| Smoke wisp | Thin grey curling shape rising, animated | loop |
| Grey puff or cloud | Thrown substance or dust; flies in over 2 frames | 2 |
| Spirit whoosh | White spike shooting out of a body (death) | 4 |
| Sweat drop | Light-blue teardrop at the temple; many drops = panic | swap |
| Tears | Light-blue drops or streaks under the eyes | swap |
| Anger vein | Red cross-popping vein symbol | swap |
| "?" marks | Red question marks beside the head | pop |
| Blush | Pink ovals on the cheeks | swap |
| Cheering scribbles | Red hand or motion-line scribbles blinking on and off in alternate positions every 0.25 s over a crowd | loop |
| Confetti or streamers | Yellow-green swirls in the foreground corners (celebration) | loop |
| Spotlight | Cream radial light cone from above, the room dark | static |
| Light beam | Diagonal warm beam across the floor | static |
| Grey tint | One character desaturated to grey-purple | swap |
| Dust or smoke vignette | Soft grey drifting cloud edges | loop |

## 8. Archive images
- **Framing:**
  - **Portraits:** a **small centred box on black**, or on a dark brown gradient.
  - **Engravings and paintings:** full-frame, with a **thick black vignette border**.
- **Grade and texture:**
  - **Grade:** sepia for 19th-century photos and engravings; black and white for later photos; oil paintings in their own colour. No added tint.
  - **Old-film texture:** grain, scratches, slight flicker and jitter, dark vignette.
- **Motion:** always a **slow push-in** (Ken Burns), 5–8 s per image.
- **Captions:** the person's name or the event, in white caps at the bottom-centre. A name card can darken the archive photo like any shot.
- **Talking photo:** **cartoon eyes, brows and a mouth composited onto the real photo**, with the mouth swapping open and closed in 3–4 frame holds (Holmes shouting "Get down, you fool").
- **Archive → cartoon:** hard cut to the cartoon version of the same scene, then a push-in.

## 9. Backgrounds
- **Painted:** soft, textured and more detailed than the characters, with depth from atmospheric haze. Muted, natural palettes.
- **Lighting is heavy and motivated:**
  - Candle and lamp glow halos.
  - Warm window light with bokeh.
  - Cold blue moonlit rooms.
  - Diagonal light beams.
  - Darkened bedrooms.
  - Spotlights.
- **Recurring sets:**
  - **Interiors:** the Oval Office (gold drapes, flags, snowy windows, Resolute desk); White House lawn exterior; columned convention room; parlours with fireplaces; log cabin interiors; restaurants; bedrooms; classrooms; palace halls; the Blue Room.
  - **Exteriors and vehicles:** town streets (brick, cobbles, Victorian facades); battlefields (grass, palisades, painted forests and mountains); western desert panoramas (canyon, cacti, wagons); oceans (wave stripes, white highlights); sky (soft clouds, scrolling); space (navy starfield gradient).
  - **Studio-like sets:** whiteboard or presentation room (light grey); a flat dark-teal plate for timelines.
- **Crowds:** dense duplicated heads with varied hair colours. They fill the bottom 40% of the frame, or appear as **dark round silhouettes from behind** as a foreground depth layer.
- **Vehicles:** cars, planes and submarines are drawn **more detailed and shaded than the characters**. They move by translating plus small bobbing over a scrolling background; propellers are blurred discs.
- **Living portraits:** framed posters whose painted faces animate.

## 10. Sound (measured)

| Property | Measurement and rule |
|---|---|
| Loudness | **−15.5 to −17.5 LUFS** integrated (13 clips) |
| Stereo | **Near mono:** side channel 21–25 dB below mid |
| Voiceover | One narrator, continuous; VO at about −20 dB median |
| Music bed | Always present under the VO, **about 17–20 dB below the voice** (floor −37 to −40 dB in pauses, not silence) |
| Stamp | **Sub-bass thump** on the landing frame (+6 to +24 dB at 30–150 Hz); overall level hardly changes because the mix is compressed |
| Gunshot | Boom plus crack: sub +32 dB, highs +6 dB |
| Impact spark | Sub +20 dB plus highs +12 dB |
| Kick or punch | Thump: sub +12 dB on the first smear frame |
| Flak or plane hit | Sub +11 dB, then the **fire whoomp** (sub +14 dB) on the engulf frame |
| Vehicle crash-in | Rumble plus whoosh: sub +12 dB, highs +9 dB |
| Dramatic reveal | **Music and VO drop out** for about 0.4 s just before the reveal (DEBT rising: −26 dB) |
| Quiet gags | Some gags have **no SFX** (the death push-in), so the deadpan reads |
| Name cards and captions | No distinct SFX |
| Density | Roughly one SFX per visual beat; SFX land **on the same frame as the visual** |

## 11. Implementation map (our code)

| Need | Use or build |
|---|---|
| Talking, nods, idle, falls | `LayerPuppet` `speak`, `fall` (src/Thanksgiving/LayerPuppet.tsx). Mouth holds 3–5 frames are already in `mouthAt` |
| Quill as Flappy | `QuillPuppet` with the beak **closed** in story scenes (do not pass `talk`); add expression or prop swaps: glasses, pointer, sunglasses, sweat, side-eye |
| Stamp | `StampCard` (src/EmuWar/Scenery.tsx). **Match §5**: 5–6-frame ease-out from about 3×, ink variants, 6–8-frame darkening *after* landing, optional fade-out, thump SFX |
| Captions | `Caption`. **Match §4**: thin black outline plus shadow, hard on/off (no spring) |
| Name card | `NameCard`. Darken about 70% |
| FX | Build as SVG components when first needed (§7), each with the listed frame counts |
| Maps, charts, money, timeline | `Graphics.tsx`. Extend per §6 |
| SFX | `make_sfx.py`: add a sub-thump (stamp), gunshot boom+crack, fire whoomp, crash-in rumble-whoosh, typewriter tick; mix the music bed about 18 dB under the VO, near mono, −16 LUFS |
