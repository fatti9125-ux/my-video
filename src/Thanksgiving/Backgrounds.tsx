import React from "react";
import { useCurrentFrame } from "remotion";

/**
 * Painted backgrounds (house explainer style): softer and more detailed than the characters —
 * gradients, light, soft shadows, paper texture, muted saturation, a gentle vignette.
 * All are 1920x1080 SVG groups; characters stand on the floor line (~y 900-1000).
 */
const INK = "#2b2118";

export const Defs: React.FC = () => (
  <defs>
    <filter id="tg-tex" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={7} />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <filter id="tg-soft"><feGaussianBlur stdDeviation="3" /></filter>
    <filter id="tg-blur8"><feGaussianBlur stdDeviation="8" /></filter>
    <radialGradient id="tg-vig" cx="50%" cy="48%" r="75%">
      <stop offset="0.55" stopColor="#000" stopOpacity={0} />
      <stop offset="1" stopColor="#1a0f05" stopOpacity={0.45} />
    </radialGradient>
    <linearGradient id="tg-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#8fb8d8" /><stop offset="0.65" stopColor="#d9e4e6" /><stop offset="1" stopColor="#f3e2c4" />
    </linearGradient>
    <linearGradient id="tg-sky-dusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#5d6fa0" /><stop offset="0.55" stopColor="#e3a679" /><stop offset="1" stopColor="#f6d39a" />
    </linearGradient>
    <linearGradient id="tg-floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#8a5a36" /><stop offset="1" stopColor="#5e3b22" />
    </linearGradient>
    <linearGradient id="tg-light" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#fff3cf" stopOpacity={0.55} /><stop offset="1" stopColor="#fff3cf" stopOpacity={0} />
    </linearGradient>
  </defs>
);

export const Finish: React.FC<{ tex?: number; vig?: boolean }> = ({ tex = 0.16, vig = true }) => (
  <g pointerEvents="none">
    <rect width={1920} height={1080} filter="url(#tg-tex)" opacity={tex} style={{ mixBlendMode: "multiply" }} />
    {vig && <rect width={1920} height={1080} fill="url(#tg-vig)" />}
  </g>
);

// ---------- shared painted pieces ----------
const Tree: React.FC<{ x: number; y: number; s?: number; c?: string[] }> = ({ x, y, s = 1, c = ["#c7672e", "#d98a3a", "#a9502a"] }) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 30 + x) * 1.5;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -12 0 L -8 -150 Q -40 -190 -70 -210 M -8 -150 Q 20 -200 60 -225" stroke="#5a3d28" strokeWidth={18} fill="none" strokeLinecap="round" />
      <g transform={`rotate(${sway})`}>
        <ellipse cx={-60} cy={-230} rx={95} ry={70} fill={c[0]} />
        <ellipse cx={55} cy={-245} rx={100} ry={75} fill={c[2]} />
        <ellipse cx={0} cy={-300} rx={90} ry={65} fill={c[1]} />
        <ellipse cx={-20} cy={-260} rx={60} ry={40} fill="#f0b25a" opacity={0.35} />
      </g>
    </g>
  );
};

