# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page marketing site for **ON-SPREE** (ON SPREE Logistics UG), a Berlin e-cargo-bike delivery company. The stack is Vite 5, React 18 and TypeScript, with plain CSS (no CSS framework). Runtime dependencies are `react`, `react-dom` and `three` (pinned to 0.169), which powers the 3D hero map.

Brand colours come from the client's logo: cream `#EFEEE0`, Spree blue `#0A7FC7` and black. The client asked for the site not to resemble Uber Eats, so keep green out of brand accents (park greens on the map are fine). The modernised logo lives in `components/ui/Logo.tsx` (`LogoMark`, `Logo`, `LogoBadge`) and in `public/favicon.svg`.

## Commands

```bash
npm run dev       # Vite dev server (port 5173; falls back to 5174+ if taken)
npm run build     # tsc --noEmit (strict, noUnusedLocals/Parameters) then vite build
npm run preview   # serve dist/ under /logistics/
npx tsc --noEmit  # type-check only
```

There are no tests or linter. `.claude/launch.json` defines `spur-dev` (dev) and `spur-preview` (production preview on port 4173; open `/logistics/`).

## Deployment

On every push to `main`, `.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages at `https://hiteshkr1995.github.io/logistics/`. `vite.config.ts` sets `base: '/logistics/'` for `build` and `preview` only, so dev still runs at `/`. Keep asset references root-relative (e.g. `/favicon.svg`); Vite rewrites them.

## Architecture

`src/App.tsx` composes `Navbar`, `Hero`, the sections in `components/sections/` and `Footer`, all inside `DialogProvider`.

- **Dialogs:** every CTA opens one native `<dialog>` through `useOpenDialog()(mode)`. The modes are booking, partner, team, privacy, terms and imprint. Form submit is front-end only (`submit` in `components/ui/DialogProvider.tsx`) and still needs a backend.
- **Scroll reveal:** `useReveal()` adds `.is-in` to any `[data-reveal]` element once it scrolls into view. Set `--rd` inline for a stagger delay.
- **CSS:** `src/styles/global.css` holds the tokens (`--brand*`, `--cream`, `--ink`, `--paper`, the fonts, the easing curves) and utilities like `.btn--primary` and `.glass-btn`. Each component imports its own global (non-module) CSS file. `main.tsx` imports `global.css` before `App`, so component rules win over global ones of equal specificity. Keep that import order.

### Hero map

`Hero.tsx` lazy-loads `map3d/Map3D` as its own chunk. If creating a WebGL renderer fails, `onFail` switches to the older SVG map (`map/BerlinMap`), which is also lazy-loaded. Both maps read the same data in `components/map/`:

- **`world.ts`:** the hand-authored geography: street grid (`XS`/`YS`), Spree and canal polylines, parks, plazas, landmark and reserved rectangles, hubs, bike `ROUTES` (with `compact` flags for phones), hotspot heights, district labels.
- **`cityGen.ts`:** deterministic generation (seeded `mulberry32`) of streets, perimeter blocks and trees. Route segments are always forced to be streets.
- **`routes.ts`:** turns a route into a timeline (right-hand lane offset, U-turn and pause at ping-pong ends, lift onto the Oberbaum bridge deck). `poseAt(timeline, t)` gives a bike's position and heading.

The world-to-three.js axis mapping is: world x → X, world y (south) → Z, height → Y, in tiles.

`map3d/`:
- **`city.ts`:** the static city. Thousands of quads are accumulated by `Builder` (`geometry.ts`) into a few merged meshes with vertex colours: flat layers, walls, roofs. Facade UVs are measured in 0.5-tile cells, so the repeating window texture lines up floor by floor. Trees are `InstancedMesh`es. Rivers are `ribbon()` meshes.
- **`landmarks.ts`:** the six monuments, museums, Potsdamer Platz, the Alex slab and the hubs, built from primitives and `ExtrudeGeometry` (the Oberbaum arches). Facades that need windows go through a shared `Builder`.
- **`scene.ts`:** lighting (hemisphere light, plus a shadow-casting sun that follows the camera target), the RoomEnvironment reflections, the service zone, the hub beam, ground labels, route ribbons, the moving bikes, and marker definitions. `update(t, animate)` runs every frame.
- **`Map3D.tsx`:**
  - Owns the renderer, the camera and `MapControls`. `framing()` sets the initial view for each layout. Desktop uses `setViewOffset` to shift the city right of the hero copy.
  - Plain mouse-wheel events are stopped in the capture phase, so the page scrolls; only ctrl/⌘ + wheel zooms. On touch, `touch-action: pan-y` keeps page scrolling working.
  - Camera tweens drive the buttons, the reset and the entrance fly-in. The render loop pauses when the map is off-screen or the tab is hidden.
  - Pins are HTML buttons projected from 3D every frame, for crisp text and keyboard access.
- **`textures.ts`:** every texture (windows, water, decals, labels) is drawn on a canvas, so there are no image assets.

Always respect `prefers-reduced-motion`: in JS check `useReducedMotion()` (no fly-in, bikes frozen); in CSS add overrides.
