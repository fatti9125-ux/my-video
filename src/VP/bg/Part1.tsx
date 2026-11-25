import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SImg } from "../../Thanksgiving3/Kit";
import { MONTSERRAT } from "../../fonts";
import { HEAD, INK, mapXY, USMap } from "../VKit";

/**
 * Part 1 plates (cold open, Adams, Jefferson, Burr, Van Buren, Harrison/Tyler). One painted plate per real
 * place, laid out from the reference photos / engravings in bgref/ (Federal Hall 1789 engraving, Congress
 * Hall Senate chamber photos, "Washington 1800" north-wing view, "The Times" 1837 panic print, Currier's
 * "Death of Harrison" lithograph, Lindenwald) or from the real place as it stood in that year.
 * Background line work is thinner and warmer than the character ink; foreground occluders are separate
 * components drawn AFTER the characters.
 */

const L = "#2b2119";
const lw = 4;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/** Painted texture + vignette for every plate. */
export const Paint: React.FC<{ vig?: number; warm?: boolean }> = ({ vig = 0.45, warm = true }) => (
  <g pointerEvents="none">
    <defs>
      <filter id="p1-tex" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={4} seed={23} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <radialGradient id={warm ? "p1-vigw" : "p1-vigc"} cx="50%" cy="48%" r="72%">
        <stop offset="0.5" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor={warm ? "#1a0f05" : "#05070f"} stopOpacity={1} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} filter="url(#p1-tex)" opacity={0.16} style={{ mixBlendMode: "soft-light" }} />
    <rect width={1920} height={1080} fill={`url(#${warm ? "p1-vigw" : "p1-vigc"})`} opacity={vig} />
  </g>
);

const Sky: React.FC<{ id: string; c: [string, string, string] }> = ({ id, c }) => (
  <>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c[0]} /><stop offset="0.6" stopColor={c[1]} /><stop offset="1" stopColor={c[2]} /></linearGradient></defs>
    <rect width={1920} height={1080} fill={`url(#${id})`} />
  </>
);

const Cloud: React.FC<{ x: number; y: number; s?: number; o?: number; c?: string }> = ({ x, y, s = 1, o = 0.95, c = "#fbfbf7" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={c} opacity={o}>
    <ellipse cx={0} cy={0} rx={120} ry={42} /><ellipse cx={-70} cy={8} rx={70} ry={34} /><ellipse cx={60} cy={-18} rx={80} ry={46} /><ellipse cx={130} cy={10} rx={60} ry={28} />
  </g>
);

const Tree: React.FC<{ x: number; y: number; s?: number; c?: [string, string, string]; trunk?: string }> = ({ x, y, s = 1, c = ["#4f7d3a", "#629448", "#3e6a30"], trunk = "#4a3626" }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 37 + x) * 1.2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -14 0 L -10 -180 M -10 -150 Q 30 -200 70 -220 M -10 -170 Q -50 -210 -80 -230" stroke={trunk} strokeWidth={20} fill="none" strokeLinecap="round" />
      <g transform={`rotate(${sw} 0 -200)`} stroke={L} strokeWidth={3}>
        <ellipse cx={-80} cy={-250} rx={120} ry={95} fill={c[2]} />
        <ellipse cx={70} cy={-260} rx={130} ry={100} fill={c[0]} />
        <ellipse cx={-10} cy={-330} rx={130} ry={105} fill={c[1]} />
        <ellipse cx={20} cy={-220} rx={110} ry={70} fill={c[0]} />
      </g>
    </g>
  );
};

/** Sash window: frame + panes. */
const Sash: React.FC<{ x: number; y: number; w: number; h: number; glass?: string; frame?: string; arch?: boolean; cols?: number; rows?: number }> = ({ x, y, w, h, glass = "#9fb6cf", frame = "#f1ead8", arch, cols = 3, rows = 4 }) => (
  <g>
    {arch
      ? <path d={`M ${x} ${y + h} L ${x} ${y + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} L ${x + w} ${y + h} Z`} fill={glass} stroke={frame} strokeWidth={8} />
      : <rect x={x} y={y} width={w} height={h} fill={glass} stroke={frame} strokeWidth={8} />}
    {Array.from({ length: cols - 1 }, (_, i) => <line key={`c${i}`} x1={x + (w / cols) * (i + 1)} y1={y + (arch ? w / 2 : 0)} x2={x + (w / cols) * (i + 1)} y2={y + h} stroke={frame} strokeWidth={4} />)}
    {Array.from({ length: rows - 1 }, (_, i) => <line key={`r${i}`} x1={x} y1={y + (h / rows) * (i + 1)} x2={x + w} y2={y + (h / rows) * (i + 1)} stroke={frame} strokeWidth={4} />)}
    <path d={`M ${x + 8} ${y + h - 8} L ${x + 8} ${y + h * 0.45}`} stroke="#fff" strokeWidth={4} opacity={0.35} />
  </g>
);

/**
 * Crowd seen from behind (foreground occluder): heads + shoulders in 1-2 rows, era hats, gentle bob.
 * `era`: 1789 tricorns + queues, 1801 queues, 1837 top hats + bonnets, 1963 short hair + suits.
 */
export const CrowdBack: React.FC<{ y: number; x0?: number; x1?: number; n: number; s?: number; era: "1789" | "1801" | "1837" | "1963"; seed?: number; wave?: number; dark?: number }> = ({ y, x0 = -40, x1 = 1960, n, s = 1, era, seed = 1, wave, dark = 0 }) => {
  const f = useCurrentFrame();
  const coats = era === "1963" ? ["#2c2f36", "#3a3d44", "#4b4f57", "#5a524a"] : era === "1837" ? ["#2a2522", "#3b2f2a", "#24303a", "#4a3a2a", "#5b3a3a"] : ["#2b3550", "#4a3326", "#3b4a35", "#5a2e2a", "#2e2a26"];
  const hair = ["#3a2a1e", "#6b5338", "#c9c2b5", "#2a221c", "#8a6a48"];
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const r = rnd(i * 13 + seed * 7);
        const x = x0 + ((x1 - x0) * (i + 0.5)) / n + (r - 0.5) * 40;
        const k = s * (0.92 + rnd(i * 3 + seed) * 0.2);
        const bob = Math.sin(f / (9 + (i % 4)) + i * 1.7) * (wave ? 6 : 2);
        const coat = coats[Math.floor(rnd(i + seed * 11) * coats.length)];
        const hc = hair[Math.floor(rnd(i * 5 + seed) * hair.length)];
        const kind = rnd(i * 17 + seed * 3);
        const arm = wave && Math.sin(f / 6 + i) > 0.2 && i % 3 === 0;
        return (
          <g key={i} transform={`translate(${x} ${y + bob}) scale(${k})`}>
            {arm && <g><path d="M 50 -30 L 90 -190" stroke={coat} strokeWidth={26} strokeLinecap="round" /><circle cx={92} cy={-196} r={16} fill="#e9c4a0" stroke={L} strokeWidth={3} />{era === "1837" && <g><rect x={66} y={-262} width={50} height={56} fill="#1a1614" /><rect x={56} y={-210} width={72} height={10} fill="#1a1614" /></g>}</g>}
            <path d="M -120 200 L -120 10 Q -118 -40 -60 -52 L 60 -52 Q 118 -40 120 10 L 120 200 Z" fill={coat} stroke={L} strokeWidth={4} />
            <ellipse cx={0} cy={-110} rx={56} ry={64} fill={hc} stroke={L} strokeWidth={4} />
            {era === "1789" && kind < 0.55 && <path d="M -78 -140 Q 0 -190 78 -140 L 60 -160 Q 0 -230 -60 -160 Z" fill="#1d1a18" stroke={L} strokeWidth={3} />}
            {(era === "1789" || era === "1801") && <path d="M 0 -60 L -8 -20 L 8 -20 Z" fill="#1d1a18" />}
            {era === "1837" && kind < 0.5 && <g fill="#1a1614"><rect x={-66} y={-152} width={132} height={14} rx={6} /><rect x={-46} y={-250} width={92} height={104} /></g>}
            {era === "1837" && kind >= 0.5 && kind < 0.7 && <path d="M -70 -110 Q -70 -190 0 -190 Q 70 -190 70 -110 Q 30 -150 -70 -110 Z" fill="#c7a46a" stroke={L} strokeWidth={3} />}
            {era === "1963" && <path d="M -56 -120 Q 0 -150 56 -120" stroke="#1a1410" strokeWidth={6} fill="none" opacity={0.5} />}
          </g>
        );
      })}
      {dark > 0 && <rect x={x0} y={y - 300} width={x1 - x0} height={1380 - y} fill="#000" opacity={0} />}
    </g>
  );
};