const Window: React.FC<{ x: number; y: number; w: number; h: number; view?: "sky" | "dusk" | "autumn"; arch?: boolean; curtains?: string }> = ({ x, y, w, h, view = "sky", arch, curtains }) => (
  <g>
    <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} rx={arch ? w / 2 : 4} fill="#e9dcc2" />
    <rect x={x} y={y} width={w} height={h} rx={arch ? w / 2 - 10 : 0} fill={view === "dusk" ? "url(#tg-sky-dusk)" : "url(#tg-sky)"} />
    {view === "autumn" && <g opacity={0.8}><ellipse cx={x + w * 0.3} cy={y + h * 0.8} rx={w * 0.4} ry={h * 0.18} fill="#d98a3a" /><ellipse cx={x + w * 0.8} cy={y + h * 0.85} rx={w * 0.35} ry={h * 0.15} fill="#b85a2c" /></g>}
    <g stroke="#f4ead6" strokeWidth={8}>
      <line x1={x + w / 2} y1={y + (arch ? w / 3 : 0)} x2={x + w / 2} y2={y + h} />
      {[1, 2, 3].map((i) => <line key={i} x1={x} y1={y + (h * i) / 4} x2={x + w} y2={y + (h * i) / 4} />)}
    </g>
    <rect x={x - 22} y={y + h + 8} width={w + 44} height={18} fill="#d8c8a8" />
    {curtains && (
      <g>
        <path d={`M ${x - 70} ${y - 40} Q ${x - 10} ${y + h * 0.4} ${x - 40} ${y + h + 60} L ${x - 90} ${y + h + 60} L ${x - 90} ${y - 40} Z`} fill={curtains} />
        <path d={`M ${x + w + 70} ${y - 40} Q ${x + w + 10} ${y + h * 0.4} ${x + w + 40} ${y + h + 60} L ${x + w + 90} ${y + h + 60} L ${x + w + 90} ${y - 40} Z`} fill={curtains} />
        <rect x={x - 100} y={y - 56} width={w + 200} height={22} rx={8} fill="#7a5226" />
      </g>
    )}
  </g>
);

const LightBeam: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => {
  const f = useCurrentFrame();
  return <path d={`M ${x} ${y} L ${x + w} ${y} L ${x + w + 420} 1080 L ${x + 260} 1080 Z`} fill="url(#tg-light)" opacity={0.55 + Math.sin(f / 40) * 0.08} />;
};

const Bookshelf: React.FC<{ x: number; y: number; w?: number; h?: number }> = ({ x, y, w = 300, h = 520 }) => {
  const cols = ["#7d2e2a", "#2f4a6b", "#4d6b3a", "#a87a2c", "#5a3a5e", "#8a5a36"];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#5a3a22" />
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <rect x={x + 14} y={y + 20 + r * (h / 4)} width={w - 28} height={h / 4 - 30} fill="#3c2616" />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={x + 20 + i * ((w - 40) / 9)} y={y + 30 + r * (h / 4) + ((i * 7 + r * 3) % 4) * 6} width={(w - 40) / 9 - 4} height={h / 4 - 42 - ((i * 7 + r * 3) % 4) * 6} fill={cols[(i + r * 2) % cols.length]} />
          ))}
          <rect x={x + 8} y={y + r * (h / 4) + h / 4 - 12} width={w - 16} height={12} fill="#6b4529" />
        </g>
      ))}
    </g>
  );
};

const Fireplace: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const f = useCurrentFrame();
  const fl = Math.sin(f / 3) * 6;
  return (
    <g>
      <rect x={x - 170} y={y - 300} width={340} height={300} fill="#e2d4b8" />
      <rect x={x - 190} y={y - 320} width={380} height={30} fill="#cdbb98" />
      <rect x={x - 110} y={y - 220} width={220} height={220} rx={10} fill="#2a1a10" />
      <ellipse cx={x} cy={y - 40} rx={70} ry={55 + fl} fill="#e8822e" opacity={0.9} />
      <ellipse cx={x} cy={y - 30} rx={40} ry={35 - fl * 0.5} fill="#ffd36a" />
      <ellipse cx={x} cy={y - 60} rx={200} ry={140} fill="#ff9a3a" opacity={0.12 + Math.abs(fl) * 0.006} />
    </g>
  );
};

const Frame: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <g>
    <rect x={x - 16} y={y - 16} width={w + 32} height={h + 32} fill="#a7792d" stroke="#6e4c1a" strokeWidth={6} />
    <rect x={x} y={y} width={w} height={h} fill="#5c4a3a" />
    {children}
  </g>
);

