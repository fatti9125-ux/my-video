import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import * as B from "../Thanksgiving/Backgrounds";
import { Barrel, Bubble, CalendarPage, PropImg } from "../Thanksgiving/Graphics";
import { MONTSERRAT } from "../fonts";
import { Avenue, DiningRoom, HappyThanksgiving, OvalOffice, TrainCar, WhiteHouseLawn } from "./Bg2";
import { Board, Episode, epDuration, makeAlign, Over, Shot, Steps, Svg, Swap } from "./Episode";
import { Cam, Cap, Card, Cheer, PopIn, Puff, QMarks, Quill, Rig, Speed, Spr, Stamp, Tag } from "./Kit";
import DATA from "./ep/e.json";

/** Chapters 14-16 + Ending (VO ch14_end.mp3). */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const CH14_END_DURATION = epDuration(D);
const F = (s: number) => Math.round(s * 30);
const INK = "#1d1712";

/** Army mess hall in Baghdad: grey walls, flags, steam-tray line. */
const MessHall: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#b9b39f" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 250} y={0} width={18} height={800} fill="#a59f8b" />)}
    <rect x={620} y={120} width={680} height={110} rx={8} fill="#5a6b3a" stroke={INK} strokeWidth={6} />
    <text x={960} y={192} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={48} fill="#f4f1ea">HAPPY THANKSGIVING</text>
    <rect y={800} width={1920} height={280} fill="#8a8470" />
    <rect x={160} y={690} width={1600} height={110} fill="#c9ced4" stroke={INK} strokeWidth={6} />
    {[0, 1, 2, 3, 4, 5].map((i) => <g key={i}><rect x={200 + i * 260} y={660} width={220} height={50} rx={6} fill="#9aa3ad" stroke={INK} strokeWidth={5} />{[0, 1, 2].map((k) => <path key={k} d={`M ${250 + i * 260 + k * 50} 650 q -12 -30 0 -60`} fill="none" stroke="#fff" strokeWidth={6} opacity={0.6} />)}</g>)}
  </g>
);

/** Night sky with a presidential jet silhouette (secret flight). */
const NightFlight: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect width={1920} height={1080} fill="#0f1a33" />
      {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={(i * 271) % 1920} cy={(i * 137) % 900} r={(i % 3) + 1.5} fill="#fff" opacity={0.5 + (i % 4) * 0.12} />)}
      <circle cx={1600} cy={180} r={70} fill="#f3eccf" />
      <g transform={`translate(${2100 - f * 10} 480)`}>
        <path d="M -260 0 Q -230 -34 0 -34 L 230 -34 Q 280 -30 290 0 Q 280 26 230 30 L -230 30 Q -260 26 -260 0 Z" fill="#dfe6ee" stroke={INK} strokeWidth={6} />
        <path d="M -40 0 L -150 -150 L -90 -150 L 60 0 Z M -40 10 L -150 140 L -90 140 L 60 10 Z" fill="#c9d3dd" stroke={INK} strokeWidth={6} />
        <path d="M 200 -30 L 260 -120 L 290 -120 L 270 -20 Z" fill="#c9d3dd" stroke={INK} strokeWidth={6} />
        <rect x={-200} y={-6} width={380} height={10} fill="#2f5a8a" />
      </g>
    </g>
  );
};

/** Parade street with a float carrying a sign. */
const Parade: React.FC<{ sign?: string; at?: number }> = ({ sign, at = 0 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect width={1920} height={1080} fill="url(#tg-sky)" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={i * 220 - 20} y={340 - (i % 3) * 50} width={200} height={480} fill={["#f2c6d4", "#c9e3f2", "#f6e3a8"][i % 3]} stroke={INK} strokeWidth={5} />)}
      {Array.from({ length: 40 }, (_, i) => <rect key={i} x={(i * 97 + f * 3) % 1920} y={(i * 61 + f * 5) % 900} width={14} height={8} fill={["#e74c3c", "#f1c40f", "#3498db", "#2ecc71"][i % 4]} transform={`rotate(${f * 6 + i * 30} ${(i * 97 + f * 3) % 1920} ${(i * 61 + f * 5) % 900})`} />)}
      <rect y={820} width={1920} height={260} fill="#9c8a72" />
      {sign && f >= at && <g transform="translate(1180 300)"><rect x={-330} y={-60} width={660} height={120} rx={20} fill="#fbf6ea" stroke={INK} strokeWidth={8} /><text y={18} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={42} fill="#c0392b">{sign}</text></g>}
      <g transform="translate(1180 860)"><rect x={-420} y={-160} width={840} height={150} rx={30} fill="#e67e22" stroke={INK} strokeWidth={8} />{[-300, -100, 100, 300].map((x) => <circle key={x} cx={x} cy={0} r={34} fill="#333" stroke={INK} strokeWidth={6} />)}</g>
    </g>
  );
};

