import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Board, Episode, epDuration, makeAlign, Shot, Steps, Svg, Swap } from "../Thanksgiving3/Episode";
import { Cam, Cap, Card, Cheer, QMarks, Quill, Stamp } from "../Thanksgiving3/Kit";
import { Pop, Slide } from "./Pilot";
import { MournPortrait } from "./PilotBg";
import { Act, Big, Bubble, DownArrow, INK, Sulk, Sweat, Timeline, V } from "./VKit";
import {
  AF1Aft, AF1Stateroom, Balloons, BarRailFG, CabinetChairsFG, CabinetRoom, Confetti, Courtroom, Crowd, DCRoute, dcRoutePoint,
  DealeyPlaza, Debate1976, DebateStudio1960, DeskBehind, EastRoom, HiltonPress, Highway, Houston1988, HouseFloor, JudgeFG,
  KuwaitDesert, Lectern, LoveField, ModeratorFG, NavalObservatory, NoButton, OvalOffice, PardonPaper, Photographer, Prop,
  Rally1964, ResignLetter, Rewind, Richmond1992, SenateChamber, SenateDesksFG, SouthLawnHeli, Superdome1988, Tank, TearApart,
  Truck, TVCamera, TVLook, Waldorf1968, walkSpeed, Watergate, WestFront1981,
} from "./bg/Part4";
import DATA from "./ep/vp4.json";

/**
 * Part 4 (VO vp4.mp3): LBJ sworn in on Air Force One, civil rights and Vietnam; Nixon's backward career,
 * comeback and resignation; Ford appointed and the pardon; George H.W. Bush, Kuwait, taxes, Clinton.
 * Rebuilt in the pilot style (src/VP/Pilot.tsx): one painted plate per real place (src/VP/bg/Part4.tsx),
 * foreground occluders, varied shot sizes, inserts, in-scene Quill, 1-frame swaps on the motivating word
 * (+R listener delay), one continuous camera move per shot, hard captions, name cards, stamp.
 */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const VP4_DURATION = epDuration(D);
const R = 4;
const sfxAt = (line: number, w: string, name: string, vol = 0.1, n = 0): [number, string, number] => [Math.round((wd(line, w, n) - ln(line)) * 30), name, vol];

/** Desk-line y of a seated sheet pose placed with its bottom at `y` and drawing height `h` (fraction from the sheet). */
const deskTop = (y: number, h: number, frac: number) => y - h * (1 - frac);

/** Bush riding the DC route (same easing as DCRoute). */
const Rider: React.FC<{ at: number; frames: number }> = ({ at, frames }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - at, [0, frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const [x, y] = dcRoutePoint(p);
  return <V c="george_hw_bush" p={6} x={x} y={y + 10} h={170} />;
};

/** Children appear from frame `at` (shot-relative). */
const From: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => (useCurrentFrame() >= at ? <>{children}</> : null);

/** Constant drive across the frame (vehicles). */
const Drive: React.FC<{ v: number; at?: number; children: React.ReactNode }> = ({ v, at = 0, children }) => {
  const f = useCurrentFrame();
  return <g transform={`translate(${Math.max(0, f - at) * v} 0)`}>{children}</g>;
};

/** The pardon document trailing a walker (bobbing, a step behind). */
const Trailing: React.FC<{ at: number; x0: number; v: number; y: number }> = ({ at, x0, v, y }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = interpolate(f - at, [0, 6], [0.2, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) });
  return <g transform={`translate(${x0 + v * f} ${y + Math.sin(f / 5) * 14}) scale(${s})`}><Prop n={13} x={0} y={0} h={230} rot={Math.sin(f / 7) * 8} /></g>;
};

const Trophy = () => (
  <g stroke={INK} strokeWidth={8}>
    <path d="M -90 -150 L 90 -150 Q 90 0 0 20 Q -90 0 -90 -150 Z" fill="#e9b23c" />
    <path d="M -90 -120 Q -150 -110 -130 -60 Q -110 -30 -80 -50" fill="none" /><path d="M 90 -120 Q 150 -110 130 -60 Q 110 -30 80 -50" fill="none" />
    <rect x={-16} y={20} width={32} height={60} fill="#c9922c" /><rect x={-70} y={80} width={140} height={36} fill="#7a4a2a" />
  </g>
);

