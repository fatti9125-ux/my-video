/**
 * Build the After Effects package for one Episode part.
 * Usage (repo root): node .claude/skills/2d-animation/scripts/ae_export/export_part.mjs <CompId> <src module> <ep json> <pkg dir> "<Comp Name>" [--no-render]
 *   e.g. ... VicePresidents1 src/VP/VP1.tsx src/VP/ep/vp1.json export/VP1_AfterEffects "VP Part 1"
 * Needs compositions "<CompId>-BG" and "<CompId>-FX" (ExportMode passes) registered in Root.tsx.
 */
import { build } from "esbuild";
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

const [, , comp, mod, ep, pkg, name, flag] = process.argv;
const here = path.dirname(new URL(import.meta.url).pathname);
fs.mkdirSync(pkg, { recursive: true });
const entry = path.join(here, "_entry.tsx");
fs.writeFileSync(entry, `import { SHOTS } from "${path.resolve(mod).replace(/\.tsx$/, "")}";
import DATA from "${path.resolve(ep)}";
import { walk } from "./walk";
import fs from "fs";
fs.writeFileSync(${JSON.stringify(path.resolve(pkg, "layers.json"))}, JSON.stringify(walk(SHOTS, DATA as any)));\n`);
await build({ entryPoints: [entry], bundle: true, platform: "node", format: "cjs", outfile: path.join(here, "_entry.cjs"), jsx: "automatic", logLevel: "error", loader: { ".json": "json" } });
execFileSync("node", [path.join(here, "_entry.cjs")], { stdio: "inherit" });
fs.rmSync(entry); fs.rmSync(path.join(here, "_entry.cjs"));
console.log("layers.json written");

if (flag !== "--no-render") {
  const { bundle } = await import("@remotion/bundler");
  const { renderMedia, renderFrames, selectComposition } = await import("@remotion/renderer");
  const B = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
  const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
  const bg = await selectComposition({ serveUrl, id: `${comp}-BG`, browserExecutable: B });
  fs.mkdirSync(path.join(pkg, "footage"), { recursive: true });
  await renderMedia({ serveUrl, composition: bg, codec: "h264", crf: 17, muted: true, outputLocation: path.join(pkg, "footage", "BG.mp4"), browserExecutable: B });
  console.log("BG done");
  const fx = await selectComposition({ serveUrl, id: `${comp}-FX`, browserExecutable: B });
  const fxDir = path.join(pkg, "footage", "FX");
  fs.rmSync(fxDir, { recursive: true, force: true }); fs.mkdirSync(fxDir, { recursive: true });
  await renderFrames({ serveUrl, composition: fx, imageFormat: "png", outputDir: fxDir, browserExecutable: B, onStart: () => {}, onFrameUpdate: () => {} });
  for (const f of fs.readdirSync(fxDir)) { const n = +f.match(/(\d+)\.png$/)[1]; fs.renameSync(path.join(fxDir, f), path.join(fxDir, `fx_${String(n).padStart(4, "0")}.png`)); }
  console.log("FX done");
}
execFileSync("node", [path.join(here, "emit_jsx.mjs"), path.join(pkg, "layers.json"), pkg, name], { stdio: "inherit" });
// fonts for the text layers (woff2 -> ttf)
fs.mkdirSync(path.join(pkg, "fonts"), { recursive: true });
execFileSync("python3", ["-c", `from fontTools.ttLib import TTFont\nf=TTFont("public/fonts/montserrat-latin-800-normal.woff2"); f.flavor=None\nfor r in f["name"].names:\n  v={1:"Montserrat ExtraBold",2:"Regular",4:"Montserrat ExtraBold",6:"Montserrat-ExtraBold",16:"Montserrat",17:"ExtraBold"}.get(r.nameID)\n  if v: r.string=v\nf.save("${pkg}/fonts/Montserrat-ExtraBold.ttf")`]);
fs.copyFileSync("public/fonts/OFL-LICENSE.txt", path.join(pkg, "fonts", "OFL-LICENSE.txt"));
fs.writeFileSync(path.join(pkg, "README.txt"), `${name}: editable After Effects project

1. Install fonts/Montserrat-ExtraBold.ttf (double-click > Install), then restart After Effects.
2. After Effects > File > Scripts > Run Script File... > choose the .jsx in this folder.
   (If AE asks, allow scripts: Preferences > Scripting & Expressions > Allow Scripts to Write Files and Access Network.)
3. The script imports everything in footage/ and audio, and builds the comp "${name}" (1920x1080, 30 fps):
   - VO + every sound effect as separate audio layers at their exact frames (levels already set)
   - BG ...       background / graphics plates for each shot (cut from footage/BG.mp4)
   - character layers: one layer per pose (PNG), feet-registered, with breathing/sway expressions,
     entrances, drops and walks keyframed; Quill's head + open beak swap on held keyframes
   - RIG / HIP nulls + body, leg and arm layers for walking characters (walk cycle = rotation expressions)
   - CAM / PUNCH nulls: each shot's slow push and punch-ins (all that shot's layers are parented to them)
   - FX ...       drawn effects overlay (footage/FX png sequence with alpha): sweat drops, arrows, vote bars...
   - LABEL / CAPTION / CARD: live text layers you can retype
Every layer is trimmed to the frames where it is on screen, so the timeline reads like the edit itself.
`);
console.log("PACKAGE READY", pkg);
