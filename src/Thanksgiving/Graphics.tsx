import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MONTSERRAT, OSWALD } from "../fonts";

/** Motion-graphics pieces drawn in the house style (ink outline, flat fill + one shade). */
const INK = "#1d1712";
const SERIF = "Georgia, 'Times New Roman', serif";

export const usePop = (at = 0, damping = 10) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return f < at ? 0 : spring({ frame: f - at, fps, config: { damping, stiffness: 200 } });
};

/** Prop PNG from the shared props folder, popping in. */
export const PropImg: React.FC<{ name: string; x: number; y: number; w: number; at?: number; rot?: number; bob?: boolean }> = ({ name, x, y, w, at = 0, rot = 0, bob }) => {
  const f = useCurrentFrame(); const s = usePop(at);
  const dims: Record<string, [number, number]> = { Beer_Tankard: [231, 207], Bread_Basket: [281, 195], Sealed_Letter: [247, 157], Quill_and_Inkpot: [225, 252] };
  const [pw, ph] = dims[name]; const h = (w * ph) / pw;
  return (
    <g transform={`translate(${x} ${y + (bob ? Math.sin(f / 9) * 6 : 0)}) rotate(${rot}) scale(${s})`}>
      <image href={staticFile(`thanksgiving/props/${name}.png`)} x={-w / 2} y={-h / 2} width={w} height={h} />
    </g>
  );
};

/** Character pose cutout (finished drawing) with idle breathing and pop-in. */
export const Pose: React.FC<{ char: string; file: string; x: number; y: number; h: number; at?: number; flip?: boolean; slideFrom?: number; dims: [number, number] }> = ({ char, file, x, y, h, at = 0, flip, slideFrom, dims }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = f < at ? 0 : spring({ frame: f - at, fps, config: { damping: 14, stiffness: 180 } });
  const w = (h * dims[0]) / dims[1];
  const dx = slideFrom !== undefined ? interpolate(s, [0, 1], [slideFrom, 0]) : 0;
  const pop = slideFrom !== undefined ? 1 : interpolate(s, [0, 1], [0.85, 1]);
  const breathe = 1 + Math.sin(f / 18) * 0.008;
  if (f < at) return null;
  return (
    <g transform={`translate(${x + dx} ${y}) scale(${(flip ? -1 : 1) * pop} ${pop * breathe})`} opacity={Math.min(1, s * 3)}>
      <image href={staticFile(`thanksgiving/${char}/${file}.png`)} x={-w / 2} y={-h} width={w} height={h} />
    </g>
  );
};

/** Parchment proclamation that unrolls; lines of "handwriting" draw in. */
export const Proclamation: React.FC<{ x: number; y: number; w?: number; title?: string; at?: number; year?: string; lines?: string[] }> = ({ x, y, w = 560, title = "PROCLAMATION", at = 0, year, lines }) => {
  const f = useCurrentFrame();
  const open = interpolate(f, [at, at + 14], [0.05, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const h = 680 * open;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#f3e3bd" stroke={INK} strokeWidth={8} />
      <rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={Math.max(0, h - 28)} fill="none" stroke="#c9a86a" strokeWidth={3} />
      {[-1, 1].map((s) => <rect key={s} x={-w / 2 - 20} y={s * h / 2 - 22} width={w + 40} height={44} rx={22} fill="#e2c890" stroke={INK} strokeWidth={8} />)}
      {open > 0.95 && (
        <g>
          <text x={0} y={-220} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={Math.min(50, (w - 80) / (title.length * 0.62))} fill="#3a2414" letterSpacing={3}>{title}</text>
          {year && <text x={0} y={-160} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={36} fill="#5a3a22">{year}</text>}
          {(lines ?? Array(8).fill("")).map((l, i) => {
            const p = interpolate(f, [at + 14 + i * 4, at + 26 + i * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return l ? (
              <text key={i} x={0} y={-90 + i * 52} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={34} fill="#3a2414" opacity={p}>{l}</text>
            ) : (
              <path key={i} d={`M ${-w / 2 + 70} ${-100 + i * 44} q 40 -10 80 0 t 80 0 t 80 0 t 80 0 t 80 0`} fill="none" stroke="#6b4a2a" strokeWidth={5} strokeDasharray={420} strokeDashoffset={420 * (1 - p)} strokeLinecap="round" />
            );
          })}
          <circle cx={w / 2 - 90} cy={250} r={44 * Math.min(1, interpolate(f, [at + 40, at + 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))} fill="#b3262a" stroke={INK} strokeWidth={6} />
        </g>
      )}
    </g>
  );
};

/** "We the People" constitution sheet with a sparkle. */
export const Constitution: React.FC<{ x: number; y: number; at?: number }> = ({ x, y, at = 0 }) => {
  const f = useCurrentFrame(); const s = usePop(at, 9);
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${-4 + Math.sin(f / 20) * 1.5})`}>
      <rect x={-260} y={-340} width={520} height={680} fill="#efdcae" stroke={INK} strokeWidth={8} />
      <text x={0} y={-220} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontWeight={700} fontSize={76} fill="#2a1a10">We the People</text>
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M -200 ${-130 + i * 48} q 40 -8 80 0 t 80 0 t 80 0 t 80 0 t 80 0`} fill="none" stroke="#7a5a3a" strokeWidth={4} />)}
      {[0, 1, 2, 3].map((i) => {
        const a = (f / 8 + i * 1.6) % 6.28;
        return <path key={i} d="M 0 -26 L 7 -7 L 26 0 L 7 7 L 0 26 L -7 7 L -26 0 L -7 -7 Z" fill="#ffd34a" stroke={INK} strokeWidth={4} transform={`translate(${[-280, 270, 250, -250][i]} ${[-300, -260, 280, 300][i]}) scale(${0.6 + Math.abs(Math.sin(a)) * 0.6})`} />;
      })}
    </g>
  );
};

