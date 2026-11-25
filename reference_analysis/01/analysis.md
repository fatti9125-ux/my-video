# Clip 01: Washington Marching Army: frame analysis

Source: `01_Washington_Marching_Army.mp4`, 426x240, 30 fps, 1020 frames (F0000-F1019, 0.000-34.000 s), stereo audio. Frame N = N/30 s.
Coverage: all 1020 frames were viewed on the 85 seq sheets. 93 frames were also checked in native or 2x crops (see `frames.csv`). Measurements come from ORB similarity fits (camera scale and translation), template matching (stamp scale), pixel masks (text and stamp boxes) and `metrics.csv`. Every crop is in `crops/`.
Labels: **observed** = seen on frames. **estimated** = measured, with visible uncertainty. **inferred** = a plausible implementation.
VO lane = `vo_words.csv` (pocketsphinx ASR transcript, approximate, about 0.1 s timing). Audio is from the waveform only and is unverified, because I could not listen to it.
The clip starts mid-sentence ("...brand new tax on whiskey") and ends on the stamp hold.

## Shot table

| shot | first | last | start s | end s | type | story purpose / motivating VO (ASR, approximate) |
|---|---|---|---|---|---|---|
| S01 | 0 | 54 | 0.000 | 1.833 | staged environment (interior) | Tail of a tax gag: a tarred-and-feathered official (inferred tax collector) sits in a log cabin. VO "...no brand new tax on whiskey" |
| S02 | 55 | 126 | 1.833 | 4.233 | staged environment, reaction close-up + caption | An angry frontier farmer. The bottle and caption name the event. VO "in what they called [the] whiskey rebellion" |
| S03 | 127 | 260 | 4.233 | 8.700 | presenter composition (ECU + mascot) | Washington is smug, then worried: would the law be enforced? VO "and nobody knew [if] the president [would] even enforce [the] law passed [in] the mountains" |
| S04 | 261 | 608 | 8.700 | 20.300 | staged environment + name card + caption + camera reveal | Washington calls up the militia and rides with it. The pull-back sells the scale. VO "so George Washington call[ed] about thirteen thousand militia ... and rode out with the army himself, so every farmer out there would see the president..." |
| S05 | 609 | 708 | 20.300 | 23.633 | staged environment (tracking march) + symbolic graphic | The march. A "?" silhouette stands for the absent rebels. VO "...the rebels [scattered/gathered] before you got there" |
| S06 | 709 | 896 | 23.633 | 29.900 | staged environment (formation wide) | A real army with real generals: Washington fades out of his own army. VO "... got a real army with real generals, so nobody needed the president riding along anymore" |
| S07 | 897 | 1019 | 29.900 | 34.000 | presenter close-up + LAST stamp | Payoff. VO "making George Washington our last president to lead an army [personally]" |

7 shots, 6 hard cuts (F55, F127, F261, F609, F709, F897). There are no dissolves or wipes.

---

## S01 (F0-F54): cabin, tarred-and-feathered figure
- **Blocking (observed):** one seated figure, centre-left (x about 0.30-0.68, full height). The body and face are covered in white feather shapes with black outlines. The figure wears a navy bicorne with yellow trim. A white collar with red and blue shows at the bottom. A brown tar smear sits near the right hand (x about 0.55-0.68, y about 0.75). The background is a log wall with a window on the right showing green bushes.
- **Motion (observed):** none. Camera similarity F0->F54 gives scale 0.998 and ty +2.4 px. mean_absdiff of about 1.5 is compression shimmer. This is a pure held tableau that is the tail of the previous joke (crops/feather_0_54.png).
- **Correction to prior notes:** this is not "Washington behind a tree of feathers". It is a feathered figure, and I infer it is the tarred-and-feathered tax collector.
- **Cut:** hard cut at F55 (mean_absdiff 53.8).

