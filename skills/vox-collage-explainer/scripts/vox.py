#!/usr/bin/env python3
"""vox.py - the Vox-style collage explainer pipeline.

  setup                      install the render engine + Python deps into ~/.vox-collage-explainer (once)
  doctor                     show what is installed / missing
  new <project> [--title T]  start a project folder (textures, sound effects, skeleton storyboard)
  grid <image> [--step 80]   write <image>_grid.jpg with pixel coordinates, for picking points
  cutout <project> <name> <image> --kind photo|engraving|props [...]
                             cut a generated image into a collage piece (see --help)
  say <project>              fallback voiceover with the OS text-to-speech (macOS `say`)
  timing <project>           word timings for the voiceover, aligned to the storyboard lines
  build <project>            storyboard.json -> scene.json (layout, brush layers, sound cues)
  brush <project>            render the p5.brush layers that changed
  render <project> [--draft] render the video + final mp4 + contact sheet
  make <project> [--draft]   timing (if needed) + build + brush + render
  sheet <project> F1 F2 ...  contact sheet of specific frames from the last render
"""
import os, sys, json, shutil, subprocess, hashlib, re, difflib, glob, argparse, platform
from pathlib import Path

SKILL = Path(__file__).resolve().parent.parent
HOME = Path(os.environ.get('VOX_HOME', Path.home() / '.vox-collage-explainer'))
VENV_PY = HOME / 'venv' / 'bin' / 'python3'
ENGINE = HOME / 'engine'

# Re-run inside the private venv (numpy, opencv, pillow) once setup has created it.
if VENV_PY.exists() and Path(sys.prefix).resolve() != (HOME / 'venv').resolve() and os.environ.get('VOX_NO_VENV') != '1':
    os.execv(str(VENV_PY), [str(VENV_PY), __file__] + sys.argv[1:])


def run(cmd, cwd=None, check=True, quiet=False, env=None):
    if not quiet: print('$', ' '.join(str(c) for c in cmd), flush=True)
    r = subprocess.run([str(c) for c in cmd], cwd=cwd, env=env, text=True,
                       stdout=subprocess.PIPE if quiet else None, stderr=subprocess.STDOUT if quiet else None)
    if check and r.returncode != 0:
        raise SystemExit(f'command failed ({r.returncode}): {" ".join(str(c) for c in cmd)}\n{r.stdout or ""}')
    return r


def which(*names):
    for n in names:
        p = shutil.which(n)
        if p: return p
    return None


def load_jsonc(path):
    """JSON that may contain // comments (outside strings), as in the reference examples."""
    src, out, i, in_str = Path(path).read_text(), [], 0, False
    while i < len(src):
        ch = src[i]
        if in_str:
            out.append(ch)
            if ch == '\\': out.append(src[i + 1]); i += 1
            elif ch == '"': in_str = False
        elif ch == '"':
            in_str = True; out.append(ch)
        elif src.startswith('//', i):
            while i < len(src) and src[i] != '\n': i += 1
            continue
        else:
            out.append(ch)
        i += 1
    try:
        return json.loads(''.join(out))
    except json.JSONDecodeError as e:
        raise SystemExit(f'{path}: invalid JSON - {e}')


# ================================================================= setup

def file_hash(*paths):
    h = hashlib.sha1()
    for p in paths:
        for f in sorted(Path(p).rglob('*')) if Path(p).is_dir() else [Path(p)]:
            if f.is_file() and 'node_modules' not in f.parts: h.update(f.read_bytes())
    return h.hexdigest()[:12]


