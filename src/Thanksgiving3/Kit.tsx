import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { MONTSERRAT, OSWALD } from "../fonts";
import { mouthAt } from "../Thanksgiving/LayerPuppet";
import META from "./sprites.json";
import RIG from "./rig.json";
import VO from "./vo.json";
import ARCHIVES from "./archives.json";

/**
 * Toolkit for the pose-swap character pack (public/tg2), built to references/style-bible.md.
 * Characters are whole-pose sprites: performance = pose swaps timed to the motivating word,
 * feet registered, and a short torso rise-and-settle on stressed VO beats (Scene_Guide.md).
 */
const M = META as unknown as Record<string, number[]>;
const ENV = (VO as { env: number[] }).env;
const STRESS = (VO as { stress: number[] }).stress;
const INK = "#1d1712";
const FPS = 30;

/** Per-shot timing context: `offset` = global VO seconds at the shot's frame 0. */
export const ShotCtx = createContext<{ offset: number; env?: number[]; stress?: number[] }>({ offset: 0 });
export const useShot = () => useContext(ShotCtx);

const src = (key: string) => (key.startsWith("OLD/") ? `thanksgiving/${key.slice(4)}.png` : `tg2/${key}.png`);

/** Rise-and-settle pulse (0..1) around the nearest stressed beat: up 3 f, settle 4 f. */
const stressPulse = (f: number, offset: number, stress: number[] = STRESS) => {
  const t = f / FPS + offset;
  let best = 0;
  for (const s of stress) {
    const d = (t - s) * FPS;
    if (d < -1 || d > 8) continue;
    const p = d < 3 ? Math.max(0, (d + 1) / 4) : Math.max(0, 1 - (d - 3) / 5);
    best = Math.max(best, p);
  }
  return best;
};

export type SprProps = {
  s: string;                    // sprite key, e.g. "Poses/quill/blink" or "OLD/debtor/04_Reaching_for_food"
  x: number; y: number;         // feet (bottom-centre of the drawing) on screen
  h: number;                    // on-screen height of the drawing
  flip?: boolean;
  at?: number; until?: number;  // hard on / off (frames, shot-relative)
  enter?: { from: "left" | "right" | "bottom" | "top"; frames: number; dist?: number };
  stress?: boolean;             // rise & settle on VO stresses
  walk?: number;                // walking speed in px/frame (bob + travel)
  drop?: { frames: number; height: number }; // falls in from above, ease-out (money/crate)
  shake?: number;               // rattle amplitude (px)
  opacity?: number;
  children?: React.ReactNode;   // overlays in the sprite's own 512-px space (board text, tags)
};

export const Spr: React.FC<SprProps> = ({ s, x, y, h, flip, at = 0, until, enter, stress, walk, drop, shake = 0, opacity = 1, children }) => {
  const f = useCurrentFrame();
  const { offset, stress: stressArr } = useShot();
  if (f < at || (until !== undefined && f >= until)) return null;
  const m = M[s];
  if (!m) throw new Error(`unknown sprite ${s}`);
  const [x0, y0, x1, y1, W = 512, H = 512] = m;
  const k = h / (y1 - y0);
  const cx = (x0 + x1) / 2;
  const lf = f - at;
  let dx = 0, dy = 0;
  if (enter) {
    const p = interpolate(lf, [0, enter.frames], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const d = enter.dist ?? 1200;
    if (enter.from === "left") dx = -d * (1 - p);
    if (enter.from === "right") dx = d * (1 - p);
    if (enter.from === "bottom") dy = (h * 1.1) * (1 - p);
    if (enter.from === "top") dy = -d * (1 - p);
  }
  if (drop) dy += -drop.height * (1 - interpolate(lf, [0, drop.frames], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }));
  let bob = 0;
  if (walk) { dx += walk * lf; bob = -Math.abs(Math.sin((lf / 16) * Math.PI)) * h * 0.025; }
  if (shake) { dx += Math.sin(f * 2.3) * shake; dy += Math.cos(f * 3.1) * shake * 0.4; }
  const rise = stress ? stressPulse(f, offset, stressArr) : 0;
  const sy = 1 + Math.sin(f / 19) * 0.005 + rise * 0.028;   // breathing + rise, feet registered
  const sx = 1 - rise * 0.008;
  const sway = Math.sin(f / 37 + x) * 0.5;
  return (
    <g transform={`translate(${x + dx} ${y + dy + bob}) rotate(${sway}) scale(${(flip ? -1 : 1) * sx} ${sy})`} opacity={opacity}>
      <g transform={`scale(${k}) translate(${-cx} ${-y1})`}>
        <image href={staticFile(src(s))} x={0} y={0} width={W} height={H} />
        {children}
      </g>
    </g>
  );
};

