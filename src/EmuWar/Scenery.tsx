import React from "react";
import { noise2D } from "@remotion/noise";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MONTSERRAT, OSWALD } from "../fonts";

export const TITLE_FONT = MONTSERRAT;
const STAMP_FONT = OSWALD;

// ---------- Camera: every shot drifts (slow push / pan), optional shake ----------
export const Camera: React.FC<{
  children: React.ReactNode; dur: number; from?: number; to?: number;
  originX?: string; originY?: string; panX?: number; shake?: number;
}> = ({ children, dur, from = 1, to = 1.045, originX = "50%", originY = "50%", panX = 0, shake = 0 }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, dur], [from, to], { extrapolateRight: "clamp" });
  const px = interpolate(f, [0, dur], [0, panX], { extrapolateRight: "clamp" });
  const sx = shake ? noise2D("sx", f * 0.9, 0) * shake : 0;
  const sy = shake ? noise2D("sy", 0, f * 0.9) * shake : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${px + sx}px, ${sy}px) scale(${s})`, transformOrigin: `${originX} ${originY}` }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{children}</svg>
);

// Paper/paint texture overlay for the "painted background" look
const Texture: React.FC<{ id: string; opacity?: number }> = ({ id, opacity = 0.18 }) => (
  <g>
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={4} />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width={1920} height={1080} filter={`url(#${id})`} opacity={opacity} style={{ mixBlendMode: "multiply" }} />
  </g>
);

const wheat = Array.from({ length: 260 }, (_, i) => ({
  x: (i * 137.5) % 1960 - 20, y: 700 + ((i * 61) % 380), h: 26 + ((i * 17) % 30), lean: ((i * 29) % 21) - 10,
}));

// ---------- Outback: painted sky, mesas, gum trees, wheat ----------
export const Outback: React.FC<{ sunset?: boolean; horizon?: number }> = ({ sunset = false, horizon = 640 }) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 14) * 3;
  return (
    <g>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sunset ? "#5f5aa2" : "#7fb9e3"} />
          <stop offset="0.6" stopColor={sunset ? "#f08a5d" : "#bfdcef"} />
          <stop offset="1" stopColor={sunset ? "#f9c97a" : "#f4e4c1"} />
        </linearGradient>
        <radialGradient id="sun"><stop offset="0" stopColor="#fff6d5" /><stop offset="0.35" stopColor={sunset ? "#ffd27a" : "#fff0b0"} stopOpacity={0.9} /><stop offset="1" stopColor="#fff0b0" stopOpacity={0} /></radialGradient>
        <linearGradient id="field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sunset ? "#d79a4f" : "#e5c66b"} /><stop offset="1" stopColor={sunset ? "#a8642e" : "#c49a45"} />
        </linearGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="2.2" /></filter>
      </defs>
      <rect width={1920} height={1080} fill="url(#sky)" />
      <circle cx={1500} cy={sunset ? 560 : 210} r={260} fill="url(#sun)" />
      {/* clouds */}
      {[[300, 190, 1], [980, 140, 0.8], [1680, 260, 0.7]].map(([cx, cy, k], i) => (
        <g key={i} filter="url(#soft)" opacity={0.92} transform={`translate(${cx + f * 0.15 * (i + 1)} ${cy}) scale(${k})`}>
          <ellipse cx={0} cy={0} rx={130} ry={46} fill="#fff" /><ellipse cx={-70} cy={12} rx={80} ry={36} fill="#fff" /><ellipse cx={80} cy={10} rx={90} ry={38} fill="#fff" /><ellipse cx={10} cy={-30} rx={70} ry={45} fill="#fff" />
        </g>
      ))}
      {/* far mesas (atmospheric, blurred) */}
      <path d={`M 0 ${horizon - 40} L 160 ${horizon - 40} L 220 ${horizon - 150} L 520 ${horizon - 150} L 590 ${horizon - 40} L 1100 ${horizon - 40} L 1180 ${horizon - 110} L 1380 ${horizon - 110} L 1450 ${horizon - 40} L 1920 ${horizon - 40} L 1920 ${horizon} L 0 ${horizon} Z`}
        fill={sunset ? "#a0566a" : "#c99a86"} opacity={0.75} filter="url(#soft)" />
      <path d={`M 0 ${horizon - 10} Q 400 ${horizon - 70} 800 ${horizon - 20} T 1920 ${horizon - 30} L 1920 ${horizon + 20} L 0 ${horizon + 20} Z`} fill={sunset ? "#8f4b3a" : "#b9774b"} filter="url(#soft)" />
      <rect y={horizon} width={1920} height={1080 - horizon} fill="url(#field)" />
      {/* gum trees */}
      {[[170, 1], [1720, 1.2], [1260, 0.6]].map(([tx, k], i) => (
        <g key={i} transform={`translate(${tx} ${horizon + 10}) scale(${k})`}>
          <path d="M -10 0 L -6 -150 Q -40 -200 -60 -230 M -6 -150 Q 20 -210 50 -240" stroke="#efe6da" strokeWidth={14} fill="none" strokeLinecap="round" />
          <path d="M -10 0 L -6 -150" stroke="#d9cbb8" strokeWidth={18} />
          <g transform={`rotate(${sway * 0.4})`}>
            <ellipse cx={-60} cy={-250} rx={80} ry={44} fill={sunset ? "#5f6b47" : "#7f9a68"} />
            <ellipse cx={45} cy={-265} rx={90} ry={50} fill={sunset ? "#56623f" : "#718c5c"} />
            <ellipse cx={-5} cy={-300} rx={70} ry={40} fill={sunset ? "#6b7a50" : "#8fac76"} />
          </g>
        </g>
      ))}
      {/* fence */}
      <g opacity={0.8}>
        <line x1={0} y1={horizon + 40} x2={1920} y2={horizon + 34} stroke="#7a5a3a" strokeWidth={4} />
        <line x1={0} y1={horizon + 60} x2={1920} y2={horizon + 54} stroke="#7a5a3a" strokeWidth={4} />
        {Array.from({ length: 13 }, (_, i) => <rect key={i} x={i * 160 + 30} y={horizon + 22} width={10} height={56} fill="#6b4a2c" />)}
      </g>
      {/* wheat strokes */}
      {wheat.filter((w) => w.y > horizon + 40).map((w, i) => (
        <path key={i} d={`M ${w.x} ${w.y} q ${w.lean + sway} ${-w.h / 2} ${w.lean * 1.5 + sway} ${-w.h}`} stroke={i % 3 ? "#b98a3a" : "#f1d888"} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.8} />
      ))}
      <Texture id="tex-outback" />
    </g>
  );
};