## S02 (F55-F126): angry farmer + WHISKEY REBELLION
- **Character (observed):** a young man with a black pompadour, three-quarter view facing screen-left. The whole face sits in a grey-violet shadow tint. The scowl has angled brows pressed toward the nose, small pupils and a short frown mouth. He has a dark forehead smudge, a dark coat and a white collar. The line is a thick black outline of about 2.5-3 px at 240p. The background is a log wall with a diagonal light patch.
- **Camera (estimated):** a slow pull-back of cumulative scale 0.948 over F55-F83 (about -0.19% per frame). Then a **3-frame quick pull** over F84-F86 (per-frame scale 0.955, 0.905, 0.948, cumulative 0.82, tx +30 px) opens space on the right.
- **Prop + text (observed):** on F85 a brown whiskey bottle with a black coiled hose (a still pipe) appears fully drawn at x about 0.63-0.80, with no slide. In the same frame the caption **WHISKEY REBELLION** pops on. The caption is white bold geometric sans in all caps with a thin dark outline and a soft shadow. It is centred low at x 0.13-0.885, y 0.81-0.90, with a cap height of about 0.08H. It pops on in one frame (white-pixel count 10 -> 1887 in the caption band) and holds 42 frames to the cut (crops/cut055_bottle.png, crops/caption_native.png).
- **Acting:** a held face. I saw no blink, no mouth movement and no brow change across 72 frames (observed on sheets).

## S03 (F127-F260): Washington ECU, mascot pop-up, smug-to-worried swap
- **Composition (observed):** Washington's face fills about 60% of the frame, from x about 0.25 to 0.85. The hat crown is cropped at the top and the cape collar cuts across the bottom. Behind him are a US flag (stripes top-left, stars top-right) and dark green bushes. Three-quarter view facing left. Layers, back to front: flag -> bushes -> mascot -> Washington.
- **Design (observed):** a peach face with a heavy black outline. The nose is a single "L" stroke. The eyes are dots and the brows are separate strokes. He has a white wig with side curls, a tricorne and a black cloak collar. The parts that change independently are the brows, the eyes (pupil position), the mouth and an accent layer (the sweat drop). The head outline, nose, hair and hat stay identical through the swap (crops/face192.png).
- **Camera (estimated):** a very slow pull-back of cumulative scale 0.968 over 133 frames (tx +6.6, ty +3.2 px). It is a "never fully static" drift.
- **Mascot entry (observed):** the bald-eagle mascot wears a black suit, white shirt and tie. He **rises up from the bottom frame edge** at bottom-left over 4 frames: F180 shows the head tip, F181 the head, F182 the head and shoulders, and F183 the full upper body. His final box is about x 0.08-0.24, y 0.69-1.0, cut off by the frame bottom. He has worried brows (inner ends up), both arms raised with open hands, and a closed beak. The arms settle slightly over F184-F189, then hold to F260 (crops/mascot180.png). He is a silent listener.
- **Expression swap (observed):** between **F192 and F193** (6.40 -> 6.43 s), Washington's face changes in one frame, with no in-between drawing. Before, he is smug: brows slanted down toward the centre, pupils looking right and a smile curve. After, he is worried: the brows become high arched "^" shapes, the eyes are centred dots, the mouth is a flat line, and a light-blue sweat drop sits on the right cheek. The mascot is already on screen at lower left, since F183. The swap lands 10 frames after the mascot settles. The ASR words "present ... even" (F176-F205) carry the doubt beat. The worried state holds 68 frames to the cut with no blink.

## S04 (F261-F608): field ride, name card, militia caption, 8x pull-back reveal
- **Establishing (observed):** a green grass field with a painted, photo-textured look. Washington rides a white horse at left, x about 0.14-0.48, y about 0.40-0.80, facing left. A tight cluster of militia stands at right (x 0.70-1.0): duplicated soldier sprites in tricornes and white-and-navy coats, holding muskets. They are large-headed, with a head:body ratio of about 1:1.5 (estimated).
- **Camera (estimated):** a slow pull-back runs through the shot. F261-F283 has cumulative scale 0.961. F328-F439 has cumulative scale about 0.87, with small slow drifts.
- **Name card (observed):** on **F284** the whole frame dims in one frame, from brightness 130.4 to 37.5. That is a factor of 0.29, about 71% darker. **GEORGE WASHINGTON** appears in white bold caps, centred, with no visible outline (box x 0.123-0.88, y 0.467-0.571). The horse keeps walking under the dim. On **F328** the dim and the card both cut off in one frame (37.8 -> 131.8). The card holds 44 frames (1.467 s) and starts on the ASR word "george" (F282).
- **Caption (observed):** **13,000 MILITIA** is white bold caps with a thin dark outline, centred low (x 0.246-0.786, y 0.80-0.90). It is on from F332 to F392 (61 frames, 2.03 s) and pops on and off in one frame (band white count 15 -> 1494, then 1536 -> 113). It starts 4 frames after the un-dim, about on the ASR word "thirteen" (about F329). It is a screen-space layer and does not scale with the camera pull.
- **Ride cycle (observed):** the horse's legs change every frame (on 1s, crops/horse_walk_328.png). Washington's body rides with the horse and shows little separate bob. The militia sprites jitter and bob a little. The group walks in place while the camera moves.
- **Big pull-back (estimated):** over F440-F491 (about 1.7 s, the ASR words "rode out with the army himself", F429-F490) the camera pulls out about 8x. Cumulative scale goes from 0.86 to 0.12. Per-4-frame scale factors are 0.985, 0.975, 0.962, 0.941, 0.904, 0.827, 0.696, **0.658 (F468-F472, peak)**, 0.731, 0.809, 0.871, 0.931 and 0.984. That is a clean ease-in/ease-out with its velocity peak about 55% of the way through. The fixed point is about (0.50, 0.85). The reveal adds a conifer treeline (y about 0.35-0.70) with a blue river gap, then pale mountains and a cyan sky. The army ends as a tiny rectangular block at lower right (x about 0.53-0.98, y about 0.75-0.92), with the rider at its left edge. I inferred a single large layered painting under one camera. I could not confirm parallax between the trees and the mountains at this resolution.
- **Hold:** F492-F608, 117 frames (3.9 s), on the extreme wide. The army keeps marching in place as a tiny block.

