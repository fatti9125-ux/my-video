import type React from "react";
import { loadFont as loadCaslon } from "@remotion/google-fonts/LibreCaslonText";
import { loadFont as loadMarker } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as loadElite } from "@remotion/google-fonts/SpecialElite";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadCourier } from "@remotion/google-fonts/CourierPrime";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadJakarta } from "@remotion/google-fonts/PlusJakartaSans";

const latin = { subsets: ["latin"] as ["latin"] };
export const caslon = loadCaslon("normal", { weights: ["400", "700"], ...latin }).fontFamily;
export const marker = loadMarker("normal", { weights: ["400"], ...latin }).fontFamily;
export const elite = loadElite("normal", { weights: ["400"], ...latin }).fontFamily;
export const anton = loadAnton("normal", { weights: ["400"], ...latin }).fontFamily;
const playfair = loadPlayfair("italic", { weights: ["600", "800"], ...latin }).fontFamily;
loadPlayfair("normal", { weights: ["700"], ...latin });
const courier = loadCourier("normal", { weights: ["700"], ...latin }).fontFamily;
const montserrat = loadMontserrat("normal", { weights: ["600", "700"], ...latin }).fontFamily;
const jakarta = loadJakarta("normal", { weights: ["800"], ...latin }).fontFamily;

// Font names usable in storyboard / scene elements.
export const FONTS: Record<string, React.CSSProperties> = {
  serif: { fontFamily: caslon },
  serifBold: { fontFamily: caslon, fontWeight: 700 },
  elite: { fontFamily: elite, letterSpacing: "0.12em" },
  marker: { fontFamily: marker },
  anton: { fontFamily: anton },
  playfair: { fontFamily: playfair, fontStyle: "italic", fontWeight: 600 },
  playfairBold: { fontFamily: playfair, fontStyle: "italic", fontWeight: 800 },
  courier: { fontFamily: courier, fontWeight: 700 },
  montserrat: { fontFamily: montserrat, fontWeight: 700 },
  jakarta: { fontFamily: jakarta, fontWeight: 800, letterSpacing: "-0.02em" },
};