/** Quill: closed beak by default (Flappy rule); `talk` = lip-sync to the VO in 3-5-frame holds. */
export const Quill: React.FC<Omit<SprProps, "s"> & { pose: string; talk?: boolean; blinkHold?: boolean }> = ({ pose, talk, blinkHold, ...p }) => {
  const f = useCurrentFrame();
  const { offset, env } = useShot();
  const talkable = ["speaking_facing_right", "deadpan_wings_folded", "nervous_side_glance", "scoreboard_facing_left", "pardon_plea"].includes(pose);
  let key = `Poses/quill/${pose}`;
  if (talkable) {
    const m = mouthAt(f, env ?? ENV, offset);
    key = `Poses/quill/${pose}__${talk && m.open ? "open" : "closed"}`;
    if (blinkHold && !(talk && m.loud) && f % 70 >= 64) key = "Poses/quill/blink";
  }
  return <Spr s={key} stress={talk} {...p} />;
};

/** Shot camera: ambient push (from→to over dur) + optional emphasis punch-in (4-12 f, eased). */
export const Cam: React.FC<{ dur: number; from?: number; to?: number; ox?: string; oy?: string; panX?: number;
  punch?: { at: number; frames: number; to: number; ox?: string; oy?: string }; children: React.ReactNode }> =
  ({ dur, from = 1, to = 1.045, ox = "50%", oy = "55%", panX = 0, punch, children }) => {
    const f = useCurrentFrame();
    let s = interpolate(f, [0, dur], [from, to], { extrapolateRight: "clamp" });
    let o = `${ox} ${oy}`;
    if (punch && f >= punch.at) {
      s *= interpolate(f, [punch.at, punch.at + punch.frames], [1, punch.to], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
      o = `${punch.ox ?? ox} ${punch.oy ?? oy}`;
    }
    const px = interpolate(f, [0, dur], [0, panX], { extrapolateRight: "clamp" });
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <AbsoluteFill style={{ transform: `translateX(${px}px) scale(${s})`, transformOrigin: o }}>{children}</AbsoluteFill>
      </AbsoluteFill>
    );
  };

const outline = "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 2px 0 0 #000, -2px 0 0 #000, 0 6px 14px rgba(0,0,0,0.55)";

/** Fact caption: white ExtraBold caps, thin black outline + shadow, HARD on/off. */
export const Cap: React.FC<{ text: string; at?: number; until?: number; pos?: "top" | "bottom"; size?: number }> = ({ text, at = 0, until, pos = "bottom", size = 78 }) => {
  const f = useCurrentFrame();
  if (f < at || (until !== undefined && f >= until)) return null;
  return (
    <AbsoluteFill style={{ justifyContent: pos === "top" ? "flex-start" : "flex-end", alignItems: "center", padding: pos === "top" ? "64px 0 0" : "0 0 70px" }}>
      <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: size, color: "#fff", textShadow: outline, textTransform: "uppercase", letterSpacing: 1 }}>{text}</div>
    </AbsoluteFill>
  );
};

