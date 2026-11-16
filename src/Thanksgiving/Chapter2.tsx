import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Cap, Pose, Prop, Rig, Sfx, Shot, Stamp, usePop, useT } from "./core";
import { BluePlate, Country, Desk, Sepia, Stage, Study } from "./Sets";
import { CalPage, Cam, Capitol, Card, Church, NameCard, Pie, SERIF, Word } from "./Graphics";
import { MONTSERRAT } from "../fonts";

// Chapter 2 — John Adams and Thomas Jefferson: The One Who Said No. Seconds on ch2.wav (VO file 2, 0–62.53 s).
export const CH2_END = 63.0;

const Title: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.03}><Study v="tj" /></Cam>
    <NameCard text="Adams & Jefferson" sub="2 · The One Who Said No" />
  </AbsoluteFill>
);

const Adams: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.05} ox="40%">
      <Study v="adams" />
      <Pose who="john_adams" k="presenting_the_proclamation" x={760} y={1010} h={700} seed={2} />
    </Cam>
    <Cap t={3.4} text="John Adams · 1797–1801" />
    <Cap t={5.4} text="Days of prayer & thanksgiving" pos="top" />
  </AbsoluteFill>
);

const FineNormal: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.08}>
      <Study v="adams" />
      <Pose who="john_adams" k="reading_the_proclamation" x={960} y={1070} h={760} seed={3} bob={0.5} />
    </Cam>
    <Word t={7.24} text="Fine." x={520} y={300} size={150} rot={-6} />
    <Word t={7.82} text="Normal." x={1420} y={300} size={150} rot={5} />
  </AbsoluteFill>
);

const ThenCame: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Cam to={1.05}>
        <Study v="tj" />
        <Pose who="thomas_jefferson" k="three_quarter_neutral" x={interpolate(f, [0, 14], [2100, 1000], { extrapolateRight: "clamp" })} y={1010} h={680} seed={2} />
      </Cam>
      <Cap t={8.7} text="Thomas Jefferson" />
    </AbsoluteFill>
  );
};

const NoThankYou: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.06}>
      <Study v="tj" />
      <Pose who="thomas_jefferson" k="refusing" x={820} y={1030} h={800} seed={3} at={10.0} />
    </Cam>
    <AbsoluteFill><Bubble t={10.95} x={1430} y={330} text="No thank you." /></AbsoluteFill>
  </AbsoluteFill>
);

const Bubble: React.FC<{ t: number; x: number; y: number; text: string; w?: number }> = ({ t, x, y, text, w = 640 }) => {
  const s = usePop(t);
  if (!s) return null;
  return (
    <>
      <Stage>
        <g transform={`translate(${x} ${y}) scale(${s})`}>
          <path d={`M ${-w * 0.28} 70 L ${-w * 0.5} 230 L ${-w * 0.08} 90 Z`} fill="#fff" stroke="#1d1a17" strokeWidth={9} strokeLinejoin="round" />
          <ellipse rx={w / 2} ry={120} fill="#fff" stroke="#1d1a17" strokeWidth={9} />
          <path d={`M ${-w * 0.27} 82 L ${-w * 0.1} 98`} stroke="#fff" strokeWidth={16} />
          <text y={24} textAnchor="middle" fontFamily={MONTSERRAT} fontWeight={800} fontSize={74} fill="#1d1a17">{text.toUpperCase()}</text>
        </g>
      </Stage>
      <Sfx t={t} s="pop" v={0.35} />
    </>
  );
};

const NotPie: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Cam to={1.07}>
        <Study v="tj" />
        <Rig who="thomas_jefferson" x={620} y={1010} scale={1.45} head={[[12.0, "skeptical_head"], [13.2, "talking_head"]]} armR={t > 12.6 ? 55 : 10} seed={4} />
        <AbsoluteFill style={{ transform: `translateY(${(1 - usePop(12.25)) * 400}px)` }}><Pie x={1360} y={760} k={1.3} /></AbsoluteFill>
      </Cam>
      <Cap t={12.3} text="Not because he hated pie" pos="top" />
    </AbsoluteFill>
  );
};

