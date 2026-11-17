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
