import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { MONTSERRAT } from "../fonts";
import { ARM_POSES, GERALD_FORD } from "./characters";
import { SheetPuppet } from "./SheetPuppet";

// Side-by-side check: original sheet pose (left) vs. rigged puppet (right).
export const RigTest: React.FC = () => {
  const f = useCurrentFrame();
  const talking = f >= 30 && f < 70;
  const head = f >= 70 && f < 90 ? "reaction" : talking && Math.floor(f / 5) % 2 === 0 ? "speaking" : "neutral";
  const wave = talking ? Math.sin(f / 4) * 12 : 0;
  const walking = f >= 90;
  return (
    <AbsoluteFill style={{ background: "#f3ead8" }}>
      <Img src={staticFile("characters/gerald-ford/pose_front.png")} style={{ position: "absolute", left: 260, top: 180, height: 840 }} />
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <SheetPuppet rig={GERALD_FORD} x={walking ? 1300 + (f - 90) * 4 : 1300} y={1010} scale={2.2} head={head}
          headTilt={Math.sin(f / 14) * 3} bob={Math.sin(f / 9) * 2}
          armL={walking ? ARM_POSES.down : ARM_POSES.hips}
          armR={talking ? { ...ARM_POSES.wave, shoulder: 125 + wave } : walking ? ARM_POSES.down : ARM_POSES.hips}
          walk={walking ? f * 0.35 : undefined} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 48, color: "#222" }}>
        SHEET POSE &nbsp;·&nbsp; RIGGED PUPPET ({interpolate(f, [0, 119], [0, 4]).toFixed(1)}s)
      </div>
    </AbsoluteFill>
  );
};
