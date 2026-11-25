import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SImg } from "../../Thanksgiving3/Kit";
import { MONTSERRAT } from "../../fonts";
import { ExprTL, HeadIcon, HEAD, INK } from "../VKit";

/**
 * Part 5 plates (Biden, the recap of all fifteen, the outro), built like src/VP/PilotBg.tsx: one painted plate per
 * real place, 4-7 depth layers, mood by grade and light, background line work thinner and warmer than the
 * character ink. Foreground occluders are separate components drawn AFTER the characters.
 * No bgref photos exist for these places, so each is painted from the real place's known layout:
 *  - Wilmington station (Furness, 1907: red brick, terracotta, square clock tower, rail viaduct over the street)
 *  - Old State Capitol, Springfield IL (Greek Revival, tan stone, portico, drum and dome) - Aug 23 2008 rally
 *  - Oval Office 2009-17 (striped wallpaper, crimson drapes) and 2021-25 (gold drapes, navy rug, family photos)
 *  - Biden's Wilmington den, the Chase Center drive-in rally (Nov 7 2020), the Capitol West Front with the
 *    Field of Flags (Jan 20 2021), the South Lawn signing (Nov 15 2021), the NPG presidents' gallery,
 *    Air Force One's stateroom (Nov 22 1963), Brown's Indian Queen Hotel parlor (Apr 6 1841), a Whig caucus
 *    room (Sept 1841), the 1841 White House north front, and the outer Oval Office corridor.
 */

const L = "#2b2119";
const lw = 4;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const Paint: React.FC<{ vig?: number; warm?: boolean }> = ({ vig = 0.4, warm = true }) => (
  <g pointerEvents="none">
    <defs>
      <filter id="p5-tex" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={4} seed={23} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <radialGradient id={`p5-vig-${warm ? "w" : "c"}`} cx="50%" cy="48%" r="72%">
        <stop offset="0.5" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor={warm ? "#1a0f05" : "#05070f"} stopOpacity={1} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} filter="url(#p5-tex)" opacity={0.15} style={{ mixBlendMode: "soft-light" }} />
    <rect width={1920} height={1080} fill={`url(#p5-vig-${warm ? "w" : "c"})`} opacity={vig} />
  </g>
);

const Cloud: React.FC<{ x: number; y: number; s?: number; o?: number; c?: string }> = ({ x, y, s = 1, o = 0.95, c = "#fbfbf7" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={c} opacity={o}>
    <ellipse cx={0} cy={0} rx={120} ry={42} /><ellipse cx={-70} cy={8} rx={70} ry={34} /><ellipse cx={60} cy={-18} rx={80} ry={46} /><ellipse cx={130} cy={10} rx={60} ry={28} />
  </g>
);

const Tree: React.FC<{ x: number; y: number; s?: number; c?: string[] }> = ({ x, y, s = 1, c = ["#4f7d3a", "#629448", "#3e6a30"] }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 37 + x) * 1.2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -14 0 L -10 -180 M -10 -150 Q 30 -200 70 -220 M -10 -170 Q -50 -210 -80 -230" stroke="#4a3626" strokeWidth={20} fill="none" strokeLinecap="round" />
      <g transform={`rotate(${sw} 0 -200)`} stroke={L} strokeWidth={3}>
        <ellipse cx={-80} cy={-250} rx={120} ry={95} fill={c[2]} /><ellipse cx={70} cy={-260} rx={130} ry={100} fill={c[0]} />
        <ellipse cx={-10} cy={-330} rx={130} ry={105} fill={c[1]} /><ellipse cx={20} cy={-220} rx={110} ry={70} fill={c[0]} />
      </g>
    </g>
  );
};

/** US flag, top-left at x,y; ripples gently. `stars` draws the canton dots. */
export const UsFlag: React.FC<{ x: number; y: number; w: number; h: number; ripple?: number; seed?: number }> = ({ x, y, w, h, ripple = 1, seed = 0 }) => {
  const f = useCurrentFrame();
  const sh = Math.sin(f / 13 + seed) * 3 * ripple;
  return (
    <g transform={`translate(${x} ${y}) skewY(${sh * 0.4})`}>
      <rect width={w} height={h} fill="#f4f1ea" stroke={L} strokeWidth={2} />
      {Array.from({ length: 7 }, (_, i) => <rect key={i} y={(i * 2 * h) / 13} width={w} height={h / 13} fill="#b8362f" />)}
      <rect width={w * 0.42} height={(h * 7) / 13} fill="#2b3f74" />
      {w > 90 && Array.from({ length: 12 }, (_, i) => <circle key={i} cx={w * 0.05 + (i % 4) * w * 0.1} cy={h * 0.07 + Math.floor(i / 4) * h * 0.15} r={Math.max(1.5, w * 0.012)} fill="#f4f1ea" />)}
      <rect width={w} height={h} fill="none" stroke={L} strokeWidth={2} />
    </g>
  );
};

/** Audience seen from behind (foreground occluder): heads + shoulders, alternating colours, tiny per-person bob. */
export const CrowdBacks: React.FC<{ y: number; n: number; x0?: number; x1?: number; s?: number; cols?: string[]; hair?: string[]; seed?: number; cheerAt?: number }> = ({ y, n, x0 = -40, x1 = 1960, s = 1, cols = ["#2f3a4f", "#5a4a3a", "#3e5a4a", "#6b2f2f", "#4a4f6b"], hair = ["#2a1d14", "#6b4a2a", "#a8a39a", "#1c1c1c", "#8a5a2a"], seed = 0, cheerAt }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + ((x1 - x0) * (i + 0.5)) / n + (rnd(i + seed) - 0.5) * 40 * s;
        const b = Math.sin(f / (9 + (i % 5)) + i) * 3 * s;
        const up = cheerAt !== undefined && f >= cheerAt + (i % 6) * 4 ? -14 * s : 0;   // one at a time, ~4 f apart
        const c = cols[(i + seed) % cols.length];
        const hc = hair[(i * 3 + seed) % hair.length];
        return (
          <g key={i} transform={`translate(${x} ${y + b + up}) scale(${s})`}>
            <path d="M -95 160 L -95 70 Q -90 20 -40 12 L 40 12 Q 90 20 95 70 L 95 160 Z" fill={c} stroke={L} strokeWidth={3} />
            <ellipse cx={0} cy={-40} rx={50} ry={58} fill={hc} stroke={L} strokeWidth={3} />
            <ellipse cx={-48} cy={-30} rx={9} ry={16} fill="#e0b48f" />
            <ellipse cx={48} cy={-30} rx={9} ry={16} fill="#e0b48f" />
          </g>
        );
      })}
    </g>
  );
};

// ------------------------------------------------------------------ Wilmington train station (June 1987)
/** Wilmington, Delaware station (Frank Furness, 1907): red brick, terracotta bands, square clock tower with a
 *  slate pyramid roof, arched ground floor, the rail viaduct crossing the street with a passing Amtrak train. */
export const WilmingtonStation: React.FC<{ bunting?: boolean }> = ({ bunting = true }) => {
  const f = useCurrentFrame();
  const tx = 2200 - ((f * 6) % 3600);
  const arch = (x: number, y: number, w: number, h: number, k: string, fill = "#2a2c33") => (
    <path key={k} d={`M ${x} ${y + h} L ${x} ${y + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} L ${x + w} ${y + h} Z`} fill={fill} stroke="#d9a77a" strokeWidth={6} />
  );
  return (
    <g>
      <defs>
        <linearGradient id="p5-st-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fb0d8" /><stop offset="0.7" stopColor="#cfe0ea" /><stop offset="1" stopColor="#efeee2" /></linearGradient>
        <linearGradient id="p5-st-brick" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#a5452f" /><stop offset="0.6" stopColor="#9a3e2a" /><stop offset="1" stopColor="#7d3022" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#p5-st-sky)" />
      <Cloud x={300 + f * 0.12} y={110} s={1.1} /><Cloud x={1480 + f * 0.1} y={80} s={0.8} />
      {/* downtown behind */}
      {[[0, 420, 160], [150, 380, 130], [1620, 360, 150], [1760, 430, 180]].map(([x, y, w], i) => <rect key={i} x={x} y={y} width={w} height={500} fill="#b5c0c9" stroke="#9aa6b0" strokeWidth={3} />)}
      {/* rail viaduct over the street (right) with the Amtrak train */}
      <rect x={1380} y={470} width={540} height={70} fill="#6d7078" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={1400 + i * 60} y1={470} x2={1430 + i * 60} y2={540} stroke="#565960" strokeWidth={5} />)}
      <rect x={1560} y={540} width={40} height={340} fill="#6d7078" stroke={L} strokeWidth={3} /><rect x={1840} y={540} width={40} height={340} fill="#6d7078" stroke={L} strokeWidth={3} />
      <g transform={`translate(${tx} 0)`}>
        {[0, 1, 2].map((c) => (
          <g key={c} transform={`translate(${c * 520} 0)`}>
            <rect x={0} y={360} width={500} height={112} rx={14} fill="#c9ccd0" stroke={L} strokeWidth={lw} />
            <rect x={0} y={430} width={500} height={10} fill="#b8362f" /><rect x={0} y={442} width={500} height={8} fill="#2b3f74" />
            {Array.from({ length: 7 }, (_, i) => <rect key={i} x={30 + i * 66} y={382} width={46} height={34} rx={6} fill="#3a4250" />)}
          </g>
        ))}
      </g>
      {/* station roof */}
      <path d="M 340 300 L 420 220 L 1500 220 L 1580 300 Z" fill="#4a4f5a" stroke={L} strokeWidth={lw} />
      {[520, 760, 1300].map((x, i) => <g key={i}><path d={`M ${x} 292 L ${x} 250 L ${x + 45} 222 L ${x + 90} 250 L ${x + 90} 292 Z`} fill="#9a3e2a" stroke={L} strokeWidth={3} /><rect x={x + 25} y={252} width={40} height={36} fill="#2a2c33" /></g>)}
      {/* main block */}
      <rect x={340} y={295} width={1240} height={590} fill="url(#p5-st-brick)" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 26 }, (_, i) => <line key={i} x1={340} y1={315 + i * 22} x2={1580} y2={315 + i * 22} stroke="#8a3626" strokeWidth={1.5} opacity={0.5} />)}
      {[300, 520, 690].map((y, i) => <rect key={i} x={336} y={y} width={1248} height={i ? 18 : 26} fill="#d9a77a" stroke={L} strokeWidth={2} />)}
      {/* upper windows */}
      {Array.from({ length: 10 }, (_, i) => { const x = 390 + i * 116; if (x > 1000 && x < 1260) return null; return <g key={i}><rect x={x} y={360} width={62} height={120} fill="#2a2c33" stroke="#d9a77a" strokeWidth={5} /><rect x={x} y={560} width={62} height={100} fill="#2a2c33" stroke="#d9a77a" strokeWidth={5} /><rect x={x + 6} y={366} width={20} height={50} fill="#8fb1c8" opacity={0.4} /></g>; })}
      {/* ground floor arcade */}
      {Array.from({ length: 8 }, (_, i) => { const x = 380 + i * 150; if (x > 1010 && x < 1250) return null; return arch(x, 720, 110, 165, `a${i}`); })}
      {/* clock tower */}
      <rect x={1040} y={100} width={210} height={785} fill="#a5452f" stroke={L} strokeWidth={lw} />
      <rect x={1205} y={100} width={45} height={785} fill="#7d3022" opacity={0.6} />
      <path d="M 1020 110 L 1145 -10 L 1270 110 Z" fill="#4a4f5a" stroke={L} strokeWidth={lw} />
      <line x1={1145} y1={-10} x2={1145} y2={-40} stroke={L} strokeWidth={6} />
      <rect x={1030} y={100} width={230} height={22} fill="#d9a77a" stroke={L} strokeWidth={2} />
      {[1070, 1150].map((x, i) => <path key={i} d={`M ${x} 200 L ${x} 160 A 35 35 0 0 1 ${x + 70} 160 L ${x + 70} 200 Z`} fill="#2a2c33" stroke="#d9a77a" strokeWidth={4} />)}
      <g transform="translate(1145 300)">
        <circle r={70} fill="#f4efe0" stroke="#d9a77a" strokeWidth={10} />
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={Math.sin((i * Math.PI) / 6) * 54} y1={-Math.cos((i * Math.PI) / 6) * 54} x2={Math.sin((i * Math.PI) / 6) * 62} y2={-Math.cos((i * Math.PI) / 6) * 62} stroke="#2a2c33" strokeWidth={4} />)}
        <line x1={0} y1={0} x2={0} y2={-46} stroke="#111" strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={0} x2={30} y2={10} stroke="#111" strokeWidth={7} strokeLinecap="round" />
      </g>
      {Array.from({ length: 3 }, (_, i) => <rect key={i} x={1095} y={450 + i * 130} width={100} height={80} fill="#2a2c33" stroke="#d9a77a" strokeWidth={5} />)}
      <path d="M 1075 885 L 1075 770 A 70 70 0 0 1 1215 770 L 1215 885 Z" fill="#3a2a22" stroke="#d9a77a" strokeWidth={7} />
      {/* 1987 announcement bunting */}
      {bunting && Array.from({ length: 6 }, (_, i) => {
        const x = 400 + i * 200 + (i >= 3 ? 220 : 0);
        return (
          <g key={i} transform={`translate(${x} 700)`} stroke={L} strokeWidth={3}>
            <path d="M 0 0 A 70 70 0 0 0 140 0 Z" fill="#2b3f74" />
            <path d="M 14 0 A 56 56 0 0 0 126 0 Z" fill="#f4f1ea" />
            <path d="M 30 0 A 40 40 0 0 0 110 0 Z" fill="#b8362f" />
          </g>
        );
      })}
      {/* street + sidewalk */}
      <rect y={880} width={1920} height={200} fill="#bdb6a8" />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={i * 240 - 200} y1={1080} x2={960 + (i - 4.5) * 110} y2={880} stroke="#a59e90" strokeWidth={3} />)}
      <rect y={880} width={1920} height={14} fill="#8d867a" />
      <Paint vig={0.3} />
    </g>
  );
};

