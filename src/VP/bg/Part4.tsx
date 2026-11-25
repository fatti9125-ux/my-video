import React from "react";
import { Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SImg } from "../../Thanksgiving3/Kit";
import { MONTSERRAT } from "../../fonts";
import { INK } from "../VKit";
import VPRIG from "../vprig.json";
import META from "../../Thanksgiving3/vp_sprites.json";

/**
 * Part 4 plates (LBJ -> Nixon -> Ford -> G.H.W. Bush). One painted plate per real place, built from the
 * real layout of each location (no bgref photos exist for this part: layouts from knowledge of the places,
 * era-correct). Same recipe as PilotBg.tsx: 4-7 depth layers, thinner warm background line work, mood by
 * grade and light; foreground occluders are separate components drawn AFTER the characters.
 */

const L = "#2b2119";
const lw = 4;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Soft painted texture + vignette for every plate. */
export const Paint: React.FC<{ vig?: number; warm?: boolean }> = ({ vig = 0.45, warm = true }) => (
  <g pointerEvents="none">
    <defs>
      <filter id="p4-tex" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={4} seed={23} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <radialGradient id={warm ? "p4-vigw" : "p4-vigc"} cx="50%" cy="48%" r="72%">
        <stop offset="0.5" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor={warm ? "#1a0f05" : "#05070f"} stopOpacity={1} />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} filter="url(#p4-tex)" opacity={0.16} style={{ mixBlendMode: "soft-light" }} />
    <rect width={1920} height={1080} fill={`url(#${warm ? "p4-vigw" : "p4-vigc"})`} opacity={vig} />
  </g>
);

const Cloud: React.FC<{ x: number; y: number; s?: number; o?: number; c?: string }> = ({ x, y, s = 1, o = 0.95, c = "#fbfbf7" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={c} opacity={o}>
    <ellipse cx={0} cy={0} rx={120} ry={42} /><ellipse cx={-70} cy={8} rx={70} ry={34} /><ellipse cx={60} cy={-18} rx={80} ry={46} /><ellipse cx={130} cy={10} rx={60} ry={28} />
  </g>
);

const Tree: React.FC<{ x: number; y: number; s?: number; c?: [string, string, string] }> = ({ x, y, s = 1, c = ["#4f7d3a", "#629448", "#3e6a30"] }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -12 0 L -8 -170 M -8 -140 Q 30 -190 70 -210 M -8 -160 Q -50 -200 -80 -220" stroke="#4a3626" strokeWidth={18} fill="none" strokeLinecap="round" />
    <g stroke={L} strokeWidth={3}>
      <ellipse cx={-80} cy={-240} rx={115} ry={90} fill={c[2]} /><ellipse cx={70} cy={-250} rx={125} ry={95} fill={c[0]} />
      <ellipse cx={-10} cy={-320} rx={125} ry={100} fill={c[1]} /><ellipse cx={20} cy={-210} rx={105} ry={66} fill={c[0]} />
    </g>
  </g>
);

const SUITS = ["#2a2622", "#3a3530", "#24303e", "#3d2f28", "#2f3a2e", "#4a3b31"];
const HAIR = ["#2b1d14", "#4a3424", "#7a7066", "#1a1512", "#8a6a3a", "#5b4636"];

/** Heads-and-shoulders seen from behind (foreground crowd / press / audience). Hard silhouettes, warm-dark. */
export const Crowd: React.FC<{ y: number; x0?: number; x1?: number; n: number; seed?: number; s?: number; dark?: number; hats?: boolean;
  signs?: [number, string, string?][]; bob?: number; flashes?: boolean; cams?: boolean }> =
  ({ y, x0 = 0, x1 = 1920, n, seed = 1, s = 1, dark = 0, hats, signs = [], bob = 0, flashes, cams }) => {
    const f = useCurrentFrame();
    return (
      <g>
        {Array.from({ length: n }, (_, i) => {
          const x = x0 + ((x1 - x0) * (i + 0.5)) / n + (rnd(seed * 31 + i) - 0.5) * 50;
          const sc = s * (0.9 + rnd(seed + i * 7) * 0.22);
          const yy = y + rnd(seed * 3 + i) * 34 + (bob ? Math.abs(Math.sin(f / 6 + i * 1.7)) * -bob : 0);
          const suit = SUITS[Math.floor(rnd(i + seed * 5) * SUITS.length)];
          const hair = HAIR[Math.floor(rnd(i * 3 + seed) * HAIR.length)];
          const sign = signs.find((q) => q[0] === i);
          const fl = flashes && (f + i * 13 + seed) % 41 < 2;
          return (
            <g key={i} transform={`translate(${x} ${yy}) scale(${sc})`}>
              {sign && (<g>
                <rect x={-5} y={-330} width={10} height={300} fill="#8a6a3a" stroke={L} strokeWidth={3} />
                <rect x={-120} y={-420} width={240} height={110} rx={6} fill={sign[2] ?? "#f4f1ea"} stroke={L} strokeWidth={4} />
                <text x={0} y={-347} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={sign[1].length > 6 ? 38 : 54} fill={sign[2] && sign[2] !== "#f4f1ea" ? "#fff" : "#1d3a7a"}>{sign[1]}</text>
              </g>)}
              <path d="M -112 420 L -112 96 Q -104 22 -32 12 L 32 12 Q 104 22 112 96 L 112 420 Z" fill={suit} stroke="#120d09" strokeWidth={4} />
              <path d="M -14 12 L 0 40 L 14 12 Z" fill="#d8d2c4" opacity={0.6} />
              <ellipse cx={0} cy={-46} rx={50} ry={60} fill={hair} stroke="#120d09" strokeWidth={4} />
              <ellipse cx={-50} cy={-38} rx={9} ry={16} fill="#c99b7a" opacity={0.75} /><ellipse cx={50} cy={-38} rx={9} ry={16} fill="#c99b7a" opacity={0.75} />
              {hats && i % 2 === 0 && <g fill="#1e1a16" stroke="#0e0b08" strokeWidth={3}><ellipse cx={0} cy={-82} rx={78} ry={15} /><path d="M -46 -82 Q -48 -140 0 -142 Q 48 -140 46 -82 Z" /><rect x={-46} y={-96} width={92} height={10} fill="#4a3b2b" /></g>}
              {cams && i % 3 === 1 && <g><rect x={30} y={-110} width={86} height={62} rx={6} fill="#151515" stroke="#000" strokeWidth={3} /><rect x={98} y={-190} width={12} height={84} fill="#2a2a2a" /><circle cx={104} cy={-196} r={26} fill="#cfcfcf" stroke="#333" strokeWidth={4} /></g>}
              {fl && <g><circle cx={104} cy={-196} r={70} fill="#fff" opacity={0.85} />{[0, 45, 90, 135].map((a) => <rect key={a} x={-4} y={-150} width={8} height={300} fill="#fff" transform={`translate(104 -196) rotate(${a})`} opacity={0.7} />)}</g>}
            </g>
          );
        })}
      </g>
    );
  };

/** Hanging US flag on a pole (indoor draped style). `kind` "pres" = presidential flag. */
export const FlagPole: React.FC<{ x: number; y: number; h: number; kind?: "us" | "pres" | "state"; s?: number }> = ({ x, y, h, kind = "us", s = 1 }) => {
  const id = `p4-fl-${Math.round(x)}-${Math.round(y)}`;
  const top = y - h;
  const W = 150 * s, H = 300 * s;
  const shape = `M ${x + 4} ${top + 24} Q ${x + W * 0.5} ${top + 14} ${x + W} ${top + 34} Q ${x + W * 0.8} ${top + H * 0.5} ${x + W * 0.95} ${top + H} Q ${x + W * 0.5} ${top + H + 18} ${x + 4} ${top + H * 0.92} Z`;
  return (
    <g>
      <defs><clipPath id={id}><path d={shape} /></clipPath></defs>
      <rect x={x - 5} y={top} width={10} height={h} fill="#b08a3c" stroke={L} strokeWidth={2} />
      <path d={`M ${x - 14} ${top + 4} L ${x} ${top - 26} L ${x + 14} ${top + 4} Z`} fill="#d8b04a" stroke={L} strokeWidth={2} />
      <rect x={x - 30} y={y - 8} width={60} height={14} rx={6} fill="#6b4a22" />
      <g clipPath={`url(#${id})`}>
        {kind === "us" && (<>
          {Array.from({ length: 13 }, (_, i) => <rect key={i} x={x} y={top + 14 + i * ((H + 10) / 13)} width={W + 10} height={(H + 10) / 13} fill={i % 2 ? "#f4f0e6" : "#b8362f"} />)}
          <rect x={x} y={top} width={W * 0.48} height={H * 0.55} fill="#2b3f74" />
          {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={x + 14 + (i % 3) * 22 * s} cy={top + 40 + Math.floor(i / 3) * 30 * s} r={3.5 * s} fill="#fff" />)}
        </>)}
        {kind === "pres" && (<>
          <rect x={x} y={top} width={W + 10} height={H + 30} fill="#23305e" />
          <circle cx={x + W * 0.5} cy={top + H * 0.5} r={44 * s} fill="#c9a640" stroke="#f4f0e6" strokeWidth={4} />
          <path d={`M ${x + W * 0.5 - 24 * s} ${top + H * 0.5} l ${24 * s} ${-26 * s} l ${24 * s} ${26 * s} l ${-24 * s} ${22 * s} z`} fill="#7a5a1c" />
        </>)}
        {kind === "state" && <rect x={x} y={top} width={W + 10} height={H + 30} fill="#3a4f86" />}
        {[0.3, 0.62].map((k, i) => <path key={i} d={`M ${x + W * k} ${top + 20} Q ${x + W * k + 10} ${top + H * 0.5} ${x + W * k - 6} ${top + H}`} stroke="#000" strokeWidth={14} opacity={0.14} fill="none" />)}
      </g>
      <path d={shape} fill="none" stroke={L} strokeWidth={3} />
      <path d={`M ${x + W * 0.9} ${top + H * 0.95} l 8 30 l 6 -28`} stroke="#d8b04a" strokeWidth={3} fill="none" />
    </g>
  );
};

/** Crystal chandelier with a warm glow. */
export const Chandelier: React.FC<{ x: number; y: number; s?: number; glow?: number }> = ({ x, y, s = 1, glow = 0.5 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={190} fill="#fff1c2" opacity={glow * 0.35} style={{ mixBlendMode: "screen" }} />
      <line x1={0} y1={-400} x2={0} y2={-120} stroke="#8a6a2a" strokeWidth={6} />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <ellipse cx={0} cy={-90 + r * 55} rx={60 + r * 40} ry={14 + r * 4} fill="none" stroke="#d8c48a" strokeWidth={5} />
          {Array.from({ length: 7 + r * 3 }, (_, i) => { const a = (i / (7 + r * 3)) * Math.PI * 2; return <path key={i} d={`M ${Math.cos(a) * (60 + r * 40)} ${-90 + r * 55 + Math.sin(a) * (14 + r * 4)} l -6 18 l 6 16 l 6 -16 z`} fill="#f6f1df" stroke="#b9a56a" strokeWidth={2} opacity={0.6 + 0.4 * Math.abs(Math.sin(f / 9 + i + r))} />; })}
        </g>
      ))}
      <path d="M -20 70 L 0 110 L 20 70 Z" fill="#e9dfb5" stroke="#b9a56a" strokeWidth={2} />
    </g>
  );
};

/** Red/white/blue bunting swags. */
export const Bunting: React.FC<{ x0: number; x1: number; y: number; n: number; d?: number }> = ({ x0, x1, y, n, d = 70 }) => {
  const w = (x1 - x0) / n;
  const band = (a: number, k1: number, k2: number, c: string) => `M ${a} ${y} Q ${a + w / 2} ${y + k1 * 2} ${a + w} ${y} L ${a + w} ${y} Q ${a + w / 2} ${y + k2 * 2} ${a} ${y} Z`;
  return (
    <g stroke={L} strokeWidth={2}>
      {Array.from({ length: n }, (_, i) => { const a = x0 + i * w; return (
        <g key={i}>
          <path d={band(a, d, 0, "")} fill="#b8362f" />
          <path d={band(a, d * 0.68, 0, "")} fill="#f4f0e6" />
          <path d={band(a, d * 0.36, 0, "")} fill="#2b3f74" />
          <circle cx={a} cy={y} r={10} fill="#d8b04a" />
        </g>
      ); })}
    </g>
  );
};

/** Floating / dropping balloons. `fall` px per frame (0 = bobbing in place). */
export const Balloons: React.FC<{ n: number; seed?: number; y0?: number; y1?: number; fall?: number; s?: number }> = ({ n, seed = 3, y0 = 60, y1 = 500, fall = 0, s = 1 }) => {
  const f = useCurrentFrame();
  const cols = ["#c8302b", "#f4f0e6", "#2b4a9c"];
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = rnd(seed * 17 + i) * 1960 - 20 + Math.sin(f / 23 + i) * 10;
        let y = y0 + rnd(seed * 5 + i * 3) * (y1 - y0) + f * fall * (0.7 + rnd(i) * 0.6) + Math.sin(f / 17 + i * 2) * 6;
        if (fall) y = ((y + 200) % 1400) - 200;
        const r = (30 + rnd(i * 9 + seed) * 18) * s;
        return (
          <g key={i}>
            <path d={`M ${x} ${y + r * 1.15} q 10 30 -4 60`} stroke="#6a6a6a" strokeWidth={2} fill="none" />
            <ellipse cx={x} cy={y} rx={r} ry={r * 1.15} fill={cols[i % 3]} stroke={L} strokeWidth={3} />
            <ellipse cx={x - r * 0.35} cy={y - r * 0.4} rx={r * 0.22} ry={r * 0.32} fill="#fff" opacity={0.45} />
          </g>
        );
      })}
    </g>
  );
};

