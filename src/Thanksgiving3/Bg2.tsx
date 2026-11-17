import React from "react";
import { useCurrentFrame } from "remotion";

/** Extra painted sets (soft, textured, motivated light), used with Defs/Finish from ../Thanksgiving/Backgrounds. */
const INK = "#2b2118";

const Clouds: React.FC<{ speed?: number; y?: number }> = ({ speed = 0.15, y = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {[[220, 150, 1], [860, 110, 0.85], [1480, 190, 0.95], [1980, 120, 0.8]].map(([x, cy, s], i) => {
        const xx = ((x + f * speed * (1 + i * 0.3)) % 2400) - 240;
        return (
          <g key={i} transform={`translate(${xx} ${cy + y}) scale(${s})`} filter="url(#tg-soft)" opacity={0.92}>
            <ellipse rx={150} ry={46} fill="#fff" /><ellipse cx={-85} cy={14} rx={95} ry={36} fill="#fff" />
            <ellipse cx={95} cy={12} rx={105} ry={38} fill="#fff" /><ellipse cx={10} cy={-32} rx={85} ry={48} fill="#fff" />
          </g>
        );
      })}
    </g>
  );
};

/** White House north lawn: bright saturated grass, painted mansion, trees, flag (reference sets). */
export const WhiteHouseLawn: React.FC<{ dusk?: boolean }> = ({ dusk }) => {
  const f = useCurrentFrame();
  const wave = Math.sin(f / 6) * 6;
  return (
    <g>
      <rect width={1920} height={1080} fill={dusk ? "url(#tg-sky-dusk)" : "url(#tg-sky)"} />
      <Clouds />
      {/* tree line, soft */}
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx={i * 175 + 40} cy={560 + (i % 3) * 14} rx={130} ry={95} fill={i % 2 ? "#5f8a4a" : "#6e9a55"} filter="url(#tg-soft)" />
      ))}
      {/* mansion */}
      <g>
        <rect x={420} y={330} width={1080} height={300} fill="#f3efe6" />
        <rect x={420} y={330} width={1080} height={22} fill="#e2ddd0" />
        {Array.from({ length: 14 }, (_, i) => (
          <g key={i}><rect x={455 + i * 74} y={380} width={40} height={64} fill="#5d6b78" stroke="#d8d2c4" strokeWidth={6} />
            <rect x={455 + i * 74} y={500} width={40} height={70} fill="#5d6b78" stroke="#d8d2c4" strokeWidth={6} /></g>
        ))}
        {/* north portico */}
        <path d="M 760 330 L 960 230 L 1160 330 Z" fill="#f7f4ec" stroke="#d6cfbf" strokeWidth={8} />
        <rect x={760} y={330} width={400} height={300} fill="#f7f4ec" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={785 + i * 100} y={345} width={36} height={280} fill="#fffdf8" stroke="#ddd6c8" strokeWidth={4} />)}
        <rect x={925} y={520} width={70} height={110} fill="#4b3d33" />
        <rect x={420} y={622} width={1080} height={14} fill="#d8d2c4" />
        {/* flag */}
        <rect x={956} y={150} width={6} height={90} fill="#6b6b6b" />
        <path d={`M 962 152 q 30 ${wave * 0.5} 60 0 l 0 36 q -30 ${-wave * 0.5} -60 0 Z`} fill="#c0392b" />
        <path d={`M 962 152 l 26 0 l 0 18 l -26 0 Z`} fill="#2c3e6b" />
      </g>
      {/* lawn */}
      <path d="M 0 640 Q 960 600 1920 640 L 1920 1080 L 0 1080 Z" fill="#5fa14a" />
      <path d="M 0 700 Q 960 660 1920 700 L 1920 1080 L 0 1080 Z" fill="#6cb253" />
      {Array.from({ length: 70 }, (_, i) => (
        <path key={i} d={`M ${(i * 131) % 1920} ${760 + ((i * 53) % 300)} l 6 -16 l 6 16`} stroke="#4f8d3c" strokeWidth={3} fill="none" opacity={0.7} />
      ))}
      {/* driveway */}
      <path d="M 860 1080 Q 900 820 930 640 L 990 640 Q 1020 820 1060 1080 Z" fill="#d9cfb8" opacity={0.85} />
    </g>
  );
};