/** Campaign button graphic (icon for Pop). */
export const CampaignButton: React.FC<{ year: string; tone?: string }> = ({ year, tone = "#2b3f74" }) => (
  <g stroke={INK} strokeWidth={8}>
    <circle r={110} fill="#f4f1ea" />
    <circle r={92} fill={tone} />
    <path d="M -92 18 L 92 18 A 92 92 0 0 1 -92 18 Z" fill="#b8362f" strokeWidth={0} />
    <circle r={92} fill="none" />
    <text y={8} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={46} fill="#fff" stroke="none">BIDEN</text>
    <text y={66} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={34} fill="#fff" stroke="none">{year}</text>
    {[-50, 0, 50].map((x) => <path key={x} transform={`translate(${x} -52) scale(0.7)`} d="M 0 -22 L 6 -6 L 23 -6 L 9 4 L 14 21 L 0 11 L -14 21 L -9 4 L -23 -6 L -6 -6 Z" fill="#fff" strokeWidth={2} />)}
  </g>
);

// ------------------------------------------------------------------ newspaper insert (1987 / 2008 withdrawals)
const Paper: React.FC<{ x: number; y: number; rot: number; at: number; head: string; date: string; face: number; xAt: number }> = ({ x, y, rot, at, head, date, face, xAt }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f - at, [0, 6], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const img = `tg2/vp/joe_biden/${HEAD.joe_biden[f >= xAt + 4 ? 4 : face]}.png`;
  const xp = (d: number) => interpolate(f - xAt - d, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g transform={`translate(${x} ${y - (1 - p) * 900}) rotate(${rot})`}>
      <rect x={-380} y={-430} width={760} height={860} fill="#000" opacity={0.35} transform="translate(16 20)" />
      <rect x={-380} y={-430} width={760} height={860} fill="#eee6d0" stroke={L} strokeWidth={5} />
      <text x={0} y={-345} textAnchor="middle" fontFamily="DejaVu Serif, Georgia, serif" fontWeight={700} fontSize={64} fill="#1d1712">The Daily Chronicle</text>
      <line x1={-350} y1={-320} x2={350} y2={-320} stroke="#1d1712" strokeWidth={4} />
      <text x={-350} y={-292} fontFamily={MONTSERRAT} fontWeight={800} fontSize={22} fill="#4a4036">{date}</text>
      <line x1={-350} y1={-280} x2={350} y2={-280} stroke="#1d1712" strokeWidth={2} />
      <text x={0} y={-190} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={84} fill="#1d1712">{head}</text>
      <rect x={-350} y={-140} width={330} height={360} fill="#b9b1a0" stroke="#1d1712" strokeWidth={3} />
      <g filter="url(#p5-gray)"><SImg key={img} href={staticFile(img)} x={-330} y={-120} width={290} height={330} preserveAspectRatio="xMidYMid meet" /></g>
      {Array.from({ length: 11 }, (_, i) => <rect key={i} x={10} y={-130 + i * 32} width={i % 4 === 3 ? 200 : 340} height={12} fill="#9a9080" />)}
      {Array.from({ length: 5 }, (_, i) => <rect key={i} x={-350} y={250 + i * 32} width={i % 3 === 2 ? 420 : 700} height={12} fill="#9a9080" />)}
      {/* red pen X on "failed" */}
      <g stroke="#d62828" strokeWidth={26} strokeLinecap="round" fill="none" opacity={0.92}>
        <line x1={-300} y1={-300} x2={-300 + 600 * xp(0)} y2={-300 + 640 * xp(0)} />
        <line x1={300} y1={-300} x2={300 - 600 * xp(3)} y2={-300 + 640 * xp(3)} />
      </g>
    </g>
  );
};