/** Confetti flutter (on 2s). */
export const Confetti: React.FC<{ n?: number; seed?: number }> = ({ n = 70, seed = 5 }) => {
  const f = Math.floor(useCurrentFrame() / 2) * 2;
  const cols = ["#c8302b", "#f4f0e6", "#2b4a9c", "#e9b23c"];
  return <g>{Array.from({ length: n }, (_, i) => { const x = rnd(seed + i * 7) * 1920 + Math.sin(f / 10 + i) * 30; const y = ((rnd(seed * 3 + i) * 1100 + f * (3 + rnd(i) * 3)) % 1150) - 40; return <rect key={i} x={x} y={y} width={14} height={8} fill={cols[i % 4]} transform={`rotate(${(f * 7 + i * 40) % 360} ${x} ${y})`} />; })}</g>;
};

// ================================================================== AIR FORCE ONE (SAM 26000), 22 Nov 1963
/** AF1 stateroom, Love Field: cramped low cabin, curved ceiling with light strips, small 707 windows with drawn curtains,
 *  wood dado, presidential seal plaque, blue-grey carpet, cool fluorescent grade. */
export const AF1Stateroom: React.FC = () => (
  <g>
    <defs>
      <linearGradient id="p4-af1wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e3d8bf" /><stop offset="1" stopColor="#c7b893" /></linearGradient>
      <radialGradient id="p4-af1lt" cx="50%" cy="0%" r="75%"><stop offset="0" stopColor="#fffbe6" stopOpacity={0.55} /><stop offset="1" stopColor="#fffbe6" stopOpacity={0} /></radialGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#p4-af1wall)" />
    <path d="M 0 0 L 1920 0 L 1920 200 Q 960 130 0 200 Z" fill="#eee7d6" stroke={L} strokeWidth={lw} />
    {[-1, 1].map((s) => <rect key={s} x={960 + s * 330 - 260} y={62 + (s > 0 ? 0 : 0)} width={520} height={22} rx={10} fill="#fffdf2" stroke="#b9ad90" strokeWidth={3} />)}
    <rect y={196} width={1920} height={28} fill="#b6a684" stroke={L} strokeWidth={3} />
    <path d="M 0 0 L 1920 0 L 1920 900 L 0 900 Z" fill="url(#p4-af1lt)" />
    {/* windows with half-drawn curtains */}
    {[170, 420, 1500, 1750].map((x, i) => (
      <g key={i}>
        <rect x={x - 62} y={310} width={124} height={160} rx={46} fill="#b8a780" stroke={L} strokeWidth={lw} />
        <rect x={x - 46} y={326} width={92} height={128} rx={36} fill="#dfeaf0" />
        <rect x={x - 46} y={420} width={92} height={34} fill="#9aa2a6" opacity={0.6} />
        <path d={`M ${x - 70} 296 Q ${x - 40} 390 ${x - 64} 490 L ${x - 20} 490 Q ${x - 30} 390 ${x - 10} 296 Z`} fill="#a98d5a" stroke={L} strokeWidth={3} />
        <path d={`M ${x + 70} 296 Q ${x + 40} 390 ${x + 64} 490 L ${x + 30} 490 Q ${x + 30} 390 ${x + 22} 296 Z`} fill="#a98d5a" stroke={L} strokeWidth={3} />
      </g>
    ))}
    {/* bulkhead with presidential seal plaque, centred above the oath */}
    <rect x={700} y={224} width={520} height={640} fill="#d3c4a0" stroke={L} strokeWidth={3} />
    <circle cx={960} cy={300} r={62} fill="#2b3f74" stroke="#c9a640" strokeWidth={10} />
    <circle cx={960} cy={300} r={36} fill="#efe7cf" /><path d="M 940 300 l 20 -26 l 20 26 l -20 20 z" fill="#c9a640" />
    {/* wood dado */}
    <rect y={600} width={1920} height={270} fill="#7d5d3d" />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={30 + i * 212} y={630} width={180} height={210} fill="none" stroke="#5c412a" strokeWidth={5} />)}
    <rect y={596} width={1920} height={10} fill="#a6865a" />
    {/* the crowd of staff pressed against the back wall (soft, out of focus) */}
    <g opacity={0.55} filter="url(#p4-soft)">
      <defs><filter id="p4-soft"><feGaussianBlur stdDeviation={4} /></filter></defs>
      {[[120, 0.85], [300, 0.9], [470, 0.8], [1460, 0.85], [1650, 0.9], [1820, 0.8]].map(([x, s], i) => (
        <g key={i} transform={`translate(${x} 640) scale(${s})`}>
          <path d="M -110 400 L -110 90 Q -100 20 -30 12 L 30 12 Q 100 20 110 90 L 110 400 Z" fill={SUITS[i % 6]} />
          <ellipse cx={0} cy={-46} rx={50} ry={60} fill="#b08b70" /><path d="M -50 -70 Q 0 -120 50 -70 L 50 -84 Q 0 -126 -50 -84 Z" fill={HAIR[i % 6]} />
        </g>
      ))}
    </g>
    <rect y={860} width={1920} height={220} fill="#3e5168" />
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} y1={880 + i * 36} x2={1920} y2={880 + i * 36} stroke="#33445a" strokeWidth={3} />)}
    <rect width={1920} height={1080} fill="#9fc0b0" opacity={0.1} style={{ mixBlendMode: "multiply" }} />
    <Paint vig={0.45} />
  </g>
);

/** Foreground: Cecil Stoughton seen from behind, Hasselblad raised; flash at `flashAt` (full-frame pop). */
export const Photographer: React.FC<{ at: number; flashAt: number; x?: number }> = ({ at, flashAt, x = 250 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const rise = interpolate(f - at, [0, 7], [360, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fl = f - flashAt;
  return (
    <g>
      <g transform={`translate(${x} ${rise})`}>
        <path d="M -230 1090 L -220 830 Q -200 730 -90 715 L 90 715 Q 200 730 220 830 L 230 1090 Z" fill="#1d1a18" stroke="#000" strokeWidth={5} />
        <path d="M -150 760 Q -150 640 -40 600 L -10 640 Q -90 680 -96 770 Z" fill="#1d1a18" stroke="#000" strokeWidth={5} />
        <path d="M 150 760 Q 160 650 90 600 L 50 630 Q 100 680 96 770 Z" fill="#1d1a18" stroke="#000" strokeWidth={5} />
        <ellipse cx={0} cy={640} rx={78} ry={92} fill="#191410" stroke="#000" strokeWidth={5} />
        <ellipse cx={-76} cy={650} rx={12} ry={22} fill="#a8836a" /><ellipse cx={76} cy={650} rx={12} ry={22} fill="#a8836a" />
        <rect x={-70} y={520} width={150} height={96} rx={8} fill="#2a2a2a" stroke="#000" strokeWidth={5} />
        <rect x={-48} y={500} width={100} height={24} fill="#3a3a3a" stroke="#000" strokeWidth={4} />
        <rect x={92} y={380} width={20} height={150} fill="#333" stroke="#000" strokeWidth={3} />
        <circle cx={102} cy={372} r={34} fill="#d6d6d6" stroke="#222" strokeWidth={5} />
        {fl >= 0 && fl < 3 && <g><circle cx={102} cy={372} r={110} fill="#fff" opacity={0.9} />{[0, 45, 90, 135].map((a) => <rect key={a} x={-5} y={-230} width={10} height={460} fill="#fff" transform={`translate(102 372) rotate(${a})`} />)}</g>}
      </g>
      {fl >= 0 && fl < 6 && <rect width={1920} height={1080} fill="#fff" opacity={interpolate(fl, [0, 1, 5], [0.7, 0.45, 0])} />}
    </g>
  );
};

/** Foreground: Judge Sarah T. Hughes from behind (brown polka-dot dress, curls), holding out the missal. Covers the
 *  cut-off sleeve at the right edge of LBJ's oath drawing. `x` = her centre. */
export const JudgeFG: React.FC<{ x: number; y?: number }> = ({ x, y = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <defs><pattern id="p4-dots" width={34} height={34} patternUnits="userSpaceOnUse"><rect width={34} height={34} fill="#5a3a26" /><circle cx={8} cy={8} r={5} fill="#d9c7a8" /><circle cx={25} cy={25} r={5} fill="#d9c7a8" /></pattern></defs>
    <path d="M -210 1090 L -200 780 Q -180 690 -80 676 L 80 676 Q 180 690 200 780 L 210 1090 Z" fill="url(#p4-dots)" stroke="#120d09" strokeWidth={5} />
    <path d="M -186 760 Q -260 760 -300 790 L -296 830 Q -240 812 -178 840 Z" fill="url(#p4-dots)" stroke="#120d09" strokeWidth={5} />
    <path d="M -36 676 L -30 640 L 30 640 L 36 676 Z" fill="#c99b7a" stroke="#120d09" strokeWidth={4} />
    {[[-40, 590], [0, 570], [40, 590], [-56, 630], [56, 630], [-20, 610], [24, 612], [0, 640]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={40} fill="#6e6862" stroke="#120d09" strokeWidth={4} />)}
    {[[-30, 600], [10, 585], [30, 620]].map(([cx, cy], i) => <path key={i} d={`M ${cx - 16} ${cy} q 16 -14 32 0`} stroke="#8d8780" strokeWidth={4} fill="none" />)}
  </g>
);

/** Love Field, Dallas: SAM 26000 (Boeing 707, Loewy livery) parked with the rear boarding stairs, flat terminal, sun. */
export const LoveField: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs>
        <linearGradient id="p4-tx-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5f9bd1" /><stop offset="1" stopColor="#d6e6ee" /></linearGradient>
        <linearGradient id="p4-fus" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffffff" /><stop offset="0.5" stopColor="#eef1f4" /><stop offset="1" stopColor="#b7c0c8" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#p4-tx-sky)" />
      <Cloud x={300 + f * 0.1} y={110} s={0.9} /><Cloud x={1400 + f * 0.12} y={80} s={0.7} />
      {/* terminal */}
      <rect x={0} y={560} width={1920} height={110} fill="#c9c2b2" stroke={L} strokeWidth={3} />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={20 + i * 64} y={590} width={44} height={40} fill="#5f6f7f" />)}
      <rect x={1180} y={470} width={70} height={100} fill="#b8b0a0" stroke={L} strokeWidth={3} /><rect x={1160} y={450} width={110} height={30} fill="#5f6f7f" stroke={L} strokeWidth={3} />
      <rect y={660} width={1920} height={420} fill="#a9a59c" />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} y1={700 + i * 70} x2={1920} y2={690 + i * 74} stroke="#98948a" strokeWidth={3} />)}
      <line x1={0} y1={930} x2={1920} y2={900} stroke="#e9d27a" strokeWidth={8} strokeDasharray="60 40" />
      {/* far wing + engines (behind fuselage) */}
      <path d="M 820 520 L 1280 520 L 1560 640 L 1500 650 Z" fill="#c8ced4" stroke={L} strokeWidth={lw} />
      {[[1120, 600], [1380, 640]].map(([x, y], i) => <g key={i}><rect x={x - 90} y={y} width={180} height={52} rx={26} fill="#d7dce0" stroke={L} strokeWidth={lw} /><ellipse cx={x - 90} cy={y + 26} rx={14} ry={24} fill="#3a3f44" /></g>)}
      {/* fuselage (nose left) */}
      <path d="M 1960 300 L 260 300 Q 120 300 70 380 Q 40 420 70 450 Q 120 520 260 520 L 1960 520 Z" fill="url(#p4-fus)" stroke={L} strokeWidth={lw} />
      <path d="M 70 450 Q 120 520 260 520 L 1960 520 L 1960 470 L 200 470 Q 120 470 70 450 Z" fill="#a6b1ba" />
      <path d="M 120 360 Q 90 395 92 420 L 1960 420 L 1960 388 L 200 388 Q 150 380 120 360 Z" fill="#4fa3d9" />
      <path d="M 70 380 Q 120 300 260 300 L 300 300 Q 200 330 170 400 L 60 420 Z" fill="#2b4a8c" />
      <path d="M 120 352 L 170 340 L 176 360 L 128 372 Z" fill="#1b2533" />
      {Array.from({ length: 34 }, (_, i) => <rect key={i} x={330 + i * 46} y={396} width={20} height={18} rx={6} fill="#24364d" />)}
      <text x={980} y={370} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontWeight={700} fontSize={44} fill="#1d3a7a" letterSpacing={6}>UNITED STATES OF AMERICA</text>
      <circle cx={420} cy={458} r={22} fill="#2b3f74" stroke="#c9a640" strokeWidth={5} />
      {/* rear door + boarding stairs */}
      <rect x={1600} y={330} width={64} height={150} rx={10} fill="#1f2a36" stroke={L} strokeWidth={lw} />
      <path d="M 1580 490 L 1690 490 L 1400 960 L 1290 960 Z" fill="#d9d9d4" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 14 }, (_, i) => { const t = (i + 1) / 15; return <line key={i} x1={1580 - 290 * t} y1={490 + 470 * t} x2={1690 - 290 * t} y2={490 + 470 * t} stroke="#9a9a94" strokeWidth={4} />; })}
      <path d="M 1700 470 L 1410 940" stroke="#8a8a84" strokeWidth={8} /><path d="M 1570 470 L 1280 940" stroke="#8a8a84" strokeWidth={8} />
      <path d="M 1290 960 L 1440 960 L 1440 1000 L 1270 1000 Z" fill="#8a8a84" stroke={L} strokeWidth={3} />
      {/* tail fin + flag */}
      <path d="M 1760 300 L 1880 40 L 1960 40 L 1960 300 Z" fill="#f2f4f6" stroke={L} strokeWidth={lw} />
      <g transform="translate(1850 110) skewX(-20)"><rect width={90} height={56} fill="#b8362f" />{[1, 3, 5].map((k) => <rect key={k} y={k * 8} width={90} height={8} fill="#fff" />)}<rect width={40} height={30} fill="#2b3f74" /></g>
      {/* near wing root */}
      <path d="M 760 470 L 1100 470 L 880 700 L 760 700 Z" fill="#dde2e6" stroke={L} strokeWidth={lw} />
      <ellipse cx={960} cy={1010} rx={900} ry={40} fill="#000" opacity={0.1} />
      <Paint vig={0.3} />
    </g>
  );
};

