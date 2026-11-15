// Motion-graphics elements for the editorial, popart, cinematic and retro styles (they work in vox too).
// Same contract as Video.tsx: positions in 1920x1080 px, times in frames relative to the beat start.
import React from "react";
import { Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame } from "remotion";
import { clamp } from "./kit";
import { col, useTheme } from "./theme";
import { FONTS } from "./fonts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type El = Record<string, any>;
const FPS = 30;
const eOut = Easing.out(Easing.cubic);
const eIn = Easing.in(Easing.cubic);
const eInOut = Easing.inOut(Easing.cubic);
const lerp = (f: number, a: number, b: number, from: number, to: number, ease = eOut) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: ease });

/* ---------------- entrances + drift ---------------- */

// How an element arrives. t = frames since its cue.
export const entrance = (anim: string | undefined, t: number, dist = 900): React.CSSProperties => {
  if (t < 0) return { opacity: 0 };
  const sp = (damping = 11, stiffness = 170) => spring({ frame: t, fps: FPS, config: { damping, stiffness, mass: 0.8 } });
  switch (anim ?? "pop") {
    case "none": return {};
    case "fade": return { opacity: lerp(t, 0, 8, 0, 1) };
    case "pop": return { transform: `scale(${0.55 + 0.45 * sp()})`, opacity: lerp(t, 0, 3, 0, 1) };
    case "slam": return { transform: `scale(${interpolate(t, [0, 5], [1.7, 1], { ...clamp, easing: eOut })})`, opacity: lerp(t, 0, 2, 0, 1) };
    case "grow": return { transform: `scale(${sp(13, 140)})` };
    case "rise": return { transform: `translateY(${lerp(t, 0, 14, dist, 0)}px)` };
    case "drop": return { transform: `translateY(${(1 - sp(9, 160)) * -dist * 0.45}px)`, opacity: lerp(t, 0, 2, 0, 1) };
    case "up": return { transform: `translateY(${lerp(t, 0, 9, 40, 0)}px)`, opacity: lerp(t, 0, 7, 0, 1) };
    case "left": return { transform: `translateX(${lerp(t, 0, 12, -dist * 1.6, 0)}px)` };
    case "right": return { transform: `translateX(${lerp(t, 0, 12, dist * 1.6, 0)}px)` };
    case "top": return { transform: `translateY(${lerp(t, 0, 12, -dist, 0)}px)` };
    case "zoom": return { transform: `scale(${lerp(t, 0, 12, 0.04, 1, Easing.out(Easing.exp))})`, opacity: lerp(t, 0, 2, 0, 1) };
    case "blur": return { filter: `blur(${lerp(t, 0, 12, 26, 0)}px)`, opacity: lerp(t, 0, 8, 0, 1), transform: `scale(${lerp(t, 0, 14, 1.12, 1)})` };
    default: return {};
  }
};

// Slow continuous movement over the beat: {x, y, s, r} are totals reached at the end of `life` frames.
const drift = (el: El, f: number) => {
  const d = el.drift; if (!d) return "";
  const p = interpolate(f, [0, el.life ?? 90], [0, 1], clamp);
  return `translate(${(d.x ?? 0) * p}px, ${(d.y ?? 0) * p}px) scale(${1 + (d.s ?? 0) * p}) rotate(${(d.r ?? 0) * p}deg)`;
};

const merge = (base: string, st: React.CSSProperties): React.CSSProperties => ({ ...st, transform: `${base} ${st.transform ?? ""}` });

const FILTERS: Record<string, string> = {
  gray: "grayscale(1) contrast(1.08)",
  sepia: "grayscale(1) sepia(0.55) contrast(1.05) brightness(1.02)",
  dim: "grayscale(1) brightness(0.85) contrast(1.15)",
};

/* ---------------- pictures ---------------- */

