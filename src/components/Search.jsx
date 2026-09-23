import { useMemo, useState } from "react";

export default function Search({ ds, onPick }) {
  const [q, setQ] = useState(""), [open, setOpen] = useState(false), [cur, setCur] = useState(0);
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase(); if (!s) return [];
    const a = [], b = [];
    for (const x of ds.artists) { const i = x.name.toLowerCase().indexOf(s); if (i === 0) a.push(x); else if (i > 0) b.push(x); }
    const by = (x, y) => y.listeners - x.listeners;
    return a.sort(by).concat(b.sort(by)).slice(0, 8);
  }, [q, ds]);
  const choose = x => { onPick(x.id); setQ(""); setOpen(false); };
  const onKeyDown = e => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCur(c => Math.min(hits.length - 1, c + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCur(c => Math.max(0, c - 1)); }
    else if (e.key === "Enter" && hits[cur]) choose(hits[cur]);
    else if (e.key === "Escape") setOpen(false);
  };
  return (
    <div className="search">
      <input type="search" placeholder="Find a band or musician" aria-label="Find a band or musician" value={q} autoComplete="off"
        onChange={e => { setQ(e.target.value); setOpen(true); setCur(0); }} onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)} onKeyDown={onKeyDown} />
      {open && q.trim() && (
        <ul className="results">
          {hits.length ? hits.map((x, i) => (
            <li key={x.id}>
              <button type="button" className={i === cur ? "on" : ""} onMouseDown={e => e.preventDefault()} onClick={() => choose(x)}>
                <span>{x.name}</span><small>{x.type === "band" ? x.genre : x.instrument || "musician"}</small>
              </button>
            </li>
          )) : <li style={{ padding: "6px 8px", color: "var(--muted)" }}>No artist with that name in this data.</li>}
        </ul>
      )}
    </div>
  );
}
