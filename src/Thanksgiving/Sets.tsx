import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";

// Painted, softer-than-the-characters backgrounds (style guide §4): gradients, soft blur on distant shapes,
// muted saturation, paper/paint grain. Characters (bold black outlines, flat fill) sit on top.

export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{children}</svg>
);

/** Paper/paint grain: a pre-baked noise texture (an SVG feTurbulence per frame is far too slow to render). */
export const Grain: React.FC<{ id: string; opacity?: number }> = ({ opacity = 0.16 }) => (
  <image href={staticFile("tg/grain.png")} x={0} y={0} width={1920} height={1080} preserveAspectRatio="none" opacity={Math.min(1, opacity * 3.2)} />
);

const Vignette: React.FC<{ id: string; k?: number }> = ({ id, k = 0.35 }) => (
  <g>
    <radialGradient id={id} cx="50%" cy="48%" r="75%"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#1a0f08" stopOpacity={k} /></radialGradient>
    <rect width={1920} height={1080} fill={`url(#${id})`} />
  </g>
);

const Soft: React.FC<{ id: string; s?: number }> = ({ id, s = 2.4 }) => <filter id={id}><feGaussianBlur stdDeviation={s} /></filter>;

const Clouds: React.FC<{ y?: number; tint?: string }> = ({ y = 170, tint = "#fff" }) => {
  const f = useCurrentFrame();
  return (
    <g filter="url(#cloudSoft)" opacity={0.9}>
      <Soft id="cloudSoft" s={3} />
      {[[260, y, 1], [900, y - 50, 0.8], [1560, y + 40, 0.9]].map(([cx, cy, k], i) => (
        <g key={i} transform={`translate(${cx + f * 0.12 * (i + 1)} ${cy}) scale(${k})`}>
          <ellipse rx={140} ry={44} fill={tint} /><ellipse cx={-80} cy={12} rx={85} ry={34} fill={tint} />
          <ellipse cx={90} cy={10} rx={95} ry={36} fill={tint} /><ellipse cx={10} cy={-30} rx={75} ry={46} fill={tint} />
        </g>
      ))}
    </g>
  );
};

const Sky: React.FC<{ top?: string; bottom?: string; id?: string }> = ({ top = "#78b4e0", bottom = "#f3e3c4", id = "sky" }) => (
  <g>
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bottom} /></linearGradient>
    <rect width={1920} height={1080} fill={`url(#${id})`} />
  </g>
);

const Tree: React.FC<{ x: number; y: number; k?: number; c?: string[] }> = ({ x, y, k = 1, c = ["#c8682f", "#d9913b", "#a94f2a"] }) => {
  const f = useCurrentFrame(); const sw = Math.sin(f / 20 + x) * 1.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M -14 0 L -8 -170 L 8 -170 L 14 0 Z" fill="#5a3d28" />
      <path d="M -6 -120 L -50 -190 M 4 -140 L 50 -210" stroke="#5a3d28" strokeWidth={12} strokeLinecap="round" />
      <g transform={`rotate(${sw} 0 -200)`}>
        <ellipse cx={-60} cy={-220} rx={85} ry={64} fill={c[2]} /><ellipse cx={60} cy={-235} rx={90} ry={70} fill={c[0]} />
        <ellipse cx={0} cy={-290} rx={95} ry={70} fill={c[1]} /><ellipse cx={-20} cy={-250} rx={70} ry={50} fill={c[0]} opacity={0.8} />
        <ellipse cx={30} cy={-310} rx={40} ry={24} fill="#fff" opacity={0.18} />
      </g>
    </g>
  );
};

