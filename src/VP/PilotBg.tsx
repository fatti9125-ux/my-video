import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SImg } from "../Thanksgiving3/Kit";
import { MONTSERRAT } from "../fonts";
import { HEAD, INK } from "./VKit";

/**
 * Place-specific painted plates for the pilot (reference_analysis/Animation_Production_Spec.md §4).
 * Each place is built as its real location (layout taken from the public-domain photos in bgref/), in
 * 4-7 depth layers, with mood carried by grade and light. Background line work is thinner and warmer
 * than the characters' ink (plates read as painted, characters read as cut-outs on top). Foreground
 * occluders (tables, desks, blankets, fences) are separate components drawn AFTER the characters.
 */

const L = "#2b2119";            // background line colour
const lw = 4;                   // background line width (characters use ~9 px)

const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/** Soft painted texture + vignette for every plate. */
const Paint: React.FC<{ vig?: number; warm?: boolean }> = ({ vig = 0.45, warm = true }) => (
  <g pointerEvents="none">
    <defs>
      <filter id="pb-tex" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={4} seed={11} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <radialGradient id="pb-vig" cx="50%" cy="48%" r="72%">
        <stop offset="0.5" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor={warm ? "#1a0f05" : "#05070f"} stopOpacity={1} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} filter="url(#pb-tex)" opacity={0.16} style={{ mixBlendMode: "soft-light" }} />
    <rect width={1920} height={1080} fill="url(#pb-vig)" opacity={vig} />
  </g>
);

const Cloud: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 0.95 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fbfbf7" opacity={o}>
    <ellipse cx={0} cy={0} rx={120} ry={42} /><ellipse cx={-70} cy={8} rx={70} ry={34} /><ellipse cx={60} cy={-18} rx={80} ry={46} /><ellipse cx={130} cy={10} rx={60} ry={28} />
  </g>
);

const Foliage: React.FC<{ x: number; y: number; s?: number; dark?: boolean }> = ({ x, y, s = 1, dark }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 37 + x) * 1.2;
  const c = dark ? ["#2f4d2b", "#3b5f33", "#263f24"] : ["#4f7d3a", "#629448", "#3e6a30"];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -14 0 L -10 -180 M -10 -150 Q 30 -200 70 -220 M -10 -170 Q -50 -210 -80 -230" stroke="#4a3626" strokeWidth={20} fill="none" strokeLinecap="round" />
      <g transform={`rotate(${sw} 0 -200)`} stroke={L} strokeWidth={3}>
        <ellipse cx={-80} cy={-250} rx={120} ry={95} fill={c[2]} />
        <ellipse cx={70} cy={-260} rx={130} ry={100} fill={c[0]} />
        <ellipse cx={-10} cy={-330} rx={130} ry={105} fill={c[1]} />
        <ellipse cx={20} cy={-220} rx={110} ry={70} fill={c[0]} />
      </g>
    </g>
  );
};

