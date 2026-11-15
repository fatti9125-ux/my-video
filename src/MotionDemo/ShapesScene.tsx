import { CameraMotionBlur } from "@remotion/motion-blur";
import { Circle, Star, Triangle } from "@remotion/shapes";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const ShapesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = (delay: number) => spring({ frame: frame - delay, fps, config: { damping: 10 } });
  const rotate = interpolate(frame, [0, 90], [0, 360]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#fef3c7" }}>
      {/* Motion blur makes the fast spin look filmic */}
      <CameraMotionBlur shutterAngle={180} samples={6}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 120 }}>
          <div style={{ transform: `scale(${pop(0)})` }}><Circle radius={140} fill="#f97316" /></div>
          <div style={{ transform: `scale(${pop(8)}) rotate(${rotate}deg)` }}>
            <Star points={5} innerRadius={70} outerRadius={160} fill="#e11d48" cornerRadius={10} />
          </div>
          <div style={{ transform: `scale(${pop(16)})` }}><Triangle length={280} direction="up" fill="#7c3aed" /></div>
        </AbsoluteFill>
      </CameraMotionBlur>
    </AbsoluteFill>
  );
};
