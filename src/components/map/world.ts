/**
 * Data for the stylised Berlin hero map.
 * Geography is simplified but keeps real relationships: the Spree winds
 * from Oberbaumbrücke (SE) past Museum Island and the Reichstag (NW);
 * Unter den Linden / Straße des 17. Juni link Siegessäule, Brandenburger Tor,
 * Museum Island and Alexanderplatz.
 */
export type Pt = [number, number];
export interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const rect = (x0: number, y0: number, x1: number, y1: number): Rect => ({ x0, y0, x1, y1 });
export const inRect = (r: Rect, x: number, y: number, pad = 0) =>
  x >= r.x0 - pad && x <= r.x1 + pad && y >= r.y0 - pad && y <= r.y1 + pad;

/** Deterministic PRNG so the city looks identical on every load. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* Street grid                                                         */
/* ------------------------------------------------------------------ */
export const XS_CORE = [0, 4.5, 9, 13.5, 17, 21, 25, 30, 35, 40, 45, 50, 55];
export const YS_CORE = [0, 3.5, 7, 14, 18, 22.5, 27, 31.5, 36, 41];
export const XS = [-13.5, -9, -4.5, ...XS_CORE, 60, 65, 70];
export const YS = [-12, -8, -4, ...YS_CORE, 45.5, 50, 54.5];
export const CORE = rect(0, 0, 55, 41);
export const BOULEVARD_Y = 18;

/* ------------------------------------------------------------------ */
/* Water                                                               */
/* ------------------------------------------------------------------ */
export const RIVER: Pt[] = [
  [86, 47], [66, 38.5], [58, 35.2], [50, 32.5], [45, 30], [40, 27], [36, 24.5],
  [33.2, 21.5], [33.3, 18], [33, 14], [31.5, 11.2], [27, 10.2], [22, 9.2],
  [17, 8.8], [10, 9.2], [3, 9.4], [-6, 9], [-26, 10.5],
];
export const RIVER_W = 2.2;
/** Kupfergraben – the western arm that makes Museum Island an island. */
export const CANAL: Pt[] = [[33.2, 21.3], [29.5, 21.2], [27.6, 19.8], [26.7, 17], [26.7, 13.5], [27.6, 11]];
export const CANAL_W = 1.0;

function distSeg(px: number, py: number, a: Pt, b: Pt) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  let t = l2 ? ((px - a[0]) * dx + (py - a[1]) * dy) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy));
}
function distPoly(px: number, py: number, poly: Pt[]) {
  let d = Infinity;
  for (let i = 0; i < poly.length - 1; i++) d = Math.min(d, distSeg(px, py, poly[i], poly[i + 1]));
  return d;
}
export const isWater = (x: number, y: number, pad = 0) =>
  distPoly(x, y, RIVER) < RIVER_W / 2 + pad || distPoly(x, y, CANAL) < CANAL_W / 2 + pad;

/* ------------------------------------------------------------------ */
/* Parks, plazas, special areas                                        */
/* ------------------------------------------------------------------ */
export interface Park {
  id: string;
  r: Rect;
  density: number; // tree density 0..1
}
export const PARKS: Park[] = [
  { id: 'tiergarten', r: rect(-3.5, 14.5, 16.5, 22), density: 0.85 },
  { id: 'volkspark', r: rect(45.5, 4, 54.5, 13.5), density: 0.8 },
  { id: 'goerli', r: rect(40.5, 36.5, 44.5, 40.5), density: 0.28 },
  { id: 'republik', r: rect(9.5, 10.4, 13, 13.5), density: 0.12 },
  { id: 'lustgarten', r: rect(27.9, 14.4, 29.2, 17.5), density: 0.18 },
];
export const inPark = (x: number, y: number, pad = 0) => PARKS.some((p) => inRect(p.r, x, y, pad));

export const SIEGES = { x: 9, y: 18 };
export const STERN_R = 1.6; // Großer Stern roundabout radius

