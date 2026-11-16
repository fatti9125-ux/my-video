import React from "react";

// Shared puppet style: thick uniform black outline, flat fills, stick limbs.
const INK = "#1c1a1a";
const OUT = 8;

export type Brows = "neutral" | "angry" | "worried" | "smug";
export type Eyes = "dot" | "wide" | "closed";
export type Mouth = "line" | "smile" | "frown" | "open" | "grin";
export type Hat = "straw" | "slouch" | "helmet" | "none";

export type PersonProps = {
  x: number; y: number; scale?: number; flip?: boolean;
  skin?: string; coat?: string; trim?: string; hair?: string;
  hat?: Hat; moustache?: boolean; beard?: boolean;
  brows?: Brows; eyes?: Eyes; mouth?: Mouth;
  armL?: number; armR?: number; // degrees from hanging down (positive = raise outward)
  tilt?: number; bodyBob?: number; sweat?: boolean; tears?: number; blush?: boolean;
  overalls?: boolean;
};

const BrowPaths: Record<Brows, [string, string]> = {
  neutral: ["M -78 -618 L -22 -618", "M 22 -618 L 78 -618"],
  angry: ["M -80 -632 L -20 -604", "M 20 -604 L 80 -632"],
  worried: ["M -80 -606 L -22 -630", "M 22 -630 L 80 -606"],
  smug: ["M -80 -612 L -22 -612", "M 22 -626 L 80 -640"],
};

const MouthShape: React.FC<{ m: Mouth }> = ({ m }) => {
  switch (m) {
    case "smile": return <path d="M -46 -492 Q 0 -452 46 -492" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />;
    case "frown": return <path d="M -40 -468 Q 0 -500 40 -468" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />;
    case "grin": return <path d="M -55 -500 Q 0 -500 55 -500 Q 40 -440 0 -440 Q -40 -440 -55 -500 Z" fill="#fff" stroke={INK} strokeWidth={8} strokeLinejoin="round" />;
    case "open": return (
      <g>
        <path d="M -42 -500 Q 0 -510 42 -500 Q 38 -440 0 -438 Q -38 -440 -42 -500 Z" fill="#5a1a1a" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <path d="M -22 -452 Q 0 -470 22 -452 Q 12 -440 0 -440 Q -12 -440 -22 -452 Z" fill="#e2626b" />
      </g>
    );
    default: return <path d="M -34 -482 L 34 -482" stroke={INK} strokeWidth={9} strokeLinecap="round" />;
  }
};

const EyePair: React.FC<{ e: Eyes }> = ({ e }) => {
  if (e === "wide") return (
    <g>
      {[-48, 48].map((cx) => (
        <g key={cx}><circle cx={cx} cy={-570} r={26} fill="#fff" stroke={INK} strokeWidth={6} /><circle cx={cx} cy={-568} r={9} fill={INK} /></g>
      ))}
    </g>
  );
  if (e === "closed") return (
    <g>{[-48, 48].map((cx) => <path key={cx} d={`M ${cx - 20} -566 Q ${cx} -552 ${cx + 20} -566`} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />)}</g>
  );
  return <g><circle cx={-46} cy={-572} r={10} fill={INK} /><circle cx={46} cy={-572} r={10} fill={INK} /></g>;
};

const HatShape: React.FC<{ h: Hat }> = ({ h }) => {
  if (h === "straw") return (
    <g>
      <path d="M -95 -690 Q -90 -790 0 -795 Q 90 -790 95 -690 Z" fill="#e7bf5f" stroke={INK} strokeWidth={OUT} strokeLinejoin="round" />
      <rect x={-95} y={-712} width={190} height={22} fill="#b5482f" />
      <ellipse cx={0} cy={-688} rx={210} ry={34} fill="#efcb6c" stroke={INK} strokeWidth={OUT} />
      <path d="M -150 -690 L 150 -690" stroke="#c9a14a" strokeWidth={4} strokeDasharray="10 12" />
    </g>
  );
  if (h === "slouch") return (
    <g>
      <path d="M -100 -690 Q -95 -800 0 -805 Q 95 -800 100 -690 Z" fill="#8a6e45" stroke={INK} strokeWidth={OUT} strokeLinejoin="round" />
      <path d="M -60 -760 Q 0 -790 60 -760" fill="none" stroke={INK} strokeWidth={6} />
      <rect x={-100} y={-718} width={200} height={26} fill="#4b3a26" />
      <path d="M -215 -690 Q 0 -660 205 -690 L 195 -705 Q 0 -680 -205 -705 Z" fill="#9b7d50" stroke={INK} strokeWidth={OUT} strokeLinejoin="round" />
      {/* pinned-up side brim */}
      <path d="M -110 -700 Q -140 -790 -105 -800 Q -95 -760 -90 -700 Z" fill="#9b7d50" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={-110} cy={-735} r={10} fill="#d9b44a" stroke={INK} strokeWidth={4} />
    </g>
  );
  if (h === "helmet") return (
    <g>
      <path d="M -120 -680 Q -110 -790 0 -795 Q 110 -790 120 -680 Z" fill="#6f7a4a" stroke={INK} strokeWidth={OUT} strokeLinejoin="round" />
      <ellipse cx={0} cy={-680} rx={185} ry={28} fill="#7c8854" stroke={INK} strokeWidth={OUT} />
    </g>
  );
  return null;
};