/** Open sky with fast-scrolling clouds (flight scenes). */
export const SkyScroll: React.FC<{ speed?: number }> = ({ speed = 9 }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#tg-sky)" />
    <Clouds speed={speed} />
    <Clouds speed={speed * 1.4} y={620} />
  </g>
);

/** Oval-Office-style warm office for Coolidge (gold drapes, windows, desk) — reference staple. */
export const OvalOffice: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#efe1b8" />
    {[200, 720, 1240].map((x) => (
      <g key={x}>
        <rect x={x} y={150} width={420} height={520} fill="#cfe2ea" />
        {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={x + 60 + i * 60} cy={560 + (i % 2) * 30} rx={40} ry={90} fill="#b9c9ce" opacity={0.7} />)}
        <g stroke="#e9dfc4" strokeWidth={10}><line x1={x + 210} y1={150} x2={x + 210} y2={670} />{[1, 2, 3].map((i) => <line key={i} x1={x} x2={x + 420} y1={150 + i * 130} y2={150 + i * 130} />)}</g>
        <path d={`M ${x - 50} 110 Q ${x + 30} 400 ${x - 10} 720 L ${x - 90} 720 L ${x - 90} 110 Z`} fill="#d9a43a" />
        <path d={`M ${x + 470} 110 Q ${x + 390} 400 ${x + 430} 720 L ${x + 510} 720 L ${x + 510} 110 Z`} fill="#d9a43a" />
      </g>
    ))}
    <rect y={96} width={1920} height={30} fill="#b8862a" />
    <rect y={760} width={1920} height={320} fill="#2f4a6b" />
    <ellipse cx={960} cy={900} rx={520} ry={120} fill="#3a5a80" stroke="#c9a54a" strokeWidth={8} />
    <rect y={752} width={1920} height={12} fill={INK} opacity={0.4} />
  </g>
);

/** State Dining Room: cream panelling, chandelier glow, long table (dinner scenes). */
export const DiningRoom: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#efe6cf" />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={i * 220 + 40} y={150} width={150} height={420} fill="none" stroke="#d9c9a4" strokeWidth={8} />)}
    <rect y={110} width={1920} height={26} fill="#c9ab6a" />
    <radialGradient id="tg-chand"><stop offset="0" stopColor="#fff3c4" stopOpacity={0.8} /><stop offset="1" stopColor="#fff3c4" stopOpacity={0} /></radialGradient>
    <ellipse cx={960} cy={200} rx={420} ry={240} fill="url(#tg-chand)" />
    <line x1={960} y1={0} x2={960} y2={120} stroke="#8a6a2a" strokeWidth={6} />
    <ellipse cx={960} cy={150} rx={110} ry={36} fill="#d9b44a" stroke="#6e4c1a" strokeWidth={6} />
    {[-80, -40, 0, 40, 80].map((d) => <ellipse key={d} cx={960 + d} cy={118} rx={8} ry={14} fill="#fff1b0" />)}
    <rect y={760} width={1920} height={320} fill="#7a1f24" />
    <rect y={752} width={1920} height={12} fill="#4a1215" />
    <rect x={260} y={700} width={1400} height={70} rx={10} fill="#f8f4ea" stroke="#c9bfa6" strokeWidth={6} />
    <rect x={260} y={762} width={1400} height={110} fill="#efe8d8" />
    {[440, 760, 1160, 1480].map((x) => <g key={x}><ellipse cx={x} cy={712} rx={70} ry={16} fill="#fff" stroke="#bdb39b" strokeWidth={4} /><rect x={x - 6} y={640} width={12} height={60} fill="#d9b44a" /><ellipse cx={x} cy={634} rx={8} ry={14} fill="#ffcf5a" /></g>)}
  </g>
);

