# Liner Notes

A 3D map of who played with whom. Bands are spheres, musicians are diamonds, and
they are linked by band membership, guest appearances and band-to-band
collaborations. It opens on a hand-compiled early rock and metal family tree
(157 acts, about 600 musicians) and can also generate fictional sample scenes or
load your own JSON.

## Run it

You need Node.js 18 or newer.

```bash
npm install
npm run dev        # opens a dev server, usually at http://localhost:5173
```

## Build for hosting

```bash
npm run build      # writes a static site to dist/
npm run preview    # serves dist/ locally to check it
```

`dist/` is plain static files with relative paths, so it can go on any static
host (Netlify, Vercel, GitHub Pages, an S3 bucket) or in a subfolder.

## Project layout

```
src/
  main.jsx                 entry point
  App.jsx                  state, filters and the control rail
  styles.css               all styling, light and dark themes
  components/
    GraphView.jsx          hosts the 3D engine and syncs it with React state
    Notes.jsx              the liner-notes side sheet and path tracing
    DataModal.jsx          switch data, load/download JSON
    Search.jsx, Disc.jsx, Controls.jsx
  engine/
    Engine.js              three.js scene, force layout, picking, labels (no React)
  lib/
    dataset.js             validates data, builds the graph for current filters, shortest path
    generate.js            seeded generator for fictional sample scenes
    utils.js               formatting, storage and colour helpers
  data/
    rock.js                the early rock and metal family tree and its parser
```

## Your own data

Open **Data** in the app to paste or load JSON in this shape:

```json
{
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
}
```

Bands carry the numbers; musicians without numbers inherit them from the bands
they played with. When the data has no `listeners`, the listener-based size,
colour, height and filter options are hidden automatically.

To edit the built-in rock data, change the text block in `src/data/rock.js`.
Each act is one line (`Name | genre code | city | formed-ended | studio albums`),
followed by `+ person; role; years` for members, `~ person; tracks; year; note`
for guests, and `* Act A × Act B; what` for joint releases.

## Notes

- three.js is pinned to 0.128.0, the version the layout and colours were tuned
  on. Newer versions changed colour management and light intensities, so
  upgrading will shift how the scene looks.
- Settings and any data you load are remembered in the browser's localStorage.
