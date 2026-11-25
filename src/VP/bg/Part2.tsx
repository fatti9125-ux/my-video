import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SImg, useExportMode } from "../../Thanksgiving3/Kit";
import { MONTSERRAT } from "../../fonts";
import { HEAD, INK } from "../VKit";

/**
 * Part 2 plates (Tyler -> Fillmore -> Andrew Johnson -> Arthur), one painted plate per real place, built
 * from the period prints in bgref/ (Currier deathbeds of Harrison 1841 and Taylor 1850, Brown's Indian Queen
 * Hotel litho, Rothermel's "U.S. Senate A.D. 1850", the 1865 inauguration photo, Harper's impeachment-trial
 * engraving, Leslie's B&P depot engraving) or, where no print was at hand, from the real place as it stood
 * (era-correct: oil/candle light before 1848, gas after; the Washington Monument a stump 1850-1877; the
 * Capitol dome finished outside by 1865). Same pilot conventions: thin warm background line work, 4-7 depth
 * layers, mood by grade, foreground occluders as separate components drawn AFTER the characters.
 */

const L = "#2b2119";
const lw = 4;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const SERIF = "DejaVu Serif, Georgia, serif";

/** Soft painted texture + vignette (same recipe as the pilot plates). */
export const Paint2: React.FC<{ vig?: number; warm?: boolean }> = ({ vig = 0.45, warm = true }) => (
  <g pointerEvents="none">
    <defs>
      <filter id="p2-tex" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={4} seed={23} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <radialGradient id={warm ? "p2-vigw" : "p2-vigc"} cx="50%" cy="48%" r="72%">
        <stop offset="0.5" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor={warm ? "#1a0f05" : "#05070f"} stopOpacity={1} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} filter="url(#p2-tex)" opacity={0.16} style={{ mixBlendMode: "soft-light" }} />
    <rect width={1920} height={1080} fill={`url(#${warm ? "p2-vigw" : "p2-vigc"})`} opacity={vig} />
  </g>
);

const Cloud: React.FC<{ x: number; y: number; s?: number; o?: number; c?: string }> = ({ x, y, s = 1, o = 0.95, c = "#fbfbf7" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={c} opacity={o}>
    <ellipse cx={0} cy={0} rx={120} ry={42} /><ellipse cx={-70} cy={8} rx={70} ry={34} /><ellipse cx={60} cy={-18} rx={80} ry={46} /><ellipse cx={130} cy={10} rx={60} ry={28} />
  </g>
);

const Tree: React.FC<{ x: number; y: number; s?: number; c?: string[] }> = ({ x, y, s = 1, c = ["#5d7f4d", "#4f7143", "#6c8f58"] }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 41 + x) * 1.1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -8 0 L -5 -200 M -5 -150 Q 20 -190 50 -210 M -5 -170 Q -30 -200 -55 -215" stroke="#4a3626" strokeWidth={12} fill="none" strokeLinecap="round" />
      <g transform={`rotate(${sw} 0 -220)`} stroke={L} strokeWidth={2.5}>
        <ellipse cx={-50} cy={-250} rx={80} ry={64} fill={c[1]} /><ellipse cx={45} cy={-262} rx={86} ry={66} fill={c[0]} /><ellipse cx={-4} cy={-318} rx={84} ry={66} fill={c[2]} />
      </g>
    </g>
  );
};

/** Gilt-framed portrait of a cast member (sepia), optional black mourning crepe across the top corners. */
const Portrait: React.FC<{ x: number; y: number; w: number; h: number; c: string; e?: number; crepe?: boolean; oval?: boolean }> = ({ x, y, w, h, c, e = 0, crepe, oval }) => {
  const head = `vp/${c}/${HEAD[c][e]}`;
  const id = `p2-pt-${c}-${x}`;
  return (
    <g>
      <defs>
        <filter id={`${id}-s`}><feColorMatrix type="matrix" values="0.39 0.77 0.19 0 0  0.35 0.69 0.17 0 0  0.27 0.53 0.13 0 0  0 0 0 1 0" /></filter>
        <clipPath id={`${id}-c`}>{oval ? <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2 - 18} ry={h / 2 - 18} /> : <rect x={x + 18} y={y + 18} width={w - 36} height={h - 36} />}</clipPath>
      </defs>
      <rect x={x + 10} y={y + 14} width={w} height={h} fill="#000" opacity={0.25} />
      {oval ? <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill="#b08a3c" stroke={L} strokeWidth={lw} /> : <rect x={x} y={y} width={w} height={h} fill="#b08a3c" stroke={L} strokeWidth={lw} />}
      <g clipPath={`url(#${id}-c)`}>
        <rect x={x} y={y} width={w} height={h} fill="#5c4f3c" />
        <g filter={`url(#${id}-s)`}><SImg href={staticFile(`tg2/${head}.png`)} x={x + w * 0.12} y={y + h * 0.1} width={w * 0.76} height={h * 0.86} preserveAspectRatio="xMidYMid meet" /></g>
        <rect x={x} y={y} width={w} height={h} fill="#4a3216" opacity={0.25} />
        <path d={`M ${x} ${y} L ${x + w * 0.35} ${y} L ${x} ${y + h * 0.45} Z`} fill="#fff" opacity={0.1} />
      </g>
      {crepe && (
        <g fill="#0f0d0d" stroke="#000" strokeWidth={2}>
          <path d={`M ${x - 10} ${y - 10} L ${x + w * 0.42} ${y - 10} Q ${x + w * 0.2} ${y + h * 0.12} ${x - 10} ${y + h * 0.4} Z`} />
          <path d={`M ${x + w + 10} ${y - 10} L ${x + w * 0.58} ${y - 10} Q ${x + w * 0.8} ${y + h * 0.12} ${x + w + 10} ${y + h * 0.4} Z`} />
          <circle cx={x + w / 2} cy={y - 6} r={20} />
        </g>
      )}
    </g>
  );
};

/** Silhouette crowd seen from behind (foreground occluder): shoulders + heads (+ top hats), idle bob,
 * optional cheer (arms raised with hats, attached at the shoulder) and shake. */
export const Crowd: React.FC<{ x0: number; x1: number; y: number; n: number; s?: number; color?: string; hats?: number; seed?: number;
  cheerAt?: number; shakeAt?: number; goneAt?: number; goneDx?: number; bonnets?: number }> = ({ x0, x1, y, n, s = 1, color = "#16110d", hats = 0.6, seed = 1, cheerAt, shakeAt, goneAt, goneDx = 1400, bonnets = 0 }) => {
  const f = useCurrentFrame();
  const gone = goneAt !== undefined ? interpolate(f - goneAt, [0, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }) : 0;
  return (
    <g fill={color}>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + ((x1 - x0) * (i + 0.5)) / n + (rnd(seed * 31 + i) - 0.5) * 40;
        const k = s * (0.9 + rnd(seed * 7 + i) * 0.2);
        const cheer = cheerAt !== undefined && f >= cheerAt + (i % 4) * 2;
        const bob = Math.sin((f + i * 9) / (cheer ? 5 : 17)) * (cheer ? 10 : 3);
        const sh = shakeAt !== undefined && f >= shakeAt ? Math.sin(f * 2.1 + i) * 6 : 0;
        const hat = rnd(seed * 13 + i) < hats;
        const bonnet = !hat && rnd(seed * 17 + i) < bonnets;
        const dx = gone * goneDx * (0.8 + rnd(i) * 0.4);
        return (
          <g key={i} transform={`translate(${x + sh + dx} ${y + bob}) scale(${k})`}>
            {cheer && <g stroke={color} strokeWidth={20} strokeLinecap="round" fill="none">
              <path d={`M -60 -150 L ${-100 - (i % 2) * 20} -290`} /><path d={`M 60 -150 L ${100 + (i % 3) * 10} -280`} />
            </g>}
            {cheer && hat && <g transform={`translate(${100 + (i % 3) * 10} -300) rotate(${Math.sin(f / 4 + i) * 20})`}><rect x={-28} y={-60} width={56} height={60} /><rect x={-44} y={-6} width={88} height={12} rx={5} /></g>}
            <path d="M -110 200 L -110 -40 Q -110 -150 -40 -165 L 40 -165 Q 110 -150 110 -40 L 110 200 Z" />
            <ellipse cx={0} cy={-215} rx={58} ry={64} />
            {hat && !cheer && <g><rect x={-60} y={-262} width={120} height={14} rx={6} /><rect x={-40} y={-350} width={80} height={95} /></g>}
            {bonnet && <path d="M -70 -200 Q -70 -300 0 -300 Q 70 -300 70 -200 Q 40 -250 0 -250 Q -40 -250 -70 -200 Z" />}
          </g>
        );
      })}
    </g>
  );
};

// ================================================================== 1841: Harrison's deathbed (White House)
/** After N. Currier, "Death of Harrison, April 4 A.D. 1841": crimson + green bed canopy, Harrison's portrait,
 * open door right, round side table with white cloth, medicine bottle, candle. `lit` = candle (1 burning, 0 out). */
export const HarrisonRoom: React.FC<{ lit?: number }> = ({ lit = 1 }) => {
  const f = useCurrentFrame();
  const flick = 1 + Math.sin(f / 2.7) * 0.06;
  return (
    <g>
      <defs>
        <linearGradient id="p2-hw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5f5d52" /><stop offset="1" stopColor="#7c786a" /></linearGradient>
        <linearGradient id="p2-crim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#6e1d33" /><stop offset="0.45" stopColor="#a63a5a" /><stop offset="1" stopColor="#7a2239" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#p2-hw)" />
      {/* panelled dado + cornice */}
      <rect width={1920} height={40} fill="#3e3b33" /><rect y={40} width={1920} height={10} fill="#8b8574" />
      <rect y={700} width={1920} height={170} fill="#5a5649" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={30 + i * 215} y={720} width={180} height={125} fill="none" stroke="#4a463b" strokeWidth={5} />)}
      {/* open door, right (lit hallway, a servant's shadow) */}
      <rect x={1650} y={170} width={230} height={700} fill="#2c2a24" stroke={L} strokeWidth={lw} />
      <rect x={1690} y={200} width={150} height={670} fill="#e8d9a8" opacity={0.85} />
      <path d="M 1690 200 L 1610 230 L 1610 880 L 1690 870 Z" fill="#4b4436" stroke={L} strokeWidth={3} />
      <path d="M 1760 330 Q 1790 300 1810 330 L 1820 870 L 1752 870 Z" fill="#3a352c" opacity={0.55} />
      {/* portrait of Harrison above the bed */}
      <Portrait x={1150} y={70} w={250} h={320} c="william_henry_harrison" />
      {/* bed canopy: tester rod, crimson swags, green inner curtain */}
      <rect x={260} y={30} width={980} height={26} rx={8} fill="#8a6a2e" stroke={L} strokeWidth={3} />
      <path d="M 420 56 L 1060 56 L 1040 760 L 440 760 Z" fill="#2c5440" stroke={L} strokeWidth={3} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${460 + i * 68} 60 Q ${470 + i * 68} 400 ${455 + i * 68} 760`} stroke="#24463a" strokeWidth={6} fill="none" />)}
      <path d="M 260 56 Q 520 260 760 70 Q 1000 260 1240 56 L 1240 40 L 260 40 Z" fill="url(#p2-crim)" stroke={L} strokeWidth={3} />
      <path d="M 260 56 Q 150 420 230 900 L 120 900 Q 60 400 170 56 Z" fill="url(#p2-crim)" stroke={L} strokeWidth={3} />
      <path d="M 1240 56 Q 1330 420 1260 820 L 1360 820 Q 1400 400 1320 56 Z" fill="url(#p2-crim)" stroke={L} strokeWidth={3} />
      <circle cx={1300} cy={520} r={16} fill="#c9a240" stroke={L} strokeWidth={3} />
      {/* floor, blue rug */}
      <rect y={870} width={1920} height={210} fill="#8f7a52" />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} y1={890 + i * 34} x2={1920} y2={890 + i * 34} stroke="#7a6743" strokeWidth={3} />)}
      <path d="M 150 1080 L 360 900 L 1300 900 L 1180 1080 Z" fill="#7d93b0" stroke="#b9a888" strokeWidth={10} />
      <path d="M 260 1060 L 420 930 L 1220 930 L 1130 1060 Z" fill="none" stroke="#5e7593" strokeWidth={6} />
      {/* round side table: white cloth, medicine bottle, cup, candle */}
      <g stroke={L} strokeWidth={3}>
        <line x1={1490} y1={820} x2={1490} y2={980} strokeWidth={10} />
        <path d="M 1450 990 Q 1490 960 1530 990" fill="none" strokeWidth={8} />
        <path d="M 1360 760 Q 1490 730 1620 760 L 1640 860 Q 1490 880 1340 860 Z" fill="#eef0ef" />
        <ellipse cx={1490} cy={760} rx={130} ry={20} fill="#f7f8f6" />
        <rect x={1400} y={700} width={26} height={58} rx={6} fill="#8fa7a0" opacity={0.85} />
        <rect x={1405} y={690} width={16} height={12} fill="#6b5a3a" />
        <path d="M 1530 742 L 1580 742 L 1574 760 L 1536 760 Z" fill="#f4f1e6" />
        <rect x={1462} y={650} width={20} height={106} fill="#f3ecd6" />
        <ellipse cx={1472} cy={756} rx={30} ry={8} fill="#b08a3c" />
      </g>
      {lit > 0.05 && <g transform={`translate(1472 640) scale(${flick * lit})`}>
        <path d="M 0 -6 Q -12 -26 0 -54 Q 12 -26 0 -6 Z" fill="#ffd56b" /><path d="M 0 -10 Q -5 -22 0 -36 Q 5 -22 0 -10 Z" fill="#fff6d6" />
      </g>}
      <Paint2 vig={0.4} />
    </g>
  );
};

/** Foreground for the deathbed: a grieving cabinet member slumped in a chair (left, hand over his face, after
 * Currier's Ewing) and the footstool (right). Pure silhouette shapes; drawn after the characters. */
export const HarrisonFG: React.FC = () => (
  <g>
    <g fill="#15110d">
      <rect x={20} y={640} width={26} height={440} /><rect x={250} y={700} width={22} height={380} />
      <path d="M 40 1080 L 40 800 Q 40 720 110 700 L 170 700 Q 240 720 250 800 L 260 1080 Z" />
      <ellipse cx={150} cy={630} rx={58} ry={66} />
      <path d="M 210 760 Q 260 700 196 630" stroke="#15110d" strokeWidth={30} fill="none" strokeLinecap="round" />
    </g>
    <g stroke={L} strokeWidth={4}>
      <rect x={1480} y={985} width={200} height={60} rx={12} fill="#6b2a2a" />
      <path d="M 1500 1045 L 1495 1075 M 1660 1045 L 1665 1075" strokeWidth={9} />
    </g>
  </g>
);

/** Nightstand close-up (insert): the bedside calendar at 31, the candle stub smoking, medicine, spectacles. */
export const CalendarInsert: React.FC<{ smokeAt?: number }> = ({ smokeAt = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect width={1920} height={1080} fill="#2a2c33" />
      <path d="M 0 0 L 1920 0 L 1920 600 L 0 600 Z" fill="#3a3b3c" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170} y={0} width={70} height={600} fill="#343537" />)}
      <rect y={600} width={1920} height={480} fill="#5a3a22" />
      <path d="M 0 600 L 1920 600 L 1920 640 L 0 640 Z" fill="#6e4a2c" />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M 0 ${660 + i * 60} Q 960 ${680 + i * 60} 1920 ${650 + i * 60}`} stroke="#4c3019" strokeWidth={4} fill="none" />)}
      {/* lace doily */}
      <ellipse cx={760} cy={880} rx={520} ry={90} fill="#ecebe3" opacity={0.9} />
      {Array.from({ length: 30 }, (_, i) => { const a = (i / 30) * Math.PI * 2; return <circle key={i} cx={760 + Math.cos(a) * 520} cy={880 + Math.sin(a) * 90} r={16} fill="#ecebe3" opacity={0.9} />; })}
      {/* medicine bottle + spoon */}
      <g stroke={L} strokeWidth={4}>
        <rect x={250} y={600} width={90} height={250} rx={14} fill="#6f8f86" opacity={0.9} />
        <rect x={270} y={560} width={50} height={44} fill="#6b5a3a" />
        <rect x={262} y={680} width={66} height={90} fill="#efe6cf" />
        <path d="M 400 880 L 560 850" strokeWidth={10} stroke="#b9b6aa" /><ellipse cx={575} cy={846} rx={30} ry={14} fill="#c9c6ba" />
        {/* spectacles */}
        <circle cx={1180} cy={900} r={42} fill="none" strokeWidth={7} /><circle cx={1290} cy={905} r={42} fill="none" strokeWidth={7} />
        <path d="M 1222 900 Q 1236 888 1248 902" fill="none" strokeWidth={6} />
        {/* candle stub, out */}
        <ellipse cx={1580} cy={860} rx={110} ry={26} fill="#b08a3c" />
        <rect x={1540} y={700} width={80} height={160} fill="#f3ecd6" />
        <line x1={1580} y1={700} x2={1580} y2={676} strokeWidth={6} />
      </g>
      {f >= smokeAt && [0, 1, 2].map((i) => { const lf = f - smokeAt - i * 8; if (lf < 0) return null; return <path key={i} d={`M 1580 ${672 - lf * 2.2} q ${24 + Math.sin(lf / 6) * 20} -30 0 -60 q -24 -30 0 -60`} stroke="#c9c9c9" strokeWidth={10} fill="none" opacity={Math.max(0, 0.5 - lf / 120)} />; })}
      <Paint2 vig={0.6} warm={false} />
    </g>
  );
};