/** Name card: current shot darkened ~70%, centred white caps, soft shadow, hard on/off. */
export const Card: React.FC<{ text: string; sub?: string; at?: number; until?: number }> = ({ text, sub, at = 0, until }) => {
  const f = useCurrentFrame();
  if (f < at || (until !== undefined && f >= until)) return null;
  const sh = "0 4px 18px rgba(0,0,0,0.6)";
  return (
    <AbsoluteFill style={{ background: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 118, color: "#fff", textShadow: sh, textTransform: "uppercase" }}>{text}</div>
      {sub && <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 50, color: "#fff", opacity: 0.85, marginTop: 14, textShadow: sh, textTransform: "uppercase" }}>{sub}</div>}
    </AbsoluteFill>
  );
};

/**
 * Punchline stamp (style bible §5): frame 0 ≈3× centred, settles to its corner in 6 f ease-out,
 * scene darkens ~40% over 7 f AFTER landing, optional fade-out over 5 f.
 */
export const Stamp: React.FC<{ lines: string[]; at: number; x: number; y: number; rot?: number;
  variant?: "red" | "dark" | "white"; fadeAt?: number; darken?: boolean }> = ({ lines, at, x, y, rot = -8, variant = "dark", fadeAt, darken = true }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const lf = f - at;
  const e = interpolate(lf, [0, 6], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const sc = interpolate(e, [0, 1], [3, 1]);
  const cx = interpolate(e, [0, 1], [960, x]), cy = interpolate(e, [0, 1], [540, y]);
  const fade = fadeAt !== undefined ? interpolate(f, [fadeAt, fadeAt + 5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const dim = darken ? interpolate(lf, [6, 13], [0, 0.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * fade : 0;
  const ink = variant === "red" ? "#d62828" : "#f4f1ea";
  const box = variant === "dark" ? "rgba(30,30,30,0.55)" : variant === "white" ? "rgba(255,255,255,0.35)" : "none";
  const lh = 78, w = 820, hh = lines.length * lh + 64;
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect width={1920} height={1080} fill="#000" opacity={dim} />
      <defs>
        <filter id="tg2-grunge" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.07 0.45" numOctaves={3} seed={5} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -4.5 2.4" result="holes" />
          <feComposite in="SourceGraphic" in2="holes" operator="out" />
        </filter>
      </defs>
      <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${sc})`} opacity={fade}>
        {box !== "none" && <rect x={-w / 2} y={-hh / 2} width={w} height={hh} fill={box} />}
        <g filter="url(#tg2-grunge)">
          <rect x={-w / 2 + 12} y={-hh / 2 + 12} width={w - 24} height={hh - 24} fill="none" stroke={ink} strokeWidth={12} />
          {lines.map((l, i) => (
            <text key={i} x={0} y={-hh / 2 + 32 + lh * (i + 0.82)} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={66} fill={ink}>{l}</text>
          ))}
        </g>
      </g>
    </svg>
  );
};

/** Red "?" marks popping in at both sides of a head (confusion). */
export const QMarks: React.FC<{ x: number; y: number; at?: number; spread?: number; size?: number }> = ({ x, y, at = 0, spread = 150, size = 120 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = (d: number) => interpolate(f - at - d, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return (
    <g fontFamily={MONTSERRAT} fontWeight={800} fontSize={size} fill="#e02b2b" stroke={INK} strokeWidth={6} paintOrder="stroke" textAnchor="middle">
      <text transform={`translate(${x - spread} ${y}) rotate(-14) scale(${p(0)})`}>?</text>
      <text transform={`translate(${x + spread} ${y - 20}) rotate(12) scale(${p(3)})`}>?</text>
    </g>
  );
};

/** Red cheering scribbles blinking on/off in alternate positions every 8 frames over a crowd. */
export const Cheer: React.FC<{ x: number; y: number; w: number; n?: number }> = ({ x, y, w, n = 6 }) => {
  const f = useCurrentFrame();
  const phase = Math.floor(f / 8) % 2;
  return (
    <g stroke="#e02b2b" strokeWidth={7} strokeLinecap="round" fill="none">
      {Array.from({ length: n }, (_, i) => i % 2 === phase && (
        <g key={i} transform={`translate(${x + (i / (n - 1)) * w} ${y + ((i * 37) % 60)}) rotate(${(i % 3 - 1) * 18})`}>
          <path d="M -26 -10 l -14 -26 M 0 -16 l 0 -30 M 26 -10 l 14 -26" />
        </g>
      ))}
    </g>
  );
};

/** White speed-line wedges (fast entrance / impact), shown for `frames`. */
export const Speed: React.FC<{ x: number; y: number; at?: number; frames?: number; dir?: 1 | -1 }> = ({ x, y, at = 0, frames = 6, dir = 1 }) => {
  const f = useCurrentFrame();
  if (f < at || f >= at + frames) return null;
  return (
    <g fill="#fff" stroke={INK} strokeWidth={3}>
      {[-90, -30, 30, 90].map((dy, i) => (
        <path key={i} d={`M ${x} ${y + dy} l ${dir * -(260 + i * 40)} -10 l 0 20 Z`} />
      ))}
    </g>
  );
};

/** Dust/landing puffs (grey, flat, ink outlined). */
export const Puff: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > 16) return null;
  return (
    <g opacity={interpolate(f, [8, 16], [1, 0], { extrapolateLeft: "clamp" })}>
      {[-1, 1].map((s) => [0, 1, 2].map((i) => (
        <circle key={`${s}${i}`} cx={x + s * (60 + i * 55 + f * 4)} cy={y - 18 - i * 6} r={22 + f * 1.6 - i * 4} fill="#d9cdb4" stroke={INK} strokeWidth={4} />
      )))}
    </g>
  );
};

/** A handwritten note that types on at ~15 chars/s. */
export const Note: React.FC<{ x: number; y: number; text: string; at?: number; rot?: number; w?: number }> = ({ x, y, text, at = 0, rot = -4, w = 760 }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.floor(((f - at) / FPS) * 15));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2 + 14} y={-170} width={w} height={340} fill="#000" opacity={0.25} />
      <rect x={-w / 2} y={-184} width={w} height={340} fill="#f6ecd2" stroke={INK} strokeWidth={8} />
      {[0, 1, 2, 3].map((i) => <line key={i} x1={-w / 2 + 40} x2={w / 2 - 40} y1={-90 + i * 66} y2={-90 + i * 66} stroke="#b9c7d8" strokeWidth={3} />)}
      <text x={0} y={10} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontStyle="italic" fontSize={92} fill="#2a2018">{text.slice(0, n)}</text>
    </g>
  );
};

/** Tag sprite (name / label) placed by its centre. */
export const Tag: React.FC<{ name: string; x: number; y: number; w: number; at?: number; rot?: number }> = ({ name, x, y, w, at = 0, rot = 0 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const m = M[`Tags/${name}`];
  const [x0, y0, x1, y1] = m;
  const k = w / (x1 - x0);
  const pop = interpolate(f - at, [0, 4], [0.3, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${pop * k}) translate(${-(x0 + x1) / 2} ${-(y0 + y1) / 2})`}>
      <image href={staticFile(`tg2/Tags/${name}.png`)} width={512} height={512} />
    </g>
  );
};

/** Pop-in (7 f, small overshoot) wrapper for graphics. */
export const PopIn: React.FC<{ at?: number; x: number; y: number; children: React.ReactNode }> = ({ at = 0, x, y, children }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = interpolate(f - at, [0, 7], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.8)) });
  return <g transform={`translate(${x} ${y}) scale(${s})`}>{children}</g>;
};

