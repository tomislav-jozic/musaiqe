import { PALETTE, OTHER_COLOR } from "./utils.js";
import { GENRES } from "./generate.js";

/* ───────────────────────── dataset preparation ───────────────────────── */
export function prepareDataset(raw) {
  if (!raw || !Array.isArray(raw.artists) || !Array.isArray(raw.links)) throw new Error('The data needs two lists at the top level: "artists" and "links".');
  if (!raw.artists.length) throw new Error('"artists" is empty. Add at least one band or musician.');
  const byId = new Map(), artists = [];
  raw.artists.forEach((a, i) => {
    if (a == null || a.id == null || !a.name) throw new Error("Artist " + (i + 1) + ' is missing "id" or "name".');
    const id = String(a.id); if (byId.has(id)) throw new Error('Two artists share the id "' + id + '". Ids must be unique.');
    const o = Object.assign({}, a, { id, type: a.type === "musician" ? "musician" : "band", links: [] }); byId.set(id, o); artists.push(o);
  });
  let dropped = 0; const links = [];
  raw.links.forEach(l => {
    const s = byId.get(String(l.source)), t = byId.get(String(l.target));
    if (!s || !t || s === t) { dropped++; return; }
    const o = Object.assign({}, l, { s, t, type: ["member","guest","collab"].includes(l.type) ? l.type : "collab", weight: +l.weight || 1 });
    links.push(o); s.links.push(o); t.links.push(o);
  });
  /* genres become the colour legend: the eleven most common get a colour each */
  const counts = new Map(); artists.forEach(a => { if (a.type === "band") { a.genre = a.genre || "Unknown"; counts.set(a.genre, (counts.get(a.genre) || 0) + 1); } });
  const preset = raw.meta && Array.isArray(raw.meta.genres) ? raw.meta.genres : null;
  const known = preset ? preset.map(g => g.name) : GENRES.map(g => g.name), names = [...counts.keys()];
  const isSample = names.every(n => known.includes(n));
  names.sort((a, b) => isSample ? known.indexOf(a) - known.indexOf(b) : counts.get(b) - counts.get(a));
  const genres = names.slice(0, isSample ? 12 : 11).map((n, i) => ({ name: n, color: preset && isSample ? preset[known.indexOf(n)].color : PALETTE[isSample ? known.indexOf(n) : i], count: counts.get(n) }));
  if (names.length > genres.length) genres.push({ name: "Other", color: OTHER_COLOR, count: names.slice(genres.length).reduce((s, n) => s + counts.get(n), 0), rest: new Set(names.slice(genres.length)) });
  const gIndex = n => { const i = genres.findIndex(g => g.name === n); return i >= 0 ? i : genres.length - 1; };
  artists.forEach(a => { if (a.type === "band") { a.gi = gIndex(a.genre); ["listeners","followers","albums","songs"].forEach(k => a[k] = +a[k] || 0); a.year = +a.formed || null; } });
  artists.forEach(a => { a.connections = a.links.length; });
  const hasNumbers = artists.some(a => a.type === "band" && a.listeners > 0);
  /* musicians inherit what is not given from the bands they played with */
  artists.forEach(a => {
    if (a.type !== "musician") return;
    let reach = 0, fol = 0, alb = 0, songs = 0, year = null; const byG = new Map();
    a.links.forEach(l => {
      const b = l.s === a ? l.t : l.s; if (b.type !== "band") return;
      const share = l.type === "member" ? 1 : .25;
      reach += b.listeners * share; fol += b.followers * share;
      if (l.type === "member") { alb += b.albums; songs += b.songs; } else songs += l.weight;
      byG.set(b.gi, (byG.get(b.gi) || 0) + b.listeners * share + 1);
      if (b.year && (year == null || b.year < year)) year = b.year;
    });
    a.derived = a.listeners == null;
    a.listeners = a.listeners != null ? +a.listeners : Math.round(reach);
    a.followers = a.followers != null ? +a.followers : Math.round(fol);
    a.acts = a.links.filter(l => l.type === "member").length; a.guestSpots = a.links.filter(l => l.type === "guest").length;
    a.albums = a.albums != null ? +a.albums : (hasNumbers ? alb : a.links.length); a.songs = a.songs != null ? +a.songs : songs;
    a.year = year; let best = -1, bg = genres.length - 1; byG.forEach((v, k) => { if (v > best) { best = v; bg = k; } }); a.gi = bg;
  });
  const years = artists.map(a => a.year).filter(Boolean);
  return { raw, artists, links, byId, genres, dropped, hasNumbers, bandCount: artists.filter(a => a.type === "band").length,
    yearMin: years.length ? Math.min(...years) : 1960, yearMax: years.length ? Math.max(...years) : 2025 };
}

