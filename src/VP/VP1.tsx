import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import * as B from "../Thanksgiving/Backgrounds";
import { OvalOffice, WhiteHouseLawn } from "../Thanksgiving3/Bg2";
import { Episode, epDuration, makeAlign, Shot, Steps, Svg, Swap } from "../Thanksgiving3/Episode";
import { Arch, Cam, Cap, Card, Cheer, PopIn, Puff, QMarks, Rig } from "../Thanksgiving3/Kit";
import { Ballot, Big, DownArrow, HeadIcon, HouseChamber, INK, Label, LampGlow, Parlor, PlaneCabin, Quill, Sweat, V, VoteBoard, Timeline } from "./VKit";
import DATA from "./ep/vp1.json";

/**
 * Part 1 (VO vp1.mp3): cold open + Adams, Jefferson, Burr, Van Buren, ending on Harrison/Tyler.
 * Every cut and swap is on a word start (ln / wd). Quill's beak stays closed outside his studio.
 */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const VP1_DURATION = epDuration(D);

const FIFTEEN = ["john_adams", "thomas_jefferson", "martin_van_buren", "john_tyler", "millard_fillmore", "andrew_johnson", "chester_arthur",
  "theodore_roosevelt", "calvin_coolidge", "harry_truman", "lyndon_johnson", "richard_nixon", "gerald_ford", "george_hw_bush", "joe_biden"];

/** Ballot counter that ticks 1 -> 36 between two frames. */
const Counter: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [a, b], [1, 36], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return <Big x={960} y={230} text={`BALLOT #${n}`} size={92} />;
};

