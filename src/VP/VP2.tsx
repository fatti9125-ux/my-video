import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Board, Episode, epDuration, makeAlign, Shot, Steps, Svg, Swap } from "../Thanksgiving3/Episode";
import { Cam, Cap, Card, QMarks, Quill, Speed, Stamp } from "../Thanksgiving3/Kit";
import { Fling, Slide } from "./Pilot";
import { LampGrade, MournPortrait } from "./PilotBg";
import { Act, Bubble, HeadIcon, Big, Splat, Sulk, USMap, V } from "./VKit";
import {
  BenchFG, Blast, BostonWall, BPStationExt, BPWaitingRoom, Brownstone1881, BundleInsert, CabinetRoom1841, CabinetTableFG,
  CalendarInsert, CapitolEast1865, CivilRightsBill, ClauseInsert, Crowd, DaisDeskFG, FillmoreLibrary, HarrisonFG, HarrisonRoom,
  HotelParlor1841, HouseHall1868, IndianQueenExt, JohnsonOffice, KirkwoodParlor, LibraryDeskFG, OfficeTableFG, OldSenate1850,
  ParlorTableFG, Print, Senate1859, Senate1859FG, SenateDesksFG, TaylorRoom, VetoDoc, WhigConvention, WhigHall, WhiteHouse1841,
} from "./bg/Part2";
import DATA from "./ep/vp2.json";

const R = 4; // listener reaction delay (frames), spec §2.2

/**
 * Part 2 (VO vp2.mp3): Tyler's precedent, Fillmore and the Compromise of 1850, Andrew Johnson's
 * impeachment, and Garfield's shooting that makes Arthur president. Rebuilt in the pilot style
 * (production/REBUILD_BRIEF.md): one painted plate per real place (src/VP/bg/Part2.tsx), foreground
 * occluders, inserts, in-scene Quill, captions / name cards / stamps instead of sticky labels,
 * one continuous camera move per shot, 1-frame swaps on the motivating word (+4 f listener).
 */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const VP2_DURATION = epDuration(D);

/** Who later took over the same way Tyler did (death or resignation). */
const PRECEDENT = ["millard_fillmore", "andrew_johnson", "chester_arthur", "theodore_roosevelt", "calvin_coolidge", "harry_truman", "lyndon_johnson", "gerald_ford"];

/** Harrison's bedroom: the candle is snuffed on "died" (the room drops from the warm pool to blue night). */
const Deathbed: React.FC<{ outAt: number }> = ({ outAt }) => {
  const f = useCurrentFrame();
  const lit = interpolate(f, [outAt, outAt + 3], [1, 0.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Svg bg={<HarrisonRoom lit={f < outAt ? 1 : 0} />}>
      <V c="william_henry_harrison" p={10} x={760} y={990} h={540} />
      <HarrisonFG />
      {f >= outAt && f < outAt + 40 && [0, 1].map((i) => { const lf = f - outAt - i * 8; if (lf < 0) return null; return <path key={i} d={`M 1472 ${630 - lf * 2} q 18 -24 0 -48 q -18 -24 0 -48`} stroke="#cfcfcf" strokeWidth={7} fill="none" opacity={Math.max(0, 0.6 - lf / 60)} />; })}
      <LampGrade lit={lit} cx={1472} cy={600} />
    </Svg>
  );
};

/** "Vice President, acting President": the cabinet's note slid down the table to Tyler. */
const ActingNote: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f - at, [0, 6], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <g transform={`translate(${520 + 330 * p} ${930 - 120 * p}) rotate(${-6 + 4 * p}) scale(${1.25 - 0.35 * p})`}>
      <rect x={-130} y={-50} width={260} height={100} fill="#f6efd9" stroke="#2b2119" strokeWidth={4} />
      <text x={0} y={-8} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontStyle="italic" fontWeight={700} fontSize={26} fill="#2e1e10">Vice President,</text>
      <text x={0} y={28} textAnchor="middle" fontFamily="DejaVu Serif, serif" fontStyle="italic" fontWeight={700} fontSize={26} fill="#2e1e10">acting President</text>
    </g>
  );
};

