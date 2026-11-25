# Animation Production Spec: matching the 13 reference clips

This playbook comes from frame-by-frame analysis of the 13 reference clips. Each clip has its own report: `reference_analysis/NN/analysis.md`, plus `events.csv` and `frames.csv`. Every rule below cites its evidence as **clip:frames**, and frames are 0-based at 30 fps.

All values are measured at 426×240. To scale them:
- 1 px at 240p is **0.0042 H**: 4.5 px at 1080p, 9 px at 4K.
- Positions are normalised to the top-left corner (x/W, y/H).

Labels: **obs** = observed; **est** = estimated within visible uncertainty; **impl** = suggested implementation.

The timings are starting values. Story and VO decide the final timing.

Audio was not listened to. Every sound note is waveform-only and unverified, and the VO text comes from approximate ASR. See "Sound" below.

---

## 0. The ten rules that matter most

1. **Expressions are swapped in one frame, never tweened** (all clips).
   - Brows, eyes and mouth swap together as one face state. Accents (sweat drop, tear, anger vein, blush, scratch marks) are overlays on that state.
   - The head outline, hair and hat never redraw.
   - The swap lands on the motivating word, from 0 to +10 f after it (01:192→193, 05:419, 11:101/730/766, 13:640).
2. **Listeners react 3-8 frames after the cause.** Examples: 05:236→239 (3 f), 01:952→956 (4 f), 04:814→822 (8 f).
   - A listener can also react on the same frame as the cause, so both read as one beat (10:346).
   - Crowds react one person at a time, about 7 f apart (11:554/561/568/589).
3. **Talking is a fixed mouth loop, not lip-sync.** Open/closed holds measured across clips:

   | open/closed (f) | clip:frames |
   |---|---|
   | 6/5 | 07:0-209 |
   | 7/7 | 11:151-349 |
   | 8/8 | 04:444-602 |
   | 8/11 | 09:572-831 |
   | 9/9 | 05:534-561; 06:536-684 |
   | 10/10 | 10:237-346 |

   - Panic speeds the loop up (06:970, 5/5). A shouting archive face runs 3-4/5 (06:897).
   - Two closed drawings can alternate for variety (11).
   - Only the mouth layer changes while talking.
   - Stop the loop on the beat change with a closed mouth (10:347, 04:708).
4. **Every visible character idles all the time.** It is a smooth per-frame vertical sine.
   - Amplitude 1-6 px at 240p (0.004-0.025 H). Period 16-36 f.
   - Pairs run in opposite phase or with different periods, so they never sync (04:0-51, 05:967+, 07, 11, 13).
   - Exceptions:
     - A solemn tableau can hold totally still while a slow camera push carries the life (09:572-831, 10:0-174).
     - A villain freezes while presenting a prop (04:821-850).
5. **The camera is almost never locked.** Every shot has one continuous slow move:
   - push 1.07-1.46× over 2-10 s, or a pull-out to 0.62-0.84× (all clips);
   - ease-in-out, or linear with a soft start;
   - it is often cut while still moving (10:0-174, 13:0-82).
   - Fast moves are reserved for beats: the 3-5 f "make room" pull (01:84-86, 01:942-946), the pull-back reveal (01:440-491, 8×), the pre-stamp push (08:843-852, 11:837-849) and the whip reframe (06:728-733).
6. **The name card** is the next shot's own plate, dimmed in one frame to 0.24-0.30 brightness, with centred white heavy caps and no box.
   - The animation either keeps running underneath (01, 05, 07) or freezes and resumes where it stopped (02:232-263, 11:113-150).
   - The dim and the text go off together in one frame after 1.2-2.0 s (01:284-327, 02:232-263, 04:164-214, 05:473-533, 07:93-144, 09:262-296, 10:175-230, 11:113-150, 12:0-48, 13:193-241).
7. **Captions** (date, place, fact) are white heavy caps with a thin dark outline and soft shadow.
   - Centred at the bottom (y 0.80-0.91); top-centre (y 0.11) when the bottom is busy (07:946, 13).
   - Hard on and hard off, with no fade or scale.
   - They land 0-4 f from their spoken word and hold 1.4-3 s.
   - Screen-locked: they do not move with the camera.
   - Date → place swaps happen in place in one frame (05:832, 12:357, 08:196).
