# ON-SPREE — Berlin e-bike delivery landing page

A landing page for **ON SPREE Logistics UG**, a last-mile e-cargo-bike delivery company in Berlin. The hero is a real-time 3D map of the city: delivery bikes ride the streets between micro-hubs and drop-offs, past the Brandenburger Tor, Reichstag, Berliner Dom, Fernsehturm, Siegessäule and Oberbaumbrücke.

Brand colours come from the ON SPREE logo: cream `#EFEEE0`, Spree blue `#0A7FC7` and black.

## Tech stack

- [Vite](https://vitejs.dev/) 5, [React](https://react.dev/) 18 and TypeScript
- Plain CSS with design tokens. No CSS framework.
- [three.js](https://threejs.org/) for the 3D hero map. It needs no map service or API key.
- If WebGL isn't available, the page falls back to an illustrated SVG version of the map.

## Getting started

You need Node.js 18 or newer.

```bash
npm install
npm run dev       # start the dev server at http://localhost:5173
npm run build     # type-check, then build to dist/
npm run preview   # serve the production build
```

## Page sections

1. **Hero:** an interactive 3D Berlin map. Drag to pan, right-drag or two fingers to rotate, and pinch or ctrl/⌘ + scroll to zoom. Hover the pins and landmarks for labels.
2. **Our Services:** same-day, express, business logistics, last-mile, scheduled and sustainable delivery.
3. **How It Works:** Book, Collect, Deliver.
4. **Coverage:** Mitte, Kreuzberg, Friedrichshain, Prenzlauer Berg, Charlottenburg and Neukölln.
5. **Why ON-SPREE:** the core benefits.
6. **For Business:** e-commerce, restaurants, retailers and local businesses.
7. **Final call to action** and **footer**.

The layout adapts to desktop, tablet and phone. Phones get their own map framing. Animations are reduced when the visitor has "reduce motion" turned on.

## Project structure

```
src/
  components/
    map3d/        # 3D hero map (three.js)
      scene.ts       # lights, live layer: bikes, routes, zone, labels
      city.ts        # ground, streets, Spree, buildings, trees
      landmarks.ts   # 3D Berlin monuments and ON-SPREE hubs
      bikes.ts       # delivery bike model
      Map3D.tsx      # renderer, camera, controls, HTML pins
    map/          # shared Berlin data + SVG fallback map
      world.ts       # geography: streets, Spree, parks, routes, hubs
      cityGen.ts     # generated buildings, streets and trees
      routes.ts      # bike timelines along the routes
    sections/     # page sections below the hero
    ui/           # icons, logo, dialogs
  hooks/          # media queries, scroll reveal
  styles/         # global tokens and utilities
```

## Before going live

- **Forms:** booking, partner and contact forms are front-end only. Connect the submit handler in `src/components/ui/DialogProvider.tsx` to your backend.
- **Placeholders:** replace the email, phone, address, social links and legal text with real details.
- **Fonts:** they load from Google Fonts. For GDPR compliance in Germany, consider self-hosting them.
