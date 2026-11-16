import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { MotionDemo } from "./MotionDemo";
import { EmuWar, EMU_WAR_DURATION } from "./EmuWar";
import { ThanksgivingAll, CHAPTERS, chapterFrames, makeChapter } from "./Thanksgiving";

const TG_CHAPTERS = CHAPTERS.map((c, i) => ({ id: `Thanksgiving-Ch${i + 1}`, C: makeChapter(i), frames: chapterFrames(c.end) }));

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="HelloWorld" component={HelloWorld} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="MotionDemo" component={MotionDemo} durationInFrames={235} fps={30} width={1920} height={1080} />
    <Composition id="EmuWar" component={EmuWar} durationInFrames={EMU_WAR_DURATION} fps={30} width={1920} height={1080} />
    {TG_CHAPTERS.map((c) => <Composition key={c.id} id={c.id} component={c.C} durationInFrames={c.frames} fps={30} width={1920} height={1080} />)}
    <Composition id="Thanksgiving-Ch1-3" component={ThanksgivingAll} durationInFrames={CHAPTERS.reduce((a, c) => a + chapterFrames(c.end), 0)} fps={30} width={1920} height={1080} />
  </>
);