/** Railway carriage interior with scrolling countryside in the windows. */
export const TrainCar: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect width={1920} height={1080} fill="#6b4a32" />
      {[160, 760, 1360].map((x) => (
        <g key={x}>
          <rect x={x} y={180} width={420} height={330} rx={30} fill="url(#tg-sky)" />
          <g clipPath={`inset(0)`}>
            {Array.from({ length: 4 }, (_, i) => <ellipse key={i} cx={x + ((i * 160 + f * 14) % 560) - 70} cy={470} rx={90} ry={60} fill="#6e9a55" />)}
          </g>
          <rect x={x} y={180} width={420} height={330} rx={30} fill="none" stroke="#3f2715" strokeWidth={18} />
        </g>
      ))}
      <rect y={560} width={1920} height={30} fill="#3f2715" />
      <rect y={760} width={1920} height={320} fill="#4a3424" />
    </g>
  );
};

/** City avenue with cars (Pennsylvania Avenue traffic). */
export const Avenue: React.FC<{ stop?: boolean }> = ({ stop }) => {
  const f = useCurrentFrame();
  const car = (x: number, c: string) => (
    <g transform={`translate(${x} 900)`}>
      <rect x={-120} y={-80} width={240} height={70} rx={14} fill={c} stroke="#1d1712" strokeWidth={6} />
      <rect x={-80} y={-130} width={150} height={56} rx={12} fill={c} stroke="#1d1712" strokeWidth={6} />
      <rect x={-60} y={-120} width={50} height={36} fill="#cfe2ea" /><rect x={0} y={-120} width={55} height={36} fill="#cfe2ea" />
      {[-70, 70].map((w) => <circle key={w} cx={w} cy={-8} r={28} fill="#222" stroke="#1d1712" strokeWidth={6} />)}
    </g>
  );
  const shift = stop ? 0 : (f * 6) % 700;
  return (
    <g>
      <rect width={1920} height={1080} fill="url(#tg-sky)" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 250 - 20} y={300 - (i % 3) * 60} width={230} height={500} fill={["#b7a68a", "#a4553d", "#d8cdb6"][i % 3]} />)}
      {Array.from({ length: 8 }, (_, i) => Array.from({ length: 4 }, (_, j) => <rect key={`${i}${j}`} x={i * 250 + 20} y={360 - (i % 3) * 60 + j * 100} width={50} height={60} fill="#f3e5c0" />))}
      <rect y={800} width={1920} height={280} fill="#5f5a55" />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 220} y={930} width={120} height={12} fill="#f2e6c8" />)}
      {car(200 + shift, "#2f4a6b")}{car(-500 + shift, "#7d2228")}{car(1600 - (stop ? 0 : shift), "#3f5a49")}
    </g>
  );
};

/** California ranch from above-ish: hills, ranch house, a plane towing a banner. */
export const RanchBanner: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const px = 2100 - f * 9;
  return (
    <g>
      <rect width={1920} height={1080} fill="url(#tg-sky)" />
      <path d="M 0 700 Q 500 560 1000 660 T 1920 620 L 1920 1080 L 0 1080 Z" fill="#a7a35a" />
      <path d="M 0 820 Q 600 740 1200 800 T 1920 790 L 1920 1080 L 0 1080 Z" fill="#8f8a46" />
      <g transform="translate(1200 760)"><rect x={0} y={0} width={260} height={110} fill="#f1e6cf" stroke="#1d1712" strokeWidth={6} /><path d="M -20 0 L 130 -70 L 280 0 Z" fill="#8a3a2a" stroke="#1d1712" strokeWidth={6} /></g>
      <g transform={`translate(${px} 230)`}>
        <path d="M 0 0 L 90 -20 L 120 0 L 90 20 Z" fill="#e8e8e8" stroke="#1d1712" strokeWidth={5} />
        <rect x={20} y={-50} width={20} height={100} fill="#c0392b" stroke="#1d1712" strokeWidth={4} />
        <line x1={120} y1={0} x2={200} y2={0} stroke="#1d1712" strokeWidth={3} />
        <rect x={200} y={-38} width={text.length * 30 + 40} height={76} fill="#fbf6ea" stroke="#1d1712" strokeWidth={5} />
        <text x={220} y={14} fontFamily="Montserrat" fontWeight={800} fontSize={40} fill="#c0392b">{text}</text>
      </g>
    </g>
  );
};
