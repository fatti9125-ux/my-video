import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { MONTSERRAT, OSWALD } from "../fonts";
import { usePop, useLocal } from "./core";
import { Stage } from "./Sets";

export const SHADOW = "0 6px 0 rgba(0,0,0,0.35), 0 0 24px rgba(0,0,0,0.45)";
export const SERIF = "Georgia, 'DejaVu Serif', 'Times New Roman', serif";

/** Big centred word(s) that slam in at an absolute VO time. */
export const Word: React.FC<{ t: number; text: string; x?: number; y?: number; size?: number; color?: string; rot?: number; font?: string; until?: number }> = ({ t, text, x = 960, y = 540, size = 150, color = "#fff", rot = 0, font = MONTSERRAT, until }) => {
  const s = usePop(t, { damping: 9, stiffness: 260 }); const L = useLocal(); const f = useCurrentFrame();
  if (!s || (until !== undefined && f >= L(until))) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${interpolate(s, [0, 1], [1.5, 1])})`, opacity: Math.min(1, s * 2.5), fontFamily: font, fontWeight: 800, fontSize: size, color, textShadow: SHADOW, textTransform: "uppercase", whiteSpace: "nowrap", letterSpacing: 2 }}>{text}</div>
  );
};

/** Chalkboard scoreboard (running gag). */
export const Scoreboard: React.FC<{ x?: number; y?: number; rows: { t: number; label: string; value: string; color?: string }[]; title?: string }> = ({ x = 1180, y = 520, rows, title = "QUILL'S SCOREBOARD" }) => (
  <AbsoluteFill>
    <div style={{ position: "absolute", left: x - 520, top: y - 330, width: 1040, height: 660, background: "#7a4a26", border: "10px solid #1d1a17", borderRadius: 18, boxShadow: "0 18px 0 rgba(0,0,0,0.3)" }}>
      <div style={{ position: "absolute", inset: 26, background: "radial-gradient(circle at 40% 35%, #3f5a48, #24382c)", border: "6px solid #1d1a17", borderRadius: 8, padding: "36px 48px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: OSWALD, fontSize: 74, color: "#f3eedc", letterSpacing: 4, textAlign: "center", borderBottom: "5px dashed rgba(243,238,220,0.6)", paddingBottom: 14 }}>{title}</div>
        {rows.map((r, i) => <Row key={i} {...r} />)}
      </div>
    </div>
  </AbsoluteFill>
);
const Row: React.FC<{ t: number; label: string; value: string; color?: string }> = ({ t, label, value, color = "#ffd96a" }) => {
  const s = usePop(t);
  if (!s) return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 34, fontFamily: OSWALD, fontSize: 70, color: "#f3eedc", letterSpacing: 2, opacity: Math.min(1, s * 2), transform: `translateX(${(1 - s) * 60}px)` }}>
      <span>{label}</span><span style={{ color, transform: `scale(${interpolate(s, [0, 1], [2, 1])})`, display: "inline-block" }}>{value}</span>
    </div>
  );
};

/** Card with a heading and an emoji-free drawn icon slot. */
export const Card: React.FC<{ t: number; x: number; y: number; w?: number; h?: number; title: string; sub?: string; bg?: string; children?: React.ReactNode; rot?: number }> = ({ t, x, y, w = 560, h = 600, title, sub, bg = "#f6efe0", children, rot = 0 }) => {
  const s = usePop(t);
  if (!s) return null;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, background: bg, border: "8px solid #1d1a17", borderRadius: 22, transform: `rotate(${rot}deg) scale(${interpolate(s, [0, 1], [0.5, 1])})`, boxShadow: "0 14px 0 rgba(0,0,0,0.28)", overflow: "hidden" }}>
      <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 70, textAlign: "center", marginTop: 24, color: "#1d1a17" }}>{title}</div>
      {sub && <div style={{ fontFamily: OSWALD, fontSize: 64, textAlign: "center", position: "absolute", bottom: 26, width: "100%", color: "#c8261f", letterSpacing: 3 }}>{sub}</div>}
      {children}
    </div>
  );
};

/** Handwritten-ish quote text revealed letter by letter. */
export const Typed: React.FC<{ t: number; text: string; x?: number; y?: number; size?: number; color?: string; cps?: number; width?: number; italic?: boolean }> = ({ t, text, x = 960, y = 540, size = 72, color = "#3a2414", cps = 28, width = 1200, italic = true }) => {
  const L = useLocal(); const f = useCurrentFrame();
  const n = Math.max(0, Math.floor(((f - L(t)) / 30) * cps));
  if (f < L(t)) return null;
  return (
    <div style={{ position: "absolute", left: x - width / 2, top: y, width, textAlign: "center", fontFamily: SERIF, fontStyle: italic ? "italic" : "normal", fontSize: size, color, lineHeight: 1.25 }}>
      {text.slice(0, n)}<span style={{ opacity: 0 }}>{text.slice(n)}</span>
    </div>
  );
};

/** Simple drawn icons (flat fill, thick outline) to match the character line weight. */
export const WhiskeyJug: React.FC<{ x: number; y: number; k?: number }> = ({ x, y, k = 1 }) => (
  <Stage>
    <g transform={`translate(${x} ${y}) scale(${k})`} stroke="#1d1a17" strokeWidth={8} strokeLinejoin="round">
      <path d="M -90 120 Q -110 -10 -50 -60 L -30 -110 L 30 -110 L 50 -60 Q 110 -10 90 120 Z" fill="#c9a26a" />
      <rect x={-30} y={-140} width={60} height={34} rx={6} fill="#7a4a26" />
      <path d="M 50 -50 Q 120 -60 110 20 Q 105 50 80 40" fill="none" />
      <rect x={-60} y={10} width={120} height={70} rx={8} fill="#f6efe0" strokeWidth={6} />
      <text x={0} y={60} textAnchor="middle" fontFamily={OSWALD} fontSize={44} fill="#1d1a17" stroke="none">XXX</text>
    </g>
  </Stage>
);

export const Pie: React.FC<{ x: number; y: number; k?: number }> = ({ x, y, k = 1 }) => (
  <Stage>
    <g transform={`translate(${x} ${y}) scale(${k})`} stroke="#1d1a17" strokeWidth={8} strokeLinejoin="round">
      <ellipse cx={0} cy={30} rx={190} ry={60} fill="#e8e2d6" />
      <path d="M -160 10 Q 0 -90 160 10 L 150 40 Q 0 90 -150 40 Z" fill="#d98a3a" />
      <path d="M -150 40 Q 0 90 150 40 L 145 60 Q 0 115 -145 60 Z" fill="#b8692a" />
      {[-90, -30, 30, 90].map((dx) => <path key={dx} d={`M ${dx - 20} -10 Q ${dx} -30 ${dx + 20} -10`} fill="none" strokeWidth={6} />)}
    </g>
  </Stage>
);

export const Lamb: React.FC<{ x: number; y: number; k?: number; hop?: number }> = ({ x, y, k = 1, hop = 0 }) => (
  <Stage>
    <g transform={`translate(${x} ${y - hop}) scale(${k})`} stroke="#1d1a17" strokeWidth={8} strokeLinejoin="round">
      {[-70, -30, 30, 70].map((lx) => <line key={lx} x1={lx} y1={40} x2={lx} y2={130} strokeLinecap="round" />)}
      {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={-90 + (i % 5) * 45} cy={i < 5 ? 0 : -50} r={50} fill="#fbf8f0" />)}
      <ellipse cx={0} cy={-10} rx={130} ry={70} fill="#fbf8f0" stroke="none" />
      <ellipse cx={150} cy={-60} rx={55} ry={45} fill="#2d2a28" />
      <circle cx={165} cy={-70} r={8} fill="#fff" stroke="none" />
      <ellipse cx={115} cy={-85} rx={30} ry={14} fill="#2d2a28" transform="rotate(-30 115 -85)" />
    </g>
  </Stage>
);

export const Church: React.FC<{ x: number; y: number; k?: number }> = ({ x, y, k = 1 }) => (
  <Stage>
    <g transform={`translate(${x} ${y}) scale(${k})`} stroke="#1d1a17" strokeWidth={8} strokeLinejoin="round">
      <rect x={-120} y={-100} width={240} height={200} fill="#f6efe0" />
      <path d="M -150 -100 L 0 -200 L 150 -100 Z" fill="#c8261f" />
      <rect x={-40} y={-330} width={80} height={130} fill="#f6efe0" /><path d="M -50 -330 L 0 -420 L 50 -330 Z" fill="#c8261f" />
      <line x1={0} y1={-420} x2={0} y2={-480} /><line x1={-22} y1={-458} x2={22} y2={-458} />
      <path d="M -30 100 L -30 20 Q 0 -10 30 20 L 30 100 Z" fill="#7a4a26" />
    </g>
  </Stage>
);

export const Capitol: React.FC<{ x: number; y: number; k?: number }> = ({ x, y, k = 1 }) => (
  <Stage>
    <g transform={`translate(${x} ${y}) scale(${k})`} stroke="#1d1a17" strokeWidth={8} strokeLinejoin="round">
      <rect x={-200} y={-60} width={400} height={160} fill="#f6efe0" />
      <path d="M -220 -60 L 0 -140 L 220 -60 Z" fill="#e2d6be" />
      {[-150, -75, 0, 75, 150].map((cx) => <line key={cx} x1={cx} y1={-50} x2={cx} y2={95} strokeWidth={14} stroke="#cfc3aa" />)}
      <rect x={-200} y={-60} width={400} height={160} fill="none" />
      <rect x={-240} y={100} width={480} height={30} fill="#cfc3aa" />
      <line x1={0} y1={-140} x2={0} y2={-230} /><path d="M 0 -230 L 80 -205 L 0 -180 Z" fill="#2d4b8a" />
    </g>
  </Stage>
);

/** Calendar page. */
export const CalPage: React.FC<{ x: number; y: number; month: string; day: string; t: number; rot?: number; k?: number; head?: string }> = ({ x, y, month, day, t, rot = 0, k = 1, head = "#c8261f" }) => {
  const s = usePop(t);
  if (!s) return null;
  return (
    <div style={{ position: "absolute", left: x - 150 * k, top: y - 170 * k, width: 300 * k, height: 340 * k, background: "#fbf8f0", border: `${8 * k}px solid #1d1a17`, borderRadius: 18 * k, transform: `rotate(${rot}deg) scale(${interpolate(s, [0, 1], [0.3, 1])})`, overflow: "hidden", boxShadow: "0 10px 0 rgba(0,0,0,0.25)" }}>
      <div style={{ background: head, color: "#fff", fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 46 * k, textAlign: "center", padding: `${10 * k}px 0`, borderBottom: `${8 * k}px solid #1d1a17` }}>{month}</div>
      <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 150 * k, textAlign: "center", color: "#1d1a17", lineHeight: 1.35 }}>{day}</div>
    </div>
  );
};

// Camera bound to the shot length: every shot gets a slow push / pan (style guide).
import { Camera as BaseCamera, NameCard } from "../EmuWar/Scenery";
import { useShot } from "./core";
export const Cam: React.FC<{ children: React.ReactNode; to?: number; from?: number; ox?: string; oy?: string; panX?: number; shake?: number }> = ({ children, to = 1.045, from = 1, ox = "50%", oy = "50%", panX = 0, shake = 0 }) => {
  const { dur } = useShot();
  return <BaseCamera dur={dur} from={from} to={to} originX={ox} originY={oy} panX={panX} shake={shake}>{children}</BaseCamera>;
};
export { NameCard };
