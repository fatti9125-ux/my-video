import React from "react";
import * as B from "../Thanksgiving/Backgrounds";
import { OvalOffice, WhiteHouseLawn } from "../Thanksgiving3/Bg2";
import { Episode, epDuration, makeAlign, Shot, Steps, Svg, Swap } from "../Thanksgiving3/Episode";
import { Cam, Cap, Card, Cheer, PopIn, QMarks, Quill, Stamp } from "../Thanksgiving3/Kit";
import { Act, Big, HeadIcon, INK, Label, LampGlow, Parlor, Sulk, USMap, V } from "./VKit";
import DATA from "./ep/vp3.json";

/**
 * Part 3 (VO vp3.mp3): Arthur and the Pendleton Act, Theodore Roosevelt parked in the vice presidency,
 * Coolidge sworn in by lamplight, Truman inheriting the war and beating Dewey.
 * Acting as in Part 1: Act characters (expression timelines, blinks, breathing, gestures), pose swaps on the
 * motivating word, reactions R frames later. Quill is the original mascot, beak closed outside the studio.
 */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const VP3_DURATION = epDuration(D);
const R = 4;

/** Light bulb with a red cross ("no electricity"). */
const NoBulb: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => (
  <PopIn at={at} x={x} y={y}>
    <circle cy={-60} r={90} fill="#f7e9a8" stroke={INK} strokeWidth={8} />
    <rect x={-40} y={20} width={80} height={60} rx={8} fill="#9aa3ab" stroke={INK} strokeWidth={8} />
    <path d="M -130 -190 L 130 70 M 130 -190 L -130 70" stroke="#e02b2b" strokeWidth={26} strokeLinecap="round" />
  </PopIn>
);

