import { clamp, mulberry32 } from "./utils.js";

/* ───────────────────────── sample-scene generator ─────────────────────────
   Everything it produces is fictional. Genres sit on a ring, so neighbours
   in this list are the ones that trade guests and members most often. */
export const GENRES = [
  { name:"Folk",            w:.9,  era:2003, spread:14, pop:11.3, share:.22, guest:.9,  min:1, cities:["Asheville","Galway","Bergen"],
    lineups:[["vocals, guitar","fiddle","double bass","banjo","percussion"],["vocals, guitar","cello","harmonium"]] },
  { name:"Indie rock",      w:1.4, era:2006, spread:11, pop:11.9, share:.24, guest:.8,  min:2, cities:["Leeds","Portland","Melbourne","Montreal"],
    lineups:[["vocals, guitar","guitar","bass","drums","keys"],["vocals","guitar","bass","drums"]] },
  { name:"Punk & hardcore", w:1.0, era:1994, spread:12, pop:10.6, share:.34, guest:.7,  min:3, cities:["Washington DC","Gothenburg","San Diego"],
    lineups:[["vocals","guitar","bass","drums","guitar"]] },
  { name:"Metal",           w:1.0, era:1997, spread:12, pop:11.1, share:.32, guest:.8,  min:3, cities:["Tampa","Bergen","Birmingham"],
    lineups:[["vocals","lead guitar","rhythm guitar","bass","drums","keys"]] },
  { name:"Ambient",         w:.6,  era:2008, spread:12, pop:10.4, share:.2,  guest:1.0, min:1, cities:["Reykjavik","Berlin","Kyoto"],
    lineups:[["synths, tapes","guitar, effects","strings"],["piano, electronics","field recordings"]] },
  { name:"Electronic",      w:1.0, era:2009, spread:10, pop:12.1, share:.18, guest:1.5, min:1, cities:["Berlin","Detroit","Bristol"],
    lineups:[["producer","synths","vocals"],["producer","producer"]] },
  { name:"Pop",             w:.9,  era:2013, spread:8,  pop:13.3, share:.1,  guest:1.4, min:1, cities:["Stockholm","Los Angeles","Seoul"],
    lineups:[["vocals","producer","guitar"],["vocals"]] },
  { name:"Hip-hop",         w:1.1, era:2010, spread:10, pop:12.8, share:.16, guest:2.4, min:1, cities:["Atlanta","London","Marseille"],
    lineups:[["MC","producer","DJ","MC"],["MC"]] },
  { name:"Soul & R&B",      w:.8,  era:2005, spread:16, pop:12.3, share:.2,  guest:1.6, min:1, cities:["Memphis","London","Philadelphia"],
    lineups:[["vocals","keys","bass","drums","guitar","horns"],["vocals","producer"]] },
  { name:"Jazz",            w:.9,  era:1996, spread:18, pop:10.5, share:.45, guest:1.7, min:3, cities:["New York","London","Copenhagen"],
    lineups:[["saxophone","piano","double bass","drums","trumpet","trombone"],["guitar","organ","drums","vibraphone"]] },
  { name:"Latin",           w:.7,  era:2007, spread:14, pop:12.4, share:.2,  guest:1.5, min:2, cities:["Medellín","Mexico City","San Juan"],
    lineups:[["vocals","guitar","bass","percussion","trumpet","keys"],["vocals","producer"]] },
  { name:"Reggae & dub",    w:.6,  era:1995, spread:15, pop:11.2, share:.3,  guest:1.3, min:3, cities:["Kingston","Bristol"],
    lineups:[["vocals","guitar","bass","drums","keys","melodica","percussion"]] },
];
const ADJ = ["Pale","Hollow","Velvet","Distant","Static","Golden","Feral","Quiet","Paper","Northern","Electric","Slow","Bitter","Lunar","Salt","Glass","Low","Tender","Burnt","Second","Idle","Neon","Drowned","Minor","Soft","Crooked","Silver","Plain","Late","Spare","Blind","Copper","Winter","Hidden","Lesser","Humid"];
const NOUN = ["Harbour","Motel","Furnace","Orchard","Signal","Parade","Lanterns","Cartographer","Tides","Arcade","Mirrors","Satellites","Gardens","Machines","Rivers","Avenue","Swimmers","Holiday","Monument","Violets","Engines","Cathedral","Weather","Atlas","Embers","Thieves","Ritual","Comet","Ferry","Almanac","Balcony","Couriers","Dial Tone","Greenhouse","Understudy","Tollbooth","Lighthouse","Switchboard","Pavilion","Caravan"];
const HEAVY_ADJ = ["Ashen","Iron","Grave","Black","Frost","Rotten","Blood","Void","Bone","Sunken"];
const HEAVY_NOUN = ["Throne","Pyre","Serpent","Vigil","Monolith","Wraith","Altar","Hex","Plague","Crypt","Oath","Tusk"];
const STAGE_A = ["Kairo","Vessel","Onda","Juno","Mako","Sable","Nyx","Halcyon","Rook","Ilse","Tamsin","Oro","Zuri","Lumen","Pex","Dara","Mirel","Tau","Ivo","Seren","Ayo","Noor","Kit","Bex","Solei","Vanta","Echo","Figo","Remi","Yara"];
const STAGE_B = ["Vale","Nine","Rey","Okoro","Lux","Marlowe","Santos","Blue","Kwan","Deluxe","Arden","Fontaine","Zero","Moreau","Ash","Sol"];
const FIRST = ["Ana","Tomás","Ingrid","Kwame","Mirela","Jonas","Aiko","Dario","Leila","Oskar","Nadia","Femi","Clara","Ravi","Sofia","Marek","Yuki","Elias","Amara","Luka","Bea","Hugo","Zofia","Idris","Maren","Caio","Priya","Anton","Salma","Nico","Tilda","Emeka","Rosa","Viktor","Hana","Julien","Noa","Pavel","Esme","Tariq","Linnea","Mateo","Dalia","Stellan","Imani","Goran","Freya","Omar","Lucia","Bram","Kaia","Andrei","Mina","Rafael","Sunniva","Desmond","Alba","Kofi","Petra","Joaquín"];
const LAST = ["Halvorsen","Okafor","Marchetti","Lindqvist","Novak","Delgado","Tanaka","Brennan","Kovač","Adeyemi","Fontaine","Sørensen","Reyes","Whitlock","Banerjee","Moretti","Kessler","Abara","Villanueva","Nakamura","Dubois","Horvat","Eklund","Mbeki","Castellanos","Rahman","Petrov","Ainsworth","Lemaire","Ferreira","Strand","Oyelaran","Vukovic","Ibáñez","Thorne","Baptiste","Winther","Zielinski","Osei","Carvalho","Hartmann","Quigley","Salazar","Mori","Andersson","Bello","Radić","Sinclair","Yilmaz","Pereira","Larkin","Nkosi","Bjørnstad","Rossi","Huang","Marlow","Diallo","Kaplan","Esposito","Varga"];


