import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { MONTSERRAT } from "../fonts";
import { mouthAt } from "../Thanksgiving/LayerPuppet";
import { PopIn, Spr, SprProps, useExportMode, useShot } from "../Thanksgiving3/Kit";
import HEADS from "../Thanksgiving3/vp_heads.json";
import META from "../Thanksgiving3/vp_sprites.json";

/**
 * Kit for "Every US Vice President Who Became President" (VP character sheets, public/tg2/vp/<character>/<n>.png).
 * Sheet layout per character: 0 front, 1 three-quarter (faces right), 2 side, 5..11 script poses,
 * then six expression heads in the order neutral / talk / angry / shocked / sad / happy.
 */
export const INK = "#1d1712";
const HM = HEADS as unknown as Record<string, [number, number, number, number]>;
const MM = META as unknown as Record<string, number[]>;

/** Expression-head sprite per character: [neutral, talk, angry, shocked, sad, happy]. */
export const HEAD: Record<string, (number | string)[]> = {
  quill: [12, 13, 14, 15, 16, 17],
  john_adams: [12, 13, 14, 15, 16, 17],
  thomas_jefferson: [13, 14, 15, 16, 17, 18],
  aaron_burr: [13, 14, 15, 16, 17, 18],
  martin_van_buren: ["head0", "head1", "head2", "head3", "head4", "head5"],
  george_washington: ["head0", "head1", "head2", "head3", "head4", "head5"],
  andrew_jackson: [11, 12, 13, 14, 15, 16],
  william_henry_harrison: [11, 12, 13, 14, 15, 16],
  john_tyler: [12, 13, 14, 15, 16, 17],
  millard_fillmore: [11, 12, 13, 14, 15, 16],
  zachary_taylor: [11, 12, 13, 14, 15, 16],
  andrew_johnson: ["head0", "head1", "head2", "head3", "head4", "head5"],
  abraham_lincoln: [11, 12, 13, 14, 15, 16],
  chester_arthur: ["h_neutral", "h_talk", "h_angry", "h_shock", "h_sad", "h_happy"],
  james_garfield: [10, 11, 12, "head0", "head1", "head2"],
  garfield_attacker: [11, 12, 13, 14, 15, 16],
  theodore_roosevelt: [14, 15, 16, 17, 18, 19],
  calvin_coolidge: [11, 12, 13, 14, 15, 16],
  harry_truman: [12, 13, 15, 19, 12, 12],
  lyndon_johnson: [11, 12, 13, 14, 15, 16],
  gerald_ford: [12, 13, 14, 15, 16, 17],
};
export type Expr = 0 | 1 | 2 | 3 | 4 | 5;

/** A VP-sheet sprite: character `c`, sheet part `p` (pose number or name). */
export const V: React.FC<Omit<SprProps, "s"> & { c: string; p: number | string }> = ({ c, p, ...rest }) => <Spr s={`vp/${c}/${p}`} {...rest} />;

/** Character body with its head swapped for an expression head (fitted by head_fit.py into vp_heads.json). */
export const VH: React.FC<Omit<SprProps, "s"> & { c: string; p: number | string; e: Expr }> = ({ c, p, e, ...rest }) => {
  const h = HEAD[c][e];
  const [x, y, w, hh] = HM[`vp/${c}/${p}|${h}`];
  return (
    <Spr s={`vp/${c}/${p}_nohead`} {...rest}>
      <image href={staticFile(`tg2/vp/${c}/${h}.png`)} x={x} y={y} width={w} height={hh} />
    </Spr>
  );
};

/** Quill (front pose, head swapped): beak closed in story scenes; `talk` lip-syncs to the VO in 3-5 f holds. */
export const Quill: React.FC<Omit<SprProps, "s"> & { talk?: boolean; e?: Expr }> = ({ talk, e = 0, ...p }) => {
  const f = useCurrentFrame();
  const { offset, env } = useShot();
  const open = talk && mouthAt(f, env ?? [], offset).open;
  const h = HEAD.quill[open ? 1 : e];
  const [x, y, w, hh] = HM[`vp/quill/0|${h}`];
  return (
    <Spr s="vp/quill/0_nohead" stress={talk} {...p}>
      <image href={staticFile(`tg2/vp/quill/${h}.png`)} x={x} y={y} width={w} height={hh} />
    </Spr>
  );
};