// ---------- interiors ----------
type RoomProps = { wall: string; wall2?: string; trim?: string; floor?: string; children?: React.ReactNode; floorY?: number };
const Room: React.FC<RoomProps> = ({ wall, wall2, trim = "#e7dcc4", floorY = 860, children }) => (
  <g>
    <rect width={1920} height={1080} fill={wall} />
    {wall2 && Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 140 + 20} y={0} width={70} height={floorY} fill={wall2} opacity={0.35} />)}
    <rect y={floorY - 230} width={1920} height={230} fill={trim} opacity={0.9} />
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 200 + 30} y={floorY - 200} width={150} height={170} fill="none" stroke="#c9b893" strokeWidth={5} />)}
    <rect y={floorY - 240} width={1920} height={14} fill="#cbb791" />
    {children}
    <rect y={floorY} width={1920} height={1080 - floorY} fill="url(#tg-floor)" />
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={floorY + 16 + i * 18} x2={1920} y2={floorY + 16 + i * 18} stroke="#4e311c" strokeWidth={2} opacity={0.4} />)}
    <rect y={floorY} width={1920} height={12} fill="#3f2715" opacity={0.6} />
  </g>
);

export const Study: React.FC<{ sepia?: boolean }> = ({ sepia }) => (
  <g filter={sepia ? "url(#tg-sepia)" : undefined}>
    {sepia && <filter id="tg-sepia"><feColorMatrix type="matrix" values="0.39 0.77 0.19 0 0  0.35 0.69 0.17 0 0  0.27 0.53 0.13 0 0  0 0 0 1 0" /></filter>}
    <Room wall="#7d8f6c" wall2="#6f8160">
      <Window x={1240} y={170} w={300} h={420} view="autumn" curtains="#8c2f2a" />
      <Bookshelf x={110} y={240} w={330} h={600} />
      <Fireplace x={760} y={860} />
      <Frame x={660} y={150} w={200} h={250}><ellipse cx={760} cy={260} rx={60} ry={80} fill="#c9a27a" /><rect x={700} y={320} width={120} height={80} fill="#3a2d4a" /></Frame>
      <rect x={1600} y={560} width={60} height={240} fill="#5a3a22" /><ellipse cx={1630} cy={555} rx={90} ry={22} fill="#6b4529" />
      <rect x={1612} y={500} width={12} height={50} fill="#f2e6c8" /><ellipse cx={1618} cy={492} rx={8} ry={14} fill="#ffcf5a" />
    </Room>
    <LightBeam x={1240} y={170} w={300} />
  </g>
);

export const Chamber: React.FC = () => (
  <g>
    <Room wall="#d9c9a6" wall2="#cdbb94" trim="#efe4cc" floorY={840}>
      {[200, 760, 1320].map((x) => <Window key={x} x={x} y={120} w={260} h={460} arch view="sky" />)}
      {[160, 620, 1180, 1740].map((x) => (
        <g key={x}><rect x={x} y={90} width={60} height={540} fill="#efe4cc" /><rect x={x - 12} y={80} width={84} height={30} fill="#e2d4b4" /></g>
      ))}
      <rect x={0} y={60} width={1920} height={34} fill="#bfa77c" />
      <path d="M 860 610 L 1060 610 L 1080 700 L 840 700 Z" fill="#6b3f22" />
      <rect x={900} y={520} width={120} height={95} rx={10} fill="#7d2e2a" />
    </Room>
    {[200, 760, 1320].map((x) => <LightBeam key={x} x={x} y={120} w={260} />)}
    {[0, 1].map((r) => (
      <g key={r}>
        <rect x={-20} y={890 + r * 90} width={1960} height={40} fill="#6b4529" />
        <rect x={-20} y={930 + r * 90} width={1960} height={20} fill="#4e311c" />
      </g>
    ))}
  </g>
);

