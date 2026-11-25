# Clip 08: Theodore Roosevelt, diagram and crowd

Source: `08_Roosevelt_Diagram_and_Crowd.mp4`, 426x240, 30 fps CFR, 930 frames (F000000-F000929, 0.000-30.967 s). Audio is AAC stereo at 44.1 kHz and starts at 0.000, so there is no A/V offset.
Coverage: I opened all 78 seq sheets (every frame) and also overview.png and wave.png. I checked native crops and montages in `crops/` for every cut, hit, swap, spark and the stamp (162 frames marked sheet+crop). Camera moves were measured with ORB similarity transforms. The bullet path was measured with a red-pixel mask, and the stamp with a minAreaRect.
Labels: **obs** = observed, **est** = estimated, **impl** = inferred implementation. VO comes from vo_words.csv (ASR transcript, approximate).

## Shot table

| shot | frames | s | type | purpose / motivating VO (ASR, approximate) |
|---|---|---|---|---|
| S01 | 0-142 | 0.000-4.767 | staged environment (campaign posters + crowd) | the third-party run: "...convention get started... according to... Bull Moose party". BULL MOOSE caption at F073 |
| S02 | 143-317 | 4.767-10.600 | staged environment, tracking walk + date/place captions + hit FX | "on October fourteenth 1912 in Milwaukee... [was] shot in the chest". The hit is at F240 (8.0 s), just after "hand" (F232) and before "shot" (F274). The visual leads the word by about 1 s |
| S03 | 318-528 | 10.600-17.633 | diagram (cross-section) + presenter | "the bullet... [slowed by] the fifty-page speech... in his steel glasses case... so it stopped" |
| S04 | 529-618 | 17.633-20.633 | staged environment (callback to S02 location) | "and he gave the speech anyway". The get-up at F570 lands on "gave" (F565) / "the speech" (F576-579) |
| S05 | 619-663 | 20.633-22.133 | staged environment, wide crowd + stage | "leading to a [speech] for over an hour" |
| S06 | 664-686 | 22.133-22.900 | presenter-less close-up at podium | "over an hour" |
| S07 | 687-779 | 22.900-26.000 | combination: two-shot face-off on a stylised fire plate | "...he finished second [ahead of Taft]..." |
| S08 | 780-929 | 26.000-31.000 | staged environment then stamp | "...making him the last third-party candidate to ever beat [one of the big two]". The stamp lands F848-853 on "in the last" (F850-856) |

Cuts are all hard cuts (metric spikes at F143, 318, 529, 619, 664, 687, 780). None is a dissolve.

