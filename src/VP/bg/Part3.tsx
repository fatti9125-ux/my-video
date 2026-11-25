import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SImg } from "../../Thanksgiving3/Kit";
import { MONTSERRAT } from "../../fonts";
import { HEAD, INK } from "../VKit";

/**
 * Part 3 plates (lines 0-3 and 17-22), built like src/VP/PilotBg.tsx: one painted plate per real place,
 * 4-7 depth layers, thin warm background line work, mood by grade, and foreground occluders (desks, tables,
 * crowds from behind, railings) as separate components drawn AFTER the characters.
 *   Elberon NJ sickroom + cottage (Garfield, Sept 1881) · Arthur's parlor, 123 Lexington Ave (oath, 2 a.m.)
 *   New York Custom House rotunda (Collector of the Port) · Arthur's White House office (Pendleton Act, Jan 1883)
 *   Civil Service examination room (1883) · Senate Chamber 1945 (pre-1950 ceiling) · Little White House,
 *   Warm Springs GA · Cabinet Room, 12 April 1945 (from the oath photo) · FDR's Oval Office · TOP SECRET folder
 *   insert · map of Japan · Ferdinand Magellan rear platform (whistle stop / St. Louis Union Station) ·
 *   Dewey's suite, Roosevelt Hotel NYC (election night 1948).
 */

const L = "#2b2119";            // background line colour (thinner, warmer than character ink)
const lw = 4;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/** Soft painted texture + vignette (same recipe as PilotBg's Paint, own ids). */
export const Paint3: React.FC<{ vig?: number; warm?: boolean }> = ({ vig = 0.45, warm = true }) => (
  <g pointerEvents="none">
    <defs>
      <filter id="p3-tex" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={4} seed={23} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <radialGradient id={warm ? "p3-vig-w" : "p3-vig-c"} cx="50%" cy="48%" r="72%">
        <stop offset="0.5" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor={warm ? "#1a0f05" : "#05070f"} stopOpacity={1} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} filter="url(#p3-tex)" opacity={0.16} style={{ mixBlendMode: "soft-light" }} />
    <rect width={1920} height={1080} fill={`url(#${warm ? "p3-vig-w" : "p3-vig-c"})`} opacity={vig} />
  </g>
);

// ------------------------------------------------------------------ painted bystanders (plate-level figures)
type SilProps = { x: number; y: number; h: number; face?: 1 | -1; hat?: "top" | "bowler" | "fedora" | "lady" | "none"; c?: string; beard?: boolean; arm?: boolean; robe?: boolean; skin?: string; bob?: number; children?: React.ReactNode };
/**
 * A painted background figure (doctors, office-seekers, critics, cabinet members, crowds). Drawn in the plate's
 * softer style, not as a cast character. `arm` raises the near arm; `children` are drawn at the raised hand
 * (unit space: hand at 21,-114 for face=1), so a held paper is parented to the hand.
 */
export const Sil: React.FC<SilProps> = ({ x, y, h, face = 1, hat = "none", c = "#2c2a2e", beard, arm, robe, skin, bob = 0, children }) => {
  const f = useCurrentFrame();
  const k = h / 100;
  const by = Math.sin((f + x * 0.37) / 19) * 0.5 * bob;
  return (
    <g transform={`translate(${x} ${y + by}) scale(${k * face} ${k})`} strokeLinejoin="round">
      {robe || hat === "lady"
        ? <path d="M -17 -78 Q -22 -40 -22 0 L 22 0 Q 22 -40 17 -78 Q 0 -84 -17 -78 Z" fill={c} />
        : <><rect x={-10} y={-32} width={8} height={32} fill={c} /><rect x={2} y={-32} width={8} height={32} fill={c} />
          <path d="M -17 -78 Q -21 -50 -19 -24 L 19 -24 Q 21 -50 17 -78 Q 0 -84 -17 -78 Z" fill={c} /></>}
      <rect x={-5} y={-84} width={10} height={8} fill={c} />
      <ellipse cx={1.5} cy={-91} rx={8.5} ry={9.5} fill={skin ?? c} />
      {skin && <path d="M 9 -92 l 3 3 l -3 1" fill={skin} />}
      {beard && <path d="M -6 -88 Q 2 -72 11 -86 Z" fill={skin ? "#4a3626" : c} />}
      {hat === "top" && <g fill={c}><rect x={-7} y={-116} width={16} height={18} /><rect x={-11} y={-100} width={24} height={3} rx={1.5} /></g>}
      {hat === "bowler" && <g fill={c}><path d="M -8 -97 Q -8 -110 1 -110 Q 10 -110 10 -97 Z" /><ellipse cx={1} cy={-97} rx={13} ry={2.5} /></g>}
      {hat === "fedora" && <g fill={c}><path d="M -8 -97 L -7 -106 Q 1 -110 9 -106 L 10 -97 Z" /><ellipse cx={1} cy={-97} rx={14} ry={3} /></g>}
      {hat === "lady" && <g fill={c}><ellipse cx={1} cy={-99} rx={12} ry={4} /><circle cx={1} cy={-101} r={6} /></g>}
      {arm && <g><path d="M 10 -74 L 21 -112" stroke={c} strokeWidth={6} strokeLinecap="round" fill="none" /><circle cx={21} cy={-114} r={3.6} fill={skin ?? c} />
        <g transform={`translate(21 -114) scale(${face} 1)`}>{children}</g></g>}
    </g>
  );
};

/** Paper held up by a Sil hand (certificate with red seal, or a graded exam with a red A). */
export const HeldPaper: React.FC<{ kind: "cert" | "exam" }> = ({ kind }) => (
  <g transform="rotate(-8) translate(-11 -28)" stroke={L} strokeWidth={1}>
    <rect width={22} height={28} fill="#f4ecd6" />
    {kind === "cert" ? <><path d="M 6 5 L 16 5 M 4 9 L 18 9 M 4 13 L 18 13 M 4 17 L 14 17" stroke="#8a7a5a" strokeWidth={1} /><circle cx={16} cy={22} r={3.4} fill="#c0392b" stroke="none" /></>
      : <><circle cx={16} cy={6} r={4} fill="none" stroke="#d62828" strokeWidth={1.2} /><text x={16} y={8.2} textAnchor="middle" fontSize={6} fontFamily={MONTSERRAT} fontWeight={800} fill="#d62828" stroke="none">A</text>
        <path d="M 3 13 h 3 v 3 h -3 Z M 3 19 h 3 v 3 h -3 Z M 8 14.5 h 10 M 8 20.5 h 10" fill="none" stroke="#6a6a6a" strokeWidth={0.8} /></>}
  </g>
);

/** Tear-off wall/desk calendar: month + big day, the old page flips away for 3 f when the date changes. */
export const TearCal: React.FC<{ x: number; y: number; w: number; month: string; day: string; changed?: number; top?: string }> = ({ x, y, w, month, day, changed = 99, top = "#b8362f" }) => {
  const h = w * 1.2;
  return (
    <g transform={`translate(${x} ${y})`} stroke={L} strokeWidth={lw}>
      <rect x={-w / 2 + 8} y={10} width={w} height={h} fill="#000" opacity={0.25} stroke="none" />
      <rect x={-w / 2} y={0} width={w} height={h} fill="#f6f0dc" />
      <rect x={-w / 2} y={0} width={w} height={h * 0.26} fill={top} />
      <text x={0} y={h * 0.2} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={w * 0.17} fill="#fff" stroke="none">{month}</text>
      <text x={0} y={h * 0.82} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={w * 0.46} fill="#2b2119" stroke="none">{day}</text>
      {changed < 3 && <path d={`M ${-w / 2} ${h * 0.26} L ${w / 2} ${h * 0.26} L ${w / 2 - 20 + changed * 30} ${h * (0.8 - changed * 0.25)} L ${-w / 2 + 30} ${h * (0.9 - changed * 0.3)} Z`} fill="#fffaf0" opacity={0.95} />}
    </g>
  );
};

// ================================================================== 1881: Elberon, NJ (Francklyn Cottage) sickroom
/** Seaside sickroom: pale striped paper, white wainscot, open window on the Atlantic, Bell's induction-balance
 * apparatus on a side table (Leslie's, Aug 1881), doctors standing watch. */