export const EditorOffice: React.FC = () => (
  <g>
    <Room wall="#b9876e" wall2="#a8765e" trim="#e9dcc4">
      {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={(i % 12) * 165 + 80} cy={Math.floor(i / 12) * 130 + 60} r={10} fill="#d8a58a" opacity={0.55} />)}
      <Window x={1300} y={180} w={280} h={380} view="sky" curtains="#2f4a6b" />
      <Bookshelf x={120} y={260} w={300} h={580} />
      <Frame x={700} y={170} w={260} h={190}><text x={830} y={280} textAnchor="middle" fontFamily="Georgia, serif" fontSize={34} fill="#e9dcc2" fontStyle="italic">Godey's</text></Frame>
      {/* gas lamp */}
      <rect x={1030} y={300} width={10} height={140} fill="#6e4c1a" /><ellipse cx={1035} cy={300} rx={34} ry={42} fill="#ffe7a0" opacity={0.85} />
      <ellipse cx={1035} cy={300} rx={160} ry={160} fill="#ffd77a" opacity={0.12} />
    </Room>
    <LightBeam x={1300} y={180} w={280} />
  </g>
);

export const LincolnOffice: React.FC = () => (
  <g>
    <Room wall="#3f5a49" wall2="#36503f" trim="#d8c9a8">
      <Window x={1320} y={170} w={280} h={420} view="dusk" curtains="#6b1f24" />
      <Frame x={300} y={170} w={520} h={330}>
        <path d="M 330 230 Q 450 200 560 240 T 790 260 L 780 460 Q 600 440 480 470 T 330 450 Z" fill="#d9c79a" />
        <path d="M 560 240 L 545 470" stroke="#8a2f2a" strokeWidth={6} strokeDasharray="14 8" />
      </Frame>
      {/* flags */}
      <g transform="translate(1000 300)">
        <rect x={0} y={0} width={10} height={560} fill="#6e4c1a" />
        <path d="M 10 10 L 190 20 L 190 140 L 10 130 Z" fill="#f2ead8" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M 10 ${10 + i * 21} L 190 ${20 + i * 21} L 190 ${30 + i * 21} L 10 ${20 + i * 21} Z`} fill="#b3322f" />)}
        <path d="M 10 10 L 90 14 L 90 74 L 10 70 Z" fill="#2c3e6b" />
      </g>
    </Room>
    <LightBeam x={1320} y={170} w={280} />
  </g>
);

export const Prison: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect width={1920} height={1080} fill="#6e6a62" />
      {Array.from({ length: 13 }, (_, r) => Array.from({ length: 11 }, (_, c) => (
        <rect key={`${r}-${c}`} x={c * 190 - (r % 2) * 95} y={r * 72} width={182} height={64} rx={8} fill={(r * 7 + c * 3) % 5 === 0 ? "#7c776e" : "#736e65"} stroke="#55514a" strokeWidth={4} />
      )))}
      <rect x={1180} y={150} width={300} height={240} fill="#2a2724" />
      <rect x={1180} y={150} width={300} height={240} fill="url(#tg-sky)" opacity={0.85} />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={1200 + i * 60} y={150} width={14} height={240} fill="#2a2724" />)}
      <path d={`M 1180 390 L 1480 390 L 1700 1080 L 1000 1080 Z`} fill="url(#tg-light)" opacity={0.5 + Math.sin(f / 35) * 0.06} />
      {/* iron door */}
      <rect x={200} y={300} width={360} height={600} rx={10} fill="#3d3a36" stroke="#26231f" strokeWidth={10} />
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={230 + (i % 2) * 300} cy={340 + Math.floor(i / 2) * 250} r={10} fill="#8a8478" />)}
      <rect x={320} y={380} width={120} height={90} fill="#1b1916" />{[0, 1, 2].map((i) => <rect key={i} x={340 + i * 35} y={380} width={10} height={90} fill="#5a5650" />)}
      <rect y={880} width={1920} height={200} fill="#5a544a" />
      {Array.from({ length: 40 }, (_, i) => <line key={i} x1={(i * 53) % 1920} y1={900 + (i * 17) % 160} x2={(i * 53) % 1920 + 40} y2={890 + (i * 17) % 160} stroke="#c9a85a" strokeWidth={4} opacity={0.7} />)}
    </g>
  );
};

// ---------- exteriors ----------
const Sky: React.FC<{ dusk?: boolean }> = ({ dusk }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect width={1920} height={1080} fill={dusk ? "url(#tg-sky-dusk)" : "url(#tg-sky)"} />
      {[[260, 150, 1], [900, 110, 0.8], [1540, 190, 0.9]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x + f * 0.12 * (i + 1)} ${y}) scale(${s})`} filter="url(#tg-soft)" opacity={0.9}>
          <ellipse rx={140} ry={44} fill="#fff" /><ellipse cx={-80} cy={14} rx={90} ry={34} fill="#fff" /><ellipse cx={90} cy={12} rx={100} ry={36} fill="#fff" /><ellipse cx={10} cy={-30} rx={80} ry={44} fill="#fff" />
        </g>
      ))}
    </g>
  );
};

