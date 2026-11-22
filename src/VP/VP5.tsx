import React from "react";
import * as B from "../Thanksgiving/Backgrounds";
import { OvalOffice, WhiteHouseLawn } from "../Thanksgiving3/Bg2";
import { Episode, epDuration, makeAlign, Shot, Steps, Svg, Swap } from "../Thanksgiving3/Episode";
import { Cam, Cap, Card, Quill, Stamp } from "../Thanksgiving3/Kit";
import { Act, Big, HeadIcon, Label, LampGlow, Parlor, PlaneCabin, Sulk, V } from "./VKit";
import DATA from "./ep/vp5.json";

/**
 * Part 5 (VO vp5.mp3): Joe Biden, then the recap (fifteen: eight deaths, one resignation, six elections),
 * the Tyler precedent, and Quill's sign-off in the studio.
 */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const VP5_DURATION = epDuration(D);
const R = 4;
const PM = "shared_props_modern";

const DIED = ["john_tyler", "millard_fillmore", "andrew_johnson", "chester_arthur", "theodore_roosevelt", "calvin_coolidge", "harry_truman", "lyndon_johnson"];
const ELECTED = ["john_adams", "thomas_jefferson", "martin_van_buren", "richard_nixon", "george_hw_bush", "joe_biden"];

export const SHOTS: Shot[] = [
  // 0 Joe Biden needed three presidential campaigns.
  { a: ln(0), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<WhiteHouseLawn />}>
        <Act c="joe_biden" x={760} y={1010} h={620} e={5} gesture={10} stress />
        {[0, 1, 2].map((i) => <V key={i} c="joe_biden" p={34} x={1240 + i * 220} y={1000} h={220} at={t(wd(0, "three")) + i * 4} drop={{ frames: 7, height: 700 }} />)}
      </Svg>
    </Cam>
    <Card text="Joe Biden" sub="47th Vice President · 46th President" until={t(wd(0, "needed"))} />
  </>) },
  // 1 His bids for the 1988 and 2008 nominations failed, but Barack Obama chose him as his running mate.
  { a: ln(1), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.FederalHall />}>
        <Swap t={t(wd(1, "failed"))} a={<Act c="joe_biden" x={960} y={1010} h={620} e={0} />} b={<V c="joe_biden" p={6} x={960} y={1010} h={600} />} />
        <Big x={560} y={300} text="1988 ✗" size={90} at={t(wd(1, "1988"))} fill="#ffd2c8" />
        <Big x={1360} y={300} text="2008 ✗" size={90} at={t(wd(1, "2008"))} fill="#ffd2c8" />
      </Svg></Cam>],
      [t(wd(1, "barack")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<WhiteHouseLawn />}>
        <Act c="barack_obama" x={700} y={1010} h={620} e={5} gesture={10} stress />
        <Act c="joe_biden" x={1300} y={1010} h={620} flip e={[[0, 3], [t(wd(1, "chose")) - t(wd(1, "barack")) + R, 5]]} />
        <Label x={1300} y={290} text="RUNNING MATE" at={t(wd(1, "running")) - t(wd(1, "barack"))} size={48} />
      </Svg></Cam>],
    ]} />
  </>) },
  // 2 Biden served eight years as vice president, spent four years out of office, then defeated Donald Trump in 2020.
  { a: ln(2), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<OvalOffice />}>
        <Act c="barack_obama" x={700} y={1010} h={620} e={0} />
        <Act c="joe_biden" x={1300} y={1010} h={620} flip e={5} />
      </Svg></Cam>],
      [t(wd(2, "spent")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.Study />}>
        <V c="joe_biden" p={7} x={960} y={1010} h={560} />
        <Big x={1450} y={400} text="4 YEARS OUT" size={80} at={t(wd(2, "four")) - t(wd(2, "spent"))} />
      </Svg></Cam>],
      [t(wd(2, "defeated")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<WhiteHouseLawn />}>
        <V c="joe_biden" p={9} x={700} y={1010} h={620} />
        <Sulk at={t(wd(2, "trump")) - t(wd(2, "defeated")) + R}><V c="donald_trump" p={11} x={1300} y={1010} h={620} /></Sulk>
      </Svg></Cam>],
    ]} />
    <Cap text="2009–2017" pos="top" until={t(wd(2, "spent"))} />
    <Cap text="Election of 2020" pos="top" at={t(wd(2, "2020"))} />
  </>), sfx: [[Math.round((wd(2, "defeated") - ln(2)) * 30), "cheer", 0.1]] },
  // 3 He took office at seventy-eight, setting the age record at the time.
  { a: ln(3), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.Chamber />}>
        <V c="joe_biden" p={10} x={800} y={1010} h={600} />
        <Big x={1420} y={520} text="AGE 78" size={120} at={t(wd(3, "seventy"))} />
      </Svg>
    </Cam>
    <Cap text="Oldest president at the time" pos="top" at={t(wd(3, "record"))} />
  </>) },
  // 4 His presidency included a bipartisan infrastructure law, and he ended his reelection campaign in 2024.
  { a: ln(4), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<OvalOffice />}>
        <V c="joe_biden" p={11} x={960} y={1010} h={560} />
        <V c={PM} p={17} x={1550} y={980} h={260} at={t(wd(4, "infrastructure"))} />
      </Svg></Cam>],
      [t(wd(4, "ended")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<WhiteHouseLawn />}>
        <Act c="joe_biden" x={960} y={1010} h={620} e={[[0, 0], [t(wd(4, "campaign")) - t(wd(4, "ended")) + R, 4]]} />
      </Svg></Cam>],
    ]} />
    <Cap text="Infrastructure law · 2021" pos="top" at={t(wd(4, "infrastructure"))} until={t(wd(4, "ended"))} />
    <Cap text="July 2024" pos="top" at={t(wd(4, "2024"))} />
  </>) },
  // 5 Decades after his first attempt, he'd served a full term.
  { a: ln(5), el: (t, dur) => (<>
    <Cam dur={dur} from={1.04} to={1.1}>
      <Svg bg={<WhiteHouseLawn />}>
        <Act c="joe_biden" x={1000} y={1010} h={620} e={5} gesture={10} stress />
        <Quill pose="deadpan_wings_folded" x={230} y={1200} h={680} at={t(wd(5, "served"))} enter={{ from: "bottom", frames: 9 }} />
      </Svg>
    </Cam>
    <Stamp lines={["FULL TERM"]} at={t(wd(5, "term"))} x={1460} y={300} rot={-8} variant="red" darken={false} />
  </>) },
  // 6 That makes fifteen.
  { a: ln(6), el: (t, dur) => (<>
    <Cam dur={dur} from={1.1} to={1.14} oy="40%">
      <Svg bg={<B.Studio v={2} art="whitehouse" />}><Quill pose="speaking_facing_right" talk x={960} y={1010} h={720} /></Svg>
    </Cam>
    <Big x={1500} y={420} text="15" size={200} at={t(wd(6, "fifteen"))} />
  </>) },
  // 7 Eight first became president because a president died.
  { a: ln(7), el: (t) => (<>
    <Svg bg={<B.PlateBg color="#2b2b30" />}>
      <Big x={960} y={170} text="8 · A PRESIDENT DIED" size={80} at={2} />
      {DIED.map((c, i) => <HeadIcon key={c} c={c} x={200 + i * 217} y={600} size={190} at={4 + i * 4} ring="#cfc8bb" />)}
    </Svg>
  </>), sfx: [] },
  // 8 Ford got there through a resignation.
  { a: ln(8), el: (t) => (<>
    <Svg bg={<B.PlateBg color="#6b3a2a" />}>
      <Big x={960} y={170} text="1 · A RESIGNATION" size={80} at={2} />
      <HeadIcon c="gerald_ford" x={760} y={600} size={300} at={4} ring="#f4f1ea" />
      <V c={PM} p={12} x={1240} y={820} h={360} at={t(wd(8, "resignation"))} />
    </Svg>
  </>), sfx: [] },
  // 9 Six reached it by winning an election, including Nixon and Biden after time out of office.
  { a: ln(9), el: (t) => (<>
    <Svg bg={<B.PlateBg color="#1f4a4f" />}>
      <Big x={960} y={170} text="6 · WON AN ELECTION" size={80} at={2} />
      {ELECTED.map((c, i) => <HeadIcon key={c} c={c} e={[[0, 0], [t(wd(9, c === "richard_nixon" ? "nixon" : c === "joe_biden" ? "biden" : "winning")) + R, 5]]} x={300 + i * 264} y={600} size={210} at={4 + i * 4} ring={c === "richard_nixon" || c === "joe_biden" ? "#ffe08a" : "#f4f1ea"} />)}
    </Svg>
  </>), sfx: [] },
  // 10 Their first days ranged from a family parlor to an airplane carrying a murdered president home.
  { a: ln(10), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<Parlor />}>
        <Act c="calvin_coolidge" x={720} y={1010} h={560} e={0} />
        <Act c="john_coolidge_senior" x={1240} y={1010} h={560} flip e={5} />
        <V c="john_coolidge_senior" p={33} x={980} y={900} h={220} />
        <LampGlow x={980} y={760} />
      </Svg></Cam>],
      [t(wd(10, "airplane")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<PlaneCabin />}>
        <V c="jacqueline_kennedy" p={6} x={680} y={1000} h={560} />
        <V c="lyndon_johnson" p={5} x={1100} y={1000} h={600} />
      </Svg></Cam>],
    ]} />
  </>) },
  // 11 And the precedent behind the emergency promotions goes back to Tyler, the man whose own party threw him out while he kept the White House.
  { a: ln(11), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.Chamber />}>
        <V c="john_tyler" p={5} x={960} y={1010} h={620} />
      </Svg></Cam>],
      [t(wd(11, "whose")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<WhiteHouseLawn />}>
        <Act c="john_tyler" x={960} y={1010} h={620} e={[[0, 2], [t(wd(11, "kept")) - t(wd(11, "whose")) + R, 5]]} vein={t(wd(11, "threw")) - t(wd(11, "whose")) + R} />
      </Svg></Cam>],
    ]} />
    <Cap text="The Tyler Precedent · 1841" pos="top" until={t(wd(11, "whose"))} />
  </>) },
  // 12 Of course, plenty of vice presidents spent years waiting for that promotion and never got it.
  { a: ln(12), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06}>
      <Svg bg={<OvalOffice />}>
        {["aaron_burr", "spiro_agnew"].map((c, i) => <Sulk key={c} at={t(wd(12, "never")) + R}><Act c={c} x={560 + i * 420} y={1010} h={600} e={[[0, 0], [t(wd(12, "waiting")) + R, 4]]} /></Sulk>)}
        <V c="shared_props_modern" p={19} x={1500} y={1010} h={420} />
      </Svg>
    </Cam>
  </>) },
  // 13 Their attempts produced a whole different collection of political disasters.
  { a: ln(13), el: (t, dur) => (<>
    <Cam dur={dur} from={1.1} to={1.16} oy="40%">
      <Svg bg={<B.Studio v={3} art="whitehouse" />}>
        <Swap t={t(wd(13, "disasters"))} a={<Quill pose="speaking_facing_right" talk x={960} y={1010} h={720} />} b={<Quill pose="nervous_side_glance" talk x={960} y={1010} h={720} />} />
      </Svg>
    </Cam>
  </>) },
];

export const VicePresidents5: React.FC<{ noAudio?: boolean }> = ({ noAudio }) => <Episode data={D} shots={SHOTS} noAudio={noAudio} />;
