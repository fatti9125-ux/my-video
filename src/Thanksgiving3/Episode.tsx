import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import * as B from "../Thanksgiving/Backgrounds";
import { MONTSERRAT } from "../fonts";
import BOARDS from "./boards.json";
import { ShotCtx } from "./Kit";

/**
 * Generic episode runner for a single VO file + its word alignment (ep/<k>.json from align_words.py).
 * Shots are written against WORD times: `ln(i)` = start of script line i, `wd(i, "word", n)` = start of
 * the n-th word in line i beginning with "word". A shot ends where the next one starts.
 */
export const FPS = 30;
export type EpData = { vo: string; dur: number; env: number[]; stress: number[]; lines: [number, string][]; words: [string, number, number][] };
export type Shot = { a: number; el: (t: (s: number) => number, dur: number) => React.ReactNode; sfx?: [number, string, number?][] };

export const makeAlign = (d: EpData) => ({
  ln: (i: number) => d.lines[i][0],
  wd: (i: number, w: string, n = 0) => {
    const hits = d.words.filter(([ww, l]) => l === i && ww.startsWith(w.toLowerCase()));
    if (!hits[n]) throw new Error(`word "${w}" #${n} not in line ${i}: ${d.lines[i][1]}`);
    return hits[n][2];
  },
});

export const Svg: React.FC<{ bg: React.ReactNode; dim?: number; children?: React.ReactNode }> = ({ bg, dim = 0, children }) => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    <B.Defs />{bg}
    {dim > 0 && <rect width={1920} height={1080} fill="#0b0f14" opacity={dim} />}
    {children}
    <B.Finish />
  </svg>
);

export const Over: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{children}</svg>
);

/** 1-frame pose swap at frame t. */
export const Swap: React.FC<{ t: number; a: React.ReactNode; b: React.ReactNode }> = ({ t, a, b }) => {
  const f = useCurrentFrame();
  return <>{f < t ? a : b}</>;
};

/** Multi-step swap: [[fromFrame, node], ...] (first entry should be 0). */
export const Steps: React.FC<{ s: [number, React.ReactNode][] }> = ({ s }) => {
  const f = useCurrentFrame();
  let cur = s[0][1];
  for (const [t, n] of s) if (f >= t) cur = n;
  return <>{cur}</>;
};

const BD = BOARDS as unknown as Record<string, [number, number, number, number]>;
/** Quill's chalkboard text (sprite space of the scoreboard pose). */
export const Board: React.FC<{ pose: string; top: string; big: string; at?: number }> = ({ pose, top, big, at = 0 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const [x0, y0, x1, y1] = BD[pose];
  return (
    <g fontFamily={MONTSERRAT} fontWeight={800} fill="#f4f1ea" textAnchor="middle">
      <text x={(x0 + x1) / 2} y={y0 + 20} fontSize={13}>{top}</text>
      <text x={(x0 + x1) / 2} y={y1 - 12} fontSize={big.length > 3 ? 30 : 46}>{big}</text>
    </g>
  );
};

export const Episode: React.FC<{ data: EpData; shots: Shot[] }> = ({ data, shots }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {shots.map((s, i) => {
      const b = i + 1 < shots.length ? shots[i + 1].a : data.dur + 0.6;
      const from = Math.round(s.a * FPS), to = Math.round(b * FPS);
      const t = (sec: number) => Math.round((sec - s.a) * FPS);
      return (
        <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)}>
          <ShotCtx.Provider value={{ offset: s.a, env: data.env, stress: data.stress, sfx: s.sfx }}>{s.el(t, to - from)}</ShotCtx.Provider>
          {(s.sfx ?? []).map(([at, name, vol], j) => (
            <Sequence key={j} from={Math.max(0, at)} durationInFrames={60}><Audio src={staticFile(`tg2/sfx/${name}.wav`)} volume={vol ?? 0.15} /></Sequence>
          ))}
        </Sequence>
      );
    })}
    <Audio src={staticFile(`tg2/vo/${data.vo}.mp3`)} />
  </AbsoluteFill>
);

export const epDuration = (d: EpData) => Math.round((d.dur + 0.6) * FPS);
