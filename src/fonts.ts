import { continueRender, delayRender, staticFile } from "remotion";

// Fonts are bundled in public/fonts (SIL OFL) so renders work offline / without Google Fonts access.
const loadLocalFont = (family: string, file: string, weight: string) => {
  if (typeof window === "undefined" || typeof FontFace === "undefined") return family;
  const handle = delayRender(`Loading font ${family} ${weight}`);
  const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format("woff2")`, { weight });
  face
    .load()
    .then(() => { document.fonts.add(face); continueRender(handle); })
    .catch((err) => { console.error(err); continueRender(handle); });
  return family;
};

export const MONTSERRAT = loadLocalFont("Montserrat", "montserrat-latin-800-normal.woff2", "800");
export const OSWALD = loadLocalFont("Oswald", "oswald-latin-700-normal.woff2", "700");