export const PLAZAS: Rect[] = [
  rect(17.4, 15.4, 20.6, 22), // Pariser Platz
  rect(35.5, 14.4, 39.5, 21.9), // Alexanderplatz
];

export const ISLAND = rect(27.3, 11.4, 32.6, 21); // Museum Island

export const LANDMARK_RECTS: Rect[] = [
  rect(17.5, 16.2, 18.7, 19.8), // Brandenburger Tor
  rect(13.8, 10.5, 16.7, 13.5), // Reichstag
  rect(43.9, 27.3, 46.5, 32.7), // Oberbaumbrücke
  ISLAND,
  ...PLAZAS,
];

/** Reserved cells with custom content (hubs, Potsdamer Platz, Alex slab). */
export interface Hub {
  id: string;
  name: string;
  cell: Rect;
  box: Rect;
}
export const HUBS: Hub[] = [
  { id: 'mitte', name: 'Mitte', cell: rect(21, 22.5, 25, 27), box: rect(21.6, 23.1, 24.5, 25.5) },
  { id: 'kreuzberg', name: 'Kreuzberg', cell: rect(35, 31.5, 40, 36), box: rect(35.7, 32.6, 38.5, 35) },
  { id: 'friedrichshain', name: 'Friedrichshain', cell: rect(45, 18, 50, 22.5), box: rect(45.6, 18.6, 48.5, 20.5) },
  { id: 'prenzlauer', name: 'Prenzlauer Berg', cell: rect(40, 3.5, 45, 7), box: rect(40.6, 4.1, 43.5, 6) },
];
export const POTSDAMER_CELL = rect(17, 22.5, 21, 27);
export const ALEX_SLAB_CELL = rect(40, 14, 45, 18);
export const RESERVED: Rect[] = [...HUBS.map((h) => h.cell), POTSDAMER_CELL, ALEX_SLAB_CELL];

/** Oberbaumbrücke deck — bikes riding across it are lifted to deck height. */
export const BRIDGE_DECK = { r: rect(44, 27.4, 45.6, 32.6), z: 0.6 };

/* ------------------------------------------------------------------ */
/* Delivery routes                                                     */
/* ------------------------------------------------------------------ */
export type BikeVariant = 'cargo' | 'rack';
export interface RouteDef {
  id: string;
  pts: Pt[];
  mode: 'pingpong' | 'loop';
  bikes: { phase: number; v: BikeVariant }[];
  show?: boolean;
  dest?: { title: string; sub: string };
  compact?: boolean; // included in the simplified mobile composition
}

