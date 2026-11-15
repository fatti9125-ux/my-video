import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { MotionDemo } from "./MotionDemo";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="HelloWorld" component={HelloWorld} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="MotionDemo" component={MotionDemo} durationInFrames={235} fps={30} width={1920} height={1080} />
  </>
);