export const NewsInsert: React.FC<{ a1: number; a2: number; xAt: number }> = ({ a1, a2, xAt }) => (
  <g>
    <defs><filter id="p5-gray"><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncR type="linear" slope={0.9} intercept={0.04} /><feFuncG type="linear" slope={0.88} intercept={0.04} /><feFuncB type="linear" slope={0.8} intercept={0.03} /></feComponentTransfer></filter></defs>
    <rect width={1920} height={1080} fill="#3a2414" />
    {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M 0 ${20 + i * 70} Q 700 ${60 + i * 70} 1920 ${10 + i * 70}`} stroke="#2e1c0f" strokeWidth={7} fill="none" />)}
    <ellipse cx={1720} cy={170} rx={130} ry={130} fill="#efe6d4" stroke={L} strokeWidth={5} />
    <ellipse cx={1720} cy={170} rx={100} ry={100} fill="#5a3418" />
    <Paper x={720} y={560} rot={-6} at={a1} head="BIDEN QUITS RACE" date="SEPTEMBER 24, 1987" face={0} xAt={xAt} />
    <Paper x={1180} y={540} rot={5} at={a2} head="BIDEN DROPS OUT" date="JANUARY 4, 2008" face={4} xAt={xAt + 4} />
    <Paint vig={0.55} />
  </g>
);

// ------------------------------------------------------------------ Old State Capitol, Springfield IL (Aug 23 2008)
export const SpringfieldCapitol: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="p5-sp-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5f9ed6" /><stop offset="0.75" stopColor="#c6ddea" /><stop offset="1" stopColor="#eef0e4" /></linearGradient>
        <linearGradient id="p5-sp-stone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#e2cfa3" /><stop offset="0.6" stopColor="#d6c094" /><stop offset="1" stopColor="#b9a378" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#p5-sp-sky)" />
      <Cloud x={260 + f * 0.12} y={120} /><Cloud x={1560 + f * 0.1} y={150} s={0.8} />
      <Tree x={120} y={760} s={1.4} /><Tree x={1820} y={760} s={1.4} />
      {/* dome + drum */}
      <rect x={850} y={190} width={220} height={170} fill="url(#p5-sp-stone)" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 5 }, (_, i) => <rect key={i} x={870 + i * 42} y={215} width={22} height={110} fill="#5a5f66" />)}
      <path d="M 840 195 Q 960 40 1080 195 Z" fill="#b9bfc2" stroke={L} strokeWidth={lw} />
      <path d="M 880 190 Q 960 80 1000 120" stroke="#e3e7e8" strokeWidth={8} fill="none" opacity={0.6} />
      <rect x={940} y={50} width={40} height={50} fill="#d6c094" stroke={L} strokeWidth={3} /><path d="M 932 52 Q 960 20 988 52 Z" fill="#b9bfc2" stroke={L} strokeWidth={3} />
      {/* main block */}
      <rect x={220} y={360} width={1480} height={460} fill="url(#p5-sp-stone)" stroke={L} strokeWidth={lw} />
      <rect x={210} y={350} width={1500} height={26} fill="#cdb789" stroke={L} strokeWidth={3} />
      {[0, 1].map((r) => Array.from({ length: 12 }, (_, i) => { const x = 270 + i * 120 + (i >= 4 ? 200 : 0); if (x > 1640) return null; return <g key={`${r}-${i}`}><rect x={x} y={430 + r * 190} width={56} height={120} fill="#3d4652" stroke="#efe2c2" strokeWidth={5} /><line x1={x + 28} y1={430 + r * 190} x2={x + 28} y2={550 + r * 190} stroke="#efe2c2" strokeWidth={3} /></g>; }))}
      {/* portico */}
      <path d="M 740 380 L 960 300 L 1180 380 Z" fill="#e4d2a8" stroke={L} strokeWidth={lw} />
      <rect x={740} y={375} width={440} height={30} fill="#d6c094" stroke={L} strokeWidth={3} />
      <rect x={760} y={405} width={400} height={415} fill="#a99470" />
      {[775, 885, 995, 1105].map((x) => <g key={x}><rect x={x} y={405} width={40} height={415} fill="#efe2c2" stroke={L} strokeWidth={3} /><rect x={x - 6} y={405} width={52} height={14} fill="#e2cfa3" stroke={L} strokeWidth={2} /></g>)}
      {/* rally stage: blue backdrop + flags */}
      <rect x={520} y={700} width={880} height={200} fill="#22386b" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={545 + (i % 15) * 59} cy={735 + Math.floor(i / 15) * 50} r={6} fill="#f4f1ea" opacity={0.85} />)}
      {[440, 480, 1440, 1480].map((x, i) => <g key={i}><line x1={x} y1={520} x2={x} y2={900} stroke="#c9a14a" strokeWidth={6} /><UsFlag x={x + 3} y={525} w={70} h={48} seed={i} /></g>)}
      <rect y={880} width={1920} height={200} fill="#6b8f4a" />
      <Paint vig={0.3} />
    </g>
  );
};

/** Rally podium with the blue front panel (occluder). */
export const RallyPodium: React.FC<{ x: number; y?: number }> = ({ x, y = 760 }) => (
  <g stroke={L} strokeWidth={lw}>
    <path d={`M ${x - 140} ${y} L ${x + 140} ${y} L ${x + 120} ${y + 320} L ${x - 120} ${y + 320} Z`} fill="#22386b" />
    <rect x={x - 160} y={y - 26} width={320} height={34} rx={6} fill="#6b4529" />
    <circle cx={x} cy={y + 120} r={58} fill="#f4f1ea" /><circle cx={x} cy={y + 120} r={44} fill="#2b3f74" />
    <path d={`M ${x - 18} ${y - 26} L ${x - 30} ${y - 90} M ${x + 18} ${y - 26} L ${x + 30} ${y - 90}`} stroke="#333" strokeWidth={6} />
  </g>
);

// ------------------------------------------------------------------ the Resolute desk (both Oval Office eras)
export const ResoluteDesk: React.FC<{ x?: number; y?: number; s?: number }> = ({ x = 960, y = 770, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={L} strokeWidth={lw}>
    <rect x={-470} y={-26} width={940} height={44} rx={6} fill="#4a2a14" />
    <rect x={-450} y={18} width={900} height={320} fill="#5e3519" />
    {[-430, 230].map((px) => <rect key={px} x={px} y={40} width={200} height={260} fill="#4d2b13" />)}
    {[-430, 230].map((px) => Array.from({ length: 3 }, (_, i) => <rect key={`${px}${i}`} x={px + 20} y={58 + i * 82} width={160} height={64} fill="none" stroke="#3a1f0d" strokeWidth={4} />))}
    <rect x={-190} y={40} width={380} height={260} fill="#4d2b13" />
    <circle cx={0} cy={170} r={86} fill="#7a4a22" stroke="#c9a14a" strokeWidth={6} />
    <path d="M -40 170 Q 0 110 40 170 Q 0 210 -40 170 Z" fill="#c9a14a" stroke="none" />
    <path d="M -60 150 L -30 165 M 60 150 L 30 165" stroke="#c9a14a" strokeWidth={8} />
    <rect x={-470} y={-30} width={940} height={10} fill="#7a4626" stroke="none" />
  </g>
);

/** Oval Office, Obama era (2009-17): curved wall in cream/tan stripes, crimson drapes, wheat rug, flags. */
export const OvalObama: React.FC = () => (
  <g>
    <defs>
      <pattern id="p5-ob-stripe" width={44} height={10} patternUnits="userSpaceOnUse"><rect width={44} height={10} fill="#e8d8ad" /><rect width={20} height={10} fill="#dcc896" /></pattern>
      <linearGradient id="p5-ob-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dfeef4" /><stop offset="1" stopColor="#b9d3a8" /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#p5-ob-stripe)" />
    <path d="M 0 0 L 1920 0 L 1920 130 Q 960 40 0 130 Z" fill="#f3ead2" stroke={L} strokeWidth={3} />
    <path d="M 0 130 Q 960 40 1920 130" fill="none" stroke="#c9b27a" strokeWidth={14} />
    {/* three south windows */}
    {[560, 860, 1160].map((x, i) => (
      <g key={i}>
        <rect x={x} y={170} width={200} height={540} fill="url(#p5-ob-win)" stroke="#f3ead2" strokeWidth={14} />
        <ellipse cx={x + 100} cy={600} rx={120} ry={70} fill="#7ea36a" opacity={0.6} />
        <line x1={x + 100} y1={170} x2={x + 100} y2={710} stroke="#f3ead2" strokeWidth={6} />
        {[300, 430, 560].map((yy) => <line key={yy} x1={x} y1={yy} x2={x + 200} y2={yy} stroke="#f3ead2" strokeWidth={5} />)}
        <path d={`M ${x - 40} 150 Q ${x + 10} 400 ${x - 20} 720 L ${x - 70} 720 Q ${x - 40} 400 ${x - 80} 150 Z`} fill="#8e2230" stroke={L} strokeWidth={3} />
        <path d={`M ${x + 240} 150 Q ${x + 190} 400 ${x + 220} 720 L ${x + 270} 720 Q ${x + 240} 400 ${x + 280} 150 Z`} fill="#8e2230" stroke={L} strokeWidth={3} />
        <path d={`M ${x - 80} 140 Q ${x + 100} 230 ${x + 280} 140 L ${x + 280} 120 L ${x - 80} 120 Z`} fill="#b08a3c" stroke={L} strokeWidth={3} />
      </g>
    ))}
    {/* flags */}
    <line x1={380} y1={180} x2={380} y2={760} stroke="#c9a14a" strokeWidth={9} />
    <path d="M 386 190 Q 450 260 440 420 Q 430 560 470 640 L 400 640 Q 386 470 386 330 Z" fill="#b8362f" stroke={L} strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M 388 ${260 + i * 90} Q 430 ${300 + i * 90} 440 ${340 + i * 90}`} stroke="#f2ede0" strokeWidth={14} fill="none" />)}
    <path d="M 386 190 Q 420 210 430 280 L 388 290 Z" fill="#2b3f74" />
    <line x1={1540} y1={180} x2={1540} y2={760} stroke="#c9a14a" strokeWidth={9} />
    <path d="M 1534 190 Q 1470 260 1480 420 Q 1490 560 1450 640 L 1520 640 Q 1534 470 1534 330 Z" fill="#1f2d5c" stroke={L} strokeWidth={3} />
    <circle cx={1500} cy={380} r={28} fill="#c9a14a" />
    {/* side table + lamp */}
    <rect x={1640} y={560} width={170} height={200} fill="#5e3519" stroke={L} strokeWidth={lw} />
    <path d="M 1670 560 L 1690 470 L 1760 470 L 1780 560 Z" fill="#efe2c2" stroke={L} strokeWidth={3} />
    {/* floor + wheat rug with quotation border */}
    <rect y={750} width={1920} height={330} fill="#cdb57e" />
    <path d="M -100 1080 Q 960 720 2020 1080" fill="none" stroke="#a88a4e" strokeWidth={30} />
    {Array.from({ length: 40 }, (_, i) => <rect key={i} x={i * 50} y={1010 - Math.sin((i / 39) * Math.PI) * 200} width={22} height={6} fill="#6b5530" />)}
    <Paint vig={0.32} />
  </g>
);

