"""Beat layouts for the editorial, popart, cinematic and retro styles.

Mixed into layout.Scene. Each beat_* method fills b['elements'] with engine elements (see engine/src/fx.tsx).
Screen coordinates are 1920x1080 px; times are frames relative to the beat start. Captions use a small
markup (see references/styles.md): *hl*  !accent!  +accent2+  ~strike~  _muted_  ^big^  and  /  for a line break.
"""
import math, re

W, H, FPS = 1920, 1080, 30

# Per-style defaults: how cut-outs are tinted, caption fonts, how things arrive.
STY = {
    'vox':       dict(filter=None,    cap_font='serif',      cap_anim='type', num_font='anton', anim='pop',  label_bg='accent2', label_color='ink',    label_font='elite',   small='elite'),
    'editorial': dict(filter=None,    cap_font='playfair',   cap_anim='up',   num_font='anton', anim='pop',  label_bg='dark',    label_color='light',  label_font='courier', small='courier'),
    'popart':    dict(filter='gray',  cap_font='anton',      cap_anim='slam', num_font='anton', anim='pop',  label_bg='accent2', label_color='ink',    label_font='anton',   small='courier'),
    'cinematic': dict(filter='dim',   cap_font='montserrat', cap_anim='blur', num_font='montserrat', anim='rise', label_bg='accent2', label_color='dark', label_font='montserrat', small='montserrat'),
    'retro':     dict(filter='sepia', cap_font='jakarta',    cap_anim='up',   num_font='jakarta', anim='rise', label_bg='accent2', label_color='accent', label_font='jakarta', small='jakarta'),
}

MARKS = {'*': 'hl', '!': 'accent', '+': 'accent2', '~': 'strike', '_': 'muted', '^': 'big'}


def norm(w):
    return re.sub(r"[^a-z0-9%$]", '', w.lower().replace('’', "'"))