// =========================================================================== 0. Harrison's deathbed, 1841
/** White House bedroom, night of 3-4 April 1841 (Currier lithograph): red canopy drapes, portrait, door, candle. */
export const HarrisonRoom: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#5b6656" />
    <rect width={1920} height={60} fill="#3a4238" /><rect y={60} width={1920} height={14} fill="#c9bfa4" />
    <rect y={700} width={1920} height={14} fill="#c9bfa4" /><rect y={714} width={1920} height={130} fill="#4a5446" />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={30 + i * 215} y={732} width={180} height={96} fill="none" stroke="#3c463a" strokeWidth={5} />)}
    {/* window, night */}
    <rect x={120} y={150} width={250} height={470} fill="#1a2440" stroke="#d8cfb4" strokeWidth={14} />
    <line x1={245} y1={150} x2={245} y2={620} stroke="#d8cfb4" strokeWidth={6} /><line x1={120} y1={385} x2={370} y2={385} stroke="#d8cfb4" strokeWidth={6} />
    <circle cx={310} cy={220} r={20} fill="#e8e4cc" opacity={0.7} />
    <path d="M 90 130 Q 150 400 110 650 L 70 650 L 70 130 Z" fill="#7a2a24" stroke={L} strokeWidth={3} />
    <path d="M 400 130 Q 340 400 380 650 L 420 650 L 420 130 Z" fill="#7a2a24" stroke={L} strokeWidth={3} />
    {/* door (right) ajar onto a dark hall */}
    <rect x={1700} y={250} width={190} height={450} fill="#14110d" stroke="#c9bfa4" strokeWidth={10} />
    <path d="M 1700 250 L 1640 270 L 1640 690 L 1700 700 Z" fill="#6b4a2e" stroke={L} strokeWidth={3} />
    {/* portrait (top right) */}
    <rect x={1440} y={110} width={200} height={240} fill="#9c7a3e" stroke={L} strokeWidth={lw} />
    <rect x={1460} y={130} width={160} height={200} fill="#4a4238" />
    <ellipse cx={1540} cy={210} rx={40} ry={50} fill="#7a6a58" /><path d="M 1480 330 Q 1540 250 1600 330 Z" fill="#2a2420" />
    {/* canopy: valance + red drapes behind the bed */}
    <path d="M 820 90 L 1640 90 L 1640 150 Q 1430 230 1230 150 Q 1030 230 820 150 Z" fill="#8c2a22" stroke={L} strokeWidth={lw} />
    <path d="M 840 150 Q 900 450 860 760 L 960 760 Q 940 400 1000 175 Z" fill="#7a221c" stroke={L} strokeWidth={3} />
    <path d="M 1620 150 Q 1560 450 1600 760 L 1500 760 Q 1520 400 1460 175 Z" fill="#7a221c" stroke={L} strokeWidth={3} />
    <path d="M 1000 175 Q 1230 230 1460 175 L 1460 700 L 1000 700 Z" fill="#c9b99a" opacity={0.55} />
    {[0, 1, 2].map((i) => <path key={i} d={`M ${870 + i * 18} 200 Q ${900 + i * 15} 450 ${880 + i * 18} 740`} stroke="#5a1814" strokeWidth={4} fill="none" />)}
    {/* floor + carpet */}
    <rect y={840} width={1920} height={240} fill="#6b3b2a" />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M ${i * 150 - 60} 1080 L ${i * 150 + 15} 960 L ${i * 150 + 90} 1080 M ${i * 150 + 15} 960 L ${i * 150 + 90} 860 L ${i * 150 + 165} 960`} stroke="#8a5a3a" strokeWidth={5} fill="none" />)}
    {/* candle stand beside the bed head */}
    <g stroke={L} strokeWidth={3}>
      <path d="M 820 1000 L 840 700 L 880 700 L 900 1000 Z" fill="#3d2a1a" />
      <ellipse cx={860} cy={700} rx={60} ry={14} fill="#5a3d24" />
      <rect x={852} y={630} width={16} height={68} fill="#efe6cf" />
    </g>
    <path d="M 860 628 Q 850 612 860 590 Q 870 612 860 628 Z" fill="#ffe28a" />
    <Paint vig={0.5} />
  </g>
);
export const HARRISON_CANDLE: [number, number] = [860, 600];

/** Armchair back silhouette, foreground right. */
export const ChairFG: React.FC<{ x?: number }> = ({ x = 1700 }) => (
  <g fill="#160f0a" stroke="#160f0a">
    <path d={`M ${x} 1080 L ${x + 10} 700 Q ${x + 120} 640 ${x + 240} 700 L ${x + 250} 1080 Z`} />
    <rect x={x - 30} y={880} width={310} height={40} rx={14} />
  </g>
);

// =========================================================================== 1. Air Force One, 22 Nov 1963
/** SAM 26000 stateroom at Love Field: low curved ceiling, beige panels, two window ports, gold drapes. */
export const AF1Stateroom: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#d6cdb4" />
    <path d="M 0 0 L 1920 0 L 1920 150 Q 960 260 0 150 Z" fill="#ece5d2" stroke={L} strokeWidth={lw} />
    {[360, 760, 1160, 1560].map((x, i) => <ellipse key={i} cx={x} cy={110 + (i === 0 || i === 3 ? 10 : 30)} rx={70} ry={14} fill="#fffbe8" stroke="#bfb79e" strokeWidth={3} />)}
    {/* wood bulkhead in the centre */}
    <rect x={700} y={200} width={520} height={600} fill="#8a6a44" stroke={L} strokeWidth={lw} />
    {Array.from({ length: 7 }, (_, i) => <line key={i} x1={700} y1={240 + i * 80} x2={1220} y2={250 + i * 80} stroke="#7a5c3a" strokeWidth={3} />)}
    <circle cx={960} cy={330} r={70} fill="#2b3f74" stroke="#c9a14a" strokeWidth={8} />
    <circle cx={960} cy={330} r={44} fill="#e9dcb4" /><path d="M 930 335 L 960 300 L 990 335 L 960 360 Z" fill="#8a6a2a" />
    {/* window ports with tarmac glare */}
    {[[240, 300], [1520, 300]].map(([x, y], i) => (
      <g key={i}>
        <rect x={x} y={y} width={170} height={210} rx={70} fill="#bfe1f7" stroke="#b9b19a" strokeWidth={12} />
        <rect x={x + 10} y={y + 120} width={150} height={60} fill="#e8e6dc" opacity={0.8} />
        <path d={`M ${x - 40} ${y - 40} Q ${x - 10} ${y + 200} ${x - 50} ${y + 380} L ${x - 90} ${y + 380} L ${x - 90} ${y - 40} Z`} fill="#b08a4a" stroke={L} strokeWidth={3} />
        <path d={`M ${x + 210} ${y - 40} Q ${x + 180} ${y + 200} ${x + 220} ${y + 380} L ${x + 260} ${y + 380} L ${x + 260} ${y - 40} Z`} fill="#b08a4a" stroke={L} strokeWidth={3} />
      </g>
    ))}
    {/* backlit bystanders crowding the walls */}
    {[120, 470, 600, 1340, 1460, 1800].map((x, i) => (
      <g key={i} fill="#6d6452" opacity={0.75}>
        <ellipse cx={x} cy={420 + (i % 2) * 20} rx={50} ry={60} />
        <path d={`M ${x - 110} 860 L ${x - 105} 540 Q ${x} 480 ${x + 105} 540 L ${x + 110} 860 Z`} />
      </g>
    ))}
    <rect y={800} width={1920} height={280} fill="#4e5f7a" />
    <rect y={800} width={1920} height={14} fill="#3a4658" />
    <Paint vig={0.42} />
  </g>
);

/** Judge Sarah T. Hughes from behind holding the missal, plus a photographer's shoulder (foreground). */
export const AF1FG: React.FC = () => (
  <g>
    <g transform="translate(360 0)">
      <path d="M -150 1080 L -140 760 Q -130 690 -40 680 L 60 680 Q 150 690 160 760 L 170 1080 Z" fill="#20242c" stroke={L} strokeWidth={lw} />
      <ellipse cx={10} cy={600} rx={78} ry={90} fill="#2a1d16" stroke={L} strokeWidth={lw} />
      <path d="M -70 560 Q 10 480 90 560 Q 60 520 10 520 Q -40 520 -70 560 Z" fill="#3a2a20" />
      <path d="M 120 760 Q 200 720 250 700" stroke="#20242c" strokeWidth={40} strokeLinecap="round" fill="none" />
      <rect x={232} y={660} width={70} height={56} rx={6} fill="#3d2414" stroke={L} strokeWidth={3} transform="rotate(-12 260 690)" />
    </g>
    <g fill="#191a1f">
      <path d="M 1640 1080 L 1660 880 Q 1760 820 1920 830 L 1920 1080 Z" />
      <ellipse cx={1790} cy={790} rx={74} ry={84} />
      <rect x={1640} y={760} width={110} height={70} rx={10} fill="#2a2b30" /><circle cx={1660} cy={795} r={26} fill="#0e0f12" stroke="#55565c" strokeWidth={4} />
    </g>
  </g>
);

// =========================================================================== 2. White House North Portico, 1974
export const WhiteHouseNorth: React.FC = () => {
  const f = useCurrentFrame();
  const win = (x: number, y: number, tri: boolean, k: string) => (
    <g key={k}>
      <rect x={x} y={y} width={56} height={96} fill="#3c4a5c" stroke="#e8e6de" strokeWidth={5} />
      <line x1={x + 28} y1={y} x2={x + 28} y2={y + 96} stroke="#e8e6de" strokeWidth={3} /><line x1={x} y1={y + 48} x2={x + 56} y2={y + 48} stroke="#e8e6de" strokeWidth={3} />
      {tri ? <path d={`M ${x - 10} ${y - 6} L ${x + 28} ${y - 30} L ${x + 66} ${y - 6} Z`} fill="#f4f2ec" stroke={L} strokeWidth={2} />
        : <path d={`M ${x - 10} ${y - 6} Q ${x + 28} ${y - 34} ${x + 66} ${y - 6} Z`} fill="#f4f2ec" stroke={L} strokeWidth={2} />}
    </g>
  );
  return (
    <g>
      <Sky id="p1-sky74" c={["#6aa3d8", "#b6d6ec", "#e9efe4"]} />
      <Cloud x={300 + f * 0.12} y={110} s={1.1} /><Cloud x={1500 + f * 0.08} y={80} s={0.9} />
      {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={i * 210} cy={560 - (i % 2) * 20} rx={150} ry={110} fill={i % 2 ? "#4f7a45" : "#5d874f"} />)}
      {/* main block */}
      <rect x={170} y={300} width={1580} height={400} fill="#f2f0ea" stroke={L} strokeWidth={lw} />
      <rect x={150} y={282} width={1620} height={26} fill="#e8e5dc" stroke={L} strokeWidth={3} />
      {Array.from({ length: 40 }, (_, i) => <rect key={i} x={160 + i * 40} y={262} width={14} height={22} fill="#e8e5dc" stroke={L} strokeWidth={2} />)}
      {[230, 340, 450, 560, 1300, 1410, 1520, 1630].map((x, i) => <g key={i}>{win(x, 350, i % 2 === 0, `a${i}`)}{win(x, 540, i % 2 === 1, `b${i}`)}</g>)}
      <rect x={170} y={500} width={1580} height={10} fill="#e0ddd4" />
      {/* North Portico: pediment on four Ionic columns */}
      <path d="M 640 260 L 960 140 L 1280 260 Z" fill="#f6f4ee" stroke={L} strokeWidth={lw} />
      <path d="M 700 245 L 960 160 L 1220 245 Z" fill="none" stroke="#d8d4c8" strokeWidth={4} />
      <rect x={640} y={258} width={640} height={50} fill="#eeebe2" stroke={L} strokeWidth={lw} />
      <rect x={680} y={310} width={560} height={390} fill="#d9d6cc" />
      <rect x={890} y={480} width={140} height={220} fill="#3a3530" stroke="#f2f0ea" strokeWidth={8} />
      <path d="M 890 480 A 70 70 0 0 1 1030 480 Z" fill="#8fa3b8" stroke="#f2f0ea" strokeWidth={6} />
      <line x1={960} y1={310} x2={960} y2={400} stroke="#333" strokeWidth={3} />
      <path d="M 940 400 L 980 400 L 975 450 L 945 450 Z" fill="#e9d98a" stroke="#333" strokeWidth={3} />
      {[690, 840, 1060, 1210].map((x, i) => (
        <g key={i} stroke={L} strokeWidth={3}>
          <rect x={x - 22} y={310} width={44} height={390} fill="#fbfaf6" />
          <path d={`M ${x - 34} 312 Q ${x - 40} 300 ${x - 28} 296 L ${x + 28} 296 Q ${x + 40} 300 ${x + 34} 312 Z`} fill="#fbfaf6" />
          <line x1={x - 8} y1={320} x2={x - 8} y2={690} stroke="#dcd9cf" strokeWidth={3} /><line x1={x + 8} y1={320} x2={x + 8} y2={690} stroke="#dcd9cf" strokeWidth={3} />
        </g>
      ))}
      <rect x={1240} y={300} width={510} height={400} fill="#5a6a7a" opacity={0.08} />
      {/* drive + lawn */}
      <rect y={700} width={1920} height={380} fill="#6e9a4e" />
      <path d="M -100 1080 Q 400 820 760 730 L 1160 730 Q 1520 820 2020 1080 Z" fill="#cfc8b8" stroke="#b8b0a0" strokeWidth={4} />
      <path d="M 560 1080 Q 760 860 900 760 L 1020 760 Q 1160 860 1360 1080 Z" fill="#6e9a4e" />
      <ellipse cx={960} cy={900} rx={120} ry={28} fill="#c6ccd2" stroke={L} strokeWidth={3} />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${950 + i * 10} 890 q ${-30 + i * 30} ${-70 - (f % 8)} ${-60 + i * 60} 0`} stroke="#e6f1fa" strokeWidth={5} fill="none" opacity={0.7} />)}
      <Tree x={70} y={760} s={1.3} /><Tree x={1860} y={770} s={1.35} />
      <Paint vig={0.28} />
    </g>
  );
};

/** Pennsylvania Avenue iron fence (foreground). */
export const IronFence: React.FC<{ y?: number }> = ({ y = 975 }) => (
  <g>
    <rect y={y + 20} width={1920} height={12} fill="#141414" /><rect y={y + 90} width={1920} height={12} fill="#141414" />
    {Array.from({ length: 64 }, (_, i) => <g key={i}><rect x={i * 31} y={y} width={8} height={130} fill="#141414" /><path d={`M ${i * 31 - 4} ${y + 2} L ${i * 31 + 4} ${y - 16} L ${i * 31 + 12} ${y + 2} Z`} fill="#c9a14a" /></g>)}
    <rect y={y + 105} width={1920} height={1080 - y} fill="#bdb6a6" />
  </g>
);