/** Expression head as an icon (timelines, vote boards), centred at x,y, height `size`. Pops 7 f with overshoot. */
export const HeadIcon: React.FC<{ c: string; e?: Expr; x: number; y: number; size: number; at?: number; ring?: string }> = ({ c, e = 0, x, y, size, at = 0, ring }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f - at, [0, 7], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2.2)) });
  const key = `vp/${c}/${HEAD[c][e]}`;
  const [, , w, h] = MM[key];
  const k = size / h;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      {ring && <circle r={size * 0.62} fill={ring} stroke={INK} strokeWidth={8} />}
      <image href={staticFile(`tg2/${key}.png`)} x={(-w * k) / 2} y={-size / 2} width={w * k} height={size} />
    </g>
  );
};

/** White label box with an ink arrow to a point (hard pop-in, built-in pop SFX via PopIn). */
export const Label: React.FC<{ x: number; y: number; text: string; to?: [number, number]; at?: number; size?: number; color?: string }> = ({ x, y, text, to, at = 0, size = 48, color = "#fff" }) => {
  if (useExportMode() === "fx") return null;   // rebuilt natively in AE (labels inside bg plates stay)
  const w = text.length * size * 0.66 + 60;
  return (
    <PopIn at={at} x={x} y={y}>
      {to && <line x1={0} y1={0} x2={to[0] - x} y2={to[1] - y} stroke={INK} strokeWidth={8} strokeLinecap="round" />}
      {to && <circle cx={to[0] - x} cy={to[1] - y} r={10} fill={INK} />}
      <g transform="rotate(-3)">
        <rect x={-w / 2} y={-size} width={w} height={size * 1.75} rx={10} fill={color} stroke={INK} strokeWidth={7} />
        <text y={size * 0.32} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={size} fill={INK}>{text}</text>
      </g>
    </PopIn>
  );
};

/** Big outlined headline text (graphics), pops in. */
export const Big: React.FC<{ x: number; y: number; text: string; at?: number; size?: number; fill?: string }> = ({ x, y, text, at = 0, size = 96, fill = "#fff" }) => (
  <PopIn at={at} x={x} y={y}>
    <text textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={size} fill={fill} stroke={INK} strokeWidth={size / 9} paintOrder="stroke">{text}</text>
  </PopIn>
);

/** Blue sweat drop beside a head (worry), slides down 3 px over its life. */
export const Sweat: React.FC<{ x: number; y: number; at?: number; s?: number }> = ({ x, y, at = 0, s = 1 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const d = Math.min(12, (f - at) * 0.4);
  return <path transform={`translate(${x} ${y + d}) scale(${s})`} d="M 0 -40 C 14 -14 24 0 24 14 A 24 24 0 0 1 -24 14 C -24 0 -14 -14 0 -40 Z" fill="#8fd0f2" stroke={INK} strokeWidth={6} />;
};

/** Warm lamp glow that flickers on 2s; `boost` from frame `at` (the lamp being raised). */
export const LampGlow: React.FC<{ x: number; y: number; r?: number; at?: number }> = ({ x, y, r = 520, at = 99999 }) => {
  const f = useCurrentFrame();
  const fl = Math.floor(f / 2);
  const k = (0.75 + ((fl * 37) % 11) / 60) * (f >= at ? 1.25 : 1);
  return (
    <g style={{ mixBlendMode: "screen" }}>
      <radialGradient id="vp-lamp"><stop offset="0" stopColor="#ffd27a" stopOpacity={0.75} /><stop offset="0.45" stopColor="#ffb347" stopOpacity={0.25} /><stop offset="1" stopColor="#ffb347" stopOpacity={0} /></radialGradient>
      <circle cx={x} cy={y} r={r * k} fill="url(#vp-lamp)" />
    </g>
  );
};

/** Red zig-zag "down" chart arrow drawing on over 11 f (style bible: charts). */
export const DownArrow: React.FC<{ at: number; x?: number; y?: number; w?: number; h?: number }> = ({ at, x = 300, y = 260, w = 1300, h = 560 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f - at, [0, 11], [0, 1], { extrapolateRight: "clamp" });
  const pts: [number, number][] = [[0, 0], [0.22, 0.28], [0.36, 0.16], [0.58, 0.55], [0.72, 0.42], [1, 1]];
  const d = pts.map(([a, b], i) => `${i ? "L" : "M"} ${x + a * w} ${y + b * h}`).join(" ");
  const ex = x + w, ey = y + h;
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={46} strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1`} />
      <path d={d} fill="none" stroke="#e02b2b" strokeWidth={30} strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1`} />
      {p >= 1 && <path d={`M ${ex + 40} ${ey + 40} L ${ex - 90} ${ey + 10} L ${ex + 10} ${ey - 90} Z`} fill="#e02b2b" stroke={INK} strokeWidth={8} strokeLinejoin="round" />}
    </g>
  );
};