// ------------------------------------------------------------------ Albany: New York State Capitol (c. 1899)
/** NY State Capitol, Albany: granite chateau block, corner towers with steep red-tile roofs, grand stair. */
export const AlbanyCapitol: React.FC = () => {
  const f = useCurrentFrame();
  const win = (x: number, y: number, w: number, h: number, k: string) => (
    <g key={k}>
      <path d={`M ${x} ${y + h} L ${x} ${y + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} L ${x + w} ${y + h} Z`} fill="#3c4a5c" stroke="#8d806b" strokeWidth={5} />
      <line x1={x + w / 2} y1={y + 6} x2={x + w / 2} y2={y + h} stroke="#8d806b" strokeWidth={3} />
      <path d={`M ${x + 4} ${y + h - 4} L ${x + 4} ${y + w / 2 + 4}`} stroke="#9fb6cf" strokeWidth={3} opacity={0.6} />
    </g>
  );
  return (
    <g>
      <defs>
        <linearGradient id="pb-sky-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fa4d4" /><stop offset="0.6" stopColor="#bcd8e8" /><stop offset="1" stopColor="#eef0e2" />
        </linearGradient>
        <linearGradient id="pb-granite" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9cdb4" /><stop offset="0.55" stopColor="#c9bc9f" /><stop offset="1" stopColor="#a89a80" />
        </linearGradient>
        <linearGradient id="pb-tile" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c4643f" /><stop offset="1" stopColor="#8e4229" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#pb-sky-day)" />
      <Cloud x={260 + f * 0.15} y={130} s={1.1} /><Cloud x={1500 + f * 0.1} y={95} s={0.9} /><Cloud x={980 + f * 0.12} y={60} s={0.6} o={0.8} />
      {/* far trees */}
      {Array.from({ length: 22 }, (_, i) => <ellipse key={i} cx={i * 92} cy={700 - (i % 3) * 12} rx={80} ry={60} fill={i % 2 ? "#5d7f4d" : "#4f7143"} />)}
      {/* main block + roof */}
      <path d="M 300 310 L 420 210 L 1500 210 L 1620 310 Z" fill="url(#pb-tile)" stroke={L} strokeWidth={lw} />
      {[520, 700, 1220, 1400].map((x, i) => (
        <g key={i}><path d={`M ${x} 300 L ${x} 250 L ${x + 40} 222 L ${x + 80} 250 L ${x + 80} 300 Z`} fill="#d3c6aa" stroke={L} strokeWidth={3} /><rect x={x + 22} y={255} width={36} height={40} fill="#3c4a5c" /></g>
      ))}
      <rect x={300} y={300} width={1320} height={430} fill="url(#pb-granite)" stroke={L} strokeWidth={lw} />
      {/* corner towers */}
      {[230, 1500].map((x, i) => (
        <g key={i}>
          <path d={`M ${x} 210 L ${x + 95} 40 L ${x + 190} 210 Z`} fill="url(#pb-tile)" stroke={L} strokeWidth={lw} />
          <path d={`M ${x + 95} 40 L ${x + 95} 14`} stroke={L} strokeWidth={6} />
          <rect x={x} y={200} width={190} height={530} fill={i ? "#b3a588" : "#dccfb5"} stroke={L} strokeWidth={lw} />
          {[0, 1, 2].map((r) => <g key={r}>{win(x + 30, 260 + r * 150, 52, 100, `a${r}`)}{win(x + 108, 260 + r * 150, 52, 100, `b${r}`)}</g>)}
        </g>
      ))}
      {/* centre pavilion */}
      <path d="M 760 250 L 960 150 L 1160 250 Z" fill="url(#pb-tile)" stroke={L} strokeWidth={lw} />
      <rect x={760} y={245} width={400} height={485} fill="#d4c7ab" stroke={L} strokeWidth={lw} />
      {/* window rows on the main block */}
      {[0, 1, 2].map((r) => Array.from({ length: 12 }, (_, i) => {
        const x = 440 + i * 92 + (i >= 4 ? 80 : 0) + (i >= 8 ? 80 : 0);
        if (x > 1450) return null;
        return win(x, 330 + r * 130, 50, 92, `w${r}-${i}`);
      }))}
      {/* entrance arches */}
      {[810, 915, 1020].map((x, i) => <path key={i} d={`M ${x} 730 L ${x} 610 A 45 45 0 0 1 ${x + 90} 610 L ${x + 90} 730 Z`} fill="#2e3540" stroke={L} strokeWidth={lw} />)}
      {/* shadow side of the block (sun from the left) */}
      <rect x={1160} y={300} width={460} height={430} fill="#4a3a2a" opacity={0.12} />
      {/* grand staircase */}
      <path d="M 700 730 L 1220 730 L 1460 905 L 460 905 Z" fill="#cfc2a6" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 10 }, (_, i) => { const y = 748 + i * 17.5; const t = (y - 730) / 175; return <line key={i} x1={700 - t * 240} y1={y} x2={1220 + t * 240} y2={y} stroke="#a89a80" strokeWidth={3} />; })}
      <path d="M 640 730 L 700 730 L 460 905 L 380 905 Z" fill="#b8aa8e" stroke={L} strokeWidth={lw} />
      <path d="M 1220 730 L 1280 730 L 1540 905 L 1460 905 Z" fill="#a1937a" stroke={L} strokeWidth={lw} />
      {[420, 1500].map((x, i) => (
        <g key={i} stroke={L} strokeWidth={4}>
          <rect x={x - 8} y={720} width={16} height={190} fill="#2b2a2a" /><rect x={x - 22} y={690} width={44} height={40} fill="#f2e2a6" /><path d={`M ${x - 28} 690 L ${x} 668 L ${x + 28} 690 Z`} fill="#2b2a2a" />
        </g>
      ))}
      {/* plaza */}
      <rect y={900} width={1920} height={180} fill="#d6cbb3" />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={i * 260 - 300} y1={1080} x2={960 + (i - 4) * 120} y2={900} stroke="#c0b399" strokeWidth={3} />)}
      {[930, 975, 1030].map((y, i) => <line key={i} x1={0} y1={y} x2={1920} y2={y} stroke="#c0b399" strokeWidth={3} />)}
      <Foliage x={110} y={930} s={1.25} /><Foliage x={1830} y={940} s={1.3} />
      <Paint vig={0.3} />
    </g>
  );
};

// ------------------------------------------------------------------ party bosses' back room
/** Smoky back room: olive damask walls, framed TR portrait, hanging green-shade lamp, smoke. */
export const BackRoom: React.FC = () => {
  const f = useCurrentFrame();
  const head = `vp/theodore_roosevelt/${HEAD.theodore_roosevelt[0]}`;
  return (
    <g>
      <defs>
        <pattern id="pb-damask" width={90} height={110} patternUnits="userSpaceOnUse">
          <rect width={90} height={110} fill="#3e4a33" />
          <path d="M 45 18 C 30 35 30 55 45 70 C 60 55 60 35 45 18 Z M 45 70 L 45 92" fill="#46543a" stroke="#46543a" strokeWidth={4} />
          <circle cx={0} cy={0} r={6} fill="#46543a" /><circle cx={90} cy={110} r={6} fill="#46543a" />
        </pattern>
        <radialGradient id="pb-cone" cx="50%" cy="0%" r="100%">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity={0.5} /><stop offset="1" stopColor="#ffe9a8" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="pb-room-dark" cx="50%" cy="58%" r="70%">
          <stop offset="0.35" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#0a0805" stopOpacity={0.75} />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#pb-damask)" />
      <rect width={1920} height={70} fill="#2a1d12" />
      <rect y={190} width={1920} height={12} fill="#6b4a2a" />
      <rect y={690} width={1920} height={390} fill="#3a2617" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={40 + i * 240} y={730} width={190} height={250} fill="none" stroke="#2a1b10" strokeWidth={6} />)}
      {/* framed portrait of TR (slightly crooked) */}
      <g transform="rotate(-3 470 410)">
        <rect x={330} y={250} width={280} height={330} fill="#b0883c" stroke={L} strokeWidth={lw} />
        <rect x={355} y={275} width={230} height={280} fill="#8c7a5a" />
        <SImg href={staticFile(`tg2/${head}.png`)} x={380} y={300} width={180} height={220} preserveAspectRatio="xMidYMid meet" />
        <rect x={355} y={275} width={230} height={280} fill="#6b4a1f" opacity={0.22} />
        <path d="M 360 280 L 440 280 L 360 400 Z" fill="#fff" opacity={0.12} />
      </g>
      {/* landscape painting + door */}
      <rect x={1270} y={270} width={300} height={200} fill="#9c7a3e" stroke={L} strokeWidth={lw} />
      <rect x={1290} y={290} width={260} height={160} fill="#7f8f6e" /><path d="M 1290 410 Q 1380 350 1450 395 T 1550 380 L 1550 450 L 1290 450 Z" fill="#55664a" />
      <rect x={1700} y={230} width={220} height={480} fill="#241710" stroke={L} strokeWidth={lw} />
      {/* hanging lamp with light cone */}
      <line x1={960} y1={70} x2={960} y2={215} stroke="#1c140d" strokeWidth={6} />
      <path d="M 300 1080 L 860 290 L 1060 290 L 1620 1080 Z" fill="url(#pb-cone)" style={{ mixBlendMode: "screen" }} />
      <path d="M 880 290 L 910 215 L 1010 215 L 1040 290 Z" fill="#2e6b3e" stroke={L} strokeWidth={lw} />
      <ellipse cx={960} cy={292} rx={82} ry={14} fill="#fff1bd" />
      <rect width={1920} height={1080} fill="url(#pb-room-dark)" />
      {/* drifting cigar smoke layers */}
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx={380 + i * 380 + Math.sin(f / 40 + i) * 60} cy={260 + Math.cos(f / 55 + i * 2) * 30} rx={260} ry={60} fill="#b9b5a2" opacity={0.12} />
      ))}
      <Paint vig={0.4} />
    </g>
  );
};