/** Oval Office, Biden era (2021-25): ivory walls, gold drapes, navy rug, family photos and a bust on the credenza. */
export const OvalBiden: React.FC = () => (
  <g>
    <defs><linearGradient id="p5-bd-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9d8e6" /><stop offset="1" stopColor="#9fb88f" /></linearGradient></defs>
    <rect width={1920} height={1080} fill="#efe6cf" />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={40 + i * 280} y={180} width={200} height={460} fill="none" stroke="#e0d3b2" strokeWidth={6} />)}
    <path d="M 0 0 L 1920 0 L 1920 130 Q 960 40 0 130 Z" fill="#f6efdc" stroke={L} strokeWidth={3} />
    <path d="M 0 130 Q 960 40 1920 130" fill="none" stroke="#c9a14a" strokeWidth={12} />
    {[560, 860, 1160].map((x, i) => (
      <g key={i}>
        <rect x={x} y={170} width={200} height={500} fill="url(#p5-bd-win)" stroke="#f6efdc" strokeWidth={14} />
        <line x1={x + 100} y1={170} x2={x + 100} y2={670} stroke="#f6efdc" strokeWidth={6} />
        <path d={`M ${x - 40} 150 Q ${x + 10} 400 ${x - 20} 700 L ${x - 70} 700 Q ${x - 40} 400 ${x - 80} 150 Z`} fill="#d4a73a" stroke={L} strokeWidth={3} />
        <path d={`M ${x + 240} 150 Q ${x + 190} 400 ${x + 220} 700 L ${x + 270} 700 Q ${x + 240} 400 ${x + 280} 150 Z`} fill="#d4a73a" stroke={L} strokeWidth={3} />
        <path d={`M ${x - 80} 140 Q ${x + 100} 220 ${x + 280} 140 L ${x + 280} 120 L ${x - 80} 120 Z`} fill="#b8892a" stroke={L} strokeWidth={3} />
      </g>
    ))}
    {/* credenza with family photos + bronze bust */}
    <rect x={540} y={600} width={840} height={150} fill="#4d2b13" stroke={L} strokeWidth={lw} />
    {[600, 690, 790, 900, 1010, 1100].map((x, i) => <g key={i}><rect x={x} y={540 + (i % 2) * 14} width={70} height={60 - (i % 2) * 14} fill="#c9a14a" stroke={L} strokeWidth={2} /><rect x={x + 8} y={548 + (i % 2) * 14} width={54} height={44 - (i % 2) * 14} fill={["#8aa0b8", "#b89a80", "#9fb88f", "#c7a99a", "#8f9fb0", "#b0a080"][i]} /></g>)}
    <g stroke={L} strokeWidth={3}><rect x={1215} y={560} width={60} height={40} fill="#3a2a1a" /><ellipse cx={1245} cy={520} rx={34} ry={44} fill="#6b4a2a" /></g>
    {/* flags */}
    <line x1={380} y1={180} x2={380} y2={760} stroke="#c9a14a" strokeWidth={9} />
    <path d="M 386 190 Q 450 260 440 420 Q 430 560 470 640 L 400 640 Q 386 470 386 330 Z" fill="#b8362f" stroke={L} strokeWidth={3} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M 388 ${260 + i * 90} Q 430 ${300 + i * 90} 440 ${340 + i * 90}`} stroke="#f2ede0" strokeWidth={14} fill="none" />)}
    <path d="M 386 190 Q 420 210 430 280 L 388 290 Z" fill="#2b3f74" />
    <line x1={1540} y1={180} x2={1540} y2={760} stroke="#c9a14a" strokeWidth={9} />
    <path d="M 1534 190 Q 1470 260 1480 420 Q 1490 560 1450 640 L 1520 640 Q 1534 470 1534 330 Z" fill="#1f2d5c" stroke={L} strokeWidth={3} />
    <circle cx={1500} cy={380} r={28} fill="#c9a14a" />
    {/* navy rug with the seal's gold ring */}
    <rect y={750} width={1920} height={330} fill="#1f2e57" />
    <ellipse cx={960} cy={1120} rx={620} ry={260} fill="none" stroke="#c9a14a" strokeWidth={16} />
    <ellipse cx={960} cy={1120} rx={540} ry={220} fill="#26386a" />
    <Paint vig={0.34} />
  </g>
);

/** TV camera from behind with a red tally light (foreground occluder, July 24 2024 address). */
export const TVCamera: React.FC<{ x?: number }> = ({ x = 1650 }) => {
  const f = useCurrentFrame();
  return (
    <g stroke="#0d0d10" strokeWidth={3}>
      <path d={`M ${x - 40} 1080 L ${x + 10} 760 L ${x + 30} 760 L ${x + 80} 1080 Z`} fill="#16161a" />
      <rect x={x - 160} y={600} width={360} height={190} rx={18} fill="#232329" />
      <rect x={x - 230} y={640} width={90} height={110} rx={10} fill="#1a1a1f" />
      <rect x={x + 60} y={560} width={120} height={50} rx={8} fill="#2c2c33" />
      <circle cx={x + 150} cy={585} r={10} fill={Math.floor(f / 20) % 2 ? "#ff3b30" : "#b3241d"} />
    </g>
  );
};

/** "BIDEN 2024" yard sign that tips over at `fallAt` (ends the campaign). */
export const YardSign: React.FC<{ x: number; y: number; fallAt: number }> = ({ x, y, fallAt }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - fallAt, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  return (
    <g transform={`translate(${x} ${y}) rotate(${-84 * p})`} stroke={INK} strokeWidth={6}>
      <line x1={-60} y1={0} x2={-60} y2={-150} /><line x1={60} y1={0} x2={60} y2={-150} />
      <rect x={-130} y={-330} width={260} height={190} fill="#1f3a78" />
      <text x={0} y={-250} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={58} fill="#fff" stroke="none">BIDEN</text>
      <text x={0} y={-180} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={50} fill="#e44" stroke="none">2024</text>
    </g>
  );
};

// ------------------------------------------------------------------ Biden's den, Wilmington (2017-2020)
/** Wood-panelled den: bookshelves, a window onto the pond, and a wall calendar tearing off 2017 -> 2020. */
export const WilmingtonDen: React.FC<{ flips: number[] }> = ({ flips }) => {
  const f = useCurrentFrame();
  const years = [2017, 2018, 2019, 2020];
  const n = flips.filter((t) => f >= t).length;
  const last = flips[n - 1] ?? -99;
  const fly = f - last;
  return (
    <g>
      <rect width={1920} height={1080} fill="#e9dcc0" />
      <rect y={560} width={1920} height={520} fill="#6b4a2e" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={20 + i * 215} y={600} width={180} height={260} fill="none" stroke="#523620" strokeWidth={7} />)}
      <rect y={548} width={1920} height={18} fill="#8a6a45" />
      {/* bookshelves left */}
      <rect x={40} y={110} width={420} height={760} fill="#4b2f1b" stroke={L} strokeWidth={lw} />
      {[0, 1, 2, 3, 4].map((r) => (
        <g key={r}>
          <rect x={60} y={140 + r * 145} width={380} height={125} fill="#2a1a0f" />
          {Array.from({ length: 13 }, (_, i) => { const hh = 80 + rnd(r * 31 + i) * 40; return <rect key={i} x={66 + i * 28} y={265 + r * 145 - hh} width={24} height={hh} fill={["#7a2f2a", "#2f4d3a", "#3c3a63", "#7d5a2a", "#2e3d4f"][Math.floor(rnd(r * 7 + i * 3) * 5)]} stroke="#1a110a" strokeWidth={2} />; })}
        </g>
      ))}
      {/* window to the pond */}
      <rect x={1240} y={150} width={480} height={380} fill="#bcd6e6" stroke="#f4efe0" strokeWidth={16} />
      <path d="M 1240 390 Q 1480 360 1720 390 L 1720 530 L 1240 530 Z" fill="#5f8fb0" />
      {[1280, 1400, 1560, 1680].map((x, i) => <ellipse key={i} cx={x} cy={370 - (i % 2) * 20} rx={80} ry={60} fill="#5b7f45" />)}
      <line x1={1480} y1={150} x2={1480} y2={530} stroke="#f4efe0" strokeWidth={8} /><line x1={1240} y1={340} x2={1720} y2={340} stroke="#f4efe0" strokeWidth={8} />
      {/* family photos on the panelling ledge */}
      {[880, 960, 1040].map((x, i) => <g key={i}><rect x={x} y={470} width={60} height={78} fill="#c9a14a" stroke={L} strokeWidth={2} /><rect x={x + 6} y={476} width={48} height={66} fill={["#9fb0c8", "#c8a890", "#a8c090"][i]} /></g>)}
      {/* wall calendar */}
      <g transform="translate(640 210)">
        <rect x={-120} y={0} width={240} height={290} fill="#f6f1e4" stroke={L} strokeWidth={lw} />
        <rect x={-120} y={0} width={240} height={70} fill="#b8362f" />
        <text y={52} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={48} fill="#fff">{years[Math.min(3, n)]}</text>
        {Array.from({ length: 20 }, (_, i) => <rect key={i} x={-100 + (i % 5) * 42} y={95 + Math.floor(i / 5) * 46} width={30} height={30} fill="#d9d0bc" />)}
        <circle cx={0} cy={-8} r={9} fill={L} />
        {n > 0 && fly < 14 && (
          <g transform={`translate(${fly * 22} ${fly * 30 - fly * fly}) rotate(${fly * 14})`} opacity={1 - fly / 14}>
            <rect x={-120} y={0} width={240} height={290} fill="#f6f1e4" stroke={L} strokeWidth={3} />
            <rect x={-120} y={0} width={240} height={70} fill="#b8362f" />
            <text y={52} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={48} fill="#fff">{years[n - 1]}</text>
          </g>
        )}
      </g>
      <rect y={860} width={1920} height={220} fill="#5a3a22" />
      <ellipse cx={980} cy={1000} rx={720} ry={80} fill="#7a3b2b" stroke={L} strokeWidth={lw} />
      <ellipse cx={980} cy={1000} rx={620} ry={58} fill="none" stroke="#c9a14a" strokeWidth={8} />
      <Paint vig={0.4} />
    </g>
  );
};

/** Leather armchair back (foreground, right). */
export const DenChair: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    <path d="M 1440 1080 L 1440 840 Q 1440 760 1530 750 L 1800 750 Q 1890 760 1890 840 L 1890 1080 Z" fill="#5a2a20" />
    <path d="M 1400 1080 L 1400 900 Q 1400 860 1450 860 L 1480 860 L 1480 1080 Z" fill="#4a221a" />
    {Array.from({ length: 4 }, (_, i) => <circle key={i} cx={1520 + i * 90} cy={800} r={6} fill="#c9a14a" />)}
  </g>
);

// ------------------------------------------------------------------ Chase Center drive-in rally, Wilmington (Nov 7 2020)
const Firework: React.FC<{ x: number; y: number; at: number; c: string; r?: number }> = ({ x, y, at, c, r = 130 }) => {
  const f = useCurrentFrame();
  const lf = (f - at) % 46;
  if (f < at || lf > 26) return null;
  const k = interpolate(lf, [0, 12], [0.1, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <g transform={`translate(${x} ${y})`} stroke={c} strokeWidth={6} strokeLinecap="round" opacity={1 - Math.max(0, lf - 14) / 12}>
      {Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * r * k * 0.55} y1={Math.sin(a) * r * k * 0.55} x2={Math.cos(a) * r * k} y2={Math.sin(a) * r * k + lf * 0.8} />; })}
    </g>
  );
};

export const DriveInRally: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="p5-di-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#070d24" /><stop offset="0.8" stopColor="#1b2d5a" /><stop offset="1" stopColor="#2a3d6e" /></linearGradient>
        <linearGradient id="p5-di-beam" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#fff4c8" stopOpacity={0.35} /><stop offset="1" stopColor="#fff4c8" stopOpacity={0} /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#p5-di-sky)" />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 50) * 300} r={1.5 + rnd(i + 9) * 2} fill="#fff" opacity={0.5} />)}
      <Firework x={300} y={180} at={0} c="#ff5a5a" /><Firework x={1640} y={150} at={12} c="#8fd0ff" /><Firework x={1000} y={110} at={24} c="#fff1a8" r={110} />
      <Firework x={560} y={110} at={34} c="#8fd0ff" r={100} /><Firework x={1380} y={230} at={6} c="#ff5a5a" r={100} />
      {/* Chase Center brick hall behind the stage */}
      <rect x={120} y={430} width={1680} height={360} fill="#4a2a24" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={160 + i * 118} y={470} width={70} height={110} fill="#f0c46a" opacity={0.55} />)}
      {/* search beams */}
      {[[400, -18], [1520, 18], [800, -6], [1120, 6]].map(([x, r], i) => <path key={i} d={`M ${x - 18} 760 L ${x + 18} 760 L ${x + 160} 0 L ${x - 160} 0 Z`} fill="url(#p5-di-beam)" transform={`rotate(${(r as number) + Math.sin(f / 40 + i) * 6} ${x} 760)`} />)}
      {/* stage: giant flag backdrop, flags, LED screens */}
      <UsFlag x={600} y={250} w={720} h={440} ripple={0.4} />
      <rect x={600} y={250} width={720} height={440} fill="#fff7d8" opacity={0.08} />
      {[[180, 300], [1440, 300]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width={300} height={190} fill="#0c1430" stroke="#555" strokeWidth={8} /><rect x={x + 12} y={y + 12} width={276} height={166} fill="#1f3a78" /><path transform={`translate(${x + 150} ${y + 95}) scale(1.6)`} d="M 0 -22 L 6 -6 L 23 -6 L 9 4 L 14 21 L 0 11 L -14 21 L -9 4 L -23 -6 L -6 -6 Z" fill="#fff" /></g>)}
      {Array.from({ length: 8 }, (_, i) => { const x = 520 + (i < 4 ? i * 22 - 40 : 900 + (i - 4) * 22); return <g key={i}><line x1={x} y1={560} x2={x} y2={790} stroke="#c9a14a" strokeWidth={5} /><UsFlag x={x + 2} y={562} w={56} h={38} seed={i} /></g>; })}
      <rect x={420} y={780} width={1080} height={70} fill="#151a2c" stroke={L} strokeWidth={lw} />
      <rect x={420} y={780} width={1080} height={10} fill="#3a4a7a" />
      <rect y={850} width={1920} height={230} fill="#1b1f29" />
      <Paint vig={0.45} warm={false} />
    </g>
  );
};

/** Parked cars seen from behind (foreground), tail lights, horn marks ("honk" = the drive-in applause). */
export const CarsFG: React.FC<{ honkAt?: number }> = ({ honkAt = 0 }) => {
  const f = useCurrentFrame();
  const cars: [number, number, string][] = [[180, 905, "#7a8494"], [620, 930, "#3a4a6a"], [1060, 915, "#8a2a2a"], [1500, 925, "#c9c4b8"], [1880, 905, "#2c2c34"]];
  return (
    <g>
      {cars.map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`} stroke="#0c0d12" strokeWidth={4}>
          <path d="M -230 180 L -230 60 Q -220 20 -170 14 L -130 -50 Q -110 -70 -80 -70 L 80 -70 Q 110 -70 130 -50 L 170 14 Q 220 20 230 60 L 230 180 Z" fill={c} />
          <path d="M -120 -46 L 120 -46 L 150 8 L -150 8 Z" fill="#141826" />
          <rect x={-210} y={50} width={70} height={30} rx={8} fill={f % 30 < 15 && f >= honkAt ? "#ff4040" : "#a32020"} />
          <rect x={140} y={50} width={70} height={30} rx={8} fill={f % 30 < 15 && f >= honkAt ? "#ff4040" : "#a32020"} />
          <rect x={-70} y={70} width={140} height={34} fill="#e8e4d4" />
          {f >= honkAt + i * 5 && Math.floor((f + i * 7) / 6) % 3 === 0 && (
            <g stroke="#fff1a8" strokeWidth={7} strokeLinecap="round"><line x1={-40} y1={-90} x2={-60} y2={-130} /><line x1={0} y1={-95} x2={0} y2={-140} /><line x1={40} y1={-90} x2={60} y2={-130} /></g>
          )}
        </g>
      ))}
    </g>
  );
};

