import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Board, Episode, epDuration, makeAlign, Shot, Steps, Svg, Swap } from "../Thanksgiving3/Episode";
import { Arch, Cam, Cap, Card, Puff, Quill, Rig, Stamp } from "../Thanksgiving3/Kit";
import { LampGrade, OathParlor, RockerFG } from "./PilotBg";
import { Slide } from "./Pilot";
import { Act, DownArrow, INK, Sulk, Sweat, Timeline, V, Vein, VoteBoard } from "./VKit";
import {
  AF1FG, AF1Stateroom, CandleGrade, WritingTable, BalconyRail, BallotInsert, BigChair, CabinetBacks, Capitol1800, CapitolEast1837, CapitolSteps,
  ChairFG, CongressHallSenate, CrowdBack, EastRoom1800, FederalBalcony, FederalHall1789, GazetteInsert, HARRISON_CANDLE,
  HarrisonRoom, HouseRoom1801, IronFence, JeffersonCabinet, Lindenwald, LogCabinRally, LouisianaMap, MembersFG, MountVernon,
  NamePlateDesk, PresidentsHousePhila, SenateChairsFG, SenateDais, TallySlate, VBDesk, VBOffice1837, WallStreet1837, WhiteHouseNorth,
} from "./bg/Part1";
import DATA from "./ep/vp1.json";

/**
 * Part 1 (VO vp1.mp3): cold open + Adams, Jefferson, Burr, Van Buren, ending on Harrison/Tyler.
 * Rebuilt in the pilot style (src/VP/Pilot.tsx): one painted plate per real place (src/VP/bg/Part1.tsx),
 * varied shot sizes, foreground occluders, in-scene Quill (beak closed), 1-frame expression / pose swaps on the
 * motivating word with listeners +4 f, one continuous camera move per shot plus punch moves on beats,
 * hard-cut captions, name cards on the dimmed establishing plate, one slam stamp.
 */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const VP1_DURATION = epDuration(D);
const R = 4; // listener reaction delay (frames)

const FIFTEEN = ["john_adams", "thomas_jefferson", "martin_van_buren", "john_tyler", "millard_fillmore", "andrew_johnson", "chester_arthur",
  "theodore_roosevelt", "calvin_coolidge", "harry_truman", "lyndon_johnson", "richard_nixon", "gerald_ford", "george_hw_bush", "joe_biden"];
const ACTORS = new Set(["john_adams", "thomas_jefferson", "martin_van_buren", "john_tyler", "millard_fillmore", "andrew_johnson", "chester_arthur", "calvin_coolidge", "lyndon_johnson", "gerald_ford"]);

/** Rig walk travel (Kit.Rig): walk * stride/16f per frame; `frac` = stride / sprite height (from vprig legs). */
const STRIDE: Record<string, number> = { gerald_ford: 0.1286, john_tyler: 0.11, george_washington: 0.1187, thomas_jefferson: 0.1081, andrew_jackson: 0.1151 };
const travel = (c: string, h: number, walk: number, frames: number) => walk * STRIDE[c] * h / 16 * frames;

