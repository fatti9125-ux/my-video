import React from "react";
import { useCurrentFrame } from "remotion";
import * as B from "../Thanksgiving/Backgrounds";
import { BigText, CalendarPage, StateGrid } from "../Thanksgiving/Graphics";
import { Avenue, DiningRoom, OvalOffice, SkyScroll, TrainCar, WhiteHouseLawn } from "./Bg2";
import { Board, Episode, epDuration, makeAlign, Over, Shot, Steps, Svg, Swap } from "./Episode";
import { Arch, Cam, Cap, Card, Note, PopIn, Puff, QMarks, Quill, Rig, Speed, Spr, Stamp, Tag } from "./Kit";
import DATA from "./ep/c.json";

/** Chapters 7-9: Harding's aviation turkey, Coolidge's raccoon, FDR's Franksgiving (VO ch7_9.mp3). */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const CH7_9_DURATION = epDuration(D);
const F = (s: number) => Math.round(s * 30);

const Cal: React.FC<{ x: number; y: number; day: string; at?: number; w?: number; rot?: number; sub?: string; circle?: boolean; strike?: boolean }> = ({ x, y, day, at = 0, w = 300, rot = 0, sub = "THURSDAY", circle, strike }) => (
  <PopIn at={at} x={x} y={y}>
    <CalendarPage x={0} y={0} month="NOVEMBER" day={day} sub={sub} w={w} rot={rot} />
    {circle && <ellipse cx={0} cy={w * 0.18} rx={w * 0.36} ry={w * 0.3} fill="none" stroke="#e02b2b" strokeWidth={10} />}
    {strike && <path d={`M ${-w * 0.4} ${-w * 0.1} L ${w * 0.4} ${w * 0.5}`} stroke="#e02b2b" strokeWidth={16} strokeLinecap="round" />}
  </PopIn>
);

