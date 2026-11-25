import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { WhiteHouseLawn } from "../Thanksgiving3/Bg2";
import { Board, Episode, makeAlign, Shot, Steps, Svg, Swap } from "../Thanksgiving3/Episode";
import { Cam, Cap, Card, Cheer, Quill, SImg, Speed, Stamp } from "../Thanksgiving3/Kit";
import { MONTSERRAT } from "../fonts";
import DATA from "./ep/vp3.json";
import {
  AlbanyCapitol, BackRoom, BackRoomTable, Blanket, FarmNight, KeepCoolPoster, LampGrade, MournPortrait,
  NightBedroom, OathParlor, OathTable, RockerFG, Telegram, TRDesk, TROffice, WilcoxLibrary,
} from "./PilotBg";
import { Act, HEAD, INK, mapXY, Splat, USMap, V } from "./VKit";

/**
 * PILOT (production/shot_plan.md): VO part 3, lines 4-16 (Theodore Roosevelt -> Calvin Coolidge), rebuilt to
 * the evidence-backed spec in reference_analysis/Animation_Production_Spec.md: a specific painted plate per
 * place, varied shot sizes, foreground occluders, in-scene mascot roles, 1-frame expression swaps on the
 * motivating word (+4 f listener delay), one continuous camera move per shot, hard-cut captions and name cards,
 * slam stamp, a lamp-lit oath tableau built from clip 09's layer inventory.
 * Audio: the narrator's master file (public/tg2/vo/vp_full.mp3), part 3 begins at 220.02 s.
 */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const PILOT_START = 21.14;          // 0.2 s pre-roll before "Theodore"
export const PILOT_VO_END = 77.5;          // before "Harry Truman"
export const PILOT_END = 78.5;             // 1 s tail hold
export const PILOT_DURATION = Math.round((PILOT_END - PILOT_START) * 30);
const PART3 = 220.02;
const R = 4;                               // listener / reaction delay (frames), spec §2.2

