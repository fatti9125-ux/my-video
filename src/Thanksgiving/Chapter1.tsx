import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Cap, Pose, Prop, Rig, Sfx, Shot, Stamp, useT } from "./core";
import { Bars, BluePlate, Chapel, Chamber, Country, DeskRow, FederalHall, Parchment, Prison, Study } from "./Sets";
import { Cam, Card, NameCard, Scoreboard, Typed, WhiskeyJug, Word } from "./Graphics";

// Chapter 1 — George Washington: The First One. Times are seconds on ch1.wav (VO file 1 from 35.90 s),
// taken from the speech-recognition phrase timings.
export const CH1_END = 56.4;

const Title: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.03}><FederalHall /></Cam>
    <NameCard text="George Washington" sub="1 · The First One" />
  </AbsoluteFill>
);

const Year1789: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Cam to={1.05} oy="70%">
        <FederalHall />
        <Pose who="congressional_delegate" k="carrying_a_letter" x={300 + f * 4} y={960} h={420} seed={2} />
        <Pose who="elias_boudinot" k="three_quarter_neutral" x={1450} y={960} h={400} flip seed={3} />
      </Cam>
      <Cap t={1.45} text="New York City · 1789" />
    </AbsoluteFill>
  );
};

const Constitution: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.06}>
      <Parchment>
        <Typed t={2.8} text="We the People" y={250} size={150} cps={20} />
        <Typed t={3.3} text="of the United States, in Order to form a more perfect Union…" y={470} size={56} cps={45} width={1100} />
      </Parchment>
    </Cam>
    <Stamp t={3.75} lines={["BRAND", "NEW"]} x={1420} y={780} rotate={-12} />
  </AbsoluteFill>
);

const Excited: React.FC = () => {
  const t = useT();
  const jump = (seed: number) => Math.abs(Math.sin(t * 7 + seed)) * 40;
  return (
    <AbsoluteFill>
      <Cam to={1.04}>
        <Chamber />
        <Rig who="congressional_delegate" x={420} y={930} scale={0.95} head="reaction_head" armL={150} armR={30} hop={jump(0)} seed={1} />
        <Rig who="elias_boudinot" x={960} y={940} scale={1} armL={20} armR={140} hop={jump(1.4)} seed={2} />
        <Rig who="congressional_delegate" x={1500} y={930} scale={0.95} head="reaction_head" armL={40} armR={150} hop={jump(2.4)} seed={3} flip />
        <DeskRow />
      </Cam>
      <Cap t={4.75} text="Congress: excited" pos="top" />
    </AbsoluteFill>
  );
};

const TooExcited: React.FC = () => {
  const f = useCurrentFrame(); const t = useT();
  const confetti = Array.from({ length: 60 }, (_, i) => ({ x: (i * 173) % 1920, y: ((f * (6 + (i % 5))) + i * 97) % 1200 - 100, c: ["#c8261f", "#f6efe0", "#2d4b8a", "#ffd96a"][i % 4], r: (f * 9 + i * 40) % 360 }));
  return (
    <AbsoluteFill>
      <Cam to={1.12} shake={6}>
        <Chamber />
        {[[330, 0], [760, 1], [1170, 2], [1600, 3]].map(([x, i]) => (
          <Pose key={i} who="congressional_delegate" k="voting_aye" x={x} y={1000 - Math.abs(Math.sin(t * 9 + i)) * 70} h={560} flip={i % 2 === 1} seed={i} rot={Math.sin(t * 9 + i) * 6} />
        ))}
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {confetti.map((c, i) => <rect key={i} x={c.x} y={c.y} width={18} height={30} fill={c.c} stroke="#1d1a17" strokeWidth={3} transform={`rotate(${c.r} ${c.x} ${c.y})`} />)}
        </svg>
      </Cam>
      <Word t={6.25} text="Maybe too excited." y={170} size={110} />
      <Sfx t={6.2} s="boing" v={0.35} />
    </AbsoluteFill>
  );
};

const Boudinot: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.06} ox="45%">
      <Chamber />
      <Pose who="elias_boudinot" k="holding_the_petition" x={900} y={1000} h={720} seed={4} />
    </Cam>
    <Cap t={8.2} text="Rep. Elias Boudinot · New Jersey" />
  </AbsoluteFill>
);