// Any image (cut-out or plain photo). Optional echo trail: copies that collapse into the original.
export const Pic: React.FC<{ el: El }> = ({ el }) => {
  const f = useCurrentFrame();
  const t = f - (el.at ?? 0);
  if (t < 0) return null;
  if (el.until !== undefined && f >= el.until) return null;
  const st = entrance(el.anim, t, el.dist ?? 900);
  const filter = [el.filter && FILTERS[el.filter], st.filter, el.shadow !== false ? "drop-shadow(0 12px 16px rgba(0,0,0,0.25))" : ""].filter(Boolean).join(" ");
  const img = (extra: React.CSSProperties = {}, key?: number) => (
    <Img key={key} src={staticFile(el.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: el.fit ?? "fill", ...extra }} />
  );
  const echo = el.echo;
  const out = el.out ? lerp(f, el.out.at, el.out.at + (el.out.dur ?? 8), 0, 1, eIn) : 0;
  const outT = el.out ? `translate(${(el.out.x ?? 0) * out}px, ${(el.out.y ?? 0) * out}px) scale(${1 + (el.out.s ?? 0) * out})` : "";
  return (
    <div style={merge(`${drift(el, f)} ${outT} rotate(${el.rot ?? 0}deg)`, {
      position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h, opacity: (st.opacity as number ?? 1) * (el.opacity ?? 1) * (el.out?.fade ? 1 - out : 1),
      transform: st.transform, transformOrigin: el.origin ?? "50% 50%", filter, zIndex: el.z,
    })}>
      {echo && Array.from({ length: echo.n ?? 6 }, (_, k) => {
        const p = lerp(f, echo.from ?? 0, echo.to ?? 20, 1, 0, eInOut);
        const o = (k + 1) * (echo.dx ?? 110) * p;
        return p > 0.01 ? img({ transform: `translateX(${o}px)`, opacity: 0.9 - k * 0.08 }, k) : null;
      })}
      {img()}
    </div>
  );
};

/* ---------------- shapes ---------------- */

// Flat geometric plates: circle, ring, semi (half disc), tri, glow, rect, rounded.
export const Shape: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const t = f - (el.at ?? 0);
  if (t < 0) return null;
  const c = col(th, el.color, "accent");
  const r = el.r ?? 200;
  const w = el.w ?? r * 2, h = el.h ?? r * 2;
  const st = entrance(el.anim ?? "grow", t);
  let style: React.CSSProperties = { background: c };
  switch (el.kind) {
    case "circle": style = { background: c, borderRadius: "50%" }; break;
    case "ring": style = { border: `${el.thick ?? r * 0.16}px solid ${c}`, borderRadius: "50%", boxSizing: "border-box" }; break;
    case "semi": style = { background: c, borderRadius: "50%", clipPath: "inset(0 0 50% 0)" }; break;
    case "tri": style = { background: c, clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }; break;
    case "glow": style = { background: `radial-gradient(circle, ${c} 0%, ${c} 38%, transparent 70%)`, borderRadius: "50%", filter: "blur(6px)" }; break;
    case "rounded": style = { background: c, borderRadius: el.radius ?? 60 }; break;
    case "streaks": {   // rain / film-scratch lines over a plate
      style = { background: `repeating-linear-gradient(${el.angle ?? 100}deg, transparent 0 22px, ${c} 22px 24px, transparent 24px 61px)`, opacity: 0.35 };
      break;
    }
    default: break;
  }
  const pulse = el.pulse ? 1 + Math.sin((f / FPS) * Math.PI * 2 * (el.pulse.hz ?? 1.5)) * (el.pulse.amp ?? 0.04) : 1;
  return (
    <div style={merge(`${drift(el, f)} rotate(${el.rot ?? 0}deg) scale(${pulse})`, {
      position: "absolute", left: el.x - w / 2, top: el.y - h / 2, width: w, height: h, opacity: (el.opacity ?? 1) * ((st.opacity as number) ?? 1),
      transform: st.transform, ...style,
    })} />
  );
};

/* ---------------- captions ---------------- */

