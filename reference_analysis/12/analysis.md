# Clip 12: George H. W. Bush, plane and rescue (analysis)

Source: `12_Bush_Plane_and_Rescue`, 1050 frames, 426x240, 30 fps (F000531 = 17.700 s). All 88 seq sheets opened (F0-F1049). Native crops and measurements are in `crops/`. Labels: **observed** (seen or tracked), **estimated** (measured with visible uncertainty), **inferred** (implementation guess). The VO lane comes from `vo_words.csv` (ASR transcript, approximate). No audio was played.

Note on coverage: I opened every frame on the sheets. Sheet notes for F0-F323 were rebuilt from crops (`crops/m_open.png`, `m_map.png`, `m_hit.png`) and from per-frame tracking. They were not written down while the sheets were on screen.

## Shot table

| shot | first-last | start-end s | type | story purpose / motivating VO (ASR approx.) |
|---|---|---|---|---|
| S01 | 0-48 | 0.000-1.633 | staged environment + name card | Introduce Bush. "George H. W. Bush" (0.06-1.24) |
| S02 | 49-122 | 1.633-4.100 | staged environment (cockpit close-up) | "turned eighteen six months after Pearl Harbor" |
| S03 | 123-240 | 4.100-8.033 | staged environment (vehicles on cloud plate) | "join(ed) the Navy that same day ... one of its youngest pilots" |
| S04 | 241-398 | 8.033-13.300 | map + date/place captions | "So on September 2, 1944, over Chichi Jima" |
| S05 | 399-479 | 13.300-16.000 | staged environment + FX (hit) | "...got his bomber hit..." (ASR "not his bomber to the kids") |
| S06 | 480-626 | 16.000-20.900 | staged environment (cockpit on fire, reaction) | "...pushed on... drop his bombs on target and only then bailed out" |
| S07 | 627-746 | 20.900-24.900 | staged environment (wreck) + name caption | "his two crewmen, John Delaney and Ted White, never got out" |
| S08 | 747-821 | 24.900-27.400 | staged environment (survivor) | "So Bush floated alone ..." (ASR "bullish old and alone under wraps until the") |
| S09 | 822-1044 | 27.400-34.833 | staged environment (rescue) + place caption | "...submarine USS Finback ..." then "...for the rest of his life" |
| S10 | 1045-1049 | 34.833-35.000 | next segment (lawn line-up + date) | caption "JANUARY, 1993" |

All 9 transitions are 1-frame hard cuts (C01-C09 at F49, 123, 241, 399, 480, 627, 747, 822, 1045). There are no dissolves or wipes. The S01→S02 "cut" is the same plate with the dim and card removed. Average shot length is about 3.5 s, with a range of 2.5-7.4 s.

## Per-shot breakdown

### S01 (F0-48): dim title over cockpit
- **Blocking (observed):** the cockpit close-up from S02, dimmed to about 28% brightness (mean luma 39 vs 138). There is no vignette, just a uniform multiply. The plate keeps its turbulence bob under the card.
- **Text (observed):** `GEORGE H. W. BUSH`, all caps, white, bold geometric sans (Gotham/Montserrat-like), thin black outline (about 1 px at 240p) plus a slight dark shadow. It is centred: box x 0.146-0.853, y 0.458-0.542, cap height about 0.083H, at eye level across the goggles. It is already on at F0, so the clip starts on it. It holds for 49 frames.
- **Exit (observed):** the card disappears and the full brightness returns at F49 in a single frame (no fade), on VO "turned".

### S02 (F49-122): cockpit, calm
- **Layers (back to front, inferred):** sky plate (light blue, soft clouds, barely moving) → canopy frame bars plus right-hand dark pillar → Bush (helmet, goggles, face, jacket) → seat back (brown) → yoke and stick arms. The bars, Bush and yoke move as **one group**.
- **Camera / turbulence (observed, tracked):** the whole foreground group bobs vertically with dy between -3 and +1 px (0.017H peak-to-peak). It has no x motion. The motion is sine-like with a period of about 12.5 f (troughs at F54, 67, 80, 92, 105, 117). E04.
- **Character design (observed):** large round dark-brown leather helmet; thick white rectangular goggle rims with a grey strap; dot pupils under half-closed lids; small nose hook; closed contented smile; peach skin; brown jacket with a scalloped fur collar and white shirt V; stick arms (single black lines) ending in round fists on the yoke. Black outline about 2 px at 240p (≈0.8% H). The head (helmet) is about 0.45 of the frame height in this close-up.
- **Acting:** calm and proud. I found no blink and no mouth swap (the region residual only follows the sub-pixel bob). Estimated. E05.

