# Per-clip analyst brief (read fully before starting)

You are the frame analyst for ONE reference clip. The user's full assignment is in
/home/user/my-video/reference_analysis/_brief.md. Read sections 1, 2, 3 (your clip's row) and 5 (deliverables) carefully:
those are the rules. You do the per-clip part only (sections 1-3 and the per-clip files of section 5). Do NOT write the
production spec, shot plan or pilot; the lead does that from all 13 reports.

## Your folder (already prepared by the lead; do not re-decode)
D = /home/user/my-video/reference_analysis/<NN>
- frames/%06d.png      every frame, lossless, 0-based (F000531 = index 531 = 17.700 s)
- frame_timestamps.json, probe.json
- frames.csv           skeleton: one row per frame, inspection_status "decoded only". YOU fill shot_id, visual_state_id, event_ids, inspection_status.
- metrics.csv          per-frame mean_absdiff, changed_frac_gt40, max_cell_diff (8x6 grid, catches small region changes like brows/mouths), brightness. Spikes are CANDIDATES only.
- sheets/overview.png  ~1 fps overview
- sheets/seq_FAAAAAA-FBBBBBB.png   EVERY frame, 12 per sheet (4x3), labels outside the picture. You must open EVERY seq sheet.
- sheets/wave.png      audio envelope (5 s per row) with red onset ticks labelled with mapped frames
- audio_onsets.csv     waveform-derived onset candidates (UNVERIFIED)
- vo_words.csv         offline ASR word timings of the narration (approximate words, ~0.1 s timing). Use for the VO lane and to find the phrase that motivates each visual beat.
- progress.md          keep it updated as you go (sheets covered, last verified frame).
- mix.wav              the audio (you cannot listen; see Audio below)

Tools: Python 3 with numpy, PIL, opencv (cv2), scipy. For crops: save to D/crops/ (e.g. native crop then resize x3 LANCZOS) and open with the Read tool.
Neighbouring clips are in /home/user/my-video/reference_analysis/<NN±1>/ (look at their first/last seq sheet only if a beat continues across the boundary).
Prior notes from an earlier, coarser pass: /home/user/my-video/.claude/skills/2d-animation/references/clip-notes.md (your clip's section). Treat as hints, not evidence; correct them where wrong.

## Method (the user's rules, condensed)
1. Open sheets/overview.png and wave.png, list candidate shots/events from metrics.csv.
2. Open EVERY seq sheet in order. Note for every shot: establishing state, first visible change, anticipation, action, overshoot, recovery, hold, cut. Track each changing layer separately (each character's face/head/arms/body, mascot, props, camera, BG, FX, text).
3. For every cut, pose swap, graphic entrance, impact, stamp and finish, open native crops of the frames before/after (and region crops of brows, mouth, hands, feet, text). Decide whether parts move per frame, on repeated drawings (2s/3s), or mixed. Keep real irregular durations.
4. Measure: positions/boxes as normalized top-left x/width, y/height; scales; rotation; frame counts; easing (from sampled positions); idle/bob amplitude (px at 240p and normalized); blink interval/length; mouth-swap cadence; listener reaction delay after the motivating word.
5. Label every claim: observed / estimated / inferred implementation. Give evidence frame ranges.
6. Audio: you cannot play audio. VO lane = vo_words.csv (label "ASR transcript, approximate"). SFX/music: list waveform onsets that coincide with visual hits (stamp lands, impacts, pops, whooshes), with delta_frames = audio onset frame - visual frame. verification = "unverified (waveform only)", leave sound identity blank or "estimated: <type>" only when the visual makes the type obvious (e.g. stamp thud), marked estimated.

## Deliverables (in D)
- analysis.md: shot table (shot_id, first/last frame, start/end s, type: staged environment / archive insert / presenter composition / map / diagram / timeline / combination, story purpose + motivating VO phrase), then per shot: blocking and reveal order, layered scene breakdown (back-to-front layers, which separate for parallax), character design/rig notes (head:body ratio, line weight, palette, which parts change independently, joints and how they are hidden, pivots), acting (speaker/listener, eye lines, every expression change with frame and motivating word, blinks, mouth cadence, idle), mascot role, camera and compositing (push/pull/pan/shake/dim/vignette with frames and amounts), text and stamps (wording, case, position, size, colour, outline, shadow, rotation, entry/hold/exit frames; for stamps: oversized start scale, landing scale, frames to land, flash/dim, reaction after landing), maps/graphics/diagrams/archive treatment as applicable, audio findings. End with "Reusable mechanics": numbered rules, each with evidence frames and editable starting values.
- frames.csv: every row filled. Generate it with a small script from your shot/state/event spans (do not hand-type 1000 rows). inspection_status: "inspected (sheet)" for frames you viewed on seq sheets, "inspected (sheet+crop)" where you also looked at native crops. Never mark a frame inspected that you did not view.
- events.csv: columns event_id,shot_id,first_frame,last_frame,start_s,end_s,layer,event_type,observed_change,measured_values,confidence,evidence_paths (frame spans inclusive; end_s = (last_frame+1)/30). event_ids in frames.csv are ;-separated.
- audio_cues.csv: columns onset_s,tail_s,mapped_frame,visual_frame,delta_frames,category,description,confidence,verification.
- progress.md: frames decoded/inspected, sheets opened, shots verified, last verified frame, what remains uncertain.
Run `python3 /home/user/my-video/reference_analysis/_tools/validate.py D` at the end and fix every error.

Do not modify anything outside D (except reading). Do not edit the project source code. When done, reply with under 250 words: coverage numbers, the 5-8 most important reusable mechanics you found (with frame evidence), and anything you could not verify.
