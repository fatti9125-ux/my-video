import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { MotionDemo } from "./MotionDemo";
import { EmuWar, EMU_WAR_DURATION } from "./EmuWar";
import { RigTest } from "./rig/RigTest";
import { HandTest } from "./rig/HandTest";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="HelloWorld" component={HelloWorld} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="MotionDemo" component={MotionDemo} durationInFrames={235} fps={30} width={1920} height={1080} />
    <Composition id="RigTest" component={RigTest} durationInFrames={120} fps={30} width={1920} height={1080} />
    <Composition id="HandTest" component={HandTest} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="EmuWar" component={EmuWar} durationInFrames={EMU_WAR_DURATION} fps={30} width={1920} height={1080} />
  </>
);