/** Knock-back: victim flung off-frame in 4 f with a tilt (spec §2.3 fling exit, clip 08:240-244). */
const Fling: React.FC<{ at: number; dx: number; children: React.ReactNode }> = ({ at, dx, children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - at, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  if (p >= 1) return null;
  return <g transform={`translate(${dx * p} ${-120 * p}) rotate(${28 * p} 1300 700)`}>{children}</g>;
};

/** Linear slide between two x positions (constant speed, hard stop: clip 07:867-876). */
const Slide: React.FC<{ at: number; frames: number; dx: number; children: React.ReactNode }> = ({ at, frames, dx, children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - at, [0, frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <g transform={`translate(${dx * p} 0)`}>{children}</g>;
};

/** Icon + label group: pops 0 -> 1 over 11 f on an S-curve, no overshoot (clip 10:541-551); falls out at `out` (clip 13:607). */
const Pop: React.FC<{ at: number; out?: number; x: number; y: number; label: string; children: React.ReactNode }> = ({ at, out, x, y, label, children }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = interpolate(f - at, [0, 11], [0.11, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const fall = out !== undefined ? Math.max(0, f - out) * 0.083 * 1080 : 0;
  if (fall > 1300) return null;
  return (
    <g transform={`translate(${x} ${y + fall}) scale(${s})`}>
      {children}
      <text y={190} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={48} fill="#fff" stroke={INK} strokeWidth={10} paintOrder="stroke">{label}</text>
    </g>
  );
};

const Factory = () => (
  <g stroke={INK} strokeWidth={8}>
    <path d="M -150 120 L -150 -20 L -90 -70 L -90 -20 L -30 -70 L -30 -20 L 30 -70 L 30 -20 L 150 -20 L 150 120 Z" fill="#9aa3ad" />
    <rect x={90} y={-150} width={40} height={130} fill="#7a828c" />
    {[[-120, 20], [-60, 20], [0, 20], [60, 20]].map(([x, y], i) => <rect key={i} x={x} y={y} width={40} height={40} fill="#f2d36b" />)}
    <path d="M -175 120 L 175 120" strokeWidth={10} />
    <g fill="none" stroke="#c9a14a" strokeWidth={12}><ellipse cx={-60} cy={70} rx={34} ry={22} /><ellipse cx={0} cy={70} rx={34} ry={22} /><ellipse cx={60} cy={70} rx={34} ry={22} /></g>
  </g>
);
const Pine = () => (
  <g stroke={INK} strokeWidth={8}>
    <rect x={-18} y={60} width={36} height={70} fill="#6b4529" />
    <path d="M 0 -170 L -80 -50 L -40 -50 L -110 50 L -50 50 L -130 140 L 130 140 L 50 50 L 110 50 L 40 -50 L 80 -50 Z" fill="#3f7a3a" />
  </g>
);

/** Cartoon light bulb that pops, then gets a red X (no electricity gag). */
const NoBulb: React.FC<{ x: number; y: number; at: number; xAt: number }> = ({ x, y, at, xAt }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = interpolate(f - at, [0, 4], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={9}>
      <circle cy={-40} r={95} fill="#fff6c8" /><rect x={-48} y={50} width={96} height={70} rx={10} fill="#a9a9a9" />
      <path d="M -30 -40 L -10 10 L 10 -40 L 30 10" fill="none" strokeWidth={7} />
      {f >= xAt && <g stroke="#e02b2b" strokeWidth={30} strokeLinecap="round"><line x1={-120} y1={-150} x2={120} y2={130} /><line x1={120} y1={-150} x2={-120} y2={130} /></g>}
    </g>
  );
};

/** "z z z" drifting up from a dark window. */
const Zzz: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <g fontFamily={MONTSERRAT} fontWeight={800} fill="#fff" stroke={INK} strokeWidth={6} paintOrder="stroke">
      {[0, 1, 2].map((i) => { const lf = f - at - i * 9; if (lf < 0) return null; return <text key={i} x={x + lf * 1.4 + Math.sin(lf / 6) * 10} y={y - lf * 2.2} fontSize={44 + i * 14} opacity={Math.max(0, 1 - lf / 70)}>z</text>; })}
    </g>
  );
};

/**
 * Coolidge in bed, ATTACHED BY CONSTRUCTION: asleep = his whole sheet drawing (eyes-closed variant) rotated to lie
 * with the head on the pillow; awake = the whole drawing sitting up. The Blanket foreground covers the body.
 */
const Sleeper: React.FC<{ wakeAt: number }> = ({ wakeAt }) => {
  const f = useCurrentFrame();
  if (f >= wakeAt) return (<>
    <defs><clipPath id="pl-bed"><rect x={0} y={0} width={1920} height={830} /></clipPath></defs>
    <g clipPath="url(#pl-bed)"><Act c="calvin_coolidge" x={300} y={1090} h={640} e={3} /></g>
    {f < wakeAt + 3 && <g stroke="#fff" strokeWidth={9} fill="none"><path d="M 250 520 q -40 50 0 100" /><path d="M 560 520 q 40 50 0 100" /></g>}
  </>);
  const breathe = 1 + Math.sin(f / 22) * 0.008;
  return (
    <g transform={`translate(790 765) rotate(-86) scale(1 ${breathe})`}>
      <SImg href={staticFile("tg2/vp/calvin_coolidge/0__blink.png")} x={-160} y={-600} width={300} height={594} preserveAspectRatio="xMidYMax meet" />
    </g>
  );
};

/** Map route Albany -> Washington drawn progressively, with TR's head travelling along it. */
const Route: React.FC<{ a: [number, number]; b: [number, number]; at: number; frames: number }> = ({ a, b, at, frames }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f - at, [0, frames], [0, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const x = a[0] + (b[0] - a[0]) * p, y = a[1] + (b[1] - a[1]) * p;
  return (
    <g>
      <line x1={a[0]} y1={a[1]} x2={x} y2={y} stroke="#e02b2b" strokeWidth={9} strokeDasharray="22 16" strokeLinecap="round" />
      <V c="theodore_roosevelt" p={2} x={x} y={y + 6} h={150} flip={b[0] < a[0]} />
    </g>
  );
};

const ALB = mapXY(-73.75, 42.65) as [number, number];
const DC = mapXY(-77.03, 38.9) as [number, number];
const MID = [(ALB[0] + DC[0]) / 2, (ALB[1] + DC[1]) / 2];
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(1)}%`;
const LAMP: [number, number] = [1070, 640];

export const SHOTS: Shot[] = [
  // 4 Theodore Roosevelt's party bosses had their own staffing solution.
  { a: PILOT_START, el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.07} oy="60%"><Svg bg={<AlbanyCapitol />}>
        <Act c="theodore_roosevelt" x={1300} y={1015} h={660} e={2} talk stress at={t(wd(4, "party")) + 6} enter={{ from: "right", frames: 8, dist: 900 }} />
      </Svg></Cam>],
      [t(wd(4, "bosses")), <Cam dur={dur} from={1.0} to={1.08} oy="45%"><Svg bg={<BackRoom />}>
        <V c="thomas_platt" p="hand_chin" x={960} y={1000} h={640} />
        <BackRoomTable />
      </Svg></Cam>],
    ]} />
    <Card text="Theodore Roosevelt" at={0} until={t(wd(4, "party")) + 6} />
  </>) },
  // 5 New York boss Thomas Platt helped push the troublesome governor toward the vice presidency, getting him out of Albany.
  { a: ln(5), el: (t, dur) => {
    const push = t(wd(5, "push"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.05} oy="62%"><Svg bg={<AlbanyCapitol />}>
          <Swap t={push} a={<V c="thomas_platt" p="pointing" x={560} y={1015} h={620} />}
            b={<Swap t={push + 10} a={<Slide at={push} frames={5} dx={330}><V c="thomas_platt" p={9} x={560} y={1015} h={620} /></Slide>}
              b={<Act c="thomas_platt" x={890} y={1015} h={620} e={5} />} />} />
          <Fling at={push + 3} dx={1100}><Act c="theodore_roosevelt" x={1330} y={1015} h={640} flip e={2} talk={[0, push]} vein={t(wd(5, "troublesome"))} /></Fling>
          <Splat x={1290} y={640} at={push + 3} r={140} />
          <Speed x={1500} y={600} at={push + 5} frames={4} dir={-1} />
        </Svg></Cam>],
        [t(wd(5, "toward")), <Cam dur={dur} from={1.45} to={1.55} ox={pct(MID[0], 1920)} oy={pct(MID[1], 1080)}><Svg bg={<USMap pins={[
          { lon: -73.75, lat: 42.65, at: 0, name: "ALBANY", dy: -96 },
          { lon: -77.03, lat: 38.9, at: t(wd(5, "vice")) - t(wd(5, "toward")), name: "WASHINGTON", dy: 50 },
        ]} />}>
          <Route a={ALB} b={DC} at={t(wd(5, "getting")) - t(wd(5, "toward"))} frames={t(wd(5, "albany")) - t(wd(5, "getting")) + 12} />
        </Svg></Cam>],
      ]} />
      <Cap text="Thomas Platt" at={t(wd(5, "thomas"))} until={t(wd(5, "toward"))} />
    </>);
  } },
  // 6 In 1901, President McKinley was assassinated, and Roosevelt became president at forty-two.
  { a: ln(6), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.09}><Svg bg={<MournPortrait c="william_mckinley" drapeAt={t(wd(6, "assassinated"))} />} /></Cam>],
      [t(wd(6, "and")), <Cam dur={dur} from={1.0} to={1.06} ox="35%" oy="55%"><Svg bg={<WilcoxLibrary />}>
        <V c="theodore_roosevelt" p={10} x={640} y={1020} h={660} />
        <Quill pose="nervous_side_glance" x={1180} y={1060} h={330} />
      </Svg></Cam>],
    ]} />
    <Cap text="1901" at={t(wd(6, "1901"))} until={t(wd(6, "mckinley"))} />
    <Cap text="William McKinley" at={t(wd(6, "mckinley"))} until={t(wd(6, "and"))} />
    <Stamp lines={["THE YOUNGEST", "PRESIDENT", "IN HISTORY"]} at={t(wd(6, "became"))} x={1360} y={330} rot={-8} variant="dark" />
  </>) },
  // 7 The plan to move him into a quieter job had put him in the most powerful one.
  { a: ln(7), el: (t, dur) => {
    const pw = t(wd(7, "powerful"));
    return (
      <Cam dur={dur} from={1.08} to={1.11} oy="45%" punch={{ at: pw, frames: 4, to: 1.32, ox: "50%", oy: "42%" }}>
        <Svg bg={<BackRoom />}>
          <Act c="thomas_platt" x={960} y={1000} h={640} e={[[0, 5], [t(wd(7, "put")) + R, 4], [pw + R, 3]]} sweat={pw + R} />
          <Quill pose="deadpan_wings_folded" x={1430} y={985} h={300} at={pw + 16} enter={{ from: "right", frames: 9, dist: 700 }} />
          <BackRoomTable />
        </Svg>
      </Cam>
    );
  } },
  // 8 He pursued corporate regulation and conservation, then won the presidency himself in 1904.
  { a: ln(8), el: (t, dur) => {
    const out = t(wd(8, "then"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.04}><Svg bg={<WhiteHouseLawn dusk />} dim={0.55}>
          <V c="theodore_roosevelt" p={12} x={420} y={1015} h={600} />
          <Quill pose="speaking_facing_right" x={760} y={1030} h={330} />
          <Pop at={t(wd(8, "corporate"))} out={out} x={1080} y={400} label="REGULATION"><Factory /></Pop>
          <Pop at={t(wd(8, "conservation"))} out={out + 3} x={1610} y={400} label="CONSERVATION"><Pine /></Pop>
        </Svg></Cam>],
        [t(wd(8, "won")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<WhiteHouseLawn />}>
          <V c="theodore_roosevelt" p={8} x={760} y={1015} h={640} />
          <V c="theodore_roosevelt" p={42} x={1380} y={940} h={440} />
          <Cheer x={420} y={300} w={720} />
        </Svg></Cam>],
      ]} />
      <Cap text="1904" at={t(wd(8, "1904"))} />
    </>);
  }, sfx: [[Math.round((wd(8, "won") - ln(8)) * 30), "cheer", 0.08]] },
  // 9 Being parked in the vice presidency had worked out rather well for Roosevelt.
  { a: ln(9), el: (t, dur) => (
    <Cam dur={dur} from={1.0} to={1.07} oy="50%">
      <Svg bg={<TROffice />}>
        <Act c="theodore_roosevelt" x={960} y={1010} h={680} e={[[0, 0], [t(wd(9, "worked")) + R, 5]]} stress />
        <TRDesk />
        <Quill pose="deadpan_wings_folded" x={250} y={1000} h={330} at={t(wd(9, "rather"))} enter={{ from: "left", frames: 9, dist: 600 }} />
      </Svg>
    </Cam>
  ) },
  // 10 Calvin Coolidge's promotion came with considerably less noise.
  { a: ln(10), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.08} ox="40%" oy="55%">
      <Svg bg={<FarmNight />}>
        <Zzz x={790} y={500} at={t(wd(10, "less"))} />
      </Svg>
    </Cam>
    <Card text="Calvin Coolidge" at={0} until={t(wd(10, "promotion")) + 14} />
  </>), },
  // 11 In August 1923, he was visiting his father in Vermont when news arrived that President Warren Harding had died.
  { a: ln(11), el: (t, dur) => {
    const news = t(wd(11, "news"));
    const door = (f: number) => interpolate(f - news, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const Door: React.FC = () => <NightBedroom door={door(useCurrentFrame())} />;
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.05} ox="30%" oy="60%"><Svg bg={<Door />}>
          <Sleeper wakeAt={news + R} />
          <Blanket />
          <V c="john_coolidge_senior" p={10} x={1600} y={1010} h={600} flip at={news} enter={{ from: "right", frames: 8, dist: 500 }} />
        </Svg></Cam>],
        [t(wd(11, "president")), <Cam dur={dur} from={1.02} to={1.08}><Svg bg={<Telegram at={t(wd(11, "warren")) - t(wd(11, "president"))} lines={["PRESIDENT HARDING", "DIED TONIGHT IN", "SAN FRANCISCO"]} />} /></Cam>],
      ]} />
      <Cap text="August 2, 1923" at={t(wd(11, "august"))} until={t(wd(11, "vermont"))} />
      <Cap text="Plymouth Notch, Vermont" at={t(wd(11, "vermont"))} until={t(wd(11, "president"))} />
    </>);
  } },
  // 12 The house had no electricity.
  { a: ln(12), el: (t, dur) => (
    <Cam dur={dur} from={1.05} to={1.07} ox="30%" oy="60%">
      <Svg bg={<NightBedroom door={1} />}>
        <Sleeper wakeAt={-10} />
        <Blanket />
        <V c="john_coolidge_senior" p={9} x={1480} y={1010} h={600} flip />
        <NoBulb x={960} y={330} at={t(wd(12, "no"))} xAt={t(wd(12, "electricity")) + 6} />
      </Svg>
    </Cam>
  ) },
  // 13 So his father, a notary public, administered the presidential oath by the light of a kerosene lamp.
  { a: ln(13), el: (t, dur) => {
    const light = t(wd(13, "light"));
    const Room: React.FC = () => {
      const f = useCurrentFrame();
      const lit = interpolate(f, [light, light + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
      return (<>
        <Act c="john_coolidge_senior" x={840} y={905} h={560} flip e={0} talk={[t(wd(13, "administered")), 9999]} />
        <OathTable lit={lit} />
        <V c="calvin_coolidge" p={6} x={520} y={1030} h={640} />
        <Quill pose="nervous_side_glance" x={1480} y={1010} h={340} />
        <RockerFG />
        <LampGrade lit={lit} cx={LAMP[0]} cy={LAMP[1]} />
        {f >= light - 3 && f < light + 1 && <circle cx={LAMP[0]} cy={LAMP[1]} r={40} fill="#fff8d8" />}
      </>);
    };
    return (<>
      <Cam dur={dur} from={1.0} to={1.15} ox={pct(LAMP[0], 1920)} oy={pct(LAMP[1], 1080)}>
        <Svg bg={<OathParlor />}><Room /></Svg>
      </Cam>
      <Cap text="2:47 A.M." pos="top" at={0} until={62} />
    </>);
  } },
  // 14 There's the lamp.
  { a: ln(14), el: (_t, dur) => (
    <Cam dur={dur} from={1.15} to={1.18} ox={pct(LAMP[0], 1920)} oy={pct(LAMP[1], 1080)} punch={{ at: 0, frames: 6, to: 1.55, ox: pct(LAMP[0], 1920), oy: pct(LAMP[1], 1080) }}>
      <Svg bg={<OathParlor />}>
        <Act c="john_coolidge_senior" x={840} y={905} h={560} flip e={0} talk />
        <OathTable lit={1} />
        <V c="calvin_coolidge" p={6} x={520} y={1030} h={640} />
        <LampGrade lit={1} cx={LAMP[0]} cy={LAMP[1]} />
      </Svg>
    </Cam>
  ) },
  // 15 The new president had been sworn in by his dad in the family parlor.
  { a: ln(15), el: (t, dur) => {
    const st = t(wd(15, "sworn"));
    return (<>
      <Cam dur={dur} from={1.15} to={1.1} ox={pct(LAMP[0], 1920)} oy={pct(LAMP[1], 1080)}>
        <Svg bg={<OathParlor />}>
          <Act c="john_coolidge_senior" x={840} y={905} h={560} flip e={[[0, 0], [st + 6 + R, 5]]} talk={[0, st]} />
          <OathTable lit={1} />
          <Swap t={st + 6 + R} a={<V c="calvin_coolidge" p={6} x={520} y={1030} h={640} />} b={<Act c="calvin_coolidge" x={520} y={1030} h={640} e={5} />} />
          <Quill pose="nervous_side_glance" x={1480} y={1010} h={340} />
          <RockerFG />
          <LampGrade lit={1} cx={LAMP[0]} cy={LAMP[1]} />
        </Svg>
      </Cam>
      <Stamp lines={["THE ONLY PRESIDENT", "SWORN IN BY", "HIS FATHER"]} at={st} x={1330} y={300} rot={-8} variant="dark" />
    </>);
  } },
  // 16 Coolidge went on to win the 1924 election.
  { a: ln(16), el: (t, dur) => (
    <Cam dur={dur} from={1.0} to={1.06}>
      <Svg bg={<WhiteHouseLawn />}>
        <Swap t={t(wd(16, "win"))} a={<Act c="calvin_coolidge" x={760} y={1015} h={640} e={0} />} b={<V c="calvin_coolidge" p={8} x={760} y={1015} h={640} />} />
        <Cheer x={460} y={300} w={600} />
        <KeepCoolPoster x={1300} y={820} />
        <Quill pose="scoreboard_celebration" x={1700} y={1040} h={380} at={t(wd(16, "1924")) - 4} enter={{ from: "right", frames: 7, dist: 500 }}>
          <Board pose="scoreboard_celebration" top="ELECTED" big="1924" />
        </Quill>
      </Svg>
    </Cam>
  ), sfx: [[Math.round((wd(16, "win") - ln(16)) * 30), "cheer", 0.08]] },
];

const F = (s: number) => Math.round(s * 30);

export const VPPilot: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Sequence from={-F(PILOT_START)}>
      <Episode data={{ ...D, dur: PILOT_END - 0.6 }} shots={SHOTS} noAudio />
    </Sequence>
    <Audio src={staticFile("tg2/vo/vp_full.mp3")} trimBefore={F(PART3 + PILOT_START)} trimAfter={F(PART3 + PILOT_VO_END)} />
  </AbsoluteFill>
);