export const ElberonSickroom: React.FC<{ cal: { month: string; day: string; changed: number } }> = ({ cal }) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 18) * 14;
  return (
    <g>
      <defs>
        <pattern id="p3-stripe" width={60} height={60} patternUnits="userSpaceOnUse">
          <rect width={60} height={60} fill="#dcdcc2" /><rect width={18} height={60} fill="#d0d2b4" /><circle cx={39} cy={30} r={4} fill="#c7c9a8" />
        </pattern>
        <linearGradient id="p3-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bcd9ea" /><stop offset="0.45" stopColor="#e3eef0" /><stop offset="0.46" stopColor="#5f93b3" /><stop offset="1" stopColor="#3f7396" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#p3-stripe)" />
      <rect width={1920} height={56} fill="#efe9d8" /><rect y={56} width={1920} height={12} fill="#c9c1a6" />
      {/* window on the sea */}
      <rect x={1150} y={150} width={420} height={500} fill="url(#p3-sea)" stroke="#f3efe4" strokeWidth={18} />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M ${1170 + (i % 3) * 120 + Math.sin(f / 20 + i) * 8} ${460 + i * 26} q 20 -8 40 0`} stroke="#d9ecf5" strokeWidth={4} fill="none" />)}
      <g transform={`translate(${1290 + f * 0.25} 430)`} stroke={L} strokeWidth={2}><path d="M 0 0 L 40 0 L 34 10 L 6 10 Z" fill="#f3efe4" /><path d="M 20 0 L 20 -52 L 44 -4 Z" fill="#fff" /></g>
      <line x1={1360} y1={150} x2={1360} y2={650} stroke="#f3efe4" strokeWidth={10} /><line x1={1150} y1={400} x2={1570} y2={400} stroke="#f3efe4" strokeWidth={10} />
      <path d={`M 1130 130 Q ${1190 + sway} 400 ${1150 + sway * 0.6} 680 L 1110 680 Z`} fill="#fbf8ef" opacity={0.92} stroke={L} strokeWidth={2} />
      <path d={`M 1590 130 Q ${1530 + sway} 400 ${1570 + sway * 0.6} 680 L 1610 680 Z`} fill="#fbf8ef" opacity={0.92} stroke={L} strokeWidth={2} />
      <path d="M 1100 690 L 1620 690 L 1820 1080 L 980 1080 Z" fill="#fff8de" opacity={0.16} />
      {/* framed seascape + calendar */}
      <rect x={250} y={190} width={250} height={180} fill="#9c7a3e" stroke={L} strokeWidth={lw} /><rect x={268} y={208} width={214} height={144} fill="#8fb2c4" /><path d="M 268 300 Q 330 280 380 300 T 482 296 L 482 352 L 268 352 Z" fill="#5f8aa2" />
      <TearCal x={720} y={190} w={170} month={cal.month} day={cal.day} changed={cal.changed} />
      {/* white wainscot + floor */}
      <rect y={650} width={1920} height={220} fill="#f1ede0" stroke={L} strokeWidth={3} />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={30 + i * 215} y={680} width={180} height={160} fill="none" stroke="#d6d0bd" strokeWidth={5} />)}
      <rect y={865} width={1920} height={215} fill="#9a6f45" />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} y1={885 + i * 34} x2={1920} y2={885 + i * 34} stroke="#83592f" strokeWidth={3} />)}
      {/* Bell's induction balance on a side table (left) */}
      <g stroke={L} strokeWidth={lw}>
        <rect x={110} y={700} width={330} height={22} fill="#7a4e2c" />
        <rect x={130} y={722} width={14} height={180} fill="#6b4226" /><rect x={406} y={722} width={14} height={180} fill="#6b4226" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={250 + i * 42} y={640} width={38} height={60} fill="#e9e4d4" />)}
        <rect x={140} y={668} width={90} height={32} fill="#3a3a3a" /><circle cx={160} cy={662} r={8} fill="#b08a3c" /><circle cx={205} cy={662} r={8} fill="#b08a3c" />
        <path d="M 230 690 Q 420 760 560 900" fill="none" strokeWidth={3} />
      </g>
      {/* the doctors keeping watch */}
      <Sil x={600} y={960} h={560} face={1} beard c="#4a4650" skin="#d9b79a" bob={1} />
      <Sil x={1390} y={965} h={570} face={-1} beard c="#3e3b45" skin="#d4b294" bob={1} />
      <Sil x={1560} y={985} h={590} face={-1} c="#4a4650" skin="#dcb999" bob={1} />
      <Paint3 vig={0.35} />
    </g>
  );
};

/** Bedside table with medicine bottles (foreground right of the bed). */
export const BedsideFG: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    <rect x={1250} y={820} width={190} height={20} fill="#7a4e2c" /><rect x={1262} y={840} width={166} height={180} fill="#6b4226" />
    <rect x={1280} y={760} width={30} height={60} fill="#5a7a5a" /><rect x={1322} y={775} width={26} height={45} fill="#8a5a2a" /><rect x={1362} y={782} width={46} height={38} rx={6} fill="#e9e4d4" />
  </g>
);

/** Francklyn Cottage, Elberon NJ, at night: shingle cottage with verandas on the shore; flag lowers to half-staff. */
export const ElberonNight: React.FC<{ flag: number }> = ({ flag }) => {
  const f = useCurrentFrame();
  const fy = 300 + flag * 210;
  const wave = Math.sin(f / 5) * 6;
  return (
    <g>
      <defs>
        <linearGradient id="p3-nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b1430" /><stop offset="1" stopColor="#2c3d78" /></linearGradient>
        <radialGradient id="p3-moon" cx="50%" cy="50%" r="50%"><stop offset="0.2" stopColor="#e4e8ff" stopOpacity={0.5} /><stop offset="1" stopColor="#e4e8ff" stopOpacity={0} /></radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#p3-nsky)" />
      {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={rnd(i + 3) * 1920} cy={rnd(i + 77) * 430} r={1.4 + rnd(i) * 2.2} fill="#fff" opacity={0.35 + 0.5 * Math.abs(Math.sin(f / (14 + (i % 6)) + i))} />)}
      <circle cx={360} cy={170} r={170} fill="url(#p3-moon)" /><circle cx={360} cy={170} r={52} fill="#f0ebd0" />
      {/* the Atlantic (left) with moon path */}
      <rect y={560} width={1920} height={520} fill="#18264d" />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={300 + Math.sin(f / 9 + i) * 20 - i * 6} y={575 + i * 16} width={120 + i * 10} height={4} fill="#c9d2f2" opacity={0.5 - i * 0.03} />)}
      {/* cottage */}
      <g stroke={L} strokeWidth={lw}>
        <path d="M 820 430 L 1010 250 L 1200 430 Z" fill="#3a3340" />
        <path d="M 1150 430 L 1390 230 L 1630 430 Z" fill="#41394a" />
        <rect x={840} y={420} width={770} height={330} fill="#7d6a5e" />
        {Array.from({ length: 11 }, (_, i) => <line key={i} x1={840} y1={440 + i * 28} x2={1610} y2={440 + i * 28} stroke="#6b5a50" strokeWidth={3} />)}
        <rect x={1310} y={250} width={36} height={120} fill="#5a4a48" />
        {[[880, 470], [990, 470], [1100, 470], [1240, 470], [1360, 470], [1480, 470]].map(([x, y], i) => (
          <g key={i}><rect x={x} y={y} width={80} height={100} fill={i === 3 ? "#f6c96a" : "#16192a"} stroke="#e7e1d2" strokeWidth={6} /><line x1={x + 40} y1={y} x2={x + 40} y2={y + 100} stroke="#e7e1d2" strokeWidth={4} /></g>
        ))}
        {/* veranda */}
        <rect x={800} y={620} width={850} height={24} fill="#3a3340" />
        {Array.from({ length: 10 }, (_, i) => <rect key={i} x={815 + i * 92} y={644} width={14} height={140} fill="#e7e1d2" />)}
        <rect x={800} y={700} width={850} height={10} fill="#e7e1d2" />
        <rect x={790} y={780} width={870} height={22} fill="#3a3340" />
      </g>
      <path d="M 1240 570 L 1320 570 L 1420 900 L 1120 900 Z" fill="#f6c96a" opacity={0.07} />
      {/* dunes + grass */}
      <path d="M 0 860 Q 400 780 820 830 Q 1300 800 1920 850 L 1920 1080 L 0 1080 Z" fill="#141a26" />
      {Array.from({ length: 40 }, (_, i) => <path key={i} d={`M ${i * 50} 1080 q ${6 + Math.sin(f / 15 + i) * 6} -60 ${14} -${90 + (i % 4) * 20}`} stroke="#222b3a" strokeWidth={6} fill="none" />)}
      {/* flagpole: the flag drops to half-staff */}
      <line x1={640} y1={240} x2={640} y2={900} stroke="#d8d3c4" strokeWidth={10} /><circle cx={640} cy={236} r={10} fill="#c9a24a" />
      <g transform={`translate(646 ${fy})`} stroke={L} strokeWidth={2}>
        <path d={`M 0 0 Q 60 ${wave} 120 0 Q 150 ${-wave * 0.5} 170 4 L 170 94 Q 110 ${100 + wave} 60 90 Q 30 ${86 - wave} 0 90 Z`} fill="#b8362f" />
        {[1, 3, 5].map((s) => <path key={s} d={`M 0 ${s * 13} Q 60 ${s * 13 + wave} 170 ${s * 13 + 4}`} stroke="#ece6d6" strokeWidth={11} fill="none" />)}
        <rect x={0} y={0} width={70} height={48} fill="#2b3f74" />
      </g>
      <Paint3 vig={0.55} warm={false} />
    </g>
  );
};

// ================================================================== 123 Lexington Avenue, 2 a.m., 20 Sept 1881
/** Arthur's front parlor: red damask, marble mantel with clock at 2:15, gilt mirror, gas chandelier, drapes. */
export const LexingtonParlor: React.FC = () => {
  const f = useCurrentFrame();
  const fl = 1 + Math.sin(f / 4) * 0.02;
  const hand = (deg: number, len: number, w: number) => <line x1={0} y1={0} x2={Math.sin(deg * Math.PI / 180) * len} y2={-Math.cos(deg * Math.PI / 180) * len} stroke="#111" strokeWidth={w} strokeLinecap="round" />;
  return (
    <g>
      <defs>
        <pattern id="p3-damask" width={80} height={100} patternUnits="userSpaceOnUse">
          <rect width={80} height={100} fill="#5a1f1c" />
          <path d="M 40 14 C 26 32 26 52 40 66 C 54 52 54 32 40 14 Z M 40 66 L 40 86" fill="#662623" stroke="#662623" strokeWidth={4} />
        </pattern>
        <radialGradient id="p3-gas" cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#ffe3a0" stopOpacity={0.55} /><stop offset="1" stopColor="#ffe3a0" stopOpacity={0} /></radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#p3-damask)" />
      <rect width={1920} height={60} fill="#2a1410" /><rect y={60} width={1920} height={16} fill="#a07a3a" />
      <rect y={680} width={1920} height={200} fill="#3a1d14" /><rect y={672} width={1920} height={12} fill="#a07a3a" />
      {/* window, night street + gas lamp */}
      <rect x={1380} y={160} width={300} height={500} fill="#141c38" stroke="#6a4a2a" strokeWidth={14} />
      <circle cx={1500} cy={420} r={60} fill="url(#p3-gas)" /><rect x={1494} y={430} width={12} height={230} fill="#0c0f1c" /><rect x={1482} y={396} width={36} height={36} fill="#f2d98a" />
      <line x1={1530} y1={160} x2={1530} y2={660} stroke="#6a4a2a" strokeWidth={8} /><line x1={1380} y1={400} x2={1680} y2={400} stroke="#6a4a2a" strokeWidth={8} />
      <path d="M 1340 110 L 1440 110 Q 1410 420 1450 690 L 1320 690 Z" fill="#2f4a32" stroke={L} strokeWidth={lw} />
      <path d="M 1720 110 L 1620 110 Q 1650 420 1610 690 L 1740 690 Z" fill="#2f4a32" stroke={L} strokeWidth={lw} />
      <path d="M 1320 100 Q 1530 170 1740 100 L 1740 150 Q 1530 220 1320 150 Z" fill="#3c5c3e" stroke={L} strokeWidth={lw} />
      {/* mantel, mirror, clock 2:15 */}
      <g stroke={L} strokeWidth={lw}>
        <rect x={150} y={150} width={330} height={360} fill="#b08a3c" /><rect x={172} y={172} width={286} height={316} fill="#4a5058" />
        <path d="M 180 180 L 290 180 L 180 330 Z" fill="#fff" opacity={0.12} stroke="none" />
        <rect x={110} y={510} width={410} height={30} fill="#e7e0d0" />
        <rect x={130} y={540} width={370} height={330} fill="#d8d0bf" /><path d="M 220 870 L 220 640 Q 315 580 410 640 L 410 870 Z" fill="#1a1210" />
        <path d="M 240 870 Q 315 800 390 870 Z" fill="#e07a2a" opacity={0.5} />
        <g transform="translate(315 470)"><rect x={-50} y={-30} width={100} height={70} rx={10} fill="#3a2a1a" /><circle r={28} fill="#efe6cf" stroke="#111" strokeWidth={3} />{hand(67.5, 15, 5)}{hand(90, 22, 3)}</g>
      </g>
      {/* portrait + side chair */}
      <rect x={760} y={190} width={220} height={280} fill="#9c7a3e" stroke={L} strokeWidth={lw} /><rect x={780} y={210} width={180} height={240} fill="#4a3c30" /><ellipse cx={870} cy={300} rx={44} ry={56} fill="#7a6650" />
      {/* gas chandelier */}
      <g stroke={L} strokeWidth={3}>
        <line x1={1100} y1={76} x2={1100} y2={210} strokeWidth={6} />
        <path d="M 980 230 Q 1100 280 1220 230" fill="none" stroke="#b08a3c" strokeWidth={10} />
        {[980, 1040, 1160, 1220].map((x, i) => <g key={i}><circle cx={x} cy={210} r={44 * fl} fill="url(#p3-gas)" stroke="none" /><ellipse cx={x} cy={210} rx={18} ry={22} fill="#fff2c8" /></g>)}
        <circle cx={1100} cy={250} r={18} fill="#b08a3c" />
      </g>
      {/* carpet */}
      <rect y={870} width={1920} height={210} fill="#4a2a1e" />
      <ellipse cx={960} cy={990} rx={820} ry={90} fill="#6a2a24" stroke={L} strokeWidth={lw} />
      <ellipse cx={960} cy={990} rx={720} ry={70} fill="none" stroke="#c9a14a" strokeWidth={8} />
      <Paint3 vig={0.5} />
    </g>
  );
};

/** Judge John R. Brady from behind (foreground right), right hand raised for the oath. */
export const JudgeFG: React.FC = () => (
  <g fill="#120c0a">
    <path d="M 1450 1080 L 1470 760 Q 1490 660 1600 640 L 1760 640 Q 1870 660 1890 760 L 1920 1080 Z" />
    <ellipse cx={1680} cy={560} rx={92} ry={104} />
    <path d="M 1600 520 Q 1680 430 1770 520 Q 1700 480 1600 520 Z" fill="#3a3a3a" />
    <path d="M 1500 700 L 1420 470" stroke="#120c0a" strokeWidth={56} strokeLinecap="round" />
    <ellipse cx={1412} cy={440} rx={34} ry={46} />
  </g>
);

/** Horsehair sofa back (foreground, bottom left). */
export const SofaFG: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    <path d="M -20 1080 L -20 900 Q 160 840 420 860 Q 560 870 600 940 L 620 1080 Z" fill="#3a1410" />
    <path d="M -20 920 Q 160 870 420 885 Q 540 892 584 950" fill="none" stroke="#5a2420" strokeWidth={10} />
    {[60, 180, 300, 420].map((x, i) => <circle key={i} cx={x} cy={950} r={7} fill="#b08a3c" />)}
  </g>
);

// ================================================================== New York Custom House rotunda (55 Wall St)
/** The Custom House rotunda: ring of marble Corinthian columns, coffered dome with oculus, clerk windows. */
export const CustomHouse: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="p3-dome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8f8a80" /><stop offset="1" stopColor="#cfc8b8" /></linearGradient>
      <linearGradient id="p3-col" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#9a9187" /><stop offset="0.35" stopColor="#e2dccf" /><stop offset="1" stopColor="#8a8178" /></linearGradient>
      <linearGradient id="p3-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6d8" stopOpacity={0.45} /><stop offset="1" stopColor="#fff6d8" stopOpacity={0} /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="#c9c1b0" />
    {/* dome + coffers */}
    <path d="M -100 330 Q 960 -260 2020 330 Z" fill="url(#p3-dome)" stroke={L} strokeWidth={lw} />
    {Array.from({ length: 3 }, (_, r) => Array.from({ length: 12 }, (_, i) => {
      const x = 160 + i * 140, y = 70 + r * 85 + Math.abs(i - 5.5) * (14 + r * 4);
      return y < 320 ? <rect key={`${r}-${i}`} x={x - 40} y={y} width={80} height={54} fill="#a39c8e" stroke="#7f786c" strokeWidth={3} /> : null;
    }))}
    <ellipse cx={960} cy={30} rx={200} ry={44} fill="#f2f4ee" stroke={L} strokeWidth={lw} />
    <path d="M 780 40 L 1140 40 L 1300 1080 L 620 1080 Z" fill="url(#p3-beam)" />
    <rect y={320} width={1920} height={40} fill="#e6e0d2" stroke={L} strokeWidth={lw} />
    <rect y={360} width={1920} height={18} fill="#b8b09f" />
    {/* clerk windows with brass grilles between the columns */}
    <rect y={378} width={1920} height={500} fill="#bdb5a3" />
    {[260, 720, 1180, 1640].map((x, i) => (
      <g key={i} stroke={L} strokeWidth={3}>
        <rect x={x - 140} y={560} width={280} height={300} fill="#5a3a22" />
        <rect x={x - 120} y={600} width={240} height={150} fill="#2a2018" />
        {Array.from({ length: 12 }, (_, j) => <line key={j} x1={x - 120 + j * 22} y1={600} x2={x - 120 + j * 22} y2={750} stroke="#c9a24a" strokeWidth={3} />)}
        <path d={`M ${x - 120} 600 Q ${x} 560 ${x + 120} 600`} fill="none" stroke="#c9a24a" strokeWidth={5} />
        <rect x={x - 70} y={420} width={140} height={110} fill="#d8d0bf" />
      </g>
    ))}
    {/* Corinthian columns */}
    {[30, 490, 950, 1410, 1870].map((x, i) => (
      <g key={i} stroke={L} strokeWidth={lw}>
        <rect x={x - 46} y={380} width={92} height={500} fill="url(#p3-col)" />
        {[0, 1, 2, 3].map((j) => <line key={j} x1={x - 30 + j * 20} y1={390} x2={x - 30 + j * 20} y2={870} stroke="#8f877c" strokeWidth={2} />)}
        <path d={`M ${x - 64} 380 Q ${x - 70} 340 ${x - 50} 330 L ${x + 50} 330 Q ${x + 70} 340 ${x + 64} 380 Z`} fill="#d9d1bf" />
        <path d={`M ${x - 40} 372 q 10 -22 20 0 q 10 -22 20 0 q 10 -22 20 0 q 10 -22 20 0`} fill="none" strokeWidth={3} />
        <rect x={x - 62} y={870} width={124} height={30} fill="#a39c8e" />
      </g>
    ))}
    {/* gilt clock */}
    <g transform="translate(720 470)" stroke={L} strokeWidth={4}><circle r={52} fill="#c9a24a" /><circle r={40} fill="#f2ead4" /><line x1={0} y1={0} x2={0} y2={-28} stroke="#111" strokeWidth={5} /><line x1={0} y1={0} x2={20} y2={8} stroke="#111" strokeWidth={5} /></g>
    {/* marble floor in perspective */}
    <rect y={900} width={1920} height={180} fill="#e2dccd" />
    {Array.from({ length: 13 }, (_, i) => <line key={i} x1={960 + (i - 6) * 170} y1={900} x2={960 + (i - 6) * 420} y2={1080} stroke="#b9b09d" strokeWidth={3} />)}
    {[935, 985, 1050].map((y, i) => <line key={i} x1={0} y1={y} x2={1920} y2={y} stroke="#b9b09d" strokeWidth={3} />)}
    <Paint3 vig={0.35} />
  </g>
);

/** The queue of party allies, receding to the right; each raises the paper he was handed at `at[i]`. */
export const Allies: React.FC<{ at: number[]; kind: "cert" | "exam" }> = ({ at, kind }) => {
  const f = useCurrentFrame();
  const q: [number, number, number, SilProps["hat"], string][] = [
    [1830, 935, 470, "top", "#3e3a36"], [1660, 945, 500, "bowler", "#4a3f38"], [1480, 958, 540, "top", "#35322f"], [1270, 975, 590, "bowler", "#433a33"],
  ];
  return (
    <g>
      {q.map(([x, y, h, hat, c], i) => {
        const got = f >= (at[3 - i] ?? 99999);
        return <Sil key={i} x={x} y={y} h={h} face={-1} hat={hat} c={c} skin="#d8b394" beard={i % 2 === 0} arm={got} bob={2}>{got && <HeldPaper kind={kind} />}</Sil>;
      })}
    </g>
  );
};

/** The Collector's desk (foreground left): mahogany, brass nameplate, inkstand, a stack of appointments. */
export const CollectorDesk: React.FC<{ stack?: number }> = ({ stack = 6 }) => (
  <g stroke={L} strokeWidth={lw}>
    <rect x={180} y={790} width={900} height={50} fill="#7a3e1e" />
    <rect x={210} y={840} width={840} height={260} fill="#5a2c14" />
    {[0, 1, 2].map((i) => <rect key={i} x={250 + i * 270} y={870} width={230} height={170} fill="#4a220f" />)}
    <rect x={480} y={890} width={300} height={64} fill="#c9a24a" />
    <text x={630} y={918} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={20} fill="#3a2a10" stroke="none">COLLECTOR</text>
    <text x={630} y={942} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={17} fill="#3a2a10" stroke="none">OF THE PORT</text>
    {Array.from({ length: stack }, (_, i) => <rect key={i} x={250 + (i % 2) * 6} y={776 - i * 9} width={150} height={20} fill="#f4ecd6" />)}
    <rect x={850} y={756} width={70} height={36} fill="#2a2a2a" /><path d="M 900 756 L 940 690" strokeWidth={3} />
  </g>
);

// ================================================================== Arthur's White House office, 16 Jan 1883
/** Tiffany-era office: gold-olive paper, gas chandelier, window on the snowy lawn and the unfinished Washington
 * Monument (a flat-topped stub with a crane until 1884), fireplace, and the desk Arthur signs at (drawn behind
 * the signing pose, its top edge at y=`deskY` where the drawing's own desk line sits). */
export const ArthurOffice: React.FC<{ deskY: number }> = ({ deskY }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <pattern id="p3-tiff" width={64} height={64} patternUnits="userSpaceOnUse">
          <rect width={64} height={64} fill="#8a7a3e" /><path d="M 32 6 L 44 32 L 32 58 L 20 32 Z" fill="#94843f" /><circle cx={0} cy={0} r={6} fill="#a08f48" /><circle cx={64} cy={64} r={6} fill="#a08f48" />
        </pattern>
        <linearGradient id="p3-winter" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9d4de" /><stop offset="1" stopColor="#eef0ee" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#p3-tiff)" />
      <rect width={1920} height={70} fill="#4a3a1a" /><rect y={70} width={1920} height={26} fill="#c9a24a" />
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={i * 66 + 20} cy={83} r={6} fill="#7a5f1e" />)}
      {/* window: winter lawn, unfinished monument */}
      <rect x={150} y={180} width={420} height={560} fill="url(#p3-winter)" stroke="#e9dfc8" strokeWidth={16} />
      <path d="M 150 600 Q 360 560 570 600 L 570 740 L 150 740 Z" fill="#f6f6f2" />
      <path d="M 330 600 L 340 330 L 382 330 L 392 600 Z" fill="#d6d0c2" stroke={L} strokeWidth={3} />
      <path d="M 340 330 L 350 290 L 372 290 L 382 330" fill="none" stroke="#6a5a4a" strokeWidth={3} /><line x1={361} y1={290} x2={400} y2={262} stroke="#6a5a4a" strokeWidth={4} />
      {Array.from({ length: 18 }, (_, i) => { const y = (rnd(i) * 560 + f * (1.2 + rnd(i + 5))) % 560; return <circle key={i} cx={160 + rnd(i + 9) * 400} cy={180 + y} r={3} fill="#fff" />; })}
      <line x1={360} y1={180} x2={360} y2={740} stroke="#e9dfc8" strokeWidth={8} /><line x1={150} y1={460} x2={570} y2={460} stroke="#e9dfc8" strokeWidth={8} />
      <path d="M 110 140 L 220 140 Q 190 450 230 760 L 100 760 Z" fill="#6e2a25" stroke={L} strokeWidth={lw} />
      <path d="M 610 140 L 500 140 Q 530 450 490 760 L 620 760 Z" fill="#6e2a25" stroke={L} strokeWidth={lw} />
      {/* fireplace + mirror (right) */}
      <g stroke={L} strokeWidth={lw}>
        <rect x={1420} y={180} width={360} height={330} fill="#c9a24a" /><rect x={1442} y={202} width={316} height={286} fill="#56606a" />
        <rect x={1380} y={510} width={440} height={30} fill="#3a2a1a" />
        <rect x={1400} y={540} width={400} height={300} fill="#2e2018" /><path d="M 1500 840 L 1500 640 Q 1600 590 1700 640 L 1700 840 Z" fill="#120a06" />
        <path d="M 1530 840 Q 1600 770 1670 840 Z" fill="#e07a2a" opacity={0.6} />
      </g>
      {/* gas chandelier */}
      <g stroke={L} strokeWidth={3}>
        <line x1={980} y1={96} x2={980} y2={200} strokeWidth={6} /><path d="M 860 220 Q 980 270 1100 220" fill="none" stroke="#c9a24a" strokeWidth={10} />
        {[860, 920, 1040, 1100].map((x, i) => <ellipse key={i} cx={x} cy={200} rx={16} ry={20} fill="#fff2c8" />)}
      </g>
      <rect y={860} width={1920} height={220} fill="#4a2e1c" />
      <rect x={0} y={760} width={1920} height={100} fill="#3a2414" />
      {/* the desk (behind the signing drawing) */}
      <g stroke={L} strokeWidth={lw}>
        <path d={`M 560 ${deskY} L 1360 ${deskY} L 1420 ${deskY + 150} L 500 ${deskY + 150} Z`} fill="#7a4626" />
        <path d={`M 640 ${deskY + 20} L 1280 ${deskY + 20} L 1320 ${deskY + 130} L 600 ${deskY + 130} Z`} fill="#2f5a3a" />
        <rect x={500} y={deskY + 150} width={920} height={200} fill="#5a3219" />
        <rect x={1180} y={deskY + 30} width={60} height={40} fill="#1d1d2b" />
      </g>
      <Paint3 vig={0.4} />
    </g>
  );
};

/** Critics from behind, bottom corners (foreground): bowler hats, notebooks. */
export const CriticsFG: React.FC = () => (
  <g>
    <Sil x={170} y={1260} h={620} face={1} hat="bowler" c="#151210" />
    <Sil x={1760} y={1250} h={600} face={-1} hat="top" c="#151210" />
    <Sil x={1560} y={1320} h={620} face={-1} hat="bowler" c="#1d1814" />
    <rect x={250} y={900} width={70} height={90} fill="#efe6cf" stroke={L} strokeWidth={3} transform="rotate(-10 250 900)" />
  </g>
);

// ================================================================== Civil Service examination room, 1883
/** Plain examination room: tall daylight windows, blackboard, wall clock, proctor's desk, rows of examinees. */
export const ExamHall: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#d9d2bf" />
    <rect width={1920} height={50} fill="#bfb7a2" />
    {[120, 1560].map((x, i) => (
      <g key={i} stroke={L} strokeWidth={lw}>
        <path d={`M ${x} 640 L ${x} 220 A 120 120 0 0 1 ${x + 240} 220 L ${x + 240} 640 Z`} fill="#e9f0ef" />
        <line x1={x + 120} y1={100} x2={x + 120} y2={640} strokeWidth={6} /><line x1={x} y1={400} x2={x + 240} y2={400} strokeWidth={6} />
      </g>
    ))}
    <path d="M 120 640 L 360 640 L 760 1080 L 300 1080 Z" fill="#fff8de" opacity={0.18} />
    <path d="M 1560 640 L 1800 640 L 1640 1080 L 1180 1080 Z" fill="#fff8de" opacity={0.18} />
    {/* blackboard */}
    <rect x={560} y={150} width={800} height={330} fill="#2d3b33" stroke="#6b4a2a" strokeWidth={16} />
    <text x={960} y={260} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={44} fill="#eceee6" opacity={0.92}>CIVIL SERVICE</text>
    <text x={960} y={320} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={44} fill="#eceee6" opacity={0.92}>EXAMINATION</text>
    <text x={960} y={410} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={30} fill="#eceee6" opacity={0.75}>NO TALKING · 3 HOURS</text>
    <g transform="translate(1440 200)" stroke={L} strokeWidth={4}><circle r={46} fill="#f2ead4" /><line x1={0} y1={0} x2={0} y2={-30} stroke="#111" strokeWidth={5} /><line x1={0} y1={0} x2={22} y2={0} stroke="#111" strokeWidth={5} /></g>
    {/* proctor's desk + proctor */}
    <Sil x={1180} y={690} h={330} face={-1} beard c="#3a3530" skin="#d8b394" />
    <rect x={820} y={560} width={420} height={130} fill="#6b4529" stroke={L} strokeWidth={lw} />
    <rect y={690} width={1920} height={390} fill="#a07a52" />
    {Array.from({ length: 8 }, (_, i) => <line key={i} x1={0} y1={700 + i * 50} x2={1920} y2={700 + i * 50} stroke="#8a663f" strokeWidth={3} />)}
    {/* back row of examinees at desks */}
    {[260, 560, 1360, 1660].map((x, i) => (
      <g key={i}>
        <Sil x={x} y={800} h={280} face={i < 2 ? 1 : -1} c="#3a3632" hat="none" />
        <rect x={x - 110} y={730} width={220} height={22} fill="#7a4e2c" stroke={L} strokeWidth={3} /><rect x={x - 100} y={752} width={200} height={70} fill="#5a3a22" stroke={L} strokeWidth={3} />
      </g>
    ))}
    <Paint3 vig={0.3} />
  </g>
);

/** Front row of school desks + examinees from behind (foreground). Papers land on the desks at `paperAt`. */
export const ExamFrontRow: React.FC<{ paperAt: number }> = ({ paperAt }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - paperAt, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  return (
    <g>
      {/* Quill's desk (mid-ground, centre) */}
      <g stroke={L} strokeWidth={lw}>
        <path d="M 760 880 L 1160 880 L 1180 910 L 740 910 Z" fill="#8a5a32" />
        <rect x={750} y={910} width={420} height={130} fill="#6b4226" />
        {f >= paperAt && <rect x={880} y={856 - (1 - p) * 300} width={150} height={34} fill="#f6f0dc" transform={`rotate(-4 955 870)`} />}
      </g>
      {[[160, 1, "#1e1a17"], [520, 1, "#26211c"], [1420, -1, "#1e1a17"], [1780, -1, "#26211c"]].map(([x, fc, c], i) => (
        <g key={i}>
          <Sil x={x as number} y={1240} h={560} face={fc as 1 | -1} c={c as string} />
          <rect x={(x as number) - 170} y={1000} width={340} height={30} fill="#7a4e2c" stroke={L} strokeWidth={4} />
          {f >= paperAt + i * 2 && <rect x={(x as number) - 60} y={984 - (1 - interpolate(f - paperAt - i * 2, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) * 400} width={130} height={24} fill="#f6f0dc" stroke={L} strokeWidth={2} />}
        </g>
      ))}
    </g>
  );
};

// ================================================================== the Senate Chamber, early 1945
/** The old (pre-1950) Senate Chamber: iron-and-glass ceiling, gallery balustrade, dark rostrum with the
 * presiding officer's desk; the senators' desks curve across the foreground (SenateDesksFG). */
export const SenateChamber: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="p3-sky45" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9d9a8" /><stop offset="1" stopColor="#c9b27a" /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill="#c8b98f" />
    {/* glass ceiling panels */}
    <rect width={1920} height={130} fill="url(#p3-sky45)" />
    {Array.from({ length: 16 }, (_, i) => <g key={i} stroke="#6b5a3a" strokeWidth={4}><line x1={i * 128} y1={0} x2={i * 128} y2={130} /><circle cx={i * 128 + 64} cy={65} r={24} fill="#b8362f" opacity={0.35} /></g>)}
    <rect y={125} width={1920} height={24} fill="#8a6a3a" />
    {/* gallery with spectators */}
    <rect y={149} width={1920} height={200} fill="#5a4a34" />
    {Array.from({ length: 34 }, (_, i) => <Sil key={i} x={30 + i * 57} y={330} h={130 + (i % 3) * 8} face={i % 2 ? 1 : -1} c={i % 4 ? "#3a3028" : "#4a3a30"} hat={i % 5 === 0 ? "lady" : "none"} skin={i % 3 ? "#cfae90" : undefined} />)}
    <rect y={300} width={1920} height={60} fill="#d9caa0" stroke={L} strokeWidth={lw} />
    {Array.from({ length: 48 }, (_, i) => <rect key={i} x={i * 40 + 10} y={305} width={16} height={50} rx={6} fill="#b9a878" />)}
    {/* wall with pilasters + doors */}
    <rect y={360} width={1920} height={520} fill="#c8b98f" />
    {[120, 420, 1500, 1800].map((x, i) => <rect key={i} x={x - 30} y={360} width={60} height={520} fill="#b7a67a" stroke={L} strokeWidth={3} />)}
    {[270, 1650].map((x, i) => <rect key={i} x={x - 70} y={560} width={140} height={320} fill="#4a3220" stroke={L} strokeWidth={lw} />)}
    {/* rostrum */}
    <g stroke={L} strokeWidth={lw}>
      <rect x={640} y={380} width={640} height={300} fill="#5a1f1c" />
      <path d="M 640 380 Q 960 330 1280 380" fill="#4a1816" />
      <rect x={950} y={330} width={20} height={60} fill="#c9a24a" /><circle cx={960} cy={320} r={18} fill="#c9a24a" />
      <g transform="translate(960 470)"><path d="M -60 -10 Q 0 -50 60 -10 L 40 20 Q 0 0 -40 20 Z" fill="#c9a24a" /><circle cy={-18} r={14} fill="#c9a24a" /></g>
    </g>
    <rect y={880} width={1920} height={200} fill="#6b2a24" />
    <Paint3 vig={0.35} />
  </g>
);

/** Presiding officer's desk (in front of the standing VP) and the lower clerks' tier. */
export const RostrumFG: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    <rect x={620} y={640} width={680} height={40} fill="#3a2414" />
    <rect x={640} y={680} width={640} height={130} fill="#4a2c18" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={670 + i * 155} y={700} width={130} height={90} fill="none" stroke="#2a1a0e" strokeWidth={5} />)}
    <path d="M 1120 628 L 1180 610 L 1188 624 L 1128 642 Z" fill="#6b4529" /><rect x={1170} y={600} width={18} height={30} fill="#6b4529" transform="rotate(-20 1179 615)" />
    <rect x={520} y={810} width={880} height={90} fill="#3a2414" />
    <rect x={500} y={800} width={920} height={20} fill="#5a3a22" />
  </g>
);

/** Senators' mahogany desks curving across the foreground. */
export const SenateDesksFG: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    {Array.from({ length: 9 }, (_, i) => { const x = i * 230 - 70; const y = 950 + Math.abs(i - 4) * 18; return (
      <g key={i}><path d={`M ${x} ${y} L ${x + 200} ${y} L ${x + 210} ${y + 30} L ${x - 10} ${y + 30} Z`} fill="#6b3a1c" /><rect x={x - 5} y={y + 30} width={210} height={140} fill="#4a2410" /></g>
    ); })}
  </g>
);

// ================================================================== Little White House, Warm Springs GA
/** Knotty-pine living room, fieldstone fireplace with a ship model, windows on Georgia pines, the easel with
 * Shoumatoff's portrait in progress. `dead` turns the April afternoon light grey. */
export const LittleWhiteHouse: React.FC<{ dead: number }> = ({ dead }) => {
  const head = `vp/franklin_roosevelt/${HEAD.franklin_roosevelt[0]}`;
  return (
    <g>
      <rect width={1920} height={1080} fill="#c4914f" />
      {Array.from({ length: 40 }, (_, i) => <g key={i}><line x1={i * 50} y1={0} x2={i * 50} y2={880} stroke="#a8763c" strokeWidth={4} />
        <ellipse cx={i * 50 + 25} cy={120 + rnd(i) * 700} rx={7} ry={11} fill="#8a5a2a" opacity={0.7} /><ellipse cx={i * 50 + 22} cy={rnd(i + 40) * 800} rx={5} ry={8} fill="#8a5a2a" opacity={0.6} /></g>)}
      <rect width={1920} height={60} fill="#6b4226" /><rect y={60} width={1920} height={20} fill="#8a5a32" />
      {/* fieldstone fireplace + ship model */}
      <g stroke={L} strokeWidth={lw}>
        <rect x={120} y={260} width={440} height={620} fill="#9a9184" />
        {Array.from({ length: 26 }, (_, i) => <ellipse key={i} cx={150 + (i % 5) * 92 + (Math.floor(i / 5) % 2) * 40} cy={300 + Math.floor(i / 5) * 110} rx={42} ry={30} fill={["#a8a092", "#8f877a", "#b3aa9b"][i % 3]} strokeWidth={2} />)}
        <rect x={90} y={500} width={500} height={30} fill="#6b4226" />
        <path d="M 220 880 L 220 680 Q 340 620 460 680 L 460 880 Z" fill="#1d140e" />
        <path d="M 250 880 Q 340 800 430 880 Z" fill="#e07a2a" opacity={0.55} />
        <g transform="translate(340 500)"><path d="M -90 0 L 90 0 L 70 -26 L -80 -26 Z" fill="#5a3a22" /><line x1={-30} y1={-26} x2={-30} y2={-120} /><line x1={30} y1={-26} x2={30} y2={-110} /><path d="M -28 -116 L 10 -60 L -28 -50 Z M 32 -106 L 64 -58 L 32 -52 Z" fill="#f1ead8" /></g>
      </g>
      {/* windows on the pines */}
      {[900, 1180].map((x, i) => (
        <g key={i}>
          <rect x={x} y={180} width={220} height={400} fill="#cfe3ea" stroke="#f1ead8" strokeWidth={14} />
          {[0, 1, 2].map((j) => <path key={j} d={`M ${x + 40 + j * 70} 580 L ${x + 40 + j * 70} 300 M ${x + 40 + j * 70} 300 l -40 120 l 80 0 Z M ${x + 40 + j * 70} 360 l -50 140 l 100 0 Z`} stroke="#2f4d2b" strokeWidth={4} fill="#3b5f33" />)}
          <line x1={x + 110} y1={180} x2={x + 110} y2={580} stroke="#f1ead8" strokeWidth={8} /><line x1={x} y1={380} x2={x + 220} y2={380} stroke="#f1ead8" strokeWidth={8} />
        </g>
      ))}
      <path d="M 900 580 L 1400 580 L 1560 1080 L 780 1080 Z" fill="#fff4d0" opacity={0.16 * (1 - dead)} />
      {/* the easel and the unfinished portrait */}
      <g stroke={L} strokeWidth={lw}>
        <path d="M 1590 1000 L 1660 260 M 1820 1000 L 1720 260 M 1700 1000 L 1690 260" strokeWidth={14} stroke="#6b4226" />
        <rect x={1540} y={300} width={300} height={380} fill="#eee6d2" />
        <clipPath id="p3-unfin"><rect x={1540} y={300} width={300} height={260} /></clipPath>
        <g clipPath="url(#p3-unfin)"><rect x={1540} y={300} width={300} height={380} fill="#d6c9a8" /><SImg href={staticFile(`tg2/${head}.png`)} x={1590} y={330} width={200} height={220} preserveAspectRatio="xMidYMid meet" />
          <path d="M 1560 560 Q 1690 470 1820 560 Z" fill="#2b3f74" /></g>
        <path d="M 1560 560 Q 1620 580 1700 556 Q 1760 590 1820 560" fill="none" stroke="#8a7a5a" strokeWidth={3} />
        <rect x={1530} y={680} width={320} height={20} fill="#6b4226" />
      </g>
      <rect y={880} width={1920} height={200} fill="#6b4226" />
      {Array.from({ length: 5 }, (_, i) => <line key={i} x1={0} y1={900 + i * 40} x2={1920} y2={900 + i * 40} stroke="#5a3519" strokeWidth={3} />)}
      <ellipse cx={900} cy={1000} rx={700} ry={70} fill="#7a3a2a" opacity={0.8} />
      <Paint3 vig={0.35} />
    </g>
  );
};

/** FDR's card table (foreground): green felt, papers, his cigarette holder in a tray. */
export const CardTableFG: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    <path d="M 700 840 L 1220 840 L 1260 880 L 660 880 Z" fill="#2f5a3a" />
    <rect x={660} y={880} width={600} height={24} fill="#6b4226" />
    <rect x={690} y={904} width={20} height={176} fill="#5a3519" /><rect x={1210} y={904} width={20} height={176} fill="#5a3519" />
    <rect x={760} y={826} width={150} height={30} fill="#f4ecd6" transform="rotate(-5 760 826)" />
    <ellipse cx={1120} cy={850} rx={40} ry={12} fill="#9a9a90" /><line x1={1100} y1={846} x2={1170} y2={826} stroke="#111" strokeWidth={5} />
  </g>
);

/** Grey "after" grade over the whole Warm Springs room (characters included). */
export const DeadGrade: React.FC<{ k: number }> = ({ k }) => (
  <g pointerEvents="none">
    <rect width={1920} height={1080} fill="#2a3348" opacity={0.42 * k} style={{ mixBlendMode: "multiply" }} />
    <rect width={1920} height={1080} fill="#000" opacity={0.18 * k} />
  </g>
);

// ================================================================== Cabinet Room, 7:09 p.m., 12 April 1945
/** From the oath photograph: pale walls with swag-relief panels, Wilson's portrait in a gilt frame, the mantel
 * clock beneath it, doorways left and right, cabinet members standing around. */
export const CabinetRoom: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#e3ddcf" />
    {[[120, 120], [1440, 120]].map(([x, y], i) => (
      <g key={i} stroke="#cbc3b0" strokeWidth={5} fill="none"><rect x={x} y={y} width={360} height={230} /><path d={`M ${x + 40} ${y + 60} Q ${x + 180} ${y + 160} ${x + 320} ${y + 60}`} /><path d={`M ${x + 60} ${y + 60} l 0 100 M ${x + 300} ${y + 60} l 0 100`} /></g>
    ))}
    {/* doorways */}
    <rect x={280} y={380} width={260} height={480} fill="#f1ede2" stroke="#bdb4a0" strokeWidth={8} /><rect x={300} y={400} width={220} height={460} fill="#d4cdbd" />
    <rect x={1640} y={400} width={240} height={460} fill="#f1ede2" stroke="#bdb4a0" strokeWidth={8} />
    {/* Wilson portrait */}
    <g stroke={L} strokeWidth={lw}>
      <rect x={770} y={40} width={380} height={470} fill="#b08a3c" /><rect x={796} y={66} width={328} height={418} fill="#6a5f50" />
      <path d="M 880 484 L 880 300 Q 960 250 1040 300 L 1040 484 Z" fill="#4a4038" strokeWidth={2} />
      <ellipse cx={960} cy={220} rx={52} ry={66} fill="#c9b49a" strokeWidth={2} /><path d="M 912 196 Q 960 150 1008 196 Q 960 176 912 196 Z" fill="#5a4a3a" strokeWidth={0} />
      <rect x={890} y={490} width={140} height={14} fill="#e9dfc8" />
    </g>
    {/* mantel shelf + clock */}
    <rect x={720} y={600} width={480} height={20} fill="#8a6a4a" stroke={L} strokeWidth={3} />
    <g transform="translate(960 560)" stroke={L} strokeWidth={4}><path d="M -80 40 L -80 0 Q 0 -80 80 0 L 80 40 Z" fill="#3a2414" /><circle cy={-4} r={34} fill="#f2ead4" /><line x1={0} y1={-4} x2={4} y2={-24} stroke="#111" strokeWidth={4} /><line x1={0} y1={-4} x2={-4} y2={24} stroke="#111" strokeWidth={4} /></g>
    <rect y={620} width={1920} height={260} fill="#d8d0c0" /><rect y={615} width={1920} height={8} fill="#bdb4a0" />
    {/* cabinet officers standing in an arc */}
    {[[110, 1, "#3a3a40"], [240, 1, "#45434a"], [370, 1, "#2e2e34"], [500, 1, "#4a4850"], [620, 1, "#38363d"], [1250, -1, "#2e2e34"], [1380, -1, "#45434a"], [1510, -1, "#38363d"], [1640, -1, "#4a4850"], [1780, -1, "#3a3a40"]].map(([x, fc, c], i) => (
      <Sil key={i} x={x as number} y={930 + (i % 2) * 14} h={520 + (i % 3) * 22} face={fc as 1 | -1} c={c as string} skin="#d6c2a8" />
    ))}
    {/* Bess Truman (hat) beside him */}
    <Sil x={1010} y={940} h={500} face={-1} hat="lady" c="#8f8a82" skin="#d6c2a8" />
    <rect y={880} width={1920} height={200} fill="#6b5a48" />
    <Paint3 vig={0.35} />
  </g>
);

/** The cabinet table (foreground) and Chief Justice Stone from behind in his robe, hand raised. */
export const CabinetTableFG: React.FC<{ judge?: boolean }> = ({ judge = true }) => (
  <g>
    <g stroke={L} strokeWidth={lw}>
      <path d="M -40 920 Q 960 860 1960 920 L 1960 1080 L -40 1080 Z" fill="#3a2414" />
      <path d="M -40 920 Q 960 860 1960 920" fill="none" stroke="#7a5030" strokeWidth={10} />
      <rect x={420} y={920} width={170} height={36} fill="#f4ecd6" transform="rotate(4 420 920)" />
      <ellipse cx={760} cy={930} rx={56} ry={16} fill="#1d1712" />
      <g transform="translate(1040 900)"><rect x={-50} y={-50} width={100} height={60} fill="#f4ecd6" /><rect x={-50} y={-50} width={100} height={16} fill="#b8362f" /><text y={2} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={26} fill="#2b2119" stroke="none">APR 12</text></g>
    </g>
    {judge && <g fill="#0f0d10">
      <path d="M 1270 1080 L 1300 800 Q 1320 700 1420 690 L 1560 690 Q 1660 700 1680 800 L 1710 1080 Z" />
      <ellipse cx={1490} cy={620} rx={78} ry={90} fill="#141216" /><path d="M 1420 580 Q 1490 510 1560 580 Q 1500 560 1420 580 Z" fill="#d8d8d8" />
      <path d="M 1340 740 L 1290 540" stroke="#0f0d10" strokeWidth={48} strokeLinecap="round" /><ellipse cx={1285} cy={515} rx={28} ry={38} fill="#e0c4a8" />
    </g>}
  </g>
);

/** A globe wreathed in war: drops onto the table (`at`), red arrows + smoke. Drawn at its own origin. */
export const WarGlobe: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f - at, [0, 7], [0, 1], { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const squash = f - at >= 7 && f - at < 10 ? 0.92 : 1;
  return (
    <g transform={`translate(${x} ${y - (1 - p) * 900}) scale(${1 / squash} ${squash})`} stroke={INK} strokeWidth={8}>
      <rect x={-18} y={-60} width={36} height={60} fill="#6b4529" /><ellipse cx={0} cy={0} rx={90} ry={18} fill="#4a2c18" />
      <circle cx={0} cy={-200} r={140} fill="#5d8fb5" />
      <path d="M -110 -260 Q -60 -300 -20 -250 Q 0 -200 -60 -180 Q -100 -200 -110 -260 Z M 10 -300 Q 80 -320 110 -260 Q 120 -200 60 -170 Q 40 -230 10 -300 Z M -40 -140 Q 0 -150 30 -110 Q 0 -80 -40 -100 Z" fill="#c9b27a" strokeWidth={5} />
      <path d="M -150 -200 A 150 150 0 0 0 150 -200" fill="none" stroke="#b08a3c" strokeWidth={10} />
      <g stroke="#e02b2b" strokeWidth={14} strokeLinecap="round" fill="none"><path d="M -90 -250 Q -40 -230 -10 -260" /><path d="M 70 -280 Q 40 -220 70 -180" /></g>
      {f - at >= 7 && [0, 1, 2].map((i) => <circle key={i} cx={-120 + i * 120} cy={-360 - ((f - at) % 30) * 2} r={34 + i * 6} fill="#8a8580" opacity={0.6} strokeWidth={4} />)}
    </g>
  );
};

// ================================================================== FDR's Oval Office (1934-45 West Wing)
/** FDR's Oval Office: grey-green curved walls, south windows with green drapes, flags, ship models in the
 * niche, sea paintings, and the hall door on the right (`door` 0 open .. 1 shut). */
export const FDROval: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#8f9c86" />
    <path d="M 0 0 L 1920 0 L 1920 60 Q 960 120 0 60 Z" fill="#e6e2d4" />
    <path d="M 0 60 Q 960 120 1920 60 L 1920 80 Q 960 140 0 80 Z" fill="#c9c2ad" />
    {/* south windows behind the desk */}
    {[620, 1140].map((x, i) => (
      <g key={i}>
        <rect x={x} y={190} width={160} height={480} fill="#dbe9e4" stroke="#f2eee2" strokeWidth={14} />
        {[0, 1, 2, 3].map((j) => <line key={j} x1={x} y1={190 + j * 120} x2={x + 160} y2={190 + j * 120} stroke="#f2eee2" strokeWidth={6} />)}
        <line x1={x + 80} y1={190} x2={x + 80} y2={670} stroke="#f2eee2" strokeWidth={6} />
        <path d={`M ${x - 50} 160 L ${x + 20} 160 Q ${x} 420 ${x + 10} 690 L ${x - 60} 690 Z`} fill="#3e5a3a" stroke={L} strokeWidth={3} />
        <path d={`M ${x + 210} 160 L ${x + 140} 160 Q ${x + 160} 420 ${x + 150} 690 L ${x + 220} 690 Z`} fill="#3e5a3a" stroke={L} strokeWidth={3} />
      </g>
    ))}
    <path d="M 620 670 L 1300 670 L 1500 1080 L 420 1080 Z" fill="#fff8de" opacity={0.1} />
    {/* flags */}
    <g stroke={L} strokeWidth={3}>
      <line x1={880} y1={170} x2={880} y2={760} stroke="#b08a3c" strokeWidth={9} />
      <path d="M 886 180 Q 940 230 930 340 Q 920 460 960 560 L 900 560 Q 886 420 886 300 Z" fill="#b8362f" />
      {[0, 1, 2].map((i) => <path key={i} d={`M 888 ${240 + i * 90} Q 920 ${270 + i * 90} 930 ${300 + i * 90}`} stroke="#f2ede0" strokeWidth={12} fill="none" />)}
      <path d="M 886 180 Q 910 200 916 250 L 888 256 Z" fill="#2b3f74" />
      <line x1={1060} y1={170} x2={1060} y2={760} stroke="#b08a3c" strokeWidth={9} />
      <path d="M 1054 180 Q 1000 230 1010 340 Q 1020 460 980 560 L 1040 560 Q 1054 420 1054 300 Z" fill="#2b3f74" />
      <circle cx={1028} cy={330} r={22} fill="#e9dfc8" />
    </g>
    {/* niche with ship models (left) + sea painting */}
    <g stroke={L} strokeWidth={lw}>
      <path d="M 120 760 L 120 300 A 110 110 0 0 1 340 300 L 340 760 Z" fill="#e6e2d4" />
      {[420, 600].map((y, i) => <g key={i}><rect x={130} y={y} width={200} height={12} fill="#c9c2ad" /><path d={`M 160 ${y} L 300 ${y} L 285 ${y - 22} L 172 ${y - 22} Z`} fill="#5a3a22" /><path d={`M 230 ${y - 22} L 230 ${y - 110} L 280 ${y - 40} Z`} fill="#f1ead8" /></g>)}
      <rect x={380} y={260} width={180} height={130} fill="#9c7a3e" /><rect x={394} y={274} width={152} height={102} fill="#6f93a8" /><path d="M 394 340 q 40 -20 80 0 t 72 0 L 546 376 L 394 376 Z" fill="#3e6680" />
    </g>
    {/* the hall door (right) */}
    <rect x={1560} y={220} width={260} height={660} fill="#f0d9a0" stroke={L} strokeWidth={lw} />
    <rect x={1580} y={240} width={220} height={640} fill="#e8c983" />
    <rect x={1540} y={200} width={300} height={24} fill="#e6e2d4" stroke={L} strokeWidth={3} />
    <rect y={880} width={1920} height={200} fill="#5a6a58" />
    <ellipse cx={960} cy={1000} rx={900} ry={90} fill="#4a5a4a" />
    <Paint3 vig={0.35} />
  </g>
);

/** The door leaf swinging shut over the hall doorway (drawn over whoever stands in it). 0 = open, 1 = shut. */
export const HallDoor: React.FC<{ shut: number }> = ({ shut }) => (
  <g stroke={L} strokeWidth={lw}>
    <path d={`M 1820 220 L ${1820 - shut * 260} ${220 + (1 - shut) * 30} L ${1820 - shut * 260} ${880 - (1 - shut) * 20} L 1820 880 Z`} fill="#e6e2d4" />
    {shut > 0.5 && <><rect x={1820 - shut * 240} y={300} width={180 * shut} height={220} fill="none" stroke="#c9c2ad" strokeWidth={6} /><rect x={1820 - shut * 240} y={580} width={180 * shut} height={240} fill="none" stroke="#c9c2ad" strokeWidth={6} /><circle cx={1820 - shut * 230} cy={560} r={10} fill="#b08a3c" /></>}
    <rect x={1540} y={200} width={20} height={680} fill="#e6e2d4" />
  </g>
);

/** The cluttered Hoover desk (foreground): figurines, ship model, lamp, and the war map. */
export const FDRDesk: React.FC<{ map?: boolean; report?: number }> = ({ map = true, report }) => {
  const f = useCurrentFrame();
  const rp = report === undefined ? 0 : interpolate(f - report, [0, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  return (
    <g stroke={L} strokeWidth={lw}>
      <path d="M 520 790 L 1400 790 L 1440 830 L 480 830 Z" fill="#7a4626" />
      <rect x={480} y={830} width={960} height={260} fill="#5a3219" />
      {[0, 1].map((i) => <rect key={i} x={520 + i * 680} y={860} width={200} height={190} fill="#4a2814" />)}
      {/* knick-knacks */}
      {[560, 610, 1330].map((x, i) => <g key={i}><rect x={x} y={760} width={34} height={30} fill="#3a3a3a" /><circle cx={x + 17} cy={752} r={12} fill={["#6a6a6a", "#b08a3c", "#3a5a8a"][i]} /></g>)}
      <g transform="translate(1250 790)"><path d="M -50 0 L 50 0 L 40 -16 L -44 -16 Z" fill="#5a3a22" /><line x1={0} y1={-16} x2={0} y2={-80} /><path d="M 2 -76 L 32 -30 L 2 -26 Z" fill="#f1ead8" /></g>
      <g transform="translate(680 790)"><rect x={-6} y={-90} width={12} height={90} fill="#b08a3c" /><path d="M -40 -90 L 40 -90 L 26 -140 L -26 -140 Z" fill="#e9dfc8" /></g>
      {map && <g transform="rotate(-3 960 800)"><rect x={800} y={772} width={300} height={40} fill="#d9c9a0" /><path d="M 820 790 q 40 -10 80 4 q 50 8 90 -6 M 840 802 l 60 -6" fill="none" stroke="#6a7a5a" strokeWidth={3} /><circle cx={1040} cy={790} r={6} fill="#e02b2b" strokeWidth={0} /></g>}
      {report !== undefined && f >= report && (
        <g transform={`translate(0 ${-(1 - rp) * 700})`}>
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={860 - i * 2} y={770 - i * 14} width={220} height={16} fill={i === 4 ? "#d9b46a" : "#f4ecd6"} />)}
          <text x={970} y={728} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={26} fill="#b8362f" stroke="none">S-1</text>
        </g>
      )}
    </g>
  );
};

// ================================================================== TOP SECRET insert
/** Close insert on a desk blotter: the Manhattan Project folder; TOP SECRET stamp at `stampAt`, chain + padlock
 * at `lockAt`; a green banker's lamp pools light at top left. */
export const SecretFolder: React.FC<{ stampAt: number; lockAt: number }> = ({ stampAt, lockAt }) => {
  const f = useCurrentFrame();
  const s = interpolate(f - stampAt, [0, 5], [2.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const lk = interpolate(f - lockAt, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
  return (
    <g>
      <defs><radialGradient id="p3-desklamp" cx="30%" cy="20%" r="75%"><stop offset="0" stopColor="#ffe6a8" stopOpacity={0.35} /><stop offset="1" stopColor="#000" stopOpacity={0.55} /></radialGradient></defs>
      <rect width={1920} height={1080} fill="#4a2c18" />
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M 0 ${30 + i * 70} Q 960 ${60 + i * 70} 1920 ${20 + i * 70}`} stroke="#3e2414" strokeWidth={6} fill="none" />)}
      <rect x={260} y={140} width={1400} height={860} fill="#2f4a3a" stroke={L} strokeWidth={lw} />
      <g transform="rotate(-4 960 560)" stroke={L} strokeWidth={5}>
        <rect x={520} y={250} width={860} height={640} fill="#000" opacity={0.3} transform="translate(20 24)" stroke="none" />
        <path d="M 520 250 L 760 250 L 790 220 L 1000 220 L 1030 250 L 1380 250 L 1380 890 L 520 890 Z" fill="#d9b46a" />
        <rect x={600} y={330} width={480} height={70} fill="#f4ecd6" strokeWidth={3} />
        <text x={620} y={378} fontFamily="DejaVu Sans Mono, monospace" fontWeight={700} fontSize={40} fill="#2b2119" stroke="none">S-1  MANHATTAN PROJECT</text>
        <text x={620} y={470} fontFamily="DejaVu Sans Mono, monospace" fontWeight={700} fontSize={30} fill="#5a4a2a" stroke="none">WAR DEPARTMENT · EYES ONLY</text>
        {f >= stampAt && <g transform={`translate(950 640) rotate(-10) scale(${s})`}>
          <rect x={-300} y={-70} width={600} height={140} fill="none" stroke="#d62828" strokeWidth={14} />
          <text y={34} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={96} fill="#d62828" stroke="none">TOP SECRET</text>
        </g>}
      </g>
      {f >= lockAt && <g transform={`translate(960 600) scale(${lk})`} stroke={INK} strokeWidth={8}>
        {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={-560 + i * 140} cy={-40 + (i - 4) * 12} rx={60} ry={28} fill="none" stroke="#8a8a8a" strokeWidth={16} />)}
        <path d="M -60 -40 L -60 -110 A 60 60 0 0 1 60 -110 L 60 -40" fill="none" stroke="#9a9a9a" strokeWidth={22} />
        <rect x={-90} y={-50} width={180} height={150} rx={18} fill="#c9a24a" /><circle cy={10} r={16} fill={INK} /><rect x={-6} y={14} width={12} height={40} fill={INK} />
      </g>}
      <rect width={1920} height={1080} fill="url(#p3-desklamp)" />
      <g stroke={L} strokeWidth={lw}><path d="M 120 -20 L 420 -20 L 460 90 L 80 90 Z" fill="#2e6b3e" /><ellipse cx={270} cy={92} rx={190} ry={18} fill="#fff1bd" /></g>
    </g>
  );
};