/** Tear-off calendar page. */
export const CalendarPage: React.FC<{ x: number; y: number; month: string; day: string; w?: number; rot?: number; sub?: string }> = ({ x, y, month, day, w = 260, rot = 0, sub }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2} y={-w * 0.62} width={w} height={w * 1.18} rx={14} fill="#fbf6ea" stroke={INK} strokeWidth={7} />
    <rect x={-w / 2} y={-w * 0.62} width={w} height={w * 0.3} rx={14} fill="#c0392b" stroke={INK} strokeWidth={7} />
    <text x={0} y={-w * 0.4} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={w * 0.14} fill="#fff">{month}</text>
    <text x={0} y={w * 0.28} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={w * 0.45} fill={INK}>{day}</text>
    {sub && <text x={0} y={w * 0.48} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={w * 0.09} fill="#7a6a5a">{sub}</text>}
  </g>
);

/** A book / magazine cover. */
export const Book: React.FC<{ x: number; y: number; title: string[]; color: string; at?: number; w?: number; art?: "feast" | "lamb" | "lady" }> = ({ x, y, title, color, at = 0, w = 380, art }) => {
  const f = useCurrentFrame(); const s = usePop(at, 9);
  const h = w * 1.35;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(f / 25) * 2})`}>
      <rect x={-w / 2 + 16} y={-h / 2 + 14} width={w} height={h} rx={8} fill="#000" opacity={0.25} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill={color} stroke={INK} strokeWidth={8} />
      <rect x={-w / 2} y={-h / 2} width={30} height={h} fill="#000" opacity={0.2} />
      <rect x={-w / 2 + 50} y={-h / 2 + 40} width={w - 90} height={h - 80} fill="none" stroke="#e8c76a" strokeWidth={4} />
      {title.map((t, i) => <text key={i} x={15} y={-h / 2 + 120 + i * 56} textAnchor="middle" fontFamily={SERIF} fontWeight={700} fontSize={i === 0 && title.length > 1 ? 38 : 48} fill="#f3e3bd">{t}</text>)}
      {art === "lamb" && (
        <g transform={`translate(15 ${h / 2 - 170})`}>
          <ellipse cx={0} cy={0} rx={90} ry={60} fill="#fbf6ea" stroke={INK} strokeWidth={6} />
          {[-60, -20, 20, 60].map((cx) => <circle key={cx} cx={cx} cy={-45} r={26} fill="#fbf6ea" stroke={INK} strokeWidth={5} />)}
          <ellipse cx={95} cy={-10} rx={34} ry={28} fill="#3a2f2a" /><circle cx={104} cy={-16} r={5} fill="#fff" />
          {[-50, -15, 25, 55].map((lx) => <rect key={lx} x={lx} y={50} width={12} height={46} fill={INK} />)}
        </g>
      )}
      {art === "feast" && (
        <g transform={`translate(15 ${h / 2 - 160})`}>
          <ellipse cx={0} cy={40} rx={140} ry={26} fill="#e9dcc2" stroke={INK} strokeWidth={5} />
          <ellipse cx={0} cy={0} rx={90} ry={60} fill="#b8672a" stroke={INK} strokeWidth={6} />
          <ellipse cx={-30} cy={-15} rx={30} ry={18} fill="#d9934a" />
        </g>
      )}
      {art === "lady" && (
        <g transform={`translate(15 ${h / 2 - 170})`}>
          <ellipse cx={0} cy={60} rx={90} ry={70} fill="#7d2e4a" stroke={INK} strokeWidth={5} />
          <circle cx={0} cy={-30} r={44} fill="#f3d3b3" stroke={INK} strokeWidth={5} />
          <path d="M -50 -40 Q 0 -110 50 -40 Q 30 -70 0 -66 Q -30 -70 -50 -40 Z" fill="#3a2a22" />
        </g>
      )}
    </g>
  );
};

/** Pie with steam and a heart. */
export const Pie: React.FC<{ x: number; y: number; at?: number; heart?: boolean }> = ({ x, y, at = 0, heart }) => {
  const f = useCurrentFrame(); const s = usePop(at, 9);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 1, 2].map((i) => <path key={i} d={`M ${-60 + i * 60} -120 q -20 -40 0 -80 q 20 -40 0 -80`} fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.6 + Math.sin(f / 8 + i) * 0.3} />)}
      <ellipse cx={0} cy={40} rx={230} ry={70} fill="#c9ced4" stroke={INK} strokeWidth={8} />
      <path d="M -200 0 Q 0 -110 200 0 L 200 30 Q 0 90 -200 30 Z" fill="#e3a14a" stroke={INK} strokeWidth={8} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M ${-170 + i * 42} -12 q 21 -24 42 0`} fill="none" stroke="#b8732a" strokeWidth={8} />)}
      {[-60, 0, 60].map((sx) => <path key={sx} d={`M ${sx - 20} -40 l 40 0`} stroke="#b8732a" strokeWidth={8} strokeLinecap="round" />)}
      {heart && <path d="M 0 -150 C -40 -200 -100 -160 0 -90 C 100 -160 40 -200 0 -150 Z" fill="#e0453a" stroke={INK} strokeWidth={6} transform={`translate(160 -60) scale(${1 + Math.sin(f / 4) * 0.08})`} />}
    </g>
  );
};

