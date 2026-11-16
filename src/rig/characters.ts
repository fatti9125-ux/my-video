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
  shoulderX: 64, shoulderY: -183, upperArm: 52, foreArm: 46,
  hipX: 29, hipY: -88, thigh: 46, shin: 42,
  line: 6.5,
  hands: { relaxed: "hand_relaxed", open: "hand_open", point: "hand_point", grip: "hand_grip" },
  handPointsUp: ["open"],
  handSize: 24,
};

// Reusable arm presets (angles: 0 = hanging down, + = outward/up; elbow relative to upper arm).
export const ARM_POSES = {
  down: { shoulder: 14, elbow: -6, hand: "relaxed" },
  hips: { shoulder: 42, elbow: -100, hand: "relaxed" },
  wave: { shoulder: 125, elbow: 25, hand: "open" },
  point: { shoulder: 95, elbow: 0, hand: "point" },
  shrug: { shoulder: 60, elbow: 70, hand: "open" },
  hold: { shoulder: 25, elbow: -95, hand: "grip" },
} as const;