export function generateScene(seed, count) {
  const R = mulberry32(seed);
  const pick = a => a[Math.floor(R() * a.length)];
  const randn = () => { let u = 0; while (!u) u = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * R()); };
  const poisson = l => { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= R(); } while (p > L); return k - 1; };
  const sig = n => { const m = Math.pow(10, Math.max(0, Math.floor(Math.log10(n)) - 2)); return Math.round(n / m) * m; };
  const totalW = GENRES.reduce((s, g) => s + g.w, 0);
  const G = GENRES.length;

  const used = new Set();
  const unique = make => { for (let i = 0; i < 30; i++) { const n = make(); if (!used.has(n)) { used.add(n); return n; } } let n = make(), k = 2; while (used.has(n + " " + k)) k++; used.add(n + " " + k); return n + " " + k; };
  const bandName = (g, solo) => {
    if (solo && ["Pop","Hip-hop","Electronic","Soul & R&B","Latin","Ambient"].includes(g.name)) return unique(() => R() < .45 ? pick(STAGE_A) + " " + pick(STAGE_B) : pick(STAGE_A) + " " + pick(NOUN).split(" ")[0]);
    const heavy = g.name === "Metal" || (g.name === "Punk & hardcore" && R() < .4);
    const A = heavy ? HEAVY_ADJ : ADJ, N = heavy && R() < .7 ? HEAVY_NOUN : NOUN;
    return unique(() => { const r = R(); return r < .5 ? pick(A) + " " + pick(N) : r < .68 ? "The " + pick(A) + " " + pick(N) : r < .86 ? pick(N) + " of " + pick(N) : pick(N) + " " + pick(N); });
  };

  /* bands */
  const bands = [];
  for (let i = 0; i < count; i++) {
    let r = R() * totalW, gi = 0; while ((r -= GENRES[gi].w) > 0 && gi < G - 1) gi++;
    const g = GENRES[gi];
    const formed = clamp(Math.round(g.era + randn() * g.spread), 1958, 2024);
    const active = R() < (formed > 2006 ? .72 : .34);
    const ended = active ? null : Math.min(2025, formed + 2 + Math.floor(R() * R() * 28));
    const span = (ended || 2026) - formed;
    const albums = clamp(Math.round(span / (2.2 + R() * 2.6)), 1, 24);
    const songs = Math.round(albums * (8 + R() * 5) + R() * 12);
    const listeners = sig(clamp(Math.exp(g.pop + randn() * 1.7 + Math.min(albums, 12) * .06), 300, 7e7));
    bands.push({ gi, genre: g.name, city: pick(g.cities), formed, ended, albums, songs, listeners, followers: sig(listeners * (.25 + R() * 1.3)) });
  }
  bands.sort((a, b) => a.formed - b.formed);

  /* members, with musicians drifting between bands of the same scene */
  const musicians = [], links = [], scenePool = {}, genrePool = GENRES.map(() => []);
  const inBand = new Map();
  bands.forEach((b, i) => {
    b.id = "b" + (i + 1); b.type = "band";
    const g = GENRES[b.gi], lineup = pick(g.lineups);
    const size = clamp(g.min + Math.floor(R() * (lineup.length - g.min + 1)), 1, lineup.length);
    b.name = bandName(g, size === 1);
    const key = b.gi + "|" + b.city, members = new Set(); inBand.set(b.id, members);
    const span = (b.ended || 2026) - b.formed;
    for (let s = 0; s < size; s++) {
      const role = lineup[s]; let m = null;
      if (R() < g.share) {
        const r = R(), pool = r < .65 ? scenePool[key] : r < .9 ? genrePool[b.gi] : genrePool[(b.gi + (R() < .5 ? 1 : G - 1)) % G];
        if (pool && pool.length) for (let t = 0; t < 6 && !m; t++) {
          const c = pick(pool);
          if (!members.has(c.id) && c.n < 5 && Math.abs(b.formed - c.first) <= 20 && (c.instrument === role || R() < .35)) m = c;
        }
      }
      if (!m) {
        m = { id: "m" + (musicians.length + 1), type: "musician", name: unique(() => pick(FIRST) + " " + pick(LAST)), instrument: role, first: b.formed, n: 0, reach: 0, gi: b.gi };
        musicians.push(m); (scenePool[key] = scenePool[key] || []).push(m); genrePool[b.gi].push(m);
      }
      members.add(m.id); m.n++; m.reach += b.listeners;
      const from = b.formed + (s > 0 && R() < .25 ? Math.floor(R() * Math.min(span, 6)) : 0);
      let to = b.ended;
      if (R() < .3 && span > 3) { to = from + 1 + Math.floor(R() * (span - 1)); if (to >= (b.ended || 2026)) to = b.ended; }
      links.push({ source: m.id, target: b.id, type: "member", role, from, to: to || null });
    }
  });

  /* guest appearances: bigger acts and guest-heavy genres pull in more */
  bands.forEach(b => {
    const g = GENRES[b.gi], members = inBand.get(b.id);
    const n = poisson(g.guest * (.3 + .3 * Math.max(0, Math.log10(b.listeners) - 3.5)));
    for (let k = 0; k < n; k++) {
      const r = R(), step = 1 + Math.floor(R() * 2);
      const pool = r < .6 ? genrePool[b.gi] : r < .9 ? genrePool[(b.gi + (R() < .5 ? step : G - step)) % G] : genrePool[Math.floor(R() * G)];
      let best = null, score = -1;
      for (let t = 0; t < 4; t++) {
        const c = pick(pool); if (!c || members.has(c.id) || c.first > (b.ended || 2026) || c.first < b.formed - 30) continue;
        const sc = Math.pow(c.reach, .3) * R(); if (sc > score) { score = sc; best = c; }
      }
      if (!best) continue;
      members.add(best.id);
      const lo = Math.max(b.formed, best.first), hi = b.ended || 2026;
      links.push({ source: best.id, target: b.id, type: "guest", weight: 1 + Math.floor(R() * R() * 5), year: lo + Math.floor(R() * Math.max(1, hi - lo)) });
    }
  });

  /* band-to-band collaborations */
  const byGenre = GENRES.map(() => []); bands.forEach(b => byGenre[b.gi].push(b));
  const seen = new Set();
  bands.forEach(b => {
    if (R() > .3) return;
    const pool = R() < .7 ? byGenre[b.gi] : byGenre[(b.gi + (R() < .5 ? 1 : G - 1)) % G];
    for (let t = 0; t < 5; t++) {
      const c = pick(pool); if (!c || c === b || Math.abs(c.formed - b.formed) > 15) continue;
      const k = b.id < c.id ? b.id + c.id : c.id + b.id; if (seen.has(k)) continue; seen.add(k);
      links.push({ source: b.id, target: c.id, type: "collab", kind: pick(["split release","joint tour","remix","joint album"]), weight: 1 }); break;
    }
  });

  bands.forEach(b => { delete b.gi; });
  const artists = bands.concat(musicians.map(m => ({ id: m.id, type: "musician", name: m.name, instrument: m.instrument })));
  return { meta: { synthetic: true, seed, note: "Randomly generated sample scene. Every name and number is fictional." }, artists, links };
}
