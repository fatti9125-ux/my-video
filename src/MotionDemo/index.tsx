import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { ShapesScene } from "./ShapesScene";
import { TitleScene } from "./TitleScene";
import { PathScene } from "./PathScene";

// Three scenes joined by transitions. Transitions overlap scenes,
// so total length = sum of scenes - sum of transitions (90+90+90-15-20 = 235).
export const MotionDemo: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={90}>
      <TitleScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={slide({ direction: "from-right" })}
      timing={springTiming({ config: { damping: 200 }, durationInFrames: 15 })}
    />
    <TransitionSeries.Sequence durationInFrames={90}>
      <ShapesScene />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={fade()}
      timing={linearTiming({ durationInFrames: 20 })}
    />
    <TransitionSeries.Sequence durationInFrames={90}>
      <PathScene />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