export { OSWALD };

// ---------------------------------------------------------------------------------------------
// Rigged stick-figure characters (autorig_sticks.py): body layer + free limbs pinned at joints.
// ---------------------------------------------------------------------------------------------
type Limb = { kind: "arm" | "leg"; side: "L" | "R"; file: string; x: number; y: number; w: number; h: number; pivot: [number, number]; len: number };
type RigMeta = { body: { file: string; x: number; y: number; w: number; h: number }; limbs: Limb[]; ground: number };
const R = RIG as unknown as Record<string, RigMeta>;

export type RigProps = {
  c: string; pose: string;          // character folder + pose name (public/tg2/Poses/<c>/<pose>.png)
  x: number; y: number; h: number; flip?: boolean;
  at?: number; until?: number;
  walk?: number;                    // walking direction & speed multiplier (1 = right, -1 = left; flip follows)
  walkUntil?: number;               // stop walking at this frame (holds pose)
  gesture?: number;                 // talking-arm amplitude (deg) on stressed beats, 0 = still
  stress?: boolean;                 // rise & settle on stressed VO beats (feet registered)
  bounce?: number;                  // excited jumps (px)
  enter?: SprProps["enter"];
};

const LIMB = (l: Limb, rot: number) => (
  <g key={l.file} transform={`rotate(${rot} ${l.pivot[0]} ${l.pivot[1]})`}>
    <image href={staticFile(l.file)} x={l.x} y={l.y} width={l.w} height={l.h} />
  </g>
);