/** Card table + seated silhouette bosses (foreground, drawn after the standing characters). */
export const BackRoomTable: React.FC = () => {
  const f = useCurrentFrame();
  const boss = (x: number, flip: number, hat: "bowler" | "top", k: string) => (
    <g key={k} transform={`translate(${x} 0) scale(${flip} 1)`}>
      <path d="M -150 1080 L -150 860 Q -150 770 -60 760 L 60 760 Q 150 770 150 860 L 150 1080 Z" fill="#1b1611" />
      <ellipse cx={0} cy={690} rx={78} ry={88} fill="#1b1611" />
      {hat === "bowler" ? <g fill="#120e0a"><ellipse cx={0} cy={625} rx={105} ry={18} /><path d="M -64 628 Q -64 540 0 540 Q 64 540 64 628 Z" /></g>
        : <g fill="#120e0a"><rect x={-96} y={612} width={192} height={20} rx={8} /><rect x={-58} y={500} width={116} height={120} /></g>}
      <path d="M -78 700 Q -82 640 -50 610" stroke="#8a6a3a" strokeWidth={6} fill="none" opacity={0.7} />
      <rect x={70} y={712} width={70} height={14} rx={6} fill="#5a3b22" transform="rotate(-8 70 712)" />
      <circle cx={142} cy={702} r={7} fill="#ff8a3a" opacity={0.6 + 0.4 * Math.sin(f / 6 + x)} />
    </g>
  );
  return (
    <g>
      {boss(200, 1, "top", "b1")}{boss(1720, -1, "bowler", "b2")}
      <ellipse cx={960} cy={1050} rx={900} ry={190} fill="#4a2c14" stroke={L} strokeWidth={lw} />
      <ellipse cx={960} cy={1040} rx={860} ry={170} fill="#2f6b3e" />
      <ellipse cx={960} cy={1000} rx={560} ry={70} fill="#ffe9a8" opacity={0.18} />
      {[[620, 955, -12], [700, 970, 9], [1240, 960, 14], [1180, 985, -6]].map(([x, y, r], i) => <rect key={i} x={x} y={y} width={60} height={84} rx={6} fill="#f5f0e2" stroke={L} strokeWidth={3} transform={`rotate(${r} ${x} ${y})`} />)}
      {[[860, 990, "#c33"], [900, 1005, "#f2f2f2"], [1040, 995, "#2b4a8c"], [1080, 985, "#c33"]].map(([x, y, c], i) => (
        <g key={i}>{[0, 1, 2].map((s) => <ellipse key={s} cx={x as number} cy={(y as number) - s * 9} rx={26} ry={9} fill={c as string} stroke={L} strokeWidth={2} />)}</g>
      ))}
      <ellipse cx={1420} cy={985} rx={52} ry={16} fill="#7a7a74" stroke={L} strokeWidth={3} />
      {[0, 1, 2].map((i) => <path key={i} d={`M 1432 ${975 - i * 50} q ${20 + Math.sin(f / 9 + i) * 18} -25 0 -50`} stroke="#d8d4c4" strokeWidth={6} fill="none" opacity={0.35 - i * 0.08} />)}
    </g>
  );
};

