import * as THREE from "three";
import { clamp, hash, OTHER_COLOR } from "../lib/utils.js";

/* ───────────────────────── 3D engine: genres as territories, bands as pins ─────────────────────────
   Same external shape as Engine.js (constructor(host, labelHost, cb), setGraph, applyStyle, setHighlight,
   focus, frame, setSpin, resetView, dispose) so it's a drop-in alternative from React's side. */
const DETAIL = 20; /* -> 8820 low-poly faces, plenty for crisp borders at this scale */
const PIN_MIN_H = 6, PIN_MAX_H = 34, STEM_R = .6, BULB_MIN = 2.4, BULB_MAX = 5.6;
const MIN_D = 300, MAX_D = 1400;
const ARC_TUBE_R = 1.1; /* real 3D thickness — a 1px Line reads as invisible against a busy globe */

/* Deep, cohesive jewel tones for the Deep Space theme — cycles if a dataset ever has more genres. */
const DEEP_SPACE_PALETTE = ["#2b2360", "#123d3a", "#4a1530", "#3a1a4a", "#14264a", "#143a24", "#4a2410", "#2a2e3a", "#451a28", "#4a3510", "#182848", "#253a1a"];

/* Globe themes: how territories/pins/borders are painted, independent of the map's data or the
   app's own light/dark setting. `territoryColors` null means "use the dataset's own genre colours"
   (matches the constellation view's legend); a function generates a theme's own palette instead.
   `pinColor` null means pins pick up whatever colour the territory ended up painted, so a pin
   always reads against its own ground. Arc colours (guest/collab/member) stay tied to the app's
   CSS tokens regardless of theme, so that vocabulary stays constant everywhere. */
const GLOBE_THEMES = {
  spectrum: { label: "Spectrum", territoryColors: null, borderColor: null, pinColor: null, pinLighten: .3 },
  noir: {
    label: "Noir", borderColor: "#fdf3e2", pinColor: "#ffb627", pinLighten: 0,
    territoryColors: (n) => Array.from({ length: n }, (_, i) => new THREE.Color().setHSL(0, 0, n > 1 ? .14 + (i / (n - 1)) * .40 : .3)),
  },
  deepspace: {
    label: "Deep Space", borderColor: "#2e3242", pinColor: null, pinLighten: .5,
    territoryColors: (n) => Array.from({ length: n }, (_, i) => new THREE.Color(DEEP_SPACE_PALETTE[i % DEEP_SPACE_PALETTE.length])),
  },
};

