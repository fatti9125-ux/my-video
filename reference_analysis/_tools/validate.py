"""Check one clip's deliverables. usage: python3 validate.py <root>/<NN>"""
import csv, sys, os, json
D = sys.argv[1]; err = []
N = len(json.load(open(f"{D}/frame_timestamps.json")))
fr = list(csv.DictReader(open(f"{D}/frames.csv")))
if [int(r["frame"]) for r in fr] != list(range(N)): err.append(f"frames.csv must list frames 0..{N-1} once, in order")
for r in fr:
    if not r["shot_id"] or not r["visual_state_id"]: err.append(f"frame {r['frame']}: missing shot/state"); break
st = {r["inspection_status"] for r in fr}
ev = list(csv.DictReader(open(f"{D}/events.csv"))) if os.path.exists(f"{D}/events.csv") else []
if not ev: err.append("events.csv missing/empty")
ids = set()
for e in ev:
    a, b = int(e["first_frame"]), int(e["last_frame"])
    if not (0 <= a <= b < N): err.append(f"event {e['event_id']} out of clip range")
    ids.add(e["event_id"])
for r in fr:
    for i in filter(None, r["event_ids"].split(";")):
        if i not in ids: err.append(f"frame {r['frame']} refs unknown event {i}"); break
shots = {r["shot_id"] for r in fr}
for e in ev:
    if e["shot_id"] and e["shot_id"] not in shots: err.append(f"event {e['event_id']} has unknown shot {e['shot_id']}")
for f in ("analysis.md", "audio_cues.csv", "progress.md"):
    if not os.path.exists(f"{D}/{f}"): err.append(f"{f} missing")
print(f"{D}: frames {len(fr)}/{N}, events {len(ev)}, shots {len(shots)}, statuses {sorted(st)}")
print("OK" if not err else "ERRORS:\n" + "\n".join(err[:30]))