// ------------------------------------------------------------------ Capitol West Front, Jan 20 2021 (Field of Flags)
export const CapitolWest2021: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="p5-cw-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fb7cf" /><stop offset="1" stopColor="#e4e9ee" /></linearGradient>
        <linearGradient id="p5-cw-marble" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f4f2ec" /><stop offset="0.6" stopColor="#e6e2d8" /><stop offset="1" stopColor="#cfcabd" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#p5-cw-sky)" />
      <Cloud x={200 + f * 0.08} y={100} c="#f2f4f6" /><Cloud x={1600 + f * 0.06} y={140} s={0.9} c="#f2f4f6" />
      {/* dome: drum colonnade, cast-iron dome, Statue of Freedom */}
      <rect x={760} y={250} width={400} height={170} fill="url(#p5-cw-marble)" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={772 + i * 33} y={262} width={14} height={150} fill="#d9d4c6" />)}
      <path d="M 790 255 Q 960 40 1130 255 Z" fill="url(#p5-cw-marble)" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${830 + i * 50} 252 Q ${900 + i * 10} 130 960 90`} stroke="#cfcabd" strokeWidth={3} fill="none" />)}
      <rect x={935} y={60} width={50} height={50} fill="#e6e2d8" stroke={L} strokeWidth={3} />
      <path d="M 952 60 L 952 20 L 960 5 L 968 20 L 968 60 Z" fill="#6b6a62" stroke={L} strokeWidth={2} />
      {/* wings and West Front */}
      <rect x={100} y={400} width={1720} height={260} fill="url(#p5-cw-marble)" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 26 }, (_, i) => <rect key={i} x={130 + i * 66} y={430} width={20} height={200} fill="#d8d3c5" />)}
      <path d="M 760 410 L 960 340 L 1160 410 Z" fill="#ece8de" stroke={L} strokeWidth={lw} />
      {/* five hanging flags on the facade */}
      {[300, 560, 1260, 1520].map((x, i) => <UsFlag key={i} x={x} y={420} w={120} h={190} ripple={0.3} seed={i} />)}
      <UsFlag x={870} y={420} w={180} h={220} ripple={0.3} seed={7} />
      {/* terraces */}
      <rect x={60} y={650} width={1800} height={60} fill="#dcd7ca" stroke={L} strokeWidth={3} />
      {Array.from({ length: 40 }, (_, i) => <rect key={i} x={70 + i * 45} y={660} width={14} height={44} fill="#c9c3b3" />)}
      {/* inaugural platform */}
      <rect x={0} y={700} width={1920} height={200} fill="#c9c3b3" />
      <rect x={220} y={740} width={1480} height={30} fill="#2b3f74" />
      <Paint vig={0.28} warm={false} />
    </g>
  );
};

/** Platform rail with bunting fans (foreground; hides the speaker's legs). */
export const BuntingRail: React.FC<{ y?: number }> = ({ y = 820 }) => (
  <g>
    <rect x={0} y={y} width={1920} height={1080 - y} fill="#e9e5da" stroke={L} strokeWidth={lw} />
    {Array.from({ length: 7 }, (_, i) => (
      <g key={i} transform={`translate(${60 + i * 270} ${y})`} stroke={L} strokeWidth={3}>
        <path d="M 0 0 A 120 120 0 0 0 240 0 Z" fill="#2b3f74" />
        <path d="M 24 0 A 96 96 0 0 0 216 0 Z" fill="#f4f1ea" />
        <path d="M 50 0 A 70 70 0 0 0 190 0 Z" fill="#b8362f" />
        <path d="M 80 0 A 40 40 0 0 0 160 0 Z" fill="#f4f1ea" />
      </g>
    ))}
    <rect x={0} y={y - 10} width={1920} height={16} fill="#2b3f74" />
  </g>
);

/** The Field of Flags on the Mall (foreground): rows of small fluttering flags. */
export const FlagField: React.FC<{ y?: number }> = ({ y = 930 }) => (
  <g>
    <rect y={y + 40} width={1920} height={1080 - y} fill="#5f7d45" />
    {[0, 1, 2].map((r) => Array.from({ length: 26 - r * 2 }, (_, i) => {
      const s = 1 + r * 0.35;
      const x = -20 + i * (80 + r * 24) + (r % 2) * 30;
      const yy = y + r * 45;
      return <g key={`${r}-${i}`}><line x1={x} y1={yy} x2={x} y2={yy + 90 * s} stroke="#6b5a3a" strokeWidth={3 * s} /><UsFlag x={x + 2} y={yy} w={46 * s} h={30 * s} seed={i + r * 9} /></g>;
    }))}
  </g>
);

// ------------------------------------------------------------------ South Lawn signing (Nov 15 2021)
export const SouthLawn: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><linearGradient id="p5-sl-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fb4d6" /><stop offset="1" stopColor="#e6ecee" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#p5-sl-sky)" />
      <Cloud x={300 + f * 0.1} y={90} /><Cloud x={1500 + f * 0.08} y={130} s={0.8} />
      <Tree x={90} y={700} s={1.3} c={["#b8862e", "#c99a3a", "#9a6a2a"]} /><Tree x={1840} y={700} s={1.3} c={["#b8862e", "#c99a3a", "#9a6a2a"]} />
      {/* main facade */}
      <rect x={200} y={260} width={1520} height={440} fill="#f2f0ea" stroke={L} strokeWidth={lw} />
      <rect x={190} y={250} width={1540} height={24} fill="#e6e2d8" stroke={L} strokeWidth={3} />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={200 + i * 51} y={226} width={14} height={26} fill="#e6e2d8" stroke={L} strokeWidth={1.5} />)}
      {[0, 1].map((r) => Array.from({ length: 10 }, (_, i) => { const x = 250 + i * 150 + (i >= 4 ? 260 : 0); if (x > 1640) return null; return <g key={`${r}${i}`}><rect x={x} y={320 + r * 190} width={70} height={130} fill="#4d5866" stroke="#fff" strokeWidth={5} /><path d={`M ${x - 10} ${318 + r * 190} L ${x + 35} ${292 + r * 190} L ${x + 80} ${318 + r * 190} Z`} fill="#e6e2d8" stroke={L} strokeWidth={2} /></g>; }))}
      {/* South Portico bow with the Truman Balcony */}
      <path d="M 720 260 Q 960 180 1200 260 L 1200 700 L 720 700 Z" fill="#e9e6dd" stroke={L} strokeWidth={lw} />
      <path d="M 720 262 Q 960 186 1200 262 L 1200 285 Q 960 210 720 285 Z" fill="#dcd7ca" stroke={L} strokeWidth={2} />
      {[750, 830, 915, 1005, 1090, 1170].map((x, i) => <rect key={i} x={x - 16} y={270 - Math.sin(((x - 720) / 480) * Math.PI) * 50 + 20} width={32} height={430 + Math.sin(((x - 720) / 480) * Math.PI) * 50 - 20} fill="#fbfaf6" stroke={L} strokeWidth={2} />)}
      <path d="M 720 450 Q 960 400 1200 450 L 1200 470 Q 960 420 720 470 Z" fill="#cfcabd" stroke={L} strokeWidth={2} />
      {Array.from({ length: 22 }, (_, i) => <line key={i} x1={735 + i * 21} y1={430 - Math.sin((i / 21) * Math.PI) * 36} x2={735 + i * 21} y2={452 - Math.sin((i / 21) * Math.PI) * 44} stroke="#8a857a" strokeWidth={3} />)}
      <path d="M 700 700 L 1220 700 L 1300 760 L 620 760 Z" fill="#dcd7ca" stroke={L} strokeWidth={3} />
      {/* lawn, stage, flags */}
      <rect y={740} width={1920} height={340} fill="#6f9a4e" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M 0 ${760 + i * 28} Q 960 ${740 + i * 30} 1920 ${760 + i * 28}`} stroke="#638c45" strokeWidth={6} fill="none" />)}
      {Array.from({ length: 8 }, (_, i) => { const x = 560 + i * 115; return <g key={i}><line x1={x} y1={560} x2={x} y2={820} stroke="#c9a14a" strokeWidth={5} /><UsFlag x={x + 2} y={562} w={62} h={42} seed={i} /></g>; })}
      <rect x={440} y={800} width={1040} height={50} fill="#2b3f74" stroke={L} strokeWidth={lw} />
      <Paint vig={0.28} />
    </g>
  );
};

