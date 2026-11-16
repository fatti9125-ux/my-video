import type { RigDef } from "./SheetPuppet";

// Rig definitions for characters cut from the sheets in public/characters/<name>/.
// Units = the sheet's full-body front pose (~380 tall); origin between the feet on the ground.
export const GERALD_FORD: RigDef = {
  dir: "characters/gerald-ford",
  partScale: 0.88,
  heads: { neutral: "head_neutral", speaking: "head_speaking", reaction: "head_reaction" },
  torsos: { front: "torso_front", three_quarter: "torso_three_quarter" },
  headSize: [187, 217], torsoSize: [170, 138],
  torsoTop: -207, chinY: -192,
  shoulderX: 44, shoulderY: -183, upperArm: 56, foreArm: 48,
  hipX: 29, hipY: -100, thigh: 52, shin: 48,
  line: 6.5,
  // anchor = wrist pixel on the ink where the fingers converge; dir = wrist -> fingertips (0 down, 90 right, 180 up)
  hands: {
    relaxed: { file: "hand_relaxed", size: [32, 39], anchor: [16, 3], dir: 0 },
    open: { file: "hand_open", size: [46, 42], anchor: [17, 38], dir: 160 },
    point: { file: "hand_point", size: [58, 40], anchor: [4, 26], dir: 112 },
    grip: { file: "hand_grip", size: [41, 41], anchor: [4, 27], dir: 105 },
  },
  handScale: 0.55,
};

// Reusable arm presets (angles: 0 = hanging down, + = outward/up; elbow relative to upper arm).
export const ARM_POSES = {
  down: { shoulder: 32, elbow: -14, hand: "relaxed" },
  hips: { shoulder: 42, elbow: -100, hand: "relaxed" },
  wave: { shoulder: 125, elbow: 25, hand: "open" },
  point: { shoulder: 95, elbow: 0, hand: "point" },
  shrug: { shoulder: 60, elbow: 70, hand: "open" },
  hold: { shoulder: 25, elbow: -95, hand: "grip", front: true },
} as const;
