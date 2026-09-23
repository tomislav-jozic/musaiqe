import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import GraphView from "./components/GraphView.jsx";
import PlanetView from "./components/PlanetView.jsx";
import { Field, Seg } from "./components/Controls.jsx";
import Search from "./components/Search.jsx";
import Notes from "./components/Notes.jsx";
import DataModal from "./components/DataModal.jsx";
import { fmt, full, store } from "./lib/utils.js";
import { generateScene } from "./lib/generate.js";
import { prepareDataset, buildGraph, shortestPath } from "./lib/dataset.js";
import { parseRock } from "./data/rock.js";

const DEFAULTS = { sizeBy: "listeners", colorBy: "genre", heightBy: "none", musicians: "connectors", types: { member: true, guest: true, collab: true }, genresOff: [], minSlider: 0 };
const sliderToListeners = s => s <= 0 ? 0 : Math.round(Math.pow(10, 2.5 + s / 100 * 4.5));
const CONNECTION_TYPES = [["member", "Band membership", "var(--ink)"], ["guest", "Guest appearances", "var(--edge-guest)"], ["collab", "Band collaborations", "var(--edge-collab)"]];
const PILE_CAP = 5;

export default function App() {
  const saved = useMemo(() => store.get("linernotes:v2") || {}, []);
  const [seed, setSeed] = useState(saved.seed || 1977), [count, setCount] = useState(saved.count || 500);
  const [source, setSource] = useState(saved.source || "rock");
  const [mode, setMode] = useState(saved.mode || "constellation");
  const [custom, setCustom] = useState(() => store.get("linernotes:data"));
  const [S, setS] = useState(() => ({ ...DEFAULTS, ...saved.settings, types: { ...DEFAULTS.types, ...(saved.settings && saved.settings.types) } }));
  const [pileIds, setPileIds] = useState([]);
  const [railOpen, setRail] = useState(() => window.innerWidth > 820), [modal, setModal] = useState(false), [spin, setSpin] = useState(true);
  const api = useRef(null);
  const set = patch => setS(s => ({ ...s, ...patch }));

  const ds = useMemo(() => {
    if (custom) { try { return prepareDataset(custom); } catch (e) { store.del("linernotes:data"); } }
    return prepareDataset(source === "rock" ? parseRock() : generateScene(seed, count));
  }, [custom, seed, count, source]);
  useEffect(() => { store.set("linernotes:v2", { seed, count, source, mode, settings: S }); }, [seed, count, source, mode, S]);

  const genresOff = useMemo(() => S.genresOff.filter(n => ds.genres.some(g => g.name === n)), [S.genresOff, ds]);
  const minListeners = ds.hasNumbers ? sliderToListeners(S.minSlider) : 0;
  const graph = useMemo(() => buildGraph(ds, { genresOff, minListeners, musicians: S.musicians, types: S.types }),
    [ds, genresOff.join("|"), minListeners, S.musicians, S.types]);

  /* data without streaming numbers falls back to what it does have */
  const needs = v => v === "listeners" || v === "followers" || v === "songs";
  const sizeBy = !ds.hasNumbers && needs(S.sizeBy) ? "connections" : S.sizeBy;
  const colorBy = !ds.hasNumbers && needs(S.colorBy) ? "genre" : S.colorBy;
  const heightBy = !ds.hasNumbers && needs(S.heightBy) ? "none" : S.heightBy;
  const style = useMemo(() => ({ sizeBy, colorBy, heightBy }), [sizeBy, colorBy, heightBy]);
  const opts = list => list.filter(o => ds.hasNumbers || !needs(o[0]));

  /* pileIds is the "pile up" selection: oldest -> newest, capped, with a shortest-path chain
     computed between every consecutive pair so the panel can show what connects each new pick
     to the one before it. */
  const pile = useMemo(() => pileIds.map(id => ds.byId.get(id)).filter(Boolean), [pileIds, ds]);
  const chains = useMemo(() => {
    const out = [];
    for (let k = 1; k < pileIds.length; k++) {
      const a = graph.index.get(pileIds[k - 1]), b = graph.index.get(pileIds[k]);
      out.push(a == null || b == null ? null : shortestPath(graph, a, b));
    }
    return out;
  }, [graph, pileIds]);

  useEffect(() => {
    const k = e => { if (e.key === "Escape" && !modal && pileIds.length) select(null); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [pileIds, modal]);

  const select = useCallback(id => {
    setPileIds(p => {
      if (id == null) return [];
      const i = p.indexOf(id);
      if (i === -1) { const next = p.concat(id); return next.length > PILE_CAP ? next.slice(next.length - PILE_CAP) : next; }
      if (i === p.length - 1) return p.slice(0, -1);
      return p.slice(0, i).concat(p.slice(i + 1), id);
    });
    if (id != null && window.innerWidth <= 820) setRail(false);
  }, []);
  const removeFromPile = useCallback(id => setPileIds(p => p.filter(x => x !== id)), []);
  const newData = () => { setPileIds([]); if (api.current && api.current.posCache) api.current.posCache.clear(); };
  const toggleGenre = n => set({ genresOff: genresOff.includes(n) ? genresOff.filter(x => x !== n) : genresOff.concat(n) });
  const clearFilters = a => set({ genresOff: [], minSlider: 0, types: DEFAULTS.types, musicians: a && a.type === "musician" ? "all" : S.musicians });
  const rampEnds = colorBy === "year" ? [ds.yearMin, ds.yearMax] : ["fewer listeners", "more"];
  const meta = ds.raw.meta || {};

  return (
    <div className="app">
      {mode === "planet"
        ? <PlanetView graph={graph} style={style} pileIds={pileIds} chains={chains} spin={spin}
            insets={[railOpen ? 300 : 0, pile.length ? 340 : 0]} onSelect={select} onSpin={setSpin} api={api} />
        : <GraphView graph={graph} style={style} pileIds={pileIds} chains={chains} spin={spin}
            insets={[railOpen ? 300 : 0, pile.length ? 340 : 0]} onSelect={select} onSpin={setSpin} api={api} />}

      <section className={"sheet rail" + (railOpen ? "" : " closed")} aria-label="Map controls">
        <header className="rail-head">
          <div><h1>Liner Notes</h1><p>{meta.real ? "Who played with whom as rock and metal took shape." : "A 3D map of who played with whom."}</p></div>
          <button type="button" className="icon-btn" aria-expanded={railOpen} onClick={() => setRail(o => !o)}>{railOpen ? "Hide" : "Controls"}</button>
        </header>
        <div className="rail-body">
          <div className="group"><h2>View</h2>
            <Seg label="View" value={mode} onChange={setMode} options={[["constellation", "Constellation"], ["planet", "Planet"]]} />
          </div>

          <Search ds={ds} onPick={select} />

          <div className="group"><h2>What the shapes mean</h2>
            <Field label="Size" value={sizeBy} onChange={v => set({ sizeBy: v })}
              options={opts([["listeners", "Monthly listeners"], ["followers", "Followers"], ["albums", "Studio albums"], ["songs", "Songs"], ["connections", "Connections"]])} />
            {mode === "constellation" && <>
              <Field label="Colour" value={colorBy} onChange={v => set({ colorBy: v })}
                options={opts([["genre", "Genre"], ["year", "Year formed"], ["listeners", "Monthly listeners"]])} />
              {colorBy !== "genre" && <div><div className="ramp"></div><div className="ramp-ends"><span>{rampEnds[0]}</span><span>{rampEnds[1]}</span></div></div>}
              <Field label="Height" value={heightBy} onChange={v => set({ heightBy: v })}
                options={opts([["none", "Free, by connections only"], ["year", "Year formed"], ["listeners", "Monthly listeners"]])} />
            </>}
            <p className="tally">{mode === "planet" ? "Territories are genres. Pins are bands, raised and sized by the field above." : "Spheres are bands. Diamonds are musicians."}</p>
          </div>

          <div className="group"><h2>Musicians on the map</h2>
            <Seg label="Musicians on the map" value={S.musicians} onChange={v => set({ musicians: v })}
              options={[["none", "None"], ["connectors", "Go-betweens"], ["all", "Everyone"]]} />
            <p className="tally" style={{ marginTop: 6 }}>
              {S.musicians === "none" ? "Bands are joined directly when they share a musician."
                : S.musicians === "connectors" ? "Only musicians who link two or more bands."
                : "Single-band members sit around their band like moons."}
            </p>
          </div>

          <div className="group"><h2>Connections</h2>
            <div className="checks">
              {CONNECTION_TYPES.map(([k, label, c]) => (
                <label key={k}>
                  <input type="checkbox" checked={S.types[k]} onChange={e => set({ types: { ...S.types, [k]: e.target.checked } })} />
                  <i style={{ borderColor: c }}></i>{label}
                </label>
              ))}
            </div>
          </div>

          {ds.hasNumbers && (
            <div className="group"><h2>Smallest band to show</h2>
              <div className="range">
                <input type="range" min="0" max="100" value={S.minSlider} onChange={e => set({ minSlider: +e.target.value })} aria-label="Minimum monthly listeners" />
                <output>{minListeners ? fmt(minListeners) + "+" : "Any size"}</output>
              </div>
            </div>
          )}

          <div className="group"><h2>Genres</h2>
            <div className="chips">
              {ds.genres.map(g => (
                <button key={g.name} type="button" className="chip" aria-pressed={!genresOff.includes(g.name)} onClick={() => toggleGenre(g.name)}>
                  <i style={{ background: g.color }}></i>{g.name} <small>{g.count}</small>
                </button>
              ))}
            </div>
            <div className="row" style={{ marginTop: 7 }}>
              <button type="button" className="linkish" onClick={() => set({ genresOff: [] })}>Show all</button>
              <button type="button" className="linkish" onClick={() => set({ genresOff: ds.genres.map(g => g.name) })}>Hide all</button>
            </div>
          </div>

          <p className="tally">
            {full(graph.nBands)} bands, {full(graph.nMusicians)} musicians and {full(graph.links.length)} connections on the map.
            {ds.dropped ? " " + ds.dropped + " links pointed at unknown ids and were skipped." : ""}
          </p>
          <div className="row">
            <button type="button" className="btn" onClick={() => setModal(true)}>Data</button>
            <span className="tally">{meta.synthetic ? "Sample scene, all fictional." : meta.real ? "Real line-ups, compiled by hand." : ""}</span>
          </div>
        </div>
      </section>

      {pile.length > 0 && (
        <Notes ds={ds} graph={graph} pile={pile} chains={chains} onSelect={select} onRemove={removeFromPile}
          onClose={() => select(null)} onClearFilters={clearFilters} />
      )}

      <div className="sheet dock">
        <span className="hint">{mode === "planet" ? "Drag to orbit, scroll to zoom. Click a pin for its liner notes." : "Drag to orbit, scroll to zoom, right-drag to pan. Click an artist for its liner notes."}</span>
        <button type="button" className="icon-btn" onClick={() => api.current && api.current.resetView()}>Reset view</button>
        <button type="button" className="icon-btn" aria-pressed={spin} onClick={() => setSpin(s => !s)}>{spin ? "Stop spinning" : "Spin"}</button>
      </div>

      {modal && (
        <DataModal ds={ds} count={count} onClose={() => setModal(false)}
          onRock={() => { newData(); store.del("linernotes:data"); setCustom(null); setSource("rock"); setModal(false); }}
          onGenerate={(s, n) => { newData(); store.del("linernotes:data"); setCustom(null); setSource("sample"); setSeed(s); setCount(n); setModal(false); }}
          onLoad={raw => { newData(); setCustom(raw); store.set("linernotes:data", raw); setModal(false); }} />
      )}
    </div>
  );
}