const Petition: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.05} ox="30%">
      <Chamber />
      <Pose who="elias_boudinot" k="presenting_the_petition" x={520} y={990} h={600} seed={5} />
      <Rig who="congressional_delegate" x={1180} y={950} scale={0.9} flip seed={2} />
      <Rig who="congressional_delegate" x={1560} y={960} scale={0.95} flip seed={6} head={[[10.5, "neutral_head"], [12.2, "reaction_head"]]} />
      <DeskRow />
    </Cam>
    <Cap t={11.95} text="Request: a day of thanksgiving" pos="top" />
  </AbsoluteFill>
);

const Agrees: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.05}>
      <Chamber />
      {[[380, 14.15], [960, 14.4], [1540, 14.65]].map(([x, t], i) => (
        <Pose key={i} who="congressional_delegate" k="voting_aye" x={x} y={1000} h={600} at={t} flip={i === 2} seed={i + 3} />
      ))}
      <DeskRow />
    </Cam>
    <Word t={14.2} text="Aye!" x={380} y={240} size={120} rot={-8} />
    <Word t={14.45} text="Aye!" x={960} y={200} size={120} rot={4} />
    <Word t={14.7} text="Aye!" x={1540} y={240} size={120} rot={-4} />
  </AbsoluteFill>
);

const Committee: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Cam to={1.04} panX={-40}>
        <FederalHall />
        <Pose who="congressional_delegate" k="carrying_a_letter" x={200 + f * 9} y={990} h={520} seed={7} />
        <Pose who="congressional_delegate" k="right_profile" x={20 + f * 9} y={990} h={500} seed={8} />
      </Cam>
      <Cap t={15.4} text="Committee: off to Washington" pos="top" />
    </AbsoluteFill>
  );
};

const Signing: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.07} oy="60%">
      <Study v="gw" />
      <Pose who="george_washington" k="signing_the_proclamation" x={960} y={1010} h={760} seed={2} bob={0.6} />
    </Cam>
    <Cap t={17.2} text="October 3, 1789" pos="top" />
    <Sfx t={19.6} s="pop" v={0.3} />
  </AbsoluteFill>
);

const Proclamation: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.05} oy="35%">
      <Parchment>
        <Typed t={21.0} text="By the President of the United States of America" y={150} size={46} cps={60} italic={false} />
        <Typed t={21.2} text="A PROCLAMATION" y={230} size={96} cps={30} italic={false} />
        <Typed t={21.35} text="Thursday, the 26th day of November next" y={370} size={72} cps={34} />
        <Typed t={22.9} text="“a day of public thanksgiving and prayer”" y={600} size={84} cps={24} color="#8f1d16" />
        <Typed t={24.4} text="— G. Washington" y={850} size={64} cps={30} />
      </Parchment>
    </Cam>
    <Cap t={21.25} text="Thursday, November 26" />
  </AbsoluteFill>
);

const FirstNational: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.05}>
      <FederalHall />
      <Rig who="george_washington" x={760} y={1000} scale={1.25} armR={60} seed={3} head={[[25.4, "neutral_head"], [27.2, "skeptical_head"]]} />
    </Cam>
    <Stamp t={25.75} lines={["THE FIRST NATIONAL", "THANKSGIVING", "UNDER THE CONSTITUTION"]} x={1390} y={330} rotate={-8} />
  </AbsoluteFill>
);

const QuillAsks: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.05}>
      <BluePlate />
      <Rig who="quill" x={760} y={1020} scale={1.55} talk seed={1} />
    </Cam>
    <Word t={28.9} text="?" x={1340} y={420} size={420} rot={10} />
    <Cap t={29.7} text="The big day" pos="top" />
  </AbsoluteFill>
);

const Church: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Cam to={1.05} oy="60%">
        <Chapel />
        <Pose who="george_washington" k="right_profile" x={Math.min(820, 300 + f * 7)} y={1000} h={430} seed={4} />
      </Cam>
      <Cap t={32.3} text="St. Paul's Chapel · New York" />
      <Sfx t={31.5} s="pop" v={0.15} />
    </AbsoluteFill>
  );
};