// ================================================================== Article II insert
/** The Constitution's succession clause on parchment; "the Same" gets circled in red at `circleAt`. */
export const ClauseInsert: React.FC<{ circleAt: number }> = ({ circleAt }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - circleAt, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lines = ["In Case of the Removal of the President", "from Office, or of his Death, Resignation,", "or Inability to discharge the Powers and", "Duties of the said Office,"];
  return (
    <g>
      <rect width={1920} height={1080} fill="#3b2614" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M 0 ${40 + i * 78} Q 960 ${70 + i * 78} 1920 ${30 + i * 78}`} stroke="#2f1d0f" strokeWidth={6} fill="none" />)}
      <g transform="rotate(-2 960 540)">
        <rect x={250} y={90} width={1420} height={920} fill="#000" opacity={0.35} transform="translate(18 22)" />
        <path d="M 250 90 L 1670 90 L 1665 1010 L 255 1005 Z" fill="#e6d2a4" stroke="#7a5d34" strokeWidth={5} />
        <rect x={250} y={90} width={1420} height={920} fill="#a57a3c" opacity={0.12} />
        <text x={960} y={210} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={66} fill="#3a2614">Article II. Section 1.</text>
        <line x1={600} y1={240} x2={1320} y2={240} stroke="#6b5233" strokeWidth={3} />
        {lines.map((l, i) => <text key={i} x={330} y={340 + i * 100} fontFamily={SERIF} fontStyle="italic" fontSize={60} fill="#2e1e10">{l}</text>)}
        <text x={330} y={740} fontFamily={SERIF} fontStyle="italic" fontSize={60} fill="#2e1e10">the Same shall devolve on the</text>
        <text x={330} y={840} fontFamily={SERIF} fontStyle="italic" fontSize={60} fill="#2e1e10">Vice President...</text>
        {p > 0 && <ellipse cx={460} cy={722} rx={170} ry={62} fill="none" stroke="#d62828" strokeWidth={12} pathLength={1} strokeDasharray={`${p} 1`} transform="rotate(-3 460 722)" />}
      </g>
      <Paint2 vig={0.5} />
    </g>
  );
};

// ================================================================== 1841: the President's cabinet room (White House)
/** Buff walls, green drapes, marble mantel + mirror, Harrison's portrait hung with black crepe, oil lamps. */
export const CabinetRoom1841: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="p2-cbw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bba67a" /><stop offset="1" stopColor="#d2bf92" /></linearGradient>
      <linearGradient id="p2-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dfeaf0" /><stop offset="1" stopColor="#c3d3d6" /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#p2-cbw)" />
    <rect width={1920} height={56} fill="#7a6a48" /><rect y={56} width={1920} height={22} fill="#3f6a4a" /><rect y={78} width={1920} height={6} fill="#c9a240" />
    {/* tall windows with green drapes */}
    {[[40, 300], [1640, 300]].map(([x, w], i) => (
      <g key={i}>
        <rect x={x} y={150} width={w - 60} height={560} fill="url(#p2-day)" stroke="#efe6cf" strokeWidth={12} />
        <line x1={x + (w - 60) / 2} y1={150} x2={x + (w - 60) / 2} y2={710} stroke="#efe6cf" strokeWidth={7} />
        {[0, 1, 2].map((r) => <line key={r} x1={x} y1={290 + r * 140} x2={x + w - 60} y2={290 + r * 140} stroke="#efe6cf" strokeWidth={6} />)}
        <path d={`M ${x - 30} 120 L ${x + 40} 120 Q ${x + 20} 420 ${x + 50} 740 L ${x - 40} 740 Z`} fill="#2f5a3e" stroke={L} strokeWidth={3} />
        <path d={`M ${x + w - 90} 120 L ${x + w - 20} 120 Q ${x + w - 10} 420 ${x + w - 10} 740 L ${x + w - 110} 740 Q ${x + w - 70} 420 ${x + w - 90} 120 Z`} fill="#2f5a3e" stroke={L} strokeWidth={3} />
        <rect x={x - 50} y={104} width={w + 40} height={24} rx={8} fill="#a7843a" stroke={L} strokeWidth={3} />
      </g>
    ))}
    <path d="M 330 300 L 560 300 L 700 1080 L 150 1080 Z" fill="#fff8de" opacity={0.08} />
    {/* marble mantel + gilt mirror, oil lamps */}
    <g stroke={L} strokeWidth={lw}>
      <rect x={470} y={170} width={300} height={330} fill="#c9a240" />
      <rect x={490} y={190} width={260} height={290} fill="#b9c3c6" />
      <path d="M 500 200 L 600 200 L 500 380 Z" fill="#fff" opacity={0.3} stroke="none" />
      <rect x={430} y={500} width={380} height={34} fill="#e9e4da" />
      <rect x={450} y={534} width={340} height={240} fill="#e3ddd0" />
      <rect x={520} y={580} width={200} height={194} fill="#2a1d14" />
      <path d="M 560 774 Q 620 700 680 774 Z" fill="#c8642e" opacity={0.8} stroke="none" />
      {[480, 760].map((x) => <g key={x}><rect x={x - 14} y={440} width={28} height={60} fill="#b08a3c" /><path d={`M ${x - 26} 440 Q ${x} 380 ${x + 26} 440 Z`} fill="#f3eedc" opacity={0.85} /></g>)}
    </g>
    {/* Harrison's portrait, hung with crepe */}
    <Portrait x={1230} y={150} w={240} h={300} c="william_henry_harrison" crepe />
    {/* green-and-buff carpet */}
    <rect y={770} width={1920} height={310} fill="#4a6a4a" />
    {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={60 + i * 125} cy={820 + (i % 2) * 30} r={14} fill="#c9a240" opacity={0.5} />)}
    <Paint2 vig={0.35} />
  </g>
);

/** The cabinet table seen down its length (foreground) with cabinet members from behind, seated. Members whose
 * index is in `gone` have left their chair; resignation letters lie at their places from `letterAt[i]`. */
export const CabinetTableFG: React.FC<{ goneAt?: number[]; letterAt?: number[] }> = ({ goneAt = [], letterAt = [] }) => {
  const f = useCurrentFrame();
  const seats: [number, number, number, number][] = [[330, 900, 1.0, 0], [600, 820, 0.78, 0], [1320, 820, 0.78, 1], [1600, 900, 1.0, 1], [120, 1060, 1.35, 0]];
  const isGone = (i: number) => goneAt[i] !== undefined && f >= goneAt[i];
  return (
    <g>
      {/* table */}
      <path d="M 640 770 L 1280 770 L 1760 1080 L 160 1080 Z" fill="#355b3e" stroke={L} strokeWidth={lw} />
      <path d="M 640 770 L 1280 770 L 1290 790 L 630 790 Z" fill="#284733" />
      <path d="M 820 800 L 1100 800 L 1240 1080 L 680 1080 Z" fill="#fff8de" opacity={0.05} />
      {/* papers, inkwells, candelabrum */}
      {[[760, 820, -8], [1100, 840, 6], [880, 900, 3], [1040, 960, -5]].map(([x, y, r], i) => <rect key={i} x={x} y={y} width={110} height={74} fill="#f1ead6" stroke={L} strokeWidth={3} transform={`rotate(${r} ${x} ${y})`} />)}
      <g stroke={L} strokeWidth={3}><rect x={940} y={830} width={40} height={34} fill="#1d1d2b" /><path d="M 960 830 L 990 770" stroke="#f3eedc" strokeWidth={5} /></g>
      <g stroke={L} strokeWidth={4} fill="#b08a3c"><rect x={950} y={740} width={20} height={100} /><path d="M 900 760 Q 960 700 1020 760" fill="none" strokeWidth={8} stroke="#b08a3c" /><ellipse cx={960} cy={845} rx={50} ry={12} /></g>
      {[900, 960, 1020].map((x) => <g key={x}><rect x={x - 7} y={x === 960 ? 690 : 720} width={14} height={40} fill="#f3eedc" /></g>)}
      {/* seated members (from behind) */}
      {seats.map(([x, y, k, side], i) => {
        if (isGone(i)) return letterAt[i] !== undefined && f >= letterAt[i] ? (
          <g key={i} transform={`translate(${x + (side ? -150 : 150) * k} ${y - 110 * k}) rotate(${side ? 8 : -8})`}>
            <rect x={-60} y={-40} width={120} height={84} fill="#f6efd9" stroke={L} strokeWidth={3} />
            {[0, 1, 2].map((r) => <line key={r} x1={-44} y1={-20 + r * 20} x2={40} y2={-20 + r * 20} stroke="#7a6a4a" strokeWidth={3} />)}
          </g>
        ) : null;
        const bob = Math.sin((f + i * 13) / 19) * 3;
        return (
          <g key={i} transform={`translate(${x} ${y + bob}) scale(${k})`} fill="#1a1510">
            <rect x={-120} y={-260} width={240} height={36} rx={10} fill="#3a2414" />
            <rect x={-110} y={-230} width={18} height={300} fill="#3a2414" /><rect x={92} y={-230} width={18} height={300} fill="#3a2414" />
            <path d="M -100 200 L -100 -60 Q -100 -150 -30 -160 L 30 -160 Q 100 -150 100 -60 L 100 200 Z" />
            <ellipse cx={0} cy={-210} rx={i === 0 ? 66 : 54} ry={i === 0 ? 70 : 60} />
            {i !== 0 && <path d={`M -54 -215 Q -60 -280 0 -275 Q 60 -280 54 -215`} fill="#2a211a" />}
          </g>
        );
      })}
    </g>
  );
};

// ================================================================== 1841: Brown's Indian Queen Hotel
/** After the Brown's Indian Queen Hotel lithograph: 5-storey cream "free-stone" front with mansard dormers and
 * roof balustrade, wings, brick neighbours, shop windows, JESSE BROWN sign, young trees, Pennsylvania Avenue. */
export const IndianQueenExt: React.FC = () => {
  const f = useCurrentFrame();
  const win = (x: number, y: number, k: string, w = 46, h = 70) => <g key={k}><rect x={x} y={y} width={w} height={h} fill="#55677a" stroke="#ece3cc" strokeWidth={5} /><line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke="#ece3cc" strokeWidth={3} /><rect x={x + 4} y={y + 4} width={w / 2 - 6} height={h / 2} fill="#9fb3c7" opacity={0.5} /></g>;
  return (
    <g>
      <defs><linearGradient id="p2-gsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6d7079" /><stop offset="0.6" stopColor="#a7abae" /><stop offset="1" stopColor="#d8d4c4" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#p2-gsky)" />
      <Cloud x={300 + f * 0.2} y={150} s={1.6} c="#c9c8c1" o={0.7} /><Cloud x={1300 + f * 0.15} y={110} s={1.3} c="#d8d6cc" o={0.6} />
      {/* brick neighbours */}
      {[[0, 330], [1600, 320]].map(([x, w], i) => (
        <g key={i}>
          <path d={`M ${x} 390 L ${x + w} 390 L ${x + w - 20} 330 L ${x + 20} 330 Z`} fill="#4a4448" stroke={L} strokeWidth={3} />
          <rect x={x} y={390} width={w} height={470} fill="#a8705a" stroke={L} strokeWidth={lw} />
          {[0, 1, 2].map((r) => [0, 1, 2].map((c) => win(x + 40 + c * 95, 430 + r * 120, `n${i}${r}${c}`)))}
        </g>
      ))}
      {/* wings */}
      {[[330, 300], [1300, 300]].map(([x, w], i) => (
        <g key={i}>
          <path d={`M ${x} 330 L ${x + w} 330 L ${x + w - 30} 250 L ${x + 30} 250 Z`} fill="#3f3b3e" stroke={L} strokeWidth={3} />
          {[0, 1, 2].map((d) => <g key={d}><rect x={x + 60 + d * 85} y={265} width={44} height={56} fill="#e9e0c8" stroke={L} strokeWidth={3} /><rect x={x + 70 + d * 85} y={280} width={24} height={38} fill="#55677a" /></g>)}
          <rect x={x} y={330} width={w} height={530} fill="#e6dcc3" stroke={L} strokeWidth={lw} />
          {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => win(x + 30 + c * 66, 370 + r * 110, `w${i}${r}${c}`, 40, 64)))}
        </g>
      ))}
      {/* centre block: 5 storeys + mansard + balustrade */}
      <rect x={640} y={150} width={24} height={80} fill="#e6dcc3" stroke={L} strokeWidth={3} /><rect x={1256} y={150} width={24} height={80} fill="#e6dcc3" stroke={L} strokeWidth={3} />
      <path d="M 630 290 L 1290 290 L 1250 200 L 670 200 Z" fill="#3f3b3e" stroke={L} strokeWidth={3} />
      <rect x={720} y={168} width={480} height={32} fill="#e6dcc3" stroke={L} strokeWidth={3} />
      {Array.from({ length: 22 }, (_, i) => <rect key={i} x={728 + i * 21.5} y={172} width={8} height={24} fill="#b9ae96" />)}
      {[760, 925, 1090].map((x) => <g key={x}><rect x={x} y={214} width={60} height={70} fill="#e9e0c8" stroke={L} strokeWidth={3} /><path d={`M ${x} 214 Q ${x + 30} 190 ${x + 60} 214`} fill="#e9e0c8" stroke={L} strokeWidth={3} /><rect x={x + 14} y={228} width={32} height={50} fill="#55677a" /></g>)}
      <rect x={630} y={290} width={660} height={570} fill="#efe6cf" stroke={L} strokeWidth={lw} />
      {[0, 1, 2, 3].map((r) => Array.from({ length: 7 }, (_, c) => win(670 + c * 88, 320 + r * 108, `c${r}${c}`, 44, 68)))}
      {/* ground floor: shop windows + entrance */}
      <rect x={0} y={760} width={1920} height={20} fill="#cfc4aa" stroke={L} strokeWidth={3} />
      {Array.from({ length: 26 }, (_, i) => (i < 11 || i > 14) && <rect key={i} x={20 + i * 74} y={790} width={54} height={70} fill="#3f4a55" stroke="#d9cfb6" strokeWidth={4} />)}
      <path d="M 860 860 L 860 790 Q 960 740 1060 790 L 1060 860 Z" fill="#2c3036" stroke={L} strokeWidth={lw} />
      {[870, 1050].map((x) => <rect key={x} x={x - 8} y={780} width={16} height={80} fill="#efe6cf" stroke={L} strokeWidth={2} />)}
      <rect x={850} y={722} width={220} height={40} fill="#2b2a2a" stroke="#d9cfb6" strokeWidth={3} />
      <text x={960} y={751} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={26} fill="#efe6cf" letterSpacing={3}>JESSE BROWN</text>
      {[880, 1040].map((x) => <g key={x} stroke={L} strokeWidth={3}><line x1={x} y1={680} x2={x} y2={722} /><path d={`M ${x - 14} 680 L ${x + 14} 680 L ${x + 8} 650 L ${x - 8} 650 Z`} fill="#f2e2a6" /></g>)}
      {/* avenue (unpaved) + sidewalk */}
      <rect y={860} width={1920} height={60} fill="#b9ab8c" />
      <rect y={920} width={1920} height={160} fill="#9d8e6e" />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M ${i * 210 - 40} ${960 + (i % 3) * 30} q 80 -10 160 0`} stroke="#8a7b5c" strokeWidth={5} fill="none" />)}
      {/* pedestrians (small, far) */}
      {[[300, 0], [520, 1], [1380, 0], [1560, 1]].map(([x, b], i) => (
        <g key={i} fill="#2a2522" transform={`translate(${x + Math.sin(f / 30 + i) * 4} 905)`}>
          <rect x={-9} y={-52} width={18} height={52} /><circle cy={-60} r={9} />{b ? <path d="M -18 0 L -10 -40 L 10 -40 L 18 0 Z" fill="#6a4a5a" /> : <rect x={-8} y={-84} width={16} height={18} />}
        </g>
      ))}
      <Tree x={560} y={880} s={1.05} /><Tree x={960} y={880} s={1.1} /><Tree x={1380} y={880} s={1.0} />
      <Paint2 vig={0.35} warm={false} />
    </g>
  );
};

