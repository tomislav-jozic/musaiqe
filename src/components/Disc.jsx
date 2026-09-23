import { clamp } from "../lib/utils.js";

/* A record for bands (one groove per album) and a diamond for musicians. */
export default function Disc({ artist, color }) {
  if (artist.type !== "band") return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true" style={{ flex: "none" }}>
      <path d="M32 4 58 32 32 60 6 32Z" fill={color} />
      <path d="M32 4 32 60M6 32 58 32" stroke="var(--bg)" strokeOpacity=".35" strokeWidth="1.5" />
    </svg>
  );
  const rings = clamp(artist.albums || 1, 1, 14);
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" role="img" style={{ flex: "none" }}
      aria-label={"Record with one groove per album, " + rings + (artist.albums > 14 ? " or more" : "")}>
      <circle cx="32" cy="32" r="30" fill="var(--ink)" />
      {Array.from({ length: rings }, (_, i) => (
        <circle key={i} cx="32" cy="32" r={14 + (i + 1) * (15 / (rings + 1))} fill="none" stroke="var(--bg)" strokeOpacity=".5" strokeWidth=".8" />
      ))}
      <circle cx="32" cy="32" r="11.5" fill={color} />
      <circle cx="32" cy="32" r="1.8" fill="var(--bg)" />
    </svg>
  );
}
