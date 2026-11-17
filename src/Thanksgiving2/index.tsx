import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import * as B from "../Thanksgiving/Backgrounds";
import { Barrel, BigText, CalendarPage, Constitution, Proclamation, PropImg } from "../Thanksgiving/Graphics";
import { MONTSERRAT } from "../fonts";
import { OvalOffice, SkyScroll, WhiteHouseLawn } from "./Bg2";
import COLLARS from "./collars.json";
import { Cam, Cap, Card, Cheer, Note, PopIn, Puff, QMarks, Quill, ShotCtx, Speed, Spr, Stamp, Tag } from "./Kit";

/**
 * "Every President's Thanksgiving Explained": cold open + chapter 1 (VO: cold_open_ch1.mp3, 91.8 s).
 * Built to .claude/skills/2d-animation/references/style-bible.md and src/Thanksgiving2/SCENE_GUIDE.md.
 * Shot times are VO seconds (sentence alignment, ±0.3 s). Characters are pose swaps (no in-betweens),
 * feet registered, rising on stressed beats; Quill lip-syncs only to camera (Flappy rule).
 */
const FPS = 30;
export const TG2_DURATION = Math.round(92.6 * FPS);
const C = COLLARS as unknown as Record<string, number[]>;
const P = (c: string, pose: string) => `Poses/${c}/${pose}`;
const fr = (s: number) => Math.round(s * FPS);

const Svg: React.FC<{ bg: React.ReactNode; dim?: number; tex?: number; children?: React.ReactNode }> = ({ bg, dim = 0, tex, children }) => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
    <B.Defs />
    {bg}
    {dim > 0 && <rect width={1920} height={1080} fill="#0b0f14" opacity={dim} />}
    {children}
    <B.Finish tex={tex} />
  </svg>
);

/** Reusable costume body + head swap: chin seated just inside the collar (Scene_Guide: "above the costume collar"). */
const HB: React.FC<{ body: string; head: string; x: number; y: number; h: number; flip?: boolean; stress?: boolean; bounce?: number }> = ({ body, head, x, y, h, flip, stress, bounce = 0 }) => {
  const f = useCurrentFrame();
  const [cx, ctop] = C[body];
  const [hcx, hbot, , hh] = C[`HEAD/${head}`];
  const bodyH = 474 - ctop;            // body drawing height in sprite px
  const k = (h * 0.6) / bodyH;          // body takes ~60% of the figure, head ~45% (overlap at collar)
  const hk = (bodyH * 0.74) / Math.max(hh, 290);
  const jump = bounce ? -Math.abs(Math.sin((f / 7) * Math.PI)) * bounce : 0;
  return (
    <g transform={`translate(${x} ${y + jump}) scale(${flip ? -1 : 1} 1)`}>
      <g transform={`scale(${k})`}>
        <g transform={`translate(${-cx} ${-474})`}>
          <image href={staticFile(`tg2/Reusable_Bodies/${body}.png`)} width={512} height={512} />
          <g transform={`translate(${cx} ${ctop + hh * hk * 0.07}) scale(${hk}) translate(${-hcx} ${-hbot})`}>
            <image href={staticFile(`tg2/Head_Swaps/${head}/head_swap.png`)} width={512} height={512} />
          </g>
        </g>
      </g>
    </g>
  );
};