/** Online-vote card (generic, no platform branding). */
const Vote: React.FC<{ at: number; a: string; b: string }> = ({ at, a, b }) => {
  const f = useCurrentFrame();
  const p = Math.min(1, Math.max(0, (f - at) / 40));
  return (
    <PopIn at={at} x={960} y={540}>
      <rect x={-380} y={-300} width={760} height={600} rx={40} fill="#fbf6ea" stroke={INK} strokeWidth={8} />
      <text y={-200} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={54} fill={INK}>VOTE: WHICH BIRD?</text>
      {[[a, 0.58], [b, 0.42]].map(([n, v], i) => (
        <g key={String(n)} transform={`translate(0 ${-60 + i * 170})`}>
          <rect x={-300} y={-55} width={600} height={110} rx={20} fill="#e6e1d4" stroke={INK} strokeWidth={6} />
          <rect x={-300} y={-55} width={600 * (v as number) * p} height={110} rx={20} fill={i ? "#f6c98a" : "#9fd88a"} />
          <text x={-270} y={16} fontFamily={MONTSERRAT} fontWeight={800} fontSize={48} fill={INK}>{n}</text>
          <text x={270} y={16} textAnchor="end" fontFamily={MONTSERRAT} fontWeight={800} fontSize={44} fill={INK}>{Math.round((v as number) * 100 * p)}%</text>
        </g>
      ))}
    </PopIn>
  );
};

/** Camera flash (white frame burst 3 f). */
const Flash: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + 4) return null;
  return <rect width={1920} height={1080} fill="#fff" opacity={1 - (f - at) / 5} />;
};

/** Ceremony set used for every modern pardon (identical framing, swap name tags). */
const Ceremony: React.FC<{ who: string; t: number; tags: [string, number][]; dur: number }> = ({ who, t, tags, dur }) => (
  <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
    <Swap t={t} a={<Rig c={who} pose="neutral_facing_right" x={600} y={1030} h={600} />} b={<Rig c={who} pose="ceremonial_pardon_hand_raised" x={600} y={1030} h={600} stress />} />
    <Swap t={t + 4} a={<Spr s="Poses/white_ceremony_turkey/nervous_side_glance" x={1320} y={1030} h={420} />} b={<Spr s="Poses/white_ceremony_turkey/relieved_small_wave" x={1320} y={1030} h={420} />} />
    {tags.map(([n, at], i) => <Tag key={n} name={n} x={1150 + i * 330} y={560} w={300} at={at} rot={i ? 4 : -4} />)}
  </Svg></Cam>
);