// ------------------------------------------------------------------ McKinley, mourning portrait (archive look)
/** Framed sepia portrait on a dark mat, film scratches; black mourning crepe drapes in at `drapeAt`. */
export const MournPortrait: React.FC<{ c: string; drapeAt?: number }> = ({ c, drapeAt = 99999 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - drapeAt, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <g>
      <defs>
        <radialGradient id="pb-mat" cx="50%" cy="45%" r="70%"><stop offset="0" stopColor="#3a291b" /><stop offset="1" stopColor="#0c0805" /></radialGradient>
        <filter id="pb-sepia"><feColorMatrix type="matrix" values="0.39 0.77 0.19 0 0  0.35 0.69 0.17 0 0  0.27 0.53 0.13 0 0  0 0 0 1 0" /></filter>
        <clipPath id="pb-oval"><ellipse cx={960} cy={500} rx={250} ry={320} /></clipPath>
      </defs>
      <rect width={1920} height={1080} fill="url(#pb-mat)" />
      <ellipse cx={960} cy={500} rx={300} ry={372} fill="#9d7a36" stroke={L} strokeWidth={6} />
      <ellipse cx={960} cy={500} rx={272} ry={344} fill="#c4a050" stroke="#7a5a22" strokeWidth={6} />
      <g clipPath="url(#pb-oval)">
        <rect x={700} y={170} width={520} height={660} fill="#cdb88f" />
        <g filter="url(#pb-sepia)">
          <SImg href={staticFile(`tg2/vp/${c}/0.png`)} x={560} y={210} width={800} height={1240} preserveAspectRatio="xMidYMin meet" />
        </g>
        <path d="M 700 170 L 860 170 L 700 470 Z" fill="#fff" opacity={0.1} />
      </g>
      {/* film scratches, re-randomised every frame */}
      {Array.from({ length: 4 }, (_, i) => { const x = rnd(f * 7 + i) * 1920; return <line key={i} x1={x} y1={0} x2={x + (rnd(f + i) - 0.5) * 20} y2={1080} stroke="#e8dcc0" strokeWidth={1 + rnd(f * 3 + i) * 2} opacity={0.25} />; })}
      {/* mourning crepe */}
      {p > 0 && (
        <g transform={`translate(0 ${(1 - p) * -420})`}>
          <path d="M 640 140 Q 800 330 960 180 Q 1120 330 1280 140 L 1280 110 L 640 110 Z" fill="#0d0b0b" stroke="#000" strokeWidth={4} />
          <path d="M 640 140 L 610 520 Q 650 480 680 520 L 700 200 Z" fill="#0d0b0b" /><path d="M 1280 140 L 1310 520 Q 1270 480 1240 520 L 1220 200 Z" fill="#0d0b0b" />
          <circle cx={960} cy={180} r={46} fill="#0d0b0b" stroke="#2a2626" strokeWidth={6} />
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M 680 ${150 + i * 20} Q 800 ${310 + i * 6} 950 ${190 + i * 6}`} stroke="#2b2727" strokeWidth={3} fill="none" />)}
        </g>
      )}
      <Paint vig={0.55} />
    </g>
  );
};

// ------------------------------------------------------------------ Ansley Wilcox House library, Buffalo
/** Victorian library in daylight: bookcases, bay window with lace and red drapes, oriental rug. */
export const WilcoxLibrary: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="pb-wall-lib" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8f8058" /><stop offset="1" stopColor="#b9a77e" /></linearGradient>
      <linearGradient id="pb-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9f0ee" /><stop offset="1" stopColor="#cfdcd6" /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#pb-wall-lib)" />
    <rect width={1920} height={60} fill="#5c4630" /><rect y={60} width={1920} height={18} fill="#7a5f3e" />
    {/* bay window */}
    <rect x={660} y={150} width={600} height={560} fill="url(#pb-day)" stroke={L} strokeWidth={lw} />
    {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={720 + i * 130} cy={520 + (i % 2) * 20} rx={110} ry={90} fill="#9db08a" opacity={0.55} />)}
    {[860, 1060].map((x, i) => <rect key={i} x={x - 8} y={150} width={16} height={560} fill="#e9e1cc" stroke={L} strokeWidth={3} />)}
    <rect x={660} y={410} width={600} height={12} fill="#e9e1cc" stroke={L} strokeWidth={3} />
    <path d="M 660 150 Q 720 400 690 710 L 660 710 Z" fill="#f6f2e6" opacity={0.75} /><path d="M 1260 150 Q 1200 400 1230 710 L 1260 710 Z" fill="#f6f2e6" opacity={0.75} />
    <path d="M 600 120 L 700 120 Q 680 420 720 730 L 590 730 Z" fill="#6e2a25" stroke={L} strokeWidth={lw} />
    <path d="M 1320 120 L 1220 120 Q 1240 420 1200 730 L 1330 730 Z" fill="#6e2a25" stroke={L} strokeWidth={lw} />
    <rect x={580} y={108} width={760} height={22} rx={10} fill="#a37c3c" stroke={L} strokeWidth={3} />
    {/* bookcases */}
    {[[30, 540], [1380, 1890]].map(([a, b], k) => (
      <g key={k}>
        <rect x={a} y={110} width={b - a} height={760} fill="#4b2f1b" stroke={L} strokeWidth={lw} />
        {[0, 1, 2, 3, 4].map((r) => (
          <g key={r}>
            <rect x={a + 20} y={140 + r * 145} width={b - a - 40} height={125} fill="#2a1a0f" />
            {Array.from({ length: Math.floor((b - a - 50) / 26) }, (_, i) => {
              const hh = 80 + rnd(k * 999 + r * 77 + i) * 40; const cols = ["#7a2f2a", "#2f4d3a", "#3c3a63", "#7d5a2a", "#5a2a3a", "#2e3d4f"];
              return <rect key={i} x={a + 26 + i * 26} y={140 + r * 145 + 125 - hh} width={22} height={hh} fill={cols[Math.floor(rnd(k * 31 + r * 7 + i * 3) * 6)]} stroke="#1a110a" strokeWidth={2} />;
            })}
          </g>
        ))}
      </g>
    ))}
    {/* daylight beams */}
    <path d="M 700 430 L 1220 430 L 1480 1080 L 520 1080 Z" fill="#fff8de" opacity={0.14} />
    {/* floor + rug */}
    <rect y={860} width={1920} height={220} fill="#6b4529" />
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} y1={880 + i * 36} x2={1920} y2={880 + i * 36} stroke="#5a3a22" strokeWidth={3} />)}
    <ellipse cx={960} cy={1010} rx={760} ry={95} fill="#7a2b2b" stroke={L} strokeWidth={lw} />
    <ellipse cx={960} cy={1010} rx={660} ry={70} fill="none" stroke="#c9a14a" strokeWidth={8} />
    <ellipse cx={960} cy={1010} rx={540} ry={50} fill="#2f3f63" opacity={0.7} />
    <Paint vig={0.35} />
  </g>
);

// ------------------------------------------------------------------ TR's office (West Wing, 1902)
/** Walnut panelling, green upper wall, moose trophy, flag, tall daylight window. */
export const TROffice: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#2f4a3a" />
    <rect y={540} width={1920} height={540} fill="#4a2e1c" />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={20 + i * 215} y={580} width={180} height={300} fill="none" stroke="#3a2214" strokeWidth={7} />)}
    <rect y={530} width={1920} height={20} fill="#b08a3c" />
    {/* window */}
    <rect x={500} y={130} width={260} height={430} fill="#dfe9ec" stroke="#e9dfc8" strokeWidth={14} />
    <line x1={630} y1={130} x2={630} y2={560} stroke="#e9dfc8" strokeWidth={8} /><line x1={500} y1={340} x2={760} y2={340} stroke="#e9dfc8" strokeWidth={8} />
    <path d="M 760 560 L 980 1080 L 560 1080 L 500 560 Z" fill="#fff8de" opacity={0.1} />
    {/* moose trophy */}
    <g stroke={L} strokeWidth={lw}>
      <path d="M 1300 160 L 1500 160 L 1530 330 L 1270 330 Z" fill="#6b4529" />
      <path d="M 1330 250 Q 1220 170 1180 90 Q 1230 110 1250 70 Q 1270 120 1300 90 Q 1300 150 1350 200 Z" fill="#c9b48a" />
      <path d="M 1470 250 Q 1580 170 1620 90 Q 1570 110 1550 70 Q 1530 120 1500 90 Q 1500 150 1450 200 Z" fill="#c9b48a" />
      <path d="M 1340 200 Q 1400 170 1460 200 L 1470 330 Q 1460 430 1400 450 Q 1340 430 1330 330 Z" fill="#5a3a22" />
      <ellipse cx={1400} cy={430} rx={48} ry={30} fill="#3e2716" />
    </g>
    <circle cx={1370} cy={270} r={7} fill="#111" /><circle cx={1430} cy={270} r={7} fill="#111" />
    {/* flag stand */}
    <line x1={260} y1={140} x2={260} y2={900} stroke="#b08a3c" strokeWidth={10} />
    <path d="M 266 150 Q 340 200 330 330 Q 320 460 380 560 L 300 560 Q 270 400 266 300 Z" fill="#b8362f" stroke={L} strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M 270 ${210 + i * 80} Q 320 ${250 + i * 80} 330 ${290 + i * 80}`} stroke="#f2ede0" strokeWidth={14} fill="none" />)}
    <path d="M 266 150 Q 300 170 310 230 L 268 240 Z" fill="#2b3f74" />
    {/* globe */}
    <circle cx={1700} cy={680} r={80} fill="#7f9db8" stroke={L} strokeWidth={lw} /><path d="M 1650 650 Q 1690 610 1730 650 Q 1700 700 1660 690 Z" fill="#8ea86e" />
    <line x1={1700} y1={760} x2={1700} y2={880} stroke={L} strokeWidth={10} />
    <rect y={880} width={1920} height={200} fill="#3a2416" />
    <Paint vig={0.45} />
  </g>
);

