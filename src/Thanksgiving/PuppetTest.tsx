import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ARMS, LayerPuppet, QuillPuppet } from "./LayerPuppet";

const CAST = ["george_washington", "elias_boudinot", "debtor", "congressional_delegate", "john_adams", "thomas_jefferson", "levi_lincoln_sr", "james_madison", "sarah_josepha_hale", "abraham_lincoln", "zachary_taylor", "millard_fillmore", "franklin_pierce", "james_buchanan"];
export const PuppetTest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#efe6d4" }}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
        {CAST.map((c, i) => (
          <LayerPuppet key={c} char={c} x={140 + (i % 7) * 260} y={i < 7 ? 500 : 1040} height={430}
            armL={i % 3 === 0 ? ARMS.rest : i % 3 === 1 ? ARMS.open : ARMS.hips} armR={i % 2 ? ARMS.wave : ARMS.point}
            talk={f % 20 < 10} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
export const QuillTest: React.FC = () => (
  <AbsoluteFill style={{ background: "#efe6d4" }}>
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
      <QuillPuppet x={500} y={950} height={700} />
      <QuillPuppet x={1300} y={950} height={700} wings="open" gesture={10} />
    </svg>
  </AbsoluteFill>
);
