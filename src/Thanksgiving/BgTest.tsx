import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import * as B from "./Backgrounds";
const LIST = [B.Studio, B.FederalHall, B.Chamber, B.Study, B.Chapel, B.Prison, B.Hills, B.Village, B.EditorOffice, B.LincolnOffice];
export const BgTest: React.FC = () => {
  const f = useCurrentFrame();
  const Bg = LIST[f % LIST.length];
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}><B.Defs /><Bg /><B.Finish /></svg>
    </AbsoluteFill>
  );
};
