/**
 * Walk an Episode's shot list WITHOUT rendering: every shot's `el(t, dur)` returns a React element
 * tree; we read the props of the kit components in it (characters, rigs, captions, labels, cameras)
 * and turn them into an editable layer list for the After Effects build script (emit_jsx.mjs).
 * Anything that is not a native layer (backgrounds, vote boards, FX) comes from the BG / FX render passes.
 */
import React from "react";
import * as K from "../../../../../src/Thanksgiving3/Kit";
import * as E from "../../../../../src/Thanksgiving3/Episode";
import * as VK from "../../../../../src/VP/VKit";
import { mouthAt } from "../../../../../src/Thanksgiving/LayerPuppet";
import VPMETA from "../../../../../src/Thanksgiving3/vp_sprites.json";
import META from "../../../../../src/Thanksgiving3/sprites.json";
import HEADS from "../../../../../src/Thanksgiving3/vp_heads.json";
import RIG from "../../../../../src/Thanksgiving3/rig.json";
import VPRIG from "../../../../../src/VP/vprig.json";

const FPS = 30;
const M = { ...(META as any), ...(VPMETA as any) } as Record<string, number[]>;
const R = { ...(RIG as any), ...(VPRIG as any) } as Record<string, any>;
const HM = HEADS as unknown as Record<string, number[]>;
const pct = (v: string | undefined, d: number, full: number) => ((v === undefined ? d : parseFloat(v)) / 100) * full;
const src = (key: string) => (key.startsWith("OLD/") ? `thanksgiving/${key.slice(4)}.png` : `tg2/${key}.png`);

type Win = [number, number];
const cut = (a: Win, b: Win): Win | null => { const s = Math.max(a[0], b[0]), e = Math.min(a[1], b[1]); return e > s ? [s, e] : null; };