def cmd_setup(a):
    missing = [n for n in ('node', 'npm', 'npx', 'ffmpeg', 'ffprobe') if not which(n)]
    if missing:
        hint = 'brew install node ffmpeg' if platform.system() == 'Darwin' else 'sudo apt-get install -y nodejs npm ffmpeg'
        raise SystemExit(f'Missing: {", ".join(missing)}. Install them first, e.g.  {hint}')
    v = run(['node', '-v'], quiet=True).stdout.strip()
    if int(v.lstrip('v').split('.')[0]) < 18: raise SystemExit(f'Node {v} is too old; need 18+')
    HOME.mkdir(parents=True, exist_ok=True)

    # 1. Python deps in a private venv
    if not VENV_PY.exists():
        run([sys.executable, '-m', 'venv', HOME / 'venv'])
    run([VENV_PY, '-m', 'pip', 'install', '-q', '--disable-pip-version-check', 'numpy', 'opencv-python-headless', 'pillow'])

    # 2. Render engine (Remotion + p5.brush). node_modules is reused across skill updates.
    ENGINE.mkdir(exist_ok=True)
    for item in (SKILL / 'engine').iterdir():
        dst = ENGINE / item.name
        if item.is_dir():
            shutil.copytree(item, dst, dirs_exist_ok=True)
        else:
            shutil.copy2(item, dst)
    lock = file_hash(ENGINE / 'package-lock.json')
    stamp = ENGINE / 'node_modules' / '.vox-lock'
    if not stamp.exists() or stamp.read_text() != lock:
        run(['npm', 'ci', '--no-audit', '--no-fund', '--loglevel=error'], cwd=ENGINE)
        stamp.write_text(lock)
    if not system_chrome(save=True):
        r = run(['npx', 'remotion', 'browser', 'ensure'], cwd=ENGINE, check=False)
        if r.returncode: raise SystemExit('Could not download headless Chrome. Set CHROME_PATH to a Chrome/Chromium binary and re-run setup.')

    # 3. Apple Vision subject masks on macOS (better cut-outs); other systems fall back to a colour key.
    if platform.system() == 'Darwin' and which('swiftc'):
        (HOME / 'bin').mkdir(exist_ok=True)
        out = HOME / 'bin' / 'subject_mask'
        if not out.exists() or out.stat().st_mtime < (SKILL / 'scripts' / 'subject_mask.swift').stat().st_mtime:
            r = run(['swiftc', '-O', SKILL / 'scripts' / 'subject_mask.swift', '-o', out], check=False, quiet=True)
            if r.returncode: print('note: could not build the Vision cut-out tool; using the colour-key fallback')
    # 4. Shared textures, generated once (inside the venv, which has numpy/opencv)
    run([VENV_PY, __file__, '_tex'], env={**os.environ, 'VOX_NO_VENV': '1'})
    print('\nsetup complete:', HOME)
    cmd_doctor(a)


def system_chrome(save=False):
    """A Chrome the engine can use instead of downloading one: $CHROME_PATH, a saved path, or a Playwright / system install."""
    saved = HOME / 'chrome_path'
    cands = [os.environ.get('CHROME_PATH'), saved.read_text().strip() if saved.exists() else None]
    cands += sorted(glob.glob('/opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell'), reverse=True)
    cands += sorted(glob.glob(str(Path.home() / '.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-*/chrome-headless-shell')), reverse=True)
    cands += [which('chromium', 'chromium-browser', 'google-chrome')]
    for c in cands:
        if c and Path(c).exists():
            if save: saved.write_text(c)
            return c
    return None


def chrome_env():
    c = system_chrome()
    return {**os.environ, 'CHROME_PATH': c} if c else None


def cmd_doctor(a):
    rows = [
        ('node', which('node')), ('ffmpeg', which('ffmpeg')),
        ('python venv', VENV_PY if VENV_PY.exists() else None),
        ('engine', ENGINE if (ENGINE / 'node_modules').exists() else None),
        ('headless chrome', system_chrome() or next(iter(glob.glob(str(ENGINE / 'node_modules/.remotion/chrome-headless-shell/**/chrome-headless-shell*'), recursive=True)), None)),
        ('vision cut-outs (macOS)', HOME / 'bin' / 'subject_mask' if (HOME / 'bin' / 'subject_mask').exists() else None),
        ('whisper word timings', whisper() and whisper()[0]),
    ]
    for k, v in rows: print(f'  {"ok " if v else "-- "} {k:26s} {v or "missing"}')
    if not (ENGINE / 'node_modules').exists(): print('\nRun: python3 scripts/vox.py setup')


# ================================================================= textures

