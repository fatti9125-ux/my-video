# Clip 12 progress

source: 12_Bush_Plane_and_Rescue.mp4
frames decoded: 1050
sheets: 88 seq sheets (12 frames each)
last verified frame: none

## Log
- Sheets 000-323 opened (first pass; notes to be re-derived from crops/metrics because sheet images dropped from context before notes were written).
- 324-398 map: Pacific basemap, red/white ring pin ~x0.568,y0.64; caption "SEPTEMBER 2, 1944" to 356, hard swap to "CHICHI JIMA" at 357; cut at 399.
- 399-431 plane on scrolling sky; 432-434 red comet streak at canopy from top-left; 435 red+white spikes; 436-439 white spikes; 440 fire engulf + yellow tail panel; 440-479 burning plane, flames cycling.
- 480-626 cockpit fire close-up, Bush grimace held; flame/BG swaps; cut 627.
- 627-719 burning wreck on water; caption JOHN DELANEY / TED WHITE hard-in at 665.
- 720-746 wreck+caption hold continues; caption exits with cut at 747.
- 747-767 raft shot: Bush right of centre in white donut raft, scratch marks (red zigzags on helmet, cheek, jacket), worried open mouth, eyes squint; raft+char bob together; foam patch under raft; water bands drift.
- 768-815 raft continues: raft+Bush drift slowly left across frame (raft centre ~x0.70 at 747 -> ~0.55 at 815, to be measured), rock/tilt alternating every few frames; mouth stays open-worried (no swaps seen); water BG bands + translucent lighter wave shapes slide; foam patch moves with raft.
- 816-821 raft end; cut 822 to high-angle sub deck (foreground lower-left diagonal deck w/ wood planks, bollard/cleat, hatch at bottom), two sailors (white caps) mid-deck, Bush in raft upper-right small; water bands drift; whole sub+sailors sway slightly (to measure); caption "USS FINBACK" hard-in at 856, bottom centre.
- 856-904 USS FINBACK caption hold (49 f), hard-out at 905. Sub shot continues; whole sub/sailor group drifts slowly (sub bow moves right/up?) – measure.
- 905-1044 sub shot continues w/o caption; sub deck+sailors sway as one group (bob ~ few px), Bush raft bobs separately, water stripes drift; sailors' faces small changes (mouth open/closed) – check crops.
- 1045-1049 hard cut to White House lawn line-up of 7 presidents, caption "JANUARY, 1993" already on at 1045 (next segment).
- ALL 88 seq sheets opened (0-1049). Next: crops/measurements.
- Measurements done (cockpit bob, plane bob, wingman entry, map push, hit FX bboxes, fire cadence, raft drift/bob, sub push, caption boxes). Writing deliverables.

## Status (final)
- frames decoded 1050; inspected 1050 (all 88 seq sheets opened); sheet+crop on 85 frames (see frames.csv).
- shots verified: S01-S10 (9 hard cuts at F49,123,241,399,480,627,747,822,1045).
- last verified frame: F1049.
- deliverables: frames.csv, events.csv (41 events), audio_cues.csv written; analysis.md content handed to lead in final reply (hook blocks subagent Write).
- audio: not played; waveform-only cues, VO = ASR approximate.
- uncertain: propeller cadence, sailor mouth cadence, exact rescue push curve (landmark estimate 1.35-1.45x), fire implementation (procedural vs loop), all SFX identities.