8. **The "LAST" stamp slams** from 2.2-3.8× to 1.0× in 5-7 frames, with fixed rotation and no overshoot.
   - It lands in the empty half of the frame, usually after a camera move made that space.
   - A dim often follows. The character reacts 4 f later or not at all.
   - Full recipe in §5.
9. **Every place gets its own detailed, painted, mood-graded background.** Generic rooms are not reused for different places.
   - Instead, a set is reused with a new grade for a new mood: calm/fire cockpit (12:49-122 vs 480-626), hero/deflated parapet (06:531 vs 968), cool bedroom/warm oath room (09).
   - When the story returns to a set, the cut comes back at the exact earlier framing (11:346 vs 669; 09:162 vs 832).
10. **Physical comedy is told with FX shapes and one-frame pose swaps, not in-betweens.**
    - Hit: red burst plus a fling off-frame in 3-4 f (08:240-244).
    - Fall: burst, one tumble frame, then lying (06:748-752).
    - Duck: white motion arcs, then a pose swap behind a parapet (06:998-1001).
    - Crash: streaks, a shake, then a held punch-in (09:476-485).
    - Rip: a 1 f lift, a pose swap, then a 2 f red slash (04:851-854).

---

## 1. Characters and rig

### 1.1 Design (all clips)

| Property | Value | Evidence |
|---|---|---|
| Head : body | 1:1.3 to 1:2.5 (big heads) | 08, 03, 05 |
| Head share of visible figure | 40-50 % | 08, 10, 12 |
| Outline | uniform black, about 2 px at 240p (≈0.008 H; ≈9 px at 1080p) | all |
| Fills | flat with no shading on characters. Sets and vehicles can be painted and shaded | 12:123 (plane) |
| Limbs | single black strokes (stick arms and legs), no drawn joints. Hands are round mitts or 3-4 finger mittens. Feet are hook strokes | 08, 09, 10 |
| Torso | rounded rectangle, or trapezoid coat shapes | all |
| Face | dot eyes; separate brow strokes; nose as one "L/J/C" stroke; mouth as a single line, or a black open oval/D with an optional tongue | all |
| Accents | light-blue sweat drop (≈#9aa6e0) on the cheek or temple; light-blue tears under the eyes; red anger vein; pink blush ovals; red zig-zag scratch marks; blood spot | 01, 04, 05, 08, 12 |

### 1.2 What changes on its own and what stays fixed

**Independent swap layers:**
- brows
- eyes (dot, wide circle, half-lid, closed arcs, X X)
- mouth
- accent overlay
- arm set (whole arm pose swapped as one drawing)
- whole-pose drawings: front, back, lying, ducking, victory

**Never redraws:** head outline, hair or wig, hat, nose.

**impl:** keep the head, hair, hat and nose as one fixed drawing. Put brows, eyes and mouth on swap layers parented to the head. Swap arm poses as whole drawings. Bob the whole puppet with one root transform. Because limbs are strokes that meet under the coat outline, no joint ever shows.

### 1.3 Angles

Front, ¾, back and profile are **separate drawings** with the same proportions, palette and line. A turn is a single-frame swap with no turn animation (03:435 back view, 03:647 victory front).

### 1.4 Crowds

- Duplicate a few designs (2-3), varying hair and outfit colour. Arrange them in 2-3 depth rows, with the foreground row larger and often cropped (05:473, 06:189, 08:619, 11:527, 01:709 grid formation).
- Animate a crowd with **overlay marks** instead of animating each person: three states of red cheer marks held 4 f each, cycling every 12-13 f (03:0-63).
- Or use staggered single-head swaps (11:554-589).

---

## 2. Acting and blocking

### 2.1 Speaker and listener

- Characters face each other with clear eye lines (04:442, 09:572 oath triangle).
- A listener holds one reaction face for the whole beat. The speaker loops their mouth.
- Mascots and extras who are not the subject do not lip-sync. The narrator is off-screen.
- A villain or prop presenter freezes completely while presenting (04:821-850).

### 2.2 Expression timing

| Event | Delay | Evidence |
|---|---|---|
| Subject swap on the motivating word | 0 to +10 f (it may lead the word by up to 8 f, 13:640) | 05:419 (0), 11:101 (+1), 11:766 (+10), 03:378 (+1) |
| Listener after the cause | +3 to +8 f, or 0 (same frame) | 05:239, 01:956, 04:822, 10:346 |
| Reaction after a stamp lands | +4 f, or none (most clips hold) | 01:956; 05, 07, 08, 11 no reaction |
| Hold after a swap | at least 2 s (often to the cut) | all |

A useful two-step pattern is a 1-frame "attitude flash" face, then a pose swap (10:416-417). Another is a neutral face that "upgrades" to a smile later (10:679, 10:741).

### 2.3 Entrances and exits

| Move | Values | Evidence |
|---|---|---|
| Slide in from the frame edge | ease-out over 5-15 f, no overshoot; the prop or hands lead the face by 3-5 f; the character may stay partly cropped | 04:157-161 (5 f), 04:797-804 (7 f), 05:148-163 (15 f), 05:219-233 (symmetric from both sides) |
| Mascot pop-up from the bottom edge | rise about 0.3 H in 4 f (ease-out), cut off at the corner | 01:180-183 |
| Mascot slide with a hard stop | constant ≈0.037 W/f, no ease | 07:867-876 |
| Head peek from behind | about 10 f eased rise from behind a character (08:689-698); 4 f rise from behind a desk (02:1025-1028) | 08, 02 |
| Background walk-on | constant ≈0.037 W/f with a 4-5 f ease-out; the prop hand stays level | 07:48-68 |
| Gag exit | 1 f attitude flash, pose swap, then a rigid cutout slide accelerating from 1 to 10 px/f, passing **behind** other characters | 10:416-446 |
| Fling exit (hit) | about 45 px/f (≈0.1 W/f) for 3-4 f, no anticipation | 08:240-244 |
| Clear-frame exit | characters leave at both edges, then 2 f of empty plate before the cut | 05:240-261 |
| Remove from a group | opacity fade over 36 f while the group keeps animating | 01:840-876 |
| Comic recovery | lying → upright in a 1 f swap, while the camera keeps moving | 08:570 |

### 2.4 Walks, rides and vehicles

- **Walk or ride in place.** The legs redraw every frame (on 1s), with a step of about 13-20 f. The background scrolls, or the camera moves (01:328-363, 06:189-310, 08:143-239).
  - Background scroll speed: 0.0055 W/f for a walk.
  - The rider's head stays steady to ±1 px.
- **Vehicle speed comes from the scrolling background**, not from moving the vehicle: 0.035 W/f for cruising and 0.063 W/f for action (12:123-240, 12:399-479). The vehicle keeps its own bob (about 12.5 f).
- A sleepy or slow walk is linear travel at 0.0032 W/f (09:832-907).

---

## 3. Mascot (the eagle; in our films, Quill)

| Role | How it looks | Evidence |
|---|---|---|
| Silent worried listener | pops up from the bottom corner, worried brows, hands raised; small | 01:180-260 |
| Companion beside the subject | stands next to them; a hand on the shoulder, worried brows | 10:0-174, 05:346-472 |
| Presenter | wears glasses only in this mode; long pointer at a board; the pointer rotates linearly toward the drawing (it does not chase the tip) | 03:866-1049, 04:0-51 |
| Explainer | slides in on the first spark of a diagram to point | 08:426-432 |
| In-world witness | stands in the scene: in the crowd with a hat (05:473), on horseback (05:562), in the oath room with his back ¾ to camera (09:572), saluting in tears (13:0-82) | |
| Confused audience | red "?" marks pop on each side of the head (4 f each, 2 f stagger), then the face swaps to deadpan 8-10 f later | 04:509-522 |
| Deadpan deflation | slides in after a romantic stamp, half-lidded, and only bobs | 07:867-1049 |
| Peeker | head rises from behind the action, worried, with sweat (08:689); or rises from behind a desk in 4 f, ease-out, 12-18 f after the stamp settles, then holds dead still (02:1025-1028) | 08, 02 |
| Absent | some clips leave the mascot out completely | 12 |

The eagle **never speaks on screen**: his beak stays closed. Each appearance gets one held expression, set on its beat.

---

## 4. Backgrounds and staging

### 4.1 How the backgrounds are built

- **Painted, textured and specific.** Each place is recognisably that place:
  - an inauguration lawn with bunting and flags (03:0);
  - Dutch step-gable brick facades (04:442);
  - a Victorian street (05:473);
  - an ochre mesa desert with saguaro (05:562);
  - the Oval Office with gold drapes and both flags (11:0, 13:0);
  - the Blue Room with gold-dot wallpaper (07:701);
  - a sub deck from a high angle (12:822);
  - a farmhouse bedroom with a window and moon (09:162).
- **4-7 depth layers, back to front:** sky → far landscape/architecture → mid props → character plane → foreground occluder → FX → text.
- **Foreground occluders** hide legs and add depth: a desk across the bottom third (11, 13), a table edge (10, 04), a parapet top line used as a matte (06), bush strips (01:609), chair backs (11:527), audience heads seen from behind (07:701).
- **Parallax is mild or none.** Most moves scale the whole plate. Where it is measured, the foreground scales about 5 % more than the background (07:701-744, 05:346 background −15 px vs characters +5 px).

### 4.2 Lighting and grade carry the mood

| Mood | Recipe | Evidence |
|---|---|---|
| Night interior, cool | blue-grey wall #4d5565, navy sky #1d2b6c, skin pulled toward #736967, the only glow a pale halo #7a86a8 around the window | 09:162-571 |
| Lamp-lit night | brown multiply; corners #25201b; a soft radial pool #564530 on the wall (radius 0.35 W, about 2.2× the edge luminance) centred on the lamp; lamp core #ffe477; 2 light bands across the table; lit skin #f4ddb7, unlit #766b66; no flicker | 09:572-831 |
| Danger / fire | hot red-orange grade with glow; flame tongues in the foreground; smoke-purple sky | 05:262-472, 08:687-779 |
| Heroic | translucent yellow radial rays plus white sky streaks shimmering per frame (looping, no drift) | 06:531-688 |
| Deflated (same set) | the rays removed | 06:968 |
| Winner / loser relight | on the loss word, a one-frame global multiply to 0.60, except a soft vertical warm light wedge on the winner (≈0.13-0.30 W, widening toward the floor). The loser is desaturated to grey-purple (#907A82). Held to the cut | 02:458 |
| Emotional tint on one character | the whole face sits in a grey-violet shadow tint | 01:55 (farmer) |
| Stage spotlight | dark velvet curtain with a lighter centre pool | 11:911 |
| Dusk data scene | background group pre-dimmed to 35-40 %; characters and graphics at full brightness | 13:83-763 |

### 4.3 Reusing sets

- Reuse a set with a new grade or new FX for a mood change (§0 rule 9).
- When the story returns to a set, use the **exact earlier framing** (11:669 = 11:346; 09:832 = 09:162).
- Keep **continuity scars**: after the car crash, the hole in the wall stays (09:832).
- A payoff shot can be a tighter crop of the same plate (09:909, about 1.35×).

---

## 5. The LAST stamp

Measured on 16 stamps in 13 clips (01:947, 02:25, 02:1008, 03:106, 03:752, 04:681, 05:24, 05:1014, 06:1026, 07:723, 08:848, 09:909, 10:998, 11:844, 13:770).

| Parameter | Range | Typical / starting value |
|---|---|---|
| Start scale | 2.2-3.8× (clipped by the frame) | 3.0 |
| Frames to land | 3-7 | 5-6 |
| Scale curve | linear (01: 3.0, 2.6, 2.2, 1.8, 1.4, 1.0; 11: 3.2, 2.7, 2.2, 1.75, 1.25, 1.0) or ease-in "hang then snap" (03:752, 08). No overshoot, bounce or shake. | linear −0.4/f |
| Start opacity | often translucent or see-through while oversized, then opaque on landing | 08:848, 09:909, 04:681 |
| Rotation | fixed throughout; −4° to −10° CCW is most common; +7° to +19° CW also used; consecutive stamps may alternate | −8° |
| Landed box | 0.43-0.56 W × 0.29-0.45 H, top-left (most), top-right (03, 09, 11) or top-centre (06, 10), always in the **empty half** beside the subject's head, never over the face | centre (0.27, 0.30) |
| Text | 3 short centred lines, ALL CAPS, heavy geometric sans, grunge/speckle ink texture | — |
| Styles | (a) **white ink** with a grainy white border on a translucent dark box (dark or neutral scenes; 02, 03, 04, 05, 08, 09, 13); (b) **red ink** with a red border and no fill, background showing through (light scenes; 01, 06, 07); (c) white outline with no fill (10, 11) | — |
| Making room | before or during the slam the camera pulls/pans (01:942-946 5 f to scale 0.64; 03:744-753 pan 0.2 W in 10 f) or pushes in to push the subject to one side (08:843-852 +40 % in 10 f; 11:837-849 to 1.37×; 04:677-691 +22 %) | 5-10 f move ending on the slam frame |
| Dim | none in light scenes (01, 06, 10); after the landing over 5-6 f to about 0.5-0.3 (05:30-34, 11:851-856); during the landing (05:1014, 08:848); or a ramp starting about 45 f before (04:636). Variants: a left-side gradient, or **background only** while characters stay bright (13:772-775), or a background **wash to white/desaturated** (07:708-770) | after landing, 6 f, to 0.5 |
| Hold | 2-7.7 s; the scene keeps animating underneath | 3 s |
| Exit | on the cut (most), or an in-place opacity fade over 13-17 f with the dim lifting (04:765-781, 07:904-917) | cut |
| Timing vs VO | lands on "last" (09, 11), or leads the punch line by 0.8-3 s (10, 13, 03:752) | on "last" |
| Reaction | none, or a 1 f worried swap 4 f after landing (01:956) | — |
| Audio | onset 2-4 f before the entry or at the settle frame (waveform only) | — |

---

## 6. Camera and compositing

| Move | Values | Evidence |
|---|---|---|
| Slow push (default) | +0.03 % to +0.28 %/frame; 1.02× (maps) to 1.46× (payoff); ease-in-out or linear; anchor on the subject's third | 05:346 (1.167/126 f), 09:572 (1.174/260 f), 13:0 (1.232/83 f linear) |
| Slow pull-out | to 0.62-0.84×, ease-in-out; reveals context or the room | 10:231-528 (0.69), 07:701-744 (0.617/43 f), 11:982 (0.725/66 f), 05:562 (0.836) |
| Huge reveal pull | about 8× over 52 f, ease-in-out peaking at about 55 %, then a 4 s hold | 01:440-491 |
| Reveal pull before a graphic | 2-2.4× over 9-12 f | 03:97-105, 03:214-225 |
| Reveal by camera only | the newcomer stays still in the world; a 2× pull over 40 f, ease-in-out; the on-screen character's eye line points at the hidden one first | 02:185-224 |
| Over-the-shoulder reaction | the listener's back of head enters from the frame edge as a foreground layer during a pull-back (moving faster than the background), with a pulsing anger vein | 02:777-821 |
| Fast push into the stamp | +37-40 % in 10-13 f, accelerating then stopping | 08:843-852, 11:837-849 |
| Pan to make room | 0.2 W over 10 f, ease-in-out | 03:744-753 |
| Whip reframe | 6 f accelerating tilt/pull with a new character sliding in on the same frames | 06:728-733 |
| Impact shake | scale peaks +14 % at frame 3, rotation +4.5° then −2.3°, settles by frame 8 into a **held** +7 % punch-in | 09:476-483 |
| Death punch | 4 f eased push to 1.44×; the eye swap happens on the landing frame | 09:80-84 |
| Dim-to-zero inserts | the name card multiplies the whole frame by 0.24-0.30 | §0 rule 6 |
| Map push | slow ease-out to 1.10× over about 5 s, anchored near the pin | 12:241-398 |

Text is always screen-locked. Characters never wobble with camera noise.

---

## 7. Maps

- **Water:** textured, mottled bright blue (≈#1E8FD5 / #0780BE, with cloudy blotches).
- **Land:** beige/greige (≈#D3C3A5), or light state tints. Thin dark internal borders, a thick black outer coastline, and on world maps a light blue-white halo ring offset from the coast (12:241).
- **Selected region:** red fill (04:52); or a **linear RGB lerp** of the fill over about 22 f (blue → yellow through grey-green) starting on the keyword, with outline and labels untouched (05:843-864).
- **Zoom into a region:** an inset copy scales out of the red region to about 9× in 9 f (near-linear with one ease-out frame). Hold 2 f, then fade the parent map linearly over 8 f. The place caption hard-cuts on about 30 f later (04:306-347).
- **Pin:** a red ring with a white centre, already present on the first frame, scaling with the map (12:241). Flags are flat icons (05:967, 06:0). Army sprites slide across the map (06:0-188).
- **Presenter on the map:** a small full-body character at the bottom-right, sliding in from the edge (04:157), or two foreground presenters (05:967).

---

## 8. Graphics, diagrams, archive

| Template | Recipe | Evidence |
|---|---|---|
| Trend arrow | a thick zig-zag with a chevron head **scaled as one shape from its tail**, with the stroke width growing too; it is not drawn on. Good news: red, linear, 9 f. Bad news: blue, 26 f, ease-out | 13:269-278, 13:644-669 |
| Line chart on a board | a red stroke revealed at about 0.005 W/f, up-ticks in 1-2 f jumps, arrowhead last (7 f); 2.3 s total; starts on the VO word | 03:917-985 |
| Graphic exit | falls out the bottom: an arrow drops linearly at 0.083 H/f; a money pile drops pair by pair, bottom pair first. Hold a clean plate for 12-28 f afterwards | 13:245-256, 13:607-615 |
| Money stack | pairs of bills drop every 4-5 f with ease-out and land offset to the right, so the pile leans | 13:117-141 |
| Particle pun | a centred emblem plus a full-frame layer of falling, spinning bills at 0.01 H/f | 11:467-526 |
| Timeline | icon + year groups, left-anchored at a fixed pitch (0.216 W) and never re-centred. Each new item pops 0 → 1 over 11 f on an S-curve (0.11 … 1.0) with no overshoot. New heads enter neutral and later swap to a smile. Older items are already there at the cut | 10:529-1003 |
| Cross-section | flat ink bands on a black plate. The projectile slows at each layer (2.4 → 1.4 → 0.6 px/f), with a 7 f yellow spark at each contact. The presenter slides in on the first spark | 08:318-528 |
| Speech bubble | white ellipse with a thick outline, scaling from the tail tip over 10 f with ease-out. The text types on at about 0.8 chars/f (1/f inside words, 2-3 f holds at spaces) into lines laid out in advance. The bubble can sit behind a listener's head | 04:463-588 |
| Shout bubble | spiky, grows from near the face in 5 f, text scaling with it (no type-on), bleeding off the corner | 06:909-913 |
| UI parody | a slot fades in over 9 f; the word rises letter by letter (5-6 f each, 2-3 f stagger); panels slide 4-6 f ease-out; per hit: icon 1-2 f, red hit 2-3 f, an instant bar step, type-on 1.5-2.4 chars/f. **Build a fresh identity; do not copy this one** | 03:343-646 |
| Unknown party | a white dotted silhouette with a "?" travelling with the group | 01:632-708 |
| Living poster | faces animated inside framed portraits under a fixed glare stripe | 08:0-142 |
| Archive photo | sepia/greyscale, boxed (≈0.47 W × 0.91 H) on a dark plate, or full-frame; a fixed rounded vignette above the photo; thin vertical scratches randomised every frame; no brightness flicker; a slow linear push (+3 % to +9 %) running through all the captions | 07:210-700, 06:311-530, 02:19-24 |
| Talking archive | cartoon eyes and mouth overlaid on the real portrait (1 f before the caption leaves), then a shout bubble | 06:893-967 |
| Archive → cartoon | archive stills (portrait → event engraving → portrait), then a **hard cut on the punchline word** to a cartoon restaging with matching composition; about 4 f of near-silence before the cut | 07:435-701 |
| Nested screen | an earlier shot playing on an in-world TV with foreground reaction characters | 11:982 |

---

## 9. FX library

| FX | Recipe | Evidence |
|---|---|---|
| Ground impact | red (#F21C1C) jagged splash 0.10-0.15 W wide; hard pop on and off; holds 5-10 f; redrawn per frame; alternates sides about every 10 f; the target never flinches | 06:531-688, 03:258-342 |
| Muzzle flash then impact | 2 f flash, then a 10 f impact hold | 03:315-326 |
| Three-stage hit | a red streak fully drawn (no travel-in) for 3 f → a white spike burst for 5 f → hard swap to fire plus a yellow damage panel | 12:432-440 |
| Body hit | a red burst at the chest, the victim flung off-frame in 3-4 f carrying the burst, then a 4 f white wedge streak 3 f later. The background scroll stops on the hit | 08:240-250 |
| Fall | a 3 f horizontal red burst, 1 tumble frame, then a face-down hold rotated 90° | 06:748-752 |
| Death | X X eyes plus a white jagged "spirit" spike from the chest for 4 f | 09:84-87 |
| Duck | 3 f of white curved motion arcs, a 1 f pose swap behind a foreground matte, the arcs trailing 1 f | 06:998-1001 |
| Flop into bed | 2 f of white curved arcs over the body | 09:910-911 |
| Crash through a wall | 9 f of white jagged wedge streaks plus grey debris, the prop pushing in over 8 f, the wall art replaced by a jagged hole | 09:476-485 |
| Door blast | the door jumps 0.35 W and tumbles out in 4-6 f; layered flames; horizontal speed streaks | 05:20-25 |
| Fire | a flat 3-tone flame wall (yellow/orange/red) with black smoke and embers. Either smooth per-frame morph (displacement loop about 30 f; 08:687) or a flipbook on 2s (05:262). Characters get a warm rim tint | |
| Smoke wisp | a translucent grey curl rising from a wound | 08:529 |
| Confusion | two red "?" marks, bottom-anchored 4 f scale, 2 f stagger | 04:509-514 |
| Cheer | red hand-wave scribbles in 3 overlay states | 03:0-63 |

---

## 10. Sound (waveform-only findings; nothing was heard)

- The VO runs continuously across cuts. Cuts and captions sit within ±2 f of VO words.
- Impact SFX onsets lead the visual hit by **3-5 frames** (08: 236/240, 421/425, 494/498, 844/848). Start with a −4 f offset.
- Stamp SFX onsets come at −3 to +2 f of the entry (01, 03, 04, 09, 11, 13) or at the settle frame (06:1032). The safest choice is a whoosh starting at entry −2 f plus a thud on the settle frame.
- There is a short near-silence (about 4 f) before the archive → cartoon cut (07:697-700) and at the name-card cut (10:176).
- Fire scenes have no sharp onsets, which suggests a continuous bed.
- **For our film:** keep the VO clearly on top; keep SFX quiet (the user's standing rule); no game-like music.

---

## 11. Timing table (quick reference)

| Beat | Frames |
|---|---|
| Expression swap | 1 (0 in-betweens) |
| Listener delay | 3-8 |
| Mouth loop | 6-10 open / 5-11 closed |
| Idle bob | 1-6 px at 240p, 16-36 f period |
| Entrance slide | 5-15, ease-out |
| Caption hold | 42-95 (1.4-3.2 s) |
| Name card hold | 35-61 |
| Stamp land | 3-7 |
| Stamp hold | 60-230 |
| Make-room camera move | 3-10 |
| Impact FX hold | 2-10 |
| Map region zoom / parent fade | 9 / 8 |
| Region recolour | 22 |
| Timeline pop | 11 |
| Speech bubble grow | 10; type-on 0.8 char/f |

---

## 12. Gaps found in our current VP film (cross-check)

Our film was checked against this spec using 2 s contact sheets of `out/Every_US_VP_Who_Became_President_4K_FULL.mp4`.

1. **Backgrounds:**
   - 3 generic sets cover 73 shots: WhiteHouseLawn ×30, B.Chamber ×22, OvalOffice ×21.
   - One cream arched-window room stands in for the Senate, the House, Albany and the offices.
   - **Needed:** one specific painted plate per place (§4), built from the real-place references in `scratchpad/bgref/INDEX.md`.
2. **Shot sizes:**
   - Almost every shot is a medium-wide of standing full-body characters, centred, arms down.
   - **Needed:** close-ups (01:127, 11:0, 13:764), over-the-shoulder and back views, desks and tables as foreground occluders, high angles, and action (riding, falling, ducking).
3. **Mascot:**
   - The owl mostly appears as a big cropped head in the bottom-left corner.
   - **Needed:** in-scene roles (§3): beside the subject, presenting at a board, in the crowd, peeking from behind a desk, as a witness in the room.
4. **Labels:**
   - Many small sticky-note tags ("PARTY BOSS", "JOBS FOR FRIENDS").
   - **Needed:** fewer, larger moments: bottom captions, name cards, stamps, and full-scene gags.
5. **Camera:** hold-then-punch moves. **Needed:** one continuous move per shot plus fast make-room moves (§6).
6. **Talking:** our talk is syllable-driven `mouthAt`. **Needed:** the reference style is a fixed loop of 6-10 f. Either is acceptable, but listeners must hold still and only the mouth may change.
7. **Stamp:** check ours against §5: start scale 3.0, 5-6 f linear, fixed rotation, placed in the space a camera move just made, and the dim variant chosen per scene.
