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
import { VP1_DURATION, VicePresidents1 } from "./VP/VP1";
import { VP1_BG, VP1_FX, VP2_BG, VP2_FX, VP3_BG, VP3_FX } from "./VP/ExportPasses";
import { VP3_DURATION, VicePresidents3 } from "./VP/VP3";
import { VP4_DURATION, VicePresidents4 } from "./VP/VP4";
import { VP5_DURATION, VicePresidents5 } from "./VP/VP5";
import { VP_FULL_DURATION, VicePresidentsFull } from "./VP/Full";
import { VP2_DURATION, VicePresidents2 } from "./VP/VP2";

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
    <Composition id="VicePresidents1" component={VicePresidents1} durationInFrames={VP1_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="VicePresidents1-BG" component={VP1_BG} durationInFrames={VP1_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="VicePresidents1-FX" component={VP1_FX} durationInFrames={VP1_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="VicePresidents2" component={VicePresidents2} durationInFrames={VP2_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="VicePresidents2-BG" component={VP2_BG} durationInFrames={VP2_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="VicePresidents2-FX" component={VP2_FX} durationInFrames={VP2_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="VicePresidents3" component={VicePresidents3} durationInFrames={VP3_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="VicePresidents3-BG" component={VP3_BG} durationInFrames={VP3_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="VicePresidents4" component={VicePresidents4} durationInFrames={VP4_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="VicePresidents5" component={VicePresidents5} durationInFrames={VP5_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="VicePresidentsFull" component={VicePresidentsFull} durationInFrames={VP_FULL_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="VicePresidents3-FX" component={VP3_FX} durationInFrames={VP3_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="ThanksgivingCh7" component={ThanksgivingCh7} durationInFrames={CH7_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="ThanksgivingCh8to10" component={ThanksgivingCh8to10} durationInFrames={CH8_10_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="ThanksgivingCh11to13" component={ThanksgivingCh11to13} durationInFrames={CH11_13_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="ThanksgivingCh14toEnd" component={ThanksgivingCh14toEnd} durationInFrames={CH14_END_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="ThanksgivingFinal" component={ThanksgivingFinal} durationInFrames={FINAL_DURATION} fps={30} width={1920} height={1080} />
    <Composition id="EmuWar" component={EmuWar} durationInFrames={EMU_WAR_DURATION} fps={30} width={1920} height={1080} />
  </>
);
