/**
 * Procedural (but deterministic) generation of streets, Berlin-style
 * perimeter blocks and trees around the hand-placed landmarks.
 */
import {
  BOULEVARD_Y, CORE, HUBS, LANDMARK_RECTS, PARKS, PLAZAS, RESERVED, ROUTES, SIEGES, STERN_R,
  XS, YS, inPark, inRect, isWater, mulberry32, type Pt, type Rect,
} from './world';

export interface Street {
  a: Pt;
  b: Pt;
  w: number;
  lanes: boolean;
}
export interface Building {
  kind: 'box';
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  z1: number;
  pal: number;
  roof: 'terra' | 'green' | 'solar' | null;
  cap?: { x0: number; y0: number; x1: number; y1: number; h: number };
}
export interface Tree {
  kind: 'tree';
  x: number;
  y: number;
  r: number;
  c: number;
}

const snap = (v: number) => Math.round(v * 2) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------------- Streets ---------------- */

interface Seg {
  a: Pt;
  b: Pt;
}
const forced: Seg[] = [];
for (const r of ROUTES) {
  const p = r.pts;
  for (let i = 0; i < p.length - 1; i++) forced.push({ a: p[i], b: p[i + 1] });
  if (r.mode === 'loop') forced.push({ a: p[p.length - 1], b: p[0] });
}
forced.push({ a: [9, 14], b: [9, 22.5] }); // Hofjägerallee through Tiergarten

const onForced = (a: Pt, b: Pt) =>
  forced.some((f) => {
    const vertical = a[0] === b[0];
    if (vertical && f.a[0] === f.b[0] && f.a[0] === a[0]) {
      const lo = Math.min(f.a[1], f.b[1]);
      const hi = Math.max(f.a[1], f.b[1]);
      return Math.min(a[1], b[1]) >= lo - 1e-6 && Math.max(a[1], b[1]) <= hi + 1e-6;
    }
    if (!vertical && f.a[1] === f.b[1] && f.a[1] === a[1]) {
      const lo = Math.min(f.a[0], f.b[0]);
      const hi = Math.max(f.a[0], f.b[0]);
      return Math.min(a[0], b[0]) >= lo - 1e-6 && Math.max(a[0], b[0]) <= hi + 1e-6;
    }
    return false;
  });

function keepEdge(a: Pt, b: Pt) {
  if (onForced(a, b)) return true;
  let water = 0;
  for (let i = 0; i <= 4; i++) {
    const t = 0.1 + (i / 4) * 0.8;
    const x = lerp(a[0], b[0], t);
    const y = lerp(a[1], b[1], t);
    if (LANDMARK_RECTS.some((r) => inRect(r, x, y, 0.05))) return false;
    if (PARKS.some((p) => inRect(p.r, x, y, -0.05))) return false;
    if (isWater(x, y)) water++;
  }
  return water < 3;
}

export const streets: Street[] = [];
for (const x of XS) {
  for (let j = 0; j < YS.length - 1; j++) {
    const a: Pt = [x, YS[j]];
    const b: Pt = [x, YS[j + 1]];
    if (keepEdge(a, b)) streets.push({ a, b, w: 0.9, lanes: onForced(a, b) });
  }
}
for (const y of YS) {
  if (y === BOULEVARD_Y) continue;
  for (let i = 0; i < XS.length - 1; i++) {
    const a: Pt = [XS[i], y];
    const b: Pt = [XS[i + 1], y];
    if (keepEdge(a, b)) streets.push({ a, b, w: 0.9, lanes: onForced(a, b) });
  }
}
// Unter den Linden / Straße des 17. Juni — one continuous boulevard.
streets.push({ a: [XS[0], BOULEVARD_Y], b: [XS[XS.length - 1], BOULEVARD_Y], w: 1.3, lanes: true });

/* ---------------- Buildings ---------------- */

const rng = mulberry32(20261111);
const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)];

const MITTE = { x0: 13.5, y0: 0, x1: 40, y1: 27 };

function blocked(x: number, y: number) {
  return (
    isWater(x, y, 0.25) ||
    inPark(x, y, 0.1) ||
    LANDMARK_RECTS.some((r) => inRect(r, x, y, 0.15)) ||
    RESERVED.some((r) => inRect(r, x, y, -0.2))
  );
}
function boxOk(b: Rect) {
  if (b.x1 - b.x0 < 0.8 || b.y1 - b.y0 < 0.8) return false;
  const probe: Pt[] = [
    [b.x0 + 0.05, b.y0 + 0.05], [b.x1 - 0.05, b.y0 + 0.05], [b.x0 + 0.05, b.y1 - 0.05],
    [b.x1 - 0.05, b.y1 - 0.05], [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2],
  ];
  return !probe.some(([x, y]) => blocked(x, y));
}