export default class PlanetEngine {
  constructor(host, labelHost, cb) {
    this.host = host; this.labelHost = labelHost; this.cb = cb;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const el = this.el = this.renderer.domElement; el.tabIndex = 0;
    el.setAttribute("role", "img"); el.setAttribute("aria-label", "Planet map: genres as territories, bands as pins. Use the search box to reach any artist from the keyboard.");
    host.appendChild(el);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 1, 4000);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x394066, .85));
    const sun = new THREE.DirectionalLight(0xffffff, .55); sun.position.set(150, 220, 180); this.scene.add(sun);
    this.R = 120;
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.view = { theta: .7, phi: 1.15, dist: 620 }; this.goal = { theta: .7, phi: 1.15, dist: 620 };
    this.spin = !this.reduced; this.hover = -1; this.selectedBand = -1; this.hiEdges = new Set();
    this.style = { sizeBy: "listeners" }; this.globeTheme = "spectrum";
    this._white = new THREE.Color(0xffffff); this.tmpC = new THREE.Color(); this.v = new THREE.Vector3();
    const ringMat = () => new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, depthTest: false, transparent: true, fog: false });
    this.selRing = new THREE.Mesh(new THREE.RingGeometry(1.3, 1.6, 40), ringMat());
    this.hovRing = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.42, 40), ringMat());
    this.hovRing.material.opacity = .7; this.selRing.renderOrder = this.hovRing.renderOrder = 5; this.selRing.visible = this.hovRing.visible = false;
    this.scene.add(this.selRing, this.hovRing);
    this.arcGroup = new THREE.Group(); this.scene.add(this.arcGroup);
    this.labels = []; for (let i = 0; i < 24; i++) { const d = document.createElement("div"); d.className = "lbl"; d.style.display = "none"; labelHost.appendChild(d); this.labels.push({ d, id: null, cls: "" }); }
    this.ds = null; this.terrain = null; this.border = null;
    this.readTheme(); this.bind(); this.resize();
    this.loop = this.loop.bind(this); this.raf = requestAnimationFrame(this.loop);
  }

  readTheme() {
    const cs = getComputedStyle(document.documentElement), g = n => cs.getPropertyValue(n).trim();
    this.bgC = this.bgC || new THREE.Color(); this.inkC = this.inkC || new THREE.Color();
    this.bgC.set(g("--bg") || "#050506"); this.inkC.set(g("--ink") || "#f5f1e6");
    this.scene.background = this.bgC;
    this.applyBorderColor();
    this.memberMat = this.memberMat || new THREE.MeshBasicMaterial({ transparent: true, opacity: .88 });
    this.guestMat = this.guestMat || new THREE.MeshBasicMaterial({ transparent: true, opacity: .88 });
    this.collabMat = this.collabMat || new THREE.MeshBasicMaterial({ transparent: true, opacity: .88 });
    this.memberMat.color.copy(this.inkC); this.guestMat.color.set(g("--edge-guest") || "#ffb627"); this.collabMat.color.set(g("--edge-collab") || "#5ad1e6");
    this.selRing.material.color.copy(this.inkC); this.hovRing.material.color.copy(this.inkC);
    if (this.bandNodes) this.paintPins();
    this.dirty = true;
  }
  /* A globe theme may pin its own border colour (Noir/Deep Space); "Spectrum" leaves it null and
     rides along with the app's own --ink so it still shifts with light/dark like everything else. */
  applyBorderColor() {
    if (!this.borderMat) return;
    const theme = GLOBE_THEMES[this.globeTheme] || GLOBE_THEMES.spectrum;
    if (theme.borderColor) this.borderMat.color.set(theme.borderColor); else this.borderMat.color.copy(this.inkC);
  }
  setGlobeTheme(key) {
    if (!GLOBE_THEMES[key] || key === this.globeTheme) return;
    this.globeTheme = key;
    if (this.terrain) this.paintTerrain();
    if (this.g && this.bandNodes) this.applyStyle(this.style, true);
    this.dirty = true;
  }
  bind() {
    const el = this.el, P = new Map(); let down = null, pinch = 0, hoverQueued = null;
    const xy = e => { const r = el.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    this.onDown = e => { el.setPointerCapture(e.pointerId); const [x, y] = xy(e); P.set(e.pointerId, { x, y }); down = { x, y, t: performance.now(), moved: false }; pinch = 0; if (this.spin) { this.spin = false; this.cb.onSpin(false); } this.touched = true; };
    this.onMove = e => {
      const [x, y] = xy(e), p = P.get(e.pointerId);
      if (!p) { if (e.pointerType !== "touch") { hoverQueued = [x, y]; this.hoverAt = hoverQueued; } return; }
      const dx = x - p.x, dy = y - p.y; p.x = x; p.y = y;
      if (down && Math.hypot(x - down.x, y - down.y) > 5) down.moved = true;
      if (P.size === 1) { this.goal.theta += dx * .0045; this.goal.phi = clamp(this.goal.phi - dy * .0045, .12, Math.PI - .12); }
      else if (P.size === 2) { const a = [...P.values()], d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); if (pinch) this.goal.dist = clamp(this.goal.dist * pinch / d, MIN_D, MAX_D); pinch = d; if (down) down.moved = true; }
      this.dirty = true;
    };
    this.onUp = e => { const had = P.size; P.delete(e.pointerId); pinch = 0; if (had === 1 && down && !down.moved && performance.now() - down.t < 500) { const i = this.pick(down.x, down.y); this.cb.onSelect(i >= 0 ? this.bandNodes[i].id : null); } if (!P.size) down = null; };
    this.onWheel = e => { e.preventDefault(); this.touched = true; this.goal.dist = clamp(this.goal.dist * Math.exp(e.deltaY * (e.ctrlKey ? .01 : .0012)), MIN_D, MAX_D); this.dirty = true; };
    this.onLeave = () => { this.hoverAt = null; this.setHover(-1); };
    el.addEventListener("pointerdown", this.onDown); el.addEventListener("pointermove", this.onMove); el.addEventListener("pointerup", this.onUp); el.addEventListener("pointercancel", this.onUp);
    el.addEventListener("pointerleave", this.onLeave); el.addEventListener("wheel", this.onWheel, { passive: false }); el.addEventListener("contextmenu", e => e.preventDefault());
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(this.host);
    this.mo = new MutationObserver(() => this.readTheme()); this.mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class", "style"] });
    this.mq = window.matchMedia("(prefers-color-scheme: dark)"); this.onScheme = () => this.readTheme(); this.mq.addEventListener && this.mq.addEventListener("change", this.onScheme);
  }
  resize() { const w = this.host.clientWidth || 1, h = this.host.clientHeight || 1; this.w = w; this.h = h; this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.dirty = true; }
  resetView() { this.goal.theta = .7; this.goal.phi = 1.15; this.goal.dist = 620; this.dirty = true; }
  setSpin(v) { this.spin = v; this.dirty = true; }
  setHover(i) { if (i === this.hover) return; this.hover = i; this.el.style.cursor = i >= 0 ? "pointer" : "grab"; this.dirty = true; }

  nearestGenre(dir) { const cap = this.capDir, N = this.N; let best = 0, bd = -Infinity; for (let i = 0; i < N; i++) { const d = dir.dot(cap[i]); if (d > bd) { bd = d; best = i; } } return best; }

  /* Territories: rebuilt only when the dataset itself changes, not on every filter change.
     This three.js version ships IcosahedronGeometry non-indexed, so faces read straight off
     position triplets; shared edges are matched by rounded vertex position, not vertex index.
     Geometry (shape/borders) and colour (the globe theme) are separate on purpose: switching
     themes only needs to repaint, never rebuild ~9k faces from scratch. */
  buildTerrain(ds) {
    if (this.terrain) { this.scene.remove(this.terrain); this.terrain.geometry.dispose(); this.terrain.material.dispose(); }
    if (this.border) { this.scene.remove(this.border); this.border.geometry.dispose(); }
    const genres = ds.genres, N = genres.length, R = this.R;
    this.N = N;
    this.dsGenreColors = genres.map(gr => new THREE.Color(gr.color));
    this.capDir = genres.map((gr, i) => {
      const t = N > 1 ? i / (N - 1) : 0, lat = THREE.MathUtils.lerp(72, -72, t) * Math.PI / 180, lon = i * (2 * Math.PI / N);
      const y = Math.sin(lat), r = Math.cos(lat);
      return new THREE.Vector3(r * Math.cos(lon), y, r * Math.sin(lon)).normalize();
    });

    const geo = new THREE.IcosahedronGeometry(R, DETAIL);
    const pos = geo.attributes.position, faceCount = pos.count / 3;
    const faceOwner = new Int32Array(faceCount), triByGenre = Array.from({ length: N }, () => []);
    const v = new THREE.Vector3();
    for (let f = 0; f < faceCount; f++) {
      const i0 = f * 3, i1 = i0 + 1, i2 = i0 + 2;
      v.set((pos.getX(i0) + pos.getX(i1) + pos.getX(i2)) / 3, (pos.getY(i0) + pos.getY(i1) + pos.getY(i2)) / 3, (pos.getZ(i0) + pos.getZ(i1) + pos.getZ(i2)) / 3).normalize();
      faceOwner[f] = this.nearestGenre(v); triByGenre[faceOwner[f]].push(f);
    }
    geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(pos.count * 3), 3));
    geo.computeVertexNormals();
    this.faceOwner = faceOwner; this.triByGenre = triByGenre;
    this.terrainMat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: .85, metalness: .05 });
    this.terrain = new THREE.Mesh(geo, this.terrainMat); this.scene.add(this.terrain);

    const posKey = i => pos.getX(i).toFixed(3) + "," + pos.getY(i).toFixed(3) + "," + pos.getZ(i).toFixed(3);
    const edgeMap = new Map();
    const addEdge = (i1, i2, f) => { const k1 = posKey(i1), k2 = posKey(i2), k = k1 < k2 ? k1 + "|" + k2 : k2 + "|" + k1; let e = edgeMap.get(k); if (!e) { e = { faces: [], i1, i2 }; edgeMap.set(k, e); } e.faces.push(f); };
    for (let f = 0; f < faceCount; f++) { const i0 = f * 3, i1 = i0 + 1, i2 = i0 + 2; addEdge(i0, i1, f); addEdge(i1, i2, f); addEdge(i2, i0, f); }
    const borderPos = [];
    edgeMap.forEach(e => { if (e.faces.length === 2 && faceOwner[e.faces[0]] !== faceOwner[e.faces[1]]) { const s = 1.004; borderPos.push(pos.getX(e.i1) * s, pos.getY(e.i1) * s, pos.getZ(e.i1) * s, pos.getX(e.i2) * s, pos.getY(e.i2) * s, pos.getZ(e.i2) * s); } });
    const borderGeo = new THREE.BufferGeometry(); borderGeo.setAttribute("position", new THREE.Float32BufferAttribute(borderPos, 3));
    this.borderMat = new THREE.LineBasicMaterial({ transparent: true, opacity: .4 });
    this.border = new THREE.LineSegments(borderGeo, this.borderMat); this.scene.add(this.border);
    this.readTheme();
    this.paintTerrain();
  }
  /* Repaints the territories (and border colour) from the current globe theme, reusing the
     geometry built above. Cheap enough to call on every theme switch. */
  paintTerrain() {
    if (!this.terrain) return;
    const theme = GLOBE_THEMES[this.globeTheme] || GLOBE_THEMES.spectrum;
    this.capColor = theme.territoryColors ? theme.territoryColors(this.N) : this.dsGenreColors;
    const colorsAttr = this.terrain.geometry.attributes.color, colors = colorsAttr.array;
    for (let f = 0; f < this.faceOwner.length; f++) { const c = this.capColor[this.faceOwner[f]]; for (let k = 0; k < 3; k++) { const o = (f * 3 + k) * 3; colors[o] = c.r; colors[o + 1] = c.g; colors[o + 2] = c.b; } }
    colorsAttr.needsUpdate = true; this.originalColors = colors.slice();
    this.applyBorderColor();
    this.dirty = true;
  }

  /* A band's pin sits at a spot within its genre's territory, deterministic from its id so it
     doesn't jump around when filters change (same stability principle as Engine.js's posCache). */
  placeBand(a) {
    for (let k = 0; k < 24; k++) {
      const h = hash(a.id + ":" + k), z = h[0] * 2 - 1, t = h[1] * Math.PI * 2, rr = Math.sqrt(Math.max(0, 1 - z * z));
      const dir = new THREE.Vector3(rr * Math.cos(t), z, rr * Math.sin(t));
      if (this.nearestGenre(dir) === a.gi) return dir;
    }
    const cap = this.capDir[a.gi] || this.capDir[0], h = hash(a.id + ":fallback");
    return cap.clone().add(new THREE.Vector3((h[0] - .5) * .3, (h[1] - .5) * .3, (h[2] - .5) * .3)).normalize();
  }

  setGraph(g) {
    const fresh = g.ds !== this.ds;
    this.g = g;
    if (fresh) { this.ds = g.ds; this.buildTerrain(g.ds); this.resetView(); }
    this.buildPins(g);
    this.applyStyle(this.style, true);
    this.dirty = true;
  }
  buildPins(g) {
    [this.stemMesh, this.bulbMesh].forEach(m => { if (m) { this.scene.remove(m); m.geometry.dispose(); m.material.dispose(); } });
    const bands = [], gIdxToBand = new Map();
    g.nodes.forEach((a, gi) => { if (a.type === "band") { gIdxToBand.set(gi, bands.length); bands.push(a); } });
    this.bandNodes = bands; this.gIdxToBand = gIdxToBand; this.hover = -1;
    const n = bands.length;
    this.pinDir = new Float32Array(n * 3); this.pinH = new Float32Array(n); this.pinR = new Float32Array(n);
    bands.forEach((a, i) => { const d = this.placeBand(a); this.pinDir[i * 3] = d.x; this.pinDir[i * 3 + 1] = d.y; this.pinDir[i * 3 + 2] = d.z; });

    const stemGeo = new THREE.CylinderGeometry(1, 1, 1, 6); stemGeo.translate(0, .5, 0);
    const bulbGeo = new THREE.SphereGeometry(1, 12, 9);
    this.stemMat = new THREE.MeshStandardMaterial({ roughness: .6, metalness: .05 });
    this.bulbMat = new THREE.MeshStandardMaterial({ roughness: .4, metalness: .1 });
    this.stemMesh = n ? new THREE.InstancedMesh(stemGeo, this.stemMat, n) : null;
    this.bulbMesh = n ? new THREE.InstancedMesh(bulbGeo, this.bulbMat, n) : null;
    [this.stemMesh, this.bulbMesh].forEach(m => { if (m) { m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3); m.frustumCulled = false; this.scene.add(m); } });
  }

  applyStyle(style, keepAlpha) {
    this.style = style; const g = this.g; if (!g || !this.bandNodes || !this.capColor) return;
    const bands = this.bandNodes;
    const theme = GLOBE_THEMES[this.globeTheme] || GLOBE_THEMES.spectrum;
    const metric = a => Math.log10(Math.max(1, a[style.sizeBy] || 0));
    let lo = Infinity, hi = -Infinity; bands.forEach(a => { const v = metric(a); if (v < lo) lo = v; if (v > hi) hi = v; }); if (!(hi > lo)) hi = lo + 1;
    this.pinBaseColor = this.pinBaseColor || [];
    for (let i = 0; i < bands.length; i++) {
      const a = bands[i], t = clamp((metric(a) - lo) / (hi - lo), 0, 1);
      this.pinH[i] = PIN_MIN_H + (PIN_MAX_H - PIN_MIN_H) * Math.pow(t, 1.6);
      this.pinR[i] = BULB_MIN + (BULB_MAX - BULB_MIN) * t;
      /* pins pick up whatever colour their territory is actually painted, so they read against
         their own ground under any theme, unless the theme insists on one uniform pin colour */
      const base = theme.pinColor ? this.tmpC.set(theme.pinColor) : (this.capColor[a.gi] || this.tmpC.set(OTHER_COLOR));
      this.pinBaseColor[i] = (this.pinBaseColor[i] || new THREE.Color()).copy(base).lerp(this._white, theme.pinLighten);
    }
    this.topLabels = Array.from({ length: bands.length }, (_, i) => i).sort((a, b) => this.pinR[b] - this.pinR[a]).slice(0, 10);
    this.layoutPins(); this.paintPins(); this.dirty = true;
  }
  /* Filtering: every band already in the highlighted node set (the whole pile, plus every stop
     along each connecting chain) — and, only for a lone pick with nothing to compare against yet,
     generously expanded to anything else reachable from a shared musician (so it still surfaces
     "what else did this member play in", same as it always did). A multi-pick pile skips that
     expansion and shows exactly the real chain, matching how the constellation view already does
     it — otherwise every musician along a long chain would drag in everything they ever played on. */
  computeConnectedBands(nodes, expand) {
    const set = new Set(); if (!this.gIdxToBand || !nodes) return set;
    const g = this.g;
    nodes.forEach(gi => { const bi = this.gIdxToBand.get(gi); if (bi != null) set.add(bi); });
    if (expand && g.adj) {
      nodes.forEach(gi => {
        if (this.gIdxToBand.has(gi) || !g.nodes[gi] || g.nodes[gi].type !== "musician") return;
        (g.adj[gi] || []).forEach(ngi => { const bi = this.gIdxToBand.get(ngi); if (bi != null) set.add(bi); });
      });
    }
    return set;
  }
  layoutPins() {
    if (!this.bandNodes || !this.bandNodes.length) return;
    const R = this.R, up = new THREE.Vector3(0, 1, 0), q = new THREE.Quaternion(), M = new THREE.Matrix4(), S = new THREE.Vector3(), P = new THREE.Vector3();
    const filtering = this.selectedBand >= 0, connected = this.connectedBands || new Set();
    for (let i = 0; i < this.bandNodes.length; i++) {
      if (filtering && !connected.has(i)) { M.makeScale(0, 0, 0); this.stemMesh.setMatrixAt(i, M); this.bulbMesh.setMatrixAt(i, M); continue; }
      const dir = this.v.set(this.pinDir[i * 3], this.pinDir[i * 3 + 1], this.pinDir[i * 3 + 2]);
      const h = this.pinH[i], br = this.pinR[i]; q.setFromUnitVectors(up, dir);
      const stemH = Math.max(1, h - br * .6);
      S.set(STEM_R, stemH, STEM_R); P.copy(dir).multiplyScalar(R); M.compose(P, q, S); this.stemMesh.setMatrixAt(i, M);
      S.set(br, br, br); P.copy(dir).multiplyScalar(R + h); M.compose(P, q, S); this.bulbMesh.setMatrixAt(i, M);
    }
    this.stemMesh.instanceMatrix.needsUpdate = true; this.bulbMesh.instanceMatrix.needsUpdate = true;
  }
  paintPins() {
    const bands = this.bandNodes; if (!bands || !bands.length || !this.pinBaseColor) return;
    for (let i = 0; i < bands.length; i++) {
      const c = this.pinBaseColor[i];
      this.bulbMesh.instanceColor.setXYZ(i, c.r, c.g, c.b); this.stemMesh.instanceColor.setXYZ(i, c.r * .78, c.g * .78, c.b * .78);
    }
    this.bulbMesh.instanceColor.needsUpdate = true; this.stemMesh.instanceColor.needsUpdate = true;
  }

  setHighlight(selected, nodes, edges, expand) {
    this.hiNodes = nodes || new Set(); this.hiEdges = edges || new Set();
    this.selectedBand = this.gIdxToBand && this.gIdxToBand.has(selected) ? this.gIdxToBand.get(selected) : -1;
    this.connectedBands = this.computeConnectedBands(this.hiNodes, expand);
    this.layoutPins(); this.paintPins(); this.buildArcs(); this.dirty = true;
  }
  /* Arcs are precise, unlike the generous pin filter above: walk the real highlighted edges and
     draw straight to another highlighted band where one exists, or — since a member/guest edge
     usually lands on the musician in between rather than the other band — bridge across a shared
     musician when two of its highlighted edges both lead to bands, so a multi-hop pile chain draws
     as one clean arc per real hop instead of two dead ends. */
  buildArcs() {
    this.arcGroup.children.slice().forEach(o => { this.arcGroup.remove(o); o.geometry.dispose(); });
    if (!this.g || !this.hiEdges.size || !this.gIdxToBand) return;
    const g = this.g, R = this.R, apexOf = bi => { const h = this.pinH[bi]; return new THREE.Vector3(this.pinDir[bi * 3], this.pinDir[bi * 3 + 1], this.pinDir[bi * 3 + 2]).multiplyScalar(R + h); };
    const pairs = [], byMusician = new Map();
    this.hiEdges.forEach(li => {
      const l = g.links[li]; if (!l) return;
      const sBand = this.gIdxToBand.get(l.s), tBand = this.gIdxToBand.get(l.t);
      if (sBand != null && tBand != null) { pairs.push([sBand, tBand, l.type]); return; }
      const musGi = sBand == null ? l.s : l.t, bandIdx = sBand == null ? tBand : sBand;
      if (bandIdx == null) return;
      let arr = byMusician.get(musGi); if (!arr) { arr = []; byMusician.set(musGi, arr); }
      arr.push(bandIdx);
    });
    byMusician.forEach(arr => { for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) pairs.push([arr[i], arr[j], "member"]); });
    const drawn = new Set(); let count = 0;
    pairs.forEach(([biA, biB, type]) => {
      if (biA === biB || count >= 200) return;
      const key = biA < biB ? biA + "_" + biB : biB + "_" + biA; if (drawn.has(key)) return; drawn.add(key);
      const a = apexOf(biA), b = apexOf(biB), aDir = a.clone().normalize(), bDir = b.clone().normalize(), ang = aDir.angleTo(bDir);
      const mid = aDir.clone().add(bDir).normalize().multiplyScalar(R + R * (.18 + (ang / Math.PI) * .55));
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const geo = new THREE.TubeGeometry(curve, 24, ARC_TUBE_R, 6, false);
      const mat = type === "guest" ? this.guestMat : type === "collab" ? this.collabMat : this.memberMat;
      this.arcGroup.add(new THREE.Mesh(geo, mat)); count++;
    });
  }

  focus(gi) {
    const bi = this.gIdxToBand && this.gIdxToBand.get(gi); if (bi == null) return;
    const dir = new THREE.Vector3(this.pinDir[bi * 3], this.pinDir[bi * 3 + 1], this.pinDir[bi * 3 + 2]);
    this.goal.phi = Math.acos(clamp(dir.y, -1, 1)); this.goal.theta = Math.atan2(dir.z, dir.x);
    this.goal.dist = clamp(this.goal.dist, MIN_D, 900); this.dirty = true;
  }
  frame(list) {
    if (!list || !list.length || !this.gIdxToBand) return;
    const c = new THREE.Vector3(); let count = 0;
    list.forEach(gi => { const bi = this.gIdxToBand.get(gi); if (bi != null) { c.x += this.pinDir[bi * 3]; c.y += this.pinDir[bi * 3 + 1]; c.z += this.pinDir[bi * 3 + 2]; count++; } });
    if (!count) return; c.divideScalar(count).normalize();
    this.goal.phi = Math.acos(clamp(c.y, -1, 1)); this.goal.theta = Math.atan2(c.z, c.x); this.dirty = true;
  }

  pick(x, y) {
    const bands = this.bandNodes; if (!bands || !bands.length) return -1;
    const cam = this.camera, o = cam.position, d = this.v.set(x / this.w * 2 - 1, -(y / this.h) * 2 + 1, .5).unproject(cam).sub(o).normalize();
    const filtering = this.selectedBand >= 0, connected = this.connectedBands;
    let best = -1, bt = Infinity;
    for (let i = 0; i < bands.length; i++) {
      if (filtering && (!connected || !connected.has(i))) continue;
      const h = this.pinH[i], px = this.pinDir[i * 3] * (this.R + h), py = this.pinDir[i * 3 + 1] * (this.R + h), pz = this.pinDir[i * 3 + 2] * (this.R + h);
      const cx = px - o.x, cy = py - o.y, cz = pz - o.z, t = cx * d.x + cy * d.y + cz * d.z; if (t < 0) continue;
      const r = Math.max(this.pinR[i] * 1.4, t * .008), m2 = cx * cx + cy * cy + cz * cz - t * t; if (m2 > r * r) continue;
      const tt = t - Math.sqrt(r * r - m2); if (tt < bt) { bt = tt; best = i; }
    }
    return best;
  }

  loop() {
    this.raf = requestAnimationFrame(this.loop); if (!this.g) return;
    if (this.spin) this.goal.theta += .0011;
    const V = this.view, Gl = this.goal, k = this.reduced ? 1 : .14, dT = Gl.theta - V.theta, dP = Gl.phi - V.phi, dD = Gl.dist - V.dist;
    const camMoving = Math.abs(dT) > 1e-4 || Math.abs(dP) > 1e-4 || Math.abs(dD) > .05;
    if (this.hoverAt && !camMoving) { this.setHover(this.pick(this.hoverAt[0], this.hoverAt[1])); this.hoverAt = null; }
    if (!camMoving && !this.dirty) return;
    V.theta += dT * k; V.phi += dP * k; V.dist += dD * (this.reduced ? 1 : .09);
    const sp = Math.sin(V.phi);
    this.camera.position.set(V.dist * sp * Math.sin(V.theta), V.dist * Math.cos(V.phi), V.dist * sp * Math.cos(V.theta));
    this.camera.lookAt(0, 0, 0); this.camera.updateMatrixWorld();
    const ring = (mesh, bi) => { mesh.visible = this.bandNodes && bi >= 0 && bi < this.bandNodes.length; if (mesh.visible) { const h = this.pinH[bi]; mesh.position.set(this.pinDir[bi * 3] * (this.R + h), this.pinDir[bi * 3 + 1] * (this.R + h), this.pinDir[bi * 3 + 2] * (this.R + h)); mesh.quaternion.copy(this.camera.quaternion); mesh.scale.setScalar(this.pinR[bi] + 1.4); } };
    ring(this.selRing, this.selectedBand); ring(this.hovRing, this.hover === this.selectedBand ? -1 : this.hover);
    this.renderer.render(this.scene, this.camera); this.drawLabels(); this.dirty = false;
  }
  drawLabels() {
    if (!this.bandNodes) return;
    const cam = this.camera, v = this.v, W = this.w, H = this.h, boxes = []; let used = 0;
    const pxPerUnit = H / 2 / Math.tan(cam.fov * Math.PI / 360);
    const place = (bi, cls, text, force) => {
      if (used >= this.labels.length || bi < 0 || bi >= this.bandNodes.length) return;
      const h = this.pinH[bi]; v.set(this.pinDir[bi * 3] * (this.R + h), this.pinDir[bi * 3 + 1] * (this.R + h), this.pinDir[bi * 3 + 2] * (this.R + h));
      const dist = v.distanceTo(cam.position); v.project(cam); if (v.z > 1 || v.z < -1) return;
      const x = (v.x * .5 + .5) * W, y = (-v.y * .5 + .5) * H - pxPerUnit * this.pinR[bi] / dist - 4; if (x < -40 || x > W + 40 || y < 0 || y > H) return;
      const w = text.length * (cls === "strong" ? 8.4 : 6.3) + 8, hh = cls === "strong" ? 20 : 15, b = [x - w / 2, y - hh, x + w / 2, y];
      if (!force) for (const o of boxes) if (b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]) return; boxes.push(b);
      const L = this.labels[used++]; if (L.id !== text) { L.d.textContent = text; L.id = text; } if (L.cls !== cls) { L.d.className = "lbl " + cls; L.cls = cls; }
      L.d.style.display = ""; L.d.style.opacity = 1; L.d.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px) translateX(-50%)";
    };
    const filtering = this.selectedBand >= 0, connected = this.connectedBands;
    const done = new Set(), go = (bi, cls, force) => { if (bi < 0 || done.has(bi)) return; done.add(bi); place(bi, cls, this.bandNodes[bi].name, force); };
    go(this.selectedBand, "strong", true); go(this.hover, "strong", true);
    if (filtering) { if (connected) connected.forEach(bi => { if (used < this.labels.length) go(bi, "", false); }); }
    else if (this.topLabels) this.topLabels.forEach(bi => { if (used < 10) go(bi, "", false); });
    for (let k = used; k < this.labels.length; k++) if (this.labels[k].d.style.display !== "none") this.labels[k].d.style.display = "none";
  }
  dispose() {
    cancelAnimationFrame(this.raf); this.ro.disconnect(); this.mo.disconnect(); this.mq.removeEventListener && this.mq.removeEventListener("change", this.onScheme);
    this.renderer.dispose(); this.el.remove(); this.labels.forEach(l => l.d.remove());
  }
}
