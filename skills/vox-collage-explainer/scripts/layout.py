"""Storyboard -> scene. Turns the beats Claude writes (storyboard.json) into positioned, timed collage
elements and p5.brush layers for the Remotion engine. All coordinates are 1920x1080 px; all element
timings are frames relative to the beat start. Image points in the storyboard are in SOURCE image px
(the generated image, as seen in its grid overlay) and are mapped through the cut-out's scale and crop.
"""
import json, math, random, re
from styles import StyleBeats, STY

W, H, FPS = 1920, 1080, 30
INK = '#1D1C20'
YEL = '#EDBD2E'
VO_START = 4          # frames of silence before the voice
LEAD = 6              # a beat starts this many frames before its first word
TAIL = 15             # hold after the last word


# ---------------------------------------------------------------- geometry helpers

def ellipse_pts(cx, cy, rx, ry, start_deg=-100, turns=1.1, rot_deg=-6, n=60, wobble=0.04, seed=1):
    pts = []; rot = math.radians(rot_deg)
    for i in range(n + 1):
        t = i / n; a = math.radians(start_deg) + t * turns * 2 * math.pi
        k = 1 + wobble * math.sin(3 * a + seed) + t * 0.08          # spirals out slightly, like a hand-drawn loop
        x = rx * k * math.cos(a); y = ry * k * math.sin(a)
        pts.append([cx + x * math.cos(rot) - y * math.sin(rot), cy + x * math.sin(rot) + y * math.cos(rot)])
    return pts


def bez(ps, n=30):
    out = []
    for i in range(n + 1):
        t = i / n; q = [list(p) for p in ps]
        while len(q) > 1:
            q = [[(1 - t) * a[0] + t * b[0], (1 - t) * a[1] + t * b[1]] for a, b in zip(q, q[1:])]
        out.append(q[0])
    return out


def head(body, size=30, spread=0.5):
    p1 = body[-1]; p0 = body[max(0, len(body) - 4)]
    a = math.atan2(p1[1] - p0[1], p1[0] - p0[0])
    return [[p1, [p1[0] - size * math.cos(a - spread), p1[1] - size * math.sin(a - spread)]],
            [p1, [p1[0] - size * math.cos(a + spread), p1[1] - size * math.sin(a + spread)]]]


def arc(cx, cy, r, a0, a1, n=12):
    return [[cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)), cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))]
            for i in range(n + 1)]


def zigzag(x0, y0, x1, y1, teeth, h, seed):
    r = random.Random(seed); pts = []
    for k in range(teeth * 2 + 1):
        t = k / (teeth * 2)
        pts.append([x0 + (x1 - x0) * t + r.uniform(-6, 6), y0 + (y1 - y0) * t + (h if k % 2 else -h) * r.uniform(0.7, 1.1)])
    return pts


def subdivide(poly, n=10, amp=5, seed=1):
    # many small, slightly wandering steps per edge so a paint edge looks torn instead of ruled
    r = random.Random(seed); out = []
    for i in range(len(poly)):
        a = poly[i]; b = poly[(i + 1) % len(poly)]
        for k in range(n):
            t = k / n
            out.append([a[0] + (b[0] - a[0]) * t + r.uniform(-amp, amp), a[1] + (b[1] - a[1]) * t + r.uniform(-amp, amp)])
    return out


def bbox(pts):
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


def text_w(text, size, k=0.56):
    return max(len(line) for line in text.split('\n')) * size * k


# ---------------------------------------------------------------- scene builder