/** AF1 aft compartment: seats removed, the bronze casket in a pool of window light (cool, sombre). */
export const AF1Aft: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#4a4a50" />
    <path d="M 0 0 L 1920 0 L 1920 220 Q 960 140 0 220 Z" fill="#5a5a60" stroke={L} strokeWidth={lw} />
    <rect y={600} width={1920} height={260} fill="#3c3b40" />
    {[300, 640, 1280, 1620].map((x, i) => (
      <g key={i}>
        <rect x={x - 56} y={330} width={112} height={150} rx={42} fill="#e6eef4" stroke="#2a2a30" strokeWidth={lw} />
        <path d={`M ${x - 50} 470 L ${x + 50} 470 L ${x + 260} 1080 L ${x - 160} 1080 Z`} fill="#dfe8f0" opacity={0.08} />
      </g>
    ))}
    <rect y={860} width={1920} height={220} fill="#2e3440" />
    {/* bronze casket */}
    <g stroke={L} strokeWidth={lw}>
      <path d="M 520 760 L 1400 760 L 1440 800 L 1440 900 L 480 900 L 480 800 Z" fill="#7a5a34" />
      <path d="M 520 760 L 1400 760 L 1440 800 L 480 800 Z" fill="#9a7444" />
      <path d="M 560 700 Q 960 650 1360 700 L 1400 760 L 520 760 Z" fill="#a8824c" />
      {[620, 820, 1100, 1300].map((x) => <rect key={x} x={x - 40} y={830} width={80} height={16} rx={8} fill="#d8b46a" />)}
      <line x1={480} y1={815} x2={1440} y2={815} stroke="#5a3e20" strokeWidth={6} />
    </g>
    <ellipse cx={960} cy={700} rx={420} ry={40} fill="#fff" opacity={0.08} />
    <rect width={1920} height={1080} fill="#2a3452" opacity={0.3} style={{ mixBlendMode: "multiply" }} />
    <Paint vig={0.6} warm={false} />
  </g>
);

// ================================================================== DEALEY PLAZA, Dallas, 1963
/** Dealey Plaza: the Texas School Book Depository (7-storey red brick, arched top floor), Dal-Tex building, Elm St
 *  curving down to the triple underpass, the white pergola and the grassy knoll. Muted archive grade. */
export const DealeyPlaza: React.FC = () => (
  <g>
    <defs><linearGradient id="p4-dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fb3cf" /><stop offset="1" stopColor="#dfe6e2" /></linearGradient></defs>
    <rect width={1920} height={1080} fill="url(#p4-dsky)" />
    <Cloud x={1300} y={120} s={0.8} o={0.8} />
    {/* Dal-Tex building (behind, left) */}
    <rect x={0} y={250} width={240} height={420} fill="#b89a7a" stroke={L} strokeWidth={lw} />
    {Array.from({ length: 6 }, (_, r) => Array.from({ length: 3 }, (_, c) => <rect key={`${r}${c}`} x={30 + c * 70} y={280 + r * 62} width={40} height={40} fill="#4a4a50" />))}
    {/* Book Depository */}
    <rect x={260} y={170} width={760} height={510} fill="#a4553a" stroke={L} strokeWidth={lw} />
    <rect x={260} y={170} width={760} height={30} fill="#8a4430" />
    {Array.from({ length: 7 }, (_, r) => Array.from({ length: 8 }, (_, c) => {
      const x = 290 + c * 92, y = 215 + r * 64;
      return r === 0
        ? <path key={`${r}${c}`} d={`M ${x} ${y + 44} L ${x} ${y + 14} A 30 18 0 0 1 ${x + 60} ${y + 14} L ${x + 60} ${y + 44} Z`} fill="#3a3a40" stroke="#d9c2a0" strokeWidth={3} />
        : <g key={`${r}${c}`}><rect x={x} y={y} width={28} height={42} fill="#3a3a40" stroke="#d9c2a0" strokeWidth={3} /><rect x={x + 32} y={y} width={28} height={42} fill="#3a3a40" stroke="#d9c2a0" strokeWidth={3} /></g>;
    }))}
    {[0, 1, 2, 3, 4, 5, 6].map((r) => <line key={r} x1={260} y1={260 + r * 64} x2={1020} y2={260 + r * 64} stroke="#8a4430" strokeWidth={3} />)}
    <rect x={560} y={600} width={160} height={80} fill="#2e2e33" stroke={L} strokeWidth={3} />
    {/* far trees + underpass + pergola */}
    {Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={1060 + i * 95} cy={600 - (i % 2) * 20} rx={80} ry={70} fill={i % 2 ? "#6f8558" : "#5f7a4c"} />)}
    <rect x={1500} y={560} width={420} height={60} fill="#cfc8b8" stroke={L} strokeWidth={lw} />
    {[1560, 1700, 1840].map((x) => <rect key={x} x={x} y={620} width={40} height={90} fill="#bdb6a6" stroke={L} strokeWidth={3} />)}
    <path d="M 1080 700 Q 1250 600 1430 690 L 1430 720 L 1080 730 Z" fill="#ebe6da" stroke={L} strokeWidth={lw} />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={1095 + i * 38} y={660 - Math.sin((i / 8) * Math.PI) * 50} width={12} height={70} fill="#f4f0e6" stroke={L} strokeWidth={2} />)}
    <line x1={1440} y1={690} x2={1900} y2={700} stroke="#e9e1cf" strokeWidth={8} />
    {/* lawns + Elm Street curve */}
    <path d="M 0 680 L 1920 690 L 1920 1080 L 0 1080 Z" fill="#7d9a5c" />
    <path d="M 0 760 Q 700 720 1500 700 L 1920 700 L 1920 760 Q 1300 790 900 900 Q 600 990 520 1080 L 220 1080 Q 380 900 0 860 Z" fill="#8c8c88" stroke={L} strokeWidth={3} />
    <path d="M 0 810 Q 700 760 1560 730 Q 1100 800 760 950" stroke="#e6e2d6" strokeWidth={5} fill="none" strokeDasharray="40 30" />
    <path d="M 1100 760 Q 1500 720 1920 760" stroke="#6c8a4c" strokeWidth={30} fill="none" />
    <Tree x={140} y={760} s={0.9} c={["#6f8a4c", "#7f9a5a", "#5f7a40"]} /><Tree x={1780} y={820} s={1.1} c={["#6f8a4c", "#7f9a5a", "#5f7a40"]} />
    <rect width={1920} height={1080} fill="#8a7a62" opacity={0.25} style={{ mixBlendMode: "saturation" }} />
    <rect width={1920} height={1080} fill="#d8c8a0" opacity={0.12} style={{ mixBlendMode: "multiply" }} />
    <Paint vig={0.5} />
  </g>
);

// ================================================================== U.S. SENATE CHAMBER (post-1950 renovation)
/** Senate chamber: cream walls with dark marble pilasters, gallery rail above, tiered marble rostrum with flags,
 *  mahogany desks in arcs on blue carpet. */
export const SenateChamber: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#e3d7bd" />
    <rect y={0} width={1920} height={110} fill="#d2c3a0" />
    {/* gallery */}
    <rect y={110} width={1920} height={200} fill="#6b5a48" />
    {Array.from({ length: 4 }, (_, r) => <rect key={r} y={130 + r * 44} width={1920} height={20} fill="#5a4a3a" />)}
    {Array.from({ length: 50 }, (_, i) => <ellipse key={i} cx={20 + i * 39 + (i % 2) * 8} cy={150 + (i % 4) * 44} rx={13} ry={15} fill={HAIR[i % 6]} opacity={0.75} />)}
    <rect y={300} width={1920} height={26} fill="#cdbd98" stroke={L} strokeWidth={3} />
    {Array.from({ length: 48 }, (_, i) => <rect key={i} x={i * 40 + 12} y={270} width={12} height={30} fill="#cdbd98" />)}
    {/* wall with pilasters */}
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={60 + i * 260} y={326} width={56} height={400} fill="#5f5148" stroke={L} strokeWidth={3} />)}
    {/* rostrum */}
    <path d="M 640 520 L 1280 520 L 1280 760 L 640 760 Z" fill="#7a5a40" stroke={L} strokeWidth={lw} />
    <path d="M 560 640 L 1360 640 L 1360 800 L 560 800 Z" fill="#c9b99a" stroke={L} strokeWidth={lw} />
    <rect x={860} y={420} width={200} height={110} rx={12} fill="#6b2b2b" stroke={L} strokeWidth={lw} />
    <FlagPole x={760} y={640} h={330} kind="us" s={0.8} /><FlagPole x={1100} y={640} h={330} kind="us" s={0.8} />
    <text x={960} y={370} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontSize={34} fill="#5a4a2a" letterSpacing={8}>E PLURIBUS UNUM</text>
    {/* floor + desks */}
    <rect y={760} width={1920} height={320} fill="#2f4878" />
    {Array.from({ length: 40 }, (_, i) => <path key={i} transform={`translate(${rnd(i) * 1920} ${800 + rnd(i + 5) * 260}) scale(0.5)`} d="M 0 -22 L 6 -6 L 23 -6 L 9 4 L 14 21 L 0 11 L -14 21 L -9 4 L -23 -6 L -6 -6 Z" fill="#c9a640" opacity={0.5} />)}
    {[0, 1].map((r) => Array.from({ length: 12 }, (_, i) => {
      const x = 80 + i * 160 + r * 80, y = 800 + r * 50;
      return <g key={`${r}-${i}`}><rect x={x} y={y} width={110} height={44} fill="#5a3219" stroke={L} strokeWidth={3} /><rect x={x - 4} y={y - 8} width={118} height={12} fill="#7a4626" stroke={L} strokeWidth={2} /></g>;
    }))}
    <Paint vig={0.4} />
  </g>
);

/** Foreground: front-row senate desks + one seated senator from behind (the target of "the Johnson treatment"). */
export const SenateDesksFG: React.FC<{ squirm?: number }> = ({ squirm = 99999 }) => {
  const f = useCurrentFrame();
  const shrink = f >= squirm ? interpolate(f - squirm, [0, 5], [1, 0.9], clamp) : 1;
  return (
    <g>
      <g transform={`translate(1440 ${800 + (1 - shrink) * 300}) scale(${1.25 * shrink})`}>
        <path d="M -150 420 L -150 110 Q -140 26 -40 14 L 40 14 Q 140 26 150 110 L 150 420 Z" fill="#33302c" stroke="#0e0b08" strokeWidth={5} />
        <ellipse cx={0} cy={-56} rx={66} ry={78} fill="#d9d2c4" stroke="#0e0b08" strokeWidth={5} />
        <path d="M -64 -40 Q -60 -120 0 -132 Q 60 -120 64 -40 Q 30 -60 0 -56 Q -30 -60 -64 -40 Z" fill="#9a948a" />
        <ellipse cx={-64} cy={-48} rx={11} ry={20} fill="#c99b7a" /><ellipse cx={64} cy={-48} rx={11} ry={20} fill="#c99b7a" />
        {f >= squirm && <path d="M 90 -150 q 14 -20 28 0 q 14 20 28 0" stroke="#8fd0f2" strokeWidth={8} fill="none" />}
      </g>
      <g stroke={L} strokeWidth={lw}>
        <rect x={-20} y={950} width={760} height={140} fill="#5a3219" /><rect x={-30} y={930} width={780} height={30} fill="#7a4626" />
        <rect x={1180} y={990} width={760} height={100} fill="#5a3219" /><rect x={1170} y={970} width={780} height={30} fill="#7a4626" />
      </g>
    </g>
  );
};

// ================================================================== THE EAST ROOM
/** The East Room: white walls, gilt Corinthian pilasters, tall windows with gold silk drapes, three cut-glass
 *  chandeliers, oak parquet, Gilbert Stuart's full-length Washington. `dusk` warms the grade. */