export const SHOTS: Shot[] = [
  // 0 Harrison died after thirty-one days in office.
  { a: ln(0), el: (t, dur) => (<>
    <Steps s={[
      [0, <Cam dur={dur} from={1.0} to={1.06} ox="45%" oy="55%"><Deathbed outAt={t(wd(0, "died"))} /></Cam>],
      [t(wd(0, "thirty")), <Cam dur={dur} from={1.0} to={1.08} ox="35%" oy="70%"><Svg bg={<CalendarInsert smokeAt={0} />}>
        <V c="william_henry_harrison" p={38} x={760} y={900} h={560} />
      </Svg></Cam>],
    ]} />
    <Cap text="April 4, 1841" until={t(wd(0, "thirty"))} />
    <Stamp lines={["THE SHORTEST", "PRESIDENCY"]} at={t(wd(0, "days"))} x={1360} y={300} rot={-8} variant="dark" />
  </>) },
  // 1 Nobody had dealt with a dead president before, and some argued that Tyler was only supposed to exercise presidential powers temporarily.
  { a: ln(1), el: (t, dur) => {
    const and = t(wd(1, "and"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.1} ox="30%" oy="66%"><Svg bg={<ClauseInsert circleAt={t(wd(1, "dealt"))} />}>
          <QMarks x={1150} y={900} at={t(wd(1, "dead")) + 4} spread={150} />
        </Svg></Cam>],
        [and, <Cam dur={dur} from={1.0} to={1.06} oy="45%"><Svg bg={<CabinetRoom1841 />}>
          <Act c="john_tyler" x={960} y={1010} h={560} e={[[0, 0], [t(wd(1, "argued")) + R, 3], [t(wd(1, "temporarily")) + R, 2]]} vein={t(wd(1, "temporarily")) + R} stress />
          <CabinetTableFG />
          <ActingNote at={t(wd(1, "only"))} />
        </Svg></Cam>],
      ]} />
      <Cap text="The Constitution, Article II" until={and} />
    </>);
  } },
  // 2 Tyler insisted he had become president outright and took a new oath.
  { a: ln(2), el: (t, dur) => {
    const he = t(wd(2, "he")), took = t(wd(2, "took"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.04} oy="60%"><Svg bg={<IndianQueenExt />} /></Cam>],
        [he, <Cam dur={dur} from={1.0} to={1.05} ox="45%" oy="50%" punch={{ at: t(wd(2, "oath")), frames: 6, to: 1.12, ox: "45%", oy: "45%" }}><Svg bg={<HotelParlor1841 />}>
          <Swap t={took} a={<V c="john_tyler" p={9} x={780} y={1010} h={600} />} b={<V c="john_tyler" p={5} x={780} y={1010} h={600} />} />
          <ParlorTableFG x={1180} />
          <Quill pose="deadpan_wings_folded" x={1560} y={1010} h={340} />
        </Svg></Cam>],
      ]} />
      <Cap text="Brown's Indian Queen Hotel, Washington" size={64} until={he} />
      <Cap text="April 6, 1841" at={took} />
    </>);
  } },
  // 3 His decision established the precedent later vice presidents followed.
  { a: ln(3), el: (t, dur) => (
    <Cam dur={dur} from={1.0} to={1.03}>
      <Svg bg={<HotelParlor1841 />} dim={0.62}>
        <Act c="john_tyler" x={420} y={1010} h={600} e={[[0, 0], [t(wd(3, "precedent")) + R, 5]]} stress />
        <Big x={1240} y={210} text="THE TYLER PRECEDENT" size={80} at={t(wd(3, "precedent"))} />
        {PRECEDENT.map((c, i) => <HeadIcon key={c} c={c} e={0} x={870 + (i % 4) * 250} y={i < 4 ? 450 : 780} size={190} at={t(wd(3, "later")) + i * 4} ring="#f4f1ea" />)}
      </Svg>
    </Cam>
  ), sfx: [] },
  // 4 His own party soon regretted having him.
  { a: ln(4), el: (t, dur) => {
    const rg = t(wd(4, "regretted"));
    return (
      <Cam dur={dur} from={1.0} to={1.06} oy="40%">
        <Svg bg={<WhigHall tornAt={rg} />}>
          <Act c="john_tyler" x={960} y={790} h={440} e={[[0, 5], [rg + R, 3]]} sweat={rg + R} />
          <Swap t={rg + R} a={<Crowd x0={0} x1={1920} y={1060} n={8} s={0.95} hats={0.7} seed={3} cheerAt={0} />} b={<Crowd x0={0} x1={1920} y={1060} n={8} s={0.95} hats={0.7} seed={3} />} />
        </Svg>
      </Cam>
    );
  } },
  // 5 Tyler vetoed its banking plans, nearly his entire cabinet resigned, and the Whigs expelled him.
  { a: ln(5), el: (t, dur) => {
    const rs = t(wd(5, "resigned")), ex = t(wd(5, "expelled"));
    const gone = [99999, rs, rs + 4, rs + 8, rs + 12];
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.08} oy="55%"><Svg bg={<VetoDoc writeAt={t(wd(5, "vetoed"))} />} /></Cam>],
        [t(wd(5, "nearly")), <Cam dur={dur} from={1.0} to={1.06} oy="45%"><Svg bg={<CabinetRoom1841 />}>
          <Act c="john_tyler" x={960} y={1010} h={560} e={[[0, 2], [rs + R, 3]]} sweat={rs + R} />
          <CabinetTableFG goneAt={gone} letterAt={gone} />
        </Svg></Cam>],
        [t(wd(5, "whigs")), <Cam dur={dur} from={1.0} to={1.05} oy="40%"><Svg bg={<WhigHall tornAt={-100} />}>
          <Fling at={ex + 2} dx={-1500}><Act c="john_tyler" x={960} y={790} h={440} e={2} vein={0} /></Fling>
          <Speed x={800} y={560} at={ex + 4} frames={4} dir={-1} />
          <Crowd x0={0} x1={1920} y={1060} n={8} s={0.95} hats={0.7} seed={3} shakeAt={0} />
        </Svg></Cam>],
      ]} />
      <Cap text="The national bank bill, 1841" until={t(wd(5, "nearly"))} />
      <Stamp lines={["EXPELLED"]} at={ex} x={1380} y={520} rot={-10} variant="dark" />
    </>);
  } },
  // 6 He kept the presidency and lost the party that put him there.
  { a: ln(6), el: (t, dur) => {
    const lost = t(wd(6, "lost"));
    return (
      <Cam dur={dur} from={1.0} to={1.05} oy="60%">
        <Svg bg={<WhiteHouse1841 />}>
          <Act c="john_tyler" x={760} y={1010} h={580} e={[[0, 5], [lost + R, 4]]} sweat={lost + R} stress />
          <Crowd x0={1150} x1={1900} y={1110} n={4} s={0.95} hats={0.8} seed={9} goneAt={lost} goneDx={1100} />
          <Quill pose="deadpan_wings_folded" x={1500} y={1030} h={330} at={t(wd(6, "there"))} enter={{ from: "right", frames: 8, dist: 600 }} />
        </Svg>
      </Cam>
    );
  } },
  // 7 Millard Fillmore got his turn when Zachary Taylor died in 1850.
  { a: ln(7), el: (t, dur) => {
    const got = t(wd(7, "got")), zt = t(wd(7, "zachary"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.06} oy="55%"><Svg bg={<OldSenate1850 />}>
          <Act c="millard_fillmore" x={960} y={770} h={380} at={got} e={[[0, 0], [t(wd(7, "turn")) + R, 5]]} />
          <DaisDeskFG />
          <SenateDesksFG />
        </Svg></Cam>],
        [zt, <Cam dur={dur} from={1.0} to={1.06} ox="45%" oy="60%"><Svg bg={<TaylorRoom />}>
          <V c="zachary_taylor" p={10} x={900} y={1000} h={560} />
        </Svg></Cam>],
      ]} />
      <Card text="Millard Fillmore" sub="12th Vice President · 13th President" until={got} />
      <Cap text="Zachary Taylor" at={zt} until={t(wd(7, "died"))} />
      <Cap text="July 9, 1850" at={t(wd(7, "died"))} />
    </>);
  } },
  // 8 The country was fighting over slavery and the territories taken from Mexico.
  { a: ln(8), el: (t, dur) => {
    const fi = t(wd(8, "fighting")), tr = t(wd(8, "territories"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.08} to={1.0} oy="60%"><Svg bg={<OldSenate1850 />}>
          <Swap t={fi + R} a={<Act c="millard_fillmore" x={960} y={770} h={380} e={0} />} b={<V c="millard_fillmore" p={8} x={960} y={770} h={380} />} />
          <DaisDeskFG />
          <SenateDesksFG shakeAt={fi} />
        </Svg></Cam>],
        [tr, <Cam dur={dur} from={1.0} to={1.06} ox="30%" oy="60%"><Svg bg={<USMap fills={[["cession", "#e0703a", tr]]} />} /></Cam>],
      ]} />
      <Cap text="The Senate, 1850" until={tr} />
      <Cap text="Mexican Cession · 1848" at={t(wd(8, "taken"))} />
    </>);
  } },
  // 9 Fillmore backed the Compromise of 1850 and signed its separate measures into law.
  { a: ln(9), el: (t, dur) => {
    const sg = t(wd(9, "signed")), sp = t(wd(9, "separate"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.05} oy="55%">
        <Svg bg={<FillmoreLibrary />}>
          <Swap t={sg} a={<Act c="millard_fillmore" x={960} y={1010} h={600} e={[[0, 0], [t(wd(9, "backed")) + R, 5]]} stress />} b={<V c="millard_fillmore" p={7} x={960} y={1040} h={520} />} />
          <LibraryDeskFG top={945} stackAt={[sp, sp + 4, sp + 8, sp + 12, sp + 16]} />
          <Quill pose="speaking_facing_right" x={300} y={1020} h={360} />
        </Svg>
      </Cam>
      <Cap text="The Compromise of 1850" pos="top" until={t(wd(9, "and"))} />
      <Cap text="Five separate laws" pos="top" at={t(wd(9, "measures"))} />
    </>);
  } },
  // 10 California entered as a free state, but the package also included a stronger Fugitive Slave Act, helping enslavers seize people who had escaped, even in free states.
  { a: ln(10), el: (t, dur) => {
    const pk = t(wd(10, "package")), hl = t(wd(10, "helping")), ev = t(wd(10, "even"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.04} to={1.12} ox="15%" oy="55%"><Svg bg={<USMap fills={[["california", "#5fae5a", t(wd(10, "free"))]]} pins={[{ lon: -121.5, lat: 38.6, at: 0 }]} />} /></Cam>],
        [pk, <Cam dur={dur} from={1.0} to={1.08} oy="50%"><Svg bg={<BundleInsert ripAt={99999} />} /></Cam>],
        [hl, <Print file="fugitive_law_1850.jpg" dur={ev - hl} focus={[55, 40]} />],
        [ev, <Cam dur={dur} from={1.0} to={1.05} ox="70%"><Svg bg={<USMap fills={[["free", "#5fae5a", 0], ["california", "#5fae5a", 0], ["free", "#c0392b", t(wd(10, "free", 1)) - ev], ["california", "#c0392b", t(wd(10, "free", 1)) - ev]]} />} /></Cam>],
      ]} />
      <Cap text="California, 1850" until={t(wd(10, "free"))} />
      <Cap text="Admitted as a free state" at={t(wd(10, "free"))} until={pk} />
      <Cap text="The Fugitive Slave Act" at={t(wd(10, "fugitive"))} until={hl} />
      <Cap text="Even in free states" at={ev} />
    </>);
  } },
  // 11 The supposed settlement deepened anger over slavery.
  { a: ln(11), el: (t, dur) => {
    const an = t(wd(11, "anger"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.04} to={1.1} oy="50%"><Svg bg={<BundleInsert ripAt={t(wd(11, "deepened"))} />} /></Cam>],
        [an, <Cam dur={dur} from={1.0} to={1.06} ox="50%" oy="45%"><Svg bg={<BostonWall />} /></Cam>],
      ]} />
      <Cap text="Boston, April 1851" at={an} />
    </>);
  }, sfx: [[Math.round((wd(11, "deepened") - ln(11)) * 30), "paper", 0.15]] },
  // 12 Fillmore finished Taylor's term, but his party picked someone else for the next election.
  { a: ln(12), el: (t, dur) => {
    const pt = t(wd(12, "party")), so = t(wd(12, "someone"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.04} oy="55%"><Svg bg={<FillmoreLibrary />}>
          <Act c="millard_fillmore" x={960} y={1010} h={600} e={[[0, 0], [t(wd(12, "term")) + R, 5]]} stress />
          <LibraryDeskFG top={945} />
        </Svg></Cam>],
        [pt, <Cam dur={dur} from={1.0} to={1.05} oy="50%"><Svg bg={<WhigConvention bannerAt={so} />}>
          <Sulk at={so + R}><Swap t={so + R} a={<Act c="millard_fillmore" x={1640} y={1010} h={560} e={0} />} b={<V c="millard_fillmore" p={10} x={1640} y={1010} h={560} />} /></Sulk>
          <Crowd x0={0} x1={1380} y={1080} n={7} s={0.95} hats={0.8} seed={12} cheerAt={so + 4} />
        </Svg></Cam>],
      ]} />
      <Cap text="Whig Convention, Baltimore, 1852" size={66} at={pt} until={so + 30} />
      <Cap text="Nominee: Winfield Scott" size={66} at={so + 30} />
    </>);
  }, sfx: [[Math.round((wd(12, "someone") - ln(12)) * 30) + 6, "cheer", 0.08]] },
  // 13 Then came Andrew Johnson, whose start as vice president was already a disaster.
  { a: ln(13), el: (t, dur) => {
    const wh = t(wd(13, "whose")), ds = t(wd(13, "disaster"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.06} oy="55%">
        <Svg bg={<CapitolEast1865 />}>
          <Act c="andrew_johnson" x={700} y={1020} h={580} at={wh} enter={{ from: "left", frames: 10, dist: 700 }} e={[[0, 0], [ds + R, 3]]} sweat={ds + R} />
          <Quill pose="nervous_side_glance" x={1700} y={1040} h={340} at={t(wd(13, "already"))} />
        </Svg>
      </Cam>
      <Card text="Andrew Johnson" sub="16th Vice President · 17th President" until={wh} />
      <Cap text="The Capitol, March 4, 1865" at={wh} />
    </>);
  } },
  // 14 At his inauguration in March 1865, Johnson had been drinking and delivered a rambling speech while Lincoln watched.
  { a: ln(14), el: (t, dur) => {
    const dr = t(wd(14, "drinking")), rm = t(wd(14, "rambling")), wa = t(wd(14, "watched"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.05} oy="60%">
        <Svg bg={<Senate1859 />}>
          <Steps s={[
            [0, <Act c="andrew_johnson" x={640} y={1000} h={560} e={5} stress />],
            [dr, <V c="andrew_johnson" p={6} x={640} y={1000} h={560} />],
            [rm, <Act c="andrew_johnson" x={640} y={1000} h={560} e={2} talk gesture={12} stress />],
          ]} />
          <Swap t={wa + R} a={<V c="abraham_lincoln" p={6} x={1380} y={1040} h={620} />} b={<V c="abraham_lincoln" p={7} x={1380} y={1040} h={620} />} />
          <Senate1859FG hide={[2]} />
          <Bubble x={900} y={220} w={560} text="I'M A PLEBEIAN!" at={rm} tail={[720, 400]} size={50} />
        </Svg>
      </Cam>
      <Cap text="Senate Chamber, March 4, 1865" size={66} until={dr} />
      <Cap text="Abraham Lincoln" at={t(wd(14, "lincoln"))} />
    </>);
  } },
  // 15 About six weeks later, Lincoln was dead, and that same man was president.
  { a: ln(15), el: (t, dur) => {
    const th = t(wd(15, "that"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.08}><Svg bg={<MournPortrait c="abraham_lincoln" drapeAt={t(wd(15, "dead"))} />} /></Cam>],
        [th, <Cam dur={dur} from={1.0} to={1.06} ox="45%" oy="50%"><Svg bg={<KirkwoodParlor />}>
          <V c="andrew_johnson" p={8} x={820} y={1010} h={600} />
          <ParlorTableFG x={1250} />
        </Svg></Cam>],
      ]} />
      <Cap text="April 15, 1865" until={th} />
      <Cap text="Kirkwood House, Washington" at={th} />
    </>);
  } },
  // 16 Johnson clashed with Congress over Reconstruction and vetoed a civil rights bill.
  { a: ln(16), el: (t, dur) => {
    const cl = t(wd(16, "clashed")), cg = t(wd(16, "congress")), vt = t(wd(16, "vetoed")), cv = t(wd(16, "civil"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.05} oy="50%"><Svg bg={<JohnsonOffice />}>
          <Swap t={vt} a={<Act c="andrew_johnson" x={960} y={1010} h={600} e={[[0, 0], [cl + R, 2]]} vein={cl + R} gesture={10} stress />} b={<V c="andrew_johnson" p={9} x={960} y={1010} h={600} />} />
          <OfficeTableFG billsAt={[cg, cg + 5, cg + 10]} />
        </Svg></Cam>],
        [cv, <Cam dur={dur} from={1.0} to={1.04} punch={{ at: cv + 6, frames: 4, to: 1.06 }}><Svg bg={<CivilRightsBill />}>
          <V c="shared_props_early" p={10} x={1250} y={1010} h={460} drop={{ frames: 6, height: 900 }} />
        </Svg></Cam>],
      ]} />
      <Cap text="The White House, 1866" until={cv} />
    </>);
  } },
  // 17 The fight eventually produced the first presidential impeachment.
  { a: ln(17), el: (t, dur) => {
    const fs = t(wd(17, "first")), im = t(wd(17, "impeachment"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.05} oy="50%"><Svg bg={<HouseHall1868 votedAt={t(wd(17, "produced"))} />} /></Cam>],
        [fs, <Cam dur={dur} from={1.22} to={1.26} ox="30%" oy="42%"><Svg bg={<JohnsonOffice />}>
          <Act c="andrew_johnson" x={640} y={1010} h={600} e={[[0, 2], [im + R, 3]]} sweat={im + R} />
          <OfficeTableFG />
        </Svg></Cam>],
      ]} />
      <Cap text="House of Representatives, Feb. 24, 1868" size={60} until={fs} />
      <Stamp lines={["IMPEACHED"]} at={im} x={1360} y={330} rot={-9} variant="dark" />
    </>);
  } },
  // 18 At his Senate trial, the votes for conviction fell one short of the number needed to remove him.
  { a: ln(18), el: (t, dur) => {
    const vo = t(wd(18, "votes"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.05} oy="55%">
        <Svg bg={<Senate1859 trial />}>
          <Senate1859FG trial hide={[2, 3]} />
          <Quill pose="scoreboard_facing_left" x={1560} y={1020} h={440} at={vo} enter={{ from: "right", frames: 8, dist: 600 }}>
            <Board pose="scoreboard_facing_left" top="NEEDED: 36" big="35" />
          </Quill>
        </Svg>
      </Cam>
      <Cap text="Senate trial, May 1868" pos="top" until={vo} />
      <Cap text="One vote short" pos="top" at={t(wd(18, "short"))} />
    </>);
  } },
  // 19 His presidency survived by a single vote.
  { a: ln(19), el: (t, dur) => {
    const sv = t(wd(19, "survived"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.05} oy="50%">
        <Svg bg={<JohnsonOffice />}>
          <Swap t={sv + R} a={<V c="andrew_johnson" p={10} x={960} y={1010} h={600} />} b={<V c="andrew_johnson" p={11} x={960} y={1010} h={600} />} />
          <OfficeTableFG />
        </Svg>
      </Cam>
      <Cap text="Acquitted, May 16, 1868" at={t(wd(19, "single"))} />
    </>);
  }, sfx: [[Math.round((wd(19, "survived") - ln(19)) * 30) + R, "ding", 0.08]] },
  // 20 Chester A. Arthur's promotion came with a deeply uncomfortable association.
  { a: ln(20), el: (t, dur) => {
    const cm = t(wd(20, "came")), as = t(wd(20, "association"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.05} oy="55%">
        <Svg bg={<Brownstone1881 />}>
          <Slide at={as + R} frames={4} dx={130}>
            <Act c="chester_arthur" x={1180} y={1010} h={560} at={cm} enter={{ from: "right", frames: 9, dist: 800 }} e={[[0, 0], [t(wd(20, "uncomfortable")) + R, 4], [as + R, 3]]} sweat={as + R} />
          </Slide>
          <Act c="garfield_attacker" x={820} y={1010} h={540} at={as} enter={{ from: "left", frames: 6, dist: 700 }} e={5} />
        </Svg>
      </Cam>
      <Card text="Chester A. Arthur" sub="20th Vice President · 21st President" until={cm} />
      <Cap text="Charles Guiteau" at={as + 6} />
    </>);
  } },
  // 21 When James Garfield was shot in 1881, the gunman declared his support for Arthur's Republican faction and announced that Arthur would be president.
  { a: ln(21), el: (t, dur) => {
    const ga = t(wd(21, "garfield")), sh = t(wd(21, "shot")), gm = t(wd(21, "gunman")), dc = t(wd(21, "declared")), an = t(wd(21, "announced")), ar = t(wd(21, "arthur", 1));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.04} oy="55%"><Svg bg={<BPStationExt />} /></Cam>],
        [ga, <Cam dur={dur} from={1.0} to={1.04} punch={{ at: sh, frames: 5, to: 1.12, ox: "50%", oy: "45%" }}><Svg bg={<BPWaitingRoom />}>
          <Swap t={sh} a={<Act c="james_garfield" x={820} y={1010} h={600} walk={1} e={0} />} b={<V c="james_garfield" p={7} x={900} y={1010} h={600} />} />
          <Blast x={40} y={640} at={sh} />
          <Splat x={830} y={620} at={sh + 1} r={90} />
          <Quill pose="startled_recoil" x={1420} y={1030} h={360} at={sh + R} />
          <BenchFG />
        </Svg></Cam>],
        [gm, <Cam dur={dur} from={1.08} to={1.12} ox="30%" oy="55%"><Svg bg={<BPWaitingRoom />}>
          <Act c="garfield_attacker" x={620} y={1010} h={620} e={[[0, 2], [an, 5]]} talk={[dc, 9999]} gesture={14} stress />
          <Swap t={an} a={<Bubble x={900} y={210} w={760} text="I AM A STALWART OF THE STALWARTS!" at={dc} tail={[690, 340]} size={46} />}
            b={<Bubble x={900} y={210} w={760} text="ARTHUR IS PRESIDENT NOW!" at={an} tail={[690, 340]} shout size={50} />} />
        </Svg></Cam>],
        [ar, <Cam dur={dur} from={1.05} to={1.1} ox="60%" oy="50%"><Svg bg={<Brownstone1881 />}>
          <Act c="chester_arthur" x={1180} y={1010} h={560} e={[[0, 0], [R, 3]]} sweat={t(wd(21, "president")) + R} />
        </Svg></Cam>],
      ]} />
      <Cap text="Baltimore & Potomac Station" size={66} until={t(wd(21, "shot"))} />
      <Cap text="July 2, 1881" at={sh} until={gm} />
      <Cap text="Charles Guiteau" at={gm} until={dc} />
    </>);
  }, sfx: [[Math.round((wd(21, "shot") - ln(21)) * 30), "gunburst", 0.12]] },
];

export const VicePresidents2: React.FC<{ noAudio?: boolean }> = ({ noAudio }) => <Episode data={D} shots={SHOTS} noAudio={noAudio} />;