/** The hotel parlor where Judge Cranch swore Tyler in (6 April 1841): rose-striped paper, tall window on the
 * avenue, mantel with clock and candlesticks, round table with the Bible (see ParlorTableFG), daylight. */
export const HotelParlor1841: React.FC = () => (
  <g>
    <defs>
      <pattern id="p2-stripe" width={60} height={60} patternUnits="userSpaceOnUse"><rect width={60} height={60} fill="#d8b9a8" /><rect width={22} height={60} fill="#cfa999" /><circle cx={41} cy={30} r={5} fill="#b98a7a" /></pattern>
    </defs>
    <rect width={1920} height={1080} fill="url(#p2-stripe)" />
    <rect width={1920} height={60} fill="#7a5a44" /><rect y={60} width={1920} height={12} fill="#e9dcc4" />
    <rect y={690} width={1920} height={18} fill="#e9dcc4" /><rect y={708} width={1920} height={160} fill="#a98a72" />
    {/* window with lace; the avenue outside */}
    <rect x={120} y={140} width={360} height={540} fill="#c7d3d6" stroke="#f1e8d6" strokeWidth={14} />
    <rect x={120} y={480} width={360} height={200} fill="#b6ab92" />
    <rect x={130} y={420} width={150} height={60} fill="#a8705a" /><rect x={300} y={400} width={170} height={80} fill="#e6dcc3" />
    {[300].map((x) => <line key={x} x1={x} y1={140} x2={x} y2={680} stroke="#f1e8d6" strokeWidth={8} />)}
    {[320, 500].map((y) => <line key={y} x1={120} y1={y} x2={480} y2={y} stroke="#f1e8d6" strokeWidth={6} />)}
    <path d="M 120 140 Q 190 400 150 680 L 120 680 Z" fill="#fbf8ee" opacity={0.8} /><path d="M 480 140 Q 420 400 460 680 L 480 680 Z" fill="#fbf8ee" opacity={0.8} />
    <path d="M 70 110 L 170 110 Q 150 420 190 700 L 60 700 Z" fill="#7d3a3a" stroke={L} strokeWidth={3} /><path d="M 530 110 L 430 110 Q 450 420 410 700 L 540 700 Z" fill="#7d3a3a" stroke={L} strokeWidth={3} />
    <path d="M 480 300 L 900 900 L 300 1080 L 120 680 Z" fill="#fff8de" opacity={0.1} />
    {/* mantel, mirror, clock, candlesticks */}
    <g stroke={L} strokeWidth={lw}>
      <rect x={1240} y={170} width={360} height={300} fill="#c9a240" /><rect x={1262} y={192} width={316} height={256} fill="#c5cdd0" />
      <path d="M 1270 200 L 1380 200 L 1270 360 Z" fill="#fff" opacity={0.35} stroke="none" />
      <rect x={1190} y={470} width={460} height={32} fill="#3e2a1c" />
      <rect x={1210} y={502} width={420} height={200} fill="#5a3a26" /><rect x={1300} y={540} width={240} height={162} fill="#1e1510" />
      <rect x={1385} y={390} width={70} height={80} rx={8} fill="#b08a3c" /><circle cx={1420} cy={418} r={22} fill="#f3ecd8" />
      {[1240, 1600].map((x) => <g key={x}><rect x={x - 8} y={400} width={16} height={70} fill="#c9a240" /><rect x={x - 6} y={364} width={12} height={36} fill="#f3ecd8" /></g>)}
    </g>
    {/* sofa against the back wall */}
    <path d="M 720 700 Q 720 600 800 600 L 1100 600 Q 1180 600 1180 700 L 1180 780 L 720 780 Z" fill="#6b2f36" stroke={L} strokeWidth={lw} />
    <rect y={868} width={1920} height={212} fill="#5a3a26" />
    <ellipse cx={980} cy={990} rx={780} ry={90} fill="#7a4a3a" />
    <ellipse cx={980} cy={990} rx={680} ry={70} fill="none" stroke="#c9a14a" strokeWidth={8} />
    <Paint2 vig={0.35} />
  </g>
);

/** Round table with the family Bible (foreground right of the oath-taker). */
export const ParlorTableFG: React.FC<{ x?: number }> = ({ x = 1350 }) => (
  <g stroke={L} strokeWidth={lw}>
    <path d={`M ${x - 26} 860 L ${x - 70} 1060 L ${x + 70} 1060 L ${x + 26} 860 Z`} fill="#4a2a14" />
    <ellipse cx={x} cy={850} rx={230} ry={50} fill="#7a4626" />
    <path d={`M ${x - 230} 852 Q ${x} 910 ${x + 230} 852`} fill="none" stroke="#5e3416" strokeWidth={10} />
    <path d={`M ${x - 120} 838 L ${x + 10} 824 L ${x + 30} 852 L ${x - 100} 866 Z`} fill="#3d2414" />
    <path d={`M ${x - 112} 836 L ${x + 6} 823 L ${x + 10} 830 L ${x - 108} 844 Z`} fill="#e9dcc0" stroke="none" />
  </g>
);

// ================================================================== 1840-41: a Whig hall ("Tippecanoe and Tyler too")
/** Plank-walled Whig meeting hall: bunting, the 1840 banner TIPPECANOE AND TYLER TOO! with log cabin + cider
 * barrel, a hard-cider barrel and a coonskin on stage. From `tornAt`, the "AND TYLER TOO!" half hangs torn. */
export const WhigHall: React.FC<{ tornAt?: number }> = ({ tornAt = 99999 }) => {
  const f = useCurrentFrame();
  const torn = f >= tornAt;
  const sw = torn ? interpolate(f - tornAt, [0, 8], [0, 72], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.4)) }) + Math.sin((f - tornAt) / 5) * 3 : 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#7a5634" />
      {Array.from({ length: 14 }, (_, i) => <g key={i}><rect y={i * 64} width={1920} height={58} fill={i % 2 ? "#845d39" : "#7b5535"} /><line x1={0} y1={i * 64 + 58} x2={1920} y2={i * 64 + 58} stroke="#563a22" strokeWidth={6} /></g>)}
      {[200, 960, 1720].map((x) => <rect key={x} x={x - 30} y={0} width={60} height={900} fill="#5e4026" stroke={L} strokeWidth={3} />)}
      {/* bunting swags */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} stroke={L} strokeWidth={3}>
          <path d={`M ${i * 320} 30 Q ${i * 320 + 160} 150 ${i * 320 + 320} 30 L ${i * 320 + 320} 50 Q ${i * 320 + 160} 120 ${i * 320} 50 Z`} fill="#b8362f" />
          <path d={`M ${i * 320} 50 Q ${i * 320 + 160} 120 ${i * 320 + 320} 50 L ${i * 320 + 320} 66 Q ${i * 320 + 160} 100 ${i * 320} 66 Z`} fill="#f2ede0" />
        </g>
      ))}
      {/* the banner */}
      <g stroke={L} strokeWidth={lw}>
        <line x1={240} y1={170} x2={1680} y2={170} strokeWidth={8} />
        <rect x={260} y={180} width={760} height={200} fill="#f2ead2" />
        <text x={640} y={268} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={84} fill="#2b3f74" stroke="none">TIPPECANOE</text>
        <g transform="translate(330 300)"><path d="M 0 60 L 0 20 L 40 -10 L 80 20 L 80 60 Z" fill="#8a5a32" />{[25, 40, 52].map((y) => <line key={y} x1={2} y1={y} x2={78} y2={y} strokeWidth={2} />)}</g>
        <g transform="translate(860 300)"><ellipse cx={30} cy={30} rx={30} ry={36} fill="#9a6a3a" /><line x1={2} y1={18} x2={58} y2={18} strokeWidth={3} /><line x1={2} y1={44} x2={58} y2={44} strokeWidth={3} /></g>
        <text x={640} y={352} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={36} fill="#b8362f" stroke="none">and hard cider!</text>
        <g transform={`rotate(${sw} 1020 182)`}>
          <rect x={1020} y={180} width={640} height={200} fill="#f2ead2" />
          <text x={1340} y={300} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={76} fill="#b8362f" stroke="none">AND TYLER TOO!</text>
          {torn && <path d="M 1020 180 L 1032 220 L 1018 260 L 1034 300 L 1020 340 L 1030 380" fill="none" strokeWidth={5} />}
        </g>
        {torn && <path d="M 1020 180 L 1008 220 L 1022 260 L 1006 300 L 1020 340 L 1010 380" fill="none" strokeWidth={5} />}
      </g>
      {/* stage, cider barrel, coonskin */}
      <rect y={760} width={1920} height={60} fill="#5a3a22" stroke={L} strokeWidth={lw} />
      <rect y={820} width={1920} height={260} fill="#3f2816" />
      <g stroke={L} strokeWidth={lw} transform="translate(1500 640)">
        <ellipse cx={0} cy={0} rx={90} ry={120} fill="#9a6a3a" /><rect x={-90} y={-30} width={180} height={14} fill="#4a4a4a" /><rect x={-90} y={30} width={180} height={14} fill="#4a4a4a" />
        <text x={0} y={-50} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={26} fill="#f2ead2" stroke="none">HARD</text>
        <text x={0} y={-22} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={26} fill="#f2ead2" stroke="none">CIDER</text>
      </g>
      <g stroke={L} strokeWidth={3} transform="translate(1760 470)">
        <ellipse cx={0} cy={0} rx={50} ry={80} fill="#7a6a5a" />{[0, 1, 2, 3].map((i) => <rect key={i} x={-12} y={70 + i * 26} width={24} height={14} fill={i % 2 ? "#2a2220" : "#8a7a6a"} />)}
      </g>
      <Paint2 vig={0.45} />
    </g>
  );
};