export const EastRoom: React.FC<{ evening?: boolean }> = ({ evening }) => (
  <g>
    <rect width={1920} height={1080} fill="#efe8d6" />
    <rect width={1920} height={120} fill="#e2d9c2" /><rect y={116} width={1920} height={20} fill="#cbb98a" stroke={L} strokeWidth={2} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <g key={i}><rect x={70 + i * 360} y={136} width={46} height={680} fill="#f6f1e4" stroke="#c8b88f" strokeWidth={3} /><rect x={58 + i * 360} y={136} width={70} height={36} fill="#d8b85a" stroke={L} strokeWidth={2} /></g>
    ))}
    {[[480, 0], [1200, 1]].map(([x, k]) => (
      <g key={x}>
        <rect x={x} y={230} width={240} height={480} fill={evening ? "#3b4a73" : "#dbe6e8"} stroke="#c8b88f" strokeWidth={10} />
        <line x1={x + 120} y1={230} x2={x + 120} y2={710} stroke="#efe8d6" strokeWidth={8} /><line x1={x} y1={470} x2={x + 240} y2={470} stroke="#efe8d6" strokeWidth={8} />
        <path d={`M ${x - 70} 190 Q ${x - 20} 450 ${x - 60} 760 L ${x + 30} 760 Q ${x + 10} 450 ${x + 50} 200 Z`} fill="#d6a83a" stroke={L} strokeWidth={3} />
        <path d={`M ${x + 310} 190 Q ${x + 260} 450 ${x + 300} 760 L ${x + 210} 760 Q ${x + 230} 450 ${x + 190} 200 Z`} fill="#d6a83a" stroke={L} strokeWidth={3} />
        <path d={`M ${x - 80} 180 Q ${x + 120} ${260 + k * 0} ${x + 320} 180 L ${x + 320} 210 Q ${x + 120} 290 ${x - 80} 210 Z`} fill="#c49530" stroke={L} strokeWidth={3} />
      </g>
    ))}
    {/* Stuart's Washington */}
    <g>
      <rect x={880} y={200} width={160} height={300} fill="#b48a3a" stroke={L} strokeWidth={lw} />
      <rect x={896} y={216} width={128} height={268} fill="#4a3b2b" />
      <path d="M 940 480 L 940 330 Q 960 300 980 330 L 980 480 Z" fill="#1d1a18" /><ellipse cx={960} cy={300} rx={18} ry={22} fill="#d9c0a0" /><path d="M 942 290 Q 960 272 978 290 L 978 284 Q 960 266 942 284 Z" fill="#e8e4dc" />
      <rect x={990} y={360} width={20} height={120} fill="#7a2a2a" />
    </g>
    <rect y={790} width={1920} height={30} fill="#d8ceb4" stroke={L} strokeWidth={2} />
    <rect y={820} width={1920} height={260} fill="#a77a48" />
    {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M ${i * 70 - 40} 1080 L ${i * 70 + 60} 820`} stroke="#8e6538" strokeWidth={3} />)}
    {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M ${i * 70 + 40} 1080 L ${i * 70 - 60} 820`} stroke="#8e6538" strokeWidth={3} opacity={0.6} />)}
    <Chandelier x={300} y={170} s={0.9} /><Chandelier x={960} y={150} s={0.75} /><Chandelier x={1620} y={170} s={0.9} />
    {evening && <rect width={1920} height={1080} fill="#ffb347" opacity={0.12} style={{ mixBlendMode: "multiply" }} />}
    <Paint vig={0.35} />
  </g>
);

// ================================================================== 1964 campaign stage
/** 1964 campaign rally stage: banner "ALL THE WAY WITH LBJ", bunting, flags, sky. */
export const Rally1964: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><linearGradient id="p4-rsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4f8cc9" /><stop offset="1" stopColor="#cfe2ee" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#p4-rsky)" />
      <Cloud x={200 + f * 0.2} y={90} /><Cloud x={1500 + f * 0.15} y={130} s={0.8} />
      {Array.from({ length: 24 }, (_, i) => <ellipse key={i} cx={i * 86} cy={560} rx={80} ry={60} fill={i % 2 ? "#5d7f4d" : "#4f7143"} />)}
      <rect x={160} y={180} width={1600} height={170} fill="#f4f0e6" stroke={L} strokeWidth={lw} />
      <rect x={160} y={180} width={1600} height={30} fill="#b8362f" /><rect x={160} y={320} width={1600} height={30} fill="#2b3f74" />
      <text x={960} y={296} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={96} fill="#1d3a7a" letterSpacing={4}>ALL THE WAY WITH LBJ</text>
      <line x1={160} y1={180} x2={160} y2={760} stroke="#6b4a2a" strokeWidth={14} /><line x1={1760} y1={180} x2={1760} y2={760} stroke="#6b4a2a" strokeWidth={14} />
      <rect y={600} width={1920} height={200} fill="#8a6a46" />
      <rect y={760} width={1920} height={320} fill="#6b8a4c" />
      <Bunting x0={0} x1={1920} y={760} n={8} d={80} />
      <FlagPole x={240} y={760} h={480} kind="us" /><FlagPole x={1600} y={760} h={480} kind="us" />
      <Paint vig={0.3} />
    </g>
  );
};

// ================================================================== CABINET ROOM, night 1967-68
/** The Cabinet Room at night: arched French doors on the dark Rose Garden, green drapes, long mahogany table,
 *  one lamp. Lit warm in the centre, corners near black. */
export const CabinetRoom: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#e6dcc4" />
    <rect width={1920} height={90} fill="#d6c8a8" /><rect y={86} width={1920} height={14} fill="#bfae86" />
    {[150, 650, 1150, 1650].map((x) => (
      <g key={x}>
        <path d={`M ${x - 110} 760 L ${x - 110} 260 A 110 110 0 0 1 ${x + 110} 260 L ${x + 110} 760 Z`} fill="#121a33" stroke="#f2ecdc" strokeWidth={12} />
        <line x1={x} y1={150} x2={x} y2={760} stroke="#f2ecdc" strokeWidth={6} />
        {[300, 440, 580].map((y) => <line key={y} x1={x - 110} y1={y} x2={x + 110} y2={y} stroke="#f2ecdc" strokeWidth={5} />)}
        <path d={`M ${x - 170} 120 Q ${x - 120} 450 ${x - 160} 780 L ${x - 100} 780 Q ${x - 110} 450 ${x - 90} 130 Z`} fill="#3d5a3a" stroke={L} strokeWidth={3} />
        <path d={`M ${x + 170} 120 Q ${x + 120} 450 ${x + 160} 780 L ${x + 100} 780 Q ${x + 110} 450 ${x + 90} 130 Z`} fill="#3d5a3a" stroke={L} strokeWidth={3} />
      </g>
    ))}
    <rect y={780} width={1920} height={300} fill="#5a4a3a" />
    <ellipse cx={960} cy={1040} rx={1100} ry={150} fill="#5a2f17" stroke={L} strokeWidth={lw} />
    <ellipse cx={960} cy={1010} rx={500} ry={60} fill="#ffd27a" opacity={0.15} />
    <radialGradient id="p4-cab" cx="50%" cy="60%" r="70%"><stop offset="0.25" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#07060a" stopOpacity={0.85} /></radialGradient>
    <rect width={1920} height={1080} fill="url(#p4-cab)" />
    <rect width={1920} height={1080} fill="#1b2340" opacity={0.25} style={{ mixBlendMode: "multiply" }} />
    <Paint vig={0.5} />
  </g>
);

/** Foreground: tall leather chair backs along the Cabinet table. */
export const CabinetChairsFG: React.FC = () => (
  <g stroke="#0e0b08" strokeWidth={5}>
    {[140, 520, 1400, 1780].map((x, i) => (
      <g key={x}><path d={`M ${x - 130} 1090 L ${x - 120} ${760 + (i % 2) * 30} Q ${x} ${700 + (i % 2) * 30} ${x + 120} ${760 + (i % 2) * 30} L ${x + 130} 1090 Z`} fill="#2a1c14" />
        <path d={`M ${x - 100} ${790 + (i % 2) * 30} Q ${x} ${740 + (i % 2) * 30} ${x + 100} ${790 + (i % 2) * 30}`} fill="none" stroke="#5a3a24" strokeWidth={6} /></g>
    ))}
  </g>
);

// ================================================================== THE OVAL OFFICE, by era
type Era = "ike" | "lbj" | "nixon" | "bush";
const OV: Record<Era, { wall: string; drape: string; rug: string; rim: string; win: string }> = {
  ike: { wall: "#bcc4ab", drape: "#5f6e45", rug: "#5c7348", rim: "#c9b77a", win: "#d9e6e8" },
  lbj: { wall: "#ece4cf", drape: "#c9a24a", rug: "#b79f6a", rim: "#8a6a2a", win: "#1b2550" },
  nixon: { wall: "#efe9d8", drape: "#e0b22a", rug: "#233f80", rim: "#d8b04a", win: "#dfe9ee" },
  bush: { wall: "#f1ebdc", drape: "#b9a37a", rug: "#a9b9c6", rim: "#5d7186", win: "#dfe9ee" },
};
/** The Oval Office in a given administration's decor: curved wall, three windows behind the desk with drapes,
 *  US + presidential flags, the oval rug with the seal. LBJ's era adds his three-screen TV console. */
export const OvalOffice: React.FC<{ era: Era }> = ({ era }) => {
  const c = OV[era];
  return (
    <g>
      <rect width={1920} height={1080} fill={c.wall} />
      <path d="M 0 0 L 1920 0 L 1920 110 Q 960 60 0 110 Z" fill="#fbf8ef" stroke={L} strokeWidth={3} />
      <path d="M 0 110 Q 960 60 1920 110 L 1920 128 Q 960 78 0 128 Z" fill="#d8ccb0" />
      {/* niches */}
      {[150, 1770].map((x) => <g key={x}><path d={`M ${x - 80} 640 L ${x - 80} 300 A 80 80 0 0 1 ${x + 80} 300 L ${x + 80} 640 Z`} fill="#000" opacity={0.08} stroke="#cfc4a8" strokeWidth={4} /><rect x={x - 80} y={460} width={160} height={10} fill="#cfc4a8" /></g>)}
      {[620, 960, 1300].map((x) => (
        <g key={x}>
          <rect x={x - 110} y={200} width={220} height={480} fill={c.win} stroke="#f7f3e8" strokeWidth={12} />
          {era !== "lbj" && <ellipse cx={x} cy={600} rx={120} ry={60} fill="#9db08a" opacity={0.6} />}
          {[310, 420, 530].map((y) => <line key={y} x1={x - 110} y1={y} x2={x + 110} y2={y} stroke="#f7f3e8" strokeWidth={5} />)}
          <line x1={x} y1={200} x2={x} y2={680} stroke="#f7f3e8" strokeWidth={5} />
          <path d={`M ${x - 160} 170 Q ${x - 110} 430 ${x - 150} 700 L ${x - 95} 700 Q ${x - 100} 430 ${x - 80} 180 Z`} fill={c.drape} stroke={L} strokeWidth={3} />
          <path d={`M ${x + 160} 170 Q ${x + 110} 430 ${x + 150} 700 L ${x + 95} 700 Q ${x + 100} 430 ${x + 80} 180 Z`} fill={c.drape} stroke={L} strokeWidth={3} />
          <path d={`M ${x - 170} 160 Q ${x} 220 ${x + 170} 160 L ${x + 170} 186 Q ${x} 250 ${x - 170} 186 Z`} fill={c.drape} stroke={L} strokeWidth={3} />
        </g>
      ))}
      {era === "lbj" && <g stroke={L} strokeWidth={lw}><rect x={1560} y={560} width={300} height={170} fill="#6b4a2a" />{[0, 1, 2].map((i) => <rect key={i} x={1574 + i * 96} y={578} width={84} height={64} rx={10} fill="#8a9aa6" />)}</g>}
      <rect y={700} width={1920} height={380} fill="#d7cbb0" />
      <ellipse cx={960} cy={960} rx={1100} ry={230} fill={c.rug} stroke={L} strokeWidth={lw} />
      <ellipse cx={960} cy={960} rx={1020} ry={200} fill="none" stroke={c.rim} strokeWidth={14} />
      <ellipse cx={960} cy={990} rx={200} ry={60} fill={c.rim} opacity={0.75} />
      <ellipse cx={960} cy={990} rx={120} ry={34} fill={c.rug} opacity={0.7} />
      <FlagPole x={420} y={760} h={520} kind="us" /><FlagPole x={1440} y={760} h={520} kind="pres" />
      {era === "lbj" && <rect width={1920} height={1080} fill="#1b2340" opacity={0.18} style={{ mixBlendMode: "multiply" }} />}
      <Paint vig={0.35} />
    </g>
  );
};

/** Desk drawn BEHIND a seated sheet pose (the pose's paper sits on the desk top). `top` = desk-line y on screen. */
export const DeskBehind: React.FC<{ x: number; top: number; w?: number; color?: string }> = ({ x, top, w = 760, color = "#6b3a1c" }) => (
  <g stroke={L} strokeWidth={lw}>
    <path d={`M ${x - w / 2} ${top} L ${x + w / 2} ${top} L ${x + w / 2 + 30} ${top + 70} L ${x - w / 2 - 30} ${top + 70} Z`} fill={color} />
    <rect x={x - w / 2 - 30} y={top + 70} width={w + 60} height={1080} fill="#4a2810" />
    {[-1, 1].map((s) => <rect key={s} x={x + s * (w / 2 - 110) - 90} y={top + 110} width={180} height={200} fill="#3e200c" stroke="#2a1606" />)}
    <circle cx={x} cy={top + 180} r={40} fill="#c9a640" opacity={0.65} />
  </g>
);