class StyleBeats:
    # ------------------------------------------------------------ helpers
    @property
    def sty(self):
        return STY.get(self.style, STY['vox'])

    def life(self, b):
        return b['end'] - b['start']

    def fit(self, name, maxw, maxh, up=1.6):
        if name not in self.cut:
            raise SystemExit(f'no cut-out named "{name}" (run: vox.py cutout <project> {name} <image> ...)')
        c = self.cut[name]
        k = min(up, maxw / c['w'], maxh / c['h'])
        return c, k, c['w'] * k, c['h'] * k

    def pic(self, name, x, y, k, at, anim=None, **kw):
        c = self.cut[name]
        el = dict(t='pic', src=f'img/{c["file"]}', x=round(x, 1), y=round(y, 1), w=round(c['w'] * k, 1), h=round(c['h'] * k, 1),
                  at=at, anim=anim or self.sty['anim'], filter=kw.pop('filter', self.sty['filter']))
        el.update({k2: v for k2, v in kw.items() if v is not None})
        return el

    def word_frame(self, i, idx):
        a, _b = self.word_ranges[i]
        w = self.timing['words'][min(a + idx, len(self.timing['words']) - 1)]
        return 4 + round(w['s'] * FPS) - self.beats_t[i][0]

    def words(self, i, text, default_at=6, gap=3, cue=None):
        """Caption markup -> word list with times. Words that appear in the beat's spoken line land on that word."""
        if text is None: return []
        line = [norm(w) for w in self.sb['beats'][i]['line'].split()]
        start = self.cue(i, cue, default_at) if cue is not None else None
        out, cur, ptr, last = [], None, 0, None
        for tok in str(text).split():
            if tok == '/':
                out.append(dict(br=True)); continue
            st = None
            if tok[0] in MARKS and len(tok) > 1:
                cur = MARKS[tok[0]]; tok = tok[1:]
            st = cur
            closing = tok[-1] in MARKS and len(tok) > 1 and MARKS[tok[-1]] == cur
            if closing: tok = tok[:-1]
            if len(tok) > 1 and tok[-1] in '.,;:' and tok[-2] in MARKS and MARKS[tok[-2]] == cur:   # "*up*." style
                tok = tok[:-2] + tok[-1]; closing = True
            at = None
            n = norm(tok)
            if start is None and n:
                for j in range(ptr, len(line)):
                    if line[j] == n or (len(n) > 3 and line[j].startswith(n)):
                        at = self.word_frame(i, j) - 2; ptr = j + 1; break
            if at is None:
                at = (last + gap) if last is not None else (start if start is not None else default_at)
            last = at
            w = dict(text=tok, at=max(0, at))
            if st: w['st'] = st
            out.append(w)
            if closing: cur = None
        return out

    def caption(self, i, text, x, y, size, cue=None, default_at=6, **kw):
        if not text: return None
        el = dict(t='caption', x=round(x), y=round(y), size=size, font=kw.pop('font', self.sty['cap_font']), anim=kw.pop('anim', self.sty['cap_anim']),
                  words=self.words(i, text, default_at, kw.pop('gap', 3), cue))
        el.update({k: v for k, v in kw.items() if v is not None})
        return el

    def screen_pt(self, beat, ref, mapper=None):
        if isinstance(ref, (list, tuple)) and mapper is None: return list(ref)
        if mapper is None: raise SystemExit(f'point "{ref}" needs an image to map onto')
        return self.point(beat, ref, mapper)

    def props(self, i, beat, b, key='props', default_at=8):
        out = []
        for n, p in enumerate(beat.get(key, [])):
            if p['name'] not in self.cut:
                self.warn.append(f'prop "{p["name"]}" has no cut-out; skipped'); continue
            c, k, w, h = self.fit(p['name'], p.get('size', 260), p.get('size', 260), up=3)
            cx, cy = p.get('at', [300 + 300 * n, 300])
            out.append(self.pic(p['name'], cx - w / 2, cy - h / 2, k, self.cue(i, p.get('cue'), default_at + 3 * n), p.get('anim', 'pop'),
                                rot=p.get('rot', 0), drift=p.get('drift', {'y': -30, 'r': 8}), life=self.life(b), shadow=p.get('shadow')))
        return out

    def shapes(self, i, beat, b, mapper=None):
        out = []
        for n, s in enumerate(beat.get('shapes', [])):
            p = self.screen_pt(beat, s.get('at', [960, 540]), mapper if isinstance(s.get('at'), str) else None)
            el = dict(t='shape', kind=s.get('kind', 'circle'), x=p[0], y=p[1], r=s.get('r', 220), color=s.get('color', 'accent'),
                      at=self.cue(i, s.get('cue'), 2 + 2 * n), anim=s.get('anim', 'grow'), life=self.life(b))
            for k2 in ('w', 'h', 'rot', 'thick', 'opacity', 'drift', 'pulse', 'angle', 'radius'):
                if k2 in s: el[k2] = s[k2]
            out.append(el)
        return out

    def label_el(self, i, lb, x, y, default_at):
        size = lb.get('size', 44)
        return dict(t='label', text=lb['text'], x=lb.get('x', x), y=lb.get('y', y), size=size, w=round(len(lb['text']) * size * 0.62 + size * 0.9),
                    at=self.cue(i, lb.get('cue'), default_at), bg=lb.get('bg', self.sty['label_bg']), color=lb.get('color', self.sty['label_color']),
                    font=lb.get('font', self.sty['label_font']), rot=lb.get('rot', 0))

    # ------------------------------------------------------------ hero: a subject on a shape plate, with words
    def beat_hero(self, i, beat, b):
        E, life, st = b['elements'], self.life(b), self.sty
        side = beat.get('side', 'center' if self.style in ('cinematic', 'popart') else 'right')
        name = beat['subject']
        c, k, w, h = self.fit(name, 980 if side != 'center' else 1150, beat.get('max_h', 960))
        cx = beat.get('x', {'right': 1330, 'left': 590, 'center': 960}[side])
        x = cx - w / 2
        y = H + 12 - h if c.get('touches_bottom') else (H - h) / 2 + 40
        self.cut_scale = c['scale']
        mp = self.place(name, x, y, k)
        pl = beat.get('plate')
        if pl:
            p = self.point(beat, pl['at'], mp) if pl.get('at') else [x + w / 2, y + h * 0.5]
            el = dict(t='shape', kind=pl.get('kind', 'circle'), x=p[0] + pl.get('dx', 0), y=p[1] + pl.get('dy', 0), r=pl.get('r', max(w, h) * 0.42),
                      color=pl.get('color', 'accent' if self.style != 'cinematic' else 'dark'), at=self.cue(i, pl.get('cue'), 2), anim=pl.get('anim', 'grow'),
                      drift=pl.get('drift', {'s': 0.04}), life=life)
            for k2 in ('thick', 'w', 'h', 'opacity', 'pulse'):
                if k2 in pl: el[k2] = pl[k2]
            E.append(el)
            if pl.get('streaks'):
                E.append(dict(el, kind='streaks', color='dark', opacity=0.5, at=el['at'] + 4))
        E.extend(self.shapes(i, beat, b, mp))
        if beat.get('rays'):
            r = beat['rays'] if isinstance(beat['rays'], dict) else {}
            p = self.point(beat, r['at'], mp) if r.get('at') else [x + w / 2, y + h * 0.45]
            E.append(dict(t='rays', x=p[0], y=p[1], r0=r.get('r0', max(w, h) * 0.45), r1=r.get('r1', 520), n=r.get('n', 18),
                          at=self.cue(i, r.get('cue'), 4), color=r.get('color', 'accent3'), spin=r.get('spin', 14), life=life))
        E.extend([p for p in self.props(i, beat, b, 'back_props')])
        # words: behind the subject (depth sandwich) or in a column beside it
        behind = beat.get('behind', side == 'center')
        cap = beat.get('caption')
        size = beat.get('caption_size', 110 if side == 'center' else 92)
        if side == 'center':
            cel = self.caption(i, cap, 60, beat.get('caption_y', 110), size, beat.get('caption_cue'), w=1800, align='center')
        elif side == 'right':
            cel = self.caption(i, cap, 110, beat.get('caption_y', 300), size, beat.get('caption_cue'), w=max(600, x - 60))
        else:
            cel = self.caption(i, cap, x + w + 40, beat.get('caption_y', 300), size, beat.get('caption_cue'), w=W - (x + w) - 120)
        num = beat.get('number')
        nel = None
        if num:
            nsize = num.get('size', 170)
            nel = dict(t='counter', x=num.get('x', cx if side == 'center' else 110 if side == 'right' else x + w + 40), y=num.get('y', 150),
                       size=nsize, align='center' if side == 'center' else 'left', font=num.get('font', st['num_font']),
                       from_=None, to=num['to'], at=self.cue(i, num.get('cue'), 8), dur=num.get('dur', 20), prefix=num.get('prefix', ''),
                       suffix=num.get('suffix', ''), color=num.get('color', 'accent' if self.style == 'cinematic' else 'ink'),
                       glow=num.get('glow', 'accent' if self.style == 'cinematic' else None), assemble=num.get('assemble', self.style == 'cinematic'))
            nel['from'] = num.get('from', num['to'] if nel['assemble'] else 0); nel.pop('from_')
        if behind:
            if cel: E.append(cel)
            if nel: E.append(nel)
        sub = self.pic(name, x, y, k, self.cue(i, beat.get('subject_cue'), 0), beat.get('anim'), drift=beat.get('drift', {'s': 0.03}), life=life,
                       echo=beat.get('echo'), filter=beat.get('filter', st['filter']))
        E.append(sub)
        E.extend(self.props(i, beat, b))
        if not behind:
            if cel: E.append(cel)
            if nel: E.append(nel)
        if beat.get('label'):
            lx = 110 if side == 'right' else (x + w + 40 if side == 'left' else 760)
            ly = (cel['y'] + size * 1.2 * (1 + sum(1 for wd in cel['words'] if wd.get('br')))) if cel else 700
            E.append(self.label_el(i, beat['label'], lx, ly + 20, 20))
        if beat.get('pill'):
            pi = beat['pill']
            E.append(dict(t='pill', text=pi['text'], x=pi.get('x', 140), y=pi.get('y', 300), w=pi.get('w', 140 + len(pi['text']) * 26), h=pi.get('h', 70),
                          at=self.cue(i, pi.get('cue'), 10), **({'out': self.cue(i, pi['out_cue'], life)} if pi.get('out_cue') else {})))
        if beat.get('darken'):
            b['bg_to'] = 'dark'; b['bg_at'] = self.cue(i, beat['darken'], 0)

    # ------------------------------------------------------------ counter: a rolling number with editorial furniture
    def beat_counter(self, i, beat, b):
        E, st = b['elements'], self.sty
        num = beat['number']
        size = num.get('size', 190)
        cs = beat.get('caption_size', 76)
        cap = self.caption(i, beat.get('caption'), 160, 0, cs, beat.get('caption_cue'), w=1600, align='center')
        cap_h = (1 + sum(1 for w in cap['words'] if w.get('br'))) * cs * 1.1 + 36 if cap else 0
        total = cap_h + (52 if beat.get('label') else 0) + size + (200 if beat.get('progress') else 0)
        top = max(70, (H - total) / 2 - 20)
        if cap:
            cap['y'] = round(top); E.append(cap)
            top += cap_h
        if beat.get('label'):
            E.append(dict(t='typed', x=960, y=top, size=22, font=st['small'], cps=4, align='center', color='muted', lines=[dict(text=beat['label'].upper(), at=4)]))
            top += 52
        E.append(dict(t='counter', x=960, y=top, size=size, align='center', font=num.get('font', st['num_font']), **{'from': num.get('from', 0)}, to=num['to'],
                      at=self.cue(i, num.get('cue'), 6), dur=num.get('dur', 30), prefix=num.get('prefix', ''), suffix=num.get('suffix', ''),
                      rate=num.get('rate'), color=num.get('color', 'ink'), ease=num.get('ease', 'out'), dec=num.get('dec', 0),
                      glow=num.get('glow'), assemble=num.get('assemble', False), anim=num.get('anim', 'pop')))
        if beat.get('icon'):
            c, k, w, h = self.fit(beat['icon'], 380, 320, up=2)
            E.append(self.pic(beat['icon'], 330 - w / 2, top + size * 0.5 - h / 2 + 40, k, self.cue(i, beat.get('icon_cue'), 10), 'pop'))
        pr = beat.get('progress')
        py = top + size + 120
        if pr:
            E.append(dict(t='progress', x=320, y=py, w=1280, show=self.cue(i, pr.get('show'), 2), at=self.cue(i, pr.get('cue'), 6),
                          to=self.cue(i, pr.get('to'), self.life(b)), fill=pr.get('fill', 0.3), left=pr.get('left', 'NOW'), right=pr.get('right', 'END')))
        sp = beat.get('stamp')
        if sp:
            at = self.cue(i, sp.get('cue'), 20)
            sx, sy = sp.get('x', 1380), sp.get('y', py - 150 if pr else top + size + 30)
            E.append(dict(t='stamp', text=sp['text'], sub=sp.get('sub'), x=sx, y=sy, size=sp.get('size', 52), at=at, rot=sp.get('rot', -4)))
            if pr and sp.get('arrow', True):
                E.append(dict(t='leader', pts=[[sx - 16, sy + 50], [sx - 80, sy + 95], [sx - 130, sy + 120], [1585, py - 4]], at=at + 6, dur=8, color='accent', width=4))

    # ------------------------------------------------------------ flip: split-flap / odometer year
    def beat_flip(self, i, beat, b):
        E, st = b['elements'], self.sty
        if beat.get('caption'):
            E.append(self.caption(i, beat['caption'], 160, 150, beat.get('caption_size', 70), beat.get('caption_cue'), w=1600, align='center'))
        y = beat.get('y', 400)
        if beat.get('label'):
            E.append(dict(t='typed', x=960, y=y - 60, size=30, font=st['small'], cps=4, align='center', lines=[dict(text=beat['label'], at=2)]))
        E.append(dict(t='flip', x=960, y=y, size=beat.get('size', 200), **{'from': beat['from']}, to=beat['to'], at=self.cue(i, beat.get('cue'), 2), dur=beat.get('dur', 22)))
        if beat.get('note'):
            E.append(self.caption(i, beat['note'], 160, y + beat.get('size', 200) * 1.3, 54, beat.get('note_cue'), w=1600, align='center'))

    # ------------------------------------------------------------ stacks: things dropping into rows, slam headline, optional unit chart
    def beat_stacks(self, i, beat, b):
        E, life = b['elements'], self.life(b)
        n, rows = beat.get('count', 8), beat.get('rows', 1)
        name = beat['prop']
        cw = 1560 / n
        c, k, w, h = self.fit(name, cw * 0.92, 340, up=3)
        cue = self.cue(i, beat.get('cue'), 4)
        un = beat.get('units')
        u_at = self.cue(i, un.get('cue'), life // 2) if un else None
        for r in range(rows):
            for q in range(n):
                x = 180 + q * cw + (cw - w) / 2 + (cw * 0.12 if r % 2 else 0) * 0
                y = 990 - h - r * h * 0.62
                el = self.pic(name, x, y, k, cue + (r * n + q) * 2, 'drop', filter=None, shadow=True)
                if un: el['out'] = dict(at=u_at - 2, dur=8, s=-0.5, y=-120, fade=True); el['until'] = u_at + 8
                E.append(el)
        hl = beat.get('headline')
        if hl:
            cap = self.caption(i, hl, 60, beat.get('headline_y', 90), beat.get('headline_size', 150), beat.get('headline_cue'), w=1800, align='center',
                               font='anton', anim='slam', gap=2)
            if un: cap['out'] = u_at
            E.append(cap)
        if un:
            E.append(dict(t='units', x=220, y=330, w=1480, h=650, cols=un.get('cols', 22), rows=un.get('rows', 6), at=u_at, highlight=un.get('highlight'),
                          hl_at=self.cue(i, un.get('highlight_cue'), u_at + 24), bills=dict(**{'from': [960, 700]}, at=u_at + 4) if un.get('bills', True) else None))
            if un.get('headline'):
                E.append(self.caption(i, un['headline'], 60, 90, beat.get('headline_size', 150), None, u_at + 6, w=1800, align='center', font='anton', anim='slam', gap=2))
            if un.get('caption'):
                E.append(self.caption(i, un['caption'], 60, 270, 48, un.get('caption_cue'), u_at + 14, w=1800, align='center'))

    # ------------------------------------------------------------ bars: ranked bars, one promoted to the top
    def beat_bars(self, i, beat, b):
        E = b['elements']
        if beat.get('caption'):
            E.append(self.caption(i, beat['caption'], 260, 110, beat.get('caption_size', 66), beat.get('caption_cue'), w=1500))
        items = beat['items']
        vmax = max(it['value'] for it in items)
        y0, step, bh = beat.get('y', 330), 112, 78
        cue = self.cue(i, beat.get('cue'), 8)
        pro = beat.get('promote')
        p_at = self.cue(i, pro.get('cue'), cue + 30) if pro else None
        hi = next((q for q, it in enumerate(items) if it.get('highlight')), None)
        for q, it in enumerate(items):
            el = dict(t='bar', key=q, x=260, y=y0 + q * step, h=bh, w=1300 * it['value'] / vmax, label=it['label'].upper(), at=cue + q * 5, dur=12,
                      color=it.get('color', 'accent' if q == hi else 'ink'))
            if pro and hi is not None:
                new = 0 if q == hi else q + (1 if q < hi else 0)
                if new != q: el['move'] = dict(at=p_at, y=y0 + new * step)
            E.append(el)
        if hi is not None and beat.get('stamp'):
            sp = beat['stamp']; yy = y0 if pro else y0 + hi * step
            E.append(dict(t='stamp', text=sp['text'], x=260 + 1300 * items[hi]['value'] / vmax - 120, y=yy - 46, size=sp.get('size', 40),
                          at=self.cue(i, sp.get('cue'), (p_at or cue) + 12), rot=-6, bg='accent2', color='ink'))

    # ------------------------------------------------------------ linechart: crisp axes, a line that grows with a riding tag
    def beat_linechart(self, i, beat, b):
        E, st = b['elements'], self.sty
        X0, X1, Y0, Y1 = 260, 1640, 330, 860
        if beat.get('caption'):
            E.append(self.caption(i, beat['caption'], 260, 120, beat.get('caption_size', 66), beat.get('caption_cue'), w=1400))
        vals = [float(v) for v in beat['values']]
        lo, hi = (min(vals + [0]) if beat.get('zero', True) else min(vals)), max(vals + ([beat['ref']['value']] if beat.get('ref') else []))
        hi += (hi - lo) * 0.08
        ym = lambda v: Y1 - (v - lo) / (hi - lo) * (Y1 - Y0)
        pts = [[round(X0 + (X1 - X0) * q / (len(vals) - 1), 1), round(ym(v), 1)] for q, v in enumerate(vals)]
        E.append(dict(t='line', pts=[[X0, Y0 - 20], [X0, Y1], [X1 + 30, Y1]], **{'from': 2, 'to': 12}, color='ink', width=3, ease='out'))
        for n, xl in enumerate(beat.get('xlabels', [])):
            xl = xl if isinstance(xl, dict) else dict(text=xl, at=n / max(1, len(beat['xlabels']) - 1))
            E.append(dict(t='typed', x=X0 + (X1 - X0) * xl['at'] - 30, y=Y1 + 22, size=22, font=st['small'], cps=4, color='muted', lines=[dict(text=str(xl['text']), at=10)]))
        for yl in beat.get('ylabels', []):
            E.append(dict(t='typed', x=X0 - 20 - len(str(yl['text'])) * 14, y=ym(yl['value']) - 14, size=22, font=st['small'], cps=4, color='muted', lines=[dict(text=str(yl['text']), at=10)]))
        if beat.get('ref'):
            rf = beat['ref']; yy = ym(rf['value'])
            E.append(dict(t='line', pts=[[X0, yy], [X1, yy]], **{'from': self.cue(i, rf.get('cue'), 14), 'to': self.cue(i, rf.get('cue'), 14) + 10}, color='muted', width=3, dashed=True))
            E.append(dict(t='typed', x=X0 + 14, y=yy - 34, size=22, font=st['small'], cps=4, color='muted', lines=[dict(text=rf['text'], at=self.cue(i, rf.get('cue'), 14) + 4)]))
        at = self.cue(i, beat.get('cue'), 14)
        dur = beat.get('dur', 40)
        tag = beat.get('tag')
        E.append(dict(t='line', pts=pts, **{'from': at, 'to': at + dur}, color=beat.get('color', 'accent'), width=6, dot=True,
                      tag=dict(**{'from': tag['from']}, to=tag['to'], prefix=tag.get('prefix', ''), suffix=tag.get('suffix', '')) if tag else None))
        for ev in beat.get('events', []):
            q = ev['at']; p = pts[min(len(pts) - 1, round(q * (len(pts) - 1)))]
            eat = at + round(dur * q)
            E.append(dict(t='line', pts=[[p[0], p[1] - 16], [p[0], p[1] - 110]], **{'from': eat, 'to': eat + 5}, color='ink', width=2))
            E.append(dict(t='typed', x=p[0] - len(ev['text']) * 7, y=p[1] - 146, size=20, font=st['small'], cps=5, lines=[dict(text=ev['text'].upper(), at=eat + 3)]))
        if beat.get('stamp'):
            sp = beat['stamp']
            E.append(dict(t='stamp', text=sp['text'], x=sp.get('x', X1 - 300), y=sp.get('y', Y0 - 40), size=sp.get('size', 44), at=self.cue(i, sp.get('cue'), at + dur), rot=-4))

    # ------------------------------------------------------------ callouts: an image with leader-line labels
    def beat_callouts(self, i, beat, b):
        E, life = b['elements'], self.life(b)
        b.setdefault('cam', beat.get('cam', {'push': 0.07, 'rot': 2}))
        mp = None
        if beat.get('photo'):           # a full-bleed picture in public/ (points are screen px)
            E.append(dict(t='pic', src=beat['photo'], x=0, y=0, w=W, h=H, fit='cover', at=0, anim=beat.get('anim', 'blur'), filter=beat.get('filter', self.sty['filter']), shadow=False))
        else:
            name = beat['image']
            c, k, w, h = self.fit(name, 1500, 900)
            x, y = (W - w) / 2, (H - h) / 2 + 30
            self.cut_scale = c['scale']
            mp = self.place(name, x, y, k)
            E.extend(self.shapes(i, beat, b, mp))
            E.append(self.pic(name, x, y, k, 0, beat.get('anim', 'pop')))
        for n, lb in enumerate(beat.get('labels', [])):
            p = self.screen_pt(beat, lb['at'], mp if isinstance(lb['at'], str) or mp else None)
            dx, dy = lb.get('dx', -220 if p[0] > 960 else 220), lb.get('dy', -120)
            at = self.cue(i, lb.get('cue'), 10 + 14 * n)
            elbow = [p[0] + dx * 0.25, p[1] + dy]
            end = [p[0] + dx, p[1] + dy]
            E.append(dict(t='leader', pts=[p, elbow, end], at=at, dur=8, color=lb.get('line', 'ink'), width=3.5, dot=True))
            size = lb.get('size', 44)
            wbox = len(lb['text']) * size * 0.62 + size * 0.9
            lx = end[0] if dx > 0 else end[0] - wbox
            E.append(self.label_el(i, dict(lb, size=size, cue=None), lx, end[1] - size * 0.78, at + 6))
        if beat.get('caption'):
            E.append(self.caption(i, beat['caption'], 160, beat.get('caption_y', 80), beat.get('caption_size', 72), beat.get('caption_cue'), w=1600, align='center'))

    # ------------------------------------------------------------ split: colour panel with stacked words + a photo
    def beat_split(self, i, beat, b):
        E = b['elements']
        side = beat.get('side', 'left')
        pw = round(W * beat.get('panel_w', 0.42))
        px = 0 if side == 'left' else W - pw
        E.append(dict(t='panel', x=px - 200 if side == 'left' else px, y=-200, w=pw + 200, h=H + 400, color=beat.get('panel', 'accent'), at=0,
                      anim='left' if side == 'left' else 'right'))
        if beat.get('photo'):
            E.append(dict(t='pic', src=beat['photo'], x=pw if side == 'left' else 0, y=0, w=W - pw, h=H, fit='cover', at=2, anim='fade', filter=beat.get('filter', self.sty['filter']), shadow=False))
        elif beat.get('subject'):
            c, k, w, h = self.fit(beat['subject'], W - pw - 60, 1000)
            x = (pw + (W - pw - w) / 2) if side == 'left' else (W - pw - w) / 2
            y = H + 10 - h if c.get('touches_bottom') else (H - h) / 2
            E.append(self.pic(beat['subject'], x, y, k, 2, beat.get('anim', 'right' if side == 'left' else 'left'), drift={'s': 0.04}, life=self.life(b)))
        size = beat.get('caption_size', 84)
        E.append(self.caption(i, beat['caption'], px + 90, beat.get('caption_y', 380), size, beat.get('caption_cue'), w=pw - 160, color=beat.get('text', 'light'), lh=1.05))

    # ------------------------------------------------------------ pan: a wide scene tracking sideways with parallax
    def beat_pan(self, i, beat, b):
        E, life = b['elements'], self.life(b)
        ground = beat.get('ground_y', 980)
        dist = beat.get('pan', 520)
        E.extend(self.shapes(i, beat, b))
        name = beat['scene']
        c, k, w, h = self.fit(name, 6000, beat.get('height', 620), up=3)
        x0 = beat.get('x', 1920 - w + dist if w > 1920 else (1920 - w) / 2 + dist / 2)
        E.append(self.pic(name, x0, ground - h + 6, k, 0, beat.get('anim', 'up'), drift={'x': -dist}, life=life, shadow=False))
        E.append(dict(t='panel', x=-200, y=ground, w=W + 400, h=H - ground + 200, color=beat.get('ground', '#B8B49C'), at=0, anim='none'))
        mv = beat.get('mover')
        if mv:
            c2, k2, w2, h2 = self.fit(mv['name'], mv.get('size', 420), mv.get('size', 420), up=3)
            at = self.cue(i, mv.get('cue'), 0)
            E.append(self.pic(mv['name'], -w2 - 40, ground - h2 + mv.get('dy', 14), k2, at, 'none', drift={'x': W + w2 + 200}, life=max(10, life - at), shadow=False))
        if beat.get('number'):
            num = beat['number']
            E.append(dict(t='counter', x=num.get('x', 1500), y=num.get('y', 150), size=num.get('size', 110), align='left', font=self.sty['num_font'],
                          **{'from': num.get('from', 0)}, to=num['to'], at=self.cue(i, num.get('cue'), 8), dur=num.get('dur', 18), sep=False, color=num.get('color', 'ink')))
        if beat.get('caption'):
            E.append(self.caption(i, beat['caption'], 120, beat.get('caption_y', 120), beat.get('caption_size', 84), beat.get('caption_cue'), w=1200))
        if beat.get('label'):
            E.append(self.label_el(i, beat['label'], beat['label'].get('x', 700), beat['label'].get('y', 600), 20))
        E.extend(self.props(i, beat, b))

    # ------------------------------------------------------------ burst: popart head that splits open over rays
    def beat_burst(self, i, beat, b):
        E, life = b['elements'], self.life(b)
        b.setdefault('cam', beat.get('cam', {'push': 0.1, 'tilt': [10, -12, 4, -4]}))
        name = beat['subject']
        c, k, w, h = self.fit(name, beat.get('size', 640), beat.get('size', 640), up=2.5)
        x, y = (W - w) / 2, (H - h) / 2 + 20
        split = self.cue(i, beat.get('split'), life // 3)
        E.append(dict(t='rays', x=W / 2, y=H / 2 + 20, r0=max(w, h) * 0.42, r1=beat.get('rays_len', 620), n=beat.get('rays', 20), at=self.cue(i, beat.get('rays_cue'), 3),
                      color='accent3', spin=16, life=life, thick=18))
        E.append(dict(t='slice', src=f'img/{c["file"]}', x=x, y=y, w=w, h=h, at=0, split=split, bands=beat.get('bands', 3), gap=beat.get('gap', 140),
                      cuts=beat.get('cuts'), filter=beat.get('filter', 'gray'), drift={'s': 0.05}, life=life))
        for p in self.props(i, beat, b, default_at=split + 2):
            E.append(p)
        if beat.get('caption'):
            E.append(self.caption(i, beat['caption'], 60, beat.get('caption_y', 860), beat.get('caption_size', 110), beat.get('caption_cue'), w=1800, align='center'))

    # ------------------------------------------------------------ tunnel: dark board, frames rushing past, subject with an echo trail
    def beat_tunnel(self, i, beat, b):
        E, life = b['elements'], self.life(b)
        b['dark'] = True
        b.setdefault('cam', beat.get('cam', {'push': 0.06}))
        E.append(dict(t='frames', x=W / 2, y=H / 2 + 40, n=beat.get('frames', 5), at=0, color='light', speed=beat.get('speed', 0.02)))
        E.extend(self.shapes(i, beat, b))
        name = beat['subject']
        c, k, w, h = self.fit(name, 1100, 900)
        x = (W - w) / 2
        y = H + 12 - h if c.get('touches_bottom') else (H - h) / 2 + 40
        E.append(self.pic(name, x, y, k, 0, beat.get('anim', 'fade'), echo=beat.get('echo', dict(n=7, dx=120, **{'from': 0}, to=self.cue(i, beat.get('echo_cue'), 18))),
                          drift={'s': 0.04}, life=life))
        E.extend(self.props(i, beat, b))
        if beat.get('caption'):
            E.append(self.caption(i, beat['caption'], 70, beat.get('caption_y', 470), beat.get('caption_size', 26), beat.get('caption_cue'), w=420,
                                  font='courier', anim='fade', color='light'))

    # ------------------------------------------------------------ extras shared by every beat type
    def fx_extras(self, i, beat, b):
        """'fx': raw engine elements in screen px (an escape hatch). 'cue' becomes 'at'; 'cutout' fills src/w/h."""
        for raw in beat.get('fx', []):
            el = dict(raw)
            if 'cue' in el: el['at'] = self.cue(i, el.pop('cue'), 0)
            if 'cutout' in el:
                c = self.cut[el.pop('cutout')]; s = el.pop('scale', 1.0)
                el.setdefault('t', 'pic'); el['src'] = f'img/{c["file"]}'; el.setdefault('w', c['w'] * s); el.setdefault('h', c['h'] * s)
                el.setdefault('filter', self.sty['filter'])
            if el.get('t') == 'caption' and isinstance(el.get('text'), str):
                el['words'] = self.words(i, el.pop('text'), el.get('at', 6))
                el.setdefault('font', self.sty['cap_font']); el.setdefault('anim', self.sty['cap_anim'])
            el.setdefault('life', self.life(b))
            b['elements'].append(el)

    def style_sfx(self):
        for bi, b in enumerate(self.beats):
            s = b['start']; pops = 0
            en = b.get('enter')
            if en and en.get('type') in ('glitch', 'zoom', 'shape', 'iris', 'blur', 'slide') and bi:
                self.sfx.append(['slide', max(0, s - 3), 16, 0.45])
            for el in b['elements']:
                t = el.get('t')
                if t == 'pic' and pops < 3 and el.get('anim') in ('pop', 'drop', 'slam', 'grow'):
                    self.sfx.append(['slap', s + el['at'], 10, 0.3]); pops += 1
                elif t == 'pic' and el.get('anim') in ('rise', 'left', 'right', 'top') and pops < 3:
                    self.sfx.append(['slide', s + el['at'], 14, 0.3]); pops += 1
                elif t in ('counter', 'flip', 'label'):
                    self.sfx.append(['type', s + el['at'], 14, 0.16])
                elif t == 'stamp':
                    self.sfx.append(['slap', s + el['at'], 10, 0.35])
                elif t == 'panel' and el.get('anim') in ('left', 'right'):
                    self.sfx.append(['slide', s + el['at'], 14, 0.35])