def make_textures(out):
    import numpy as np, cv2
    out = Path(out); out.mkdir(parents=True, exist_ok=True)
    if (out / 'paper.jpg').exists() and (out / 'specks.jpg').exists(): return
    rng = np.random.default_rng(7); h, w = 1280, 1920
    # paper: soft cloudy tone + fibres + creases + grain (grayscale; used with multiply)
    low = cv2.resize(rng.normal(0, 1, (h // 80, w // 80)), (w, h), interpolation=cv2.INTER_CUBIC)
    mid = cv2.GaussianBlur(rng.normal(0, 1, (h, w)), (0, 0), 9); mid /= mid.std()
    g = 0.9 + 0.01 * low / low.std() + 0.006 * mid          # keep the cloudiness faint; it reads as camo when strong
    fib = np.zeros((h, w), np.float32)
    for _ in range(9000):
        x, y = rng.integers(0, w), rng.integers(0, h); a = rng.uniform(0, np.pi); l = rng.uniform(4, 22)
        cv2.line(fib, (int(x), int(y)), (int(x + np.cos(a) * l), int(y + np.sin(a) * l)), float(rng.choice([-1, 1]) * rng.uniform(0.2, 1)), 1)
    g += 0.018 * cv2.GaussianBlur(fib, (0, 0), 0.7)
    cr = np.zeros((h, w), np.float32)
    for _ in range(5):
        p0 = rng.integers(0, [w, h]); p1 = rng.integers(0, [w, h])
        cv2.line(cr, tuple(int(v) for v in p0), tuple(int(v) for v in p1), 1.0, 2)
    g -= 0.03 * cv2.GaussianBlur(cr, (0, 0), 2.5)
    g += rng.normal(0, 0.012, (h, w))
    cv2.imwrite(str(out / 'paper.jpg'), (np.clip(g, 0, 1) * 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 90])
    # specks: dust, grit and a few hairs on white
    s = np.ones((h, w), np.float32)
    for _ in range(1400):
        x, y = rng.integers(0, w), rng.integers(0, h)
        cv2.circle(s, (int(x), int(y)), int(rng.choice([0, 1, 1, 2, 3])), float(rng.uniform(0.15, 0.7)), -1)
    for _ in range(70):
        pts = [rng.integers(0, [w, h])]
        for _ in range(6): pts.append(pts[-1] + rng.integers(-14, 15, 2))
        cv2.polylines(s, [np.array(pts, np.int32)], False, float(rng.uniform(0.3, 0.7)), 1)
    s = cv2.GaussianBlur(s, (0, 0), 0.6)
    cv2.imwrite(str(out / 'specks.jpg'), (np.clip(s, 0, 1) * 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 90])


# ================================================================= projects

def proj(p):
    p = Path(p).resolve()
    if not (p / 'storyboard.json').exists() and not (p / 'public').exists():
        raise SystemExit(f'{p} is not a project (run: vox.py new {p})')
    return p


def cmd_new(a):
    p = Path(a.project).resolve()
    for d in ('public/img', 'public/brush', 'public/audio', 'public/tex', 'work/src', 'work/grids', 'out'):
        (p / d).mkdir(parents=True, exist_ok=True)
    make_textures(HOME / 'tex')
    for t in ('paper.jpg', 'specks.jpg'): shutil.copy2(HOME / 'tex' / t, p / 'public/tex' / t)
    for f in (SKILL / 'assets' / 'sfx').glob('*.mp3'): shutil.copy2(f, p / 'public/audio' / f.name)
    sb = p / 'storyboard.json'
    if not sb.exists():
        sb.write_text(json.dumps({'title': a.title or p.name, 'source': '', 'voice': 'audio/vo.mp3', 'beats': []}, indent=2))
    print('project ready:', p)


def cmd_grid(a):
    from PIL import Image, ImageDraw
    src = Path(a.image); im = Image.open(src).convert('RGB'); d = ImageDraw.Draw(im); st = a.step
    for x in range(0, im.width, st):
        d.line([(x, 0), (x, im.height)], fill=(255, 0, 0) if x % (st * 4) == 0 else (255, 150, 150), width=1)
        d.text((x + 2, 2), str(x), fill=(255, 0, 0))
    for y in range(0, im.height, st):
        d.line([(0, y), (im.width, y)], fill=(0, 0, 255) if y % (st * 4) == 0 else (150, 150, 255), width=1)
        d.text((2, y + 2), str(y), fill=(0, 0, 255))
    out = src.with_name(src.stem + '_grid.jpg'); im.save(out, quality=85); print(out)


# ================================================================= cut-outs

def vision_masks(path):
    """Apple Vision foreground instances -> list of uint8 masks (full image size). None if unavailable."""
    import cv2
    tool = HOME / 'bin' / 'subject_mask'
    if not tool.exists(): return None
    tmp = HOME / 'tmp'; tmp.mkdir(exist_ok=True)
    for f in tmp.glob('vm_*'): f.unlink()
    r = run([tool, path, tmp / 'vm'], check=False, quiet=True)
    if r.returncode: return None
    img = cv2.imread(str(path)); h, w = img.shape[:2]
    masks = [cv2.resize(cv2.imread(str(f), 0), (w, h)) for f in sorted(tmp.glob('vm_inst*.png'))]
    return masks or None


def key_mask(img, tol=None):
    """Colour-key fallback: everything that is not connected to the border background."""
    import numpy as np, cv2
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    border = np.concatenate([lab[:4].reshape(-1, 3), lab[-4:].reshape(-1, 3), lab[:, :4].reshape(-1, 3), lab[:, -4:].reshape(-1, 3)])
    med = np.median(border, 0); d = np.linalg.norm(lab - med, axis=2)
    bd = np.linalg.norm(border - med, axis=1)
    thr = tol or max(12.0, float(np.percentile(bd, 80)) * 1.6 + 6)
    bg = (d < thr).astype(np.uint8)
    n, lab_, st, _ = cv2.connectedComponentsWithStats(bg, connectivity=4)
    edge = set(np.unique(np.concatenate([lab_[0], lab_[-1], lab_[:, 0], lab_[:, -1]]))) - {0}
    m = np.where(np.isin(lab_, list(edge)), 0, 255).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    return fill_holes(m)


def fill_holes(m):
    import numpy as np, cv2
    ff = m.copy(); h, w = m.shape
    pad = np.zeros((h + 2, w + 2), np.uint8)
    cv2.floodFill(ff, pad, (0, 0), 255)
    return m | cv2.bitwise_not(ff)


def halftone(g, pitch=5.0, mix=0.32, contrast=1.25, seed=11):
    """A 45-degree dot screen mixed into the continuous tone, like newspaper print."""
    import numpy as np, cv2
    rng = np.random.default_rng(seed)
    g = np.clip((g - 0.5) * contrast + 0.5, 0, 1)
    h, w = g.shape; y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    u = (x + y) / np.sqrt(2); v = (x - y) / np.sqrt(2)
    s = (np.cos(2 * np.pi * u / pitch) + np.cos(2 * np.pi * v / pitch)) / 4 + 0.5
    dots = cv2.GaussianBlur((g > s).astype(np.float32), (0, 0), 0.55)
    out = (1 - mix) * g + mix * dots + rng.normal(0, 0.025, g.shape).astype(np.float32)
    return np.clip(out, 0, 1)


def make_cut(gray, mask, edge=7, min_frac=0.002):
    """gray/mask at final px -> (RGBA with a thin warm-white sticker edge, crop box)."""
    import numpy as np, cv2
    m = (mask > 127).astype(np.uint8) * 255
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    keep = [q for q in range(1, n) if st[q, cv2.CC_STAT_AREA] > min_frac * m.size]
    m = np.isin(lab, keep).astype(np.uint8) * 255
    if not m.any(): raise SystemExit('cut-out mask is empty - try --kind engraving, or a plainer background')
    border = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * edge + 1, 2 * edge + 1))) if edge else m
    border = cv2.GaussianBlur(border, (3, 3), 0)
    col = np.zeros(gray.shape[:2] + (3,), np.float32); col[:] = (232 / 255, 240 / 255, 243 / 255)
    inside = cv2.GaussianBlur(m, (3, 3), 0).astype(np.float32)[:, :, None] / 255
    col = col * (1 - inside) + (gray if gray.ndim == 3 else np.dstack([gray] * 3)) * inside
    rgba = np.dstack([(np.clip(col, 0, 1) * 255).astype(np.uint8), border])
    ys, xs = np.where(border > 0); y0, y1, x0, x1 = ys.min(), ys.max(), xs.min(), xs.max()
    return rgba[y0:y1 + 1, x0:x1 + 1], (int(x0), int(y0), int(x1 - x0 + 1), int(y1 - y0 + 1))