export const ROUTES: RouteDef[] = [
  {
    id: 'r1',
    pts: [[23, 22.5], [21, 22.5], [21, 18], [35, 18], [35, 7], [35, 3.5], [38, 3.5]],
    mode: 'pingpong',
    bikes: [{ phase: 0.08, v: 'cargo' }],
    show: true,
    dest: { title: 'Drop-off · Prenzlauer Berg', sub: 'Courier en route from Hub Mitte' },
    compact: true,
  },
  {
    id: 'r2',
    pts: [[25, 27], [35, 27], [35, 31.5], [25, 31.5]],
    mode: 'loop',
    bikes: [{ phase: 0, v: 'rack' }, { phase: 0.5, v: 'cargo' }],
  },
  {
    id: 'r3',
    pts: [[47, 22.5], [45, 22.5], [45, 36], [50, 36]],
    mode: 'pingpong',
    bikes: [{ phase: 0.3, v: 'cargo' }],
    show: true,
    dest: { title: 'Drop-off · Neukölln', sub: 'Via Oberbaumbrücke' },
  },
  {
    id: 'r4',
    pts: [[1, 18], [7.4, 18], [7.87, 19.13], [9, 19.6], [10.13, 19.13], [10.6, 18], [30, 18]],
    mode: 'pingpong',
    bikes: [{ phase: 0.02, v: 'rack' }, { phase: 0.55, v: 'cargo' }],
    compact: true,
  },
  { id: 'r5', pts: [[4.5, 3.5], [30, 3.5]], mode: 'pingpong', bikes: [{ phase: 0.2, v: 'rack' }] },
  { id: 'r6', pts: [[40, 14], [55, 14]], mode: 'pingpong', bikes: [{ phase: 0.6, v: 'cargo' }], compact: true },
  {
    id: 'r7',
    pts: [[37.5, 36], [25, 36], [25, 41]],
    mode: 'pingpong',
    bikes: [{ phase: 0.15, v: 'rack' }],
    show: true,
    dest: { title: 'Drop-off · Kreuzberg', sub: 'Scheduled delivery window' },
  },
  { id: 'r8', pts: [[13.5, 22.5], [21, 22.5], [21, 27], [13.5, 27]], mode: 'loop', bikes: [{ phase: 0.4, v: 'cargo' }] },
  { id: 'r9', pts: [[9, 22.5], [9, 36], [21, 36]], mode: 'pingpong', bikes: [{ phase: 0.7, v: 'rack' }] },
  { id: 'r10', pts: [[9, 7], [35, 7]], mode: 'pingpong', bikes: [{ phase: 0.35, v: 'cargo' }], compact: true },
  {
    id: 'r11',
    pts: [[37.5, 31.5], [40, 31.5], [40, 7], [42.5, 7]],
    mode: 'pingpong',
    bikes: [{ phase: 0.5, v: 'rack' }],
    show: true,
    dest: { title: 'Hub transfer · Prenzlauer Berg', sub: 'Restocking the micro-hub' },
    compact: true,
  },
];

/** Extra customer pins not tied to an animated route. */
export const EXTRA_DROPS: { x: number; y: number; title: string; sub: string }[] = [
  { x: 4.5, y: 27, title: 'Drop-off · Charlottenburg', sub: 'Delivered by e-cargo bike' },
  { x: 50, y: 14, title: 'Drop-off · Friedrichshain', sub: 'Same-day delivery' },
];

/** Neighbourhood labels painted on the ground plane. */
export const DISTRICT_LABELS: { x: number; y: number; text: string; compact?: boolean }[] = [
  { x: 1, y: 21.2, text: 'TIERGARTEN' },
  { x: 19.5, y: 12.6, text: 'MITTE', compact: true },
  { x: 33.5, y: 1.6, text: 'PRENZLAUER BERG' },
  { x: 45.6, y: 25.6, text: 'FRIEDRICHSHAIN' },
  { x: 26, y: 34.4, text: 'KREUZBERG' },
  { x: 46.2, y: 40.6, text: 'NEUKÖLLN' },
  { x: -12, y: 24.4, text: 'CHARLOTTENBURG' },
];

/** Landmark hotspots (white dots) shown on top of each monument. */
export const LANDMARKS: { id: string; x: number; y: number; z: number; title: string; sub: string }[] = [
  { id: 'gate', x: 18.1, y: 18, z: 3.75, title: 'Brandenburger Tor', sub: 'Brandenburg Gate · Pariser Platz' },
  { id: 'reichstag', x: 15.25, y: 11.75, z: 2.6, title: 'Reichstag', sub: 'Platz der Republik' },
  { id: 'dom', x: 30.75, y: 16, z: 4.35, title: 'Berliner Dom', sub: 'Berlin Cathedral · Museum Island' },
  { id: 'tv', x: 37.5, y: 16, z: 13.6, title: 'Fernsehturm', sub: 'TV Tower · Alexanderplatz' },
  { id: 'sieges', x: 9, y: 18, z: 6.05, title: 'Siegessäule', sub: 'Victory Column · Großer Stern' },
  { id: 'oberbaum', x: 46, y: 30.05, z: 3.75, title: 'Oberbaumbrücke', sub: 'Oberbaum Bridge · Spree' },
];

/** Zone highlighted with the glowing "service area" ring. */
export const MITTE_ZONE = { x: 25, y: 19, r: 7.5 };