// ================================================================== 1841: the vetoed bank bill (insert)
/** "An Act to incorporate ... the Fiscal Bank of the United States" on Tyler's desk; red VETOED wipes on. */
export const VetoDoc: React.FC<{ writeAt: number }> = ({ writeAt }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - writeAt, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <g>
      <rect width={1920} height={1080} fill="#4a2a16" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M 0 ${50 + i * 90} Q 960 ${80 + i * 90} 1920 ${40 + i * 90}`} stroke="#3c2210" strokeWidth={6} fill="none" />)}
      <g transform="rotate(3 960 540)">
        <rect x={420} y={70} width={1080} height={960} fill="#000" opacity={0.35} transform="translate(16 20)" />
        <rect x={420} y={70} width={1080} height={960} fill="#efe3c3" stroke="#7a5d34" strokeWidth={5} />
        <text x={960} y={190} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={64} fill="#2e1e10">AN ACT</text>
        <text x={960} y={270} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={40} fill="#2e1e10">to incorporate the subscribers to the</text>
        <text x={960} y={370} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={76} fill="#2e1e10">FISCAL BANK</text>
        <text x={960} y={450} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={52} fill="#2e1e10">OF THE UNITED STATES</text>
        {Array.from({ length: 7 }, (_, i) => <line key={i} x1={520} y1={540 + i * 56} x2={1400 - (i % 3) * 90} y2={540 + i * 56} stroke="#8a7656" strokeWidth={6} />)}
        <defs><clipPath id="p2-veto"><rect x={440} y={0} width={1040 * p} height={1080} /></clipPath></defs>
        <g clipPath="url(#p2-veto)" transform="rotate(-14 960 640)">
          <text x={960} y={700} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={190} fill="#b8241f" opacity={0.92}>Vetoed</text>
          <text x={1180} y={830} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={70} fill="#2a1d12">J. Tyler</text>
        </g>
      </g>
      <Paint2 vig={0.5} />
    </g>
  );
};

// ================================================================== 1841: White House, north front
/** The President's House from Pennsylvania Avenue, 1841: Ionic north portico (1830), roof balustrade, iron
 * fence and gate with oil lamps (gas came 1848), carriage drive, elms; spring day. */
export const WhiteHouse1841: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><linearGradient id="p2-sky41" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7aa8d2" /><stop offset="0.7" stopColor="#c6dbe6" /><stop offset="1" stopColor="#eef0e2" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#p2-sky41)" />
      <Cloud x={240 + f * 0.15} y={120} s={1.0} /><Cloud x={1500 + f * 0.1} y={90} s={0.8} />
      {Array.from({ length: 24 }, (_, i) => <ellipse key={i} cx={i * 86} cy={560 - (i % 3) * 10} rx={70} ry={58} fill={i % 2 ? "#5d7f4d" : "#4f7143"} />)}
      {/* house body */}
      <rect x={260} y={300} width={1400} height={330} fill="#f2efe6" stroke={L} strokeWidth={lw} />
      <rect x={250} y={280} width={1420} height={24} fill="#e6e1d4" stroke={L} strokeWidth={3} />
      {Array.from({ length: 56 }, (_, i) => <rect key={i} x={262 + i * 25} y={256} width={9} height={24} fill="#e6e1d4" stroke={L} strokeWidth={1} />)}
      <rect x={250} y={250} width={1420} height={8} fill="#e6e1d4" />
      {[0, 1].map((r) => Array.from({ length: 11 }, (_, i) => {
        const x = 300 + i * 125 + (i > 4 ? 80 : 0);
        if (x > 1600) return null;
        if (x > 780 && x < 1140) return null;
        return <g key={`${r}${i}`}><rect x={x} y={330 + r * 150} width={56} height={100} fill="#4c5a68" stroke="#d9d4c6" strokeWidth={5} />
          {r === 0 ? <path d={`M ${x - 10} ${328} L ${x + 28} 306 L ${x + 66} 328 Z`} fill="#e6e1d4" stroke={L} strokeWidth={2} /> : <rect x={x - 8} y={474} width={72} height={8} fill="#e6e1d4" />}</g>;
      }))}
      {/* north portico */}
      <path d="M 760 270 L 960 170 L 1160 270 Z" fill="#f4f1e8" stroke={L} strokeWidth={lw} />
      <circle cx={960} cy={232} r={20} fill="none" stroke={L} strokeWidth={3} />
      <rect x={760} y={268} width={400} height={30} fill="#e9e5d8" stroke={L} strokeWidth={3} />
      <rect x={800} y={298} width={320} height={332} fill="#d6d1c3" />
      <path d="M 920 630 L 920 520 Q 960 480 1000 520 L 1000 630 Z" fill="#3b3a36" stroke={L} strokeWidth={3} />
      <path d="M 900 470 Q 960 410 1020 470 Z" fill="#9fb3c7" stroke={L} strokeWidth={3} />
      {[790, 880, 1040, 1130].map((x) => <g key={x}><rect x={x - 16} y={298} width={32} height={332} fill="#fbf9f3" stroke={L} strokeWidth={3} /><path d={`M ${x - 26} 300 q 10 -14 26 0 q 16 -14 26 0`} fill="#fbf9f3" stroke={L} strokeWidth={3} /></g>)}
      <rect x={740} y={630} width={440} height={24} fill="#d9d4c6" stroke={L} strokeWidth={3} />
      {/* lawn, drive, fence + gate lamps */}
      <rect y={650} width={1920} height={430} fill="#7da55a" />
      <path d="M 900 654 Q 600 760 260 1080 L 520 1080 Q 760 800 960 680 Q 1160 800 1400 1080 L 1660 1080 Q 1320 760 1020 654 Z" fill="#d2c6a4" />
      <rect y={780} width={1920} height={10} fill="#2b2a2a" />
      {Array.from({ length: 64 }, (_, i) => <line key={i} x1={i * 30 + 10} y1={720} x2={i * 30 + 10} y2={790} stroke="#2b2a2a" strokeWidth={5} />)}
      {Array.from({ length: 64 }, (_, i) => <path key={i} d={`M ${i * 30 + 4} 724 L ${i * 30 + 10} 710 L ${i * 30 + 16} 724 Z`} fill="#2b2a2a" />)}
      {[600, 1320].map((x) => <g key={x} stroke={L} strokeWidth={3}><rect x={x - 26} y={640} width={52} height={160} fill="#e9e5d8" /><rect x={x - 6} y={590} width={12} height={50} fill="#2b2a2a" /><path d={`M ${x - 22} 590 L ${x + 22} 590 L ${x + 14} 550 L ${x - 14} 550 Z`} fill="#f2e2a6" /></g>)}
      <Tree x={130} y={760} s={1.5} c={["#4f7d3a", "#3e6a30", "#629448"]} /><Tree x={1800} y={760} s={1.6} c={["#4f7d3a", "#3e6a30", "#629448"]} />
      <Paint2 vig={0.3} />
    </g>
  );
};

// ================================================================== 1850: the Old Senate Chamber
/** After Rothermel's "The United States Senate, A.D. 1850": the Vice President's dais under a crimson canopy
 * crowned by the gilded eagle, columns carrying the gallery, the half-dome with coffers and a chandelier,
 * mahogany desks in arcs (SenateDesksFG). Fillmore presides from the dais desk. */
export const OldSenate1850: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <radialGradient id="p2-dome" cx="50%" cy="100%" r="90%"><stop offset="0" stopColor="#d9cdb0" /><stop offset="1" stopColor="#8f846a" /></radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="#6d6250" />
      {/* half-dome with coffers */}
      <path d="M 0 360 Q 960 -260 1920 360 L 1920 0 L 0 0 Z" fill="url(#p2-dome)" />
      {Array.from({ length: 5 }, (_, r) => Array.from({ length: 14 }, (_, i) => {
        const a = Math.PI * (0.08 + (i / 13) * 0.84); const rad = 1040 - r * 150;
        const x = 960 - Math.cos(a) * rad; const y = 360 - Math.sin(a) * rad * 0.55;
        if (y < -40) return null;
        return <rect key={`${r}${i}`} x={x - 30 + r * 3} y={y - 20} width={60 - r * 6} height={40 - r * 4} fill="#a99c7e" stroke="#7f735a" strokeWidth={3} />;
      }))}
      {/* gallery balustrade sweeping across */}
      <path d="M 0 390 Q 960 250 1920 390 L 1920 470 Q 960 330 0 470 Z" fill="#cfc3a5" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 40 }, (_, i) => { const x = i * 50 + 10; const y = 410 - Math.sin((x / 1920) * Math.PI) * 130; return <rect key={i} x={x} y={y} width={14} height={44} fill="#b9ad8f" />; })}
      {/* gallery spectators (heads + bonnets) */}
      {Array.from({ length: 34 }, (_, i) => { const x = 30 + i * 56; const y = 372 - Math.sin((x / 1920) * Math.PI) * 130; return <g key={i} fill={i % 3 ? "#3a302a" : "#5a4a5a"}><ellipse cx={x} cy={y - 8} rx={18} ry={20} />{i % 4 === 0 && <path d={`M ${x - 22} ${y} Q ${x} ${y - 46} ${x + 22} ${y} Z`} fill="#7a5a6a" />}</g>; })}
      {/* columns (Potomac marble) */}
      {[160, 520, 1400, 1760].map((x) => <g key={x}><rect x={x - 30} y={470} width={60} height={420} fill="#7a6a5a" stroke={L} strokeWidth={3} /><rect x={x - 42} y={456} width={84} height={22} fill="#c9a240" stroke={L} strokeWidth={3} /></g>)}
      {/* back wall behind dais */}
      <rect x={560} y={460} width={800} height={440} fill="#8a7d64" />
      {/* the canopy + eagle */}
      <path d="M 720 300 Q 960 380 1200 300 L 1240 760 Q 1180 700 1150 760 L 1130 420 Q 960 470 790 420 L 770 760 Q 740 700 680 760 Z" fill="#7c1f2e" stroke={L} strokeWidth={lw} />
      <path d="M 790 420 Q 960 470 1130 420 L 1110 760 L 810 760 Z" fill="#5e1622" />
      <g transform="translate(960 250)" stroke={L} strokeWidth={4}>
        <path d="M 0 -20 Q -120 -90 -200 -40 Q -130 -40 -90 0 Q -40 10 0 20 Q 40 10 90 0 Q 130 -40 200 -40 Q 120 -90 0 -20 Z" fill="#c9a240" />
        <ellipse cx={0} cy={0} rx={30} ry={48} fill="#b08a3c" /><circle cx={0} cy={-50} r={18} fill="#e9d9a0" />
        <path d="M 14 -52 L 32 -44 L 14 -40 Z" fill="#d9a520" />
      </g>
      {/* chandelier */}
      <g stroke="#3a2a1a" strokeWidth={4} transform={`translate(960 ${70 + Math.sin(f / 50) * 2})`}>
        <line x1={0} y1={-80} x2={0} y2={20} />
        <path d="M -130 40 Q 0 110 130 40" fill="none" strokeWidth={8} stroke="#7a5a2a" /><path d="M -90 70 Q 0 130 90 70" fill="none" strokeWidth={6} stroke="#7a5a2a" />
        {[-130, -65, 0, 65, 130].map((x) => <g key={x}><rect x={x - 5} y={10} width={10} height={26} fill="#f3eedc" /><circle cx={x} cy={6} r={6} fill="#ffe08a" stroke="none" /></g>)}
      </g>
      {/* the dais: raised platform and the presiding desk */}
      <rect x={700} y={760} width={520} height={140} fill="#5a3a22" stroke={L} strokeWidth={lw} />
      {[0, 1, 2].map((i) => <rect key={i} x={680 - i * 30} y={900 + i * 30} width={560 + i * 60} height={30} fill={["#4a3020", "#3f2818", "#352214"][i]} stroke={L} strokeWidth={2} />)}
      <rect y={990} width={1920} height={90} fill="#5b4a3a" />
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={70 + i * 140} cy={1030} r={20} fill="#7a3a2a" opacity={0.5} />)}
      <Paint2 vig={0.5} />
    </g>
  );
};

/** The front of the presiding desk on the dais (occludes the presiding officer below the chest). */
export const DaisDeskFG: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    <rect x={800} y={690} width={320} height={80} fill="#6b4529" />
    <rect x={780} y={676} width={360} height={22} fill="#7c5132" />
    <rect x={830} y={710} width={260} height={46} fill="none" stroke="#4a2c18" strokeWidth={5} />
  </g>
);

/** Senators at their mahogany desks, from behind (foreground arcs). `shakeAt`: fists shaken (the fight). */
export const SenateDesksFG: React.FC<{ shakeAt?: number }> = ({ shakeAt }) => {
  const f = useCurrentFrame();
  const shaking = shakeAt !== undefined && f >= shakeAt;
  const people: [number, number, number][] = [[140, 1000, 1.25], [470, 950, 1.0], [1470, 950, 1.0], [1790, 1000, 1.25], [760, 1010, 0.85], [1170, 1010, 0.85]];
  return (
    <g>
      {people.map(([x, y, k], i) => {
        const sh = shaking ? Math.sin(f * 1.9 + i * 2) * 8 : 0;
        const fist = shaking && i % 2 === 0;
        return (
          <g key={i} transform={`translate(${x + sh} ${y + Math.sin((f + i * 17) / 21) * 3}) scale(${k})`} fill="#1a1510">
            {fist && <path d={`M ${i < 3 ? 70 : -70} -150 L ${i < 3 ? 120 : -120} ${-290 + Math.sin(f * 1.2 + i) * 18}`} stroke="#1a1510" strokeWidth={26} strokeLinecap="round" fill="none" />}
            {fist && <circle cx={i < 3 ? 122 : -122} cy={-300 + Math.sin(f * 1.2 + i) * 18} r={26} />}
            <path d="M -110 200 L -110 -40 Q -110 -150 -40 -165 L 40 -165 Q 110 -150 110 -40 L 110 200 Z" />
            <ellipse cx={0} cy={-215} rx={58} ry={64} />
          </g>
        );
      })}
      <path d="M 0 1080 L 0 1000 Q 960 900 1920 1000 L 1920 1080 Z" fill="#4a2a16" stroke={L} strokeWidth={lw} />
      <path d="M 0 1000 Q 960 900 1920 1000" fill="none" stroke="#6b3e20" strokeWidth={10} />
    </g>
  );
};

// ================================================================== 1850: Taylor's deathbed (White House)
/** After Currier's "Death of Genl. Z. Taylor" (9 July 1850): figured wallpaper, dark damask drape left, mourners
 * standing against the wall, an open window on a hot July night; the cherries and the pitcher of milk. */
export const TaylorRoom: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><pattern id="p2-fig" width={80} height={120} patternUnits="userSpaceOnUse"><rect width={80} height={120} fill="#a9a6a0" /><path d="M 40 10 C 20 40 60 60 40 90 C 30 104 46 112 40 118" stroke="#96928b" strokeWidth={5} fill="none" /><rect x={76} width={4} height={120} fill="#9a968e" /></pattern></defs>
      <rect width={1920} height={1080} fill="url(#p2-fig)" />
      <rect width={1920} height={44} fill="#5a5650" />
      {/* window: hot July night */}
      <rect x={1520} y={160} width={300} height={520} fill="#1d2552" stroke="#e6e1d4" strokeWidth={14} />
      <circle cx={1700} cy={250} r={34} fill="#f1ecd2" />
      <line x1={1670} y1={160} x2={1670} y2={680} stroke="#e6e1d4" strokeWidth={8} /><line x1={1520} y1={420} x2={1820} y2={420} stroke="#e6e1d4" strokeWidth={8} />
      <path d={`M 1500 140 Q ${1560 + Math.sin(f / 20) * 12} 400 1530 700 L 1490 700 Z`} fill="#f2f0e8" opacity={0.85} />
      {/* mourners against the wall (soft, background layer) */}
      {[[700, 1.0], [860, 1.05], [1020, 1.0], [1180, 1.08], [1330, 1.0]].map(([x, k], i) => (
        <g key={i} fill="#4d4a48" transform={`translate(${x} 760) scale(${k})`}>
          <path d="M -70 0 L -70 -230 Q -70 -300 -20 -310 L 20 -310 Q 70 -300 70 -230 L 70 0 Z" /><ellipse cx={0} cy={-350} rx={42} ry={48} />
          <path d="M -12 -300 L 0 -260 L 12 -300 Z" fill="#e6e1d4" />
        </g>
      ))}
      {/* dark damask drape, left */}
      <path d="M 0 0 L 420 0 Q 330 300 360 720 Q 250 640 160 760 Q 100 400 0 380 Z" fill="#2a2628" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M ${60 + i * 60} 20 Q ${80 + i * 50} 300 ${70 + i * 45} 600`} stroke="#3e393b" strokeWidth={6} fill="none" />)}
      <rect y={760} width={1920} height={320} fill="#6a6258" />
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={800 + ((i * 97) % 260)} r={10} fill="#7a7266" />)}
      {/* bedside table: bowl of cherries + pitcher of milk */}
      <g stroke={L} strokeWidth={3}>
        <rect x={1290} y={760} width={220} height={22} fill="#5a3a22" /><rect x={1310} y={782} width={18} height={200} fill="#5a3a22" /><rect x={1472} y={782} width={18} height={200} fill="#5a3a22" />
        <path d="M 1310 736 Q 1360 780 1410 736 Z" fill="#e9e4da" />
        {[[1330, 728], [1348, 722], [1366, 726], [1384, 720], [1356, 712], [1394, 728]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill="#a8162a" />)}
        <path d="M 1440 760 L 1446 680 Q 1470 668 1494 680 L 1500 760 Z" fill="#f4f4f0" /><path d="M 1498 690 Q 1526 700 1500 730" fill="none" strokeWidth={6} />
      </g>
      <Paint2 vig={0.45} warm={false} />
    </g>
  );
};

