import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Cap, Pose, Prop, Rig, Sfx, Shot, Stamp, usePop, useT, Who } from "./core";
import { BluePlate, Country, Parchment, Stage, Study } from "./Sets";
import { CalPage, Cam, Lamb, NameCard, SERIF, Typed, Word } from "./Graphics";
import { MONTSERRAT, OSWALD } from "../fonts";

// Chapter 3 — Sarah Josepha Hale: The Woman Who Would Not Stop. Seconds on ch3.wav (VO file 2 from 62.53 s).
export const CH3_END = 68.7;

const Title: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.03}><Study v="hale" /></Cam>
    <NameCard text="Sarah Josepha Hale" sub="3 · The Woman Who Would Not Stop" />
  </AbsoluteFill>
);

const Born: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.05} ox="40%">
      <Country v="nh" />
      <Rig who="sarah_josepha_hale" x={720} y={1000} scale={1.35} seed={2} armR={20} />
    </Cam>
    <Cap t={2.7} text="Sarah Josepha Hale" pos="top" />
    <Cap t={4.6} text="New Hampshire · 1788" />
  </AbsoluteFill>
);

const Widowed: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Cam to={1.06}>
        <Study v="hale" night={t < 9.2} />
        {t < 9.2
          ? <Pose who="sarah_josepha_hale" k="young_hale_in_mourning" x={960} y={1020} h={780} seed={3} />
          : <Pose who="sarah_josepha_hale" k="writing_with_a_quill" x={960} y={1020} h={780} seed={3} />}
      </Cam>
      <Cap t={6.9} text="Widowed young" pos="top" until={8.0} />
      <Cap t={8.0} text="Five children" pos="top" until={9.2} />
      <Cap t={9.3} text="She wrote to support them" pos="top" />
    </AbsoluteFill>
  );
};

const Book: React.FC<{ t: number; x: number; y: number; title: string; sub: string; color: string; rot?: number; k?: number }> = ({ t, x, y, title, sub, color, rot = 0, k = 1 }) => {
  const s = usePop(t);
  if (!s) return null;
  return (
    <div style={{ position: "absolute", left: x - 260 * k, top: y - 340 * k, width: 520 * k, height: 680 * k, background: color, border: `${9 * k}px solid #1d1a17`, borderRadius: 14 * k, transform: `rotate(${rot}deg) scale(${interpolate(s, [0, 1], [0.4, 1])})`, boxShadow: "16px 16px 0 rgba(0,0,0,0.3)", textAlign: "center", color: "#f3e2bb", boxSizing: "border-box", padding: 40 * k }}>
      <div style={{ border: `${5 * k}px solid #d9b25a`, height: "100%", boxSizing: "border-box", paddingTop: 120 * k }}>
        <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 64 * k, lineHeight: 1.05 }}>{title}</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 38 * k, marginTop: 40 * k }}>{sub}</div>
      </div>
    </div>
  );
};

const Northwood: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <BluePlate>
        <Cam to={1.05}>
          <Book t={10.3} x={t < 13.3 ? 960 : 600} y={540} title="NORTHWOOD" sub="a novel · 1827" color="#6a2a26" rot={-3} />
          {t >= 13.3 && <Feast />}
        </Cam>
      </BluePlate>
      <Cap t={10.6} text="Anti-slavery novel" pos="top" until={13.3} />
      <Cap t={13.4} text="…with a Thanksgiving feast" pos="top" />
    </AbsoluteFill>
  );
};

const Feast: React.FC = () => {
  const s = usePop(13.35);
  return (
    <Stage>
      <g transform={`translate(1340 600) scale(${s})`} stroke="#1d1a17" strokeWidth={8} strokeLinejoin="round">
        <ellipse cx={0} cy={120} rx={420} ry={90} fill="#f6efe0" />
        <ellipse cx={0} cy={60} rx={210} ry={70} fill="#e8e2d6" />
        <path d="M -150 50 Q -170 -110 0 -120 Q 170 -110 150 50 Z" fill="#c8742f" />
        <path d="M -150 50 Q -170 -110 0 -120" fill="none" stroke="#f6c070" strokeWidth={10} opacity={0.6} />
        <path d="M 130 -10 L 210 -60 M 210 -60 l 20 -10 l 0 25 Z" fill="#f6efe0" />
        <path d="M -130 -10 L -210 -60 M -210 -60 l -20 -10 l 0 25 Z" fill="#f6efe0" />
        <g transform="translate(-320 100)"><ellipse rx={70} ry={26} fill="#e8e2d6" /><path d="M -50 -5 Q 0 -60 50 -5 Z" fill="#d98a3a" /></g>
        <g transform="translate(320 100)"><ellipse rx={70} ry={26} fill="#e8e2d6" />{[-25, 0, 25].map((d) => <circle key={d} cx={d} cy={-14} r={16} fill="#b8312f" />)}</g>
      </g>
    </Stage>
  );
};

