import Disc from "./Disc.jsx";
import { fmt, full, OTHER_COLOR } from "../lib/utils.js";

const LINK_WORDS = { member: "member", guest: "guest", collab: "collaboration", shared: "shared members" };

/* The side sheet with an artist's credits, stats and path tracing. */
export default function Notes({ ds, graph, artist, pathStart, pathIdx, onSelect, onClose, onTrace, onClearFilters }) {
  const colorOf = a => ds.genres[a.gi] ? ds.genres[a.gi].color : OTHER_COLOR;
  const color = colorOf(artist), band = artist.type === "band", onMap = graph.index.has(artist.id);
  const other = l => (l.s === artist ? l.t : l.s);
  const years = l => l.years || (l.from ? l.from + "–" + (l.to || "now") : "");
  const group = t => artist.links.filter(l => l.type === t).sort((a, b) => other(b).listeners - other(a).listeners);
  const members = group("member"), guests = group("guest"), collabs = group("collab");
  const tracing = pathStart && pathStart.id !== artist.id;

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

  const subtitle = band
    ? [artist.genre, artist.city && "from " + artist.city].filter(Boolean).join(", ")
    : [artist.instrument, ds.genres[artist.gi] && "mostly " + ds.genres[artist.gi].name.toLowerCase()].filter(Boolean).join(", ");
  const active = artist.ended
    ? (artist.ended === artist.formed ? "Active in " + artist.formed : "Active " + artist.formed + "–" + artist.ended)
    : "Formed " + artist.formed + ", still active";

  return (
    <aside className="sheet notes" aria-label="Liner notes">
      <button type="button" className="icon-btn close" onClick={onClose} aria-label="Close liner notes">Close</button>
      <div className="notes-top">
        <Disc artist={artist} color={color} />
        <div>
          <h2>{artist.name}</h2>
          <p className="sub">{subtitle}</p>
          {band && artist.formed && <p className="sub">{active}</p>}
        </div>
      </div>

      <div className="stats">
        {ds.hasNumbers && <div><b title={full(artist.listeners)}>{fmt(artist.listeners)}</b><span>{band || !artist.derived ? "monthly listeners" : "listeners reached"}</span></div>}
        {ds.hasNumbers && <div><b title={full(artist.followers)}>{fmt(artist.followers)}</b><span>followers</span></div>}
        {band
          ? <div><b>{artist.albums ? full(artist.albums) : "–"}</b><span>studio albums</span></div>
          : <div><b>{artist.acts}</b><span>{artist.acts === 1 ? "band or act joined" : "bands and acts joined"}</span></div>}
        {band
          ? (ds.hasNumbers
              ? <div><b>{artist.songs ? full(artist.songs) : "–"}</b><span>songs</span></div>
              : <div><b>{members.length}</b><span>members over the years</span></div>)
          : <div><b>{artist.guestSpots}</b><span>{artist.guestSpots === 1 ? "guest spot" : "guest spots"}</span></div>}
      </div>

      {!onMap && <p className="note">Not on the map with the current filters. <button type="button" className="linkish" onClick={onClearFilters}>Clear filters</button></p>}

      {tracing && (
        <div>
          <h3>Path from {pathStart.name}</h3>
          {pathIdx ? (
            <ol className="path">
              {pathIdx.map((i, k) => {
                const n = graph.nodes[i]; let via = "";
                if (k) {
                  const a = pathIdx[k - 1], l = graph.links[graph.edgeOf.get(a < i ? a + "|" + i : i + "|" + a)];
                  via = l ? LINK_WORDS[l.type] + (l.src && l.src.kind ? ": " + l.src.kind : "") : "";
                }
                return (
                  <li key={n.id}>
                    {via && <em>{via}</em>}
                    <button type="button" className="linkish" style={{ color: "var(--ink)", fontSize: "14px", fontWeight: 600 }} onClick={() => onSelect(n.id)}>{n.name}</button>
                  </li>
                );
              })}
            </ol>
          ) : <p className="note">No chain of members, guests or collaborations joins these two with the current filters. Showing every musician and all connection types finds the most paths.</p>}
        </div>
      )}

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
      {!artist.links.length && <p className="note">No recorded connections to anyone else in this data.</p>}

      <div className="row" style={{ marginTop: 16 }}>
        <button type="button" className="btn" disabled={!onMap} onClick={() => onTrace(artist.id)}>
          {pathStart && pathStart.id === artist.id ? "Stop tracing" : "Trace a path from here"}
        </button>
      </div>
    </aside>
  );
}