const SHOTS: Shot[] = [
  // ===== 7. HARDING — THE TURKEY IN THE AVIATION HELMET =====
  { a: ln(0), el: (t) => (<>
    <Cam dur={93} to={1.05}><Svg bg={<SkyScroll />}><Spr s="Poses/supreme_ii/jaunty_in_flying_gear" x={960} y={900} h={560} /></Svg></Cam>
    <Card text="Warren G. Harding" sub="7 · The Turkey in the Aviation Helmet" until={t(ln(1)) - 1} />
  </>) },
  { a: ln(1), el: (t, dur) => (<>
    <Arch src="harding_turkey" mode="wide" dur={dur} sepia={0.35} />
    <Cap text="The 1920s" at={t(wd(1, "1920s"))} />
  </>) },
  { a: ln(2), sfx: [[F(wd(2, "flown") - ln(2)), "whoosh", 0.15]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<SkyScroll />}>
      <Speed x={1150} y={560} at={t(wd(2, "flown"))} frames={8} dir={-1} />
      <Spr s="Poses/supreme_ii/jaunty_in_flying_gear" x={960} y={880} h={600} at={t(wd(2, "flown"))} enter={{ from: "right", frames: 8 }} stress />
    </Svg></Cam>
    <Cap text="1921 · Supreme the Second" at={t(wd(2, "supreme"))} />
  </>) },
  { a: ln(3), el: (t, dur) => (
    <Cam dur={dur} from={1.2} to={1.28} oy="40%"><Svg bg={<SkyScroll speed={4} />}><Spr s="Poses/supreme_ii/jaunty_in_flying_gear" x={960} y={960} h={660} stress /></Svg></Cam>) },
  { a: ln(4), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<SkyScroll speed={4} />}><Spr s="Poses/supreme_ii/jaunty_in_flying_gear" x={960} y={960} h={620} /></Svg></Cam>
    <Cap text="Baltimore Sun" pos="top" at={t(wd(4, "baltimore"))} />
    <Cap text={'"black and gold sweater... pink bow"'} at={t(wd(4, "black"))} size={60} />
  </>) },
  { a: ln(5), sfx: [[F(wd(6, "airsick") - ln(5)), "boing", 0.12]], el: (t, dur) => (
    <Cam dur={dur} to={1.04} punch={{ at: t(wd(6, "airsick")), frames: 6, to: 1.25, oy: "45%" }}><Svg bg={<SkyScroll />}>
      <Swap t={t(wd(6, "airsick"))} a={<Spr s="Poses/supreme_ii/jaunty_in_flying_gear" x={960} y={900} h={600} shake={3} />} b={<Spr s="Poses/supreme_ii/green_face_airsick" x={960} y={900} h={600} />} />
    </Svg></Cam>) },
  { a: ln(7), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<TrainCar />}><Spr s="Poses/supreme_ii/relieved_on_train_seat" x={960} y={1000} h={560} stress /></Svg></Cam>
    <Cap text="By train" at={t(wd(7, "train"))} />
  </>) },
  { a: ln(8), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />}>
      <Rig c="warren_g_harding" pose="bemused_pointing" x={520} y={1030} h={580} />
      <Spr s="Poses/supreme_iii/alert_in_motor_coat" x={1360} y={1030} h={460} at={t(wd(8, "supreme"))} enter={{ from: "right", frames: 8 }} />
    </Svg></Cam>
    <Cap text="Supreme the Third · Chicago" at={t(wd(8, "supreme"))} />
  </>) },
  { a: ln(9), el: (t, dur) => (<>
    <Cam dur={dur} from={1.1} to={1.15} oy="50%"><Svg bg={<OvalOffice />}><Spr s="Poses/supreme_iii/with_chocolate_box" x={960} y={1030} h={560} stress /></Svg></Cam>
    <Cap text="Fattened on chocolates" at={t(wd(9, "chocolates"))} />
  </>) },
  { a: ln(10), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Hills />}><Spr s="Poses/supreme_iii/in_spring_suspended_cage" x={960} y={1010} h={600} shake={2} /></Svg></Cam>
    <Cap text="800 miles · under 38 hours" pos="top" at={t(wd(10, "800"))} />
    <Cap text="A cage hung on springs" at={t(wd(10, "cage"))} />
  </>) },
  { a: ln(11), el: (t, dur) => (<>
    <Cam dur={dur} from={1.1} to={1.14}><Svg bg={<B.Hills />}><Spr s="Poses/supreme_iii/alert_in_motor_coat" x={960} y={1030} h={580} stress /></Svg></Cam>
    <Cap text="A custom motor coat" at={t(wd(11, "motor"))} />
  </>) },
  { a: ln(12), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />}>
      <Rig c="warren_g_harding" pose="baffled_palms_up" x={640} y={1030} h={580} />
      <Spr s="Poses/supreme_iii/alert_in_motor_coat" x={1360} y={1030} h={460} flip />
      <QMarks x={640} y={380} at={t(wd(13, "record"))} spread={220} />
    </Svg></Cam>
    <Cap text="Spared? Unknown." at={t(wd(13, "record"))} until={t(wd(14, "he"))} />
    <Cap text="He did get a sweater." at={t(wd(14, "he"))} />
  </>) },

  // ===== 8. CALVIN COOLIDGE — THE RACCOON =====
  { a: ln(15), el: (t) => (<>
    <Cam dur={36} to={1.05}><Svg bg={<OvalOffice />}><Rig c="calvin_coolidge" pose="unimpressed_arms_folded" x={960} y={1030} h={580} /></Svg></Cam>
    <Card text="Calvin Coolidge" sub="8 · The Raccoon" />
  </>) },
  { a: ln(16), el: (t, dur) => (
    <Cam dur={dur} from={1.1} to={1.14} oy="40%"><Svg bg={<B.Studio />}><Quill pose="speaking_facing_right" talk x={960} y={1010} h={720} /></Svg></Cam>) },
  { a: ln(17), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />}><Rig c="calvin_coolidge" pose="unimpressed_arms_folded" x={960} y={1030} h={600} stress /></Svg></Cam>) },
  { a: ln(18), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />} dim={0.45}>
      <Rig c="calvin_coolidge" pose="unimpressed_arms_folded" x={520} y={1030} h={560} />
      <PopIn at={t(wd(18, "new"))} x={1300} y={540}><g transform="rotate(3)"><rect x={-300} y={-330} width={600} height={660} fill="#efe6d0" stroke="#1d1712" strokeWidth={8} /><text y={-240} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={50} fill="#1d1712">The New York Times</text><line x1={-260} x2={260} y1={-210} y2={-210} stroke="#1d1712" strokeWidth={4} /><text y={-120} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={44} fill="#1d1712">COOLIDGE: FOOD GIFTS</text><text y={-60} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={44} fill="#1d1712">NOT TO "BE ENCOURAGED"</text>{Array.from({ length: 8 }, (_, i) => <line key={i} x1={-260} x2={260} y1={10 + i * 36} y2={10 + i * 36} stroke="#9a9080" strokeWidth={6} />)}</g></PopIn>
    </Svg></Cam>
  </>) },
  { a: ln(19), sfx: [[F(wd(20, "quail") - ln(19)), "pop", 0.12], [F(wd(21, "ducks") - ln(19)), "pop", 0.12], [F(wd(22, "geese") - ln(19)), "pop", 0.12], [F(wd(23, "rabbits") - ln(19)), "pop", 0.12], [F(wd(24, "deer") - ln(19)), "pop", 0.15]], el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Rig c="calvin_coolidge" pose="unimpressed_arms_folded" x={300} y={1030} h={560} />
      <Spr s="Poses/quail/standing" x={700} y={1030} h={200} at={t(wd(20, "quail"))} drop={{ frames: 6, height: 600 }} />
      <Spr s="Poses/mallard/standing" x={940} y={1030} h={240} at={t(wd(21, "ducks"))} drop={{ frames: 6, height: 600 }} flip />
      <Spr s="Poses/goose/standing" x={1180} y={1030} h={300} at={t(wd(22, "geese"))} drop={{ frames: 6, height: 600 }} flip />
      <Spr s="Poses/rabbit/sitting" x={1400} y={1030} h={220} at={t(wd(23, "rabbits"))} drop={{ frames: 6, height: 600 }} flip />
      <Spr s="Poses/deer/standing" x={1680} y={1030} h={400} at={t(wd(24, "deer"))} drop={{ frames: 6, height: 700 }} flip />
    </Svg></Cam>) },
  { a: ln(25), sfx: [[F(wd(25, "raccoon") - ln(25)), "rattle", 0.15]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Swap t={t(wd(25, "raccoon"))} a={<Rig c="calvin_coolidge" pose="unimpressed_arms_folded" x={560} y={1030} h={580} />} b={<Rig c="calvin_coolidge" pose="hesitates_at_delivery" x={560} y={1030} h={580} stress />} />
      <Swap t={t(wd(25, "raccoon"))} a={<Spr s="Poses/poultry_props/vose_express_shipment_box" x={1300} y={1010} h={300} at={t(wd(25, "sent"))} drop={{ frames: 8, height: 800 }} shake={3} />} b={<Spr s="Poses/rebecca/startled_in_shipping_crate" x={1300} y={1010} h={340} />} />
    </Svg></Cam>
    <Cap text="November 1926" pos="top" at={t(wd(25, "november"))} />
    <Cap text="Nitta Yuma, Mississippi" at={t(wd(25, "nitta"))} />
  </>) },
  { a: ln(26), sfx: Array.from({ length: 12 }, (_, i) => [F(wd(26, "served") - ln(26)) + i * 2, "type_tick", 0.06] as [number, string, number]), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />} dim={0.5}><Note x={960} y={540} text="Serve for Thanksgiving!" at={t(wd(26, "served"))} w={1100} /></Svg></Cam>) },
  { a: ln(27), el: (t, dur) => (<>
    <Cam dur={dur} from={1.2} to={1.25} ox="64%" oy="78%"><Svg bg={<WhiteHouseLawn />}><Spr s="Poses/rebecca/startled_in_shipping_crate" x={1250} y={990} h={360} /></Svg></Cam>
    <Cap text={'"Toothsome flavor"'} at={t(wd(27, "toothsome"))} />
  </>) },
  { a: ln(28), el: (t, dur) => (
    <Cam dur={dur} from={1.15} to={1.2} oy="40%"><Svg bg={<OvalOffice />}><Rig c="calvin_coolidge" pose="hesitates_at_delivery" x={960} y={1030} h={640} stress /></Svg></Cam>) },
  { a: ln(30), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Rig c="grace_coolidge" pose="friendly_neutral" x={560} y={1030} h={560} />
      <Spr s="Poses/rebecca/sits_with_red_collar" x={1260} y={1030} h={420} flip />
    </Svg></Cam>) },
  { a: ln(31), sfx: [[F(wd(31, "rebecca") - ln(31)), "pop", 0.12], [F(wd(31, "collar") - ln(31)), "pop", 0.12]], el: (t, dur) => (
    <Cam dur={dur} to={1.05}><Svg bg={<WhiteHouseLawn />}>
      <Spr s="Poses/rebecca/sits_with_red_collar" x={960} y={1000} h={480} stress />
      <Tag name="rebecca" x={960} y={400} w={520} at={t(wd(31, "rebecca"))} rot={-4} />
      <Tag name="rebecca_collar" x={1340} y={740} w={480} at={t(wd(31, "collar"))} rot={6} />
    </Svg></Cam>) },
  { a: ln(32), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}><Spr s="Poses/rebecca/walks_on_leash" x={1100} y={1030} h={330} walk={-3} /></Svg></Cam>) },
  { a: ln(33), el: (t, dur) => (
    <Cam dur={dur} from={1.02} to={1.08} ox="60%" oy="40%"><Svg bg={<WhiteHouseLawn />}><Spr s="Poses/rebecca/peeks_from_tree_house" x={1180} y={1030} h={760} /></Svg></Cam>) },
  { a: ln(34), el: (t, dur) => (<>
    <Swap t={t(wd(34, "let"))} a={<Arch src="grace_rebecca" mode="portrait" dur={dur} sepia={0.35} />}
      b={<Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
        <Rig c="grace_coolidge" pose="presents_rebecca_to_children" x={760} y={1030} h={580} stress />
        <Rig c="schoolgirl" pose="reaches_right_to_pet" x={1280} y={1040} h={360} flip />
        <Rig c="schoolboy" pose="reaches_left_to_pet" x={1560} y={1040} h={360} />
      </Svg></Cam>} />
    <Cap text="1927 Easter Egg Roll" at={t(wd(34, "1927"))} />
  </>) },
  { a: ln(35), el: (t, dur) => (<>
    <Cam dur={dur} to={1.05}><Svg bg={<B.PlateBg color="#8fc6d8" />}><Spr s="Poses/rebecca/bath_with_soap" x={960} y={980} h={560} stress /></Svg></Cam>
    <Cap text={'"Playing in a partly filled bathtub"'} at={t(wd(36, "playing"))} size={60} />
  </>) },
  { a: ln(37), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Spr s="Poses/rebecca/sits_with_red_collar" x={600} y={1030} h={400} />
      <Spr s="Poses/reuben/wary_standing" x={1340} y={1030} h={320} at={t(wd(38, "male"))} enter={{ from: "right", frames: 8 }} />
    </Svg></Cam>
    <Cap text="Northern Virginia" at={t(wd(38, "northern"))} />
  </>) },
  { a: ln(39), sfx: [[F(wd(40, "reuben") - ln(39)), "pop", 0.15]], el: (t, dur) => (
    <Cam dur={dur} to={1.05}><Svg bg={<WhiteHouseLawn />}>
      <Spr s="Poses/reuben/wary_standing" x={960} y={1030} h={380} stress />
      <Tag name="reuben" x={960} y={560} w={420} at={t(wd(40, "reuben"))} rot={-3} />
      <Over><PopIn at={t(wd(39, "horace"))} x={960} y={420}><text textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={80} fill="#fff" stroke="#000" strokeWidth={4} paintOrder="stroke">HORACE</text><line x1={-170} x2={170} y1={-26} y2={-26} stroke="#e02b2b" strokeWidth={12} opacity={0} /></PopIn></Over>
    </Svg></Cam>) },
  { a: ln(41), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Spr s="Poses/rebecca/sits_with_red_collar" x={500} y={1030} h={400} />
      <Spr s="Poses/reuben/wary_standing" x={1400} y={1030} h={320} flip />
    </Svg></Cam>) },
  { a: ln(42), sfx: [[2, "whoosh", 0.15]], el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Speed x={1300} y={900} at={2} frames={8} />
      <Spr s="Poses/reuben/escapes_running" x={600} y={1030} h={300} walk={22} />
    </Svg></Cam>) },
  { a: ln(44), sfx: [[F(wd(44, "traffic") - ln(44)), "thud", 0.15]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<Avenue stop={false} />}>
      <Spr s="Poses/reuben/startled_stops_traffic" x={960} y={1040} h={360} at={t(wd(44, "stopped"))} />
    </Svg></Cam>
    <Cap text="Pennsylvania Avenue · 30 minutes" at={t(wd(44, "pennsylvania"))} />
  </>) },
  { a: ln(45), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}><Spr s="Poses/reuben/escapes_running" x={1300} y={1030} h={260} walk={-24} flip /></Svg></Cam>) },
  { a: ln(46), el: (t, dur) => (<>
    <Cam dur={dur} to={1.05}><Svg bg={<B.Village />}><Spr s="Poses/rebecca/waves_goodbye_at_zoo" x={960} y={1030} h={460} stress /></Svg></Cam>
    <Cap text="1929 · Rock Creek Park Zoo" at={t(wd(46, "1929"))} />
  </>) },
  { a: ln(47), sfx: [[F(wd(48, "raccoons") - ln(47)), "ding", 0.15]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Studio />}>
      <Steps s={[[0, <Quill pose="scoreboard_facing_left" talk x={960} y={1010} h={720}><Board pose="scoreboard_facing_left" top="TURKEYS SPARED" big="1*" /></Quill>],
        [t(wd(48, "raccoons")), <Quill pose="scoreboard_facing_left" talk x={960} y={1010} h={720}><Board pose="scoreboard_facing_left" top="RACCOONS SPARED" big="1" /></Quill>]]} />
    </Svg></Cam>
    <Cap text="Raccoons spared: 1 · no asterisk" pos="top" at={t(wd(48, "raccoons"))} />
  </>) },

  // ===== 9. FDR — FRANKSGIVING =====
  { a: ln(50), el: (t) => (<>
    <Cam dur={62} to={1.05}><Svg bg={<OvalOffice />}><Rig c="franklin_d_roosevelt" pose="confident_date_change" x={1100} y={1030} h={560} /></Svg></Cam>
    <Card text="Franklin D. Roosevelt" sub="9 · Franksgiving" until={t(ln(51)) - 1} />
  </>) },
  { a: ln(51), el: (t, dur) => (
    <Cam dur={dur} from={1.1} to={1.14} oy="40%"><Svg bg={<B.Studio />}><Quill pose="nervous_side_glance" talk x={960} y={1010} h={720} /></Svg></Cam>) },
  { a: ln(52), sfx: [0, 1, 2, 3, 4].map((i) => [F(wd(52, "five") - ln(52)) + i * 4, "pop", 0.1] as [number, string, number]), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />} dim={0.5}>
      {["2", "9", "16", "23", "30"].map((d, i) => <Cal key={d} x={280 + i * 340} y={540} day={d} w={280} at={t(wd(52, "five")) + i * 4} rot={(i % 2 ? 3 : -3)} />)}
    </Svg></Cam>
    <Cap text="1939 · Five Thursdays" pos="top" at={t(wd(52, "1939"))} />
  </>) },
  { a: ln(53), el: (t, dur) => (<>
    <Cam dur={dur} to={1.05}><Svg bg={<OvalOffice />} dim={0.5}><Cal x={960} y={540} day="30" w={420} circle /></Svg></Cam>
    <Cap text="The very last day of the month" at={t(wd(54, "very"))} />
  </>) },
  { a: ln(55), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<Avenue stop />}>
      <Rig c="farm_worker" pose="carries_feed_pail" x={640} y={1040} h={480} />
      <Rig c="tv_reporter" pose="baffled_lowers_microphone" x={1300} y={1040} h={480} flip />
      <QMarks x={960} y={420} at={4} spread={340} />
    </Svg></Cam>
    <Cap text="Retailers panicked" at={2} until={t(ln(56))} />
    <Cap text="A shorter Christmas shopping season" at={t(ln(56))} size={60} />
  </>) },
  { a: ln(57), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.PlateBg color="#4a5560" />}>
      <PopIn at={2} x={960} y={560}><path d="M -500 -200 L -250 -60 L -50 -160 L 200 120 L 480 220" fill="none" stroke="#e02b2b" strokeWidth={26} strokeLinejoin="round" strokeLinecap="round" /><path d="M 480 220 l -70 -10 l 40 -60 z" fill="#e02b2b" /></PopIn>
    </Svg></Cam>
    <Cap text="The Great Depression" at={t(wd(57, "great"))} />
  </>) },
  { a: ln(58), sfx: [[F(wd(59, "23rd") - ln(58)), "paper", 0.15]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />}>
      <Rig c="franklin_d_roosevelt" pose="confident_date_change" x={1360} y={1030} h={580} stress />
      <Swap t={t(wd(59, "23rd"))} a={<Cal x={520} y={540} day="30" w={380} rot={-4} />} b={<Cal x={520} y={540} day="23" w={380} rot={-4} circle />} />
    </Svg></Cam>
    <Cap text="November 23" at={t(wd(59, "23rd"))} />
  </>) },
  { a: ln(60), sfx: [[F(wd(61, "franksgiving") - ln(60)) + 6, "sub_thump", 0.3]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<Avenue stop />}>
      <Rig c="tv_reporter" pose="asks_pardon_question" x={1300} y={1040} h={500} stress />
      <Rig c="farm_worker" pose="carries_feed_pail" x={600} y={1040} h={480} />
    </Svg></Cam>
    <Stamp lines={['"FRANKSGIVING"']} at={t(wd(61, "franksgiving"))} x={960} y={300} rot={-7} variant="dark" />
  </>) },
  { a: ln(62), sfx: [[F(wd(62, "obsolete") - ln(62)) + 6, "sub_thump", 0.3]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />} dim={0.5}><Cal x={960} y={560} day="30" w={420} /></Svg></Cam>
    <Stamp lines={["OBSOLETE"]} at={t(wd(62, "obsolete"))} x={960} y={560} rot={-12} variant="red" darken={false} />
  </>) },
  { a: ln(63), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Village />}>
      <PopIn at={2} x={960} y={640}><ellipse rx={150} ry={95} fill="#8a4a22" stroke="#1d1712" strokeWidth={8} /><path d="M -60 0 L 60 0 M -30 -18 L -30 18 M 0 -18 L 0 18 M 30 -18 L 30 18" stroke="#f4f1ea" strokeWidth={8} /></PopIn>
    </Svg></Cam>
    <Cap text="Football coaches complained" at={t(wd(63, "football"))} />
  </>) },
  { a: ln(64), el: (t, dur) => {
    const n23 = 22, n30 = 23;
    const labels = [...Array(n23).fill("23"), ...Array(n30).fill("30"), "BOTH", "BOTH", "BOTH"];
    return (<>
      <Cam dur={dur} to={1.03}><Svg bg={<B.PlateBg />}>
        <StateGrid labels={labels} at={t(wd(65, "twenty")) - 2} cols={12} color={(i) => (i < n23 ? "#d8f0c8" : i < n23 + n30 ? "#f6d7a8" : "#e7c6f0")} />
      </Svg></Cam>
      <Cap text="States could not agree" pos="top" at={2} until={t(wd(65, "twenty"))} />
      <Cap text="22 states: Nov 23" pos="top" at={t(wd(65, "twenty"))} until={t(wd(66, "twenty"))} />
      <Cap text="23 states: Nov 30" pos="top" at={t(wd(66, "twenty"))} until={t(wd(67, "three"))} />
      <Cap text="Texas, Colorado, Mississippi: both" pos="top" at={t(wd(67, "three"))} size={60} />
    </>);
  } },
  { a: ln(68), el: (t, dur) => (
    <Cam dur={dur} from={1.15} to={1.2} oy="38%"><Svg bg={<B.Studio />}><Quill pose="deadpan_wings_folded" talk blinkHold x={960} y={1010} h={720} /></Svg></Cam>) },
  { a: ln(70), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />}><Rig c="franklin_d_roosevelt" pose="confident_date_change" x={1300} y={1030} h={580} stress /><Cal x={520} y={540} day="21" w={360} rot={-4} sub="1940" /></Svg></Cam>
    <Cap text="1940 · 16 states ignored him" at={t(wd(71, "sixteen"))} />
  </>) },
  { a: ln(72), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<Avenue stop />}><Rig c="tv_reporter" pose="baffled_lowers_microphone" x={960} y={1040} h={520} stress /></Svg></Cam>
    <Cap text="No real sales boost" at={t(wd(72, "no"))} />
  </>) },
  { a: ln(73), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />}><Rig c="franklin_d_roosevelt" pose="resigned_signs_law" x={960} y={1030} h={580} /></Svg></Cam>
    <Cap text="May 1941 · back to the last Thursday" at={t(wd(73, "may"))} size={60} />
  </>) },
  { a: ln(74), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Chamber />} dim={0.35}>
      <Swap t={t(wd(76, "senate"))} a={<Cal x={960} y={540} day="LAST" w={420} sub="THURSDAY" />} b={<Cal x={960} y={540} day="4TH" w={420} sub="THURSDAY" circle />} />
    </Svg></Cam>
    <Cap text="House: last Thursday" at={t(wd(75, "house"))} until={t(wd(76, "senate"))} />
    <Cap text="Senate: fourth Thursday" at={t(wd(76, "senate"))} />
  </>) },
  { a: ln(77), sfx: [[F(wd(77, "signed") - ln(77)), "scribble", 0.15], [F(wd(77, "law") - ln(77)) + 6, "sub_thump", 0.3]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />}><Rig c="franklin_d_roosevelt" pose="resigned_signs_law" x={760} y={1030} h={600} /></Svg></Cam>
    <Cap text="December 26, 1941" at={t(wd(77, "december"))} />
    <Stamp lines={["SIGNED", "INTO LAW"]} at={t(wd(77, "law"))} x={1400} y={300} rot={-8} variant="dark" />
  </>) },
  { a: ln(78), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />} dim={0.45}><Cal x={960} y={540} day="4TH" w={440} sub="THURSDAY" circle /></Svg></Cam>
    <Cap text="Because of a shopping argument" at={t(wd(79, "because"))} />
  </>) },
  { a: ln(80), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />}><Rig c="franklin_d_roosevelt" pose="war_address_at_radio" x={960} y={1030} h={600} stress /></Svg></Cam>
    <Cap text="1942 · Radio address" at={t(wd(80, "1942"))} />
  </>) },
  { a: ln(81), sfx: [[F(wd(81, "clam") - ln(81)), "pop", 0.1], [F(wd(81, "roast") - ln(81)), "pop", 0.1], [F(wd(81, "pumpkin") - ln(81)), "pop", 0.1]], el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<DiningRoom />}>
      <Over><g /></Over>
      <BigText x={400} y={420} text="CLAM COCKTAIL" size={56} at={t(wd(81, "clam"))} />
      <PopIn at={t(wd(81, "roast"))} x={960} y={680}><Spr s="Poses/poultry_props/baghdad_trophy_turkey" x={0} y={0} h={200} /></PopIn>
      <BigText x={1500} y={420} text="PUMPKIN PIE + CHEESE" size={50} at={t(wd(81, "pumpkin"))} />
    </Svg></Cam>) },
  { a: ln(82), el: (t, dur) => (
    <Cam dur={dur} from={1.15} to={1.2} oy="38%"><Svg bg={<B.Studio />}><Quill pose="deadpan_wings_folded" talk blinkHold x={960} y={1010} h={720} /></Svg></Cam>) },
];

export const ThanksgivingCh7to9: React.FC = () => <Episode data={D} shots={SHOTS} />;
