import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import * as B from "../Thanksgiving/Backgrounds";
import {
  Barrel, BigText, Book, Bubble, CalendarPage, ChurchState, Constitution, LetterStack, Pie, Proclamation, PropImg,
  Scoreboard, SplitWar, StateGrid,
} from "../Thanksgiving/Graphics";
import COLLARS from "../Thanksgiving2/collars.json";
import { MONTSERRAT } from "../fonts";
import { OvalOffice, SkyScroll, WhiteHouseLawn } from "./Bg2";
import BOARDS from "./boards.json";
import { Arch, Cam, Cap, Card, Cheer, Note, PopIn, Puff, QMarks, Quill, Rig, ShotCtx, Speed, Spr, Stamp, Tag } from "./Kit";
import VO from "./vo.json";

/**
 * "Every President's Thanksgiving Explained" — cold open + chapters 1-3, full voiceover (3:43).
 * Every beat is timed to WORD starts from align_words.py (global seconds; VO2 starts at O2).
 * Rules: style-bible.md + SCENE_GUIDE.md + user notes: characters face each other, poses/expressions
 * change on the motivating word, rigged stick limbs walk/gesture and never detach, quiet SFX, NO music.
 */
const FPS = 30;
const O2 = (VO as { O2: number }).O2;
export const TG3_DURATION = Math.round((O2 + 130.66 + 0.7) * FPS);
const C = COLLARS as unknown as Record<string, number[]>;
const BD = BOARDS as unknown as Record<string, [number, number, number, number]>;
type Shot = { a: number; b: number; el: (t: (s: number) => number) => React.ReactNode; sfx?: [number, string, number?][] };

const Svg: React.FC<{ bg: React.ReactNode; dim?: number; children?: React.ReactNode }> = ({ bg, dim = 0, children }) => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    <B.Defs />{bg}
    {dim > 0 && <rect width={1920} height={1080} fill="#0b0f14" opacity={dim} />}
    {children}
    <B.Finish />
  </svg>
);