// ---------- 1789 New York street with Federal Hall ----------
export const FederalHall: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <Sky />
      <Clouds />
      <Soft id="fhSoft" s={2.2} />
      {/* distant rowhouses */}
      <g filter="url(#fhSoft)" opacity={0.85}>
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i}>
            <rect x={i * 170 - 40} y={430 - (i % 3) * 30} width={160} height={330} fill={["#b56a52", "#a35b46", "#c27e5f"][i % 3]} />
            <path d={`M ${i * 170 - 40} ${430 - (i % 3) * 30} l 80 -50 l 80 50 Z`} fill="#5b4a48" />
            {[0, 1, 2].map((r) => [0, 1, 2].map((cIdx) => <rect key={`${r}${cIdx}`} x={i * 170 - 20 + cIdx * 48} y={470 - (i % 3) * 30 + r * 80} width={26} height={44} fill="#f2e2b8" opacity={0.75} />))}
          </g>
        ))}
      </g>
      {/* Federal Hall */}
      <g transform="translate(960 0)">
        <rect x={-430} y={380} width={860} height={420} fill="#e7ddc8" />
        <rect x={-430} y={380} width={860} height={420} fill="url(#fhShade)" />
        <linearGradient id="fhShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity={0.08} /><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.12} /></linearGradient>
        <path d="M -330 380 L 0 250 L 330 380 Z" fill="#d8ccb3" stroke="#a89878" strokeWidth={6} />
        <circle cx={0} cy={330} r={34} fill="#c8b998" />
        <rect x={-340} y={372} width={680} height={22} fill="#cbbd9f" />
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i}><rect x={-300 + i * 110} y={394} width={44} height={250} fill="#f4ecdc" /><rect x={-290 + i * 110} y={394} width={8} height={250} fill="#d9cdb4" /></g>
        ))}
        <rect x={-340} y={640} width={680} height={22} fill="#cbbd9f" />
        {[-180, 0, 180].map((dx) => <path key={dx} d={`M ${dx - 40} 800 L ${dx - 40} 720 Q ${dx} 680 ${dx + 40} 720 L ${dx + 40} 800 Z`} fill="#6a4a36" />)}
        {[-400, 360].map((dx) => [450, 560].map((dy) => <rect key={`${dx}${dy}`} x={dx} y={dy} width={40} height={70} fill="#f3e3b6" opacity={0.85} />))}
        {/* 13-star flag on the roof */}
        <line x1={0} y1={250} x2={0} y2={130} stroke="#4b3a2c" strokeWidth={6} />
        <g transform="translate(3 132)"><rect width={120} height={74} fill="#f6f1e6" />{[0, 2, 4, 6].map((r) => <rect key={r} y={r * 10.6} width={120} height={10.6} fill="#b8312f" />)}<rect width={52} height={42} fill="#2d4b8a" /></g>
      </g>
      {/* street */}
      <linearGradient id="street" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a99677" /><stop offset="1" stopColor="#7c6a51" /></linearGradient>
      <rect y={790} width={1920} height={290} fill="url(#street)" />
      {Array.from({ length: 70 }, (_, i) => <ellipse key={i} cx={(i * 211) % 1920} cy={820 + ((i * 53) % 250)} rx={34} ry={10} fill="#6d5c45" opacity={0.35} />)}
      {[220, 1700].map((lx) => (
        <g key={lx}><rect x={lx - 6} y={560} width={12} height={240} fill="#2d2a28" /><path d={`M ${lx - 26} 560 L ${lx + 26} 560 L ${lx + 16} 510 L ${lx - 16} 510 Z`} fill="#f5d77a" stroke="#2d2a28" strokeWidth={6} /></g>
      ))}
      <Grain id="gFH" /><Vignette id="vFH" k={0.25} />
    </Stage>
  </AbsoluteFill>
);

