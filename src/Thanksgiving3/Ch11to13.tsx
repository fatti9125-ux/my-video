import React from "react";
import { AbsoluteFill } from "remotion";
import * as B from "../Thanksgiving/Backgrounds";
import { Bubble } from "../Thanksgiving/Graphics";
import { OvalOffice, RanchBanner, WhiteHouseLawn } from "./Bg2";
import { Board, Episode, epDuration, makeAlign, Over, Shot, Steps, Svg, Swap } from "./Episode";
import { Arch, Cam, Cap, Card, PopIn, Quill, Rig, Spr, Stamp, Tag } from "./Kit";
import { MONTSERRAT } from "../fonts";
import DATA from "./ep/k.json";

/** Chapters 11-13: JFK "let this one grow", the petting-zoo era, Bush makes it official (VO ch11_13.mp3). */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const CH11_13_DURATION = epDuration(D);
const F = (s: number) => Math.round(s * 30);

const SHOTS: Shot[] = [
  // ===== 11. JFK =====
  { a: ln(0), el: (t) => (<>
    <Cam dur={70} to={1.05}><Svg bg={<WhiteHouseLawn />}><Rig c="john_f_kennedy" pose="gentle_smile" x={960} y={1030} h={580} /></Svg></Cam>
    <Card text="John F. Kennedy" sub={'11 · "Let This One Grow"'} until={t(ln(1)) - 1} />
  </>) },
  { a: ln(1), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}><Rig c="john_f_kennedy" pose="gentle_smile" x={560} y={1030} h={580} /><Rig c="poultry_board_representative" pose="holds_crate" x={1320} y={1030} h={540} /></Svg></Cam>
    <Cap text="November 19, 1963" at={t(wd(1, "november"))} />
  </>) },
  { a: ln(2), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Rig c="john_f_kennedy" pose="gentle_smile" x={560} y={1030} h={580} />
      <Spr s="Poses/white_ceremony_turkey/nervous_side_glance" x={1320} y={1030} h={420} at={t(wd(2, "turkey"))} enter={{ from: "right", frames: 8 }} />
    </Svg></Cam>
    <Cap text="~55 lb" at={t(wd(2, "55"))} />
  </>) },
  { a: ln(3), sfx: [[F(wd(3, "sign") - ln(3)), "pop", 0.12]], el: (t, dur) => (
    <Cam dur={dur} from={1.1} to={1.15} ox="68%" oy="70%"><Svg bg={<WhiteHouseLawn />}>
      <Rig c="john_f_kennedy" pose="gentle_smile" x={560} y={1030} h={580} />
      <Spr s="Poses/white_ceremony_turkey/standing_with_blank_sign" x={1320} y={1030} h={420} />
      <Tag name="kennedy_placard" x={1217} y={889} w={165} at={t(wd(3, "sign"))} />
    </Svg></Cam>) },
  { a: ln(5), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Swap t={t(wd(5, "says"))} a={<Rig c="john_f_kennedy" pose="gentle_smile" x={560} y={1030} h={600} />} b={<Rig c="john_f_kennedy" pose="open_hand_toward_turkey" x={560} y={1030} h={600} stress />} />
      <Swap t={t(wd(5, "grow"))} a={<Spr s="Poses/white_ceremony_turkey/standing_with_blank_sign" x={1320} y={1030} h={420} />} b={<Spr s="Poses/white_ceremony_turkey/relieved_small_wave" x={1320} y={1030} h={420} stress />} />
    </Svg></Cam>
    <Over><Bubble x={760} y={240} text={'"WE\'LL JUST LET THIS ONE GROW."'} tx={620} ty={420} at={t(wd(5, "we'll"))} w={900} size={44} /></Over>
  </>) },
  { a: ln(6), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Village />}><Spr s="Poses/white_ceremony_turkey/relieved_small_wave" x={760} y={1030} h={440} walk={2} /></Svg></Cam>
    <Cap text="Back to the farm · California" at={t(wd(6, "farm"))} />
  </>) },
  { a: ln(7), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.PlateBg color="#4a5560" />}>
      <PopIn at={2} x={960} y={540}><g transform="rotate(-3)"><rect x={-560} y={-300} width={1120} height={600} fill="#efe6d0" stroke="#1d1712" strokeWidth={8} /><text y={-200} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={56} fill="#1d1712">Los Angeles Times</text><line x1={-520} x2={520} y1={-170} y2={-170} stroke="#1d1712" strokeWidth={4} /><text y={-60} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={66} fill="#1d1712">TURKEY GETS</text><text y={30} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={66} fill="#1d1712">PRESIDENTIAL PARDON</text>{Array.from({ length: 4 }, (_, i) => <line key={i} x1={-500} x2={500} y1={110 + i * 40} y2={110 + i * 40} stroke="#9a9080" strokeWidth={8} />)}</g></PopIn>
    </Svg></Cam>
  </>) },
  { a: ln(8), sfx: [[F(wd(8, "word") - ln(8)) + 6, "sub_thump", 0.25]], el: (t, dur) => (<>
    <Cam dur={dur} from={1.12} to={1.16} oy="40%"><Svg bg={<WhiteHouseLawn />}><Rig c="john_f_kennedy" pose="quiet_smiling_hold" x={960} y={1030} h={620} /></Svg></Cam>
    <Stamp lines={["NEVER SAID", '"PARDON"']} at={t(wd(8, "word"))} x={1420} y={300} rot={-8} variant="dark" />
  </>) },
  { a: ln(9), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}><Rig c="john_f_kennedy" pose="quiet_smiling_hold" x={960} y={1030} h={580} /></Svg></Cam>) },
  // respectful: no imagery, black card (art list)
  { a: ln(10), el: (t) => (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 84, color: "#fff", opacity: 0.92 }}>NOVEMBER 22, 1963</div>
      <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 44, color: "#fff", opacity: 0.7, marginTop: 16 }}>DALLAS</div>
    </AbsoluteFill>) },
  { a: ln(11), el: (t) => (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 56, color: "#fff", opacity: 0.75 }}>HYANNIS PORT · THANKSGIVING NEVER HAPPENED</div>
    </AbsoluteFill>) },
  { a: ln(12), sfx: [[F(wd(12, "two") - ln(12)), "ding", 0.15]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Studio />}>
      <Quill pose="scoreboard_facing_left" talk x={960} y={1010} h={720}><Board pose="scoreboard_facing_left" top="TURKEYS SPARED" big="2**" at={t(wd(12, "two"))} /></Quill>
    </Svg></Cam>
    <Cap text="Turkeys spared: 2 · one asterisk each" pos="top" at={t(wd(12, "two"))} size={60} />
  </>) },

  // ===== 12. NIXON AND REAGAN =====
  { a: ln(15), el: (t) => (<>
    <Cam dur={78} to={1.05}><Svg bg={<WhiteHouseLawn />}><Rig c="richard_nixon" pose="hands_behind_back" x={960} y={1030} h={580} /></Svg></Cam>
    <Card text="Nixon & Reagan" sub="12 · The Petting Zoo Era" until={t(ln(16)) - 1} />
  </>) },
  { a: ln(16), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}><Spr s="Poses/white_ceremony_turkey/standing_with_blank_sign" x={960} y={1030} h={440} /></Svg></Cam>
    <Cap text="The 1970s · routine" at={t(wd(16, "1970s"))} />
  </>) },
  { a: ln(17), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Swap t={t(wd(17, "presented"))} a={<Rig c="pat_nixon" pose="standing_neutral" x={520} y={1030} h={560} />} b={<Rig c="pat_nixon" pose="presents_turkey" x={520} y={1030} h={560} stress />} />
      <Spr s="Poses/brown_turkey/standing_alert" x={1240} y={1030} h={380} />
    </Svg></Cam>
    <Cap text="1971 · First Lady Pat Nixon" at={t(wd(17, "1971"))} />
  </>) },
  { a: ln(18), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Village />}>
      <Rig c="richard_nixon" pose="open_hand_toward_turkey" x={520} y={1030} h={560} stress />
      <Spr s="Poses/brown_turkey/relieved_eyes_closed" x={1120} y={1030} h={360} />
      <Rig c="schoolgirl" pose="reaches_right_to_pet" x={1600} y={1040} h={340} flip />
    </Svg></Cam>
    <Cap text="A petting zoo" at={t(wd(18, "petting"))} until={t(ln(19))} />
    <Cap text="Unofficially." at={t(ln(19))} />
  </>) },
  { a: ln(20), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<RanchBanner text="" />}><Rig c="ronald_reagan" pose="listening_to_reporter" x={600} y={1030} h={520} /><Rig c="nancy_reagan" pose="attentive_neutral" x={860} y={1030} h={500} /></Svg></Cam>
    <Cap text="1985 · The Reagan ranch" at={t(wd(20, "1985"))} />
  </>) },
  { a: ln(21), sfx: [[2, "whoosh", 0.12]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.03}><Svg bg={<RanchBanner text="HAPPY THANKSGIVING RON AND NANCY" />}>
      <Rig c="nancy_reagan" pose="waves_at_banner" x={760} y={1030} h={500} stress />
      <Rig c="ronald_reagan" pose="amused_gestures_to_charlie" x={460} y={1030} h={520} />
    </Svg></Cam>
    <Cap text="120-foot banner" at={t(wd(21, "120"))} />
  </>) },
  { a: ln(22), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Rig c="ronald_reagan" pose="listening_to_reporter" x={560} y={1030} h={580} />
      <Spr s="Poses/brown_turkey/standing_alert" x={980} y={1030} h={320} />
      <Rig c="tv_reporter" pose="attentive_with_microphone" x={1460} y={1030} h={540} at={t(ln(23))} />
    </Svg></Cam>
    <Cap text="1987" pos="top" at={t(wd(22, "1987"))} />
  </>) },
  { a: ln(23), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Rig c="ronald_reagan" pose="listening_to_reporter" x={560} y={1030} h={580} />
      <Rig c="tv_reporter" pose="asks_pardon_question" x={1400} y={1030} h={560} stress />
    </Svg></Cam>
    <Over><Bubble x={1300} y={230} text="PARDON THE IRAN-CONTRA OFFICIALS?" tx={1360} ty={430} at={t(wd(23, "pardon"))} w={900} size={40} /></Over>
  </>) },
  { a: ln(24), sfx: [[F(wd(24, "charlie") - ln(24)), "pop", 0.12]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Steps s={[[0, <Rig c="ronald_reagan" pose="pardon_quip" x={520} y={1030} h={600} stress />], [t(wd(24, "charlie")), <Rig c="ronald_reagan" pose="amused_gestures_to_charlie" x={520} y={1030} h={600} stress />]]} />
      <Swap t={t(wd(24, "pardoned"))} a={<Spr s="Poses/brown_turkey/standing_alert" x={1060} y={1030} h={340} />} b={<Spr s="Poses/brown_turkey/nervous_beak_open" x={1060} y={1030} h={340} />} />
      <Rig c="tv_reporter" pose="baffled_lowers_microphone" x={1560} y={1030} h={520} />
      <Tag name="charlie" x={1060} y={620} w={260} at={t(wd(24, "charlie"))} />
    </Svg></Cam>
    <Over><Bubble x={760} y={200} text={'"…I WOULD HAVE PARDONED HIM."'} tx={600} ty={420} at={t(wd(24, "pardoned")) - 12} w={820} size={42} /></Over>
  </>) },
  { a: ln(25), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Village />}><Spr s="Poses/brown_turkey/relieved_eyes_closed" x={960} y={1030} h={400} stress /><Tag name="charlie" x={960} y={560} w={260} /></Svg></Cam>
    <Cap text="Already headed to a petting zoo" at={t(wd(25, "already"))} />
  </>) },
  { a: ln(26), sfx: [[F(wd(27, "joke") - ln(26)) + 6, "sub_thump", 0.25]], el: (t, dur) => (<>
    <Cam dur={dur} from={1.1} to={1.15} oy="40%"><Svg bg={<WhiteHouseLawn />}><Rig c="ronald_reagan" pose="pardon_quip" x={960} y={1030} h={620} /></Svg></Cam>
    <Stamp lines={['"PARDON"', "(AS A JOKE)"]} at={t(wd(27, "joke"))} x={1420} y={320} rot={-8} variant="dark" />
  </>) },
  { a: ln(28), el: (t, dur) => (
    <Cam dur={dur} from={1.12} to={1.16} oy="38%"><Svg bg={<B.Studio />}><Quill pose="speaking_facing_right" talk x={960} y={1010} h={720} /></Svg></Cam>) },

  // ===== 13. GEORGE H.W. BUSH =====
  { a: ln(29), el: (t) => (<>
    <Cam dur={66} to={1.05}><Svg bg={<WhiteHouseLawn />}><Rig c="george_hw_bush" pose="attentive_neutral" x={960} y={1030} h={580} /></Svg></Cam>
    <Card text="George H.W. Bush" sub={"13 · It's Official"} until={t(ln(30)) - 1} />
  </>) },
  { a: ln(30), el: (t, dur) => (<>
    <Arch src="bush_pardon" mode="wide" dur={dur} sepia={0.1} />
    <Cap text="November 17, 1989" at={t(wd(30, "november"))} until={t(ln(31))} />
    <Cap text="200 years after Washington" at={t(ln(31))} />
  </>) },
  { a: ln(32), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Rig c="george_hw_bush" pose="attentive_neutral" x={560} y={1030} h={580} stress />
      <Spr s="Poses/white_ceremony_turkey/nervous_side_glance" x={1320} y={1030} h={420} />
    </Svg></Cam>
    <Cap text={'"…not end up on anyone\'s dinner table"'} at={t(wd(33, "will"))} size={58} />
  </>) },
  { a: ln(34), sfx: [[F(wd(34, "pardon") - ln(34)) + 6, "sub_thump", 0.3]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Swap t={t(wd(34, "pardon"))} a={<Rig c="george_hw_bush" pose="attentive_neutral" x={560} y={1030} h={600} />} b={<Rig c="george_hw_bush" pose="raises_hand_for_official_pardon" x={560} y={1030} h={600} stress />} />
      <Swap t={t(wd(34, "pardon")) + 4} a={<Spr s="Poses/white_ceremony_turkey/nervous_side_glance" x={1320} y={1030} h={420} />} b={<Spr s="Poses/white_ceremony_turkey/relieved_small_wave" x={1320} y={1030} h={420} />} />
    </Svg></Cam>
    <Stamp lines={["PARDONED"]} at={t(wd(34, "pardon"))} x={1340} y={300} rot={-9} variant="red" darken={false} />
  </>) },
  { a: ln(35), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Village />}>
      <Rig c="george_hw_bush" pose="warm_smile_after_pardon" x={460} y={1030} h={560} />
      <Spr s="Poses/white_ceremony_turkey/relieved_small_wave" x={1100} y={1030} h={420} walk={3} />
    </Svg></Cam>
    <Cap text="A children's farm" at={t(wd(35, "children's"))} />
  </>) },
  { a: ln(36), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}><Rig c="george_hw_bush" pose="warm_smile_after_pardon" x={960} y={1030} h={620} stress /></Svg></Cam>
    <Cap text="The official, every-year pardon" at={t(wd(36, "official"))} />
  </>) },
  { a: ln(37), sfx: [[F(wd(37, "one") - ln(37)), "ding", 0.15], [F(wd(38, "finally") - ln(37)), "cheer", 0.1]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Studio />}>
      <Swap t={t(wd(38, "finally"))}
        a={<Quill pose="scoreboard_facing_left" talk x={960} y={1010} h={720}><Board pose="scoreboard_facing_left" top="NO ASTERISK" big="1" at={t(wd(37, "one"))} /></Quill>}
        b={<Spr s="Poses/quill/scoreboard_celebration" x={960} y={1010} h={720}><Board pose="scoreboard_celebration" top="NO ASTERISK" big="1" /></Spr>} />
    </Svg></Cam>
    <Cap text="Turkeys spared, no asterisk: 1" pos="top" at={t(wd(37, "one"))} />
  </>) },
];

export const ThanksgivingCh11to13: React.FC = () => <Episode data={D} shots={SHOTS} />;