// ================================================================== 1850: Fillmore's library (the oval room upstairs)
/** Fillmore set up the first White House library in the upstairs oval room: glass-fronted bookcases round the
 * curved wall, yellow drapes, gas chandelier (gas since 1848), and the stump of the Washington Monument outside. */
export const FillmoreLibrary: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="p2-yw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b99c52" /><stop offset="1" stopColor="#d7bf7a" /></linearGradient>
      <linearGradient id="p2-sky50" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fc0dc" /><stop offset="1" stopColor="#e6e9d8" /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#p2-yw)" />
    <path d="M 0 60 Q 960 -10 1920 60 L 1920 0 L 0 0 Z" fill="#7a6234" />
    {/* curved bookcases */}
    {[[40, 640], [1280, 1880]].map(([a, b], k) => (
      <g key={k}>
        <path d={`M ${a} 150 Q ${(a + b) / 2} ${k ? 120 : 180} ${b} ${k ? 180 : 120} L ${b} 860 L ${a} 860 Z`} fill="#4b2b18" stroke={L} strokeWidth={lw} />
        {[0, 1, 2, 3].map((r) => (
          <g key={r}>
            <rect x={a + 24} y={200 + r * 160} width={b - a - 48} height={138} fill="#2a1a0f" />
            {Array.from({ length: Math.floor((b - a - 60) / 28) }, (_, i) => {
              const hh = 86 + rnd(k * 999 + r * 77 + i) * 40; const cols = ["#7a2f2a", "#2f4d3a", "#3c3a63", "#7d5a2a", "#5a2a3a", "#2e3d4f"];
              return <rect key={i} x={a + 30 + i * 28} y={200 + r * 160 + 138 - hh} width={24} height={hh} fill={cols[Math.floor(rnd(k * 31 + r * 7 + i * 3) * 6)]} stroke="#1a110a" strokeWidth={2} />;
            })}
            <rect x={a + 24} y={200 + r * 160} width={b - a - 48} height={138} fill="#cfe3ea" opacity={0.12} />
          </g>
        ))}
      </g>
    ))}
    {/* centre window: the Mall, the Monument's stump */}
    <rect x={760} y={150} width={400} height={600} fill="url(#p2-sky50)" stroke="#efe6cf" strokeWidth={14} />
    <path d="M 760 600 Q 960 560 1160 600 L 1160 750 L 760 750 Z" fill="#8aa66a" />
    <path d="M 760 640 Q 960 620 1160 650 L 1160 680 Q 960 650 760 670 Z" fill="#7d9fb8" />
    <g stroke={L} strokeWidth={3}><path d="M 1020 600 L 1026 520 L 1050 520 L 1056 600 Z" fill="#f2efe6" /><line x1={1038} y1={520} x2={1038} y2={480} /><line x1={1038} y1={480} x2={1070} y2={510} /></g>
    <line x1={960} y1={150} x2={960} y2={750} stroke="#efe6cf" strokeWidth={8} />
    {[300, 450, 600].map((y) => <line key={y} x1={760} y1={y} x2={1160} y2={y} stroke="#efe6cf" strokeWidth={6} />)}
    <path d="M 700 110 L 820 110 Q 790 420 830 780 L 690 780 Z" fill="#d9a520" stroke={L} strokeWidth={3} /><path d="M 1220 110 L 1100 110 Q 1130 420 1090 780 L 1230 780 Z" fill="#d9a520" stroke={L} strokeWidth={3} />
    <rect x={680} y={96} width={560} height={24} rx={8} fill="#a7843a" stroke={L} strokeWidth={3} />
    {/* gas chandelier */}
    <g stroke="#3a2a1a" strokeWidth={5}><line x1={960} y1={0} x2={960} y2={80} /><path d="M 860 110 Q 960 150 1060 110" fill="none" strokeWidth={8} stroke="#9a7a3a" />{[860, 960, 1060].map((x) => <g key={x}><ellipse cx={x} cy={100} rx={18} ry={22} fill="#f6f0d8" opacity={0.9} /></g>)}</g>
    <rect y={860} width={1920} height={220} fill="#5c3a22" />
    <ellipse cx={960} cy={990} rx={860} ry={100} fill="#7a5a2a" opacity={0.8} />
    <ellipse cx={960} cy={990} rx={760} ry={80} fill="none" stroke="#c9a14a" strokeWidth={8} />
    <Paint2 vig={0.4} />
  </g>
);

/** Fillmore's writing desk (foreground). `top` = y of the desk top edge. Papers stacked on it pop in at `stackAt`. */
export const LibraryDeskFG: React.FC<{ top: number; x0?: number; x1?: number; stackAt?: number[] }> = ({ top, x0 = 520, x1 = 1400, stackAt = [] }) => {
  const f = useCurrentFrame();
  return (
    <g stroke={L} strokeWidth={lw}>
      <rect x={x0} y={top} width={x1 - x0} height={40} fill="#7a4626" />
      <rect x={x0 + 30} y={top + 40} width={x1 - x0 - 60} height={1080 - top} fill="#5a3219" />
      {[0, 1].map((i) => <rect key={i} x={x0 + 70 + i * (x1 - x0 - 320)} y={top + 80} width={180} height={150} fill="#4a2814" />)}
      {stackAt.map((at, i) => {
        if (f < at) return null;
        const d = interpolate(f - at, [0, 6], [-220, 0], { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
        return <g key={i} transform={`translate(${x1 - 210 + (i % 2) * 6} ${top - 10 - i * 12 + d}) rotate(${(i % 2 ? 3 : -2)})`}>
          <rect x={-90} y={-10} width={180} height={14} fill="#f3ecd8" />
        </g>;
      })}
    </g>
  );
};

// ================================================================== 1850: the Compromise bundle (insert)
/** Five acts tied in red tape, tagged "A FINAL SETTLEMENT" (Fillmore's own words, Dec. 1850). At `ripAt` the
 * bundle tears in two: a 1-frame lift, the halves swap apart, a 2-frame red slash. */
export const BundleInsert: React.FC<{ ripAt: number }> = ({ ripAt }) => {
  const f = useCurrentFrame();
  const r = f >= ripAt;
  const lift = f >= ripAt - 1 && f < ripAt ? -14 : 0;
  const apart = r ? interpolate(f - ripAt, [0, 8], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 0;
  const docs = (clip: "l" | "r" | "all") => (
    <g clipPath={clip === "all" ? undefined : `url(#p2-half-${clip})`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${(i - 2) * 14} ${-i * 22}) rotate(${(i % 2 ? 1.5 : -1.5)} 960 560)`}>
          <rect x={560} y={330} width={800} height={460} fill={["#efe3c3", "#f2e8cc", "#ebdfbd", "#f0e6c8", "#ece0c0"][i]} stroke="#7a5d34" strokeWidth={4} />
        </g>
      ))}
      <text x={960} y={330} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={58} fill="#2e1e10">THE COMPROMISE OF 1850</text>
      {Array.from({ length: 5 }, (_, i) => <line key={i} x1={640} y1={400 + i * 50} x2={1270 - (i % 2) * 80} y2={400 + i * 50} stroke="#8a7656" strokeWidth={6} />)}
      <rect x={930} y={220} width={60} height={600} fill="#b8241f" stroke={L} strokeWidth={3} />
      <rect x={540} y={520} width={840} height={56} fill="#b8241f" stroke={L} strokeWidth={3} />
      <g transform="rotate(-6 1250 690)"><rect x={1110} y={640} width={300} height={110} fill="#f6efd9" stroke={L} strokeWidth={4} /><circle cx={1130} cy={695} r={10} fill="#b8241f" />
        <text x={1265} y={688} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={30} fill="#2e1e10">"A final</text>
        <text x={1265} y={726} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={30} fill="#2e1e10">settlement"</text></g>
    </g>
  );
  return (
    <g>
      <defs>
        <clipPath id="p2-half-l"><path d="M 0 0 L 980 0 L 940 300 L 990 520 L 930 760 L 970 1080 L 0 1080 Z" /></clipPath>
        <clipPath id="p2-half-r"><path d="M 980 0 L 1920 0 L 1920 1080 L 970 1080 L 930 760 L 990 520 L 940 300 Z" /></clipPath>
      </defs>
      <rect width={1920} height={1080} fill="#4a2a16" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M 0 ${50 + i * 90} Q 960 ${80 + i * 90} 1920 ${40 + i * 90}`} stroke="#3c2210" strokeWidth={6} fill="none" />)}
      <g transform={`translate(0 ${lift + 60})`}>
        {!r ? docs("all") : (<>
          <g transform={`translate(${-160 * apart} ${40 * apart}) rotate(${-9 * apart} 600 600)`}>{docs("l")}</g>
          <g transform={`translate(${160 * apart} ${50 * apart}) rotate(${10 * apart} 1300 600)`}>{docs("r")}</g>
        </>)}
      </g>
      {r && f < ripAt + 2 && <path d="M 900 120 L 1010 400 L 930 560 L 1040 960" stroke="#e02b2b" strokeWidth={30} fill="none" strokeLinecap="round" />}
      <Paint2 vig={0.5} />
    </g>
  );
};

// ================================================================== 1851: Boston, the "CAUTION!!" broadside
/** A brick wall on a Boston street at night under a gas lamp, with Theodore Parker's broadside of 24 April 1851
 * warning the city's Black residents that police now act as kidnappers and slave catchers. */