const Townhouse: React.FC<{ x: number; w: number; h: number; c: string; base?: number }> = ({ x, w, h, c, base = 860 }) => (
  <g>
    <rect x={x} y={base - h} width={w} height={h} fill={c} />
    <path d={`M ${x - 10} ${base - h} L ${x + w / 2} ${base - h - 70} L ${x + w + 10} ${base - h} Z`} fill="#4e3b33" />
    {Array.from({ length: Math.floor(h / 120) * 2 }, (_, i) => (
      <rect key={i} x={x + 30 + (i % 2) * (w - 110)} y={base - h + 40 + Math.floor(i / 2) * 120} width={50} height={75} fill="#f3e5c0" stroke="#e9dcc2" strokeWidth={6} />
    ))}
    <rect x={x + w / 2 - 30} y={base - 120} width={60} height={120} fill="#3a2a22" />
  </g>
);

const Street: React.FC<{ y?: number }> = ({ y = 860 }) => (
  <g>
    <rect y={y} width={1920} height={1080 - y} fill="#9c8a72" />
    {Array.from({ length: 6 }, (_, r) => Array.from({ length: 26 }, (_, c) => (
      <ellipse key={`${r}-${c}`} cx={c * 78 + (r % 2) * 39} cy={y + 24 + r * 38} rx={34} ry={14} fill={(r + c) % 3 ? "#8b7963" : "#a6937a"} />
    )))}
  </g>
);

export const FederalHall: React.FC = () => (
  <g>
    <Sky />
    <Townhouse x={-20} w={300} h={420} c="#a4553d" />
    <Townhouse x={1640} w={320} h={460} c="#9b4c38" />
    <Tree x={360} y={860} s={0.9} />
    <Tree x={1560} y={860} s={0.85} />
    {/* Federal Hall: 1789 neoclassical front with pediment, columns and balcony */}
    <g>
      <rect x={480} y={250} width={960} height={610} fill="#e7dcc6" />
      <rect x={480} y={250} width={960} height={610} fill="#d8c9a8" opacity={0.25} />
      <path d="M 560 330 L 960 130 L 1360 330 Z" fill="#efe6d2" stroke="#c9b893" strokeWidth={10} />
      <circle cx={960} cy={255} r={45} fill="#d8c9a8" />
      <rect x={540} y={330} width={840} height={36} fill="#d2c3a2" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={600 + i * 220} y={366} width={56} height={330} fill="#f4ecdc" />
          <rect x={590 + i * 220} y={366} width={76} height={20} fill="#ddd0b2" />
          <rect x={608 + i * 220} y={366} width={10} height={330} fill="#d8cbb0" />
        </g>
      ))}
      <rect x={540} y={690} width={840} height={26} fill="#cbb995" />
      <path d="M 640 690 L 1280 690 L 1280 650 L 640 650 Z" fill="none" stroke="#5a4a3a" strokeWidth={5} />
      {Array.from({ length: 16 }, (_, i) => <line key={i} x1={650 + i * 40} y1={652} x2={650 + i * 40} y2={688} stroke="#5a4a3a" strokeWidth={4} />)}
      {[0, 1, 2].map((i) => <rect key={i} x={690 + i * 220} y={500} width={90} height={150} rx={40} fill="#3a2f2a" />)}
      {[0, 1, 2].map((i) => <rect key={i} x={680 + i * 220} y={740} width={110} height={120} fill="#4b3b30" />)}
      {[0, 1, 2, 3].map((i) => <rect key={i} x={500 - i * 14} y={860 + i * 14} width={920 + i * 28} height={14} fill="#c9b995" />)}
    </g>
    <Street y={900} />
  </g>
);