/* ───────────────────────── graph for the current filters ───────────────────────── */
export function buildGraph(ds, f) {
  const off = new Set(f.genresOff), T = f.types;
  const bands = ds.artists.filter(a => a.type === "band" && !off.has(ds.genres[a.gi].name) && a.listeners >= f.minListeners);
  const vis = new Set(bands), sim = bands.slice(), moons = [], links = [];
  const musos = ds.artists.filter(a => a.type === "musician");
  const pairKey = new Map();
  const addPair = (a, b, type) => { const k = a.id < b.id ? a.id + "|" + b.id : b.id + "|" + a.id; let l = pairKey.get(k); if (l) { l.weight++; if (type === "shared") l.type = "shared"; } else { l = { a, b, type, weight: 1 }; pairKey.set(k, l); links.push(l); } };
  musos.forEach(m => {
    const ls = m.links.filter(l => T[l.type] && vis.has(l.s === m ? l.t : l.s));
    if (!ls.length) return;
    const distinct = new Set(ls.map(l => (l.s === m ? l.t : l.s)));
    if (f.musicians === "none") {
      const arr = ls.map(l => ({ b: l.s === m ? l.t : l.s, type: l.type }));
      for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) if (arr[i].b !== arr[j].b)
        addPair(arr[i].b, arr[j].b, arr[i].type === "member" && arr[j].type === "member" ? "shared" : "guest");
      return;
    }
    if (distinct.size >= 2) { sim.push(m); m._moon = null; }
    else if (f.musicians === "all") { moons.push(m); m._moon = [...distinct][0]; }
    else return;
    ls.forEach(l => links.push({ a: l.s, b: l.t, type: l.type, weight: l.weight, src: l }));
  });
  if (f.musicians !== "none") { const mv = new Set(sim); ds.links.forEach(l => { if (l.s.type === "musician" && l.t.type === "musician" && T[l.type] && mv.has(l.s) && mv.has(l.t)) links.push({ a: l.s, b: l.t, type: l.type, weight: l.weight, src: l }); }); }
  if (T.collab) ds.links.forEach(l => { if (l.type !== "member" && l.s.type === "band" && l.t.type === "band" && vis.has(l.s) && vis.has(l.t) && (l.type === "collab" || T.guest)) links.push({ a: l.s, b: l.t, type: l.type, weight: l.weight, src: l }); });

  const nodes = sim.concat(moons), index = new Map(); nodes.forEach((a, i) => index.set(a.id, i));
  const adj = nodes.map(() => []), edgeOf = new Map();
  const L = links.map((l, li) => { const s = index.get(l.a.id), t = index.get(l.b.id); adj[s].push(t); adj[t].push(s); edgeOf.set(s < t ? s + "|" + t : t + "|" + s, li); return { s, t, type: l.type, weight: l.weight, src: l.src }; });
  const moonOf = new Int32Array(nodes.length).fill(-1); moons.forEach((m, k) => moonOf[sim.length + k] = index.get(m._moon.id));
  return { ds, nodes, links: L, nSim: sim.length, moonOf, index, adj, edgeOf,
    nBands: bands.length, nMusicians: nodes.length - bands.length };
}
export function shortestPath(g, from, to) {
  const prev = new Int32Array(g.nodes.length).fill(-1), q = [from]; prev[from] = from;
  for (let h = 0; h < q.length; h++) { const u = q[h]; if (u === to) break; for (const v of g.adj[u]) if (prev[v] < 0) { prev[v] = u; q.push(v); } }
  if (prev[to] < 0) return null; const path = [to]; while (path[0] !== from) path.unshift(prev[path[0]]); return path;
}