// =========================================================================== 3. Capitol East Front steps (today)
export const CapitolSteps: React.FC = () => (
  <g>
    <Sky id="p1-skycap" c={["#5f9bd2", "#a9cde8", "#e4ecea"]} />
    <Cloud x={260} y={120} s={1} o={0.9} /><Cloud x={1600} y={90} s={0.8} o={0.85} />
    {/* dome */}
    <g stroke={L} strokeWidth={lw}>
      <rect x={950} y={20} width={20} height={60} fill="#3a3a3a" />
      <rect x={900} y={70} width={120} height={60} fill="#f1efe8" />
      <path d="M 640 360 Q 640 130 960 110 Q 1280 130 1280 360 Z" fill="#f4f2ec" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${700 + i * 65} 360 Q ${720 + i * 60} 220 960 120`} fill="none" stroke="#cfcac0" strokeWidth={3} />)}
      <rect x={600} y={360} width={720} height={150} fill="#ecebe4" />
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={615 + i * 44} y={376} width={18} height={120} fill="#fbfaf6" stroke="#bdb8ad" strokeWidth={2} />)}
    </g>
    {/* east portico + wings */}
    <rect x={0} y={500} width={1920} height={220} fill="#ebe8df" stroke={L} strokeWidth={lw} />
    <path d="M 640 500 L 960 420 L 1280 500 Z" fill="#f4f2ec" stroke={L} strokeWidth={lw} />
    {Array.from({ length: 24 }, (_, i) => <rect key={i} x={20 + i * 80} y={520} width={26} height={200} fill="#fbfaf6" stroke="#bdb8ad" strokeWidth={2} />)}
    {/* marble steps */}
    {Array.from({ length: 13 }, (_, i) => <rect key={i} y={700 + i * 30} width={1920} height={30} fill={i % 2 ? "#dcd8cd" : "#e8e4da"} stroke="#c2bdb1" strokeWidth={2} />)}
    {[60, 1860].map((x, i) => <rect key={i} x={x - 50} y={690} width={100} height={390} fill="#d6d1c4" stroke={L} strokeWidth={3} />)}
    <Paint vig={0.3} />
  </g>
);

// =========================================================================== 5. Federal Hall, Wall Street, 30 April 1789
export const FederalHall1789: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <Sky id="p1-skyfh" c={["#7fb1da", "#cfe0e8", "#f1ecde"]} />
      <Cloud x={240 + f * 0.1} y={120} s={1.1} /><Cloud x={1580 + f * 0.08} y={170} s={0.8} />
      {/* Trinity Church spire (far left, down Broad St) + neighbour houses */}
      <path d="M 120 520 L 150 170 L 180 520 Z" fill="#a39a8c" stroke={L} strokeWidth={3} />
      <rect x={100} y={500} width={100} height={260} fill="#b0a696" stroke={L} strokeWidth={3} />
      <g stroke={L} strokeWidth={3}>
        <path d="M 210 760 L 210 430 L 260 380 L 310 430 L 360 380 L 410 430 L 410 760 Z" fill="#9a5a3e" />
        <path d="M 1510 760 L 1510 410 L 1570 360 L 1630 410 L 1690 360 L 1750 410 L 1750 760 Z" fill="#8a4e36" />
        {[240, 330, 1540, 1640].map((x, i) => [460, 560, 660].map((y, j) => <rect key={`${i}${j}`} x={x} y={y} width={50} height={64} fill="#3c4a5c" stroke="#e8dcc0" strokeWidth={3} />))}
      </g>
      {/* hipped roof + cupola */}
      <path d="M 420 300 L 520 220 L 1400 220 L 1500 300 Z" fill="#7a5a44" stroke={L} strokeWidth={lw} />
      <rect x={910} y={120} width={100} height={100} fill="#efe6d2" stroke={L} strokeWidth={lw} />
      <path d="M 900 125 Q 960 40 1020 125 Z" fill="#7a5a44" stroke={L} strokeWidth={lw} />
      <line x1={960} y1={60} x2={960} y2={20} stroke={L} strokeWidth={5} />
      <path d="M 930 200 A 30 30 0 0 1 990 200 L 990 215 L 930 215 Z" fill="#3c4a5c" />
      {/* body */}
      <rect x={420} y={300} width={1080} height={460} fill="#d9cdb2" stroke={L} strokeWidth={lw} />
      {[470, 560, 1300, 1390].map((x, i) => [330, 470, 610].map((y, j) => <rect key={`${i}-${j}`} x={x} y={y} width={56} height={92} fill="#3c4a5c" stroke="#f1ead8" strokeWidth={4} />))}
      {/* pediment with eagle relief */}
      <path d="M 640 290 L 960 170 L 1280 290 Z" fill="#e8dfca" stroke={L} strokeWidth={lw} />
      <path d="M 910 255 Q 960 215 1010 255 Q 985 248 960 270 Q 935 248 910 255 Z" fill="#c9a14a" stroke={L} strokeWidth={2} />
      <rect x={640} y={288} width={640} height={36} fill="#e2d8c0" stroke={L} strokeWidth={3} />
      {/* Doric columns over the arcade, balcony between */}
      <rect x={660} y={324} width={600} height={230} fill="#b9ad92" />
      <rect x={880} y={380} width={160} height={174} fill="#2e2a26" stroke="#e8dfca" strokeWidth={6} />
      {[690, 830, 1090, 1230].map((x, i) => <rect key={i} x={x - 22} y={324} width={44} height={250} fill="#f1ead8" stroke={L} strokeWidth={3} />)}
      <rect x={650} y={500} width={620} height={14} fill="#f1ead8" stroke={L} strokeWidth={2} />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={654 + i * 20.5} y={514} width={8} height={40} fill="#f1ead8" />)}
      <path d="M 660 520 Q 735 560 810 520 Q 885 560 960 520 Q 1035 560 1110 520 Q 1185 560 1260 520" stroke="#b8362f" strokeWidth={12} fill="none" />
      <path d="M 660 530 Q 735 566 810 530 Q 885 566 960 530 Q 1035 566 1110 530 Q 1185 566 1260 530" stroke="#2b3f74" strokeWidth={6} fill="none" />
      <rect x={650} y={554} width={620} height={20} fill="#e2d8c0" stroke={L} strokeWidth={3} />
      {/* ground-floor arcade */}
      {[670, 820, 970, 1120].map((x, i) => <path key={i} d={`M ${x} 760 L ${x} 640 A 65 65 0 0 1 ${x + 130} 640 L ${x + 130} 760 Z`} fill="#3a3430" stroke={L} strokeWidth={lw} />)}
      {/* Wall Street */}
      <rect y={760} width={1920} height={320} fill="#b9a988" />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={780 + i * 26} x2={1920} y2={780 + i * 26} stroke="#a8977a" strokeWidth={3} />)}
      <Tree x={1820} y={800} s={1.25} c={["#4f7d3a", "#6a9b4c", "#3e6a30"]} />
      <Paint vig={0.3} />
    </g>
  );
};

/** The oath balcony seen close from the street: wall, door into the Senate chamber, Bible on its crimson table. */
export const FederalBalcony: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#d6ccb4" />
    <rect width={1920} height={110} fill="#e4dcc6" stroke={L} strokeWidth={lw} />
    <rect y={110} width={1920} height={20} fill="#c9bea4" />
    {Array.from({ length: 16 }, (_, i) => <rect key={i} x={i * 124} y={10} width={60} height={90} fill="#d8cfb6" stroke={L} strokeWidth={2} />)}
    <rect x={760} y={190} width={400} height={640} fill="#2a241f" stroke="#efe6d2" strokeWidth={14} />
    <path d="M 760 190 A 200 120 0 0 1 1160 190 Z" fill="#6f8296" stroke="#efe6d2" strokeWidth={10} />
    <rect x={790} y={230} width={340} height={600} fill="#3a3028" opacity={0.6} />
    <path d="M 800 830 L 1120 830 L 1060 300 L 860 300 Z" fill="#5a2a22" opacity={0.25} />
    {/* crimson-draped table with the Bible on its cushion */}
    <g stroke={L} strokeWidth={3}>
      <path d="M 880 640 L 1040 640 L 1060 800 L 860 800 Z" fill="#8c1f22" />
      <rect x={890} y={612} width={140} height={30} rx={8} fill="#a3262a" />
      <rect x={915} y={592} width={90} height={24} fill="#3d2414" />
      <rect x={918} y={590} width={84} height={8} fill="#e9dcc0" />
    </g>
    {/* two great columns */}
    {[260, 1660].map((x, i) => (
      <g key={i} stroke={L} strokeWidth={lw}>
        <rect x={x - 90} y={130} width={180} height={950} fill="#efe8d6" />
        <rect x={x - 110} y={130} width={220} height={40} fill="#e6dec8" />
        {[-50, -15, 20, 55].map((d) => <line key={d} x1={x + d} y1={175} x2={x + d} y2={1080} stroke="#d4cbb4" strokeWidth={4} />)}
        <rect x={x + 30} y={130} width={60} height={950} fill="#6b5a40" opacity={0.12} stroke="none" />
      </g>
    ))}
    <rect y={130} width={1920} height={950} fill="#ffe7b0" opacity={0.08} />
    <Paint vig={0.35} />
  </g>
);

/** Balcony railing with bunting (foreground, hides the legs). */
export const BalconyRail: React.FC = () => (
  <g>
    <rect x={0} y={790} width={1920} height={26} fill="#efe8d6" stroke={L} strokeWidth={lw} />
    {Array.from({ length: 40 }, (_, i) => <path key={i} d={`M ${20 + i * 48} 816 q -14 40 0 70 q 16 30 0 70 l 0 60 l 22 0 l 0 -60 q -16 -40 0 -70 q 14 -30 0 -70 Z`} fill="#e6dec8" stroke={L} strokeWidth={2} />)}
    <rect x={0} y={1010} width={1920} height={70} fill="#d8cfb6" stroke={L} strokeWidth={lw} />
    <path d="M 0 820 Q 240 920 480 820 Q 720 920 960 820 Q 1200 920 1440 820 Q 1680 920 1920 820 L 1920 840 Q 1680 950 1440 840 Q 1200 950 960 840 Q 720 950 480 840 Q 240 950 0 840 Z" fill="#b8362f" stroke={L} strokeWidth={3} />
    <path d="M 0 840 Q 240 950 480 840 Q 720 950 960 840 Q 1200 950 1440 840 Q 1680 950 1920 840 L 1920 860 Q 1680 975 1440 860 Q 1200 975 960 860 Q 720 975 480 860 Q 240 975 0 860 Z" fill="#f4f1ea" />
    <path d="M 0 860 Q 240 975 480 860 Q 720 975 960 860 Q 1200 975 1440 860 Q 1680 975 1920 860 L 1920 880 Q 1680 1000 1440 880 Q 1200 1000 960 880 Q 720 1000 480 880 Q 240 1000 0 880 Z" fill="#2b3f74" stroke={L} strokeWidth={3} />
  </g>
);

// =========================================================================== 6/10/11. President's House, Philadelphia
/** Georgian parlour of the President's House on High Street: sage panelling, fireplace, sash windows, drapes. */
export const PresidentsHousePhila: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#a7b398" />
    <rect width={1920} height={70} fill="#f1ead8" stroke={L} strokeWidth={lw} />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={40 + i * 320} y={120} width={260} height={480} fill="none" stroke="#97a488" strokeWidth={6} />)}
    <rect y={640} width={1920} height={20} fill="#f1ead8" /><rect y={660} width={1920} height={200} fill="#e6dfca" />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={30 + i * 215} y={690} width={170} height={140} fill="none" stroke="#cfc7b0" strokeWidth={5} />)}
    {/* windows with green drapes */}
    {[150, 1530].map((x, i) => (
      <g key={i}>
        <Sash x={x} y={160} w={240} h={440} glass="#cfe0e6" frame="#f4efe2" cols={3} rows={4} />
        <path d={`M ${x - 50} 130 Q ${x + 10} 380 ${x - 30} 660 L ${x - 80} 660 L ${x - 80} 130 Z`} fill="#3f5e48" stroke={L} strokeWidth={3} />
        <path d={`M ${x + 290} 130 Q ${x + 230} 380 ${x + 270} 660 L ${x + 320} 660 L ${x + 320} 130 Z`} fill="#3f5e48" stroke={L} strokeWidth={3} />
        <path d={`M ${x - 70} 120 Q ${x + 120} 200 ${x + 310} 120 L ${x + 310} 100 L ${x - 70} 100 Z`} fill="#4b6e54" stroke={L} strokeWidth={3} />
      </g>
    ))}
    {/* fireplace + portrait */}
    <g stroke={L} strokeWidth={lw}>
      <rect x={810} y={470} width={300} height={22} fill="#f4efe2" />
      <rect x={830} y={492} width={260} height={370} fill="#f1ead8" />
      <rect x={880} y={560} width={160} height={300} fill="#1f1712" />
      <path d="M 900 860 Q 960 760 1020 860 Z" fill="#c4572a" stroke="none" opacity={0.8} />
      <rect x={850} y={190} width={220} height={250} fill="#9c7a3e" />
      <rect x={870} y={210} width={180} height={210} fill="#6e7c86" />
      <path d="M 870 420 Q 960 300 1050 420 Z" fill="#46524a" stroke="none" />
    </g>
    <rect y={860} width={1920} height={220} fill="#7a5436" />
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} y1={880 + i * 36} x2={1920} y2={880 + i * 36} stroke="#674530" strokeWidth={3} />)}
    <ellipse cx={960} cy={1000} rx={780} ry={80} fill="#7a2f2a" stroke={L} strokeWidth={3} />
    <ellipse cx={960} cy={1000} rx={680} ry={60} fill="none" stroke="#c9a14a" strokeWidth={8} />
    <path d="M 390 380 L 1530 380 L 1700 1080 L 220 1080 Z" fill="#fff6dc" opacity={0.06} />
    <Paint vig={0.38} />
  </g>
);

/** Cabinet members seen from behind (Hamilton slim + queue, Knox broad), foreground. */
export const CabinetBacks: React.FC = () => {
  const f = useCurrentFrame();
  const back = (x: number, w: number, coat: string, hair: string, k: string) => (
    <g key={k} transform={`translate(${x} ${Math.sin(f / 23 + x) * 2})`}>
      <path d={`M ${-w} 1080 L ${-w} 860 Q ${-w + 10} 790 -50 780 L 50 780 Q ${w - 10} 790 ${w} 860 L ${w} 1080 Z`} fill={coat} stroke={L} strokeWidth={lw} />
      <ellipse cx={0} cy={710} rx={70} ry={80} fill={hair} stroke={L} strokeWidth={lw} />
      <path d="M 0 770 L -12 830 L 12 830 Z" fill="#1d1a18" />
      <path d="M -60 700 Q -70 660 -40 640" stroke="#fff" strokeWidth={5} fill="none" opacity={0.3} />
    </g>
  );
  return <g>{back(760, 150, "#2b3550", "#d9d3c4", "h")}{back(1640, 230, "#5a3e28", "#d0cabc", "k")}</g>;
};

/** Small writing table (foreground) carrying a desk plate whose text swaps on a beat. */
export const NamePlateDesk: React.FC<{ x: number; a: string; b: string; at: number }> = ({ x, a, b, at }) => {
  const f = useCurrentFrame();
  const flip = interpolate(f - at, [0, 3], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t = f < at + 2 ? a : b;
  const sy = f < at ? 1 : f < at + 2 ? flip : interpolate(f - at - 2, [0, 3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g stroke={L} strokeWidth={lw}>
      <rect x={x - 330} y={830} width={660} height={44} fill="#7a4626" />
      <rect x={x - 300} y={874} width={600} height={210} fill="#5a3219" />
      <rect x={x - 250} y={900} width={200} height={140} fill="#4a2814" /><rect x={x + 50} y={900} width={200} height={140} fill="#4a2814" />
      <g transform={`translate(${x} 830) scale(1 ${Math.max(0.05, sy)})`}>
        <path d="M -230 0 L -210 -86 L 210 -86 L 230 0 Z" fill="#c9a14a" />
        <text x={0} y={-26} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={t.length > 14 ? 38 : 46} fill="#2b2119" stroke="none">{t}</text>
      </g>
    </g>
  );
};

// =========================================================================== 6/8. Congress Hall, Senate chamber, Philadelphia
/** Senate chamber upstairs in Congress Hall: green walls, red swag drapes, eagle ceiling, dais with red chair. */
export const CongressHallSenate: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#2f6a58" />
    <path d="M 0 0 L 1920 0 L 1920 120 L 0 120 Z" fill="#f2ecd9" />
    <path d="M 0 120 L 1920 120 L 1920 150 L 0 150 Z" fill="#e2d9bf" stroke={L} strokeWidth={3} />
    <g transform="translate(960 58)" stroke={L} strokeWidth={3}>
      <path d="M -120 0 Q -60 -40 -20 -8 L 0 -30 L 20 -8 Q 60 -40 120 0 Q 60 10 20 8 L 0 40 L -20 8 Q -60 10 -120 0 Z" fill="#8a6a2a" />
      <circle cx={0} cy={0} r={14} fill="#c9a14a" />
    </g>
    {/* tall windows with red swags and green blinds */}
    {[90, 600, 1120, 1630].map((x, i) => (
      <g key={i}>
        <rect x={x} y={190} width={200} height={460} fill="#cfe3d6" stroke="#f4efe2" strokeWidth={12} />
        {Array.from({ length: 13 }, (_, j) => <line key={j} x1={x} y1={200 + j * 34} x2={x + 200} y2={200 + j * 34} stroke="#2f5a48" strokeWidth={8} opacity={0.75} />)}
        <path d={`M ${x - 30} 170 Q ${x + 100} 260 ${x + 230} 170 L ${x + 230} 150 L ${x - 30} 150 Z`} fill="#b52a25" stroke={L} strokeWidth={3} />
        <path d={`M ${x - 30} 170 Q ${x - 10} 300 ${x - 20} 420 L ${x - 50} 420 L ${x - 50} 160 Z`} fill="#9c2420" stroke={L} strokeWidth={3} />
        <path d={`M ${x + 230} 170 Q ${x + 210} 300 ${x + 220} 420 L ${x + 250} 420 L ${x + 250} 160 Z`} fill="#9c2420" stroke={L} strokeWidth={3} />
      </g>
    ))}
    <rect y={660} width={1920} height={16} fill="#f4efe2" /><rect y={676} width={1920} height={90} fill="#2a5e4e" />
    {/* presiding chair on the dais (between the centre windows) */}
    <g stroke={L} strokeWidth={lw}>
      <path d="M 880 640 L 880 360 Q 960 300 1040 360 L 1040 640 Z" fill="#9c2a22" />
      <path d="M 900 600 L 900 380 Q 960 335 1020 380 L 1020 600 Z" fill="#b8362f" stroke="none" />
      <rect x={740} y={640} width={440} height={60} fill="#e6dec8" />
    </g>
    {/* carpet + desks in arcs */}
    <rect y={760} width={1920} height={320} fill="#b5512e" />
    {Array.from({ length: 18 }, (_, i) => <path key={i} d={`M ${i * 120 - 60} 1080 L ${i * 120} 960 L ${i * 120 + 60} 1080 M ${i * 120} 960 L ${i * 120 + 60} 860 L ${i * 120 + 120} 960`} stroke="#7a2e1a" strokeWidth={6} fill="none" />)}
    <rect y={760} width={1920} height={16} fill="#5a2a18" opacity={0.5} />
    {[[200, 800], [460, 790], [1460, 790], [1720, 800]].map(([x, y], i) => (
      <g key={i} stroke={L} strokeWidth={3}>
        <rect x={x - 90} y={y} width={180} height={18} fill="#6b3418" /><rect x={x - 80} y={y + 18} width={160} height={70} fill="#5a2a14" />
        <path d={`M ${x - 40} ${y - 50} L ${x + 40} ${y - 50} L ${x + 44} ${y + 10} L ${x - 44} ${y + 10} Z`} fill="#a3262a" />
      </g>
    ))}
    <Paint vig={0.42} />
  </g>
);

/** The dais' white panelled front desk (foreground of the presiding officer). */
export const SenateDais: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    <rect x={700} y={690} width={520} height={30} fill="#6b3418" />
    <rect x={720} y={720} width={480} height={170} fill="#efe8d6" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={740 + i * 116} y={740} width={96} height={130} fill="none" stroke="#cfc6ae" strokeWidth={4} />)}
    <rect x={680} y={890} width={560} height={30} fill="#d8cfb6" />
    <rect x={780} y={672} width={70} height={20} fill="#3d2414" /><rect x={1080} y={668} width={30} height={26} fill="#1d1d2b" />
  </g>
);

/** Senators' red leather chairs and desks (foreground). */
export const SenateChairsFG: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    {[[150, 0], [520, 30], [1400, 30], [1770, 0]].map(([x, d], i) => (
      <g key={i}>
        <rect x={x - 170} y={930 + d} width={340} height={26} fill="#6b3418" />
        <rect x={x - 150} y={956 + d} width={300} height={140} fill="#5a2a14" />
        <path d={`M ${x - 90} ${1080} L ${x - 100} ${860 + d} Q ${x} ${820 + d} ${x + 100} ${860 + d} L ${x + 90} 1080 Z`} fill="#a3262a" />
        {Array.from({ length: 6 }, (_, j) => <circle key={j} cx={x - 80 + j * 32} cy={872 + d - Math.sin((j / 5) * Math.PI) * 12} r={5} fill="#c9a14a" stroke="none" />)}
      </g>
    ))}
  </g>
);

// =========================================================================== 7. Mount Vernon, 1797
export const MountVernon: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <Sky id="p1-skymv" c={["#79acd6", "#c8dce6", "#eef0e2"]} />
      <Cloud x={300 + f * 0.1} y={110} s={1.0} /><Cloud x={1450 + f * 0.07} y={150} s={0.9} />
      {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={i * 180} cy={520} rx={140} ry={100} fill={i % 2 ? "#4b7442" : "#567f4b"} />)}
      {/* red roof, dormers, central pediment, cupola */}
      <path d="M 230 330 L 330 230 L 1590 230 L 1690 330 Z" fill="#a8452f" stroke={L} strokeWidth={lw} />
      {[520, 760, 1160, 1400].map((x, i) => <g key={i} stroke={L} strokeWidth={3}><path d={`M ${x} 300 L ${x} 262 L ${x + 30} 240 L ${x + 60} 262 L ${x + 60} 300 Z`} fill="#efe9da" /><rect x={x + 16} y={266} width={28} height={30} fill="#3c4a5c" /></g>)}
      <g stroke={L} strokeWidth={lw}>
        <rect x={900} y={150} width={120} height={90} fill="#efe9da" />
        <path d="M 890 155 Q 960 70 1030 155 Z" fill="#7a8a6a" />
        <line x1={960} y1={95} x2={960} y2={50} strokeWidth={5} />
        <path d="M 940 52 L 980 46 L 972 56 Z" fill="#5a6a4a" strokeWidth={2} />
      </g>
      {/* house body (rusticated white boards) */}
      <rect x={230} y={330} width={1460} height={380} fill="#f1ece0" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={230} y1={360 + i * 30} x2={1690} y2={360 + i * 30} stroke="#dcd5c4" strokeWidth={3} />)}
      {Array.from({ length: 9 }, (_, i) => [370, 560].map((y, j) => <rect key={`${i}${j}`} x={300 + i * 160} y={y} width={60} height={96} fill="#3c4a5c" stroke="#fff" strokeWidth={4} />))}
      {/* the piazza: eight tall square columns */}
      {Array.from({ length: 8 }, (_, i) => { const x = 270 + i * 197; return <g key={i} stroke={L} strokeWidth={3}><rect x={x - 22} y={330} width={44} height={390} fill="#fbf8f0" /><rect x={x - 30} y={330} width={60} height={20} fill="#efe9da" /><rect x={x + 8} y={350} width={14} height={370} fill="#cfc8b6" stroke="none" /></g>; })}
      <rect x={210} y={710} width={1500} height={30} fill="#c9b99a" stroke={L} strokeWidth={3} />
      {Array.from({ length: 20 }, (_, i) => <line key={i} x1={210 + i * 75} y1={710} x2={210 + i * 75} y2={740} stroke="#a8977a" strokeWidth={3} />)}
      {/* lawn */}
      <rect y={740} width={1920} height={340} fill="#6e9a4e" />
      <path d="M 0 860 Q 960 800 1920 870" stroke="#5f8a42" strokeWidth={10} fill="none" />
      <Tree x={90} y={820} s={1.3} /><Tree x={1830} y={830} s={1.2} c={["#46753a", "#5a8a46", "#386028"]} />
      <Paint vig={0.3} />
    </g>
  );
};

// =========================================================================== 7b. newspaper insert
/** "Gazette of the United States" (Philadelphia) spinning in onto a desk; masthead, headline, engraving. */
export const GazetteInsert: React.FC<{ at?: number; head: string; headline: [string, string]; date: string }> = ({ at = 0, head, headline, date }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - at, [0, 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <g>
      <rect width={1920} height={1080} fill="#4a2e1a" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M 0 ${40 + i * 78} Q 960 ${70 + i * 78} 1920 ${30 + i * 78}`} stroke="#3e2614" strokeWidth={6} fill="none" />)}
      <g transform={`translate(960 540) rotate(${-4 - (1 - p) * 360}) scale(${0.15 + 0.85 * p})`}>
        <rect x={-560} y={-440} width={1120} height={880} fill="#000" opacity={0.35} transform="translate(20 24)" />
        <rect x={-560} y={-440} width={1120} height={880} fill="#efe4c6" stroke={L} strokeWidth={5} />
        <text x={0} y={-350} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontWeight={700} fontSize={60} fill="#1d1712">GAZETTE OF THE UNITED STATES</text>
        <line x1={-520} y1={-320} x2={520} y2={-320} stroke="#1d1712" strokeWidth={4} /><line x1={-520} y1={-300} x2={520} y2={-300} stroke="#1d1712" strokeWidth={2} />
        <text x={0} y={-270} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontSize={28} fill="#3a2e22">{date}</text>
        <text x={0} y={-170} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={96} fill="#1d1712">{headline[0]}</text>
        <text x={0} y={-70} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={96} fill="#1d1712">{headline[1]}</text>
        <ellipse cx={-280} cy={170} rx={170} ry={200} fill="#d8c7a0" stroke="#1d1712" strokeWidth={5} />
        <g style={{ filter: "grayscale(1) sepia(0.6) contrast(1.2)" }}>
          <SImg href={staticFile(`tg2/${head}.png`)} x={-430} y={20} width={300} height={300} preserveAspectRatio="xMidYMid meet" />
        </g>
        {Array.from({ length: 11 }, (_, i) => <rect key={i} x={-60} y={10 + i * 34} width={i % 4 === 3 ? 380 : 560} height={12} fill="#7a6a54" opacity={0.55} />)}
      </g>
      <Paint vig={0.5} />
    </g>
  );
};

