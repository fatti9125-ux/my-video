import { noise2D } from "@remotion/noise";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MONTSERRAT as fontFamily } from "../fonts";

const WORDS = ["Motion", "Graphics", "in", "Remotion"];

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center" }}>
      {/* Drifting dots driven by noise: smooth, organic movement */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = (i * 97) % width + noise2D("x", i, frame / 120) * 80;
        const y = (i * 53) % height + noise2D("y", i, frame / 120) * 80;
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y, width: 10, height: 10,
            borderRadius: 5, background: "#38bdf8", opacity: 0.35,
          }} />
        );
      })}
      <div style={{ display: "flex", gap: 32 }}>
        {WORDS.map((word, i) => {
          // Each word springs in, staggered by 6 frames
          const progress = spring({ frame: frame - i * 6, fps, config: { damping: 12 } });
          return (
            <span key={word} style={{
              fontFamily, fontWeight: 800, fontSize: 130, color: "white",
              transform: `translateY(${interpolate(progress, [0, 1], [120, 0])}px)`,
              opacity: progress,
            }}>{word}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