// Word-by-word captions. Each word: {text, at, st?, size?, color?, br?}
// st: hl (highlighter behind), accent, accent2, muted, strike (red line through), big, light
export const Caption: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const rows: El[][] = [[]];
  for (const w of el.words) { if (w.br) rows.push([]); else rows[rows.length - 1].push(w); }
  const font = FONTS[el.font ?? "serif"] ?? FONTS.serif;
  const align = el.align ?? "left";
  const outP = el.out !== undefined ? lerp(f, el.out, el.out + 8, 0, 1, eIn) : 0;
  return (
    <div style={{
      position: "absolute", left: el.x, top: el.y, width: el.w, zIndex: el.z,
      transform: `${align === "center" && !el.w ? "translateX(-50%)" : ""} rotate(${el.rot ?? 0}deg)`,
      textAlign: align, opacity: 1 - outP, filter: outP ? `blur(${outP * 18}px)` : undefined,
    }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start", alignItems: "baseline", gap: `0 ${el.size * 0.26}px`, lineHeight: el.lh ?? 1.08 }}>
          {row.map((w, wi) => <Word key={wi} w={w} el={el} f={f} font={font} th={th} />)}
        </div>
      ))}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Word: React.FC<{ w: El; el: El; f: number; font: React.CSSProperties; th: any }> = ({ w, el, f, font, th }) => {
  const t = f - w.at;
  const size = el.size * (w.size ?? (w.st === "big" ? 1.45 : w.st === "small" ? 0.6 : 1));
  const c = w.color ? col(th, w.color) : w.st === "accent" ? col(th, "accent") : w.st === "accent2" ? col(th, "accent2") : w.st === "muted" ? col(th, "muted") : w.st === "light" ? col(th, "light") : col(th, el.color, "ink");
  const anim = el.anim ?? "up";
  let st: React.CSSProperties = {};
  let text = w.text;
  if (anim === "type") { const n = Math.max(0, Math.min(text.length, Math.floor(t * 2))); text = text.slice(0, n); }
  else st = entrance(anim, t, 60);
  // colour shift: words can arrive in one colour and settle to another (retro "Alexander" orange -> red)
  const settle = w.from_color ? interpolate(t, [4, 12], [0, 1], clamp) : 1;
  const color = w.from_color && settle < 1 ? col(th, w.from_color) : c;
  const hlP = w.st === "hl" ? lerp(t, 2, 9, 0, 1) : 0;
  const strikeP = w.st === "strike" ? lerp(f, w.strike ?? w.at + 10, (w.strike ?? w.at + 10) + 6, 0, 1) : 0;
  return (
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "pre", visibility: t < 0 ? "hidden" : "visible", ...font, fontSize: size, color, textShadow: el.glow ? `0 0 ${size * 0.25}px ${col(th, el.glow)}, 0 0 ${size * 0.6}px ${col(th, el.glow)}` : undefined, ...st }}>
      {w.st === "hl" && (
        <span style={{ position: "absolute", left: "-0.12em", right: "-0.12em", top: "0.18em", bottom: "0.02em", background: col(th, "accent2"), transform: `scaleX(${hlP})`, transformOrigin: "left", zIndex: -1, borderRadius: 3 }} />
      )}
      {text}
      {w.st === "strike" && (
        <span style={{ position: "absolute", left: "-4%", width: "108%", top: "52%", height: Math.max(4, size * 0.07), background: col(th, "accent"), transform: `scaleX(${strikeP}) rotate(-2deg)`, transformOrigin: "left" }} />
      )}
    </span>
  );
};

/* ---------------- numbers ---------------- */

const fmt = (v: number, dec = 0, sep = true) => {
  const s = v.toFixed(dec);
  if (!sep) return s;
  const [a, b] = s.split(".");
  return a.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (b ? "." + b : "");
};

