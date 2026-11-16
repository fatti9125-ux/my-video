import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Emu, Person } from "./Characters";
import {
  Camera, Caption, DustPuffs, MuzzleFlash, NameCard, Outback, Plate, SpeechBubble, Stage, StampCard, TITLE_FONT,
} from "./Scenery";

// 30 s @ 30 fps. Shot list (frames):
// S1   0– 90 wide outback, title card (0–60) → reveal, "1932"
// S2  90–210 farmer mid-shot, "MY WHEAT!", "20,000 EMUS"
// S3 210–330 army arrives (name card 24f) → major + soldiers + gun
// S4 330–450 gag: gun fires, emus scatter, shake + dust
// S5 450–570 major close-up sweating, bullet/emu count
// S6 570–720 smug emu close-up + punchline stamp
// S7 720–840 blue scoreboard plate, major cries (sad trombone)
// S8 840–900 sunset, emus dance, "THE EMUS WON."
export const EMU_WAR_DURATION = 900;

const ARMY = { coat: "#b89b5e", trim: "#6b4f2a", hair: "#6b4a2c" };

const MachineGun: React.FC<{ x: number; y: number; scale?: number; recoil?: number }> = ({ x, y, scale = 1, recoil = 0 }) => (
  <g transform={`translate(${x - recoil} ${y}) scale(${scale})`}>
    <line x1={0} y1={0} x2={-90} y2={130} stroke="#1c1a1a" strokeWidth={12} strokeLinecap="round" />
    <line x1={0} y1={0} x2={90} y2={130} stroke="#1c1a1a" strokeWidth={12} strokeLinecap="round" />
    <line x1={0} y1={0} x2={0} y2={140} stroke="#1c1a1a" strokeWidth={12} strokeLinecap="round" />
    <rect x={-110} y={-40} width={180} height={60} rx={12} fill="#4d5a3a" stroke="#1c1a1a" strokeWidth={8} />
    <rect x={60} y={-30} width={190} height={30} rx={8} fill="#3d3d3d" stroke="#1c1a1a" strokeWidth={7} />
    <rect x={-30} y={-90} width={70} height={55} rx={10} fill="#7a6a3a" stroke="#1c1a1a" strokeWidth={7} />
  </g>
);

// ---------------- Shots ----------------
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={90} to={1.06} originY="70%">
        <Stage>
          <Outback />
          {[0, 1, 2, 3].map((i) => (
            <Emu key={i} x={1500 - f * 3.2 - i * 230} y={930 + (i % 2) * 40} scale={0.42} flip walk={f * 0.45 + i} />
          ))}
        </Stage>
      </Camera>
      {f < 60 && <NameCard text="The Great Emu War" sub="Western Australia" />}
      <Caption text="1932" at={64} pos="top" />
    </AbsoluteFill>
  );
};

const S2: React.FC = () => {
  const f = useCurrentFrame();
  const angry = f >= 40;
  const talking = f >= 42 && f < 84;
  const mouth = !angry ? "frown" : talking ? (Math.floor(f / 4) % 3 === 0 ? "line" : "open") : "frown";
  return (
    <AbsoluteFill>
      <Camera dur={120} to={1.04} originX="35%">
        <Stage>
          <Outback />
          {[1260, 1500, 1730].map((ex, i) => (
            <Emu key={ex} x={ex} y={860 + i * 25} scale={0.55} flip={i === 1} peck={Math.max(0, Math.sin(f / 7 + i * 2))} />
          ))}
          <Person x={600} y={1180} scale={1.05} coat="#e9e2d0" overalls hat="straw" moustache hair="#7a4a26"
            brows={angry ? "angry" : "worried"} eyes={angry ? "dot" : "wide"} mouth={mouth}
            armL={angry ? 140 + Math.sin(f / 3) * 10 : 15} armR={angry ? 135 - Math.sin(f / 3) * 10 : 15}
            tilt={Math.sin(f / 18) * 2} bodyBob={talking ? Math.sin(f / 2) * 4 : 0} />
          <SpeechBubble x={1080} y={250} text="MY WHEAT!" at={42} tailX={760} tailY={560} />
        </Stage>
      </Camera>
      <Caption text="20,000 Emus" at={70} />
    </AbsoluteFill>
  );
};

