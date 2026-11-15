// Draws one layer from src/layers.json with p5.brush. Query: ?layer=<id>&seed=<n>
const q = new URLSearchParams(location.search);
const SEED = +q.get('seed') || 1;
let L;

async function setup() {
  const all = await (await fetch('/project/scene.json')).json();
  L = all.layers.find((l) => l.id === q.get('layer'));
  pixelDensity(1);
  createCanvas(L.w, L.h, WEBGL);
  angleMode(DEGREES);
  randomSeed(SEED * 101);
  noiseSeed(SEED);
  brush.scaleBrushes(L.scale || 2.2);
}

function draw() {
  if (!L) return;
  if (frameCount === 2) {
    background(255);   // p5.brush composites against paper; alpha is recovered later by tools/unmix.py
    translate(-width / 2, -height / 2);
    ({ marker: drawMarker, dashed: drawDashed, wave: drawWave, scribble: drawScribble, block: drawBlock, highlight: drawHighlight })[L.kind]();
  }
  if (frameCount === 4) { window.__done = true; noLoop(); }
}

const jitter = (pts, a) => pts.map(([x, y]) => [x + random(-a, a), y + random(-a, a)]);

function strokePath(name, w, pts, j, curve = 0.6) {
  brush.set(name, L.color, w);
  const p = jitter(pts, j);
  if (p.length === 2) brush.line(p[0][0], p[0][1], p[1][0], p[1][1]);
  else brush.spline(p, curve);
}

// Felt marker: a wet pass, then a thinner dry crayon pass so the line has a broken edge.
function drawMarker() {
  brush.noFill();
  for (const s of L.strokes) {
    strokePath('marker', L.weight, s, 1.2);
    strokePath('crayon', L.weight * 0.6, s, 2.5);
  }
}

// Dashed signal line: the strokes listed in L.dashed are cut into short hand-drawn dashes,
// the rest (arrowheads) are drawn solid.
function drawDashed() {
  brush.noFill();
  L.strokes.forEach((s, i) => {
    if (!L.dashed.includes(i)) { strokePath('marker', L.weight, s, 1.0); strokePath('crayon', L.weight * 0.6, s, 1.6); return; }
    const dash = L.dash || 26, gap = L.gap || 18;
    let acc = 0, on = true, cur = [s[0]];
    for (let k = 1; k < s.length; k++) {
      const [x0, y0] = s[k - 1], [x1, y1] = s[k];
      const seg = Math.hypot(x1 - x0, y1 - y0);
      let t = 0;
      while (t < seg) {
        const left = (on ? dash : gap) - acc, step = Math.min(left, seg - t);
        t += step; acc += step;
        const p = [x0 + (x1 - x0) * (t / seg), y0 + (y1 - y0) * (t / seg)];
        if (on) cur.push(p);
        if (acc >= (on ? dash : gap) - 1e-6) {
          if (on && cur.length > 1) {
            const a = cur[0], b = cur[cur.length - 1], w = random(0.85, 1.1);
            strokePath('marker', L.weight * w, [a, b], 1.0);
            strokePath('crayon', L.weight * w * 0.6, [a, b], 1.6);
          }
          on = !on; acc = 0; cur = [p];
        }
      }
    }
  });
}

// Signal trace: a fine ink line, re-traced once with a soft pencil like a chart recorder.
function drawWave() {
  brush.noFill();
  for (const s of L.strokes) {
    strokePath(L.pen || 'rotring', L.weight, s, 0.6, 0.15);
    strokePath('2B', L.weight * 0.8, s, 1.6, 0.15);
  }
}

// Ink wipe: wide charcoal and marker scribbles laid over each other until the frame is covered.
function drawScribble() {
  brush.noFill();
  for (const s of L.strokes) {
    strokePath('marker', L.weight, s, 6, 0.35);
    strokePath('charcoal', L.weight * 1.25, s, 14, 0.35);
  }
}

// Painted paper block: textured watercolour fill, then dry-brush strokes dragged along the edges and
// across the body so it reads as poster paint laid on with a wide brush.
function drawBlock() {
  const poly = jitter(L.poly, 3);
  brush.noStroke();
  // three watercolour passes build the paint up to a near-solid layer
  for (let k = 0; k < 3; k++) {
    brush.noHatch();
    brush.fill(L.color, 255);
    brush.fillBleed(0.012, 'out');
    brush.fillTexture(0.25, 0.25);
    brush.polygon(jitter(poly, 2));
  }
  brush.noFill();
  // dry-brush drag across the body
  brush.hatch(9, 28, { rand: 0.35 });
  brush.hatchStyle('charcoal', L.color, 2.6);
  brush.polygon(poly);
  brush.noHatch();
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    brush.set('charcoal', L.color, random(1.8, 3));
    brush.line(a[0] + random(-4, 4), a[1] + random(-4, 4), b[0] + random(-4, 4), b[1] + random(-4, 4));
  }
}

// Highlighter: one wide wet marker pass, no dry edge.
function drawHighlight() {
  brush.noFill();
  for (const s of L.strokes) {
    strokePath('marker', L.weight, s, 1.5, 0.2);
    strokePath('marker', L.weight * 0.8, s, 3, 0.2);
    strokePath('crayon', L.weight * 0.55, s, 4, 0.2);   // dry, broken edge
  }
}
