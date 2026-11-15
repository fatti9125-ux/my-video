import { evolvePath } from "@remotion/paths";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

// Any SVG path works here, e.g. one exported from Figma or Illustrator
const WAVE = "M 100 540 C 400 200, 700 880, 960 540 S 1520 200, 1820 540";

export const PathScene: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, 60], [0, 1], {
    extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic),
  });
  const { strokeDasharray, strokeDashoffset } = evolvePath(progress, WAVE);

  return (
    <AbsoluteFill style={{ backgroundColor: "#ecfeff" }}>
      <svg viewBox="0 0 1920 1080">
        <path d={WAVE} fill="none" stroke="#0891b2" strokeWidth={24} strokeLinecap="round"
          strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
      </svg>
    </AbsoluteFill>
  );
};