const S3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={120} to={1.05} originX="40%" originY="40%">
        <Stage>
          <Outback />
          <Person x={330} y={1010} scale={0.72} {...ARMY} hat="helmet" brows="neutral" tilt={Math.sin(f / 15) * 2} />
          <Person x={1110} y={1010} scale={0.72} {...ARMY} hat="helmet" brows="angry" tilt={Math.sin(f / 13 + 1) * 2} />
          <MachineGun x={1500} y={880} scale={1} />
          <Person x={720} y={1140} scale={0.95} {...ARMY} hat="slouch" moustache
            brows={f < 60 ? "smug" : "angry"} mouth={f < 60 ? "smile" : "grin"} armR={f > 30 ? 150 : 15} armL={12}
            tilt={Math.sin(f / 20) * 1.5} />
        </Stage>
      </Camera>
      {f < 24 && <NameCard text="The Army Arrives" />}
      <Caption text="2 Soldiers + 2 Machine Guns" at={50} size={72} />
    </AbsoluteFill>
  );
};

const S4: React.FC = () => {
  const f = useCurrentFrame();
  const firing = f >= 20 && f < 62;
  const flash = firing && f % 4 < 2;
  const run = f >= 28;
  return (
    <AbsoluteFill>
      <Camera dur={120} from={1.02} to={1.05} shake={firing ? 10 : 0}>
        <Stage>
          <Outback />
          <MachineGun x={430} y={860} scale={0.8} recoil={flash ? 10 : 0} />
          <MuzzleFlash x={660} y={845} on={flash} scale={0.7} />
          <Person x={250} y={1000} scale={0.6} {...ARMY} hat="helmet" brows={f < 64 ? "angry" : "worried"}
            eyes={f < 64 ? "dot" : "wide"} mouth={firing ? "grin" : "frown"} armR={70} />
          {[[1240, 900], [1400, 950], [1560, 880], [1700, 960], [1820, 910]].map(([ex, ey], i) => (
            <Emu key={i} x={run ? ex + (f - 28) * (26 + i * 3) : ex} y={ey} scale={0.48} flip={false}
              walk={run ? f * 1.4 + i : undefined} wideEye={f >= 22} peck={run ? 0 : Math.max(0, Math.sin(f / 6 + i))} />
          ))}
          <DustPuffs x={1300} y={980} start={28} count={7} dir={1} />
        </Stage>
      </Camera>
      <Caption text="The Emus Scattered" at={70} pos="top" />
    </AbsoluteFill>
  );
};

const S5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={120} to={1.06} originY="35%">
        <Stage>
          <Outback />
          <Person x={960} y={1560} scale={1.55} {...ARMY} hat="slouch" moustache brows="worried"
            eyes={f < 50 ? "wide" : "dot"} mouth={f < 50 ? "frown" : "open"} sweat={f >= 10}
            tilt={Math.sin(f / 10) * 2.5} />
        </Stage>
      </Camera>
      <Caption text="9,860 Bullets" at={8} pos="top" />
      <Caption text="About 986 Emus" at={58} />
    </AbsoluteFill>
  );
};

const S6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={150} from={1.0} to={1.05} originX="40%">
        <Stage>
          <Outback />
          <Emu x={700} y={1300} scale={1.45} smug headTilt={Math.sin(f / 12) * 6} />
        </Stage>
      </Camera>
      <StampCard lines={["THE ARMY THAT", "LOST A WAR", "TO BIRDS"]} at={30} x={1430} y={330} rotate={-8} />
    </AbsoluteFill>
  );
};