const Godeys: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Cam to={1.06} ox="40%">
        <Study v="hale" />
        {Array.from({ length: Math.floor(interpolate(t, [17.2, 19.2], [0, 9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })) }, (_, i) => (
          <Book key={i} t={17.2 + i * 0.22} x={1240 + ((i * 173) % 560)} y={300 + ((i * 97) % 420)} title="GODEY'S" sub="Lady's Book" color={["#2d4b6a", "#6a2a46", "#3e5a3a"][i % 3]} rot={((i * 41) % 30) - 15} k={0.42} />
        ))}
        <Pose who="sarah_josepha_hale" k="editing_a_magazine" x={680} y={1020} h={760} seed={4} />
      </Cam>
      <Cap t={15.6} text="Editor · Godey's Lady's Book" pos="top" />
      {[0, 2, 4, 6, 8].map((i) => <Sfx key={i} t={17.2 + i * 0.22} s="pop" v={0.18} />)}
    </AbsoluteFill>
  );
};

const Education: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.06}>
      <Study v="hale" />
      <Rig who="sarah_josepha_hale" x={760} y={1000} scale={1.4} head="determined_head" armR={70} seed={5} />
    </Cam>
    <Stamp t={20.1} lines={["EDUCATION", "FOR WOMEN"]} x={1400} y={420} rotate={-8} />
  </AbsoluteFill>
);

const MaryLamb: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Parchment>
        <Cam to={1.05}>
          <Typed t={22.95} text="credited with writing… or at least editing" y={170} size={54} cps={40} />
          <Typed t={25.6} text="“Mary Had a Little Lamb”" y={300} size={110} cps={26} color="#8f1d16" />
          <Lamb x={960} y={820} k={1.3} hop={Math.abs(Math.sin(t * 6)) * 50} />
        </Cam>
      </Parchment>
    </AbsoluteFill>
  );
};

const ThatOne: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.12}>
      <BluePlate />
      <Pose who="quill" k="surprised" x={960} y={1060} h={880} seed={6} />
    </Cam>
    <Word t={27.0} text="Yes. That one." y={160} size={130} />
  </AbsoluteFill>
);

const Passion: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.06}>
      <Study v="hale" />
      <Rig who="sarah_josepha_hale" x={960} y={1000} scale={1.5} head={[[28.0, "neutral_head"], [29.6, "triumphant_head"]]} armL={50} armR={50} seed={7} />
    </Cam>
    <Cap t={28.2} text="Her real passion project" pos="top" />
    <Word t={29.7} text="Thanksgiving!" y={880} size={140} color="#ffd96a" rot={-3} />
  </AbsoluteFill>
);

const OneDay: React.FC = () => {
  const t = useT();
  const gather = interpolate(t, [31.6, 33.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <BluePlate>
        <Cam to={1.05}>
          <Stage>
            {Array.from({ length: 30 }, (_, i) => {
              const a = (i / 30) * Math.PI * 2, r = 470 * (1 - gather) + 230;
              const x = 960 + Math.cos(a) * r * 1.5, y = 540 + Math.sin(a) * r * 0.8;
              return <path key={i} transform={`translate(${x} ${y}) scale(1.3)`} d="M 0 -26 L 7 -8 L 26 -8 L 11 4 L 16 23 L 0 12 L -16 23 L -11 4 L -26 -8 L -7 -8 Z" fill="#fff" stroke="#1d1a17" strokeWidth={4} />;
            })}
          </Stage>
          <CalPage t={30.95} x={960} y={540} month="NATIONAL" day="1" k={1.1} />
        </Cam>
      </BluePlate>
      <Cap t={31.0} text="One national day" pos="top" />
      <Cap t={32.0} text="For the whole country" />
    </AbsoluteFill>
  );
};

const Petitioned: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.06} ox="35%">
      <Study v="hale" />
      <Pose who="sarah_josepha_hale" k="presenting_the_petition" x={720} y={1020} h={780} seed={8} />
    </Cam>
    <Cap t={33.7} text="1846 – 1863" pos="top" size={110} />
    <Cap t={36.4} text="Petitions to Congress" />
  </AbsoluteFill>
);

