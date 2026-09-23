import { useEffect, useRef, useState } from "react";
import Engine from "../engine/Engine.js";

/* Hosts the three.js engine and keeps it in sync with React state. */
export default function GraphView({ graph, style, selectedId, pathIdx, spin, insets, onSelect, onSpin, api }) {
  const host = useRef(null), labels = useRef(null), eng = useRef(null);
  const [failed, setFailed] = useState(false);
  const cb = useRef({});
  cb.current = { onSelect, onSpin };

  useEffect(() => {
    try {
      eng.current = new Engine(host.current, labels.current, { onSelect: id => cb.current.onSelect(id), onSpin: v => cb.current.onSpin(v) });
      api.current = eng.current;
    } catch (e) { console.error(e); setFailed(true); }
    return () => { if (eng.current) eng.current.dispose(); eng.current = null; };
  }, []);

  useEffect(() => { if (eng.current) { eng.current.style = style; eng.current.setGraph(graph); } }, [graph]);
  useEffect(() => { if (eng.current && eng.current.g) eng.current.applyStyle(style); }, [style]);
  useEffect(() => { if (eng.current) eng.current.setSpin(spin); }, [spin]);
  useEffect(() => { if (eng.current) eng.current.setInsets(insets[0], insets[1]); }, [insets[0], insets[1]]);

  useEffect(() => {
    const e = eng.current; if (!e || !e.g) return;
    const sel = selectedId != null && graph.index.has(selectedId) ? graph.index.get(selectedId) : -1;
    const nodes = new Set(), edges = new Set();
    if (pathIdx && pathIdx.length > 1) {
      pathIdx.forEach((i, k) => { nodes.add(i); if (k) { const a = pathIdx[k - 1], key = a < i ? a + "|" + i : i + "|" + a; if (graph.edgeOf.has(key)) edges.add(graph.edgeOf.get(key)); } });
    } else if (sel >= 0) {
      nodes.add(sel);
      graph.links.forEach((l, li) => { if (l.s === sel || l.t === sel) { edges.add(li); nodes.add(l.s); nodes.add(l.t); } });
    }
    e.setHighlight(sel, nodes, edges);
  }, [graph, selectedId, pathIdx]);

  useEffect(() => {
    const e = eng.current; if (!e || !e.g) return;
    if (pathIdx && pathIdx.length > 1) e.frame(pathIdx);
    else if (selectedId != null && graph.index.has(selectedId)) e.focus(graph.index.get(selectedId));
  }, [selectedId, pathIdx]);

  return (
    <div className="stage" ref={host}>
      <div className="labels" ref={labels} aria-hidden="true"></div>
      {failed && <p className="nogl">This browser could not start WebGL, so the 3D map cannot be drawn. Try another browser or turn on hardware acceleration.</p>}
    </div>
  );
}