// ================================================================== map of Japan, 1945
const JX = (lon: number) => (lon - 121) * 0.788 * 86.4;
const JY = (lat: number) => (43 - lat) * 86.4;
const poly = (pts: number[][]) => pts.map(([lo, la], i) => `${i ? "L" : "M"} ${JX(lo).toFixed(1)} ${JY(la).toFixed(1)}`).join(" ") + " Z";
const HONSHU = [[130.9, 34.0], [131.4, 34.42], [132.4, 35.2], [133.3, 35.55], [134.5, 35.65], [135.5, 35.6], [136.0, 36.0], [136.8, 37.2], [137.3, 37.5], [137.0, 36.8], [138.5, 37.4], [139.3, 38.2], [139.9, 39.2], [140.0, 40.2], [140.0, 40.8], [140.9, 41.5], [141.5, 41.2], [141.6, 40.3], [142.0, 39.6], [141.6, 38.4], [141.0, 38.2], [140.9, 37.0], [140.6, 36.0], [140.9, 35.7], [140.3, 35.1], [139.8, 35.0], [139.1, 35.2], [138.8, 34.6], [138.2, 34.6], [137.0, 34.6], [136.8, 34.3], [136.0, 33.5], [135.2, 33.8], [135.1, 34.6], [134.3, 34.7], [133.0, 34.4], [132.2, 34.0], [131.3, 33.95]];
const KYUSHU = [[129.8, 33.2], [130.2, 33.9], [131.0, 33.95], [131.7, 33.3], [131.9, 32.4], [131.3, 31.4], [130.7, 31.0], [130.2, 31.3], [130.3, 32.1], [129.6, 32.6], [129.8, 33.0]];
const SHIKOKU = [[132.4, 33.3], [132.9, 33.95], [133.6, 34.25], [134.6, 34.2], [134.7, 33.8], [134.2, 33.3], [133.2, 32.75], [132.6, 32.85]];
const HOKKAIDO = [[140.0, 41.5], [140.1, 42.3], [139.8, 42.6], [140.5, 43.2], [141.4, 43.3], [141.7, 44.3], [141.9, 45.4], [142.5, 45.0], [143.5, 44.1], [144.8, 43.9], [145.3, 43.3], [144.3, 42.95], [143.3, 42.0], [141.9, 42.6], [141.0, 41.8]];
const KOREA = [[118, 50], [118, 39], [121, 39], [121.6, 40.9], [124.4, 39.9], [124.7, 38.1], [125.2, 37.7], [126.6, 37.0], [126.3, 36.0], [126.5, 34.6], [127.5, 34.6], [128.6, 34.9], [129.4, 35.4], [129.5, 36.0], [129.4, 37.0], [128.7, 38.2], [128.0, 38.7], [127.6, 39.6], [128.4, 40.0], [129.7, 40.8], [129.8, 41.4], [130.7, 42.4], [131.2, 43.0], [133.0, 42.8], [135.0, 43.6], [136.5, 44.8], [138.5, 46.8], [139.5, 48], [140, 50]];
export const JAPAN_PIN = { hiroshima: [JX(132.46), JY(34.39)], nagasaki: [JX(129.87), JY(32.75)], tokyo: [JX(139.7), JY(35.7)] } as const;