const CAMEOS: { who: Who; name: string }[] = [
  { who: "zachary_taylor", name: "TAYLOR" }, { who: "millard_fillmore", name: "FILLMORE" },
  { who: "franklin_pierce", name: "PIERCE" }, { who: "james_buchanan", name: "BUCHANAN" },
];
const FivePresidents: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.04}>
      <BluePlate />
      {CAMEOS.map((c, i) => (
        <React.Fragment key={c.who}>
          <Pose who={c.who} k="front_view" x={250 + i * 355} y={900} h={600} at={37.9 + i * 0.2} seed={i} />
          <Word t={37.95 + i * 0.2} text={c.name} x={250 + i * 355} y={960} size={50} />
        </React.Fragment>
      ))}
      <AbsoluteFill style={{ filter: "brightness(0)", opacity: 0.85 }}>
        <Pose who="abraham_lincoln" k="front_view" x={1670} y={900} h={660} at={38.75} seed={5} />
      </AbsoluteFill>
      <Word t={38.8} text="?" x={1670} y={500} size={200} color="#ffd96a" />
    </Cam>
    <Cap t={37.95} text="Five different presidents" pos="top" />
  </AbsoluteFill>
);

const Letters: React.FC = () => {
  const t = useT();
  const year = Math.round(interpolate(t, [39.3, 42.3], [1846, 1863], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill>
      <Cam to={1.06}>
        <Study v="hale" night />
        <Pose who="sarah_josepha_hale" k="tired_at_work" x={760} y={1020} h={760} seed={9} bob={0.5} />
        {Array.from({ length: 14 }, (_, i) => {
          const st = 39.3 + i * 0.2; if (t < st) return null;
          const y = Math.min(940 - (i % 7) * 28, -100 + (t - st) * 1500);
          return <Prop key={i} k="sealed_letter" x={1250 + (i % 2) * 200 + ((i * 37) % 60)} y={y} h={110} rot={((i * 53) % 30) - 15} />;
        })}
      </Cam>
      <Word t={39.2} text={`${year}`} x={1460} y={200} size={130} />
      <Cap t={40.5} text="Letter after letter" />
    </AbsoluteFill>
  );
};

const Hmm: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <BluePlate color="#2d4b6a">
        {CAMEOS.map((c, i) => (
          <div key={c.who} style={{ position: "absolute", left: (i % 2) * 960, top: Math.floor(i / 2) * 540, width: 960, height: 540, overflow: "hidden", borderRight: "6px solid #1d1a17", borderBottom: "6px solid #1d1a17", opacity: t > 42.6 + i * 0.35 ? 1 : 0 }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: "scale(0.5)", transformOrigin: "0 0" }}>
              <Study v={(["lincoln", "levi", "madison", "adams"] as const)[i]} />
              <Pose who={c.who} k="considering_the_petition" x={960} y={1120} h={940} seed={i} />
            </div>
          </div>
        ))}
      </BluePlate>
      <Word t={44.2} text="Hmm." y={540} size={200} color="#ffd96a" rot={-5} />
      {[0, 1, 2, 3].map((i) => <Sfx key={i} t={42.6 + i * 0.35} s="pop" v={0.25} />)}
    </AbsoluteFill>
  );
};

const Split: React.FC = () => {
  const t = useT();
  const gap = interpolate(t, [45.4, 46.4], [0, 180], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const red = t > 46.8 && t < 47.0;
  return (
    <AbsoluteFill>
      <BluePlate color={t > 46.8 ? "#5a1e1a" : "#1e90ff"}>
        <Cam to={1.06} shake={t > 46.8 ? 7 : 0}>
          <Stage>
            {[0, 1].map((side) => (
              <g key={side} transform={`translate(${side ? gap : -gap} 0)`}>
                <clipPath id={`half${side}`}><path d={side ? "M 960 0 L 1000 260 L 930 520 L 1010 760 L 960 1080 L 1920 1080 L 1920 0 Z" : "M 0 0 L 960 0 L 1000 260 L 930 520 L 1010 760 L 960 1080 L 0 1080 Z"} /></clipPath>
                <g clipPath={`url(#half${side})`}>
                  <rect x={460} y={240} width={1000} height={600} fill="#f6f1e6" stroke="#1d1a17" strokeWidth={10} />
                  {[0, 2, 4, 6, 8, 10, 12].map((r) => <rect key={r} x={460} y={240 + r * 46.15} width={1000} height={46.15} fill="#b8312f" />)}
                  <rect x={460} y={240} width={420} height={323} fill="#2d4b8a" />
                  {Array.from({ length: 20 }, (_, i) => <circle key={i} cx={505 + (i % 5) * 82} cy={285 + Math.floor(i / 5) * 72} r={14} fill="#fff" />)}
                </g>
              </g>
            ))}
          </Stage>
        </Cam>
        {red && <AbsoluteFill style={{ background: "#d9412f", opacity: 0.6 }} />}
      </BluePlate>
      <Cap t={44.9} text="The country split in two" pos="top" until={46.8} />
      <Word t={46.85} text="Civil War · 1861" y={940} size={120} />
      <Sfx t={45.4} s="thud" v={0.5} /><Sfx t={46.8} s="gunburst" v={0.3} />
    </AbsoluteFill>
  );
};

const OneMore: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.07} oy="60%">
      <Study v="hale" night />
      <Pose who="sarah_josepha_hale" k="writing_with_a_quill" x={960} y={1030} h={820} seed={10} bob={0.5} />
    </Cam>
    <Cap t={49.1} text="September 28, 1863" pos="top" />
    <Cap t={51.7} text="One more letter" />
  </AbsoluteFill>
);