const Debtors: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.05}>
      <Prison />
      <Pose who="george_washington" k="handing_out_beer" x={620} y={1000} h={620} seed={5} at={34.15} />
      <Pose who="debtor" k="reaching_for_food" x={1330} y={1000} h={600} flip seed={6} />
      <Prop k="bread_basket" x={1000} y={930} h={150} at={35.0} />
    </Cam>
    <Cap t={35.6} text="Debtors' prison" pos="top" />
  </AbsoluteFill>
);

const Beer: React.FC = () => (
  <AbsoluteFill>
    <BluePlate />
    <Cam to={1.15}><Prop k="beer_tankard" x={960} y={560} h={560} at={38.05} /></Cam>
    <Word t={38.08} text="Beer." y={170} size={150} />
  </AbsoluteFill>
);

const ForDebtors: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.08}>
      <Prison />
      <Pose who="debtor" k="holding_beer_and_bread" x={960} y={1080} h={900} seed={2} />
      <Bars />
    </Cam>
    <Word t={38.75} text="For the debtors." y={150} size={110} />
  </AbsoluteFill>
);

const DayOne: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.06}>
      <BluePlate />
      <Pose who="quill" k="beer_mug_reaction" x={640} y={1020} h={820} seed={3} />
    </Cam>
    <Stamp t={40.0} lines={["ON DAY", "ONE."]} x={1360} y={460} rotate={-10} />
  </AbsoluteFill>
);

const Whiskey: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.05} ox="40%">
      <Country v="pa" />
      <Rig who="george_washington" x={620} y={1000} scale={1.3} head={[[41.5, "neutral_head"], [43.6, "skeptical_head"]]} armL={25} seed={6} />
    </Cam>
    <Cap t={41.7} text="1795" pos="top" size={110} />
    <Cap t={43.4} text="After the Whiskey Rebellion" />
  </AbsoluteFill>
);

const BeerAndWhiskey: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.04}>
      <BluePlate>
        <Card t={46.1} x={560} y={560} title="1789" sub="BEER" />
        <Card t={46.7} x={1360} y={560} title="1795" sub="WHISKEY" />
        <Prop k="beer_tankard" x={560} y={560} h={300} at={48.3} />
        <AbsoluteFill style={{ opacity: useT() >= 48.95 ? 1 : 0 }}><WhiskeyJug x={1360} y={560} k={1.05} /></AbsoluteFill>
      </BluePlate>
    </Cam>
    <Sfx t={48.3} s="pop" v={0.35} /><Sfx t={48.95} s="pop" v={0.35} />
  </AbsoluteFill>
);

const SideEye: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.1} oy="35%">
      <BluePlate />
      <Pose who="quill" k="side_eye" x={960} y={1060} h={900} seed={4} bob={0.4} />
    </Cam>
    <Cap t={49.6} text="Make of that what you will." />
  </AbsoluteFill>
);

const Score: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.04} ox="30%">
      <BluePlate />
      <Scoreboard rows={[{ t: 51.4, label: "TURKEYS MENTIONED", value: "0" }, { t: 52.4, label: "TURKEYS SPARED", value: "0" }]} />
      <Pose who="quill" k="scoreboard" x={330} y={1040} h={700} seed={5} />
    </Cam>
    <Stamp t={53.35} lines={["SCOREBOARD:", "OPEN"]} x={1400} y={880} rotate={-7} />
  </AbsoluteFill>
);

export const CH1_SHOTS: Shot[] = [
  { at: 0, C: Title },
  { at: 1.3, C: Year1789 },
  { at: 2.75, C: Constitution, whoosh: true },
  { at: 4.6, C: Excited },
  { at: 6.15, C: TooExcited },
  { at: 7.6, C: Boudinot, whoosh: true },
  { at: 10.5, C: Petition },
  { at: 14.05, C: Agrees },
  { at: 15.3, C: Committee, whoosh: true },
  { at: 16.85, C: Signing },
  { at: 21.0, C: Proclamation, whoosh: true },
  { at: 25.4, C: FirstNational },
  { at: 28.4, C: QuillAsks, whoosh: true },
  { at: 31.4, C: Church },
  { at: 34.05, C: Debtors, whoosh: true },
  { at: 38.0, C: Beer },
  { at: 38.7, C: ForDebtors },
  { at: 39.95, C: DayOne },
  { at: 41.45, C: Whiskey, whoosh: true },
  { at: 46.0, C: BeerAndWhiskey },
  { at: 49.45, C: SideEye },
  { at: 51.15, C: Score, whoosh: true },
];

