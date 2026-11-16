import { Composition } from "remotion";
import { Main, Scene } from "./Video";

// The scene comes in through --props=<project>/scene.json; this default only keeps the Studio from erroring.
const empty: Scene = { fps: 30, width: 1920, height: 1080, duration: 30, layers: [], beats: [], sfx: [] };

export const RemotionRoot = () => (
  <Composition
    id="Main"
    component={Main}
    defaultProps={empty}
    durationInFrames={30}
    fps={30}
    width={1920}
    height={1080}
    calculateMetadata={({ props }) => ({
      durationInFrames: props.duration, fps: props.fps, width: props.width, height: props.height,
    })}
  />
);