export const SHOTS: Shot[] = [
  // 0 Garfield lingered for weeks before dying, leaving Arthur with the office and a deeply uncomfortable association.
  { a: ln(0), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.Study sepia />}><V c="james_garfield" p={8} x={960} y={1010} h={560} /></Svg></Cam>],
      [t(wd(0, "leaving")), <Cam dur={dur} from={1.04} to={1.1} oy="45%"><Svg bg={<OvalOffice />}>
        <Act c="chester_arthur" x={960} y={1010} h={620} e={[[0, 0], [t(wd(0, "uncomfortable")) - t(wd(0, "leaving")) + R, 4]]} sweat={t(wd(0, "association")) - t(wd(0, "leaving"))} />
      </Svg></Cam>],
    ]} />
    <Cap text="September 1881" pos="top" until={t(wd(0, "leaving"))} />
    <Cap text="President Chester A. Arthur" pos="top" at={t(wd(0, "office"))} />
  </>) },
  // 1 Arthur had risen through a system that rewarded allies with government jobs.
  { a: ln(1), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.Chamber />}>
        <V c="chester_arthur" p="offer" x={760} y={1010} h={600} />
        {[0, 1, 2].map((i) => <V key={i} c="chester_arthur" p="p_certificate" x={1240 + i * 180} y={980 - i * 20} h={250} at={t(wd(1, "rewarded")) + i * 4} drop={{ frames: 7, height: 800 }} />)}
        <Label x={1420} y={330} text="SPOILS SYSTEM" at={t(wd(1, "system"))} size={52} />
      </Svg>
    </Cam>
  </>) },
  // 2 He surprised critics by signing the Pendleton Act, requiring competitive examinations for certain federal positions.
  { a: ln(2), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.Study />}>
        <V c="chester_arthur" p="signing" x={960} y={1010} h={560} />
        <QMarks x={960} y={330} at={t(wd(2, "critics")) + R} spread={260} />
      </Svg></Cam>],
      [t(wd(2, "examinations")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.PlateBg color="#2f6f8f" />}>
        <V c="shared_props_early" p={18} x={960} y={950} h={720} />
        <Label x={960} y={130} text="COMPETITIVE EXAMS" size={56} />
      </Svg></Cam>],
    ]} />
    <Cap text="Pendleton Act · 1883" pos="top" at={t(wd(2, "pendleton"))} until={t(wd(2, "examinations"))} />
  </>), sfx: [] },
  // 3 The politician associated with handing out jobs helped change how those jobs were filled.
  { a: ln(3), el: (t, dur) => (<>
    <Cam dur={dur} from={1.04} to={1.09}>
      <Svg bg={<B.Chamber />}>
        <Swap t={t(wd(3, "change"))} a={<V c="chester_arthur" p="offer" x={1000} y={1010} h={600} />} b={<V c="chester_arthur" p="checklist_pose" x={1000} y={1010} h={600} />} />
        <Swap t={t(wd(3, "change"))} a={<Label x={1500} y={300} text="JOBS FOR FRIENDS" at={t(wd(3, "handing"))} size={46} />} b={<Label x={1500} y={300} text="JOBS BY MERIT" size={52} color="#c9f2b8" />} />
        <Quill pose="deadpan_wings_folded" x={230} y={1200} h={680} at={t(wd(3, "filled"))} enter={{ from: "bottom", frames: 9 }} />
      </Svg>
    </Cam>
  </>) },
  // 4 Theodore Roosevelt's party bosses had their own staffing solution.
  { a: ln(4), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.FederalHall />}>
        <Act c="theodore_roosevelt" x={700} y={1010} h={580} e={[[0, 5], [t(wd(4, "staffing")) + R, 3]]} gesture={12} stress />
        <Act c="thomas_platt" x={1300} y={1010} h={600} flip at={t(wd(4, "bosses"))} enter={{ from: "right", frames: 8 }} e={5} />
        <Label x={1300} y={290} text="PARTY BOSS" at={t(wd(4, "bosses")) + 6} size={48} />
      </Svg>
    </Cam>
    <Card text="Theodore Roosevelt" sub="25th Vice President · 26th President" until={t(wd(4, "party"))} />
  </>) },
  // 5 New York boss Thomas Platt helped push the troublesome governor toward the vice presidency, getting him out of Albany.
  { a: ln(5), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.FederalHall />}>
        <Swap t={t(wd(5, "push"))} a={<Act c="thomas_platt" x={620} y={1010} h={600} e={5} />} b={<V c="thomas_platt" p="pointing" x={680} y={1010} h={600} />} />
        <Act c="theodore_roosevelt" x={1320} y={1010} h={580} flip e={[[0, 2], [t(wd(5, "vice")) + R, 3]]} vein={t(wd(5, "troublesome")) + R} />
        <Label x={1320} y={300} text="GOVERNOR OF NEW YORK" at={t(wd(5, "governor"))} size={40} />
      </Svg></Cam>],
      [t(wd(5, "getting")), <Cam dur={dur} from={1.12} to={1.18} ox="85%" oy="40%"><Svg bg={<USMap pins={[{ lon: -73.75, lat: 42.65, at: 0, name: "ALBANY", dy: -96 }, { lon: -77.03, lat: 38.9, at: t(wd(5, "albany")) - t(wd(5, "getting")), name: "WASHINGTON" }]} />} /></Cam>],
    ]} />
    <Cap text="New York boss Thomas Platt" pos="top" at={t(wd(5, "thomas"))} until={t(wd(5, "getting"))} size={60} />
  </>) },
  // 6 In 1901, President McKinley was assassinated, and Roosevelt became president at forty-two.
  { a: ln(6), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.Study sepia />}><V c="william_mckinley" p={10} x={960} y={1010} h={560} /></Svg></Cam>],
      [t(wd(6, "roosevelt")), <Cam dur={dur} from={1.0} to={1.06}><Svg bg={<B.Chamber />}>
        <V c="theodore_roosevelt" p={10} x={860} y={1010} h={600} />
        <Big x={1450} y={560} text="AGE 42" size={110} at={t(wd(6, "forty")) - t(wd(6, "roosevelt"))} />
      </Svg></Cam>],
    ]} />
    <Cap text="September 1901" pos="top" until={t(wd(6, "roosevelt"))} />
    <Cap text="Youngest president ever" pos="top" at={t(wd(6, "forty"))} />
  </>) },
  // 7 The plan to move him into a quieter job had put him in the most powerful one.
  { a: ln(7), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05} punch={{ at: t(wd(7, "powerful")), frames: 6, to: 1.1, ox: "60%", oy: "45%" }}>
      <Svg bg={<OvalOffice />}>
        <Sulk at={t(wd(7, "powerful")) + R}>
          <Act c="thomas_platt" x={560} y={1010} h={580} e={[[0, 5], [t(wd(7, "put")) + R, 3]]} sweat={t(wd(7, "powerful")) + R} />
        </Sulk>
        <Act c="theodore_roosevelt" x={1260} y={1010} h={600} flip e={[[0, 0], [t(wd(7, "powerful")), 5]]} gesture={12} stress />
        <Swap t={t(wd(7, "had"))} a={<Label x={960} y={240} text="QUIET JOB" at={t(wd(7, "quieter"))} size={50} />} b={<Label x={960} y={240} text="MOST POWERFUL JOB" size={52} color="#ffe08a" />} />
      </Svg>
    </Cam>
  </>) },
  // 8 He pursued corporate regulation and conservation, then won the presidency himself in 1904.
  { a: ln(8), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.Chamber />}>
        <V c="theodore_roosevelt" p={11} x={820} y={1010} h={600} />
        <Label x={1420} y={330} text="CORPORATE REGULATION" at={t(wd(8, "corporate"))} size={44} />
      </Svg></Cam>],
      [t(wd(8, "conservation")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.Hills />}>
        <V c="theodore_roosevelt" p={12} x={900} y={1010} h={620} />
        <Label x={1450} y={300} text="CONSERVATION" size={52} color="#c9f2b8" />
      </Svg></Cam>],
      [t(wd(8, "won")), <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<WhiteHouseLawn />}>
        <V c="theodore_roosevelt" p={8} x={760} y={1010} h={620} />
        <V c="theodore_roosevelt" p={42} x={1360} y={900} h={420} at={t(wd(8, "presidency")) - t(wd(8, "won"))} />
        <Cheer x={520} y={300} w={500} />
      </Svg></Cam>],
    ]} />
    <Cap text="Election of 1904" pos="top" at={t(wd(8, "1904"))} />
  </>), sfx: [[Math.round((wd(8, "won") - ln(8)) * 30), "cheer", 0.1]] },
  // 9 Being parked in the vice presidency had worked out rather well for Roosevelt.
  { a: ln(9), el: (t, dur) => (<>
    <Cam dur={dur} from={1.04} to={1.1} oy="45%">
      <Svg bg={<WhiteHouseLawn />}>
        <Act c="theodore_roosevelt" x={1060} y={1010} h={620} e={5} gesture={14} stress />
        <Label x={1500} y={280} text="WORKED OUT FINE" at={t(wd(9, "worked"))} size={46} />
        <Quill pose="deadpan_wings_folded" x={230} y={1200} h={680} at={t(wd(9, "rather"))} enter={{ from: "bottom", frames: 9 }} />
      </Svg>
    </Cam>
  </>) },
  // 10 Calvin Coolidge's promotion came with considerably less noise.
  { a: ln(10), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.Study />}>
        <Act c="calvin_coolidge" x={960} y={1010} h={600} e={0} />
        <Label x={1450} y={330} text="SILENT CAL" at={t(wd(10, "noise"))} size={52} />
      </Svg>
    </Cam>
    <Card text="Calvin Coolidge" sub="29th Vice President · 30th President" until={t(wd(10, "promotion"))} />
  </>) },
  // 11 In August 1923, he was visiting his father in Vermont when news arrived that President Warren Harding had died.
  { a: ln(11), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<Parlor />}>
        <Act c="calvin_coolidge" x={720} y={1010} h={560} e={[[0, 0], [t(wd(11, "died")) + R, 3]]} sweat={t(wd(11, "died")) + R} />
        <Act c="john_coolidge_senior" x={1240} y={1010} h={560} flip e={[[0, 5], [t(wd(11, "died")) + R + 2, 3]]} at={t(wd(11, "father"))} />
        <V c="warren_harding" p={37} x={980} y={560} h={200} at={t(wd(11, "news"))} drop={{ frames: 7, height: 600 }} />
        <HeadIcon c="warren_harding" e={4} x={980} y={250} size={190} at={t(wd(11, "harding"))} ring="#cfc8bb" />
      </Svg>
    </Cam>
    <Cap text="Vermont · August 1923" pos="top" until={t(wd(11, "harding"))} />
  </>) },
  // 12 The house had no electricity.
  { a: ln(12), el: (t, dur) => (<>
    <Cam dur={dur} from={1.04} to={1.08}>
      <Svg bg={<Parlor />}>
        <Act c="calvin_coolidge" x={720} y={1010} h={560} e={3} />
        <Act c="john_coolidge_senior" x={1240} y={1010} h={560} flip e={0} />
        <NoBulb x={980} y={360} at={t(wd(12, "electricity"))} />
      </Svg>
    </Cam>
    <Cap text="No electricity" at={t(wd(12, "electricity"))} />
  </>) },
  // 13 So his father, a notary public, administered the presidential oath by the light of a kerosene lamp.
  { a: ln(13), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06}>
      <Svg bg={<Parlor />}>
        <Swap t={t(wd(13, "oath"))} a={<Act c="calvin_coolidge" x={700} y={1010} h={560} e={0} />} b={<V c="calvin_coolidge" p={6} x={700} y={1010} h={560} />} />
        <Swap t={t(wd(13, "administered"))} a={<V c="john_coolidge_senior" p={8} x={1260} y={1010} h={580} flip />} b={<V c="john_coolidge_senior" p={7} x={1260} y={1010} h={580} flip />} />
        <Swap t={t(wd(13, "administered"))} a={<LampGlow x={1080} y={760} />} b={<LampGlow x={1000} y={700} at={t(wd(13, "lamp"))} />} />
        <Swap t={t(wd(13, "administered"))} a={null} b={<V c="john_coolidge_senior" p={33} x={1000} y={830} h={190} />} />
        <Label x={1260} y={260} text="NOTARY PUBLIC" at={t(wd(13, "notary"))} size={48} />
      </Svg>
    </Cam>
  </>) },
  // 14 There's the lamp.
  { a: ln(14), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.12}>
      <Svg bg={<Parlor />}>
        <LampGlow x={960} y={520} r={700} at={0} />
        <V c="john_coolidge_senior" p={33} x={960} y={900} h={600} />
        <Quill pose="deadpan_wings_folded" x={230} y={1200} h={680} enter={{ from: "bottom", frames: 9 }} />
      </Svg>
    </Cam>
  </>) },
  // 15 The new president had been sworn in by his dad in the family parlor.
  { a: ln(15), el: (t, dur) => (<>
    <Cam dur={dur} from={1.06} to={1.0}>
      <Svg bg={<Parlor />}>
        <Act c="calvin_coolidge" x={720} y={1010} h={560} e={[[0, 0], [t(wd(15, "dad")) + R, 5]]} gesture={8} stress />
        <Act c="john_coolidge_senior" x={1240} y={1010} h={560} flip e={5} />
        <V c="john_coolidge_senior" p={33} x={980} y={900} h={220} />
        <LampGlow x={980} y={760} />
      </Svg>
    </Cam>
    <Cap text="August 3, 1923 · Plymouth Notch" pos="top" size={60} />
  </>) },
  // 16 Coolidge went on to win the 1924 election.
  { a: ln(16), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<WhiteHouseLawn />}>
        <Swap t={t(wd(16, "win"))} a={<Act c="calvin_coolidge" x={820} y={1010} h={600} e={0} />} b={<V c="calvin_coolidge" p={8} x={820} y={1010} h={600} />} />
        <V c="shared_props_early" p={0} x={1360} y={1010} h={250} />
        <Cheer x={580} y={300} w={480} />
      </Svg>
    </Cam>
    <Cap text="Election of 1924" pos="top" at={t(wd(16, "1924"))} />
  </>), sfx: [[Math.round((wd(16, "win") - ln(16)) * 30), "cheer", 0.1]] },
  // 17 Harry Truman had only eighty-two days to get used to being vice president.
  { a: ln(17), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.Chamber />}>
        <Act c="harry_truman" x={760} y={1010} h={600} e={[[0, 0], [t(wd(17, "only")) + R, 3]]} sweat={t(wd(17, "days")) + R} />
        <Big x={1400} y={520} text="82 DAYS" size={120} at={t(wd(17, "eighty"))} />
        <Big x={1400} y={640} text="AS VICE PRESIDENT" size={56} at={t(wd(17, "vice"))} />
      </Svg>
    </Cam>
    <Card text="Harry S. Truman" sub="34th Vice President · 33rd President" until={t(wd(17, "had"))} />
  </>) },
  // 18 When Franklin Roosevelt died in April 1945, Truman suddenly inherited a world war.
  { a: ln(18), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.05}><Svg bg={<B.Study sepia />}><V c="franklin_roosevelt" p={8} x={960} y={1010} h={560} /></Svg></Cam>],
      [t(wd(18, "truman")), <Cam dur={dur} from={1.0} to={1.08}><Svg bg={<OvalOffice />}>
        <V c="harry_truman" p={8} x={960} y={1010} h={600} />
        <Label x={1460} y={300} text="WORLD WAR II" at={t(wd(18, "world")) - t(wd(18, "truman"))} size={56} color="#ffd2c8" />
      </Svg></Cam>],
    ]} />
    <Cap text="April 12, 1945" pos="top" until={t(wd(18, "truman"))} />
  </>) },
  // 19 Roosevelt had barely included him in major decisions and hadn't briefed him on the atomic bomb project.
  { a: ln(19), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<OvalOffice />}>
        <V c="franklin_roosevelt" p={7} x={620} y={1010} h={560} />
        <Sulk at={t(wd(19, "barely")) + R}>
          <Act c="harry_truman" x={1320} y={1010} h={600} flip e={[[0, 0], [t(wd(19, "barely")) + R, 4]]} />
        </Sulk>
        <V c="harry_truman" p={36} x={640} y={500} h={200} at={t(wd(19, "atomic"))} />
        <Label x={640} y={300} text="TOP SECRET" at={t(wd(19, "atomic"))} size={50} color="#ffd2c8" />
      </Svg>
    </Cam>
  </>) },
  // 20 Truman became president before learning the full details of the weapon he would authorize against Japan.
  { a: ln(20), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05}>
      <Svg bg={<B.Chamber />}>
        <Swap t={t(wd(20, "learning"))} a={<V c="harry_truman" p={7} x={860} y={1010} h={600} />} b={<V c="harry_truman" p={9} x={860} y={1010} h={600} />} />
        <Label x={1440} y={330} text="MANHATTAN PROJECT" at={t(wd(20, "details"))} size={46} />
      </Svg>
    </Cam>
    <Cap text="Sworn in · April 12, 1945" pos="top" until={t(wd(20, "learning"))} size={60} />
  </>) },
  // 21 He later faced an election many expected him to lose, then defeated Thomas Dewey in 1948.
  { a: ln(21), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.05} punch={{ at: t(wd(21, "defeated")), frames: 6, to: 1.08, ox: "35%", oy: "50%" }}>
      <Svg bg={<WhiteHouseLawn />}>
        <Swap t={t(wd(21, "defeated"))}
          a={<Act c="harry_truman" x={660} y={1010} h={600} e={[[0, 0], [t(wd(21, "lose")) + R, 4]]} sweat={t(wd(21, "lose")) + R} />}
          b={<V c="harry_truman" p={11} x={660} y={1010} h={620} />} />
        <Swap t={t(wd(21, "dewey")) + R}
          a={<Act c="thomas_dewey" x={1320} y={1010} h={600} flip e={5} gesture={10} stress />}
          b={<Sulk at={0}><V c="thomas_dewey" p={8} x={1320} y={1010} h={600} flip /></Sulk>} />
        <Label x={1320} y={280} text="THE FAVORITE" at={t(wd(21, "expected"))} size={48} />
      </Svg>
    </Cam>
    <Cap text="Election of 1948" pos="top" at={t(wd(21, "election"))} />
  </>), sfx: [[Math.round((wd(21, "defeated") - ln(21)) * 30), "cheer", 0.1]] },
  // 22 The replacement won a term of his own.
  { a: ln(22), el: (t, dur) => (<>
    <Cam dur={dur} from={1.04} to={1.1} oy="45%">
      <Svg bg={<OvalOffice />}>
        <Act c="harry_truman" x={1000} y={1010} h={620} e={5} gesture={12} stress />
        <Quill pose="deadpan_wings_folded" x={230} y={1200} h={680} at={t(wd(22, "won"))} enter={{ from: "bottom", frames: 9 }} />
      </Svg>
    </Cam>
    <Stamp lines={["ELECTED IN", "HIS OWN RIGHT"]} at={t(wd(22, "term"))} x={1450} y={300} rot={-8} variant="red" darken={false} />
  </>) },
];

export const VicePresidents3: React.FC<{ noAudio?: boolean }> = ({ noAudio }) => <Episode data={D} shots={SHOTS} noAudio={noAudio} />;