/** Map in the house style: mottled blue sea, beige land, white coastline rings; Japan crossfades to red at `fillAt`. */
export const JapanMap: React.FC<{ fillAt: number; pins: { name: string; at: number; dy?: number; k: keyof typeof JAPAN_PIN }[] }> = ({ fillAt, pins }) => {
  const f = useCurrentFrame();
  const r = interpolate(f - fillAt, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const land = (d: string, k: string, jp: boolean) => (
    <g key={k}>
      {[34, 22, 12].map((w, i) => <path key={i} d={d} fill="none" stroke="#eaf3f7" strokeWidth={w} opacity={0.18 + i * 0.12} strokeLinejoin="round" />)}
      <path d={d} fill="#e8dcbc" stroke="#6b5a3a" strokeWidth={4} strokeLinejoin="round" />
      {jp && <path d={d} fill="#d24a3a" opacity={0.75 * r} />}
    </g>
  );
  return (
    <g>
      <defs><filter id="p3-mottle"><feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={3} seed={4} /><feColorMatrix type="matrix" values="0 0 0 0 0.24  0 0 0 0 0.50  0 0 0 0 0.75  0 0 0 0.55 0" /></filter></defs>
      <rect width={1920} height={1080} fill="#3d7bb0" />
      <rect width={1920} height={1080} filter="url(#p3-mottle)" opacity={0.6} />
      {land(poly(KOREA), "ko", false)}
      {[["ho", HONSHU], ["ky", KYUSHU], ["sh", SHIKOKU], ["hk", HOKKAIDO]].map(([k, p]) => land(poly(p as number[][]), k as string, true))}
      <text x={JX(141.5)} y={JY(37.5)} fontFamily={MONTSERRAT} fontWeight={800} fontSize={64} fill="#fff" stroke={INK} strokeWidth={9} paintOrder="stroke" textAnchor="middle" transform={`rotate(-40 ${JX(141.5)} ${JY(37.5)})`}>JAPAN</text>
      <text x={JX(140)} y={JY(32)} fontFamily={MONTSERRAT} fontWeight={800} fontSize={40} fill="#d8ecf8" opacity={0.8} textAnchor="middle" letterSpacing={8}>PACIFIC OCEAN</text>
      {pins.map((p, i) => {
        if (f < p.at) return null;
        const s = interpolate(f - p.at, [0, 7], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
        const [x, y] = JAPAN_PIN[p.k];
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <g transform={`scale(${s})`} stroke={INK} strokeWidth={6}><path d="M 0 0 C -20 -30 -34 -46 -34 -66 A 34 34 0 0 1 34 -66 C 34 -46 20 -30 0 0 Z" fill="#e02b2b" /><circle cy={-66} r={12} fill="#fff" /></g>
            <text y={(p.dy ?? -92)} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={44} fill="#fff" stroke={INK} strokeWidth={9} paintOrder="stroke">{p.name}</text>
          </g>
        );
      })}
      <Paint3 vig={0.4} warm={false} />
    </g>
  );
};

// ================================================================== the Ferdinand Magellan's rear platform, 1948
/** The presidential railcar's observation end, at a prairie whistle stop or under St. Louis Union Station's
 * iron train shed (3 Nov 1948). Truman stands on the platform deck (feet at y≈800); the brass railing, bunting
 * and seal (PlatformRail) and the crowd (CrowdFG) are drawn after him. */
export const RearPlatform: React.FC<{ where: "whistle" | "stlouis" }> = ({ where }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {where === "whistle" ? (<>
        <defs><linearGradient id="p3-prairie" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7fb0d8" /><stop offset="1" stopColor="#e6eedc" /></linearGradient></defs>
        <rect width={1920} height={1080} fill="url(#p3-prairie)" />
        {[[240, 140], [1500, 110], [900, 70]].map(([x, y], i) => <g key={i} fill="#fbfbf7" opacity={0.9} transform={`translate(${x + f * 0.12} ${y})`}><ellipse rx={120} ry={40} /><ellipse cx={-70} cy={8} rx={70} ry={32} /><ellipse cx={70} cy={-14} rx={80} ry={44} /></g>)}
        <rect y={640} width={1920} height={440} fill="#c9b46a" />
        {/* grain elevator + depot */}
        <g stroke={L} strokeWidth={lw}>
          <rect x={1460} y={220} width={200} height={460} fill="#c9c2b0" /><path d="M 1450 220 L 1560 150 L 1670 220 Z" fill="#8a8274" />
          {[0, 1, 2].map((i) => <rect key={i} x={1660 + i * 80} y={360} width={80} height={320} fill="#b9b2a0" />)}
          <rect x={60} y={500} width={420} height={200} fill="#d9b44a" /><path d="M 30 510 L 270 420 L 510 510 Z" fill="#7a3a24" />
          {[110, 230, 350].map((x, i) => <rect key={i} x={x} y={560} width={60} height={80} fill="#3a3a40" />)}
          <rect x={160} y={450} width={220} height={40} fill="#f2ead4" />
        </g>
        <text x={270} y={480} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={26} fill="#2b2119">DEPOT</text>
        {Array.from({ length: 6 }, (_, i) => <g key={i} stroke="#5a4a3a" strokeWidth={6}><line x1={560 + i * 170} y1={420} x2={560 + i * 170} y2={680} /><line x1={540 + i * 170} y1={440} x2={580 + i * 170} y2={440} /></g>)}
        <path d="M 560 446 Q 645 470 730 446 Q 815 470 900 446 Q 985 470 1070 446 Q 1155 470 1240 446 Q 1325 470 1410 446" fill="none" stroke="#3a3028" strokeWidth={2} />
      </>) : (<>
        <rect width={1920} height={1080} fill="#4a4a4e" />
        {/* iron train-shed arches with smoky light */}
        {[0, 1, 2].map((i) => <path key={i} d={`M ${-200 + i * 40} 700 Q 960 ${-260 + i * 90} ${2120 - i * 40} 700`} fill="none" stroke="#2a2a2e" strokeWidth={30 - i * 8} />)}
        {Array.from({ length: 14 }, (_, i) => <line key={i} x1={i * 150} y1={0} x2={960 + (i - 7) * 60} y2={700} stroke="#2e2e32" strokeWidth={6} />)}
        <path d="M 300 0 L 700 0 L 1100 900 L 500 900 Z" fill="#e8e2c8" opacity={0.12} /><path d="M 1300 0 L 1600 0 L 1500 900 L 1100 900 Z" fill="#e8e2c8" opacity={0.08} />
        {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={300 + i * 380 + Math.sin(f / 30 + i) * 40} cy={260 + (i % 2) * 80} rx={300} ry={70} fill="#c9c4b4" opacity={0.12} />)}
        <rect x={0} y={560} width={420} height={180} fill="#2c3a2e" stroke={L} strokeWidth={lw} /><rect x={1500} y={560} width={420} height={180} fill="#2c3a2e" stroke={L} strokeWidth={lw} />
        {[40, 160, 280, 1540, 1660, 1780].map((x, i) => <rect key={i} x={x} y={590} width={80} height={60} fill="#d9c98a" opacity={0.7} />)}
        <rect y={700} width={1920} height={380} fill="#6a6660" />
      </>)}
      {/* the observation car end (Pullman green) */}
      <g stroke={L} strokeWidth={lw}>
        <path d="M 520 830 L 520 260 Q 960 170 1400 260 L 1400 830 Z" fill="#1f3326" />
        <path d="M 470 270 Q 960 150 1450 270 L 1450 300 Q 960 190 470 300 Z" fill="#2a2a2a" />
        <rect x={860} y={330} width={200} height={460} fill="#28402f" /><rect x={890} y={360} width={140} height={180} fill="#9fb4b8" />
        {[600, 1180].map((x, i) => <rect key={i} x={x} y={360} width={140} height={160} fill="#9fb4b8" />)}
        <rect x={440} y={800} width={1040} height={34} fill="#3a3a3a" />
        <rect x={520} y={834} width={880} height={60} fill="#151515" />
        {[620, 1300].map((x, i) => <circle key={i} cx={x} cy={900} r={48} fill="#2a2a2a" />)}
      </g>
      <text x={960} y={290} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={30} fill="#c9a24a" letterSpacing={4}>FERDINAND MAGELLAN</text>
      {where === "whistle" && <rect y={930} width={1920} height={150} fill="#b9a45a" />}
      <Paint3 vig={where === "whistle" ? 0.3 : 0.5} />
    </g>
  );
};

