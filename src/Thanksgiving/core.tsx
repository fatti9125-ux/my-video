import React, { createContext, useContext } from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MANIFEST } from "./manifest";
import { MOUTH } from "./mouth";
import { Caption } from "../EmuWar/Scenery";
import { OSWALD } from "../fonts";

export const FPS = 30;
export type Who = keyof typeof MANIFEST.chars;

// ---------------- Shot clock ----------------
// Every shot runs inside a Sequence; the context tells components where the shot sits on the chapter's VO timeline
// so they can be keyed to absolute VO seconds (taken from the transcript timings).
type ShotInfo = { start: number; dur: number; ch: string };
const ShotCtx = createContext<ShotInfo>({ start: 0, dur: 1, ch: "ch1" });
export const useShot = () => useContext(ShotCtx);
/** Absolute chapter time in seconds. */
export const useT = () => { const f = useCurrentFrame(); const s = useShot(); return (f + s.start) / FPS; };
/** Shot-local frame for an absolute chapter time. */
export const useLocal = () => { const s = useShot(); return (t: number) => Math.round(t * FPS) - s.start; };

export type Shot = { at: number; C: React.FC; whoosh?: boolean };

export const ShotRunner: React.FC<{ ch: string; shots: Shot[]; end: number }> = ({ ch, shots, end }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {shots.map((s, i) => {
      const from = Math.round(s.at * FPS);
      const to = i + 1 < shots.length ? Math.round(shots[i + 1].at * FPS) : Math.round(end * FPS);
      const C = s.C;
      return (
        <Sequence key={i} from={from} durationInFrames={to - from} name={`shot ${i + 1} @${s.at}s`}>
          <ShotCtx.Provider value={{ start: from, dur: to - from, ch }}>
            <C />
            {s.whoosh && <Audio src={staticFile("sfx/whoosh.wav")} volume={0.32} />}
          </ShotCtx.Provider>
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

// ---------------- Lip flap from the VO envelope ----------------
export const useMouthOpen = (enabled: boolean) => {
  const f = useCurrentFrame(); const s = useShot();
  if (!enabled) return false;
  const g = f + s.start; const lv = MOUTH[s.ch]?.[g] ?? "0";
  if (lv === "2") return Math.floor(g / 3) % 3 !== 2;
  if (lv === "1") return Math.floor(g / 3) % 2 === 0;
  return false;
};

const src = (who: string, file: string) => staticFile(`tg/${who}/${file}.png`);

/** Blink: a few frames every ~3 s, de-synced per character. */
const useBlink = (seed: number) => { const f = useCurrentFrame(); const p = (f + seed * 37) % 97; return p < 4; };

// ---------------- Puppet rig (layer PNGs at the supplied 720 px positions) ----------------
type Range<T> = T | [number, T][]; // value, or [[absSeconds, value], ...]
const pick = <T,>(v: Range<T>, t: number): T => {
  if (!Array.isArray(v) || (v.length && !Array.isArray(v[0]))) return v as T;
  const arr = v as [number, T][]; let out = arr[0][1];
  for (const [at, val] of arr) if (t >= at) out = val;
  return out;
};

export const Rig: React.FC<{
  who: Who; x: number; y: number; scale?: number; flip?: boolean;
  head?: Range<string>; talk?: Range<boolean>; armL?: number; armR?: number; seed?: number; hop?: number;
}> = ({ who, x, y, scale = 1, flip = false, head, talk = false, armL = 0, armR = 0, seed = 1, hop = 0 }) => {
  const f = useCurrentFrame(); const t = useT();
  const layers = MANIFEST.chars[who].rig as readonly { k: string; x: number; y: number; w: number; h: number }[];
  const heads = layers.filter((l) => l.k.endsWith("head") && l.k !== "blank_head_base");
  const isTalking = pick(talk, t);
  const open = useMouthOpen(isTalking);
  const blink = useBlink(seed);
  const baseHead = pick(head ?? heads[0].k, t);
  const talkHead = heads.find((h) => h.k === "talking_head" || h.k === "speaking_head");
  const blinkHead = heads.find((h) => h.k.startsWith("blink"));
  let headK = baseHead;
  if (isTalking && talkHead && open) headK = talkHead.k;
  else if (blink && blinkHead && (baseHead === heads[0].k || isTalking)) headK = blinkHead.k;
  const isQuill = who === "quill";
  const body = layers.filter((l) => !l.k.endsWith("head") && !l.k.includes("beak") && l.k !== "spectacles" && !l.k.includes("open_wing") && l.k !== "three_quarter_vest" && l.k !== "blank_head_base");
  const order = [...body].reverse();
  const sway = Math.sin((f + seed * 20) / 22) * 1.2;
  const breathe = 1 + Math.sin((f + seed * 13) / 16) * 0.008;
  const H = layers.find((l) => l.k === headK) ?? heads[0];
  const up = layers.find((l) => l.k === "left_upper_arm");
  const upR = layers.find((l) => l.k === "right_upper_arm");
  const armOf = (k: string) => (k.startsWith("left_") && /arm|hand/.test(k) ? "L" : k.startsWith("right_") && /arm|hand/.test(k) ? "R" : null);
  const img = (l: { k: string; x: number; y: number; w: number; h: number }) => (
    <Img key={l.k} src={src(who, `rig_${l.k}`)} style={{ position: "absolute", left: l.x, top: l.y, width: l.w, height: l.h }} />
  );
  const wingOpen = isQuill && (armL > 20 || armR > 20);
  const footY = isQuill ? 562 : 606;
  return (
    <div style={{ position: "absolute", left: x - 360, top: y - footY - hop, width: 720, height: 720, transform: `scale(${scale * (flip ? -1 : 1)}, ${scale})`, transformOrigin: `360px ${footY}px` }}>
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${sway * 0.4}deg) scaleY(${breathe})`, transformOrigin: `360px ${footY}px` }}>
        {order.filter((l) => !armOf(l.k) && !(wingOpen && l.k.includes("rest_wing"))).map(img)}
        {!isQuill && up && (
          <div style={{ position: "absolute", inset: 0, transform: `rotate(${armL}deg)`, transformOrigin: `${up.x + up.w / 2}px ${up.y + 6}px` }}>
            {order.filter((l) => armOf(l.k) === "L").map(img)}
          </div>
        )}
        {!isQuill && upR && (
          <div style={{ position: "absolute", inset: 0, transform: `rotate(${-armR}deg)`, transformOrigin: `${upR.x + upR.w / 2}px ${upR.y + 6}px` }}>
            {order.filter((l) => armOf(l.k) === "R").map(img)}
          </div>
        )}
        {wingOpen && layers.filter((l) => l.k.includes("open_wing")).map(img)}
        <div style={{ position: "absolute", inset: 0, transform: `rotate(${sway}deg)`, transformOrigin: `360px ${H.y + H.h - 20}px` }}>
          {img({ ...H, y: H.y + (isQuill ? 0 : 8) })}
        </div>
      </div>
    </div>
  );
};

// ---------------- Whole-pose cutouts (complete drawings from the sheets) ----------------
export const Pose: React.FC<{
  who: Who; k: string; x: number; y: number; h: number; flip?: boolean; at?: number; bob?: number; rot?: number; seed?: number;
}> = ({ who, k, x, y, h, flip = false, at, bob = 1, rot = 0, seed = 1 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const L = useLocal();
  const cut = (MANIFEST.chars[who].cut as Record<string, readonly number[]>)[k];
  if (!cut) throw new Error(`no cutout ${who}/${k}`);
  const w = (cut[0] / cut[1]) * h;
  const start = at === undefined ? -999 : L(at);
  if (f < start) return null;
  const s = at === undefined ? 1 : spring({ frame: f - start, fps, config: { damping: 10, stiffness: 240, mass: 0.6 } });
  const squash = 1 + Math.sin((f + seed * 11) / 14) * 0.012 * bob;
  const sway = Math.sin((f + seed * 17) / 24) * 1.3 * bob + rot;
  return (
    <Img src={src(who, `cut_${k}`)} style={{
      position: "absolute", left: x - w / 2, top: y - h, width: w, height: h,
      transform: `scaleX(${flip ? -1 : 1}) rotate(${sway}deg) scale(${interpolate(s, [0, 1], [0.6, 1])}) scaleY(${squash})`,
      transformOrigin: "50% 100%", opacity: Math.min(1, s * 2),
    }} />
  );
};

export const Prop: React.FC<{ k: string; x: number; y: number; h: number; rot?: number; at?: number; flip?: boolean }> = ({ k, x, y, h, rot = 0, at, flip }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const L = useLocal();
  const p = (MANIFEST.props as Record<string, readonly number[]>)[k];
  const w = (p[0] / p[1]) * h;
  const start = at === undefined ? -999 : L(at);
  if (f < start) return null;
  const s = at === undefined ? 1 : spring({ frame: f - start, fps, config: { damping: 9, stiffness: 260, mass: 0.5 } });
  return (
    <Img src={staticFile(`tg/props/${k}.png`)} style={{
      position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h,
      transform: `scaleX(${flip ? -1 : 1}) rotate(${rot + Math.sin(f / 15) * 2}deg) scale(${s})`,
    }} />
  );
};

// ---------------- Text beats keyed to absolute VO seconds (with their SFX) ----------------
export const Cap: React.FC<{ t: number; text: string; pos?: "top" | "bottom"; size?: number; color?: string; until?: number }> = ({ t, until, ...rest }) => {
  const L = useLocal(); const f = useCurrentFrame();
  if (until !== undefined && f >= L(until)) return null;
  return (
    <>
      <Caption at={L(t)} {...rest} />
      {L(t) >= 0 && <Sequence from={L(t)} durationInFrames={20} layout="none"><Audio src={staticFile("sfx/pop.wav")} volume={0.35} /></Sequence>}
    </>
  );
};

export const Stamp: React.FC<{ t: number; lines: string[]; x?: number; y?: number; rotate?: number; dark?: boolean; size?: number }> = ({ t, lines, x = 1380, y = 300, rotate = -9, dark, size = 84 }) => {
  const L = useLocal(); const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const st = L(t);
  if (f < st) return null;
  const s = spring({ frame: f - st, fps, config: { damping: 11, stiffness: 320, mass: 0.6 } });
  const ink = dark ? "#f4efe6" : "#c8261f";
  const longest = Math.max(...lines.map((l) => l.length));
  const w = Math.max(420, longest * size * 0.5 + 120), lh = size * 1.08, h = lines.length * lh + 80;
  return (
    <>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="stampGrunge" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.09 0.35" numOctaves={2} seed={5} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -7 2.2" result="holes" />
            <feComposite in="SourceGraphic" in2="holes" operator="out" />
          </filter>
        </defs>
        <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${interpolate(s, [0, 1], [1.6, 1])})`} opacity={Math.min(1, s * 3)}>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill={dark ? "rgba(20,18,18,0.85)" : "rgba(255,250,240,0.92)"} />
          <g filter="url(#stampGrunge)">
            <rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28} rx={8} fill="none" stroke={ink} strokeWidth={12} />
            {lines.map((l, i) => (
              <text key={i} x={0} y={-h / 2 + 40 + lh * (i + 0.82)} textAnchor="middle" fontFamily={OSWALD} fontWeight={700} fontSize={size} fill={ink} letterSpacing={3}>{l}</text>
            ))}
          </g>
        </g>
      </svg>
      <Sequence from={st} durationInFrames={30} layout="none"><Audio src={staticFile("sfx/thud.wav")} volume={0.6} /></Sequence>
    </>
  );
};

/** One-shot SFX at an absolute VO time. */
export const Sfx: React.FC<{ t: number; s: string; v?: number }> = ({ t, s, v = 0.4 }) => {
  const L = useLocal(); const fr = L(t);
  if (fr < 0) return null;
  return <Sequence from={fr} durationInFrames={60} layout="none"><Audio src={staticFile(`sfx/${s}.wav`)} volume={v} /></Sequence>;
};

/** Pop-in helper for SVG / HTML graphics keyed to absolute VO seconds. */
export const usePop = (t: number, cfg = { damping: 10, stiffness: 240 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const L = useLocal();
  const st = L(t); if (f < st) return 0;
  return spring({ frame: f - st, fps, config: cfg });
};