def cmd_cutout(a):
    import numpy as np, cv2
    p = proj(a.project); src = Path(a.image).resolve()
    img = cv2.imread(str(src))
    if img is None: raise SystemExit(f'cannot read {src}')
    H0, W0 = img.shape[:2]
    meta_path = p / 'cutouts.json'
    meta = json.loads(meta_path.read_text()) if meta_path.exists() else {}
    gray_of = (lambda im: im.astype(np.float32) / 255) if a.color else (lambda im: cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255)
    if a.color: a.halftone = 0

    def save(name, rgba, entry):
        cv2.imwrite(str(p / 'public/img' / f'{name}.png'), rgba)
        meta[name] = dict(file=f'{name}.png', w=int(rgba.shape[1]), h=int(rgba.shape[0]), src=str(src), src_w=W0, src_h=H0, kind=a.kind, **entry)
        print(f'cut-out "{name}": {rgba.shape[1]}x{rgba.shape[0]} px')

    if a.kind == 'photo':
        vm = vision_masks(src)
        m = np.maximum.reduce(vm) if vm else key_mask(img)
        ys, xs = np.where(m > 127)
        S = (a.height or 900) / (ys.max() - ys.min() + 1)
        size = (round(W0 * S), round(H0 * S))
        g = gray_of(cv2.resize(img, size, interpolation=cv2.INTER_CUBIC if S > 1 else cv2.INTER_AREA))
        ms = cv2.resize(m, size, interpolation=cv2.INTER_LINEAR)
        rgba, (x0, y0, w, h) = make_cut(halftone(g, mix=a.halftone) if a.halftone > 0 else g, ms, edge=a.edge if a.edge is not None else 7)
        entry = dict(scale=S, ox=x0, oy=y0, touches_bottom=bool(ys.max() >= H0 - 3))
        if a.wiggle:
            bx0, by0, bx1, by1 = [int(v) for v in a.wiggle.split(',')]
            px, py = [float(v) for v in a.pivot.split(',')] if a.pivot else (bx0, (by0 + by1) / 2)
            crop = img[by0:by1, bx0:bx1]
            cp = HOME / 'tmp' / 'wiggle_crop.png'; (HOME / 'tmp').mkdir(exist_ok=True)
            cv2.imwrite(str(cp), cv2.resize(crop, None, fx=3, fy=3, interpolation=cv2.INTER_CUBIC))
            wv = vision_masks(cp)
            sub = np.zeros((H0, W0), np.uint8)
            if wv:
                sub[by0:by1, bx0:bx1] = cv2.resize(np.maximum.reduce(wv), (bx1 - bx0, by1 - by0), interpolation=cv2.INTER_AREA)
            else:
                print('note: no Vision tool - the wiggle piece is the subject inside the box')
                sub[by0:by1, bx0:bx1] = m[by0:by1, bx0:bx1]
            subs = cv2.resize(sub, size, interpolation=cv2.INTER_LINEAR)
            wr, (wx, wy, ww, wh) = make_cut(halftone(g, contrast=1.32, mix=a.halftone) if a.halftone > 0 else g, subs, edge=6)
            cv2.imwrite(str(p / 'public/img' / f'{a.name}_wiggle.png'), wr)
            entry['wiggle'] = dict(file=f'{a.name}_wiggle.png', x=wx - x0, y=wy - y0, w=ww, h=wh, pivot=[px * S - x0, py * S - y0])
        save(a.name, rgba, entry)

    elif a.kind == 'engraving':
        m = key_mask(img, tol=a.tol or 22)
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25)))
        m = fill_holes(m)
        ys, xs = np.where(m > 127)
        S = (a.height or 680) / (ys.max() - ys.min() + 1)
        size = (round(W0 * S), round(H0 * S))
        g = gray_of(cv2.resize(img, size, interpolation=cv2.INTER_CUBIC if S > 1 else cv2.INTER_AREA))
        g = np.clip((g - 0.1) / 0.86, 0, 1) if not a.color else g
        rgba, (x0, y0, w, h) = make_cut(g, cv2.resize(m, size), edge=a.edge if a.edge is not None else 6)
        save(a.name, rgba, dict(scale=S, ox=x0, oy=y0, touches_bottom=False))

    elif a.kind == 'props':
        names = [n.strip() for n in (a.names or '').split(',') if n.strip()]
        vm = vision_masks(src)
        if not vm:
            m = key_mask(img)
            n, lab, st, _ = cv2.connectedComponentsWithStats(m)
            vm = [np.where(lab == q, 255, 0).astype(np.uint8) for q in range(1, n) if st[q, cv2.CC_STAT_AREA] > 0.004 * m.size]
        vm = sorted(vm, key=lambda mk: np.where(mk > 127)[1].mean())
        if names and len(names) != len(vm):
            print(f'warning: found {len(vm)} objects but got {len(names)} names')
        for q, mk in enumerate(vm):
            name = names[q] if q < len(names) else f'prop{q + 1}'
            ys, xs = np.where(mk > 127)
            S = (a.height or 520) / max(ys.max() - ys.min() + 1, (xs.max() - xs.min() + 1) * 0.8)
            size = (round(W0 * S), round(H0 * S))
            g = gray_of(cv2.resize(img, size, interpolation=cv2.INTER_AREA if S < 1 else cv2.INTER_CUBIC))
            rgba, (x0, y0, w, h) = make_cut(halftone(g, mix=min(a.halftone, 0.25)) if a.halftone > 0 else g, cv2.resize(mk, size), edge=a.edge if a.edge is not None else 5)
            save(name, rgba, dict(scale=S, ox=x0, oy=y0, touches_bottom=False))
    meta_path.write_text(json.dumps(meta, indent=1))