// =========================================================================== 12-14, 18. Washington City 1800: the Capitol's north wing alone
/** "Washington 1800": only the north wing stands; empty foundations, scaffold, stone piles, muddy road, a cow. */
export const Capitol1800: React.FC<{ grey?: number }> = ({ grey = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <Sky id="p1-sky1800" c={["#8fa9c2", "#c9d3d0", "#e9e2cc"]} />
      <Cloud x={200 + f * 0.1} y={120} s={1.2} c="#f1efe6" o={0.85} /><Cloud x={900 + f * 0.06} y={80} s={0.8} c="#eae6da" o={0.7} /><Cloud x={1500 + f * 0.09} y={140} s={1} c="#f1efe6" o={0.8} />
      <path d="M 0 620 Q 400 540 800 600 Q 1300 520 1920 590 L 1920 1080 L 0 1080 Z" fill="#8ea06e" />
      {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={i * 130} cy={600 - Math.sin(i) * 20} rx={90} ry={50} fill={i % 2 ? "#6c8456" : "#7a9260"} />)}
      {/* north wing */}
      <g stroke={L} strokeWidth={lw}>
        <rect x={1010} y={330} width={720} height={380} fill="#e9e2cf" />
        <rect x={990} y={310} width={760} height={30} fill="#ded6c0" />
        {Array.from({ length: 26 }, (_, i) => <rect key={i} x={1000 + i * 29} y={286} width={12} height={26} fill="#ded6c0" strokeWidth={2} />)}
        <rect x={1010} y={560} width={720} height={150} fill="#ddd4bd" />
        {Array.from({ length: 5 }, (_, i) => <line key={i} x1={1010} y1={590 + i * 26} x2={1730} y2={590 + i * 26} stroke="#c8bea4" strokeWidth={2} />)}
      </g>
      {Array.from({ length: 7 }, (_, i) => <Sash key={i} x={1050 + i * 100} y={370} w={52} h={140} arch glass="#4a5a6c" frame="#f4efe2" cols={2} rows={3} />)}
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={1056 + i * 100} y={600} width={40} height={70} fill="#4a5a6c" stroke="#f4efe2" strokeWidth={4} />)}
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={1030 + i * 100} y={340} width={14} height={220} fill="#f1ead8" stroke={L} strokeWidth={2} />)}
      <rect x={1460} y={330} width={270} height={380} fill="#5a4a3a" opacity={0.1} />
      {/* empty centre: foundation walls, scaffold, stones, shed */}
      <g stroke={L} strokeWidth={3}>
        <path d="M 330 700 L 340 640 L 520 650 L 600 610 L 760 625 L 880 600 L 1010 620 L 1010 710 L 330 710 Z" fill="#c9bfa6" />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={360 + i * 70} y1={650} x2={360 + i * 70} y2={710} stroke="#a89a80" strokeWidth={2} />)}
        {[600, 700, 800, 900].map((x, i) => <line key={i} x1={x} y1={430} x2={x} y2={640} stroke="#7a5a3a" strokeWidth={8} />)}
        {[470, 540].map((y, i) => <line key={i} x1={580} y1={y} x2={920} y2={y} stroke="#7a5a3a" strokeWidth={8} />)}
        <line x1={600} y1={640} x2={900} y2={430} stroke="#7a5a3a" strokeWidth={6} />
        <path d="M 120 720 L 120 600 L 200 560 L 280 600 L 280 720 Z" fill="#7a5a3e" />
        <rect x={180} y={640} width={40} height={80} fill="#3a2a1e" />
        {[[420, 760], [480, 770], [450, 735], [760, 770], [820, 775]].map(([x, y], i) => <rect key={i} x={x} y={y} width={70} height={40} fill="#d8cfb6" />)}
      </g>
      {/* muddy road */}
      <path d="M 0 840 Q 960 760 1920 850 L 1920 1080 L 0 1080 Z" fill="#8a6a48" />
      {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={rnd(i + 4) * 1920} cy={900 + rnd(i + 30) * 150} rx={60 + rnd(i) * 60} ry={10} fill="#6e5236" />)}
      <path d="M 0 800 Q 960 720 1920 810" stroke="#7a9260" strokeWidth={30} fill="none" />
      {/* stumps + a cow */}
      {[[260, 830], [1600, 820]].map(([x, y], i) => <g key={i} stroke={L} strokeWidth={3}><rect x={x} y={y - 30} width={44} height={34} fill="#7a5a3a" /><ellipse cx={x + 22} cy={y - 30} rx={22} ry={8} fill="#c9a77a" /></g>)}
      <g transform="translate(1810 770) scale(0.8)" stroke={L} strokeWidth={4}>
        <ellipse cx={0} cy={0} rx={80} ry={44} fill="#f2ece0" /><ellipse cx={-20} cy={-6} rx={26} ry={18} fill="#4a3a2a" stroke="none" />
        <ellipse cx={-92} cy={-18} rx={28} ry={22} fill="#f2ece0" />
        {[-50, -20, 30, 60].map((x) => <line key={x} x1={x} y1={30} x2={x} y2={80} strokeWidth={8} />)}
      </g>
      {grey > 0 && <rect width={1920} height={1080} fill="#5a5e66" opacity={grey} style={{ mixBlendMode: "color" }} />}
      <Paint vig={0.32} />
    </g>
  );
};