/** Foreground TV camera (1960s studio pedestal), cropped by the frame edge. */
export const TVCamera: React.FC<{ x: number; flip?: boolean; s?: number; tally?: boolean }> = ({ x, flip, s = 1, tally }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} 0) scale(${flip ? -s : s} ${s})`} stroke="#000" strokeWidth={5}>
      <rect x={-30} y={760} width={60} height={400} fill="#2a2a2c" />
      <path d="M -170 1090 L -110 1000 L 110 1000 L 170 1090 Z" fill="#1c1c1e" />
      <rect x={-150} y={560} width={300} height={200} rx={16} fill="#3a3a3e" />
      <rect x={150} y={600} width={90} height={120} fill="#2a2a2c" />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={260} cy={610 + i * 34} r={14} fill="#111" />)}
      <rect x={-210} y={600} width={60} height={20} fill="#555" />
      {tally && Math.floor(f / 15) % 2 === 0 && <circle cx={-110} cy={590} r={14} fill="#e02b2b" />}
    </g>
  );
};

// ================================================================== 1960 FIRST DEBATE, WBBM-TV studio, Chicago
/** WBBM-TV Studio 1, Chicago (26 Sep 1960): plain grey flat backdrop, two chairs, lectern, moderator's table.
 *  `tv` adds the black-and-white broadcast look (applied by the shot over everything). */
export const DebateStudio1960: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#9c9a92" />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={i * 220} y={120} width={210} height={640} fill="#a6a49c" stroke="#8a887f" strokeWidth={3} />)}
    <rect y={0} width={1920} height={120} fill="#3a3a3c" />
    {Array.from({ length: 8 }, (_, i) => <g key={i}><rect x={120 + i * 240} y={20} width={60} height={70} fill="#222" /><path d={`M ${120 + i * 240} 90 L ${60 + i * 240} 700 L ${240 + i * 240} 700 L ${180 + i * 240} 90 Z`} fill="#fff" opacity={0.05} /></g>)}
    <rect y={760} width={1920} height={320} fill="#6f6d66" />
    {[520, 1400].map((x) => <g key={x} stroke={L} strokeWidth={lw}><rect x={x - 70} y={680} width={140} height={170} rx={12} fill="#5a5552" /><rect x={x - 90} y={780} width={180} height={80} rx={10} fill="#4a4542" /></g>)}
    <path d="M 900 600 L 1020 600 L 1040 860 L 880 860 Z" fill="#7a5a3a" stroke={L} strokeWidth={lw} />
    <Paint vig={0.4} />
  </g>
);

/** Moderator's table (Howard K. Smith) seen from behind, foreground. */
export const ModeratorFG: React.FC = () => (
  <g>
    <Crowd y={820} x0={760} x1={1160} n={1} seed={4} s={1.15} />
    <g stroke={L} strokeWidth={lw}><rect x={420} y={960} width={1080} height={140} fill="#4a3a2c" /><rect x={400} y={940} width={1120} height={30} fill="#6b5440" /></g>
  </g>
);

/** Black-and-white 1960 TV look over the whole frame (scanlines + rolling bar). */
export const TVLook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g pointerEvents="none">
      <rect width={1920} height={1080} fill="#808080" style={{ mixBlendMode: "saturation" }} />
      {Array.from({ length: 90 }, (_, i) => <rect key={i} y={i * 12} width={1920} height={3} fill="#000" opacity={0.08} />)}
      <rect y={((f * 9) % 1300) - 200} width={1920} height={110} fill="#fff" opacity={0.05} />
    </g>
  );
};

// ================================================================== BEVERLY HILTON, 7 Nov 1962
/** Beverly Hilton press room: gold curtain backdrop, sconces, carpet. */
export const HiltonPress: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#7a5a2a" />
    {Array.from({ length: 40 }, (_, i) => <path key={i} d={`M ${i * 50} 0 Q ${i * 50 + 20} 380 ${i * 50} 780`} stroke={i % 2 ? "#9a7432" : "#6a4a1e"} strokeWidth={26} fill="none" />)}
    <rect width={1920} height={70} fill="#4a3216" />
    {[300, 1620].map((x) => <g key={x}><rect x={x - 10} y={300} width={20} height={60} fill="#d8b04a" /><path d={`M ${x - 40} 300 L ${x + 40} 300 L ${x + 26} 250 L ${x - 26} 250 Z`} fill="#fff2c8" /><circle cx={x} cy={280} r={110} fill="#fff1c2" opacity={0.18} /></g>)}
    <rect y={780} width={1920} height={300} fill="#6a2a2a" />
    {Array.from({ length: 10 }, (_, i) => <line key={i} x1={0} y1={800 + i * 30} x2={1920} y2={800 + i * 30} stroke="#5a2222" strokeWidth={3} />)}
    <Paint vig={0.45} />
  </g>
);

/** Lectern with a mic cluster (foreground of the speaker). */
export const Lectern: React.FC<{ x: number; y?: number; w?: number; seal?: boolean; sign?: string; color?: string }> = ({ x, y = 720, w = 300, seal, sign, color = "#6b4a2a" }) => (
  <g stroke={L} strokeWidth={lw}>
    {[-40, -10, 20, 50].map((dx, i) => <g key={i}><line x1={x + dx * 0.6} y1={y} x2={x + dx} y2={y - 90 - (i % 2) * 20} stroke="#333" strokeWidth={6} /><rect x={x + dx - 14} y={y - 128 - (i % 2) * 20} width={28} height={44} rx={12} fill="#2c2c2c" /></g>)}
    <path d={`M ${x - w / 2 - 20} ${y} L ${x + w / 2 + 20} ${y} L ${x + w / 2} ${y + 40} L ${x - w / 2} ${y + 40} Z`} fill={color} />
    <path d={`M ${x - w / 2} ${y + 40} L ${x + w / 2} ${y + 40} L ${x + w / 2 - 20} 1090 L ${x - w / 2 + 20} 1090 Z`} fill={color} />
    <path d={`M ${x - w / 2} ${y + 40} L ${x + w / 2} ${y + 40} L ${x + w / 2 - 20} 1090 L ${x - w / 2 + 20} 1090 Z`} fill="#000" opacity={0.15} />
    {seal && <g><circle cx={x} cy={y + 170} r={70} fill="#2b3f74" stroke="#c9a640" strokeWidth={10} /><circle cx={x} cy={y + 170} r={40} fill="#efe7cf" /><path d={`M ${x - 22} ${y + 170} l 22 -28 l 22 28 l -22 22 z`} fill="#c9a640" /></g>}
    {sign && <g><rect x={x - w / 2 + 20} y={y + 90} width={w - 40} height={90} fill="#f4f0e6" /><text x={x} y={y + 152} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={48} fill="#1d3a7a" stroke="none">{sign}</text></g>}
  </g>
);

// ================================================================== CALIFORNIA HIGHWAY (the career in reverse)
/** A California two-lane highway through golden hills, with a sign pointing to Washington. */
export const Highway: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><linearGradient id="p4-casky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6aa6d8" /><stop offset="1" stopColor="#f0e6c8" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#p4-casky)" />
      <circle cx={1650} cy={150} r={70} fill="#fff4c0" />
      <Cloud x={400 + f * 0.2} y={140} s={0.8} />
      <path d="M 0 560 Q 300 420 700 520 Q 1100 380 1500 500 Q 1750 440 1920 520 L 1920 1080 L 0 1080 Z" fill="#c9a45a" />
      <path d="M 0 640 Q 500 560 1000 640 Q 1400 580 1920 650 L 1920 1080 L 0 1080 Z" fill="#d8b46a" />
      {[[200, 600], [1300, 590], [1700, 640]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={70} ry={40} fill="#6b7a3a" />)}
      {[[520, 700], [1460, 700]].map(([x, y], i) => (
        <g key={i} stroke={L} strokeWidth={3}><path d={`M ${x} ${y} Q ${x + 10} ${y - 180} ${x - 6} ${y - 330}`} stroke="#7a5a3a" strokeWidth={16} fill="none" />
          {[0, 60, 120, 180, 240, 300].map((a) => <path key={a} transform={`translate(${x - 6} ${y - 330}) rotate(${a + Math.sin(f / 20) * 3})`} d="M 0 0 Q 50 -30 110 10 Q 50 -5 0 0 Z" fill="#4f7d3a" />)}</g>
      ))}
      <rect y={820} width={1920} height={200} fill="#5a5a5c" />
      <line x1={0} y1={920} x2={1920} y2={920} stroke="#e9d27a" strokeWidth={10} strokeDasharray="80 60" />
      <rect y={1010} width={1920} height={70} fill="#c49a52" />
      {/* the sign */}
      <g stroke={L} strokeWidth={lw}>
        <rect x={1590} y={560} width={16} height={270} fill="#8a8a8a" /><rect x={1830} y={560} width={16} height={270} fill="#8a8a8a" />
        <rect x={1540} y={440} width={360} height={160} rx={14} fill="#1f6b3a" />
        <rect x={1552} y={452} width={336} height={136} rx={10} fill="none" stroke="#fff" strokeWidth={5} />
        <text x={1720} y={510} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={40} fill="#fff" stroke="none">WASHINGTON</text>
        <path d="M 1660 548 L 1770 548 L 1770 532 L 1810 556 L 1770 580 L 1770 564 L 1660 564 Z" fill="#fff" stroke="none" />
      </g>
      <Paint vig={0.3} />
    </g>
  );
};

/** VCR-style "rewind" overlay (top-left) with tracking jitter lines. */
export const Rewind: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const on = Math.floor((f - at) / 12) % 2 === 0;
  return (
    <g pointerEvents="none">
      {on && <g fill="#fff" stroke={INK} strokeWidth={6}><path d="M 170 90 L 110 130 L 170 170 Z" /><path d="M 230 90 L 170 130 L 230 170 Z" /></g>}
      <text x={260} y={152} fontFamily={MONTSERRAT} fontWeight={800} fontSize={60} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke">REWIND</text>
      {[0, 1].map((i) => <rect key={i} y={((f * 23 + i * 470) % 1100) - 20} width={1920} height={8 + i * 6} fill="#fff" opacity={0.18} />)}
    </g>
  );
};

// ================================================================== WALDORF-ASTORIA GRAND BALLROOM, election night 1968
/** Waldorf-Astoria Grand Ballroom: two tiers of boxes with red drapery, great chandelier, stage banner. */
export const Waldorf1968: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#e9dcbc" />
    <rect width={1920} height={110} fill="#c9b07a" />
    {[0, 1].map((t) => Array.from({ length: 9 }, (_, i) => {
      const x = i * 220 - 10, y = 150 + t * 200;
      return (
        <g key={`${t}-${i}`} stroke={L} strokeWidth={3}>
          <path d={`M ${x} ${y + 170} L ${x} ${y + 40} Q ${x + 100} ${y - 20} ${x + 200} ${y + 40} L ${x + 200} ${y + 170} Z`} fill="#7a2a2a" />
          <path d={`M ${x + 20} ${y + 60} Q ${x + 100} ${y + 120} ${x + 180} ${y + 60}`} fill="none" stroke="#c9a640" strokeWidth={6} />
          <rect x={x} y={y + 160} width={200} height={34} fill="#d8c48a" />
        </g>
      );
    }))}
    <rect y={560} width={1920} height={220} fill="#d9c9a0" />
    <rect x={260} y={420} width={1400} height={140} fill="#f4f0e6" stroke={L} strokeWidth={lw} />
    <text x={960} y={520} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={92} fill="#1d3a7a">NIXON'S THE ONE!</text>
    <rect y={780} width={1920} height={300} fill="#5a2a2a" />
    <Chandelier x={960} y={130} s={1.2} glow={0.7} />
    <Paint vig={0.35} />
  </g>
);

// ================================================================== THE WATERGATE COMPLEX
/** The Watergate office building: curving tiers of precast balconies with sawtooth railings, the Potomac.
 *  `night` = 17 June 1972, 2 a.m. (cool, one flashlight); otherwise daytime. */
export const Watergate: React.FC<{ night?: boolean }> = ({ night }) => {
  const f = useCurrentFrame();
  const tooth = (y: number, k: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 64; i++) { const x = -40 + i * 32; const yy = y + Math.sin((x / 1920) * Math.PI) * -60 * k; pts.push(`${i ? "L" : "M"} ${x} ${yy}`); pts.push(`L ${x + 16} ${yy + 26}`); }
    return pts.join(" ");
  };
  return (
    <g>
      <defs><linearGradient id={night ? "p4-wgn" : "p4-wgd"} x1="0" y1="0" x2="0" y2="1">
        {night ? <><stop offset="0" stopColor="#0b1230" /><stop offset="1" stopColor="#2c3a70" /></> : <><stop offset="0" stopColor="#6fa4d4" /><stop offset="1" stopColor="#e6eef0" /></>}
      </linearGradient></defs>
      <rect width={1920} height={1080} fill={`url(#${night ? "p4-wgn" : "p4-wgd"})`} />
      {night && Array.from({ length: 50 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 9) * 180} r={2} fill="#fff" opacity={0.6} />)}
      {Array.from({ length: 8 }, (_, r) => {
        const y = 200 + r * 72;
        const k = 1 - r * 0.06;
        return (
          <g key={r}>
            <path d={`M -40 ${y + 20} Q 960 ${y + 20 - 120 * k} 1960 ${y + 20} L 1960 ${y + 72} Q 960 ${y + 72 - 120 * k} -40 ${y + 72} Z`} fill={night ? "#18203a" : "#5a6878"} />
            {Array.from({ length: 30 }, (_, i) => { const x = i * 66; const yy = y + 34 + Math.sin((x / 1920) * Math.PI) * -60 * k; const lit = night ? (r === 5 && i === 13) : false; return <rect key={i} x={x} y={yy} width={44} height={30} fill={lit ? "#ffe9a8" : night ? (rnd(r * 40 + i) > 0.9 ? "#c9b46a" : "#101626") : "#7f97ad"} />; })}
            <path d={`M -40 ${y} Q 960 ${y - 120 * k} 1960 ${y} L 1960 ${y + 26} Q 960 ${y + 26 - 120 * k} -40 ${y + 26} Z`} fill={night ? "#b9bfcc" : "#f2efe6"} stroke={L} strokeWidth={2} />
            <path d={tooth(y + 2, 2 * k)} fill="none" stroke={night ? "#8a90a0" : "#cfcabd"} strokeWidth={3} />
          </g>
        );
      })}
      {night && (() => { const x = 13 * 66 + 22, y = 200 + 5 * 72 + 34 + Math.sin(((13 * 66) / 1920) * Math.PI) * -60 * 0.7 + 15; const a = Math.sin(f / 9) * 20; return <path d={`M ${x} ${y} L ${x + 90} ${y - 40 + a} L ${x + 90} ${y + 40 + a} Z`} fill="#fff6c8" opacity={0.6} />; })()}
      <rect y={790} width={1920} height={60} fill={night ? "#1a2a1e" : "#4f7d3a"} />
      {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={i * 130} cy={800} rx={90} ry={50} fill={night ? "#142018" : "#5d8a45"} />)}
      <rect y={850} width={1920} height={230} fill={night ? "#16224a" : "#4a7fa8"} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={rnd(i) * 1800} y1={880 + i * 16} x2={rnd(i) * 1800 + 120} y2={880 + i * 16} stroke="#fff" strokeWidth={3} opacity={0.25} />)}
      <Paint vig={night ? 0.55 : 0.3} warm={!night} />
    </g>
  );
};

