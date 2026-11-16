import React, { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

/**
 * Cut-out puppet built from parts cut off a character sheet
 * (see .claude/skills/2d-animation/scripts/extract_parts.py).
 *
 * Coordinate system: units match the sheet's full-body FRONT pose (~380 tall),
 * origin = between the feet on the ground, y up is negative.
 * Head and torso are PNGs; limbs are drawn as ink strokes (2-bone) like the sheets,
 * hands are PNG stroke-hands rotated to the forearm.
 */
export type HandShape = "relaxed" | "open" | "point" | "grip" | "none";
export type ArmPose = { shoulder: number; elbow: number; hand?: HandShape }; // degrees; 0 = hanging straight down, + = swing outward/up
export type RigDef = {
  dir: string;                       // folder under public/
  partScale: number;                 // sheet-part px -> pose units
  heads: Record<string, string>;     // expression -> file (no .png)
  torsos: Record<string, string>;    // view -> file
  headSize: [number, number];        // head PNG size (all expressions share it; chin = bottom centre)
  torsoSize: [number, number];       // torso PNG size
  torsoTop: number;                  // y of torso image top
  chinY: number;                     // y where the head's bottom (chin) sits
  headOffsetX?: number;
  shoulderX: number; shoulderY: number;
  upperArm: number; foreArm: number;
  hipX: number; hipY: number; thigh: number; shin: number;
  line: number; ink?: string;
  hands?: Partial<Record<HandShape, string>>;
  handPointsUp?: HandShape[];        // hand PNGs drawn fingers-up in the sheet (others are fingers-down)
  handSize?: number;                 // hand width in puppet units
};

export type PuppetProps = {
  rig: RigDef;
  x: number; y: number; scale?: number; flip?: boolean;
  view?: string; head?: string;
  headTilt?: number; bob?: number; lean?: number;
  armL?: ArmPose; armR?: ArmPose;
  walk?: number;                     // walk phase (radians); undefined = standing
  props?: React.ReactNode;           // extra SVG/HTML drawn in front of the torso (puppet units)
};

const rad = (d: number) => (d * Math.PI) / 180;

const Limb: React.FC<{ x: number; y: number; a1: number; a2: number; l1: number; l2: number; w: number; ink: string; foot?: number }> = ({ x, y, a1, a2, l1, l2, w, ink, foot }) => {
  // angles measured from straight down; positive rotates toward +x
  const ex = x + Math.sin(rad(a1)) * l1, ey = y + Math.cos(rad(a1)) * l1;
  const wx = ex + Math.sin(rad(a1 + a2)) * l2, wy = ey + Math.cos(rad(a1 + a2)) * l2;
  return (
    <g>
      {/* quadratic whose curve passes through the elbow/knee: control = 2*joint - midpoint(ends) */}
      <path d={`M ${x} ${y} Q ${2 * ex - (x + wx) / 2} ${2 * ey - (y + wy) / 2} ${wx} ${wy}`} fill="none" stroke={ink} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      {foot !== undefined && <path d={`M ${wx} ${wy} l ${foot * 16} 3`} stroke={ink} strokeWidth={w} strokeLinecap="round" />}
    </g>
  );
};

export const armEnd = (sx: number, sy: number, p: ArmPose, l1: number, l2: number, side: -1 | 1) => {
  const a1 = p.shoulder * side, a2 = p.elbow * side;
  const ex = sx + Math.sin(rad(a1)) * l1, ey = sy + Math.cos(rad(a1)) * l1;
  return { x: ex + Math.sin(rad(a1 + a2)) * l2, y: ey + Math.cos(rad(a1 + a2)) * l2, angle: a1 + a2 };
};

export const SheetPuppet: React.FC<PuppetProps> = ({
  rig, x, y, scale = 1, flip = false, view = "front", head = "neutral", headTilt = 0, bob = 0, lean = 0,
  armL = { shoulder: 12, elbow: 0, hand: "relaxed" }, armR = { shoulder: 12, elbow: 0, hand: "relaxed" }, walk, props,
}) => {
  usePreload(rig);
  const ink = rig.ink ?? "#1b1b1b";
  const torsoSrc = staticFile(`${rig.dir}/${rig.torsos[view] ?? Object.values(rig.torsos)[0]}.png`);
  const headSrc = staticFile(`${rig.dir}/${rig.heads[head] ?? Object.values(rig.heads)[0]}.png`);
  const s = rig.partScale;
  const step = walk === undefined ? 0 : Math.sin(walk) * 22;
  const lift = walk === undefined ? 0 : Math.abs(Math.cos(walk)) * -4;

  const arm = (side: -1 | 1, p: ArmPose) => {
    const sx = side * rig.shoulderX, sy = rig.shoulderY;
    const end = armEnd(sx, sy, p, rig.upperArm, rig.foreArm, side);
    const hand = p.hand && p.hand !== "none" ? rig.hands?.[p.hand] : undefined;
    const hs = rig.handSize ?? 22;
    return (
      <g>
        <Limb x={sx} y={sy} a1={p.shoulder * side} a2={p.elbow * side} l1={rig.upperArm} l2={rig.foreArm} w={rig.line} ink={ink} />
        {hand && (
          <g transform={`translate(${end.x} ${end.y}) rotate(${-end.angle}) scale(${side === -1 ? -1 : 1} 1)`}>
            <g transform={`rotate(${rig.handPointsUp?.includes(p.hand!) ? 180 : 0} 0 ${hs / 2})`}>
              <image href={staticFile(`${rig.dir}/${hand}.png`)} x={-hs / 2} y={-2} width={hs} height={hs} preserveAspectRatio="xMidYMin meet" />
            </g>
          </g>
        )}
      </g>
    );
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      {/* legs */}
      <Limb x={-rig.hipX} y={rig.hipY} a1={step} a2={-Math.max(0, step) * 0.6} l1={rig.thigh} l2={rig.shin} w={rig.line} ink={ink} foot={-1} />
      <Limb x={rig.hipX} y={rig.hipY} a1={-step} a2={-Math.max(0, -step) * 0.6} l1={rig.thigh} l2={rig.shin} w={rig.line} ink={ink} foot={1} />
      <g transform={`translate(0 ${bob + lift}) rotate(${lean} 0 ${rig.hipY})`}>
        {arm(-1, armL)}
        {arm(1, armR)}
        <image href={torsoSrc} x={(-rig.torsoSize[0] * s) / 2} y={rig.torsoTop} width={rig.torsoSize[0] * s} height={rig.torsoSize[1] * s} preserveAspectRatio="xMidYMin meet" />
        {props}
        <g transform={`rotate(${headTilt} 0 ${rig.chinY - 10})`}>
          <image href={headSrc} x={(rig.headOffsetX ?? 0) - (rig.headSize[0] * s) / 2} y={rig.chinY - rig.headSize[1] * s}
            width={rig.headSize[0] * s} height={rig.headSize[1] * s} preserveAspectRatio="xMidYMax meet" />
        </g>
      </g>
    </g>
  );
};

// SVG <image> isn't awaited by Remotion, so hold the render until every part of the rig is decoded.
const loaded = new Set<string>();
const usePreload = (rig: RigDef) => {
  const urls = [...Object.values(rig.heads), ...Object.values(rig.torsos), ...Object.values(rig.hands ?? {})]
    .map((f) => staticFile(`${rig.dir}/${f}.png`)).filter((u) => !loaded.has(u));
  const [handle] = useState(() => (urls.length ? delayRender(`Loading rig ${rig.dir}`) : null));
  useEffect(() => {
    if (handle === null) return;
    Promise.all(urls.map((u) => new Promise<void>((res) => { const i = new Image(); i.onload = i.onerror = () => { loaded.add(u); res(); }; i.src = u; })))
      .then(() => continueRender(handle));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);
};