// Rolling number. assemble: glowing digits fly in from random depths and lock into place (cinematic).
export const Counter: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const t = f - el.at;
  if (t < 0) return null;
  const dur = el.dur ?? 24;
  let v = interpolate(t, [0, dur], [el.from ?? 0, el.to], { ...clamp, easing: el.ease === "linear" ? Easing.linear : Easing.out(Easing.cubic) });
  if (el.rate && t > dur) v = el.to + ((t - dur) / FPS) * el.rate;
  const text = `${el.prefix ?? ""}${fmt(v, el.dec ?? 0, el.sep !== false)}${el.suffix ?? ""}`;
  const final = `${el.prefix ?? ""}${fmt(el.to, el.dec ?? 0, el.sep !== false)}${el.suffix ?? ""}`;
  const c = col(th, el.color, "ink");
  const glow = el.glow ? col(th, el.glow) : null;
  const font = FONTS[el.font ?? "anton"];
  const outP = el.out !== undefined ? lerp(f, el.out, el.out + 8, 0, 1, eIn) : 0;
  const base: React.CSSProperties = {
    position: "absolute", left: el.x, top: el.y, transform: `${el.align === "center" ? "translateX(-50%)" : el.align === "right" ? "translateX(-100%)" : ""} rotate(${el.rot ?? 0}deg)`,
    ...font, fontSize: el.size, color: c, whiteSpace: "pre", lineHeight: 1, zIndex: el.z, opacity: 1 - outP, filter: outP ? `blur(${outP * 20}px)` : undefined,
    textShadow: glow ? `0 0 ${el.size * 0.12}px ${glow}, 0 0 ${el.size * 0.4}px ${glow}` : el.shadow ? "0 6px 10px rgba(0,0,0,0.2)" : undefined,
  };
  if (el.assemble) {
    return (
      <div style={{ ...base, display: "flex" }}>
        {Array.from(final).map((ch, i) => {
          const d = Math.floor(random(`as${i}`) * 10);
          const p = interpolate(t, [d, d + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const dx = (random(`ax${i}`) - 0.5) * el.size * 3, dy = (random(`ay${i}`) - 0.5) * el.size * 2.2;
          const sc = 0.4 + random(`az${i}`) * 1.8;
          return (
            <span key={i} style={{
              display: "inline-block", opacity: p, filter: `blur(${(1 - p) * 14}px)`,
              transform: `translate(${dx * (1 - p)}px, ${dy * (1 - p)}px) scale(${sc + (1 - sc) * p})`,
              color: p < 1 ? col(th, "light") : c,
            }}>{ch}</span>
          );
        })}
      </div>
    );
  }
  const st = entrance(el.anim ?? "none", t);
  return <div style={{ ...base, ...st, transform: `${base.transform} ${st.transform ?? ""}` }}>{text}</div>;
};

// Odometer / split-flap digits on black tiles. Digits roll from `from` to `to`.
export const Flip: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const t = f - el.at;
  if (t < 0) return null;
  const v = interpolate(t, [0, el.dur ?? 20], [el.from, el.to], { ...clamp, easing: Easing.out(Easing.quad) });
  const digits = String(Math.round(el.to)).length;
  const size = el.size ?? 180;
  const tileW = size * 0.62, tileH = size * 1.05;
  const pop = spring({ frame: t, fps: FPS, config: { damping: 12, stiffness: 160 } });
  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, transform: `translateX(-50%) scale(${0.7 + 0.3 * pop})`, display: "flex", gap: 0,
      background: col(th, el.bg, "dark"), padding: `${size * 0.04}px ${size * 0.08}px`, borderRadius: size * 0.08, boxShadow: "0 10px 18px rgba(0,0,0,0.25)" }}>
      {Array.from({ length: digits }, (_, k) => {
        const place = Math.pow(10, digits - 1 - k);
        const pos = v / place;                                    // continuous position of this digit wheel
        const settled = k < digits - 1 ? Math.floor(pos) + Math.max(0, (pos % 1) - 0.85) / 0.15 : pos;   // higher wheels only turn at the end of each cycle
        const off = (settled % 10) * tileH;
        return (
          <div key={k} style={{ width: tileW, height: tileH, overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: -off, width: "100%" }}>
              {Array.from({ length: 11 }, (_, n) => (
                <div key={n} style={{ height: tileH, display: "flex", alignItems: "center", justifyContent: "center", ...FONTS.anton, fontSize: size, color: col(th, el.color, "light") }}>{n % 10}</div>
              ))}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 3, background: col(th, el.bg, "dark"), opacity: 0.9 }} />
          </div>
        );
      })}
    </div>
  );
};

/* ---------------- editorial furniture ---------------- */

// Torn-edge bar that grows from the left, with a typewriter label; can move to a new row later.
export const Bar: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const t = f - el.at;
  if (t < 0) return null;
  const p = lerp(t, 0, el.dur ?? 12, 0, 1, Easing.out(Easing.cubic));
  const grow = el.grow ? lerp(f, el.grow.at, el.grow.at + (el.grow.dur ?? 14), el.w, el.grow.w) : el.w;
  const y = el.move ? lerp(f, el.move.at, el.move.at + 10, el.y, el.move.y, eInOut) : el.y;
  const pts = Array.from({ length: 14 }, (_, i) => `${100 - random(`bt${el.key}${i}`) * 2.2}% ${(i * 100) / 13}%`);
  return (
    <div style={{ position: "absolute", left: el.x, top: y, height: el.h, width: grow * p }}>
      <div style={{ position: "absolute", inset: 0, background: col(th, el.color, "ink"), clipPath: `polygon(0 4%, 60% 0, ${pts.join(", ")}, 40% 100%, 0 96%)` }} />
      <div style={{ position: "absolute", left: 22, top: 0, height: "100%", display: "flex", alignItems: "center", ...FONTS.courier, fontSize: el.h * 0.36, letterSpacing: "0.12em", color: col(th, el.text_color, "light"), whiteSpace: "pre", opacity: lerp(t, 4, 8, 0, 1) }}>
        {el.label}
      </div>
    </div>
  );
};