export const Chapel: React.FC = () => (
  <g>
    <Sky />
    <Tree x={260} y={880} s={1.1} />
    <Tree x={1690} y={880} s={1.05} c={["#b85a2c", "#d98a3a", "#8f3f22"]} />
    {/* St. Paul's Chapel: brownstone body, white tiered steeple */}
    <g>
      <rect x={620} y={430} width={680} height={450} fill="#8f6a52" />
      <path d="M 600 440 L 960 300 L 1320 440 Z" fill="#7a5644" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={680 + i * 160} y={520} width={70} height={190} rx={34} fill="#3c2f2a" stroke="#efe6d2" strokeWidth={8} />)}
      <rect x={890} y={720} width={140} height={160} rx={10} fill="#3a2a22" stroke="#efe6d2" strokeWidth={8} />
      <rect x={880} y={150} width={160} height={290} fill="#efe6d2" />
      <rect x={900} y={60} width={120} height={100} fill="#f4ecdc" />
      <circle cx={960} cy={260} r={42} fill="#2b2118" opacity={0.85} /><circle cx={960} cy={260} r={34} fill="#f4ecdc" />
      <line x1={960} y1={260} x2={960} y2={236} stroke={INK} strokeWidth={5} /><line x1={960} y1={260} x2={976} y2={268} stroke={INK} strokeWidth={5} />
      <path d="M 910 60 L 960 -60 L 1010 60 Z" fill="#e7dcc6" />
      {[0, 1, 2].map((i) => <rect key={i} x={905 + i * 40} y={80} width={20} height={60} rx={10} fill="#5a4a3a" />)}
    </g>
    <rect y={880} width={1920} height={200} fill="#7d9a5b" />
    <rect y={880} width={1920} height={30} fill="#6b8a4c" />
    {Array.from({ length: 30 }, (_, i) => <rect key={i} x={i * 66} y={850} width={8} height={70} fill={INK} opacity={0.8} />)}
    <rect y={862} width={1920} height={6} fill={INK} opacity={0.8} />
  </g>
);

export const Hills: React.FC = () => (
  <g>
    <Sky dusk />
    <path d="M 0 640 Q 300 520 640 600 T 1300 560 T 1920 600 L 1920 1080 L 0 1080 Z" fill="#8f7a6a" opacity={0.7} filter="url(#tg-soft)" />
    <path d="M 0 720 Q 420 600 820 700 T 1920 680 L 1920 1080 L 0 1080 Z" fill="#6f7d4a" />
    <path d="M 0 860 Q 600 780 1100 850 T 1920 840 L 1920 1080 L 0 1080 Z" fill="#5e6e3c" />
    <Tree x={220} y={780} s={0.7} c={["#7d6a2a", "#a5822e", "#6b4a22"]} />
    {/* log cabin */}
    <g transform="translate(1340 560)">
      <rect x={0} y={60} width={320} height={190} fill="#7a5134" />
      {Array.from({ length: 7 }, (_, i) => <line key={i} x1={0} y1={80 + i * 26} x2={320} y2={80 + i * 26} stroke="#5a3a22" strokeWidth={6} />)}
      <path d="M -20 70 L 160 -40 L 340 70 Z" fill="#4e3b2a" />
      <rect x={130} y={150} width={60} height={100} fill="#2e2016" /><rect x={40} y={110} width={60} height={50} fill="#f0c56a" />
      <rect x={250} y={-10} width={36} height={70} fill="#6e6a62" />
    </g>
  </g>
);

