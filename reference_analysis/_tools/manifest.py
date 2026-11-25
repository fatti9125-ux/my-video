"""Build reference_analysis/manifest.json from each clip folder."""
import json, csv, os, hashlib, collections
R = "reference_analysis"; out = {"brief": "_brief.md", "spec": "Animation_Production_Spec.md", "clips": []}
for n in sorted(d for d in os.listdir(R) if d.isdigit()):
    D = f"{R}/{n}"; p = json.load(open(f"{D}/probe.json")); ft = json.load(open(f"{D}/frame_timestamps.json"))
    v = next(s for s in p["streams"] if s["codec_type"] == "video"); a = next((s for s in p["streams"] if s["codec_type"] == "audio"), {})
    src = os.path.basename(p["format"]["filename"])
    fr = list(csv.DictReader(open(f"{D}/frames.csv"))); st = collections.Counter(r["inspection_status"] for r in fr)
    ev = list(csv.DictReader(open(f"{D}/events.csv"))); au = list(csv.DictReader(open(f"{D}/audio_cues.csv")))
    sha = hashlib.sha256(open(f"{R}/_src/{src}", "rb").read()).hexdigest() if os.path.exists(f"{R}/_src/{src}") else None
    out["clips"].append({
        "id": n, "file": src, "sha256": sha, "duration_s": float(p["format"]["duration"]),
        "video": {"codec": v["codec_name"], "width": v["width"], "height": v["height"], "dar": v.get("display_aspect_ratio"),
                  "r_frame_rate": v["r_frame_rate"], "time_base": v["time_base"], "frames_decoded": len(ft)},
        "audio": {"codec": a.get("codec_name"), "sample_rate": a.get("sample_rate"), "channels": a.get("channels"), "start_time": a.get("start_time")},
        "coverage": {"frames_indexed": len(fr), "inspection_status": dict(st), "shots": len({r['shot_id'] for r in fr}),
                     "events": len(ev), "audio_cues": len(au), "audio_verification": "waveform only (no playback); VO from offline ASR, approximate"},
        "evidence": {"analysis": f"{n}/analysis.md", "frames_index": f"{n}/frames.csv", "events": f"{n}/events.csv", "audio_cues": f"{n}/audio_cues.csv",
                     "progress": f"{n}/progress.md", "frame_pngs_local_only": f"{n}/frames/%06d.png", "sheets_local_only": f"{n}/sheets/"}})
out["totals"] = {"clips": len(out["clips"]), "frames": sum(c["video"]["frames_decoded"] for c in out["clips"]),
                 "duration_s": sum(c["duration_s"] for c in out["clips"])}
json.dump(out, open(f"{R}/manifest.json", "w"), indent=1); print(out["totals"])