# ================================================================= voice + timing

def cmd_say(a):
    p = proj(a.project); sb = load_jsonc(p / 'storyboard.json')
    text = ' '.join(b['line'] for b in sb['beats'])
    if not which('say'): raise SystemExit('no OS text-to-speech found; generate the voiceover with a TTS tool instead')
    aiff = p / 'work' / 'vo.aiff'
    run(['say', '-v', a.voice, '-r', str(a.rate), '-o', aiff, text])
    run(['ffmpeg', '-v', 'error', '-y', '-i', aiff, '-ar', '44100', '-b:a', '192k', p / 'public/audio/vo.mp3'])


def whisper():
    if os.environ.get('VOX_NO_WHISPER') == '1': return None
    exe = which('whisper-cli', 'whisper-cpp')
    if not exe: return None
    model = os.environ.get('VOX_WHISPER_MODEL')
    if not model:
        cands = glob.glob(str(Path.home() / '.cache/whisper*/ggml-*.bin')) + glob.glob('/opt/homebrew/share/whisper*/ggml-*.bin')
        pref = ['large-v3-turbo', 'medium', 'small', 'base', 'tiny']
        cands.sort(key=lambda c: next((i for i, k in enumerate(pref) if k in c), 9))
        model = cands[0] if cands else None
    return (exe, model) if model else None