// =========================================================================== 13a. the unfinished East Room, Nov 1800
/** The unplastered East Room where Abigail Adams hung the laundry: bare walls, brick patches, ladder, washing lines. */
export const EastRoom1800: React.FC = () => {
  const f = useCurrentFrame();
  const sway = (i: number) => Math.sin(f / 30 + i) * 3;
  return (
    <g>
      <rect width={1920} height={1080} fill="#d6ccb4" />
      <rect width={1920} height={60} fill="#b9ad92" />
      {[[120, 300, 220, 160], [1500, 520, 260, 140], [700, 120, 180, 90]].map(([x, y, w, h], i) => (
        <g key={i}><path d={`M ${x} ${y} q ${w / 3} -20 ${w} 10 l -10 ${h} q -${w / 2} 20 -${w} -6 Z`} fill="#a85c3e" />
          {Array.from({ length: 4 }, (_, j) => <line key={j} x1={x + 4} y1={y + 20 + j * (h / 4)} x2={x + w - 10} y2={y + 26 + j * (h / 4)} stroke="#d8cbb0" strokeWidth={3} />)}</g>
      ))}
      {[520, 1180].map((x, i) => (
        <g key={i}>
          <Sash x={x} y={170} w={220} h={520} arch glass="#d9e6ea" frame="#efe6d2" cols={3} rows={5} />
          <path d={`M ${x} 690 L ${x + 220} 690 L ${x + 420} 1080 L ${x - 160} 1080 Z`} fill="#fff8e0" opacity={0.18} />
        </g>
      ))}
      <rect y={820} width={1920} height={260} fill="#a4825a" />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} y1={840 + i * 32} x2={1920} y2={840 + i * 32} stroke="#8a6a44" strokeWidth={3} />)}
      {/* ladder + plaster bucket */}
      <g stroke={L} strokeWidth={4}>
        <line x1={1640} y1={880} x2={1720} y2={300} strokeWidth={10} /><line x1={1760} y1={880} x2={1800} y2={300} strokeWidth={10} />
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1={1648 + i * 10} y1={820 - i * 70} x2={1762 + i * 5} y2={820 - i * 70} strokeWidth={8} />)}
        <path d="M 260 900 L 280 820 L 380 820 L 400 900 Z" fill="#8a8a84" /><ellipse cx={330} cy={820} rx={50} ry={10} fill="#efeae0" />
      </g>
      {/* washing lines with the President's laundry */}
      {[[150, 1770, 170], [80, 1840, 280]].map(([a, b, y], k) => (
        <g key={k}>
          <path d={`M ${a} ${y} Q 960 ${y + 70} ${b} ${y}`} stroke="#5a4a3a" strokeWidth={3} fill="none" />
          {Array.from({ length: 7 }, (_, i) => {
            const x = a + 160 + i * ((b - a - 320) / 6) + k * 60;
            const t = (x - a) / (b - a); const yy = y + 4 * 70 * t * (1 - t) * 0.5 + 4;
            const kind = (i + k) % 3;
            return (
              <g key={i} transform={`translate(${x} ${yy}) rotate(${sway(i + k * 7)})`} stroke={L} strokeWidth={3}>
                {kind === 0 && <path d="M -60 0 L 60 0 L 66 120 L -54 128 Z" fill="#f4f1ea" />}
                {kind === 1 && <path d="M -50 0 L 50 0 L 70 30 L 50 40 L 44 110 L -44 110 L -50 40 L -70 30 Z" fill="#e8e2d2" />}
                {kind === 2 && <path d="M -16 0 L 4 0 L 6 80 L 24 96 L -6 100 L -14 80 Z" fill="#d8d0c0" />}
                <line x1={-20} y1={-4} x2={-20} y2={10} strokeWidth={6} /><line x1={20} y1={-4} x2={20} y2={10} strokeWidth={6} />
              </g>
            );
          })}
        </g>
      ))}
      <Paint vig={0.4} />
    </g>
  );
};