/** Whole drawing leans (rotates about its feet) from `at` over 6 f: Washington literally leaning on his cabinet. */
const Lean: React.FC<{ at: number; deg: number; x: number; y: number; children: React.ReactNode }> = ({ at, deg, x, y, children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - at, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return <g transform={`rotate(${deg * p} ${x} ${y})`}>{children}</g>;
};

/** Decaying rattle of its children from `at` (bank shudders when the panic hits). */
const Shake: React.FC<{ at: number; amp?: number; children: React.ReactNode }> = ({ at, amp = 14, children }) => {
  const f = useCurrentFrame();
  const k = f < at ? 0 : Math.max(0, 1 - (f - at) / 18);
  return <g transform={`translate(${Math.sin(f * 2.6) * amp * k} ${Math.cos(f * 3.3) * amp * 0.4 * k})`}>{children}</g>;
};

/** Plymouth Notch parlour: moonlit until the lantern comes up on "lamp". */
const LANTERN: [number, number] = [1123, 744];
const LanternRoom: React.FC<{ lampAt: number; children: React.ReactNode }> = ({ lampAt, children }) => {
  const f = useCurrentFrame();
  const lit = interpolate(f, [lampAt, lampAt + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  return (<>
    {children}
    <RockerFG />
    <LampGrade lit={lit} cx={LANTERN[0]} cy={LANTERN[1]} />
    {lit > 0 && <circle cx={LANTERN[0]} cy={LANTERN[1]} r={30} fill="#fff3c4" opacity={0.7 * lit} />}
  </>);
};

/** Wall Street 1837 with a gloom grade ramping in from `gloomAt`. */
const BankRun: React.FC<{ closedAt?: number; signFallAt?: number; gloomAt?: number }> = ({ closedAt, signFallAt, gloomAt = 99999 }) => {
  const f = useCurrentFrame();
  const g = interpolate(f, [gloomAt, gloomAt + 14], [0, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <WallStreet1837 closedAt={closedAt} signFallAt={signFallAt} gloom={g} />;
};

/** Chalk slate counting the House ballots 1 -> 36. */
const Tally: React.FC<{ a: number; b: number; winAt: number }> = ({ a, b, winAt }) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [a, b], [1, 36], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return <TallySlate x={1480} y={560} n={n} result={f >= winAt ? "JEFFERSON" : undefined} />;
};

export const SHOTS: Shot[] = [
  // 0 One became president after his boss lasted just a month.  (Harrison's deathbed, April 1841)
  { a: ln(0), el: (t, dur) => {
    const m = t(wd(0, "month"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.06} ox="45%" oy="55%" punch={{ at: m, frames: 6, to: 1.26, ox: "50%", oy: "62%" }}>
        <Svg bg={<HarrisonRoom />}>
          <V c="william_henry_harrison" p={10} x={1230} y={1010} h={500} />
          <Act c="john_tyler" x={500} y={1010} h={600} e={[[0, 0], [m + R, 3]]} sweat={m + R + 2} />
          <ChairFG />
          <CandleGrade cx={HARRISON_CANDLE[0]} cy={HARRISON_CANDLE[1]} />
        </Svg>
      </Cam>
      <Cap text="1841" pos="top" />
    </>);
  } },
  // 1 Another took the oath beside a grieving first lady on an airplane.  (Air Force One, Love Field)
  { a: ln(1), el: (t, dur) => {
    const g = t(wd(1, "grieving"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.07} oy="45%" punch={{ at: g, frames: 8, to: 1.08, ox: "62%", oy: "42%" }}>
        <Svg bg={<AF1Stateroom />}>
          <Swap t={t(wd(1, "oath"))} a={<Act c="lyndon_johnson" x={900} y={1010} h={600} />} b={<V c="lyndon_johnson" p={5} x={900} y={1010} h={620} />} />
          <Act c="jacqueline_kennedy" x={1330} y={1010} h={560} e={[[0, 0], [g + R, 4]]} tears={g + R + 4} />
          <AF1FG />
        </Svg>
      </Cam>
      <Cap text="1963 · Air Force One" at={t(wd(1, "first"))} />
    </>);
  } },
  // 2 And one reached the White House without ever winning a presidential or vice-presidential election.
  { a: ln(2), el: (t, dur) => {
    const stop = t(wd(2, "house")), x0 = 260;
    const xs = x0 + travel("gerald_ford", 560, 2, stop);
    const wo = t(wd(2, "without"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.06} oy="60%">
        <Svg bg={<WhiteHouseNorth />}>
          <Swap t={wo}
            a={<Rig c="vp_gerald_ford" pose="0" x={x0} y={1010} h={560} walk={2} walkUntil={stop} />}
            b={<V c="gerald_ford" p={9} x={xs} y={1010} h={560} />} />
          <Quill pose="scoreboard_facing_left" x={1460} y={1010} h={420} at={t(wd(2, "winning"))} enter={{ from: "right", frames: 8, dist: 700 }}>
            <Board pose="scoreboard_facing_left" top="ELECTIONS WON" big="0" />
          </Quill>
          <IronFence />
        </Svg>
      </Cam>
      <Cap text="1974" pos="top" at={0} until={wo} />
    </>);
  } },
  // 3 These are all fifteen U.S. vice presidents who became president, how they got there, and what happened after the promotion.
  { a: ln(3), el: (t, dur) => (<>
    <Cam dur={dur} from={1.2} to={1.0} oy="60%">
      <Svg bg={<CapitolSteps />}>
        {FIFTEEN.map((c, i) => {
          const back = i < 8;
          const x = back ? 180 + i * 222 : 290 + (i - 8) * 222;
          const y = back ? 760 : 1050, h = back ? 300 : 340, at = 2 + i * 4;
          return ACTORS.has(c)
            ? <Act key={c} c={c} x={x} y={y} h={h} at={at} enter={{ from: "bottom", frames: 7 }} e={[[0, 0], [t(wd(3, "promotion")) + R + (i % 4), 5]]} />
            : <V key={c} c={c} p={0} x={x} y={y} h={h} at={at} enter={{ from: "bottom", frames: 7 }} />;
        })}
      </Svg>
    </Cam>
    <Cap text="15 vice presidents" pos="top" at={t(wd(3, "fifteen"))} until={t(wd(3, "became"))} size={70} />
    <Cap text="who became president" pos="top" at={t(wd(3, "became"))} until={t(wd(3, "how"))} size={70} />
  </>), sfx: [[2, "pop", 0.08], [30, "pop", 0.06], [58, "pop", 0.06]] },
  // 4 One new president's dad even has to bring out a lamp.  (Plymouth Notch, 1923: same parlour as the pilot)
  { a: ln(4), el: (t, dur) => {
    const lamp = t(wd(4, "lamp"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.06} ox="45%" oy="62%" punch={{ at: lamp, frames: 6, to: 1.14, ox: "58%", oy: "68%" }}>
        <Svg bg={<OathParlor />}>
          <LanternRoom lampAt={lamp}>
            <Act c="calvin_coolidge" x={640} y={1030} h={600} e={[[0, 0], [t(wd(4, "dad")) + R, 3]]} />
            <Swap t={t(wd(4, "bring"))} a={<Act c="john_coolidge_senior" x={1250} y={1010} h={580} flip />} b={<V c="john_coolidge_senior" p={6} x={1250} y={1010} h={580} />} />
          </LanternRoom>
        </Svg>
      </Cam>
      <Cap text="1923 · Plymouth Notch, Vermont" pos="top" />
    </>);
  } },
  // 5 It starts with John Adams, George Washington's vice president.  (Federal Hall, Wall Street, 1789)
  { a: ln(5), el: (t, dur) => {
    const g = t(wd(5, "george"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.06} oy="50%"><Svg bg={<FederalHall1789 />}><CrowdBack y={1080} n={11} s={0.8} era="1789" seed={3} /></Svg></Cam>],
        [g, <Cam dur={dur} from={1.0} to={1.05} oy="45%"><Svg bg={<FederalBalcony />}>
          <Act c="john_adams" x={620} y={1010} h={560} e={[[0, 5], [t(wd(5, "vice")) + R, 4]]} gesture={10} stress />
          <V c="george_washington" p={1} x={1290} y={1010} h={620} flip />
          <BalconyRail />
        </Svg></Cam>],
      ]} />
      <Card text="John Adams" sub="1st Vice President · 2nd President" until={g} />
      <Cap text="George Washington" at={g} until={t(wd(5, "vice"))} />
      <Cap text="Federal Hall, New York · 1789" at={t(wd(5, "vice"))} />
    </>);
  } },
  // 6 For eight years, Washington leaned on his cabinet while Adams complained about how insignificant his own job was.
  { a: ln(6), el: (t, dur) => {
    const ad = t(wd(6, "adams"));
    const r = (w: string) => t(wd(6, w));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.06} ox="55%" oy="55%"><Svg bg={<PresidentsHousePhila />}>
          <V c="thomas_jefferson" p={1} x={470} y={1010} h={570} />
          <Lean at={t(wd(6, "leaned"))} deg={-7} x={1180} y={1000}><V c="george_washington" p={8} x={1180} y={1000} h={520} /></Lean>
          <CabinetBacks />
        </Svg></Cam>],
        [ad, <Cam dur={dur} from={1.0} to={1.1} oy="40%"><Svg bg={<CongressHallSenate />}>
          <Swap t={r("job") + R} a={<V c="john_adams" p={6} x={960} y={890} h={560} stress />} b={<Act c="john_adams" x={960} y={890} h={540} e={4} />} />
          <Swap t={r("job") + R} a={<Vein x={1030} y={420} at={r("insignificant")} />} b={null} />
          <SenateDais />
          <SenateChairsFG />
        </Svg></Cam>],
      ]} />
      <Cap text="1789–1797" pos="top" until={ad} />
      <Cap text={'"The most insignificant office"'} at={t(wd(6, "insignificant"))} size={64} />
    </>);
  } },
  // 7 Then Washington retired, and Adams won the election of 1796.
  { a: ln(7), el: (t, dur) => {
    const ad = t(wd(7, "adams"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.05} oy="60%"><Svg bg={<MountVernon />}><Rig c="vp_george_washington" pose="1" x={260} y={1010} h={560} walk={1.6} /></Svg></Cam>],
        [ad, <Cam dur={dur} from={1.0} to={1.04}><Svg bg={<GazetteInsert at={ad} head="vp/john_adams/17" headline={["ADAMS ELECTED", "PRESIDENT"]} date="PHILADELPHIA · FEBRUARY 1797" />}>
          <V c="john_adams" p={7} x={1600} y={1110} h={640} at={t(wd(7, "won"))} enter={{ from: "bottom", frames: 6 }} />
        </Svg></Cam>],
      ]} />
      <Cap text="1797 · Mount Vernon" until={ad} />
      <Cap text="Election of 1796" at={t(wd(7, "election"))} />
    </>);
  }, sfx: [[Math.round((wd(7, "won") - ln(7)) * 30), "cheer", 0.08]] },
  // 8 There was one awkward detail.  (Congress Hall Senate: the presiding chair Adams has just left)
  { a: ln(8), el: (t, dur) => (
    <Cam dur={dur} from={1.0} to={1.06} oy="55%" punch={{ at: t(wd(8, "awkward")), frames: 5, to: 1.14, ox: "50%", oy: "55%" }}>
      <Svg bg={<CongressHallSenate />}>
        <SenateDais />
        <SenateChairsFG />
        <Swap t={t(wd(8, "awkward"))} a={<Quill pose="speaking_facing_right" x={640} y={1050} h={390} />} b={<Quill pose="nervous_side_glance" x={640} y={1050} h={390} />} />
      </Svg>
    </Cam>
  ) },
  // 9 Under the original electoral system, the runner-up became vice president.
  { a: ln(9), el: (t) => (<>
    <Svg bg={<VoteBoard title="ELECTION OF 1796 · ELECTORAL VOTES" rows={[
      { c: "john_adams", name: "JOHN ADAMS", v: 71, max: 80, role: "PRESIDENT", roleAt: t(wd(9, "runner")) - 10, roleColor: "#ffe08a", e: [[0, 0], [t(wd(9, "runner")) - 6, 5]] },
      { c: "thomas_jefferson", name: "THOMAS JEFFERSON", v: 68, max: 80, role: "VICE PRESIDENT", roleAt: t(wd(9, "vice")), e: [[0, 0], [t(wd(9, "vice")) + R, 2]] },
    ]} />} />
  </>) },
  // 10 So Adams got Thomas Jefferson, the man who had just run against him.  (President's House, Philadelphia)
  { a: ln(10), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05} oy="50%">
      <Svg bg={<PresidentsHousePhila />}>
        <Swap t={t(wd(10, "run")) + R} a={<V c="john_adams" p={1} x={600} y={1010} h={580} />} b={<V c="john_adams" p={8} x={600} y={1010} h={580} />} />
        <Swap t={t(wd(10, "against"))}
          a={<V c="thomas_jefferson" p={1} x={1320} y={1010} h={600} flip at={t(wd(10, "thomas"))} enter={{ from: "right", frames: 8, dist: 800 }} />}
          b={<V c="thomas_jefferson" p={10} x={1320} y={1010} h={600} flip />} />
      </Svg>
    </Cam>
    <Cap text="Thomas Jefferson" at={t(wd(10, "thomas"))} until={t(wd(10, "run"))} />
  </>) },
  // 11 His defeated opponent was now his deputy.
  { a: ln(11), el: (t, dur) => {
    const d = t(wd(11, "deputy"));
    return (
      <Cam dur={dur} from={1.1} to={1.14} oy="55%">
        <Svg bg={<PresidentsHousePhila />}>
          <V c="john_adams" p={8} x={600} y={1010} h={580} />
          <Vein x={680} y={530} at={d + R} />
          <V c="thomas_jefferson" p={10} x={1320} y={1010} h={600} flip />
          <NamePlateDesk x={1320} a="RUNNER-UP" b="VICE PRESIDENT" at={d} />
        </Svg>
      </Cam>
    );
  } },
  // 12 Four years later, Jefferson ran against him again.  (Washington City, 1800)
  { a: ln(12), el: (t, dur) => {
    const ag = t(wd(12, "again"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.05} oy="60%" punch={{ at: ag, frames: 6, to: 1.1, ox: "50%", oy: "50%" }}>
        <Svg bg={<Capitol1800 />}>
          <V c="john_adams" p={9} x={560} y={1010} h={600} />
          <V c="thomas_jefferson" p={6} x={1360} y={1010} h={600} flip at={t(wd(12, "jefferson"))} enter={{ from: "right", frames: 7 }} />
          <Vein x={650} y={540} at={ag + R} />
          <Vein x={1290} y={540} at={ag + R + 2} />
        </Svg>
      </Cam>
      <Cap text="Election of 1800" />
    </>);
  } },
  // 13 This time Adams lost, but Jefferson still had somebody to beat.
  { a: ln(13), el: (t, dur) => {
    const je = t(wd(13, "jefferson"));
    const sb = t(wd(13, "somebody"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.08} oy="50%"><Svg bg={<EastRoom1800 />}>
          <Sulk at={t(wd(13, "lost")) + R}>
            <Act c="john_adams" x={960} y={1010} h={580} e={[[0, 0], [t(wd(13, "lost")) + R, 4]]} tears={t(wd(13, "lost")) + R + 6} />
          </Sulk>
        </Svg></Cam>],
        [je, <Cam dur={dur} from={1.04} to={1.0} oy="60%"><Svg bg={<Capitol1800 />}>
          <Swap t={sb + R} a={<V c="thomas_jefferson" p={7} x={760} y={1010} h={620} />} b={<V c="thomas_jefferson" p={1} x={760} y={1010} h={600} />} />
          <V c="aaron_burr" p={1} x={1420} y={1010} h={590} flip at={sb} enter={{ from: "right", frames: 6, dist: 500 }} />
        </Svg></Cam>],
      ]} />
      <Cap text="The President's House · 1800" until={je} size={64} />
    </>);
  } },
  // 14 His own running mate, Aaron Burr, had received exactly as many electoral votes.
  { a: ln(14), el: (t, dur) => {
    const ex = t(wd(14, "exactly"));
    const vt = t(wd(14, "votes"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.12} to={1.18} oy="55%"><Svg bg={<Capitol1800 />}>
          <V c="thomas_jefferson" p={1} x={760} y={1010} h={600} />
          <Swap t={t(wd(14, "burr")) + R} a={<V c="aaron_burr" p={1} x={1240} y={1010} h={590} flip />} b={<V c="aaron_burr" p={6} x={1240} y={1010} h={590} flip />} />
        </Svg></Cam>],
        [ex, <Svg bg={<VoteBoard title="ELECTION OF 1800 · ELECTORAL VOTES" at={ex} rows={[
          { c: "thomas_jefferson", name: "THOMAS JEFFERSON", v: 73, max: 80, e: [[0, 0], [vt + R, 3]] },
          { c: "aaron_burr", name: "AARON BURR", v: 73, max: 80, role: "TIE!", roleAt: vt, roleColor: "#ff8a7a", e: [[0, 0], [vt + R, 5]] },
        ]} />} />],
      ]} />
      <Cap text="Aaron Burr" at={t(wd(14, "aaron"))} until={ex} />
    </>);
  } },
  // 15 Back then, electors didn't cast separate votes for president and vice president.
  { a: ln(15), el: (t, dur) => (
    <Cam dur={dur} from={1.0} to={1.06}>
      <Svg bg={<BallotInsert at1={t(wd(15, "electors"))} at2={t(wd(15, "cast"))} ask={t(wd(15, "president"))} />} />
    </Cam>
  ), sfx: [[2, "paper", 0.12]] },
  // 16 The tie went to the House of Representatives, which took thirty-six ballots to choose Jefferson.
  { a: ln(16), el: (t, dur) => {
    const je = t(wd(16, "jefferson"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.06} oy="45%" punch={{ at: je, frames: 6, to: 1.25, ox: "77%", oy: "48%" }}>
        <Svg bg={<HouseRoom1801 />}>
          <Tally a={t(wd(16, "took"))} b={t(wd(16, "ballots")) + 8} winAt={je} />
          <MembersFG />
        </Svg>
      </Cam>
      <Cap text="February 1801 · House of Representatives" pos="top" until={t(wd(16, "took"))} size={60} />
    </>);
  } },
  // 17 America had almost elected the running mate instead of the intended president.
  { a: ln(17), el: (t, dur) => {
    const el = t(wd(17, "elected")), ins = t(wd(17, "instead"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.06} ox="55%" oy="55%">
        <Svg bg={<HouseRoom1801 />}>
          <Slide at={ins} frames={5} dx={1100}><BigChair x={1500} y={1000} /></Slide>
          <Swap t={el} a={<V c="aaron_burr" p={1} x={1060} y={1010} h={600} />}
            b={<Swap t={ins + R} a={<Slide at={el} frames={10} dx={120}><V c="aaron_burr" p={11} x={1060} y={1010} h={600} /></Slide>} b={<V c="aaron_burr" p={9} x={1180} y={1010} h={600} />} />} />
          <Quill pose="nervous_side_glance" x={330} y={1010} h={360} />
        </Svg>
      </Cam>
      <Stamp lines={["ALMOST", "PRESIDENT"]} at={t(wd(17, "almost"))} x={640} y={290} rot={-8} variant="dark" />
    </>);
  } },
  // 18 Jefferson finally took office in 1801 and later approved the Louisiana Purchase.
  { a: ln(18), el: (t, dur) => {
    const an = t(wd(18, "and")), lo = t(wd(18, "louisiana"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.05} oy="60%"><Svg bg={<Capitol1800 />}><Rig c="vp_thomas_jefferson" pose="1" x={240} y={1010} h={600} walk={1.8} /></Svg></Cam>],
        [an, <Cam dur={dur} from={1.0} to={1.06} oy="55%"><Svg bg={<JeffersonCabinet />}><V c="thomas_jefferson" p={8} x={960} y={1010} h={600} /><WritingTable x={960} y={1018} /></Svg></Cam>],
        [lo, <Cam dur={dur} from={1.0} to={1.08} ox="45%" oy="45%"><Svg bg={<LouisianaMap at={lo} />} /></Cam>],
      ]} />
      <Cap text="March 4, 1801" at={t(wd(18, "took"))} until={an} />
      <Cap text="1803" at={lo} />
    </>);
  } },
  // 19 The Twelfth Amendment changed the electoral system afterward.
  { a: ln(19), el: (_t, dur) => (<>
    <Arch src="amend12" dur={dur} />
    <Cap text="12th Amendment · 1804" />
  </>) },
  // 20 After Jefferson, another sitting vice president wouldn't win the presidency until Martin Van Buren in 1836.
  { a: ln(20), el: (t, dur) => (<>
    <Steps s={[
      [0, <Svg bg={<Timeline from={1800} to={1840} drawAt={t(wd(20, "another"))} drawFrames={t(wd(20, "martin")) - t(wd(20, "another"))}
        marks={[{ year: 1800, c: "thomas_jefferson", at: 0, label: "1800" }, { year: 1836, c: "martin_van_buren", at: t(wd(20, "martin")), label: "1836" }]} />} />],
      [t(wd(20, "1836")), <Cam dur={dur} from={1.0} to={1.04}><Svg bg={<CapitolEast1837 />}><CrowdBack y={1080} n={11} s={0.85} era="1837" seed={5} /></Svg></Cam>],
    ]} />
    <Card text="Martin Van Buren" sub="8th Vice President · 8th President" at={t(wd(20, "1836"))} />
  </>) },
  // 21 Andrew Jackson's trusted ally looked like a natural successor.  (East Portico, 4 March 1837)
  { a: ln(21), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06} oy="55%">
      <Svg bg={<CapitolEast1837 />}>
        <V c="andrew_jackson" p={8} x={640} y={1010} h={600} />
        <Swap t={t(wd(21, "natural"))} a={<V c="martin_van_buren" p={1} x={1260} y={1010} h={590} flip />} b={<V c="martin_van_buren" p={7} x={1260} y={1010} h={590} flip />} />
        <CrowdBack y={1110} n={9} s={0.9} era="1837" seed={8} />
      </Svg>
    </Cam>
    <Cap text="Andrew Jackson" at={0} until={t(wd(21, "looked"))} />
  </>) },
  // 22 Then, just months into his presidency, the Panic of 1837 hit.  (Wall Street, May 1837)
  { a: ln(22), el: (t, dur) => {
    const hit = t(wd(22, "hit"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.06} oy="55%" punch={{ at: hit, frames: 4, to: 1.06, ox: "60%", oy: "50%" }}>
        <Svg bg={<Shake at={hit}><BankRun /></Shake>}>
          <Swap t={hit + R}
            a={<Act c="martin_van_buren" x={470} y={1010} h={600} e={[[0, 5], [t(wd(22, "panic")) + R, 3]]} sweat={t(wd(22, "panic")) + R} />}
            b={<V c="martin_van_buren" p={9} x={470} y={1010} h={600} />} />
          <CrowdBack y={1110} x0={820} x1={1980} n={6} s={1.0} era="1837" seed={2} wave />
        </Svg>
      </Cam>
      <Cap text="Panic of 1837" pos="top" at={t(wd(22, "panic"))} />
    </>);
  } },
  // 23 Banks failed, businesses collapsed, and the country fell into a depression.
  { a: ln(23), el: (t, dur) => {
    const col = t(wd(23, "collapsed")), dep = t(wd(23, "depression"));
    return (<>
      <Cam dur={dur} from={1.06} to={1.12} oy="50%">
        <Svg bg={<BankRun closedAt={t(wd(23, "failed"))} signFallAt={col} gloomAt={t(wd(23, "fell"))} />}>
          <Puff x={300} y={820} at={col + 7} />
          <Swap t={dep + R} a={<V c="martin_van_buren" p={10} x={470} y={1010} h={600} />} b={<V c="martin_van_buren" p={12} x={470} y={1010} h={580} />} />
          <CrowdBack y={1110} x0={820} x1={1980} n={6} s={1.0} era="1837" seed={2} />
          <DownArrow at={dep - 6} x={760} y={110} w={760} h={330} />
        </Svg>
      </Cam>
    </>);
  }, sfx: [[2, "rattle", 0.1]] },
  // 24 Van Buren inherited troubles that had been building before he arrived.  (President's office, White House)
  { a: ln(24), el: (t, dur) => (
    <Cam dur={dur} from={1.0} to={1.05} oy="55%">
      <Svg bg={<VBOffice1837 />}>
        <Rig c="vp_andrew_jackson" pose="1" x={620} y={1010} h={580} flip walk={-1.4} />
        <V c="martin_van_buren" p={10} x={1060} y={1000} h={600} />
        <VBDesk />
        <V c="shared_props_early" p={13} x={720} y={812} h={170} at={t(wd(24, "building"))} drop={{ frames: 8, height: 700 }} />
        <V c="shared_props_early" p={13} x={1300} y={812} h={150} at={t(wd(24, "arrived"))} drop={{ frames: 8, height: 700 }} />
        <Sweat x={1150} y={480} at={t(wd(24, "troubles")) + R} />
      </Svg>
    </Cam>
  ) },
  // 25 Voters still handed him the bill.
  { a: ln(25), el: (t, dur) => {
    const b = t(wd(25, "bill"));
    return (
      <Cam dur={dur} from={1.08} to={1.14} oy="55%">
        <Svg bg={<VBOffice1837 />}>
          <Swap t={b + R} a={<Act c="martin_van_buren" x={1000} y={1000} h={600} e={[[0, 4]]} />} b={<V c="martin_van_buren" p={11} x={1000} y={1000} h={600} />} />
          <VBDesk />
          <V c="martin_van_buren" p={31} x={780} y={815} h={220} at={b} drop={{ frames: 8, height: 800 }} />
          <Quill pose="deadpan_wings_folded" x={1620} y={1010} h={380} />
        </Svg>
      </Cam>
    );
  } },
  // 26 In 1840, they replaced him with William Henry Harrison.
  { a: ln(26), el: (t, dur) => {
    const wi = t(wd(26, "william")), rp = t(wd(26, "replaced"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.06} oy="60%"><Svg bg={<Lindenwald />}>
          <Swap t={rp + R} a={<Act c="martin_van_buren" x={960} y={1010} h={560} e={4} />} b={<Sulk at={rp + R}><V c="martin_van_buren" p={12} x={960} y={1010} h={540} /></Sulk>} />
        </Svg></Cam>],
        [wi, <Cam dur={dur} from={1.0} to={1.04} oy="55%"><Svg bg={<LogCabinRally />}>
          <Act c="william_henry_harrison" x={1350} y={1010} h={600} e={5} gesture={12} stress />
          <CrowdBack y={1110} n={10} s={0.9} era="1837" seed={6} wave />
        </Svg></Cam>],
      ]} />
      <Cap text="1840" at={t(wd(26, "1840"))} until={wi} />
      <Cap text="William Henry Harrison" at={wi} />
    </>);
  } },
  // 27 Harrison's vice president was John Tyler, and Tyler's promotion came much faster.
  { a: ln(27), el: (t, dur) => {
    const jo = t(wd(27, "john")), stop = t(wd(27, "tyler", 1)), fa = t(wd(27, "faster"));
    const x0 = -120, wk = 2.2, at = jo - 14;
    const xs = x0 + travel("john_tyler", 600, wk, stop - at);
    return (<>
      <Cam dur={dur} from={1.0} to={1.05} oy="55%" punch={{ at: fa, frames: 6, to: 1.22, ox: `${((xs / 1920) * 100).toFixed(1)}%`, oy: "45%" }}>
        <Svg bg={<LogCabinRally />}>
          <Act c="william_henry_harrison" x={1350} y={1010} h={600} e={[[0, 5], [fa + R, 3]]} gesture={8} stress />
          <Swap t={stop}
            a={<Rig c="vp_john_tyler" pose="1" x={x0} y={1010} h={600} at={at} walk={wk} walkUntil={stop} />}
            b={<Act c="john_tyler" x={xs} y={1010} h={600} e={[[0, 0], [t(wd(27, "promotion")), 5]]} />} />
          <CrowdBack y={1110} n={10} s={0.9} era="1837" seed={6} wave />
        </Svg>
      </Cam>
      <Cap text="John Tyler" at={jo} until={stop} />
    </>);
  } },
];

export const VicePresidents1: React.FC<{ noAudio?: boolean }> = ({ noAudio }) => <Episode data={D} shots={SHOTS} noAudio={noAudio} />;
export { INK };
