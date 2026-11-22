import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { VicePresidents1, VP1_DURATION } from "./VP1";
import { VicePresidents2, VP2_DURATION } from "./VP2";
import { VicePresidents3, VP3_DURATION } from "./VP3";
import { VicePresidents4, VP4_DURATION } from "./VP4";
import { VicePresidents5, VP5_DURATION } from "./VP5";

/**
 * The whole film on ONE continuous voiceover (public/tg2/vo/vp_full.mp3, the narrator's master file).
 * Each part's VO is a slice of the master starting at START[i] seconds, so each part is placed at exactly
 * that offset and runs until the next part begins: no gaps or doubled pauses at the joins (skill rule 32).
 */
const START = [0.02, 113.66, 220.02, 327.32, 442.06];
const PARTS = [VicePresidents1, VicePresidents2, VicePresidents3, VicePresidents4, VicePresidents5];
const DUR = [VP1_DURATION, VP2_DURATION, VP3_DURATION, VP4_DURATION, VP5_DURATION];
const F = (s: number) => Math.round(s * 30);
export const VP_FULL_DURATION = F(START[4]) + DUR[4];

export const VicePresidentsFull: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {PARTS.map((P, i) => {
      const from = F(START[i]);
      const to = i + 1 < PARTS.length ? F(START[i + 1]) : VP_FULL_DURATION;
      return <Sequence key={i} from={from} durationInFrames={Math.min(DUR[i], to - from)}><P noAudio /></Sequence>;
    })}
    <Audio src={staticFile("tg2/vo/vp_full.mp3")} />
  </AbsoluteFill>
);