// =========================================================================== 15. an elector's ballot, 1800 (insert)
/** Desk insert: the elector writes two names, with no line saying which is for president. */
export const BallotInsert: React.FC<{ at1: number; at2: number; ask: number }> = ({ at1, at2, ask }) => {
  const f = useCurrentFrame();
  const write = (s: string, at: number) => s.slice(0, Math.max(0, Math.floor((f - at) * 0.9)));
  const q = (x: number, y: number, d: number) => {
    const p = interpolate(f - ask - d, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
    return <text x={x} y={y} fontFamily={MONTSERRAT} fontWeight={800} fontSize={130} fill="#e02b2b" stroke={INK} strokeWidth={6} paintOrder="stroke" textAnchor="middle" transform={`translate(${x} ${y}) scale(${p}) translate(${-x} ${-y})`}>?</text>;
  };
  return (
    <g>
      <rect width={1920} height={1080} fill="#5a3a22" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M 0 ${40 + i * 78} Q 960 ${70 + i * 78} 1920 ${30 + i * 78}`} stroke="#4a2e1a" strokeWidth={6} fill="none" />)}
      <ellipse cx={1660} cy={240} rx={360} ry={300} fill="#ffd27a" opacity={0.12} />
      <g stroke={L} strokeWidth={4}>
        <rect x={1600} y={180} width={40} height={140} fill="#efe6cf" /><ellipse cx={1620} cy={320} rx={80} ry={18} fill="#a8812f" />
        <path d="M 1450 700 Q 1420 780 1480 800 L 1560 800 Q 1620 780 1590 700 Z" fill="#1d1d2b" />
        <path d="M 1530 700 Q 1600 520 1760 380 Q 1680 560 1546 704 Z" fill="#f4f1ea" />
      </g>
      <path d="M 1620 178 Q 1606 150 1620 120 Q 1634 150 1620 178 Z" fill="#ffe28a" />
      <g transform="rotate(-3 860 540)">
        <rect x={300} y={160} width={1120} height={760} fill="#000" opacity={0.3} transform="translate(16 20)" />
        <rect x={300} y={160} width={1120} height={760} fill="#efe6c8" stroke={L} strokeWidth={5} />
        <text x={860} y={270} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontWeight={700} fontSize={56} fill="#2b2119">ELECTORAL VOTES · 1800</text>
        <line x1={380} y1={300} x2={1340} y2={300} stroke="#7a6a4a" strokeWidth={3} />
        <text x={380} y={480} fontFamily="DejaVu Serif, serif" fontStyle="italic" fontSize={86} fill="#1d1712">{write("Thomas Jefferson", at1)}</text>
        <text x={380} y={720} fontFamily="DejaVu Serif, serif" fontStyle="italic" fontSize={86} fill="#1d1712">{write("Aaron Burr", at2)}</text>
        <line x1={380} y1={510} x2={1340} y2={510} stroke="#b8a888" strokeWidth={3} /><line x1={380} y1={750} x2={1340} y2={750} stroke="#b8a888" strokeWidth={3} />
        {f >= ask && <>{q(1230, 490, 0)}{q(1230, 730, 4)}</>}
      </g>
      <Paint vig={0.5} />
    </g>
  );
};

// =========================================================================== 16-17. House of Representatives, north wing, Feb 1801
/** Temporary House room in the north wing during the February 1801 snowstorm: candles, snow at the windows. */
export const HouseRoom1801: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect width={1920} height={1080} fill="#cdbf9f" />
      <rect width={1920} height={80} fill="#e4dac2" stroke={L} strokeWidth={3} />
      {[150, 640, 1150, 1600].map((x, i) => (
        <g key={i}>
          <Sash x={x} y={180} w={190} h={430} arch glass="#8a98ac" frame="#efe6d2" cols={3} rows={5} />
          {Array.from({ length: 10 }, (_, j) => { const sy = (f * (2 + (j % 3)) + j * 53) % 380; return <circle key={j} cx={x + 20 + ((j * 37 + Math.sin(f / 9 + j) * 10) % 150)} cy={240 + sy} r={4} fill="#fff" opacity={0.9} />; })}
        </g>
      ))}
      {/* Speaker's raised desk */}
      <g stroke={L} strokeWidth={lw}>
        <rect x={850} y={300} width={220} height={250} fill="#6b3418" />
        <path d="M 860 300 Q 960 230 1060 300 Z" fill="#7a3d1c" />
        <rect x={760} y={540} width={400} height={30} fill="#7a4626" /><rect x={780} y={570} width={360} height={190} fill="#5a3219" />
        <rect x={700} y={760} width={520} height={40} fill="#4a2814" />
      </g>
      {/* candle chandelier */}
      <line x1={960} y1={0} x2={960} y2={140} stroke={L} strokeWidth={4} />
      <path d="M 860 150 Q 960 200 1060 150" stroke="#8a6a2a" strokeWidth={8} fill="none" />
      {[860, 910, 960, 1010, 1060].map((x, i) => <g key={i}><rect x={x - 6} y={120 + (i === 2 ? 40 : Math.abs(i - 2) * 10)} width={12} height={30} fill="#efe6cf" /><path d={`M ${x} ${118 + (i === 2 ? 40 : Math.abs(i - 2) * 10)} q -8 -14 0 -26 q 8 12 0 26 Z`} fill="#ffe28a" /></g>)}
      <ellipse cx={960} cy={200} rx={420} ry={260} fill="#ffd27a" opacity={0.12} />
      <rect y={800} width={1920} height={280} fill="#7a5436" />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} y1={820 + i * 40} x2={1920} y2={820 + i * 40} stroke="#674530" strokeWidth={3} />)}
      <Paint vig={0.45} />
    </g>
  );
};

/** Chalk tally slate on an easel: "BALLOT No. n", then the winner's name. */
export const TallySlate: React.FC<{ x: number; y: number; n: number; result?: string }> = ({ x, y, n, result }) => (
  <g transform={`translate(${x} ${y})`} stroke={L} strokeWidth={lw}>
    <line x1={-150} y1={360} x2={-90} y2={-10} strokeWidth={14} /><line x1={150} y1={360} x2={90} y2={-10} strokeWidth={14} />
    <rect x={-220} y={-200} width={440} height={330} fill="#7a4e2a" />
    <rect x={-200} y={-180} width={400} height={290} fill="#26302c" />
    <text x={0} y={-110} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={46} fill="#e9eee6" stroke="none">BALLOT No.</text>
    <text x={0} y={30} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={result ? 62 : 140} fill={result ? "#ffe08a" : "#e9eee6"} stroke="none">{result ?? n}</text>
    {result && <text x={0} y={92} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={38} fill="#e9eee6" stroke="none">ON BALLOT 36</text>}
  </g>
);

/** Seated members from behind (two rows), foreground. */
export const MembersFG: React.FC = () => (
  <g>
    <CrowdBack y={900} n={9} s={0.75} era="1801" seed={4} />
    <g stroke={L} strokeWidth={lw}><rect x={-20} y={940} width={1960} height={30} fill="#6b3418" /></g>
    <CrowdBack y={1050} n={6} s={1.05} era="1801" seed={9} />
  </g>
);

/** A grand empty armchair that can slide away (Burr's "almost"). */
export const BigChair: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={7}>
    <path d="M -110 0 L -100 -470 Q 0 -560 100 -470 L 110 0 Z" fill="#7a1f22" />
    <path d="M -80 -260 L -78 -450 Q 0 -515 78 -450 L 80 -260 Z" fill="#a3262a" strokeWidth={4} />
    <rect x={-150} y={-260} width={300} height={90} rx={18} fill="#a3262a" />
    <rect x={-170} y={-300} width={44} height={150} rx={14} fill="#6b3418" /><rect x={126} y={-300} width={44} height={150} rx={14} fill="#6b3418" />
    <line x1={-130} y1={-170} x2={-130} y2={0} strokeWidth={14} /><line x1={130} y1={-170} x2={130} y2={0} strokeWidth={14} />
    <circle cx={0} cy={-500} r={20} fill="#c9a14a" />
  </g>
);

// =========================================================================== 18b. Jefferson's cabinet in the President's House, 1803
export const JeffersonCabinet: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#8a9a7e" />
    <rect width={1920} height={60} fill="#efe6d2" />
    <rect y={660} width={1920} height={16} fill="#efe6d2" /><rect y={676} width={1920} height={200} fill="#6e7c62" />
    {/* wall maps */}
    {[[160, 160, 380, 270], [1380, 140, 360, 300]].map(([x, y, w, h], i) => (
      <g key={i} stroke={L} strokeWidth={lw}>
        <rect x={x} y={y} width={w} height={h} fill="#e6d9b4" />
        <path d={`M ${x + 30} ${y + 60} Q ${x + w / 2} ${y + 20} ${x + w - 40} ${y + 80} L ${x + w - 60} ${y + h - 40} Q ${x + w / 2} ${y + h} ${x + 40} ${y + h - 60} Z`} fill="#c9b98a" strokeWidth={2} />
        <path d={`M ${x + w * 0.45} ${y + 40} Q ${x + w * 0.5} ${y + h / 2} ${x + w * 0.48} ${y + h - 30}`} stroke="#3d7fb3" strokeWidth={4} fill="none" />
        <line x1={x + w / 2} y1={y - 30} x2={x + w / 2} y2={y} />
      </g>
    ))}
    {/* window with geraniums + mockingbird cage */}
    <Sash x={780} y={150} w={340} h={460} glass="#d9e6ea" frame="#f4efe2" cols={3} rows={4} />
    {[820, 900, 980, 1060].map((x, i) => <g key={i}><rect x={x} y={570} width={44} height={40} fill="#b0583a" stroke={L} strokeWidth={3} /><circle cx={x + 22} cy={556} r={22} fill="#3e6a30" /><circle cx={x + 14} cy={546} r={9} fill="#d8343a" /><circle cx={x + 30} cy={552} r={8} fill="#d8343a" /></g>)}
    <g transform="translate(1250 300)" stroke={L} strokeWidth={3}>
      <line x1={0} y1={-120} x2={0} y2={-80} />
      <path d="M -60 60 L -60 -40 Q 0 -100 60 -40 L 60 60 Z" fill="none" strokeWidth={4} />
      {[-40, -20, 0, 20, 40].map((x) => <line key={x} x1={x} y1={-60 + Math.abs(x) * 0.4} x2={x} y2={60} stroke="#8a6a2a" />)}
      <ellipse cx={0} cy={60} rx={66} ry={10} fill="#8a6a2a" />
      <ellipse cx={0} cy={10} rx={18} ry={12} fill="#8d8d88" /><circle cx={14} cy={0} r={8} fill="#8d8d88" /><path d="M -18 10 L -40 20 L -20 16 Z" fill="#555" />
    </g>
    {/* globe */}
    <circle cx={1650} cy={640} r={90} fill="#7f9db8" stroke={L} strokeWidth={lw} /><path d="M 1600 610 Q 1640 570 1690 610 Q 1660 670 1610 650 Z" fill="#c9b98a" />
    <line x1={1650} y1={730} x2={1650} y2={880} stroke={L} strokeWidth={10} />
    <rect y={876} width={1920} height={204} fill="#6b4529" />
    <path d="M 780 610 L 1120 610 L 1360 1080 L 560 1080 Z" fill="#fff8de" opacity={0.08} />
    <Paint vig={0.42} />
  </g>
);

// =========================================================================== 18c. the Louisiana Purchase map
const LP: [number, number][] = [[-89.6, 29.2], [-90.2, 30.0], [-91.2, 31.0], [-91.1, 32.3], [-91.2, 33.4], [-90.2, 35.1], [-89.5, 36.5], [-90.2, 38.6], [-91.4, 40.4], [-91.1, 42.5], [-91.2, 43.5], [-92.9, 44.9], [-94.0, 46.5], [-95.2, 47.2], [-95.2, 49], [-113.5, 49], [-112.5, 47.0], [-110.5, 44.5], [-107.0, 42.5], [-106.0, 39.5], [-105.0, 38.0], [-103.0, 37.0], [-100.0, 36.5], [-100.0, 34.6], [-94.5, 33.6], [-94.0, 31.9], [-93.8, 29.7]];
const lpPath = LP.map(([lo, la], i) => `${i ? "L" : "M"} ${mapXY(lo, la).join(" ")}`).join(" ") + " Z";
export const LP_CENTER = mapXY(-99, 42) as [number, number];
/** US map with the 1803 purchase cross-fading in green (doubling the country) + New Orleans pin. */
export const LouisianaMap: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - at, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const no = mapXY(-90.07, 29.95);
  const usa = mapXY(-83, 37.5);
  return (
    <g>
      <USMap />
      <path d={lpPath} fill="#6f9e4a" opacity={0.92 * p} stroke={INK} strokeWidth={5} strokeDasharray="16 10" />
      <path d={`M ${mapXY(-89.4, 30.1).join(" ")} L ${mapXY(-67, 44.8).join(" ")}`} stroke="none" />
      <g opacity={p} fontFamily={MONTSERRAT} fontWeight={800} textAnchor="middle" fill="#fff" stroke={INK} strokeWidth={9} paintOrder="stroke">
        <text x={LP_CENTER[0]} y={LP_CENTER[1]} fontSize={54}>LOUISIANA</text>
        <text x={LP_CENTER[0]} y={LP_CENTER[1] + 60} fontSize={54}>PURCHASE</text>
        <text x={usa[0]} y={usa[1]} fontSize={44}>UNITED STATES</text>
      </g>
      <g transform={`translate(${no.join(" ")})`}><path d="M 0 0 C -30 -36 -30 -76 0 -76 C 30 -76 30 -36 0 0 Z" fill="#e02b2b" stroke={INK} strokeWidth={6} /><circle cy={-50} r={11} fill="#fff" /></g>
    </g>
  );
};

// =========================================================================== 20-21. the Capitol's East Portico, 4 March 1837
/** Bulfinch Capitol, east front: low copper dome, portico with pediment, wing domes, the inaugural steps. */
export const CapitolEast1837: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <Sky id="p1-sky1837" c={["#7cb0d8", "#c6dce8", "#eef0e4"]} />
      <Cloud x={220 + f * 0.1} y={110} s={1} /><Cloud x={1560 + f * 0.08} y={140} s={0.9} />
      <g stroke={L} strokeWidth={lw}>
        {/* central dome (copper-sheathed wood) */}
        <rect x={790} y={230} width={340} height={70} fill="#e9e2cf" />
        <path d="M 760 240 Q 760 70 960 50 Q 1160 70 1160 240 Z" fill="#6f9a86" />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${790 + i * 57} 240 Q ${820 + i * 47} 120 960 54`} fill="none" stroke="#557a68" strokeWidth={3} />)}
        <rect x={930} y={20} width={60} height={40} fill="#e9e2cf" /><path d="M 925 22 Q 960 -6 995 22 Z" fill="#6f9a86" />
        {/* wings with their low domes */}
        {[[120, 620], [1180, 620]].map(([x, w], i) => (
          <g key={i}>
            <path d={`M ${x + w / 2 - 140} 300 Q ${x + w / 2} 210 ${x + w / 2 + 140} 300 Z`} fill="#6f9a86" />
            <rect x={x} y={300} width={w} height={420} fill="#ece6d6" />
            <rect x={x - 10} y={290} width={w + 20} height={20} fill="#ded6c0" />
            {Array.from({ length: 6 }, (_, j) => [340, 530].map((y, k) => <rect key={`${j}${k}`} x={x + 40 + j * 98} y={y} width={50} height={120} fill="#3c4a5c" stroke="#fff" strokeWidth={3} />))}
          </g>
        ))}
        {/* centre block + portico */}
        <rect x={740} y={300} width={440} height={420} fill="#efe9da" />
        <path d="M 700 330 L 960 230 L 1220 330 Z" fill="#f4efe2" />
        <rect x={700} y={326} width={520} height={34} fill="#e6dfcc" />
      </g>
      {[730, 830, 930, 990, 1090, 1190].map((x, i) => <g key={i} stroke={L} strokeWidth={3}><rect x={x - 20} y={360} width={40} height={330} fill="#fbf8f0" /><rect x={x - 26} y={350} width={52} height={14} fill="#f4efe2" /></g>)}
      <rect x={880} y={480} width={160} height={210} fill="#3a342e" stroke={L} strokeWidth={3} />
      {/* steps + platform */}
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={620 - i * 30} y={690 + i * 22} width={680 + i * 60} height={22} fill={i % 2 ? "#ddd6c6" : "#e8e2d4"} stroke="#c2bba9" strokeWidth={2} />)}
      <rect y={866} width={1920} height={214} fill="#a6a27e" />
      {/* flags on the portico */}
      {[690, 1230].map((x, i) => <g key={i}><line x1={x} y1={240} x2={x} y2={60} stroke={L} strokeWidth={5} /><path d={`M ${x} 64 Q ${x + 50} ${54 + Math.sin(f / 8 + i) * 8} ${x + 100} 70 L ${x + 100} 130 Q ${x + 50} ${120 + Math.sin(f / 8 + i) * 8} ${x} 124 Z`} fill="#b8362f" stroke={L} strokeWidth={2} /><rect x={x} y={64} width={40} height={30} fill="#2b3f74" /></g>)}
      <Paint vig={0.3} />
    </g>
  );
};