/** Electoral-vote board on a dark-teal plate: head icon + name + bar growing over 12 f + role tag. */
export const VoteBoard: React.FC<{ title: string; rows: { c: string; name: string; v: number; max: number; role?: string; roleAt?: number; roleColor?: string }[]; at?: number }> = ({ title, rows, at = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect width={1920} height={1080} fill="#1f4a4f" />
      <radialGradient id="vp-teal" cx="50%" cy="45%" r="70%"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.35} /></radialGradient>
      <rect width={1920} height={1080} fill="url(#vp-teal)" />
      <text x={960} y={150} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={70} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke">{title}</text>
      {rows.map((r, i) => {
        const y = 360 + i * 300;
        const g = interpolate(f - at - 3 - i * 4, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        const W = 1000 * (r.v / r.max);
        return (
          <g key={i}>
            <HeadIcon c={r.c} x={300} y={y} size={220} at={at + i * 4} ring="#f4f1ea" />
            <text x={470} y={y - 50} fontFamily={MONTSERRAT} fontWeight={800} fontSize={58} fill="#fff" stroke={INK} strokeWidth={7} paintOrder="stroke">{r.name}</text>
            <rect x={470} y={y - 20} width={W * g} height={90} rx={12} fill="#e9b23c" stroke={INK} strokeWidth={7} />
            <text x={470 + W * g + 30} y={y + 50} fontFamily={MONTSERRAT} fontWeight={800} fontSize={70} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke" opacity={g}>{Math.round(r.v * g)}</text>
            {r.role && <Label x={1450} y={y - 70} text={r.role} at={r.roleAt ?? 0} size={44} color={r.roleColor ?? "#fff"} />}
          </g>
        );
      })}
    </g>
  );
};

/** Year timeline on a dark-teal plate: red line draws, year ticks, head icons pop at their years. */
export const Timeline: React.FC<{ from: number; to: number; marks: { year: number; c: string; at: number; label?: string }[]; drawAt?: number; drawFrames?: number }> = ({ from, to, marks, drawAt = 0, drawFrames = 40 }) => {
  const f = useCurrentFrame();
  const X = (yr: number) => 260 + ((yr - from) / (to - from)) * 1400;
  const p = interpolate(f - drawAt, [0, drawFrames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ticks: number[] = [];
  for (let y = Math.ceil(from / 5) * 5; y <= to; y += 5) ticks.push(y);
  return (
    <g>
      <rect width={1920} height={1080} fill="#1f4a4f" />
      <rect x={260} y={600} width={1400} height={14} fill="#0f2a2d" />
      <rect x={260} y={600} width={1400 * p} height={14} fill="#e02b2b" />
      {ticks.map((y) => (
        <g key={y}><rect x={X(y) - 3} y={584} width={6} height={46} fill="#f4f1ea" />
          <text x={X(y)} y={690} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={40} fill="#f4f1ea">{y}</text></g>
      ))}
      {marks.map((m, i) => (
        <g key={i}>
          <HeadIcon c={m.c} x={X(m.year)} y={420} size={230} at={m.at} ring="#f4f1ea" />
          {m.label && <Big x={X(m.year)} y={850} text={m.label} at={m.at + 2} size={64} />}
        </g>
      ))}
    </g>
  );
};

/** Air Force One cabin interior: curved cream walls, oval windows on blue sky, seal, blue carpet. */
export const PlaneCabin: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect width={1920} height={1080} fill="#e9e1cf" />
      <path d="M 0 0 L 1920 0 L 1920 140 Q 960 60 0 140 Z" fill="#d6ccb6" />
      {[160, 520, 1400, 1760].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={420} rx={70} ry={100} fill="#c7bba2" />
          <ellipse cx={x} cy={420} rx={56} ry={84} fill="#8ec5ea" />
          <rect x={x - 56} y={(f * 3 + i * 90) % 200 + 330} width={112} height={26} fill="#fff" opacity={0.7} rx={13} />
          <ellipse cx={x} cy={420} rx={56} ry={84} fill="none" stroke={INK} strokeWidth={6} />
        </g>
      ))}
      <circle cx={960} cy={330} r={110} fill="#2f4a6b" stroke="#c9a640" strokeWidth={14} />
      <circle cx={960} cy={330} r={70} fill="#f4f1ea" opacity={0.85} />
      <path d="M 930 330 l 30 -40 l 30 40 l -30 30 z" fill="#c9a640" />
      <rect y={820} width={1920} height={260} fill="#2c4466" />
      <rect y={820} width={1920} height={16} fill="#1d2f47" />
      {[60, 1700].map((x) => <rect key={x} x={x} y={600} width={170} height={240} rx={30} fill="#b9a988" stroke={INK} strokeWidth={6} />)}
    </g>
  );
};

