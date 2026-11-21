import React from "react";
import { Series } from "remotion";
import { Thanksgiving3, TG3_DURATION } from "./index";
import { CH4_6_DURATION, ThanksgivingCh4to6 } from "./Ch4to6";
import { CH7_DURATION, ThanksgivingCh7 } from "./Ch7";
import { CH8_10_DURATION, ThanksgivingCh8to10 } from "./Ch8to10";
import { CH11_13_DURATION, ThanksgivingCh11to13 } from "./Ch11to13";
import { CH14_END_DURATION, ThanksgivingCh14toEnd } from "./Ch14toEnd";

/** The whole film: cold open + ch1-3, ch4-6, ch7-9, ch11-13, ch14-16 + ending. */
const PARTS: [React.FC, number][] = [
  [Thanksgiving3, TG3_DURATION], [ThanksgivingCh4to6, CH4_6_DURATION], [ThanksgivingCh7, CH7_DURATION], [ThanksgivingCh8to10, CH8_10_DURATION],
  [ThanksgivingCh11to13, CH11_13_DURATION], [ThanksgivingCh14toEnd, CH14_END_DURATION],
];
export const FINAL_DURATION = PARTS.reduce((a, [, d]) => a + d, 0);
export const ThanksgivingFinal: React.FC = () => (
  <Series>{PARTS.map(([C, d], i) => <Series.Sequence key={i} durationInFrames={d}><C /></Series.Sequence>)}</Series>
);