export const Village: React.FC = () => (
  <g>
    <Sky />
    <path d="M 0 620 Q 400 520 900 600 T 1920 560 L 1920 1080 L 0 1080 Z" fill="#9aa37a" opacity={0.75} filter="url(#tg-soft)" />
    <path d="M 0 760 Q 500 680 1000 750 T 1920 720 L 1920 1080 L 0 1080 Z" fill="#7f9152" />
    {/* white church */}
    <g transform="translate(300 470)">
      <rect x={0} y={120} width={260} height={200} fill="#f4ecdc" />
      <path d="M -10 130 L 130 40 L 270 130 Z" fill="#7d4a3a" />
      <rect x={95} y={-60} width={70} height={190} fill="#f4ecdc" />
      <path d="M 90 -60 L 130 -170 L 170 -60 Z" fill="#7d4a3a" />
      <rect x={110} y={200} width={40} height={120} fill="#4b3b30" />
    </g>
    {/* red barn */}
    <g transform="translate(1320 520)">
      <rect x={0} y={80} width={340} height={230} fill="#a13a2c" />
      <path d="M -20 90 L 80 0 L 260 0 L 360 90 Z" fill="#5a3a2a" />
      <rect x={120} y={170} width={100} height={140} fill="#f4ecdc" /><path d="M 120 170 L 220 310 M 220 170 L 120 310" stroke="#a13a2c" strokeWidth={10} />
    </g>
    <Tree x={820} y={800} s={1} />
    <Tree x={1120} y={810} s={0.8} c={["#d4a03a", "#e8b84a", "#b87a2a"]} />
    <rect y={880} width={1920} height={200} fill="#6f8248" />
    {Array.from({ length: 28 }, (_, i) => <rect key={i} x={i * 70 + 10} y={845} width={14} height={60} fill="#f4ecdc" stroke="#cbbf9f" strokeWidth={2} />)}
    <rect y={862} width={1920} height={10} fill="#f4ecdc" />
  </g>
);