/** Vermont farmhouse parlor at night: wallpaper, moonlit window, rag rug, plank floor (lamp glow added per shot). */
export const Parlor: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#3a2a2c" />
    {Array.from({ length: 20 }, (_, i) => <rect key={i} x={i * 100} y={0} width={40} height={820} fill="#33242a" />)}
    <rect x={180} y={180} width={340} height={400} fill="#0f1b33" stroke="#5c3d24" strokeWidth={22} />
    <circle cx={420} cy={270} r={44} fill="#e8e3c8" />
    <line x1={350} y1={180} x2={350} y2={580} stroke="#5c3d24" strokeWidth={14} /><line x1={180} y1={380} x2={520} y2={380} stroke="#5c3d24" strokeWidth={14} />
    <rect x={1360} y={220} width={240} height={180} fill="#5c3d24" stroke={INK} strokeWidth={6} /><rect x={1380} y={240} width={200} height={140} fill="#7b6a52" />
    <rect y={820} width={1920} height={260} fill="#4a3020" />
    {Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} y1={850 + i * 30} x2={1920} y2={850 + i * 30} stroke="#3a2416" strokeWidth={3} />)}
    <ellipse cx={960} cy={1000} rx={620} ry={70} fill="#6b3b3b" opacity={0.8} />
    <rect width={1920} height={1080} fill="#000" opacity={0.35} />
  </g>
);

/** House of Representatives (1801): tiered gallery arches, dark wood, flag. */
export const HouseChamber: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#d9c9a3" />
    {Array.from({ length: 7 }, (_, i) => (
      <g key={i}>
        <path d={`M ${i * 290 - 40} 520 L ${i * 290 - 40} 220 Q ${i * 290 + 90} 90 ${i * 290 + 220} 220 L ${i * 290 + 220} 520 Z`} fill="#b39f74" />
        <rect x={i * 290 + 220} y={120} width={70} height={420} fill="#efe3c4" stroke="#a89466" strokeWidth={4} />
      </g>
    ))}
    <rect y={520} width={1920} height={60} fill="#6b4529" />
    {Array.from({ length: 3 }, (_, r) => <rect key={r} y={600 + r * 80} width={1920} height={50} fill={["#7a4f2f", "#6b4529", "#5c3a22"][r]} />)}
    <rect y={840} width={1920} height={240} fill="#3e5a3a" />
  </g>
);

/** Ballot-box beat helper: a paper ballot that types on two votes. */
export const Ballot: React.FC<{ x: number; y: number; lines: string[]; at?: number; rot?: number }> = ({ x, y, lines, at = 0, rot = -4 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const n = Math.floor(((f - at) / 30) * 15);
  let left = n;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-330} y={-230} width={660} height={460} fill="#000" opacity={0.25} transform="translate(14 14)" />
      <rect x={-330} y={-230} width={660} height={460} fill="#f6ecd2" stroke={INK} strokeWidth={8} />
      {lines.map((l, i) => {
        const s = l.slice(0, Math.max(0, left)); left -= l.length;
        return <text key={i} x={-280} y={-130 + i * 110} fontFamily={MONTSERRAT} fontWeight={800} fontSize={i === 0 ? 46 : 58} fill={INK}>{s}</text>;
      })}
    </g>
  );
};