/** TR's desk (foreground occluder) with papers, inkwell and a little teddy bear (1902). */
export const TRDesk: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    <rect x={380} y={790} width={1160} height={60} fill="#7a4626" />
    <rect x={420} y={850} width={1080} height={240} fill="#5a3219" />
    {[0, 1].map((i) => <rect key={i} x={470 + i * 760} y={880} width={220} height={170} fill="#4a2814" />)}
    <rect x={620} y={760} width={170} height={36} fill="#f3ecd8" transform="rotate(-4 620 760)" />
    <rect x={1250} y={752} width={40} height={42} fill="#1d1d2b" />
    <g transform="translate(1390 790)">
      <ellipse cx={0} cy={-30} rx={34} ry={36} fill="#a0703c" /><circle cx={0} cy={-80} r={28} fill="#a0703c" />
      <circle cx={-20} cy={-102} r={11} fill="#a0703c" /><circle cx={20} cy={-102} r={11} fill="#a0703c" />
      <circle cx={-9} cy={-84} r={3} fill="#111" stroke="none" /><circle cx={9} cy={-84} r={3} fill="#111" stroke="none" />
    </g>
  </g>
);

// ------------------------------------------------------------------ Plymouth Notch at night
/** Coolidge Homestead, Plymouth Notch VT, moonlit: clapboard farmhouse + ell, hills, stars, picket fence. */
export const FarmNight: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="pb-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0c1532" /><stop offset="0.7" stopColor="#1d2b6c" /><stop offset="1" stopColor="#33468a" /></linearGradient>
        <radialGradient id="pb-moon" cx="50%" cy="50%" r="50%"><stop offset="0.25" stopColor="#dfe4ff" stopOpacity={0.5} /><stop offset="1" stopColor="#dfe4ff" stopOpacity={0} /></radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#pb-night)" />
      {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 99) * 480} r={1.5 + rnd(i + 7) * 2.5} fill="#fff" opacity={0.4 + 0.5 * Math.abs(Math.sin(f / (15 + (i % 7)) + i))} />)}
      <circle cx={1540} cy={190} r={180} fill="url(#pb-moon)" /><circle cx={1540} cy={190} r={58} fill="#f1ecd2" />
      <path d="M 0 560 Q 300 420 600 520 Q 900 400 1250 500 Q 1600 430 1920 520 L 1920 1080 L 0 1080 Z" fill="#1b2a3a" />
      {Array.from({ length: 28 }, (_, i) => { const x = i * 70 + 20; const y = 520 - Math.sin(i / 3) * 50; return <path key={i} d={`M ${x} ${y - 70} L ${x - 24} ${y} L ${x + 24} ${y} Z`} fill="#122030" />; })}
      <path d="M 0 680 Q 500 600 980 660 Q 1400 610 1920 690 L 1920 1080 L 0 1080 Z" fill="#16232f" />
      {/* barn (behind, right) */}
      <path d="M 1290 640 L 1430 520 L 1570 640 L 1570 820 L 1290 820 Z" fill="#3b2a33" stroke={L} strokeWidth={lw} />
      {/* main house */}
      <path d="M 600 470 L 860 300 L 1120 470 Z" fill="#2c3142" stroke={L} strokeWidth={lw} />
      <rect x={620} y={460} width={480} height={360} fill="#b8c1d3" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={620} y1={480 + i * 28} x2={1100} y2={480 + i * 28} stroke="#9aa4ba" strokeWidth={3} />)}
      <rect x={1020} y={250} width={40} height={130} fill="#5a4a48" stroke={L} strokeWidth={3} />
      {/* ell with porch */}
      <path d="M 1100 560 L 1210 470 L 1320 560 Z" fill="#2c3142" stroke={L} strokeWidth={lw} />
      <rect x={1100} y={555} width={220} height={265} fill="#a3acc1" stroke={L} strokeWidth={lw} />
      <path d="M 1080 650 L 1340 650 L 1340 670 L 1080 670 Z" fill="#2c3142" stroke={L} strokeWidth={3} />
      {[1110, 1190, 1270, 1330].map((x, i) => <rect key={i} x={x - 5} y={670} width={10} height={150} fill="#c9d0de" />)}
      {/* windows: dark (no electricity), moon glint */}
      {[[670, 520], [800, 520], [930, 520], [670, 660], [930, 660], [1150, 590]].map(([x, y], i) => (
        <g key={i}><rect x={x} y={y} width={90} height={110} fill="#141a2a" stroke="#e1e6f0" strokeWidth={6} /><line x1={x + 45} y1={y} x2={x + 45} y2={y + 110} stroke="#e1e6f0" strokeWidth={4} /><line x1={x} y1={y + 55} x2={x + 90} y2={y + 55} stroke="#e1e6f0" strokeWidth={4} /><rect x={x + 8} y={y + 8} width={30} height={40} fill="#8c9bd4" opacity={0.25} /></g>
      ))}
      <rect x={815} y={680} width={70} height={140} fill="#2a2430" stroke="#e1e6f0" strokeWidth={6} />
      {/* yard, road, fence */}
      <path d="M 820 1080 Q 860 900 850 820 L 880 820 Q 920 900 1060 1080 Z" fill="#2c3340" />
      <rect y={900} width={1920} height={14} fill="#c7cfdd" />
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M ${i * 66 + 10} 1010 L ${i * 66 + 10} 860 L ${i * 66 + 22} 845 L ${i * 66 + 34} 860 L ${i * 66 + 34} 1010 Z`} fill="#c7cfdd" stroke={L} strokeWidth={3} />)}
      <rect y={1005} width={1920} height={75} fill="#121b22" />
      <Paint vig={0.55} warm={false} />
    </g>
  );
};

// ------------------------------------------------------------------ Coolidge farmhouse bedroom, night (cool grade)
/** Cool blue-grey night bedroom (ref clip 09 palette). `door` 0 closed .. 1 open (father's entrance). */
export const NightBedroom: React.FC<{ door?: number }> = ({ door = 0 }) => (
  <g>
    <defs>
      <radialGradient id="pb-winhalo" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#7a86a8" stopOpacity={0.9} /><stop offset="1" stopColor="#7a86a8" stopOpacity={0} /></radialGradient>
    </defs>
    <rect width={1400} height={1080} fill="#4d5565" /><rect x={1400} width={520} height={1080} fill="#555d70" />
    <line x1={1400} y1={0} x2={1400} y2={860} stroke="#3a4152" strokeWidth={5} />
    <ellipse cx={890} cy={380} rx={360} ry={300} fill="url(#pb-winhalo)" />
    <rect x={720} y={200} width={340} height={360} fill="#1d2b6c" stroke="#2b2f3c" strokeWidth={16} />
    <circle cx={980} cy={270} r={30} fill="#e9e6cf" />
    <path d="M 720 470 Q 800 420 880 460 Q 960 410 1060 450 L 1060 560 L 720 560 Z" fill="#171521" />
    <line x1={890} y1={200} x2={890} y2={560} stroke="#2b2f3c" strokeWidth={10} /><line x1={720} y1={380} x2={1060} y2={380} stroke="#2b2f3c" strokeWidth={10} />
    <path d="M 690 180 Q 760 360 720 600 L 650 600 Q 680 360 640 180 Z" fill="#2c3c49" stroke={L} strokeWidth={3} />
    <path d="M 760 560 L 1060 560 L 1180 860 L 560 860 Z" fill="#8a97c4" opacity={0.08} />
    {/* door on the right wall (perspective); opens to a dark hallway */}
    <path d="M 1530 250 L 1760 220 L 1760 860 L 1530 830 Z" fill="#12151c" stroke={L} strokeWidth={lw} />
    <path d={`M 1530 250 L ${1760 - door * 300} ${220 + door * 20} L ${1760 - door * 300} ${860 - door * 10} L 1530 830 Z`} fill="#2f353b" stroke={L} strokeWidth={lw} />
    <circle cx={1730 - door * 280} cy={560} r={9} fill="#8a8f9a" />
    <rect y={860} width={1920} height={220} fill="#343c4a" />
    <ellipse cx={1150} cy={980} rx={330} ry={60} fill="#3f4a5e" stroke="#2b3240" strokeWidth={4} />
    {/* bed frame + pillow (body goes under the Blanket foreground) */}
    <rect x={90} y={520} width={60} height={420} rx={10} fill="#3d3a48" stroke={L} strokeWidth={lw} />
    <path d="M 150 600 Q 300 540 520 600 L 520 640 L 150 640 Z" fill="#3d3a48" stroke={L} strokeWidth={lw} />
    <rect x={140} y={700} width={720} height={180} fill="#4b5366" stroke={L} strokeWidth={lw} />
    <ellipse cx={270} cy={740} rx={150} ry={52} fill="#b9bccb" stroke={L} strokeWidth={lw} />
    <rect x={1210} y={720} width={120} height={150} fill="#3d3a48" stroke={L} strokeWidth={lw} />
    <rect x={1250} y={660} width={14} height={60} fill="#cfcab0" /><ellipse cx={1257} cy={722} rx={36} ry={8} fill="#6b6150" />
    <Paint vig={0.5} warm={false} />
  </g>
);

/** Blanket over the sleeper (foreground). */
export const Blanket: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    <path d="M 160 812 Q 330 786 560 806 L 560 900 L 160 900 Z" fill="#c9c7d2" />
    <path d="M 160 812 Q 330 786 560 806" fill="none" stroke="#8d8b98" strokeWidth={5} transform="translate(0 16)" />
    <path d="M 340 790 Q 390 700 480 650 Q 570 610 670 645 Q 780 635 880 680 L 880 900 L 340 900 Z" fill="#92909c" />
    <path d="M 500 650 Q 540 760 520 880 M 680 650 Q 660 780 700 890" fill="none" stroke="#6f6d7a" strokeWidth={5} />
    
  </g>
);

// ------------------------------------------------------------------ the oath parlor, lit by one kerosene lamp
/** The family sitting room: brown floral wallpaper, pilasters, clock at 2:47, pot-belly stove, window. */
export const OathParlor: React.FC = () => (
  <g>
    <defs>
      <pattern id="pb-floral" width={70} height={70} patternUnits="userSpaceOnUse">
        <rect width={70} height={70} fill="#433829" />
        <circle cx={35} cy={35} r={7} fill="#4f4231" /><circle cx={0} cy={0} r={5} fill="#4a3d2e" /><circle cx={70} cy={70} r={5} fill="#4a3d2e" />
      </pattern>
    </defs>
    <rect width={1920} height={1080} fill="url(#pb-floral)" />
    <rect width={1920} height={50} fill="#2a2118" /><rect y={50} width={1920} height={14} fill="#5a4a34" />
    {[300, 820, 1440].map((x, i) => <rect key={i} x={x} y={64} width={34} height={600} fill="#3a2f22" />)}
    <rect y={640} width={1920} height={16} fill="#5a4a34" /><rect y={656} width={1920} height={260} fill="#2e251b" />
    {/* window */}
    <rect x={110} y={170} width={210} height={380} fill="#1d2b6c" stroke="#5a4a34" strokeWidth={14} />
    <line x1={215} y1={170} x2={215} y2={550} stroke="#5a4a34" strokeWidth={8} /><line x1={110} y1={360} x2={320} y2={360} stroke="#5a4a34" strokeWidth={8} />
    <circle cx={270} cy={230} r={18} fill="#e9e6cf" opacity={0.8} />
    {/* oval family portrait + clock at 2:47 */}
    <ellipse cx={1040} cy={290} rx={80} ry={100} fill="#7a5f3a" stroke={L} strokeWidth={lw} /><ellipse cx={1040} cy={290} rx={60} ry={78} fill="#6b6050" />
    <g transform="translate(1600 250)">
      <rect x={-70} y={-110} width={140} height={250} rx={14} fill="#5a3a22" stroke={L} strokeWidth={lw} />
      <circle r={52} fill="#efe6cf" stroke={L} strokeWidth={4} />
      <line x1={0} y1={0} x2={Math.cos((2.78 / 12) * 2 * Math.PI - Math.PI / 2) * 28} y2={Math.sin((2.78 / 12) * 2 * Math.PI - Math.PI / 2) * 28} stroke="#111" strokeWidth={6} strokeLinecap="round" />
      <line x1={0} y1={0} x2={Math.cos((47 / 60) * 2 * Math.PI - Math.PI / 2) * 42} y2={Math.sin((47 / 60) * 2 * Math.PI - Math.PI / 2) * 42} stroke="#111" strokeWidth={4} strokeLinecap="round" />
      <line x1={0} y1={60} x2={0} y2={115} stroke="#b08a3c" strokeWidth={4} /><circle cx={0} cy={115} r={12} fill="#b08a3c" />
    </g>
    {/* pot-belly stove */}
    <g stroke={L} strokeWidth={lw}>
      <rect x={1708} y={64} width={30} height={500} fill="#1c1b1a" />
      <ellipse cx={1723} cy={700} rx={110} ry={150} fill="#1f1e1d" />
      <rect x={1640} y={820} width={166} height={40} fill="#1f1e1d" /><rect x={1690} y={680} width={66} height={40} fill="#3a1d10" />
    </g>
    <rect y={900} width={1920} height={180} fill="#4a3220" />
    {Array.from({ length: 5 }, (_, i) => <line key={i} x1={0} y1={915 + i * 36} x2={1920} y2={915 + i * 36} stroke="#3a2616" strokeWidth={3} />)}
    <ellipse cx={960} cy={1000} rx={700} ry={80} fill="#5a3a3a" />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={960} cy={1000} rx={640 - i * 140} ry={70 - i * 16} fill="none" stroke={["#7a5a3a", "#4a5a6a", "#7a3a3a"][i]} strokeWidth={14} />)}
  </g>
);

/** Round table with the family Bible and the kerosene lamp (`lit` 0..1). Foreground: drawn after the officiant. */
export const OathTable: React.FC<{ lit: number; x?: number }> = ({ lit, x = 1000 }) => {
  const f = useCurrentFrame();
  const flick = 1 + Math.sin(f / 3.1) * 0.03 * lit;
  return (
    <g stroke={L} strokeWidth={lw}>
      <path d={`M ${x - 30} 820 L ${x - 60} 990 L ${x + 60} 990 L ${x + 30} 820 Z`} fill="#4a2a14" />
      <ellipse cx={x} cy={808} rx={300} ry={64} fill="#8f5327" />
      <path d={`M ${x - 240} 790 L ${x + 40} 760 L ${x + 120} 770 L ${x - 160} 812 Z`} fill="#b08034" opacity={0.25 + 0.45 * lit} stroke="none" />
      <path d={`M ${x - 290} 818 Q ${x} 890 ${x + 290} 818`} fill="none" stroke="#5e3416" strokeWidth={10} />
      {/* family Bible */}
      <path d={`M ${x - 220} 790 L ${x - 90} 776 L ${x - 70} 806 L ${x - 200} 822 Z`} fill="#3d2414" />
      <path d={`M ${x - 214} 788 L ${x - 92} 775 L ${x - 88} 783 L ${x - 210} 797 Z`} fill="#e9dcc0" stroke="none" />
      {/* kerosene lamp */}
      <g transform={`translate(${x + 70} 800)`}>
        <ellipse cx={0} cy={0} rx={52} ry={13} fill="#a8812f" />
        <path d="M -30 -4 Q -42 -60 0 -78 Q 42 -60 30 -4 Z" fill="#c9a24a" />
        <rect x={-8} y={-96} width={16} height={20} fill="#6b5a2a" />
        <path d="M -16 -96 Q -32 -150 -12 -196 L 12 -196 Q 32 -150 16 -96 Z" fill={lit > 0.05 ? "#fce579" : "#c9d2d8"} opacity={0.55 + 0.45 * lit} />
        {lit > 0.05 && <path d={`M 0 -${112 * flick} Q -9 -128 0 -${150 * flick} Q 9 -128 0 -${112 * flick} Z`} fill="#fff3c4" stroke="none" />}
      </g>
    </g>
  );
};

/**
 * Lamp-light grade over the whole room AND the characters (ref clip 09: one radial pool, peak ≈2.2× the
 * edge luminance, corners near-black, faces lit by distance to the lamp). `lit` 0 = moonlit blue night.
 */
export const LampGrade: React.FC<{ lit: number; cx: number; cy: number }> = ({ lit, cx, cy }) => (
  <g pointerEvents="none">
    <defs>
      <radialGradient id="pb-pool" cx={cx} cy={cy} r={1000} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#000" stopOpacity={0} /><stop offset="0.32" stopColor="#120c06" stopOpacity={0.12} /><stop offset="1" stopColor="#0d0905" stopOpacity={0.86} />
      </radialGradient>
      <radialGradient id="pb-glow" cx={cx} cy={cy} r={560} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#ffd27a" stopOpacity={0.55} /><stop offset="1" stopColor="#ffd27a" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} fill="#16204a" opacity={0.62 * (1 - lit)} style={{ mixBlendMode: "multiply" }} />
    <rect width={1920} height={1080} fill="#000" opacity={0.35 * (1 - lit)} />
    <rect width={1920} height={1080} fill="url(#pb-pool)" opacity={lit} />
    <rect width={1920} height={1080} fill="url(#pb-glow)" opacity={lit} style={{ mixBlendMode: "screen" }} />
    <circle cx={cx} cy={cy - 40} r={90} fill="#fff1b8" opacity={0.35 * lit} style={{ mixBlendMode: "screen" }} />
  </g>
);

/** Rocking chair silhouette, foreground left (cropped by the frame). */
export const RockerFG: React.FC = () => (
  <g fill="#120b06" stroke="#120b06">
    <path d="M 20 1080 Q 120 1040 260 1060" strokeWidth={22} fill="none" />
    <rect x={40} y={560} width={26} height={480} /><rect x={190} y={600} width={26} height={440} />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={66} y={600 + i * 70} width={124} height={16} />)}
    <rect x={20} y={820} width={240} height={34} />
  </g>
);

// ------------------------------------------------------------------ the telegram insert
/** Telegram on a dark desk; the message types on from `at` (≈0.8 char/frame, ref clip 04 type-on). */
export const Telegram: React.FC<{ at: number; lines: string[] }> = ({ at, lines }) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.floor((f - at) * 0.85));
  let left = n;
  return (
    <g>
      <rect width={1920} height={1080} fill="#2e1c10" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M 0 ${40 + i * 78} Q 960 ${70 + i * 78} 1920 ${30 + i * 78}`} stroke="#25160c" strokeWidth={6} fill="none" />)}
      <g transform="rotate(-3 960 540)">
        <rect x={330} y={150} width={1260} height={780} fill="#000" opacity={0.35} transform="translate(18 22)" />
        <rect x={330} y={150} width={1260} height={780} fill="#efe6c8" stroke={L} strokeWidth={5} />
        <rect x={370} y={190} width={1180} height={110} fill="none" stroke="#7a6a4a" strokeWidth={4} />
        <text x={960} y={268} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={72} fill="#2b2119" letterSpacing={14}>TELEGRAM</text>
        {lines.map((l, i) => {
          const show = l.slice(0, Math.max(0, left)); left -= l.length;
          return <text key={i} x={420} y={440 + i * 120} fontFamily="DejaVu Sans Mono, monospace" fontWeight={700} fontSize={76} fill="#1d1712">{show}</text>;
        })}
      </g>
      <Paint vig={0.5} />
    </g>
  );
};

// ------------------------------------------------------------------ 1924 campaign poster prop
export const KeepCoolPoster: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const head = `vp/calvin_coolidge/${HEAD.calvin_coolidge[5]}`;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={8}>
      <line x1={0} y1={0} x2={0} y2={260} />
      <rect x={-180} y={-420} width={360} height={440} fill="#f3ecd8" />
      <rect x={-180} y={-420} width={360} height={80} fill="#2b3f74" />
      {[-120, 0, 120].map((sx, i) => <path key={i} transform={`translate(${sx} -380)`} d="M 0 -22 L 6 -6 L 23 -6 L 9 4 L 14 21 L 0 11 L -14 21 L -9 4 L -23 -6 L -6 -6 Z" fill="#fff" strokeWidth={2} />)}
      <SImg href={staticFile(`tg2/${head}.png`)} x={-110} y={-330} width={220} height={220} preserveAspectRatio="xMidYMid meet" />
      <text x={0} y={-60} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={44} fill="#b8362f" stroke="none">KEEP COOL</text>
      <text x={0} y={-10} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={34} fill="#2b3f74" stroke="none">WITH COOLIDGE</text>
    </g>
  );
};