def norm(w):
    return re.sub(r"[^a-z0-9%$]", '', w.lower().replace('’', "'"))


def duration(path):
    return float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], quiet=True).stdout.strip())


def cmd_timing(a):
    p = proj(a.project); sb = load_jsonc(p / 'storyboard.json')
    audio = p / 'public' / sb.get('voice', 'audio/vo.mp3')
    if not audio.exists(): raise SystemExit(f'no voiceover at {audio}')
    lines = [b['line'] for b in sb['beats']]
    script = [w for ln in lines for w in ln.split()]
    dur = duration(audio)
    wav = p / 'work' / 'vo16k.wav'
    run(['ffmpeg', '-v', 'error', '-y', '-i', audio, '-ar', '16000', '-ac', '1', wav])
    times, method = None, None
    wh = whisper()
    if wh:
        exe, model = wh
        r = run([exe, '-m', model, '-f', wav, '-ml', '1', '-sow', '-oj', '-of', p / 'work' / 'vo_words'], check=False, quiet=True)
        jf = p / 'work' / 'vo_words.json'
        if r.returncode == 0 and jf.exists():
            toks = [(norm(t['text']), t['offsets']['from'] / 1000, t['offsets']['to'] / 1000)
                    for t in json.loads(jf.read_text())['transcription'] if norm(t['text'])]
            times = align(script, toks); method = 'whisper'
    if times is None:
        times = by_silence(lines, wav, dur); method = 'silence'
    words = [dict(w=w, s=round(s, 3), e=round(e, 3)) for w, (s, e) in zip(script, times)]
    (p / 'timing.json').write_text(json.dumps(dict(duration=dur, method=method, words=words), indent=1))
    print(f'timing: {len(words)} words over {dur:.2f}s ({method})')


def align(script, toks):
    """Give every script word a time from the transcript; unmatched words are interpolated."""
    a = [norm(w) for w in script]; b = [t[0] for t in toks]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    t = [None] * len(a)
    for blk in sm.get_matching_blocks():
        for q in range(blk.size): t[blk.a + q] = (toks[blk.b + q][1], toks[blk.b + q][2])
    known = [q for q, v in enumerate(t) if v]
    if not known: return None
    for q in range(len(t)):
        if t[q]: continue
        lo = max([k for k in known if k < q], default=None); hi = min([k for k in known if k > q], default=None)
        if lo is None: t[q] = (t[hi][0], t[hi][0])
        elif hi is None: t[q] = (t[lo][1], t[lo][1])
        else:
            f = (q - lo) / (hi - lo); s = t[lo][1] + (t[hi][0] - t[lo][1]) * f; t[q] = (s, s + 0.05)
    return t