// ------------------------------------------------------------------------------------------------
// US map (style bible: mottled blue water, beige land, white coastline rings, red/colour region fills)
// ------------------------------------------------------------------------------------------------
const PX = (lon: number, lat: number): [number, number] => [(lon + 126) * 27.5 + 130, (50.5 - lat) * 33 + 120];
const poly = (pts: [number, number][]) => pts.map(([lo, la], i) => `${i ? "L" : "M"} ${PX(lo, la).join(" ")}`).join(" ") + " Z";
const US: [number, number][] = [[-124.7, 48.4], [-123.9, 46.2], [-124.2, 42], [-124.2, 40.4], [-122.4, 37.8], [-120.6, 34.6], [-117.1, 32.5], [-114.7, 32.7], [-111, 31.3], [-108.2, 31.3], [-106.5, 31.8], [-104.5, 29.6], [-103, 29], [-101.4, 29.8], [-99.5, 27.5], [-97.4, 25.9], [-97.4, 27.8], [-94.7, 29.4], [-93.8, 29.7], [-90, 29.2], [-89.4, 30.1], [-88, 30.4], [-85, 29.7], [-83, 29], [-82.7, 27.8], [-81.7, 25.9], [-80.1, 25.8], [-80, 27], [-80.6, 28.5], [-81.4, 30.7], [-80.9, 32], [-79, 33.6], [-77.9, 34.1], [-75.5, 35.2], [-76, 37], [-75.9, 38.3], [-74.9, 38.9], [-74, 40.5], [-72, 41], [-70, 41.6], [-70.6, 42.6], [-70.2, 43.7], [-67, 44.8], [-67.8, 47.1], [-69.2, 47.4], [-71, 45], [-74.9, 45], [-76.8, 43.6], [-79, 43.3], [-79.1, 42.9], [-82.5, 41.7], [-83.1, 42.1], [-82.4, 43], [-82.5, 45.3], [-84.6, 46.4], [-88.4, 48.3], [-89.5, 48], [-94.6, 48.7], [-95.2, 49], [-123.3, 49]];
export const REGIONS: Record<string, [number, number][]> = {
  cession: [[-124.2, 42], [-104.5, 42], [-105.8, 38], [-106.5, 35.5], [-106.6, 32], [-114.7, 32.7], [-117.1, 32.5], [-120.6, 34.6], [-122.4, 37.8], [-124.2, 40.4]],
  california: [[-124.2, 42], [-120, 42], [-120, 39], [-114.6, 35], [-114.7, 32.7], [-117.1, 32.5], [-120.6, 34.6], [-122.4, 37.8], [-124.2, 40.4]],
  free: [[-95.2, 49], [-95.6, 40.6], [-91.4, 40.4], [-89.1, 37], [-84.8, 39.1], [-80.5, 39.7], [-75.7, 39.7], [-74.9, 38.9], [-74, 40.5], [-72, 41], [-70, 41.6], [-70.6, 42.6], [-70.2, 43.7], [-67, 44.8], [-67.8, 47.1], [-69.2, 47.4], [-71, 45], [-74.9, 45], [-76.8, 43.6], [-79, 43.3], [-79.1, 42.9], [-82.5, 41.7], [-83.1, 42.1], [-82.4, 43], [-82.5, 45.3], [-84.6, 46.4], [-88.4, 48.3], [-89.5, 48], [-94.6, 48.7]],
};
export const mapXY = PX;
/** US map plate; `fills` = [region, colour, frame it cross-fades in over 8 f]; `tint` = whole land colour fade. */
export const USMap: React.FC<{ fills?: [string, string, number][]; tint?: [string, number]; pins?: { lon: number; lat: number; at: number; name?: string }[] }> = ({ fills = [], tint, pins = [] }) => {
  const f = useCurrentFrame();
  const fade = (at: number) => interpolate(f - at, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g>
      <rect width={1920} height={1080} fill="#3d7fb3" />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 397) % 1920} cy={(i * 251) % 1080} r={90 + (i % 5) * 30} fill="#4a8cc0" opacity={0.35} />)}
      <path d={poly(US)} fill="none" stroke="#fff" strokeWidth={36} opacity={0.25} strokeLinejoin="round" />
      <path d={poly(US)} fill="#e9dcb6" stroke="#fff" strokeWidth={12} strokeLinejoin="round" />
      {tint && <path d={poly(US)} fill={tint[0]} opacity={0.75 * fade(tint[1])} />}
      {fills.map(([r, c, at], i) => <path key={i} d={poly(REGIONS[r])} fill={c} opacity={0.9 * fade(at)} stroke={INK} strokeWidth={4} strokeDasharray="14 10" />)}
      <path d={poly(US)} fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {pins.map((p, i) => f >= p.at && (
        <g key={i} transform={`translate(${PX(p.lon, p.lat).join(" ")})`}>
          <path d="M 0 0 C -30 -36 -30 -76 0 -76 C 30 -76 30 -36 0 0 Z" fill="#e02b2b" stroke={INK} strokeWidth={6} /><circle cy={-50} r={11} fill="#fff" />
          {p.name && <text y={56} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={46} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke">{p.name}</text>}
        </g>
      ))}
    </g>
  );
};

