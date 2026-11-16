// Render quick half-size JPEG stills of a composition: BX=<chrome path> node .claude/skills/2d-animation/scripts/stills.mjs <CompId> <outDir> <frame> [frame...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [,, comp, out, ...frames] = process.argv;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.BX;
const composition = await selectComposition({ serveUrl, id: comp, browserExecutable });
for (const fr of frames) {
  await renderStill({ composition, serveUrl, frame: Number(fr), output: `${out}/${comp}_${fr}.jpg`, imageFormat: "jpeg", jpegQuality: 70, scale: 0.5, browserExecutable });
}
console.log("done");