// Rubber-stamp label that slams in, with an optional small line above.
export const Stamp: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const t = f - el.at;
  if (t < 0) return null;
  const st = entrance("slam", t);
  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, transform: `rotate(${el.rot ?? -4}deg) ${st.transform}`, opacity: st.opacity, zIndex: el.z,
      background: col(th, el.bg, "accent"), color: col(th, el.color, "light"), padding: `${el.size * 0.18}px ${el.size * 0.35}px ${el.size * 0.1}px`, boxShadow: "0 4px 6px rgba(0,0,0,0.22)",
      clipPath: "polygon(1% 3%, 99% 0, 100% 96%, 0 100%)" }}>
      {el.sub && <div style={{ ...FONTS.courier, fontSize: el.size * 0.3, letterSpacing: "0.15em", textAlign: "center", opacity: 0.85 }}>{el.sub}</div>}
      <div style={{ ...FONTS.anton, fontSize: el.size, lineHeight: 1, whiteSpace: "pre" }}>{el.text}</div>
    </div>
  );
};

// A crisp progress track: NOW -> END with a flag; the fill runs from `at` to `to`.
export const Progress: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  if (f < (el.show ?? 0)) return null;
  const p = interpolate(f, [el.at, el.to], [0, el.fill ?? 1], clamp);
  const ink = col(th, "ink");
  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, width: el.w, height: 60, opacity: lerp(f, el.show ?? 0, (el.show ?? 0) + 6, 0, 1) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 22, height: 14, border: `3px solid ${ink}`, borderRadius: 10, background: col(th, "paper") }} />
      <div style={{ position: "absolute", left: 3, top: 25, height: 8, width: (el.w - 6) * p, background: col(th, "accent"), borderRadius: 6 }} />
      <div style={{ position: "absolute", left: (el.w - 6) * p - 9, top: 17, width: 24, height: 24, borderRadius: "50%", border: `3px solid ${ink}`, background: col(th, "paper") }} />
      <svg style={{ position: "absolute", left: el.w - 6, top: -38 }} width="60" height="64"><path d="M4 62 V4 L44 14 L4 26" fill={ink} stroke={ink} strokeWidth="4" /></svg>
      <div style={{ position: "absolute", left: 0, top: 50, ...FONTS.courier, fontSize: 20, letterSpacing: "0.14em", color: ink }}>{el.left ?? "NOW"}</div>
      <div style={{ position: "absolute", right: -20, top: 50, ...FONTS.courier, fontSize: 20, letterSpacing: "0.14em", color: ink }}>{el.right ?? "END"}</div>
    </div>
  );
};