### S03 (F123-240): bomber formation on the cloud plate
- **Vehicle design (observed):** a detailed painted TBM Avenger. Navy blue-grey with gradient shading, a white star roundel, the "SK" tail code, a striped (corrugated) wing with white highlights, and a two-blade propeller drawn as a blurred stroke. It is rendered with more shading than the characters.
- **Motion (observed, tracked):** the lead plane stays fixed at x 0.12-0.97, y about 0.03-0.58 and bobs vertically (0 to -4 px, period about 24 f, troughs at F143/167/191/216). The **cloud plate scrolls right at a constant +15 px/f (0.035W per frame)**, which reads as flying left. E06/E07.
- **Wingman (observed):** it enters from the right frame edge at F159, lower right, smaller (height 0.36H vs 0.55H, so it reads as farther back). Its left edge travels 0.958→0.484 over 81 f, about 2.5 px/f with a slight ease-out (2.8→2.0 px/f). It has its own ±1.5 px bob out of phase with the lead plane and is still moving at the cut. E08.
- **Propeller:** the drawing changes between frames (blur stroke). Its cadence was not measured.

### S04 (F241-398): Western Pacific map
- **Basemap (observed):** textured mottled blue ocean. Land is flat greige/tan (Asia), with lighter lilac/grey and darker green-grey tints for other countries. Each coastline has a black outline plus a **light blue-white offset halo ring** (stylised coastal shelf). Japan, Korea, Taiwan, the Philippines and Indochina are visible. There are no country labels.
- **Pin (observed):** a red ring with a white centre (16-18 px ≈ 0.07H) on open ocean at about x 0.566, y 0.65 (Chichi Jima). It is present from the first frame, with no pop. It scales with the map.
- **Camera (observed, ECC):** slow **ease-out push-in**: scale 1.000 → 1.015 (F260) → 1.049 (F300) → 1.078 (F340) → 1.099 (F398). The fixed point is about (0.50W, 0.90H), so the pin drifts gently up toward the centre. E09.
- **Captions (observed):** `SEPTEMBER 2, 1944` hard-pops at F268, on VO "September" (F267). Box x 0.160-0.843, y 0.804-0.908, centred. It holds 89 f, then **swaps in one frame** to `CHICHI JIMA` at F357 (VO "Chichi" F358; box x 0.284-0.716), which holds 42 f to the cut. The captions are screen-locked: they do not scale with the push. E11/E12.

### S05 (F399-479): the hit, in three separate stages
- **Base (observed):** a closer plane shot. The plane is centred (x about 0.13-0.88) with a vertical bob of -2 to +1 px at a period of about 12.5 f. The sky scrolls faster than in S03: **+27 px/f (0.063W per frame)**. This higher speed raises the energy before the hit. E13/E14.
- **Stage 1, F432-434 (3 f) (observed):** a red comet/flame streak appears **fully drawn** in its final position. Its tail runs up-left and its head touches the canopy. Bbox x 0.251-0.350, y 0.204-0.517. It does not travel in; the shape just wobbles slightly. E15.
- **Stage 2, F435-439 (5 f) (observed):** a white jagged spike burst (5-6 spikes fanning up and right from the canopy). On F435 it overlaps the fading red streak. It grows slightly (white pixel count 888 → 982). Bbox about x 0.25-0.37, y 0.31-0.47. E16.
- **Stage 3, F440 onward (observed):** a hard swap to fire. Flat cartoon flames (orange body, yellow core, red tips, soft orange glow) run along the whole top of the fuselage (x 0.197-0.756, y 0.017-0.46), and a **yellow highlight fills the tail panel**. Frame brightness drops 179 → 170. The flames redraw on 1s (1.6-3% mask change per frame) without an exact loop. The plane keeps its bob. E17.
- **Sequence timing:** red 3 f → white 5 f → fire hold 40 f, then cut. The red streak lands about 10 f after the VO word ASR "kids" (likely "hit", F422) (inferred).

