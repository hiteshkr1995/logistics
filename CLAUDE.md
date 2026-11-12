# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page marketing site for "Spur", a Berlin e-cargo-bike delivery company. "Spur" is a placeholder brand name. The stack is Vite 5, React 18 and TypeScript, with plain CSS (no CSS framework). The only runtime dependencies are `react` and `react-dom`. Don't add map, 3D or animation libraries: the hero map is a custom SVG engine.

## Commands

```bash
npm run dev       # Vite dev server (port 5173; falls back to 5174+ if taken)
npm run build     # tsc --noEmit (strict, noUnusedLocals/Parameters) then vite build
npm run preview   # serve dist/
npx tsc --noEmit  # type-check only
```

There are no tests or linter. `.claude/launch.json` defines a `spur-dev` preview config.

## Architecture

`src/App.tsx` composes `Navbar`, `Hero`, the sections in `components/sections/` and `Footer`, all inside `DialogProvider`.

- **Dialogs:** every CTA in the site opens one native `<dialog>` through `useOpenDialog()(mode)`. The modes are booking, partner, team, privacy, terms and imprint. Form submit is front-end only (`submit` in `components/ui/DialogProvider.tsx`) and still needs wiring to a backend.
- **Scroll reveal:** `useReveal()` adds `.is-in` to any `[data-reveal]` element once it scrolls into view. Set `--rd` inline for a stagger delay.
- **CSS:** `src/styles/global.css` holds the design tokens (`--green`, `--ink`, `--paper`, the fonts, the easing curves) plus buttons and other utilities. Each component imports its own CSS file, and every file is global (no modules). `main.tsx` imports `global.css` before `App`, so component rules win over global ones of equal specificity. Keep that import order.
- **Shared keyframes:** keyframes like `rise`, `float` and `route-draw` are defined once (in hero.css and map.css) and reused by other files.

### Hero map engine (`src/components/map/`)

The map is an isometric (2:1 dimetric) illustration of Berlin. It reads across several files:

- **`iso.tsx`: projection.** World space is x east, y south and z up, in tiles. `U` (18) is the number of px per tile, and `P(x,y,z)` maps world to screen. Anything flat goes inside `<g transform={GROUND}>` and is drawn in world units. Vertical art uses the `faceS(y)` and `faceE(x)` plane transforms, with local coordinates (axis, -z). Only the south (left) and east (right) faces are visible. Primitives: `Box`, `Cyl`, `Dome`, `DomeRibs`, `Pyramid`.
- **`world.ts`: hand-authored geography.** It holds the street grid (`XS`/`YS`; `CORE` is the detailed area), the Spree and canal polylines, parks, plazas, landmark and reserved rectangles (hubs, Potsdamer Platz), bike `ROUTES`, the bridge deck height, labels and hotspots. Edit this file to move things around.
- **`cityGen.ts`: deterministic generation** (seeded `mulberry32`) of streets, perimeter blocks and trees, run at module load.
  - A grid edge becomes a street unless it crosses a park, landmark or water. Every route segment is always forced to be a street.
  - Building lots are rejected by `blocked()`, which checks water, parks, landmarks and reserved cells.
  - Coordinates snap to 0.5 so the window patterns line up.
- **`Landmarks.tsx`:** the six hand-drawn monuments, plus museums and hubs, each exported as a `DrawItem` with a depth key.
- **`StaticMap.tsx`:** renders defs (window patterns per palette, gradients), the ground layer, then every building, tree and landmark sorted by depth (`x + y`, then `y`). It's memoized and rendered once. `VB` is the shared SVG viewBox.
- **`LiveLayer.tsx`:** a second SVG with the same `VB`, holding the service zone, ground labels, route lines, bikes and pins.
  - Bikes move in a rAF loop that writes `transform` attributes directly. There are no React re-renders per frame, and the loop pauses when the map is off-screen or the tab is hidden.
  - `BikeSprite` is a side-view drawing, sheared onto the direction of travel with `matrix((dx-dy)*s, (dx+dy)/2*s, 0, …)`.
- **`routes.ts`:** turns a route into a timeline: right-hand lane offset, a U-turn plus pause at the ends of ping-pong routes, and z lifted on the bridge deck.
- **`BerlinMap.tsx`:** the camera.
  - It sets a CSS transform on a stage div containing both SVGs. Pan by pointer drag with inertia, pinch, ctrl/⌘ + wheel, keyboard or the control buttons, clamped by `BOUNDS`.
  - `framing()` sets the initial view for each layout (`desktop` ≥1024px overlay, `stacked` tablet, `compact` phone). The compact layout also filters routes and labels using their `compact` flags.

Always respect `prefers-reduced-motion`. In JS, check `useReducedMotion()`: with it on, bikes are placed once and SMIL animations are not rendered. In CSS, add overrides in `map.css` and `global.css`.