const ChurchState: React.FC = () => {
  const t = useT();
  const blur = interpolate(t, [16.5, 19.3], [0, 18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <BluePlate>
        <Cam to={1.04}>
          <Church x={480} y={640} k={1.1} />
          <Capitol x={1440} y={640} k={1.15} />
          <Stage><line x1={960} y1={180} x2={960} y2={860} stroke="#fff" strokeWidth={14} strokeDasharray="40 22" style={{ filter: `blur(${blur}px)` }} /></Stage>
        </Cam>
        <Word t={14.1} text="Church" x={480} y={900} size={96} />
        <Word t={14.4} text="State" x={1440} y={900} size={96} />
      </BluePlate>
      <Cap t={16.6} text="Blurred line" pos="top" color="#ffd96a" />
    </AbsoluteFill>
  );
};

const Wall: React.FC = () => {
  const t = useT();
  const rows = Math.floor(interpolate(t, [20.0, 22.4], [0, 9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill>
      <BluePlate>
        <Cam to={1.04}>
          <Church x={480} y={640} k={1.1} />
          <Capitol x={1440} y={640} k={1.15} />
          <Stage>
            {Array.from({ length: rows }, (_, r) => [0, 1].map((c) => (
              <rect key={`${r}${c}`} x={880 + c * 80} y={860 - (r + 1) * 76} width={80} height={76} fill="#b8432f" stroke="#1d1a17" strokeWidth={6} />
            )))}
          </Stage>
        </Cam>
      </BluePlate>
      <Cap t={20.6} text="“A wall of separation”" pos="top" size={96} />
      {rows > 0 && <Sfx t={20.0} s="thud" v={0.25} />}
    </AbsoluteFill>
  );
};

const Twist: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.12}>
      <BluePlate color="#d9412f" />
      <Pose who="quill" k="surprised" x={960} y={1060} h={880} seed={2} />
    </Cam>
    <Word t={24.42} text="The twist?" y={170} size={130} />
  </AbsoluteFill>
);

const Governor: React.FC = () => (
  <AbsoluteFill>
    <Sepia>
      <Cam to={1.06} ox="40%">
        <Country v="va" />
        <Rig who="thomas_jefferson" x={760} y={1000} scale={1.35} head="talking_head" armL={60} armR={70} seed={5} />
      </Cam>
    </Sepia>
    <Cap t={25.5} text="Governor of Virginia · 1779" pos="top" />
    <Stamp t={28.2} lines={["THANKSGIVING:", "DECLARED!"]} x={1400} y={560} rotate={-8} />
  </AbsoluteFill>
);

const Refused: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.06}>
      <Study v="tj" />
      <Pose who="thomas_jefferson" k="refusing" x={760} y={1030} h={800} seed={6} />
    </Cam>
    <Cap t={30.45} text="As president: refused" pos="top" />
    <Stamp t={31.25} lines={["NO."]} x={1420} y={520} rotate={-12} size={150} />
  </AbsoluteFill>
);

const StatesFed: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <BluePlate>
        <Cam to={1.04}>
          <Card t={32.15} x={560} y={540} w={640} h={640} title="STATES" sub="YES" />
          <Card t={33.5} x={1360} y={540} w={640} h={640} title="FEDERAL" sub="NO" bg="#e9e2d6" />
          {t > 32.3 && <Church x={560} y={680} k={0.7} />}
          {t > 33.6 && <Capitol x={1360} y={600} k={0.8} />}
          {t > 34.4 && <Stage><g stroke="#c8261f" strokeWidth={34} strokeLinecap="round"><line x1={1160} y1={340} x2={1560} y2={740} /><line x1={1560} y1={340} x2={1160} y2={740} /></g></Stage>}
        </Cam>
      </BluePlate>
      <Sfx t={34.4} s="thud" v={0.4} />
    </AbsoluteFill>
  );
};