// ---------- Flat infographic plate ----------
export const Plate: React.FC<{ color?: string; children?: React.ReactNode }> = ({ color = "#1e90ff", children }) => (
  <AbsoluteFill style={{ background: color }}>
    <Stage>
      <defs><radialGradient id="plateVig"><stop offset="0.6" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.28} /></radialGradient></defs>
      <rect width={1920} height={1080} fill="url(#plateVig)" />
      <Texture id={`tex-plate-${color.slice(1)}`} opacity={0.12} />
      {children}
    </Stage>
  </AbsoluteFill>
);

// ---------- Text graphics ----------
const shadow = "0 6px 0 rgba(0,0,0,0.35), 0 0 24px rgba(0,0,0,0.45)";

/** Darkened name/title card: hold, then the parent hard-cuts it away. */
export const NameCard: React.FC<{ text: string; sub?: string }> = ({ text, sub }) => (
  <AbsoluteFill style={{ background: "rgba(0,0,0,0.58)", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
    <div style={{ fontFamily: TITLE_FONT, fontWeight: 800, fontSize: 124, color: "#fff", letterSpacing: 2, textShadow: shadow, textTransform: "uppercase", textAlign: "center", lineHeight: 1.05 }}>{text}</div>
    {sub && <div style={{ fontFamily: TITLE_FONT, fontWeight: 800, fontSize: 52, color: "#ffd96a", marginTop: 18, textShadow: shadow, textTransform: "uppercase" }}>{sub}</div>}
  </AbsoluteFill>
);

/** Fact caption: pops in with a small overshoot. */
export const Caption: React.FC<{ text: string; at?: number; pos?: "top" | "bottom"; size?: number; color?: string }> = ({ text, at = 0, pos = "bottom", size = 86, color = "#fff" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 9, stiffness: 220 } });
  return (
    <AbsoluteFill style={{ justifyContent: pos === "top" ? "flex-start" : "flex-end", alignItems: "center", padding: pos === "top" ? "60px 0 0" : "0 0 70px" }}>
      <div style={{ fontFamily: TITLE_FONT, fontWeight: 800, fontSize: size, color, textShadow: shadow, textTransform: "uppercase", transform: `scale(${interpolate(s, [0, 1], [0.4, 1])})`, opacity: Math.min(1, s * 2) }}>{text}</div>
    </AbsoluteFill>
  );
};