### S06 (F480-626): cockpit on fire, reaction
- **Same cockpit set as S02, regraded (observed):** the sky is now dusky purple-grey with orange flames rising behind every canopy pane. The pillar is darker. Mean brightness is 105 vs 138 in the calm version.
- **Layers moving separately (observed, tracked):** the canopy bars still bob at the house turbulence rate (-1 to +2 px, about 12.5 f). **The head now moves independently** of the plate, with a larger and slower irregular drift (-4 to +3 px, troughs at F503/529/555/592/617). This reads as strain or tremble. In S02 the head was locked to the plate. E18/E19.
- **Expression (observed):** a single held grimace drawing. Brows are angled down and in inside the goggles, the eyes are squinted, and the mouth is a wide clenched-teeth rectangle with tooth lines. I found no blink or swap (estimated). E20.
- **Fire (estimated):** redrawn on 1s, with a near-repeat about every 21-22 f (also 42 f). This suggests a looping flame comp. Inferred: flat flame art with turbulent displacement, or a 21-frame loop. E21.

### S07 (F627-746): wreck burning on the water
- **Layout (observed):** static camera. Light sky with painted clouds (static). Horizon at about y 0.50. Mid-blue ocean with white wave-line strokes and darker blue shape bands. The plane wreck sits on the water at centre, engulfed in a large flame mass (x about 0.25-0.92, top y about 0.02) with a red outer glow. Flames redraw on 1s, with a lower-difference frame every 4th frame (estimated). The water only shimmers. E22.
- **Caption (observed):** a two-line centred caption `JOHN DELANEY` / `TED WHITE` (x 0.265-0.751, y 0.692-0.896). It hard-pops at F665, exactly on VO "John" (F665), and holds 82 f until the cut. It sits on the water below the fire. E23.

### S08 (F747-821): survivor alone in the raft
- **Layout (observed):** a full-frame water plate. Dark, mid and light blue bands, white wave strokes, and translucent lighter wave shapes sliding across. There is no horizon, which gives a feeling of isolation. Bush sits right of centre in a white donut raft. A light-blue foam patch sits under the raft.
- **Motion (observed, tracked):** raft, body and head **translate together**. They drift left at a linear -0.66 px/f (-0.117W over the shot) and bob vertically ±2-3 px at a period of about 12.5 f. **There is no rotation** (angle constant at -1.5°), so the earlier note of "±5° rocking" is wrong. The head trails the raft by 0-1 f in the vertical bob (slight overlap). The foam follows with about 2 px lag and its own shape cycle of about 29-30 f. The water drifts about +1 px/f and deforms. E24-E26.
- **Expression (observed):** dazed and worried. Brows are raised, eyes squinted, and the mouth is a small open "o". **Red zig-zag scratch marks** sit on the helmet, cheek and jacket as damage accents. The drawing is held for the whole shot. E27.

### S09 (F822-1044): rescue by the USS Finback
- **Layout (observed):** a high-angle view down the submarine bow. The grey deck with plank texture and diagonal shading fills the lower-left half as a big foreground diagonal. It has a bollard and cleat, a hatch ring at the bottom edge, and a dark outline. Two small sailors (white Dixie caps, navy uniforms, stick legs) stand mid-deck at the right edge. Bush in the raft is small at the upper right (x about 0.75, y about 0.38) on the open water plate. The water is the same style as S08.
- **Camera (observed):** a slow **linear push-in across the whole shot**. Raft width 33 → 46 px, near sailor cap 16 → 24 px, spacing between the sailor caps 35.9 → 49.7 px, so about 1.35-1.45x over 222 f (≈0.17% per frame). The content drifts left and the bottom hatch leaves the frame (`crops/m_sub.png`). The small differences in growth between the raft and the sailors suggest the layers scale at slightly different rates (mild parallax; estimated). E28.
- **Acting (estimated):** the near sailor faces right toward the raft with an open mouth (calling). The far sailor looks right. There are small 1-2 px idle changes. The raft bobs independently of the deck. I could not resolve sailor mouth cadence at this size (`crops/c_sailors.png`). E29/E30.
- **Caption (observed):** `USS FINBACK`. Box x 0.268-0.735, y 0.808-0.892. Hard-on at F856 (VO "USS" F855), hard-off at F905, 49 f hold, while the shot continues for 140 more frames without a caption. E31.

### S10 (F1045-1049): next segment
A hard cut to the White House lawn line-up of seven presidents, with `JANUARY, 1993` already on (box x 0.232-0.765, y 0.817-0.921). It belongs to the next clip. E32.

## Mascot role
The mascot (eagle/Quill role) is **absent** in this clip. The beat runs as pure narration over staged reenactment.