const SHOTS: Shot[] = [
  // ===== 14. WHERE DO THE TURKEYS GO? =====
  { a: ln(0), el: (t) => (<>
    <Cam dur={60} to={1.05}><Svg bg={<WhiteHouseLawn />}><Rig c="tv_reporter" pose="attentive_with_microphone" x={960} y={1030} h={520} /></Svg></Cam>
    <Card text="Where Do the Turkeys Go?" sub="14" until={t(ln(1)) - 1} />
  </>) },
  { a: ln(1), el: (t, dur) => (<>
    <Cam dur={dur} from={1.1} to={1.15} oy="40%"><Svg bg={<B.Studio v={1} />}><Quill pose="speaking_facing_right" talk x={960} y={1010} h={720} /></Svg></Cam>
    <Over><QMarks x={960} y={330} at={t(wd(1, "pardon"))} spread={330} /></Over>
  </>) },
  { a: ln(2), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04} panX={-30}><Svg bg={<B.Village />}>
      <Spr s="Poses/white_ceremony_turkey/relieved_small_wave" x={760} y={1030} h={420} />
      <Spr s="Poses/brown_turkey/relieved_eyes_closed" x={1240} y={1030} h={380} flip />
      <Rig c="farm_worker" pose="carries_feed_pail" x={1640} y={1040} h={480} flip />
    </Svg></Cam>
    <Cap text="1989–2004" pos="top" at={t(wd(2, "1989"))} />
    <Cap text="Frying Pan Farm Park, Virginia" at={t(wd(2, "frying"))} />
  </>) },
  { a: ln(3), sfx: [[2, "ding", 0.1]], el: (t, dur) => (
    <Cam dur={dur} from={1.08} to={1.12}><Svg bg={<B.Studio v={2} />}><Quill pose="deadpan_wings_folded" talk blinkHold x={960} y={1010} h={720} /></Svg></Cam>) },
  { a: ln(4), sfx: [[F(wd(4, "flew") - ln(4)), "whoosh", 0.12]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<NightFlight />}>
      <Tag name="marshmallow" x={700} y={760} w={360} at={t(wd(4, "marshmallow"))} rot={-5} />
      <Tag name="yam" x={1240} y={790} w={300} at={t(wd(4, "yam"))} rot={6} />
    </Svg></Cam>
    <Cap text="2005 · First class to California" at={t(wd(4, "2005"))} />
  </>) },
  { a: ln(5), sfx: [[2, "cheer", 0.1]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<Parade />}>
      <Spr s="Poses/white_ceremony_turkey/relieved_small_wave" x={1180} y={720} h={330} />
      <Tag name="marshmallow" x={1180} y={450} w={300} />
      <Rig c="parade_fan" pose="waves" x={300} y={1050} h={440} stress />
    </Svg></Cam>
    <Cap text="Grand Marshal · Thanksgiving Parade" pos="top" at={t(wd(5, "grand"))} size={62} />
  </>) },
  { a: ln(6), el: (t, dur) => (
    <Cam dur={dur} from={1.1} to={1.15} oy="55%"><Svg bg={<Parade sign="THE HAPPIEST TURKEY ON EARTH" at={t(wd(6, "the"))} />}>
      <Spr s="Poses/white_ceremony_turkey/relieved_small_wave" x={1180} y={720} h={330} stress />
      <Rig c="parade_fan" pose="waves" x={300} y={1050} h={440} />
    </Svg></Cam>) },
  { a: ln(7), sfx: [[2, "cheer", 0.1]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<Parade />}><Rig c="parade_fan" pose="waves" x={500} y={1050} h={460} stress /><Cheer x={260} y={340} w={1400} /></Svg></Cam>
    <Cap text="2007 · Disney World" at={t(wd(7, "2007"))} />
  </>) },
  { a: ln(8), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Spr s="Poses/white_ceremony_turkey/standing_with_blank_sign" x={700} y={1030} h={400} />
      <Spr s="Poses/brown_turkey/standing_alert" x={1240} y={1030} h={380} flip />
      <Tag name="may" x={700} y={560} w={260} at={t(wd(8, "may"))} />
      <Tag name="flower" x={1240} y={580} w={280} at={t(wd(8, "flower"))} />
    </Svg></Cam>) },
  { a: ln(9), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Rig c="vice_president" pose="rear_view_with_hand_raised" x={1450} y={1060} h={620} />
      <Rig c="george_w_bush" pose="jokes_about_lunch_and_dinner" x={600} y={1030} h={580} stress />
    </Svg></Cam>
    <Cap text="George W. Bush" pos="top" at={t(ln(9))} />
    <Over><Bubble x={1300} y={260} text={'"LUNCH" AND "DINNER"'} tx={1420} ty={460} at={t(wd(10, "lunch"))} w={640} size={46} /></Over>
  </>) },
  { a: ln(11), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Village />}>
      <Swap t={t(wd(11, "cobbler"))} a={<Rig c="barack_obama" pose="neutral_facing_right" x={560} y={1030} h={580} />} b={<Rig c="barack_obama" pose="ceremonial_pardon_hand_raised" x={560} y={1030} h={580} stress />} />
      <Spr s="Poses/white_ceremony_turkey/relieved_small_wave" x={1320} y={1030} h={420} />
      <Tag name="cobbler" x={1300} y={560} w={300} at={t(wd(11, "cobbler"))} />
    </Svg></Cam>
    <Cap text="2012 · Mount Vernon" at={t(wd(11, "mount"))} until={t(ln(12))} />
    <Cap text="Full circle." at={t(ln(12))} />
  </>) },
  { a: ln(13), sfx: [[F(wd(13, "mac") - ln(13)), "pop", 0.1], [F(wd(13, "cheese") - ln(13)), "pop", 0.1]], el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Rig c="barack_obama" pose="facing_left_hands_down" x={1500} y={1030} h={560} />
      <Tag name="mac" x={560} y={520} w={360} at={t(wd(13, "mac"))} rot={-5} />
      <Tag name="cheese" x={1000} y={560} w={380} at={t(wd(13, "cheese"))} rot={5} />
    </Svg></Cam>) },
  { a: ln(14), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.PlateBg />}><Vote at={2} a="HONEST" b="ABE" /></Svg></Cam>
    <Cap text="2015 · The public votes" pos="top" at={t(wd(14, "2015"))} until={t(ln(15))} />
    <Cap text="Democracy." pos="top" at={t(ln(15))} />
  </>) },
  { a: ln(16), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Village />}>
      <PopIn at={2} x={1300} y={420}><rect x={-230} y={-50} width={460} height={100} rx={10} fill="#7a4a2a" stroke={INK} strokeWidth={6} /><text y={16} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={46} fill="#f4f1ea">GOBBLER'S REST</text></PopIn>
      <Rig c="farm_worker" pose="carries_feed_pail" x={640} y={1040} h={480} />
    </Svg></Cam>
    <Cap text="2016 · Virginia Tech" at={t(wd(16, "2016"))} />
  </>) },
  { a: ln(17), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Spr s="Poses/white_ceremony_turkey/relieved_small_wave" x={700} y={1030} h={440} />
      <Swap t={t(ln(19))} a={<Spr s="Poses/brown_turkey/standing_alert" x={1260} y={1030} h={400} flip />} b={<Spr s="Poses/brown_turkey/nervous_beak_open" x={1260} y={1030} h={400} flip stress />} />
    </Svg></Cam>
    <Cap text="The backup" at={t(ln(18))} until={t(ln(20))} />
    <Cap text="Training for a job it hopes never to need" at={t(ln(20))} size={58} />
  </>) },
  { a: ln(21), el: (t, dur) => (
    <Cam dur={dur} from={1.1} to={1.15} oy="38%"><Svg bg={<B.Studio v={3} />}><Quill pose="nervous_side_glance" talk x={960} y={1010} h={720} /></Svg></Cam>) },
  { a: ln(22), el: (t, dur) => (<>
    <Cam dur={dur} to={1.05}><Svg bg={<B.Village />}><Spr s="Poses/brown_turkey/nervous_beak_open" x={960} y={1030} h={520} stress /></Svg></Cam>
    <Cap text="Bred to be big" at={t(wd(22, "bred"))} until={t(ln(23))} />
    <Cap text={'"Usually too fat and unhealthy to survive"'} at={t(wd(23, "usually"))} size={56} />
  </>) },
  { a: ln(24), el: (t, dur) => (<>
    <Cam dur={dur} from={1.1} to={1.14} oy="38%"><Svg bg={<B.Studio v={0} />}><Quill pose="deadpan_wings_folded" talk blinkHold x={760} y={1010} h={700} /></Svg></Cam>
    <Stamp lines={["PARDONED.", "NOT IMMORTAL."]} at={t(wd(26, "not"))} x={1380} y={300} rot={-8} variant="dark" />
  </>) },

  // ===== 15. GEORGE W. BUSH — BAGHDAD, 2003 =====
  { a: ln(27), el: (t) => (<>
    <Cam dur={86} to={1.05}><Svg bg={<MessHall />}><Rig c="george_w_bush" pose="serves_baghdad_dinner" x={960} y={1030} h={580} /></Svg></Cam>
    <Card text="George W. Bush" sub="15 · Baghdad, 2003" until={t(ln(28)) - 1} />
  </>) },
  { a: ln(28), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.PlateBg color="#4a5560" />}><PopIn at={2} x={960} y={520}><CalendarPage x={0} y={0} month="NOVEMBER" day="27" sub="2003" w={400} /></PopIn></Svg></Cam>
    <Cap text="Iraq · invaded eight months earlier" at={t(wd(29, "invaded"))} size={60} />
  </>) },
  { a: ln(30), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Hills />}><Rig c="george_w_bush" pose="jokes_about_lunch_and_dinner" x={760} y={1030} h={560} /></Svg></Cam>
    <Cap text="Believed at his ranch · Crawford, Texas" at={t(wd(31, "crawford"))} size={58} />
  </>) },
  { a: ln(32), sfx: [[2, "boing", 0.08]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Hills />}><QMarks x={760} y={420} at={2} spread={200} /></Svg></Cam>
    <Cap text="He wasn't." at={0} />
  </>) },
  { a: ln(33), sfx: [[2, "whoosh", 0.15]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<NightFlight />} /></Cam>
    <Cap text="Secretly flown to Baghdad" at={t(wd(33, "flown"))} />
  </>) },
  { a: ln(34), sfx: [[F(wd(34, "600") - ln(34)), "cheer", 0.12]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<MessHall />}>
      <Rig c="george_w_bush" pose="serves_baghdad_dinner" x={520} y={1030} h={560} stress />
      <Rig c="baghdad_soldier_a" pose="smiles_with_tray" x={1020} y={1040} h={500} flip />
      <Rig c="baghdad_soldier_c" pose="holds_plate" x={1340} y={1040} h={500} flip />
      <Swap t={t(wd(34, "600"))} a={<Rig c="baghdad_soldier_b" pose="cheers" x={1660} y={1040} h={500} flip />} b={<Rig c="baghdad_soldier_b" pose="cheers" x={1660} y={1040} h={500} flip bounce={30} />} />
    </Svg></Cam>
    <Cap text="~2.5 hours · ~600 troops" at={t(wd(34, "two"))} />
  </>) },
  { a: ln(35), sfx: [[F(wd(36, "holding") - ln(35)), "pop", 0.12]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04} punch={{ at: t(wd(36, "turkey")), frames: 6, to: 1.2, oy: "45%" }}><Svg bg={<MessHall />}>
      <Rig c="george_w_bush" pose="holds_trophy_turkey" x={960} y={1030} h={600} stress />
      <Flash at={t(wd(36, "holding"))} />
    </Svg></Cam>
    <Cap text="Big, golden, perfect" at={t(wd(36, "big"))} />
  </>) },
  { a: ln(37), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<MessHall />} dim={0.35}><PopIn at={2} x={700} y={620}><Spr s="Poses/poultry_props/baghdad_trophy_turkey" x={0} y={0} h={300} /></PopIn></Svg></Cam>
    <Stamp lines={["FAKE?", "PLASTIC?"]} at={t(ln(38))} x={1420} y={420} rot={-9} variant="red" darken={false} />
  </>) },
  { a: ln(39), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<MessHall />}><PopIn at={0} x={960} y={600}><Spr s="Poses/poultry_props/baghdad_trophy_turkey" x={0} y={0} h={320} /></PopIn></Svg></Cam>
    <Cap text="Real. Cooked." at={t(ln(40))} until={t(ln(41))} />
    <Cap text="…but decorative." at={t(ln(41))} />
  </>) },
  { a: ln(42), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<MessHall />}>
      <Rig c="baghdad_soldier_a" pose="smiles_with_tray" x={600} y={1040} h={520} stress />
      <PopIn at={2} x={1300} y={640}><Spr s="Poses/poultry_props/baghdad_trophy_turkey" x={0} y={0} h={220} /></PopIn>
    </Svg></Cam>
    <Cap text={'"Trophy turkey"'} at={t(wd(42, "trophy"))} until={t(ln(43))} />
    <Cap text="Troops ate from steam trays" at={t(ln(43))} />
  </>) },
  { a: ln(44), el: (t, dur) => (<>
    <Cam dur={dur} from={1.1} to={1.15} oy="40%"><Svg bg={<MessHall />}><Rig c="george_w_bush" pose="holds_trophy_turkey" x={960} y={1030} h={640} /></Svg></Cam>
    <Cap text={'"A decoration, not a serving plate"'} at={t(wd(44, "picked"))} size={60} />
  </>) },
  { a: ln(45), el: (t, dur) => (<>
    <Cam dur={dur} from={1.1} to={1.14} oy="38%"><Svg bg={<B.Studio v={3} />}><Quill pose="speaking_facing_right" talk x={760} y={1010} h={700} /></Svg></Cam>
    <Stamp lines={["NEVER EATEN.", "TECHNICALLY", "SPARED."]} at={t(ln(47))} x={1380} y={300} rot={-8} variant="dark" />
  </>) },
  { a: ln(48), sfx: [[F(wd(48, "count") - ln(48)), "ding", 0.15]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Studio v={0} />}>
      <Quill pose="scoreboard_facing_left" talk x={960} y={1010} h={720}><Board pose="scoreboard_facing_left" top="TURKEYS SPARED" big="+1" at={t(wd(48, "count"))} /></Quill>
    </Svg></Cam>
    <Cap text={"We'll count it."} pos="top" at={t(wd(48, "we'll"))} />
  </>) },

  // ===== 16. THE MODERN ERA =====
  { a: ln(49), el: (t) => (<>
    <Cam dur={140} to={1.05}><Svg bg={<WhiteHouseLawn />}><Rig c="donald_trump" pose="neutral_facing_right" x={640} y={1030} h={560} /><Rig c="joe_biden" pose="facing_left_hands_down" x={1280} y={1030} h={560} /></Svg></Cam>
    <Card text="The Modern Era" sub="16 · Same Time Next Year" until={t(ln(50)) - 1} />
  </>) },
  { a: ln(50), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />} dim={0.4}>
      {["2017", "2018", "2019", "2020", "2021", "2022"].map((y, i) => <PopIn key={y} at={2 + i * 4} x={300 + i * 264} y={540}><CalendarPage x={0} y={0} month="NOVEMBER" day="✓" sub={y} w={220} rot={i % 2 ? 4 : -4} /></PopIn>)}
    </Svg></Cam>
    <Cap text="Every November" at={t(ln(51))} until={t(ln(52))} />
    <Cap text="2 birds · 2 names · 1 pardon" at={t(ln(52))} />
  </>) },
  { a: ln(53), el: (t, dur) => (<>
    <Ceremony who="donald_trump" t={t(wd(53, "pardoned"))} dur={dur} tags={[["drumstick", t(wd(53, "drumstick"))], ["bread", t(wd(53, "bread"))], ["butter", t(wd(53, "butter"))]]} />
    <Cap text="2017 · 2019" pos="top" at={t(wd(53, "2017"))} />
  </>) },
  { a: ln(54), el: (t, dur) => (<>
    <Ceremony who="joe_biden" t={t(wd(54, "pardoned"))} dur={dur} tags={[["chocolate", t(wd(54, "chocolate"))], ["chip", t(wd(54, "chip"))]]} />
    <Cap text="2022" pos="top" at={t(wd(54, "2022"))} />
  </>) },
  { a: ln(55), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<DiningRoom />}>
      {["drumstick", "bread", "butter", "chocolate", "chip", "mac", "cheese", "cobbler"].map((n, i) => <Tag key={n} name={n} x={330 + (i % 4) * 420} y={330 + Math.floor(i / 4) * 170} w={300} at={2 + i * 3} rot={(i % 2 ? 4 : -4)} />)}
    </Svg></Cam>
    <Cap text="It's a menu." at={t(ln(56))} />
  </>) },

  // ===== ENDING — THE FINAL SCORE =====
  { a: ln(57), el: (t) => (<>
    <Cam dur={40} to={1.04}><Svg bg={<B.Studio v={3} />}><Quill pose="scoreboard_facing_left" x={960} y={1010} h={680} /></Svg></Cam>
    <Card text="The Final Score" until={t(ln(59)) - 1} />
  </>) },
  { a: ln(59), el: (t, dur) => (
    <Cam dur={dur} from={1.08} to={1.12} oy="40%"><Svg bg={<B.Studio v={1} />}><Quill pose="scoreboard_facing_left" talk x={960} y={1010} h={720}><Board pose="scoreboard_facing_left" top="FINAL SCORE" big="?" /></Quill></Svg></Cam>) },
  { a: ln(60), el: (t, dur) => (<><Cam dur={dur} to={1.05}><Svg bg={<B.Prison />}><Rig c="george_washington" pose="offers_beer_mug" x={960} y={1030} h={620} stress /></Svg></Cam><Cap text="Thanks · and beer" at={2} /></>) },
  { a: ln(61), el: (t, dur) => (<><Cam dur={dur} to={1.05}><Svg bg={<B.Study />}><Rig c="thomas_jefferson" pose="firm_stop_gesture" x={960} y={1030} h={620} stress /></Svg></Cam><Cap text="No · quietly · 8 years" at={2} /></>) },
  { a: ln(62), el: (t, dur) => (<><Cam dur={dur} to={1.05}><Svg bg={<B.EditorOffice />}><Rig c="sarah_josepha_hale" pose="tired_writing" x={960} y={1030} h={620} /></Svg></Cam><Cap text="17 years of letters" at={2} /></>) },
  { a: ln(63), el: (t, dur) => (<><Cam dur={dur} to={1.05}><Svg bg={<B.LincolnOffice />}><Rig c="abraham_lincoln" pose="signs_proclamation" x={960} y={1030} h={620} /></Svg></Cam><Cap text="Yes · in 5 days" at={2} /></>) },
  { a: ln(64), el: (t, dur) => (<><Cam dur={dur} to={1.05}><Svg bg={<B.Village />}><Rig c="horace_vose" pose="holds_express_crate" x={960} y={1030} h={620} stress /></Svg></Cam><Cap text="40 years of turkeys" at={2} /></>) },
  { a: ln(65), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<TrainCar />}>
      <Steps s={[[0, <Spr s="Poses/supreme_ii/jaunty_in_flying_gear" x={960} y={1000} h={560} />], [t(wd(65, "airsick")), <Spr s="Poses/supreme_ii/green_face_airsick" x={960} y={1000} h={560} />], [t(wd(65, "train")), <Spr s="Poses/supreme_ii/relieved_on_train_seat" x={960} y={1000} h={560} />]]} />
    </Svg></Cam>) },
  { a: ln(66), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<B.PlateBg color="#8fc6d8" />}>
      <Swap t={t(wd(66, "bathtub"))} a={<Spr s="Poses/rebecca/startled_in_shipping_crate" x={960} y={1000} h={480} />} b={<Spr s="Poses/rebecca/bath_with_soap" x={960} y={1000} h={520} stress />} />
    </Svg></Cam>) },
  { a: ln(67), el: (t, dur) => (<><Cam dur={dur} to={1.05}><Svg bg={<OvalOffice />}><Rig c="franklin_d_roosevelt" pose="confident_date_change" x={1240} y={1030} h={580} /><PopIn at={2} x={560} y={540}><CalendarPage x={0} y={0} month="NOVEMBER" day="23" sub="THURSDAY" w={360} /></PopIn></Svg></Cam></>) },
  { a: ln(68), el: (t, dur) => (<><Cam dur={dur} to={1.05}><Svg bg={<DiningRoom />}><Steps s={[[0, <Rig c="harry_truman" pose="answers_a_reporter" x={760} y={1030} h={620} />], [t(wd(68, "ate")), <Rig c="harry_truman" pose="grinning_at_dinner" x={760} y={1030} h={620} />], [t(wd(68, "turkey")), <Rig c="harry_truman" pose="grinning_with_turkey_bite" x={760} y={1030} h={620} stress />]]} /><Spr s="Poses/poultry_props/hens_for_harry_crate" x={1400} y={1030} h={300} /></Svg></Cam><Cap text="Truman ate his turkey" at={2} /></>) },
  { a: ln(69), el: (t, dur) => (<Cam dur={dur} to={1.05}><Svg bg={<WhiteHouseLawn />}><Rig c="john_f_kennedy" pose="open_hand_toward_turkey" x={600} y={1030} h={580} /><Spr s="Poses/white_ceremony_turkey/relieved_small_wave" x={1320} y={1030} h={420} /></Svg></Cam>) },
  { a: ln(70), el: (t, dur) => (<Cam dur={dur} to={1.05}><Svg bg={<WhiteHouseLawn />}><Rig c="ronald_reagan" pose="pardon_quip" x={760} y={1030} h={600} stress /><Rig c="nancy_reagan" pose="amused_by_banner" x={1260} y={1030} h={540} flip /></Svg></Cam>) },
  { a: ln(71), el: (t, dur) => (<><Cam dur={dur} to={1.05}><Svg bg={<WhiteHouseLawn />}><Rig c="george_hw_bush" pose="raises_hand_for_official_pardon" x={960} y={1030} h={620} stress /></Svg></Cam>
    <Stamp lines={["OFFICIAL"]} at={t(wd(71, "official"))} x={1300} y={300} rot={-8} variant="red" darken={false} /></>) },
  { a: ln(72), sfx: [[F(wd(72, "hundreds") - ln(72)), "ding", 0.15], [F(wd(73, "dozens") - ln(72)), "ding", 0.15], [F(wd(74, "one") - ln(72)), "cheer", 0.1]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Studio v={0} />}>
      <Spr s="Poses/quill/scoreboard_celebration" x={700} y={1010} h={640}>
        <Steps s={[[0, <Board pose="scoreboard_celebration" top="TURKEYS EATEN" big="100s" />], [t(wd(73, "dozens")), <Board pose="scoreboard_celebration" top="PARDONED" big="DOZENS" />], [t(wd(74, "one")), <Board pose="scoreboard_celebration" top="RACCOONS" big="1" />]]} />
      </Spr>
      <Spr s="Poses/rebecca/waves_goodbye_at_zoo" x={1400} y={1010} h={440} at={t(wd(74, "one"))} enter={{ from: "right", frames: 8 }} />
    </Svg></Cam>
    <Cap text="Hundreds eaten" pos="top" at={t(wd(72, "hundreds"))} until={t(wd(73, "dozens"))} />
    <Cap text="Dozens pardoned" pos="top" at={t(wd(73, "dozens"))} until={t(wd(74, "one"))} />
    <Cap text="One raccoon, living her best life" pos="top" at={t(wd(74, "one"))} />
  </>) },
  { a: ln(75), el: (t, dur) => (
    <Cam dur={dur} from={1.12} to={1.16} oy="38%"><Svg bg={<B.Studio v={2} />}>
      <Steps s={[[0, <Quill pose="speaking_facing_right" talk x={960} y={1010} h={720} />], [t(ln(76)), <Quill pose="deadpan_wings_folded" talk x={960} y={1010} h={720} />], [t(ln(77)), <Quill pose="nervous_side_glance" talk x={960} y={1010} h={720} />], [t(ln(78)), <Spr s="Poses/quill/startled_recoil" x={960} y={1010} h={720} />]]} />
    </Svg></Cam>) },
  { a: ln(79), el: (t, dur) => (<>
    <Cam dur={dur} from={1.1} to={1.2} oy="40%"><Svg bg={<WhiteHouseLawn />}><Quill pose="pardon_plea" talk x={960} y={1010} h={720} /></Svg></Cam>
    <Cap text={"\"I'd like a pardon too.\""} at={t(wd(80, "i'd"))} />
  </>) },
  { a: ln(81), el: (t, dur) => (
    <Cam dur={dur} to={1.03}><Svg bg={<HappyThanksgiving />}><Quill pose="speaking_facing_right" talk x={960} y={1030} h={680} /></Svg></Cam>) },
  { a: ln(82), sfx: [[2, "cheer", 0.12], [F(ln(83) - ln(82)), "ding", 0.15]], el: (t, dur) => (<>
    <Cam dur={dur} from={1.0} to={1.06}><Svg bg={<HappyThanksgiving />}>
      <Spr s="Poses/quill/closing_hoo" x={960} y={1040} h={700} stress />
      <Cheer x={300} y={380} w={1320} />
    </Svg></Cam>
  </>) },
];

/** Hold the final "hoo" for a moment, then fade out (handled by the episode tail). */
export const ThanksgivingCh14toEnd: React.FC = () => <Episode data={D} shots={SHOTS} />;

void Barrel; void PropImg; void Puff; void Speed; void AbsoluteFill;
