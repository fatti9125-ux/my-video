import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import * as B from "../Thanksgiving/Backgrounds";
import { Avenue, OvalOffice, SkyScroll, TrainCar, WhiteHouseLawn } from "./Bg2";
import { Episode, epDuration, makeAlign, Shot, Steps, Svg, Swap } from "./Episode";
import { Cam, Cap, Card, Note, PopIn, QMarks, Quill, Rig, Speed, Spr, Stamp } from "./Kit";
import DATA from "./ep/h.json";

/** Chapter 7: Warren G. Harding, the turkey in the aviation helmet (VO ch7.mp3). */
const D = DATA as unknown as Parameters<typeof makeAlign>[0];
const { ln, wd } = makeAlign(D);
export const CH7_DURATION = epDuration(D);
const F = (s: number) => Math.round(s * 30);
const INK = "#1d1712";

/** White label with an ink arrow pointing at a detail (helmet, bow, coat). */
const Label: React.FC<{ x: number; y: number; text: string; to: [number, number]; at: number }> = ({ x, y, text, to, at }) => (
  <PopIn at={at} x={x} y={y}>
    <line x1={0} y1={0} x2={to[0] - x} y2={to[1] - y} stroke={INK} strokeWidth={8} strokeLinecap="round" />
    <circle cx={to[0] - x} cy={to[1] - y} r={10} fill={INK} />
    <g transform="rotate(-3)">
      <rect x={-text.length * 16 - 30} y={-46} width={text.length * 32 + 60} height={84} rx={10} fill="#fff" stroke={INK} strokeWidth={7} />
      <text y={15} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={48} fill={INK}>{text}</text>
    </g>
  </PopIn>
);

