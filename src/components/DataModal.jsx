import { useEffect, useRef, useState } from "react";
import { clamp, full } from "../lib/utils.js";
import { prepareDataset } from "../lib/dataset.js";

const SCHEMA = `{
  "artists": [
    { "id": "b1", "type": "band", "name": "Pale Harbour", "genre": "Indie rock", "city": "Leeds",
      "formed": 2004, "ended": null, "albums": 5, "songs": 58, "listeners": 412000, "followers": 96000 },
    { "id": "m1", "type": "musician", "name": "Ana Novak", "instrument": "drums" }
  ],
  "links": [
    { "source": "m1", "target": "b1", "type": "member", "role": "drums", "from": 2004, "to": null },
    { "source": "m1", "target": "b2", "type": "guest", "weight": 2, "year": 2015 },
    { "source": "b1", "target": "b2", "type": "collab", "kind": "split release" }
  ]
}`;

export default function DataModal({ ds, count, onGenerate, onRock, onLoad, onClose }) {
  const [text, setText] = useState(""), [err, setErr] = useState(""), [n, setN] = useState(count), [copied, setCopied] = useState("");
  const box = useRef(null);

  useEffect(() => {
    const k = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);

  const load = () => {
    try { const raw = JSON.parse(text); prepareDataset(raw); onLoad(raw); }
    catch (e) { setErr(e instanceof SyntaxError ? "That is not valid JSON: " + e.message : e.message); }
  };
  const file = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => { setText(String(r.result)); setErr(""); }; r.readAsText(f);
  };
  const copy = () => {
    const s = JSON.stringify(ds.raw, null, 1); setText(s); setErr("");
    const done = ok => setCopied(ok ? "Copied to the clipboard." : "The data is in the box below. Select it and copy.");
    (navigator.clipboard ? navigator.clipboard.writeText(s) : Promise.reject()).then(() => done(true))
      .catch(() => { done(false); if (box.current) { box.current.focus(); box.current.select(); } });
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(ds.raw, null, 1)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "liner-notes-data.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const meta = ds.raw.meta || {};
  const about = meta.synthetic
    ? "You are looking at a randomly generated sample scene. Every band, musician and number in it is made up."
    : meta.real
      ? "You are looking at the early rock and metal family tree: real line-ups and guest spots compiled by hand, so expect the odd gap or wrong year. Album counts are approximate" + (ds.hasNumbers ? "." : " and there are no streaming numbers yet.")
      : "You are looking at data you loaded.";

  return (
    <div className="modal-back" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet modal" role="dialog" aria-modal="true" aria-label="Data">
        <button type="button" className="icon-btn" style={{ position: "absolute", top: 14, right: 14 }} onClick={onClose}>Close</button>
        <h2>Data</h2>
        <p>{about} It holds {full(ds.bandCount)} bands, {full(ds.artists.length - ds.bandCount)} musicians and {full(ds.links.length)} connections.</p>

        <h3>Built-in data</h3>
        <div className="row" style={{ marginBottom: 10 }}><button type="button" className="btn" onClick={onRock}>Show early rock and metal</button></div>
        <div className="row">
          <label>Bands <input className="num" type="number" min="50" max="900" step="50" value={n} onChange={e => setN(e.target.value)} /></label>
          <button type="button" className="btn" onClick={() => onGenerate(Math.floor(Math.random() * 1e9), clamp(+n || 500, 50, 900))}>Generate sample scene</button>
        </div>

        <h3>Load your own data</h3>
        <p>Paste JSON or choose a file. Bands carry the numbers; a musician without numbers inherits them from the bands they played with. Link types are member, guest and collab.</p>
        <pre>{SCHEMA}</pre>
        <textarea ref={box} value={text} onChange={e => { setText(e.target.value); setErr(""); }} placeholder="Paste JSON here" aria-label="JSON data" spellCheck="false"></textarea>
        {err && <p className="err" role="alert">{err}</p>}
        <div className="row" style={{ marginTop: 8 }}>
          <button type="button" className="btn solid" disabled={!text.trim()} onClick={load}>Load data</button>
          <input type="file" accept=".json,application/json" onChange={file} aria-label="Choose a JSON file" />
        </div>

        <h3>Take the current data with you</h3>
        <div className="row">
          <button type="button" className="btn" onClick={download}>Download data as JSON</button>
          <button type="button" className="btn" onClick={copy}>Copy data as JSON</button>
          <span className="note" style={{ margin: 0 }} role="status">{copied}</span>
        </div>
      </div>
    </div>
  );
}