// ---------- Congress chamber (warm amber interior) ----------
export const Chamber: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <linearGradient id="chWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c99a5e" /><stop offset="1" stopColor="#8e5f34" /></linearGradient>
      <rect width={1920} height={1080} fill="url(#chWall)" />
      <Soft id="chSoft" s={3} />
      <g filter="url(#chSoft)">
        {[260, 760, 1160, 1660].map((wx) => (
          <g key={wx}>
            <path d={`M ${wx - 110} 640 L ${wx - 110} 260 Q ${wx} 150 ${wx + 110} 260 L ${wx + 110} 640 Z`} fill="#f6e2b0" />
            <path d={`M ${wx - 110} 640 L ${wx - 110} 260 Q ${wx} 150 ${wx + 110} 260 L ${wx + 110} 640 Z`} fill="none" stroke="#6b4426" strokeWidth={14} />
            <line x1={wx} y1={190} x2={wx} y2={640} stroke="#6b4426" strokeWidth={8} /><line x1={wx - 110} y1={420} x2={wx + 110} y2={420} stroke="#6b4426" strokeWidth={8} />
            {/* red drapes */}
            <path d={`M ${wx - 150} 200 Q ${wx - 120} 420 ${wx - 150} 660 L ${wx - 100} 660 Q ${wx - 80} 400 ${wx - 40} 220 Z`} fill="#8f2a26" />
            <path d={`M ${wx + 150} 200 Q ${wx + 120} 420 ${wx + 150} 660 L ${wx + 100} 660 Q ${wx + 80} 400 ${wx + 40} 220 Z`} fill="#8f2a26" />
          </g>
        ))}
        {[510, 960, 1410].map((cx) => <g key={cx}><rect x={cx - 40} y={120} width={80} height={600} fill="#ead7b0" /><rect x={cx - 30} y={120} width={14} height={600} fill="#fff" opacity={0.3} /></g>)}
        {/* light beams */}
        {[260, 760, 1160, 1660].map((wx) => <path key={wx} d={`M ${wx - 100} 300 L ${wx + 100} 300 L ${wx + 300} 1080 L ${wx - 20} 1080 Z`} fill="#fff4cf" opacity={0.12} />)}
      </g>
      <rect y={0} width={1920} height={110} fill="#6b4426" />
      {/* chandelier */}
      <g transform="translate(960 110)"><line y2={80} stroke="#3b2a1c" strokeWidth={5} /><ellipse cy={100} rx={120} ry={22} fill="#c49a3a" />{[-100, -50, 0, 50, 100].map((dx) => <g key={dx}><rect x={dx - 4} y={70} width={8} height={24} fill="#f7f0dc" /><ellipse cx={dx} cy={64} rx={6} ry={10} fill="#ffd36b" /></g>)}</g>
      {/* gallery rail and wainscot */}
      <rect y={700} width={1920} height={380} fill="#6e4628" />
      <rect y={700} width={1920} height={16} fill="#a37547" />
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={i * 125 + 20} y={740} width={90} height={120} rx={6} fill="none" stroke="#5a381f" strokeWidth={6} />)}
      <linearGradient id="chFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7d5232" /><stop offset="1" stopColor="#4d301b" /></linearGradient>
      <rect y={880} width={1920} height={200} fill="url(#chFloor)" />
      <Grain id="gCH" /><Vignette id="vCH" k={0.4} />
    </Stage>
  </AbsoluteFill>
);

/** Foreground desks for the chamber / study (drawn over the characters' legs). */
export const DeskRow: React.FC<{ y?: number; n?: number }> = ({ y = 930, n = 4 }) => (
  <Stage>
    {Array.from({ length: n }, (_, i) => {
      const w = 1920 / n; const x = i * w + 30;
      return (
        <g key={i}>
          <rect x={x} y={y} width={w - 60} height={34} rx={6} fill="#3f6b45" stroke="#1d1a17" strokeWidth={6} />
          <rect x={x + 10} y={y + 34} width={w - 80} height={130} fill="#6b4426" stroke="#1d1a17" strokeWidth={6} />
          <rect x={x + 40} y={y + 60} width={w - 140} height={70} rx={6} fill="none" stroke="#4d2f1a" strokeWidth={5} />
        </g>
      );
    })}
  </Stage>
);

export const Desk: React.FC<{ x?: number; y?: number; w?: number }> = ({ x = 960, y = 820, w = 760 }) => (
  <Stage>
    <rect x={x - w / 2} y={y} width={w} height={40} rx={8} fill="#7a4a2a" stroke="#1d1a17" strokeWidth={7} />
    <rect x={x - w / 2 + 20} y={y + 40} width={w - 40} height={260} fill="#5f3920" stroke="#1d1a17" strokeWidth={7} />
    <rect x={x - w / 2 + 60} y={y + 70} width={w / 2 - 90} height={70} rx={6} fill="none" stroke="#3f2614" strokeWidth={6} />
    <rect x={x + 30} y={y + 70} width={w / 2 - 90} height={70} rx={6} fill="none" stroke="#3f2614" strokeWidth={6} />
    <circle cx={x - w / 4 + 15} cy={y + 105} r={8} fill="#d9b25a" /><circle cx={x + w / 4 - 15} cy={y + 105} r={8} fill="#d9b25a" />
  </Stage>
);