/** Brass railing, bunting and the presidential seal on the rear platform (drawn after Truman). */
export const PlatformRail: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    <rect x={460} y={640} width={1000} height={14} fill="#c9a24a" />
    {Array.from({ length: 11 }, (_, i) => <rect key={i} x={466 + i * 98} y={654} width={10} height={150} fill="#c9a24a" />)}
    <path d="M 470 660 Q 590 730 710 660 Q 830 730 950 660 Q 1070 730 1190 660 Q 1310 730 1450 660 L 1450 690 Q 1310 760 1190 690 Q 1070 760 950 690 Q 830 760 710 690 Q 590 760 470 690 Z" fill="#b8362f" />
    <path d="M 470 690 Q 590 760 710 690 Q 830 760 950 690 Q 1070 760 1190 690 Q 1310 760 1450 690 L 1450 712 Q 1310 782 1190 712 Q 1070 782 950 712 Q 830 782 710 712 Q 590 782 470 712 Z" fill="#f2ede0" />
    <path d="M 470 712 Q 590 782 710 712 Q 830 782 950 712 Q 1070 782 1190 712 Q 1310 782 1450 712 L 1450 734 Q 1310 804 1190 734 Q 1070 804 950 734 Q 830 804 710 734 Q 590 804 470 734 Z" fill="#2b3f74" />
    <circle cx={960} cy={706} r={62} fill="#2b3f74" /><circle cx={960} cy={706} r={48} fill="#e9dfc8" />
    <path d="M 930 700 Q 960 670 990 700 L 980 730 L 940 730 Z" fill="#b08a3c" strokeWidth={2} />
  </g>
);