const SHOTS: Shot[] = [
  // 0 One became president after his boss lasted just a month.
  { a: ln(0), el: (t, dur) => (<>
    <Cam dur={dur} from={1.02} to={1.08} ox="48%" punch={{ at: t(wd(0, "month")), frames: 6, to: 1.22, ox: "68%", oy: "45%" }}>
      <Svg bg={<B.Study />}>
        <V c="william_henry_harrison" p={10} x={820} y={1010} h={560} />
        <V c="john_tyler" p={1} x={1560} y={1010} h={600} flip />
      </Svg>
    </Cam>
    <Cap text="1841" pos="top" />
  </>) },
  // 1 Another took the oath beside a grieving first lady on an airplane.
  { a: ln(1), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06}>
      <Svg bg={<PlaneCabin />}>
        <V c="jacqueline_kennedy" p={6} x={640} y={1000} h={560} />
        <V c="lyndon_johnson" p={5} x={1060} y={1000} h={600} />
      </Svg>
    </Cam>
    <Cap text="1963 · Air Force One" pos="top" at={t(wd(1, "airplane"))} />
  </>) },
  // 2 And one reached the White House without ever winning a presidential or vice-presidential election.
  { a: ln(2), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<WhiteHouseLawn />}>
        <Swap t={t(wd(2, "without"))} a={<V c="gerald_ford" p={0} x={760} y={1010} h={560} />} b={<V c="gerald_ford" p={9} x={760} y={1010} h={560} />} />
        <Label x={1390} y={330} text="ELECTIONS WON: 0" at={t(wd(2, "election"))} size={56} />
      </Svg>
    </Cam>
  </>) },
  // 3 These are all fifteen U.S. vice presidents who became president, how they got there, and what happened after the promotion.
  { a: ln(3), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.04}>
      <Svg bg={<B.PlateBg color="#2f6f8f" />}>
        {FIFTEEN.map((c, i) => {
          const back = i < 8;
          const x = back ? 180 + i * 222 : 290 + (i - 8) * 222;
          return <V key={c} c={c} p={0} x={x} y={back ? 700 : 1040} h={back ? 300 : 340} at={2 + i * 4} />;
        })}
        <Big x={960} y={150} text="VICE PRESIDENT → PRESIDENT" size={86} at={t(wd(3, "fifteen"))} />
      </Svg>
    </Cam>
  </>), sfx: [[2, "pop", 0.08], [30, "pop", 0.06], [58, "pop", 0.06]] },
  // 4 One new president's dad even has to bring out a lamp.
  { a: ln(4), el: (t, dur) => (<>
    <Cam dur={dur} from={1.02} to={1.08} punch={{ at: t(wd(4, "lamp")), frames: 6, to: 1.16, ox: "62%", oy: "50%" }}>
      <Svg bg={<Parlor />}>
        <V c="calvin_coolidge" p={0} x={720} y={1010} h={560} />
        <V c="john_coolidge_senior" p={6} x={1250} y={1010} h={560} />
        <LampGlow x={1112} y={710} at={t(wd(4, "lamp"))} />
      </Svg>
    </Cam>
    <Cap text="1923 · Vermont" pos="top" />
  </>) },
  // 5 It starts with John Adams, George Washington's vice president.
  { a: ln(5), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.FederalHall />}>
        <V c="john_adams" p={1} x={720} y={1010} h={540} />
        <V c="george_washington" p={1} x={1260} y={1010} h={600} flip at={t(wd(5, "george"))} enter={{ from: "right", frames: 8 }} />
        <Label x={720} y={330} text="VICE PRESIDENT" at={t(wd(5, "vice"))} size={44} />
      </Svg>
    </Cam>
    <Card text="John Adams" sub="1st Vice President · 2nd President" until={t(wd(5, "george"))} />
  </>) },
  // 6 For eight years, Washington leaned on his cabinet while Adams complained about how insignificant his own job was.
  { a: ln(6), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.Study />}><V c="george_washington" p={8} x={960} y={1010} h={560} /></Svg></Cam>],
      [t(wd(6, "adams")), <Cam dur={dur} from={1.04} to={1.1} oy="45%"><Svg bg={<B.Chamber />}><V c="john_adams" p={6} x={960} y={1010} h={600} /></Svg></Cam>],
    ]} />
    <Cap text="1789–1797" pos="top" until={t(wd(6, "adams"))} />
    <Cap text={'"The most insignificant office"'} pos="top" at={t(wd(6, "insignificant"))} size={66} />
  </>) },
  // 7 Then Washington retired, and Adams won the election of 1796.
  { a: ln(7), el: (t, dur) => (<>
    <Steps s={[
      [0, <Svg bg={<B.Hills />}><Rig c="vp_george_washington" pose="1" x={700} y={1010} h={560} walk={2.4} /></Svg>],
      [t(wd(7, "adams")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.FederalHall />}>
        <V c="john_adams" p={7} x={860} y={1010} h={600} />
        <V c="shared_props_early" p={0} x={1360} y={1010} h={250} />
        <Cheer x={620} y={300} w={520} />
      </Svg></Cam>],
    ]} />
    <Cap text="Retired · 1797" pos="top" until={t(wd(7, "adams"))} />
    <Cap text="Election of 1796" pos="top" at={t(wd(7, "election"))} />
  </>), sfx: [[0, "whoosh", 0.06]] },
  // 8 There was one awkward detail.
  { a: ln(8), el: (t, dur) => (<>
    <Cam dur={dur} from={1.12} to={1.16} oy="40%">
      <Svg bg={<B.Studio v={1} art="whitehouse" />}>
        <Quill x={960} y={1010} h={600} talk />
        <Sweat x={1150} y={430} at={t(wd(8, "awkward"))} />
      </Svg>
    </Cam>
  </>) },
  // 9 Under the original electoral system, the runner-up became vice president.
  { a: ln(9), el: (t) => (<>
    <Svg bg={<VoteBoard title="ELECTION OF 1796 · ELECTORAL VOTES" rows={[
      { c: "john_adams", name: "JOHN ADAMS", v: 71, max: 80, role: "PRESIDENT", roleAt: t(wd(9, "runner")) - 10, roleColor: "#ffe08a" },
      { c: "thomas_jefferson", name: "THOMAS JEFFERSON", v: 68, max: 80, role: "VICE PRESIDENT", roleAt: t(wd(9, "vice")) },
    ]} />} />
  </>) },
  // 10 So Adams got Thomas Jefferson, the man who had just run against him.
  { a: ln(10), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.Chamber />}>
        <Swap t={t(wd(10, "run"))} a={<V c="john_adams" p={1} x={620} y={1010} h={560} />} b={<V c="john_adams" p={8} x={620} y={1010} h={560} flip />} />
        <V c="thomas_jefferson" p={1} x={1300} y={1010} h={580} flip at={t(wd(10, "thomas"))} enter={{ from: "right", frames: 8 }} />
      </Svg>
    </Cam>
  </>) },
  // 11 His defeated opponent was now his deputy.
  { a: ln(11), el: (t, dur) => (<>
    <Cam dur={dur} from={1.08} to={1.13} oy="50%">
      <Svg bg={<B.Chamber />}>
        <V c="john_adams" p={8} x={620} y={1010} h={560} flip />
        <V c="thomas_jefferson" p={10} x={1300} y={1010} h={580} flip />
        <Swap t={t(wd(11, "deputy"))} a={<Label x={1300} y={300} text="DEFEATED OPPONENT" size={40} />} b={<Label x={1300} y={300} text="DEPUTY" size={56} color="#ffe08a" />} />
        <V c="quill" p={5} x={170} y={1180} h={560} at={t(wd(11, "deputy"))} />
      </Svg>
    </Cam>
  </>), sfx: [] },
  // 12 Four years later, Jefferson ran against him again.
  { a: ln(12), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06}>
      <Svg bg={<B.FederalHall />}>
        <V c="john_adams" p={9} x={600} y={1010} h={580} />
        <V c="thomas_jefferson" p={6} x={1340} y={1010} h={580} flip at={t(wd(12, "jefferson"))} />
      </Svg>
    </Cam>
    <Cap text="Election of 1800" pos="top" />
  </>) },
  // 13 This time Adams lost, but Jefferson still had somebody to beat.
  { a: ln(13), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.04} to={1.08}><Svg bg={<B.Study sepia />}>
        <Swap t={t(wd(13, "lost"))} a={<V c="john_adams" p={0} x={960} y={1010} h={580} />} b={<V c="john_adams" p={10} x={960} y={1010} h={580} />} />
      </Svg></Cam>],
      [t(wd(13, "jefferson")), <Cam dur={dur} from={1.0} to={1.04}><Svg bg={<B.FederalHall />}>
        <V c="thomas_jefferson" p={7} x={860} y={1010} h={620} />
        <V c="aaron_burr" p={1} x={1820} y={1010} h={580} flip at={t(wd(13, "somebody")) - t(wd(13, "jefferson"))} enter={{ from: "right", frames: 6, dist: 300 }} />
      </Svg></Cam>],
    ]} />
  </>) },
  // 14 His own running mate, Aaron Burr, had received exactly as many electoral votes.
  { a: ln(14), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.FederalHall />}>
        <V c="thomas_jefferson" p={1} x={720} y={1010} h={600} />
        <V c="aaron_burr" p={1} x={1260} y={1010} h={580} flip />
        <Label x={1260} y={330} text="RUNNING MATE" at={2} size={44} />
      </Svg></Cam>],
      [t(wd(14, "exactly")), <Svg bg={<VoteBoard title="ELECTION OF 1800 · ELECTORAL VOTES" at={0} rows={[
        { c: "thomas_jefferson", name: "THOMAS JEFFERSON", v: 73, max: 80 },
        { c: "aaron_burr", name: "AARON BURR", v: 73, max: 80, role: "TIE!", roleAt: t(wd(14, "votes")) - t(wd(14, "exactly")), roleColor: "#ff8a7a" },
      ]} />} />],
    ]} />
    <Cap text="Aaron Burr" at={t(wd(14, "aaron"))} until={t(wd(14, "exactly"))} />
  </>) },
  // 15 Back then, electors didn't cast separate votes for president and vice president.
  { a: ln(15), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.04}>
      <Svg bg={<B.PlateBg color="#8a5a3c" />}>
        <Ballot x={700} y={540} lines={["ELECTOR'S BALLOT", "VOTE 1: JEFFERSON", "VOTE 2: BURR"]} at={2} />
        <V c="shared_props_early" p={0} x={1460} y={880} h={330} />
        <Label x={1460} y={330} text="NO SEPARATE VP VOTE" at={t(wd(15, "vice"))} size={44} color="#ffd2c8" />
      </Svg>
    </Cam>
  </>), sfx: [[2, "paper", 0.12]] },
  // 16 The tie went to the House of Representatives, which took thirty-six ballots to choose Jefferson.
  { a: ln(16), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<HouseChamber />}>
        <V c="shared_props_early" p={2} x={960} y={1000} h={560} at={t(wd(16, "took"))} />
        <Counter a={t(wd(16, "took"))} b={t(wd(16, "ballots")) + 8} />
        <HeadIcon c="thomas_jefferson" e={5} x={1560} y={560} size={260} at={t(wd(16, "jefferson"))} ring="#ffe08a" />
        <Big x={1560} y={820} text="WINNER" size={64} at={t(wd(16, "jefferson")) + 3} />
      </Svg>
    </Cam>
    <Cap text="1801 · House of Representatives" pos="top" until={t(wd(16, "took"))} size={64} />
  </>), sfx: [] },
  // 17 America had almost elected the running mate instead of the intended president.
  { a: ln(17), el: (t, dur) => (<>
    <Cam dur={dur} from={1.06} to={1.12} oy="45%">
      <Svg bg={<B.FederalHall />}>
        <V c="aaron_burr" p={7} x={1060} y={1010} h={620} />
        <Label x={1500} y={300} text="ALMOST PRESIDENT" to={[1180, 470]} at={t(wd(17, "almost"))} size={48} />
        <V c="quill" p={5} x={230} y={1180} h={600} at={t(wd(17, "running"))} />
        <Sweat x={380} y={760} at={t(wd(17, "intended"))} s={0.8} />
      </Svg>
    </Cam>
  </>) },
  // 18 Jefferson finally took office in 1801 and later approved the Louisiana Purchase.
  { a: ln(18), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<OvalOffice />}><V c="thomas_jefferson" p={8} x={960} y={1010} h={560} /></Svg></Cam>],
      [t(wd(18, "louisiana")), <Cam dur={dur} from={1.0} to={1.06} ox="60%"><Svg bg={<B.Study />}><V c="thomas_jefferson" p={9} x={960} y={1010} h={640} /></Svg></Cam>],
    ]} />
    <Cap text="1801" pos="top" until={t(wd(18, "louisiana"))} />
    <Cap text="Louisiana Purchase · 1803" at={t(wd(18, "louisiana"))} />
  </>) },
  // 19 The Twelfth Amendment changed the electoral system afterward.
  { a: ln(19), el: (t, dur) => (<>
    <Arch src="amend12" dur={dur} />
    <Cap text="12th Amendment · 1804" />
  </>) },
  // 20 After Jefferson, another sitting vice president wouldn't win the presidency until Martin Van Buren in 1836.
  { a: ln(20), el: (t, dur) => (<>
    <Steps s={[
      [0, <Svg bg={<Timeline from={1800} to={1840} drawAt={t(wd(20, "another"))} drawFrames={t(wd(20, "martin")) - t(wd(20, "another"))}
        marks={[{ year: 1800, c: "thomas_jefferson", at: 0, label: "1800" }, { year: 1836, c: "martin_van_buren", at: t(wd(20, "martin")), label: "1836" }]} />} />],
      [t(wd(20, "1836")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<WhiteHouseLawn />}><V c="martin_van_buren" p={0} x={960} y={1010} h={600} /></Svg></Cam>],
    ]} />
    <Card text="Martin Van Buren" sub="8th Vice President · 8th President" at={t(wd(20, "1836"))} />
  </>), sfx: [] },
  // 21 Andrew Jackson's trusted ally looked like a natural successor.
  { a: ln(21), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<WhiteHouseLawn />}>
        <V c="andrew_jackson" p={8} x={680} y={1010} h={600} />
        <Swap t={t(wd(21, "natural"))} a={<V c="martin_van_buren" p={1} x={1300} y={1010} h={600} flip />} b={<V c="martin_van_buren" p={7} x={1300} y={1010} h={600} flip />} />
        <Label x={1300} y={300} text="SUCCESSOR" at={t(wd(21, "successor"))} size={48} />
      </Svg>
    </Cam>
    <Cap text="Andrew Jackson" until={t(wd(21, "ally"))} />
  </>) },
  // 22 Then, just months into his presidency, the Panic of 1837 hit.
  { a: ln(22), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.Village />}>
        <Swap t={t(wd(22, "panic"))} a={<V c="martin_van_buren" p={0} x={680} y={1010} h={580} />} b={<V c="martin_van_buren" p={9} x={680} y={1010} h={580} />} />
        <V c="shared_props_early" p={6} x={1380} y={1000} h={560} shake={0} />
        <Swap t={t(wd(22, "hit"))} a={null} b={<V c="shared_props_early" p={6} x={1380} y={1000} h={560} shake={7} />} />
      </Svg>
    </Cam>
    <Cap text="Panic of 1837" pos="top" at={t(wd(22, "panic"))} />
  </>), sfx: [] },
  // 23 Banks failed, businesses collapsed, and the country fell into a depression.
  { a: ln(23), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.04}>
      <Svg bg={<B.PlateBg color="#7d2f2a" />}>
        <V c="shared_props_early" p={6} x={520} y={900} h={520} shake={4} />
        <Puff x={520} y={900} at={2} />
        <Label x={520} y={250} text="FAILED" at={t(wd(23, "failed"))} size={56} color="#ffd2c8" />
        <Label x={1050} y={420} text="COLLAPSED" at={t(wd(23, "collapsed"))} size={48} color="#ffd2c8" />
        <V c="shared_props_early" p={7} x={1050} y={900} h={300} at={t(wd(23, "businesses"))} drop={{ frames: 8, height: 700 }} />
        <DownArrow at={t(wd(23, "depression")) - 6} x={1180} y={240} w={560} h={560} />
      </Svg>
    </Cam>
    <Cap text="Depression" pos="top" at={t(wd(23, "depression"))} />
  </>), sfx: [[2, "rattle", 0.12]] },
  // 24 Van Buren inherited troubles that had been building before he arrived.
  { a: ln(24), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<OvalOffice />}>
        <Rig c="vp_andrew_jackson" pose="1" x={520} y={1010} h={580} flip walk={-1.2} />
        <V c="martin_van_buren" p={10} x={1260} y={1010} h={600} />
        <V c="shared_props_early" p={13} x={1640} y={1010} h={260} at={t(wd(24, "building"))} drop={{ frames: 8, height: 600 }} />
      </Svg>
    </Cam>
  </>) },
  // 25 Voters still handed him the bill.
  { a: ln(25), el: (t, dur) => (<>
    <Cam dur={dur} from={1.04} to={1.1} oy="50%">
      <Svg bg={<OvalOffice />}>
        <V c="martin_van_buren" p={11} x={900} y={1010} h={600} />
        <V c="martin_van_buren" p={31} x={1330} y={1010} h={260} at={t(wd(25, "bill"))} drop={{ frames: 8, height: 700 }} />
      </Svg>
    </Cam>
  </>) },
  // 26 In 1840, they replaced him with William Henry Harrison.
  { a: ln(26), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.04}>
      <Svg bg={<WhiteHouseLawn />}>
        <V c="martin_van_buren" p={12} x={560} y={1010} h={580} />
        <Rig c="vp_william_henry_harrison" pose="1" x={2000} y={1010} h={600} flip walk={-2.2} walkUntil={t(wd(26, "harrison")) + 8} at={t(wd(26, "replaced"))} />
        <Label x={1440} y={270} text="WILLIAM HENRY HARRISON" at={t(wd(26, "william"))} size={40} />
      </Svg>
    </Cam>
    <Cap text="Election of 1840" pos="top" />
          </>) },
  // 27 Harrison's vice president was John Tyler, and Tyler's promotion came much faster.
  { a: ln(27), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05} punch={{ at: t(wd(27, "faster")), frames: 6, to: 1.2, ox: "40%", oy: "50%" }}>
      <Svg bg={<WhiteHouseLawn />}>
        <Swap t={t(wd(27, "faster"))} a={<V c="william_henry_harrison" p={0} x={1320} y={1010} h={600} />} b={<V c="william_henry_harrison" p={9} x={1340} y={1010} h={560} />} />
        <Swap t={t(wd(27, "promotion"))}
          a={<Rig c="vp_john_tyler" pose="1" x={250} y={1010} h={600} walk={2.6} walkUntil={t(wd(27, "tyler"))} />}
          b={<V c="john_tyler" p={5} x={700} y={1010} h={600} />} />
        <Label x={700} y={290} text="VP JOHN TYLER" at={t(wd(27, "john"))} size={48} />
      </Svg>
    </Cam>
  </>) },
];

export const VicePresidents1: React.FC = () => <Episode data={D} shots={SHOTS} />;
export { INK };
