// Renders a scene.json built by scripts/vox.py: a list of beats, each a z-ordered list of collage elements
// in 1920x1080 px with frame timings relative to the beat start. All layout decisions are made in Python;
// this file only knows how to draw each element type.
import React from "react";
import { AbsoluteFill, Audio, Easing, Freeze, Img, interpolate, interpolateColors, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { boil, BrushLayer, clamp, Layer, LayersProvider, progress, Tex, Typed, useStepped } from "./kit";
import { anton, caslon, elite, FONTS, marker } from "./fonts";
import { col, THEMES, ThemeCtx, useTheme } from "./theme";
import { Bar, Caption, Counter, Flip, Frames, Hud, Label, Leader, Line, Panel, Pic, Pill, Progress, Rays, Shape, Slice, Stamp, Units } from "./fx";

// Palette for the vox elements below. Other styles resolve colours through the theme (theme.ts).
const BOARD = "#E4DFD3";
const INK = "#1D1C20";
const YEL = "#EDBD2E";
const BEIGE = "#D8CBB0";
const PAPER = "#EEEAE1";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type El = Record<string, any>;
type Fx = { type: string; n?: number; at?: number[]; scale?: number };
type Beat = {
  start: number; end: number; dots?: boolean; push?: number; elements: El[]; top?: El[];
  bg?: string; bg_to?: string; bg_at?: number; dark?: boolean; grid?: boolean;
  cam?: { push?: number; pan?: number[]; tilt?: number[]; rot?: number };
  enter?: Fx; exit?: Fx;
};
export type Scene = {
  fps: number; width: number; height: number; duration: number; style?: string; hud?: El[];
  voice?: { src: string; start: number }; layers: Layer[]; beats: Beat[]; sfx: [string, number, number, number][];
};

/* ---------------- board, camera, overlay ---------------- */

const Board: React.FC<{ beat: Beat }> = ({ beat }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const base = col(th, beat.bg, beat.dark ? "dark" : "board");
  const bg = beat.bg_to ? interpolateColors(f, [beat.bg_at ?? 0, (beat.bg_at ?? 0) + 14], [base, col(th, beat.bg_to)]) : base;
  const dark = beat.dark || th.name === "cinematic";
  const grid = th.grid && !beat.dark && beat.grid !== false;
  return (
    <AbsoluteFill style={{ background: bg, ...(th.name === "vox" ? {} : { left: -160, top: -160, width: "calc(100% + 320px)", height: "calc(100% + 320px)" }) }}>
      <Tex src="tex/paper.jpg" style={{ mixBlendMode: dark ? "overlay" : "multiply", opacity: dark ? Math.min(1, th.tex * 1.6) : th.tex }} />
      {th.name === "cinematic" && <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 38%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 55%)" }} />}
      {grid && (
        <AbsoluteFill style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(40,40,40,0.16) 0 2px, transparent 2px ${th.grid}px), repeating-linear-gradient(90deg, rgba(40,40,40,0.16) 0 2px, transparent 2px ${th.grid}px)`,
        }} />
      )}
      {beat.dots && th.name === "vox" && (
        <AbsoluteFill style={{
          backgroundImage: "radial-gradient(circle, rgba(29,28,32,0.6) 1.7px, transparent 2.3px)",
          backgroundSize: "96px 96px", backgroundPosition: "30px 40px",
        }} />
      )}
    </AbsoluteFill>
  );
};

// Vox: slow stepped push-in with a little hand-held drift that only changes every 6 frames.
// Other styles: smooth push, optional pan and a 3D board tilt (popart).
const Camera: React.FC<{ id: string; children: React.ReactNode; beat: Beat; dur: number }> = ({ id, children, beat, dur }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const step = th.stepped ? Math.floor(f / 2) * 2 : f;
  const cam = beat.cam ?? {};
  const p = Math.min(1, step / dur);
  const pe = th.stepped ? p : Easing.inOut(Easing.sin)(p);
  const s = 1 + (cam.push ?? beat.push ?? th.push) * pe;
  const j = th.stepped ? boil(`cam${id}`, Math.floor(step / 6), 0.8) : { x: 0, y: 0, r: 0 };
  const pan = cam.pan ?? [0, 0];
  const tl = cam.tilt;
  const te = Easing.out(Easing.cubic)(Math.min(1, f / 24));
  const tilt = tl ? `perspective(2200px) rotateX(${tl[0] + (tl[2] - tl[0]) * te}deg) rotateY(${tl[1] + (tl[3] - tl[1]) * te}deg)` : "";
  return (
    <AbsoluteFill style={{ transform: `${tilt} translate(${j.x + pan[0] * pe}px, ${j.y + pan[1] * pe}px) scale(${s}) rotate(${j.r * 0.2 + (cam.rot ?? 0) * pe}deg)` }}>
      {children}
    </AbsoluteFill>
  );
};

// Grain + vignette over everything (plus the screen-print mesh for vox). The specks only move every 12 frames.
const PaperOverlay: React.FC = () => {
  const th = useTheme();
  const step = Math.floor(useCurrentFrame() / 12);
  const ox = Math.floor(random(`sx${step}`) * 200), oy = Math.floor(random(`sy${step}`) * 120);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {th.mesh && (
        <AbsoluteFill style={{
          mixBlendMode: "multiply",
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(70,60,45,0.05) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(70,60,45,0.05) 0 1px, transparent 1px 4px)",
        }} />
      )}
      <Tex src="tex/specks.jpg" style={{ mixBlendMode: "multiply", opacity: th.grain, transform: `scale(1.25) translate(${-ox / 5}px, ${-oy / 5}px)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at center, rgba(0,0,0,0) ${th.vignette > 0.3 ? 45 : 60}%, rgba(${th.name === "cinematic" ? "0,0,0" : "60,45,20"},${th.vignette}) 100%)` }} />
    </AbsoluteFill>
  );
};

/* ---------------- element types ---------------- */

// Something stuck down by hand: drops in slightly large on twos, then sits with a slow wobble.
const Slapped: React.FC<{ id: string; el: El; children: React.ReactNode; shadow?: boolean }> = ({ id, el, children, shadow = true }) => {
  const step = useStepped(2);
  const at = el.at ?? 0;
  if (step < at) return null;
  const s = interpolate(step - at, [0, 6], [1.08, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const b = boil(id, Math.floor(step / 6), 0.8);
  return (
    <div style={{
      position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h,
      transform: `translate(${b.x}px, ${b.y}px) rotate(${(el.rot ?? 0) + b.r}deg) scale(${s})`,
      filter: shadow ? "drop-shadow(0 10px 14px rgba(40,30,10,0.22))" : undefined,
    }}>{children}</div>
  );
};

const Cutout: React.FC<{ el: El; id: string }> = ({ el, id }) => {
  const step = useStepped(2);
  const wg = el.wiggle;
  let rot = 0;
  if (wg && step >= wg.from && step < wg.to) rot = [-6, 3, -3, 6, -5, 2][Math.floor(step / 4) % 6];
  return (
    <Slapped id={id} el={el}>
      <Img src={staticFile(el.src)} style={{ width: "100%", height: "100%" }} />
      {wg && (
        <Img src={staticFile(wg.src)} style={{
          position: "absolute", left: wg.x, top: wg.y, width: wg.w, height: wg.h,
          transformOrigin: `${wg.pivot[0] - wg.x}px ${wg.pivot[1] - wg.y}px`,
          transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 4px 5px rgba(40,30,10,0.3))",
        }} />
      )}
    </Slapped>
  );
};

const Grid: React.FC<{ el: El }> = ({ el }) => {
  const a = el.alpha ?? 0.32, p = el.pitch ?? 38;
  return (
    <div style={{
      position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h, transform: `rotate(${el.rot ?? 0}deg)`,
      backgroundImage: `repeating-linear-gradient(0deg, rgba(29,28,32,${a}) 0 1.5px, transparent 1.5px ${p}px), repeating-linear-gradient(90deg, rgba(29,28,32,${a}) 0 1.5px, transparent 1.5px ${p}px)`,
    }} />
  );
};

// A clipped newspaper column with a real headline and body copy.
const Clipping: React.FC<{ el: El; id: string }> = ({ el, id }) => (
  <Slapped id={id} el={el}>
    <div style={{
      position: "absolute", inset: 0, background: PAPER, padding: "22px 24px", color: "#2a2a2a", overflow: "hidden",
      clipPath: "polygon(0 0, 100% 1%, 99% 96%, 92% 98%, 84% 96%, 74% 99%, 63% 97%, 52% 100%, 40% 97%, 28% 99%, 16% 96%, 6% 99%, 0 97%)",
    }}>
      <Tex src="tex/paper.jpg" style={{ mixBlendMode: "multiply", opacity: 0.4 }} />
      <div style={{ position: "relative", fontFamily: caslon, fontWeight: 700, fontSize: el.hsize ?? 30, lineHeight: 1.05, textTransform: "uppercase" }}>
        {el.headline}
      </div>
      <div style={{ position: "relative", height: 1, background: "#2a2a2a", margin: "10px 0 8px" }} />
      {el.dek && <div style={{ position: "relative", fontFamily: caslon, fontStyle: "italic", fontSize: 17, marginBottom: 8 }}>{el.dek}</div>}
      <div style={{ position: "relative", fontFamily: caslon, fontSize: 14, lineHeight: 1.35, columnCount: 2, columnGap: 16, textAlign: "justify" }}>
        {el.body}
      </div>
    </div>
  </Slapped>
);

// Yellow label with typewriter text, like a strip of tape written on.
const Tag: React.FC<{ el: El }> = ({ el }) => {
  const step = useStepped(2);
  if (step < el.at) return null;
  return (
    <div style={{
      position: "absolute", left: el.x, top: el.y, background: YEL, padding: "6px 14px 4px", transform: `rotate(${el.rot ?? -2}deg)`,
      fontFamily: elite, fontSize: el.size ?? 24, letterSpacing: "0.14em", color: INK, whiteSpace: "pre",
      boxShadow: "0 2px 3px rgba(40,30,10,0.18)",
    }}>
      <Typed text={el.text} from={el.at} cps={3} />
    </div>
  );
};

const TypedLines: React.FC<{ el: El }> = ({ el }) => {
  const th = useTheme();
  return (
  <div style={{
    position: "absolute", left: el.x, top: el.y, color: col(th, el.color, "ink"),
    textAlign: el.align ?? "left", transform: el.align === "center" ? "translateX(-50%)" : undefined,
  }}>
    {el.lines.map((ln: El, i: number) => (
      <Typed key={i} text={ln.text} from={ln.at} cps={el.cps ?? 2}
        style={{ ...FONTS[el.font ?? "serif"], fontSize: el.size, lineHeight: el.lh ?? 1.12 }} />
    ))}
  </div>
  );
};

// Marker handwriting revealed left to right.
const Hand: React.FC<{ el: El }> = ({ el }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, el.from, el.to, Easing.linear);
  if (p <= 0) return null;
  return (
    <div style={{
      position: "absolute", left: el.x, top: el.y, fontFamily: marker, fontSize: el.size, color: INK, whiteSpace: "pre",
      lineHeight: 1.05, transform: `rotate(${el.rot ?? -3}deg)`, clipPath: `inset(-30% ${(1 - p) * 110 - 10}% -30% -5%)`,
    }}>{el.text}</div>
  );
};

// Ransom-note letters cut from different papers, stuck down one per frame.
const Ransom: React.FC<{ el: El }> = ({ el }) => {
  const step = useStepped(1);
  const styles: React.CSSProperties[] = [
    { background: INK, color: "#F1EDE4", fontFamily: caslon, fontWeight: 700 },
    { background: "#F1EDE4", color: INK, fontFamily: anton },
    { background: YEL, color: INK, fontFamily: caslon, fontWeight: 700 },
    { background: "#F1EDE4", color: INK, fontFamily: elite },
    { background: INK, color: YEL, fontFamily: anton },
  ];
  const chars: string[] = Array.from(el.text);
  return (
    <div style={{
      position: "absolute", left: el.x, top: el.y, display: "flex", alignItems: "flex-end", gap: Math.round(el.size * 0.05),
      transform: el.align === "center" ? "translateX(-50%)" : undefined,
    }}>
      {chars.map((ch, i) => {
        const at = el.at + i;
        if (ch === " ") return <div key={i} style={{ width: el.size * 0.35 }} />;
        if (step < at) return <div key={i} style={{ visibility: "hidden", fontFamily: anton, fontSize: el.size, padding: "8px 10px 4px" }}>{ch}</div>;
        const st = styles[(i * 3 + 1) % styles.length];
        const rot = (random(`rr${el.text}${i}`) - 0.5) * 12;
        const dy = (random(`ry${el.text}${i}`) - 0.5) * el.size * 0.18;
        const pop = interpolate(step - at, [0, 3], [1.25, 1], clamp);
        return (
          <div key={i} style={{
            ...st, fontSize: el.size * (0.9 + random(`rs${el.text}${i}`) * 0.22), lineHeight: 1, padding: `${el.size * 0.1}px ${el.size * 0.13}px ${el.size * 0.05}px`,
            transform: `translateY(${dy}px) rotate(${rot}deg) scale(${pop})`, boxShadow: "0 3px 4px rgba(40,30,10,0.25)",
          }}>{ch}</div>
        );
      })}
    </div>
  );
};

// Beige sheet with a torn left edge.
const Sheet: React.FC<{ el: El }> = ({ el }) => (
  <div style={{
    position: "absolute", left: el.x, top: el.y, width: el.w, height: el.h, background: el.color === "paper" ? PAPER : BEIGE,
    clipPath: "polygon(2% 0, 100% 0, 100% 100%, 0 100%, 1.5% 90%, 0.4% 80%, 2.2% 70%, 0.6% 60%, 2% 50%, 0.3% 40%, 1.8% 30%, 0.5% 20%, 2.4% 10%)",
    filter: "drop-shadow(-6px 0 10px rgba(40,30,10,0.2))",
  }}>
    <Tex src="tex/paper.jpg" style={{ mixBlendMode: "multiply", opacity: 0.45 }} />
  </div>
);

// A big sheet of warm paper that slides in from the right with its torn edge leading; optional graph grid.
const Slide: React.FC<{ el: El }> = ({ el }) => {
  const frame = useCurrentFrame();
  const at = el.at ?? 0;
  const left = interpolate(frame, [at, at + 7], [2000, 70], { ...clamp, easing: Easing.out(Easing.cubic) });
  const torn = Array.from({ length: 24 }, (_, i) => `${(random(`torn${i}`) * 2.2).toFixed(2)}% ${(100 - i * 100 / 23).toFixed(2)}%`);
  return (
    <div style={{ position: "absolute", left, top: -60, width: 1960, height: 1200, filter: "drop-shadow(-10px 0 14px rgba(40,30,10,0.25))" }}>
      <div style={{ position: "absolute", inset: 0, background: "#ECE8DE", clipPath: `polygon(3% 0, 100% 0, 100% 100%, ${torn.join(", ")})` }}>
        <Tex src="tex/paper.jpg" style={{ mixBlendMode: "multiply", opacity: 0.35 }} />
        {el.grid && (
          <div style={{
            position: "absolute", left: 80, top: 0, right: 0, bottom: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(29,28,32,0.2) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, rgba(29,28,32,0.2) 0 1px, transparent 1px 32px)",
          }} />
        )}
      </div>
    </div>
  );
};

// Ink dots on data points, stamped in one after another.
const Dots: React.FC<{ el: El }> = ({ el }) => {
  const step = useStepped(2);
  return (
    <>
      {el.pts.map((p: number[], i: number) => step >= el.at + i * (el.every ?? 1) ? (
        <div key={i} style={{
          position: "absolute", left: p[0] - el.r, top: p[1] - el.r, width: el.r * 2, height: el.r * 2, borderRadius: "50%",
          background: INK, boxShadow: `0 0 0 3px ${BOARD}`,
        }} />
      ) : null)}
    </>
  );
};

const Element: React.FC<{ el: El; id: string }> = ({ el, id }) => {
  switch (el.t) {
    case "grid": return <Grid el={el} />;
    case "clipping": return <Clipping el={el} id={id} />;
    case "cutout": return <Cutout el={el} id={id} />;
    case "brush": return <BrushLayer id={el.id} from={el.from} to={el.to} until={el.until} ease={el.ease} />;
    case "tag": return <Tag el={el} />;
    case "typed": return <TypedLines el={el} />;
    case "hand": return <Hand el={el} />;
    case "ransom": return <Ransom el={el} />;
    case "sheet": return <Sheet el={el} />;
    case "slide": return <Slide el={el} />;
    case "dots": return <Dots el={el} />;
    case "pic": return <Pic el={el} />;
    case "shape": return <Shape el={el} />;
    case "caption": return <Caption el={el} />;
    case "counter": return <Counter el={el} />;
    case "flip": return <Flip el={el} />;
    case "bar": return <Bar el={el} />;
    case "stamp": return <Stamp el={el} />;
    case "progress": return <Progress el={el} />;
    case "line": return <Line el={el} />;
    case "label": return <Label el={el} />;
    case "leader": return <Leader el={el} />;
    case "panel": return <Panel el={el} />;
    case "pill": return <Pill el={el} />;
    case "units": return <Units el={el} />;
    case "rays": return <Rays el={el} />;
    case "slice": return <Slice el={el} />;
    case "frames": return <Frames el={el} />;
    default: return null;
  }
};

// One beat, with its own exit effect (zoom-through, blur, light-down) and self-applied entrance (zoom, blur).
const BeatContent: React.FC<{ beat: Beat; index: number }> = ({ beat, index }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const dur = beat.end - beat.start;
  const tf: string[] = [], fl: string[] = [];
  let origin = "50% 50%";
  const ex = beat.exit;
  if (ex) {
    const n = ex.n ?? 8;
    const p = interpolate(f, [dur - n, dur], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
    if (ex.type === "zoom") { tf.push(`scale(${1 + (ex.scale ?? 7) * p})`); fl.push(`blur(${p * 5}px)`); if (ex.at) origin = `${ex.at[0]}px ${ex.at[1]}px`; }
    if (ex.type === "blur") fl.push(`blur(${p * 30}px) brightness(${1 + p * 0.35})`);
    if (ex.type === "dark") fl.push(`brightness(${1 - p * 0.9})`);
  }
  const en = beat.enter;
  if (en) {
    const n = en.n ?? 8;
    const p = interpolate(f, [0, n], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    if (en.type === "zoom") tf.push(`scale(${1.3 - 0.3 * p})`);
    if (en.type === "blur") fl.push(`blur(${(1 - p) * 30}px) brightness(${1 + (1 - p) * 0.35})`);
  }
  const vox = th.name === "vox";
  const els = beat.elements.map((el, k) => <Element key={k} el={el} id={`b${index}e${k}`} />);
  return (
    <AbsoluteFill style={{ transform: tf.join(" ") || undefined, transformOrigin: origin, filter: fl.join(" ") || undefined, overflow: "hidden" }}>
      {vox && <Board beat={beat} />}
      <Camera id={`b${index}`} dur={dur} beat={beat}>
        {!vox && <Board beat={beat} />}
        {els}
      </Camera>
      <PaperOverlay />
      {(beat.top ?? []).map((el, k) => <Element key={k} el={el} id={`b${index}t${k}`} />)}
    </AbsoluteFill>
  );
};

const TORN = `polygon(3% 0, 100% 0, 100% 100%, ${Array.from({ length: 24 }, (_, i) => `${(random(`torn${i}`) * 2.2).toFixed(2)}% ${(100 - i * 100 / 23).toFixed(2)}%`).join(", ")})`;

// Transitions that show the previous beat (frozen on its last frame) underneath the new one.
const BeatView: React.FC<{ beat: Beat; index: number; prev?: Beat }> = ({ beat, index, prev }) => {
  const th = useTheme();
  const f = useCurrentFrame();
  const en = beat.enter;
  const self = <BeatContent beat={beat} index={index} />;
  const n = en?.n ?? 10;
  if (!en || !prev || f >= n || !["slide", "iris", "shape", "glitch"].includes(en.type)) return self;
  const under = <Freeze frame={prev.end - prev.start - 1}><BeatContent beat={prev} index={index - 1} /></Freeze>;
  const p = interpolate(f, [0, n], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  if (en.type === "slide") {
    return (
      <AbsoluteFill>
        {under}
        <AbsoluteFill style={{ transform: `translateX(${(1 - Easing.out(Easing.cubic)(f / n)) * 2050}px)`, filter: "drop-shadow(-14px 0 18px rgba(40,30,10,0.35))" }}>
          <AbsoluteFill style={{ clipPath: TORN }}>{self}</AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (en.type === "iris") {
    const c = en.at ?? [960, 540];
    return (
      <AbsoluteFill>
        {under}
        <AbsoluteFill style={{ clipPath: `circle(${p * 1250}px at ${c[0]}px ${c[1]}px)` }}>
          <AbsoluteFill style={{ transform: `rotate(${(1 - p) * -170}deg) scale(${1.35 - 0.35 * p})`, transformOrigin: `${c[0]}px ${c[1]}px` }}>{self}</AbsoluteFill>
        </AbsoluteFill>
        <AbsoluteFill style={{ clipPath: `circle(${p * 1250 + 26}px at ${c[0]}px ${c[1]}px)`, WebkitMaskImage: `radial-gradient(circle at ${c[0]}px ${c[1]}px, transparent ${p * 1250}px, black ${p * 1250 + 1}px)`, background: col(th, "dark"), opacity: 1 - p }} />
      </AbsoluteFill>
    );
  }
  if (en.type === "shape") {
    const e = 2600 - p * 3400;           // leading edge moves right -> left, slanted
    const band = 190;
    return (
      <AbsoluteFill>
        {under}
        <AbsoluteFill style={{ clipPath: `polygon(${e}px 0, 2100px 0, 2100px 1080px, ${e - 560}px 1080px)` }}>{self}</AbsoluteFill>
        <AbsoluteFill style={{ background: col(th, en.at ? undefined : "accent"), clipPath: `polygon(${e - band}px 0, ${e}px 0, ${e - 560}px 1080px, ${e - 560 - band}px 1080px)` }} />
      </AbsoluteFill>
    );
  }
  // glitch: horizontal strips switch from the old beat to the new one at random moments, sliding sideways
  const K = 14;
  return (
    <AbsoluteFill style={{ background: "#111" }}>
      {Array.from({ length: K }, (_, i) => {
        const top = (i / K) * 100, bot = 100 - ((i + 1) / K) * 100;
        const sw = random(`gs${i}`) * n * 0.75;
        const dx = (random(`gx${i}`) - 0.5) * 700;
        const old = f < sw;
        const off = old ? dx * (f / Math.max(1, sw)) : dx * (1 - (f - sw) / Math.max(1, n - sw));
        const bar = random(`gb${i}${Math.floor(f / 2)}`) < 0.18;
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(${top}% 0 ${bot}% 0)`, transform: `translateX(${off}px)` }}>
            {old ? under : self}
            {bar && <AbsoluteFill style={{ background: random(`gc${i}`) < 0.5 ? "#151515" : "#8a8a8a", opacity: 0.85, transform: `translateX(${random(`gw${i}`) * 1400}px)` }} />}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

export const Main: React.FC<Scene> = (scene) => (
  <ThemeCtx.Provider value={THEMES[scene.style ?? "vox"] ?? THEMES.vox}>
    <LayersProvider layers={scene.layers}>
      <AbsoluteFill style={{ background: (THEMES[scene.style ?? "vox"] ?? THEMES.vox).board, overflow: "hidden" }}>
        {scene.beats.map((b, i) => (
          <Sequence key={i} from={b.start} durationInFrames={Math.max(1, b.end - b.start)}><BeatView beat={b} index={i} prev={scene.beats[i - 1]} /></Sequence>
        ))}
        {(scene.hud ?? []).map((el, i) => <Hud key={`h${i}`} el={el} />)}
        {scene.voice && <Sequence from={scene.voice.start}><Audio src={staticFile(scene.voice.src)} /></Sequence>}
        {scene.sfx.map(([name, at, len, vol], i) => (
          <Sequence key={`s${i}`} from={at} durationInFrames={len}>
            <Audio src={staticFile(`audio/sfx_${name}.mp3`)} volume={(f) => vol * interpolate(f, [len - 6, len], [1, 0], clamp)} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </LayersProvider>
  </ThemeCtx.Provider>
);
