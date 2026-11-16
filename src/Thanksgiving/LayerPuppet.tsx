import React, { createContext, useContext, useEffect, useState } from "react";
import { continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import META from "./rigmeta.json";

/**
 * Layered cut-out puppet built from a character's Rig_*.png parts (Thanksgiving sheets).
 *
 * ATTACHMENT: every part sits in a NESTED joint chain — shoulder > upper arm > elbow > forearm
 * > wrist > hand, hip > thigh > knee > shin > ankle > foot, chin pivot > head. Each child is
 * translated to its parent's measured joint end (from the PNG alpha, see layer_rig_meta.py),
 * so whatever the angles, nothing can float or gap. Shoulders/hips are placed INSIDE the
 * torso silhouette and arms are drawn behind the torso, so limbs grow out of the body.
 *
 * Units: the 720 px puppet canvas of the sheets. Origin of <LayerPuppet x y> = between the feet
 * on the ground. `height` = desired on-screen height of the whole figure in px.
 */
type Part = { file: string; size: [number, number]; bbox: [number, number, number, number]; top?: any; bottom?: any; attach?: [number, number]; chin?: [number, number]; profile?: [number, number | null, number | null][] };
type CharMeta = { parts: Record<string, Part>; pos: Record<string, [number, number]> };
const M = META as unknown as Record<string, CharMeta>;

export type Arm = { s: number; e: number; front?: boolean }; // shoulder & elbow angles, degrees; 0 = hanging, + = outward/up
export const ARMS = {
  rest: { s: 36, e: -16 },
  open: { s: 55, e: 25 },
  wave: { s: 140, e: 25 },
  point: { s: 85, e: 5 },
  raise: { s: 150, e: 22 },
  shrug: { s: 50, e: 75 },
  hips: { s: 40, e: -95 },
  folded: { s: 12, e: -140, front: true },
  explain: { s: 70, e: 35 },   // reference "talking" pose: both arms up and out, hands open
  lift: { s: 95, e: 40 },
} as Record<string, Arm>;

/** VO envelope for the current shot: every puppet with `speak` lip-syncs to it. */
export const TalkContext = createContext<{ env: number[]; offset: number }>({ env: [], offset: 0 });

/**
 * Reference-style mouth timing (measured frame-by-frame on the reference video):
 * whole-head swaps, each mouth state HELD 3-5 frames (never flicker every frame or every 2),
 * open/closed alternating while the voice is loud, mouth CLOSED through pauses.
 * Returns { open, accent } — accent = first frame of an open block (drive a small nod).
 */
const BLOCKS = [4, 3, 5, 4, 3, 5, 4, 4, 3, 5];
export const mouthAt = (f: number, env: number[], offset: number) => {
  let start = 0, k = 0;
  while (start + BLOCKS[k % BLOCKS.length] <= f) { start += BLOCKS[k % BLOCKS.length]; k++; }
  const len = BLOCKS[k % BLOCKS.length];
  let sum = 0;
  for (let j = 0; j < len; j++) sum += env[Math.floor(((start + j) / 30 + offset) * 100)] ?? 0;
  const loud = sum / len >= 3;
  const open = loud && k % 2 === 0;
  return { open, accent: open && f === start, loud };
};

export type PuppetProps = {
  char: string;
  x: number; y: number; height?: number; flip?: boolean;
  head?: string;                 // "Neutral" | "Talking" | "Skeptical" | ... (falls back to first available)
  talk?: boolean | number[];     // true = flap every 4 f; or a 100 Hz loudness envelope (0..9) to flap on voice
  talkOffset?: number;           // seconds into the envelope at this Sequence's frame 0
  speak?: boolean;               // lip-sync to the shot's VO (TalkContext) + talking body language
  fall?: number;                 // 0..1 fall-over gag: tips over around the feet, then legs/arms flail
  blink?: boolean;
  armL?: Arm; armR?: Arm;
  walk?: number;                 // walk phase in radians
  tilt?: number; bob?: number;
  children?: React.ReactNode;    // props drawn in front of the torso (puppet canvas units)
};

const loaded = new Set<string>();
const usePreload = (urls: string[]) => {
  const need = urls.filter((u) => !loaded.has(u));
  const [h] = useState(() => (need.length ? delayRender("puppet parts") : null));
  useEffect(() => {
    if (h === null) return;
    Promise.all(need.map((u) => new Promise<void>((r) => { const i = new Image(); i.onload = i.onerror = () => { loaded.add(u); r(); }; i.src = u; })))
      .then(() => continueRender(h));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [h]);
};

const Img: React.FC<{ char: string; p: Part; x?: number; y?: number }> = ({ char, p, x = 0, y = 0 }) => (
  <image href={staticFile(`thanksgiving/${char}/${p.file}.png`)} x={x} y={y} width={p.size[0]} height={p.size[1]} />
);

export const layout = (char: string) => {
  const c = M[char];
  const P = c.parts, pos = c.pos;
  const torso = P.torso; const T = pos.torso ?? [270, 335];
  const tTop = T[1] + (torso.top as number), tBot = T[1] + (torso.bottom as number), th = tBot - tTop;
  const cx = T[0] + (torso.bbox[0] + torso.bbox[2]) / 2;
  const prof = (y: number) => {
    const row = torso.profile!.reduce((b, r) => (Math.abs(r[0] + T[1] - y) < Math.abs(b[0] + T[1] - y) ? r : b));
    return [T[0] + (row[1] ?? 0), T[0] + (row[2] ?? 0)] as const;
  };
  const sy = tTop + th * 0.2;
  const [el, er] = prof(sy);
  const shoulderL: [number, number] = [el + 12, sy], shoulderR: [number, number] = [er - 12, sy];
  const hy = tBot - th * 0.12;
  const hipL: [number, number] = [cx - 30, hy], hipR: [number, number] = [cx + 30, hy];
  const thigh = P.left_thigh, shin = P.left_shin, foot = P.left_foot;
  const legLen = (thigh.bottom[1] - thigh.top[1]) + (shin.bottom[1] - shin.top[1]) + (foot.bbox[3] - foot.attach![1]);
  const ground = hy + legLen;
  const chinY = tTop + th * 0.16;
  const figTop = chinY - (P.Neutral_head ?? Object.values(P).find((p) => p.chin))!.chin![1];
  return { tTop, tBot, cx, shoulderL, shoulderR, hipL, hipR, ground, chinY, figH: ground - figTop, T };
};

const Chain: React.FC<{ char: string; segs: Part[]; angles: number[]; end?: Part; endAngle?: number }> = ({ char, segs, angles, end, endAngle = 0 }) => {
  // recursive: segment k rotates about its top joint; next segment hangs from its bottom joint
  const [p, ...rest] = segs;
  const [a, ...ra] = angles;
  if (!p) {
    return end ? <g transform={`rotate(${endAngle})`}><Img char={char} p={end} x={-end.attach![0]} y={-end.attach![1] - 3} /></g> : null;
  }
  return (
    <g transform={`rotate(${a})`}>
      <Img char={char} p={p} x={-p.top[0]} y={-p.top[1]} />
      <g transform={`translate(${p.bottom[0] - p.top[0]} ${p.bottom[1] - p.top[1]})`}>
        <Chain char={char} segs={rest} angles={ra} end={end} endAngle={endAngle} />
      </g>
    </g>
  );
};

export const LayerPuppet: React.FC<PuppetProps> = ({
  char, x, y, height = 520, flip = false, head = "Neutral", talk, talkOffset = 0, blink = true,
  armL = ARMS.rest as Arm, armR = ARMS.rest as Arm, walk, tilt = 0, bob = 0, children, speak, fall = 0,
}) => {
  const f = useCurrentFrame();
  const ctx = useContext(TalkContext);
  const c = M[char];
  const P = c.parts;
  const L = layout(char);
  const heads = Object.keys(P).filter((k) => k.endsWith("_head"));
  usePreload(Object.values(P).map((p) => staticFile(`thanksgiving/${char}/${p.file}.png`)));

  // head choice: talking flap, blinks, else requested expression
  let h = heads.includes(`${head}_head`) ? `${head}_head` : heads.includes("Neutral_head") ? "Neutral_head" : heads[0];
  let open = false;
  let accent = false, loud = false;
  if (speak) ({ open, accent, loud } = mouthAt(f, ctx.env, ctx.offset));
  else if (Array.isArray(talk)) ({ open, accent, loud } = mouthAt(f, talk, talkOffset));
  else if (talk) open = Math.floor(f / 4) % 2 === 0;
  if (open && heads.includes("Talking_head")) h = "Talking_head";
  else if (blink && heads.includes("Blinking_head") && f % 97 >= 93) h = "Blinking_head";
  const hp = P[h];

  const k = height / L.figH;
  const fl = fall > 0.999;
  const step = fl ? Math.sin(f * 1.1) * 28 : walk === undefined ? 0 : Math.sin(walk) * 20;
  const lift = walk === undefined ? 0 : -Math.abs(Math.cos(walk)) * 5;
  const breathe = Math.sin(f / 22) * 1.2;
  // talking body language (reference): arms never freeze — small every-frame wobble on both joints,
  // a quick head nod + body bob on each open-mouth accent, settles back over ~4 frames
  const talking = speak || Array.isArray(talk);
  const nod = talking && loud ? Math.max(0, 1 - ((f % 4) / 4)) * (accent || open ? 1 : 0) : 0;

  const arm = (side: "left" | "right", aIn: Arm) => {
    // a talking character whose arms were left at rest gestures instead (reference: arms up while speaking)
    const a0 = talking && aIn === ARMS.rest ? ARMS.explain : aIn;
    const ph = side === "left" ? 0 : 1.7;
    const a: Arm = fl ? { s: 120 + Math.sin(f * 0.9 + ph) * 35, e: 30 + Math.sin(f * 1.3 + ph) * 25 }
      : talking ? { ...a0, s: a0.s + Math.sin(f * 0.55 + ph) * 4 + (loud ? Math.sin(f * 0.9 + ph) * 3 : 0), e: a0.e + Math.sin(f * 0.8 + ph) * 6 }
      : { ...a0, s: a0.s + Math.sin(f / 15 + ph) * 1.5 };
    const sgn = side === "left" ? 1 : -1; // SVG rotate(+) swings a hanging limb toward -x (the left side's outward)
    const sh = side === "left" ? L.shoulderL : L.shoulderR;
    const swing = walk === undefined ? 0 : -Math.sin(walk) * 12 * sgn;
    return (
      <g transform={`translate(${sh[0]} ${sh[1]})`}>
        <Chain char={char} segs={[P[`${side}_upper_arm`], P[`${side}_forearm`]]} angles={[sgn * a.s + swing, sgn * a.e]} end={P[`${side}_hand`]} />
      </g>
    );
  };
  const leg = (side: "left" | "right", st: number) => {
    const hp2 = side === "left" ? L.hipL : L.hipR;
    return (
      <g transform={`translate(${hp2[0]} ${hp2[1]})`}>
        <Chain char={char} segs={[P[`${side}_thigh`], P[`${side}_shin`]]} angles={[st, Math.max(0, -st) * 0.5]} end={P[`${side}_foot`]} endAngle={-st * 0.6} />
      </g>
    );
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -k : k} ${k}) translate(${-L.cx} ${-L.ground}) rotate(${-fall * 100} ${L.cx} ${L.ground - 10})`}>
      {leg("left", step)}
      {leg("right", -step)}
      <g transform={`translate(0 ${bob + lift + breathe * 0.3 - nod * 4})`}>
        {!armL.front && arm("left", armL)}
        {!armR.front && arm("right", armR)}
        <Img char={char} p={P.torso} x={L.T[0]} y={L.T[1]} />
        {children}
        {armL.front && arm("left", armL)}
        {armR.front && arm("right", armR)}
        <g transform={`rotate(${tilt + breathe * 0.4 - nod * 2.5 + (talking ? Math.sin(f / 11) * 1.5 : 0)} ${L.cx} ${L.chinY})`}>
          <Img char={char} p={hp} x={L.cx - hp.chin![0]} y={L.chinY - hp.chin![1]} />
        </g>
      </g>
    </g>
  );
};

// ---------------- Quill (owl host) ----------------
const Q = M.quill;
export type QuillProps = { x: number; y: number; height?: number; flip?: boolean; talk?: number[]; talkOffset?: number; wings?: "rest" | "open"; gesture?: number; three?: boolean; tilt?: number };

export const QuillPuppet: React.FC<QuillProps> = ({ x, y, height = 520, flip = false, talk, talkOffset, wings = "rest", gesture = 0, three = false, tilt = 0 }) => {
  const f = useCurrentFrame();
  const ctx = useContext(TalkContext);
  const P = Q.parts, pos = Q.pos;
  usePreload(Object.values(P).map((p) => staticFile(`thanksgiving/quill/${p.file}.png`)));
  const m = mouthAt(f, talk ?? ctx.env, talkOffset ?? ctx.offset);
  const open = m.open;
  const head = open ? "Speaking_head" : f % 103 >= 99 ? "Blink_head" : "Neutral_head";
  const at = (n: string) => pos[n] ?? pos[n.charAt(0).toUpperCase() + n.slice(1)];
  const ground = pos.feet[1] + P.feet.bbox[3];
  const top = pos.Neutral_head[1] + P.Neutral_head.bbox[1];
  const k = height / (ground - top);
  const cx = pos.front_vest[0] + P.front_vest.size[0] / 2;
  const breathe = Math.sin(f / 20) * 2;
  const flap = Math.sin(f / 5) * gesture + (m.loud ? Math.sin(f * 0.7) * 4 : 0) - (m.accent ? 6 : 0);
  const vest = three ? "three_quarter_vest" : "front_vest";
  const wing = (n: string, pivot: [number, number], ang: number) => {
    const p = P[n]; const o = at(n);
    return (
      <g transform={`rotate(${ang} ${o[0] + pivot[0]} ${o[1] + pivot[1]})`}>
        <image href={staticFile(`thanksgiving/quill/${p.file}.png`)} x={o[0]} y={o[1]} width={p.size[0]} height={p.size[1]} />
      </g>
    );
  };
  const img = (n: string, dy = 0) => {
    const p = P[n]; const o = at(n);
    return <image href={staticFile(`thanksgiving/quill/${p.file}.png`)} x={o[0]} y={o[1] + dy} width={p.size[0]} height={p.size[1]} />;
  };
  // wing roots overlap the vest shoulders; pivots measured on the wing PNGs' inner top corner
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -k : k} ${k}) translate(${-cx} ${-ground})`}>
      {img("tail")}
      {img("feet")}
      <g transform={`translate(0 ${breathe * 0.5})`}>
        {wings === "open" ? (
          <>
            {wing("Left_open_wing", [140, 30], -flap)}
            {wing("Right_open_wing", [12, 30], flap)}
          </>
        ) : null}
        {img(vest)}
        {wings === "rest" ? (
          <>
            {wing("left_rest_wing", [80, 12], -flap * 0.5)}
            {wing("right_rest_wing", [18, 12], flap * 0.5)}
          </>
        ) : null}
        <g transform={`rotate(${tilt + breathe * 0.6} ${cx} ${pos.front_vest[1] + 20})`}>{img(head)}</g>
      </g>
    </g>
  );
};
