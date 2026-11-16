import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GERALD_FORD } from "./characters";
import { HandShape, SheetPuppet } from "./SheetPuppet";

// Attachment check sheet: every hand shape, both sides, a sweep of arm angles.
// Frame N picks the sweep step, so scrubbing shows hands staying glued while arms move.
const HANDS: HandShape[] = ["relaxed", "open", "point", "grip"];
const SWEEP = [[30, -10], [70, -20], [110, 20], [150, 30], [45, -100], [90, 60]] as const;

export const HandTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#f3ead8" }}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
        {HANDS.map((h, i) =>
          SWEEP.map(([sh, el], j) => (
            <SheetPuppet key={`${h}${j}`} rig={GERALD_FORD} x={170 + j * 320} y={250 + i * 265} scale={0.62}
              armL={{ shoulder: sh + Math.sin(f / 6) * 15, elbow: el, hand: h }}
              armR={{ shoulder: sh + Math.sin(f / 6 + 1) * 15, elbow: el, hand: h }} />
          )),
        )}
      </svg>
    </AbsoluteFill>
  );
};