// ================================================================== RESIGNATION LETTER INSERT (9 Aug 1974)
/** The one-sentence resignation letter on White House letterhead, on the desk. */
export const ResignLetter: React.FC<{ signAt?: number }> = ({ signAt = 0 }) => {
  const f = useCurrentFrame();
  const sig = interpolate(f - signAt, [0, 14], [0, 1], clamp);
  const line = (y: number, t: string, s = 40, w = 400) => <text x={560} y={y} fontFamily="DejaVu Serif, serif" fontSize={s} fontWeight={w} fill="#1d1712">{t}</text>;
  return (
    <g>
      <rect width={1920} height={1080} fill="#3b2412" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M 0 ${40 + i * 78} Q 960 ${70 + i * 78} 1920 ${30 + i * 78}`} stroke="#2e1b0c" strokeWidth={6} fill="none" />)}
      <g transform="rotate(-2 960 540)">
        <rect x={470} y={40} width={980} height={1080} fill="#000" opacity={0.35} transform="translate(18 18)" />
        <rect x={470} y={40} width={980} height={1080} fill="#f8f5ec" stroke={L} strokeWidth={4} />
        <text x={960} y={130} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontSize={34} letterSpacing={8} fill="#1d1712">THE WHITE HOUSE</text>
        <text x={960} y={168} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontSize={22} letterSpacing={6} fill="#1d1712">WASHINGTON</text>
        {line(260, "August 9, 1974", 34)}
        {line(340, "Dear Mr. Secretary:", 38)}
        {line(440, "I hereby resign the Office", 50, 700)}
        {line(510, "of President of the United", 50, 700)}
        {line(580, "States.", 50, 700)}
        {line(680, "Sincerely,", 38)}
        <path d="M 600 790 q 40 -70 70 -10 q 20 40 50 -30 q 30 -40 50 20 q 30 -50 60 0 q 40 -40 90 10 q 30 -30 80 -6" fill="none" stroke="#1b2a6a" strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={`${sig} 1`} />
      </g>
      <Paint vig={0.5} />
    </g>
  );
};

// ================================================================== SOUTH LAWN, 9 Aug 1974: the helicopter
/** South Lawn: the South Portico (curved colonnade, Truman balcony), Marine One (VH-3, green with white top)
 *  with its airstair, the red carpet. */
export const SouthLawnHeli: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><linearGradient id="p4-slsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9fb8cf" /><stop offset="1" stopColor="#e6ece8" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#p4-slsky)" />
      <Cloud x={300} y={120} s={1} o={0.7} /><Cloud x={1500} y={90} s={0.8} o={0.7} />
      {/* South Portico */}
      <rect x={120} y={260} width={900} height={330} fill="#f2efe6" stroke={L} strokeWidth={lw} />
      {Array.from({ length: 2 }, (_, r) => Array.from({ length: 7 }, (_, i) => <rect key={`${r}${i}`} x={160 + i * 120} y={300 + r * 150} width={46} height={80} fill="#5a6a7a" stroke="#d8d4c8" strokeWidth={4} />))}
      <path d="M 400 600 L 400 250 Q 570 200 740 250 L 740 600 Z" fill="#e9e5da" stroke={L} strokeWidth={lw} />
      <rect x={380} y={230} width={380} height={30} fill="#e0dbcf" stroke={L} strokeWidth={3} />
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={410 + i * 62} y={260} width={20} height={340} fill="#fbf9f3" stroke="#b9b4a6" strokeWidth={2} />)}
      <rect x={400} y={380} width={340} height={14} fill="#d8d4c8" stroke={L} strokeWidth={2} />
      <rect x={555} y={170} width={30} height={60} fill="#e0dbcf" /><line x1={570} y1={60} x2={570} y2={172} stroke="#6b6b6b" strokeWidth={5} />
      <path d="M 572 64 L 640 74 L 640 110 L 572 100 Z" fill="#b8362f" />
      {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx={i * 170} cy={610} rx={110} ry={60} fill={i % 2 ? "#4f7d3a" : "#3e6a30"} />)}
      <rect y={620} width={1920} height={460} fill="#6b9a4a" />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={0} y1={660 + i * 44} x2={1920} y2={660 + i * 44} stroke="#5f8c42" strokeWidth={14} opacity={0.4} />)}
      {/* red carpet to the stairs */}
      <path d="M 1040 1080 L 1220 1080 L 1300 830 L 1240 830 Z" fill="#a8302b" stroke={L} strokeWidth={3} />
      {/* Marine One */}
      <g stroke={L} strokeWidth={lw}>
        <path d="M 1100 520 Q 1100 420 1250 410 L 1700 410 Q 1800 420 1820 500 L 1880 520 L 1920 520 L 1920 700 L 1180 700 Q 1100 690 1100 620 Z" fill="#2f4a32" />
        <path d="M 1100 520 Q 1100 420 1250 410 L 1700 410 Q 1800 420 1820 500 L 1100 520 Z" fill="#f2f2ee" />
        <path d="M 1110 500 Q 1130 440 1200 430 L 1210 500 Z" fill="#1d2a3a" />
        {[1300, 1400, 1500].map((x) => <rect key={x} x={x} y={530} width={60} height={46} rx={10} fill="#1d2a3a" />)}
        <rect x={1220} y={520} width={70} height={170} fill="#121812" />
        <path d="M 1222 690 L 1290 690 L 1300 830 L 1240 830 Z" fill="#cfcfcf" />
        {Array.from({ length: 5 }, (_, i) => <line key={i} x1={1226 + i * 3} y1={712 + i * 26} x2={1292 + i * 2} y2={712 + i * 26} stroke="#888" strokeWidth={4} />)}
        <rect x={1450} y={380} width={40} height={34} fill="#555" />
        <ellipse cx={1470} cy={372} rx={560} ry={14} fill="#333" opacity={0.85} transform={`rotate(${Math.sin(f / 40) * 0.4} 1470 372)`} />
        <rect x={1200} y={700} width={20} height={60} fill="#333" /><circle cx={1210} cy={770} r={22} fill="#222" /><circle cx={1700} cy={720} r={26} fill="#222" />
        <text x={1560} y={470} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontWeight={700} fontSize={30} fill="#1d3a7a" stroke="none" letterSpacing={3}>UNITED STATES OF AMERICA</text>
      </g>
      <Paint vig={0.3} />
    </g>
  );
};

// ================================================================== HOUSE CHAMBER (1950s+ layout)
/** House of Representatives chamber: three-tier rostrum (Speaker, clerks, lectern), the flag on dark silk between
 *  marble pilasters, "IN GOD WE TRUST" above, bronze fasces, galleries, blue seats on the floor. */
export const HouseFloor: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#d9cfb8" />
    <rect y={0} width={1920} height={260} fill="#6b5a48" />
    {Array.from({ length: 5 }, (_, r) => <rect key={r} y={40 + r * 42} width={1920} height={18} fill="#5a4a3a" />)}
    {Array.from({ length: 60 }, (_, i) => <ellipse key={i} cx={10 + i * 32 + (i % 2) * 8} cy={60 + (i % 5) * 42} rx={11} ry={13} fill={HAIR[i % 6]} opacity={0.7} />)}
    <rect y={250} width={1920} height={24} fill="#cdbd98" stroke={L} strokeWidth={3} />
    <rect x={560} y={274} width={800} height={460} fill="#2c3448" />
    {[520, 1360].map((x) => <rect key={x} x={x} y={274} width={60} height={460} fill="#8a7a62" stroke={L} strokeWidth={3} />)}
    <text x={960} y={318} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontSize={34} fill="#e8dcbc" letterSpacing={10}>IN GOD WE TRUST</text>
    <g transform="translate(720 350)"><rect width={480} height={260} fill="#b8362f" stroke={L} strokeWidth={3} />{Array.from({ length: 6 }, (_, i) => <rect key={i} y={20 + i * 40} width={480} height={20} fill="#f4f0e6" />)}<rect width={200} height={140} fill="#2b3f74" />
      {Array.from({ length: 20 }, (_, i) => <circle key={i} cx={20 + (i % 5) * 40} cy={18 + Math.floor(i / 5) * 34} r={5} fill="#fff" />)}</g>
    {[640, 1280].map((x) => <g key={x}><rect x={x - 10} y={360} width={20} height={300} fill="#a8823c" /><path d={`M ${x - 16} 360 L ${x} 330 L ${x + 16} 360 Z`} fill="#c9a640" /></g>)}
    {/* rostrum tiers */}
    <path d="M 520 600 L 1400 600 L 1400 700 L 520 700 Z" fill="#6b4a30" stroke={L} strokeWidth={lw} />
    <path d="M 440 680 L 1480 680 L 1480 790 L 440 790 Z" fill="#c9bb9a" stroke={L} strokeWidth={lw} />
    <path d="M 360 770 L 1560 770 L 1560 880 L 360 880 Z" fill="#7a5a40" stroke={L} strokeWidth={lw} />
    <rect x={880} y={540} width={160} height={70} rx={10} fill="#6b2b2b" stroke={L} strokeWidth={3} />
    <rect y={860} width={1920} height={220} fill="#2f4878" />
    {Array.from({ length: 18 }, (_, i) => <rect key={i} x={i * 110 - 20} y={950 + (i % 2) * 20} width={80} height={90} rx={10} fill="#3a5a96" stroke={L} strokeWidth={3} />)}
    <Paint vig={0.4} />
  </g>
);

// ================================================================== U.S. COURTHOUSE, Baltimore, 10 Oct 1973
/** Federal courtroom, Baltimore: walnut panelling, raised bench, seal, flags, the bar rail. */
export const Courtroom: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#5a3a22" />
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={20 + i * 192} y={120} width={160} height={560} fill="none" stroke="#4a2e18" strokeWidth={8} />)}
    <rect width={1920} height={100} fill="#3e2614" />
    <circle cx={960} cy={250} r={100} fill="#c9a640" stroke={L} strokeWidth={lw} /><circle cx={960} cy={250} r={70} fill="#2b3f74" /><path d="M 930 250 l 30 -40 l 30 40 l -30 30 z" fill="#c9a640" />
    <FlagPole x={680} y={700} h={460} kind="us" s={0.9} /><FlagPole x={1220} y={700} h={460} kind="state" s={0.9} />
    <rect x={760} y={360} width={400} height={200} rx={30} fill="#2a1a10" stroke={L} strokeWidth={lw} />
    <path d="M 560 520 L 1360 520 L 1360 760 L 560 760 Z" fill="#6b4226" stroke={L} strokeWidth={lw} />
    <rect x={540} y={500} width={840} height={30} fill="#7a4e2e" stroke={L} strokeWidth={3} />
    <rect y={760} width={1920} height={320} fill="#4a2c18" />
    <Paint vig={0.5} />
  </g>
);

/** Foreground: the courtroom bar rail with spindles. */
export const BarRailFG: React.FC = () => (
  <g stroke={L} strokeWidth={lw}>
    <rect x={0} y={900} width={1920} height={36} fill="#7a4e2e" />
    {Array.from({ length: 30 }, (_, i) => <rect key={i} x={20 + i * 66} y={936} width={24} height={160} fill="#6b4226" />)}
    <rect x={0} y={1040} width={1920} height={40} fill="#5a3620" />
  </g>
);

// ================================================================== NEWSPAPER (8-9 Sep 1974)
/** Front page on a table: "FORD PARDONS NIXON"; flames lick up from `burnAt` (on 2s). */
export const PardonPaper: React.FC<{ burnAt?: number }> = ({ burnAt = 99999 }) => {
  const ff = useCurrentFrame();
  const f = Math.floor(ff / 2) * 2;
  const b = interpolate(ff - burnAt, [0, 12], [0, 1], clamp);
  return (
    <g>
      <rect width={1920} height={1080} fill="#2e1c10" />
      <g transform="rotate(-3 960 540)">
        <rect x={360} y={70} width={1200} height={1000} fill="#000" opacity={0.35} transform="translate(18 18)" />
        <rect x={360} y={70} width={1200} height={1000} fill="#ece6d4" stroke={L} strokeWidth={4} />
        <text x={960} y={170} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontWeight={700} fontSize={70} fill="#1d1712">The Morning Herald</text>
        <line x1={400} y1={200} x2={1520} y2={200} stroke="#1d1712" strokeWidth={4} /><line x1={400} y1={212} x2={1520} y2={212} stroke="#1d1712" strokeWidth={2} />
        <text x={420} y={244} fontFamily="DejaVu Serif, serif" fontSize={24} fill="#1d1712">MONDAY, SEPTEMBER 9, 1974</text>
        <text x={960} y={380} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={118} fill="#1d1712">FORD PARDONS</text>
        <text x={960} y={510} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={118} fill="#1d1712">NIXON</text>
        <text x={960} y={580} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontStyle="italic" fontSize={38} fill="#1d1712">"A full, free, and absolute pardon"</text>
        {Array.from({ length: 3 }, (_, c) => Array.from({ length: 9 }, (_, r) => <rect key={`${c}${r}`} x={420 + c * 370} y={640 + r * 40} width={330 - (r === 8 ? 120 : 0)} height={12} fill="#8a8476" />))}
      </g>
      {b > 0 && (
        <g>
          <rect y={1080 - 420 * b} width={1920} height={420 * b} fill="#1a0a04" opacity={0.25} />
          {Array.from({ length: 16 }, (_, i) => {
            const x = i * 128 - 20, hh = (180 + rnd(i + f) * 180) * b;
            return <g key={i}>
              <path d={`M ${x - 70} 1090 Q ${x - 60} ${1090 - hh * 0.5} ${x + (rnd(i * 3 + f) - 0.5) * 40} ${1090 - hh} Q ${x + 60} ${1090 - hh * 0.5} ${x + 70} 1090 Z`} fill="#e8582a" stroke={INK} strokeWidth={5} />
              <path d={`M ${x - 36} 1090 Q ${x - 30} ${1090 - hh * 0.3} ${x} ${1090 - hh * 0.62} Q ${x + 30} ${1090 - hh * 0.3} ${x + 36} 1090 Z`} fill="#ffd25a" />
            </g>;
          })}
        </g>
      )}
      <Paint vig={0.5} />
    </g>
  );
};

// ================================================================== 1976 DEBATE, Walnut Street Theatre, Philadelphia
/** Walnut Street Theatre stage (23 Sep 1976): gilt proscenium, red swagged curtains, blue backdrop, two lecterns. */
export const Debate1976: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#1e2c55" />
    <rect x={180} y={160} width={1560} height={620} fill="#2f4a8a" />
    {Array.from({ length: 13 }, (_, i) => <path key={i} transform={`translate(${260 + i * 118} 220) scale(0.9)`} d="M 0 -22 L 6 -6 L 23 -6 L 9 4 L 14 21 L 0 11 L -14 21 L -9 4 L -23 -6 L -6 -6 Z" fill="#f4f0e6" opacity={0.6} />)}
    <path d="M 0 0 L 1920 0 L 1920 1080 L 1820 1080 L 1820 120 Q 960 60 100 120 L 100 1080 L 0 1080 Z" fill="#c9a640" stroke={L} strokeWidth={lw} />
    <path d="M 100 120 Q 300 300 140 820 L 100 820 Z" fill="#8a1e1e" stroke={L} strokeWidth={3} />
    <path d="M 1820 120 Q 1620 300 1780 820 L 1820 820 Z" fill="#8a1e1e" stroke={L} strokeWidth={3} />
    <path d="M 100 120 Q 960 220 1820 120 L 1820 170 Q 960 280 100 170 Z" fill="#8a1e1e" stroke={L} strokeWidth={3} />
    <rect y={780} width={1920} height={300} fill="#4a3a2a" />
    {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={0} y1={800 + i * 40} x2={1920} y2={800 + i * 40} stroke="#3a2c1e" strokeWidth={3} />)}
    <Paint vig={0.45} />
  </g>
);

// ================================================================== NUMBER ONE OBSERVATORY CIRCLE
/** The Vice President's residence at the Naval Observatory: white Queen Anne house, round corner turret with a
 *  conical roof, wraparound veranda, dormers, big trees, lawn. */
export const NavalObservatory: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><linearGradient id="p4-nosky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fa4d4" /><stop offset="1" stopColor="#e1ecef" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#p4-nosky)" />
      <Cloud x={300 + f * 0.2} y={110} /><Cloud x={1550 + f * 0.1} y={150} s={0.8} />
      <Tree x={170} y={760} s={1.5} /><Tree x={1780} y={760} s={1.6} />
      <g stroke={L} strokeWidth={lw}>
        <path d="M 600 330 L 960 170 L 1320 330 Z" fill="#5a6470" />
        <rect x={620} y={320} width={700} height={430} fill="#f6f4ee" />
        <path d="M 1120 330 L 1200 230 L 1280 330 Z" fill="#5a6470" />
        <rect x={880} y={210} width={60} height={110} fill="#f6f4ee" /><path d="M 870 214 L 910 180 L 950 214 Z" fill="#5a6470" />
        {/* turret */}
        <rect x={500} y={300} width={180} height={450} fill="#efece4" />
        <path d="M 490 310 L 590 130 L 690 310 Z" fill="#5a6470" />
        {[360, 500].map((y) => <rect key={y} x={555} y={y} width={70} height={100} fill="#3c4a5c" stroke="#fff" strokeWidth={6} />)}
        {[[720, 380], [860, 380], [1000, 380], [1160, 380], [720, 540], [1160, 540]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width={80} height={110} fill="#3c4a5c" stroke="#fff" strokeWidth={6} /><rect x={x - 16} y={y} width={14} height={110} fill="#2f3f5a" /><rect x={x + 82} y={y} width={14} height={110} fill="#2f3f5a" /></g>)}
        <rect x={900} y={560} width={110} height={190} fill="#4a3424" />
        {/* veranda */}
        <path d="M 460 620 L 1360 620 L 1380 650 L 440 650 Z" fill="#5a6470" />
        {Array.from({ length: 13 }, (_, i) => <rect key={i} x={470 + i * 70} y={650} width={14} height={110} fill="#fbfaf6" />)}
        <rect x={440} y={740} width={940} height={24} fill="#e2ddd0" />
      </g>
      <rect y={760} width={1920} height={320} fill="#6b9a4a" />
      <path d="M 900 1080 Q 940 900 960 764 L 1000 764 Q 1020 900 1120 1080 Z" fill="#cfc6b0" />
      <FlagPole x={1460} y={800} h={380} kind="us" s={0.8} />
      <Paint vig={0.3} />
    </g>
  );
};

// ================================================================== DC MAP: Observatory Circle -> White House
const DC = { obs: [420, 360] as [number, number], dupont: [1000, 560] as [number, number], wh: [1330, 760] as [number, number] };
/** Hand-painted DC map: the Potomac, Rock Creek, Massachusetts Ave from Observatory Circle to Dupont Circle,
 *  down to the White House. The route draws on from `at`; a small Bush rides along. */
export const DCRoute: React.FC<{ at: number; frames: number; rider?: React.ReactNode }> = ({ at, frames }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - at, [0, frames], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const seg1 = Math.hypot(DC.dupont[0] - DC.obs[0], DC.dupont[1] - DC.obs[1]);
  const seg2 = Math.hypot(DC.wh[0] - DC.dupont[0], DC.wh[1] - DC.dupont[1]);
  const d = p * (seg1 + seg2);
  const pt: [number, number] = d <= seg1 ? [DC.obs[0] + (DC.dupont[0] - DC.obs[0]) * (d / seg1), DC.obs[1] + (DC.dupont[1] - DC.obs[1]) * (d / seg1)]
    : [DC.dupont[0] + (DC.wh[0] - DC.dupont[0]) * ((d - seg1) / seg2), DC.dupont[1] + (DC.wh[1] - DC.dupont[1]) * ((d - seg1) / seg2)];
  const path = d <= seg1 ? `M ${DC.obs.join(" ")} L ${pt.join(" ")}` : `M ${DC.obs.join(" ")} L ${DC.dupont.join(" ")} L ${pt.join(" ")}`;
  return (
    <g>
      <rect width={1920} height={1080} fill="#efe3c4" />
      {Array.from({ length: 26 }, (_, i) => <line key={i} x1={i * 80} y1={0} x2={i * 80} y2={1080} stroke="#e2d3ae" strokeWidth={3} />)}
      {Array.from({ length: 15 }, (_, i) => <line key={i} x1={0} y1={i * 80} x2={1920} y2={i * 80} stroke="#e2d3ae" strokeWidth={3} />)}
      <path d="M 560 0 Q 640 200 700 330 Q 760 450 720 600 L 760 640 Q 820 470 760 320 Q 700 160 640 0 Z" fill="#b9d18f" />
      <path d="M 0 520 Q 300 700 600 860 Q 900 1000 1300 1080 L 1080 1080 Q 800 1000 520 880 Q 240 740 0 600 Z" fill="#6fa6cf" stroke="#fff" strokeWidth={8} />
      <path d="M 640 0 Q 720 220 740 360 Q 760 520 730 820" stroke="#6fa6cf" strokeWidth={14} fill="none" />
      <path d="M 1240 860 L 1780 860 L 1780 920 L 1240 920 Z" fill="#b9d18f" />
      <path d="M 120 220 L 1500 820" stroke="#fff" strokeWidth={22} /><path d="M 120 220 L 1500 820" stroke="#d8c79a" strokeWidth={4} />
      <path d="M 1000 560 L 1330 760" stroke="#fff" strokeWidth={16} />
      <circle cx={DC.obs[0]} cy={DC.obs[1]} r={70} fill="#b9d18f" stroke="#fff" strokeWidth={8} />
      <circle cx={DC.dupont[0]} cy={DC.dupont[1]} r={26} fill="#b9d18f" stroke="#fff" strokeWidth={8} />
      <g transform={`translate(${DC.wh[0]} ${DC.wh[1]})`} stroke={L} strokeWidth={3}><rect x={-60} y={-30} width={120} height={50} fill="#f4f0e6" /><path d="M -24 -30 L 0 -50 L 24 -30 Z" fill="#f4f0e6" /></g>
      <text x={DC.obs[0]} y={DC.obs[1] - 96} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={42} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke">NAVAL OBSERVATORY</text>
      <text x={DC.wh[0] + 40} y={DC.wh[1] + 90} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={42} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke">WHITE HOUSE</text>
      <text x={360} y={760} fontFamily="DejaVu Serif, serif" fontStyle="italic" fontSize={36} fill="#3e6f98" transform="rotate(28 360 760)">Potomac River</text>
      {p > 0 && <path d={path} stroke="#e02b2b" strokeWidth={12} strokeDasharray="26 18" strokeLinecap="round" fill="none" />}
      <circle cx={pt[0]} cy={pt[1]} r={0} />
      <Paint vig={0.35} />
      <g data-rider={`${pt[0]},${pt[1]}`} />
    </g>
  );
};
export const dcRoutePoint = (p: number): [number, number] => {
  const seg1 = Math.hypot(DC.dupont[0] - DC.obs[0], DC.dupont[1] - DC.obs[1]);
  const seg2 = Math.hypot(DC.wh[0] - DC.dupont[0], DC.wh[1] - DC.dupont[1]);
  const d = p * (seg1 + seg2);
  return d <= seg1 ? [DC.obs[0] + (DC.dupont[0] - DC.obs[0]) * (d / seg1), DC.obs[1] + (DC.dupont[1] - DC.obs[1]) * (d / seg1)]
    : [DC.dupont[0] + (DC.wh[0] - DC.dupont[0]) * ((d - seg1) / seg2), DC.dupont[1] + (DC.wh[1] - DC.dupont[1]) * ((d - seg1) / seg2)];
};

// ================================================================== CAPITOL WEST FRONT, 20 Jan 1981
/** The first West Front inauguration: Capitol dome, the West Front terraces, the bunting-draped platform, flags. */
export const WestFront1981: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <defs><linearGradient id="p4-wfsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7aaedc" /><stop offset="1" stopColor="#e9f0f2" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#p4-wfsky)" />
      <Cloud x={260 + f * 0.15} y={120} s={0.9} />
      <g stroke={L} strokeWidth={lw}>
        <rect x={900} y={30} width={120} height={40} fill="#f4f2ec" /><path d="M 930 30 Q 960 -10 990 30 Z" fill="#f4f2ec" />
        <path d="M 760 260 Q 760 60 960 60 Q 1160 60 1160 260 Z" fill="#f4f2ec" />
        {Array.from({ length: 9 }, (_, i) => <line key={i} x1={790 + i * 42} y1={250} x2={800 + i * 40} y2={110} stroke="#cfcabd" strokeWidth={3} />)}
        <rect x={700} y={250} width={520} height={110} fill="#efece4" />
        {Array.from({ length: 16 }, (_, i) => <rect key={i} x={715 + i * 32} y={262} width={14} height={90} fill="#fbfaf6" stroke="#bdb8aa" strokeWidth={2} />)}
        <rect x={0} y={360} width={1920} height={180} fill="#ece8de" />
        {Array.from({ length: 24 }, (_, i) => <rect key={i} x={20 + i * 80} y={390} width={36} height={60} fill="#7a8696" stroke="#d8d4c8" strokeWidth={3} />)}
        <path d="M 640 360 L 960 300 L 1280 360 Z" fill="#efece4" />
      </g>
      {/* platform with bunting */}
      <rect x={0} y={540} width={1920} height={140} fill="#e9e3d4" stroke={L} strokeWidth={lw} />
      <Bunting x0={0} x1={1920} y={560} n={10} d={70} />
      {Array.from({ length: 5 }, (_, i) => <FlagPole key={i} x={180 + i * 400} y={560} h={240} kind="us" s={0.55} />)}
      <rect y={680} width={1920} height={400} fill="#ccc4b0" />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} y1={700 + i * 60} x2={1920} y2={700 + i * 60} stroke="#b8b09c" strokeWidth={3} />)}
      <Paint vig={0.3} />
    </g>
  );
};

// ================================================================== ELECTION NIGHT 1988, Houston
/** Bush's election-night rally hall in Houston: lighting truss, blue stage drape, "BUSH QUAYLE '88" banner. */
export const Houston1988: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#14203f" />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M ${100 + i * 190} 60 L ${40 + i * 190} 760 L ${260 + i * 190} 760 Z`} fill="#bcd2ff" opacity={0.07} />)}
    <rect y={40} width={1920} height={40} fill="#3a3a3e" stroke={L} strokeWidth={3} />
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={90 + i * 190} y={78} width={40} height={36} fill="#222" />)}
    <rect x={200} y={180} width={1520} height={520} fill="#1f3a7a" />
    {Array.from({ length: 18 }, (_, i) => <line key={i} x1={200 + i * 90} y1={180} x2={200 + i * 90} y2={700} stroke="#1a3170" strokeWidth={16} />)}
    <rect x={460} y={250} width={1000} height={170} fill="#f4f0e6" stroke={L} strokeWidth={lw} />
    <text x={960} y={365} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={100} fill="#b8362f">BUSH QUAYLE '88</text>
    <rect y={700} width={1920} height={380} fill="#3a2e2a" />
    <Bunting x0={0} x1={1920} y={700} n={9} d={70} />
    <Paint vig={0.4} warm={false} />
  </g>
);