/** Chicago -> Washington road trip: route draws on, then the distance and time counters pop. */
const Route: React.FC<{ t800: number; t38: number }> = ({ t800, t38 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [4, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ax = 420, ay = 420, bx = 1500, by = 560;
  const pin = (x: number, y: number, name: string) => (
    <g transform={`translate(${x} ${y})`}>
      <path d="M 0 0 C -34 -40 -34 -84 0 -84 C 34 -84 34 -40 0 0 Z" fill="#e02b2b" stroke={INK} strokeWidth={6} />
      <circle cy={-56} r={12} fill="#fff" />
      <text y={64} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={50} fill="#fff" stroke={INK} strokeWidth={8} paintOrder="stroke">{name}</text>
    </g>
  );
  return (
    <g>
      <rect width={1920} height={1080} fill="#2f6f8f" />
      <path d="M 120 220 C 520 120 900 200 1280 170 C 1600 150 1800 260 1860 420 L 1820 900 C 1400 980 900 930 420 960 C 200 970 90 820 100 600 Z" fill="#e9dcb6" stroke="#fff" strokeWidth={14} />
      <path d={`M ${ax} ${ay} Q 960 300 ${bx} ${by}`} fill="none" stroke="#e02b2b" strokeWidth={12} strokeDasharray="34 22" pathLength={1000} strokeDashoffset={0}
        style={{ strokeDasharray: `${p * 1000} 1000` }} />
      {pin(ax, ay, "CHICAGO")}
      {pin(bx, by, "WASHINGTON")}
      <PopIn at={t800} x={700} y={800}><text textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={96} fill="#fff" stroke={INK} strokeWidth={10} paintOrder="stroke">800+ MILES</text></PopIn>
      <PopIn at={t38} x={1340} y={800}><text textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={96} fill="#fff" stroke={INK} strokeWidth={10} paintOrder="stroke">{"< 38 HOURS"}</text></PopIn>
    </g>
  );
};

const SHOTS: Shot[] = [
  { a: ln(0), el: (t) => (<>
    <Cam dur={80} to={1.05}><Svg bg={<OvalOffice />}><Rig c="warren_g_harding" pose="standing_neutral" x={960} y={1030} h={600} /></Svg></Cam>
    <Card text="Warren G. Harding" sub="7 · The Turkey in the Aviation Helmet" until={t(ln(1)) - 1} />
  </>) },
  { a: ln(1), el: (t, dur) => (<>
    <Cam dur={dur} from={1.1} to={1.14} oy="40%"><Svg bg={<B.Studio v={3} />}>
      <Swap t={t(wd(1, "strange"))} a={<Quill pose="speaking_facing_right" talk x={960} y={1010} h={720} />} b={<Quill pose="nervous_side_glance" talk x={960} y={1010} h={720} />} />
    </Svg></Cam>
    <Cap text="The 1920s" pos="top" at={t(wd(1, "1920s"))} />
  </>) },
  { a: ln(2), sfx: [[F(wd(2, "flown") - ln(2)), "whoosh", 0.12]], el: (t, dur) => (<>
    <Cam dur={dur} to={1.05}><Svg bg={<WhiteHouseLawn />}>
      <Swap t={t(wd(2, "harding"))} a={<Rig c="warren_g_harding" pose="standing_neutral" x={560} y={1030} h={560} />} b={<Rig c="warren_g_harding" pose="bemused_pointing" x={560} y={1030} h={560} stress />} />
      <Speed x={1320} y={700} at={t(wd(2, "flown"))} frames={8} />
      <Spr s="Poses/supreme_ii/jaunty_in_flying_gear" x={1350} y={1030} h={420} flip at={t(wd(2, "flown"))} enter={{ from: "top", frames: 10, dist: 900 }} />
    </Svg></Cam>
    <Cap text="1921" pos="top" at={t(wd(2, "1921"))} />
    <Cap text="Supreme the Second" at={t(wd(2, "supreme"))} />
  </>) },
  { a: ln(3), el: (t, dur) => (
    <Cam dur={dur} to={1.04} punch={{ at: t(wd(3, "helmet")), frames: 8, to: 1.12, ox: "50%", oy: "35%" }}><Svg bg={<B.PlateBg color="#8fc6d8" />}>
      <Spr s="Poses/supreme_ii/jaunty_in_flying_gear" x={960} y={1040} h={760} stress />
      <Label x={480} y={200} text="AVIATION HELMET" to={[880, 330]} at={t(wd(3, "helmet"))} />
      <Label x={1520} y={200} text="GOGGLES" to={[1060, 290]} at={t(wd(3, "goggles"))} />
    </Svg></Cam>) },
  { a: ln(4), sfx: [[1, "paper", 0.12]], el: (t, dur) => (<>
    <Steps s={[[0, (
      <Cam dur={dur} to={1.05}><Svg bg={<B.Study sepia />} dim={0.35}>
        <PopIn at={0} x={960} y={540}><g transform="rotate(-2)">
          <rect x={-420} y={-380} width={840} height={760} fill="#efe6d0" stroke={INK} strokeWidth={8} />
          <text y={-290} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={70} fill={INK}>The Baltimore Sun</text>
          <line x1={-380} x2={380} y1={-255} y2={-255} stroke={INK} strokeWidth={5} />
          <text y={-180} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={50} fill={INK}>TURKEY FLIES TO HARDING</text>
          {Array.from({ length: 11 }, (_, i) => <line key={i} x1={-370} x2={i % 4 === 3 ? 120 : 370} y1={-110 + i * 42} y2={-110 + i * 42} stroke="#9a9080" strokeWidth={8} />)}
        </g></PopIn>
      </Svg></Cam>)],
      [t(wd(4, "clad")), (
      <Cam dur={dur} to={1.05}><Svg bg={<B.PlateBg color="#d9a441" />}>
        <Spr s="Poses/supreme_ii/jaunty_in_flying_gear" x={960} y={1040} h={760} stress />
        <Label x={1500} y={980} text="BLACK & GOLD SWEATER" to={[1120, 800]} at={t(wd(4, "sweater"))} />
        <Label x={420} y={520} text="PINK BOW" to={[1040, 660]} at={t(wd(4, "bow"))} />
      </Svg></Cam>)]]} />
    <Cap text={'"Clad in a black and gold sweater"'} pos="top" size={62} at={t(wd(4, "clad"))} />
  </>) },
  { a: ln(5), el: (t, dur) => (
    <Cam dur={dur} to={1.06}><Svg bg={<SkyScroll speed={14} />}>
      <Speed x={760} y={600} at={0} frames={dur} dir={1} />
      <Spr s="Poses/supreme_ii/jaunty_in_flying_gear" x={900} y={820} h={460} shake={6} />
    </Svg></Cam>) },
  { a: ln(6), sfx: [[F(wd(6, "airsick") - ln(6)), "boing", 0.08]], el: (t, dur) => (
    <Cam dur={dur} from={1.05} to={1.08} punch={{ at: t(wd(6, "airsick")), frames: 6, to: 1.15, oy: "35%" }}><Svg bg={<SkyScroll speed={6} />}>
      <Swap t={t(wd(6, "airsick"))} a={<Spr s="Poses/supreme_ii/jaunty_in_flying_gear" x={960} y={1000} h={640} shake={4} />} b={<Spr s="Poses/supreme_ii/green_face_airsick" x={960} y={1000} h={640} shake={2} />} />
    </Svg></Cam>) },
  { a: ln(7), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<TrainCar />}>
      <Swap t={t(wd(7, "train"))} a={<Spr s="Poses/supreme_ii/green_face_airsick" x={960} y={1000} h={520} />} b={<Spr s="Poses/supreme_ii/relieved_on_train_seat" x={960} y={1000} h={540} stress />} />
    </Svg></Cam>) },
  { a: ln(8), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<OvalOffice />}>
      <Swap t={t(wd(8, "third"))} a={<Rig c="warren_g_harding" pose="standing_neutral" x={560} y={1030} h={580} />} b={<Rig c="warren_g_harding" pose="baffled_palms_up" x={560} y={1030} h={580} stress />} />
      <Spr s="Poses/supreme_iii/alert_in_motor_coat" x={1340} y={1030} h={460} flip at={t(wd(8, "sent"))} enter={{ from: "right", frames: 8 }} />
      <QMarks x={560} y={420} at={t(wd(8, "third")) + 4} spread={170} size={100} />
    </Svg></Cam>
    <Cap text="1922 · Chicago" pos="top" at={t(wd(8, "chicago"))} />
    <Cap text="Supreme the Third" at={t(wd(8, "supreme"))} />
  </>) },
  { a: ln(9), el: (t, dur) => (
    <Cam dur={dur} to={1.04} punch={{ at: t(wd(9, "chocolates")), frames: 6, to: 1.1, ox: "60%" }}><Svg bg={<B.PlateBg color="#8a5a3c" />}>
      <Spr s="Poses/supreme_iii/with_chocolate_box" x={960} y={1040} h={700} stress />
    </Svg></Cam>) },
  { a: ln(10), el: (t, dur) => (<>
    <Steps s={[[0, <Cam dur={dur} to={1.04}><Svg bg={<Route t800={t(wd(10, "800"))} t38={t(wd(10, "38"))} />} /></Cam>],
      [t(wd(10, "cage")), (
      <Cam dur={dur} to={1.04}><Svg bg={<Avenue stop={false} />}>
        <Spr s="Poses/supreme_iii/in_spring_suspended_cage" x={960} y={1040} h={560} shake={5} />
      </Svg></Cam>)]]} />
    {/* cage label sits in the top band, clear of the bird */}
    <Cap text="A cage hung on springs" pos="top" at={t(wd(10, "springs"))} />
  </>) },
  { a: ln(11), el: (t, dur) => (
    <Cam dur={dur} to={1.05}><Svg bg={<B.PlateBg color="#4f7fa6" />}>
      <Spr s="Poses/supreme_iii/alert_in_motor_coat" x={900} y={1040} h={720} stress />
      <Label x={1520} y={360} text="CUSTOM MOTOR COAT" to={[1060, 700]} at={t(wd(11, "coat"))} />
    </Svg></Cam>) },
  { a: ln(12), el: (t, dur) => (
    <Cam dur={dur} from={1.1} to={1.14} oy="40%"><Svg bg={<B.Studio v={0} />}>
      <Quill pose="nervous_side_glance" talk x={960} y={1010} h={720} />
      <QMarks x={960} y={300} at={t(wd(12, "spared"))} spread={300} />
    </Svg></Cam>) },
  { a: ln(13), sfx: Array.from({ length: 8 }, (_, i) => [3 + i * 2, "type_tick", 0.06] as [number, string, number]), el: (t, dur) => (
    <Cam dur={dur} to={1.04}><Svg bg={<B.Study sepia />} dim={0.45}><Note x={960} y={540} text="Fate: ???" at={2} w={900} /></Svg></Cam>) },
  { a: ln(14), el: (t, dur) => (<>
    <Cam dur={dur} to={1.04}><Svg bg={<WhiteHouseLawn />}>
      <Spr s="Poses/supreme_ii/jaunty_in_flying_gear" x={760} y={1030} h={560} stress />
    </Svg></Cam>
    <Stamp lines={["SWEATER:", "CONFIRMED"]} at={t(wd(14, "sweater"))} x={1400} y={360} rot={-8} variant="dark" />
  </>) },
];

export const ThanksgivingCh7: React.FC = () => <Episode data={D} shots={SHOTS} />;