## S05 (F609-F708): road march with a "?" silhouette
- **Layers (observed), back to front:** pale sky -> teal mountain range -> brown field and road -> group (horse and rider, militia) -> a dark bush strip along the bottom edge (foreground mask) -> a bare tree at the right edge.
- **Motion (observed and estimated):** F609-F671 is a pan and pull. The scene translates strongly and pulls to about 0.66 cumulative scale, and brightness rises from 114 to 132. Three militia walk in from the right edge over F614-F616 and follow the horse. From F672 to F708 the camera is almost still (scale 0.953 over 36 frames). The horse walks on a treadmill with legs on 1s. The rider's head is steady to +-1 px (y 59-61 px). The soldiers bob (crops/road_horse_672.png).
- **Symbolic graphic (observed):** a **white dotted-outline keyhole or person silhouette with a white "?"** enters from the left edge at F632. It moves with the group and settles at about x 0.24-0.30, y 0.55-0.90 by about F668. It marks an absent or unknown party. I inferred it is the rebels who are not there, from the VO.

## S06 (F709-F896): formation and the rider fade-out
- **Composition (observed):** a top-down-ish green field. There are two blocks of 4 columns, each column 10 identical soldier sprites, all facing right with muskets pointing right, plus a partial column at the left edge. Washington on the horse faces right at the right of the blocks (x about 0.66-0.75, y about 0.30-0.45). The soldiers jitter per frame to march in place. The duplication is obvious and intended.
- **Camera (estimated):** a slow pull-back over the whole shot, cumulative about 0.74 for F709-F896. A far field band and a treeline enter at the top from about F816.
- **Rider fade (estimated):** Washington and the horse fade out by **opacity**, not by moving. They are about 100% at F839, about 50% at F848 and about 25% at F860, and gone by about F876 (about 36 frames). The formation keeps marching. The ASR words "president riding along anymore" (F843-F895) cover the fade, so the fade illustrates "nobody needed the president riding along". Hold without the rider: F876-F896.

## S07 (F897-F1019): close-up, fast reframe, LAST stamp, reaction
- **Composition (observed):** a Washington close-up facing left in three-quarter view, with smug brows and a smile. The background is a teal painted texture with a dark teal hill line. The camera is static (scale 1.0009 over 44 frames). No blink.
- **Reframe (estimated):** a **5-frame push-out and pan, F942-F946**. Per-frame scale is 0.964, 0.907, 0.878, 0.882, 0.945 (cumulative 0.64) and tx is +18, +45, +59, +57, +26 px, so the move eases in and out. Washington moves to the right third (head x about 0.55-0.95) and his navy coat with gold buttons shows. The left 55% of the frame is cleared for the stamp. The move starts on the ASR words "our last" (F938-F945).
- **Stamp (observed and measured):** it appears on **F947**, 1 frame after the reframe ends. Wording: "THE LAST PRESIDENT / TO LEAD AN ARMY / PERSONALLY". It has 3 centred lines in red bold geometric sans caps inside a thick red rectangular border, rotated **-8.0 deg** (counter-clockwise; minAreaRect -7.97 deg). The ink is about BGR (44, 44, 232) with a grungy, speckled texture. The background shows through the ink. There is no fill box, no outline and no shadow.
  - Template-matched scale per frame: **F947 3.0x, F948 2.6x, F949 2.2x, F950 1.8x, F951 1.4x, F952 1.0x (landed)**. That is a linear shrink of -0.4x per frame over 5 frames, with no overshoot and no bounce.
  - The centre drifts from (0.430, 0.413) to (0.293, 0.375) while it shrinks.
  - Landed box: x 0.042-0.554, y 0.158-0.608. The rotated rectangle is about 211x82 px, which is about 0.50W x 0.34H.
  - No flash, no shake and no scene dim. The scene is bright (light-scene variant).
