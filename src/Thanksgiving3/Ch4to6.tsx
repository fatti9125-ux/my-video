import React from "react";
import { Sequence } from "remotion";
import { useCurrentFrame } from "remotion";
import * as B from "../Thanksgiving/Backgrounds";
import { BigText, Bubble, CalendarPage, PropImg, SplitWar } from "../Thanksgiving/Graphics";
import { DiningRoom, OvalOffice, TrainCar, WhiteHouseLawn } from "./Bg2";
import { Board, Episode, epDuration, makeAlign, Over, Shot, Steps, Svg, Swap } from "./Episode";
import { Arch, Cam, Cap, Card, Note, PopIn, Puff, QMarks, Quill, Rig, Speed, Spr, Stamp } from "./Kit";
import DATA from "./ep/l.json";

/** Chapters 4-6: Lincoln in wartime, the Poultry King, Wilson's war years (VO ch4_6.mp3). */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const CH4_6_DURATION = epDuration(D);
const F = (s: number) => Math.round(s * 30);

const SHOTS: Shot[] = [
  // ===== 4. ABRAHAM LINCOLN — THANKSGIVING IN WARTIME =====
  { a: ln(0), el: (t) => (<>
    <Cam dur={75} to={1.05}><Svg bg={<B.LincolnOffice />}><Rig c="abraham_lincoln" pose="weary_reading_hale_letter" x={960} y={1030} h={580} stress /></Svg></Cam>
    <Card text="Abraham Lincoln" sub="4 · Thanksgiving in Wartime" until={t(ln(1)) - 1} />
  </>) },
  { a: ln(1), sfx: [[F(wd(1, "issued") - ln(1)), "scribble", 0.15]], el: (t) => (<>
    <Cam dur={104} to={1.05}><Svg bg={<B.LincolnOffice />}>
      <Swap t={t(wd(1, "issued"))} a={<Rig c="abraham_lincoln" pose="weary_reading_hale_letter" x={900} y={1030} h={600} stress />} b={<Rig c="abraham_lincoln" pose="signs_proclamation" x={900} y={1030} h={600} />} />
    </Svg></Cam>
    <Cap text="October 3, 1863" at={t(wd(1, "october"))} />
  </>) },
  { a: ln(2), el: (t) => (<>
    <Cam dur={107} to={1.04}><Svg bg={<B.LincolnOffice />}>
      <Rig c="abraham_lincoln" pose="weary_reading_hale_letter" x={560} y={1030} h={580} />
      <Swap t={t(wd(2, "william"))} a={<Swap t={t(wd(2, "written"))} a={<Rig c="william_seward" pose="focused_with_pen" x={1340} y={1030} h={580} />} b={<Rig c="william_seward" pose="writes_proclamation" x={1340} y={1030} h={580} stress />} />} b={<Rig c="william_seward" pose="hands_over_proclamation" x={1340} y={1030} h={580} stress />} />
    </Svg></Cam>
    <Cap text="William Seward" at={t(wd(2, "william"))} />
  </>) },
  { a: ln(3), el: (t, dur) => (<>
    <Arch src="lincoln_procl" dur={dur} focus={[50, 30]} zoom={[1, 1.15]} />
    <Cap text="The last Thursday in November" at={t(wd(3, "last"))} size={64} />
  </>) },
  { a: ln(4), sfx: [[2, "pop", 0.12]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.05}><Svg bg={<B.LincolnOffice />} dim={0.5}><PopIn at={2} x={960} y={540}><CalendarPage x={0} y={0} month="NOVEMBER" day="26" sub="1863" w={420} /></PopIn></Svg></Cam>
  </>) },
  { a: ln(5), sfx: [[F(wd(7, "same") - ln(5)), "sub_thump", 0.25]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Study />} dim={0.55}>
      <PopIn at={t(wd(6, "october"))} x={560} y={540}><CalendarPage x={0} y={0} month="OCTOBER" day="3" sub="1789" w={360} rot={-5} /></PopIn>
      <PopIn at={t(wd(7, "same"))} x={1360} y={540}><CalendarPage x={0} y={0} month="OCTOBER" day="3" sub="1863" w={360} rot={5} /></PopIn>
      <BigText x={960} y={560} text="=" size={170} at={t(wd(7, "same"))} color="#ffcf4a" />
    </Svg></Cam>
    <Cap text="74 years apart" at={t(wd(7, "seventy"))} />
  </>) },
  { a: ln(8), sfx: [[F(wd(8, "civil") - ln(8)), "sub_thump", 0.2]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<SplitWar at={t(wd(8, "civil"))} />} /></Cam><Cap text="The Civil War" at={t(wd(8, "civil"))} />
  </>) },
  { a: ln(9), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<SplitWar at={0} />}>
      <PopIn at={t(wd(9, "proclaiming"))} x={420} y={560}><CalendarPage x={0} y={0} month="NORTH" day="✓" sub="THANKSGIVING" w={300} rot={-4} /></PopIn>
      <PopIn at={t(wd(9, "proclaiming")) + 8} x={1500} y={560}><CalendarPage x={0} y={0} month="SOUTH" day="✓" sub="THANKSGIVING" w={300} rot={4} /></PopIn>
    </Svg></Cam>
    <Cap text="Both sides gave thanks" at={t(wd(9, "both"))} />
  </>) },
  { a: ln(10), el: (t, dur) => (<>
    <Cam dur={dur} to={1.05}><Svg bg={<B.LincolnOffice />}><Rig c="abraham_lincoln" pose="signs_proclamation" x={960} y={1030} h={620} stress /></Svg></Cam>
    <Cap text="One nation · peace & harmony" at={t(wd(10, "one"))} />
  </>) },
  { a: ln(11), sfx: [[F(wd(12, "stuck") - ln(11)), "sub_thump", 0.25]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Study />} dim={0.5}>
      {[1863, 1864, 1865, 1866, 1867].map((y, i) => <PopIn key={y} at={t(wd(11, "every")) + i * 5} x={360 + i * 300} y={540}><CalendarPage x={0} y={0} month="NOVEMBER" day="✓" sub={String(y)} w={240} rot={(i % 2 ? 4 : -4)} /></PopIn>)}
    </Svg></Cam>
    <Stamp lines={["IT", "STUCK"]} at={t(wd(12, "stuck"))} x={1500} y={250} rot={-9} variant="dark" />
  </>) },
  { a: ln(13), el: (t, dur) => (
    <Cam dur={dur} from={1.1} to={1.15} oy="38%"><Svg bg={<B.Studio v={1} />}><Quill pose="nervous_side_glance" talk x={960} y={1010} h={720} /></Svg></Cam>) },
  { a: ln(15), el: (t, dur) => (<>
    <Cam dur={dur} to={1.05}><Svg bg={<WhiteHouseLawn />}>
      <Rig c="abraham_lincoln" pose="softens_toward_tad" x={520} y={1020} h={560} />
      <Rig c="tad_lincoln" pose="relieved_smile" x={1060} y={1030} h={360} flip />
      <Spr s="Poses/jack/standing_alert" x={1450} y={1030} h={330} at={t(wd(15, "turkey"))} />
    </Svg></Cam>
    {<Sequence from={t(wd(15, "lincoln"))} durationInFrames={t(wd(15, "turkey")) - t(wd(15, "lincoln"))} layout="none"><Arch src="lincoln_tad" mode="portrait" dur={t(wd(15, "turkey")) - t(wd(15, "lincoln"))} focus={[50, 35]} /></Sequence>}
    <Cap text="Tad Lincoln" at={t(wd(15, "tad"))} />
  </>) },
  { a: ln(16), el: (t, dur) => (<>
    <Cam dur={dur} from={1.15} to={1.2} ox="60%" oy="70%"><Svg bg={<WhiteHouseLawn />}><Spr s="Poses/jack/standing_alert" x={1150} y={1030} h={420} stress /></Svg></Cam>
    <Cap text="Jack" at={t(wd(16, "jack"))} />
  </>) },
  { a: ln(17), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Swap t={t(wd(18, "lincoln"))} a={<Rig c="abraham_lincoln" pose="weary_reading_hale_letter" x={520} y={1020} h={560} />} b={<Rig c="abraham_lincoln" pose="softens_toward_tad" x={520} y={1020} h={560} />} />
      <Swap t={t(wd(18, "did")) + 4} a={<Rig c="tad_lincoln" pose="pleading_hands_clasped" x={1080} y={1030} h={360} flip stress />} b={<Rig c="tad_lincoln" pose="hugs_jack" x={1150} y={1030} h={380} />} />
      <Swap t={t(wd(18, "did")) + 4} a={<Spr s="Poses/jack/tucks_wings_for_hug" x={1500} y={1030} h={320} />} b={null} />
    </Svg></Cam>) },
  { a: ln(19), sfx: [[F(wd(19, "noah") - ln(19)), "scribble", 0.12]], el: (t, dur) => (<>
    <Swap t={t(wd(19, "1865"))} a={<Cam dur={dur} to={1.05}><Svg bg={<B.EditorOffice />}><Rig c="noah_brooks" pose="scribbling_notes" x={960} y={1030} h={620} stress /></Svg></Cam>}
      b={<Cam dur={dur} from={1.1} to={1.15}><Svg bg={<B.EditorOffice />}><Rig c="noah_brooks" pose="raises_eyebrow" x={960} y={1030} h={640} /></Svg></Cam>} />
    <Cap text="Noah Brooks · reporter" at={t(wd(19, "noah"))} until={t(wd(19, "1865"))} />
    <Cap text="1865" at={t(wd(19, "1865"))} />
  </>) },
  { a: ln(20), sfx: [[F(wd(20, "first") - ln(20)), "sub_thump", 0.25]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}><Rig c="abraham_lincoln" pose="softens_toward_tad" x={560} y={1020} h={560} /><Rig c="tad_lincoln" pose="hugs_jack" x={1150} y={1030} h={400} /></Svg></Cam>
    <Stamp lines={["THE FIRST", "TURKEY", "PARDON?"]} at={t(wd(20, "pardon"))} x={1450} y={300} rot={-8} variant="dark" />
  </>) },
  { a: ln(21), el: (t, dur) => (
    <Cam dur={dur} from={1.12} to={1.16} oy="38%"><Svg bg={<B.Studio v={2} />}><Quill pose="speaking_facing_right" talk x={960} y={1010} h={720} /></Svg></Cam>) },
  { a: ln(22), sfx: [[F(wd(22, "christmas") - ln(22)), "pop", 0.12]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.LincolnOffice />} dim={0.45}>
      <PopIn at={t(wd(22, "christmas"))} x={620} y={540}><CalendarPage x={0} y={0} month="DECEMBER" day="25" sub="CHRISTMAS ✓" w={380} rot={-4} /></PopIn>
      <PopIn at={t(wd(22, "thanksgiving"))} x={1300} y={540}><CalendarPage x={0} y={0} month="NOVEMBER" day="✗" sub="THANKSGIVING" w={380} rot={4} /></PopIn>
    </Svg></Cam>
  </>) },
  { a: ln(23),  el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Study />} dim={0.45}><Note x={820} y={560} text="Pardon tradition started by Lincoln?" at={t(wd(23, "idea"))} w={1000} /></Svg></Cam>
    <Cap text="White House Historical Association" pos="top" at={t(wd(23, "white"))} size={56} />
    <Stamp lines={["LIKELY", "APOCRYPHAL"]} at={t(wd(23, "apocryphal"))} x={1420} y={780} rot={-8} variant="dark" />
  </>) },
  { a: ln(24), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Steps s={[[0, <Spr s="Poses/jack/standing_alert" x={960} y={1030} h={420} />], [t(wd(26, "yes")), <Spr s="Poses/jack/relieved_after_plea" x={960} y={1030} h={420} stress />], [t(wd(28, "no")), <Spr s="Poses/jack/tucks_wings_for_hug" x={960} y={1030} h={420} />]]} />
    </Svg></Cam>
    <Cap text="Did Jack live? Yes." at={t(wd(26, "yes"))} until={t(wd(27, "did"))} />
    <Cap text="Did he start a tradition? No." at={t(wd(28, "no"))} />
  </>) },
  { a: ln(29), sfx: [[F(wd(29, "one") - ln(29)), "ding", 0.15]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Studio v={3} />}>
      <Quill pose="scoreboard_facing_left" talk x={960} y={1010} h={720}><Board pose="scoreboard_facing_left" top="TURKEYS SPARED" big={"1*"} at={t(wd(29, "one"))} /></Quill>
    </Svg></Cam>
    <Cap text="Turkeys spared: 1*" pos="top" at={t(wd(29, "one"))} />
  </>) },

  // ===== 5. GRANT TO WILSON — THE POULTRY KING =====
  { a: ln(32), el: (t) => (<>
    <Cam dur={115} to={1.05}><Svg bg={<B.Village />}><Rig c="horace_vose" pose="proudly_holds_turkey" x={960} y={1030} h={560} stress /></Svg></Cam>
    <Card text="The Poultry King" sub="5 · Grant to Wilson" until={t(ln(33)) - 1} />
  </>) },
  { a: ln(33), sfx: [[F(wd(33, "mailed") - ln(33)), "whoosh", 0.12]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Village />}>
      <Swap t={t(wd(33, "mailed"))} a={<Rig c="horace_vose" pose="proudly_holds_turkey" x={560} y={1030} h={560} stress />} b={<Rig c="horace_vose" pose="holds_express_crate" x={560} y={1030} h={560} />} />
      <Rig c="ulysses_s_grant" pose="standing_neutral" x={1400} y={1030} h={580} at={t(wd(33, "president"))} enter={{ from: "right", frames: 8 }} />
    </Svg></Cam>
    <Cap text="1873" pos="top" at={t(wd(33, "1873"))} />
    <Cap text="Horace Vose · Rhode Island" at={t(wd(33, "horace"))} until={t(wd(33, "ulysses"))} />
    <Cap text="Ulysses S. Grant" at={t(wd(33, "ulysses"))} />
  </>) },
  { a: ln(35), sfx: [[2, "thud", 0.18], [F(wd(36, "again") - ln(35)), "thud", 0.18], [F(wd(37, "every") - ln(35)), "thud", 0.18]], el: (t, dur) => {
    const Stack: React.FC = () => { const f = useCurrentFrame(); const n = f < t(wd(36, "again")) ? 1 : f < t(wd(37, "every")) ? 2 : Math.min(9, 3 + Math.floor((f - t(wd(37, "every"))) / 6));
      return <>{Array.from({ length: n }, (_, i) => <Spr key={i} s="Poses/poultry_props/vose_express_shipment_box" x={1080 + (i % 3) * 230} y={1030 - Math.floor(i / 3) * 190} h={190} drop={{ frames: 8, height: 700 }} />)}</>; };
    return (<>
      <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}><Rig c="ulysses_s_grant" pose="receives_express_crate" x={520} y={1030} h={580} /><Stack /></Svg></Cam>
      <Cap text="Every year" at={t(wd(37, "every"))} until={t(wd(38, "until"))} />
      <Cap text="Until 1913" at={t(wd(38, "until"))} />
    </>);
  } },
  { a: ln(39), el: (t, dur) => (<>
    <Cam dur={dur} from={1.1} to={1.16} oy="40%"><Svg bg={<B.Village />}><Rig c="horace_vose" pose="proudly_holds_turkey" x={960} y={1030} h={640} stress /></Svg></Cam>
    <Cap text={'"The Poultry King"'} at={t(wd(39, "poultry"))} />
  </>) },
  { a: ln(40), el: (t, dur) => (<>
    <Cam dur={dur} to={1.05}><Svg bg={<B.Village />}>
      <Rig c="horace_vose" pose="proudly_holds_turkey" x={760} y={1030} h={600} stress />
      <Spr s="Poses/brown_turkey/standing_alert" x={1300} y={1030} h={300} flip />
      <Spr s="Poses/brown_turkey/standing_alert" x={1560} y={1040} h={280} flip />
    </Svg></Cam>
    <Cap text="Rhode Island & Connecticut" at={t(wd(40, "rhode"))} />
  </>) },
  { a: ln(41), sfx: [[F(wd(41, "30") - ln(41)), "pop", 0.12], [F(wd(42, "50") - ln(41)), "pop", 0.12]], el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<B.Village />} dim={0.5}>
      <Spr s="Poses/brown_turkey/standing_alert" x={960} y={950} h={460} />
      <BigText x={480} y={420} text="30 LB" size={120} at={t(wd(41, "30"))} />
      <BigText x={1440} y={420} text="50 LB!" size={120} at={t(wd(42, "50"))} color="#ffcf4a" />
    </Svg></Cam>) },
  { a: ln(43), sfx: [[F(wd(43, "box") - ln(43)), "thud", 0.15]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Village />}>
      <Rig c="horace_vose" pose="holds_express_crate" x={640} y={1030} h={580} stress />
      <Spr s="Poses/poultry_props/vose_express_shipment_box" x={1300} y={1030} h={260} at={t(wd(43, "box"))} drop={{ frames: 8, height: 700 }} />
      <Puff x={1300} y={1030} at={t(wd(43, "box")) + 8} />
    </Svg></Cam>
    <Over><PopIn at={t(wd(43, "addressed"))} x={1300} y={930}><rect x={-130} y={-34} width={260} height={68} rx={10} fill="#f9e7bf" stroke="#1d1712" strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={34} fill="#1d1712">THE PRESIDENT</text></PopIn></Over>
    <Cap text="Shipped by express" at={t(wd(43, "shipped"))} />
  </>) },
  { a: ln(44), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<DiningRoom />}>
      <Rig c="ulysses_s_grant" pose="pleased_with_dinner" x={560} y={1030} h={560} stress />
      <Swap t={t(wd(44, "turkeys"))} a={<Rig c="rutherford_b_hayes" pose="satisfied_after_dinner" x={1360} y={1030} h={560} flip />} b={<Rig c="rutherford_b_hayes" pose="approving_smile" x={1360} y={1030} h={560} flip />} />
    </Svg></Cam>
    <Cap text="Four decades of presidents" at={t(wd(44, "four"))} />
  </>) },
  { a: ln(45),  el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Village />}><Rig c="horace_vose" pose="proudly_holds_turkey" x={760} y={1030} h={600} /></Svg></Cam>
    <Stamp lines={["NO", "PARDONS"]} at={t(wd(45, "pardons"))} x={1400} y={320} rot={-10} variant="red" darken={false} />
  </>) },
  { a: ln(46), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />}>
      <Rig c="woodrow_wilson" pose="puzzled_by_rival_turkeys" x={960} y={1030} h={580} />
      <Rig c="south_trimble" pose="competitive_folded_arms" x={1500} y={1030} h={560} at={t(wd(46, "rival"))} enter={{ from: "right", frames: 8 }} />
    </Svg></Cam>
    <Cap text="1913 · Woodrow Wilson" at={t(wd(46, "1913"))} until={t(wd(46, "south"))} />
    <Cap text="South Trimble · Clerk of the House" at={t(wd(46, "south"))} size={62} />
  </>) },
  { a: ln(47), sfx: [[F(wd(47, "30") - ln(47)), "pop", 0.12], [F(wd(48, "37") - ln(47)), "pop", 0.12]], el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />}>
      <Rig c="south_trimble" pose="smug_smirk" x={1500} y={1030} h={560} />
      <Rig c="horace_vose" pose="proudly_holds_turkey" x={420} y={1030} h={560} at={t(wd(48, "vose"))} enter={{ from: "left", frames: 8 }} />
      <BigText x={1500} y={330} text="30 LB" size={100} at={t(wd(47, "30"))} />
      <BigText x={420} y={330} text="37 LB" size={100} at={t(wd(48, "37"))} color="#ffcf4a" />
      <Rig c="woodrow_wilson" pose="puzzled_by_rival_turkeys" x={960} y={1030} h={560} />
    </Svg></Cam>) },
  { a: ln(49), el: (t, dur) => (
    <Cam dur={dur} to={1.05}><Svg bg={<OvalOffice />}>
      <Swap t={t(wd(49, "red"))} a={<Rig c="south_trimble" pose="smug_smirk" x={1300} y={1030} h={620} stress />} b={<Rig c="south_trimble" pose="shows_red_pepper" x={1300} y={1030} h={620} stress />} />
      <Rig c="horace_vose" pose="holds_red_pepper" x={560} y={1030} h={560} />
    </Svg></Cam>) },
  { a: ln(50), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />}>
      <Rig c="woodrow_wilson" pose="puzzled_by_rival_turkeys" x={960} y={1030} h={620} />
      <QMarks x={960} y={330} at={t(wd(51, "nobody"))} spread={260} />
    </Svg></Cam>
    <Cap text="Nobody knows." at={t(wd(51, "nobody"))} />
  </>) },
  { a: ln(52),  el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />}>
      <Rig c="horace_vose" pose="proudly_holds_turkey" x={420} y={1030} h={540} />
      <Rig c="woodrow_wilson" pose="puzzled_by_rival_turkeys" x={960} y={1030} h={560} />
      <Rig c="south_trimble" pose="competitive_folded_arms" x={1500} y={1030} h={540} />
    </Svg></Cam>
    <Stamp lines={["NO RECORDED", "WINNER"]} at={t(wd(52, "no"))} x={960} y={250} rot={-6} variant="dark" />
  </>) },
  { a: ln(53), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<DiningRoom />}><Spr s="Poses/poultry_props/baghdad_trophy_turkey" x={960} y={720} h={170} /></Svg></Cam>) },
  { a: ln(54), sfx: [[F(wd(54, "cooks") - ln(54)), "cheer", 0.1]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<DiningRoom />}>
      <Rig c="rutherford_b_hayes" pose="welcomes_white_house_staff" x={480} y={1030} h={580} stress />
      <Rig c="farm_worker" pose="carries_feed_pail" x={1180} y={1040} h={480} at={t(wd(54, "cooks"))} enter={{ from: "right", frames: 8 }} flip />
      <Rig c="aunt_delia" pose="delivers_mince_pie" x={1560} y={1040} h={480} at={t(wd(54, "staff"))} enter={{ from: "right", frames: 8 }} flip />
    </Svg></Cam>
    <Cap text="1878 · The Hayes family" at={t(wd(54, "1878"))} until={t(wd(54, "cooks"))} />
    <Cap text="Staff Thanksgiving · State Dining Room" at={t(wd(54, "cooks"))} size={58} />
  </>) },
  { a: ln(55), el: (t, dur) => (<>
    <Swap t={t(wd(55, "ordered"))} a={<Cam dur={dur} from={1.1} to={1.14}><Svg bg={<DiningRoom />}><Rig c="ida_mckinley" pose="prim_neutral" x={960} y={1030} h={620} /></Svg></Cam>}
      b={<Cam dur={dur} to={1.04}><Svg bg={<DiningRoom />}>
        <Steps s={[[0, <Rig c="ida_mckinley" pose="directs_dinner" x={1240} y={1030} h={580} stress />], [t(wd(55, "turkey")), <Rig c="ida_mckinley" pose="approving_with_menu" x={1240} y={1030} h={580} stress />]]} />
        <PopIn at={t(wd(55, "26"))} x={560} y={700}><Spr s="Poses/poultry_props/baghdad_trophy_turkey" x={0} y={0} h={220} /></PopIn>
      </Svg></Cam>} />
    <Cap text="1897 · Ida McKinley" at={0} until={t(wd(55, "26"))} />
    <Cap text="26 lb turkey · stuffed with oysters" at={t(wd(55, "26"))} size={60} />
  </>) },
  { a: ln(56), el: (t, dur) => (<>
    <Cam dur={dur} from={1.15} to={1.2} oy="40%"><Svg bg={<DiningRoom />}><Rig c="ida_mckinley" pose="prim_neutral" x={960} y={1030} h={600} /></Svg></Cam>
    <Cap text={'"Plain."'} at={2} />
  </>) },
  { a: ln(57), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<DiningRoom />}>
      <Rig c="aunt_delia" pose="delivers_mince_pie" x={520} y={1030} h={540} walk={1} walkUntil={t(wd(57, "aunt"))} at={0} />
      <Swap t={t(wd(58, "dinner"))} a={<Rig c="william_howard_taft" pose="expectant_with_pie" x={1380} y={1030} h={600} flip />} b={<Rig c="william_howard_taft" pose="delighted_with_pie" x={1380} y={1030} h={600} stress />} />
    </Svg></Cam>
    <Cap text="1912 · William Howard Taft" at={t(wd(57, "1912"))} until={t(wd(57, "aunt"))} />
    <Cap text="Mince pie from Aunt Delia" at={t(wd(57, "aunt"))} />
  </>) },
  { a: ln(59), sfx: [[F(wd(59, "delivered") - ln(59)), "ding", 0.15]], el: (t, dur) => (
    <Cam dur={dur} from={1.1} to={1.15} oy="40%"><Svg bg={<DiningRoom />}><Rig c="william_howard_taft" pose="shows_off_the_pie" x={960} y={1030} h={640} stress /></Svg></Cam>) },
  { a: ln(60), sfx: [[F(wd(60, "lots") - ln(60)), "ding", 0.15]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<B.Studio v={0} />}>
      <Steps s={[[0, <Quill pose="scoreboard_facing_left" talk x={960} y={1010} h={720}><Board pose="scoreboard_facing_left" top="TURKEYS EATEN" big="LOTS" /></Quill>],
        [t(wd(61, "spared")), <Quill pose="scoreboard_facing_left" talk x={960} y={1010} h={720}><Board pose="scoreboard_facing_left" top="TURKEYS SPARED" big="1*" /></Quill>]]} />
    </Svg></Cam>
    <Cap text="Eaten: lots · Spared: 1*" pos="top" at={t(wd(61, "spared"))} />
  </>) },

  // ===== 6. WOODROW WILSON — THE WAR YEARS =====
  { a: ln(63), el: (t) => (<>
    <Cam dur={70} to={1.05}><Svg bg={<OvalOffice />}><Rig c="woodrow_wilson" pose="stern_empty_dish" x={960} y={1030} h={580} /></Svg></Cam>
    <Card text="Woodrow Wilson" sub="6 · The War Years" until={t(ln(64)) - 1} />
  </>) },
  { a: ln(64), sfx: [[F(wd(64, "war") - ln(64)), "sub_thump", 0.2]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<SplitWar at={t(wd(64, "war"))} />} /></Cam>
    <Cap text="1917 · World War I" at={t(wd(64, "1917"))} />
  </>) },
  { a: ln(65), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<DiningRoom />} dim={0.3}><Rig c="woodrow_wilson" pose="stern_empty_dish" x={960} y={1030} h={600} stress /></Svg></Cam>
    <Cap text="Food conservation" at={t(wd(65, "conserved"))} />
  </>) },
  { a: ln(66), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<DiningRoom />}>
      <Rig c="woodrow_wilson" pose="stern_empty_dish" x={960} y={1030} h={600} stress />
    </Svg></Cam>) },
  { a: ln(67),  el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<DiningRoom />} dim={0.4}>
      <PopIn at={2} x={960} y={600}><ellipse rx={220} ry={70} fill="#f4f1ea" stroke="#1d1712" strokeWidth={8} /><ellipse rx={180} ry={46} fill="#b3262a" />{[-90, -40, 10, 60, 100].map((x) => <circle key={x} cx={x} cy={-10 + (x % 3) * 6} r={22} fill="#d63a3a" stroke="#1d1712" strokeWidth={4} />)}</PopIn>
    </Svg></Cam>
    <Over><PopIn at={t(wd(67, "cranberries"))} x={960} y={560}><path d="M -260 -200 L 260 200 M 260 -200 L -260 200" stroke="#e02b2b" strokeWidth={40} strokeLinecap="round" /></PopIn></Over>
  </>) },
  { a: ln(68),  el: (t, dur) => (<>
    <Cam dur={dur} from={1.15} to={1.2} oy="40%"><Svg bg={<OvalOffice />}><Rig c="woodrow_wilson" pose="stern_empty_dish" x={960} y={1030} h={620} /></Svg></Cam>
    <Stamp lines={["NO", "CRANBERRIES"]} at={t(wd(69, "serious"))} x={1400} y={300} rot={-9} variant="dark" />
  </>) },
  { a: ln(70), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}><Rig c="woodrow_wilson" pose="relieved_proclamation" x={960} y={1030} h={600} stress /></Svg></Cam>
    <Cap text="1918 · The war is over" at={t(wd(70, "war"))} />
  </>) },
  { a: ln(71), el: (t, dur) => (<>
    <Cam dur={dur} to={1.05}><Svg bg={<OvalOffice />}><Rig c="woodrow_wilson" pose="relieved_proclamation" x={960} y={1030} h={640} stress /></Svg></Cam>
    <Cap text={'"God has... given us peace."'} at={t(wd(71, "god"))} size={64} />
  </>) },
  { a: ln(72), sfx: [[F(wd(72, "returned") - ln(72)), "pop", 0.15]], el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<DiningRoom />}>
      <PopIn at={t(wd(72, "returned"))} x={960} y={720}><ellipse rx={220} ry={70} fill="#f4f1ea" stroke="#1d1712" strokeWidth={8} /><ellipse rx={180} ry={46} fill="#b3262a" />{[-90, -40, 10, 60, 100].map((x) => <circle key={x} cx={x} cy={-10} r={22} fill="#d63a3a" stroke="#1d1712" strokeWidth={4} />)}</PopIn>
      <Rig c="woodrow_wilson" pose="relieved_proclamation" x={1500} y={1030} h={520} flip />
    </Svg></Cam>) },
];

export const ThanksgivingCh4to6: React.FC = () => <Episode data={D} shots={SHOTS} />;
