# Spur — Berlin e-bike delivery landing page

A landing page for a last-mile delivery company in Berlin. The hero is an animated isometric map of the city: electric cargo bikes ride the streets between micro-hubs and drop-offs, past the Brandenburger Tor, Reichstag, Berliner Dom, Fernsehturm, Siegessäule and Oberbaumbrücke.

> "Spur" is a placeholder brand name.

## Tech stack

- [Vite](https://vitejs.dev/) 5, [React](https://react.dev/) 18 and TypeScript
- Plain CSS with design tokens. No CSS framework.
- The map is a custom SVG engine. It uses no map library, 3D library or API key.

## Getting started

You need Node.js 18 or newer.

```bash
npm install
npm run dev       # start the dev server at http://localhost:5173
npm run build     # type-check, then build to dist/
npm run preview   # serve the production build
```

## Page sections

1. **Hero:** an interactive Berlin map. Drag to pan; pinch or ctrl/⌘ + scroll to zoom. Hover the pins and landmarks for labels.
2. **Our Services:** same-day, express, business logistics, last-mile, scheduled and sustainable delivery.
3. **How It Works:** Book, Collect, Deliver.
4. **Coverage:** Mitte, Kreuzberg, Friedrichshain, Prenzlauer Berg, Charlottenburg and Neukölln.
5. **Why Spur:** the core benefits.
6. **For Business:** e-commerce, restaurants, retailers and local businesses.
7. **Final call to action** and **footer**.

The layout adapts to desktop, tablet and phone. Phones get their own map framing. Animations are reduced when the visitor has "reduce motion" turned on.

## Project structure

```
src/
  components/
    map/          # isometric Berlin map engine
      world.ts       # geography: streets, Spree, parks, routes, hubs
      cityGen.ts     # generated buildings, streets and trees
      Landmarks.tsx  # hand-drawn Berlin monuments
      StaticMap.tsx  # static city layer
      LiveLayer.tsx  # animated bikes, routes, pins
      BerlinMap.tsx  # camera: pan, zoom, controls
    sections/     # page sections below the hero
    ui/           # icons, logo, dialogs
  hooks/          # media queries, scroll reveal
  styles/         # global tokens and utilities
```

## Before going live

- **Forms:** booking, partner and contact forms are front-end only. Connect the submit handler in `src/components/ui/DialogProvider.tsx` to your backend.
- **Placeholders:** replace the email, phone, address, social links and legal text with real details.
- **Fonts:** they load from Google Fonts. For GDPR compliance in Germany, consider self-hosting them.