// ------------------------------------------------------------------ the presidents' portrait gallery (recap)
const SLOTS: { c: string; how: "E" | "D" | "R"; pred?: string }[] = [
  { c: "john_adams", how: "E" }, { c: "thomas_jefferson", how: "E" }, { c: "martin_van_buren", how: "E" },
  { c: "john_tyler", how: "D", pred: "william_henry_harrison" }, { c: "millard_fillmore", how: "D", pred: "zachary_taylor" },
  { c: "andrew_johnson", how: "D", pred: "abraham_lincoln" }, { c: "chester_arthur", how: "D", pred: "james_garfield" },
  { c: "theodore_roosevelt", how: "D", pred: "william_mckinley" }, { c: "calvin_coolidge", how: "D", pred: "warren_harding" },
  { c: "harry_truman", how: "D", pred: "franklin_roosevelt" }, { c: "lyndon_johnson", how: "D", pred: "john_f_kennedy" },
  { c: "richard_nixon", how: "E" }, { c: "gerald_ford", how: "R" }, { c: "george_hw_bush", how: "E" }, { c: "joe_biden", how: "E" },
];
export const slotXY = (c: string): [number, number] => {
  const i = SLOTS.findIndex((s) => s.c === c);
  return [420 + (i % 5) * 270, 200 + Math.floor(i / 5) * 268];
};
const BACKS = ["#6f5f4a", "#56656e", "#6a5664", "#5d6a55", "#6e5a48"];

/** Small black mourning oval with the dead predecessor's head (grey), tucked onto a frame's corner. */
const MournInset: React.FC<{ c: string; x: number; y: number; at: number }> = ({ c, x, y, at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = interpolate(f - at, [0, 11], [0.11, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const img = `tg2/vp/${c}/${HEAD[c][0]}.png`;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse rx={62} ry={74} fill="#0d0b0b" stroke="#c9a14a" strokeWidth={5} />
      <ellipse rx={50} ry={62} fill="#cfc6b2" />
      <g filter="url(#p5-gray)"><SImg key={img} href={staticFile(img)} x={-46} y={-56} width={92} height={110} preserveAspectRatio="xMidYMid meet" /></g>
      <path d="M -30 74 L -48 120 L -20 104 L 0 128 L 20 104 L 48 120 L 30 74 Z" fill="#0d0b0b" />
    </g>
  );
};

const Rosette: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = interpolate(f - at, [0, 11], [0.11, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5}>
      <path d="M -24 20 L -44 96 L -18 82 L -6 108 L 6 30 Z M 24 20 L 44 96 L 18 82 L 6 108 L -6 30 Z" fill="#2b5fb8" />
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={Math.cos((i / 12) * Math.PI * 2) * 40} cy={Math.sin((i / 12) * Math.PI * 2) * 40} r={16} fill="#2b5fb8" strokeWidth={3} />)}
      <circle r={40} fill="#f4f1ea" />
      <path d="M -18 0 L -4 16 L 22 -16" fill="none" stroke="#2b5fb8" strokeWidth={11} strokeLinecap="round" />
    </g>
  );
};

/** Brass museum plaque under a frame. */
const Plaque: React.FC<{ x: number; y: number; text: string; at: number }> = ({ x, y, text, at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <g>
      <rect x={x - 118} y={y} width={236} height={46} rx={6} fill="#c9a14a" stroke={L} strokeWidth={3} />
      <text x={x} y={y + 33} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={26} fill="#2b2119">{text}</text>
    </g>
  );
};

export type WallProps = {
  e?: Record<string, ExprTL>;
  only?: ("E" | "D" | "R")[]; onlyAt?: number;           // dim every frame not in this group from `onlyAt`
  mournAt?: number; resignAt?: number; electAt?: number;
  plaques?: [string, string, number][];                   // [character, text, at]
  spot?: [string, number][];                              // warm spotlight on a frame from `at`
};

/** National Portrait Gallery, "America's Presidents": slate walls, track lights, the fifteen in gilt frames. */
export const Gallery: React.FC<WallProps> = ({ e = {}, only, onlyAt = 0, mournAt, resignAt, electAt, plaques = [], spot = [] }) => {
  const f = useCurrentFrame();
  let di = 0, ei = 0;
  return (
    <g>
      <defs>
        <filter id="p5-gray"><feColorMatrix type="saturate" values="0" /></filter>
        <radialGradient id="p5-gal-pool" cx="50%" cy="20%" r="70%"><stop offset="0" stopColor="#fff2c8" stopOpacity={0.32} /><stop offset="1" stopColor="#fff2c8" stopOpacity={0} /></radialGradient>
        <linearGradient id="p5-gal-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a5636" /><stop offset="1" stopColor="#4a3220" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="#2e3641" />
      <rect width={1920} height={46} fill="#1c2128" />
      {Array.from({ length: 10 }, (_, i) => <g key={i}><rect x={120 + i * 190} y={46} width={18} height={30} fill="#111" /><rect x={110 + i * 190} y={70} width={38} height={22} rx={4} fill="#2a2a2a" /></g>)}
      <rect y={900} width={1920} height={180} fill="url(#p5-gal-floor)" />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} y1={920 + i * 30} x2={1920} y2={920 + i * 30} stroke="#3e2a1a" strokeWidth={3} />)}
      <rect y={888} width={1920} height={14} fill="#1c2128" />
      {SLOTS.map((s, i) => {
        const [x, y] = slotXY(s.c);
        const lit = !only || f < onlyAt || only.includes(s.how);
        const d = s.how === "D" ? di++ : 0;
        const k = s.how === "E" ? ei++ : 0;
        return (
          <g key={s.c}>
            <ellipse cx={x} cy={y - 30} rx={190} ry={210} fill="url(#p5-gal-pool)" />
            <rect x={x - 108} y={y - 122} width={216} height={244} fill="#b0883c" stroke={L} strokeWidth={lw} />
            <rect x={x - 92} y={y - 106} width={184} height={212} fill="#7a5a22" />
            <rect x={x - 84} y={y - 98} width={168} height={196} fill={BACKS[i % 5]} />
            <HeadIcon c={s.c} e={e[s.c] ?? 0} x={x} y={y + 6} size={170} at={-30} />
            <path d={`M ${x - 84} ${y - 98} L ${x - 20} ${y - 98} L ${x - 84} ${y - 20} Z`} fill="#fff" opacity={0.08} />
            {!lit && <rect x={x - 112} y={y - 126} width={224} height={252} fill="#0b0e13" opacity={0.62} />}
            {s.pred && mournAt !== undefined && <MournInset c={s.pred} x={x + 96} y={y - 92} at={mournAt + d * 5} />}
            {s.how === "E" && electAt !== undefined && <Rosette x={x - 96} y={y + 70} at={electAt + k * 5} />}
            {s.how === "R" && resignAt !== undefined && f >= resignAt && (
              <g transform={`translate(${x + 70} ${y + 60}) rotate(12) scale(${interpolate(f - resignAt, [0, 11], [0.11, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) })})`}>
                <SImg href={staticFile("tg2/vp/shared_props_modern/12.png")} x={-80} y={-80} width={160} height={162} />
              </g>
            )}
          </g>
        );
      })}
      {spot.map(([c, at]) => { if (f < at) return null; const [x, y] = slotXY(c); return <path key={c} d={`M ${x - 30} 46 L ${x + 30} 46 L ${x + 170} ${y + 140} L ${x - 170} ${y + 140} Z`} fill="#fff4c8" opacity={0.18} style={{ mixBlendMode: "screen" }} />; })}
      {plaques.map(([c, t, at]) => { const [x, y] = slotXY(c); return <Plaque key={c} x={x} y={y + 128} text={t} at={at} />; })}
      <Paint vig={0.5} warm={false} />
    </g>
  );
};

/** Museum bench (foreground). */
export const GalleryBench: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    <rect x={560} y={980} width={800} height={46} rx={10} fill="#3a2a1c" />
    <rect x={600} y={1020} width={30} height={60} fill="#1c1510" /><rect x={1290} y={1020} width={30} height={60} fill="#1c1510" />
  </g>
);

