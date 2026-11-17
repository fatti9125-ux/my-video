import React from "react";
import { AbsoluteFill } from "remotion";
import * as B from "../Thanksgiving/Backgrounds";
import { Rig, ShotCtx } from "./Kit";

export const WalkTest: React.FC = () => (
  <AbsoluteFill>
    <ShotCtx.Provider value={{ offset: 112 }}>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
        <B.Defs /><B.FederalHall />
        <Rig c="george_washington" pose="solemn_with_quill" x={150} y={980} h={430} walk={1} />
        <Rig c="elias_boudinot" pose="offers_petition" x={150} y={560} h={300} walk={1} />
        <Rig c="sarah_josepha_hale" pose="determined_with_letter" x={1750} y={560} h={300} walk={-1} flip />
        <Rig c="thomas_jefferson" pose="refuses_arms_folded" x={1750} y={980} h={430} walk={-1} flip />
        <Rig c="john_adams" pose="announcing_arms_open" x={960} y={760} h={360} gesture={14} stress />
      </svg>
    </ShotCtx.Provider>
  </AbsoluteFill>
);
