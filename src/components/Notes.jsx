import Disc from "./Disc.jsx";
import { fmt, full, OTHER_COLOR } from "../lib/utils.js";

const LINK_WORDS = { member: "member", guest: "guest", collab: "collaboration", shared: "shared members" };

/* One hop's label, from graph node a to graph node b. */
function hopLabel(graph, a, b) {
  const key = a < b ? a + "|" + b : b + "|" + a, li = graph.edgeOf.get(key), l = li != null ? graph.links[li] : null;
  return l ? LINK_WORDS[l.type] + (l.src && l.src.kind ? ": " + l.src.kind : "") : "connection";
}

/* What joins two consecutive picks in the pile: a direct hop, a chain through
   go-between artists, or nothing found under the current filters. */
function Connector({ chain, graph, onSelect }) {
  if (!chain) return <p className="note chain-note">No chain of members, guests or collaborations joins these two with the current filters.</p>;
  const hops = [];
  for (let k = 0; k < chain.length - 1; k++) {
    const a = chain[k], b = chain[k + 1], throughLast = k + 2 === chain.length;
    hops.push({ label: hopLabel(graph, a, b), through: throughLast ? null : graph.nodes[b] });
  }
  return (
    <div className="chain-wrap">
      <ol className="path chain">
        {hops.map((h, k) => (
          <li key={k}>
            <em>{h.label}</em>
            {h.through && <button type="button" className="linkish" onClick={() => onSelect(h.through.id)}>{h.through.name}</button>}
          </li>
        ))}
      </ol>
    </div>
  );
}

function CompactCard({ artist, color, subtitle, onFocus, onRemove }) {
  return (
    <div className="stack-row">
      <button type="button" className="stack-row-main" onClick={onFocus}>
        <Disc artist={artist} color={color} size={34} />
        <div><b>{artist.name}</b><small>{subtitle}</small></div>
      </button>
      <button type="button" className="icon-btn stack-remove" onClick={onRemove} aria-label={"Remove " + artist.name + " from comparison"}>×</button>
    </div>
  );
}

/* The stacked side sheet: oldest pick at top, active (most recent) pick expanded at the
   bottom, a connector between every consecutive pair showing what actually joins them. */
export default function Notes({ ds, graph, pile, chains, onSelect, onRemove, onClose, onClearFilters }) {
  const colorOf = a => ds.genres[a.gi] ? ds.genres[a.gi].color : OTHER_COLOR;
  const subtitleOf = a => a.type === "band"
    ? [a.genre, a.city && "from " + a.city].filter(Boolean).join(", ")
    : [a.instrument, ds.genres[a.gi] && "mostly " + ds.genres[a.gi].name.toLowerCase()].filter(Boolean).join(", ");

  const active = pile[pile.length - 1];
  const color = colorOf(active), band = active.type === "band", onMap = graph.index.has(active.id);
  const other = l => (l.s === active ? l.t : l.s);
  const years = l => l.years || (l.from ? l.from + "–" + (l.to || "now") : "");
  const group = t => active.links.filter(l => l.type === t).sort((a, b) => other(b).listeners - other(a).listeners);
  const members = group("member"), guests = group("guest"), collabs = group("collab");

  const Item = (l, note) => {
    const o = other(l);
    return (
      <li key={o.id + l.type + (l.year || l.from || "")}>
        <button type="button" onClick={() => onSelect(o.id)}>
          <i className="dot" style={{ background: colorOf(o) }}></i><b>{o.name}</b><small>{note}</small>
        </button>
      </li>
    );
  };

  const activeFormed = active.ended
    ? (active.ended === active.formed ? "Active in " + active.formed : "Active " + active.formed + "–" + active.ended)
    : "Formed " + active.formed + ", still active";

  return (
    <aside className="sheet notes stack" aria-label="Liner notes">
      <button type="button" className="icon-btn close" onClick={onClose} aria-label="Close liner notes">Close</button>
      {pile.length > 1 && <p className="eyebrow">Comparing {pile.length} artists</p>}

      {pile.slice(0, -1).map((artist, i) => (
        <div key={artist.id}>
          <CompactCard artist={artist} color={colorOf(artist)} subtitle={subtitleOf(artist)}
            onFocus={() => onSelect(artist.id)} onRemove={() => onRemove(artist.id)} />
          <Connector chain={chains[i]} graph={graph} onSelect={onSelect} />
        </div>
      ))}

      <div className="notes-top">
        <Disc artist={active} color={color} />
        <div>
          <h2>{active.name}</h2>
          <p className="sub">{subtitleOf(active)}</p>
          {band && active.formed && <p className="sub">{activeFormed}</p>}
        </div>
        {pile.length > 1 && <button type="button" className="icon-btn stack-remove active" onClick={() => onRemove(active.id)} aria-label={"Remove " + active.name + " from comparison"}>×</button>}
      </div>

      <div className="stats">
        {ds.hasNumbers && <div><b title={full(active.listeners)}>{fmt(active.listeners)}</b><span>{band || !active.derived ? "monthly listeners" : "listeners reached"}</span></div>}
        {ds.hasNumbers && <div><b title={full(active.followers)}>{fmt(active.followers)}</b><span>followers</span></div>}
        {band
          ? <div><b>{active.albums ? full(active.albums) : "–"}</b><span>studio albums</span></div>
          : <div><b>{active.acts}</b><span>{active.acts === 1 ? "band or act joined" : "bands and acts joined"}</span></div>}
        {band
          ? (ds.hasNumbers
              ? <div><b>{active.songs ? full(active.songs) : "–"}</b><span>songs</span></div>
              : <div><b>{members.length}</b><span>members over the years</span></div>)
          : <div><b>{active.guestSpots}</b><span>{active.guestSpots === 1 ? "guest spot" : "guest spots"}</span></div>}
      </div>

      {!onMap && <p className="note">Not on the map with the current filters. <button type="button" className="linkish" onClick={() => onClearFilters(active)}>Clear filters</button></p>}

      {members.length > 0 && (
        <div><h3>{band ? "Members" : "Member of"}</h3>
          <ul className="credits">{members.map(l => Item(l, [band ? l.role : other(l).genre, years(l)].filter(Boolean).join(", ")))}</ul></div>
      )}
      {guests.length > 0 && (
        <div><h3>{band ? "Guests on their records" : "Guest appearances"}</h3>
          <ul className="credits">{guests.map(l => Item(l, l.note
            ? l.note + (l.year ? ", " + l.year : "")
            : [l.weight + (l.weight === 1 ? " track" : " tracks"), l.year].filter(Boolean).join(", ")))}</ul></div>
      )}
      {collabs.length > 0 && (
        <div><h3>Collaborations</h3><ul className="credits">{collabs.map(l => Item(l, l.kind || ""))}</ul></div>
      )}
      {!active.links.length && <p className="note">No recorded connections to anyone else in this data.</p>}

      <p className="note">Click any artist on the map to add it here and see how it connects.</p>
    </aside>
  );
}