## Camera and compositing summary
- Static framing with **group bobs** (cockpit and planes) instead of camera shake. The impact is sold by FX, not by shaking the camera.
- Two slow push-ins: the map (ease-out, +10% over 5.3 s) and the rescue (linear, about +40% over 7.4 s).
- Background scroll gives the speed: sky +15 px/f in the cruise shot, +27 px/f in the hit shot.
- Grade swaps: a uniform dim to 28% under the name card; the cockpit regraded from blue day to dusky purple with fire for the post-hit callback.

## Text summary
Every caption is white bold geometric sans, all caps, with a black outline and a soft shadow, horizontally centred (cx 0.50). Date, place and ship captions sit on a baseline at about y 0.89-0.91 with a cap height of about 0.085H. The two-line crew caption starts higher (y 0.69). The name card is centred vertically at y 0.46-0.54 over the dimmed plate. **Every caption enters and exits with a 1-frame hard pop**: no fade, no scale. Captions land on the first frame of their VO word (deltas -1 to +1 f vs ASR). Holds were 89, 42, 82 and 49 f. There is no stamp in this clip.

## Audio findings (unverified, waveform only)
The VO runs continuously across all cuts (ASR lane). Waveform onsets fall within -7 to +7 f of every cut and caption (`audio_cues.csv`), but most coincide with VO syllables, so they cannot be separated as SFX. Two onsets at 14.31 s and 14.43 s (F429 and F433) fall 2-3 f before the red streak and white burst. They are a possible flak or impact hit, with identity unverified. A long gap with no onset (14.43-16.73 s) covers the fire and the cut into the cockpit fire. If fire ambience is present, it has no sharp onset.

## Reusable mechanics
1. **Three-stage hit, built from separate FX layers** (F432-440): pop a fully drawn red projectile streak with no travel-in, ending on the target, for 3 f; then a white jagged spike burst at the contact point for 5 f (1 f overlapping the streak); then hard-swap to a full fire overlay plus a yellow damage highlight panel. Starting values: streak 3 f, burst 5 f growing ~10%, fire on 1s. Let the vehicle's bob continue unchanged.
2. **House bob of about 12.5 f** (≈0.42 s), ±1.5-3 px at 240p (0.6-1.2% H), sine-like. It appears on the cockpit plate (F49-122, F480-626), the hit plane (F399-479) and the raft (F747-821). The slower cruise bob is 24 f, ±2 px (F123-240). Give separate objects different phases.
3. **Calm vs distress uses the same set:** reuse the cockpit framing, regrade the sky (blue → dusky purple), add a flame layer behind the panes, swap the face to a held grimace, and **detach the head from the plate bob** (head ±3-4 px on an irregular 25-37 f drift) (F49-122 vs F480-626).
4. **Speed via background scroll, not vehicle travel:** hold the vehicle in frame and scroll the sky (+15 px/f cruise, +27 px/f action at 426 px width, i.e. 0.035W and 0.063W per frame). Bring a formation partner in from the frame edge at about 2.5 px/f with a slight ease-out, smaller for depth (F159-240).
5. **Map beat:** pin present from the first frame; slow ease-out push to 1.10x over about 5 s anchored near the bottom-centre; screen-locked bottom caption that hard-swaps date → place in one frame on the VO word (F268, F357).
6. **Captions:** 1-frame hard on/off on the exact VO word. Centred, white bold caps, black outline plus soft shadow, baseline at y 0.89-0.91, cap height about 0.085H. Two-line name lists start at y 0.69. Hold about 1.4-3 s (F268-356, 357-398, 665-746, 856-904).
7. **Name intro by dimming the opening shot:** multiply the opening plate to about 0.28 brightness with the centred name card. The motion keeps running underneath. Remove the card and restore brightness together in one frame on the next VO phrase (F0-49).
8. **Survivor and rescue staging:** a lone character in a raft on an endless water plate with no horizon, drifting slowly left (-0.66 px/f) and bobbing; raft, body and head as one group, with no rocking rotation; foam on its own 30 f cycle; damage scratches as red zig-zag accents (F747-821). Then reveal the rescuer with a high-angle foreground diagonal deck, small figures, the survivor small in the far corner, and a slow linear push (+40% over 7 s) (F822-1044).

## Uncertainties
- Propeller cadence, sailor mouth cadence and the exact rescue-push curve were only partly measured. The 1.35-1.45x estimate comes from landmark sizes, because the ECC fit failed on the plank texture.
- Fire is redrawn on 1s, but whether it uses procedural displacement or hand-drawn loops is inferred.
- Every SFX identity is unverified, since no audio was played.