/**
 * Pose-swap character with rig motion. WALK (style bible §2.3): legs swing about the hip pivot
 * ±20° on a 32-frame cycle (16-frame step), the body drops L·(1−cos θ) so the planted foot stays on
 * the ground, arms swing opposite ±12°, travel speed = stride/16 f so feet do not slide.
 * GESTURE: free arms lift outward on stressed VO beats and drift slightly every frame.
 * Limbs rotate only about the joint where they meet the body: they can never detach.
 */
export const Rig: React.FC<RigProps> = ({ c, pose, x, y, h, flip, at = 0, until, walk = 0, walkUntil, gesture = 0, stress, bounce = 0, enter }) => {
  const f = useCurrentFrame();
  const { offset, stress: stressArr } = useShot();
  if (f < at || (until !== undefined && f >= until)) return null;
  const key = `${c}/${pose}`;
  const r = R[key];
  const m = M[`Poses/${key}`];
  if (!m) throw new Error(`unknown pose ${key}`);
  if (!r) return <Spr s={`Poses/${key}`} x={x} y={y} h={h} flip={flip} stress={stress} enter={enter} />;
  const [x0, y0, x1, y1] = m;
  const k = h / (y1 - y0);
  const cx = (x0 + x1) / 2;
  const lf = f - at;
  const walking = walk !== 0 && (walkUntil === undefined || f < walkUntil);
  const tW = walking ? lf : walkUntil !== undefined ? walkUntil - at : 0;
  const legs = r.limbs.filter((l) => l.kind === "leg");
  const arms = r.limbs.filter((l) => l.kind === "arm");
  const L = legs.length ? Math.max(...legs.map((l) => l.len)) : 0;
  const AMP = 17;
  const ph = walking ? (2 * Math.PI * lf) / 32 : 0;
  const th = walking ? AMP * Math.sin(ph) : 0;
  const drop = walking ? L * (1 - Math.cos((th * Math.PI) / 180)) : 0;          // sprite px
  const stride = 2 * L * Math.sin((AMP * Math.PI) / 180);                         // per 16 f
  const travel = walk === 0 ? 0 : Math.sign(walk) * Math.abs(walk) * (stride * k / 16) * tW;
  // talking gesture
  const rise = stress ? stressPulse(f, offset, stressArr) : 0;
  const breathe = Math.sin(f / 19) * 0.005;
  let dx = travel, dy = 0;
  if (enter) {
    const p = interpolate(lf, [0, enter.frames], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const d = enter.dist ?? 1200;
    if (enter.from === "left") dx += -d * (1 - p);
    if (enter.from === "right") dx += d * (1 - p);
    if (enter.from === "bottom") dy += h * 1.1 * (1 - p);
  }
  const jump = bounce ? -Math.abs(Math.sin((f / 7) * Math.PI)) * bounce : 0;
  const legRot = (l: Limb) => {
    const s = l.side === "L" ? 1 : -1;
    return walking ? s * th : 0;
  };
  const armRot = (l: Limb) => {
    const out = l.side === "L" ? 1 : -1;                    // +deg swings a screen-left limb outward
    if (walking) return -out * th * 0.6;
    if (!gesture) return Math.sin(f / 23 + (l.side === "L" ? 0 : 2)) * 1.2;
    const wob = Math.sin(f * 0.21 + (l.side === "L" ? 0 : 1.7)) * gesture * 0.25;
    return out * (rise * gesture + wob);
  };
  return (
    <g transform={`translate(${x + dx} ${y + dy + jump})`}>
      <g transform={`rotate(${walking ? 2 * Math.sign(walk) : 0}) scale(${flip ? -1 : 1} ${1 + breathe + rise * 0.02})`}>
        <g transform={`scale(${k}) translate(${-cx} ${-y1 + drop})`}>
          {legs.map((l) => LIMB(l, legRot(l)))}
          {arms.map((l) => LIMB(l, armRot(l)))}
          <image href={staticFile(r.body.file)} x={r.body.x} y={r.body.y} width={r.body.w} height={r.body.h} />
        </g>
      </g>
    </g>
  );
};

/**
 * Archive image (style bible §8): real public-domain scan/photo, old-film treatment —
 * sepia/B&W grade, animated grain, a few flickering scratches, brightness flicker, heavy vignette,
 * slow push. `mode`: "doc" = tall document centred on dark brown; "portrait" = small centred box on
 * black; "wide" = full frame with a thick black vignette border.
 */
export const Arch: React.FC<{ src: string; mode?: "doc" | "portrait" | "wide"; dur: number; sepia?: number; focus?: [number, number]; zoom?: [number, number] }> = ({ src: file, mode = "doc", dur, sepia = 0.55, focus = [50, 40], zoom = [1, 1.07] }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, dur], zoom, { extrapolateRight: "clamp" });
  const have = (ARCHIVES as string[]).includes(file);
  const flick = 1 + Math.sin(f * 1.7) * 0.02 + Math.sin(f * 0.37) * 0.015;
  const seed = f % 9;
  const box: React.CSSProperties = mode === "wide"
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
    : mode === "portrait"
      ? { position: "absolute", left: "50%", top: "50%", height: 800, transform: "translate(-50%,-50%)", boxShadow: "0 0 60px #000" }
      : { position: "absolute", left: "50%", top: "50%", height: 1000, transform: "translate(-50%,-50%)", boxShadow: "0 0 80px #000" };
  return (
    <AbsoluteFill style={{ background: mode === "portrait" ? "#050403" : "radial-gradient(circle at 50% 45%, #3a2a1c 0%, #120c07 75%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${focus[0]}% ${focus[1]}%`, filter: `sepia(${sepia}) contrast(1.08) brightness(${flick})` }}>
        {have ? <Img src={staticFile(`tg2/archive/${file}.jpg`)} style={box} /> : (
          // scan not downloaded yet: aged blank document placeholder in the same treatment
          <div style={{ ...box, width: mode === "portrait" ? 600 : 760, background: "linear-gradient(#e8d9b5,#cdb88c)", border: "10px solid #2a1d12" }}>
            {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ height: 6, margin: "34px 60px 0", background: "#6b5537", opacity: 0.55, width: `${70 + ((i * 37) % 25)}%` }} />)}
          </div>
        )}
      </AbsoluteFill>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <filter id={`grain${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves={2} seed={seed} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={1920} height={1080} filter={`url(#grain${seed})`} opacity={0.16} style={{ mixBlendMode: "overlay" }} />
        {[0, 1, 2].map((i) => ((f + i * 7) % 11 < 4) && (
          <line key={i} x1={(f * 97 + i * 613) % 1920} x2={(f * 97 + i * 613) % 1920 + 3} y1={0} y2={1080} stroke="#f2e6cc" strokeWidth={1.5} opacity={0.35} />
        ))}
        <radialGradient id="archvig" cx="50%" cy="50%" r="72%"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.85} /></radialGradient>
        <rect width={1920} height={1080} fill="url(#archvig)" />
      </svg>
    </AbsoluteFill>
  );
};