/** Church & State icons with an optional brick wall rising between them. */
export const ChurchState: React.FC<{ wallFrom?: number; at?: number }> = ({ wallFrom, at = 0 }) => {
  const f = useCurrentFrame(); const s1 = usePop(at, 9); const s2 = usePop(at + 6, 9);
  const rows = wallFrom === undefined ? 0 : Math.floor(interpolate(f, [wallFrom, wallFrom + 36], [0, 9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <g>
      <g transform={`translate(520 640) scale(${s1})`}>
        <rect x={-170} y={-120} width={340} height={260} fill="#f4ecdc" stroke={INK} strokeWidth={8} />
        <path d="M -200 -110 L 0 -250 L 200 -110 Z" fill="#8a3a2a" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <rect x={-45} y={-420} width={90} height={190} fill="#f4ecdc" stroke={INK} strokeWidth={8} />
        <path d="M -55 -420 L 0 -540 L 55 -420 Z" fill="#8a3a2a" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <path d="M 0 -560 L 0 -620 M -22 -598 L 22 -598" stroke={INK} strokeWidth={10} strokeLinecap="round" />
        <rect x={-40} y={20} width={80} height={120} rx={36} fill="#5a3a2a" stroke={INK} strokeWidth={6} />
        <text x={0} y={230} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={60} fill="#fff" stroke={INK} strokeWidth={3} paintOrder="stroke">CHURCH</text>
      </g>
      <g transform={`translate(1400 640) scale(${s2})`}>
        <rect x={-230} y={-60} width={460} height={200} fill="#f4ecdc" stroke={INK} strokeWidth={8} />
        {[-170, -85, 0, 85, 170].map((cx) => <rect key={cx} x={cx - 16} y={-60} width={32} height={200} fill="#e2d6bc" stroke={INK} strokeWidth={5} />)}
        <path d="M -260 -60 L 260 -60 L 230 -110 L -230 -110 Z" fill="#e2d6bc" stroke={INK} strokeWidth={8} />
        <path d="M -150 -110 Q 0 -360 150 -110 Z" fill="#f4ecdc" stroke={INK} strokeWidth={8} />
        <path d="M 0 -300 L 0 -360" stroke={INK} strokeWidth={10} />
        <text x={0} y={230} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={60} fill="#fff" stroke={INK} strokeWidth={3} paintOrder="stroke">STATE</text>
      </g>
      {Array.from({ length: rows }, (_, r) => Array.from({ length: 4 }, (_, c) => (
        <rect key={`${r}-${c}`} x={860 + c * 60 - (r % 2) * 30} y={830 - r * 64} width={60} height={60} fill="#b0533a" stroke={INK} strokeWidth={5} />
      )))}
    </g>
  );
};

/** Grid of the states, each a tile with a label (YES/NO tick or a date). */
export const StateGrid: React.FC<{ labels: string[]; at?: number; color?: (i: number) => string; cols?: number }> = ({ labels, at = 0, color, cols = 7 }) => {
  const f = useCurrentFrame();
  const W = 210, H = 150, x0 = 960 - (cols * W) / 2 + W / 2;
  return (
    <g>
      {labels.map((l, i) => {
        const s = f < at + i * 2 ? 0 : spring({ frame: f - at - i * 2, fps: 30, config: { damping: 11 } });
        const r = Math.floor(i / cols), c = i % cols;
        return (
          <g key={i} transform={`translate(${x0 + c * W} ${360 + r * (H + 30)}) scale(${s}) rotate(${((i * 37) % 9) - 4})`}>
            <rect x={-W / 2 + 12} y={-H / 2} width={W - 24} height={H} rx={14} fill={color ? color(i) : "#f4ecdc"} stroke={INK} strokeWidth={6} />
            <text x={0} y={14} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={l.length > 6 ? 30 : 44} fill={INK}>{l}</text>
          </g>
        );
      })}
    </g>
  );
};

/** Bold white caps text with drop shadow, positioned freely (SVG). */
export const BigText: React.FC<{ x: number; y: number; text: string; size?: number; at?: number; color?: string; font?: "m" | "o" }> = ({ x, y, text, size = 90, at = 0, color = "#fff", font = "m" }) => {
  const s = usePop(at, 9);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <text x={4} y={8} textAnchor="middle" fontFamily={font === "m" ? MONTSERRAT : OSWALD} fontWeight={800} fontSize={size} fill="#000" opacity={0.35}>{text}</text>
      <text x={0} y={0} textAnchor="middle" fontFamily={font === "m" ? MONTSERRAT : OSWALD} fontWeight={800} fontSize={size} fill={color} stroke={INK} strokeWidth={size * 0.05} paintOrder="stroke">{text}</text>
    </g>
  );
};

/** Comic speech bubble (SVG) with tail toward (tx, ty). */
export const Bubble: React.FC<{ x: number; y: number; text: string; tx: number; ty: number; at?: number; w?: number; size?: number }> = ({ x, y, text, tx, ty, at = 0, w = 420, size = 56 }) => {
  const s = usePop(at, 9);
  if (s === 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M -40 40 L ${tx - x} ${ty - y} L 40 50 Z`} fill="#fff" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <ellipse rx={w / 2} ry={size * 1.25} fill="#fff" stroke={INK} strokeWidth={8} />
      <path d="M -40 40 L 40 50" stroke="#fff" strokeWidth={14} />
      <text y={size * 0.36} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={size} fill={INK}>{text}</text>
    </g>
  );
};

/** Pop-in question mark / exclamation. */
export const Mark: React.FC<{ x: number; y: number; ch?: string; at?: number; size?: number; color?: string }> = ({ x, y, ch = "?", at = 0, size = 220, color = "#ffd34a" }) => {
  const f = useCurrentFrame(); const s = usePop(at, 7);
  return (
    <g transform={`translate(${x} ${y + Math.sin(f / 6) * 8}) scale(${s}) rotate(${Math.sin(f / 9) * 8})`}>
      <text textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={size} fill={color} stroke={INK} strokeWidth={12} paintOrder="stroke">{ch}</text>
    </g>
  );
};

/** Whiskey barrel. */
export const Barrel: React.FC<{ x: number; y: number; at?: number; s?: number }> = ({ x, y, at = 0, s = 1 }) => {
  const p = usePop(at, 9);
  return (
    <g transform={`translate(${x} ${y}) scale(${p * s})`}>
      <path d="M -110 -150 Q -150 0 -110 150 L 110 150 Q 150 0 110 -150 Z" fill="#9a5f30" stroke={INK} strokeWidth={8} />
      {[-90, 90].map((yy) => <path key={yy} d={`M -130 ${yy} Q 0 ${yy + 14} 130 ${yy}`} fill="none" stroke="#3a3a3a" strokeWidth={14} />)}
      {[-60, 0, 60].map((xx) => <path key={xx} d={`M ${xx} -150 Q ${xx * 1.2} 0 ${xx} 150`} fill="none" stroke="#7a4a22" strokeWidth={4} />)}
      <text y={20} textAnchor="middle" fontFamily={OSWALD} fontWeight={700} fontSize={80} fill="#f3e3bd" stroke={INK} strokeWidth={3} paintOrder="stroke">XXX</text>
    </g>
  );
};

/** Split plate for the Civil War: blue | grey with a jagged crack opening. */
export const SplitWar: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const f = useCurrentFrame();
  const gap = interpolate(f, [at, at + 20], [0, 60], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const crack = "L 980 160 L 930 300 L 1000 430 L 940 560 L 1010 700 L 950 840 L 990 1080";
  return (
    <g>
      <path d={`M 0 0 L 960 0 ${crack} L 0 1080 Z`} fill="#2c4a7a" transform={`translate(${-gap} 0)`} />
      <path d={`M 1920 0 L 960 0 ${crack} L 1920 1080 Z`} fill="#7d7f84" transform={`translate(${gap} 0)`} />
      <path d={`M 960 0 ${crack}`} fill="none" stroke={INK} strokeWidth={10} transform={`translate(${-gap} 0)`} />
      <path d={`M 960 0 ${crack}`} fill="none" stroke={INK} strokeWidth={10} transform={`translate(${gap} 0)`} />
    </g>
  );
};

/** Flip-card scoreboard (Quill's running gag). */
export const Scoreboard: React.FC<{ x: number; y: number; label: string; value: string; at?: number; note?: string }> = ({ x, y, label, value, at = 0, note }) => {
  const s = usePop(at, 10);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-330} y={-170} width={660} height={340} rx={24} fill="#3a2a1e" stroke={INK} strokeWidth={10} />
      <rect x={-310} y={-150} width={620} height={70} rx={10} fill="#5a3a22" />
      <text y={-100} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={40} fill="#f3e3bd">{label}</text>
      {value.split("").map((d, i, arr) => (
        <g key={i} transform={`translate(${(i - (arr.length - 1) / 2) * 140} 40)`}>
          <rect x={-60} y={-80} width={120} height={160} rx={12} fill="#fbf6ea" stroke={INK} strokeWidth={6} />
          <line x1={-60} y1={0} x2={60} y2={0} stroke={INK} strokeWidth={4} />
          <text y={52} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={140} fill={INK}>{d}</text>
        </g>
      ))}
      {note && <text x={290} y={-10} fontFamily={MONTSERRAT} fontWeight={800} fontSize={90} fill="#ffd34a">{note}</text>}
    </g>
  );
};

/** A growing stack of letters (count = how many visible). */
export const LetterStack: React.FC<{ x: number; y: number; count: number }> = ({ x, y, count }) => (
  <g>
    {Array.from({ length: count }, (_, i) => (
      <image key={i} href={staticFile("thanksgiving/props/Sealed_Letter.png")} x={x - 120 + ((i * 37) % 30) - 15} y={y - i * 26} width={240} height={152} transform={`rotate(${((i * 53) % 14) - 7} ${x} ${y - i * 26 + 76})`} />
    ))}
  </g>
);