const ToLincoln: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.05} ox="45%">
      <Study v="lincoln" />
      <Pose who="abraham_lincoln" k="reading_hale_s_letter" x={900} y={1030} h={820} seed={2} />
    </Cam>
    <Cap t={54.1} text="Abraham Lincoln" />
  </AbsoluteFill>
);

const Quote: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.05}>
      <Parchment>
        <Typed t={55.6} text="Dear Mr. President," y={150} size={64} cps={30} />
        <Typed t={56.9} text="“National recognition and authoritive fixation.”" y={360} size={92} cps={20} color="#8f1d16" width={1300} />
        <Typed t={59.0} text="— S. J. Hale" y={800} size={64} cps={30} />
      </Parchment>
    </Cam>
  </AbsoluteFill>
);

const Yes: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.06} ox="40%">
      <Study v="lincoln" />
      <Pose who="abraham_lincoln" k="approving_hale_s_request" x={760} y={1030} h={840} seed={3} at={59.75} />
    </Cam>
    <Stamp t={60.2} lines={["APPROVED"]} x={1400} y={380} rotate={-10} size={120} />
    <Cap t={61.0} text="In about five days" />
  </AbsoluteFill>
);

const Bars: React.FC = () => {
  const s1 = usePop(62.4, { damping: 30, stiffness: 40 }); const s2 = usePop(63.7, { damping: 14, stiffness: 160 });
  return (
    <AbsoluteFill>
      <BluePlate>
        <Cam to={1.04}>
          {[{ s: s1, w: 1050, c: "#c8261f", l: "17 YEARS", v: "NO", y: 330 }, { s: s2, w: 90, c: "#3fae5a", l: "5 DAYS", v: "YES", y: 640 }].map((b) => (
            <div key={b.l} style={{ position: "absolute", left: 160, top: b.y, display: "flex", alignItems: "center", gap: 30, opacity: b.s ? 1 : 0 }}>
              <div style={{ width: 360, fontFamily: OSWALD, fontSize: 90, color: "#fff", textShadow: "0 5px 0 rgba(0,0,0,0.35)" }}>{b.l}</div>
              <div style={{ width: b.w * b.s, height: 150, background: b.c, border: "8px solid #1d1a17", borderRadius: 14 }} />
              <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: 100, color: "#fff", textShadow: "0 5px 0 rgba(0,0,0,0.35)" }}>{b.v}</div>
            </div>
          ))}
        </Cam>
      </BluePlate>
      <Sfx t={62.4} s="whoosh" v={0.3} /><Sfx t={63.7} s="pop" v={0.4} />
    </AbsoluteFill>
  );
};

const Words: React.FC = () => (
  <AbsoluteFill>
    <Cam to={1.1} oy="40%">
      <Study v="hale" />
      <Rig who="sarah_josepha_hale" x={760} y={1080} scale={1.9} head={[[65.0, "skeptical_head"], [66.6, "tired_head"]]} seed={11} />
    </Cam>
    <Stamp t={66.3} lines={["SHE HAD", "WORDS."]} x={1420} y={460} rotate={-9} size={110} />
  </AbsoluteFill>
);

export const CH3_SHOTS: Shot[] = [
  { at: 0, C: Title },
  { at: 2.55, C: Born },
  { at: 6.7, C: Widowed, whoosh: true },
  { at: 10.2, C: Northwood },
  { at: 15.3, C: Godeys, whoosh: true },
  { at: 19.6, C: Education },
  { at: 22.85, C: MaryLamb, whoosh: true },
  { at: 26.95, C: ThatOne },
  { at: 28.05, C: Passion },
  { at: 30.85, C: OneDay, whoosh: true },
  { at: 33.6, C: Petitioned },
  { at: 37.8, C: FivePresidents, whoosh: true },
  { at: 39.14, C: Letters },
  { at: 42.5, C: Hmm },
  { at: 44.75, C: Split, whoosh: true },
  { at: 48.95, C: OneMore },
  { at: 53.85, C: ToLincoln, whoosh: true },
  { at: 55.45, C: Quote },
  { at: 59.65, C: Yes },
  { at: 62.3, C: Bars, whoosh: true },
  { at: 64.95, C: Words },
];