// =========================================================================== 22-23. Wall Street, May 1837 (bank run)
/** New York, May 1837: Greek-temple bank with "NO SPECIE PAYMENTS" posted, brick shops, a run of depositors. */
export const WallStreet1837: React.FC<{ closedAt?: number; signFallAt?: number; gloom?: number }> = ({ closedAt = 99999, signFallAt = 99999, gloom = 0 }) => {
  const f = useCurrentFrame();
  const slam = interpolate(f - closedAt, [0, 4], [-500, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const fall = interpolate(f - signFallAt, [0, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  return (
    <g>
      <Sky id="p1-sky1837b" c={["#93a8bc", "#cbd2d2", "#e6e0cc"]} />
      <Cloud x={300} y={90} s={1.2} c="#e9e6dc" o={0.8} /><Cloud x={1500} y={130} s={1} c="#e9e6dc" o={0.8} />
      {/* left: brick shops */}
      <g stroke={L} strokeWidth={lw}>
        <rect x={0} y={250} width={560} height={540} fill="#9a4e36" />
        <rect x={-10} y={230} width={580} height={30} fill="#5a3a2a" />
        {[40, 190, 340].map((x, i) => [300, 430].map((y, j) => <rect key={`${i}${j}`} x={x} y={y} width={80} height={100} fill="#3c4a5c" stroke="#e8dcc0" strokeWidth={4} />))}
        <rect x={30} y={600} width={500} height={190} fill="#4a3426" />
        <rect x={60} y={630} width={180} height={160} fill="#2a2420" /><rect x={300} y={630} width={200} height={110} fill="#8fa3b8" />
      </g>
      {/* shop sign (falls when businesses collapse) */}
      <g transform={`translate(280 560) rotate(${fall * 26} -240 0) translate(0 ${fall * 230})`}>
        <rect x={-240} y={-36} width={480} height={72} fill="#e6d29a" stroke={L} strokeWidth={lw} />
        <text x={0} y={18} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontWeight={700} fontSize={46} fill="#2b2119">DRY GOODS</text>
      </g>
      {/* right: the bank (Greek temple) */}
      <g stroke={L} strokeWidth={lw}>
        <path d="M 760 300 L 1300 160 L 1840 300 Z" fill="#ece6d6" />
        <path d="M 840 286 L 1300 180 L 1760 286 Z" fill="none" stroke="#d6cfbd" strokeWidth={4} />
        <rect x={760} y={296} width={1080} height={56} fill="#e2dbc8" />
        <text x={1300} y={340} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontWeight={700} fontSize={40} fill="#5a4a3a" stroke="none" letterSpacing={10}>MECHANICS' BANK</text>
        <rect x={800} y={352} width={1000} height={420} fill="#d8d0bc" />
        <rect x={1180} y={470} width={240} height={300} fill="#2e2a26" />
      </g>
      {[840, 1000, 1160, 1440, 1600, 1760].map((x, i) => <g key={i} stroke={L} strokeWidth={3}><rect x={x - 30} y={352} width={60} height={420} fill="#f6f2e8" /><line x1={x - 10} y1={360} x2={x - 10} y2={770} stroke="#d8d0bc" strokeWidth={4} /><line x1={x + 10} y1={360} x2={x + 10} y2={770} stroke="#d8d0bc" strokeWidth={4} /></g>)}
      {/* the notice */}
      <g transform="rotate(4 1300 560)" stroke={L} strokeWidth={3}>
        <rect x={1205} y={500} width={190} height={130} fill="#f4efdc" />
        <text x={1300} y={548} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontWeight={700} fontSize={28} fill="#2b2119" stroke="none">NO SPECIE</text>
        <text x={1300} y={590} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontWeight={700} fontSize={28} fill="#2b2119" stroke="none">PAYMENTS</text>
      </g>
      {/* boards slammed across the door */}
      {f >= closedAt && <g transform={`translate(0 ${slam})`} stroke={L} strokeWidth={lw}>
        <rect x={1150} y={560} width={300} height={46} fill="#8a6a44" transform="rotate(-14 1300 583)" />
        <rect x={1150} y={560} width={300} height={46} fill="#7a5c3a" transform="rotate(14 1300 583)" />
        <rect x={1180} y={640} width={240} height={80} fill="#b8362f" />
        <text x={1300} y={700} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={54} fill="#fff" stroke="none">CLOSED</text>
      </g>}
      {/* steps + street */}
      {Array.from({ length: 4 }, (_, i) => <rect key={i} x={780 - i * 20} y={770 + i * 22} width={1040 + i * 40} height={22} fill={i % 2 ? "#cfc8b6" : "#ddd6c6"} stroke="#b8b0a0" strokeWidth={2} />)}
      <rect y={858} width={1920} height={222} fill="#8d8270" />
      {Array.from({ length: 30 }, (_, i) => <ellipse key={i} cx={(i * 131) % 1920} cy={880 + ((i * 47) % 190)} rx={30} ry={10} fill="#7a705e" />)}
      <rect x={600} y={0} width={160} height={858} fill="url(#p1-sky1837b)" opacity={0.0} />
      {gloom > 0 && <><rect width={1920} height={1080} fill="#4a4e58" opacity={gloom} style={{ mixBlendMode: "color" }} /><rect width={1920} height={1080} fill="#0a0c14" opacity={gloom * 0.35} /></>}
      <Paint vig={0.4} />
    </g>
  );
};

// =========================================================================== 24-25. the President's office, White House, 1837
/** Second-floor office: warm yellow walls, red drapes onto the south grounds, Jackson's portrait over the mantel. */
export const VBOffice1837: React.FC = () => {
  const head = `vp/andrew_jackson/${HEAD.andrew_jackson[2]}`;
  return (
    <g>
      <rect width={1920} height={1080} fill="#c9a65a" />
      <rect width={1920} height={60} fill="#f1ead8" stroke={L} strokeWidth={3} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={i * 170 + 40} y1={60} x2={i * 170 + 40} y2={680} stroke="#bb984e" strokeWidth={6} />)}
      <rect y={680} width={1920} height={18} fill="#f1ead8" /><rect y={698} width={1920} height={190} fill="#8a5a34" />
      {/* window onto the south grounds */}
      <rect x={130} y={150} width={330} height={500} fill="#cfe1e8" stroke="#f4efe2" strokeWidth={14} />
      <path d="M 130 520 Q 300 470 460 520 L 460 650 L 130 650 Z" fill="#7aa060" />
      <path d="M 140 560 Q 300 530 450 560" stroke="#8ab6d0" strokeWidth={10} fill="none" />
      <line x1={295} y1={150} x2={295} y2={650} stroke="#f4efe2" strokeWidth={8} /><line x1={130} y1={400} x2={460} y2={400} stroke="#f4efe2" strokeWidth={8} />
      <path d="M 90 120 Q 160 400 110 680 L 60 680 L 60 120 Z" fill="#8c2a22" stroke={L} strokeWidth={3} />
      <path d="M 500 120 Q 430 400 480 680 L 530 680 L 530 120 Z" fill="#8c2a22" stroke={L} strokeWidth={3} />
      <path d="M 50 130 Q 295 230 540 130 L 540 100 L 50 100 Z" fill="#a3302a" stroke={L} strokeWidth={3} />
      {/* fireplace + Jackson portrait */}
      <g stroke={L} strokeWidth={lw}>
        <rect x={1320} y={500} width={420} height={24} fill="#f4efe2" />
        <rect x={1340} y={524} width={380} height={360} fill="#efe6d2" />
        <rect x={1420} y={600} width={220} height={284} fill="#1f1712" />
        <path d="M 1450 884 Q 1530 780 1610 884 Z" fill="#c4572a" stroke="none" opacity={0.85} />
        <rect x={1410} y={160} width={240} height={300} fill="#b0883c" />
        <rect x={1432} y={182} width={196} height={256} fill="#5a4a3a" />
        <SImg href={staticFile(`tg2/${head}.png`)} x={1445} y={200} width={170} height={210} preserveAspectRatio="xMidYMid meet" />
        <rect x={1432} y={182} width={196} height={256} fill="#6b4a1f" opacity={0.25} />
        <rect x={1480} y={460} width={100} height={40} rx={8} fill="#8a6a2a" />
      </g>
      <rect y={884} width={1920} height={196} fill="#5a3a24" />
      <ellipse cx={960} cy={1010} rx={760} ry={70} fill="#2f4a6a" stroke={L} strokeWidth={3} />
      <path d="M 460 400 L 760 1080 L 1200 1080 L 470 600 Z" fill="#fff8de" opacity={0.07} />
      <Paint vig={0.42} />
    </g>
  );
};

/** Big mahogany desk (foreground) with an inkstand and a slowly growing paper pile. */
export const VBDesk: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    <rect x={500} y={800} width={920} height={50} fill="#7a3a1c" />
    <rect x={530} y={850} width={860} height={240} fill="#5a2a14" />
    <rect x={570} y={880} width={240} height={180} fill="#4a2010" /><rect x={1110} y={880} width={240} height={180} fill="#4a2010" />
    <rect x={1260} y={770} width={60} height={34} fill="#1d1d2b" />
  </g>
);

// =========================================================================== 26. Lindenwald, Kinderhook, late 1840
/** Van Buren's Kinderhook house as he bought it (Federal brick, before the 1849 Italianate tower): autumn, overcast. */
export const Lindenwald: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <Sky id="p1-skylw" c={["#8d97a6", "#c3c6c2", "#e2dccb"]} />
      <Cloud x={300 + f * 0.1} y={110} s={1.3} c="#dcdad2" o={0.8} /><Cloud x={1400 + f * 0.08} y={90} s={1.1} c="#d6d4cc" o={0.8} />
      {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={i * 180} cy={560} rx={130} ry={90} fill={["#a0622e", "#b88a3a", "#7a5a32"][i % 3]} />)}
      <g stroke={L} strokeWidth={lw}>
        <path d="M 560 310 L 640 210 L 1280 210 L 1360 310 Z" fill="#5a4a44" />
        {[600, 1300].map((x, i) => <rect key={i} x={x - 20} y={150} width={44} height={110} fill="#8a4a32" />)}
        <rect x={560} y={310} width={800} height={430} fill="#a65a3c" />
        {Array.from({ length: 14 }, (_, i) => <line key={i} x1={560} y1={330 + i * 30} x2={1360} y2={330 + i * 30} stroke="#94503a" strokeWidth={2} />)}
      </g>
      {[620, 760, 1080, 1220].map((x, i) => [350, 540].map((y, j) => <Sash key={`${i}${j}`} x={x} y={y} w={76} h={120} glass="#3c4a5c" frame="#f4efe2" cols={2} rows={3} />))}
      <Sash x={920} y={340} w={80} h={120} glass="#3c4a5c" frame="#f4efe2" cols={2} rows={3} />
      <rect x={910} y={560} width={100} height={180} fill="#2e3a2e" stroke="#f4efe2" strokeWidth={8} />
      <path d="M 900 560 A 60 40 0 0 1 1020 560 Z" fill="#8fa3b8" stroke="#f4efe2" strokeWidth={6} />
      <rect y={740} width={1920} height={340} fill="#7f8a52" />
      <path d="M 880 1080 Q 930 860 920 740 L 1000 740 Q 1010 860 1080 1080 Z" fill="#b6a684" />
      {Array.from({ length: 34 }, (_, i) => <rect key={i} x={i * 58} y={860} width={12} height={90} fill="#f1ece0" stroke={L} strokeWidth={2} />)}
      <rect y={880} width={1920} height={10} fill="#f1ece0" /><rect y={920} width={1920} height={10} fill="#f1ece0" />
      {Array.from({ length: 14 }, (_, i) => { const lf = (f * 1.5 + i * 47) % 600; return <ellipse key={i} cx={(i * 141 + Math.sin(lf / 30 + i) * 40) % 1920} cy={lf + 200} rx={9} ry={5} fill={["#c4702e", "#d8a33a", "#9a4a22"][i % 3]} transform={`rotate(${lf} ${(i * 141) % 1920} ${lf + 200})`} />; })}
      <Tree x={120} y={860} s={1.5} c={["#b8702e", "#cf9a3a", "#8a4a22"]} /><Tree x={1800} y={860} s={1.45} c={["#a86a2e", "#c88a36", "#7a4022"]} />
      <Paint vig={0.42} />
    </g>
  );
};

