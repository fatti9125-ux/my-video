import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Episode, epDuration, makeAlign, Shot, Steps, Svg, Swap } from "../Thanksgiving3/Episode";
import { Cam, Cap, Card, QMarks, Quill, Stamp } from "../Thanksgiving3/Kit";
import { Act, Bubble, Sulk, V } from "./VKit";
import { SHOTS as PILOT_SHOTS, Slide } from "./Pilot";
import DATA from "./ep/vp3.json";
import {
  Allies, ArthurOffice, BedsideFG, CabinetRoom, CabinetTableFG, CardTableFG, CollectorDesk, CriticsFG, CrowdFG, CustomHouse,
  DeadGrade, DeweySuite, ElberonNight, ElberonSickroom, ExamFrontRow, ExamHall, FDRDesk, FDROval, HallDoor, JapanMap,
  JudgeFG, LexingtonParlor, LittleWhiteHouse, PlatformRail, RearPlatform, RostrumFG, SecretFolder, SenateChamber,
  SenateDesksFG, Sil, SofaFG, SuiteTableFG, TearCal, WarGlobe,
} from "./bg/Part3";

/**
 * Part 3 (VO vp3.mp3): Arthur and the Pendleton Act, Theodore Roosevelt parked in the vice presidency,
 * Coolidge sworn in by lamplight, Truman inheriting the war and beating Dewey.
 * Lines 4-16 are the approved pilot (src/VP/Pilot.tsx SHOTS, same vp3 word timing, unchanged). Lines 0-3 and
 * 17-22 are rebuilt to the same spec: one painted plate per real place (src/VP/bg/Part3.tsx), foreground
 * occluders, varied shot sizes, in-scene Quill, 1-frame expression swaps on the motivating word (+R listener),
 * one continuous camera move per shot, hard-cut captions, name card on the empty establishing plate, slam stamps.
 */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const VP3_DURATION = epDuration(D);
const R = 4;
const fr = (line: number, w: string, n = 0) => Math.round((wd(line, w, n) - ln(line)) * 30);   // shot-relative frame of a word

const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
/** Tear-off calendar state: `days` days after (y, m, d), flipping from frame `a` to frame `b`. */
const calAt = (f: number, a: number, b: number, start: [number, number, number], days: number) => {
  const p = interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const n = Math.round(p * days);
  const dt = new Date(Date.UTC(start[0], start[1] - 1, start[2] + n));
  return { month: MON[dt.getUTCMonth()], day: String(dt.getUTCDate()), changed: f > a && f <= b + 1 ? (f - a) % 3 : 99 };
};