export const Person: React.FC<PersonProps> = (p) => {
  const {
    x, y, scale = 1, flip = false, skin = "#f6d3b3", coat = "#b89b5e", trim = "#7a5a2e", hair = "#5b3b22",
    hat = "none", moustache = false, beard = false, brows = "neutral", eyes = "dot", mouth = "line",
    armL = 10, armR = 10, tilt = 0, bodyBob = 0, sweat = false, tears = 0, blush = false, overalls = false,
  } = p;
  const arm = (side: -1 | 1, ang: number) => {
    // SVG angle 90deg = straight down; raise outward (away from body) by `ang`
    const sx = side * 92, sy = -335 + bodyBob;
    const a = (90 - side * ang) * (Math.PI / 180);
    return <line x1={sx} y1={sy} x2={sx + Math.cos(a) * 160} y2={sy + Math.sin(a) * 160} stroke={INK} strokeWidth={11} strokeLinecap="round" />;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {/* legs */}
      <line x1={-34} y1={-190} x2={-40} y2={0} stroke={INK} strokeWidth={11} strokeLinecap="round" />
      <line x1={34} y1={-190} x2={40} y2={0} stroke={INK} strokeWidth={11} strokeLinecap="round" />
      {arm(-1, armL)}{arm(1, armR)}
      <g transform={`translate(0 ${bodyBob})`}>
        {/* bean body */}
        <path d="M -105 -200 C -118 -320 -85 -405 0 -405 C 85 -405 118 -320 105 -200 C 98 -160 -98 -160 -105 -200 Z"
          fill={coat} stroke={INK} strokeWidth={OUT} strokeLinejoin="round" />
        {overalls ? (
          <g>
            <path d="M -70 -300 L 70 -300 L 80 -190 Q 0 -165 -80 -190 Z" fill="#3f6fa8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
            <line x1={-60} y1={-300} x2={-75} y2={-395} stroke="#3f6fa8" strokeWidth={18} />
            <line x1={60} y1={-300} x2={75} y2={-395} stroke="#3f6fa8" strokeWidth={18} />
            <circle cx={-58} cy={-292} r={8} fill="#e6c34a" stroke={INK} strokeWidth={3} />
            <circle cx={58} cy={-292} r={8} fill="#e6c34a" stroke={INK} strokeWidth={3} />
          </g>
        ) : (
          <g>
            <rect x={-106} y={-262} width={212} height={22} fill={trim} />
            <rect x={-16} y={-266} width={32} height={30} rx={4} fill="#d8b04a" stroke={INK} strokeWidth={4} />
            <path d="M -40 -400 L 0 -345 L 40 -400" fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
            {[-320, -290].map((cy) => <circle key={cy} cx={0} cy={cy} r={7} fill="#d8b04a" stroke={INK} strokeWidth={3} />)}
            <path d="M -95 -360 L -55 -372 L -60 -352 Z" fill={trim} stroke={INK} strokeWidth={4} />
          </g>
        )}
        {/* head */}
        <g transform={`rotate(${tilt} 0 -420)`}>
          {beard && <path d="M -135 -560 Q -120 -400 0 -385 Q 120 -400 135 -560 Z" fill={hair} stroke={INK} strokeWidth={OUT} strokeLinejoin="round" />}
          <ellipse cx={0} cy={-560} rx={140} ry={158} fill={skin} stroke={INK} strokeWidth={OUT} />
          {/* side hair */}
          <path d="M -138 -590 Q -160 -540 -130 -500 Q -118 -560 -110 -600 Z" fill={hair} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <path d="M 138 -590 Q 160 -540 130 -500 Q 118 -560 110 -600 Z" fill={hair} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          {hat === "none" && <path d="M -130 -620 Q -120 -730 0 -722 Q 120 -730 130 -620 Q 60 -680 0 -660 Q -60 -690 -130 -620 Z" fill={hair} stroke={INK} strokeWidth={OUT} strokeLinejoin="round" />}
          {blush && <g><ellipse cx={-85} cy={-520} rx={24} ry={14} fill="#f29b9b" opacity={0.7} /><ellipse cx={85} cy={-520} rx={24} ry={14} fill="#f29b9b" opacity={0.7} /></g>}
          <EyePair e={eyes} />
          <path d={BrowPaths[brows][0]} stroke={INK} strokeWidth={14} strokeLinecap="round" />
          <path d={BrowPaths[brows][1]} stroke={INK} strokeWidth={14} strokeLinecap="round" />
          <path d="M 4 -562 Q 30 -520 2 -512" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
          {moustache && <path d="M -70 -500 Q -36 -535 0 -506 Q 36 -535 70 -500 Q 40 -480 0 -496 Q -40 -480 -70 -500 Z" fill={hair} stroke={INK} strokeWidth={6} strokeLinejoin="round" />}
          <MouthShape m={mouth} />
          <HatShape h={hat} />
          {sweat && <path d="M 150 -660 Q 132 -625 150 -612 Q 168 -625 150 -660 Z" fill="#8fd0f4" stroke={INK} strokeWidth={5} />}
          {tears > 0 && [-48, 48].map((cx) => (
            <rect key={cx} x={cx - 9} y={-555} width={18} height={tears} rx={9} fill="#8fd0f4" stroke={INK} strokeWidth={4} />
          ))}
        </g>
      </g>
    </g>
  );
};