## S01 posters (F0-142)
- **Blocking / reveal (obs):** the tableau is fully built at frame 0. Two wood-framed portrait panels on stands are the focal pair. TR's panel is on the left (x~0.10-0.45, y~0.02-0.80). Taft's panel is on the right (x~0.58-0.93, y~0.08-0.82). A row of small crowd heads/busts sits in the foreground along the bottom (y~0.62-1.0), partly in front of the panels. Behind are a lawn, a pink Georgian building (centre, between the panels) and a pale sky. The eye goes to the two faces first, then to the caption.
- **Layers (back to front):** sky/clouds -> building + trees -> lawn -> panel frames (wood #886b44, light inner bevel) -> portrait art inside each panel, plus a diagonal pale glass-glare stripe drawn OVER the portrait -> foreground crowd -> caption. impl: the glare is its own layer above the portrait, so the portrait face can be animated beneath it ("living portrait").
- **Camera (obs, measured):** slow continuous pull-out from scale 1.000 to 0.970 over 142 f, drifting tx +5 px. That is about 0.02 %/frame, nearly linear.
- **Acting:** TR (in the poster) keeps one grumpy face with a half-open mouth. His lids/pupils toggle between forward and lowered side-glance in irregular 3-6 f holds (F0-2 forward, F3-8 lowered, ...; est., crops/c_tr_eyes.png). Taft holds a smug smile with a sweat drop for F0-44. At **F045** he swaps on a single frame to worried: inner brows up, mouth turned down, sweat drop removed (obs, crops/c_taft_swap.png). He holds that to the cut. The motivating VO is around "is all according to" (F45-58).
- **Text (obs):** `BULL MOOSE` is white, uppercase, heavy geometric sans (Montserrat ExtraBold-like), with a soft dark drop shadow and no box. It sits bottom-centre (centre x~0.50, baseline y~0.90, cap height ~0.07 h). It hard-pops on at **F073** (1 frame, no scale, no fade) and is held 70 f to the cut.

## S02 walk and the shooting (F143-317)
- **Blocking (obs):** three characters walk right in a tight overlapping group. The bodyguard (grey hair, stern) is left at x~0.02-0.20. TR (glasses, moustache, shouting) is centre at x~0.20-0.40. The eagle presenter (suit) is at x~0.38-0.60. They stand on grey pavement (#a0a0a0), with a hedge band and trees behind and a blue sky (#badde4).
- **Tracking walk (obs, measured):** the characters walk *in place*, drifting only about +0.6 px/f. The BG (measured on the top 40 px strip) scrolls left 196 px over 88 f, i.e. 2.2-2.6 px/f ~ 0.0055 w/f, plus a slow push of 1.000->1.073. Legs are single black strokes that bend per frame (on 1s). One step is about 16-20 f (est.). Arms swing.
- **Captions (obs):** `OCTOBER 14, 1912` is already on at the cut (F143). It hard-swaps to `MILWAUKEE` at **F196**, which is off at **F257**. Same style as BULL MOOSE: white heavy sans with a soft shadow, bottom-centre, cap height ~0.08 h.
- **The hit (obs, crops/m_236_259.png):** at **F240** a red jagged spiky burst (#fc1a1d core, soft red glow, spikes radiating up-right) appears at TR's chest. TR is flung LEFT out of frame in 3-4 frames, and the burst travels with him: F241 he overlaps the bodyguard, F242 he is at the left edge, F243 TR is gone with the burst at the edge, F244 a sliver remains, F245 it is clean. That is roughly 45 px/f with no anticipation and no squash.
- **Speed streak (obs):** F247-250 (4 f): white jagged wedge streaks fan from the top-left corner, covering about x 0-0.35, y 0-0.6. They are a hard on/off accent for TR's exit trail.
- **Scroll stop (obs, measured):** BG scroll drops from about 2.4 to about 1 px/f exactly at F240 and eases to 0 by F280. The walk stops.
- **Deadpan (obs):** from F245 to F317 the bodyguard and eagle freeze in their mid-stride poses with unchanged stern frowns. The bodyguard's eyes are side-glancing (est.). Nobody reacts for 73 f (2.4 s). The gag is the non-reaction.

## S03 cross-section diagram (F318-528)
- **Plate (obs):** a near-black matte (#191916) with dark-red rounded blobs (#411514, "body tissue") at the far left. The vertical bands read left to right:
  1. A light tan paper strip (#d5c8b7) with white vertical hatch strokes = the speech, at x~0.17-0.33.
  2. A brown rounded slab (#6a3f20) with a cream inner outline = the glasses case, at x~0.37-0.55.
  3. A thin grey/black curved band = the chest wall / coat, at x~0.57-0.63.

  Everything is drawn in the same thick ink line as the characters. impl: each band is a separate layer, all parented to one slowly drifting group.
- **Drift (obs, measured):** the whole plate drifts right about 0.08 px/f (paper edge x 72->88 px over 210 f), a near-imperceptible "alive" move.
- **Bullet (obs, measured, red mask):** a red capsule bullet (#e43433, dark ring line) with a wavy white flame-wisp trail enters from the right edge at **F344**. Tip x moves 423->244 px over F345-424, at 2.6 px/f slowing to 2.0 px/f.
  - **Spark 1, F425-431 (7 f):** a yellow jagged burst (#e0d653) with glow at the chest-wall/case contact, hard on/off. The bullet is hidden under it.
  - From F432 to F497 the tip moves 230->144 px through the case, at 1.6 then 1.1 px/f.
  - **Spark 2, F498-504 (7 f):** at the case/paper contact.
  - From F505 to F528 the tip moves 136->122 px (0.6 px/f), effectively stopped in the paper. The trail stays visible but is masked behind the chest-wall band (impl: the trail is clipped on the layers it has passed).

  Each layer cuts the speed: about 2.4 -> 1.4 -> 0.6 px/f. That is the visual explanation of "it stopped". The total explanation is 7 s, with about 3 s of slow creep before the first contact.
- **Presenter (obs):** the eagle slides in from the right edge during spark 1 (F426-432, about 7 f, bottom-anchored, ending at x~0.73-1.0). He points his left arm at the bullet with his right index finger raised (lecture pose), stern/serious, and holds to the cut with a small idle.

## S04 down and get-up (F529-618)
- **Blocking (obs):** the S02 park location is re-framed closer. TR lies flat on his back across the lower middle (head left, about 90 deg rotation of the standing puppet), eyes open behind his glasses, mouth open. A grey translucent smoke wisp rises and curls from his chest. The bodyguard leans in at the left (sweat drops, open mouth). The eagle is at the right, side-on, with sweat drops.
- **Camera (obs, measured):** a continuous pull-out from scale 1.000 to 0.902 over 88 f (tx +20, ty +17). It runs straight through the get-up.
- **Get-up (obs):** a **1-frame swap at F570**. There is no anticipation and no in-between, and the smoke vanishes. TR is now upright, angry (brows down, shouting moustache mouth), with a red blood spot on his chest. He marches right with legs on 1s. The bodyguard and eagle keep their shocked sweating poses. TR exits frame-right from about F604 to F618 (est. 5-6 px/f in frame). VO: "he gave the speech anyway".

## S05 crowd (F619-663)
- **Layout (obs):** a dense crowd of small duplicated bust characters fills the left 2/3 and the bottom. Hair colours (blond, brown, black, grey) and outfit colours (pink, blue, brown) are varied. A wooden stage block is at the right (y~0.45-1.0). A blue lectern with the seal and a red-brown base stands on stage, with TR at it. Behind is a row of painted multi-storey townhouses in desaturated blue/pink/beige under an overcast grey-green sky.
- **Camera (obs, measured):** a linear push-in from 1.000 to 1.078 over 44 f toward the upper right/stage (tx -22, ty -14).
- **Action:** the eagle's head appears at the left edge at about F640 and moves right through the crowd to x~0.35 by F663 (est.). At F657 TR swaps to holding up the speech paper and shouting (obs). The crowd shows no clear individual animation (est.).

## S06 podium close-up (F664-686)
- TR is on the right half (head x~0.65-0.90) with a blue seal lectern (#474f8b) and mic at the left/centre. The blood spot shows on his shirt. Townhouses and clouds are behind.
- His mouth alternates grimace-with-teeth and open O in about 7 f holds (664-666 / 667-673 / 674-680 / 681-686; est.). Brows stay angry. There is per-frame body jitter (region diff about 5/frame).
- There is no camera move (scale 1.005).

## S07 fire-wall face-off (F687-779)
- **Plate (obs):** a flat cartoon flame wall: yellow #fdfc94 at the bottom, then orange, then red #df1319 tongues, under black smoke (#0c0c0c) at the top, with small ember dots. The flames **morph smoothly per frame** (region diff about 0.6/f, with about a 30 f undulation) rather than cycling drawings on 2s. impl: a displacement/turbulence loop over a painted flame layer plus a particle layer. This corrects the earlier note that said "on 2s".
- **Blocking (obs):** Taft is on the left in three-quarter view facing right, in a tan coat and brown vest, with a red anger mark on his temple and a scowl. TR is centre-right facing left, shouting with gritted teeth. Both wear warm fire-tinted rim colour. The eagle head rises from behind Taft at the top left over **F689-698** (about 10 f, eased in-out), with worried brows and sweat. It then stays peeking for the rest of the shot.
- **Action:**
  - The two puppets shuffle and bob per frame (on 1s).
  - F736-747: TR leans in until their faces touch (head-butt).
  - F748-756: Taft slides out of frame left (shoved).
  - F757-779: TR walks right along the fire, alone except for the peeking eagle.
  - Camera: static (ORB on the eagle/fire gives tx ~ +10 px total, est.).

## S08 forest stomp + stamp (F780-929)
- **Layout (obs):** a sand clearing (#d3c892) with a horizon at y~0.57, a green tree line and a pale grey waterfall/cliff band at the left (#c7d0d1). TR stands at x~0.43-0.62, y~0.25-0.97 in a fists-up boxer pose.
- **Idle (obs, measured):** a continuous rocking stomp: alternating legs bend and the body sways side to side. The cycle is about 27 f, all per-frame, and continues unchanged under the stamp hold. A slow push runs 1.000->1.026 by F834.
- **Pre-stamp push (obs, measured):** F843-852 fast push toward TR with scale 1.022, 1.055, 1.098, 1.151, 1.205, 1.254, 1.309, 1.359, 1.385, 1.406, then 1.407 at F853 (ease in-out, +40 % in 10 f, ty -38 px). TR ends as a right-side medium close-up (head x~0.62-0.90).
- **Stamp (obs, crops/c_stamp.png):**
  - Text: three lines, uppercase, centred: `THE LAST THIRD-PARTY / CANDIDATE TO EVER BEAT / ONE OF THE BIG TWO`.
  - Style: bold geometric sans in white with a grainy/noise ink texture. The text sits inside a white grainy rectangular outline (stroke ~0.02 h) over a translucent dark fill (~#393b38 over the dimmed BG).
  - F848: oversized (est. ~2.5x, overflowing all frame edges) and **semi-transparent**, so TR shows through.
  - F849-852: est. ~2.15, 1.95, 1.68, 1.27 (accelerating toward the end, i.e. ease-in "slam", no overshoot).
  - **F853 settled:** rotated box 210x81 px, rotation -8 deg (rising to the right), centre (0.298, 0.383), axis-aligned box x 0.042-0.554, y 0.158-0.608. It is placed in the empty left half, beside TR's face.
- **Dim (obs, measured):** the frame mean drops 124 -> 64 over F848-853 (about -50 %) at the same time as the stamp, then holds. The stamp stays bright.
- **Hold:** F853-929 (77 f, to clip end). TR keeps stomping with his angry face (no reaction swap).

## Character design / rig notes (all shots)
- Head:body is about 1:1.3. The head (with hair) is about 40-45 % of figure height. The torso is a rounded rectangle (black suit with white shirt-front and a tie). The limbs are **single black strokes** with no joints drawn. Hands are small round black mitts, and feet are hook strokes. impl: a stroke/path rig (bend per frame) rather than segmented puppets, so joints never show.
- The outline is black, about 2 px at 240p (~0.008 h), uniform. Fills are flat with no shading. Skin is #fedfc7. TR's glasses are thin circular rims with dot pupils.
- Independent parts (obs): brows, eyelids/pupils and mouth swap independently. Examples: TR's eye toggles while his mouth holds (S01), and Taft's whole face swaps (S01). Accents (sweat drops, the anger mark, the blood spot) are separate overlay layers that appear and disappear on swaps.
- Pose changes are **hard swaps** (F045, F570, F657) with no in-betweens. Continuous motion (walks, rocking, bob) is per-frame.

## Mascot role (eagle)
The eagle plays four roles across the clip:
- Bystander in the walk (S02/S04), with a deadpan freeze, then sweat.
- Lecturing presenter who slides in to point at the diagram (S03, F426-432).
- A crowd member wading in (S05).
- A worried head peeking from the top-left corner behind the fighters (S07).

He never speaks on screen here (beak closed).

## Audio (waveform only, unverified)
- The VO lane is from ASR (vo_words.csv) and is continuous across the clip with no music-only gaps visible.
- Onset candidates that coincide with visual hits all **lead the visual by about 3-5 frames**:
  - knockback 236/240, a loud onset at -11.8 dB
  - bullet entry 340/344
  - spark 1 421/425
  - spark 2 494/498
  - stamp 844/848
- Cuts align within +/-1 f (529, 620/619, 665/664).

See audio_cues.csv. Sound identities are blank or "estimated" only.

## Reusable mechanics
1. **Hit = burst + instant exit + scroll stop.** F240-244: a red jagged burst at the impact point and the victim flung off-frame in 3-4 f carrying the burst. The walk BG scroll stops on the same frame. Starting values: burst 0.35 w, knockback 45 px/f at 426 w (~0.1 w/f), 4 f.
2. **Delayed accent streak.** F247-250: a 4-frame white wedge-streak burst from the corner the victim exited, 3 f after the exit. Hard on/off, no fade.
3. **Deadpan freeze after the gag.** F245-317: the survivors freeze mid-stride with unchanged faces for >=2 s. The comedy is the non-reaction. Hold 60-75 f.
4. **Tracking walk = in-place walk + scrolling BG + slow push.** F143-239: BG 0.0055 w/f, push +7 % over 3 s, legs bend on 1s, step ~16-20 f. Captions bottom-centre, hard swap date -> place (F196).
5. **Cross-section explainer with per-layer deceleration.** F318-528: flat ink bands on a black plate. The projectile creeps in at about 0.006 w/f and loses roughly 40 % of its speed at each layer, marked by a 7-frame yellow spark at each contact (F425, F498). The presenter slides in on the first spark (about 7 f) to point. Give about 3 s of approach before the first contact.
6. **One-frame state swap for comic recovery.** F570: lying -> upright angry with a new accent (blood spot), no anticipation, while the camera pull-out continues uninterrupted. Use the same rule for expression swaps (Taft F045).
7. **Living-poster panels.** S01: animate the faces inside framed portraits under a fixed glare stripe, with a slow pull-out of -3 % over 4.7 s. Caption hard-pops at about 2.4 s.
8. **Fire plate = smooth morph + embers.** S07: flat 3-tone flame wall with a black smoke top, per-frame displacement loop (~30 f) and ember particles. Characters get warm tint. A mascot head peeks from the corner (rise 10 f eased).
9. **Stamp recipe (clip 08 variant).** F843-853:
   - fast eased push-in, +40 % over 10 f, starting 5 f before the stamp, re-framing the subject to one side
   - stamp starts at about 2.5x scale, semi-transparent, and slams to 1.0 over 5 f (ease-in), rotated -8 deg, in the empty half of the frame
   - scene dims about 50 % over the same 5 f
   - subject idle continues under the hold (77 f)
   - SFX onset leads the landing by about 4 f
10. **Audio lead.** Impact SFX onsets sit about 4 f before the visual hit frame (F236/240, 421/425, 494/498, 844/848). Start with -4 f offsets (unverified, waveform only).

## Uncertain / not verified
- No sounds were heard; all audio cues are waveform-only.
- Crowd micro-animation in S05 was not measured.
- The S05 eagle path and the S04 exit speed are estimates.
- The stamp's oversized scale at F848-851 is estimated from clipped boxes.
- Walk step length is estimated (the caption occludes the feet in S02).
- The ASR transcript is approximate ("bought the bullet", "t paid speech").