export const SHOTS: Shot[] = [
  // 0 Garfield lingered for weeks before dying, leaving Arthur with the office and a deeply uncomfortable association.
  { a: ln(0), el: (t, dur) => {
    const lin = t(wd(0, "lingered")), bef = t(wd(0, "before")), die = t(wd(0, "dying")), lv = t(wd(0, "leaving"));
    const dp = t(wd(0, "deeply")), unc = t(wd(0, "uncomfortable")), asc = t(wd(0, "association"));
    const Sick: React.FC = () => <ElberonSickroom cal={calAt(useCurrentFrame(), lin, bef - 2, [1881, 7, 2], 79)} />;
    const Night: React.FC = () => <ElberonNight flag={interpolate(useCurrentFrame() - die, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) })} />;
    return (<>
      <Steps s={[
        // the sickroom by the sea: Garfield sits propped up in bed, doctors watch, the calendar runs through the summer
        [0, <Cam dur={dur} from={1.0} to={1.08} ox="48%" oy="62%"><Svg bg={<Sick />}>
          <V c="james_garfield" p={8} x={960} y={1015} h={600} />
          <BedsideFG />
        </Svg></Cam>],
        // the cottage at night: the flag drops to half-staff on "dying"
        [bef, <Cam dur={dur} from={1.04} to={1.0} ox="35%" oy="50%"><Svg bg={<Night />} /></Cam>],
        // 2 a.m., 123 Lexington Avenue: Arthur takes the oath in his own parlor
        [lv, <Cam dur={dur} from={1.0} to={1.06} ox="40%" oy="50%"><Svg bg={<LexingtonParlor />}>
          <V c="chester_arthur" p="oath" x={760} y={1025} h={650} />
          <JudgeFG />
        </Svg></Cam>],
        // the association: the assassin's endorsement follows him across the room
        [dp, <Cam dur={dur} from={1.02} to={1.06} ox="45%" oy="50%"><Svg bg={<LexingtonParlor />}>
          <Slide at={asc} frames={5} dx={-260}>
            <Act c="chester_arthur" x={700} y={1030} h={640} e={[[0, 0], [unc + R, 3]]} sweat={unc + R} />
          </Slide>
          <Slide at={asc + 7} frames={5} dx={-260}>
            <Act c="garfield_attacker" x={1260} y={1030} h={600} e={5} bounce={10} at={dp + 2} enter={{ from: "right", frames: 7, dist: 800 }} />
          </Slide>
          <Bubble x={1300} y={240} w={600} text="ARTHUR IS PRESIDENT NOW!" at={dp + 9} tail={[1250, 470]} shout size={46} />
          <SofaFG />
        </Svg></Cam>],
      ]} />
      <Cap text="Summer 1881" at={lin} until={bef} />
      <Cap text="Elberon, N.J. · September 19, 1881" size={64} at={bef} until={lv} />
      <Cap text="New York · 2:15 A.M." at={lv} until={dp} />
    </>);
  } },
  // 1 Arthur had risen through a system that rewarded allies with government jobs.
  { a: ln(1), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.07} ox="45%" oy="60%">
      <Svg bg={<CustomHouse />}>
        <V c="chester_arthur" p="offer" x={640} y={1010} h={620} />
        <Allies kind="cert" at={[t(wd(1, "rewarded")), t(wd(1, "allies")), t(wd(1, "government")), t(wd(1, "jobs"))]} />
        <CollectorDesk />
      </Svg>
    </Cam>
    <Cap text="New York Custom House" at={t(wd(1, "risen"))} until={t(wd(1, "system"))} />
    <Cap text="The spoils system" at={t(wd(1, "system"))} />
  </>), sfx: [[fr(1, "rewarded"), "paper", 0.08], [fr(1, "allies"), "paper", 0.07], [fr(1, "government"), "paper", 0.07], [fr(1, "jobs"), "paper", 0.07]] },
  // 2 He surprised critics by signing the Pendleton Act, requiring competitive examinations for certain federal positions.
  { a: ln(2), el: (t, dur) => {
    const rq = t(wd(2, "requiring"));
    return (<>
      <Steps s={[
        // Arthur signs at his White House desk; the critics in the foreground can't believe it
        [0, <Cam dur={dur} from={1.0} to={1.06} ox="50%" oy="55%"><Svg bg={<ArthurOffice deskY={760} />}>
          <V c="chester_arthur" p="signing" x={960} y={905} h={560} />
          <CriticsFG />
          <QMarks x={250} y={560} at={t(wd(2, "critics")) + R} spread={110} />
          <QMarks x={1660} y={560} at={t(wd(2, "critics")) + R + 3} spread={110} />
        </Svg></Cam>],
        // the first competitive examinations: papers land, Quill sweats at his desk
        [rq, <Cam dur={dur} from={1.0} to={1.07} ox="50%" oy="60%"><Svg bg={<ExamHall />}>
          <Quill pose="nervous_side_glance" x={955} y={990} h={330} />
          <ExamFrontRow paperAt={t(wd(2, "examinations"))} />
        </Svg></Cam>],
      ]} />
      <Cap text="January 16, 1883" at={t(wd(2, "signing"))} until={t(wd(2, "pendleton"))} />
      <Cap text="The Pendleton Act" at={t(wd(2, "pendleton"))} until={rq} />
    </>);
  }, sfx: [[fr(2, "signing"), "scribble", 0.1], [fr(2, "examinations"), "paper", 0.08]] },
  // 3 The politician associated with handing out jobs helped change how those jobs were filled.
  { a: ln(3), el: (t, dur) => {
    const ch = t(wd(3, "change"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.05} ox="45%" oy="60%" punch={{ at: ch, frames: 5, to: 1.06, ox: "40%", oy: "45%" }}>
        <Svg bg={<CustomHouse />}>
          <Swap t={ch} a={<V c="chester_arthur" p="offer" x={640} y={1010} h={620} />} b={<V c="chester_arthur" p="checklist_pose" x={700} y={1010} h={630} />} />
          <Swap t={ch + R} a={<Allies kind="cert" at={[0, 0, 0, 0]} />} b={<Allies kind="exam" at={[0, 0, 0, 0]} />} />
          <CollectorDesk stack={2} />
        </Svg>
      </Cam>
      <Stamp lines={["THE SPOILSMAN", "WHO SIGNED", "THE REFORM"]} at={t(wd(3, "those"))} x={560} y={215} rot={-7} variant="dark" />
    </>);
  } },
  // 4-16 Theodore Roosevelt -> Calvin Coolidge: the approved pilot, unchanged (first shot starts at 21.14 s).
  ...PILOT_SHOTS,
  // 17 Harry Truman had only eighty-two days to get used to being vice president.
  { a: ln(17), el: (t, dur) => {
    const e82 = t(wd(17, "eighty")), pres = t(wd(17, "president"));
    const Cal: React.FC = () => <TearCal x={1290} y={462} w={150} {...calAt(useCurrentFrame(), e82, pres, [1945, 1, 20], 82)} />;
    return (<>
      <Cam dur={dur} from={1.0} to={1.08} ox="50%" oy="48%">
        <Svg bg={<SenateChamber />}>
          <Act c="harry_truman" x={960} y={810} h={480} at={e82} e={[[0, 0], [t(wd(17, "days")) + R, 3], [pres + R, 4]]} sweat={t(wd(17, "used")) + R} />
          <RostrumFG />
          <Cal />
          <SenateDesksFG />
        </Svg>
      </Cam>
      <Card text="Harry S. Truman" at={0} until={e82} />
      <Cap text="Vice President · 1945" at={e82 + 6} />
    </>);
  } },
  // 18 When Franklin Roosevelt died in April 1945, Truman suddenly inherited a world war.
  { a: ln(18), el: (t, dur) => {
    const died = t(wd(18, "died")), tr = t(wd(18, "truman")), world = t(wd(18, "world"));
    const k = 580 / 880;
    const Room: React.FC = () => <LittleWhiteHouse dead={interpolate(useCurrentFrame() - died, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />;
    const Grade: React.FC = () => <DeadGrade k={interpolate(useCurrentFrame() - died, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />;
    return (<>
      <Steps s={[
        // Warm Springs, Georgia: FDR at his card table, the portrait in progress; on "died" the chair is empty
        [0, <Cam dur={dur} from={1.0} to={1.08} ox="55%" oy="55%"><Svg bg={<Room />}>
          <Swap t={died} a={<V c="franklin_roosevelt" p={7} x={960} y={1010} h={580} />} b={<V c="franklin_roosevelt" p={31} x={960 + 12.5 * k} y={1010} h={502 * k} />} />
          <CardTableFG />
          <Grade />
        </Svg></Cam>],
        // 7:09 p.m., the Cabinet Room: the oath, then the war lands on the table in front of him
        [tr, <Cam dur={dur} from={1.0} to={1.05} ox="42%" oy="50%" punch={{ at: world, frames: 5, to: 1.07, ox: "35%", oy: "55%" }}><Svg bg={<CabinetRoom />}>
          <Swap t={world} a={<V c="harry_truman" p={7} x={790} y={1010} h={620} />} b={<Act c="harry_truman" x={760} y={1010} h={620} e={3} sweat={world + R} />} />
          <CabinetTableFG />
          <WarGlobe at={world} x={420} y={950} />
        </Svg></Cam>],
      ]} />
      <Cap text="Warm Springs, Georgia" at={t(wd(18, "franklin"))} until={t(wd(18, "april"))} />
      <Cap text="April 12, 1945" at={t(wd(18, "april"))} until={tr} />
      <Cap text="The White House · 7:09 P.M." size={64} at={tr} until={world} />
    </>);
  }, sfx: [[fr(18, "world") + 7, "thud", 0.15]] },
  // 19 Roosevelt had barely included him in major decisions and hadn't briefed him on the atomic bomb project.
  { a: ln(19), el: (t, dur) => {
    const dec = t(wd(19, "decisions")), hn = t(wd(19, "hadn't"));
    const Door: React.FC = () => <HallDoor shut={interpolate(useCurrentFrame() - dec, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) })} />;
    return (
      <Steps s={[
        // FDR's Oval Office: the war is run around the President's desk; Truman, at the door, gets the door
        [0, <Cam dur={dur} from={1.0} to={1.05} ox="58%" oy="50%"><Svg bg={<FDROval />}>
          <Sil x={640} y={905} h={560} face={1} c="#2e2e34" />
          <Sil x={1290} y={905} h={580} face={-1} c="#3a3a40" />
          <V c="franklin_roosevelt" p={6} x={960} y={1010} h={600} />
          <Sulk at={dec + R}><Act c="harry_truman" x={1690} y={890} h={560} e={[[0, 0], [t(wd(19, "barely")) + R, 4]]} /></Sulk>
          <Door />
          <FDRDesk />
        </Svg></Cam>],
        // the folder he never saw: TOP SECRET on "atomic", locked on "bomb"; Quill peers at it
        [hn, <Cam dur={dur} from={1.0} to={1.08} ox="50%" oy="55%"><Svg bg={<SecretFolder stampAt={t(wd(19, "atomic"))} lockAt={t(wd(19, "bomb"))} />}>
          <Quill pose="nervous_side_glance" x={1600} y={1000} h={380} />
        </Svg></Cam>],
      ]} />
    );
  }, sfx: [[fr(19, "decisions") + 5, "thud", 0.12], [fr(19, "atomic") + 5, "sub_thump", 0.2], [fr(19, "bomb") + 3, "rattle", 0.1]] },
  // 20 Truman became president before learning the full details of the weapon he would authorize against Japan.
  { a: ln(20), el: (t, dur) => {
    const wp = t(wd(20, "weapon"));
    return (<>
      <Steps s={[
        // same office, same framing: now Truman is in the chair, and the S-1 report lands on the desk
        [0, <Cam dur={dur} from={1.0} to={1.06} ox="50%" oy="50%"><Svg bg={<FDROval />}>
          <Act c="harry_truman" x={960} y={1010} h={620} e={[[0, 0], [t(wd(20, "learning")) + R, 3]]} sweat={t(wd(20, "details")) + R} />
          <HallDoor shut={1} />
          <FDRDesk map={false} report={t(wd(20, "full"))} />
        </Svg></Cam>],
        [wp, <Cam dur={dur} from={1.0} to={1.08} ox="40%" oy="72%"><Svg bg={<JapanMap fillAt={t(wd(20, "japan"))} pins={[
          { name: "HIROSHIMA", k: "hiroshima", at: t(wd(20, "authorize")) },
          { name: "NAGASAKI", k: "nagasaki", at: t(wd(20, "authorize")) + 6, dy: 60 },
        ]} />} /></Cam>],
      ]} />
      <Cap text="August 1945" pos="top" at={t(wd(20, "authorize"))} />
    </>);
  }, sfx: [[fr(20, "full") + 7, "thud", 0.12]] },
  // 21 He later faced an election many expected him to lose, then defeated Thomas Dewey in 1948.
  { a: ln(21), el: (t, dur) => {
    const many = t(wd(21, "many")), def = t(wd(21, "defeated")), dw = t(wd(21, "dewey"));
    return (<>
      <Steps s={[
        // the whistle-stop campaign from the back of the Ferdinand Magellan
        [0, <Cam dur={dur} from={1.0} to={1.06} ox="50%" oy="45%"><Svg bg={<RearPlatform where="whistle" />}>
          <V c="harry_truman" p={10} x={960} y={805} h={500} />
          <PlatformRail />
          <CrowdFG cheerAt={t(wd(21, "election"))} />
        </Svg></Cam>],
        // election night at the Roosevelt Hotel: Dewey, champagne on ice, until the radio speaks
        [many, <Cam dur={dur} from={1.0} to={1.06} ox="40%" oy="50%" punch={{ at: def, frames: 5, to: 1.08, ox: "40%", oy: "40%" }}><Svg bg={<DeweySuite talkAt={def} />}>
          <Swap t={dw + R}
            a={<Act c="thomas_dewey" x={760} y={1020} h={640} e={[[0, 5], [def + R, 3]]} sweat={def + R} gesture={8} stress />}
            b={<Sulk at={0}><Act c="thomas_dewey" x={760} y={1020} h={640} e={4} /></Sulk>} />
          <SuiteTableFG />
        </Svg></Cam>],
      ]} />
      <Cap text="1948" at={t(wd(21, "election"))} until={many} />
      <Cap text="Thomas Dewey" pos="top" at={t(wd(21, "thomas"))} until={t(wd(21, "1948"))} />
      <Cap text="November 1948" pos="top" at={t(wd(21, "1948"))} />
    </>);
  }, sfx: [[fr(21, "election"), "cheer", 0.06]] },
  // 22 The replacement won a term of his own.
  { a: ln(22), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.07} ox="50%" oy="40%">
      <Svg bg={<RearPlatform where="stlouis" />}>
        <V c="harry_truman" p={11} x={940} y={805} h={530} />
        <PlatformRail />
        <g stroke="#2b2119" strokeWidth={4}><rect x={1560} y={830} width={300} height={34} fill="#6b4a2a" /><rect x={1580} y={864} width={260} height={60} fill="#4a3220" /><circle cx={1610} cy={930} r={26} fill="#2a2a2a" /><circle cx={1810} cy={930} r={26} fill="#2a2a2a" /></g>
        <Quill pose="deadpan_wings_folded" x={1710} y={838} h={300} at={t(wd(22, "won"))} enter={{ from: "right", frames: 8, dist: 500 }} />
        <CrowdFG papers cheerAt={0} />
      </Svg>
    </Cam>
    <Cap text="St. Louis · November 3, 1948" pos="top" at={0} until={t(wd(22, "term"))} />
    <Stamp lines={["ELECTED IN", "HIS OWN RIGHT"]} at={t(wd(22, "term"))} x={430} y={215} rot={-8} variant="dark" />
  </>), sfx: [[0, "cheer", 0.08]] },
];

export const VicePresidents3: React.FC<{ noAudio?: boolean }> = ({ noAudio }) => <Episode data={D} shots={SHOTS} noAudio={noAudio} />;