class Scene(StyleBeats):
    def __init__(self, sb, cutouts, timing):
        self.sb, self.cut, self.timing = sb, cutouts, timing
        self.style = sb.get('style', 'vox')
        if self.style not in STY: raise SystemExit(f'unknown style "{self.style}" ({", ".join(STY)})')
        self.layers, self.beats, self.sfx, self.warn = [], [], [], []

    # -- brush layers (geometry in comp px, stored relative to the layer canvas)
    def layer(self, id, kind, strokes, pad=40, **kw):
        pts = [p for s in strokes for p in s] + kw.get('poly', [])
        x0, y0, x1, y1 = bbox(pts)
        x, y = math.floor(x0 - pad), math.floor(y0 - pad)
        w, h = math.ceil(x1 - x + pad), math.ceil(y1 - y + pad)
        loc = lambda s: [[round(px - x, 1), round(py - y, 1)] for px, py in s]
        if 'poly' in kw: kw['poly'] = loc(kw['poly'])
        self.layers.append(dict(id=id, x=x, y=y, w=int(w), h=int(h), kind=kind, strokes=[loc(s) for s in strokes], **kw))
        return id

    def ink(self, id, strokes, weight=2.0, reveal=46):
        return self.layer(id, 'marker', strokes, color=INK, weight=weight, reveal=reveal)

    def highlight(self, id, strokes, weight=12, reveal=110):
        return self.layer(id, 'highlight', strokes, pad=60, color=YEL, weight=weight, reveal=reveal)

    def block(self, id, poly, rows=6):
        if len(poly) < 12: poly = subdivide(poly, seed=len(id))
        x0, y0, x1, y1 = bbox(poly)
        path = []
        for i in range(rows):                       # back-and-forth path that reveals the block like a wide brush
            yy = y0 + (y1 - y0) * (i + 0.5) / rows
            path += [[x0, yy], [x1, yy]] if i % 2 == 0 else [[x1, yy], [x0, yy]]
        return self.layer(id, 'block', [path], poly=poly, color=YEL, weight=1, reveal=int((y1 - y0) / rows * 1.9))

    # -- cut-outs: map source-image px into the displayed cut-out
    def place(self, name, x, y, k):
        c = self.cut[name]
        S, ox, oy = c['scale'], c['ox'], c['oy']
        return lambda p: [x + (p[0] * S - ox) * k, y + (p[1] * S - oy) * k]

    def point(self, beat, ref, mapper):
        if isinstance(ref, str):
            pts = beat.get('points', {})
            if ref not in pts:
                raise SystemExit(f'beat "{beat.get("line", "")[:40]}": unknown point "{ref}" (define it in "points")')
            ref = pts[ref]
        return mapper(ref)

    def cutout_el(self, name, x, y, k, at, rot=0, wiggle_span=None):
        c = self.cut[name]
        el = dict(t='cutout', src=f'img/{c["file"]}', x=round(x, 1), y=round(y, 1), w=round(c['w'] * k, 1), h=round(c['h'] * k, 1), rot=rot, at=at)
        wg = c.get('wiggle')
        if wg and wiggle_span:
            el['wiggle'] = dict(src=f'img/{wg["file"]}', x=wg['x'] * k, y=wg['y'] * k, w=wg['w'] * k, h=wg['h'] * k,
                                pivot=[wg['pivot'][0] * k, wg['pivot'][1] * k], **{'from': wiggle_span[0], 'to': wiggle_span[1]})
        return el

    def prop_el(self, name, x, y, maxdim, rot, at):
        if not name: return None
        if name not in self.cut:
            self.warn.append(f'prop "{name}" has no cut-out; skipped'); return None
        c = self.cut[name]; k = maxdim / max(c['w'], c['h'])
        return self.cutout_el(name, x, y, k, at, rot)

    # -- timing
    def words_for(self, i):
        return self.word_ranges[i]

    def cue(self, beat_i, cue, default):
        """Frame (relative to beat start) for a cue: a word from this beat's line, optionally '+N'/'-N' frames,
        an int (frames from beat start), or None -> default."""
        if cue is None: return default
        if isinstance(cue, (int, float)): return int(cue)
        m = re.match(r'^(.*?)([+-]\d+)?$', str(cue).strip())
        word, off = m.group(1).strip(), int(m.group(2) or 0)
        start = self.beats_t[beat_i][0]
        if word.lower() == 'end':
            return self.beats_t[beat_i][1] - start + off
        a, b = self.words_for(beat_i)
        toks = [norm(t) for t in word.split()]
        words = self.timing['words']
        for j in range(a, b):
            if all(j + q < len(words) and norm(words[j + q]['w']).startswith(toks[q]) for q in range(len(toks))):
                return VO_START + round(words[j]['s'] * FPS) - start + off
        self.warn.append(f'cue "{cue}" not found in beat {beat_i + 1}; using default {default}')
        return default

    # ------------------------------------------------------------ build
    def build(self):
        beats = self.sb['beats']
        self.map_words(beats)
        # beat boundaries: each beat starts a little before its first word
        starts = []
        for i, _ in enumerate(beats):
            a, _b = self.word_ranges[i]
            s = 0 if i == 0 else VO_START + round(self.timing['words'][a]['s'] * FPS) - LEAD
            starts.append(max(s, (starts[-1] + 24) if starts else 0))
        end = VO_START + round(self.timing['duration'] * FPS) + TAIL
        self.beats_t = [(s, starts[i + 1] if i + 1 < len(starts) else max(end, s + 45)) for i, s in enumerate(starts)]

        for i, beat in enumerate(beats):
            kind = beat.get('type', 'subject')
            fn = getattr(self, f'beat_{kind}', None)
            if not fn: raise SystemExit(f'unknown beat type "{kind}" (vox: subject, diagram, chart, stat, closer; '
                                        'styles: hero, counter, flip, stacks, bars, linechart, callouts, split, pan, burst, tunnel)')
            s, e = self.beats_t[i]
            b = dict(start=s, end=e, dots=kind in ('diagram', 'chart', 'stat', 'closer'), elements=[], top=[])
            if self.style == 'vox': b['push'] = 0.03
            for k in ('bg', 'dark', 'grid', 'cam'):
                if k in beat: b[k] = beat[k]
            fn(i, beat, b)
            self.fx_extras(i, beat, b)
            self.beats.append(b)

        # transitions: the vox ink wipe lives on the previous beat; the others are engine effects
        for i, beat in enumerate(beats):
            en = beat.get('enter', 'slide' if beat.get('type') == 'chart' else 'cut')
            en = en if isinstance(en, dict) else dict(type=en)
            if not i or en['type'] == 'cut': continue
            prev = self.beats[i - 1]; dur = prev['end'] - prev['start']
            if en['type'] == 'wipe':
                prev['top'].append(dict(t='brush', id='wipe', **{'from': dur - 12, 'to': dur}, ease='in'))
                self.sfx.append(['scribble', prev['end'] - 13, 16, 0.5])
            elif en['type'] in ('zoom', 'blur', 'dark'):
                prev['exit'] = dict(type=en['type'], n=en.get('n', 8), **({'at': en['at']} if 'at' in en else {}))
                if en['type'] != 'dark': self.beats[i]['enter'] = dict(type=en['type'], n=en.get('n', 8))
            elif en['type'] in ('slide', 'iris', 'shape', 'glitch'):
                if en['type'] == 'slide' and beat.get('type') == 'chart': continue      # the chart sheet slides itself
                self.beats[i]['enter'] = dict(type=en['type'], n=en.get('n', 10 if en['type'] != 'glitch' else 9), **({'at': en['at']} if 'at' in en else {}))
            else:
                raise SystemExit(f'unknown enter "{en["type"]}" (cut, wipe, slide, glitch, zoom, blur, dark, iris, shape)')
        if any(b['top'] for b in self.beats): self.wipe_layer()
        self.auto_sfx()
        self.style_sfx()
        voice = self.sb.get('voice', 'audio/vo.mp3')
        hud = []
        if self.sb.get('hud'):
            h = self.sb['hud']; fb = h.get('from_beat', 1) - 1
            ub = h.get('until_beat')
            hud.append(dict(label=h.get('label', ''), rate=h.get('rate', 1), start=h.get('start', 0), prefix=h.get('prefix', ''), suffix=h.get('suffix', ''),
                            at=self.beats_t[fb][0] + self.cue(fb, h.get('cue'), 4), **({'until': self.beats_t[ub - 1][1]} if ub else {})))
        return dict(fps=FPS, width=W, height=H, duration=self.beats[-1]['end'], style=self.style, hud=hud, voice=dict(src=voice, start=VO_START),
                    layers=self.layers, beats=self.beats, sfx=sorted(self.sfx, key=lambda s: s[1]))

    def map_words(self, beats):
        words = self.timing['words']; j = 0; self.word_ranges = []
        for beat in beats:
            n = len(beat['line'].split())
            self.word_ranges.append((min(j, len(words) - 1), min(j + n, len(words))))
            j += n
        if j != len(words):
            self.warn.append(f'script has {j} words but timing has {len(words)}; check that every beat "line" matches the voiceover')

    def wipe_layer(self):
        r = random.Random(4); scr = []
        for row in range(9):
            y0 = -120 + row * 150
            pts = [[-160 + k * 280 + r.uniform(-30, 30), y0 + (140 if k % 2 else 0) + r.uniform(-25, 25)] for k in range(9)]
            scr.append(pts if row % 2 == 0 else pts[::-1])
        self.layers.append(dict(id='wipe', x=0, y=0, w=W, h=H, kind='scribble', strokes=scr, color=YEL, weight=16, reveal=200))

    def auto_sfx(self):
        for b in self.beats:
            s = b['start']; slaps = 0; typed = False; last_marker = -99
            for el in b['elements']:
                t = el.get('t')
                if t == 'cutout' and slaps < 2:
                    self.sfx.append(['slap', s + el['at'], 12, 0.35]); slaps += 1
                elif t in ('tag', 'typed') and not typed:
                    at = el['at'] if t == 'tag' else el['lines'][0]['at']
                    self.sfx.append(['type', s + at, 14, 0.18]); typed = True
                elif t == 'brush' and not el['id'].endswith('_block') and el['id'] != 'wipe' and el['to'] > el['from']:
                    if el['from'] - last_marker > 5:
                        self.sfx.append(['marker', s + el['from'], min(18, el['to'] - el['from'] + 6), 0.28]); last_marker = el['from']
                elif t == 'slide':
                    self.sfx.append(['slide', max(0, s - 1), 16, 0.5])
                elif t == 'ransom':
                    self.sfx.append(['slap', s + el['at'], 10, 0.25])

    # ------------------------------------------------------------ shared pieces
    def title_column(self, i, beat, b, x, y, size, lh, fig_y, default_at=8, gap=16):
        if beat.get('fig'):
            b['elements'].append(dict(t='tag', text=beat['fig'], x=x + 2, y=fig_y, at=4))
        lines = beat.get('title') or []
        if isinstance(lines, str): lines = [lines]
        cues = beat.get('title_cues') or [None] * len(lines)
        if lines:
            b['elements'].append(dict(t='typed', x=x, y=y, size=size, lh=lh / size, font='serif',
                                      lines=[dict(text=t, at=self.cue(i, c, default_at + gap * k)) for k, (t, c) in enumerate(zip(lines, cues))]))
        return y + len(lines) * lh

    def note(self, i, beat, b, x, y, size, default_at, swipe=True, max_w=430):
        n = beat.get('note')
        if not n: return None
        text = n['text']
        size = min(size, int(max_w / (0.6 * max(len(l) for l in text.split('\n')))))
        at = self.cue(i, n.get('cue'), default_at)
        nl = text.count('\n') + 1
        if swipe and nl == 1:
            tw = text_w(text, size, 0.56)
            sw = self.highlight(f'b{i}_note_swipe', [[[x - 18, y + size * 0.93], [x + tw * 0.5, y + size * 0.86], [x + tw + 16, y + size * 0.78]]],
                                weight=round(12 * size / 92, 1), reveal=int(120 * size / 92))
            b['elements'].append(dict(t='brush', id=sw, **{'from': at - 2, 'to': at + 5}, ease='out'))
        b['elements'].append(dict(t='hand', text=text, x=x, y=y, size=size, rot=-4, **{'from': at, 'to': at + 9 * nl}))
        return dict(x=x, y=y, size=size, at=at)

    def note_arrow(self, i, b, note, target, kind='left'):
        x, y, at = note['x'], note['y'], note['at']
        if kind == 'left':          # from the note's left edge back across to the target
            s = [x - 30, y + note['size'] * 0.4]
            pts = bez([s, [s[0] - 140, s[1] + 48], [target[0] + 70, target[1] + 74], target])
        else:                       # from under the note down to the target
            s = [x + 20, y + note['size'] * 1.55]
            pts = bez([s, [s[0] - 20, s[1] + 140], [target[0] + 105, target[1] - 28], target])
        lid = self.ink(f'b{i}_note_arrow', [pts] + head(pts, 30), weight=2.0, reveal=44)
        b['elements'].append(dict(t='brush', id=lid, **{'from': at + 8, 'to': at + 16}))

    def annotations(self, i, beat, b, mapper, k, default_at=20):
        circles = {}
        for n, a in enumerate(beat.get('annotate', [])):
            if 'circle' in a:
                p = self.point(beat, a['circle'], mapper)
                rx, ry = [v * k * self.cut_scale for v in a.get('size', [130, 160])]
                at = self.cue(i, a.get('cue'), default_at)
                lid = self.ink(f'b{i}_circle{n}', [ellipse_pts(p[0], p[1] + 6, rx, ry, seed=n + 2)], weight=2.1, reveal=50)
                b['elements'].append(dict(t='brush', id=lid, **{'from': at, 'to': at + 12}))
                circles[a['circle'] if isinstance(a['circle'], str) else n] = (p, rx * 1.12, ry * 1.12)
            elif 'marks' in a:
                p = self.point(beat, a['marks'], mapper)
                at = self.cue(i, a.get('cue'), 8)
                a0, a1 = (-38, 38) if a.get('dir', 'right') == 'right' else (142, 218)
                lid = self.ink(f'b{i}_marks{n}', [arc(p[0], p[1], r, a0, a1) for r in (48, 78, 108)], weight=1.9, reveal=36)
                b['elements'].append(dict(t='brush', id=lid, **{'from': at, 'to': at + 8}))
            elif 'underline' in a:
                p0 = self.point(beat, a['underline'][0], mapper); p1 = self.point(beat, a['underline'][1], mapper)
                at = self.cue(i, a.get('cue'), default_at)
                lid = self.ink(f'b{i}_under{n}', [bez([p0, [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 + 8], p1])], weight=2.0)
                b['elements'].append(dict(t='brush', id=lid, **{'from': at, 'to': at + 8}))
        return circles

    def arrow_target(self, circles, ref, p, side='right'):
        if ref in circles:
            (cx, cy), rx, ry = circles[ref]
            return [cx + rx * 1.12, cy + ry * 0.3] if side == 'right' else [cx, cy + ry]
        return p

    # ------------------------------------------------------------ beat types
    def beat_subject(self, i, beat, b):
        name = beat['subject']; c = self.cut[name]
        k = min(1.0, 1000 / c['w'], 900 / c['h'])
        w, h = c['w'] * k, c['h'] * k
        y = H + 40 - h if c.get('touches_bottom') else H - h - 70
        x = min(max(880 - w / 2, 240), 1385 - w)
        self.cut_scale = c['scale']
        mp = self.place(name, x, y, k)
        E = b['elements']
        E.append(dict(t='grid', x=110, y=110, w=600, h=540, rot=-1.5))
        if beat.get('clipping'):
            cl = beat['clipping']; E.append(dict(t='clipping', x=70, y=600, w=430, h=420, rot=-2, at=6, **cl))
        pe = self.prop_el(beat.get('prop'), 210, 140, 370, -32, 12)
        if pe: E.append(pe)
        poly = [[x + w * 0.185, y + h * 0.13], [x + w * 0.83, y + h * 0.076], [x + w * 0.875, y + h * 0.68], [x + w * 0.228, y + h * 0.725]]
        E.append(dict(t='brush', id=self.block(f'b{i}_block', poly), **{'from': 0, 'to': 9}, ease='out'))
        E.append(dict(t='brush', id=self.ink(f'b{i}_scribble', [zigzag(x + w * 0.12, y + h * 0.13, x + w * 0.37, y + h * 0.1, 6, 40, i + 3)], 1.7, 54),
                      **{'from': 14, 'to': 24}))
        wig = beat.get('wiggle')
        span = (self.cue(i, wig.get('from'), 6), self.cue(i, wig.get('to'), b['end'] - b['start'] - 14)) if wig else None
        E.append(self.cutout_el(name, x, y, k, 2, wiggle_span=span))
        circles = self.annotations(i, beat, b, mp, k)
        cx = max(1420, x + w + 30)
        ny = self.title_column(i, beat, b, cx - 2, 340, 76, 85, 282) + 46
        note = self.note(i, beat, b, cx + 10, ny, 92, 32, max_w=1880 - cx - 30)
        if note and beat['note'].get('arrow_to'):
            ref = beat['note']['arrow_to']
            self.note_arrow(i, b, note, self.arrow_target(circles, ref, self.point(beat, ref, mp)))
        if x + w > cx - 20: self.warn.append(f'beat {i + 1}: subject overlaps the text column')

    def beat_diagram(self, i, beat, b):
        name = beat['image']; c = self.cut[name]
        k = min(1.0, 880 / c['w'], 700 / c['h'])
        w, h = c['w'] * k, c['h'] * k
        x, y = 700 - w / 2, 533 - h / 2
        self.cut_scale = c['scale']
        mp = self.place(name, x, y, k)
        E = b['elements']
        E.append(dict(t='grid', x=1250, y=120, w=640, h=470, rot=1))
        r = 0.424 * max(w, h); cx0, cy0 = x + w / 2, y + h / 2 + 7
        disc = [[cx0 + math.cos(a) * r * (1 + 0.025 * math.sin(5 * a)), cy0 + math.sin(a) * r * (1 + 0.025 * math.sin(5 * a))]
                for a in [q / 40 * 2 * math.pi for q in range(40)]]
        E.append(dict(t='brush', id=self.block(f'b{i}_disc', disc, rows=7), **{'from': 0, 'to': 10}, ease='out'))
        E.append(self.cutout_el(name, x, y, k, 2))
        pe = self.prop_el(beat.get('prop'), 1650, 600, 460, 10, 22)
        if pe: E.append(pe)
        for n, ar in enumerate(beat.get('arrows', [])):
            pts = [self.point(beat, p, mp) for p in ar['path']]
            body = bez(pts, n=12 * len(pts))
            strokes = [body] + head(body, 34)
            if ar.get('spark'):
                sx, sy = pts[0]
                strokes += [[[sx + math.cos(a) * 22, sy + math.sin(a) * 22], [sx + math.cos(a) * 48, sy + math.sin(a) * 48]]
                            for a in (math.radians(d) for d in (-150, -110, -70, -30))]
            at = self.cue(i, ar.get('cue'), 12 + 20 * n)
            if ar.get('dashed'):
                lid = self.layer(f'b{i}_arrow{n}', 'dashed', strokes, color=INK, weight=2.5, dashed=[0], dash=26, gap=17, reveal=48)
            else:
                lid = self.ink(f'b{i}_arrow{n}', strokes, weight=2.2, reveal=50)
            E.append(dict(t='brush', id=lid, **{'from': at, 'to': at + 15}, ease='sin' if ar.get('dashed') else 'inout'))
        for n, ci in enumerate(beat.get('circles', [])):
            p = self.point(beat, ci['at'], mp)
            rx, ry = [v * k * self.cut_scale for v in ci.get('size', [150, 100])]
            at = self.cue(i, ci.get('cue'), 30)
            strokes = [ellipse_pts(p[0], p[1] + 4, rx, ry, 190, 1.08, -8, seed=n + 5)]
            lx0 = p[0] + rx * 1.1
            if ci.get('label'):
                strokes.append([[lx0, p[1] + 10], [lx0 + 122, p[1] + 18]])      # leader line out to the label
            lid = self.ink(f'b{i}_circle{n}', strokes, weight=2.1, reveal=44)
            E.append(dict(t='brush', id=lid, **{'from': at, 'to': at + 11}))
            if ci.get('label'):
                E.append(dict(t='tag', text=ci['label'], x=lx0 + 130, y=p[1] - 2, at=at + 6, size=22, rot=2))
        for n, tg in enumerate(beat.get('tags', [])):
            p = self.point(beat, tg['at'], mp)
            E.append(dict(t='tag', text=tg['text'], x=p[0] + tg.get('dx', -225), y=p[1] + tg.get('dy', -106),
                          at=self.cue(i, tg.get('cue'), 14), size=22, rot=-3))
        ny = self.title_column(i, beat, b, 1298, 246, 72, 79, 190, default_at=6, gap=14) + 62
        self.note(i, beat, b, 1310, ny, 50, 60, swipe=False, max_w=560)

    def beat_chart(self, i, beat, b):
        E = b['elements']
        E.append(dict(t='slide', at=0, grid=True))
        if beat.get('fig'): E.append(dict(t='tag', text=beat['fig'], x=232, y=112, at=7))
        title = beat.get('title')
        if title:
            E.append(dict(t='typed', x=230, y=168, size=72, lh=1.1, font='serif',
                          lines=[dict(text=title if isinstance(title, str) else title[0], at=9)]))
        pe = self.prop_el(beat.get('prop'), 1630, 690, 300, -12, 14)
        if pe: E.append(pe)
        X0, X1, Y0, Y1 = 230, 1690, 360, 840
        series = beat['series']
        vals = [self.series_values(s) for s in series]
        allv = []
        for s, vv in zip(series, vals):
            allv += vv
            for m in s.get('morph', []):
                base = s.get('baseline', 0)
                allv += m['values'] if 'values' in m else [base + (v - base) * m['scale'] for v in vv]
        lo, hi = min(allv), max(allv)
        if beat.get('zero') and lo > 0: lo = 0
        pad = (hi - lo) * 0.06 or 1
        lo, hi = lo - pad, hi + pad
        ymap = lambda v: Y1 - (v - lo) / (hi - lo) * (Y1 - Y0)
        pts_of = lambda vv: [[X0 + (X1 - X0) * q / (len(vv) - 1), ymap(v)] for q, v in enumerate(vv)]
        finals = []
        for n, (s, vv) in enumerate(zip(series, vals)):
            at = max(8, self.cue(i, s.get('cue'), 11 + 22 * n))     # the sheet is still sliding in before frame 8
            style = s.get('style', 'ink')
            pts = pts_of(vv)
            if style == 'highlight':
                lid = self.layer(f'b{i}_s{n}', 'highlight', [pts], pad=60, color=YEL, weight=5.4, reveal=80)
                dur = 21
            elif style == 'dashed':
                lid = self.layer(f'b{i}_s{n}', 'dashed', [pts], color=INK, weight=2.2, dashed=[0], dash=20, gap=13, reveal=60)
                dur = 18
            else:
                lid = self.layer(f'b{i}_s{n}', 'wave', [pts], color=INK, weight=1.9, pen='rotring', reveal=60)
                dur = 13
            morphs = s.get('morph', [])
            m_at = [self.cue(i, m.get('cue'), at + dur + 8 + 6 * q) for q, m in enumerate(morphs)]
            E.append(dict(t='brush', id=lid, **{'from': at, 'to': at + dur}, ease='linear', **({'until': m_at[0]} if morphs else {})))
            last = pts
            base = s.get('baseline', 0)
            for q, m in enumerate(morphs):
                mv = m['values'] if 'values' in m else [base + (v - base) * m['scale'] for v in vv]
                last = pts_of(mv)
                mid = self.layer(f'b{i}_s{n}m{q}', 'wave' if style == 'ink' else style if style != 'dashed' else 'dashed', [last],
                                 color=YEL if style == 'highlight' else INK, weight=5.4 if style == 'highlight' else 1.9, pen='rotring',
                                 reveal=60, pad=60, **({'dashed': [0], 'dash': 20, 'gap': 13} if style == 'dashed' else {}))
                E.append(dict(t='brush', id=mid, **{'from': m_at[q], 'to': m_at[q]}, **({'until': m_at[q + 1]} if q + 1 < len(morphs) else {})))
            finals.append(last)
            if s.get('dots'):
                E.append(dict(t='dots', pts=[[round(p[0], 1), round(p[1], 1)] for p in pts], at=at + dur, r=7, every=1))
            if s.get('label'):
                lb = s['label']; f = lb.get('at', 0.2); p = pts[min(len(pts) - 1, int(f * (len(pts) - 1)))]
                E.append(dict(t='hand', text=lb['text'], x=p[0] - 20, y=p[1] + lb.get('dy', -150), size=52, rot=-5,
                              **{'from': at + 9, 'to': at + 18}))
            if s.get('tag'):
                E.append(dict(t='typed', x=X0 + 2, y=pts[0][1] + 18, size=24, font='elite', cps=3, lines=[dict(text=s['tag'], at=at + 6)]))
        for n, xl in enumerate(beat.get('xlabels', [])):
            xl = xl if isinstance(xl, dict) else dict(text=xl, at=n / max(1, len(beat['xlabels']) - 1))
            E.append(dict(t='typed', x=X0 + (X1 - X0) * xl['at'] - 30, y=Y1 + 26, size=22, font='elite', cps=4, lines=[dict(text=xl['text'], at=12)]))
        n = beat.get('note')
        if n:
            note = self.note(i, beat, b, 1420, 246, 54, 60, swipe=False, max_w=460)
            if n.get('arrow_to'):
                si, f = n['arrow_to']; fp = finals[si]; p = fp[min(len(fp) - 1, int(f * (len(fp) - 1)))]
                self.note_arrow(i, b, note, [p[0] + 12, p[1] - 10], kind='down')

    def series_values(self, s):
        v = s['values']
        if v == 'burst':                       # a burst of oscillation, like a touch signal
            rr = random.Random(s.get('seed', 3)); noise = s.get('noise', 0); out = []
            for q in range(293):
                x = q / 292
                env = math.exp(-((x - 0.5) / 0.171) ** 2)
                out.append(205 * env * math.sin((x - 0.5) * 1460 / 62 * math.pi + 0.6) * (1 + noise * rr.uniform(-1, 1)))
            return out
        return [float(q) for q in v]

    def beat_stat(self, i, beat, b):
        E = b['elements']
        E.append(dict(t='grid', x=1380, y=640, w=460, h=380, rot=1.5))
        poly = [[470, 245], [1450, 212], [1478, 575], [445, 612]]
        E.append(dict(t='brush', id=self.block(f'b{i}_block', poly), **{'from': 0, 'to': 9}, ease='out'))
        pe = self.prop_el(beat.get('prop'), 120, 600, 400, -14, 14)
        if pe: E.append(pe)
        if beat.get('fig'): E.append(dict(t='tag', text=beat['fig'], x=490, y=172, at=4))
        num = beat['number']
        size = min(210, int(1250 / (len(num) * 0.82)))
        at = self.cue(i, beat.get('number_cue'), 6)
        E.append(dict(t='ransom', text=num, x=960, y=410 - size * 0.62, at=at, size=size, align='center'))
        cap = beat.get('caption') or []
        if isinstance(cap, str): cap = [cap]
        if cap:
            E.append(dict(t='typed', x=960, y=660, size=60, lh=1.15, font='serif', align='center',
                          lines=[dict(text=t, at=self.cue(i, (beat.get('caption_cues') or [None] * 9)[q], at + 10 + 14 * q)) for q, t in enumerate(cap)]))
        self.note(i, beat, b, 1150, 880, 64, at + 24, max_w=640)

    def beat_closer(self, i, beat, b):
        name = beat['subject']; c = self.cut[name]
        k = min(1.0, 1180 / c['w'], 900 / c['h'])
        w, h = c['w'] * k, c['h'] * k
        x = max(60, 650 - w / 2) if w < 1100 else 60
        y = H + 30 - h if c.get('touches_bottom') else H - h - 70
        self.cut_scale = c['scale']
        mp = self.place(name, x, y, k)
        E = b['elements']
        poly = [[x + w * 0.042, y + h * 0.07], [x + w * 0.59, y + h * 0.07], [x + w * 0.627, y + h * 0.865], [x + w * 0.017, y + h * 0.92]]
        E.append(dict(t='brush', id=self.block(f'b{i}_block', poly), **{'from': 0, 'to': 8}, ease='out'))
        E.append(self.cutout_el(name, x, y, k, 2))
        E.append(dict(t='sheet', x=1236, y=96, w=720, h=920))
        E.append(dict(t='brush', id=self.ink(f'b{i}_scribble', [zigzag(1316, 744, 1540, 734, 6, 30, i + 9)], 1.7, 54), **{'from': 20, 'to': 30}))
        pe = self.prop_el(beat.get('prop'), 1640, 640, 260, -62, 18)
        if pe: E.append(pe)
        circles = self.annotations(i, beat, b, mp, k, default_at=34)
        lines = beat.get('headline') or []
        cues = beat.get('headline_cues') or [None] * len(lines)
        E.append(dict(t='typed', x=1300, y=214, size=96, lh=1.1, font='serif', cps=3,
                      lines=[dict(text=t, at=self.cue(i, cu, 5 + 14 * q)) for q, (t, cu) in enumerate(zip(lines, cues))]))
        rw = beat.get('ransom')
        if rw:
            size = min(70, int(590 / (len(rw) * 0.95)))
            ry = 214 + 106 * len(lines) + 40
            at = self.cue(i, beat.get('ransom_cue'), 30)
            E.append(dict(t='ransom', text=rw, x=1300, y=ry, at=at, size=size))
            uy = ry + size * 2.14
            ul = self.highlight(f'b{i}_underline', [[[1300, uy], [1580, uy - 6], [1300 + min(575, len(rw) * size * 0.95), uy - 14]]], weight=6.5, reveal=90)
            E.append(dict(t='brush', id=ul, **{'from': at + 10, 'to': at + 20}, ease='outcubic'))
        src = self.sb.get('source')
        if src:
            words, rows, cur = src.split(), [], ''
            for wd in words:
                if len(cur) + len(wd) + 1 > 38 and cur: rows.append(cur); cur = wd
                else: cur = (cur + ' ' + wd).strip()
            rows.append(cur)
            E.append(dict(t='typed', x=1302, y=930, size=17, lh=1.45, font='elite', cps=6, color='muted',
                          lines=[dict(text=('Source: ' if q == 0 else '') + r, at=14 + 6 * q) for q, r in enumerate(rows[:3])]))
        n = beat.get('note')
        if n:
            ref = n.get('under') or next(iter(circles), None)
            if ref is not None and ref in circles:
                (cx, cy), rx, ry = circles[ref]
                nx, ny = cx - 130, cy + ry + 20
            else:
                nx, ny = 600, 900
            self.note(i, beat, b, nx, ny, 60, 42, max_w=520)


def norm(w):
    return re.sub(r"[^a-z0-9%$]", '', w.lower().replace('’', "'"))


def build_scene(sb, cutouts, timing):
    sc = Scene(sb, cutouts, timing)
    scene = sc.build()
    return scene, sc.warn