def by_silence(lines, wav, dur):
    """No transcriber: put beat boundaries on the longest pauses, spread words by length inside each beat."""
    r = run(['ffmpeg', '-v', 'info', '-i', wav, '-af', 'silencedetect=n=-35dB:d=0.15', '-f', 'null', '-'], quiet=True, check=False)
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', r.stdout)]
    en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', r.stdout)]
    sil = list(zip(st, en + [dur] * (len(st) - len(en))))
    speech0 = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
    speech1 = sil[-1][0] if sil and sil[-1][1] >= dur - 0.05 else dur
    inner = sorted([s for s in sil if s[0] > speech0 + 0.1 and s[1] < speech1 - 0.1], key=lambda s: s[0] - s[1])[:len(lines) - 1]
    inner = sorted(inner)
    if len(inner) == len(lines) - 1:
        spans = []; t0 = speech0
        for s in inner: spans.append((t0, s[0])); t0 = s[1]
        spans.append((t0, speech1))
    else:
        tot = sum(len(ln) for ln in lines); spans = []; t0 = speech0
        for ln in lines:
            t1 = t0 + (speech1 - speech0) * len(ln) / tot; spans.append((t0, t1)); t0 = t1
    out = []
    for ln, (a, b) in zip(lines, spans):
        ws = ln.split(); tot = sum(len(w) + 1 for w in ws); t = a
        for w in ws:
            d = (b - a) * (len(w) + 1) / tot; out.append((t, t + d * 0.9)); t += d
    return out


# ================================================================= build / brush / render

def cmd_build(a):
    sys.path.insert(0, str(SKILL / 'scripts'))
    import layout
    p = proj(a.project)
    sb = load_jsonc(p / 'storyboard.json')
    cut = json.loads((p / 'cutouts.json').read_text()) if (p / 'cutouts.json').exists() else {}
    if not (p / 'timing.json').exists(): cmd_timing(a)
    timing = json.loads((p / 'timing.json').read_text())
    scene, warn = layout.build_scene(sb, cut, timing)
    (p / 'scene.json').write_text(json.dumps(scene))
    for w in warn: print('warning:', w)
    print(f'scene: {len(scene["beats"])} beats, {scene["duration"] / 30:.1f}s, {len(scene["layers"])} brush layers')


def unmix(p, lid, color):
    """Brush render on white -> transparent PNG: alpha = how far each pixel moved from white toward the ink."""
    import numpy as np
    from PIL import Image
    ink = np.array([int(color[i:i + 2], 16) for i in (1, 3, 5)], np.float32)
    for seed in (1, 2, 3):
        px = np.array(Image.open(p / 'public/brush' / f'{lid}_{seed}.png').convert('RGB'), np.float32)
        d = 255 - ink; wgt = d / d.sum()
        al = np.clip(((255 - px) / np.maximum(d, 1) * wgt).sum(-1), 0, 1)
        if ink.mean() < 80: al = np.clip(al * 1.8, 0, 1)        # translucent brush stamps -> solid felt-pen black
        out = np.dstack([np.broadcast_to(ink, px.shape), al * 255]).astype(np.uint8)
        Image.fromarray(out).save(p / 'public/brush' / f'a_{lid}_{seed}.png')
        (p / 'public/brush' / f'{lid}_{seed}.png').unlink()


def cmd_brush(a):
    p = proj(a.project)
    scene = json.loads((p / 'scene.json').read_text())
    hp = p / 'public/brush/.hashes.json'
    old = json.loads(hp.read_text()) if hp.exists() else {}
    new, todo = {}, []
    for l in scene['layers']:
        key = hashlib.sha1(json.dumps({k: v for k, v in l.items() if k not in ('x', 'y', 'reveal')}, sort_keys=True).encode()).hexdigest()
        new[l['id']] = key
        if old.get(l['id']) != key or not all((p / 'public/brush' / f'a_{l["id"]}_{s}.png').exists() for s in (1, 2, 3)):
            todo.append(l)
    if todo:
        print(f'brush: rendering {len(todo)} of {len(scene["layers"])} layers')
        run(['node', SKILL / 'scripts' / 'render_brush.mjs', ENGINE, p] + [l['id'] for l in todo], env=chrome_env())
        for l in todo: unmix(p, l['id'], l['color'])
    else:
        print('brush: all layers up to date')
    hp.write_text(json.dumps(new))


def cmd_render(a):
    p = proj(a.project)
    if not (ENGINE / 'node_modules').exists(): raise SystemExit('engine not installed - run: vox.py setup')
    scene = json.loads((p / 'scene.json').read_text())
    sb = load_jsonc(p / 'storyboard.json')
    raw = p / 'out' / ('draft_raw.mp4' if a.draft else 'raw.mp4')
    cmd = ['npx', 'remotion', 'render', 'src/index.ts', 'Main', raw, f'--props={p / "scene.json"}', f'--public-dir={p / "public"}',
           f'--concurrency={max(2, (os.cpu_count() or 4) - 2)}', '--log=error']
    if a.draft: cmd.append('--scale=0.5')
    if system_chrome(): cmd.append(f'--browser-executable={system_chrome()}')
    run(cmd, cwd=ENGINE)
    slug = re.sub(r'[^a-z0-9]+', '-', sb.get('title', p.name).lower()).strip('-') or 'video'
    final = p / 'out' / (f'{slug}_draft.mp4' if a.draft else f'{slug}.mp4')
    run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-c:v', 'libx264', '-preset', 'veryfast' if a.draft else 'slow', '-crf', '16',
         '-pix_fmt', 'yuv420p', '-af', 'loudnorm=I=-15:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
         '-shortest', '-movflags', '+faststart', final])
    raw.unlink()
    frames = []
    for b in scene['beats']:
        frames += [b['start'] + int((b['end'] - b['start']) * 0.45), b['end'] - 4]
    contact(final, sorted(set(min(f, scene['duration'] - 1) for f in frames)), p / 'out' / 'contact.jpg')
    print('\nvideo:', final, '\ncontact sheet:', p / 'out' / 'contact.jpg')