export const BostonWall: React.FC = () => {
  const f = useCurrentFrame();
  const fl = 1 + Math.sin(f / 3.3) * 0.03;
  return (
    <g>
      <defs>
        <pattern id="p2-brick" width={120} height={60} patternUnits="userSpaceOnUse"><rect width={120} height={60} fill="#6a3a2e" /><rect x={2} y={2} width={56} height={26} fill="#7a4434" /><rect x={62} y={2} width={56} height={26} fill="#733f31" /><rect x={-28} y={32} width={56} height={26} fill="#77422f" /><rect x={32} y={32} width={56} height={26} fill="#6f3c2e" /><rect x={92} y={32} width={56} height={26} fill="#7a4434" /></pattern>
        <radialGradient id="p2-gas" cx={1640} cy={300} r={900} gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#ffd88a" stopOpacity={0.45} /><stop offset="1" stopColor="#ffd88a" stopOpacity={0} /></radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#p2-brick)" />
      <rect y={900} width={1920} height={180} fill="#4a4a52" />
      {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M ${i * 84} 1080 L ${i * 84 + 30} 900`} stroke="#3a3a42" strokeWidth={4} />)}
      {/* old torn posters */}
      <g transform="rotate(4 260 400)"><rect x={120} y={260} width={280} height={360} fill="#cdbf9a" opacity={0.8} /><path d="M 120 520 L 200 560 L 260 520 L 400 600 L 400 620 L 120 620 Z" fill="#6a3a2e" /></g>
      {/* the broadside */}
      <g transform="rotate(-1.5 960 500)" fontFamily={SERIF} textAnchor="middle" fill="#1d1712">
        <rect x={560} y={60} width={800} height={860} fill="#000" opacity={0.3} transform="translate(12 14)" />
        <rect x={560} y={60} width={800} height={860} fill="#e9dfc2" stroke="#7a6a4a" strokeWidth={4} />
        <text x={960} y={210} fontWeight={700} fontSize={150} letterSpacing={6}>CAUTION!!</text>
        <text x={960} y={290} fontWeight={700} fontSize={50}>COLORED PEOPLE</text>
        <text x={960} y={350} fontWeight={700} fontSize={50}>OF BOSTON, ONE &amp; ALL,</text>
        <text x={960} y={410} fontStyle="italic" fontSize={28}>You are hereby respectfully CAUTIONED and</text>
        <text x={960} y={446} fontStyle="italic" fontSize={28}>advised, to avoid conversing with the</text>
        <text x={960} y={500} fontWeight={700} fontSize={40}>Watchmen and Police Officers</text>
        <text x={960} y={546} fontStyle="italic" fontSize={28}>of Boston, for they are empowered to act as</text>
        <text x={960} y={620} fontWeight={700} fontSize={70}>KIDNAPPERS</text>
        <text x={960} y={680} fontWeight={700} fontSize={44}>AND SLAVE CATCHERS</text>
        <text x={960} y={760} fontWeight={700} fontSize={36}>Keep a Sharp Look Out for</text>
        <text x={960} y={820} fontWeight={700} fontSize={56}>KIDNAPPERS</text>
        <text x={960} y={886} fontStyle="italic" fontSize={26}>APRIL 24, 1851.</text>
      </g>
      {/* gas lamp */}
      <g stroke={L} strokeWidth={4} transform="translate(1640 300)">
        <rect x={-10} y={30} width={20} height={680} fill="#1f1f22" />
        <path d="M -40 30 L 40 30 L 28 -50 L -28 -50 Z" fill="#f6dc8a" opacity={0.9} />
        <path d="M -48 -50 L 48 -50 L 0 -90 Z" fill="#1f1f22" />
        <ellipse cx={0} cy={-10} rx={14 * fl} ry={20 * fl} fill="#fff3c4" stroke="none" />
      </g>
      <rect width={1920} height={1080} fill="#0b1030" opacity={0.42} style={{ mixBlendMode: "multiply" }} />
      <rect width={1920} height={1080} fill="url(#p2-gas)" style={{ mixBlendMode: "screen" }} />
      <Paint2 vig={0.6} warm={false} />
    </g>
  );
};

// ================================================================== 1852: the Whig convention, Baltimore
/** The Maryland Institute hall, Baltimore, June 1852: iron columns, galleries hung with bunting, state standards
 * on poles, the stage; the SCOTT & GRAHAM banner unrolls at `bannerAt`. Delegates from behind: DelegatesFG. */
export const WhigConvention: React.FC<{ bannerAt?: number }> = ({ bannerAt = 0 }) => {
  const f = useCurrentFrame();
  const unroll = interpolate(f - bannerAt, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <g>
      <rect width={1920} height={1080} fill="#c7b48e" />
      <rect width={1920} height={120} fill="#8a7654" />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M ${i * 200} 120 L ${i * 200 + 100} 0 L ${i * 200 + 200} 120`} stroke="#6b5a3e" strokeWidth={8} fill="none" />)}
      {/* gallery */}
      <rect y={300} width={1920} height={70} fill="#e6dcc3" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${i * 160} 300 Q ${i * 160 + 80} 380 ${i * 160 + 160} 300`} fill="#b8362f" stroke={L} strokeWidth={2} />)}
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${i * 160 + 10} 310 Q ${i * 160 + 80} 360 ${i * 160 + 150} 310`} fill="none" stroke="#f2ede0" strokeWidth={10} />)}
      {Array.from({ length: 40 }, (_, i) => <ellipse key={i} cx={20 + i * 48} cy={282} rx={17} ry={19} fill={i % 3 ? "#3a302a" : "#5a4a5a"} />)}
      {[240, 720, 1200, 1680].map((x) => <g key={x}><rect x={x - 16} y={370} width={32} height={530} fill="#5a5a60" stroke={L} strokeWidth={3} /><rect x={x - 26} y={370} width={52} height={20} fill="#46464c" /></g>)}
      {/* stage + banner */}
      <rect x={420} y={640} width={1080} height={80} fill="#6b4529" stroke={L} strokeWidth={lw} />
      <rect x={420} y={620} width={1080} height={24} fill="#2b3f74" />
      <line x1={600} y1={410} x2={1320} y2={410} stroke={L} strokeWidth={8} />
      <g>
        <defs><clipPath id="p2-unroll"><rect x={600} y={410} width={720} height={190 * unroll} /></clipPath></defs>
        <g clipPath="url(#p2-unroll)" stroke={L} strokeWidth={lw}>
          <rect x={620} y={410} width={680} height={190} fill="#f2ead2" />
          <text x={960} y={490} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={70} fill="#2b3f74" stroke="none">SCOTT</text>
          <text x={960} y={560} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={42} fill="#b8362f" stroke="none">AND GRAHAM</text>
        </g>
        <rect x={610} y={404 + 190 * unroll} width={700} height={18} rx={9} fill="#8a6a2e" stroke={L} strokeWidth={3} />
      </g>
      {/* state standards */}
      {[["N.Y.", 300, 560], ["PA.", 560, 600], ["OHIO", 1380, 590], ["VA.", 1640, 560], ["MASS.", 960, 760]].map(([t, x, y], i) => (
        <g key={i} transform={`translate(${x} ${(y as number) + Math.sin(f / 12 + i) * 6})`} stroke={L} strokeWidth={3}>
          <line x1={0} y1={0} x2={0} y2={300} strokeWidth={6} /><rect x={-70} y={-50} width={140} height={60} fill="#f2ead2" />
          <text y={-8} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={32} fill="#1d1712" stroke="none">{t}</text>
        </g>
      ))}
      <rect y={720} width={1920} height={360} fill="#6e5a40" />
      <Paint2 vig={0.4} />
    </g>
  );
};

// ================================================================== 1865: the Capitol, East Front, 4 March
/** After the photograph of the 1865 inauguration: the East Front with its portico and the new dome, finished
 * outside (Freedom placed Dec. 1863), the wooden inaugural stand with bunting, a big crowd, mud after rain. */
export const CapitolEast1865: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="p2-sky65" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8a96a3" /><stop offset="0.6" stopColor="#c8cbc4" /><stop offset="1" stopColor="#e2dccb" /></linearGradient>
        <linearGradient id="p2-domeg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f4f2ec" /><stop offset="0.6" stopColor="#e4e1d8" /><stop offset="1" stopColor="#b9b6ad" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#p2-sky65)" />
      <Cloud x={200 + f * 0.25} y={140} s={1.6} c="#b9bcbc" o={0.8} /><Cloud x={1500 + f * 0.2} y={200} s={1.4} c="#c9cbc6" o={0.7} />
      <path d="M 1300 0 L 1920 0 L 1920 380 Z" fill="#fff6d0" opacity={0.18} />
      {/* dome: drum colonnade, cap, lantern, Freedom */}
      <g stroke={L} strokeWidth={3}>
        <rect x={720} y={300} width={480} height={70} fill="url(#p2-domeg)" />
        {Array.from({ length: 16 }, (_, i) => <rect key={i} x={728 + i * 30} y={306} width={12} height={60} fill="#d4d0c6" stroke="none" />)}
        <rect x={700} y={290} width={520} height={14} fill="#ebe8e0" />
        <path d="M 760 290 Q 760 140 960 120 Q 1160 140 1160 290 Z" fill="url(#p2-domeg)" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${790 + i * 42} 290 Q ${820 + i * 35} 170 960 124`} fill="none" stroke="#c9c5bb" strokeWidth={3} />)}
        <rect x={930} y={70} width={60} height={56} fill="#ebe8e0" />
        <path d="M 920 72 Q 960 40 1000 72 Z" fill="#e4e1d8" />
        <path d="M 952 42 L 956 6 L 964 6 L 968 42 Z" fill="#6b6a64" /><circle cx={960} cy={2} r={8} fill="#6b6a64" />
      </g>
      {/* main block + wings */}
      <rect x={120} y={370} width={1680} height={330} fill="#ece9e1" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={160 + i * 56} y={410} width={22} height={60} fill="#7a838c" opacity={i > 11 && i < 19 ? 0 : 0.9} />)}
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={160 + i * 56} y={520} width={22} height={70} fill="#7a838c" opacity={i > 11 && i < 19 ? 0 : 0.9} />)}
      {/* central portico */}
      <path d="M 700 380 L 960 300 L 1220 380 Z" fill="#f2f0ea" stroke={L} strokeWidth={lw} />
      <rect x={700} y={376} width={520} height={24} fill="#e9e6de" stroke={L} strokeWidth={3} />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={712 + i * 66} y={400} width={30} height={260} fill="#f7f5f0" stroke={L} strokeWidth={2} />)}
      {/* inaugural stand */}
      <path d="M 440 660 L 1480 660 L 1540 760 L 380 760 Z" fill="#8a6a46" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={400 + i * 4} y1={670 + i * 9} x2={1520 - i * 4} y2={670 + i * 9} stroke="#6b4e32" strokeWidth={2} />)}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M ${400 + i * 160} 660 Q ${480 + i * 160} 710 ${560 + i * 160} 660`} fill="#b8362f" stroke="#f2ede0" strokeWidth={6} />)}
      {/* dignitaries on the stand (small) */}
      {Array.from({ length: 26 }, (_, i) => <g key={i} fill="#232020"><rect x={460 + i * 38} y={612} width={22} height={48} /><circle cx={471 + i * 38} cy={604} r={10} />{i % 3 === 0 && <rect x={464 + i * 38} y={580} width={14} height={16} />}</g>)}
      <g transform="translate(1380 520)" stroke={L} strokeWidth={2}><line x1={0} y1={0} x2={0} y2={140} strokeWidth={5} />
        <path d={`M 2 4 Q 60 ${16 + Math.sin(f / 8) * 8} 120 6 L 120 70 Q 60 ${80 + Math.sin(f / 8) * 8} 2 68 Z`} fill="#f2ede0" />
        {[0, 1, 2, 3].map((r) => <path key={r} d={`M 2 ${12 + r * 16} Q 60 ${24 + r * 16 + Math.sin(f / 8) * 8} 120 ${14 + r * 16}`} stroke="#b8362f" strokeWidth={7} fill="none" />)}
        <rect x={2} y={4} width={46} height={34} fill="#2b3f74" /></g>
      {/* muddy plaza */}
      <rect y={760} width={1920} height={320} fill="#7a6a52" />
      {Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={(i * 173) % 1920} cy={800 + ((i * 71) % 240)} rx={90} ry={14} fill="#a9a395" opacity={0.5} />)}
      <Crowd x0={0} x1={1920} y={890} n={26} s={0.42} color="#2a2522" hats={0.7} seed={5} bonnets={0.5} />
      <Paint2 vig={0.35} warm={false} />
    </g>
  );
};

// ================================================================== 1859-68: the Senate Chamber (new wing)
/** The Senate's 1859 chamber: rectangular hall, iron-and-glass ceiling with painted panels, galleries on all four
 * sides, the rostrum with the presiding chair. `trial`: the 1868 Court of Impeachment dressing (Chief Justice in
 * his black robe presiding, the managers' long table, the galleries packed with ticket-holders). */
export const Senate1859: React.FC<{ trial?: boolean }> = ({ trial }) => (
  <g>
    <defs>
      <linearGradient id="p2-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9d58f" /><stop offset="1" stopColor="#c9b06a" /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="#c4b38c" />
    {/* ceiling: glass panels in iron frames */}
    <rect width={1920} height={150} fill="url(#p2-glass)" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 160 + 10} y={10} width={140} height={120} fill="none" stroke="#7a6232" strokeWidth={6} />)}
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={i * 160 + 80} cy={70} r={26} fill={["#b8362f", "#2b3f74", "#4a7a4a"][i % 3]} opacity={0.6} />)}
    <rect y={150} width={1920} height={40} fill="#d9c9a0" stroke={L} strokeWidth={3} />
    {/* galleries */}
    <rect y={190} width={1920} height={200} fill="#8a7458" />
    {Array.from({ length: 3 }, (_, r) => Array.from({ length: 46 }, (_, i) => {
      const x = 18 + i * 42 + (r % 2) * 20; const y = 250 + r * 50;
      const dense = trial || rnd(i * 7 + r) < 0.75;
      if (!dense) return null;
      const lady = rnd(i * 3 + r * 11) < (trial ? 0.4 : 0.55);
      return <g key={`${r}${i}`}><ellipse cx={x} cy={y} rx={15} ry={17} fill={lady ? "#5a4a5a" : "#3a302a"} />
        <path d={`M ${x - 20} ${y + 50} L ${x - 18} ${y + 14} L ${x + 18} ${y + 14} L ${x + 20} ${y + 50} Z`} fill={lady ? ["#7a4a6a", "#4a6a7a", "#8a6a3a"][i % 3] : "#2a2420"} /></g>;
    }))}
    <rect y={380} width={1920} height={50} fill="#d9c9a0" stroke={L} strokeWidth={lw} />
    {Array.from({ length: 48 }, (_, i) => <rect key={i} x={i * 40 + 8} y={388} width={12} height={34} fill="#b9a678" />)}
    {/* back wall, doors, pilasters */}
    <rect y={430} width={1920} height={470} fill="#b9a47a" />
    {[120, 480, 1440, 1800].map((x) => <rect key={x} x={x - 22} y={430} width={44} height={470} fill="#a89266" stroke={L} strokeWidth={2} />)}
    {[300, 1620].map((x) => <path key={x} d={`M ${x - 60} 900 L ${x - 60} 600 Q ${x} 540 ${x + 60} 600 L ${x + 60} 900 Z`} fill="#4a3020" stroke={L} strokeWidth={3} />)}
    {/* rostrum */}
    <rect x={620} y={520} width={680} height={130} fill="#6b4529" stroke={L} strokeWidth={lw} />
    <rect x={600} y={506} width={720} height={20} fill="#efe9da" stroke={L} strokeWidth={3} />
    <rect x={560} y={650} width={800} height={250} fill="#5a3a22" stroke={L} strokeWidth={lw} />
    <rect x={540} y={636} width={840} height={20} fill="#efe9da" stroke={L} strokeWidth={3} />
    {[620, 760, 1160, 1300].map((x) => <rect key={x} x={x - 14} y={666} width={28} height={234} fill="#4a2c18" />)}
    {/* presiding chair (+ the Chief Justice in black at the trial) */}
    <path d="M 900 520 L 900 420 Q 960 390 1020 420 L 1020 520 Z" fill="#7c1f2e" stroke={L} strokeWidth={3} />
    {trial && <g fill="#121014"><path d="M 910 520 L 915 440 Q 960 420 1005 440 L 1010 520 Z" /><circle cx={960} cy={420} r={26} fill="#d9c7b0" /><path d="M 934 410 Q 960 380 986 410 Q 960 396 934 410 Z" fill="#e8e4dc" /></g>}
    {/* flags draped at the inauguration */}
    {!trial && [470, 1450].map((x, i) => (
      <g key={i} stroke={L} strokeWidth={2} transform={`translate(${x} 470) scale(${i ? -1 : 1} 1)`}>
        <path d="M 0 0 Q 60 120 20 300 L 90 300 Q 120 140 90 0 Z" fill="#f2ede0" />
        {[0, 1, 2].map((r) => <path key={r} d={`M ${18 + r * 24} 6 Q ${70 + r * 10} 140 ${36 + r * 20} 296`} stroke="#b8362f" strokeWidth={10} fill="none" />)}
        <path d="M 0 0 L 50 0 Q 50 60 26 90 Z" fill="#2b3f74" />
      </g>
    ))}
    {/* floor */}
    <rect y={900} width={1920} height={180} fill="#7a3a2e" />
    {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={(i * 263) % 1920} cy={930 + ((i * 59) % 140)} r={12} fill="#9a5a3a" opacity={0.6} />)}
    <Paint2 vig={0.4} />
  </g>
);