// ---------- Study / office (palette variants for each president) ----------
const STUDY = {
  gw: { wall: ["#5e7a8c", "#3f566a"], drape: "#8a2b2b" },
  adams: { wall: ["#7b6a4a", "#544630"], drape: "#3e5a3a" },
  tj: { wall: ["#7a8a5c", "#55623e"], drape: "#7a2e2a" },
  madison: { wall: ["#6f5b7a", "#4a3c53"], drape: "#b08a3a" },
  levi: { wall: ["#5a5a5a", "#3a3a3a"], drape: "#6a2a2a" },
  lincoln: { wall: ["#6b4a3a", "#45302a"], drape: "#3a4a6a" },
  hale: { wall: ["#c49aa0", "#8f6670"], drape: "#4a6a5a" },
};
export const Study: React.FC<{ v?: keyof typeof STUDY; night?: boolean }> = ({ v = "gw", night }) => {
  const p = STUDY[v]; const f = useCurrentFrame();
  const flick = 1 + Math.sin(f / 3) * 0.04 + Math.sin(f / 7) * 0.03;
  return (
    <AbsoluteFill>
      <Stage>
        <linearGradient id={`st${v}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.wall[0]} /><stop offset="1" stopColor={p.wall[1]} /></linearGradient>
        <rect width={1920} height={1080} fill={`url(#st${v})`} />
        {/* wallpaper pattern */}
        {Array.from({ length: 18 * 9 }, (_, i) => <path key={i} d={`M ${(i % 18) * 110 + ((Math.floor(i / 18) % 2) * 55)} ${Math.floor(i / 18) * 80 + 30} l 10 16 l -10 16 l -10 -16 Z`} fill="#fff" opacity={0.07} />)}
        <Soft id={`stSoft${v}`} s={2.5} />
        <g filter={`url(#stSoft${v})`}>
          {/* window */}
          <rect x={1260} y={170} width={360} height={470} fill={night ? "#2a3550" : "#bcd9ee"} />
          {!night && <ellipse cx={1440} cy={520} rx={260} ry={70} fill="#9fbf8a" />}
          {night && <circle cx={1530} cy={260} r={36} fill="#f6f0d0" />}
          <rect x={1260} y={170} width={360} height={470} fill="none" stroke="#e9dcc0" strokeWidth={16} />
          <line x1={1440} y1={170} x2={1440} y2={640} stroke="#e9dcc0" strokeWidth={10} /><line x1={1260} y1={400} x2={1620} y2={400} stroke="#e9dcc0" strokeWidth={10} />
          <path d="M 1220 140 Q 1250 400 1210 680 L 1290 680 Q 1310 400 1330 150 Z" fill={p.drape} />
          <path d="M 1660 140 Q 1630 400 1670 680 L 1590 680 Q 1570 400 1550 150 Z" fill={p.drape} />
          <rect x={1200} y={130} width={480} height={26} rx={8} fill="#b08a4a" />
          {/* bookshelf */}
          <rect x={150} y={150} width={430} height={620} fill="#4a2e1c" />
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              <rect x={170} y={180 + r * 145} width={390} height={120} fill="#2f1d12" />
              {Array.from({ length: 13 }, (_, b) => <rect key={b} x={176 + b * 29} y={196 + r * 145 + (b % 3) * 6} width={24} height={104 - (b % 3) * 6} fill={["#8a2b2b", "#2d4b6a", "#6a5a2a", "#3e5a3a", "#a07a3a"][(b + r) % 5]} />)}
            </g>
          ))}
          {/* portrait frame */}
          <rect x={720} y={190} width={260} height={320} fill="#c49a3a" /><rect x={740} y={210} width={220} height={280} fill="#5a4a3a" />
          <ellipse cx={850} cy={330} rx={60} ry={75} fill="#d8b89a" opacity={0.6} /><path d="M 760 490 Q 850 380 940 490 Z" fill="#2a2a3a" opacity={0.7} />
        </g>
        {/* wainscot + floor */}
        <rect y={700} width={1920} height={380} fill="#5a3a22" />
        <rect y={700} width={1920} height={14} fill="#8a6038" />
        <linearGradient id={`fl${v}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a5232" /><stop offset="1" stopColor="#4a2e1a" /></linearGradient>
        <rect y={860} width={1920} height={220} fill={`url(#fl${v})`} />
        {Array.from({ length: 10 }, (_, i) => <line key={i} x1={i * 200} y1={860} x2={i * 200 - 120} y2={1080} stroke="#3e2614" strokeWidth={3} opacity={0.5} />)}
        {/* candle glow */}
        <radialGradient id={`glow${v}`}><stop offset="0" stopColor="#ffd98a" stopOpacity={0.5 * flick} /><stop offset="1" stopColor="#ffd98a" stopOpacity={0} /></radialGradient>
        <circle cx={660} cy={640} r={260} fill={`url(#glow${v})`} />
        <Grain id={`gST${v}`} /><Vignette id={`vST${v}`} k={night ? 0.6 : 0.42} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- St. Paul's Chapel exterior (autumn) ----------
export const Chapel: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <Sky top="#8cb7d6" bottom="#f4dfbf" id="skyCh" />
      <Clouds y={150} />
      <Soft id="cpSoft" s={2} />
      <g transform="translate(960 0)">
        {/* steeple */}
        <rect x={-70} y={210} width={140} height={200} fill="#c9b79a" />
        <rect x={-50} y={120} width={100} height={100} fill="#d8c8aa" />
        <path d="M -50 120 L 0 -20 L 50 120 Z" fill="#8a7a66" />
        <circle cx={0} cy={270} r={34} fill="#f2ead8" stroke="#6b5a46" strokeWidth={6} /><line x1={0} y1={270} x2={0} y2={248} stroke="#2a2a2a" strokeWidth={5} /><line x1={0} y1={270} x2={16} y2={276} stroke="#2a2a2a" strokeWidth={5} />
        <path d="M -20 160 Q 0 140 20 160 L 20 200 L -20 200 Z" fill="#4a3a2a" />
        {/* church body */}
        <rect x={-380} y={400} width={760} height={420} fill="#b9a587" />
        <path d="M -400 410 L 0 300 L 400 410 Z" fill="#a8947a" />
        {[-260, 260].map((dx) => <path key={dx} d={`M ${dx - 50} 720 L ${dx - 50} 520 Q ${dx} 450 ${dx + 50} 520 L ${dx + 50} 720 Z`} fill="#33475e" stroke="#e8dcc4" strokeWidth={10} />)}
        {/* portico */}
        <path d="M -230 470 L 0 400 L 230 470 Z" fill="#e8dcc4" stroke="#a8947a" strokeWidth={5} />
        {[-190, -70, 70, 190].map((dx) => <rect key={dx} x={dx - 22} y={470} width={44} height={330} fill="#f3eadb" />)}
        <path d="M -60 820 L -60 640 Q 0 590 60 640 L 60 820 Z" fill="#5a3a26" />
      </g>
      <rect y={800} width={1920} height={280} fill="#7c9a5a" />
      <rect y={800} width={1920} height={280} fill="url(#grassG)" />
      <linearGradient id="grassG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.25} /></linearGradient>
      <path d="M 880 820 L 1040 820 L 1200 1080 L 720 1080 Z" fill="#c9b48e" />
      {[[140, 860], [330, 900], [1610, 880], [1800, 910]].map(([gx, gy], i) => <path key={i} d={`M ${gx - 22} ${gy} L ${gx - 22} ${gy - 46} Q ${gx} ${gy - 70} ${gx + 22} ${gy - 46} L ${gx + 22} ${gy} Z`} fill="#9a9a96" stroke="#5a5a56" strokeWidth={4} />)}
      <Tree x={250} y={820} k={1.2} /><Tree x={1690} y={830} k={1.3} c={["#d4a03a", "#e6b84a", "#b87a2a"]} />
      <Grain id="gCP" /><Vignette id="vCP" k={0.22} />
    </Stage>
  </AbsoluteFill>
);

// ---------- Debtors' prison (cool, dim) ----------
export const Prison: React.FC = () => (
  <AbsoluteFill>
    <Stage>
      <linearGradient id="prW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5d6a6a" /><stop offset="1" stopColor="#3a4444" /></linearGradient>
      <rect width={1920} height={1080} fill="url(#prW)" />
      {Array.from({ length: 13 * 10 }, (_, i) => {
        const r = Math.floor(i / 13), c = i % 13;
        return <rect key={i} x={c * 160 - (r % 2) * 80} y={r * 90} width={152} height={82} rx={10} fill={["#6a7676", "#617070", "#707c78"][(i * 7) % 3]} opacity={0.85} />;
      })}
      <g>
        <rect x={860} y={150} width={200} height={170} fill="#cfe2e6" />
        {[0, 1, 2, 3].map((b) => <rect key={b} x={880 + b * 50} y={150} width={12} height={170} fill="#262a2a" />)}
        <path d="M 860 320 L 1060 320 L 1400 1080 L 640 1080 Z" fill="#e6f2ee" opacity={0.12} />
      </g>
      <rect y={860} width={1920} height={220} fill="#4a4436" />
      {Array.from({ length: 90 }, (_, i) => <line key={i} x1={(i * 97) % 1920} y1={900 + (i * 31) % 160} x2={(i * 97) % 1920 + 30} y2={890 + (i * 31) % 160} stroke="#c9a85a" strokeWidth={4} opacity={0.5} />)}
      <Grain id="gPR" opacity={0.2} /><Vignette id="vPR" k={0.6} />
    </Stage>
  </AbsoluteFill>
);

export const Bars: React.FC = () => (
  <Stage>
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={40 + i * 300} y={0} width={22} height={1080} fill="#1f2222" />)}
    <rect y={60} width={1920} height={20} fill="#1f2222" />
  </Stage>
);

