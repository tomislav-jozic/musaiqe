import { useEffect } from "react";

/* A one-time welcome modal: what the map shows, how to explore it, one real worked example. */
export default function Tour({ onClose }) {
  useEffect(() => {
    const k = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <div className="modal-back" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet modal tour" role="dialog" aria-modal="true" aria-label="How Liner Notes works">
        <button type="button" className="icon-btn" style={{ position: "absolute", top: 14, right: 14 }} onClick={onClose}>Close</button>
        <h2>How this works</h2>
        <p>Every sphere is a band or musician. Every line is a real connection between them — a shared member, a guest spot, a collaboration.</p>

        <h3>Explore</h3>
        <ul>
          <li>Search or click an artist to open its liner notes.</li>
          <li>Click a second artist and it piles up next to the first, with the connection between them traced and labelled.</li>
          <li>Drag to orbit, scroll to zoom.</li>
        </ul>

        <div className="tour-example">
          <p className="eyebrow">Try it</p>
          <p>Search for <b>Lynyrd Skynyrd</b>, then search for <b>The Jimi Hendrix Experience</b>. Watch the map trace the path between them — they're linked through <b>Al Kooper</b>, who guested with both. Click his name in the connector to see his own credits, or click either band again to drop it and start over.</p>
        </div>

        <p className="note">There's also a Planet view (genres as a globe, bands as pins) and filters in the rail on the left. Nothing here can break — have a look around.</p>

        <div className="row" style={{ marginTop: 4 }}>
          <button type="button" className="btn solid" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
}