// A crisp line drawn on along its points, with an optional value tag riding the tip and a dot.
export const Line: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  if (f < el.from) return null;
  const pts: number[][] = el.pts;
  const segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  const p = el.to > el.from ? interpolate(f, [el.from, el.to], [0, 1], { ...clamp, easing: el.ease === "out" ? eOut : el.ease === "inout" ? eInOut : Easing.linear }) : 1;
  let left = total * p, tip = pts[0];
  for (let i = 0; i < segs.length; i++) {
    if (left <= segs[i]) { const k = segs[i] ? left / segs[i] : 0; tip = [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]; break; }
    left -= segs[i]; tip = pts[i + 1];
  }
  const c = col(th, el.color, "ink");
  const d = "M" + pts.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L");
  const tag = el.tag;
  const tagVal = tag ? Math.round(tag.from + (tag.to - tag.from) * p) : 0;
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
        <path d={d} fill="none" stroke={c} strokeWidth={el.width ?? 4} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={el.dashed ? "14 12" : `${total} ${total}`} strokeDashoffset={el.dashed ? 0 : total * (1 - p)}
          style={el.dashed ? { clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` } : undefined} />
        {el.dot && <circle cx={tip[0]} cy={tip[1]} r={(el.width ?? 4) * 2.2} fill={c} />}
      </svg>
      {tag && (
        <div style={{ position: "absolute", left: tip[0] - 10, top: tip[1] - 64, background: col(th, "dark"), color: col(th, "light"), ...FONTS.anton, fontSize: 30, padding: "4px 12px", transform: "translateX(-50%)", borderRadius: 4 }}>
          {`${tag.prefix ?? ""}${tag.sep ? fmt(tagVal) : tagVal}${tag.suffix ?? ""}`}
        </div>
      )}
    </>
  );
};

// Sticker label box (retro): grows from a small square to full width, then the text appears.
export const Label: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const t = f - el.at;
  if (t < 0) return null;
  const h = el.size * 1.55;
  const w = lerp(t, 0, 8, h * 0.6, el.w, Easing.out(Easing.back(1.2)));
  const sc = lerp(t, 0, 4, 0.2, 1);
  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, width: w, height: h, background: col(th, el.bg, "accent2"), transform: `scale(${sc}) rotate(${el.rot ?? 0}deg)`, transformOrigin: "left center",
      overflow: "hidden", display: "flex", alignItems: "center", paddingLeft: el.size * 0.4, boxSizing: "border-box", zIndex: el.z, boxShadow: el.shadow ? "0 4px 8px rgba(0,0,0,0.2)" : undefined }}>
      <div style={{ ...FONTS[el.font ?? "jakarta"], fontSize: el.size, color: col(th, el.color, "accent"), whiteSpace: "pre", transform: `translateY(${lerp(t, 5, 11, el.size, 0)}px)` }}>{el.text}</div>
    </div>
  );
};

// SVG leader line for callouts, drawn on.
export const Leader: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  if (f < el.at) return null;
  const pts: number[][] = el.pts;
  const total = pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
  const p = lerp(f, el.at, el.at + (el.dur ?? 8), 0, 1);
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", zIndex: el.z }} width={1920} height={1080}>
      <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke={col(th, el.color, "ink")} strokeWidth={el.width ?? 3.5}
        strokeDasharray={`${total} ${total}`} strokeDashoffset={total * (1 - p)} strokeLinecap="round" />
      {el.dot && <circle cx={pts[0][0]} cy={pts[0][1]} r={7 * Math.min(1, p * 4)} fill={col(th, el.color, "ink")} />}
    </svg>
  );
};

// Solid colour panel that slides in (retro split layouts).
export const Panel: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const t = f - (el.at ?? 0);
  if (t < 0) return null;
  const st = entrance(el.anim ?? "none", t, el.w);
  return <div style={{ position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h, background: col(th, el.color, "accent"), borderRadius: el.radius ?? 0, ...st }} />;
};

// Lower-third pill: dark pill grows, a gradient fills it left to right, text fades in.
export const Pill: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const t = f - el.at;
  if (t < 0) return null;
  if (el.out !== undefined && f > el.out + 10) return null;
  const h = el.h ?? 64;
  const w = lerp(t, 0, 9, h, el.w, Easing.out(Easing.back(1.1)));
  const fill = lerp(t, 10, 22, 0, 1, eInOut);
  const o = el.out !== undefined ? lerp(f, el.out, el.out + 10, 1, 0) : 1;
  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, width: w, height: h, borderRadius: h / 2, overflow: "hidden", background: "#121417", opacity: o,
      boxShadow: `0 0 24px ${col(th, "accent2")}55`, filter: o < 1 ? `blur(${(1 - o) * 10}px)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${col(th, "accent3")}, ${col(th, "accent2")})`, clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }} />
      <div style={{ position: "absolute", left: h * 0.18, top: h * 0.18, width: h * 0.64, height: h * 0.64, borderRadius: "50%", background: "#FFFFFF", opacity: 0.92 }} />
      <div style={{ position: "absolute", left: h * 1.05, top: 0, height: h, display: "flex", alignItems: "center", ...FONTS.montserrat, fontSize: h * 0.36, letterSpacing: "0.12em", color: "#fff", opacity: lerp(t, 12, 18, 0, 1), whiteSpace: "pre" }}>{el.text}</div>
    </div>
  );
};

/* ---------------- grids of things ---------------- */

const Person: React.FC<{ c: string; s: number }> = ({ c, s }) => (
  <svg width={s} height={s * 1.15} viewBox="0 0 40 46"><circle cx="20" cy="11" r="9" fill={c} /><path d="M4 46 C4 28 12 23 20 23 C28 23 36 28 36 46 Z" fill={c} /></svg>
);

// Unit chart of person icons; optional "bills" that fly from a point onto every icon; one highlighted icon gets a ring.
export const Units: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const t = f - el.at;
  if (t < 0) return null;
  const n = el.cols * el.rows;
  const cw = el.w / el.cols, ch = el.h / el.rows;
  const s = Math.min(cw, ch / 1.15) * 0.7;
  const items = [];
  for (let i = 0; i < n; i++) {
    const cx = el.x + (i % el.cols + 0.5) * cw, cy = el.y + (Math.floor(i / el.cols) + 0.5) * ch;
    const d = Math.floor(i / el.cols) * 1.2 + (i % el.cols) * 0.15;
    const p = lerp(t, d, d + 5, 0, 1);
    const hl = i === el.highlight && f >= (el.hl_at ?? el.at + 20);
    items.push(
      <div key={`u${i}`} style={{ position: "absolute", left: cx - s / 2, top: cy - s * 0.55, transform: `scale(${p})`, opacity: p }}>
        <Person c={hl ? col(th, "accent") : col(th, el.color, "ink")} s={s} />
      </div>,
    );
    if (el.bills) {
      const bd = el.bills.at - el.at + random(`bd${i}`) * 14;
      const bp = interpolate(t, [bd, bd + 12], [0, 1], { ...clamp, easing: eInOut });
      if (bp > 0 && bp < 1) {
        const sx = el.bills.from[0], sy = el.bills.from[1];
        const mx = (sx + cx) / 2 + (random(`bm${i}`) - 0.5) * 400, my = Math.min(sy, cy) - 120 - random(`bh${i}`) * 200;
        const x = (1 - bp) ** 2 * sx + 2 * (1 - bp) * bp * mx + bp ** 2 * cx;
        const y = (1 - bp) ** 2 * sy + 2 * (1 - bp) * bp * my + bp ** 2 * cy;
        items.push(<div key={`b${i}`} style={{ position: "absolute", left: x - s * 0.4, top: y - s * 0.2, width: s * 0.8, height: s * 0.4, background: col(th, "accent3"), border: "2px solid #DDE8D5", transform: `rotate(${(random(`br${i}`) - 0.5) * 140 * (1 - bp)}deg)`, opacity: 0.9 }} />);
      }
      if (bp >= 1) items.push(<div key={`k${i}`} style={{ position: "absolute", left: cx - s * 0.36, top: cy + s * 0.12, width: s * 0.72, height: s * 0.3, background: col(th, "accent3"), opacity: 0.85, border: "2px solid #DDE8D5" }} />);
    }
    if (hl) {
      const rp = lerp(f, el.hl_at ?? el.at + 20, (el.hl_at ?? el.at + 20) + 8, 0, 1);
      items.push(<div key={`r${i}`} style={{ position: "absolute", left: cx - s * 0.9, top: cy - s * 0.95, width: s * 1.8, height: s * 1.9, borderRadius: "50%", border: `5px solid ${col(th, "accent")}`, transform: `scale(${0.5 + 0.5 * rp})`, opacity: rp }} />);
    }
  }
  return <>{items}</>;
};

/* ---------------- popart pieces ---------------- */

// Grey sticks bursting out of a centre point, slowly spinning.
export const Rays: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const t = f - el.at;
  if (t < 0) return null;
  const spin = interpolate(f, [0, el.life ?? 90], [0, el.spin ?? 12], clamp);
  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, transform: `rotate(${spin}deg)`, zIndex: el.z }}>
      {Array.from({ length: el.n ?? 18 }, (_, i) => {
        const a = (i / (el.n ?? 18)) * 360 + random(`ra${i}`) * 14;
        const len = (el.r1 ?? 420) * (0.55 + random(`rl${i}`) * 0.6);
        const d = random(`rd${i}`) * 6;
        const p = lerp(t, d, d + 9, 0, 1, Easing.out(Easing.back(1.4)));
        const r0 = (el.r0 ?? 180) * (0.85 + random(`r0${i}`) * 0.3);
        return <div key={i} style={{ position: "absolute", left: 0, top: -(el.thick ?? 16) / 2, width: len, height: el.thick ?? 16, background: col(th, el.color, "accent3"),
          transformOrigin: "0 50%", transform: `rotate(${a}deg) translateX(${r0 + (1 - p) * 60}px) scaleX(${p})`, opacity: p }} />;
      })}
    </div>
  );
};

// A cut-out that splits into horizontal bands which drift apart, showing a red interior with a yellow rim.
export const Slice: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const t0 = f - (el.at ?? 0);
  if (t0 < 0) return null;
  const n = el.bands ?? 3;
  const p = lerp(f, el.split, el.split + (el.dur ?? 16), 0, 1, eInOut);
  const st = entrance(el.anim ?? "pop", t0);
  const cuts = Array.from({ length: n + 1 }, (_, k) => (el.cuts?.[k] ?? k / n));
  return (
    <div style={{ position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h, ...st, transform: `${st.transform ?? ""} ${drift(el, f)}`, zIndex: el.z }}>
      {cuts.slice(0, -1).map((c0, k) => {
        const c1 = cuts[k + 1];
        const mid = k - (n - 1) / 2;
        const dy = mid * (el.gap ?? 120) * p - (k === 0 ? (el.lift ?? 60) * p : 0);
        const dx = (random(`sx${k}`) - 0.5) * 160 * p;
        const rot = (k % 2 ? 1 : -1) * (el.tilt ?? 14) * p * (0.6 + random(`sr${k}`) * 0.6);
        const rimW = el.w * (el.rim ?? 0.72), rimH = el.w * 0.2;
        return (
          <div key={k} style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, transformOrigin: `50% ${((c0 + c1) / 2) * 100}%` }}>
            <Img src={staticFile(el.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", clipPath: `inset(${c0 * 100}% 0 ${(1 - c1) * 100}% 0)`, filter: `${FILTERS[el.filter ?? "gray"]} drop-shadow(0 12px 14px rgba(0,0,0,0.25))` }} />
            {k < n - 1 && p > 0.02 && (
              <div style={{ position: "absolute", left: (el.w - rimW) / 2, top: c1 * el.h - rimH / 2, width: rimW, height: rimH, borderRadius: "50%",
                background: `radial-gradient(ellipse at 50% 45%, ${col(th, "accent")} 0 55%, #A0100C 85%)`, border: `${rimH * 0.13}px solid ${col(th, "accent2")}`,
                transform: `scaleY(${Math.min(1, p * 1.5)})`, boxSizing: "border-box" }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// Nested outline frames rushing toward the camera (a corridor of picture frames).
export const Frames: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const t = f - (el.at ?? 0);
  if (t < 0) return null;
  const n = el.n ?? 5;
  return (
    <>
      {Array.from({ length: n }, (_, k) => {
        const phase = ((t * (el.speed ?? 0.018)) + k / n) % 1;
        const s = 0.25 * Math.pow(10, phase * 1.15);
        const w = 900 * s, h = 620 * s;
        const o = interpolate(phase, [0, 0.1, 0.8, 1], [0, 1, 1, 0]);
        return <div key={k} style={{ position: "absolute", left: el.x - w / 2 + (k % 2 ? 1 : -1) * 30 * s, top: el.y - h / 2, width: w, height: h, border: `${Math.max(3, 6 * s)}px solid ${col(th, el.color, "light")}`, opacity: o * (el.opacity ?? 0.9), zIndex: el.z }} />;
      })}
    </>
  );
};

