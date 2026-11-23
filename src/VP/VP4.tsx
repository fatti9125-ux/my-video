import React from "react";
import * as B from "../Thanksgiving/Backgrounds";
import { OvalOffice, WhiteHouseLawn } from "../Thanksgiving3/Bg2";
import { Episode, epDuration, makeAlign, Shot, Steps, Svg, Swap } from "../Thanksgiving3/Episode";
import { Cam, Cap, Card, Cheer, QMarks, Quill, Stamp } from "../Thanksgiving3/Kit";
import { Act, Big, HeadIcon, HouseChamber, Label, PlaneCabin, Sulk, Tears, Timeline, USMap, V } from "./VKit";
import DATA from "./ep/vp4.json";

/**
 * Part 4 (VO vp4.mp3): LBJ sworn in on Air Force One, civil rights and Vietnam; Nixon's backward career,
 * comeback and resignation; Ford appointed and the pardon; George H.W. Bush, Kuwait, taxes, Clinton.
 * Acting rules as Parts 1-3 (Act characters, reactions R frames after the beat, original Quill).
 */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const VP4_DURATION = epDuration(D);
const R = 4;
const PM = "shared_props_modern";

export const SHOTS: Shot[] = [
  // 0 Lyndon B. Johnson also took over after a sudden death, but the transition happened in front of cameras.
  { a: ln(0), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.Chamber />}>
        <Act c="lyndon_johnson" x={960} y={1010} h={620} e={[[0, 0], [t(wd(0, "death")) + R, 4], [t(wd(0, "cameras")) + R, 3]]} sweat={t(wd(0, "cameras")) + R} />
      </Svg>
    </Cam>
    <Card text="Lyndon B. Johnson" sub="37th Vice President · 36th President" until={t(wd(0, "after"))} />
  </>), sfx: [] },
  // 1 After Kennedy was assassinated in Dallas in 1963, Johnson took the oath aboard Air Force One.
  { a: ln(1), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<USMap pins={[{ lon: -96.8, lat: 32.8, at: t(wd(1, "dallas")), name: "DALLAS" }]} />}>
        <HeadIcon c="john_f_kennedy" e={4} x={1480} y={330} size={260} at={2} ring="#cfc8bb" />
      </Svg></Cam>],
      [t(wd(1, "johnson")), <Cam dur={dur} from={1.0} to={1.04}><Svg bg={<B.Hills />}>
        <V c={PM} p={5} x={960} y={720} h={330} />
      </Svg></Cam>],
    ]} />
    <Cap text="November 22, 1963" pos="top" until={t(wd(1, "johnson"))} />
    <Cap text="Air Force One" pos="top" at={t(wd(1, "air"))} />
  </>), sfx: [[Math.round((wd(1, "johnson") - ln(1)) * 30), "whoosh", 0.1]] },
  // 2 Jacqueline Kennedy stood beside him, with Kennedy's casket elsewhere on the plane.
  { a: ln(2), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.04} to={1.1} oy="45%"><Svg bg={<PlaneCabin />}>
        <V c="jacqueline_kennedy" p={6} x={680} y={1000} h={560} />
        <Tears eyes={[[652, 590], [690, 590]]} at={t(wd(2, "beside")) + R} len={38} />
        <V c="lyndon_johnson" p={5} x={1100} y={1000} h={600} />
      </Svg></Cam>],
      [t(wd(2, "casket")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<PlaneCabin />} dim={0.3}>
        <V c={PM} p={7} x={960} y={930} h={300} />
      </Svg></Cam>],
    ]} />
  </>) },
  // 3 Johnson used his congressional experience to help secure the Civil Rights Act and Voting Rights Act, and he won the 1964 election.
  { a: ln(3), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<HouseChamber />}>
        <V c="lyndon_johnson" p={7} x={860} y={1010} h={560} />
        <Label x={1460} y={300} text="CONGRESS VETERAN" at={t(wd(3, "congressional"))} size={46} />
      </Svg></Cam>],
      [t(wd(3, "civil")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<OvalOffice />}>
        <V c="lyndon_johnson" p={8} x={800} y={1010} h={560} />
        <V c={PM} p={8} x={1400} y={900} h={420} />
        <Label x={1400} y={300} text="VOTING RIGHTS ACT" at={t(wd(3, "voting")) - t(wd(3, "civil"))} size={42} />
      </Svg></Cam>],
      [t(wd(3, "won")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<WhiteHouseLawn />}>
        <Act c="lyndon_johnson" x={900} y={1010} h={620} e={5} gesture={12} stress />
        <Cheer x={660} y={300} w={480} />
      </Svg></Cam>],
    ]} />
    <Cap text="Civil Rights Act · 1964" pos="top" at={t(wd(3, "civil"))} until={t(wd(3, "won"))} />
    <Cap text="Election of 1964" pos="top" at={t(wd(3, "1964"))} />
  </>), sfx: [[Math.round((wd(3, "won") - ln(3)) * 30), "cheer", 0.1]] },
  // 4 His escalation of the Vietnam War helped tear apart his presidency.
  { a: ln(4), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06}>
      <Svg bg={<OvalOffice />}>
        <V c="lyndon_johnson" p={9} x={900} y={1010} h={600} />
        <Label x={1500} y={300} text="VIETNAM WAR" at={t(wd(4, "vietnam"))} size={54} color="#ffd2c8" />
      </Svg>
    </Cam>
  </>) },
  // 5 In 1968, he announced he wouldn't seek another term.
  { a: ln(5), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.Chamber />}>
        <Swap t={t(wd(5, "wouldn"))} a={<V c="lyndon_johnson" p={7} x={960} y={1010} h={560} />} b={<V c="lyndon_johnson" p={10} x={960} y={1010} h={600} />} />
      </Svg>
    </Cam>
    <Cap text="March 1968" pos="top" />
    <Stamp lines={["NOT RUNNING"]} at={t(wd(5, "term"))} x={1450} y={300} rot={-8} variant="red" darken={false} />
  </>) },
  // 6 Richard Nixon had spent eight years as Eisenhower's vice president, then lost the 1960 election to Kennedy.
  { a: ln(6), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<WhiteHouseLawn />}>
        <Act c="richard_nixon" x={760} y={1010} h={600} e={5} gesture={8} stress />
        <Act c="dwight_eisenhower" x={1300} y={1010} h={620} flip at={t(wd(6, "eisenhower"))} e={5} />
      </Svg></Cam>],
      [t(wd(6, "lost")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.FederalHall />}>
        <Sulk at={t(wd(6, "kennedy")) - t(wd(6, "lost")) + R}>
          <Act c="richard_nixon" x={640} y={1010} h={600} e={[[0, 0], [t(wd(6, "kennedy")) - t(wd(6, "lost")) + R, 4]]} />
        </Sulk>
        <Act c="john_f_kennedy" x={1300} y={1010} h={620} flip at={t(wd(6, "kennedy")) - t(wd(6, "lost"))} e={5} gesture={12} stress enter={{ from: "right", frames: 8 }} />
      </Svg></Cam>],
    ]} />
    <Card text="Richard Nixon" sub="36th Vice President · 37th President" until={t(wd(6, "had"))} />
    <Cap text="1953–1961" pos="top" at={t(wd(6, "had"))} until={t(wd(6, "lost"))} />
    <Cap text="Election of 1960" pos="top" at={t(wd(6, "1960"))} />
  </>) },
  // 7 Two years later, he lost the California governor's race as well.
  { a: ln(7), el: (t, dur) => (<>
    <Cam dur={dur} from={1.04} to={1.1} ox="20%">
      <Svg bg={<USMap fills={[["california", "#e0703a", t(wd(7, "california"))]]} />}>
        <HeadIcon c="richard_nixon" e={[[0, 0], [t(wd(7, "lost")) + R, 4]]} x={600} y={420} size={260} ring="#f4f1ea" />
        <Label x={760} y={820} text="GOVERNOR'S RACE: LOST" at={t(wd(7, "race"))} size={40} color="#ffd2c8" />
      </Svg>
    </Cam>
    <Cap text="1962" pos="top" />
  </>) },
  // 8 His career seemed to be running backward.
  { a: ln(8), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.04}>
      <Svg bg={<B.Hills />}>
        <Act c="richard_nixon" x={1500} y={1010} h={600} e={4} walk={-1} />
        <Quill pose="nervous_side_glance" x={230} y={1200} h={680} at={t(wd(8, "running"))} enter={{ from: "bottom", frames: 9 }} />
      </Svg>
    </Cam>
  </>) },
  // 9 Then he won the presidency in 1968.
  { a: ln(9), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06} punch={{ at: t(wd(9, "won")), frames: 6, to: 1.08, ox: "50%", oy: "45%" }}>
      <Svg bg={<WhiteHouseLawn />}>
        <Swap t={t(wd(9, "won"))} a={<Act c="richard_nixon" x={960} y={1010} h={600} e={0} />} b={<V c="richard_nixon" p={7} x={960} y={1010} h={620} />} />
        <Cheer x={720} y={300} w={480} />
      </Svg>
    </Cam>
    <Cap text="Election of 1968" pos="top" at={t(wd(9, "1968"))} />
  </>), sfx: [[Math.round((wd(9, "won") - ln(9)) * 30), "cheer", 0.1]] },
  // 10 Eight years as vice president, eight years out of office, then the top job.
  { a: ln(10), el: (t) => (<>
    <Svg bg={<Timeline from={1952} to={1970} drawAt={0} drawFrames={t(wd(10, "top"))}
      marks={[{ year: 1953, c: "richard_nixon", at: 2, label: "VP" }, { year: 1961, c: "richard_nixon", at: t(wd(10, "eight", 1)), label: "OUT" }, { year: 1969, c: "richard_nixon", at: t(wd(10, "top")), label: "PRESIDENT" }]} />} />
  </>), sfx: [] },
  // 11 Watergate eventually destroyed that comeback.
  { a: ln(11), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06}>
      <Svg bg={<OvalOffice />}>
        <V c="richard_nixon" p={8} x={960} y={1010} h={600} />
        <Label x={1500} y={300} text="WATERGATE TAPES" at={t(wd(11, "watergate"))} size={50} color="#ffd2c8" />
      </Svg>
    </Cam>
  </>) },
  // 12 In 1974, Nixon became the first U.S. president to resign.
  { a: ln(12), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<OvalOffice />}><V c="richard_nixon" p={9} x={960} y={1010} h={560} /></Svg></Cam>],
      [t(wd(12, "first")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<WhiteHouseLawn />}><V c="richard_nixon" p={10} x={960} y={1010} h={600} /></Svg></Cam>],
    ]} />
    <Cap text="August 1974" pos="top" />
    <Stamp lines={["FIRST TO RESIGN"]} at={t(wd(12, "resign"))} x={1450} y={330} rot={-8} variant="red" darken={false} />
  </>) },
  // 13 Which brings us to Gerald Ford.
  { a: ln(13), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.Chamber />}><Act c="gerald_ford" x={960} y={1010} h={600} e={0} /></Svg>
    </Cam>
    <Card text="Gerald Ford" sub="40th Vice President · 38th President" at={t(wd(13, "gerald"))} />
  </>) },
  // 14 Nixon's original vice president, Spiro Agnew, had already resigned.
  { a: ln(14), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.Chamber />}>
        <Swap t={t(wd(14, "resigned"))} a={<Act c="spiro_agnew" x={960} y={1010} h={600} e={[[0, 0], [t(wd(14, "already")) + R, 4]]} sweat={t(wd(14, "already")) + R} />} b={<V c="spiro_agnew" p={9} x={960} y={1010} h={560} />} />
        <V c={PM} p={12} x={1480} y={900} h={360} at={t(wd(14, "resigned"))} drop={{ frames: 7, height: 800 }} />
      </Svg>
    </Cam>
    <Cap text="Spiro Agnew · 1973" pos="top" at={t(wd(14, "spiro"))} />
  </>) },
  // 15 Nixon nominated Ford to replace him, and Congress confirmed him.
  { a: ln(15), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<OvalOffice />}>
        <V c="richard_nixon" p={6} x={640} y={1010} h={600} />
        <Act c="gerald_ford" x={1300} y={1010} h={600} flip e={[[0, 0], [t(wd(15, "replace")) + R, 3]]} />
      </Svg></Cam>],
      [t(wd(15, "congress")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<HouseChamber />}>
        <Act c="gerald_ford" x={960} y={1010} h={600} e={[[0, 0], [t(wd(15, "confirmed")) - t(wd(15, "congress")) + R, 5]]} />
        <Label x={1460} y={300} text="CONFIRMED" at={t(wd(15, "confirmed")) - t(wd(15, "congress"))} size={56} color="#c9f2b8" />
      </Svg></Cam>],
    ]} />
  </>) },
  // 16 Eight months later, Nixon resigned too.
  { a: ln(16), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06}>
      <Svg bg={<WhiteHouseLawn />}>
        <V c="richard_nixon" p={10} x={760} y={1010} h={600} />
        <Act c="gerald_ford" x={1340} y={1010} h={600} flip e={[[0, 0], [t(wd(16, "resigned")) + R, 3]]} sweat={t(wd(16, "too")) + R} />
      </Svg>
    </Cam>
    <Cap text="August 9, 1974" pos="top" />
  </>) },
  // 17 Ford became president without winning an election for either national office.
  { a: ln(17), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<WhiteHouseLawn />}>
        <Swap t={t(wd(17, "without"))} a={<V c="gerald_ford" p={7} x={760} y={1010} h={600} />} b={<V c="gerald_ford" p={9} x={760} y={1010} h={600} />} />
        <QMarks x={760} y={350} at={t(wd(17, "election")) + R} spread={220} />
        <Label x={1400} y={300} text="VOTES FOR PRESIDENT: 0" at={t(wd(17, "winning"))} size={42} />
        <Label x={1400} y={500} text="VOTES FOR VP: 0" at={t(wd(17, "national"))} size={42} />
      </Svg>
    </Cam>
  </>) },
  // 18 A month afterward, he pardoned Nixon, igniting another political firestorm.
  { a: ln(18), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<OvalOffice />}>
        <V c="gerald_ford" p={8} x={800} y={1010} h={560} />
        <V c={PM} p={13} x={1400} y={900} h={420} at={t(wd(18, "pardoned"))} />
      </Svg></Cam>],
      [t(wd(18, "igniting")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<HouseChamber />}>
        <Act c="gerald_ford" x={960} y={1010} h={600} e={[[0, 3], [R, 4]]} sweat={R} />
      </Svg></Cam>],
    ]} />
    <Cap text="September 1974" pos="top" until={t(wd(18, "igniting"))} />
    <Stamp lines={["FIRESTORM"]} at={t(wd(18, "firestorm"))} x={1450} y={300} rot={-8} variant="red" darken={false} />
  </>) },
  // 19 He tried to move the country past Watergate, but the pardon followed him into his losing campaign against Jimmy Carter.
  { a: ln(19), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<WhiteHouseLawn />}>
        <V c="gerald_ford" p={9} x={900} y={1010} h={600} />
        <V c={PM} p={13} x={1460} y={880} h={340} at={t(wd(19, "pardon"))} />
      </Svg></Cam>],
      [t(wd(19, "losing")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.FederalHall />}>
        <Sulk at={t(wd(19, "carter")) - t(wd(19, "losing")) + R}><V c="gerald_ford" p={11} x={660} y={1010} h={600} /></Sulk>
        <Act c="jimmy_carter" x={1300} y={1010} h={600} flip e={5} gesture={12} stress at={t(wd(19, "jimmy")) - t(wd(19, "losing"))} enter={{ from: "right", frames: 8 }} />
      </Svg></Cam>],
    ]} />
    <Cap text="Election of 1976" pos="top" at={t(wd(19, "losing"))} />
  </>) },
  // 20 George H.W. Bush took a more familiar route.
  { a: ln(20), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<WhiteHouseLawn />}><Act c="george_hw_bush" x={960} y={1010} h={620} e={5} gesture={10} stress /></Svg>
    </Cam>
    <Card text="George H.W. Bush" sub="43rd Vice President · 41st President" until={t(wd(20, "took"))} />
  </>) },
  // 21 After eight years as Ronald Reagan's vice president, he won the 1988 election.
  { a: ln(21), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<OvalOffice />}>
        <Act c="ronald_reagan" x={700} y={1010} h={620} e={5} gesture={10} stress />
        <Act c="george_hw_bush" x={1300} y={1010} h={600} flip e={0} />
      </Svg></Cam>],
      [t(wd(21, "won")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<WhiteHouseLawn />}>
        <V c="george_hw_bush" p={6} x={900} y={1010} h={620} />
        <Cheer x={660} y={300} w={480} />
      </Svg></Cam>],
    ]} />
    <Cap text="1981–1989" pos="top" until={t(wd(21, "won"))} />
    <Cap text="Election of 1988" pos="top" at={t(wd(21, "1988"))} />
  </>), sfx: [[Math.round((wd(21, "won") - ln(21)) * 30), "cheer", 0.1]] },
  // 22 He was the first sitting vice president to win since Van Buren, a gap of 152 years.
  { a: ln(22), el: (t) => (<>
    <Svg bg={<Timeline from={1830} to={1990} drawAt={t(wd(22, "since"))} drawFrames={t(wd(22, "years")) - t(wd(22, "since"))}
      marks={[{ year: 1836, c: "martin_van_buren", at: t(wd(22, "van")), label: "1836" }, { year: 1988, c: "george_hw_bush", at: 2, label: "1988" }]} />}>
      <Big x={960} y={220} text="152 YEARS" size={110} at={t(wd(22, "152"))} />
    </Svg>
  </>), sfx: [] },
  // 23 Bush led the coalition that drove Iraqi forces out of Kuwait.
  { a: ln(23), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<OvalOffice />}>
        <V c="george_hw_bush" p={8} x={960} y={1010} h={600} />
        <Label x={1500} y={260} text="GULF WAR · 1991" at={t(wd(23, "coalition"))} size={48} />
      </Svg>
    </Cam>
    <Cap text="Kuwait liberated" at={t(wd(23, "kuwait"))} pos="top" />
  </>) },
  // 24 At home, he agreed to a budget deal that raised taxes after campaigning against new ones.
  { a: ln(24), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<OvalOffice />}>
        <V c="george_hw_bush" p={10} x={860} y={1010} h={560} />
        <V c={PM} p={16} x={1460} y={900} h={400} at={t(wd(24, "raised"))} drop={{ frames: 7, height: 800 }} />
      </Svg></Cam>],
      [t(wd(24, "campaigning")), <Cam dur={dur} from={1.04} to={1.1}><Svg bg={<WhiteHouseLawn />}>
        <V c="george_hw_bush" p={9} x={960} y={1010} h={620} />
      </Svg></Cam>],
    ]} />
    <Cap text={'"Read my lips: no new taxes"'} pos="top" at={t(wd(24, "campaigning"))} size={62} />
  </>) },
  // 25 His foreign-policy success didn't secure another term.
  { a: ln(25), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<OvalOffice />}>
        <Act c="george_hw_bush" x={960} y={1010} h={620} e={[[0, 5], [t(wd(25, "didn")) + R, 4]]} sweat={t(wd(25, "term")) + R} />
      </Svg>
    </Cam>
  </>) },
  // 26 Bill Clinton defeated him in 1992.
  { a: ln(26), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05} punch={{ at: t(wd(26, "defeated")), frames: 6, to: 1.08, ox: "65%", oy: "45%" }}>
      <Svg bg={<WhiteHouseLawn />}>
        <Sulk at={t(wd(26, "defeated")) + R}><V c="george_hw_bush" p={11} x={640} y={1010} h={600} /></Sulk>
        <V c="bill_clinton" p={7} x={1300} y={1010} h={620} />
        <Cheer x={1060} y={300} w={480} />
      </Svg>
    </Cam>
    <Cap text="Election of 1992" pos="top" />
  </>), sfx: [[Math.round((wd(26, "defeated") - ln(26)) * 30), "cheer", 0.1]] },
];

export const VicePresidents4: React.FC<{ noAudio?: boolean }> = ({ noAudio }) => <Episode data={D} shots={SHOTS} noAudio={noAudio} />;