export type EmuProps = {
  x: number; y: number; scale?: number; flip?: boolean;
  walk?: number; // phase in radians; NaN/undefined = standing
  peck?: number; // 0..1 head down
  smug?: boolean; wideEye?: boolean; headTilt?: number;
};

export const Emu: React.FC<EmuProps> = ({ x, y, scale = 1, flip = false, walk, peck = 0, smug = false, wideEye = false, headTilt = 0 }) => {
  const moving = walk !== undefined;
  const s1 = moving ? Math.sin(walk!) : 0;
  const bob = moving ? Math.abs(Math.cos(walk!)) * -10 : 0;
  const leg = (off: number, ph: number) => {
    const k = 34 * ph;
    return <polyline points={`${off},-185 ${off - 28 + k * 0.6},-95 ${off + k},0`} fill="none" stroke={INK} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />;
  };
  // neck goes from body front up to head; peck bends it down toward ground
  const hx = 150 + peck * 70, hy = -585 + peck * 420;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {leg(-30, s1)}{leg(30, -s1)}
      <g transform={`translate(0 ${bob})`}>
        <path d={`M 80 -300 Q ${130 + peck * 60} ${-420 + peck * 160} ${hx} ${hy}`} fill="none" stroke={INK} strokeWidth={50} strokeLinecap="round" />
        <path d={`M 80 -300 Q ${130 + peck * 60} ${-420 + peck * 160} ${hx} ${hy}`} fill="none" stroke="#7d8ea8" strokeWidth={34} strokeLinecap="round" />
        {/* shaggy body */}
        <path d="M -150 -250 C -160 -330 -60 -370 40 -360 C 130 -350 160 -290 140 -230 C 120 -170 -30 -160 -100 -180 Q -125 -175 -140 -200 Q -170 -210 -150 -250 Z"
          fill="#5d4535" stroke={INK} strokeWidth={OUT} strokeLinejoin="round" />
        {[-110, -70, -30, 10, 50, 90].map((fx, i) => (
          <path key={fx} d={`M ${fx} ${-330 + (i % 2) * 15} q 15 40 -5 70`} fill="none" stroke="#3e2d22" strokeWidth={6} strokeLinecap="round" />
        ))}
        <g transform={`rotate(${headTilt} ${hx} ${hy})`}>
          <ellipse cx={hx} cy={hy} rx={44} ry={40} fill="#6e7f99" stroke={INK} strokeWidth={OUT} />
          <path d={`M ${hx + 36} ${hy - 6} L ${hx + 92} ${hy + 6} L ${hx + 36} ${hy + 18} Z`} fill="#3b3836" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          {wideEye ? (
            <g><circle cx={hx + 8} cy={hy - 10} r={20} fill="#fff" stroke={INK} strokeWidth={5} /><circle cx={hx + 12} cy={hy - 8} r={8} fill={INK} /></g>
          ) : (
            <g>
              <circle cx={hx + 10} cy={hy - 10} r={14} fill="#e9893a" stroke={INK} strokeWidth={4} />
              <circle cx={hx + 13} cy={hy - 9} r={6} fill={INK} />
              {smug && <path d={`M ${hx - 6} ${hy - 14} L ${hx + 26} ${hy - 14} L ${hx + 26} ${hy - 26} Q ${hx + 10} ${hy - 32} ${hx - 6} ${hy - 26} Z`} fill="#6e7f99" stroke={INK} strokeWidth={4} />}
            </g>
          )}
          {/* little head tuft */}
          <path d={`M ${hx - 20} ${hy - 36} q -6 -26 10 -30 M ${hx - 4} ${hy - 38} q 2 -24 16 -24`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
};
