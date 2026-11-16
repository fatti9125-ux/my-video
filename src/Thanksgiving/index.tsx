import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Camera, Caption, NameCard, StampCard } from "../EmuWar/Scenery";
import * as B from "./Backgrounds";
import CUT from "./cutouts.json";
import ENV from "./env.json";
import {
  Barrel, BigText, Book, Bubble, CalendarPage, ChurchState, Constitution, LetterStack, Mark, Pie, Proclamation,
  PropImg, Scoreboard, SplitWar, StateGrid,
} from "./Graphics";
import { ARMS, LayerPuppet, QuillPuppet } from "./LayerPuppet";

/**
 * "Every President's Thanksgiving Explained" — Chapters 1-3 (cold open skipped).
 * VO: ch1.mp3 (file 1 from 36.05 s, after the cold open) then ch2_ch3.mp3 at O2.
 * Shot times are the sentence alignment of the script to the VO (align_script.py), in seconds.
 */
const FPS = 30;
const O2 = 56.12; // global start of the ch2+3 voiceover
export const TG_DURATION = Math.round(187.6 * FPS);
const VO_ENV = ENV as number[];
const C = CUT as unknown as Record<string, Record<string, [number, number]>>;

// ---------- small helpers ----------
const Svg: React.FC<{ children: React.ReactNode; bg?: React.ReactNode; tex?: number }> = ({ children, bg, tex }) => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    <B.Defs />
    {bg}
    {children}
    <B.Finish tex={tex} />
  </svg>
);

const Pose: React.FC<{ c: string; f: string; x: number; y?: number; h?: number; at?: number; flip?: boolean; slide?: number }> = ({ c, f, x, y = 1000, h = 560, at = 0, flip, slide }) => {
  const frame = useCurrentFrame();
  const dims = C[c][f];
  const s = frame < at ? 0 : Math.min(1, (frame - at) / 6);
  const w = (h * dims[0]) / dims[1];
  const dx = slide !== undefined ? interpolate(s, [0, 1], [slide, 0], { easing: (t) => 1 - (1 - t) ** 3 }) : 0;
  const pop = slide !== undefined ? 1 : 0.9 + 0.1 * s;
  const breathe = 1 + Math.sin(frame / 18) * 0.008;
  if (frame < at) return null;
  return (
    <g transform={`translate(${x + dx} ${y}) scale(${(flip ? -1 : 1) * pop} ${pop * breathe})`}>
      <image href={staticFile(`thanksgiving/${c}/${f}.png`)} x={-w / 2} y={-h} width={w} height={h} />
    </g>
  );
};

type Shot = { a: number; b: number; el: (start: number) => React.ReactNode; sfx?: [number, string, number?][] };

// ---------- the shot list ----------
const g1 = (t: number) => t - 36.05; // file-1 time -> global
const g2 = (t: number) => t + O2;    // file-2 time -> global

const Q = (start: number, props: Partial<React.ComponentProps<typeof QuillPuppet>> = {}) => (
  <QuillPuppet x={960} y={1010} height={640} talk={VO_ENV} talkOffset={start} {...props} />
);

