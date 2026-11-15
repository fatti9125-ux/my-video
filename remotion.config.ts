import { existsSync } from "node:fs";
import { Config } from "@remotion/cli/config";

// In the Claude cloud sandbox Remotion can't download its own browser,
// so use the preinstalled one there. Elsewhere Remotion downloads it as usual.
const sandboxBrowser =
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (existsSync(sandboxBrowser)) {
  Config.setBrowserExecutable(sandboxBrowser);
}