/** Senators' desks + seated senators from behind (foreground arc); at the trial also the managers' long table. */
export const Senate1859FG: React.FC<{ trial?: boolean }> = ({ trial }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {trial && <g stroke={L} strokeWidth={lw}>
        <path d="M 380 880 L 1540 880 L 1600 960 L 320 960 Z" fill="#6b4529" />
        {[[500, 890], [700, 900], [1000, 892], [1260, 898]].map(([x, y], i) => <rect key={i} x={x} y={y} width={120} height={40} fill="#f1ead6" strokeWidth={2} transform={`rotate(${i % 2 ? 4 : -3} ${x} ${y})`} />)}
        <path d="M 1420 880 L 1430 840 L 1460 840 L 1470 880 Z" fill="#c9c6ba" />
      </g>}
      {[[150, 1010, 1.25], [480, 990, 1.05], [1440, 990, 1.05], [1770, 1010, 1.25]].map(([x, y, k], i) => (
        <g key={i} transform={`translate(${x} ${y + Math.sin((f + i * 19) / 23) * 3}) scale(${k})`} fill="#1a1510">
          <path d="M -110 200 L -110 -40 Q -110 -150 -40 -165 L 40 -165 Q 110 -150 110 -40 L 110 200 Z" /><ellipse cx={0} cy={-215} rx={58} ry={64} />
        </g>
      ))}
      <path d="M 0 1080 L 0 1010 Q 960 940 1920 1010 L 1920 1080 Z" fill="#4a2a16" stroke={L} strokeWidth={lw} />
    </g>
  );
};

// ================================================================== 1865: Kirkwood House, 15 April
/** Johnson's rooms at the Kirkwood House hotel, the morning Lincoln died: dark green floral paper, a rain-streaked
 * window, the mantel mirror hung with black crepe, gas brackets, the table with the Bible (see ParlorTableFG). */
export const KirkwoodParlor: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><pattern id="p2-kfl" width={70} height={70} patternUnits="userSpaceOnUse"><rect width={70} height={70} fill="#3e4a3a" /><circle cx={35} cy={35} r={8} fill="#4a5844" /><circle cx={0} cy={0} r={5} fill="#465240" /><circle cx={70} cy={70} r={5} fill="#465240" /></pattern></defs>
      <rect width={1920} height={1080} fill="url(#p2-kfl)" />
      <rect width={1920} height={50} fill="#2a2620" /><rect y={50} width={1920} height={12} fill="#6b5a3e" />
      <rect y={680} width={1920} height={16} fill="#6b5a3e" /><rect y={696} width={1920} height={180} fill="#3a2a1c" />
      {/* rainy window */}
      <rect x={160} y={150} width={340} height={520} fill="#6f7a86" stroke="#d9d2c0" strokeWidth={14} />
      <line x1={330} y1={150} x2={330} y2={670} stroke="#d9d2c0" strokeWidth={8} /><line x1={160} y1={410} x2={500} y2={410} stroke="#d9d2c0" strokeWidth={8} />
      {Array.from({ length: 22 }, (_, i) => { const x = 170 + rnd(i) * 320; const y = 160 + ((f * (4 + rnd(i + 5) * 4) + rnd(i + 9) * 500) % 500); return <line key={i} x1={x} y1={y} x2={x - 3} y2={y + 26} stroke="#c9d3dc" strokeWidth={3} opacity={0.7} />; })}
      <path d="M 110 120 L 210 120 Q 190 420 230 700 L 100 700 Z" fill="#2a2a2e" stroke={L} strokeWidth={3} /><path d="M 550 120 L 450 120 Q 470 420 430 700 L 560 700 Z" fill="#2a2a2e" stroke={L} strokeWidth={3} />
      {/* mantel + crepe-hung mirror, gas brackets */}
      <g stroke={L} strokeWidth={lw}>
        <rect x={1260} y={170} width={340} height={300} fill="#a7843a" /><rect x={1280} y={190} width={300} height={260} fill="#8f989c" />
        <path d="M 1250 160 L 1440 160 Q 1350 260 1250 340 Z" fill="#0f0d0d" /><path d="M 1610 160 L 1420 160 Q 1510 260 1610 340 Z" fill="#0f0d0d" />
        <rect x={1220} y={470} width={420} height={30} fill="#2a1d14" /><rect x={1240} y={500} width={380} height={190} fill="#4a3020" /><rect x={1330} y={540} width={200} height={150} fill="#140e0a" />
        {[1180, 1680].map((x) => <g key={x}><path d={`M ${x} 330 L ${x} 300 L ${x + (x < 1400 ? 30 : -30)} 290`} fill="none" strokeWidth={6} /><ellipse cx={x + (x < 1400 ? 30 : -30)} cy={276} rx={14} ry={18} fill="#f6e6b0" /></g>)}
      </g>
      <rect y={876} width={1920} height={204} fill="#4a3220" />
      <ellipse cx={960} cy={990} rx={760} ry={80} fill="#5a2a2a" />
      <rect width={1920} height={1080} fill="#1a2030" opacity={0.18} style={{ mixBlendMode: "multiply" }} />
      <Paint2 vig={0.5} warm={false} />
    </g>
  );
};

// ================================================================== 1866-68: the President's office (Johnson)
/** The second-floor President's office: dark green flocked paper, Andrew Jackson's portrait over the marble
 * mantel, rolled maps on stands, a gasolier, crimson drapes; out of the window, the Washington Monument stalled
 * at its stump. The big cabinet table is the foreground occluder (OfficeTableFG). */
export const JohnsonOffice: React.FC = () => (
  <g>
    <defs>
      <pattern id="p2-flock" width={80} height={90} patternUnits="userSpaceOnUse"><rect width={80} height={90} fill="#2f4a36" /><path d="M 40 10 C 24 30 24 50 40 66 C 56 50 56 30 40 10 Z" fill="#36553e" /></pattern>
      <linearGradient id="p2-sky66" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9db6cf" /><stop offset="1" stopColor="#dfe3d6" /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#p2-flock)" />
    <rect width={1920} height={56} fill="#22301f" /><rect y={56} width={1920} height={14} fill="#b08a3c" />
    <rect y={660} width={1920} height={16} fill="#b08a3c" /><rect y={676} width={1920} height={200} fill="#3e2a1a" />
    {/* window + the Monument stump */}
    <rect x={1300} y={140} width={300} height={520} fill="url(#p2-sky66)" stroke="#e6dcc3" strokeWidth={14} />
    <path d="M 1300 520 Q 1450 500 1600 520 L 1600 660 L 1300 660 Z" fill="#8aa66a" /><path d="M 1300 560 Q 1450 545 1600 565 L 1600 590 Q 1450 575 1300 590 Z" fill="#7d9fb8" />
    <g stroke={L} strokeWidth={3}><path d="M 1430 530 L 1436 440 L 1468 440 L 1474 530 Z" fill="#f2efe6" /><path d="M 1452 440 L 1452 400 L 1490 432" fill="none" strokeWidth={3} /></g>
    <line x1={1450} y1={140} x2={1450} y2={660} stroke="#e6dcc3" strokeWidth={8} />{[310, 480].map((y) => <line key={y} x1={1300} y1={y} x2={1600} y2={y} stroke="#e6dcc3" strokeWidth={6} />)}
    <path d="M 1240 110 L 1350 110 Q 1320 400 1360 680 L 1230 680 Z" fill="#7a1f2a" stroke={L} strokeWidth={3} /><path d="M 1660 110 L 1550 110 Q 1580 400 1540 680 L 1670 680 Z" fill="#7a1f2a" stroke={L} strokeWidth={3} />
    {/* marble mantel + Jackson portrait */}
    <Portrait x={330} y={110} w={260} h={320} c="andrew_jackson" />
    <g stroke={L} strokeWidth={lw}><rect x={270} y={470} width={380} height={30} fill="#ece6d8" /><rect x={290} y={500} width={340} height={200} fill="#e3ddd0" /><rect x={370} y={540} width={180} height={160} fill="#1e1510" /></g>
    {/* map stands */}
    {[760, 1780].map((x, i) => (
      <g key={x} stroke={L} strokeWidth={3}>
        <line x1={x - 50} y1={860} x2={x} y2={300} strokeWidth={6} /><line x1={x + 50} y1={860} x2={x} y2={300} strokeWidth={6} />
        <rect x={x - 90} y={300} width={180} height={220} fill="#d9caa0" /><path d={`M ${x - 70} ${360} Q ${x} ${330 + i * 20} ${x + 60} 380 L ${x + 40} 470 Q ${x - 20} 430 ${x - 70} 470 Z`} fill="#b9c79a" />
        <rect x={x - 96} y={290} width={192} height={18} rx={9} fill="#8a6a2e" />
      </g>
    ))}
    {/* gasolier */}
    <g stroke="#3a2a1a" strokeWidth={5}><line x1={960} y1={56} x2={960} y2={150} /><path d="M 860 180 Q 960 220 1060 180" fill="none" strokeWidth={8} stroke="#9a7a3a" />{[860, 930, 990, 1060].map((x) => <ellipse key={x} cx={x} cy={170} rx={14} ry={18} fill="#f6f0d8" opacity={0.9} />)}</g>
    <rect y={876} width={1920} height={204} fill="#5a3a26" />
    <Paint2 vig={0.45} />
  </g>
);

