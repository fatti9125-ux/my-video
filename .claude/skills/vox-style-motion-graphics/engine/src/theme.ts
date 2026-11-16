// Style themes. A storyboard picks one with "style"; every element resolves colour names through it.
import { createContext, useContext } from "react";

export type Theme = {
  name: string;
  board: string; dark: string; ink: string; accent: string; accent2: string; accent3: string; accent4: string;
  paper: string; muted: string; light: string;
  vignette: number;    // 0..1 strength of the edge darkening
  grain: number;       // opacity of the paper specks
  mesh: boolean;       // screen-print mesh lines (vox)
  grid: number;        // grid-paper pitch in px (0 = none)
  tex: number;         // paper texture opacity
  stepped: boolean;    // animate on twos (stop-motion) instead of smooth
  push: number;        // default camera push-in per beat
};

export const THEMES: Record<string, Theme> = {
  // Vox paper collage: warm white board, black ink, one yellow.
  vox: {
    name: "vox", board: "#E4DFD3", dark: "#1D1C20", ink: "#1D1C20", accent: "#EDBD2E", accent2: "#EDBD2E", accent3: "#D8CBB0", accent4: "#1D1C20",
    paper: "#EEEAE1", muted: "rgba(29,28,32,0.65)", light: "#F1EDE4", vignette: 0.08, grain: 0.18, mesh: true, grid: 0, tex: 0.22, stepped: true, push: 0.03,
  },
  // Newspaper data editorial: off-white paper, heavy vignette, red for "now / bad", yellow highlighter.
  editorial: {
    name: "editorial", board: "#ECE7DD", dark: "#111111", ink: "#151515", accent: "#D7261E", accent2: "#F3D33C", accent3: "#2F7D3B", accent4: "#151515",
    paper: "#F6F3EC", muted: "#8A8378", light: "#F6F3EC", vignette: 0.42, grain: 0.16, mesh: false, grid: 0, tex: 0.32, stepped: false, push: 0.025,
  },
  // Surreal pop-art collage: grid paper or charcoal, B&W cut-outs, red + yellow insides.
  popart: {
    name: "popart", board: "#E8E8E6", dark: "#262626", ink: "#1A1A1A", accent: "#E3201B", accent2: "#F6D80B", accent3: "#6A6A6A", accent4: "#FFFFFF",
    paper: "#F5F5F3", muted: "#7A7A7A", light: "#F5F5F3", vignette: 0.2, grain: 0.14, mesh: false, grid: 84, tex: 0.25, stepped: false, push: 0.05,
  },
  // Cinematic creator: concrete wall, B&W subject, glowing green numbers, cyan lower-third.
  cinematic: {
    name: "cinematic", board: "#4B4B4B", dark: "#101010", ink: "#F2F2F2", accent: "#3BD16F", accent2: "#38E1E6", accent3: "#0E5C77", accent4: "#000000",
    paper: "#1E1E1E", muted: "#A0A0A0", light: "#F2F2F2", vignette: 0.65, grain: 0.1, mesh: false, grid: 0, tex: 0.5, stepped: false, push: 0.04,
  },
  // Retro mid-century: flat khaki/lime/red grounds, sepia cut-outs, teal + dark-red geometry, yellow stickers.
  retro: {
    name: "retro", board: "#D9D08F", dark: "#2B2B2B", ink: "#2B2B2B", accent: "#9E1B0F", accent2: "#F2DD4A", accent3: "#6FAF8E", accent4: "#D9822B",
    paper: "#EFE6C8", muted: "#6B6450", light: "#FFFFFF", vignette: 0.0, grain: 0.1, mesh: false, grid: 0, tex: 0.14, stepped: false, push: 0.03,
  },
};

export const ThemeCtx = createContext<Theme>(THEMES.vox);
export const useTheme = () => useContext(ThemeCtx);

// Retro background presets, usable as "bg" values in any theme.
const NAMED: Record<string, string> = { khaki: "#D9D08F", lime: "#D8DC6E", red: "#A11208", cream: "#EFE6C8", teal: "#6FAF8E", black: "#0B0B0B", white: "#F4F4F2" };

export const col = (t: Theme, c?: string, fallback = "ink"): string => {
  const k = c ?? fallback;
  if (k.startsWith("#") || k.startsWith("rgb")) return k;
  const v = (t as unknown as Record<string, unknown>)[k];
  if (typeof v === "string") return v;
  return NAMED[k] ?? k;
};