- **Reaction (observed):** 4 frames after landing, on **F956**, Washington swaps from smug to worried in one frame. He gets the same arched brows, dot eyes and flat mouth as in S03, plus the light-blue sweat drop. The face drawing is identical to the S03 worried state. The pose holds 64 frames (2.13 s) to the end of the clip, with no blink and no mouth movement.

---

## Character design and rig notes (all shots)
- **Washington:** peach skin, thick black outlines (about 2.5-3 px at 240p, about 1.1-1.3% of frame height). He has a white wig with two side curls, a dark grey-green tricorne, a black cloak over a navy coat with gold buttons and a red sash. The nose is an "L" stroke. Face parts are separate swappable layers: brows (smug slant / worried arch), eyes (pupil-right / centred dot), mouth (smile curve / flat line) and an accent (sweat drop). Head, hair and hat never redraw during a swap (inferred: a face-part rig with discrete states). In the riding shots he is small and full-body on a white horse, with a large head (head:body about 1:1.5, estimated).
- **Horse:** white, black outline, cream mane and tail, stick-like legs that redraw every frame (on 1s) in a walk cycle. The horse travels very little and the camera or background carries the motion.
- **Militia:** one duplicated sprite. It has a tricorne, a pale face with a small mouth, a navy coat with white facings, stick legs and a musket held horizontally. Crowds are made by tiling copies in a grid with per-frame jitter.
- **Eagle mascot:** white head, yellow beak, black suit and tie, expressive brows. Arms are thin black lines with small hands. In this clip he is a silent worried listener who rises into the frame corner.
- **Farmer:** a separate design with a pompadour and grey-violet skin from an emotional tint. He has a forehead smudge and stronger cel shading than Washington.

## Text and stamp summary
| item | frames | position (x, y, w, h norm.) | style | entry/exit |
|---|---|---|---|---|
| WHISKEY REBELLION | F85-F126 | 0.13, 0.81, 0.755, 0.09 | white bold caps, thin dark outline + soft shadow | 1-frame pop with the prop; exits on the cut |
| GEORGE WASHINGTON | F284-F327 | 0.123, 0.467, 0.757, 0.104 | white bold caps, centred, no outline, over a 71% dim | 1-frame on/off together with the dim |
| 13,000 MILITIA | F332-F392 | 0.246, 0.80, 0.54, 0.10 | white bold caps, thin dark outline | 1-frame on, 1-frame off |
| LAST stamp | F947-F1019 | landed 0.042, 0.158, 0.512, 0.45 | red grunge ink, border rectangle, -8 deg | 3.0x -> 1.0x linear over 5 frames, then holds |

## Audio findings (unverified, waveform only)
- The VO runs almost continuously, so most waveform onsets are VO words. Candidates that line up with visual hits: F193 onset on the face swap (delta 0); F182 at the mascot rise (delta +2 from F180); F87 at the bottle/caption pop (delta +2); F283 vs. the dim at F284 (delta -1); F332 on the caption (delta 0, RMS jump at F333, though it is probably the VO word "thirteen"); F471 at the peak of the pull-back (possible whoosh); F940 before the reframe (delta -2).
- Stamp: `audio_onsets.csv` lists no onset at F947-F952. Per-frame RMS rises to -11.9 dB at F950-F951, 1-2 frames before the landing. That could be a stamp thud or the VO word "last". I could not separate the two.
- Music bed and ambience can't be identified from the waveform. See `audio_cues.csv`.

---