const SHOTS: Shot[] = [
  // ===== CHAPTER 1: GEORGE WASHINGTON — THE FIRST ONE =====
  { a: g1(36.05), b: g1(38.64), sfx: [[0, "thud", 0.8]], el: () => (
    <>
      <Camera dur={80} to={1.05}><Svg bg={<B.FederalHall />}><LayerPuppet char="george_washington" x={960} y={1010} height={560} /></Svg></Camera>
      <NameCard text="George Washington" sub="1 · The First One" />
    </>) },
  { a: g1(38.64), b: g1(40.54), sfx: [[0, "whoosh", 0.5], [4, "pop"]], el: () => (
    <>
      <Camera dur={60} to={1.06} originY="40%"><Svg bg={<B.FederalHall />}><LayerPuppet char="congressional_delegate" x={420} y={1040} height={460} armR={ARMS.wave} /><LayerPuppet char="elias_boudinot" x={1500} y={1040} height={470} flip /></Svg></Camera>
      <Caption text="1789" at={4} pos="top" size={130} />
    </>) },
  { a: g1(40.54), b: g1(42.08), sfx: [[2, "pop"]], el: () => (
    <>
      <Camera dur={50} to={1.05}><Svg bg={<B.PlateBg />}><Constitution x={960} y={560} at={2} /></Svg></Camera>
      <Caption text="Brand New" at={10} size={96} />
    </>) },
  { a: g1(42.08), b: g1(44.39), sfx: [[0, "whoosh", 0.4], [30, "boing", 0.5]], el: () => {
    const Hop: React.FC = () => { const f = useCurrentFrame(); return (
      <>{[260, 700, 1220, 1660].map((x, i) => (
        <g key={x} transform={`translate(0 ${f > 30 ? -Math.abs(Math.sin(f / 4 + i)) * 50 : 0})`}>
          <Pose c="congressional_delegate" f="04_Voting_aye" x={x} y={1050} h={500} flip={i % 2 === 1} />
        </g>))}</>); };
    return (<><Camera dur={70} to={1.06}><Svg bg={<B.Chamber />}><Hop /><Mark x={960} y={360} ch="!" at={32} /></Svg></Camera><Caption text="Maybe too excited" at={34} size={80} /></>);
  } },
  { a: g1(44.39), b: g1(51.34), sfx: [[0, "whoosh", 0.4], [8, "pop"], [70, "paper", 0.7], [110, "pop"]], el: () => {
    const Boud: React.FC = () => { const f = useCurrentFrame(); return f < 100
      ? <Pose c="elias_boudinot" f="04_Holding_the_petition" x={900} y={1030} h={640} />
      : <Pose c="elias_boudinot" f="05_Presenting_the_petition" x={900} y={1030} h={640} />; };
    return (
      <>
        <Camera dur={210} to={1.05} originX="45%"><Svg bg={<B.Chamber />}><Boud />
          <Pose c="congressional_delegate" f="02_Three_quarter_neutral" x={1580} y={1060} h={470} flip />
          <PropImg name="Quill_and_Inkpot" x={300} y={880} w={170} at={20} />
        </Svg></Camera>
        <Caption text="Elias Boudinot" at={8} pos="top" />
        <Caption text="Representative · New Jersey" at={20} size={52} color="#ffd96a" />
        <StampCard lines={["A DAY OF", "THANKSGIVING", "PLEASE"]} at={112} x={1460} y={330} rotate={-8} />
      </>);
  } },
  { a: g1(51.34), b: g1(54.16), sfx: [[0, "whoosh", 0.5], [10, "paper", 0.7]], el: () => {
    // the letter is part of the finished "carrying a letter" drawing, so it stays in his hand
    const Walk: React.FC = () => { const f = useCurrentFrame(); return (
      <g transform={`translate(0 ${-Math.abs(Math.sin(f / 4)) * 10})`}><Pose c="congressional_delegate" f="05_Carrying_a_letter" x={240 + f * 9} y={1040} h={520} /></g>); };
    return (<><Camera dur={85} to={1.04}><Svg bg={<B.FederalHall />}><Walk /><LayerPuppet char="george_washington" x={1560} y={1030} height={560} flip armR={ARMS.hips} armL={ARMS.hips} /></Svg></Camera><Caption text="Congress agrees" at={4} pos="top" /></>);
  } },
  { a: g1(54.16), b: g1(58.98), sfx: [[0, "whoosh", 0.4], [10, "scribble", 0.8], [36, "pop"]], el: () => (
    <>
      <Camera dur={145} to={1.06} originY="55%"><Svg bg={<B.Study />}><Pose c="george_washington" f="04_Signing_the_proclamation" x={960} y={1040} h={680} /></Svg></Camera>
      <Caption text="October 3, 1789" at={36} pos="top" />
    </>) },
  { a: g1(58.98), b: g1(63.16), sfx: [[0, "paper", 0.8], [30, "pop"]], el: () => (
    <>
      <Camera dur={125} to={1.05}><Svg bg={<B.PlateBg color="#2a5d8f" />}>
        <Proclamation x={700} y={545} year="New York, 1789" lines={["", "", "Thursday, the 26th", "of November", "a day of public", "thanksgiving & prayer", ""]} />
        <CalendarPage x={1450} y={560} month="NOVEMBER" day="26" sub="THURSDAY" rot={6} />
      </Svg></Camera>
    </>) },
  { a: g1(63.16), b: g1(66.18), sfx: [[0, "whoosh", 0.4], [24, "thud", 1]], el: () => (
    <>
      <Camera dur={90} to={1.05}><Svg bg={<B.FederalHall />}><LayerPuppet char="george_washington" x={700} y={1020} height={600} head="Neutral" armR={ARMS.wave} armL={ARMS.hips} /></Svg></Camera>
      <StampCard lines={["THE FIRST", "NATIONAL", "THANKSGIVING"]} at={24} x={1350} y={360} rotate={-9} />
    </>) },
  { a: g1(66.18), b: g1(69.04), sfx: [[0, "whoosh", 0.5], [20, "pop"]], el: (st) => (
    <Camera dur={86} to={1.04}><Svg bg={<B.Studio />}>{Q(st, { wings: "open", gesture: 6 })}<Mark x={1400} y={420} at={20} /></Svg></Camera>) },
  { a: g1(69.04), b: g1(71.42), sfx: [[0, "whoosh", 0.4], [8, "pop"], [20, "ding", 0.35]], el: () => {
    const Walk: React.FC = () => { const f = useCurrentFrame(); return <LayerPuppet char="george_washington" x={300 + f * 6} y={1040} height={520} walk={f * 0.4} />; };
    return (<><Camera dur={72} to={1.05} originY="35%"><Svg bg={<B.Chapel />}><Walk /></Svg></Camera><Caption text="St. Paul's Chapel" at={8} pos="top" /><Caption text="New York" at={16} size={52} color="#ffd96a" /></>);
  } },
  { a: g1(71.42), b: g1(75.50), sfx: [[0, "whoosh", 0.5], [40, "pop"], [60, "pop"]], el: () => (
    <>
      <Camera dur={122} to={1.05}><Svg bg={<B.Prison />}>
        <Pose c="debtor" f="04_Reaching_for_food" x={1350} y={1040} h={560} />
        <Pose c="george_washington" f="05_Handing_out_beer" x={660} y={1040} h={600} />
        <PropImg name="Bread_Basket" x={1000} y={980} w={220} at={40} />
      </Svg></Camera>
      <Caption text="Debtors' Prison" at={8} pos="top" />
    </>) },
  { a: g1(75.50), b: g1(77.42), sfx: [[0, "whoosh", 0.4], [0, "pop"], [20, "pop"], [38, "thud", 0.9]], el: () => (
    <>
      <Camera dur={58} to={1.07} originY="45%"><Svg bg={<B.Prison />}><Pose c="debtor" f="05_Holding_beer_and_bread" x={960} y={1060} h={700} /></Svg></Camera>
      <BigTextOverlay items={[["BEER.", 0, 960, 170], ["FOR THE DEBTORS.", 20, 960, 300]]} />
      <StampCard lines={["ON DAY", "ONE"]} at={38} x={1500} y={600} rotate={8} />
    </>) },
  { a: g1(77.42), b: g1(83.41), sfx: [[0, "whoosh", 0.5], [6, "pop"], [60, "thud", 0.7]], el: () => (
    <>
      <Camera dur={180} to={1.06} panX={-40}><Svg bg={<B.Hills />}>
        <Barrel x={1480} y={900} at={50} s={0.9} /><Barrel x={1700} y={930} at={56} s={0.75} />
        <LayerPuppet char="george_washington" x={720} y={1030} height={560} armR={ARMS.point} armL={ARMS.hips} />
        <Proclamation x={300} y={560} w={330} title="DECREE" at={20} />
      </Svg></Camera>
      <Caption text="1795" at={6} pos="top" size={120} />
      <Caption text="After the Whiskey Rebellion" at={60} size={70} />
    </>) },
  { a: g1(83.41), b: g1(86.22), sfx: [[0, "whoosh", 0.4], [6, "pop"], [24, "pop"]], el: () => (
    <Camera dur={85} to={1.04}><Svg bg={<B.PlateBg />}>
      <BigText x={520} y={260} text="1789" size={110} at={0} />
      <BigText x={1400} y={260} text="1795" size={110} at={18} />
      <PropImg name="Beer_Tankard" x={520} y={620} w={360} at={6} bob />
      <Barrel x={1400} y={640} at={24} />
      <BigText x={960} y={640} text="+" size={160} at={12} color="#ffd34a" />
    </Svg></Camera>) },
  { a: g1(86.22), b: g1(87.87), sfx: [[0, "whoosh", 0.4]], el: () => (
    <Camera dur={50} from={1.06} to={1.1} originY="35%"><Svg bg={<B.Studio />}><Pose c="quill" f="06_Side_eye" x={960} y={1030} h={680} /></Svg></Camera>) },
  { a: g1(87.87), b: O2, sfx: [[0, "whoosh", 0.4], [10, "ding", 0.6]], el: () => (
    <>
      <Camera dur={128} to={1.04}><Svg bg={<B.Studio />}>
        <Pose c="quill" f="04_Scoreboard" x={560} y={1030} h={660} />
        <Scoreboard x={1300} y={440} label="TURKEYS MENTIONED" value="0" at={10} />
      </Svg></Camera>
      <Caption text="Scoreboard is open" at={46} />
    </>) },

  // ===== CHAPTER 2: JOHN ADAMS AND THOMAS JEFFERSON — THE ONE WHO SAID NO =====
  { a: O2, b: g2(3.2), sfx: [[0, "thud", 0.8]], el: () => (
    <>
      <Camera dur={95} to={1.05}><Svg bg={<B.Study />}>
        <LayerPuppet char="john_adams" x={620} y={1020} height={560} />
        <LayerPuppet char="thomas_jefferson" x={1300} y={1020} height={570} flip head="Disapproving" armL={ARMS.folded} armR={ARMS.folded} />
      </Svg></Camera>
      <NameCard text="Adams & Jefferson" sub="2 · The One Who Said No" />
    </>) },
  { a: g2(3.2), b: g2(5.34), sfx: [[0, "whoosh", 0.4], [6, "pop"]], el: () => (
    <><Camera dur={64} to={1.05}><Svg bg={<B.Study />}><Pose c="john_adams" f="05_Presenting_the_proclamation" x={900} y={1040} h={640} /></Svg></Camera><Caption text="John Adams" at={6} pos="top" /></>) },
  { a: g2(5.34), b: g2(8.34), sfx: [[0, "paper", 0.6], [40, "pop"], [64, "pop"]], el: () => (
    <>
      <Camera dur={90} to={1.05}><Svg bg={<B.Study />}><Pose c="john_adams" f="04_Reading_the_proclamation" x={960} y={1040} h={660} /></Svg></Camera>
      <BigTextOverlay items={[["FINE.", 40, 450, 300], ["NORMAL.", 64, 1480, 300]]} />
    </>) },
  { a: g2(8.34), b: g2(9.82), sfx: [[0, "whoosh", 0.6], [6, "pop"]], el: () => {
    const Enter: React.FC = () => { const f = useCurrentFrame(); return <LayerPuppet char="thomas_jefferson" x={interpolate(f, [0, 16], [2200, 1100], { extrapolateRight: "clamp", easing: (t) => 1 - (1 - t) ** 3 })} y={1030} height={580} flip walk={f < 16 ? f * 0.6 : undefined} head="Skeptical" />; };
    return (<><Camera dur={45} to={1.04}><Svg bg={<B.Study />}><Enter /></Svg></Camera><Caption text="Thomas Jefferson" at={6} pos="top" /></>);
  } },
  { a: g2(9.82), b: g2(11.58), sfx: [[0, "pop"], [8, "thud", 0.6]], el: () => (
    <Camera dur={53} from={1.04} to={1.08} originY="35%"><Svg bg={<B.Study />}>
      <Pose c="thomas_jefferson" f="04_Refusing" x={1050} y={1060} h={700} />
      <Bubble x={500} y={300} text="NO THANK YOU." tx={820} ty={420} at={4} w={560} size={60} />
    </Svg></Camera>) },
  { a: g2(11.58), b: g2(13.32), sfx: [[0, "whoosh", 0.4], [4, "pop"], [24, "thud", 0.7]], el: () => (
    <>
      <Camera dur={52} to={1.06}><Svg bg={<B.PlateBg color="#e88a3a" />}><Pie x={960} y={620} at={2} heart /></Svg></Camera>
      <StampCard lines={["NOT THE", "PIE"]} at={24} x={1450} y={320} rotate={-10} />
    </>) },
  { a: g2(13.32), b: g2(18.26), sfx: [[0, "whoosh", 0.4], [4, "pop"], [10, "pop"]], el: () => (
    <>
      <Camera dur={148} to={1.04}><Svg bg={<B.PlateBg />}><ChurchState at={4} /></Svg></Camera>
      <Caption text="Church ≠ State" at={60} pos="top" />
    </>) },
  { a: g2(18.26), b: g2(22.66), sfx: [[6, "thud", 0.5], [16, "thud", 0.5], [26, "thud", 0.5], [36, "thud", 0.6]], el: () => (
    <>
      <Camera dur={132} to={1.05}><Svg bg={<B.PlateBg />}><ChurchState at={0} wallFrom={6} /></Svg></Camera>
      <Caption text={'"A wall of separation"'} at={44} />
    </>) },
  { a: g2(22.66), b: g2(23.08), sfx: [[0, "pop"]], el: (st) => (
    <Camera dur={13} from={1.12} to={1.16} originY="35%"><Svg bg={<B.Studio />}>{Q(st, { wings: "open", gesture: 8 })}<Mark x={1380} y={430} at={0} size={260} /></Svg></Camera>) },
  { a: g2(23.08), b: g2(30.39), sfx: [[0, "whoosh", 0.4], [6, "pop"], [24, "pop"], [70, "scribble", 0.6]], el: () => (
    <>
      <Camera dur={219} to={1.06}><Svg bg={<B.Study sepia />} tex={0.3}>
        <LayerPuppet char="thomas_jefferson" x={700} y={1020} height={580} head="Talking" armR={ARMS.wave} />
        <Proclamation x={1380} y={540} w={420} title="THANKSGIVING" year="Virginia, 1779" at={60} />
      </Svg></Camera>
      <Caption text="1779" at={6} pos="top" size={120} />
      <Caption text="Governor of Virginia" at={24} size={64} color="#ffd96a" />
    </>) },
  { a: g2(30.39), b: g2(32.1), sfx: [[0, "whoosh", 0.4], [18, "thud", 1]], el: () => (
    <>
      <Camera dur={51} to={1.06}><Svg bg={<B.Study />}><Pose c="thomas_jefferson" f="04_Refusing" x={960} y={1060} h={700} /></Svg></Camera>
      <Caption text="As President" at={0} pos="top" />
      <StampCard lines={["REFUSED"]} at={18} x={1380} y={560} rotate={-12} />
    </>) },
  { a: g2(32.1), b: g2(35.62), sfx: [[0, "whoosh", 0.4], [4, "pop"], [60, "thud", 0.7]], el: () => {
    const Fed: React.FC = () => { const f = useCurrentFrame(); return f < 60 ? null : <BigText x={960} y={940} text="FEDERAL: NO" size={90} color="#ff6b5a" />; };
    return (<Camera dur={105} to={1.04}><Svg bg={<B.PlateBg />}>
      <StateGrid labels={["VA ✓", "NY ✓", "MA ✓", "CT ✓", "PA ✓", "NJ ✓", "NH ✓", "MD ✓", "SC ✓", "NC ✓", "GA ✓", "DE ✓", "RI ✓", "VT ✓"]} at={4} color={() => "#d8f0c8"} />
      <BigText x={960} y={210} text="STATES: YES" size={90} at={2} color="#bff07a" />
      <Fed />
    </Svg></Camera>);
  } },
  { a: g2(35.62), b: g2(38.03), sfx: [[0, "whoosh", 0.4], [10, "pop"], [22, "pop"]], el: () => (
    <Camera dur={72} to={1.05}><Svg bg={<B.Chamber />}>
      <Pose c="levi_lincoln_sr" f="02_Three_quarter_neutral" x={260} y={1060} h={480} />
      <Pose c="congressional_delegate" f="02_Three_quarter_neutral" x={1640} y={1060} h={480} flip />
      <LayerPuppet char="thomas_jefferson" x={960} y={1030} height={560} head="Skeptical" />
      <Bubble x={420} y={360} text="ATHEIST!" tx={300} ty={560} at={10} w={380} />
      <Bubble x={1500} y={300} text="ATHEIST!" tx={1620} ty={560} at={22} w={380} />
    </Svg></Camera>) },
  { a: g2(38.03), b: g2(40.42), sfx: [[0, "whoosh", 0.4], [6, "scribble", 0.8]], el: () => (
    <>
      <Camera dur={72} to={1.05}><Svg bg={<B.Study />}>
        <Proclamation x={1250} y={540} w={460} title="EXPLANATION" at={2} />
        <PropImg name="Quill_and_Inkpot" x={1560} y={820} w={200} at={0} />
        <LayerPuppet char="thomas_jefferson" x={560} y={1030} height={560} head="Talking" armR={ARMS.point} />
      </Svg></Camera>
      <Caption text="Drafts an explanation" at={10} />
    </>) },
  { a: g2(40.42), b: g2(46.36), sfx: [[0, "whoosh", 0.4], [8, "pop"], [70, "pop"]], el: () => {
    const Lev: React.FC = () => { const f = useCurrentFrame(); return f < 70
      ? <Pose c="levi_lincoln_sr" f="04_Warning" x={700} y={1040} h={640} />
      : <Pose c="levi_lincoln_sr" f="05_Advising" x={700} y={1040} h={640} />; };
    return (<>
      <Camera dur={178} to={1.05}><Svg bg={<B.Study />}><Lev /><LayerPuppet char="thomas_jefferson" x={1400} y={1030} height={560} flip head="Skeptical" />
        <Bubble x={1060} y={440} text="NEW ENGLAND WON'T LIKE THIS" tx={800} ty={560} at={70} w={900} size={42} /></Svg></Camera>
      <Caption text="Levi Lincoln Sr." at={8} pos="top" />
      <Caption text="Attorney General" at={16} size={56} color="#ffd96a" />
    </>);
  } },
  { a: g2(46.36), b: g2(48.47), sfx: [[0, "paper", 0.8], [30, "pop"]], el: () => (
    <>
      <Camera dur={63} to={1.06}><Svg bg={<B.Study />}><Pose c="thomas_jefferson" f="05_Setting_aside_a_page" x={960} y={1050} h={680} /></Svg></Camera>
      <Caption text="...and kept quiet" at={30} />
    </>) },
  { a: g2(48.47), b: g2(52.96), sfx: [[0, "whoosh", 0.5], [6, "pop"], [24, "pop"]], el: () => (
    <>
      <Camera dur={135} to={1.05}><Svg bg={<B.Study />}><Pose c="james_madison" f="05_Presenting_the_proclamation" x={880} y={1040} h={640} /></Svg></Camera>
      <Caption text="James Madison" at={6} pos="top" />
      <Caption text="1815 · Brought it back" at={24} size={64} color="#ffd96a" />
    </>) },
  { a: g2(52.96), b: g2(56.26), sfx: [[0, "whoosh", 0.4], [4, "pop"]], el: () => (
    <>
      <Camera dur={99} to={1.04}><Svg bg={<B.PlateBg />}>
        <StateGrid labels={["NOV 25", "DEC 4", "NOV 27", "DEC 10", "NOV 18", "NOV 30", "DEC 2", "NOV 29", "—", "NOV 26", "DEC 7", "NOV 24", "NOV 20", "—"]} at={4} />
      </Svg></Camera>
      <Caption text="Up to the states" at={10} pos="top" />
    </>) },
  { a: g2(56.26), b: g2(58.89), sfx: [[0, "whoosh", 0.6], [10, "paper", 0.6], [30, "paper", 0.6], [50, "thud", 0.7]], el: () => {
    const Chaos: React.FC = () => { const f = useCurrentFrame(); return (
      <>{Array.from({ length: 12 }, (_, i) => (
        <CalendarPage key={i} x={((i * 233 + f * (6 + (i % 4) * 3)) % 2300) - 200} y={200 + ((i * 157) % 700) + Math.sin(f / 6 + i) * 30} month={["NOV", "DEC", "OCT"][i % 3]} day={String(18 + (i * 7) % 13)} w={190} rot={f * (i % 2 ? 4 : -3) + i * 30} />
      ))}</>); };
    return (<><Camera dur={79} to={1.06} shake={8}><Svg bg={<B.PlateBg color="#c0392b" />}><Chaos /></Svg></Camera>
      <BigTextOverlay items={[["DIFFERENT STATES.", 0, 960, 300], ["DIFFERENT DAYS.", 22, 960, 560]]} />
      <StampCard lines={["TOTAL", "CHAOS"]} at={50} x={960} y={800} rotate={-6} /></>);
  } },
  { a: g2(58.89), b: g2(63.12), sfx: [[0, "whoosh", 0.5], [40, "paper", 0.6]], el: () => (
    <Camera dur={127} to={1.05}><Svg bg={<B.Studio />}><Pose c="quill" f="08_Presenting_the_envelope" x={960} y={1030} h={680} /></Svg></Camera>) },

  // ===== CHAPTER 3: SARAH JOSEPHA HALE — THE WOMAN WHO WOULD NOT STOP =====
  { a: g2(63.12), b: g2(65.91), sfx: [[0, "thud", 0.8]], el: () => (
    <>
      <Camera dur={84} to={1.05}><Svg bg={<B.EditorOffice />}><LayerPuppet char="sarah_josepha_hale" x={960} y={1020} height={560} head="Determined" /></Svg></Camera>
      <NameCard text="Sarah Josepha Hale" sub="3 · The Woman Who Would Not Stop" />
    </>) },
  { a: g2(65.91), b: g2(70.62), sfx: [[0, "whoosh", 0.4], [20, "pop"], [40, "pop"]], el: () => (
    <>
      <Camera dur={141} to={1.05} panX={-30}><Svg bg={<B.Village />}><LayerPuppet char="sarah_josepha_hale" x={900} y={1030} height={540} armR={ARMS.wave} /></Svg></Camera>
      <Caption text="Sarah Josepha Hale" at={6} pos="top" />
      <Caption text="New Hampshire · 1788" at={40} size={64} color="#ffd96a" />
    </>) },
  { a: g2(70.62), b: g2(74.05), sfx: [[0, "whoosh", 0.4], [56, "scribble", 0.7]], el: () => {
    const P2: React.FC = () => { const f = useCurrentFrame(); return f < 56
      ? <Pose c="sarah_josepha_hale" f="10_Young_Hale_in_mourning" x={960} y={1040} h={640} />
      : <Pose c="sarah_josepha_hale" f="04_Writing_with_a_quill" x={960} y={1040} h={640} />; };
    return (<><Camera dur={103} to={1.05}><Svg bg={<B.EditorOffice />}><P2 /></Svg></Camera>
      <Caption text="Widowed young · 5 children" at={6} pos="top" size={70} />
      <Caption text="She wrote for a living" at={58} /></>);
  } },
  { a: g2(74.05), b: g2(78.62), sfx: [[0, "whoosh", 0.4], [4, "pop"], [60, "pop"]], el: () => (
    <>
      <Camera dur={137} to={1.05}><Svg bg={<B.PlateBg />}><Book x={760} y={560} title={["NORTHWOOD", "", "Mrs. Hale"]} color="#2f4a6b" at={4} art="feast" />
        <PropImg name="Bread_Basket" x={1380} y={700} w={300} at={60} bob /></Svg></Camera>
      <Caption text="Anti-slavery novel" at={20} pos="top" />
      <Caption text="…with a Thanksgiving feast" at={60} size={64} />
    </>) },
  { a: g2(78.62), b: g2(84.0), sfx: [[0, "whoosh", 0.4], [8, "pop"], [70, "pop"]], el: () => (
    <>
      <Camera dur={161} to={1.05}><Svg bg={<B.EditorOffice />}>
        <Pose c="sarah_josepha_hale" f="05_Editing_a_magazine" x={680} y={1040} h={640} />
        <Book x={1400} y={520} title={["GODEY'S", "LADY'S BOOK"]} color="#7d2e4a" at={20} w={340} art="lady" />
      </Svg></Camera>
      <Caption text="Editor" at={8} pos="top" />
      <Caption text="One of the most-read magazines" at={70} size={60} />
    </>) },
  { a: g2(84.0), b: g2(86.15), sfx: [[0, "whoosh", 0.4], [6, "pop"]], el: () => (
    <>
      <Camera dur={65} to={1.06} originY="40%"><Svg bg={<B.EditorOffice />}><LayerPuppet char="sarah_josepha_hale" x={960} y={1030} height={600} head="Determined" armR={ARMS.raise} /></Svg></Camera>
      <Caption text="Education for women" at={6} />
    </>) },
  { a: g2(86.15), b: g2(90.64), sfx: [[0, "whoosh", 0.4], [6, "pop"]], el: () => (
    <Camera dur={135} to={1.05}><Svg bg={<B.PlateBg color="#6aa84f" />}>
      <Book x={960} y={540} title={["MARY HAD", "A LITTLE", "LAMB"]} color="#c0392b" at={6} w={420} art="lamb" />
    </Svg></Camera>) },
  { a: g2(90.64), b: g2(91.62), sfx: [[0, "whoosh", 0.4]], el: () => (
    <><Camera dur={30} from={1.06} to={1.1} originY="35%"><Svg bg={<B.Studio />}><Pose c="quill" f="06_Side_eye" x={960} y={1030} h={680} /></Svg></Camera><Caption text="Yes. That one." at={0} /></>) },
  { a: g2(91.62), b: g2(94.72), sfx: [[0, "whoosh", 0.4], [30, "pop"]], el: () => (
    <>
      <Camera dur={93} to={1.05}><Svg bg={<B.EditorOffice />}><LayerPuppet char="sarah_josepha_hale" x={760} y={1030} height={580} head="Triumphant" armR={ARMS.wave} />
        <PropImg name="Bread_Basket" x={1420} y={760} w={320} at={20} bob /></Svg></Camera>
      <Caption text="Her passion project" at={6} pos="top" />
      <Caption text="Thanksgiving" at={30} size={110} color="#ffd96a" />
    </>) },
  { a: g2(94.72), b: g2(97.54), sfx: [[0, "whoosh", 0.4], [6, "pop"]], el: () => (
    <>
      <Camera dur={85} to={1.05}><Svg bg={<B.PlateBg />}><CalendarPage x={960} y={560} month="NOVEMBER" day="1" sub="ONE NATIONAL DAY" w={420} /></Svg></Camera>
      <Caption text="For the whole country" at={20} />
    </>) },
  { a: g2(97.54), b: g2(104.1), sfx: [[0, "whoosh", 0.4], [10, "pop"], [24, "pop"], [38, "pop"], [52, "pop"], [70, "pop"]], el: () => (
    <>
      <Camera dur={197} to={1.04}><Svg bg={<B.LincolnOffice />}>
        <Pose c="zachary_taylor" f="04_Considering_the_petition" x={260} y={1040} h={500} at={10} />
        <Pose c="millard_fillmore" f="04_Considering_the_petition" x={640} y={1040} h={500} at={24} />
        <Pose c="franklin_pierce" f="04_Considering_the_petition" x={1020} y={1040} h={500} at={38} />
        <Pose c="james_buchanan" f="04_Considering_the_petition" x={1400} y={1040} h={500} at={52} />
        <Pose c="abraham_lincoln" f="02_Three_quarter_neutral" x={1720} y={1040} h={520} at={66} flip />
      </Svg></Camera>
      <Caption text="1846 → 1863" at={70} pos="top" />
      <Caption text="Congress + 5 presidents" at={90} size={60} color="#ffd96a" />
    </>) },
  { a: g2(104.1), b: g2(106.08), sfx: [[0, "scribble", 0.7], [10, "paper", 0.5], [30, "paper", 0.5]], el: () => {
    const Stack: React.FC = () => { const f = useCurrentFrame(); return <LetterStack x={1420} y={900} count={Math.min(14, 1 + Math.floor(f / 4))} />; };
    return (<><Camera dur={60} to={1.05}><Svg bg={<B.EditorOffice />}><Pose c="sarah_josepha_hale" f="06_Holding_letters" x={700} y={1040} h={640} /><Stack /></Svg></Camera>
      <Caption text="17 years" at={0} pos="top" size={110} /></>);
  } },
  { a: g2(106.08), b: g2(108.86), sfx: [[4, "pop"], [16, "pop"], [28, "pop"], [40, "pop"]], el: () => (
    <Camera dur={84} to={1.05}><Svg bg={<B.LincolnOffice />}>
      {["zachary_taylor", "millard_fillmore", "franklin_pierce", "james_buchanan"].map((c, i) => (
        <g key={c}>
          <LayerPuppet char={c} x={300 + i * 440} y={1040} height={480} />
          <Bubble x={300 + i * 440} y={330} text="HMM." tx={300 + i * 440} ty={520} at={4 + i * 12} w={260} />
        </g>
      ))}
    </Svg></Camera>) },
  { a: g2(108.86), b: g2(111.66), sfx: [[0, "thud", 0.9]], el: () => (
    <>
      <Camera dur={84} to={1.04} shake={4}><Svg bg={<SplitWar at={4} />}>{null}</Svg></Camera>
      <Caption text="The Civil War" at={30} />
    </>) },
  { a: g2(111.66), b: g2(118.76), sfx: [[0, "whoosh", 0.4], [8, "pop"], [10, "scribble", 0.7], [120, "whoosh", 0.7], [140, "paper", 0.7]], el: () => {
    const Fly: React.FC = () => { const f = useCurrentFrame();
      const t = interpolate(f, [120, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      return f < 120 ? null : <PropImg name="Sealed_Letter" x={interpolate(t, [0, 1], [760, 1400])} y={620 - Math.sin(t * Math.PI) * 260} w={200} rot={t * 360} />; };
    const Lin: React.FC = () => { const f = useCurrentFrame(); return f < 150 ? null : <Pose c="abraham_lincoln" f="04_Reading_Hale_s_letter" x={1450} y={1040} h={620} />; };
    return (<>
      <Camera dur={213} to={1.05}><Svg bg={<B.LincolnOffice />}><Pose c="sarah_josepha_hale" f="04_Writing_with_a_quill" x={600} y={1040} h={620} /><Fly /><Lin /></Svg></Camera>
      <Caption text="September 28, 1863" at={8} pos="top" />
      <Caption text="To: Abraham Lincoln" at={150} size={64} color="#ffd96a" />
    </>);
  } },
  { a: g2(118.76), b: g2(123.68), sfx: [[0, "paper", 0.7]], el: () => (
    <Camera dur={148} to={1.06}><Svg bg={<B.PlateBg color="#2a5d8f" />}>
      <Proclamation x={960} y={545} w={900} title="Dear Mr. President," year="Sept. 28, 1863" lines={["", "…National recognition", "and authoritive", "fixation…", "", "— S. J. Hale"]} />
    </Svg></Camera>) },
  { a: g2(123.68), b: g2(125.46), sfx: [[0, "whoosh", 0.4], [10, "thud", 1]], el: () => (
    <>
      <Camera dur={53} to={1.06}><Svg bg={<B.LincolnOffice />}><Pose c="abraham_lincoln" f="05_Approving_Hale_s_request" x={800} y={1040} h={660} /></Svg></Camera>
      <StampCard lines={["YES", "(IN 5 DAYS)"]} at={10} x={1400} y={380} rotate={-9} ink="#1f8a3a" />
    </>) },
  { a: g2(125.46), b: 187.6, sfx: [[0, "whoosh", 0.4], [4, "pop"], [40, "pop"], [90, "boing", 0.5]], el: () => {
    const Head: React.FC = () => { const f = useCurrentFrame(); return <LayerPuppet char="sarah_josepha_hale" x={960} y={1050} height={560} head={f < 80 ? "Tired" : "Skeptical"} armL={ARMS.hips} armR={ARMS.hips} />; };
    return (<Camera dur={185} to={1.05}><Svg bg={<B.EditorOffice />}>
      <Scoreboard x={420} y={330} label="YEARS OF NO" value="17" at={4} />
      <Scoreboard x={1500} y={330} label="DAYS OF YES" value="5" at={40} />
      <Head />
    </Svg></Camera>);
  } },
];

/** Several big lines of text popping in sequence (frame offsets relative to the shot). */
const BigTextOverlay: React.FC<{ items: [string, number, number, number][] }> = ({ items }) => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    {items.map(([t, at, x, y]) => <BigText key={t} text={t} at={at} x={x} y={y} size={110} />)}
  </svg>
);

export const Thanksgiving: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SHOTS.map((s, i) => {
      const from = Math.round(s.a * FPS), to = Math.round(s.b * FPS);
      return (
        <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)}>
          {s.el(s.a)}
          {(s.sfx ?? []).map(([at, name, vol], j) => (
            <Sequence key={j} from={at} durationInFrames={60}><Audio src={staticFile(`thanksgiving/sfx/${name}.wav`)} volume={vol ?? 0.55} /></Sequence>
          ))}
        </Sequence>
      );
    })}
    {/* voiceover: chapter 1 (cold open already trimmed off), then chapters 2-3 */}
    <Audio src={staticFile("thanksgiving/vo/ch1.mp3")} />
    <Sequence from={Math.round(O2 * FPS)}><Audio src={staticFile("thanksgiving/vo/ch2_ch3.mp3")} /></Sequence>
    {/* music bed, ducked well under the VO */}
    <Audio src={staticFile("thanksgiving/sfx/music_bed.mp3")} volume={0.09} />
  </AbsoluteFill>
);
