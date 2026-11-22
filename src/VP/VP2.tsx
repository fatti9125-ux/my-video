import React from "react";
import * as B from "../Thanksgiving/Backgrounds";
import { OvalOffice, WhiteHouseLawn } from "../Thanksgiving3/Bg2";
import { Episode, epDuration, makeAlign, Shot, Steps, Svg, Swap } from "../Thanksgiving3/Episode";
import { Cam, Cap, Card, QMarks, Stamp, Quill } from "../Thanksgiving3/Kit";
import { Bars, Big, Bubble, HeadIcon, HouseChamber, Label, Splat, Sweat, USMap, V, VH } from "./VKit";
import DATA from "./ep/vp2.json";

/**
 * Part 2 (VO vp2.mp3): Tyler's precedent, Fillmore and the Compromise of 1850, Andrew Johnson's
 * impeachment, and Garfield's shooting that makes Arthur president. Cuts and swaps land on word starts.
 */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const VP2_DURATION = epDuration(D);

/** Who later took over the same way Tyler did (death or resignation). */
const PRECEDENT = ["millard_fillmore", "andrew_johnson", "chester_arthur", "theodore_roosevelt", "calvin_coolidge", "harry_truman", "lyndon_johnson", "gerald_ford"];

export const SHOTS: Shot[] = [
  // 0 Harrison died after thirty-one days in office.
  { a: ln(0), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.Study sepia />}>
        <V c="william_henry_harrison" p={9} x={760} y={1010} h={560} />
        <V c="william_henry_harrison" p={38} x={1380} y={1000} h={300} />
      </Svg></Cam>],
      [t(wd(0, "died")), <Svg bg={<B.PlateBg color="#2b2b30" />}>
        <HeadIcon c="william_henry_harrison" e={4} x={960} y={430} size={420} ring="#cfc8bb" />
        <Big x={960} y={880} text="31 DAYS IN OFFICE" size={92} at={t(wd(0, "thirty"))} />
      </Svg>],
    ]} />
    <Cap text="April 1841" pos="top" until={t(wd(0, "died"))} />
  </>) },
  // 1 Nobody had dealt with a dead president before, and some argued that Tyler was only supposed to exercise presidential powers temporarily.
  { a: ln(1), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06}>
      <Svg bg={<B.Chamber />}>
        <V c="john_tyler" p={1} x={900} y={1010} h={600} />
        <QMarks x={900} y={330} at={t(wd(1, "dealt"))} spread={260} />
        <Swap t={t(wd(1, "temporarily"))}
          a={<Label x={1440} y={300} text="PRESIDENT?" at={t(wd(1, "argued"))} size={52} />}
          b={<Label x={1440} y={300} text="ACTING PRESIDENT" size={52} color="#ffe08a" />} />
      </Svg>
    </Cam>
  </>) },
  // 2 Tyler insisted he had become president outright and took a new oath.
  { a: ln(2), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05} punch={{ at: t(wd(2, "oath")), frames: 6, to: 1.12, ox: "50%", oy: "45%" }}>
      <Svg bg={<B.Chamber />}>
        <Swap t={t(wd(2, "took"))} a={<V c="john_tyler" p={6} x={960} y={1010} h={620} />} b={<V c="john_tyler" p={5} x={960} y={1010} h={620} />} />
        <Label x={1500} y={300} text="PRESIDENT. PERIOD." at={t(wd(2, "outright"))} size={48} />
      </Svg>
    </Cam>
    <Cap text="April 6, 1841" pos="top" at={t(wd(2, "took"))} />
  </>) },
  // 3 His decision established the precedent later vice presidents followed.
  { a: ln(3), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.03}>
      <Svg bg={<B.PlateBg color="#1f4a4f" />}>
        <HeadIcon c="john_tyler" x={960} y={330} size={300} ring="#ffe08a" />
        <Big x={960} y={600} text="THE TYLER PRECEDENT" size={84} at={t(wd(3, "precedent"))} />
        {PRECEDENT.map((c, i) => <HeadIcon key={c} c={c} x={240 + i * 206} y={850} size={170} at={t(wd(3, "later")) + i * 4} ring="#f4f1ea" />)}
      </Svg>
    </Cam>
  </>), sfx: [] },
  // 4 His own party soon regretted having him.
  { a: ln(4), el: (t, dur) => (<>
    <Cam dur={dur} from={1.04} to={1.09}>
      <Svg bg={<B.Chamber />}>
        <V c="john_tyler" p={8} x={1100} y={1010} h={600} />
        <Label x={1100} y={260} text="WHIG PARTY MEMBER" at={t(wd(4, "party"))} size={46} />
        <Quill pose="nervous_side_glance" x={230} y={1200} h={680} at={t(wd(4, "regretted"))} />
      </Svg>
    </Cam>
  </>) },
  // 5 Tyler vetoed its banking plans, nearly his entire cabinet resigned, and the Whigs expelled him.
  { a: ln(5), el: (t, dur) => (<>
    <Steps s={[
      [0, <Svg bg={<B.PlateBg color="#8a5a3c" />}>
        <V c="john_tyler" p={7} x={640} y={1010} h={560} />
        <V c="shared_props_early" p={10} x={1380} y={760} h={380} at={t(wd(5, "vetoed"))} drop={{ frames: 7, height: 800 }} />
        <Label x={1380} y={860} text="NATIONAL BANK BILL" at={t(wd(5, "banking"))} size={44} />
      </Svg>],
      [t(wd(5, "nearly")), <Svg bg={<B.Study />}>
        <V c="john_tyler" p={8} x={1400} y={1010} h={580} />
        {[0, 1, 2, 3, 4].map((i) => <V key={i} c="millard_fillmore" p={36 + i} x={260 + i * 190} y={980 - (i % 2) * 40} h={220} at={t(wd(5, "cabinet")) - t(wd(5, "nearly")) + i * 4} drop={{ frames: 7, height: 900 }} />)}
        <Label x={640} y={300} text="CABINET RESIGNS" at={t(wd(5, "resigned")) - t(wd(5, "nearly"))} size={48} />
      </Svg>],
      [t(wd(5, "whigs")), <Svg bg={<B.Chamber />}><V c="john_tyler" p={8} x={620} y={1010} h={600} /></Svg>],
    ]} />
    <Stamp lines={["EXPELLED"]} at={t(wd(5, "expelled"))} x={1360} y={480} rot={-10} variant="red" />
  </>) },
  // 6 He kept the presidency and lost the party that put him there.
  { a: ln(6), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<WhiteHouseLawn />}>
        <V c="john_tyler" p={0} x={760} y={1010} h={600} />
        <Label x={1420} y={330} text="PRESIDENCY: KEPT" at={t(wd(6, "kept"))} size={50} color="#c9f2b8" />
        <Label x={1420} y={520} text="PARTY: LOST" at={t(wd(6, "lost"))} size={50} color="#ffd2c8" />
      </Svg>
    </Cam>
  </>) },
  // 7 Millard Fillmore got his turn when Zachary Taylor died in 1850.
  { a: ln(7), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<WhiteHouseLawn />}><V c="millard_fillmore" p={0} x={960} y={1010} h={600} /></Svg></Cam>],
      [t(wd(7, "zachary")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.Study sepia />}><V c="zachary_taylor" p={10} x={960} y={1010} h={560} /></Svg></Cam>],
    ]} />
    <Card text="Millard Fillmore" sub="12th Vice President · 13th President" until={t(wd(7, "got"))} />
    <Cap text="Zachary Taylor dies · 1850" pos="top" at={t(wd(7, "zachary"))} size={66} />
  </>) },
  // 8 The country was fighting over slavery and the territories taken from Mexico.
  { a: ln(8), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06} ox="35%">
      <Svg bg={<USMap fills={[["cession", "#e0703a", t(wd(8, "territories"))]]} />}>
        <Label x={560} y={880} text="TAKEN FROM MEXICO · 1848" at={t(wd(8, "mexico"))} size={42} />
      </Svg>
    </Cam>
    <Cap text="Slavery in the new territories?" pos="top" at={t(wd(8, "slavery"))} size={66} />
  </>) },
  // 9 Fillmore backed the Compromise of 1850 and signed its separate measures into law.
  { a: ln(9), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.Study />}>
        <Swap t={t(wd(9, "signed"))} a={<V c="millard_fillmore" p={6} x={960} y={1010} h={600} />} b={<V c="millard_fillmore" p={7} x={960} y={1010} h={560} />} />
        {[0, 1, 2, 3, 4].map((i) => <V key={`p${i}`} c="millard_fillmore" p={36 + i} x={300 + i * 330} y={420} h={230} at={t(wd(9, "separate")) + i * 4} />)}
        <Label x={960} y={130} text="5 SEPARATE LAWS" at={t(wd(9, "measures"))} size={48} />
      </Svg>
    </Cam>
    <Cap text="Compromise of 1850" pos="top" until={t(wd(9, "separate"))} />
  </>) },
  // 10 California entered as a free state, but the package also included a stronger Fugitive Slave Act, helping enslavers seize people who had escaped, even in free states.
  { a: ln(10), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.04} to={1.1} ox="15%" oy="55%"><Svg bg={<USMap fills={[["california", "#5fae5a", 2]]} />}>
        <Label x={560} y={300} text="FREE STATE" to={[330, 560]} at={t(wd(10, "free"))} size={52} color="#c9f2b8" />
      </Svg></Cam>],
      [t(wd(10, "package")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.PlateBg color="#5a3a2a" />}>
        <V c="john_tyler" p={31} x={960} y={960} h={620} />
        <Label x={960} y={190} text="FUGITIVE SLAVE ACT" at={t(wd(10, "fugitive")) - t(wd(10, "package"))} size={60} color="#ffd2c8" />
      </Svg></Cam>],
      [t(wd(10, "even")), <Cam dur={dur} from={1.0} to={1.04} ox="70%"><Svg bg={<USMap fills={[["free", "#5fae5a", 0], ["california", "#5fae5a", 0]]} />}>
        <Label x={1260} y={900} text="EVEN IN FREE STATES" size={50} color="#ffd2c8" />
      </Svg></Cam>],
    ]} />
    <Cap text="California · 1850" pos="top" until={t(wd(10, "package"))} />
  </>) },
  // 11 The supposed settlement deepened anger over slavery.
  { a: ln(11), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06}>
      <Svg bg={<USMap tint={["#c0392b", t(wd(11, "deepened"))]} />}>
        <Label x={960} y={150} text="SETTLEMENT?" at={t(wd(11, "settlement"))} size={56} />
      </Svg>
    </Cam>
    <Cap text="Anger over slavery deepens" at={t(wd(11, "anger"))} />
  </>) },
  // 12 Fillmore finished Taylor's term, but his party picked someone else for the next election.
  { a: ln(12), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<WhiteHouseLawn />}>
        <Swap t={t(wd(12, "picked"))} a={<V c="millard_fillmore" p={0} x={760} y={1010} h={600} />} b={<V c="millard_fillmore" p={10} x={760} y={1010} h={600} />} />
        <Label x={1400} y={330} text="TERM FINISHED" at={t(wd(12, "term"))} size={46} />
        <Label x={1400} y={520} text="1852 NOMINEE: SOMEONE ELSE" at={t(wd(12, "someone"))} size={40} color="#ffd2c8" />
      </Svg>
    </Cam>
  </>) },
  // 13 Then came Andrew Johnson, whose start as vice president was already a disaster.
  { a: ln(13), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.Chamber />}>
        <Swap t={t(wd(13, "disaster"))} a={<V c="andrew_johnson" p={0} x={960} y={1010} h={600} />} b={<V c="andrew_johnson" p={10} x={960} y={1010} h={600} />} />
      </Svg>
    </Cam>
    <Card text="Andrew Johnson" sub="16th Vice President · 17th President" until={t(wd(13, "whose"))} />
  </>) },
  // 14 At his inauguration in March 1865, Johnson had been drinking and delivered a rambling speech while Lincoln watched.
  { a: ln(14), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.Chamber />}>
        <Swap t={t(wd(14, "drinking"))} a={<V c="andrew_johnson" p={0} x={700} y={1010} h={600} />} b={<V c="andrew_johnson" p={6} x={700} y={1010} h={600} />} />
        <Bubble x={700} y={210} w={640} text="...AND ANOTHER THING ABOUT ME..." at={t(wd(14, "rambling"))} tail={[700, 420]} size={44} />
        <V c="abraham_lincoln" p={7} x={1440} y={1010} h={640} at={t(wd(14, "lincoln"))} />
      </Svg>
    </Cam>
    <Cap text="Inauguration · March 1865" pos="top" until={t(wd(14, "rambling"))} />
  </>) },
  // 15 About six weeks later, Lincoln was dead, and that same man was president.
  { a: ln(15), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.06}><Svg bg={<B.PlateBg color="#16161a" />}>
        <V c="abraham_lincoln" p={32} x={960} y={760} h={360} />
      </Svg></Cam>],
      [t(wd(15, "that")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.Chamber />}><V c="andrew_johnson" p={8} x={960} y={1010} h={620} /></Svg></Cam>],
    ]} />
    <Cap text="April 1865" pos="top" until={t(wd(15, "that"))} />
    <Cap text="President Andrew Johnson" at={t(wd(15, "president"))} />
  </>) },
  // 16 Johnson clashed with Congress over Reconstruction and vetoed a civil rights bill.
  { a: ln(16), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<HouseChamber />}>
        <Swap t={t(wd(16, "vetoed"))} a={<V c="andrew_johnson" p={7} x={760} y={1010} h={600} />} b={<V c="andrew_johnson" p={9} x={760} y={1010} h={600} />} />
        <Label x={1380} y={330} text="RECONSTRUCTION" at={t(wd(16, "reconstruction"))} size={50} />
        <Label x={1400} y={560} text="CIVIL RIGHTS BILL: VETOED" at={t(wd(16, "civil"))} size={42} color="#ffd2c8" />
      </Svg>
    </Cam>
    <Cap text="Congress" pos="top" until={t(wd(16, "reconstruction"))} />
  </>) },
  // 17 The fight eventually produced the first presidential impeachment.
  { a: ln(17), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<HouseChamber />}>
        <V c="andrew_johnson" p={10} x={700} y={1010} h={600} />
        <V c="andrew_johnson" p={32} x={1360} y={980} h={300} at={t(wd(17, "impeachment")) - 8} drop={{ frames: 8, height: 900 }} />
      </Svg>
    </Cam>
    <Cap text="1868" pos="top" />
    <Stamp lines={["IMPEACHED"]} at={t(wd(17, "impeachment"))} x={1300} y={360} rot={-9} variant="red" />
  </>) },
  // 18 At his Senate trial, the votes for conviction fell one short of the number needed to remove him.
  { a: ln(18), el: (t) => (<>
    <Svg bg={<Bars title="SENATE TRIAL · MAY 1868" max={40} rows={[
      { name: "VOTES TO CONVICT", v: 35, color: "#e9b23c" },
      { name: "NEEDED TO REMOVE (2/3)", v: 36, color: "#cfd8dc" },
    ]} gap={{ text: "ONE SHORT", at: t(wd(18, "short")) }} />} />
  </>) },
  // 19 His presidency survived by a single vote.
  { a: ln(19), el: (t, dur) => (<>
    <Cam dur={dur} from={1.04} to={1.1}>
      <Svg bg={<WhiteHouseLawn />}>
        <Swap t={t(wd(19, "survived"))} a={<V c="andrew_johnson" p={10} x={860} y={1010} h={600} />} b={<V c="andrew_johnson" p={11} x={860} y={1010} h={600} />} />
        <Label x={1440} y={330} text="SAVED BY 1 VOTE" at={t(wd(19, "single"))} size={50} color="#c9f2b8" />
        <Quill pose="nervous_side_glance" x={230} y={1200} h={680} at={t(wd(19, "vote"))} />
      </Svg>
    </Cam>
  </>) },
  // 20 Chester A. Arthur's promotion came with a deeply uncomfortable association.
  { a: ln(20), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06}>
      <Svg bg={<B.FederalHall />}>
        <Swap t={t(wd(20, "uncomfortable"))} a={<VH c="chester_arthur" p="front" e={0} x={960} y={1010} h={600} />} b={<VH c="chester_arthur" p="front" e={4} x={960} y={1010} h={600} />} />
        <Sweat x={1130} y={400} at={t(wd(20, "association"))} />
      </Svg>
    </Cam>
    <Card text="Chester A. Arthur" sub="20th Vice President · 21st President" until={t(wd(20, "came"))} />
  </>) },
  // 21 When James Garfield was shot in 1881, the gunman declared his support for Arthur's Republican faction and announced that Arthur would be president.
  { a: ln(21), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05} punch={{ at: t(wd(21, "shot")), frames: 5, to: 1.12, ox: "50%", oy: "45%" }}><Svg bg={<B.Village />}>
        <Swap t={t(wd(21, "shot"))} a={<V c="james_garfield" p={0} x={960} y={1010} h={600} />} b={<V c="james_garfield" p={7} x={960} y={1010} h={600} />} />
        <Splat x={1050} y={800} r={80} at={t(wd(21, "shot"))} />
      </Svg></Cam>],
      [t(wd(21, "gunman")), <Cam dur={dur} from={1.0} to={1.04}><Svg bg={<B.Village />}>
        <Swap t={t(wd(21, "announced"))} a={<V c="garfield_attacker" p={6} x={620} y={1010} h={600} />} b={<V c="garfield_attacker" p={7} x={620} y={1010} h={600} />} />
        <Swap t={t(wd(21, "arthur", 1)) - t(wd(21, "gunman"))} a={<Label x={620} y={260} text="STALWART SUPPORTER" at={t(wd(21, "republican")) - t(wd(21, "gunman"))} size={44} />} b={null} />
        <Bubble x={980} y={200} w={760} text="ARTHUR WILL BE PRESIDENT!" at={t(wd(21, "arthur", 1)) - t(wd(21, "gunman"))} tail={[700, 430]} shout size={50} />
        <VH c="chester_arthur" p="front" e={3} x={1460} y={1010} h={600} at={t(wd(21, "arthur", 1)) - t(wd(21, "gunman"))} />
      </Svg></Cam>],
    ]} />
    <Cap text="July 2, 1881" pos="top" until={t(wd(21, "gunman"))} />
  </>), sfx: [[Math.round((wd(21, "shot") - ln(21)) * 30), "gunburst", 0.12]] },
];

export const VicePresidents2: React.FC = () => <Episode data={D} shots={SHOTS} />;