// =========================================================================== 26-27. Log Cabin & Hard Cider rally, 1840
/** Whig rally: log-cabin float, hard-cider barrel, "Tippecanoe and Tyler Too!" banner, the rolling campaign ball. */
export const LogCabinRally: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <Sky id="p1-skyrally" c={["#6fa6d6", "#bcd8e8", "#eef0e2"]} />
      <Cloud x={200 + f * 0.12} y={90} s={1} /><Cloud x={1650 + f * 0.1} y={70} s={0.8} />
      <Tree x={110} y={640} s={1.2} /><Tree x={1830} y={650} s={1.3} />
      {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={i * 180} cy={620} rx={130} ry={60} fill={i % 2 ? "#5d874f" : "#6a9358"} />)}
      {/* the banner */}
      <line x1={180} y1={150} x2={180} y2={640} stroke={L} strokeWidth={10} /><line x1={1740} y1={150} x2={1740} y2={640} stroke={L} strokeWidth={10} />
      <path d={`M 180 170 Q 960 ${200 + Math.sin(f / 14) * 6} 1740 170 L 1740 270 Q 960 ${300 + Math.sin(f / 14) * 6} 180 270 Z`} fill="#f4f1ea" stroke={L} strokeWidth={lw} />
      <path d={`M 180 170 Q 960 ${200 + Math.sin(f / 14) * 6} 1740 170 L 1740 186 Q 960 ${216 + Math.sin(f / 14) * 6} 180 186 Z`} fill="#b8362f" />
      <path d={`M 180 254 Q 960 ${284 + Math.sin(f / 14) * 6} 1740 254 L 1740 270 Q 960 ${300 + Math.sin(f / 14) * 6} 180 270 Z`} fill="#2b3f74" />
      <text x={960} y={262} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontWeight={700} fontSize={62} fill="#2b2119">TIPPECANOE AND TYLER TOO!</text>
      {/* log-cabin float */}
      <g stroke={L} strokeWidth={lw}>
        <path d="M 330 470 L 560 350 L 790 470 Z" fill="#8a6a44" />
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={340} y={470 + i * 34} width={440} height={34} rx={16} fill={i % 2 ? "#8a5a34" : "#9a6a3e"} />)}
        <rect x={520} y={540} width={80} height={134} fill="#4a3020" />
        <line x1={560} y1={560} x2={600} y2={520} stroke="#d8c89a" strokeWidth={3} />
        <rect x={380} y={520} width={80} height={60} fill="#e8d9a0" />
        <path d="M 680 500 l 40 0 l -6 50 l -28 0 Z" fill="#a87a4a" />
        <ellipse cx={700} cy={500} rx={30} ry={10} fill="#7a5a3a" />
        <rect x={300} y={674} width={520} height={30} fill="#5a3a24" />
        {[380, 740].map((x, i) => <circle key={i} cx={x} cy={714} r={40} fill="#6b4529" />)}
      </g>
      {/* hard-cider barrel */}
      <g transform="translate(900 700)" stroke={L} strokeWidth={lw}>
        <path d="M -70 0 Q -90 -90 -70 -180 L 70 -180 Q 90 -90 70 0 Z" fill="#9a6a3e" />
        {[-150, -30].map((y) => <line key={y} x1={-82} y1={y} x2={82} y2={y} strokeWidth={8} />)}
        <text x={0} y={-80} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontWeight={700} fontSize={30} fill="#2b2119" stroke="none">HARD</text>
        <text x={0} y={-46} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontWeight={700} fontSize={30} fill="#2b2119" stroke="none">CIDER</text>
      </g>
      {/* the campaign ball */}
      <g transform={`translate(1560 560) rotate(${f * 0.6})`} stroke={L} strokeWidth={lw}>
        <circle r={120} fill="#e9dcb4" />
        <path d="M -120 0 Q 0 -40 120 0 M -110 50 Q 0 10 110 50 M -110 -50 Q 0 -90 110 -50" fill="none" stroke="#b8362f" strokeWidth={8} />
      </g>
      {/* speaking platform */}
      <rect y={700} width={1920} height={380} fill="#7e9a52" />
      <g stroke={L} strokeWidth={lw}>
        <rect x={1000} y={760} width={900} height={40} fill="#9a6a3e" />
        <rect x={1020} y={800} width={860} height={120} fill="#7a5030" />
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M ${1020 + i * 144} 800 Q ${1092 + i * 144} 850 ${1164 + i * 144} 800`} fill="#b8362f" />)}
      </g>
      <Paint vig={0.3} />
    </g>
  );
};