const VotingDoc = () => (
  <g stroke={INK} strokeWidth={7}>
    <rect x={-120} y={-150} width={240} height={300} rx={8} fill="#f6ecd2" />
    {[-90, -55, -20, 15, 50].map((y) => <line key={y} x1={-85} y1={y} x2={85} y2={y} strokeWidth={6} stroke="#8a7a5a" />)}
    <circle cx={60} cy={105} r={30} fill="#c8302b" />
  </g>
);

export const SHOTS: Shot[] = [
  // 0 Lyndon B. Johnson also took over after a sudden death, but the transition happened in front of cameras.
  { a: ln(0), el: (t, dur) => {
    const card = t(wd(0, "after")) + 6;
    const cams = t(wd(0, "cameras"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.08} ox="50%" oy="48%">
        <Svg bg={<AF1Stateroom />}>
          <Act c="lyndon_johnson" x={900} y={1010} h={620} at={card} enter={{ from: "right", frames: 8, dist: 600 }}
            e={[[0, 0], [t(wd(0, "death")) + R, 4], [cams + 6 + R, 3]]} />
          <Photographer at={cams - 6} flashAt={cams + 6} x={300} />
        </Svg>
      </Cam>
      <Card text="Lyndon B. Johnson" sub="37th Vice President · 36th President" until={card} />
    </>);
  }, sfx: [sfxAt(0, "cameras", "pop", 0.12)] },
  // 1 After Kennedy was assassinated in Dallas in 1963, Johnson took the oath aboard Air Force One.
  { a: ln(1), el: (t, dur) => {
    const dal = t(wd(1, "in")), lj = t(wd(1, "johnson"));
    const sp = walkSpeed("lyndon_johnson", 380);
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.1}><Svg bg={<MournPortrait c="john_f_kennedy" drapeAt={t(wd(1, "assassinated"))} />} /></Cam>],
        [dal, <Cam dur={dur} from={1.0} to={1.12} ox="38%" oy="40%"><Svg bg={<DealeyPlaza />} /></Cam>],
        [lj, <Cam dur={dur} from={1.02} to={1.08} ox="60%" oy="60%"><Svg bg={<LoveField />}>
          <Act c="lyndon_johnson" x={1240 - sp * 70} y={985} h={380} walk={1} walkUntil={lj + 70} at={lj} e={4} />
        </Svg></Cam>],
      ]} />
      <Cap text="Dallas, Texas" at={t(wd(1, "dallas"))} until={t(wd(1, "1963"))} />
      <Cap text="November 22, 1963" at={t(wd(1, "1963"))} until={lj} />
      <Cap text="Love Field, Dallas" at={lj} />
    </>);
  } },
  // 2 Jacqueline Kennedy stood beside him, with Kennedy's casket elsewhere on the plane.
  { a: ln(2), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.08} to={1.13} ox="50%" oy="48%"><Svg bg={<AF1Stateroom />}>
        <V c="jacqueline_kennedy" p={6} x={520} y={1010} h={560} />
        <V c="lyndon_johnson" p={5} x={900} y={1010} h={590} />
        <JudgeFG x={1275} />
      </Svg></Cam>],
      [t(wd(2, "casket")), <Cam dur={dur} from={1.0} to={1.1} ox="50%" oy="70%"><Svg bg={<AF1Aft />} /></Cam>],
    ]} />
    <Cap text="Judge Sarah T. Hughes administers the oath" size={52} at={t(wd(2, "stood"))} until={t(wd(2, "casket"))} />
  </>) },
  // 3 Johnson used his congressional experience to help secure the Civil Rights Act and Voting Rights Act, and he won the 1964 election.
  { a: ln(3), el: (t, dur) => {
    const civ = t(wd(3, "civil")), won = t(wd(3, "won"));
    const lh = 560, ly = 905;
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.07} ox="45%" oy="60%"><Svg bg={<SenateChamber />}>
          <V c="lyndon_johnson" p={10} x={820} y={1000} h={620} />
          <SenateDesksFG squirm={t(wd(3, "experience")) + R} />
        </Svg></Cam>],
        [civ, <Cam dur={dur} from={1.0} to={1.05} oy="60%"><Svg bg={<EastRoom />}>
          <DeskBehind x={960} top={deskTop(ly, lh, 0.8336)} w={720} />
          <V c="lyndon_johnson" p={8} x={960} y={ly} h={lh} />
          <Quill pose="speaking_facing_right" x={360} y={1010} h={330} />
          <Crowd y={990} x0={1400} x1={1920} n={3} seed={7} s={0.9} />
          <Pop at={0} x={1560} y={300} label="CIVIL RIGHTS ACT 1964"><Prop n={8} x={0} y={0} h={260} /></Pop>
          <Pop at={t(wd(3, "voting")) - civ} x={480} y={290} label="VOTING RIGHTS ACT 1965"><VotingDoc /></Pop>
        </Svg></Cam>],
        [won, <Cam dur={dur} from={1.0} to={1.06} oy="45%"><Svg bg={<Rally1964 />}>
          <Act c="lyndon_johnson" x={960} y={1000} h={600} e={5} gesture={12} stress />
          <Cheer x={660} y={400} w={600} />
          <Crowd y={935} n={9} seed={11} bob={10} signs={[[1, "LBJ"], [2, "USA", "#2b3f74"], [7, "LBJ", "#b8362f"]]} />
        </Svg></Cam>],
      ]} />
      <Cap text="Senate Majority Leader" at={t(wd(3, "congressional"))} until={civ} />
      <Cap text="Election of 1964" pos="top" at={t(wd(3, "1964"))} />
    </>);
  }, sfx: [sfxAt(3, "won", "cheer", 0.08)] },
  // 4 His escalation of the Vietnam War helped tear apart his presidency.
  { a: ln(4), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.08} ox="45%" oy="50%">
      <Svg bg={<g />}>
        <TearApart at={t(wd(4, "tear"))}>
          <CabinetRoom />
          <V c="lyndon_johnson" p={9} x={900} y={990} h={600} />
          <CabinetChairsFG />
        </TearApart>
      </Svg>
    </Cam>
    <Cap text="Vietnam War" at={t(wd(4, "vietnam"))} until={t(wd(4, "tear"))} />
  </>), sfx: [sfxAt(4, "tear", "paper", 0.15)] },
  // 5 In 1968, he announced he wouldn't seek another term.
  { a: ln(5), el: (t, dur) => {
    const lh = 520, ly = 935;
    return (<>
      <Cam dur={dur} from={1.0} to={1.08} ox="50%" oy="50%">
        <Svg bg={<OvalOffice era="lbj" />}>
          <DeskBehind x={960} top={deskTop(ly, lh, 0.8336)} w={700} />
          <V c="lyndon_johnson" p={8} x={960} y={ly} h={lh} />
          <TVCamera x={1720} flip s={0.95} tally />
          <TVCamera x={180} s={0.9} />
          <NoButton x={1500} y={290} at={t(wd(5, "announced"))} xAt={t(wd(5, "wouldn")) + 3} />
        </Svg>
      </Cam>
      <Cap text="March 31, 1968" at={t(wd(5, "1968"))} />
    </>);
  } },
  // 6 Richard Nixon had spent eight years as Eisenhower's vice president, then lost the 1960 election to Kennedy.
  { a: ln(6), el: (t, dur) => {
    const card = t(wd(6, "eight"));
    const lost = t(wd(6, "lost"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.05} oy="55%"><Svg bg={<OvalOffice era="ike" />}>
          <Act c="dwight_eisenhower" x={720} y={1010} h={600} at={t(wd(6, "eisenhower"))} e={5} gesture={8} stress enter={{ from: "left", frames: 8, dist: 600 }} />
          <Act c="richard_nixon" x={1260} y={1010} h={590} flip at={card} e={[[0, 5], [t(wd(6, "eisenhower")) + R, 0]]} />
        </Svg></Cam>],
        [lost, <Cam dur={dur} from={1.0} to={1.06} oy="45%"><Svg bg={<DebateStudio1960 />}>
          <Act c="richard_nixon" x={560} y={985} h={590} e={[[0, 0], [R, 4]]} sweat={R} />
          <Act c="john_f_kennedy" x={1360} y={985} h={600} flip e={[[0, 0], [t(wd(6, "kennedy")) - lost + R, 5]]} gesture={10} stress />
          <ModeratorFG />
          <TVCamera x={90} s={0.9} /><TVCamera x={1830} flip s={0.9} tally />
          <TVLook />
        </Svg></Cam>],
      ]} />
      <Card text="Richard Nixon" sub="36th Vice President · 37th President" until={card} />
      <Cap text="Vice President 1953–1961" at={card} until={lost} />
      <Cap text="First TV debate · 1960" pos="top" at={t(wd(6, "1960"))} />
    </>);
  } },
  // 7 Two years later, he lost the California governor's race as well.
  { a: ln(7), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06} oy="45%" punch={{ at: t(wd(7, "lost")), frames: 5, to: 1.12, ox: "50%", oy: "42%" }}>
      <Svg bg={<HiltonPress />}>
        <Act c="richard_nixon" x={960} y={1010} h={600} e={[[0, 4], [t(wd(7, "lost")) + R, 2]]} vein={t(wd(7, "race")) + R} talk />
        <Lectern x={960} y={820} w={300} />
        <Crowd y={950} n={7} seed={3} hats cams flashes />
      </Svg>
    </Cam>
    <Cap text="California, 1962" pos="top" at={t(wd(7, "california"))} />
  </>) },
  // 8 His career seemed to be running backward.
  { a: ln(8), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.04} oy="60%">
      <Svg bg={<Highway />}>
        <Act c="richard_nixon" x={1250} y={1000} h={520} walk={-1} e={[[0, 0], [t(wd(8, "backward")) + R, 4]]} />
        <Quill pose="nervous_side_glance" x={1720} y={1010} h={300} at={t(wd(8, "seemed"))} />
        <Rewind at={t(wd(8, "running"))} />
      </Svg>
    </Cam>
  </>) },
  // 9 Then he won the presidency in 1968.
  { a: ln(9), el: (t, dur) => {
    const won = t(wd(9, "won"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.05} oy="25%" punch={{ at: won, frames: 6, to: 1.08, ox: "50%", oy: "30%" }}>
        <Svg bg={<Waldorf1968 />}>
          <From at={won}><Balloons n={22} seed={4} y0={-300} y1={200} fall={7} /></From>
          <Swap t={won} a={<Act c="richard_nixon" x={960} y={1000} h={600} e={0} />} b={<V c="richard_nixon" p={7} x={960} y={1000} h={590} />} />
          <From at={won}><Cheer x={660} y={330} w={600} /></From>
          <Crowd y={945} n={9} seed={5} bob={8} signs={[[0, "NIXON"], [3, "NIXON", "#b8362f"], [6, "'68", "#2b3f74"], [8, "NIXON"]]} />
        </Svg>
      </Cam>
      <Cap text="Election of 1968" at={t(wd(9, "1968"))} />
    </>);
  }, sfx: [sfxAt(9, "won", "cheer", 0.08)] },
  // 10 Eight years as vice president, eight years out of office, then the top job.
  { a: ln(10), el: (t) => (
    <Svg bg={<Timeline from={1950} to={1975} drawAt={0} drawFrames={t(wd(10, "top"))}
      marks={[{ year: 1953, c: "richard_nixon", at: 2, label: "VP" }, { year: 1961, c: "richard_nixon", at: t(wd(10, "eight", 1)), label: "OUT" }, { year: 1969, c: "richard_nixon", at: t(wd(10, "top")), label: "PRESIDENT" }]} />}>
      <Quill pose="speaking_facing_right" x={200} y={1010} h={320} />
    </Svg>
  ) },
  // 11 Watergate eventually destroyed that comeback.
  { a: ln(11), el: (t, dur) => {
    const de = t(wd(11, "destroyed"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.08} ox="48%" oy="62%"><Svg bg={<Watergate night />} /></Cam>],
        [de, <Cam dur={dur} from={1.02} to={1.06} oy="45%" punch={{ at: t(wd(11, "comeback")), frames: 5, to: 1.18, ox: "50%", oy: "40%" }}><Svg bg={<OvalOffice era="nixon" />}>
          <V c="richard_nixon" p={8} x={960} y={1010} h={580} />
          <Sweat x={1080} y={470} at={de + R} s={1.1} />
          <Sweat x={850} y={500} at={de + R + 6} s={0.9} />
        </Svg></Cam>],
      ]} />
      <Cap text="The Watergate · June 1972" at={2} until={de} />
    </>);
  } },
  // 12 In 1974, Nixon became the first U.S. president to resign.
  { a: ln(12), el: (t, dur) => {
    const first = t(wd(12, "first"));
    const lh = 560, ly = 960;
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.06} oy="50%"><Svg bg={<OvalOffice era="nixon" />}>
          <DeskBehind x={960} top={deskTop(ly, lh, 0.7454)} w={720} />
          <V c="richard_nixon" p={9} x={960} y={ly} h={lh} />
        </Svg></Cam>],
        [first, <Cam dur={dur} from={1.0} to={1.08} ox="45%" oy="45%"><Svg bg={<ResignLetter signAt={2} />} /></Cam>],
      ]} />
      <Cap text="August 9, 1974" at={t(wd(12, "1974"))} until={first} />
      <Stamp lines={["FIRST PRESIDENT", "TO RESIGN"]} at={t(wd(12, "resign"))} x={1420} y={880} rot={-10} variant="red" />
    </>);
  }, sfx: [sfxAt(12, "first", "scribble", 0.1)] },
  // 13 Which brings us to Gerald Ford.
  { a: ln(13), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05} oy="60%">
      <Svg bg={<HouseFloor />}>
        <Act c="gerald_ford" x={1690} y={1010} h={540} flip e={0} />
        <Quill pose="speaking_facing_right" x={330} y={1020} h={330} />
      </Svg>
    </Cam>
    <Card text="Gerald Ford" sub="40th Vice President · 38th President" at={t(wd(13, "gerald"))} />
  </>) },
  // 14 Nixon's original vice president, Spiro Agnew, had already resigned.
  { a: ln(14), el: (t, dur) => {
    const rs = t(wd(14, "resigned"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.07} oy="50%">
        <Svg bg={<Courtroom />}>
          <Swap t={rs} a={<Act c="spiro_agnew" x={960} y={1000} h={580} e={[[0, 0], [t(wd(14, "already")) + R, 4]]} sweat={t(wd(14, "already")) + R} />}
            b={<V c="spiro_agnew" p={8} x={960} y={1000} h={570} />} />
          <BarRailFG />
        </Svg>
      </Cam>
      <Cap text="Spiro Agnew · October 1973" at={t(wd(14, "spiro"))} />
    </>);
  } },
  // 15 Nixon nominated Ford to replace him, and Congress confirmed him.
  { a: ln(15), el: (t, dur) => {
    const cg = t(wd(15, "congress")), cf = t(wd(15, "confirmed"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.05} oy="55%"><Svg bg={<EastRoom evening />}>
          <Act c="richard_nixon" x={620} y={1010} h={590} e={5} talk={[0, cg]} />
          <Lectern x={620} y={830} w={280} seal />
          <Act c="gerald_ford" x={1330} y={1010} h={560} flip e={[[0, 0], [t(wd(15, "ford")) + R, 3], [t(wd(15, "replace")) + R, 5]]} />
          <Crowd y={1000} x0={900} x1={1920} n={4} seed={9} s={0.85} />
        </Svg></Cam>],
        [cg, <Cam dur={dur} from={1.0} to={1.06} oy="55%"><Svg bg={<HouseFloor />}>
          <Swap t={cf - cg} a={<Act c="gerald_ford" x={960} y={1010} h={560} e={0} />} b={<V c="gerald_ford" p={7} x={960} y={1010} h={550} />} />
          <Crowd y={1000} n={8} seed={2} s={0.9} />
        </Svg></Cam>],
      ]} />
      <Cap text="October 12, 1973" pos="top" at={2} until={cg} />
      <Cap text="House vote: 387–35" pos="top" at={cf} />
    </>);
  } },
  // 16 Eight months later, Nixon resigned too.
  { a: ln(16), el: (t, dur) => {
    const rs = t(wd(16, "resigned"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.06} ox="55%" oy="60%">
        <Svg bg={<SouthLawnHeli />}>
          <Swap t={rs} a={<V c="richard_nixon" p={10} x={1255} y={700} h={250} />} b={<V c="richard_nixon" p={7} x={1255} y={700} h={250} />} />
          <Act c="gerald_ford" x={560} y={1010} h={600} e={[[0, 0], [rs + R, 3]]} sweat={t(wd(16, "too")) + R} />
          <Crowd y={990} x0={0} x1={320} n={2} seed={6} />
        </Svg>
      </Cam>
      <Cap text="August 9, 1974" at={t(wd(16, "nixon"))} />
    </>);
  } },
  // 17 Ford became president without winning an election for either national office.
  { a: ln(17), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06} oy="55%">
      <Svg bg={<EastRoom />}>
        <V c="gerald_ford" p={7} x={760} y={1010} h={580} />
        <QMarks x={760} y={340} at={t(wd(17, "election")) + R} spread={240} />
        <Quill pose="scoreboard_facing_left" x={1420} y={1010} h={420} at={t(wd(17, "without"))} enter={{ from: "right", frames: 8, dist: 700 }}>
          <Board pose="scoreboard_facing_left" top="ELECTIONS WON" big="0" />
        </Quill>
        <Crowd y={1000} x0={0} x1={420} n={2} seed={12} s={0.9} />
      </Svg>
    </Cam>
    <Cap text="Sworn in · East Room" at={2} until={t(wd(17, "without"))} />
    <Cap text="Elections won: 0" at={t(wd(17, "either"))} />
  </>) },
  // 18 A month afterward, he pardoned Nixon, igniting another political firestorm.
  { a: ln(18), el: (t, dur) => {
    const ig = t(wd(18, "igniting")), pd = t(wd(18, "pardoned"));
    const lh = 520, ly = 935;
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.05} oy="50%"><Svg bg={<OvalOffice era="nixon" />}>
          <DeskBehind x={960} top={deskTop(ly, lh, 0.8664)} w={720} />
          <V c="gerald_ford" p={8} x={960} y={ly} h={lh} />
          <V c="shared_props_modern" p={13} x={1460} y={940} h={340} at={pd} drop={{ frames: 7, height: 900 }} />
          <Quill pose="pardon_plea" x={330} y={1020} h={330} at={pd + R} />
        </Svg></Cam>],
        [ig, <Cam dur={dur} from={1.0} to={1.07} oy="40%"><Svg bg={<PardonPaper burnAt={4} />} /></Cam>],
      ]} />
      <Cap text="September 8, 1974" at={t(wd(18, "month"))} until={ig} />
    </>);
  } },
  // 19 He tried to move the country past Watergate, but the pardon followed him into his losing campaign against Jimmy Carter.
  { a: ln(19), el: (t, dur) => {
    const lo = t(wd(19, "losing"));
    const sp = walkSpeed("gerald_ford", 520);
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.04} oy="60%"><Svg bg={<Watergate />}>
          <Act c="gerald_ford" x={260} y={1010} h={520} walk={1} e={[[0, 5], [t(wd(19, "followed")) + R, 3]]} sweat={t(wd(19, "followed")) + R} />
          <Trailing at={t(wd(19, "pardon"))} x0={60} v={sp} y={760} />
        </Svg></Cam>],
        [lo, <Cam dur={dur} from={1.0} to={1.06} oy="45%"><Svg bg={<Debate1976 />}>
          <Sulk at={t(wd(19, "carter")) - lo + R}>
            <Act c="gerald_ford" x={600} y={985} h={560} e={[[0, 0], [t(wd(19, "carter")) - lo + R, 4]]} />
          </Sulk>
          <Lectern x={600} y={845} w={260} color="#3a3f5a" />
          <Act c="jimmy_carter" x={1320} y={985} h={570} flip e={5} gesture={12} stress at={t(wd(19, "jimmy")) - lo} enter={{ from: "right", frames: 8, dist: 700 }} />
          <Lectern x={1320} y={845} w={260} color="#3a3f5a" />
          <Crowd y={1000} n={9} seed={8} s={0.85} />
        </Svg></Cam>],
      ]} />
      <Cap text="Election of 1976" pos="top" at={lo} />
    </>);
  } },
  // 20 George H.W. Bush took a more familiar route.
  { a: ln(20), el: (t, dur) => {
    const card = t(wd(20, "took")), fam = t(wd(20, "familiar"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.06} oy="55%"><Svg bg={<NavalObservatory />}>
          <Act c="george_hw_bush" x={1460} y={1010} h={560} at={card} e={5} enter={{ from: "right", frames: 8, dist: 600 }} />
        </Svg></Cam>],
        [fam, <Cam dur={dur} from={1.0} to={1.04}><Svg bg={<DCRoute at={0} frames={36} />}><Rider at={0} frames={36} /></Svg></Cam>],
      ]} />
      <Card text="George H.W. Bush" sub="43rd Vice President · 41st President" until={card} />
    </>);
  } },
  // 21 After eight years as Ronald Reagan's vice president, he won the 1988 election.
  { a: ln(21), el: (t, dur) => {
    const won = t(wd(21, "won"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.05} oy="55%"><Svg bg={<WestFront1981 />}>
          <Act c="ronald_reagan" x={720} y={1010} h={600} e={5} gesture={10} stress />
          <Act c="george_hw_bush" x={1220} y={1010} h={590} flip e={[[0, 0], [t(wd(21, "reagan")) + R, 5]]} />
        </Svg></Cam>],
        [won, <Cam dur={dur} from={1.0} to={1.05} oy="45%"><Svg bg={<Houston1988 />}>
          <Balloons n={18} seed={8} y0={-300} y1={300} fall={6} />
          <V c="george_hw_bush" p={6} x={960} y={1000} h={600} />
          <Confetti />
          <Cheer x={660} y={350} w={600} />
          <Crowd y={950} n={9} seed={14} bob={9} signs={[[1, "BUSH"], [2, "BUSH", "#b8362f"], [7, "'88", "#2b3f74"]]} />
        </Svg></Cam>],
      ]} />
      <Cap text="Reagan's VP · 1981–1989" at={t(wd(21, "eight"))} until={won} />
      <Cap text="Election of 1988" pos="top" at={t(wd(21, "1988"))} />
    </>);
  }, sfx: [sfxAt(21, "won", "cheer", 0.08)] },
  // 22 He was the first sitting vice president to win since Van Buren, a gap of 152 years.
  { a: ln(22), el: (t) => (
    <Svg bg={<Timeline from={1820} to={1990} drawAt={t(wd(22, "since"))} drawFrames={t(wd(22, "years")) - t(wd(22, "since"))}
      marks={[{ year: 1836, c: "martin_van_buren", at: t(wd(22, "van")), label: "1836" }, { year: 1988, c: "george_hw_bush", at: 2, label: "1988" }]} />}>
      <Swap t={t(wd(22, "152")) + R} a={<Quill pose="deadpan_wings_folded" x={140} y={1010} h={300} />} b={<Quill pose="startled_recoil" x={140} y={1010} h={300} />} />
      <Big x={960} y={250} text="152 YEARS" size={120} fill="#ffd25a" at={t(wd(22, "152"))} />
    </Svg>
  ) },
  // 23 Bush led the coalition that drove Iraqi forces out of Kuwait.
  { a: ln(23), el: (t, dur) => {
    const dr = t(wd(23, "drove"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.06} oy="50%"><Svg bg={<OvalOffice era="bush" />}>
          <V c="george_hw_bush" p={8} x={900} y={1010} h={590} />
        </Svg></Cam>],
        [dr, <Cam dur={dur} from={1.0} to={1.05} oy="60%"><Svg bg={<KuwaitDesert />}>
          <Drive v={9}><Truck x={1180} y={700} s={0.7} /><Truck x={1500} y={740} s={0.8} /></Drive>
          <Slide at={0} frames={18} dx={700}>
            <Tank x={-60} y={830} s={0.85} flag="us" /><Tank x={-480} y={760} s={0.65} flag="uk" />
            <Tank x={-330} y={950} s={1.0} flag="sa" /><Tank x={-760} y={880} s={0.8} flag="fr" />
          </Slide>
        </Svg></Cam>],
      ]} />
      <Cap text="Gulf War · 1991" at={t(wd(23, "coalition"))} until={dr} />
      <Cap text="Kuwait, February 1991" pos="top" at={t(wd(23, "kuwait"))} />
    </>);
  }, sfx: [sfxAt(23, "drove", "whoosh", 0.1)] },
  // 24 At home, he agreed to a budget deal that raised taxes after campaigning against new ones.
  { a: ln(24), el: (t, dur) => {
    const cp = t(wd(24, "campaigning"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.05} oy="50%"><Svg bg={<OvalOffice era="bush" />}>
          <DeskBehind x={900} top={965} w={430} color="#7a4a26" />
          <V c="george_hw_bush" p={10} x={900} y={990} h={560} />
          <V c="shared_props_modern" p={16} x={1420} y={900} h={320} at={t(wd(24, "raised"))} drop={{ frames: 7, height: 900 }} />
        </Svg></Cam>],
        [cp, <Cam dur={dur} from={1.0} to={1.05} oy="45%"><Svg bg={<Superdome1988 />}>
          <Act c="george_hw_bush" x={620} y={1010} h={590} e={5} talk />
          <Lectern x={620} y={845} w={280} color="#2b3f74" />
          <Bubble x={700} y={190} w={980} text="READ MY LIPS: NO NEW TAXES!" at={4} tail={[650, 360]} size={54} />
          <Quill pose="nervous_side_glance" x={1600} y={1010} h={320} at={t(wd(24, "new")) - cp} />
        </Svg></Cam>],
      ]} />
      <Cap text="1990 budget deal" at={t(wd(24, "budget"))} until={cp} />
      <Cap text="New Orleans, 1988" at={cp} />
    </>);
  } },
  // 25 His foreign-policy success didn't secure another term.
  { a: ln(25), el: (t, dur) => {
    const dn = t(wd(25, "didn"));
    return (
      <Cam dur={dur} from={1.0} to={1.06} oy="50%">
        <Svg bg={<OvalOffice era="bush" />} dim={0.45}>
          <DownArrow at={dn} x={900} y={260} w={760} h={480} />
          <Pop at={t(wd(25, "success")) - 6} out={dn} x={1400} y={330} label="FOREIGN POLICY"><Trophy /></Pop>
          <Act c="george_hw_bush" x={560} y={1010} h={600} e={[[0, 5], [dn + R, 4]]} sweat={t(wd(25, "term")) + R} />
        </Svg>
      </Cam>
    );
  } },
  // 26 Bill Clinton defeated him in 1992.
  { a: ln(26), el: (t, dur) => {
    const df = t(wd(26, "defeated"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.05} oy="50%" punch={{ at: df, frames: 6, to: 1.08, ox: "62%", oy: "45%" }}>
        <Svg bg={<Richmond1992 />}>
          <Sulk at={df + R}><Act c="george_hw_bush" x={660} y={1000} h={580} e={[[0, 0], [df + R, 4]]} /></Sulk>
          <Act c="bill_clinton" x={1260} y={1000} h={590} flip e={[[0, 0], [df, 5]]} gesture={12} stress />
          <Crowd y={1010} n={8} seed={21} s={0.85} />
          <Quill pose="deadpan_wings_folded" x={1730} y={1080} h={300} />
        </Svg>
      </Cam>
      <Cap text="Election of 1992" pos="top" at={t(wd(26, "1992"))} />
    </>);
  } },
];

export const VicePresidents4: React.FC<{ noAudio?: boolean }> = ({ noAudio }) => <Episode data={D} shots={SHOTS} noAudio={noAudio} />;