/** The gallery's next wing: an arched doorway into a red-lit room, "POLITICAL DISASTERS"; a frame falls at `crashAt`. */
export const DisastersWing: React.FC<{ crashAt: number }> = ({ crashAt }) => {
  const f = useCurrentFrame();
  const fall = interpolate(f - crashAt, [0, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const shake = f >= crashAt + 7 && f < crashAt + 13 ? Math.sin(f * 3) * 4 : 0;
  return (
    <g transform={`translate(${shake} 0)`}>
      <defs>
        <radialGradient id="p5-dw-red" cx="50%" cy="55%" r="60%"><stop offset="0" stopColor="#8a2a22" /><stop offset="1" stopColor="#2a0c0a" /></radialGradient>
        <linearGradient id="p5-dw-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a5636" /><stop offset="1" stopColor="#4a3220" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="#2e3641" />
      <rect width={1920} height={46} fill="#1c2128" />
      {/* arched doorway */}
      <path d="M 640 900 L 640 360 A 320 320 0 0 1 1280 360 L 1280 900 Z" fill="url(#p5-dw-red)" stroke="#b0883c" strokeWidth={18} />
      {/* inside: crooked frames on the red wall */}
      {[[790, 420, -8, "#3a2a2a"], [1110, 440, 6, "#2a2a3a"]].map(([x, y, r, c], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}><rect x={(x as number) - 90} y={(y as number) - 110} width={180} height={220} fill="#6a4a1a" stroke={L} strokeWidth={4} /><rect x={(x as number) - 74} y={(y as number) - 94} width={148} height={188} fill={c as string} /></g>
      ))}
      {/* duelling pistols in one frame, a torn ticket in the other */}
      <g stroke="#c9b48a" strokeWidth={6} fill="none" transform="rotate(-8 790 420)"><path d="M 740 440 L 820 410 L 830 380 M 760 400 L 840 430 L 850 460" /></g>
      <g transform="rotate(6 1110 440)" stroke="#c9b48a" strokeWidth={5}><rect x={1060} y={400} width={46} height={80} fill="#c9b48a" opacity={0.7} /><rect x={1114} y={408} width={46} height={80} fill="#c9b48a" opacity={0.7} /></g>
      {/* the falling frame (centre) */}
      <g transform={`translate(960 ${560 + fall * 300}) rotate(${fall * 34})`}>
        <rect x={-100} y={-120} width={200} height={240} fill="#6a4a1a" stroke={L} strokeWidth={4} /><rect x={-84} y={-104} width={168} height={208} fill="#3a2a3a" />
        <path d="M -40 40 L 40 -50 M 40 40 L -40 -50" stroke="#c9b48a" strokeWidth={8} opacity={0.6} />
      </g>
      {f >= crashAt + 7 && f < crashAt + 11 && <g stroke="#fff" strokeWidth={8} strokeLinecap="round">{[-60, -20, 20, 60].map((a) => <line key={a} x1={960 + a} y1={850} x2={960 + a * 2.2} y2={790} />)}</g>}
      {/* exhibition banner above the arch */}
      <rect x={600} y={70} width={720} height={110} fill="#5a1a16" stroke="#c9a14a" strokeWidth={6} />
      <text x={960} y={145} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={54} fill="#e9c46a" letterSpacing={3}>POLITICAL DISASTERS</text>
      {/* two of the fifteen on the side walls */}
      {[["lyndon_johnson", 260], ["joe_biden", 1660]].map(([c, x]) => (
        <g key={c as string}>
          <rect x={(x as number) - 108} y={300} width={216} height={244} fill="#b0883c" stroke={L} strokeWidth={lw} />
          <rect x={(x as number) - 84} y={324} width={168} height={196} fill="#5d6a55" />
          <HeadIcon c={c as string} x={x as number} y={428} size={170} at={-30} />
        </g>
      ))}
      <rect y={900} width={1920} height={180} fill="url(#p5-dw-floor)" />
      <path d="M 640 900 L 1280 900 L 1420 1080 L 500 1080 Z" fill="#8a2a22" opacity={0.25} />
      <rect y={888} width={1920} height={14} fill="#1c2128" />
      <Paint vig={0.5} warm={false} />
    </g>
  );
};

// ------------------------------------------------------------------ Air Force One stateroom, Love Field, Nov 22 1963
/** The cramped stateroom of SAM 26000: low curved ceiling, beige walls with wood veneer, drawn shades, blue carpet. */
export const AF1Stateroom: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#cfc4ad" />
    <path d="M 0 0 L 1920 0 L 1920 210 Q 960 120 0 210 Z" fill="#e6dfcf" stroke={L} strokeWidth={3} />
    {[480, 960, 1440].map((x) => <g key={x}><rect x={x - 90} y={130} width={180} height={34} rx={8} fill="#fff6d8" /><ellipse cx={x} cy={170} rx={260} ry={110} fill="#fff1c0" opacity={0.18} /></g>)}
    <rect y={560} width={1920} height={300} fill="#8a6a45" />
    {Array.from({ length: 10 }, (_, i) => <line key={i} x1={i * 200} y1={560} x2={i * 200} y2={860} stroke="#6f5233" strokeWidth={4} />)}
    <rect y={552} width={1920} height={14} fill="#b8a27a" />
    {/* windows with shades pulled most of the way down */}
    {[220, 640, 1280, 1700].map((x, i) => (
      <g key={i}>
        <rect x={x - 70} y={280} width={140} height={200} rx={34} fill="#d9e6ef" stroke="#a8987a" strokeWidth={10} />
        <rect x={x - 64} y={286} width={128} height={140} rx={28} fill="#efe6cc" />
        {Array.from({ length: 6 }, (_, k) => <line key={k} x1={x - 60} y1={300 + k * 22} x2={x + 60} y2={300 + k * 22} stroke="#d9ccaa" strokeWidth={3} />)}
      </g>
    ))}
    {/* aides crowded in the back */}
    {[140, 330, 1580, 1790].map((x, i) => (
      <g key={i} transform={`translate(${x} 620)`} fill="#4a4540" stroke={L} strokeWidth={3}>
        <ellipse cx={0} cy={-70} rx={52} ry={60} fill={["#3a2a22", "#6b6058", "#2a2420", "#5a4a3a"][i]} />
        <ellipse cx={0} cy={-52} rx={40} ry={40} fill="#d9b796" />
        <path d="M -90 240 L -90 40 Q -80 -6 0 -10 Q 80 -6 90 40 L 90 240 Z" fill={["#2a2e38", "#3a3a40", "#2c3240", "#3a342e"][i]} />
      </g>
    ))}
    <rect y={860} width={1920} height={220} fill="#2c4466" />
    <rect y={860} width={1920} height={12} fill="#1d2f47" />
    <Paint vig={0.42} />
  </g>
);

/** Air Force One flying home in the dark: night sky, last light on the horizon, clouds streaming past. */
export const AF1Night: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><linearGradient id="p5-an-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#060a1e" /><stop offset="0.6" stopColor="#1d2550" /><stop offset="0.85" stopColor="#4a3a5a" /><stop offset="1" stopColor="#8a5a4a" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#p5-an-sky)" />
      {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 70) * 560} r={1.2 + rnd(i + 3) * 2} fill="#fff" opacity={0.6} />)}
      {Array.from({ length: 7 }, (_, i) => { const x = ((rnd(i + 40) * 2600 - f * (14 + i * 2)) % 2600 + 2600) % 2600 - 340; return <Cloud key={i} x={x} y={640 + rnd(i + 12) * 380} s={1.4 + rnd(i) * 0.8} o={0.35} c="#5a5a7a" />; })}
      <Paint vig={0.5} warm={false} />
    </g>
  );
};

// ------------------------------------------------------------------ Brown's Indian Queen Hotel parlor, Apr 6 1841
export const HotelParlor1841: React.FC = () => (
  <g>
    <defs><pattern id="p5-hp-wall" width={60} height={10} patternUnits="userSpaceOnUse"><rect width={60} height={10} fill="#4f6b50" /><rect width={26} height={10} fill="#58775a" /></pattern></defs>
    <rect width={1920} height={1080} fill="url(#p5-hp-wall)" />
    <rect width={1920} height={60} fill="#e9e1cc" /><rect y={60} width={1920} height={14} fill="#b9a982" />
    <rect y={680} width={1920} height={200} fill="#e9e1cc" stroke={L} strokeWidth={3} />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={30 + i * 240} y={710} width={190} height={140} fill="none" stroke="#cfc4a8" strokeWidth={6} />)}
    {/* tall windows with crimson drapes, daylight */}
    {[180, 520].map((x, i) => (
      <g key={i}>
        <rect x={x} y={150} width={200} height={500} fill="#e3ecef" stroke="#e9e1cc" strokeWidth={14} />
        {[0, 1, 2, 3].map((r) => <line key={r} x1={x} y1={150 + r * 125} x2={x + 200} y2={150 + r * 125} stroke="#e9e1cc" strokeWidth={6} />)}
        <line x1={x + 100} y1={150} x2={x + 100} y2={650} stroke="#e9e1cc" strokeWidth={6} />
        <path d={`M ${x - 50} 120 Q ${x} 400 ${x - 30} 690 L ${x - 70} 690 Q ${x - 50} 400 ${x - 80} 120 Z`} fill="#7a2228" stroke={L} strokeWidth={3} />
        <path d={`M ${x + 250} 120 Q ${x + 200} 400 ${x + 230} 690 L ${x + 270} 690 Q ${x + 250} 400 ${x + 280} 120 Z`} fill="#7a2228" stroke={L} strokeWidth={3} />
        <rect x={x - 90} y={108} width={380} height={22} rx={8} fill="#b08a3c" stroke={L} strokeWidth={3} />
      </g>
    ))}
    <path d="M 160 650 L 800 650 L 1100 1080 L 0 1080 Z" fill="#fff8de" opacity={0.1} />
    {/* marble mantel + gilt mirror */}
    <rect x={1260} y={170} width={360} height={360} fill="#b08a3c" stroke={L} strokeWidth={lw} />
    <rect x={1285} y={195} width={310} height={310} fill="#a9b8b8" /><path d="M 1295 205 L 1400 205 L 1295 330 Z" fill="#fff" opacity={0.25} />
    <rect x={1220} y={540} width={440} height={40} fill="#efebe2" stroke={L} strokeWidth={lw} />
    <rect x={1250} y={580} width={60} height={300} fill="#efebe2" stroke={L} strokeWidth={lw} /><rect x={1570} y={580} width={60} height={300} fill="#efebe2" stroke={L} strokeWidth={lw} />
    <rect x={1310} y={600} width={260} height={280} fill="#1c1410" />
    <path d="M 1360 880 Q 1400 800 1440 840 Q 1470 780 1520 880 Z" fill="#e0782a" opacity={0.8} />
    {[1290, 1590].map((x) => <g key={x}><rect x={x - 8} y={490} width={16} height={50} fill="#c9a14a" /><rect x={x - 4} y={460} width={8} height={30} fill="#f4efe0" /><ellipse cx={x} cy={452} rx={6} ry={12} fill="#ffd27a" /></g>)}
    {/* chandelier */}
    <line x1={960} y1={74} x2={960} y2={150} stroke="#6b5a2a" strokeWidth={5} />
    <path d="M 860 170 Q 960 230 1060 170" stroke="#c9a14a" strokeWidth={8} fill="none" />
    {[870, 915, 960, 1005, 1050].map((x) => <g key={x}><rect x={x - 4} y={140} width={8} height={30} fill="#f4efe0" /><ellipse cx={x} cy={132} rx={5} ry={10} fill="#ffd27a" /></g>)}
    {/* carpet */}
    <rect y={880} width={1920} height={200} fill="#7a2b2b" />
    {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={70 + i * 140} cy={980} r={30} fill="none" stroke="#c9a14a" strokeWidth={6} opacity={0.6} />)}
    <Paint vig={0.4} />
  </g>
);