// ---------- Countryside (Pennsylvania hills / New Hampshire / New England village) ----------
export const Country: React.FC<{ v?: "pa" | "nh" | "ne" | "va"; sepia?: boolean }> = ({ v = "pa" }) => (
  <AbsoluteFill>
    <Stage>
      <Sky top={v === "pa" ? "#9fb6c8" : "#7fb0d8"} bottom="#f6e1bd" id={`sk${v}`} />
      <Clouds y={160} />
      <Soft id={`cs${v}`} s={3} />
      <g filter={`url(#cs${v})`}>
        <path d="M 0 560 Q 300 420 640 520 T 1300 480 T 1920 520 L 1920 700 L 0 700 Z" fill="#8aa0a8" opacity={0.8} />
        <path d="M 0 640 Q 400 520 900 610 T 1920 590 L 1920 760 L 0 760 Z" fill={v === "va" ? "#7f9a5a" : "#a88a4a"} />
      </g>
      {v === "pa" && (
        <g>
          {/* log cabin still with barrels */}
          <g transform="translate(1380 700)">
            {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-160} y={-i * 28 - 28} width={320} height={26} rx={12} fill={i % 2 ? "#7a5232" : "#8a603a"} stroke="#3e2818" strokeWidth={4} />)}
            <path d="M -190 -168 L 0 -260 L 190 -168 Z" fill="#5a3a22" />
            <rect x={-40} y={-110} width={70} height={110} fill="#3e2818" />
            <path d="M 90 -260 L 90 -320 L 120 -320 L 120 -230" fill="#6a6a6a" />
            {[0, 1, 2].map((i) => <circle key={i} cx={110 + i * 14} cy={-340 - i * 40} r={22 + i * 8} fill="#e8e4dc" opacity={0.6 - i * 0.15} />)}
          </g>
          {[1150, 1220, 1185].map((bx, i) => <g key={i} transform={`translate(${bx} ${i === 2 ? 640 : 700})`}><ellipse rx={36} ry={46} fill="#9a6a3a" stroke="#2a1a10" strokeWidth={5} /><line x1={-36} x2={36} y1={-15} y2={-15} stroke="#2a1a10" strokeWidth={5} /><line x1={-36} x2={36} y1={15} y2={15} stroke="#2a1a10" strokeWidth={5} /></g>)}
        </g>
      )}
      {(v === "nh" || v === "va") && (
        <g transform="translate(1400 690)">
          <rect x={-200} y={-200} width={400} height={200} fill={v === "nh" ? "#f0ead8" : "#b85a3a"} />
          <path d="M -230 -200 L 0 -330 L 230 -200 Z" fill="#5a4a4a" />
          <rect x={-20} y={-110} width={60} height={110} fill="#4a3a2a" />
          {[-140, 100].map((wx) => <rect key={wx} x={wx} y={-160} width={50} height={60} fill="#33475e" stroke="#fff" strokeWidth={6} />)}
          <rect x={120} y={-300} width={40} height={80} fill="#7a3a2a" />
        </g>
      )}
      {v === "ne" && (
        <g transform="translate(1300 700)">
          <rect x={-170} y={-230} width={340} height={230} fill="#f6f2e8" />
          <path d="M -200 -230 L 0 -330 L 200 -230 Z" fill="#e2dccc" stroke="#9a9488" strokeWidth={4} />
          <rect x={-40} y={-470} width={80} height={140} fill="#f6f2e8" stroke="#9a9488" strokeWidth={4} /><path d="M -40 -470 L 0 -580 L 40 -470 Z" fill="#5a5a5a" />
          <path d="M -30 0 L -30 -90 Q 0 -120 30 -90 L 30 0 Z" fill="#7a3a2a" />
          {[-120, 80].map((wx) => <rect key={wx} x={wx} y={-180} width={40} height={80} fill="#33475e" />)}
          <g transform="translate(-520 20)"><rect x={-110} y={-150} width={220} height={150} fill="#b8432f" /><path d="M -130 -150 L 0 -230 L 130 -150 Z" fill="#4a3a3a" /><rect x={-20} y={-80} width={40} height={80} fill="#3a2a1a" /></g>
        </g>
      )}
      <linearGradient id={`gr${v}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={v === "va" ? "#86a85e" : "#a3a25a"} /><stop offset="1" stopColor={v === "va" ? "#5a7a3a" : "#6e6a32"} /></linearGradient>
      <rect y={700} width={1920} height={380} fill={`url(#gr${v})`} />
      <g opacity={0.85}>
        <line x1={0} y1={760} x2={1920} y2={752} stroke="#6b4a2c" strokeWidth={5} /><line x1={0} y1={790} x2={1920} y2={782} stroke="#6b4a2c" strokeWidth={5} />
        {Array.from({ length: 13 }, (_, i) => <rect key={i} x={i * 160 + 30} y={735} width={12} height={70} fill="#5a3a22" />)}
      </g>
      <Tree x={180} y={760} k={1.25} /><Tree x={430} y={720} k={0.8} c={["#d4a03a", "#e6b84a", "#b87a2a"]} /><Tree x={1820} y={780} k={1.15} c={["#b8432f", "#d0603a", "#8f2a26"]} />
      <Grain id={`gC${v}`} /><Vignette id={`vC${v}`} k={0.25} />
    </Stage>
  </AbsoluteFill>
);

// ---------- Archival / flashback grade ----------
export const Sepia: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: "sepia(0.85) saturate(0.8) contrast(1.05) brightness(0.95)" }}>{children}</AbsoluteFill>
      <Stage>
        <image href={staticFile("tg/grain.png")} x={-((f * 37) % 40)} y={-((f * 53) % 40)} width={1960} height={1120} preserveAspectRatio="none" opacity={0.7} />
        {f % 11 < 2 && <line x1={300 + (f * 37) % 1300} y1={0} x2={310 + (f * 37) % 1300} y2={1080} stroke="#f6ead0" strokeWidth={2} opacity={0.5} />}
        <radialGradient id="sepVig" cx="50%" cy="50%" r="70%"><stop offset="0.5" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#1a0f08" stopOpacity={0.7} /></radialGradient>
        <rect width={1920} height={1080} fill="url(#sepVig)" />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Flat infographic plates ----------