export const buildings: Building[] = [];
export const trees: Tree[] = [];

function addBuilding(r: Rect, h: number, detailed: boolean, palette?: number) {
  if (!boxOk(r)) return false;
  const roll = rng();
  const roof: Building['roof'] = !detailed
    ? null
    : roll < 0.2 ? 'terra' : roll < 0.3 ? 'green' : roll < 0.4 ? 'solar' : null;
  const b: Building = { kind: 'box', ...r, z1: h, pal: palette ?? Math.floor(rng() * 6), roof };
  if (detailed && roof !== 'solar' && rng() < 0.28 && r.x1 - r.x0 > 1.2 && r.y1 - r.y0 > 1.2) {
    const cx = lerp(r.x0 + 0.3, r.x1 - 0.7, rng());
    const cy = lerp(r.y0 + 0.3, r.y1 - 0.7, rng());
    b.cap = { x0: cx, y0: cy, x1: cx + 0.4, y1: cy + 0.4, h: 0.25 };
  }
  buildings.push(b);
  return true;
}

for (let i = 0; i < XS.length - 1; i++) {
  for (let j = 0; j < YS.length - 1; j++) {
    const cx = (XS[i] + XS[i + 1]) / 2;
    const cy = (YS[j] + YS[j + 1]) / 2;
    if (RESERVED.some((r) => inRect(r, cx, cy))) continue;
    const linden = XS[i] >= 17 && XS[i + 1] <= 35;
    const bx0 = XS[i] + 0.5;
    const bx1 = XS[i + 1] - 0.5;
    const by0 = YS[j] + 0.5 + (linden && YS[j] === BOULEVARD_Y ? 0.5 : 0);
    const by1 = YS[j + 1] - 0.5 - (linden && YS[j + 1] === BOULEVARD_Y ? 0.5 : 0);
    const w = bx1 - bx0;
    const d = by1 - by0;
    const detailed = inRect(CORE, cx, cy, 2);
    const mitte = inRect(MITTE as Rect, cx, cy);
    const hs = !detailed ? [1.5, 2, 2] : mitte ? [2, 2, 2.5, 2.5, 3] : [1.5, 2, 2, 2.5];
    const baseH = pick(hs);
    const pal = Math.floor(rng() * 6);

    // Occasional modern office tower in Mitte
    if (mitte && detailed && rng() < 0.1 && w >= 2.5 && d >= 2.5) {
      addBuilding({ x0: bx0, y0: by0, x1: bx1, y1: by1 }, 1, true, pal);
      addBuilding({ x0: snap(bx0 + w * 0.25), y0: snap(by0 + d * 0.2), x1: bx1 - 0.5, y1: by1 - 0.5 }, pick([3.5, 4, 4.5]), true, 6);
      continue;
    }

    if (w >= 3 && d >= 3 && rng() < 0.68) {
      // Berliner Block: perimeter block with an inner courtyard
      const dw = w >= 4.5 && d >= 4.5 ? 1.5 : 1;
      const wings: Rect[] = [
        { x0: bx0, y0: by0, x1: bx1, y1: by0 + dw },
        { x0: bx0, y0: by0 + dw, x1: bx0 + dw, y1: by1 - dw },
        { x0: bx1 - dw, y0: by0 + dw, x1: bx1, y1: by1 - dw },
        { x0: bx0, y0: by1 - dw, x1: bx1, y1: by1 },
      ];
      for (const wing of wings) {
        const long = Math.max(wing.x1 - wing.x0, wing.y1 - wing.y0);
        if (long > 3 && rng() < 0.55) {
          const horizontal = wing.x1 - wing.x0 >= wing.y1 - wing.y0;
          const cut = snap(horizontal ? lerp(wing.x0 + 1, wing.x1 - 1, rng()) : lerp(wing.y0 + 1, wing.y1 - 1, rng()));
          const a = horizontal ? { ...wing, x1: cut } : { ...wing, y1: cut };
          const b = horizontal ? { ...wing, x0: cut } : { ...wing, y0: cut };
          addBuilding(a, baseH, detailed, pal);
          addBuilding(b, Math.max(1.5, baseH + pick([-0.5, 0, 0.5])), detailed);
        } else {
          addBuilding(wing, baseH, detailed, pal);
        }
      }
      const cw = w - 2 * dw;
      const cd = d - 2 * dw;
      if (detailed && cw >= 1 && cd >= 1) {
        const tx = (bx0 + bx1) / 2;
        const ty = (by0 + by1) / 2;
        if (!blocked(tx, ty)) trees.push({ kind: 'tree', x: tx, y: ty, r: 0.42 + rng() * 0.12, c: Math.floor(rng() * 4) });
      }
    } else {
      // Split block into 2–3 buildings of varying height
      const horizontal = w >= d;
      const n = (horizontal ? w : d) >= 3.5 ? pick([2, 3]) : pick([1, 2]);
      let start = horizontal ? bx0 : by0;
      const end = horizontal ? bx1 : by1;
      for (let k = 0; k < n; k++) {
        const stop = k === n - 1 ? end : snap(start + (end - start) / (n - k) + pick([-0.5, 0, 0.5]));
        const gap = k < n - 1 && rng() < 0.25 ? 0.5 : 0;
        const r: Rect = horizontal
          ? { x0: start, y0: by0, x1: stop - gap, y1: by1 }
          : { x0: bx0, y0: start, x1: bx1, y1: stop - gap };
        addBuilding(r, Math.max(1.5, baseH + pick([-0.5, 0, 0, 0.5])), detailed);
        start = stop;
      }
    }
  }
}