const Board: React.FC<{ pose: string; top: string; big: string; at?: number }> = ({ pose, top, big, at = 0 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const [x0, y0, x1, y1] = BD[pose];
  return (
    <g fontFamily={MONTSERRAT} fontWeight={800} fill="#f4f1ea" textAnchor="middle">
      <text x={(x0 + x1) / 2} y={y0 + 20} fontSize={14}>{top}</text>
      <text x={(x0 + x1) / 2} y={y1 - 10} fontSize={48}>{big}</text>
    </g>
  );
};

/** Swap helper: shows `a` before t, `b` from t (1-frame pose swap). */
const Swap: React.FC<{ t: number; a: React.ReactNode; b: React.ReactNode }> = ({ t, a, b }) => {
  const f = useCurrentFrame();
  return <>{f < t ? a : b}</>;
};

const DropBarrel: React.FC<{ x: number; y: number; at: number; s?: number }> = ({ x, y, at, s = 1 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const e = 1 - (1 - Math.min(1, (f - at) / 8)) ** 2;
  return <g transform={`translate(0 ${-(1 - e) * 900})`}><Barrel x={x} y={y} s={s} /></g>;
};

const Chaos: React.FC = () => {
  const f = useCurrentFrame();
  return <>{Array.from({ length: 12 }, (_, i) => (
    <CalendarPage key={i} x={((i * 233 + f * (5 + (i % 4) * 3)) % 2300) - 200} y={200 + ((i * 157) % 700) + Math.sin(f / 6 + i) * 30}
      month={["NOV", "DEC", "OCT"][i % 3]} day={String(18 + (i * 7) % 13)} w={190} rot={f * (i % 2 ? 4 : -3) + i * 30} />
  ))}</>;
};

const PRES = [["zachary_taylor", "TAYLOR"], ["millard_fillmore", "FILLMORE"], ["franklin_pierce", "PIERCE"], ["james_buchanan", "BUCHANAN"]];
const PolkFrame: React.FC<{ x: number; y: number; w: number; at?: number }> = ({ x, y, w, at = 0 }) => (
  <PopIn at={at} x={x} y={y}>
    <rect x={-w / 2 - 14} y={-w * 0.67 - 14} width={w + 28} height={w * 1.34 + 28} fill="#a7792d" stroke="#6e4c1a" strokeWidth={6} />
    <image href={staticFile("tg2/archive/polk.jpg")} x={-w / 2} y={-w * 0.67} width={w} height={w * 1.34} preserveAspectRatio="xMidYMid slice" style={{ filter: "sepia(0.5)" }} />
    <text y={w * 0.67 + 54} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={34} fill="#fff" stroke="#000" strokeWidth={2} paintOrder="stroke">POLK</text>
  </PopIn>
);

const g2 = (s: number) => +(s + O2).toFixed(2); // chapter 2-3 file time -> global

const SHOTS: Shot[] = [
  // ======================= COLD OPEN =======================
  { a: 0, b: 5.06, sfx: [[50 + 8, "thud", 0.22], [90, "rattle", 0.15], [118, "pop", 0.15]], el: (t) => (
    <>
      <Cam dur={152} to={1.03} punch={{ at: t(3.94), frames: 8, to: 1.32, ox: "64%", oy: "78%" }}>
        <Svg bg={<WhiteHouseLawn />}>
          <Swap t={t(4.13) + 4}
            a={<Rig c="calvin_coolidge" pose="unimpressed_arms_folded" x={540} y={1000} h={560} stress />}
            b={<Rig c="calvin_coolidge" pose="hesitates_at_delivery" x={540} y={1000} h={560} gesture={8} stress />} />
          <Swap t={t(3.94)}
            a={<Spr s="Poses/poultry_props/vose_express_shipment_box" x={1250} y={990} h={300} at={t(1.68)} drop={{ frames: 8, height: 900 }} shake={3} />}
            b={<Spr s="Poses/rebecca/startled_in_shipping_crate" x={1250} y={990} h={330} />} />
          <Puff x={1250} y={990} at={t(1.68) + 8} />
        </Svg>
      </Cam>
      <Cap text="1926" pos="top" at={t(0.25)} />
    </>) },
  { a: 5.06, b: 6.02, sfx: [[10, "paper", 0.18]], el: (t) => (
    <Cam dur={29} from={1.25} to={1.3} ox="64%" oy="78%">
      <Svg bg={<WhiteHouseLawn />}>
        <Spr s="Poses/rebecca/startled_in_shipping_crate" x={1250} y={990} h={330} />
        <PopIn at={t(5.4)} x={1430} y={790}><g transform="rotate(8)"><rect x={-80} y={-55} width={160} height={110} fill="#f6ecd2" stroke="#1d1712" strokeWidth={6} />{[0, 1, 2].map((i) => <line key={i} x1={-55} x2={55} y1={-20 + i * 22} y2={-20 + i * 22} stroke="#7a6a5a" strokeWidth={4} />)}</g></PopIn>
      </Svg>
    </Cam>) },
  { a: 6.02, b: 8.64, sfx: Array.from({ length: 16 }, (_, i) => [Math.round((7.4 - 6.02) * FPS) + i * 2, "type_tick", 0.07] as [number, string, number]), el: (t) => (
    <Cam dur={79} to={1.04}><Svg bg={<WhiteHouseLawn />} dim={0.5}><Note x={960} y={560} text="Please eat this." at={t(7.4)} /></Svg></Cam>) },
  { a: 8.64, b: 10.94, el: (t) => (
    <Cam dur={69} to={1.03} punch={{ at: t(9.66), frames: 8, to: 1.16, ox: "38%", oy: "45%" }}>
      <Svg bg={<OvalOffice />}>
        <Rig c="calvin_coolidge" pose="hesitates_at_delivery" x={700} y={1010} h={600} gesture={10} stress />
        <Spr s="Poses/rebecca/startled_in_shipping_crate" x={1350} y={1000} h={330} flip />
      </Svg>
    </Cam>) },
  { a: 10.94, b: 13.17, sfx: [[Math.round((11.78 - 10.94) * FPS), "pop", 0.15], [Math.round((12.2 - 10.94) * FPS), "pop", 0.15]], el: (t) => (
    <Cam dur={67} to={1.05}>
      <Svg bg={<WhiteHouseLawn />}>
        <Spr s="Poses/rebecca/sits_with_red_collar" x={960} y={1000} h={480} stress />
        <Tag name="rebecca" x={960} y={400} w={520} at={t(11.78)} rot={-4} />
        <Tag name="rebecca_collar" x={1340} y={740} w={480} at={t(12.2)} rot={6} />
      </Svg>
    </Cam>) },
  { a: 13.17, b: 14.07, el: () => (
    <Cam dur={27} from={1.02} to={1.08} ox="60%" oy="40%"><Svg bg={<WhiteHouseLawn />}><Spr s="Poses/rebecca/peeks_from_tree_house" x={1180} y={1030} h={760} /></Svg></Cam>) },
  { a: 14.07, b: 17.0, el: () => (
    <Cam dur={88} to={1.05}><Svg bg={<OvalOffice />}><Spr s="Poses/calvin_coolidge/content_with_rebecca" x={960} y={1020} h={600} /></Svg></Cam>) },
  { a: 17.0, b: 19.62, sfx: [[0, "whoosh", 0.15]], el: () => (
    <Cam dur={79} to={1.04}><Svg bg={<SkyScroll />}>
      <Speed x={1200} y={560} frames={8} dir={-1} />
      <Spr s="Poses/supreme_ii/jaunty_in_flying_gear" x={960} y={860} h={560} enter={{ from: "right", frames: 8 }} />
    </Svg></Cam>) },
  { a: 19.62, b: 21.59, el: () => (
    <Cam dur={59} to={1.04}><Svg bg={<B.Studio />}><Quill pose="speaking_facing_right" talk x={960} y={1010} h={720} /></Svg></Cam>) },
  { a: 21.59, b: 24.6, sfx: [[Math.round((22.76 - 21.59) * FPS), "pop", 0.12]], el: (t) => (
    <Cam dur={90} to={1.04}><Svg bg={<B.Studio />}>
      <Quill pose="speaking_facing_right" talk x={560} y={1010} h={680} />
      <BigText x={1260} y={430} text="EVERY PRESIDENT'S" size={86} at={t(22.76)} />
      <BigText x={1260} y={560} text="THANKSGIVING" size={120} at={t(23.75)} color="#ffcf4a" />
    </Svg></Cam>) },
  // "Proclamations, feuds, a calendar crisis, a turkey in an aviation helmet, ... almost dinner."
  { a: 24.6, b: 25.19, sfx: [[2, "scribble", 0.12]], el: () => (
    <Cam dur={18} from={1.05} to={1.1}><Svg bg={<B.Study />}><Rig c="george_washington" pose="signing_proclamation" x={960} y={1030} h={640} /></Svg></Cam>) },
  { a: 25.19, b: 26.08, el: () => (
    <Cam dur={27} from={1.04} to={1.08}><Svg bg={<B.Chamber />}>
      <Rig c="john_adams" pose="puzzled_reaction" x={640} y={1030} h={580} gesture={10} />
      <Rig c="thomas_jefferson" pose="firm_stop_gesture" x={1300} y={1030} h={580} />
    </Svg></Cam>) },
  { a: 26.08, b: 26.96, sfx: [[Math.round((26.65 - 26.08) * FPS), "paper", 0.15]], el: (t) => (
    <Cam dur={26} to={1.05}><Svg bg={<OvalOffice />} dim={0.45}>
      <Swap t={t(26.65)} a={<CalendarPage x={720} y={540} month="NOVEMBER" day="30" sub="THURSDAY" w={420} rot={-4} />} b={<CalendarPage x={720} y={540} month="NOVEMBER" day="23" sub="THURSDAY" w={420} rot={-4} />} />
      <Rig c="franklin_d_roosevelt" pose="confident_date_change" x={1420} y={1030} h={560} />
    </Svg></Cam>) },
  { a: 26.96, b: 29.21, sfx: [[Math.round((27.19 - 26.96) * FPS), "whoosh", 0.15]], el: (t) => (
    <Cam dur={67} to={1.04}><Svg bg={<SkyScroll />}>
      <Speed x={1150} y={560} at={t(27.19)} frames={8} dir={-1} />
      <Swap t={t(28.5)} a={<Spr s="Poses/supreme_ii/jaunty_in_flying_gear" x={960} y={880} h={600} at={t(27.19)} enter={{ from: "right", frames: 8 }} />}
        b={<Spr s="Poses/supreme_ii/green_face_airsick" x={960} y={880} h={600} />} />
    </Svg></Cam>) },
  { a: 29.21, b: 32.6, sfx: [[9, "pop", 0.12], [33, "pop", 0.12], [45, "pop", 0.12], [57, "pop", 0.12], [Math.round((31.66 - 29.21) * FPS), "sub_thump", 0.25]], el: (t) => {
    const birds: [string, string, string][] = [["brown_turkey", "standing_alert", "nervous_beak_open"], ["white_ceremony_turkey", "standing_with_blank_sign", "nervous_side_glance"], ["jack", "standing_alert", "tucks_wings_for_hug"], ["brown_turkey", "standing_alert", "nervous_beak_open"]];
    const at = [t(29.5), t(30.3), t(30.71), t(31.13)];
    return <Cam dur={102} to={1.05}><Svg bg={<WhiteHouseLawn />}>
      {birds.map(([c, a, n], i) => <Swap key={i} t={t(31.66) + 4} a={<Spr s={`Poses/${c}/${a}`} x={330 + i * 420} y={1010} h={400} at={at[i]} flip={i % 2 === 1} />} b={<Spr s={`Poses/${c}/${n}`} x={330 + i * 420} y={1010} h={400} flip={i % 2 === 1} />} />)}
    </Svg></Cam>;
  } },
  { a: 32.6, b: 33.49, el: () => (
    <Cam dur={27} from={1.1} to={1.14} oy="40%"><Svg bg={<B.Studio />}><Quill pose="nervous_side_glance" talk x={960} y={1010} h={720} /></Svg></Cam>) },
  { a: 33.49, b: 34.98, sfx: [[Math.round((34.16 - 33.49) * FPS), "ding", 0.15]], el: (t) => (
    <Cam dur={45} to={1.04}><Svg bg={<B.Studio />}>
      <Quill pose="scoreboard_facing_left" talk x={960} y={1010} h={720}><Board pose="scoreboard_facing_left" top="TURKEYS" big="0" at={t(34.16)} /></Quill>
    </Svg></Cam>) },

  // ======================= 1. GEORGE WASHINGTON =======================
  { a: 34.98, b: 36.85, el: (t) => (
    <>
      <Cam dur={56} to={1.05}><Svg bg={<B.FederalHall />}><Rig c="george_washington" pose="solemn_with_quill" x={960} y={1010} h={560} stress /></Svg></Cam>
      <Card text="George Washington" sub="1 · The First One" until={t(36.85) - 1} />
    </>) },
  { a: 36.85, b: 38.71, el: (t) => (
    <>
      <Cam dur={56} to={1.04} oy="70%"><Svg bg={<B.FederalHall />}>
        <Rig c="elias_boudinot" pose="eager_greeting" x={300} y={1020} h={400} walk={1} walkUntil={34} />
        <Rig c="james_madison" pose="standing_neutral" x={1500} y={1020} h={400} flip />
      </Svg></Cam>
      <Cap text="1789" pos="top" at={t(37.51)} />
    </>) },
  { a: 38.71, b: 40.55, sfx: [[Math.round((38.79 - 38.71) * FPS), "pop", 0.15]], el: (t) => (
    <><Arch src="constitution" dur={55} focus={[50, 25]} zoom={[1, 1.12]} /><Cap text="The Constitution" at={t(38.79)} /></>) },
  { a: 40.55, b: 43.46, sfx: [[Math.round((41.86 - 40.55) * FPS), "cheer", 0.15]], el: (t) => {
    const hype = t(41.86);
    const Crowd: React.FC = () => {
      const f = useCurrentFrame(); const on = f >= hype;
      return (<>
        <Rig c="john_adams" pose={on ? "announcing_arms_open" : "attentive_neutral"} x={330} y={1040} h={500} bounce={on ? 36 : 0} gesture={on ? 12 : 0} />
        <Rig c="elias_boudinot" pose="eager_greeting" x={760} y={1040} h={500} bounce={on ? 28 : 0} gesture={on ? 10 : 0} />
        <Rig c="james_madison" pose="standing_neutral" x={1170} y={1040} h={500} flip bounce={on ? 30 : 0} />
        <Rig c="levi_lincoln_sr" pose="cautious_lean" x={1570} y={1040} h={500} bounce={on ? 22 : 0} />
        {on && <Cheer x={260} y={360} w={1400} />}
      </>);
    };
    return <Cam dur={87} to={1.04} punch={{ at: hype, frames: 8, to: 1.12, oy: "60%" }}><Svg bg={<B.Chamber />}><Crowd /></Svg></Cam>;
  } },
  { a: 43.46, b: 46.33, el: (t) => (
    <>
      <Cam dur={86} to={1.05}><Svg bg={<B.Chamber />}>
        <Rig c="elias_boudinot" pose="eager_greeting" x={780} y={1030} h={600} gesture={12} stress />
        <Rig c="john_adams" pose="attentive_neutral" x={1420} y={1040} h={540} flip />
        <Quill pose="deadpan_wings_folded" blinkHold x={190} y={1150} h={360} enter={{ from: "bottom", frames: 9 }} at={t(45.0)} />
      </Svg></Cam>
      <Cap text="Elias Boudinot" at={t(44.34)} until={t(45.87)} />
      <Cap text="New Jersey" at={t(45.87)} />
    </>) },
  { a: 46.33, b: 49.8, sfx: [[2, "paper", 0.15]], el: (t) => (
    <Cam dur={104} to={1.04}><Svg bg={<B.Chamber />}>
      <Rig c="elias_boudinot" pose="offers_petition" x={640} y={1030} h={600} gesture={8} stress />
      <Rig c="john_adams" pose="attentive_neutral" x={1240} y={1030} h={560} flip />
      <Swap t={t(48.33)} a={<Rig c="james_madison" pose="standing_neutral" x={1620} y={1030} h={560} flip />} b={<Rig c="james_madison" pose="reads_proclamation" x={1620} y={1030} h={560} />} />
    </Svg></Cam>) },
  { a: 49.8, b: 50.83, sfx: [[Math.round((50.12 - 49.8) * FPS), "cheer", 0.12]], el: (t) => (
    <Cam dur={31} from={1.04} to={1.08}><Svg bg={<B.Chamber />}>
      <Rig c="john_adams" pose="announcing_arms_open" x={700} y={1040} h={560} gesture={12} stress />
      <Rig c="james_madison" pose="presents_proclamation" x={1260} y={1040} h={560} at={t(50.12)} />
    </Svg></Cam>) },
  { a: 50.83, b: 52.71, el: (t) => (
    <Cam dur={56} to={1.03}><Svg bg={<B.FederalHall />}>
      <Rig c="elias_boudinot" pose="offers_petition" x={260} y={1030} h={470} walk={1} walkUntil={t(52.2)} />
      <Rig c="george_washington" pose="solemn_with_quill" x={1560} y={1020} h={520} flip />
    </Svg></Cam>) },
  { a: 52.71, b: 57.18, sfx: [[Math.round((55.52 - 52.71) * FPS), "scribble", 0.15]], el: (t) => (
    <>
      <Cam dur={134} to={1.06} oy="60%"><Svg bg={<B.Study />}>
        <Swap t={t(55.52)} a={<Rig c="george_washington" pose="solemn_with_quill" x={960} y={1030} h={660} stress />} b={<Rig c="george_washington" pose="signing_proclamation" x={960} y={1030} h={680} />} />
      </Svg></Cam>
      <Cap text="October 3, 1789" at={t(52.93)} />
    </>) },
  { a: 57.18, b: 61.25, sfx: [[1, "paper", 0.18], [Math.round((57.6 - 57.18) * FPS), "pop", 0.12]], el: (t) => (
    <>
      <Arch src="wash_procl" dur={122} focus={[50, 30]} zoom={[1.0, 1.2]} />
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <PopIn at={t(57.6)} x={1560} y={540}><CalendarPage x={0} y={0} month="NOVEMBER" day="26" sub="THURSDAY" rot={6} w={360} /></PopIn>
      </svg>
      <Cap text="A day of public thanksgiving and prayer" at={t(59.11)} size={58} />
    </>) },
  { a: 61.25, b: 64.2, sfx: [[Math.round((61.56 - 61.25) * FPS) + 6, "sub_thump", 0.3]], el: (t) => (
    <>
      <Cam dur={89} to={1.03} punch={{ at: t(61.4), frames: 5, to: 1.3, oy: "40%" }}>
        <Svg bg={<B.FederalHall />}><Rig c="george_washington" pose="solemn_with_quill" x={960} y={1030} h={600} stress /></Svg>
      </Cam>
      <Stamp lines={["THE FIRST", "NATIONAL", "THANKSGIVING"]} at={t(61.56)} x={500} y={280} rot={-9} variant="red" darken={false} />
    </>) },
  { a: 64.2, b: 67.22, sfx: [[Math.round((66.23 - 64.2) * FPS), "pop", 0.12]], el: (t) => (
    <Cam dur={91} to={1.04}><Svg bg={<B.Studio />}>
      <Quill pose="speaking_facing_right" talk x={960} y={1010} h={720} />
      <QMarks x={960} y={380} at={t(66.23)} spread={330} />
    </Svg></Cam>) },
  { a: 67.22, b: 70.3, el: (t) => (
    <>
      <Cam dur={92} to={1.04} oy="45%"><Svg bg={<B.Chapel />}><Rig c="george_washington" pose="solemn_with_quill" x={300} y={1040} h={480} walk={1} /></Svg></Cam>
      <Cap text="St. Paul's Chapel" at={t(68.47)} until={t(69.64)} />
      <Cap text="New York" at={t(69.64)} />
    </>) },
  { a: 70.3, b: 74.49, sfx: [[Math.round((71.26 - 70.3) * FPS), "pop", 0.12]], el: (t) => (
    <>
      <Cam dur={126} to={1.05}><Svg bg={<B.Prison />}>
        <Swap t={t(71.26)} a={<Rig c="george_washington" pose="solemn_with_quill" x={620} y={1030} h={600} />} b={<Rig c="george_washington" pose="offers_beer_mug" x={620} y={1030} h={600} stress />} />
        <Rig c="farm_worker" pose="carries_feed_pail" x={1340} y={1040} h={540} at={t(72.07)} />
        <Quill pose="nervous_side_glance" x={1790} y={1150} h={330} enter={{ from: "bottom", frames: 9 }} at={t(73.44)} />
      </Svg></Cam>
      <Cap text="Debtors' Prison" at={t(72.92)} />
    </>) },
  { a: 74.49, b: 77.27, el: (t) => (
    <>
      <Cam dur={83} from={1.0} to={1.02} punch={{ at: 0, frames: 6, to: 1.22, ox: "40%", oy: "45%" }}>
        <Svg bg={<B.Prison />}>
          <Rig c="george_washington" pose="offers_beer_mug" x={760} y={1060} h={700} stress />
          <Rig c="farm_worker" pose="carries_feed_pail" x={1460} y={1060} h={620} at={t(74.76)} />
        </Svg>
      </Cam>
      <Cap text="Beer." at={0} until={t(74.76)} />
      <Cap text="For the debtors." at={t(74.76)} until={t(76.25)} />
      <Cap text="On day one." at={t(76.25)} />
    </>) },
  { a: 77.27, b: 80.17, sfx: [[Math.round((78.74 - 77.27) * FPS), "paper", 0.15]], el: (t) => (
    <>
      <Swap t={t(78.74)} a={<Cam dur={44} to={1.04}><Svg bg={<B.Hills />}><Rig c="george_washington" pose="solemn_with_quill" x={960} y={1030} h={580} stress /></Svg></Cam>}
        b={<Arch src="wash_1795" dur={45} focus={[50, 25]} zoom={[1.02, 1.12]} />} />
      <Cap text="1795" pos="top" at={t(77.48)} />
    </>) },
  { a: 80.17, b: 82.65, sfx: [[Math.round((80.37 - 80.17) * FPS) + 8, "sub_thump", 0.25], [Math.round((80.74 - 80.17) * FPS) + 8, "sub_thump", 0.22]], el: (t) => (
    <>
      <Cam dur={74} to={1.05}><Svg bg={<B.Hills />}>
        <Rig c="george_washington" pose="solemn_with_quill" x={520} y={1030} h={520} />
        <DropBarrel x={1300} y={900} at={t(80.37)} /><DropBarrel x={1560} y={930} at={t(80.74)} s={0.8} />
        <Puff x={1300} y={1050} at={t(80.37) + 8} /><Puff x={1560} y={1050} at={t(80.74) + 8} />
      </Svg></Cam>
      <Cap text="Whiskey Rebellion" at={t(80.37)} />
    </>) },
  { a: 82.65, b: 85.41, sfx: [[Math.round((84.46 - 82.65) * FPS), "pop", 0.12], [Math.round((84.72 - 82.65) * FPS), "pop", 0.12]], el: (t) => (
    <Cam dur={83} to={1.04}><Svg bg={<B.Study />} dim={0.55}>
      <BigText x={520} y={250} text="1789" size={110} at={t(83.16)} />
      <PropImg name="Beer_Tankard" x={520} y={600} w={360} at={t(84.46)} bob />
      <BigText x={960} y={620} text="+" size={170} at={t(84.59)} color="#ffcf4a" />
      <BigText x={1400} y={250} text="1795" size={110} at={t(83.16) + 6} />
      <Barrel x={1400} y={630} at={t(84.72)} />
    </Svg></Cam>) },
  { a: 85.41, b: 86.6, el: () => (
    <Cam dur={36} from={1.15} to={1.2} oy="38%"><Svg bg={<B.Studio />}><Quill pose="deadpan_wings_folded" talk blinkHold x={960} y={1010} h={720} /></Svg></Cam>) },
  { a: 86.6, b: O2, sfx: [[Math.round((88.0 - 86.6) * FPS), "ding", 0.15], [Math.round((90.01 - 86.6) * FPS), "ding", 0.12]], el: (t) => (
    <>
      <Cam dur={172} to={1.05}><Svg bg={<B.Studio />}>
        <Swap t={t(90.01)}
          a={<Quill pose="scoreboard_facing_left" talk x={960} y={1010} h={720}><Board pose="scoreboard_facing_left" top="TURKEYS" big="0" at={t(88.0)} /></Quill>}
          b={<Spr s="Poses/quill/scoreboard_celebration" x={960} y={1010} h={720}><Board pose="scoreboard_celebration" top="TURKEYS" big="0" /></Spr>} />
      </Svg></Cam>
      <Cap text="Turkeys mentioned: 0" pos="top" at={t(87.62)} until={t(88.58)} />
      <Cap text="Scoreboard: open" pos="top" at={t(88.58)} />
    </>) },

  // ======================= 2. ADAMS & JEFFERSON =======================
  { a: O2, b: g2(3.02), el: (t) => (
    <>
      <Cam dur={80} to={1.05}><Svg bg={<B.Study />}>
        <Rig c="john_adams" pose="attentive_neutral" x={620} y={1020} h={560} />
        <Rig c="thomas_jefferson" pose="refuses_arms_folded" x={1300} y={1020} h={570} />
      </Svg></Cam>
      <Card text="Adams & Jefferson" sub="2 · The One Who Said No" until={t(g2(2.9))} />
    </>) },
  { a: g2(3.02), b: g2(5.2), el: (t) => (
    <>
      <Cam dur={65} from={1.3} to={1.36} oy="42%"><Svg bg={<B.Study />}><Rig c="john_adams" pose="announcing_arms_open" x={960} y={1030} h={600} gesture={12} stress /></Svg></Cam>
      <Cap text="John Adams" at={t(g2(3.02))} />
    </>) },
  { a: g2(5.2), b: g2(8.35), sfx: [[2, "paper", 0.15]], el: (t) => (
    <>
      <Cam dur={94} to={1.05}><Svg bg={<B.Study />}>
        <Rig c="john_adams" pose="announcing_arms_open" x={960} y={1030} h={600} gesture={10} stress />
      </Svg></Cam>
      <Cap text="Days of prayer & thanksgiving" pos="top" at={2} size={64} />
      <Cap text="Fine." at={t(g2(7.35))} until={t(g2(7.68))} />
      <Cap text="Normal." at={t(g2(7.68))} />
    </>) },
  { a: g2(8.35), b: g2(10.01), el: (t) => (
    <>
      <Cam dur={50} to={1.04}><Svg bg={<B.Study />}>
        <Rig c="john_adams" pose="attentive_neutral" x={480} y={1030} h={560} />
        <Rig c="thomas_jefferson" pose="refuses_arms_folded" x={2050} y={1030} h={570} walk={-1} flip walkUntil={t(g2(9.6))} />
      </Svg></Cam>
      <Cap text="Thomas Jefferson" at={t(g2(8.78))} />
    </>) },
  { a: g2(10.01), b: g2(12.28), sfx: [[Math.round(1.05 * FPS), "pop", 0.12]], el: (t) => (
    <Cam dur={68} from={1.04} to={1.08} oy="40%"><Svg bg={<B.Study />}>
      <Swap t={t(g2(11.05)) + 4} a={<Rig c="john_adams" pose="attentive_neutral" x={560} y={1050} h={620} />} b={<Rig c="john_adams" pose="puzzled_reaction" x={560} y={1050} h={620} />} />
      <Rig c="thomas_jefferson" pose="firm_stop_gesture" x={1330} y={1050} h={640} stress />
      <Bubble x={1220} y={250} text="NO THANK YOU." tx={1300} ty={380} at={t(g2(11.05))} w={560} size={58} />
    </Svg></Cam>) },
  { a: g2(12.28), b: g2(14.0), sfx: [[Math.round((g2(13.47) - g2(12.28)) * FPS), "boing", 0.1]], el: (t) => (
    <Cam dur={52} to={1.06}><Svg bg={<B.PlateBg color="#e88a3a" />}><Pie x={960} y={620} at={2} heart /></Svg></Cam>) },
  { a: g2(14.0), b: g2(17.87), el: () => (
    <Cam dur={116} from={1.2} to={1.26} oy="40%"><Svg bg={<B.Study />}><Rig c="thomas_jefferson" pose="refuses_arms_folded" x={960} y={1030} h={620} stress /></Svg></Cam>) },
  { a: g2(17.87), b: g2(19.78), sfx: [[Math.round((g2(18.25) - g2(17.87)) * FPS), "pop", 0.12]], el: (t) => (
    <Cam dur={57} to={1.04}><Svg bg={<B.PlateBg />}><ChurchState at={2} /></Svg></Cam>) },
  { a: g2(19.78), b: g2(24.3), sfx: [[Math.round((g2(21.84) - g2(19.78)) * FPS), "sub_thump", 0.15], [Math.round((g2(21.84) - g2(19.78)) * FPS) + 14, "sub_thump", 0.15]], el: (t) => (
    <>
      <Cam dur={136} to={1.05}><Svg bg={<B.PlateBg />}><ChurchState at={0} wallFrom={t(g2(21.84))} /></Svg></Cam>
      <Cap text={'"A wall of separation"'} at={t(g2(21.84))} />
    </>) },
  { a: g2(24.3), b: g2(25.14), sfx: [[Math.round((g2(24.53) - g2(24.3)) * FPS), "pop", 0.12]], el: (t) => (
    <Cam dur={25} from={1.12} to={1.16} oy="35%"><Svg bg={<B.Studio />}>
      <Quill pose="speaking_facing_right" talk x={960} y={1010} h={720} /><QMarks x={960} y={360} at={t(g2(24.53))} spread={330} />
    </Svg></Cam>) },
  { a: g2(25.14), b: g2(30.47), sfx: [[Math.round((g2(28.94) - g2(25.14)) * FPS), "paper", 0.15]], el: (t) => (
    <>
      <Arch src="jefferson_peale" mode="portrait" dur={160} focus={[50, 35]} zoom={[1, 1.1]} />
      <Cap text="Governor of Virginia" at={t(g2(25.3))} until={t(g2(26.57))} />
      <Cap text="1779" at={t(g2(26.57))} until={t(g2(28.94))} />
      <Cap text="Declared a day of thanksgiving" at={t(g2(28.94))} />
    </>) },
  { a: g2(30.47), b: g2(32.17), sfx: [[Math.round((g2(31.45) - g2(30.47)) * FPS) + 6, "sub_thump", 0.3]], el: (t) => (
    <>
      <Cam dur={51} to={1.04} punch={{ at: t(g2(31.3)), frames: 5, to: 1.25, oy: "40%" }}><Svg bg={<B.Study />}><Rig c="thomas_jefferson" pose="refuses_arms_folded" x={960} y={1060} h={680} /></Svg></Cam>
      <Cap text="As president" pos="top" at={0} until={t(g2(31.45))} />
      <Stamp lines={["REFUSED"]} at={t(g2(31.45))} x={1450} y={260} rot={-12} variant="dark" />
    </>) },
  { a: g2(32.17), b: g2(35.49), sfx: [[Math.round((g2(33.4) - g2(32.17)) * FPS), "sub_thump", 0.15]], el: (t) => {
    const Fed: React.FC = () => { const f = useCurrentFrame(); return f < t(g2(33.4)) ? null : <BigText x={960} y={950} text="FEDERAL: NO" size={90} color="#ff6b5a" />; };
    return <Cam dur={100} to={1.04}><Svg bg={<B.PlateBg />}>
      <StateGrid labels={["VA ✓", "NY ✓", "MA ✓", "CT ✓", "PA ✓", "NJ ✓", "NH ✓", "MD ✓", "SC ✓", "NC ✓", "GA ✓", "DE ✓", "RI ✓", "VT ✓"]} at={2} color={() => "#d8f0c8"} />
      <BigText x={960} y={210} text="STATES: YES" size={90} at={2} color="#bff07a" /><Fed />
    </Svg></Cam>;
  } },
  { a: g2(35.49), b: g2(37.58), sfx: [[Math.round((g2(37.06) - g2(35.49)) * FPS), "pop", 0.12], [Math.round((g2(37.06) - g2(35.49)) * FPS) + 8, "pop", 0.12]], el: (t) => (
    <Cam dur={63} to={1.05}><Svg bg={<B.Chamber />}>
      <Rig c="john_adams" pose="announcing_arms_open" x={330} y={1060} h={480} gesture={12} />
      <Rig c="elias_boudinot" pose="eager_greeting" x={1600} y={1060} h={480} flip gesture={10} />
      <Swap t={t(g2(37.06)) + 4} a={<Rig c="thomas_jefferson" pose="refuses_arms_folded" x={960} y={1030} h={560} />} b={<Rig c="thomas_jefferson" pose="sheepishly_cuts_letter" x={960} y={1030} h={560} />} />
      <Bubble x={420} y={330} text="ATHEIST!" tx={360} ty={560} at={t(g2(37.06))} w={380} />
      <Bubble x={1500} y={300} text="ATHEIST!" tx={1580} ty={560} at={t(g2(37.06)) + 8} w={380} />
    </Svg></Cam>) },
  { a: g2(37.58), b: g2(39.98), sfx: [[Math.round((g2(37.8) - g2(37.58)) * FPS), "scribble", 0.15]], el: (t) => (
    <>
      <Cam dur={72} to={1.05}><Svg bg={<B.Study />}>
        <Rig c="thomas_jefferson" pose="refuses_arms_folded" x={520} y={1040} h={600} stress />
        <Note x={1220} y={500} text="Dear Citizens…" at={t(g2(37.8))} w={760} rot={3} />
        <PropImg name="Quill_and_Inkpot" x={1640} y={860} w={200} at={0} />
      </Svg></Cam>
      <Cap text="A public explanation" at={t(g2(38.65))} />
    </>) },
  { a: g2(39.98), b: g2(45.03), el: (t) => (
    <>
      <Cam dur={152} to={1.05}><Svg bg={<B.Study />}>
        <Rig c="thomas_jefferson" pose="refuses_arms_folded" x={560} y={1040} h={600} />
        <Swap t={t(g2(40.95))} a={<Rig c="levi_lincoln_sr" pose="cautious_lean" x={1350} y={1040} h={600} />} b={<Rig c="levi_lincoln_sr" pose="warning_finger" x={1350} y={1040} h={600} stress />} />
        <Bubble x={1400} y={200} text="NEW ENGLAND WON'T LIKE IT!" tx={1370} ty={420} at={t(g2(41.9))} w={760} size={42} />
      </Svg></Cam>
      <Cap text="Levi Lincoln Sr." at={t(g2(39.98))} until={t(g2(40.95))} />
      <Cap text="Attorney General" at={t(g2(40.95))} until={t(g2(41.9))} />
    </>) },
  { a: g2(45.03), b: g2(48.1), sfx: [[Math.round((g2(46.23) - g2(45.03)) * FPS), "paper", 0.18]], el: (t) => (
    <Cam dur={92} from={1.05} to={1.1} oy="45%"><Svg bg={<B.Study />}>
      <Swap t={t(g2(46.23))} a={<Rig c="thomas_jefferson" pose="refuses_arms_folded" x={960} y={1050} h={660} />} b={<Rig c="thomas_jefferson" pose="sheepishly_cuts_letter" x={960} y={1050} h={660} stress />} />
    </Svg></Cam>) },
  { a: g2(48.1), b: g2(52.1), sfx: [[Math.round((g2(50.24) - g2(48.1)) * FPS), "pop", 0.12]], el: (t) => (
    <>
      <Cam dur={120} to={1.05}><Svg bg={<B.Study />}>
        <Swap t={t(g2(50.24))} a={<Rig c="james_madison" pose="reads_proclamation" x={900} y={1040} h={620} stress />} b={<Rig c="james_madison" pose="presents_proclamation" x={900} y={1040} h={620} stress />} />
      </Svg></Cam>
      <Cap text="James Madison" at={t(g2(48.1))} until={t(g2(51.17))} />
      <Cap text="1815" at={t(g2(51.17))} />
    </>) },
  { a: g2(52.1), b: g2(55.46), el: (t) => (
    <>
      <Cam dur={101} to={1.04}><Svg bg={<B.PlateBg />}>
        <StateGrid labels={["NOV 25", "DEC 4", "NOV 27", "DEC 10", "NOV 18", "NOV 30", "DEC 2", "NOV 29", "—", "NOV 26", "DEC 7", "NOV 24", "NOV 20", "—"]} at={4} />
      </Svg></Cam>
      <Cap text="Up to the states" pos="top" at={t(g2(53.84))} />
    </>) },
  { a: g2(55.46), b: g2(58.99), sfx: [[Math.round((g2(58.02) - g2(55.46)) * FPS) + 6, "sub_thump", 0.3]], el: (t) => (
    <>
      <Cam dur={106} to={1.06}><Svg bg={<B.PlateBg color="#c0392b" />}><Chaos /></Svg></Cam>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <BigText x={960} y={300} text="DIFFERENT STATES." size={110} at={0} />
        <BigText x={960} y={560} text="DIFFERENT DAYS." size={110} at={t(g2(56.72))} />
      </svg>
      <Stamp lines={["TOTAL", "CHAOS"]} at={t(g2(58.02))} x={960} y={820} rot={-6} variant="dark" />
    </>) },
  { a: g2(58.99), b: g2(62.05), el: () => (
    <Cam dur={92} to={1.04}><Svg bg={<B.Studio />}><Quill pose="speaking_facing_right" talk x={960} y={1010} h={720} /></Svg></Cam>) },

  // ======================= 3. SARAH JOSEPHA HALE =======================
  { a: g2(62.05), b: g2(65.19), el: (t) => (
    <>
      <Cam dur={94} to={1.05}><Svg bg={<B.EditorOffice />}><Rig c="sarah_josepha_hale" pose="determined_with_letter" x={960} y={1020} h={560} stress /></Svg></Cam>
      <Card text="Sarah Josepha Hale" sub="3 · The Woman Who Would Not Stop" until={t(g2(65.19)) - 1} />
    </>) },
  { a: g2(65.19), b: g2(69.12), el: (t) => (
    <>
      <Cam dur={118} to={1.04} panX={-30}><Svg bg={<B.Village />}><Rig c="sarah_josepha_hale" pose="determined_with_letter" x={420} y={1030} h={520} walk={1} walkUntil={t(g2(67.6))} /></Svg></Cam>
      <Cap text="New Hampshire" at={t(g2(66.92))} until={t(g2(67.9))} />
      <Cap text="1788" at={t(g2(67.9))} />
    </>) },
  { a: g2(69.12), b: g2(72.82), sfx: [[Math.round((g2(72.28) - g2(69.12)) * FPS), "scribble", 0.15]], el: (t) => (
    <>
      <Cam dur={111} to={1.05}><Svg bg={<B.EditorOffice />}>
        <Rig c="sarah_josepha_hale" pose="tired_writing" x={1000} y={1040} h={600} />
        <Rig c="schoolboy" pose="reaches_left_to_pet" x={420} y={1050} h={330} at={t(g2(70.06))} flip />
        <Rig c="schoolgirl" pose="reaches_right_to_pet" x={250} y={1050} h={320} at={t(g2(70.06))} />
      </Svg></Cam>
      <Cap text="Widowed young" at={t(g2(69.12))} until={t(g2(70.06))} />
      <Cap text="Five children" at={t(g2(70.06))} />
    </>) },
  { a: g2(72.82), b: g2(77.82), sfx: [[Math.round((g2(74.48) - g2(72.82)) * FPS), "pop", 0.12], [Math.round((g2(76.58) - g2(72.82)) * FPS), "pop", 0.12]], el: (t) => (
    <>
      <Cam dur={150} to={1.05}><Svg bg={<B.PlateBg />}>
        <Book x={760} y={560} title={["NORTHWOOD", "", "Mrs. Hale"]} color="#2f4a6b" at={2} art="feast" />
        <Pie x={1400} y={680} at={t(g2(76.58))} />
      </Svg></Cam>
      <Cap text="Anti-slavery novel" pos="top" at={t(g2(73.59))} />
      <Cap text="…with a Thanksgiving feast" at={t(g2(76.58))} size={64} />
    </>) },
  { a: g2(77.82), b: g2(83.26), sfx: [[Math.round((g2(79.28) - g2(77.82)) * FPS), "pop", 0.12]], el: (t) => (
    <>
      <Cam dur={163} to={1.05}><Svg bg={<B.EditorOffice />}>
        <Rig c="sarah_josepha_hale" pose="determined_with_letter" x={680} y={1040} h={620} stress />
        <PopIn at={t(g2(79.28))} x={1400} y={520}><g transform="rotate(4)"><rect x={-205} y={-305} width={410} height={610} fill="#1d1712" /><image href={staticFile("tg2/archive/godeys_cover.jpg")} x={-195} y={-295} width={390} height={590} preserveAspectRatio="xMidYMid slice" style={{ filter: "sepia(0.4)" }} /></g></PopIn>
      </Svg></Cam>
      <Cap text="Editor" pos="top" at={t(g2(78.57))} />
      <Cap text="One of the most-read magazines" at={t(g2(80.87))} size={60} />
    </>) },
  { a: g2(83.26), b: g2(85.26), el: (t) => (
    <>
      <Cam dur={60} from={1.3} to={1.38} oy="45%"><Svg bg={<B.EditorOffice />}><Rig c="sarah_josepha_hale" pose="triumphant_raises_letter" x={960} y={1030} h={600} stress /></Svg></Cam>
      <Cap text="Education for women" at={t(g2(83.96))} />
    </>) },
  { a: g2(85.26), b: g2(90.26), sfx: [[Math.round((g2(88.48) - g2(85.26)) * FPS), "pop", 0.12]], el: (t) => (
    <Cam dur={150} to={1.05}><Svg bg={<B.PlateBg color="#6aa84f" />}>
      <Book x={960} y={540} title={["MARY HAD", "A LITTLE", "LAMB"]} color="#c0392b" at={2} w={420} art="lamb" />
    </Svg></Cam>) },
  { a: g2(90.26), b: g2(90.9), el: () => (
    <><Cam dur={19} from={1.15} to={1.18} oy="38%"><Svg bg={<B.Studio />}><Quill pose="deadpan_wings_folded" talk x={960} y={1010} h={720} /></Svg></Cam><Cap text="Yes. That one." at={0} /></>) },
  { a: g2(90.9), b: g2(93.34), el: (t) => (
    <>
      <Cam dur={73} to={1.05}><Svg bg={<B.EditorOffice />}><Rig c="sarah_josepha_hale" pose="triumphant_raises_letter" x={760} y={1030} h={580} stress /></Svg></Cam>
      <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><BigText x={1300} y={520} text="THANKSGIVING" size={92} at={t(g2(92.41))} color="#ffcf4a" /></svg>
    </>) },
  { a: g2(93.34), b: g2(96.03), sfx: [[2, "pop", 0.12]], el: (t) => (
    <>
      <Cam dur={81} to={1.05}><Svg bg={<WhiteHouseLawn />} dim={0.45}><PopIn at={2} x={960} y={560}><CalendarPage x={0} y={0} month="NOVEMBER" day="1" sub="ONE NATIONAL DAY" w={420} /></PopIn></Svg></Cam>
      <Cap text="For the whole country" at={t(g2(94.79))} />
    </>) },
  { a: g2(96.03), b: g2(101.76), sfx: [0, 1, 2, 3, 4].map((i) => [Math.round((g2(99.67) - g2(96.03)) * FPS) + i * 5, "pop", 0.1] as [number, string, number]), el: (t) => (
    <>
      <Cam dur={172} to={1.04}><Svg bg={<B.LincolnOffice />}>
        <Rig c="sarah_josepha_hale" pose="determined_with_letter" x={300} y={1040} h={520} stress />
        <PolkFrame x={720} y={420} w={180} at={t(g2(99.67))} />
        {PRES.map(([c], i) => <Spr key={c} s={`OLD/${c}/04_Considering_the_petition`} x={980 + i * 230} y={1040} h={420} at={t(g2(99.67)) + (i + 1) * 5} />)}
        <Quill pose="nervous_side_glance" x={1830} y={1160} h={300} enter={{ from: "bottom", frames: 9 }} at={t(g2(100.65))} />
      </Svg></Cam>
      <Cap text="1846 → 1863" pos="top" at={t(g2(96.27))} />
    </>) },
  { a: g2(101.76), b: g2(105.19), sfx: [[0, "scribble", 0.12], [12, "paper", 0.12], [36, "paper", 0.12], [60, "paper", 0.12]], el: (t) => {
    const Stack: React.FC = () => { const f = useCurrentFrame(); return <LetterStack x={1420} y={900} count={Math.min(16, 1 + Math.floor(f / 6))} />; };
    return <>
      <Cam dur={103} to={1.05}><Svg bg={<B.EditorOffice />}><Rig c="sarah_josepha_hale" pose="tired_writing" x={700} y={1040} h={620} /><Stack /></Svg></Cam>
      <Cap text="17 years" pos="top" at={0} size={110} />
    </>;
  } },
  { a: g2(105.19), b: g2(107.72), sfx: [0, 1, 2, 3, 4].map((i) => [Math.round((g2(106.9) - g2(105.19)) * FPS) + i * 4, "pop", 0.1] as [number, string, number]), el: (t) => (
    <Cam dur={76} to={1.04}><Svg bg={<B.LincolnOffice />}>
      <PolkFrame x={260} y={420} w={200} />
      <Bubble x={260} y={150} text="HMM." tx={260} ty={260} at={t(g2(106.9))} w={250} />
      {PRES.map(([c], i) => (
        <g key={c}><Spr s={`OLD/${c}/04_Considering_the_petition`} x={640 + i * 360} y={1040} h={460} /><Bubble x={640 + i * 360} y={330} text="HMM." tx={640 + i * 360} ty={520} at={t(g2(106.9)) + (i + 1) * 4} w={250} /></g>
      ))}
    </Svg></Cam>) },
  { a: g2(107.72), b: g2(109.77), sfx: [[Math.round((g2(108.37) - g2(107.72)) * FPS), "sub_thump", 0.25]], el: (t) => (
    <><Cam dur={61} to={1.04}><Svg bg={<SplitWar at={t(g2(108.37))} />} /></Cam><Cap text="The Civil War" at={t(g2(108.84))} /></>) },
  { a: g2(109.77), b: g2(116.35), sfx: [[Math.round((g2(112.86) - g2(109.77)) * FPS), "scribble", 0.12], [Math.round((g2(113.76) - g2(109.77)) * FPS), "whoosh", 0.15], [Math.round((g2(115.76) - g2(109.77)) * FPS), "paper", 0.15]], el: (t) => {
    const Fly: React.FC = () => {
      const f = useCurrentFrame(); const s0 = t(g2(113.76)); const tt = Math.min(1, Math.max(0, (f - s0) / 30));
      return f < s0 ? null : <PropImg name="Sealed_Letter" x={760 + tt * 640} y={620 - Math.sin(tt * Math.PI) * 260} w={200} rot={tt * 360} />;
    };
    return <>
      <Cam dur={197} to={1.05}><Svg bg={<B.LincolnOffice />}>
        <Rig c="sarah_josepha_hale" pose="tired_writing" x={560} y={1040} h={600} />
        <Fly />
        <Rig c="abraham_lincoln" pose="weary_reading_hale_letter" x={1460} y={1040} h={620} flip at={t(g2(115.76))} />
      </Svg></Cam>
      <Cap text="September 28, 1863" at={t(g2(110.18))} until={t(g2(115.03))} />
      <Cap text="To: Abraham Lincoln" at={t(g2(115.76))} />
    </>;
  } },
  { a: g2(116.35), b: g2(122.04), sfx: [[1, "paper", 0.15]], el: (t) => (
    <>
      <Arch src="hale_letter" dur={171} focus={[50, 30]} zoom={[1, 1.18]} />
      <Cap text={'"National recognition and authoritive fixation"'} at={t(g2(118.96))} size={56} />
    </>) },
  { a: g2(122.04), b: g2(124.38), sfx: [[Math.round((g2(122.82) - g2(122.04)) * FPS) + 6, "sub_thump", 0.3]], el: (t) => (
    <>
      <Cam dur={70} to={1.05}><Svg bg={<B.LincolnOffice />}>
        <Swap t={t(g2(122.82))} a={<Rig c="abraham_lincoln" pose="weary_reading_hale_letter" x={800} y={1040} h={640} />} b={<Rig c="abraham_lincoln" pose="signs_proclamation" x={800} y={1040} h={640} />} />
      </Svg></Cam>
      <Stamp lines={["YES", "(IN 5 DAYS)"]} at={t(g2(122.82))} x={1400} y={380} rot={-9} variant="dark" />
    </>) },
  { a: g2(124.38), b: g2(130.66) + 0.7, sfx: [[Math.round((g2(124.38) - g2(124.38)) * FPS) + 1, "pop", 0.12], [Math.round((g2(125.79) - g2(124.38)) * FPS), "pop", 0.12]], el: (t) => (
    <Cam dur={210} to={1.05}><Svg bg={<B.EditorOffice />}>
      <Scoreboard x={420} y={330} label="YEARS OF NO" value="17" at={1} />
      <Scoreboard x={1500} y={330} label="DAYS OF YES" value="5" at={t(g2(125.79))} />
      <Swap t={t(g2(127.25))} a={<Rig c="sarah_josepha_hale" pose="tired_writing" x={960} y={1050} h={560} />} b={<Rig c="sarah_josepha_hale" pose="determined_with_letter" x={960} y={1050} h={580} stress />} />
    </Svg></Cam>) },
];

export const Thanksgiving3: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SHOTS.map((s, i) => {
      const from = Math.round(s.a * FPS), to = Math.round(s.b * FPS);
      const t = (sec: number) => Math.round((sec - s.a) * FPS);
      return (
        <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)}>
          <ShotCtx.Provider value={{ offset: s.a }}>{s.el(t)}</ShotCtx.Provider>
          {(s.sfx ?? []).map(([at, name, vol], j) => (
            <Sequence key={j} from={Math.max(0, at)} durationInFrames={60}><Audio src={staticFile(`tg2/sfx/${name}.wav`)} volume={vol ?? 0.15} /></Sequence>
          ))}
        </Sequence>
      );
    })}
    {/* voiceover only — no music bed (user: synthesized music sounded like gameplay) */}
    <Audio src={staticFile("tg2/vo/cold_open_ch1.mp3")} />
    <Sequence from={Math.round(O2 * FPS)}><Audio src={staticFile("tg2/vo/ch2_ch3.mp3")} /></Sequence>
  </AbsoluteFill>
);