/** Quill's studio: warm stage with a curtain, a framed turkey portrait and the scoreboard wall. */
/** Quill's studio. `v` (0-3) varies wall colour, curtain colour and the wall prop so host beats don't look identical. */
const STUDIO_V = [
  { wall: "#2f4a3c", stripe: "#29423a", cur: "#7d2228", curD: "#5e171c" },
  { wall: "#3a3355", stripe: "#332d4b", cur: "#a0682a", curD: "#7a4e1e" },
  { wall: "#5a3a2a", stripe: "#4f3324", cur: "#2f5a4a", curD: "#22453a" },
  { wall: "#264a5e", stripe: "#214152", cur: "#8a2a3a", curD: "#6a1f2c" },
];
export const Studio: React.FC<{ v?: number; art?: "turkey" | "whitehouse" }> = ({ v = 0, art = "turkey" }) => {
  const f = useCurrentFrame();
  const C = STUDIO_V[((v % 4) + 4) % 4];
  return (
    <g>
      <rect width={1920} height={1080} fill={C.wall} />
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={i * 130} y={0} width={60} height={900} fill={C.stripe} />)}
      <radialGradient id="tg-spot" cx="50%" cy="45%" r="45%"><stop offset="0" stopColor="#ffe7b0" stopOpacity={0.55} /><stop offset="1" stopColor="#ffe7b0" stopOpacity={0} /></radialGradient>
      <ellipse cx={960} cy={520} rx={760} ry={560} fill="url(#tg-spot)" opacity={0.85 + Math.sin(f / 50) * 0.05} />
      {/* curtains */}
      <path d="M 0 0 L 300 0 Q 220 400 280 900 L 0 900 Z" fill={C.cur} /><path d="M 0 0 L 300 0 Q 220 400 280 900" fill="none" stroke={C.curD} strokeWidth={18} />
      <path d="M 1920 0 L 1620 0 Q 1700 400 1640 900 L 1920 900 Z" fill={C.cur} /><path d="M 1620 0 Q 1700 400 1640 900" fill="none" stroke={C.curD} strokeWidth={18} />
      <rect width={1920} height={60} fill={C.curD} />
      {v % 2 === 1 && <g>{/* small globe + books on a side shelf */}
        <rect x={360} y={560} width={260} height={18} fill="#6b4529" /><circle cx={420} cy={515} r={42} fill="#3f7fb0" stroke="#1d1712" strokeWidth={5} /><path d="M 395 490 q 25 20 0 50 M 440 480 q -15 30 10 60" stroke="#6fa04a" strokeWidth={8} fill="none" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={480 + i * 30} y={470} width={24} height={90} fill={["#8a2a2a", "#2f4a6b", "#4d6b3a", "#a87a2c"][i]} stroke="#1d1712" strokeWidth={3} />)}
      </g>}
      {/* framed turkey portrait (running gag) */}
      <g transform={v >= 2 ? "translate(-940 0)" : undefined}>{art === "whitehouse" ? <Frame x={1270} y={190} w={260} h={200}>
        <rect x={1270} y={190} width={260} height={200} fill="#8fc3e0" /><rect x={1270} y={330} width={260} height={60} fill="#5f9a3e" />
        <rect x={1310} y={270} width={180} height={70} fill="#f4f1ea" stroke="#1d1712" strokeWidth={3} /><path d="M 1360 270 l 40 -26 l 40 26 z" fill="#f4f1ea" stroke="#1d1712" strokeWidth={3} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={1366 + i * 16} y={280} width={6} height={56} fill="#d8d2c4" />)}
        <line x1={1400} y1={244} x2={1400} y2={214} stroke="#1d1712" strokeWidth={3} /><rect x={1400} y={214} width={18} height={11} fill="#c43a2a" />
      </Frame> : <Frame x={1300} y={170} w={200} h={240}>
        <ellipse cx={1400} cy={330} rx={60} ry={55} fill="#7a4a2a" /><circle cx={1400} cy={255} r={26} fill="#b8b2a8" />
        <path d="M 1396 262 q 6 22 -2 34" stroke="#c43a2a" strokeWidth={8} fill="none" /><path d="M 1408 252 l 18 4 l -18 6 z" fill="#e0a43a" />
        {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={1340 + i * 30} cy={290} rx={16} ry={44} fill={["#8a3a22", "#c46a2a", "#e0a43a", "#c46a2a", "#8a3a22"][i]} transform={`rotate(${(i - 2) * 18} ${1340 + i * 30} 330)`} />)}
      </Frame>}</g>
      <rect y={880} width={1920} height={200} fill="#5a3a22" />
      <rect y={880} width={1920} height={14} fill="#3f2715" />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={0} y1={900 + i * 18} x2={1920} y2={900 + i * 18} stroke="#4e311c" strokeWidth={2} opacity={0.5} />)}
    </g>
  );
};

/** Flat infographic plate (house: solid blue with subtle vignette). */
export const PlateBg: React.FC<{ color?: string }> = ({ color = "#1e90ff" }) => (
  <g>
    <rect width={1920} height={1080} fill={color} />
    <radialGradient id={`tg-pv-${color.slice(1)}`} cx="50%" cy="50%" r="70%"><stop offset="0.6" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.3} /></radialGradient>
    <rect width={1920} height={1080} fill={`url(#tg-pv-${color.slice(1)})`} />
  </g>
);