/** Plain vote bars (no head icons) on the dark-teal plate, with an optional gap marker between two rows. */
export const Bars: React.FC<{ title: string; rows: { name: string; v: number; color?: string }[]; max: number; at?: number; gap?: { text: string; at: number } }> = ({ title, rows, max, at = 0, gap }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect width={1920} height={1080} fill="#1f4a4f" />
      <text x={960} y={160} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={70} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke">{title}</text>
      {rows.map((r, i) => {
        const y = 400 + i * 260;
        const g = interpolate(f - at - 3 - i * 5, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
        const W = 1300 * (r.v / max);
        return (
          <g key={i}>
            <text x={260} y={y - 40} fontFamily={MONTSERRAT} fontWeight={800} fontSize={58} fill="#fff" stroke={INK} strokeWidth={7} paintOrder="stroke">{r.name}</text>
            <rect x={260} y={y - 10} width={W * g} height={100} rx={12} fill={r.color ?? "#e9b23c"} stroke={INK} strokeWidth={7} />
            <text x={260 + W * g + 30} y={y + 66} fontFamily={MONTSERRAT} fontWeight={800} fontSize={76} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke" opacity={g}>{Math.round(r.v * g)}</text>
          </g>
        );
      })}
      {gap && <Big x={960} y={1000} text={gap.text} at={gap.at} size={70} fill="#ff8a7a" />}
    </g>
  );
};

/** Speech bubble above a speaker (bubble bottom well above the hair), tail to the mouth, text types on at 15 cps. */
export const Bubble: React.FC<{ x: number; y: number; w: number; text: string; at?: number; tail: [number, number]; shout?: boolean; size?: number }> = ({ x, y, w, text, at = 0, tail, shout, size = 50 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f - at, [0, 4], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
  const n = Math.floor(((f - at) / 30) * 15);
  const words = text.slice(0, n);
  const lines: string[] = [];
  let cur = "";
  for (const wd of words.split(" ")) { if ((cur + " " + wd).length * size * 0.62 > w - 60 && cur) { lines.push(cur); cur = wd; } else cur = cur ? cur + " " + wd : wd; }
  if (cur) lines.push(cur);
  const h = Math.max(1, Math.ceil((text.length * size * 0.62) / (w - 60))) * size * 1.2 + 60;
  const shape = shout
    ? Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2, r = i % 2 ? 1 : 1.13; return `${i ? "L" : "M"} ${(Math.cos(a) * w * 0.55 * r).toFixed(1)} ${(Math.sin(a) * h * 0.62 * r).toFixed(1)}`; }).join(" ") + " Z"
    : `M ${-w / 2} ${-h / 2} h ${w} v ${h} h ${-w} Z`;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <path d={`M ${-30} ${h / 2 - 4} L ${tail[0] - x} ${tail[1] - y} L ${30} ${h / 2 - 4} Z`} fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d={shape} fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" rx={30} />
      <rect x={-36} y={h / 2 - 14} width={72} height={20} fill="#fff" />
      {lines.map((l, i) => <text key={i} y={-h / 2 + 40 + size * 0.9 + i * size * 1.2} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={size} fill={INK}>{l}</text>)}
    </g>
  );
};

/** Red spiky impact splat (4-5 f) - style bible war FX, used for the shot. */
export const Splat: React.FC<{ x: number; y: number; at: number; r?: number }> = ({ x, y, at, r = 110 }) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > 5) return null;
  const pts = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2, k = i % 2 ? 0.45 : 1; return `${i ? "L" : "M"} ${(Math.cos(a) * r * k).toFixed(1)} ${(Math.sin(a) * r * k).toFixed(1)}`; }).join(" ") + " Z";
  return <path transform={`translate(${x} ${y}) rotate(${f * 9})`} d={pts} fill="#e02b2b" stroke={INK} strokeWidth={6} strokeLinejoin="round" />;
};