const Atheist: React.FC = () => {
  const s = usePop(35.6, { damping: 12, stiffness: 120 });
  return (
    <AbsoluteFill>
      <BluePlate color="#3a2a1c">
        <Sepia>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ width: 1200, height: 760, background: "#efe4c8", border: "6px solid #2a1c10", transform: `rotate(${(1 - s) * 720 - 4}deg) scale(${s})`, padding: 40, boxSizing: "border-box", fontFamily: SERIF, color: "#1d1a17" }}>
              <div style={{ fontSize: 64, textAlign: "center", borderBottom: "6px double #1d1a17", paddingBottom: 10, fontWeight: 700 }}>THE GAZETTE OF THE OPPOSITION</div>
              <div style={{ fontSize: 120, textAlign: "center", fontWeight: 900, marginTop: 40, lineHeight: 1.05 }}>JEFFERSON:<br />AN ATHEIST?!</div>
              <div style={{ display: "flex", gap: 30, marginTop: 40 }}>{[0, 1, 2].map((c) => <div key={c} style={{ flex: 1 }}>{Array.from({ length: 6 }, (_, i) => <div key={i} style={{ height: 12, background: "#8a7a5a", marginBottom: 14, width: `${70 + ((i * 13 + c * 7) % 30)}%` }} />)}</div>)}</div>
            </div>
          </AbsoluteFill>
        </Sepia>
      </BluePlate>
      <Sfx t={35.6} s="whoosh" v={0.4} />
    </AbsoluteFill>
  );
};

const Drafts: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.06}>
      <Study v="tj" night />
      <Rig who="thomas_jefferson" x={960} y={1000} scale={1.3} head="disapproving_head" armL={35} armR={35} seed={7} />
      <Desk y={790} w={900} />
      <Prop k="quill_and_inkpot" x={700} y={760} h={190} />
      <Prop k="sealed_letter" x={1180} y={780} h={120} at={38.2} />
    </Cam>
    <Cap t={38.0} text="A public explanation" pos="top" />
  </AbsoluteFill>
);

const Levi: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.06} ox="35%">
      <Study v="levi" />
      <Pose who="levi_lincoln_sr" k="warning" x={700} y={1020} h={760} seed={3} />
      <Pose who="thomas_jefferson" k="three_quarter_neutral" x={1450} y={1010} h={640} flip seed={8} />
    </Cam>
    <Cap t={40.5} text="Levi Lincoln Sr. · Attorney General" />
  </AbsoluteFill>
);

const NewEngland: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.06}>
      <Country v="ne" />
      <Pie x={760} y={900} k={1.2} />
    </Cam>
    <Cap t={42.85} text="New England ♥ Thanksgiving" pos="top" />
  </AbsoluteFill>
);

const CutOut: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Cam to={1.06}>
        <Study v="tj" night />
        {t < 46.96
          ? <Pose who="thomas_jefferson" k="setting_aside_a_page" x={960} y={1030} h={820} seed={9} />
          : <Rig who="thomas_jefferson" x={960} y={1010} scale={1.45} head="skeptical_head" seed={9} />}
      </Cam>
      <Word t={45.6} text="Snip." x={1450} y={300} size={120} rot={8} until={46.96} />
      <Sfx t={45.6} s="pop" v={0.4} />
      <Word t={47.05} text="…" x={1400} y={330} size={200} />
    </AbsoluteFill>
  );
};

const Madison: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.06} ox="40%">
      <Study v="madison" />
      <Pose who="james_madison" k="presenting_the_proclamation" x={800} y={1020} h={760} seed={2} at={48.5} />
    </Cam>
    <Cap t={48.7} text="James Madison" pos="top" />
    <Stamp t={50.9} lines={["BACK IN", "1815"]} x={1430} y={600} rotate={-9} />
  </AbsoluteFill>
);