const S7: React.FC = () => {
  const f = useCurrentFrame();
  const jump = Math.abs(Math.sin(f / 5)) * -60;
  return (
    <Camera dur={120} to={1.04}>
      <Plate>
        <g transform="translate(960 250)">
          <rect x={-720} y={-130} width={1440} height={260} rx={30} fill="#fff" stroke="#1c1a1a" strokeWidth={10} />
          <text x={0} y={42} textAnchor="middle" fontFamily={TITLE_FONT} fontWeight={800} fontSize={112} fill="#1c1a1a">
            EMUS <tspan fill="#d92b2b">1</tspan> – <tspan fill="#1e90ff">0</tspan> HUMANS
          </text>
        </g>
        <Emu x={420} y={1060 + jump} scale={0.95} smug walk={f * 0.5} headTilt={Math.sin(f / 4) * 8} />
        <Person x={1450} y={1160} scale={0.85} {...ARMY} hat="slouch" moustache brows="worried" eyes="closed"
          mouth={f > 30 ? "open" : "frown"} tears={interpolate(f, [20, 70], [0, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          bodyBob={f > 30 ? Math.sin(f / 2) * 5 : 0} tilt={-6} />
      </Plate>
    </Camera>
  );
};

const S8: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Camera dur={60} to={1.05} originY="70%">
        <Stage>
          <Outback sunset />
          {[560, 800, 1040, 1280, 1520].map((ex, i) => (
            <Emu key={ex} x={ex} y={900 + Math.abs(Math.sin(f / 4 + i)) * -40} scale={0.5} flip={i % 2 === 0}
              headTilt={Math.sin(f / 4 + i) * 15} />
          ))}
        </Stage>
      </Camera>
      <Caption text="The Emus Won." at={6} pos="top" size={100} />
      <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [48, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
    </AbsoluteFill>
  );
};

// ---------------- Sound plan ----------------
// [frame, file, volume]
const SFX: [number, string, number][] = [
  [0, "thud", 0.9], [60, "whoosh", 0.6], [64, "pop", 0.7],
  [90, "whoosh", 0.5], [130, "pop", 0.7], [138, "squawk", 0.6], [160, "pop", 0.7],
  [210, "thud", 0.9], [234, "whoosh", 0.5], [260, "pop", 0.7],
  [350, "gunburst", 0.85], [372, "gunburst", 0.85], [354, "squawk", 0.8], [358, "squawk", 0.6], [360, "whoosh", 0.8], [400, "pop", 0.7],
  [458, "pop", 0.7], [462, "boing", 0.5], [508, "pop", 0.7],
  [580, "squawk", 0.7], [600, "thud", 1.0],
  [720, "whoosh", 0.5], [750, "sad_trombone", 0.8], [732, "squawk", 0.5],
  [840, "whoosh", 0.5], [846, "pop", 0.7], [856, "squawk", 0.5],
];

export const EmuWar: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence durationInFrames={90}><S1 /></Sequence>
    <Sequence from={90} durationInFrames={120}><S2 /></Sequence>
    <Sequence from={210} durationInFrames={120}><S3 /></Sequence>
    <Sequence from={330} durationInFrames={120}><S4 /></Sequence>
    <Sequence from={450} durationInFrames={120}><S5 /></Sequence>
    <Sequence from={570} durationInFrames={150}><S6 /></Sequence>
    <Sequence from={720} durationInFrames={120}><S7 /></Sequence>
    <Sequence from={840} durationInFrames={60}><S8 /></Sequence>

    {/* music bed, ducked under the stamp & trombone beats */}
    <Audio src={staticFile("sfx/music_bed.wav")}
      volume={(f) => (f >= 596 && f < 640) || (f >= 745 && f < 830) ? 0.12 : 0.32} />
    {SFX.map(([at, name, vol], i) => (
      <Sequence key={i} from={at} durationInFrames={90}>
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