// ================================================================== LOUISIANA SUPERDOME, RNC, 18 Aug 1988
/** The Superdome during the 1988 Republican convention: ribbed dome, tiers of seats, state placards, podium. */
export const Superdome1988: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#2a2f3c" />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M 960 -300 L ${-400 + i * 210} 330`} stroke="#4a5060" strokeWidth={10} />)}
    {Array.from({ length: 4 }, (_, i) => <path key={i} d={`M -100 ${80 + i * 70} Q 960 ${-40 + i * 70} 2020 ${80 + i * 70}`} stroke="#4a5060" strokeWidth={8} fill="none" />)}
    <path d="M -100 330 Q 960 230 2020 330 L 2020 700 L -100 700 Z" fill="#3a3040" />
    {Array.from({ length: 8 }, (_, r) => Array.from({ length: 60 }, (_, i) => <circle key={`${r}-${i}`} cx={i * 33 + (r % 2) * 16} cy={330 + r * 44 - Math.sin((i / 60) * Math.PI) * 60} r={9} fill={["#c8302b", "#f4f0e6", "#2b4a9c", "#d9b07a"][(r * 7 + i) % 4]} opacity={0.55} />))}
    <rect x={560} y={440} width={800} height={220} fill="#1f3a7a" stroke={L} strokeWidth={lw} />
    <text x={960} y={590} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={120} fill="#f4f0e6">1988</text>
    <rect y={700} width={1920} height={380} fill="#1d2a50" />
    <Bunting x0={0} x1={1920} y={700} n={8} d={60} />
    <Paint vig={0.45} warm={false} />
  </g>
);