export const walk = (SHOTS: E.Shot[], D: E.EpData) => {
  const out: any = { dur: Math.round((D.dur + 0.6) * FPS), vo: D.vo, cams: [], layers: [], sfx: [], shots: [] };
  let z = 0, camId = 0;
  SHOTS.forEach((shot, si) => {
    const s0 = Math.round(shot.a * FPS);
    const s1 = si + 1 < SHOTS.length ? Math.round(SHOTS[si + 1].a * FPS) : out.dur;
    const len = s1 - s0;
    const t = (sec: number) => Math.round((sec - shot.a) * FPS);
    const tree = shot.el(t, len);
    const shotSfx = (shot.sfx ?? []).map(([f, name, vol]) => ({ f: s0 + f, name, vol: vol ?? 0.15 }));
    out.sfx.push(...shotSfx);
    out.shots.push({ i: si, s0, s1 });
    const auto = (f: number, name: string, vol: number) => {           // AutoSfx: skip when an explicit shot sfx is within ±5 f
      if ((shot.sfx ?? []).some(([g]) => Math.abs(g - f) <= 5)) return;
      if (f >= 0 && f < len) out.sfx.push({ f: s0 + f, name, vol });
    };
    const visit = (node: any, win: Win, cam: number | null) => {
      if (node === null || node === undefined || typeof node === "boolean" || typeof node === "string" || typeof node === "number") return;
      if (Array.isArray(node)) { node.forEach((n) => visit(n, win, cam)); return; }
      if (!React.isValidElement(node)) return;
      const ty: any = node.type, p: any = node.props;
      const span = (at = 0, until?: number) => cut(win, [at, until ?? 1e9]);
      if (ty === React.Fragment || typeof ty === "string") { visit(p.children, win, cam); return; }
      if (ty === E.Svg) { visit(p.children, win, cam); return; }                         // bg -> BG pass
      if (ty === E.Steps) {
        const st: [number, any][] = p.s;
        st.forEach(([a, n], i) => { const w = cut(win, [a, i + 1 < st.length ? st[i + 1][0] : 1e9]); if (w) visit(n, w, cam); });
        return;
      }
      if (ty === E.Swap) { const w1 = cut(win, [-1e9, p.t]), w2 = cut(win, [p.t, 1e9]); if (w1) visit(p.a, w1, cam); if (w2) visit(p.b, w2, cam); return; }
      if (ty === K.Cam) {
        const id = camId++;
        out.cams.push({ id, shot: si, s0, win: [s0 + win[0], s0 + win[1]], dur: p.dur, from: p.from ?? 1, to: p.to ?? 1.045,
          ox: pct(p.ox, 50, 1920), oy: pct(p.oy, 55, 1080), parent: cam,
          punch: p.punch ? { at: s0 + p.punch.at, frames: p.punch.frames, to: p.punch.to, ox: pct(p.punch.ox ?? p.ox, 50, 1920), oy: pct(p.punch.oy ?? p.oy, 55, 1080) } : null });
        visit(p.children, win, id); return;
      }
      if (ty === VK.V || ty === K.Spr || ty === VK.Quill) {
        const w = span(p.at, p.until); if (!w) return;
        const key = ty === VK.V ? `vp/${p.c}/${p.p}` : ty === VK.Quill ? "vp/quill/0_nohead" : p.s;
        const m = M[key]; if (!m) throw new Error(`no sprite ${key}`);
        const L: any = { z: z++, kind: "spr", name: key.replace(/^vp\//, ""), file: src(key), meta: m, x: p.x, y: p.y, h: p.h, flip: !!p.flip, shot: si, s0,
          win: [s0 + w[0], s0 + w[1]], at: s0 + (p.at ?? 0), enter: p.enter ?? null, drop: p.drop ?? null, walk: p.walk ?? 0, shake: p.shake ?? 0, cam };
        if (ty === VK.Quill) {
          const e = p.e ?? 0, hs = VK.HEAD.quill;
          L.heads = [hs[e], hs[1]].map((h) => ({ file: `tg2/vp/quill/${h}.png`, rect: HM[`vp/quill/0|${h}`], wh: M[`vp/quill/${h}`].slice(2, 4) }));
          L.open = [];
          if (p.talk) for (let f = w[0]; f < w[1]; f++) L.open.push(mouthAt(f, D.env, shot.a).open ? 1 : 0);
          L.openFrom = s0 + w[0];
        }
        out.layers.push(L);
        if (p.enter) auto(p.at ?? 0, "whoosh", 0.1);
        if (p.drop) auto((p.at ?? 0) + p.drop.frames - 1, "thud", 0.12);
        return;
      }
      if (ty === K.Quill) {                                                                // the original mascot: pose sprites, beak swap
        const w = span(p.at, p.until); if (!w) return;
        const talkable = ["speaking_facing_right", "deadpan_wings_folded", "nervous_side_glance", "scoreboard_facing_left", "pardon_plea"].includes(p.pose);
        const key = talkable ? `Poses/quill/${p.pose}__closed` : `Poses/quill/${p.pose}`;
        const L: any = { z: z++, kind: "spr", name: `quill/${p.pose}`, file: src(key), meta: M[key], x: p.x, y: p.y, h: p.h, flip: !!p.flip, shot: si, s0,
          win: [s0 + w[0], s0 + w[1]], at: s0 + (p.at ?? 0), enter: p.enter ?? null, drop: null, walk: 0, shake: 0, cam };
        if (talkable && p.talk) {
          L.alt = { file: src(`Poses/quill/${p.pose}__open`), open: [] as number[], from: s0 + w[0] };
          for (let f = w[0]; f < w[1]; f++) L.alt.open.push(mouthAt(f, D.env, shot.a).open ? 1 : 0);
        }
        out.layers.push(L);
        if (p.enter) auto(p.at ?? 0, "whoosh", 0.1);
        return;
      }
      if (ty === VK.Act) {                                                                 // rigged body + expression-head timeline
        const w = span(p.at, p.until); if (!w) return;
        const c = p.c, key = `vp_${c}/0`, r = R[key], m = M[`vp/${c}/0`];
        const seed = Math.abs(Math.round(p.x * 7 + p.y * 3)) % 97;
        const exAt = (f: number) => { const e = p.e ?? 0; if (typeof e === "number") return e; let x = e[0][1]; for (const [tt, v] of e) if (f >= tt) x = v; return x; };
        const heads: Record<string, number[]> = {};
        for (let f = w[0]; f < w[1]; f++) {
          const ex = exAt(f);
          const talking = p.talk === true || (Array.isArray(p.talk) && f >= p.talk[0] && f < p.talk[1]);
          const open = talking && mouthAt(f, D.env, shot.a).open;
          const h = VK.HEAD[c][open ? 1 : talking && ex === 1 ? 0 : ex];
          const blink = !open && M[`vp/${c}/${h}__blink`] && (f + seed * 3) % (96 + (seed % 41)) < 3;
          const hk = `${h}${blink ? "__blink" : ""}`;
          (heads[hk] ??= []).push(s0 + f);
        }
        out.layers.push({ z: z++, kind: r ? "rig" : "spr", name: `${c} (actor)`, file: src(`vp/${c}/0_nohead`), meta: m, rig: r ? { ...r, body: { ...r.body, file: r.bodyNoHead ?? r.body.file } } : null,
          x: p.x, y: p.y, h: p.h, flip: !!p.flip, shot: si, s0, win: [s0 + w[0], s0 + w[1]], at: s0 + (p.at ?? 0), walk: p.walk ?? 0,
          walkUntil: p.walkUntil === undefined ? null : s0 + p.walkUntil, enter: p.enter ?? null, cam, seed,
          actorHeads: Object.entries(heads).map(([hk, frames]) => ({ file: `tg2/vp/${c}/${hk}.png`, rect: HM[`vp/${c}/0|${hk.replace("__blink", "")}`], wh: M[`vp/${c}/${hk}`].slice(2, 4), frames })) });
        if (p.enter) auto(p.at ?? 0, "whoosh", 0.1);
        return;
      }
      if (ty === K.Rig) {
        const w = span(p.at, p.until); if (!w) return;
        const key = `${p.c}/${p.pose}`, sk = p.c.startsWith("vp_") ? `vp/${p.c.slice(3)}/${p.pose}` : `Poses/${key}`;
        const r = R[key], m = M[sk];
        out.layers.push({ z: z++, kind: r ? "rig" : "spr", name: key, file: src(sk), meta: m, rig: r ?? null, x: p.x, y: p.y, h: p.h, flip: !!p.flip, shot: si, s0,
          win: [s0 + w[0], s0 + w[1]], at: s0 + (p.at ?? 0), walk: p.walk ?? 0, walkUntil: p.walkUntil === undefined ? null : s0 + p.walkUntil, enter: p.enter ?? null, cam });
        if (p.enter) auto(p.at ?? 0, "whoosh", 0.1);
        return;
      }
      if (ty === K.Cap) {
        const w = span(p.at, p.until);
        if ((p.at ?? 0) >= win[0] && (p.at ?? 0) < win[1]) out.sfx.push({ f: s0 + (p.at ?? 0), name: "pop", vol: 0.06 });
        if (w) out.layers.push({ z: z++, kind: "cap", text: p.text, pos: p.pos ?? "bottom", size: p.size ?? 78, win: [s0 + w[0], s0 + w[1]], cam: null });
        return;
      }
      if (ty === K.Card) {
        const w = span(p.at, p.until);
        if ((p.at ?? 0) >= win[0] && (p.at ?? 0) < win[1]) out.sfx.push({ f: s0 + (p.at ?? 0), name: "whoosh", vol: 0.12 });
        if (w) out.layers.push({ z: z++, kind: "card", text: p.text, sub: p.sub ?? "", win: [s0 + w[0], s0 + w[1]], cam: null });
        return;
      }
      if (ty === VK.Label) {
        const w = span(p.at); if (!w) return;
        auto(p.at ?? 0, "pop", 0.08);
        out.layers.push({ z: z++, kind: "label", text: p.text, x: p.x, y: p.y, to: p.to ?? null, size: p.size ?? 48, color: p.color ?? "#fff",
          at: s0 + (p.at ?? 0), win: [s0 + w[0], s0 + w[1]], cam });
        return;
      }
      if (ty === VK.Big || ty === K.PopIn) { if ((p.at ?? 0) >= win[0]) auto(p.at ?? 0, "pop", 0.08); return; }   // drawn in FX pass
      // any other component (graphics, FX): rendered by the FX pass
    };
    visit(tree, [0, len], null);
  });
  out.sfx.sort((a: any, b: any) => a.f - b.f);
  return out;
};
