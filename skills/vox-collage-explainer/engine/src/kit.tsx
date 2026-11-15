import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cancelRender, continueRender, delayRender, Easing, Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const EASE: Record<string, (t: number) => number> = {
  linear: Easing.linear,
  in: Easing.in(Easing.quad),
  out: Easing.out(Easing.quad),
  inout: Easing.inOut(Easing.quad),
  outcubic: Easing.out(Easing.cubic),
  sin: Easing.inOut(Easing.sin),
};

export const progress = (frame: number, from: number, to: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [from, to], [0, 1], { ...clamp, easing: ease });

// Stop-motion: hold every pose for `every` frames, like animating on twos.
export const useStepped = (every = 2) => {
  const f = useCurrentFrame();
  return Math.floor(f / every) * every;
};

// Small per-step offset so pieces sit like hand-placed paper. Callers pass a slow step.
export const boil = (key: string, step: number, amp = 1.5) => ({
  x: (random(`${key}x${step}`) - 0.5) * 2 * amp,
  y: (random(`${key}y${step}`) - 0.5) * 2 * amp,
  r: (random(`${key}r${step}`) - 0.5) * amp * 0.3,
});

export const Tex: React.FC<{ src: string; style?: React.CSSProperties }> = ({ src, style }) => (
  <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }} />
);

// Types text on one character at a time, starting at `from`.
export const Typed: React.FC<{ text: string; from: number; cps?: number; style?: React.CSSProperties }> = ({
  text, from, cps = 2, style,
}) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - from) * cps)));
  return (
    <div style={{ whiteSpace: "pre", ...style }}>
      {text.slice(0, n)}
      <span style={{ opacity: 0 }}>{text.slice(n)}</span>
    </div>
  );
};

/* ---------- p5.brush layers ---------- */

type Pt = number[];
export type Layer = { id: string; x: number; y: number; w: number; h: number; kind: string; strokes: Pt[][]; reveal?: number };
const Layers = createContext<Record<string, Layer>>({});
export const LayersProvider: React.FC<{ layers: Layer[]; children: React.ReactNode }> = ({ layers, children }) => (
  <Layers.Provider value={Object.fromEntries(layers.map((l) => [l.id, l]))}>{children}</Layers.Provider>
);

const pathLen = (pts: Pt[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

// Decoded brush PNGs, shared by every frame a render tab draws.
const images = new Map<string, Promise<HTMLImageElement>>();
const loaded = new Map<string, HTMLImageElement>();
const load = (src: string) => {
  if (!images.has(src)) {
    images.set(src, new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => { loaded.set(src, im); res(im); };
      im.onerror = () => rej(new Error(`could not load ${src}`));
      im.src = src;
    }));
  }
  return images.get(src)!;
};

/**
 * A p5.brush render placed at its position and revealed along the same path the brush followed.
 * Three renders of each layer are cycled slowly so the line breathes like hand-drawn animation.
 * Drawn on a canvas: the three PNGs are loaded under delayRender when the layer mounts, so no frame
 * is ever captured before its image is ready.
 */
export const BrushLayer: React.FC<{
  id: string; from: number; to: number; until?: number; ease?: string; boilEvery?: number;
}> = ({ id, from, to, until = Infinity, ease = "inout", boilEvery = 8 }) => {
  const frame = useCurrentFrame();
  const l = useContext(Layers)[id];
  const srcs = useMemo(() => [1, 2, 3].map((s) => staticFile(`brush/a_${id}_${s}.png`)), [id]);
  const [handle] = useState(() => delayRender(`brush ${id}`));
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    Promise.all(srcs.map(load)).then(() => { setReady(true); continueRender(handle); }, (e) => cancelRender(e));
  }, [srcs, handle]);

  const p = !l ? 0 : to <= from ? (frame >= from ? 1 : 0) : progress(frame, from, to, EASE[ease] ?? EASE.inout);
  const visible = ready && p > 0 && frame < until;
  const seed = Math.floor(frame / boilEvery) % 3;

  useLayoutEffect(() => {
    const c = ref.current;
    if (!c || !l) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, l.w, l.h);
    const im = loaded.get(srcs[seed]);
    if (!visible || !im) return;
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(im, 0, 0, l.w, l.h);
    if (p >= 1) return;
    // keep only what the brush has "reached": stroke the reveal path partway with a wide round pen
    ctx.globalCompositeOperation = "destination-in";
    ctx.lineWidth = l.reveal ?? 60; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#000";
    const lens = l.strokes.map(pathLen);
    let budget = p * lens.reduce((a, b) => a + b, 0);
    ctx.beginPath();
    l.strokes.forEach((pts, i) => {
      const show = Math.max(0, Math.min(lens[i], budget));
      budget -= lens[i];
      if (show <= 0) return;
      let left = show;
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let k = 1; k < pts.length && left > 0; k++) {
        const [x0, y0] = pts[k - 1], [x1, y1] = pts[k];
        const seg = Math.hypot(x1 - x0, y1 - y0) || 1e-6;
        const f = Math.min(1, left / seg);
        ctx.lineTo(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f);
        left -= seg;
      }
      if (show < 1) ctx.lineTo(pts[0][0] + 0.1, pts[0][1]);
    });
    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";
  });

  if (!l) return null;
  return <canvas ref={ref} width={l.w} height={l.h} style={{ position: "absolute", left: l.x, top: l.y }} />;
};