// ================================================================== KUWAIT, February 1991
/** Kuwaiti desert, Feb 1991: flat sand under a smoke-darkened sky, burning oil wells on the horizon. */
export const KuwaitDesert: React.FC = () => {
  const ff = useCurrentFrame();
  const f = Math.floor(ff / 2) * 2;
  return (
    <g>
      <defs><linearGradient id="p4-kwsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a3434" /><stop offset="0.55" stopColor="#a5785a" /><stop offset="1" stopColor="#e6c08a" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#p4-kwsky)" />
      <circle cx={1500} cy={300} r={60} fill="#f2c98a" opacity={0.6} />
      {[260, 720, 1180, 1650].map((x, i) => (
        <g key={x}>
          {Array.from({ length: 6 }, (_, k) => <ellipse key={k} cx={x + k * 60 + ff * 0.6} cy={520 - k * 70} rx={90 + k * 30} ry={60 + k * 12} fill="#1b1716" opacity={0.75 - k * 0.08} />)}
          <path d={`M ${x - 50} 600 Q ${x - 30} ${520 - rnd(f + i) * 40} ${x} ${470 - rnd(f * 3 + i) * 50} Q ${x + 30} ${520 - rnd(f + i * 5) * 40} ${x + 50} 600 Z`} fill="#ff7a2a" stroke={INK} strokeWidth={4} />
          <path d={`M ${x - 24} 600 Q ${x} ${540 - rnd(f * 7 + i) * 30} ${x + 24} 600 Z`} fill="#ffd25a" />
        </g>
      ))}
      <path d="M 0 600 L 1920 600 L 1920 1080 L 0 1080 Z" fill="#d6b07a" />
      <path d="M 0 700 Q 480 660 960 700 Q 1440 740 1920 690 L 1920 1080 L 0 1080 Z" fill="#e0bd86" />
      <path d="M 0 860 Q 600 820 1200 870 Q 1600 900 1920 860 L 1920 1080 L 0 1080 Z" fill="#e8c894" />
      {Array.from({ length: 20 }, (_, i) => <line key={i} x1={rnd(i) * 1920} y1={720 + rnd(i + 3) * 300} x2={rnd(i) * 1920 + 80} y2={720 + rnd(i + 3) * 300} stroke="#c9a06a" strokeWidth={4} />)}
      <Paint vig={0.4} />
    </g>
  );
};

/** M1-style tank silhouette in desert tan with a small flag on the antenna, facing right. */
export const Tank: React.FC<{ x: number; y: number; s?: number; flag?: "us" | "uk" | "sa" | "fr" | "kw" }> = ({ x, y, s = 1, flag = "us" }) => {
  const f = useCurrentFrame();
  const fl: Record<string, React.ReactNode> = {
    us: <><rect width={60} height={36} fill="#b8362f" />{[1, 3].map((k) => <rect key={k} y={k * 7} width={60} height={7} fill="#fff" />)}<rect width={26} height={20} fill="#2b3f74" /></>,
    uk: <><rect width={60} height={36} fill="#2b3f74" /><path d="M 0 0 L 60 36 M 60 0 L 0 36" stroke="#fff" strokeWidth={6} /><path d="M 30 0 L 30 36 M 0 18 L 60 18" stroke="#c8302b" strokeWidth={8} /></>,
    sa: <><rect width={60} height={36} fill="#1f7a3a" /><rect x={14} y={22} width={32} height={4} fill="#fff" /></>,
    fr: <><rect width={20} height={36} fill="#2b3f74" /><rect x={20} width={20} height={36} fill="#fff" /><rect x={40} width={20} height={36} fill="#c8302b" /></>,
    kw: <><rect width={60} height={12} fill="#1f7a3a" /><rect y={12} width={60} height={12} fill="#fff" /><rect y={24} width={60} height={12} fill="#c8302b" /><path d="M 0 0 L 16 12 L 16 24 L 0 36 Z" fill="#111" /></>,
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={6}>
      <path d="M -170 -20 L 170 -20 L 200 30 L 170 70 L -170 70 L -200 30 Z" fill="#b09868" />
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-140 + i * 56} cy={46} r={20} fill="#6a5a3e" transform={`rotate(${f * 12} ${-140 + i * 56} 46)`} />)}
      <path d="M -110 -20 L -90 -80 L 90 -80 L 120 -20 Z" fill="#c2aa78" />
      <rect x={110} y={-66} width={190} height={16} fill="#9a845a" />
      <line x1={-60} y1={-80} x2={-60} y2={-190} strokeWidth={4} />
      <g transform="translate(-60 -190)" strokeWidth={2}>{fl[flag]}</g>
    </g>
  );
};

/** Retreating truck (facing right), with dust. */
export const Truck: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={6}>
    <rect x={-160} y={-90} width={210} height={120} fill="#6a6a52" />
    <path d="M 50 -60 L 130 -60 L 160 -10 L 160 30 L 50 30 Z" fill="#7a7a5e" /><rect x={80} y={-50} width={40} height={30} fill="#2a3a44" />
    {[-110, 0, 120].map((cx) => <circle key={cx} cx={cx} cy={40} r={26} fill="#222" />)}
    {[0, 1, 2].map((i) => <ellipse key={i} cx={-200 - i * 70} cy={20 - i * 10} rx={50 + i * 12} ry={26 + i * 6} fill="#e8d0a0" opacity={0.6 - i * 0.15} stroke="none" />)}
  </g>
);

// ================================================================== RICHMOND TOWN-HALL DEBATE, 15 Oct 1992
/** University of Richmond town-hall debate: star-spangled blue backdrop, round stage, three stools, audience
 *  seated in a horseshoe. */
export const Richmond1992: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#16285a" />
    <rect x={0} y={80} width={1920} height={560} fill="#24418a" />
    {Array.from({ length: 30 }, (_, i) => <path key={i} transform={`translate(${60 + (i % 10) * 190 + (Math.floor(i / 10) % 2) * 95} ${150 + Math.floor(i / 10) * 140}) scale(1.1)`} d="M 0 -22 L 6 -6 L 23 -6 L 9 4 L 14 21 L 0 11 L -14 21 L -9 4 L -23 -6 L -6 -6 Z" fill="#f4f0e6" opacity={0.75} />)}
    <rect x={0} y={640} width={1920} height={40} fill="#b8362f" /><rect x={0} y={680} width={1920} height={20} fill="#f4f0e6" />
    {[0, 1].map((r) => Array.from({ length: 24 }, (_, i) => <g key={`${r}-${i}`} transform={`translate(${30 + i * 82 + r * 40} ${560 + r * 50})`}><path d="M -32 120 L -32 40 Q -28 10 0 8 Q 28 10 32 40 L 32 120 Z" fill={SUITS[(i + r) % 6]} /><circle cy={-10} r={20} fill="#c99b7a" /><path d="M -20 -14 Q 0 -40 20 -14 L 20 -22 Q 0 -44 -20 -22 Z" fill={HAIR[(i * 3 + r) % 6]} /></g>))}
    <ellipse cx={960} cy={900} rx={980} ry={190} fill="#3a4f8a" stroke={L} strokeWidth={lw} />
    <ellipse cx={960} cy={900} rx={900} ry={160} fill="none" stroke="#c9a640" strokeWidth={8} />
    {[720, 1200].map((x) => <g key={x} stroke={L} strokeWidth={lw}><ellipse cx={x} cy={740} rx={44} ry={12} fill="#7a5a3a" /><line x1={x - 30} y1={744} x2={x - 40} y2={880} /><line x1={x + 30} y1={744} x2={x + 40} y2={880} /><line x1={x} y1={746} x2={x} y2={884} /></g>)}
    <Paint vig={0.4} warm={false} />
  </g>
);

// ================================================================== small gag props
/** "LBJ '68" campaign button that pops, then gets a red X (he will not run). */
export const NoButton: React.FC<{ x: number; y: number; at: number; xAt: number }> = ({ x, y, at, xAt }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = interpolate(f - at, [0, 6], [0.1, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={150} fill="#f4f0e6" stroke={INK} strokeWidth={10} />
      <circle r={128} fill="none" stroke="#2b3f74" strokeWidth={18} />
      <path d="M -128 40 A 128 128 0 0 0 128 40 Z" fill="#b8362f" />
      <text y={-10} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={92} fill="#1d3a7a">LBJ</text>
      <text y={100} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={56} fill="#fff">'68</text>
      {f >= xAt && <g stroke="#e02b2b" strokeWidth={30} strokeLinecap="round"><line x1={-150} y1={-150} x2={150} y2={150} /><line x1={150} y1={-150} x2={-150} y2={150} /></g>}
    </g>
  );
};

/**
 * "Tear apart": the whole picture rips down a jagged line at `at`: a 2-frame red slash, then the two halves slide
 * apart over 8 f (ease-out) onto black. Children are rendered twice, each clipped to its half.
 */
export const TearApart: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const jag = "M 1000 -20 L 930 140 L 1010 260 L 920 420 L 1020 560 L 940 700 L 1030 860 L 950 1100";
  if (f < at) return <>{children}</>;
  const p = interpolate(f - at, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const d = 150 * p;
  return (
    <g>
      <rect width={1920} height={1080} fill="#050404" />
      <defs>
        <clipPath id="p4-tearL"><path d={`M -10 -20 ${jag.slice(1).replace(/^ /, "L ")} L -10 1100 Z`} /></clipPath>
        <clipPath id="p4-tearR"><path d={`M 1930 -20 ${jag.slice(1).replace(/^ /, "L ")} L 1930 1100 Z`} /></clipPath>
      </defs>
      <g transform={`translate(${-d} 0) rotate(${-2 * p} 0 1080)`}><g clipPath="url(#p4-tearL)">{children}</g></g>
      <g transform={`translate(${d} 0) rotate(${2 * p} 1920 1080)`}><g clipPath="url(#p4-tearR)">{children}</g></g>
      {f - at < 2 && <path d={jag} stroke="#e02b2b" strokeWidth={26} fill="none" strokeLinejoin="round" />}
    </g>
  );
};

/** Floor-level walking speed (screen px per frame) of an `Act` walker at height h (matches Kit.Rig's walk). */
const RIGS = VPRIG as unknown as Record<string, { limbs: { kind: string; len: number }[] }>;
const MM = META as unknown as Record<string, number[]>;
export const walkSpeed = (c: string, h: number) => {
  const r = RIGS[`vp_${c}/0`];
  const m = MM[`vp/${c}/0`];
  const Lg = Math.max(...r.limbs.filter((l) => l.kind === "leg").map((l) => l.len));
  const stride = 2 * Lg * Math.sin((17 * Math.PI) / 180);
  return (stride * (h / (m[3] - m[1]))) / 16;
};

/** A sheet prop image (shared_props_modern/<n>) placed by its centre. */
export const Prop: React.FC<{ n: number; x: number; y: number; h: number; rot?: number }> = ({ n, x, y, h, rot = 0 }) => {
  const m = MM[`vp/shared_props_modern/${n}`];
  const w = (h * (m[2] - m[0])) / (m[3] - m[1]);
  return <g transform={`translate(${x} ${y}) rotate(${rot})`}><SImg href={staticFile(`tg2/vp/shared_props_modern/${n}.png`)} x={-w / 2} y={-h / 2} width={w} height={h} /></g>;
};