/* ---------------- HUD ---------------- */

// A small torn-paper badge with a live counter that keeps running across beats.
export const Hud: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  if (f < el.at || (el.until !== undefined && f >= el.until)) return null;
  const v = (el.start ?? 0) + ((f - el.at) / FPS) * el.rate;
  const p = lerp(f, el.at, el.at + 8, 0, 1, Easing.out(Easing.back(1.4)));
  return (
    <div style={{ position: "absolute", right: 60, top: 40, background: col(th, "paper"), padding: "10px 22px 12px", transform: `rotate(1.5deg) scale(${p})`, transformOrigin: "right top",
      clipPath: "polygon(0 6%, 12% 0, 30% 5%, 52% 0, 75% 6%, 100% 0, 99% 92%, 82% 100%, 60% 95%, 38% 100%, 18% 94%, 1% 100%)", boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
      <div style={{ ...FONTS.courier, fontSize: 15, letterSpacing: "0.14em", color: col(th, "muted"), textAlign: "center" }}>{el.label}</div>
      <div style={{ ...FONTS.anton, fontSize: 40, color: col(th, "ink"), textAlign: "center", lineHeight: 1.05 }}>{`${el.prefix ?? ""}${fmt(v, 0)}${el.suffix ?? ""}`}</div>
    </div>
  );
};