/** The crowd from behind (foreground): hats, shoulders, a few raised arms; `papers` gives two of them the
 * morning's Chicago Daily Tribune with its famous wrong headline. */
export const CrowdFG: React.FC<{ papers?: boolean; cheerAt?: number }> = ({ papers, cheerAt = 99999 }) => {
  const f = useCurrentFrame();
  const people: [number, number, number, SilProps["hat"], string][] = [
    [60, 1200, 520, "fedora", "#1d1a17"], [250, 1230, 560, "none", "#26211c"], [450, 1190, 500, "lady", "#3a2a2a"], [1460, 1210, 520, "fedora", "#221e1a"],
    [1660, 1240, 580, "none", "#1d1a17"], [1860, 1200, 520, "fedora", "#2a241f"], [700, 1290, 520, "fedora", "#151310"], [1220, 1300, 540, "fedora", "#1a1714"],
  ];
  return (
    <g>
      {people.map(([x, y, h, hat, c], i) => <Sil key={i} x={x} y={y - (f >= cheerAt && i % 3 === 0 ? Math.abs(Math.sin((f - cheerAt + i * 5) / 6)) * 18 : 0)} h={h} face={i % 2 ? 1 : -1} hat={hat} c={c} arm={f >= cheerAt && i % 2 === 0} />)}
      {papers && (
        <g transform="translate(180 760) rotate(-6)" stroke={L} strokeWidth={4}>
          <rect x={0} y={0} width={470} height={300} fill="#efe9da" />
          <text x={235} y={44} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontWeight={700} fontSize={30} fill="#1d1712" stroke="none">CHICAGO DAILY TRIBUNE</text>
          <line x1={20} y1={58} x2={450} y2={58} strokeWidth={3} />
          <text x={235} y={130} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={60} fill="#1d1712" stroke="none">DEWEY</text>
          <text x={235} y={198} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={60} fill="#1d1712" stroke="none">DEFEATS</text>
          <text x={235} y={266} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={60} fill="#1d1712" stroke="none">TRUMAN</text>
        </g>
      )}
    </g>
  );
};

