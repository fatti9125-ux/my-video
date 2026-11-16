import React from "react";
import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { ShotRunner, FPS, Shot } from "./core";
import { CH1_END, CH1_SHOTS } from "./Chapter1";
import { CH2_END, CH2_SHOTS } from "./Chapter2";
import { CH3_END, CH3_SHOTS } from "./Chapter3";

// "Every President's Thanksgiving Explained" — chapters 1–3 (cold open skipped for now).
const Chapter: React.FC<{ ch: string; shots: Shot[]; end: number }> = ({ ch, shots, end }) => (
  <AbsoluteFill>
    <ShotRunner ch={ch} shots={shots} end={end} />
    <Audio src={staticFile(`tg/vo/${ch}.wav`)} />
    <Audio src={staticFile("sfx/music_bed.wav")} loop volume={0.06} />
  </AbsoluteFill>
);

export const CHAPTERS = [
  { id: "ch1", shots: CH1_SHOTS, end: CH1_END },
  { id: "ch2", shots: CH2_SHOTS, end: CH2_END },
  { id: "ch3", shots: CH3_SHOTS, end: CH3_END },
];

export const chapterFrames = (end: number) => Math.round(end * FPS);

export const makeChapter = (i: number): React.FC => () => <Chapter ch={CHAPTERS[i].id} shots={CHAPTERS[i].shots} end={CHAPTERS[i].end} />;

export const ThanksgivingAll: React.FC = () => (
  <Series>
    {CHAPTERS.map((c) => (
      <Series.Sequence key={c.id} durationInFrames={chapterFrames(c.end)}>
        <Chapter ch={c.id} shots={c.shots} end={c.end} />
      </Series.Sequence>
    ))}
  </Series>
);
