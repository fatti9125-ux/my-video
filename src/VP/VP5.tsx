import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Board, Episode, epDuration, makeAlign, Shot, Steps, Svg, Swap } from "../Thanksgiving3/Episode";
import { Cam, Cap, Card, Quill, Speed, Stamp } from "../Thanksgiving3/Kit";
import { MONTSERRAT } from "../fonts";
import { Fling, Pop } from "./Pilot";
import { LampGrade, OathParlor, OathTable, RockerFG } from "./PilotBg";
import { Act, HeadIcon, INK, Splat, Sulk, V, VoteBoard } from "./VKit";
import {
  AF1Night, AF1Stateroom, BuntingRail, CampaignButton, CapitolWest2021, CarsFG, CrowdBacks, DenChair, DisastersWing,
  DriveInRally, FlagField, Gallery, GalleryBench, HotelParlor1841, IronFence, NewsInsert, OuterOval, OvalBiden, OvalObama,
  RallyPodium, ResoluteDesk, slotXY, SouthLawn, SpringfieldCapitol, TVCamera, WhigRoom, WhigTable, WhiteHouse1841,
  WilmingtonDen, WilmingtonStation, YardSign,
} from "./bg/Part5";
import DATA from "./ep/vp5.json";

/**
 * Part 5 (VO vp5.mp3): Joe Biden, then the recap of all fifteen (eight deaths, one resignation, six elections),
 * the Tyler precedent, and the outro into the "political disasters" wing. Rebuilt in the pilot style
 * (production/REBUILD_BRIEF.md): one painted plate per real place (src/VP/bg/Part5.tsx), foreground occluders,
 * varied shot sizes, in-scene Quill, captions / name cards / stamps instead of sticky labels.
 */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const VP5_DURATION = epDuration(D);