/** Rotated grunge rubber stamp that slams in. */
export const StampCard: React.FC<{ lines: string[]; at: number; x: number; y: number; rotate?: number; ink?: string; bg?: string }> = ({ lines, at, x, y, rotate = -9, ink = "#d92b2b", bg = "rgba(255,255,255,0.85)" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (f < at) return null;
  // Reference grammar: the stamp enters FULL-SCREEN (scale ~3.2, centred) and slams down to its
  // corner in ~3 frames; the scene behind dims to ~45% and stays dimmed while the stamp holds.
  const t = Math.min(1, (f - at) / 3);
  const e = 1 - (1 - t) ** 2;
  const scale = interpolate(e, [0, 1], [3.2, 1]);
  const cx = interpolate(e, [0, 1], [960, x]), cy = interpolate(e, [0, 1], [540, y]);
  const w = 760, lh = 82, h = lines.length * lh + 70;
  void fps; void spring;
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <rect width={1920} height={1080} fill="#000" opacity={0.55 * Math.min(1, (f - at + 1) / 2)} />
      <defs>
        <filter id="grunge" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.5" numOctaves={3} seed={11} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -5 2.6" result="holes" />
          <feComposite in="SourceGraphic" in2="holes" operator="out" />
        </filter>
      </defs>
      <g transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale})`}>
        <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={bg} />
        <g filter="url(#grunge)">
          <rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28} rx={8} fill="none" stroke={ink} strokeWidth={14} />
          {lines.map((l, i) => (
            <text key={i} x={0} y={-h / 2 + 35 + lh * (i + 0.8)} textAnchor="middle" fontFamily={STAMP_FONT} fontWeight={700} fontSize={70} fill={ink} letterSpacing={3}>{l}</text>
          ))}
        </g>
      </g>
    </svg>
  );
};

export const SpeechBubble: React.FC<{ x: number; y: number; text: string; at: number; tailX: number; tailY: number }> = ({ x, y, text, at, tailX, tailY }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  if (f < at) return null;
  const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 260 } });
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M -60 60 L ${tailX - x} ${tailY - y} L 30 70 Z`} fill="#fff" stroke="#1c1a1a" strokeWidth={8} strokeLinejoin="round" />
      <ellipse cx={0} cy={0} rx={260} ry={95} fill="#fff" stroke="#1c1a1a" strokeWidth={8} />
      <path d="M -60 60 L 30 70" stroke="#fff" strokeWidth={14} />
      <text x={0} y={22} textAnchor="middle" fontFamily={TITLE_FONT} fontWeight={800} fontSize={64} fill="#1c1a1a">{text}</text>
    </g>
  );
};

// ---------- Effects ----------
export const MuzzleFlash: React.FC<{ x: number; y: number; on: boolean; scale?: number }> = ({ x, y, on, scale = 1 }) => {
  if (!on) return null;
  const pts = Array.from({ length: 16 }, (_, i) => {
    const r = (i % 2 ? 40 : 110) * scale, a = (i / 16) * Math.PI * 2;
    return `${Math.cos(a) * r * 1.4},${Math.sin(a) * r * 0.8}`;
  }).join(" ");
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon points={pts} fill="#ffb02e" stroke="#1c1a1a" strokeWidth={6} strokeLinejoin="round" />
      <ellipse rx={50 * scale} ry={30 * scale} fill="#fff6b0" />
    </g>
  );
};

export const DustPuffs: React.FC<{ x: number; y: number; start: number; count?: number; dir?: number }> = ({ x, y, start, count = 6, dir = -1 }) => {
  const f = useCurrentFrame() - start;
  if (f < 0) return null;
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const age = f - i * 3; if (age < 0 || age > 30) return null;
        const r = interpolate(age, [0, 30], [20, 80]);
        return <circle key={i} cx={x + dir * i * 60 + dir * age * 2} cy={y - age * 1.5} r={r} fill="#e8d3a8" stroke="#1c1a1a" strokeWidth={5} opacity={interpolate(age, [0, 30], [1, 0])} />;
      })}
    </g>
  );
};
