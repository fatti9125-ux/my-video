import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { MotionDemo } from "./MotionDemo";
import { EmuWar, EMU_WAR_DURATION } from "./EmuWar";
import { RigTest } from "./rig/RigTest";
import { HandTest } from "./rig/HandTest";
import { PuppetTest, QuillTest } from "./Thanksgiving/PuppetTest";
import { BgTest } from "./Thanksgiving/BgTest";
import { Thanksgiving, TG_DURATION } from "./Thanksgiving";
import { Thanksgiving2, TG2_DURATION } from "./Thanksgiving2";
import { WalkTest } from "./Thanksgiving3/WalkTest";
import { Thanksgiving3, TG3_DURATION } from "./Thanksgiving3";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="HelloWorld" component={HelloWorld} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="MotionDemo" component={MotionDemo} durationInFrames={235} fps={30} width={1920} height={1080} />
    <Composition id="RigTest" component={RigTest} durationInFrames={120} fps={30} width={1920} height={1080} />
    <Composition id="HandTest" component={HandTest} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="TgPuppetTest" component={PuppetTest} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="TgQuillTest" component={QuillTest} durationInFrames={60} fps={30} width={1920} height={1080} />
    <Composition id="TgBgTest" component={BgTest} durationInFrames={10} fps={30} width={1920} height={1080} />
    <Composition id="ThanksgivingCh1to3" component={Thanksgiving} durationInFrames={TG_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="ThanksgivingColdOpenCh1" component={Thanksgiving2} durationInFrames={TG2_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="TgWalkTest" component={WalkTest} durationInFrames={64} fps={30} width={1920} height={1080} />
    <Composition id="ThanksgivingFull" component={Thanksgiving3} durationInFrames={TG3_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="EmuWar" component={EmuWar} durationInFrames={EMU_WAR_DURATION} fps={30} width={1920} height={1080} />
  </>
);