export const BluePlate: React.FC<{ children?: React.ReactNode; color?: string }> = ({ children, color = "#1e90ff" }) => (
  <AbsoluteFill style={{ background: color }}>
    <Stage>
      <radialGradient id="bpVig"><stop offset="0.6" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.3} /></radialGradient>
      <rect width={1920} height={1080} fill="url(#bpVig)" />
      <Grain id="gBP" opacity={0.1} />
    </Stage>
    {children}
  </AbsoluteFill>
);

/** Aged parchment document plate. */
export const Parchment: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "#3a2a1c" }}>
    <Stage>
      <filter id="burn"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={4} seed={3} /><feDisplacementMap in="SourceGraphic" scale={40} /></filter>
      <radialGradient id="parch" cx="50%" cy="45%" r="65%"><stop offset="0" stopColor="#f3e2bb" /><stop offset="0.75" stopColor="#e2c58e" /><stop offset="1" stopColor="#b98a4e" /></radialGradient>
      <rect x={250} y={60} width={1420} height={960} fill="url(#parch)" filter="url(#burn)" />
      <Grain id="gPA" opacity={0.22} />
      <radialGradient id="paVig"><stop offset="0.55" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#1a0f08" stopOpacity={0.5} /></radialGradient>
      <rect width={1920} height={1080} fill="url(#paVig)" />
    </Stage>
    {children}
  </AbsoluteFill>
);