/** The cabinet table (foreground) with bills piled on it; bills drop in at `billsAt`. */
export const OfficeTableFG: React.FC<{ billsAt?: number[] }> = ({ billsAt = [] }) => {
  const f = useCurrentFrame();
  return (
    <g stroke={L} strokeWidth={lw}>
      <path d="M 180 800 L 1740 800 L 1840 1080 L 80 1080 Z" fill="#6b4529" />
      <path d="M 180 800 L 1740 800 L 1746 826 L 174 826 Z" fill="#7c5132" />
      <rect x={300} y={820} width={140} height={46} fill="#1d1d2b" strokeWidth={3} />
      {billsAt.map((at, i) => {
        if (f < at) return null;
        const d = interpolate(f - at, [0, 6], [-500, 0], { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
        return <g key={i} transform={`translate(${1340 + (i % 2) * 14} ${812 - i * 16 + d}) rotate(${i % 2 ? 4 : -3})`}>
          <rect x={-150} y={-12} width={300} height={22} fill="#f3ecd8" strokeWidth={3} />
        </g>;
      })}
    </g>
  );
};

/** The VETO rubber stamp (sheet prop) coming down on the civil rights bill (insert). */
export const CivilRightsBill: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#3e2a1a" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M 0 ${50 + i * 90} Q 960 ${80 + i * 90} 1920 ${40 + i * 90}`} stroke="#33220f" strokeWidth={6} fill="none" />)}
    <g transform="rotate(-3 960 560)">
      <rect x={460} y={90} width={1000} height={940} fill="#000" opacity={0.35} transform="translate(16 20)" />
      <rect x={460} y={90} width={1000} height={940} fill="#efe3c3" stroke="#7a5d34" strokeWidth={5} />
      <text x={960} y={200} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={50} fill="#2e1e10">AN ACT</text>
      <text x={960} y={270} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={34} fill="#2e1e10">to protect all Persons in the United States</text>
      <text x={960} y={316} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={34} fill="#2e1e10">in their Civil Rights</text>
      <text x={960} y={420} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={70} fill="#2e1e10">CIVIL RIGHTS BILL</text>
      <text x={960} y={480} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={40} fill="#2e1e10">1866</text>
      {Array.from({ length: 7 }, (_, i) => <line key={i} x1={560} y1={560 + i * 56} x2={1360 - (i % 3) * 90} y2={560 + i * 56} stroke="#8a7656" strokeWidth={6} />)}
    </g>
    <Paint2 vig={0.5} />
  </g>
);

// ================================================================== 1868: the Hall of the House
/** The House chamber of 1857: glass ceiling with the state seals, galleries round, the Speaker's white-marble
 * rostrum and flag; members (silhouettes) on the floor. `votedAt`: hands go up for impeachment. */
export const HouseHall1868: React.FC<{ votedAt?: number }> = ({ votedAt }) => {
  const f = useCurrentFrame();
  const voted = votedAt !== undefined && f >= votedAt;
  return (
    <g>
      <rect width={1920} height={1080} fill="#b7a27a" />
      <rect width={1920} height={170} fill="#d9c58a" />
      {Array.from({ length: 2 }, (_, r) => Array.from({ length: 12 }, (_, i) => (
        <g key={`${r}${i}`}><rect x={i * 160 + 12} y={10 + r * 80} width={136} height={70} fill="#e9d79a" stroke="#8a6a2e" strokeWidth={5} />
          <circle cx={i * 160 + 80} cy={45 + r * 80} r={22} fill={["#b8362f", "#2b3f74", "#4a7a4a", "#8a6a2e"][(i + r) % 4]} opacity={0.7} /></g>
      )))}
      <rect y={170} width={1920} height={30} fill="#efe2c0" stroke={L} strokeWidth={3} />
      <rect y={200} width={1920} height={180} fill="#7a654a" />
      {Array.from({ length: 3 }, (_, r) => Array.from({ length: 46 }, (_, i) => <ellipse key={`${r}${i}`} cx={18 + i * 42 + (r % 2) * 20} cy={250 + r * 50} rx={15} ry={17} fill={rnd(i + r * 50) < 0.35 ? "#5a4a5a" : "#3a302a"} />))}
      <rect y={370} width={1920} height={46} fill="#e6d8b6" stroke={L} strokeWidth={lw} />
      <rect y={416} width={1920} height={480} fill="#a89066" />
      {/* Speaker's rostrum + flag */}
      <g stroke={L} strokeWidth={lw}>
        <rect x={660} y={560} width={600} height={150} fill="#efe9da" />
        <rect x={620} y={700} width={680} height={200} fill="#5a3a22" />
        <rect x={600} y={690} width={720} height={20} fill="#efe9da" />
        <path d="M 760 430 Q 960 470 1160 430 L 1160 560 L 760 560 Z" fill="#f2ede0" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M 760 ${446 + i * 30} Q 960 ${486 + i * 30} 1160 ${446 + i * 30}`} stroke="#b8362f" strokeWidth={14} fill="none" />)}
        <path d="M 760 430 L 880 450 L 880 520 L 760 500 Z" fill="#2b3f74" />
      </g>
      <g fill="#121014"><path d="M 935 560 L 940 500 Q 960 486 980 500 L 985 560 Z" /><circle cx={960} cy={484} r={20} /></g>
      {/* members on the floor (midground, small) */}
      {Array.from({ length: 22 }, (_, i) => {
        const x = 80 + i * 84; const y = 880 - (i % 2) * 20;
        const up = voted && rnd(i * 3) < 0.73;
        return <g key={i} fill="#221c18">
          <rect x={x - 22} y={y - 90} width={44} height={90} /><circle cx={x} cy={y - 108} r={20} />
          {up && <line x1={x + 16} y1={y - 80} x2={x + 30} y2={y - 170 - Math.sin(f / 4 + i) * 4} stroke="#221c18" strokeWidth={12} strokeLinecap="round" />}
        </g>;
      })}
      <rect y={890} width={1920} height={190} fill="#6a4a3a" />
      <path d="M 0 1080 L 0 960 Q 960 900 1920 960 L 1920 1080 Z" fill="#4a2a16" stroke={L} strokeWidth={lw} />
      <Paint2 vig={0.45} />
    </g>
  );
};

// ================================================================== 1881: Lexington Avenue, New York
/** Arthur's brownstone at 123 Lexington Avenue, dusk: brownstone fronts with tall stoops and iron railings, a gas
 * street lamp being lit, cobbles; a horse-car rail in the street. */
export const Brownstone1881: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><linearGradient id="p2-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b3f6b" /><stop offset="0.7" stopColor="#c07a6a" /><stop offset="1" stopColor="#e7b48a" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#p2-dusk)" />
      {[[-40, 700], [640, 720], [1340, 660]].map(([x, w], k) => (
        <g key={k}>
          <rect x={x} y={70} width={w} height={790} fill={["#6b4a3a", "#74503c", "#664536"][k]} stroke={L} strokeWidth={lw} />
          <rect x={x} y={60} width={w} height={30} fill="#4e3428" stroke={L} strokeWidth={3} />
          {[0, 1, 2].map((r) => [0, 1, 2].map((c) => {
            const wx = x + 90 + c * (w - 180) / 2 - 50; const wy = 130 + r * 170;
            const lit = (k + r + c) % 3 === 0;
            return <g key={`${r}${c}`}><rect x={wx} y={wy} width={100} height={130} fill={lit ? "#f3c97a" : "#3a3440"} stroke="#d9c2a0" strokeWidth={5} /><rect x={wx - 10} y={wy - 18} width={120} height={18} fill="#8a6a54" stroke={L} strokeWidth={2} /></g>;
          }))}
          {/* stoop + door */}
          <g stroke={L} strokeWidth={3}>
            <path d={`M ${x + 120} 640 L ${x + 300} 640 L ${x + 300} 860 L ${x + 40} 860 Z`} fill="#5a3c30" />
            {Array.from({ length: 8 }, (_, i) => <line key={i} x1={x + 120 - i * 10} y1={660 + i * 26} x2={x + 300} y2={660 + i * 26} />)}
            <rect x={x + 150} y={480} width={120} height={160} fill="#3a2418" /><path d={`M ${x + 140} 480 Q ${x + 210} 430 ${x + 280} 480 Z`} fill="#8a6a54" />
            <path d={`M ${x + 120} 640 L ${x + 40} 860`} stroke="#1f1f22" strokeWidth={8} fill="none" />
            {Array.from({ length: 6 }, (_, i) => <line key={i} x1={x + 110 - i * 13} y1={600 + i * 37} x2={x + 110 - i * 13} y2={660 + i * 37} stroke="#1f1f22" strokeWidth={4} />)}
          </g>
        </g>
      ))}
      <text x={1066} y={520} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={30} fill="#f2e2a6">123</text>
      {/* sidewalk, street, gas lamp */}
      <rect y={860} width={1920} height={50} fill="#8a8078" />
      <rect y={910} width={1920} height={170} fill="#5a5450" />
      {Array.from({ length: 60 }, (_, i) => <ellipse key={i} cx={(i * 67) % 1920} cy={930 + ((i * 37) % 140)} rx={26} ry={10} fill="#4a4440" />)}
      <line x1={0} y1={1010} x2={1920} y2={1010} stroke="#8a8a90" strokeWidth={6} />
      <g stroke={L} strokeWidth={4} transform="translate(560 300)">
        <rect x={-10} y={40} width={20} height={530} fill="#1f1f22" />
        <path d="M -38 40 L 38 40 L 26 -40 L -26 -40 Z" fill="#f6dc8a" opacity={0.95} /><path d="M -46 -40 L 46 -40 L 0 -76 Z" fill="#1f1f22" />
        <ellipse cx={0} cy={0} rx={14 * (1 + Math.sin(f / 3) * 0.05)} ry={20} fill="#fff3c4" stroke="none" />
      </g>
      <circle cx={560} cy={300} r={240} fill="#ffd88a" opacity={0.14} style={{ mixBlendMode: "screen" }} />
      <Paint2 vig={0.45} />
    </g>
  );
};

// ================================================================== 1881: Baltimore & Potomac station
/** The B&P depot at 6th & B Streets on the Mall, 2 July 1881, 9:30 a.m.: red-brick Victorian Gothic with the
 * tall clock tower and its steep spire, pointed-arch windows, the train shed behind, a cab at the kerb. */
export const BPStationExt: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><linearGradient id="p2-sky81" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6aa0d4" /><stop offset="0.7" stopColor="#bcd8e8" /><stop offset="1" stopColor="#eef0e2" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#p2-sky81)" />
      <Cloud x={300 + f * 0.15} y={140} s={1.1} /><Cloud x={1500 + f * 0.12} y={110} s={0.9} />
      {/* train shed */}
      <path d="M 1260 520 Q 1600 360 1920 520 L 1920 760 L 1260 760 Z" fill="#6a5a50" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={1280 + i * 85} y1={500 - Math.sin((i / 8) * Math.PI) * 120} x2={1280 + i * 85} y2={760} stroke="#4a3e36" strokeWidth={4} />)}
      {/* main block */}
      <rect x={300} y={420} width={1000} height={420} fill="#a4533e" stroke={L} strokeWidth={lw} />
      {[0, 1, 2].map((i) => <rect key={i} x={300} y={500 + i * 120} width={1000} height={14} fill="#d9c7a0" />)}
      <path d="M 280 430 L 560 230 L 840 430 Z" fill="#4a4448" stroke={L} strokeWidth={lw} /><path d="M 760 430 L 1040 250 L 1320 430 Z" fill="#4a4448" stroke={L} strokeWidth={lw} />
      {[0, 1].map((r) => Array.from({ length: 8 }, (_, i) => {
        const x = 350 + i * 120; const y = 530 + r * 130;
        return <path key={`${r}${i}`} d={`M ${x} ${y + 90} L ${x} ${y + 26} Q ${x + 30} ${y - 10} ${x + 60} ${y + 26} L ${x + 60} ${y + 90} Z`} fill="#3c4a5c" stroke="#d9c7a0" strokeWidth={5} />;
      }))}
      {/* clock tower */}
      <rect x={140} y={250} width={190} height={590} fill="#9c4c38" stroke={L} strokeWidth={lw} />
      <path d="M 120 260 L 235 20 L 350 260 Z" fill="#3f3a3e" stroke={L} strokeWidth={lw} />
      <line x1={235} y1={20} x2={235} y2={-20} stroke={L} strokeWidth={6} />
      <circle cx={235} cy={340} r={60} fill="#f3ecd8" stroke={L} strokeWidth={5} />
      <line x1={235} y1={340} x2={235 + Math.cos((9.5 / 12) * 2 * Math.PI - Math.PI / 2) * 30} y2={340 + Math.sin((9.5 / 12) * 2 * Math.PI - Math.PI / 2) * 30} stroke="#111" strokeWidth={7} strokeLinecap="round" />
      <line x1={235} y1={340} x2={235} y2={386} stroke="#111" strokeWidth={5} strokeLinecap="round" />
      {[480, 620].map((y) => <path key={y} d={`M 205 ${y + 90} L 205 ${y + 20} Q 235 ${y - 10} 265 ${y + 20} L 265 ${y + 90} Z`} fill="#3c4a5c" stroke="#d9c7a0" strokeWidth={4} />)}
      {/* entrance */}
      <path d="M 960 840 L 960 720 Q 1040 650 1120 720 L 1120 840 Z" fill="#2c2420" stroke={L} strokeWidth={lw} />
      {/* B Street, cab */}
      <rect y={840} width={1920} height={60} fill="#cfc3aa" />
      <rect y={900} width={1920} height={180} fill="#a99878" />
      <g transform="translate(1460 960)" stroke={L} strokeWidth={4}>
        <path d="M -120 -150 L 60 -150 L 90 -40 L -130 -40 Z" fill="#2a2a30" /><rect x={-90} y={-132} width={70} height={60} fill="#7a8a9a" />
        <circle cx={-90} cy={-10} r={44} fill="none" strokeWidth={8} /><circle cx={60} cy={-10} r={44} fill="none" strokeWidth={8} />
        <path d="M 90 -100 L 260 -100 L 270 -60 L 100 -60 Z" fill="#5a3a26" /><ellipse cx={240} cy={-130} rx={40} ry={30} fill="#5a3a26" /><path d="M 266 -150 L 300 -120 L 280 -110 Z" fill="#5a3a26" />
        {[120, 160, 220, 250].map((x, i) => <line key={x} x1={x} y1={-60} x2={x + (i % 2 ? -8 : 8)} y2={10} strokeWidth={8} />)}
      </g>
      <Paint2 vig={0.3} />
    </g>
  );
};

/** The ladies' waiting room (after Leslie's engraving): pale plaster walls, wood wainscot, tall windows throwing
 * morning light, a wall bench, onlookers at the back. BenchFG is the slatted bench in the right foreground. */
export const BPWaitingRoom: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#d8d0bd" />
    <rect width={1920} height={40} fill="#a89a80" />
    {[180, 620, 1060].map((x) => (
      <g key={x}>
        <path d={`M ${x} 620 L ${x} 220 Q ${x + 100} 130 ${x + 200} 220 L ${x + 200} 620 Z`} fill="#e9eff0" stroke="#8a7a5a" strokeWidth={10} />
        <line x1={x + 100} y1={170} x2={x + 100} y2={620} stroke="#8a7a5a" strokeWidth={6} /><line x1={x} y1={400} x2={x + 200} y2={400} stroke="#8a7a5a" strokeWidth={6} />
        <path d={`M ${x} 620 L ${x + 200} 620 L ${x + 420} 1080 L ${x + 120} 1080 Z`} fill="#fff8de" opacity={0.18} />
      </g>
    ))}
    <rect y={640} width={1920} height={20} fill="#6b4a2a" /><rect y={660} width={1920} height={220} fill="#7a5634" />
    {Array.from({ length: 16 }, (_, i) => <rect key={i} x={20 + i * 122} y={680} width={100} height={180} fill="none" stroke="#5e3e22" strokeWidth={5} />)}
    {/* onlookers at the back (soft greys) */}
    {Array.from({ length: 9 }, (_, i) => (
      <g key={i} fill="#6a625a" transform={`translate(${1380 + i * 60} ${860 - (i % 2) * 10})`}>
        <path d="M -34 0 L -34 -150 Q -34 -190 0 -192 Q 34 -190 34 -150 L 34 0 Z" /><ellipse cx={0} cy={-216} rx={24} ry={27} />
        {i % 2 === 0 && <><rect x={-28} y={-246} width={56} height={10} rx={4} /><rect x={-18} y={-276} width={36} height={32} /></>}
      </g>
    ))}
    <rect y={880} width={1920} height={200} fill="#b9ab90" />
    {Array.from({ length: 10 }, (_, i) => <line key={i} x1={i * 220 - 200} y1={1080} x2={i * 160 + 160} y2={880} stroke="#a99c80" strokeWidth={3} />)}
    <Paint2 vig={0.3} />
  </g>
);

export const BenchFG: React.FC = () => (
  <g stroke={L} strokeWidth={5}>
    <path d="M 1560 1080 L 1600 800 L 1920 800 L 1920 1080" fill="none" strokeWidth={14} />
    {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={1600 - i * 4} y1={820 + i * 30} x2={1920} y2={820 + i * 30} strokeWidth={12} stroke="#8a5a32" />)}
    <path d="M 1540 950 L 1920 950 L 1920 975 L 1536 975 Z" fill="#8a5a32" />
  </g>
);

// ================================================================== archive print (own copy of the Arch treatment)
/** A public-domain print, full frame with the old-film treatment (sepia, grain, scratches, flicker, vignette,
 * slow push). Kit.Arch reads a shared list of archives; this part's prints live in tg2/archive/ by file name. */
export const Print: React.FC<{ file: string; dur: number; focus?: [number, number]; zoom?: [number, number] }> = ({ file, dur, focus = [50, 45], zoom = [1.02, 1.1] }) => {
  const f = useCurrentFrame();
  if (useExportMode() === "fx") return null;
  const z = interpolate(f, [0, dur], zoom, { extrapolateRight: "clamp" });
  const flick = 1 + Math.sin(f * 1.7) * 0.02 + Math.sin(f * 0.37) * 0.015;
  const seed = f % 9;
  return (
    <AbsoluteFill style={{ background: "#120c07", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: `${focus[0]}% ${focus[1]}%`, filter: `sepia(0.6) contrast(1.08) brightness(${flick})` }}>
        <Img src={staticFile(`tg2/archive/${file}`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <filter id={`p2grain${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves={2} seed={seed} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={1920} height={1080} filter={`url(#p2grain${seed})`} opacity={0.16} style={{ mixBlendMode: "overlay" }} />
        {[0, 1, 2].map((i) => ((f + i * 7) % 11 < 4) && <line key={i} x1={(f * 97 + i * 613) % 1920} x2={(f * 97 + i * 613) % 1920 + 3} y1={0} y2={1080} stroke="#f2e6cc" strokeWidth={1.5} opacity={0.35} />)}
        <radialGradient id="p2archvig" cx="50%" cy="50%" r="72%"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.85} /></radialGradient>
        <rect width={1920} height={1080} fill="url(#p2archvig)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Muzzle blast (red jagged, 2-3 f) for the gunshot. */
export const Blast: React.FC<{ x: number; y: number; at: number; dir?: 1 | -1 }> = ({ x, y, at, dir = 1 }) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > 2) return null;
  const pts = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2, k = i % 2 ? 0.4 : 1; return `${i ? "L" : "M"} ${(Math.cos(a) * 90 * k * (1.4 + dir * Math.cos(a) * 0.5)).toFixed(1)} ${(Math.sin(a) * 60 * k).toFixed(1)}`; }).join(" ") + " Z";
  return <g transform={`translate(${x} ${y})`}><path d={pts} fill="#e02b2b" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><circle r={22} fill="#ffe08a" /></g>;
};

/** Plain caption-style title text inside an SVG plate (for in-scene board numbers, not a label box). */
export const SvgText: React.FC<{ x: number; y: number; text: string; size?: number; fill?: string; at?: number }> = ({ x, y, text, size = 60, fill = "#fff", at = 0 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return <text x={x} y={y} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={size} fill={fill} stroke={INK} strokeWidth={size / 8} paintOrder="stroke">{text}</text>;
};