const Decades: React.FC = () => {
  const t = useT();
  const year = Math.round(interpolate(t, [52.3, 55.0], [1815, 1845], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill>
      <BluePlate>
        <Cam to={1.04}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 300, color: "#fff", textShadow: "0 10px 0 rgba(0,0,0,0.3)" }}>{year}</div>
          </AbsoluteFill>
        </Cam>
      </BluePlate>
      <Cap t={53.0} text="Up to the states" />
    </AbsoluteFill>
  );
};

const STATES = ["N.Y.", "MASS.", "CONN.", "PENN.", "N.H.", "VT.", "N.J.", "MAINE", "OHIO", "R.I.", "MD.", "MICH."];
const Chaos: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <BluePlate>
        <Cam to={1.1} shake={t > 57.2 ? 8 : 0}>
          {STATES.map((s, i) => {
            const x = 290 + (i % 4) * 445, y = 250 + Math.floor(i / 4) * 300;
            const months = ["NOV", "DEC", "OCT", "NOV"]; const days = ["7", "14", "20", "28", "2", "30", "11", "25", "18", "5", "23", "9"];
            return (
              <React.Fragment key={s}>
                <CalPage t={55.4 + i * 0.16} x={x} y={y} month={months[i % 4]} day={days[i]} rot={((i * 37) % 20) - 10} k={0.62} head={["#c8261f", "#2d4b8a", "#d98a3a"][i % 3]} />
                {t > 55.5 + i * 0.16 && <div style={{ position: "absolute", left: x - 60, top: y + 100, width: 120, textAlign: "center", fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 40, color: "#fff", textShadow: "0 3px 0 #000", transform: `rotate(${((i * 23) % 16) - 8}deg)` }}>{s}</div>}
              </React.Fragment>
            );
          })}
        </Cam>
      </BluePlate>
      <Word t={57.25} text="Total chaos." y={540} size={170} color="#ffd96a" rot={-4} />
      <Sfx t={57.25} s="boing" v={0.35} />
    </AbsoluteFill>
  );
};

const Persistent: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.06}>
      <BluePlate />
      <Pose who="quill" k="pointing_while_presenting" x={560} y={1030} h={800} seed={3} />
      <AbsoluteFill style={{ filter: "brightness(0)", opacity: 0.85 }}>
        <Pose who="sarah_josepha_hale" k="front_view" x={1360} y={960} h={720} seed={4} at={59.3} />
      </AbsoluteFill>
    </Cam>
    <Word t={59.5} text="?" x={1360} y={300} size={260} color="#ffd96a" />
    <Cap t={60.0} text="The most persistent woman in American history" size={64} />
  </AbsoluteFill>
);

export const CH2_SHOTS: Shot[] = [
  { at: 0, C: Title },
  { at: 3.2, C: Adams },
  { at: 7.15, C: FineNormal },
  { at: 8.4, C: ThenCame, whoosh: true },
  { at: 10.0, C: NoThankYou },
  { at: 12.0, C: NotPie },
  { at: 13.92, C: ChurchState, whoosh: true },
  { at: 19.8, C: Wall },
  { at: 24.35, C: Twist, whoosh: true },
  { at: 25.2, C: Governor },
  { at: 30.3, C: Refused, whoosh: true },
  { at: 32.05, C: StatesFed },
  { at: 35.5, C: Atheist },
  { at: 37.85, C: Drafts },
  { at: 40.25, C: Levi, whoosh: true },
  { at: 42.75, C: NewEngland },
  { at: 44.9, C: CutOut },
  { at: 48.4, C: Madison, whoosh: true },
  { at: 52.15, C: Decades },
  { at: 55.3, C: Chaos },
  { at: 58.3, C: Persistent, whoosh: true },
];