def contact(video, frames, out, cols=2):
    sel = '+'.join(f'eq(n\\,{f})' for f in frames)
    rows = (len(frames) + cols - 1) // cols
    run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-vf', f"select='{sel}',scale=960:-1,tile={cols}x{rows}", '-frames:v', '1',
         '-vsync', 'vfr', out])


def cmd_sheet(a):
    p = proj(a.project)
    vids = sorted((p / 'out').glob('*.mp4'), key=lambda f: f.stat().st_mtime)
    if not vids: raise SystemExit('nothing rendered yet')
    contact(vids[-1], [int(f) for f in a.frames], p / 'out' / 'frames.jpg'); print(p / 'out' / 'frames.jpg')


def cmd_make(a):
    p = proj(a.project)
    sb = p / 'storyboard.json'; tm = p / 'timing.json'
    audio = p / 'public' / load_jsonc(sb).get('voice', 'audio/vo.mp3')
    if a.retime or not tm.exists() or tm.stat().st_mtime < max(audio.stat().st_mtime, sb.stat().st_mtime):
        cmd_timing(a)
    cmd_build(a); cmd_brush(a); cmd_render(a)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = ap.add_subparsers(dest='cmd', required=True)
    sp.add_parser('setup'); sp.add_parser('doctor'); sp.add_parser('_tex')
    s = sp.add_parser('new'); s.add_argument('project'); s.add_argument('--title')
    s = sp.add_parser('grid'); s.add_argument('image'); s.add_argument('--step', type=int, default=80)
    s = sp.add_parser('cutout', help='cut a generated image into a collage piece')
    s.add_argument('project'); s.add_argument('name'); s.add_argument('image')
    s.add_argument('--kind', choices=['photo', 'engraving', 'props'], default='photo')
    s.add_argument('--height', type=int, help='cut-out height in px (photo 900, engraving 680, props 520)')
    s.add_argument('--names', help='props: comma-separated names, left to right')
    s.add_argument('--halftone', type=float, default=0.32, help='0 = no newspaper dot screen')
    s.add_argument('--edge', type=int, help='white sticker edge in px (default 7 photo, 6 engraving, 5 props; 0 = none)')
    s.add_argument('--color', action='store_true', help='keep the colour (editorial illustrations); default is black and white')
    s.add_argument('--tol', type=float, help='engraving: paper-key tolerance (default 22)')
    s.add_argument('--wiggle', help='photo: x0,y0,x1,y1 box (source px) cut as a separate piece that wiggles, e.g. a hand')
    s.add_argument('--pivot', help='photo: px,py (source px) the wiggle piece rotates around, e.g. the wrist')
    s = sp.add_parser('say'); s.add_argument('project'); s.add_argument('--voice', default='Daniel'); s.add_argument('--rate', type=int, default=175)
    for n in ('timing', 'build', 'brush'):
        s = sp.add_parser(n); s.add_argument('project')
    for n in ('render', 'make'):
        s = sp.add_parser(n); s.add_argument('project'); s.add_argument('--draft', action='store_true')
        if n == 'make': s.add_argument('--retime', action='store_true')
    s = sp.add_parser('sheet'); s.add_argument('project'); s.add_argument('frames', nargs='+')
    a = ap.parse_args()
    {'setup': cmd_setup, 'doctor': cmd_doctor, '_tex': lambda a: make_textures(HOME / 'tex'), 'new': cmd_new, 'grid': cmd_grid, 'cutout': cmd_cutout, 'say': cmd_say,
     'timing': cmd_timing, 'build': cmd_build, 'brush': cmd_brush, 'render': cmd_render, 'make': cmd_make, 'sheet': cmd_sheet}[a.cmd](a)


if __name__ == '__main__':
    main()