// ------------------------------------------------------------------ Whig caucus room, Sept 1841
export const WhigRoom: React.FC<{ doorAt?: number }> = ({ doorAt = 99999 }) => {
  const f = useCurrentFrame();
  const open = interpolate(f - doorAt, [0, 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g>
      <defs><radialGradient id="p5-wr-dark" cx="45%" cy="55%" r="70%"><stop offset="0.35" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#0a0805" stopOpacity={0.75} /></radialGradient></defs>
      <rect width={1920} height={1080} fill="#5a4630" />
      {Array.from({ length: 24 }, (_, i) => <rect key={i} x={i * 80} y={0} width={40} height={720} fill="#53412c" />)}
      <rect y={700} width={1920} height={380} fill="#3a2617" />
      {/* banner */}
      <path d="M 360 140 L 1160 140 L 1160 330 L 760 370 L 360 330 Z" fill="#e9dcc0" stroke={L} strokeWidth={lw} />
      <text x={760} y={245} textAnchor="middle" fontFamily="DejaVu Serif, Georgia, serif" fontWeight={700} fontSize={72} fill="#7a2228">WHIG PARTY</text>
      {[460, 1060].map((x) => <path key={x} transform={`translate(${x} 300)`} d="M 0 -22 L 6 -6 L 23 -6 L 9 4 L 14 21 L 0 11 L -14 21 L -9 4 L -23 -6 L -6 -6 Z" fill="#2b3f74" />)}
      {/* portrait of Henry Clay's era: generic framed landscape */}
      <rect x={180} y={420} width={200} height={150} fill="#9c7a3e" stroke={L} strokeWidth={lw} /><rect x={196} y={436} width={168} height={118} fill="#6f7f5e" />
      {/* door at right: light spills when flung open */}
      <rect x={1560} y={230} width={260} height={480} fill="#f6e7b8" stroke={L} strokeWidth={lw} />
      <path d={`M 1560 230 L ${1820 - open * 240} ${230 - open * 20} L ${1820 - open * 240} ${710 + open * 20} L 1560 710 Z`} fill="#4a2a18" stroke={L} strokeWidth={lw} />
      {open > 0 && <path d="M 1560 710 L 1820 710 L 1920 1080 L 1300 1080 Z" fill="#fff1c0" opacity={0.18 * open} />}
      {/* candles */}
      {[620, 900, 1180].map((x) => <g key={x}><rect x={x - 6} y={600} width={12} height={40} fill="#f4efe0" /><ellipse cx={x} cy={592} rx={7} ry={13} fill="#ffd27a" /><circle cx={x} cy={592} r={90} fill="#ffd27a" opacity={0.08} /></g>)}
      <rect width={1920} height={1080} fill="url(#p5-wr-dark)" />
      <Paint vig={0.4} />
    </g>
  );
};

/** Long caucus table with seated Whig silhouettes (foreground). */
export const WhigTable: React.FC = () => {
  const man = (x: number, k: number) => (
    <g key={k} transform={`translate(${x} 0)`}>
      <path d="M -120 1080 L -120 900 Q -120 820 -50 812 L 50 812 Q 120 820 120 900 L 120 1080 Z" fill="#1b1611" />
      <ellipse cx={0} cy={750} rx={62} ry={72} fill="#1b1611" />
      <path d="M -40 812 L 0 860 L 40 812" fill="#e9e1cc" opacity={0.5} />
    </g>
  );
  return (
    <g>
      {[150, 420, 1700].map((x, i) => man(x, i))}
      <rect x={-20} y={960} width={1960} height={140} fill="#4a2c14" stroke={L} strokeWidth={lw} />
      <rect x={-20} y={950} width={1960} height={20} fill="#6b4226" />
      {[[300, 940], [560, 945], [980, 938]].map(([x, y], i) => <rect key={i} x={x} y={y} width={120} height={22} fill="#e9dcc0" stroke={L} strokeWidth={2} transform={`rotate(${(i - 1) * 6} ${x} ${y})`} />)}
    </g>
  );
};

// ------------------------------------------------------------------ the President's House, north front, 1841
export const WhiteHouse1841: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><linearGradient id="p5-wh-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fa8cf" /><stop offset="1" stopColor="#eee8d6" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#p5-wh-sky)" />
      <Cloud x={260 + f * 0.1} y={120} /><Cloud x={1520 + f * 0.08} y={90} s={0.8} />
      <Tree x={100} y={760} s={1.3} /><Tree x={1830} y={760} s={1.3} />
      <rect x={300} y={300} width={1320} height={450} fill="#f1ede2" stroke={L} strokeWidth={lw} />
      <rect x={290} y={290} width={1340} height={24} fill="#e3ddcc" stroke={L} strokeWidth={3} />
      {Array.from({ length: 26 }, (_, i) => <rect key={i} x={300 + i * 51} y={266} width={14} height={26} fill="#e3ddcc" stroke={L} strokeWidth={1.5} />)}
      {[0, 1].map((r) => Array.from({ length: 10 }, (_, i) => { const x = 350 + i * 128 + (i >= 4 ? 240 : 0); if (x > 1560) return null; return <g key={`${r}${i}`}><rect x={x} y={360 + r * 200} width={64} height={128} fill="#4d5866" stroke="#fff" strokeWidth={5} />{r === 0 && (i % 2 ? <path d={`M ${x - 10} ${356} Q ${x + 32} ${320} ${x + 74} ${356} Z`} fill="#e3ddcc" stroke={L} strokeWidth={2} /> : <path d={`M ${x - 10} ${356} L ${x + 32} ${326} L ${x + 74} ${356} Z`} fill="#e3ddcc" stroke={L} strokeWidth={2} />)}</g>; }))}
      {/* North Portico (1830): Ionic columns, pediment */}
      <path d="M 760 300 L 960 210 L 1160 300 Z" fill="#f6f3ea" stroke={L} strokeWidth={lw} />
      <rect x={760} y={296} width={400} height={30} fill="#e3ddcc" stroke={L} strokeWidth={3} />
      <rect x={780} y={326} width={360} height={430} fill="#d9d3c2" />
      {[790, 880, 990, 1080].map((x) => <g key={x}><rect x={x} y={326} width={50} height={430} fill="#fbfaf6" stroke={L} strokeWidth={3} /><path d={`M ${x - 10} 336 q 10 -16 20 0 M ${x + 40} 336 q 10 -16 20 0`} stroke={L} strokeWidth={3} fill="none" /></g>)}
      <rect x={920} y={600} width={80} height={156} fill="#4a3a2a" stroke={L} strokeWidth={3} />
      <rect y={750} width={1920} height={330} fill="#7a9a52" />
      <path d="M 860 760 L 1060 760 L 1300 1080 L 620 1080 Z" fill="#cdbf9a" />
      <Paint vig={0.3} />
    </g>
  );
};

/** Iron fence with stone gate posts and oil lamps (foreground). */
export const IronFence: React.FC = () => (
  <g>
    <rect y={1000} width={1920} height={24} fill="#6b6a62" stroke={L} strokeWidth={3} />
    {Array.from({ length: 64 }, (_, i) => { const x = i * 30 + 10; if (x > 560 && x < 1360) return null; return <g key={i}><line x1={x} y1={860} x2={x} y2={1010} stroke="#1c1c1c" strokeWidth={6} /><path d={`M ${x - 7} 866 L ${x} 846 L ${x + 7} 866 Z`} fill="#1c1c1c" /></g>; })}
    <rect y={880} width={1920} height={8} fill="#1c1c1c" />
    {[520, 1360].map((x) => <g key={x} stroke={L} strokeWidth={3}><rect x={x} y={800} width={60} height={240} fill="#d9d3c2" /><rect x={x - 8} y={790} width={76} height={20} fill="#c9c3b2" /><rect x={x + 22} y={740} width={16} height={50} fill="#1c1c1c" /><path d={`M ${x + 10} 740 L ${x + 30} 700 L ${x + 50} 740 Z`} fill="#f2e2a6" /></g>)}
  </g>
);

// ------------------------------------------------------------------ outer Oval Office corridor (the waiting line)
export const OuterOval: React.FC<{ shutAt: number; spinFrom: number }> = ({ shutAt, spinFrom }) => {
  const f = useCurrentFrame();
  const shut = interpolate(f - shutAt, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const spin = Math.max(0, f - spinFrom);
  return (
    <g>
      <rect width={1920} height={1080} fill="#efe8d6" />
      <rect width={1920} height={70} fill="#f6f1e4" /><rect y={70} width={1920} height={16} fill="#d9ccaa" />
      <rect y={620} width={1920} height={260} fill="#e6dcc2" stroke={L} strokeWidth={3} />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={30 + i * 240} y={650} width={190} height={200} fill="none" stroke="#d6caa8" strokeWidth={6} />)}
      {/* painting */}
      <rect x={200} y={210} width={360} height={260} fill="#b08a3c" stroke={L} strokeWidth={lw} /><rect x={222} y={232} width={316} height={216} fill="#7f9aa8" /><path d="M 222 400 Q 330 330 420 380 T 538 360 L 538 448 L 222 448 Z" fill="#5d7a4e" />
      {/* wall clock, hands spinning (years passing) */}
      <g transform="translate(1240 230)">
        <circle r={78} fill="#f6f1e4" stroke="#6b4a2a" strokeWidth={12} />
        <line x1={0} y1={0} x2={Math.sin(spin * 0.35) * 56} y2={-Math.cos(spin * 0.35) * 56} stroke="#111" strokeWidth={5} strokeLinecap="round" />
        <line x1={0} y1={0} x2={Math.sin(spin * 0.03 + 2) * 36} y2={-Math.cos(spin * 0.03 + 2) * 36} stroke="#111" strokeWidth={8} strokeLinecap="round" />
      </g>
      {/* the curved Oval Office door with its pediment surround */}
      <path d="M 1440 190 L 1620 130 L 1800 190 Z" fill="#f6f1e4" stroke={L} strokeWidth={lw} />
      <rect x={1450} y={190} width={340} height={30} fill="#e6dcc2" stroke={L} strokeWidth={3} />
      <rect x={1470} y={220} width={300} height={660} fill="#fff6d8" stroke={L} strokeWidth={lw} />
      <path d="M 1470 880 L 1770 880 L 1900 1080 L 1300 1080 Z" fill="#fff6d8" opacity={0.35 * (1 - shut)} />
      <path d={`M 1470 220 L ${1470 + 300 * (0.35 + 0.65 * shut)} 220 L ${1470 + 300 * (0.35 + 0.65 * shut)} 880 L 1470 880 Z`} fill="#f2ede0" stroke={L} strokeWidth={lw} />
      {shut > 0.99 && <g>{[0, 1].map((k) => <rect key={k} x={1490 + k * 140} y={250} width={120} height={280} fill="none" stroke="#d9ccaa" strokeWidth={6} />)}<circle cx={1740} cy={560} r={12} fill="#c9a14a" stroke={L} strokeWidth={3} /></g>}
      {f >= shutAt + 4 && f < shutAt + 8 && <g stroke="#fff" strokeWidth={9} strokeLinecap="round">{[260, 420, 600].map((y) => <line key={y} x1={1440} y1={y} x2={1380} y2={y - 10} />)}</g>}
      {/* carpet */}
      <rect y={880} width={1920} height={200} fill="#2f3e66" />
      <rect y={900} width={1920} height={10} fill="#c9a14a" opacity={0.7} />
      <Paint vig={0.32} />
    </g>
  );
};