const R = 4;
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(1)}%`;
const LAMP: [number, number] = [1070, 640];          // the pilot's oath-parlor lamp (exact earlier framing)

const DIED = ["john_tyler", "millard_fillmore", "andrew_johnson", "chester_arthur", "theodore_roosevelt", "calvin_coolidge", "harry_truman", "lyndon_johnson"];
const ELECTED = ["john_adams", "thomas_jefferson", "martin_van_buren", "richard_nixon", "george_hw_bush", "joe_biden"];
const all = (cs: string[], e: [number, 0 | 1 | 2 | 3 | 4 | 5][]) => Object.fromEntries(cs.map((c) => [c, e]));

/** Biden's road: 1987 -> 2008 -> 2021-25 on the dimmed station plate (timeline: icons pop 11 f, line draws). */
const BidenRoad: React.FC<{ a2008: number; a2021: number; aTerm: number }> = ({ a2008, a2021, aTerm }) => {
  const f = useCurrentFrame();
  const X = (y: number) => 220 + ((y - 1987) / 38) * 1180;
  const p = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const b = interpolate(f - aTerm, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const yr = (y: number, at: number) => f >= at && <text key={y} x={X(y)} y={660} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={44} fill="#f4f1ea" stroke={INK} strokeWidth={7} paintOrder="stroke">{y}</text>;
  return (
    <g>
      <rect x={X(1987)} y={560} width={X(2025) - X(1987)} height={16} fill="#0f2a2d" />
      <rect x={X(1987)} y={560} width={(X(2025) - X(1987)) * p} height={16} fill="#e02b2b" />
      {[1987, 2008, 2021, 2025].map((y) => <rect key={y} x={X(y) - 3} y={544} width={6} height={48} fill="#f4f1ea" />)}
      {yr(1987, 0)}{yr(2008, a2008)}{yr(2021, a2021)}{yr(2025, aTerm)}
      <HeadIcon c="joe_biden" x={X(1987)} y={420} size={170} at={0} ring="#f4f1ea" />
      <HeadIcon c="joe_biden" e={4} x={X(2008)} y={420} size={170} at={a2008} ring="#f4f1ea" />
      <HeadIcon c="joe_biden" e={[[0, 0], [aTerm + R, 5]]} x={X(2021)} y={420} size={170} at={a2021} ring="#ffe08a" />
      {b > 0 && <g>
        <rect x={X(2021)} y={700} width={(X(2025) - X(2021)) * b} height={26} rx={8} fill="#e9b23c" stroke={INK} strokeWidth={6} />
        <text x={(X(2021) + X(2025)) / 2} y={800} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={52} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke" opacity={b}>FULL TERM</text>
      </g>}
    </g>
  );
};

/** Air Force One heading home: level flight with a gentle bob. */
const Plane: React.FC = () => {
  const f = useCurrentFrame();
  return <V c="shared_props_modern" p={5} x={760 + f * 3} y={620 + Math.sin(f / 14) * 8} h={260} />;
};

export const SHOTS: Shot[] = [
  // 0 Joe Biden needed three presidential campaigns.
  { a: ln(0), el: (t, dur) => {
    const th = t(wd(0, "three"));
    return (<>
      <Cam dur={dur} from={1.0} to={1.06} ox="40%" oy="60%">
        <Svg bg={<WilmingtonStation />}>
          <Act c="joe_biden" x={500} y={1015} h={600} e={5} gesture={10} stress at={th} enter={{ from: "left", frames: 8, dist: 700 }} />
          <Pop at={th + 4} x={780} y={150} label=""><CampaignButton year="'88" /></Pop>
          <Pop at={th + 10} x={1420} y={150} label=""><CampaignButton year="2008" tone="#1f5aa6" /></Pop>
          <Pop at={th + 16} x={1720} y={150} label=""><CampaignButton year="2020" tone="#1f3a78" /></Pop>
          <CrowdBacks y={985} n={9} s={0.95} seed={3} />
        </Svg>
      </Cam>
      <Card text="Joe Biden" sub="47th VP · 46th President" until={th} />
      <Cap text="Wilmington Station · 1987" at={th} />
    </>);
  } },
  // 1 His bids for the 1988 and 2008 nominations failed, but Barack Obama chose him as his running mate.
  { a: ln(1), el: (t, dur) => {
    const ba = t(wd(1, "barack")), ch = t(wd(1, "chose")), ru = t(wd(1, "running"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.08}><Svg bg={<NewsInsert a1={t(wd(1, "1988"))} a2={t(wd(1, "2008"))} xAt={t(wd(1, "failed"))} />} /></Cam>],
        [ba, <Cam dur={dur} from={1.0} to={1.05} oy="45%"><Svg bg={<SpringfieldCapitol />}>
          <V c="barack_obama" p={8} x={640} y={1010} h={620} />
          <RallyPodium x={600} />
          <Swap t={ru} a={<Act c="joe_biden" x={1260} y={1010} h={620} e={5} gesture={10} at={ch} enter={{ from: "right", frames: 8, dist: 800 }} />}
            b={<V c="joe_biden" p={9} x={1260} y={1010} h={630} />} />
          <CrowdBacks y={1010} n={10} s={1.0} seed={5} cheerAt={ru} />
        </Svg></Cam>],
      ]} />
      <Cap text="Springfield, Illinois · August 2008" at={t(wd(1, "chose"))} />
    </>);
  }, sfx: [[Math.round((wd(1, "running") - ln(1)) * 30), "cheer", 0.07]] },
  // 2 Biden served eight years as vice president, spent four years out of office, then defeated Donald Trump in 2020.
  { a: ln(2), el: (t, dur) => {
    const sp = t(wd(2, "spent")), th = t(wd(2, "then")), yr = t(wd(2, "2020"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.06} oy="45%"><Svg bg={<OvalObama />}>
          <V c="barack_obama" p={6} x={640} y={990} h={660} />
          <Act c="joe_biden" x={1280} y={990} h={650} e={[[0, 0], [t(wd(2, "vice")) + R, 5]]} />
          <ResoluteDesk />
        </Svg></Cam>],
        [sp, <Cam dur={dur} from={1.0} to={1.05} ox="40%" oy="45%"><Svg bg={<WilmingtonDen flips={[t(wd(2, "four")), t(wd(2, "years", 1)), t(wd(2, "out"))]} />}>
          <Swap t={t(wd(2, "out")) + R} a={<V c="joe_biden" p={1} x={1040} y={1000} h={600} flip />} b={<V c="joe_biden" p={6} x={1040} y={1000} h={600} />} />
          <DenChair />
        </Svg></Cam>],
        [th, <Cam dur={dur} from={1.0} to={1.03}><Svg bg={<VoteBoard title="ELECTORAL VOTES · 2020" at={th} rows={[
          { c: "joe_biden", name: "JOE BIDEN", v: 306, max: 330, e: [[0, 0], [t(wd(2, "defeated")) + R, 5]] },
          { c: "donald_trump", name: "DONALD TRUMP", v: 232, max: 330, e: [[0, 0], [t(wd(2, "trump")) + R, 2]] },
        ]} />} /></Cam>],
        [yr, <Cam dur={dur} from={1.04} to={1.1} oy="50%"><Svg bg={<DriveInRally />}>
          <V c="joe_biden" p={9} x={960} y={800} h={470} />
          <CarsFG />
        </Svg></Cam>],
      ]} />
      <Cap text="2009–2017" at={t(wd(2, "served"))} until={sp} />
      <Cap text="Wilmington · November 7, 2020" at={yr} />
    </>);
  }, sfx: [[Math.round((wd(2, "2020") - ln(2)) * 30), "cheer", 0.08]] },
  // 3 He took office at seventy-eight, setting the age record at the time.
  { a: ln(3), el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06} ox="32%" oy="25%">
      <Svg bg={<CapitolWest2021 />}>
        <V c="joe_biden" p={10} x={600} y={1000} h={620} />
        <BuntingRail y={830} />
        <Quill pose="deadpan_wings_folded" x={1600} y={1010} h={340} />
        <FlagField y={940} />
      </Svg>
    </Cam>
    <Cap text="January 20, 2021" at={t(wd(3, "took"))} until={t(wd(3, "record"))} />
    <Stamp lines={["AGE 78", "OLDEST EVER", "(AT THE TIME)"]} at={t(wd(3, "record"))} x={1340} y={330} rot={-8} variant="dark" />
  </>) },
  // 4 His presidency included a bipartisan infrastructure law, and he ended his reelection campaign in 2024.
  { a: ln(4), el: (t, dur) => {
    const en = t(wd(4, "ended"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.06} oy="70%"><Svg bg={<SouthLawn />}>
          <V c="joe_biden" p={11} x={960} y={860} h={430} />
          <CrowdBacks y={995} n={11} s={0.9} cols={["#2b4a8c", "#8c2b2b"]} seed={1} cheerAt={t(wd(4, "law"))} />
        </Svg></Cam>],
        [en, <Cam dur={dur} from={1.0} to={1.07} ox="45%" oy="45%"><Svg bg={<OvalBiden />}>
          <Act c="joe_biden" x={900} y={1000} h={680} e={[[0, 0], [t(wd(4, "campaign")) + R, 4]]} />
          <ResoluteDesk />
          <YardSign x={1460} y={1060} fallAt={t(wd(4, "campaign"))} />
          <TVCamera x={1760} />
        </Svg></Cam>],
      ]} />
      <Cap text="Infrastructure law · November 2021" at={t(wd(4, "infrastructure"))} until={en} />
      <Cap text="July 2024" at={t(wd(4, "2024"))} />
    </>);
  }, sfx: [[Math.round((wd(4, "law") - ln(4)) * 30), "cheer", 0.06], [Math.round((wd(4, "campaign") - ln(4)) * 30) + 6, "thud", 0.12]] },
  // 5 Decades after his first attempt, he'd served a full term.
  { a: ln(5), el: (t, dur) => (
    <Cam dur={dur} from={1.0} to={1.04}>
      <Svg bg={<WilmingtonStation />} dim={0.62}>
        <BidenRoad a2008={t(wd(5, "first"))} a2021={t(wd(5, "served"))} aTerm={t(wd(5, "full"))} />
        <Quill pose="scoreboard_facing_left" x={1690} y={1040} h={420} at={t(wd(5, "served")) - 6} enter={{ from: "right", frames: 8, dist: 600 }}>
          <Board pose="scoreboard_facing_left" top="SERVED" big="4 YRS" at={t(wd(5, "term"))} />
        </Quill>
      </Svg>
    </Cam>
  ) },
  // 6 That makes fifteen.
  { a: ln(6), el: (t, dur) => (
    <Cam dur={dur} from={1.0} to={1.03}>
      <Svg bg={<Gallery />}>
        <Quill pose="scoreboard_celebration" x={1790} y={1060} h={380} at={t(wd(6, "fifteen")) - 6} enter={{ from: "right", frames: 7, dist: 500 }}>
          <Board pose="scoreboard_celebration" top="TOTAL" big="15" />
        </Quill>
        <GalleryBench />
      </Svg>
    </Cam>
  ) },
  // 7 Eight first became president because a president died.
  { a: ln(7), el: (t, dur) => (<>
    <Cam dur={dur} from={1.03} to={1.08} oy="45%">
      <Svg bg={<Gallery only={["D"]} mournAt={t(wd(7, "became"))} e={all(DIED, [[0, 0], [t(wd(7, "died")) + R, 4]])} />}>
        <GalleryBench />
      </Svg>
    </Cam>
    <Cap text="8 · A president died" at={t(wd(7, "died"))} />
  </>) },
  // 8 Ford got there through a resignation.
  { a: ln(8), el: (t, dur) => {
    const rs = t(wd(8, "resignation"));
    const [fx, fy] = slotXY("gerald_ford");
    return (<>
      <Cam dur={dur} from={1.0} to={1.06} ox={pct(fx, 1920)} oy={pct(fy, 1080)} punch={{ at: t(wd(8, "through")), frames: 6, to: 1.45 }}>
        <Svg bg={<Gallery only={["R"]} resignAt={rs} e={{ gerald_ford: [[0, 0], [rs + R, 3]], richard_nixon: [[0, 0], [rs + R, 4]] }} />} />
      </Cam>
      <Cap text="1 · A resignation" at={rs} />
    </>);
  } },
  // 9 Six reached it by winning an election, including Nixon and Biden after time out of office.
  { a: ln(9), el: (t, dur) => {
    const wi = t(wd(9, "winning"));
    return (<>
      <Cam dur={dur} from={1.06} to={1.0} oy="50%">
        <Svg bg={<Gallery only={["E"]} electAt={wi} e={{ ...all(ELECTED, [[0, 0], [wi + R, 5]]), richard_nixon: [[0, 0], [t(wd(9, "nixon")) + R, 5]], joe_biden: [[0, 0], [t(wd(9, "biden")) + R, 5]] }}
          plaques={[["richard_nixon", "8 YEARS OUT", t(wd(9, "nixon"))], ["joe_biden", "4 YEARS OUT", t(wd(9, "biden"))]]}
          spot={[["richard_nixon", t(wd(9, "nixon"))], ["joe_biden", t(wd(9, "biden"))]]} />} />
      </Cam>
      <Cap text="6 · Won an election" at={t(wd(9, "election"))} />
    </>);
  } },
  // 10 Their first days ranged from a family parlor to an airplane carrying a murdered president home.
  { a: ln(10), el: (t, dur) => {
    const ap = t(wd(10, "airplane")), mu = t(wd(10, "murdered"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.15} to={1.1} ox={pct(LAMP[0], 1920)} oy={pct(LAMP[1], 1080)}><Svg bg={<OathParlor />}>
          <Act c="john_coolidge_senior" x={840} y={905} h={560} flip e={0} />
          <OathTable lit={1} />
          <V c="calvin_coolidge" p={6} x={520} y={1030} h={640} />
          <RockerFG />
          <LampGrade lit={1} cx={LAMP[0]} cy={LAMP[1]} />
        </Svg></Cam>],
        [ap, <Cam dur={dur} from={1.0} to={1.06} oy="45%"><Svg bg={<AF1Stateroom />}>
          <V c="jacqueline_kennedy" p={6} x={560} y={1010} h={580} />
          <V c="lyndon_johnson" p={5} x={1000} y={1010} h={620} />
          <V c="sarah_hughes" p={1} x={1400} y={1020} h={520} flip />
        </Svg></Cam>],
        [mu, <Cam dur={dur} from={1.0} to={1.04}><Svg bg={<AF1Night />}><Plane /></Svg></Cam>],
      ]} />
      <Cap text="Plymouth Notch, Vermont · 1923" at={t(wd(10, "family"))} until={ap} />
      <Cap text="Air Force One · November 22, 1963" at={ap + 4} until={mu} />
    </>);
  } },
  // 11 And the precedent behind the emergency promotions goes back to Tyler, the man whose own party threw him out while he kept the White House.
  { a: ln(11), el: (t, dur) => {
    const go = t(wd(11, "goes")), ty = t(wd(11, "tyler")), wh = t(wd(11, "whose")), wl = t(wd(11, "while"));
    const thr = t(wd(11, "threw"));
    return (<>
      <Steps s={[
        [0, <Cam dur={dur} from={1.0} to={1.06} ox="45%" oy="55%"><Svg bg={<HotelParlor1841 />}>
          <Swap t={ty} a={<Act c="john_tyler" x={880} y={1010} h={620} e={0} at={go} enter={{ from: "left", frames: 8, dist: 900 }} />}
            b={<V c="john_tyler" p={5} x={880} y={1010} h={620} />} />
        </Svg></Cam>],
        [wh, <Cam dur={dur} from={1.0} to={1.05} oy="55%"><Svg bg={<WhigRoom doorAt={thr} />}>
          <Fling at={thr + 2} dx={1300}><Act c="john_tyler" x={1150} y={1010} h={620} e={[[0, 2]]} vein={thr - 8} /></Fling>
          <Splat x={1150} y={780} at={thr + 2} r={120} />
          <Speed x={1500} y={620} at={thr + 4} frames={4} dir={-1} />
          <WhigTable />
        </Svg></Cam>],
        [wl, <Cam dur={dur} from={1.0} to={1.05} oy="60%"><Svg bg={<WhiteHouse1841 />}>
          <Act c="john_tyler" x={960} y={1000} h={560} e={[[0, 2], [t(wd(11, "kept")) + R, 5]]} gesture={10} stress />
          <IronFence />
        </Svg></Cam>],
      ]} />
      <Card text="The Tyler Precedent" sub="April 6, 1841" until={go} />
      <Cap text="September 1841" at={wh + 4} until={wl} />
    </>);
  }, sfx: [[Math.round((wd(11, "threw") - ln(11)) * 30) + 2, "sub_thump", 0.2]] },
  // 12 Of course, plenty of vice presidents spent years waiting for that promotion and never got it.
  { a: ln(12), el: (t, dur) => {
    const nv = t(wd(12, "never")), wt = t(wd(12, "waiting"));
    return (
      <Cam dur={dur} from={1.0} to={1.06} ox="60%" oy="55%">
        <Svg bg={<OuterOval shutAt={nv} spinFrom={t(wd(12, "spent"))} />}>
          <Sulk at={nv + R}><Act c="aaron_burr" x={420} y={1010} h={600} e={[[0, 0], [wt + R, 4]]} /></Sulk>
          <Sulk at={nv + R + 4}><Act c="spiro_agnew" x={780} y={1010} h={610} e={[[0, 0], [wt + R + 3, 4]]} /></Sulk>
          <Swap t={nv + R + 8} a={<Quill pose="deadpan_wings_folded" x={1140} y={1010} h={340} />} b={<Quill pose="nervous_side_glance" x={1140} y={1010} h={340} />} />
        </Svg>
      </Cam>
    );
  }, sfx: [[Math.round((wd(12, "never") - ln(12)) * 30) + 4, "thud", 0.14]] },
  // 13 Their attempts produced a whole different collection of political disasters.
  { a: ln(13), el: (t, dur) => {
    const ds = t(wd(13, "disasters"));
    return (
      <Cam dur={dur} from={1.0} to={1.1} ox="50%" oy="45%">
        <Svg bg={<DisastersWing crashAt={ds} />}>
          <Swap t={ds + 7 + R} a={<Quill pose="speaking_facing_right" x={430} y={1010} h={400} />} b={<Quill pose="startled_recoil" x={430} y={1010} h={400} />} />
        </Svg>
      </Cam>
    );
  }, sfx: [[Math.round((wd(13, "disasters") - ln(13)) * 30) + 7, "thud", 0.15]] },
];

export const VicePresidents5: React.FC<{ noAudio?: boolean }> = ({ noAudio }) => <Episode data={D} shots={SHOTS} noAudio={noAudio} />;