/* ---------------- Trees ---------------- */

const tPaths: [Pt, Pt][] = [
  [[SIEGES.x, SIEGES.y], [16.5, 14.5]],
  [[SIEGES.x, SIEGES.y], [16.5, 22]],
  [[SIEGES.x, SIEGES.y], [1.5, 14.5]],
  [[SIEGES.x, SIEGES.y], [1, 22]],
  [[-3.5, 16.2], [16.5, 16.2]],
];
export const parkPaths = tPaths;

function nearLine(x: number, y: number, a: Pt, b: Pt, d: number) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l2 = dx * dx + dy * dy;
  const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / l2));
  return Math.hypot(x - (a[0] + t * dx), y - (a[1] + t * dy)) < d;
}

for (const park of PARKS) {
  const { r } = park;
  for (let x = r.x0 + 0.45; x < r.x1 - 0.2; x += 0.9) {
    for (let y = r.y0 + 0.45; y < r.y1 - 0.2; y += 0.9) {
      if (rng() > park.density) continue;
      const tx = x + (rng() - 0.5) * 0.5;
      const ty = y + (rng() - 0.5) * 0.5;
      if (isWater(tx, ty, 0.2)) continue;
      if (Math.abs(ty - BOULEVARD_Y) < 1.05 || (park.id === 'tiergarten' && Math.abs(tx - 9) < 0.8)) continue;
      if (Math.hypot(tx - SIEGES.x, ty - SIEGES.y) < STERN_R + 0.9) continue;
      if (park.id === 'tiergarten' && tPaths.some(([a, b]) => nearLine(tx, ty, a, b, 0.32))) continue;
      if (LANDMARK_RECTS.some((lr) => inRect(lr, tx, ty, 0.3))) continue;
      trees.push({ kind: 'tree', x: tx, y: ty, r: 0.36 + rng() * 0.2, c: Math.floor(rng() * 4) });
    }
  }
}

// Linden trees along Unter den Linden
for (let x = 21.4; x < 26; x += 0.85) {
  for (const y of [BOULEVARD_Y - 1.05, BOULEVARD_Y + 1.05]) {
    if (!isWater(x, y, 0.3)) trees.push({ kind: 'tree', x, y, r: 0.32, c: 1 });
  }
}
// A few trees around plazas and hub yards
for (const p of PLAZAS) {
  for (let x = p.x0 + 0.4; x < p.x1; x += 1.2) {
    for (const y of [p.y0 + 0.35, p.y1 - 0.35]) {
      if (Math.abs(y - BOULEVARD_Y) > 1 && !LANDMARK_RECTS.slice(0, 3).some((lr) => inRect(lr, x, y, 0.3)) && rng() < 0.7)
        trees.push({ kind: 'tree', x, y, r: 0.3, c: 2 });
    }
  }
}
for (const h of HUBS) {
  const { cell, box } = h;
  for (let x = cell.x0 + 0.85; x < cell.x1 - 0.6; x += 1.1) {
    const y = cell.y1 - 0.85;
    if (y > box.y1 + 0.4) trees.push({ kind: 'tree', x, y, r: 0.3, c: 3 });
  }
}