/** Quill's chalkboard text, drawn in the scoreboard pose's own sprite space. */
const Board: React.FC<{ rect: [number, number, number, number]; top: string; big: string; at?: number }> = ({ rect, top, big, at = 0 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const [x0, y0, x1, y1] = rect;
  const cx = (x0 + x1) / 2;
  return (
    <g fontFamily={MONTSERRAT} fontWeight={800} fill="#f4f1ea" textAnchor="middle">
      <text x={cx} y={y0 + 22} fontSize={15}>{top}</text>
      <text x={cx} y={y1 - 12} fontSize={52}>{big}</text>
    </g>
  );
};

type Shot = { a: number; b: number; el: () => React.ReactNode; sfx?: [number, string, number?][] };
const s2f = (shotStart: number, t: number) => fr(t - shotStart);

const SHOTS: Shot[] = [
  // ================= COLD OPEN =================
  { a: 0, b: 5.88, sfx: [[fr(1.9) + 8, "thud", 0.9], [fr(3.0), "rattle", 0.7], [fr(4.6), "boing", 0.45]], el: () => {
    const F: React.FC = () => {
      const f = useCurrentFrame();
      const reveal = f >= fr(4.6);
      return (
        <>
          <Cam dur={176} to={1.03} punch={{ at: fr(4.6), frames: 8, to: 1.35, ox: "64%", oy: "78%" }}>
            <Svg bg={<WhiteHouseLawn />}>
              <Spr s={P("calvin_coolidge", reveal ? "hesitates_at_delivery" : "unimpressed_arms_folded")} x={560} y={1000} h={560} stress />
              {!reveal && <Spr s="Poses/poultry_props/vose_express_shipment_box" x={1240} y={990} h={300} at={fr(1.9)} drop={{ frames: 8, height: 900 }} shake={f > fr(3.0) ? 4 : 0} />}
              {reveal && <Spr s={P("rebecca", "startled_in_shipping_crate")} x={1240} y={990} h={330} />}
              <Puff x={1240} y={990} at={fr(1.9) + 8} />
            </Svg>
          </Cam>
          <Cap text="1926" pos="top" at={8} />
        </>
      );
    };
    return <F />;
  } },
  { a: 5.88, b: 6.64, sfx: [[2, "paper", 0.7]], el: () => (
    <Cam dur={23} from={1.25} to={1.3} ox="64%" oy="78%">
      <Svg bg={<WhiteHouseLawn />}>
        <Spr s={P("rebecca", "startled_in_shipping_crate")} x={1240} y={990} h={330} />
        <PopIn at={2} x={1420} y={780}><g transform="rotate(8)"><rect x={-80} y={-55} width={160} height={110} fill="#f6ecd2" stroke="#1d1712" strokeWidth={6} />{[0, 1, 2].map((i) => <line key={i} x1={-55} x2={55} y1={-20 + i * 22} y2={-20 + i * 22} stroke="#7a6a5a" strokeWidth={4} />)}</g></PopIn>
      </Svg>
    </Cam>) },
  { a: 6.64, b: 9.15, el: () => (
    <Cam dur={75} to={1.04}>
      <Svg bg={<WhiteHouseLawn />} dim={0.5}><Note x={960} y={560} text="Please eat this." at={s2f(6.64, 7.95)} /></Svg>
    </Cam>), sfx: Array.from({ length: 16 }, (_, i) => [s2f(6.64, 7.95) + i * 2, "type_tick", 0.5] as [number, string, number]) },
  { a: 9.15, b: 11.91, el: () => (
    <Cam dur={83} to={1.04} punch={{ at: s2f(9.15, 9.7), frames: 8, to: 1.18, ox: "35%", oy: "45%" }}>
      <Svg bg={<OvalOffice />}>
        <Spr s={P("calvin_coolidge", "hesitates_at_delivery")} x={640} y={1010} h={600} stress />
        <Spr s={P("rebecca", "startled_in_shipping_crate")} x={1330} y={1000} h={330} />
      </Svg>
    </Cam>) },
  { a: 11.91, b: 13.75, sfx: [[s2f(11.91, 12.35), "pop", 0.6], [s2f(11.91, 13.0), "pop", 0.6]], el: () => (
    <Cam dur={55} to={1.05}>
      <Svg bg={<WhiteHouseLawn />}>
        <Spr s={P("rebecca", "sits_with_red_collar")} x={960} y={1000} h={480} stress />
        <Tag name="rebecca" x={960} y={400} w={520} at={s2f(11.91, 12.35)} rot={-4} />
        <Tag name="rebecca_collar" x={1330} y={740} w={480} at={s2f(11.91, 13.0)} rot={6} />
      </Svg>
    </Cam>) },
  { a: 13.75, b: 14.72, el: () => (
    <Cam dur={29} from={1.02} to={1.08} ox="60%" oy="40%">
      <Svg bg={<WhiteHouseLawn />}><Spr s={P("rebecca", "peeks_from_tree_house")} x={1180} y={1030} h={760} /></Svg>
    </Cam>) },
  { a: 14.72, b: 17.6, el: () => (
    <Cam dur={86} to={1.05}>
      <Svg bg={<OvalOffice />}><Spr s={P("calvin_coolidge", "content_with_rebecca")} x={960} y={1020} h={600} /></Svg>
    </Cam>) },
  { a: 17.6, b: 20.68, sfx: [[0, "whoosh", 0.7]], el: () => (
    <Cam dur={92} to={1.04}>
      <Svg bg={<SkyScroll />}>
        <Speed x={1200} y={560} frames={8} dir={-1} />
        <Spr s={P("supreme_ii", "jaunty_in_flying_gear")} x={960} y={860} h={560} enter={{ from: "right", frames: 8 }} />
      </Svg>
    </Cam>) },
  { a: 20.68, b: 22.75, el: () => (
    <Cam dur={62} from={1.0} to={1.04}><Svg bg={<B.Studio />}><Quill pose="speaking_facing_right" talk x={960} y={1010} h={720} /></Svg></Cam>) },
  { a: 22.75, b: 26.38, sfx: [[s2f(22.75, 24.1), "pop", 0.6]], el: () => (
    <Cam dur={109} to={1.04}>
      <Svg bg={<B.Studio />}>
        <Quill pose="speaking_facing_right" talk x={560} y={1010} h={680} />
        <BigText x={1260} y={430} text="EVERY PRESIDENT'S" size={86} at={s2f(22.75, 24.1)} />
        <BigText x={1260} y={560} text="THANKSGIVING" size={120} at={s2f(22.75, 24.1) + 3} color="#ffcf4a" />
      </Svg>
    </Cam>) },
  // montage: proclamations, feuds, calendar crisis, aviation turkey, birds who were almost dinner
  { a: 26.38, b: 27.4, sfx: [[2, "scribble", 0.6]], el: () => (
    <Cam dur={31} from={1.05} to={1.1}><Svg bg={<B.Study />}><Spr s={P("george_washington", "signing_proclamation")} x={960} y={1030} h={640} /></Svg></Cam>) },
  { a: 27.4, b: 28.0, el: () => (
    <Cam dur={18} from={1.04} to={1.08}><Svg bg={<B.Chamber />}>
      <Spr s={P("john_adams", "announcing_arms_open")} x={620} y={1030} h={580} />
      <Spr s={P("thomas_jefferson", "firm_stop_gesture")} x={1320} y={1030} h={580} />
    </Svg></Cam>) },
  { a: 28.0, b: 29.4, sfx: [[fr(0.7), "paper", 0.7]], el: () => {
    const Cal: React.FC = () => { const f = useCurrentFrame(); return <CalendarPage x={720} y={540} month="NOVEMBER" day={f < fr(0.7) ? "30" : "23"} sub="THURSDAY" w={420} rot={-4} />; };
    return <Cam dur={42} to={1.05}><Svg bg={<OvalOffice />} dim={0.45}><Cal /><Spr s={P("franklin_d_roosevelt", "confident_date_change")} x={1420} y={1030} h={560} /></Svg></Cam>;
  } },
  { a: 29.4, b: 31.9, sfx: [[0, "whoosh", 0.7]], el: () => (
    <Cam dur={75} to={1.04}><Svg bg={<SkyScroll />}>
      <Speed x={1150} y={560} frames={8} dir={-1} />
      <Spr s={P("supreme_ii", "jaunty_in_flying_gear")} x={960} y={880} h={600} enter={{ from: "right", frames: 8 }} />
    </Svg></Cam>) },
  { a: 31.9, b: 34.31, sfx: [[1, "pop", 0.5], [8, "pop", 0.5], [15, "pop", 0.5], [22, "pop", 0.5], [s2f(31.9, 33.5), "sub_thump", 0.8]], el: () => {
    const L: React.FC = () => {
      const f = useCurrentFrame();
      const scared = f >= s2f(31.9, 33.5);
      const birds: [string, string, string][] = [
        ["brown_turkey", "standing_alert", "nervous_beak_open"],
        ["white_ceremony_turkey", "standing_with_blank_sign", "nervous_side_glance"],
        ["jack", "standing_alert", "tucks_wings_for_hug"],
        ["brown_turkey", "standing_alert", "nervous_beak_open"],
      ];
      return <>{birds.map(([c, a, n], i) => <Spr key={i} s={P(c, scared ? n : a)} x={330 + i * 420} y={1010} h={400} at={1 + i * 7} flip={i % 2 === 1} />)}</>;
    };
    return <Cam dur={72} to={1.05}><Svg bg={<WhiteHouseLawn />}><L /></Svg></Cam>;
  } },
  { a: 34.31, b: 35.1, el: () => (
    <Cam dur={24} from={1.1} to={1.14} oy="40%"><Svg bg={<B.Studio />}><Quill pose="nervous_side_glance" talk x={960} y={1010} h={720} /></Svg></Cam>) },
  { a: 35.1, b: 36.05, sfx: [[s2f(35.1, 35.5), "ding", 0.4]], el: () => (
    <Cam dur={29} to={1.04}><Svg bg={<B.Studio />}>
      <Quill pose="scoreboard_facing_left" talk x={960} y={1010} h={720}>
        <Board rect={[185, 345, 305, 420]} top="TURKEYS" big="0" at={s2f(35.1, 35.5)} />
      </Quill>
    </Svg></Cam>) },

  // ================= 1. GEORGE WASHINGTON: THE FIRST ONE =================
  { a: 36.05, b: 38.64, el: () => (
    <>
      <Cam dur={78} to={1.05}><Svg bg={<B.FederalHall />}><Spr s={P("george_washington", "solemn_with_quill")} x={960} y={1010} h={560} stress /></Svg></Cam>
      <Card text="George Washington" sub="1 · The First One" until={fr(2.3)} />
    </>) },
  { a: 38.64, b: 40.54, el: () => (
    <>
      <Cam dur={57} to={1.05} oy="70%"><Svg bg={<B.FederalHall />}>
        <Spr s="OLD/congressional_delegate/01_Front_view" x={260} y={1010} h={330} walk={3} />
        <Spr s="OLD/congressional_delegate/02_Three_quarter_neutral" x={1640} y={1020} h={340} walk={-2} />
      </Svg></Cam>
      <Cap text="1789" pos="top" at={4} />
    </>) },
  { a: 40.54, b: 42.08, sfx: [[1, "pop", 0.6]], el: () => (
    <Cam dur={46} to={1.05}><Svg bg={<B.FederalHall />} dim={0.5}><Constitution x={960} y={540} at={1} /></Svg></Cam>) },
  { a: 42.08, b: 44.39, sfx: [[s2f(42.08, 43.2), "cheer", 0.6]], el: () => {
    const Crowd: React.FC = () => {
      const f = useCurrentFrame();
      const hype = f >= s2f(42.08, 43.2);
      return (
        <>
          <HB body="18th_century_tailcoat/open_hand_gesture" head="john_adams" x={330} y={1040} h={520} bounce={hype ? 40 : 0} />
          <Spr s={hype ? "OLD/congressional_delegate/04_Voting_aye" : "OLD/congressional_delegate/02_Three_quarter_neutral"} x={720} y={1040} h={480} />
          <HB body="18th_century_tailcoat/neutral" head="james_madison" x={1110} y={1040} h={500} bounce={hype ? 30 : 0} />
          <Spr s={P("elias_boudinot", "eager_greeting")} x={1520} y={1040} h={520} />
          {hype && <Cheer x={260} y={360} w={1400} />}
        </>
      );
    };
    return <Cam dur={69} to={1.04} punch={{ at: s2f(42.08, 43.2), frames: 8, to: 1.12, oy: "60%" }}><Svg bg={<B.Chamber />}><Crowd /></Svg></Cam>;
  } },
  { a: 44.39, b: 47.3, el: () => (
    <>
      <Cam dur={87} to={1.05}><Svg bg={<B.Chamber />}>
        <Spr s={P("elias_boudinot", "eager_greeting")} x={900} y={1030} h={600} stress />
        <Quill pose="deadpan_wings_folded" blinkHold x={200} y={1140} h={360} enter={{ from: "bottom", frames: 9 }} at={s2f(44.39, 46.4)} />
      </Svg></Cam>
      <Cap text="Elias Boudinot" at={s2f(44.39, 45.3)} until={s2f(44.39, 46.3)} />
      <Cap text="New Jersey" at={s2f(44.39, 46.3)} />
    </>) },
  { a: 47.3, b: 51.34, sfx: [[2, "paper", 0.6]], el: () => (
    <Cam dur={121} to={1.04}><Svg bg={<B.Chamber />}>
      <Spr s={P("elias_boudinot", "offers_petition")} x={620} y={1030} h={600} stress />
      <Spr s={P("john_adams", "attentive_neutral")} x={1240} y={1030} h={560} flip />
      <Spr s={P("james_madison", "standing_neutral")} x={1620} y={1030} h={560} flip />
    </Svg></Cam>) },
  { a: 51.34, b: 54.16, el: () => (
    <Cam dur={85} to={1.04}><Svg bg={<B.FederalHall />}>
      <Spr s="OLD/congressional_delegate/05_Carrying_a_letter" x={240} y={1030} h={480} walk={7} />
      <Spr s={P("george_washington", "solemn_with_quill")} x={1580} y={1020} h={540} flip />
    </Svg></Cam>) },
  { a: 54.16, b: 58.98, sfx: [[fr(0.9), "scribble", 0.7], [fr(2.6), "scribble", 0.6]], el: () => (
    <>
      <Cam dur={145} to={1.06} oy="60%"><Svg bg={<B.Study />}><Spr s={P("george_washington", "signing_proclamation")} x={960} y={1030} h={680} stress /></Svg></Cam>
      <Cap text="October 3, 1789" at={s2f(54.16, 54.9)} />
    </>) },
  { a: 58.98, b: 63.16, sfx: [[1, "paper", 0.7], [s2f(58.98, 59.4), "pop", 0.5]], el: () => (
    <Cam dur={125} to={1.04}><Svg bg={<B.Study />} dim={0.5}>
      <Proclamation x={680} y={545} year="New York, 1789" lines={["", "", "Thursday, the 26th", "of November", "a day of public", "thanksgiving & prayer", ""]} />
      <CalendarPage x={1420} y={560} month="NOVEMBER" day="26" sub="THURSDAY" rot={6} w={360} />
    </Svg></Cam>) },
  { a: 63.16, b: 66.18, sfx: [[s2f(63.16, 64.0) + 6, "sub_thump", 1]], el: () => (
    <>
      <Cam dur={90} from={1.0} to={1.03} punch={{ at: s2f(63.16, 63.9), frames: 5, to: 1.3, ox: "50%", oy: "40%" }}>
        <Svg bg={<B.FederalHall />}><Spr s={P("george_washington", "solemn_with_quill")} x={960} y={1030} h={600} stress /></Svg>
      </Cam>
      <Stamp lines={["THE FIRST", "NATIONAL", "THANKSGIVING"]} at={s2f(63.16, 64.0)} x={500} y={280} rot={-9} variant="red" darken={false} />
    </>) },
  { a: 66.18, b: 69.04, sfx: [[s2f(66.18, 68.2), "pop", 0.5]], el: () => (
    <Cam dur={86} to={1.04}><Svg bg={<B.Studio />}>
      <Quill pose="speaking_facing_right" talk x={960} y={1010} h={720} />
      <QMarks x={960} y={380} at={s2f(66.18, 68.2)} spread={330} />
    </Svg></Cam>) },
  { a: 69.04, b: 71.42, el: () => (
    <>
      <Cam dur={71} to={1.05} oy="45%"><Svg bg={<B.Chapel />}><Spr s={P("george_washington", "solemn_with_quill")} x={420} y={1040} h={500} walk={4} /></Svg></Cam>
      <Cap text="St. Paul's Chapel" at={s2f(69.04, 69.9)} until={s2f(69.04, 70.8)} />
      <Cap text="New York" at={s2f(69.04, 70.8)} />
    </>) },
  { a: 71.42, b: 75.5, sfx: [[s2f(71.42, 72.6), "pop", 0.5]], el: () => (
    <>
      <Cam dur={122} to={1.05}><Svg bg={<B.Prison />}>
        <Spr s={P("george_washington", "offers_beer_mug")} x={640} y={1030} h={600} stress />
        <Spr s="OLD/debtor/04_Reaching_for_food" x={1340} y={1040} h={520} flip at={s2f(71.42, 72.6)} />
        <Quill pose="nervous_side_glance" x={1780} y={1150} h={340} enter={{ from: "bottom", frames: 9 }} at={s2f(71.42, 74.2)} />
      </Svg></Cam>
      <Cap text="Debtors' Prison" at={s2f(71.42, 73.8)} />
    </>) },
  { a: 75.5, b: 77.42, sfx: [[0, "cheer", 0.45]], el: () => (
    <>
      <Cam dur={58} from={1.0} to={1.02} punch={{ at: 0, frames: 6, to: 1.2, oy: "45%" }}>
        <Svg bg={<B.Prison />}><Spr s="OLD/debtor/05_Holding_beer_and_bread" x={960} y={1060} h={720} stress /></Svg>
      </Cam>
      <Cap text="Beer." at={0} until={s2f(75.5, 76.05)} />
      <Cap text="For the debtors." at={s2f(75.5, 76.05)} until={s2f(75.5, 76.75)} />
      <Cap text="On day one." at={s2f(75.5, 76.75)} />
    </>) },
  { a: 77.42, b: 80.2, sfx: [[s2f(77.42, 78.4), "paper", 0.6]], el: () => (
    <>
      <Cam dur={83} to={1.05}><Svg bg={<B.Hills />}>
        <Spr s={P("george_washington", "solemn_with_quill")} x={760} y={1030} h={560} stress />
        <Proclamation x={1400} y={560} w={330} title="1795" at={s2f(77.42, 78.4)} />
      </Svg></Cam>
      <Cap text="1795" pos="top" at={6} />
    </>) },
  { a: 80.2, b: 83.41, sfx: [[10 + 8, "sub_thump", 0.9], [19 + 8, "sub_thump", 0.8]], el: () => (
    <>
      <Cam dur={96} to={1.05}><Svg bg={<B.Hills />}>
        <Spr s={P("george_washington", "solemn_with_quill")} x={520} y={1030} h={520} />
        <DropBarrel x={1300} y={900} at={10} /><DropBarrel x={1560} y={930} at={19} s={0.8} />
        <Puff x={1300} y={1050} at={18} /><Puff x={1560} y={1050} at={27} />
      </Svg></Cam>
      <Cap text="Whiskey Rebellion" at={s2f(80.2, 80.9)} />
    </>) },
  { a: 83.41, b: 86.22, sfx: [[s2f(83.41, 84.8), "pop", 0.5], [s2f(83.41, 85.6), "pop", 0.5]], el: () => (
    <Cam dur={84} to={1.04}><Svg bg={<B.Study />} dim={0.55}>
      <BigText x={520} y={250} text="1789" size={110} at={s2f(83.41, 84.8)} />
      <PropImg name="Beer_Tankard" x={520} y={600} w={360} at={s2f(83.41, 84.8)} bob />
      <BigText x={960} y={620} text="+" size={170} at={s2f(83.41, 85.2)} color="#ffcf4a" />
      <BigText x={1400} y={250} text="1795" size={110} at={s2f(83.41, 85.6)} />
      <Barrel x={1400} y={630} at={s2f(83.41, 85.6)} />
    </Svg></Cam>) },
  { a: 86.22, b: 87.87, el: () => (
    <Cam dur={50} from={1.15} to={1.2} oy="38%"><Svg bg={<B.Studio />}><Quill pose="deadpan_wings_folded" talk blinkHold x={960} y={1010} h={720} /></Svg></Cam>) },
  { a: 87.87, b: 92.6, sfx: [[s2f(87.87, 88.9), "ding", 0.5], [s2f(87.87, 90.3), "ding", 0.4]], el: () => {
    const Q: React.FC = () => {
      const f = useCurrentFrame();
      const cele = f >= s2f(87.87, 90.3);
      return cele ? (
        <Spr s="Poses/quill/scoreboard_celebration" x={960} y={1010} h={720}>
          <Board rect={[182, 336, 296, 414]} top="TURKEYS" big="0" />
        </Spr>
      ) : (
        <Quill pose="scoreboard_facing_left" talk x={960} y={1010} h={720}>
          <Board rect={[185, 345, 305, 420]} top="TURKEYS" big="0" at={s2f(87.87, 88.9)} />
        </Quill>
      );
    };
    return (
      <>
        <Cam dur={142} to={1.05}><Svg bg={<B.Studio />}><Q /></Svg></Cam>
        <Cap text="Turkeys mentioned: 0" pos="top" at={s2f(87.87, 88.9)} until={s2f(87.87, 89.7)} />
        <Cap text="Scoreboard: open" pos="top" at={s2f(87.87, 89.7)} />
      </>
    );
  } },
];

/** Whiskey barrel falling in (8 f ease-out) — style bible money/crate drop. */
const DropBarrel: React.FC<{ x: number; y: number; at: number; s?: number }> = ({ x, y, at, s = 1 }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = Math.min(1, (f - at) / 8);
  const e = 1 - (1 - p) ** 2;
  return <g transform={`translate(0 ${-(1 - e) * 900})`}><Barrel x={x} y={y} s={s} /></g>;
};

export const Thanksgiving2: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SHOTS.map((s, i) => {
      const from = fr(s.a), to = fr(s.b);
      return (
        <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)}>
          <ShotCtx.Provider value={{ offset: s.a }}>{s.el()}</ShotCtx.Provider>
          {(s.sfx ?? []).map(([at, name, vol], j) => (
            <Sequence key={j} from={at} durationInFrames={60}><Audio src={staticFile(`tg2/sfx/${name}.wav`)} volume={vol ?? 0.55} /></Sequence>
          ))}
        </Sequence>
      );
    })}
    <Audio src={staticFile("tg2/vo/cold_open_ch1.mp3")} />
    {/* music bed ~18 dB under the VO; drops out just before the crate reveal (style bible §10) */}
    <Audio src={staticFile("tg2/sfx/music_bed.mp3")} volume={(f) => (f >= fr(4.2) && f < fr(4.6) ? 0.01 : 0.07)} />
  </AbsoluteFill>
);
