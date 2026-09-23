import { useEffect, useRef, useState } from "react";
import PlanetEngine from "../engine/PlanetEngine.js";

/* Hosts the planet engine and keeps it in sync with React state. Mirrors GraphView.jsx's wiring
   so it's a drop-in alternative view mode from App.jsx's point of view. */
export default function PlanetView({ graph, style, pileIds, chains, spin, globeTheme, onSelect, onSpin, api }) {
  const host = useRef(null), labels = useRef(null), eng = useRef(null);
  const [failed, setFailed] = useState(false);
  const cb = useRef({});
  cb.current = { onSelect, onSpin };

  useEffect(() => {
    try {
      eng.current = new PlanetEngine(host.current, labels.current, { onSelect: id => cb.current.onSelect(id), onSpin: v => cb.current.onSpin(v) });
      api.current = eng.current;
    } catch (e) { console.error(e); setFailed(true); }
    return () => { if (eng.current) eng.current.dispose(); eng.current = null; };
  }, []);

  useEffect(() => { if (eng.current) { eng.current.style = style; eng.current.setGraph(graph); } }, [graph]);
  useEffect(() => { if (eng.current && eng.current.g) eng.current.applyStyle(style); }, [style]);
  useEffect(() => { if (eng.current) eng.current.setSpin(spin); }, [spin]);
  useEffect(() => { if (eng.current) eng.current.setGlobeTheme(globeTheme); }, [globeTheme]);

  /* The pile: each picked artist plus, between every consecutive pair, whatever chain of
     members/guests/collaborations actually connects them (or just that pick's own direct
     connections when there's only one, same as a plain single selection always has). */
  const pileHighlight = () => {
    const pileIdx = pileIds.map(id => graph.index.has(id) ? graph.index.get(id) : null).filter(i => i != null);
    const nodes = new Set(pileIdx), edges = new Set();
    if (pileIdx.length === 1) {
      const sel = pileIdx[0];
      graph.links.forEach((l, li) => { if (l.s === sel || l.t === sel) { edges.add(li); nodes.add(l.s); nodes.add(l.t); } });
    } else {
      chains.forEach(chain => { if (!chain) return; chain.forEach((i, k) => { nodes.add(i); if (k) { const a = chain[k - 1], key = a < i ? a + "|" + i : i + "|" + a; if (graph.edgeOf.has(key)) edges.add(graph.edgeOf.get(key)); } }); });
    }
    return { pileIdx, nodes, edges };
  };

  useEffect(() => {
    const e = eng.current; if (!e || !e.g) return;
    const { pileIdx, nodes, edges } = pileHighlight();
    e.setHighlight(pileIdx.length ? pileIdx[pileIdx.length - 1] : -1, nodes, edges, pileIdx.length <= 1);
  }, [graph, pileIds, chains]);

  useEffect(() => {
    const e = eng.current; if (!e || !e.g) return;
    const { pileIdx, nodes } = pileHighlight();
    if (pileIdx.length > 1) e.frame([...nodes]);
    else if (pileIdx.length === 1) e.focus(pileIdx[0]);
  }, [pileIds, chains]);

  return (
    <div className="stage" ref={host}>
      <div className="labels" ref={labels} aria-hidden="true"></div>
      {failed && <p className="nogl">This browser could not start WebGL, so the planet cannot be drawn. Try another browser or turn on hardware acceleration.</p>}
    </div>
  );
}