## Reusable mechanics
1. **One-frame expression swap, parts only.** Change brows, eyes and mouth, and add a sweat drop, in one frame with no in-between. Head, hair and hat stay identical. Evidence: F192->F193, F955->F956 (crops/face192.png). Starting values: swap duration 0 frames; sweat drop light blue (about #9aa6e0), about 0.04H tall, on the cheek away from the eye line; hold the new state at least 2 s.
2. **Reaction delay after a stamp: 4 frames.** The stamp lands at F952 and the face swaps at F956. Starting value: delay 3-5 frames after landing.
3. **LAST stamp slam: linear 3.0x -> 1.0x over 5 frames, rotation -8 deg, no overshoot.** It drifts about 0.14W toward its landing spot while shrinking. Evidence: F947-F952. Starting values: start scale 3.0, step -0.4 per frame, rotation -8 deg constant, red ink about #e82c2c with grunge mask at about 85-90% opacity, border stroke about 0.035H, landed box about 0.51W x 0.45H at the top-left, no dim in light scenes.
4. **Clear the stamp space with a fast camera move first.** A 5-frame eased pull-and-pan (cumulative scale 0.64, about 200 px at 240p) moves the subject to the right third. The stamp hits on the next frame. Evidence: F942-F947. Starting values: 5 frames, easeInOut, end scale 0.64, subject x-centre 0.75.
5. **Name card = hard 71% scene dim plus centred white caps, about 1.5 s, on the name in the VO.** Animation keeps playing under the dim. Dim and text switch on and off in one frame, with no fades. Evidence: F284-F327 (brightness 130 -> 37.5). Starting values: black overlay at 0.71 opacity; text at y-centre 0.52, cap height about 0.10H, width about 0.75W; duration 44 frames.
6. **Fact captions pop on and off in one frame in the lower third, on the spoken word, and do not follow the camera.** Evidence: F85, F332-F392. Starting values: white bold caps, dark outline about 1 px at 240p plus a soft shadow, box y 0.80-0.90, centred, hold 1.4-2 s.
7. **Scale reveal by a huge eased pull-back.** The camera pulls about 8x over about 50 frames with ease-in-out (velocity peak about 55% through). A small group becomes a tiny block in a painted landscape, then holds about 4 s. Evidence: F440-F491, hold F492-F608. Starting values: scale 1 -> 0.12, 52 frames, easeInOutCubic, anchor about (0.5, 0.85), background painted large enough to cover 8.3x the frame.
8. **Never fully static: slow camera drift under held shots.** Cumulative scale is about 0.95-0.97 per 100+ frames (S02, S03, S04, S06). Evidence: F55-F83, F127-F260, F709-F896. Starting value: about -0.03% scale per frame toward a pull-back.
9. **The prop and its caption enter on the same frame as a 3-frame quick pull that makes room.** Evidence: F84-F86 (scale 0.82, bottle and caption on F85). Starting values: 3 frames, scale 0.82, translate toward the side the prop enters on.
10. **Mascot pops up from the bottom edge as a silent listener in 4 frames, then holds a reaction pose.** He does not speak. The main character's reaction swap follows within about half a second. Evidence: F180-F183, swap at F193. Starting values: rise about 0.3H in 4 frames (easeOut), box about 0.16W x 0.31H at the bottom-left corner.
11. **Walk or ride in place.** Legs redraw every frame (on 1s), the rider's head is steady to +-1 px, and the camera or background provides the travel. Crowds are tiled copies of one sprite with per-frame jitter. Evidence: F340-F363, F672-F708, F709-F896.
12. **Remove a character from a group by opacity fade on the VO phrase.** Fade over about 36 frames while the group keeps animating. Evidence: F840-F876 ("president riding along anymore"). Starting values: linear opacity 1 -> 0 over 36 frames.
13. **Use an "unknown entity" placeholder.** Draw a white dotted silhouette with a "?" that travels with the group to stand for an absent or unknown party. Evidence: F632-F708. Starting values: dotted stroke about 1.5 px at 240p, about 0.06W x 0.35H, white.

## Uncertainties
- I can't hear the audio. Every SFX identity is a guess, and the stamp thud is not separable from the VO in the waveform.
- Camera scale values come from ORB fits on textured cartoon frames, so they are estimates. During the big pull-back (F464-F480) inlier counts were lower (190-320).
- I did not confirm whether there is parallax between the treeline and mountain layers in the F440-F491 reveal.
- The rider fade curve in S06 is estimated from sheet views, not measured with alpha.
- The VO words come from ASR and are approximate. Some words, such as "find on this course" and "sit on your kid", are clearly misrecognised.
