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
import { CH4_6_DURATION, ThanksgivingCh4to6 } from "./Thanksgiving3/Ch4to6";
import { CH7_DURATION, ThanksgivingCh7 } from "./Thanksgiving3/Ch7";
import { CH8_10_DURATION, ThanksgivingCh8to10 } from "./Thanksgiving3/Ch8to10";
import { CH11_13_DURATION, ThanksgivingCh11to13 } from "./Thanksgiving3/Ch11to13";
import { CH14_END_DURATION, ThanksgivingCh14toEnd } from "./Thanksgiving3/Ch14toEnd";
import { FINAL_DURATION, ThanksgivingFinal } from "./Thanksgiving3/Final";

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
    <Composition id="ThanksgivingCh4to6" component={ThanksgivingCh4to6} durationInFrames={CH4_6_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="ThanksgivingCh7" component={ThanksgivingCh7} durationInFrames={CH7_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="ThanksgivingCh8to10" component={ThanksgivingCh8to10} durationInFrames={CH8_10_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="ThanksgivingCh11to13" component={ThanksgivingCh11to13} durationInFrames={CH11_13_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="ThanksgivingCh14toEnd" component={ThanksgivingCh14toEnd} durationInFrames={CH14_END_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="ThanksgivingFinal" component={ThanksgivingFinal} durationInFrames={FINAL_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="EmuWar" component={EmuWar} durationInFrames={EMU_WAR_DURATION} fps={30} width={1920} height={1080} />
  </>
);