// ================================================================== Dewey's suite, Roosevelt Hotel NYC, 2 Nov 1948
/** Election-night hotel suite: window on the Manhattan night (Chrysler Building spire), console radio with a
 * glowing dial (`talkAt` sends out sound arcs), DEWEY-WARREN pennant, floor lamp. */
export const DeweySuite: React.FC<{ talkAt?: number }> = ({ talkAt = 99999 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect width={1920} height={1080} fill="#9aa59a" />
      <rect width={1920} height={70} fill="#e6e2d4" /><rect y={70} width={1920} height={14} fill="#c9c2ad" />
      {/* window on Manhattan */}
      <rect x={160} y={170} width={620} height={520} fill="#0f1630" stroke="#e6e2d4" strokeWidth={16} />
      {Array.from({ length: 12 }, (_, i) => { const x = 180 + i * 52; const h = 160 + rnd(i + 3) * 220; return <g key={i}><rect x={x} y={690 - h} width={44} height={h} fill="#1d2440" />{Array.from({ length: 8 }, (_, j) => rnd(i * 13 + j) > 0.5 && <rect key={j} x={x + 8 + (j % 2) * 18} y={700 - h + 14 + Math.floor(j / 2) * 30} width={10} height={14} fill="#f2d98a" opacity={0.8} />)}</g>; })}
      <g transform="translate(560 690)" stroke="#0f1630" strokeWidth={2}><rect x={-34} y={-380} width={68} height={380} fill="#3a4466" /><path d="M -34 -380 L -24 -440 L 24 -440 L 34 -380 Z" fill="#c9ccd8" /><path d="M -22 -440 L -14 -490 L 14 -490 L 22 -440 Z" fill="#dfe2ea" /><path d="M -10 -490 L 0 -570 L 10 -490 Z" fill="#eef0f4" />
        {[-470, -455, -440, -425].map((y, i) => <path key={i} d={`M -20 ${y + 40} q 20 -20 40 0`} fill="none" stroke="#0f1630" strokeWidth={2} />)}</g>
      <line x1={470} y1={170} x2={470} y2={690} stroke="#e6e2d4" strokeWidth={8} />
      <path d="M 120 130 L 230 130 Q 200 420 240 720 L 110 720 Z" fill="#7a2a2a" stroke={L} strokeWidth={lw} />
      <path d="M 820 130 L 710 130 Q 740 420 700 720 L 830 720 Z" fill="#7a2a2a" stroke={L} strokeWidth={lw} />
      {/* pennant */}
      <g transform="translate(1000 200) rotate(6)" stroke={L} strokeWidth={4}><path d="M 0 0 L 460 50 L 0 110 Z" fill="#2b3f74" /><text x={30} y={68} fontFamily={MONTSERRAT} fontWeight={800} fontSize={34} fill="#fff" stroke="none">DEWEY · WARREN</text></g>
      {/* console radio */}
      <g stroke={L} strokeWidth={lw}>
        <path d="M 1440 880 L 1440 420 Q 1560 360 1680 420 L 1680 880 Z" fill="#6b4226" />
        <rect x={1480} y={470} width={160} height={70} rx={20} fill="#f2c96a" />
        <line x1={1560} y1={478} x2={1580} y2={532} stroke="#8a2a1a" strokeWidth={4} />
        <rect x={1480} y={570} width={160} height={230} fill="#c9b48a" />
        {Array.from({ length: 6 }, (_, i) => <line key={i} x1={1480} y1={590 + i * 36} x2={1640} y2={590 + i * 36} stroke="#a08a5a" strokeWidth={4} />)}
      </g>
      <circle cx={1560} cy={505} r={90} fill="#f2c96a" opacity={0.18} />
      {f >= talkAt && [0, 1, 2].map((i) => { const k = ((f - talkAt) / 4 + i) % 3; return <path key={i} d={`M ${1380 - k * 40} ${560 - k * 40} Q ${1340 - k * 50} 640 ${1380 - k * 40} ${720 + k * 40}`} fill="none" stroke="#fff" strokeWidth={8} opacity={1 - k / 3} />; })}
      {/* floor lamp */}
      <g stroke={L} strokeWidth={lw}><line x1={1250} y1={300} x2={1250} y2={880} strokeWidth={10} /><path d="M 1180 300 L 1320 300 L 1290 220 L 1210 220 Z" fill="#f2e6c4" /></g>
      <circle cx={1250} cy={300} r={200} fill="#ffe6a8" opacity={0.12} />
      <rect y={880} width={1920} height={200} fill="#5a4a3a" />
      <ellipse cx={960} cy={1000} rx={820} ry={80} fill="#7a5a3a" opacity={0.7} />
      <Paint3 vig={0.45} />
    </g>
  );
};

/** Coffee table (foreground) with the champagne already on ice and a telephone. */
export const SuiteTableFG: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    <path d="M 980 930 L 1460 930 L 1500 970 L 940 970 Z" fill="#4a2c18" /><rect x={940} y={970} width={560} height={20} fill="#3a2414" />
    <rect x={960} y={990} width={20} height={100} fill="#3a2414" /><rect x={1460} y={990} width={20} height={100} fill="#3a2414" />
    <path d="M 1060 940 L 1050 860 L 1150 860 L 1140 940 Z" fill="#b8b8b0" /><rect x={1088} y={790} width={24} height={80} fill="#1f4a2a" /><rect x={1092} y={770} width={16} height={24} fill="#c9a24a" />
    {[1200, 1250].map((x, i) => <g key={i}><path d={`M ${x} 880 L ${x + 30} 880 L ${x + 15} 910 Z`} fill="#eef4f4" /><line x1={x + 15} y1={910} x2={x + 15} y2={935} /></g>)}
    <rect x={1330} y={900} width={90} height={36} rx={8} fill="#111" /><path d="M 1320 900 Q 1375 850 1430 900" fill="none" stroke="#111" strokeWidth={16} />
  </g>
);
