import * as THREE from "three";
import { clamp, fmt, hash, OTHER_COLOR, RAMP } from "../lib/utils.js";

/* ───────────────────────── 3D engine (three.js, no React inside) ───────────────────────── */
const Y_SPAN = 150;
export default class Engine {
  constructor(host, labelHost, cb) {
    this.host = host; this.labelHost = labelHost; this.cb = cb;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const el = this.el = this.renderer.domElement; el.tabIndex = 0;
    el.setAttribute("role", "img"); el.setAttribute("aria-label", "3D map of artists. Use the search box to reach any artist from the keyboard.");
    host.appendChild(el);
    this.scene = new THREE.Scene(); this.scene.fog = new THREE.Fog(0, 100, 1000);
    this.camera = new THREE.PerspectiveCamera(50, 1, 1, 8000); this.scene.add(this.camera);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8fb0, .78));
    const sun = new THREE.DirectionalLight(0xffffff, .5); sun.position.set(-1, 1.6, 1.2); this.camera.add(sun);
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.view = { theta: .6, phi: 1.25, dist: 900, target: new THREE.Vector3() };
    this.goal = { theta: .6, phi: 1.25, dist: 600, target: new THREE.Vector3() };
    this.spin = !this.reduced; this.follow = -1; this.hover = -1; this.selected = -1;
    this.hiNodes = new Set(); this.hiEdges = new Set(); this.style = { sizeBy: "listeners", colorBy: "genre", heightBy: "none" };
    this.posCache = new Map(); this.alpha = 0; this.dirty = true; this.fitted = false;
    this.bgC = new THREE.Color(); this.inkC = new THREE.Color(); this.tmpC = new THREE.Color(); this.v = new THREE.Vector3();
    const ringMat = () => new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, depthTest: false, transparent: true, fog: false });
    this.selRing = new THREE.Mesh(new THREE.RingGeometry(1.3, 1.5, 56), ringMat()); this.hovRing = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.36, 56), ringMat());
    this.hovRing.material.opacity = .7; this.selRing.renderOrder = this.hovRing.renderOrder = 5; this.selRing.visible = this.hovRing.visible = false;
    this.scene.add(this.selRing, this.hovRing);
    this.tubeMat = new THREE.MeshBasicMaterial(); this.tubes = null; this.guide = new THREE.Group(); this.scene.add(this.guide); this.axisMarks = [];
    this.labels = []; for (let i = 0; i < 46; i++) { const d = document.createElement("div"); d.className = "lbl"; d.style.display = "none"; labelHost.appendChild(d); this.labels.push({ d, id: null, cls: "" }); }
    this.readTheme(); this.bind(); this.resize();
    this.loop = this.loop.bind(this); this.raf = requestAnimationFrame(this.loop);
  }
  readTheme() {
    const cs = getComputedStyle(document.documentElement), g = n => cs.getPropertyValue(n).trim();
    this.bgC.set(g("--bg") || "#0f1530"); this.inkC.set(g("--ink") || "#ece7d8");
    this.edgeC = { member: this.inkC.clone(), shared: this.inkC.clone(), guest: new THREE.Color(g("--edge-guest") || "#ffb627"), collab: new THREE.Color(g("--edge-collab") || "#5ad1e6") };
    this.scene.background = this.bgC; this.scene.fog.color.copy(this.bgC);
    this.selRing.material.color.copy(this.inkC); this.hovRing.material.color.copy(this.inkC);
    if (this.g) { this.paint(); this.buildGuide(); } this.dirty = true;
  }
  bind() {
    const el = this.el, P = new Map(); let down = null, pinch = 0, hoverQueued = null;
    const xy = e => { const r = el.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    this.onDown = e => { el.setPointerCapture(e.pointerId); const [x, y] = xy(e); P.set(e.pointerId, { x, y }); down = { x, y, t: performance.now(), moved: false, pan: e.button === 2 || e.shiftKey }; pinch = 0; if (this.spin) { this.spin = false; this.cb.onSpin(false); } this.touched = true; };
    this.onMove = e => {
      const [x, y] = xy(e), p = P.get(e.pointerId);
      if (!p) { if (e.pointerType !== "touch") { hoverQueued = [x, y]; this.hoverAt = hoverQueued; } return; }
      const dx = x - p.x, dy = y - p.y; p.x = x; p.y = y;
      if (down && Math.hypot(x - down.x, y - down.y) > 5) down.moved = true;
      if (P.size === 1) { if (down && down.pan) this.pan(dx, dy); else { this.goal.theta += dx * .0055; this.goal.phi = clamp(this.goal.phi - dy * .0055, .08, Math.PI - .08); } }
      else if (P.size === 2) { const a = [...P.values()], d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); if (pinch) this.goal.dist = clamp(this.goal.dist * pinch / d, 25, 4000); pinch = d; this.pan(dx / 2, dy / 2); if (down) down.moved = true; }
      this.dirty = true;
    };
    this.onUp = e => { const had = P.size; P.delete(e.pointerId); pinch = 0; if (had === 1 && down && !down.moved && performance.now() - down.t < 500) { const i = this.pick(down.x, down.y); this.cb.onSelect(i >= 0 ? this.g.nodes[i].id : null); } if (!P.size) down = null; };
    this.onWheel = e => { e.preventDefault(); this.touched = true; this.goal.dist = clamp(this.goal.dist * Math.exp(e.deltaY * (e.ctrlKey ? .01 : .0012)), 25, 4000); this.dirty = true; };
    this.onLeave = () => { this.hoverAt = null; this.setHover(-1); };
    el.addEventListener("pointerdown", this.onDown); el.addEventListener("pointermove", this.onMove); el.addEventListener("pointerup", this.onUp); el.addEventListener("pointercancel", this.onUp);
    el.addEventListener("pointerleave", this.onLeave); el.addEventListener("wheel", this.onWheel, { passive: false }); el.addEventListener("contextmenu", e => e.preventDefault());
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(this.host);
    this.mo = new MutationObserver(() => this.readTheme()); this.mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class", "style"] });
    this.mq = window.matchMedia("(prefers-color-scheme: dark)"); this.onScheme = () => this.readTheme(); this.mq.addEventListener && this.mq.addEventListener("change", this.onScheme);
  }
  setInsets(left, right) { this.goalOff = this.w > 820 ? (right - left) / 2 : 0; if (this.reduced) { this.off = this.goalOff; this.applyOffset(); } this.dirty = true; }
  applyOffset() { const o = Math.round(this.off || 0); if (o) this.camera.setViewOffset(this.w, this.h, o, 0, this.w, this.h); else this.camera.clearViewOffset(); }
  pan(dx, dy) { const m = this.camera.matrix.elements, k = this.view.dist * .0013; this.follow = -1; this.goal.target.x += (-dx * m[0] + dy * m[4]) * k; this.goal.target.y += (-dx * m[1] + dy * m[5]) * k; this.goal.target.z += (-dx * m[2] + dy * m[6]) * k; }
  resize() { const w = this.host.clientWidth || 1, h = this.host.clientHeight || 1; this.w = w; this.h = h; this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.applyOffset(); this.camera.updateProjectionMatrix(); this.dirty = true; }

  /* graph in, buffers out */
  setGraph(g) {
    if (this.g) this.g.nodes.forEach((n, i) => { if (i < this.g.nSim) this.posCache.set(n.id, [this.pos[i * 3], this.pos[i * 3 + 1], this.pos[i * 3 + 2]]); });
    [this.bandMesh, this.musoMesh, this.lines].forEach(o => { if (o) { this.scene.remove(o); o.geometry.dispose(); o.material.dispose(); } });
    this.g = g; const n = g.nodes.length, G = Math.max(1, g.ds.genres.length);
    this.pos = new Float32Array(n * 3); this.vel = new Float32Array(n * 3); this.rad = new Float32Array(n); this.base = new Float32Array(n * 3); this.ty = new Float32Array(n); this.moonDir = new Float32Array(n * 3);
    let fresh = 0;
    for (let i = 0; i < g.nSim; i++) {
      const a = g.nodes[i], c = this.posCache.get(a.id);
      if (c) { this.pos.set(c, i * 3); continue; } fresh++;
      const ang = a.gi / G * Math.PI * 2, h = hash(a.id);
      this.pos[i * 3] = Math.cos(ang) * 150 + (h[0] - .5) * 130; this.pos[i * 3 + 1] = (h[1] - .5) * 160; this.pos[i * 3 + 2] = Math.sin(ang) * 150 + (h[2] - .5) * 130;
    }
    const perParent = new Map();
    for (let i = g.nSim; i < n; i++) { const p = g.moonOf[i]; perParent.set(p, (perParent.get(p) || 0) + 1); }
    const seenMoon = new Map();
    for (let i = g.nSim; i < n; i++) { const p = g.moonOf[i], k = seenMoon.get(p) || 0, m = perParent.get(p); seenMoon.set(p, k + 1);
      const yy = m === 1 ? 0 : 1 - (k + .5) * 2 / m, rr = Math.sqrt(1 - yy * yy), th = k * 2.399963 + hash(g.nodes[p].id)[0] * 6.28;
      this.moonDir[i * 3] = Math.cos(th) * rr; this.moonDir[i * 3 + 1] = yy; this.moonDir[i * 3 + 2] = Math.sin(th) * rr; }
    /* instanced meshes: spheres for bands, octahedra for musicians */
    this.inst = new Int32Array(n); const bi = [], mi = [];
    g.nodes.forEach((a, i) => { if (a.type === "band") { this.inst[i] = bi.length; bi.push(i); } else { this.inst[i] = mi.length; mi.push(i); } });
    const mk = (geo, count, flat) => { if (!count) return null; const m = new THREE.InstancedMesh(geo, new THREE.MeshLambertMaterial(), count); m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3); m.frustumCulled = false; this.scene.add(m); return m; };
    this.bandMesh = mk(new THREE.SphereGeometry(1, 22, 16), bi.length, false); this.musoMesh = mk(new THREE.OctahedronGeometry(1.15, 0), mi.length, true);
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(g.links.length * 6), 3)); geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(g.links.length * 6), 3));
    this.lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: .62 })); this.lines.frustumCulled = false; this.scene.add(this.lines);
    /* link bookkeeping for the simulation */
    this.deg = new Float32Array(n); this.simLinks = g.links.filter(l => l.s < g.nSim && l.t < g.nSim); this.simLinks.forEach(l => { this.deg[l.s]++; this.deg[l.t]++; });
    this.hover = -1; this.follow = -1; this.applyStyle(this.style, true);
    const share = fresh / Math.max(1, g.nSim); this.alpha = share > .5 ? 1 : share > 0 ? .45 : .25;
    if (share > .5) { for (let k = 0; k < (this.reduced ? 300 : 30); k++) this.tick(); }
    if (!this.fitted || share > .5) { this.fit(!this.fitted); this.fitted = true; }
    this.dirty = true;
  }
  fit(intro) { let r = 60; for (let i = 0; i < this.g.nSim; i++) r = Math.max(r, Math.hypot(this.pos[i * 3], this.pos[i * 3 + 1], this.pos[i * 3 + 2])); this.extent = r; this.goal.dist = r * 2.5 * Math.max(1, .95 * this.h / this.w); this.goal.target.set(0, 0, 0); this.follow = -1; if (intro && !this.reduced) this.view.dist = this.goal.dist * 1.6; if (this.reduced) this.view.dist = this.goal.dist; }
  resetView() { this.fit(false); this.goal.phi = 1.25; this.dirty = true; }

  applyStyle(style, keepAlpha) {
    this.style = style; const g = this.g; if (!g) return; const ds = g.ds, n = g.nodes.length;
    const metric = a => Math.log10(Math.max(1, a[style.sizeBy] || 0));
    const range = pred => { let lo = Infinity, hi = -Infinity; g.nodes.forEach(a => { if (pred(a)) { const v = metric(a); if (v < lo) lo = v; if (v > hi) hi = v; } }); return [lo, hi > lo ? hi : lo + 1]; };
    const rb = range(a => a.type === "band"), rm = range(a => a.type !== "band");
    const lis = a => Math.log10(Math.max(1, a.listeners)); let ll = Infinity, lh = -Infinity; g.nodes.forEach(a => { const v = lis(a); if (v < ll) ll = v; if (v > lh) lh = v; }); if (!(lh > ll)) lh = ll + 1; this.lisRange = [ll, lh];
    const c = this.tmpC, c0 = new THREE.Color(RAMP[0]), c1 = new THREE.Color(RAMP[1]), c2 = new THREE.Color(RAMP[2]);
    const ramp = t => { t = clamp(t, 0, 1); return t < .5 ? c.copy(c0).lerp(c1, t * 2) : c.copy(c1).lerp(c2, t * 2 - 2 + 1); };
    const yr = a => a.year ? (a.year - ds.yearMin) / Math.max(1, ds.yearMax - ds.yearMin) : .5;
    for (let i = 0; i < n; i++) {
      const a = g.nodes[i], band = a.type === "band", r = band ? rb : rm, t = clamp((metric(a) - r[0]) / (r[1] - r[0]), 0, 1);
      this.rad[i] = band ? 2.2 + 13 * Math.pow(t, 1.8) : 1.4 + 3.4 * Math.pow(t, 1.4);
      if (style.colorBy === "genre") c.set(ds.genres[a.gi] ? ds.genres[a.gi].color : OTHER_COLOR); else if (style.colorBy === "year") ramp(yr(a)); else ramp((lis(a) - ll) / (lh - ll));
      this.base[i * 3] = c.r; this.base[i * 3 + 1] = c.g; this.base[i * 3 + 2] = c.b;
      this.ty[i] = style.heightBy === "year" ? (yr(a) - .5) * 2 * Y_SPAN : style.heightBy === "listeners" ? ((lis(a) - ll) / (lh - ll) - .5) * 2 * Y_SPAN : NaN;
    }
    if (!keepAlpha) this.alpha = Math.max(this.alpha, .5);
    this.labelOrder = Array.from({ length: n }, (_, i) => i).filter(i => g.nodes[i].type === "band" || i < g.nSim).sort((a, b) => this.rad[b] - this.rad[a]).slice(0, 90);
    this.paint(); this.buildGuide(); this.dirty = true;
  }
  buildGuide() {
    this.guide.children.slice().forEach(o => { this.guide.remove(o); o.geometry.dispose(); o.material.dispose(); }); this.axisMarks = [];
    const g = this.g, h = this.style.heightBy; if (!g || h === "none") return; const ds = g.ds, marks = [];
    if (h === "year") { const step = ds.yearMax - ds.yearMin > 45 ? 20 : 10; for (let y = Math.ceil(ds.yearMin / step) * step; y <= ds.yearMax; y += step) marks.push({ y: ((y - ds.yearMin) / Math.max(1, ds.yearMax - ds.yearMin) - .5) * 2 * Y_SPAN, text: String(y) }); }
    else { const [lo, hi] = this.lisRange; for (let p = Math.ceil(lo); p <= hi; p++) marks.push({ y: ((p - lo) / (hi - lo) - .5) * 2 * Y_SPAN, text: fmt(Math.pow(10, p)) + " listeners" }); }
    const R = (this.extent || 260) * .95, pts = []; for (let k = 0; k <= 96; k++) pts.push(new THREE.Vector3(Math.cos(k / 96 * 6.2832) * R, 0, Math.sin(k / 96 * 6.2832) * R));
    const col = this.inkC.clone().lerp(this.bgC, .72);
    marks.forEach(m => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: col, fog: false })); l.position.y = m.y; this.guide.add(l); });
    this.axisMarks = marks; this.guideR = R;
  }
  setHighlight(selected, nodes, edges) { this.selected = selected; this.hiNodes = nodes; this.hiEdges = edges; this.paint(); this.dirty = true; }
  paint() {
    const g = this.g; if (!g) return; const n = g.nodes.length, dimOn = this.hiNodes.size > 0, bg = this.bgC;
    const put = (arr, o, r, gg, b, k) => { arr[o] = r + (bg.r - r) * k; arr[o + 1] = gg + (bg.g - gg) * k; arr[o + 2] = b + (bg.b - b) * k; };
    for (let i = 0; i < n; i++) { const m = g.nodes[i].type === "band" ? this.bandMesh : this.musoMesh; put(m.instanceColor.array, this.inst[i] * 3, this.base[i * 3], this.base[i * 3 + 1], this.base[i * 3 + 2], dimOn && !this.hiNodes.has(i) ? .84 : 0); }
    [this.bandMesh, this.musoMesh].forEach(m => { if (m) m.instanceColor.needsUpdate = true; });
    const col = this.lines.geometry.attributes.color.array, fade = { member: .45, shared: .4, guest: .5, collab: .35 };
    this.hideEdge = new Uint8Array(g.links.length);
    g.links.forEach((l, i) => { const c = this.edgeC[l.type] || this.inkC, k = dimOn ? (this.hiEdges.has(i) ? 0 : .93) : fade[l.type]; if (dimOn && (this.hiEdges.has(i) || this.hiNodes.has(l.s) || this.hiNodes.has(l.t))) this.hideEdge[i] = 1; put(col, i * 6, c.r, c.g, c.b, k); put(col, i * 6 + 3, c.r, c.g, c.b, k); });
    this.lines.geometry.attributes.color.needsUpdate = true;
    /* highlighted connections get real thickness */
    if (this.tubes) { this.scene.remove(this.tubes); this.tubes.geometry.dispose(); this.tubes = null; }
    this.tubeList = [...this.hiEdges].slice(0, 500);
    if (this.tubeList.length) { const geo = new THREE.CylinderGeometry(1, 1, 1, 6, 1, true); geo.translate(0, .5, 0); const t = this.tubes = new THREE.InstancedMesh(geo, this.tubeMat, this.tubeList.length); t.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(this.tubeList.length * 3), 3); t.frustumCulled = false;
      this.tubeList.forEach((li, k) => { const c = this.edgeC[g.links[li].type] || this.inkC; t.instanceColor.setXYZ(k, c.r, c.g, c.b); }); this.scene.add(t); }
    const strong = new Set([this.selected]); this.labelHi = [...this.hiNodes].filter(i => i !== this.selected).sort((a, b) => this.rad[b] - this.rad[a]).slice(0, 28); this.strong = strong;
  }
  focus(i) { if (i < 0 || !this.g) return; this.follow = i; let r = 0; const p = this.pos; for (const j of this.g.adj[i]) r = Math.max(r, Math.hypot(p[j * 3] - p[i * 3], p[j * 3 + 1] - p[i * 3 + 1], p[j * 3 + 2] - p[i * 3 + 2])); this.goal.dist = clamp(r * 2.6, Math.max(90, this.rad[i] * 10), 700); this.dirty = true; }
  frame(list) { const p = this.pos, c = new THREE.Vector3(); list.forEach(i => c.add(this.v.set(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]))); c.divideScalar(list.length); let r = 0; list.forEach(i => r = Math.max(r, this.v.set(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]).distanceTo(c))); this.follow = -1; this.goal.target.copy(c); this.goal.dist = clamp(r * 3.1, 120, 1600); this.dirty = true; }
  setSpin(v) { this.spin = v; this.dirty = true; }

  /* force simulation: many-body repulsion, springs, gravity, optional height axis */
  tick() {
    const g = this.g, n = g.nSim, p = this.pos, v = this.vel, a = this.alpha, rad = this.rad;
    for (let i = 0; i < n; i++) { const xi = p[i * 3], yi = p[i * 3 + 1], zi = p[i * 3 + 2], qi = 1 + rad[i] * .16; let fx = 0, fy = 0, fz = 0;
      for (let j = i + 1; j < n; j++) { let dx = p[j * 3] - xi, dy = p[j * 3 + 1] - yi, dz = p[j * 3 + 2] - zi, d2 = dx * dx + dy * dy + dz * dz; if (d2 > 90000) continue; if (d2 < 4) { d2 = 4; dx += .5; }
        const w = -34 * qi * (1 + rad[j] * .16) * a / d2; fx += dx * w; fy += dy * w; fz += dz * w; v[j * 3] -= dx * w; v[j * 3 + 1] -= dy * w; v[j * 3 + 2] -= dz * w; }
      v[i * 3] += fx; v[i * 3 + 1] += fy; v[i * 3 + 2] += fz; }
    const rest = { member: 12, shared: 34, guest: 40, collab: 48 };
    for (const l of this.simLinks) { const s = l.s * 3, t = l.t * 3; let dx = p[t] + v[t] - p[s] - v[s], dy = p[t + 1] + v[t + 1] - p[s + 1] - v[s + 1], dz = p[t + 2] + v[t + 2] - p[s + 2] - v[s + 2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1, ds = this.deg[l.s], dt = this.deg[l.t], k = (d - (rest[l.type] + rad[l.s] + rad[l.t])) / d * a * (l.type === "member" ? 1 : .3) / Math.min(ds, dt), b = ds / (ds + dt);
      dx *= k; dy *= k; dz *= k; v[t] -= dx * b; v[t + 1] -= dy * b; v[t + 2] -= dz * b; v[s] += dx * (1 - b); v[s + 1] += dy * (1 - b); v[s + 2] += dz * (1 - b); }
    /* bands of one genre lean towards their shared centre, so scenes read as regions */
    const G = g.ds.genres.length, cx = new Float32Array(G * 4);
    for (let i = 0; i < n; i++) { const k = g.nodes[i].gi * 4; cx[k] += p[i * 3]; cx[k + 1] += p[i * 3 + 1]; cx[k + 2] += p[i * 3 + 2]; cx[k + 3]++; }
    for (let i = 0; i < n; i++) { const k = g.nodes[i].gi * 4, c = cx[k + 3], w = .05 * a; if (c < 2) continue; v[i * 3] += (cx[k] / c - p[i * 3]) * w; v[i * 3 + 2] += (cx[k + 2] / c - p[i * 3 + 2]) * w; if (isNaN(this.ty[i])) v[i * 3 + 1] += (cx[k + 1] / c - p[i * 3 + 1]) * w; }
    const grav = .04 * a;
    for (let i = 0; i < n; i++) { const o = i * 3; v[o] -= p[o] * grav; v[o + 2] -= p[o + 2] * grav; v[o + 1] += isNaN(this.ty[i]) ? -p[o + 1] * grav : (this.ty[i] - p[o + 1]) * .16 * a;
      v[o] *= .6; v[o + 1] *= .6; v[o + 2] *= .6; p[o] += v[o]; p[o + 1] += v[o + 1]; p[o + 2] += v[o + 2]; }
    this.alpha += (0 - this.alpha) * .0228; if (this.alpha < .002) { this.alpha = 0; if (!this.touched && this.selected < 0) this.fit(false); let r = 60; for (let i = 0; i < n; i++) r = Math.max(r, Math.hypot(p[i * 3], p[i * 3 + 2])); if (Math.abs(r - (this.extent || 0)) > 20) { this.extent = r; this.buildGuide(); } }
  }
  syncBuffers() {
    const g = this.g, n = g.nodes.length, p = this.pos, rad = this.rad, dimOn = this.hiNodes.size > 0;
    for (let i = g.nSim; i < n; i++) { const q = g.moonOf[i], d = rad[q] + 4 + rad[i] * 1.6; p[i * 3] = p[q * 3] + this.moonDir[i * 3] * d; p[i * 3 + 1] = p[q * 3 + 1] + this.moonDir[i * 3 + 1] * d; p[i * 3 + 2] = p[q * 3 + 2] + this.moonDir[i * 3 + 2] * d; }
    for (let i = 0; i < n; i++) { const m = g.nodes[i].type === "band" ? this.bandMesh : this.musoMesh, e = m.instanceMatrix.array, o = this.inst[i] * 16, s = dimOn && !this.hiNodes.has(i) ? rad[i] * .5 : rad[i];
      e[o] = s; e[o + 1] = 0; e[o + 2] = 0; e[o + 3] = 0; e[o + 4] = 0; e[o + 5] = s; e[o + 6] = 0; e[o + 7] = 0; e[o + 8] = 0; e[o + 9] = 0; e[o + 10] = s; e[o + 11] = 0; e[o + 12] = p[i * 3]; e[o + 13] = p[i * 3 + 1]; e[o + 14] = p[i * 3 + 2]; e[o + 15] = 1; }
    [this.bandMesh, this.musoMesh].forEach(m => { if (m) m.instanceMatrix.needsUpdate = true; });
    const lp = this.lines.geometry.attributes.position.array; g.links.forEach((l, i) => { if (this.hideEdge[i]) { lp[i * 6 + 3] = lp[i * 6] = 0; lp[i * 6 + 4] = lp[i * 6 + 1] = 0; lp[i * 6 + 5] = lp[i * 6 + 2] = 0; return; } lp[i * 6] = p[l.s * 3]; lp[i * 6 + 1] = p[l.s * 3 + 1]; lp[i * 6 + 2] = p[l.s * 3 + 2]; lp[i * 6 + 3] = p[l.t * 3]; lp[i * 6 + 4] = p[l.t * 3 + 1]; lp[i * 6 + 5] = p[l.t * 3 + 2]; });
    this.lines.geometry.attributes.position.needsUpdate = true;
    if (this.tubes) { const up = new THREE.Vector3(0, 1, 0), dir = new THREE.Vector3(), q = new THREE.Quaternion(), M = new THREE.Matrix4(), S = new THREE.Vector3(), O = new THREE.Vector3();
      this.tubeList.forEach((li, k) => { const l = g.links[li]; O.set(p[l.s * 3], p[l.s * 3 + 1], p[l.s * 3 + 2]); dir.set(p[l.t * 3], p[l.t * 3 + 1], p[l.t * 3 + 2]).sub(O); const len = dir.length() || 1; q.setFromUnitVectors(up, dir.divideScalar(len)); const w = Math.max(.3, this.view.dist * .0028) * (1 + Math.min(4, l.weight) * .12); S.set(w, len, w); M.compose(O, q, S); this.tubes.setMatrixAt(k, M); }); this.tubes.instanceMatrix.needsUpdate = true; }
  }
  pick(x, y) {
    const g = this.g; if (!g) return -1; const cam = this.camera, o = cam.position, d = this.v.set(x / this.w * 2 - 1, -(y / this.h) * 2 + 1, .5).unproject(cam).sub(o).normalize(), p = this.pos; let best = -1, bt = Infinity; const dimOn = this.hiNodes.size > 0;
    for (let i = 0; i < g.nodes.length; i++) { const cx = p[i * 3] - o.x, cy = p[i * 3 + 1] - o.y, cz = p[i * 3 + 2] - o.z, t = cx * d.x + cy * d.y + cz * d.z; if (t < 0) continue; const r = Math.max(this.rad[i] * 1.15, t * .007), m2 = cx * cx + cy * cy + cz * cz - t * t; if (m2 > r * r) continue; const tt = t - Math.sqrt(r * r - m2) + (dimOn && !this.hiNodes.has(i) ? 40 : 0); if (tt < bt) { bt = tt; best = i; } }
    return best;
  }
  setHover(i) { if (i === this.hover) return; this.hover = i; this.el.style.cursor = i >= 0 ? "pointer" : "grab"; this.dirty = true; }

  loop() {
    this.raf = requestAnimationFrame(this.loop); const g = this.g; if (!g) return;
    let moved = false;
    if (this.alpha > 0) { const t0 = performance.now(); do { this.tick(); } while (this.alpha > 0 && performance.now() - t0 < 9 && this.alpha > .6); moved = true; }
    if (this.follow >= 0 && this.follow < g.nodes.length) this.goal.target.set(this.pos[this.follow * 3], this.pos[this.follow * 3 + 1], this.pos[this.follow * 3 + 2]);
    if (this.spin) this.goal.theta += .0011;
    const V = this.view, Gl = this.goal, k = this.reduced ? 1 : .14, dT = Gl.theta - V.theta, dP = Gl.phi - V.phi, dD = Gl.dist - V.dist, dX = V.target.distanceTo(Gl.target);
    const dO = (this.goalOff || 0) - (this.off || 0); if (Math.abs(dO) > .5) { this.off = (this.off || 0) + dO * .14; this.applyOffset(); this.dirty = true; }
    const camMoving = Math.abs(dT) > 1e-4 || Math.abs(dP) > 1e-4 || Math.abs(dD) > .05 || dX > .02;
    if (this.hoverAt && !camMoving) { this.setHover(this.pick(this.hoverAt[0], this.hoverAt[1])); this.hoverAt = null; }
    if (!moved && !camMoving && !this.dirty) return;
    V.theta += dT * k; V.phi += dP * k; V.dist += dD * (this.reduced ? 1 : .09); V.target.lerp(Gl.target, k);
    const sp = Math.sin(V.phi); this.camera.position.set(V.target.x + V.dist * sp * Math.sin(V.theta), V.target.y + V.dist * Math.cos(V.phi), V.target.z + V.dist * sp * Math.cos(V.theta)); this.camera.lookAt(V.target); this.camera.updateMatrixWorld();
    this.scene.fog.near = V.dist * .55; this.scene.fog.far = V.dist + (this.extent || 300) * 1.9;
    if (moved || this.dirty || (camMoving && this.tubes)) this.syncBuffers();
    const ring = (mesh, i) => { mesh.visible = i >= 0 && i < g.nodes.length; if (mesh.visible) { mesh.position.set(this.pos[i * 3], this.pos[i * 3 + 1], this.pos[i * 3 + 2]); mesh.quaternion.copy(this.camera.quaternion); mesh.scale.setScalar(this.rad[i] + .6); } };
    ring(this.selRing, this.selected); ring(this.hovRing, this.hover === this.selected ? -1 : this.hover);
    this.renderer.render(this.scene, this.camera); this.drawLabels(); this.dirty = false;
  }
  drawLabels() {
    const g = this.g, cam = this.camera, v = this.v, W = this.w, H = this.h, boxes = [], dimOn = this.hiNodes.size > 0; let used = 0;
    const pxPerUnit = H / 2 / Math.tan(cam.fov * Math.PI / 360);
    const place = (i, cls, text, force) => {
      if (used >= this.labels.length) return; v.set(this.pos[i * 3], this.pos[i * 3 + 1], this.pos[i * 3 + 2]); const dist = v.distanceTo(cam.position); v.project(cam); if (v.z > 1 || v.z < -1) return;
      const x = (v.x * .5 + .5) * W, y = (-v.y * .5 + .5) * H + this.rad[i] * pxPerUnit / dist + 3; if (x < -40 || x > W + 40 || y < 0 || y > H) return;
      const w = text.length * (cls === "strong" ? 8.4 : 6.3) + 8, h = cls === "strong" ? 20 : 15, b = [x - w / 2, y, x + w / 2, y + h];
      if (!force) for (const o of boxes) if (b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]) return; boxes.push(b);
      const L = this.labels[used++]; if (L.id !== text) { L.d.textContent = text; L.id = text; } if (L.cls !== cls) { L.d.className = "lbl " + cls; L.cls = cls; }
      L.d.style.display = ""; L.d.style.opacity = cls ? 1 : clamp(1.15 - (dist - this.scene.fog.near) / (this.scene.fog.far - this.scene.fog.near), .2, 1); L.d.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) translateX(-50%)";
    };
    const done = new Set(), go = (i, cls, force) => { if (i < 0 || i >= g.nodes.length || done.has(i)) return; done.add(i); place(i, cls, g.nodes[i].name, force); };
    go(this.selected, "strong", true); go(this.hover, "strong", true);
    if (dimOn) this.labelHi.forEach(i => go(i, "", false)); else this.labelOrder.forEach(i => { if (used < (W < 700 ? 16 : 34)) go(i, "", false); });
    if (this.axisMarks.length) { const m = cam.matrix.elements, rx = m[0], rz = m[2], n = Math.hypot(rx, rz) || 1; this.axisMarks.forEach(a => { if (used >= this.labels.length) return; v.set(rx / n * this.guideR, a.y, rz / n * this.guideR).project(cam); if (v.z > 1) return; const L = this.labels[used++]; if (L.id !== a.text) { L.d.textContent = a.text; L.id = a.text; } if (L.cls !== "axis") { L.d.className = "lbl axis"; L.cls = "axis"; } L.d.style.display = ""; L.d.style.opacity = 1; L.d.style.transform = "translate(" + ((v.x * .5 + .5) * W + 6).toFixed(1) + "px," + ((-v.y * .5 + .5) * H - 7).toFixed(1) + "px)"; }); }
    for (let k = used; k < this.labels.length; k++) if (this.labels[k].d.style.display !== "none") this.labels[k].d.style.display = "none";
  }
  dispose() { cancelAnimationFrame(this.raf); this.ro.disconnect(); this.mo.disconnect(); this.mq.removeEventListener && this.mq.removeEventListener("change", this.onScheme); this.renderer.dispose(); this.el.remove(); this.labels.forEach(l => l.d.remove()); }
}
