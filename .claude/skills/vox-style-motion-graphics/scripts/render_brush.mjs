// Renders p5.brush layers listed in <project>/scene.json in headless Chrome and writes
// <project>/public/brush/<id>_<seed>.png (ink on white; scripts/vox.py turns them into transparent PNGs).
// usage: node render_brush.mjs <engineDir> <projectDir> [layerId ...]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const [engineDir, projectDir, ...only] = process.argv.slice(2);
const require = createRequire(path.join(engineDir, 'package.json'));
const puppeteer = require('puppeteer-core');

function findChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const root = path.join(engineDir, 'node_modules/.remotion/chrome-headless-shell');
  const stack = [root];
  while (stack.length) {
    const d = stack.pop();
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) stack.push(p);
      else if (/^chrome-headless-shell(\.exe)?$/.test(f.name)) return p;
    }
  }
  throw new Error('No headless Chrome found. Run: python3 scripts/vox.py setup');
}

const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const [, mount, ...rest] = url.split('/');
  const base = mount === 'engine' ? engineDir : mount === 'project' ? projectDir : null;
  const p = base && path.join(base, ...rest);
  if (!p || !p.startsWith(base) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}).listen(0);
const port = server.address().port;

const { layers } = JSON.parse(fs.readFileSync(path.join(projectDir, 'scene.json')));
const out = path.join(projectDir, 'public/brush');
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: findChrome(), headless: 'shell',
  args: ['--no-first-run', '--use-mock-keychain', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('pageerror', e.message));
for (const l of layers.filter((l) => !only.length || only.includes(l.id))) {
  for (const seed of [1, 2, 3]) {
    await page.goto(`http://localhost:${port}/engine/brush/render.html?layer=${l.id}&seed=${seed}`);
    await page.waitForFunction('window.__done === true', { timeout: 180000 });
    const data = await page.evaluate(() => document.querySelector('canvas').toDataURL('image/png'));
    fs.writeFileSync(path.join(out, `${l.id}_${seed}.png`), Buffer.from(data.split(',')[1], 'base64'));
  }
  console.log('rendered', l.id);
}
await browser.close();
server.close();
