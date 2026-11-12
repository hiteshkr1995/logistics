/**
 * Turns route polylines into time-parameterised paths. Bikes keep to the
 * right-hand cycle lane (offset from the street centreline), make a short
 * U-turn + pause at ping-pong ends (handing over the parcel), then return.
 */
import { BRIDGE_DECK, inRect, type Pt, type RouteDef } from './world';

const SPEED = 1.7; // tiles per second
const PAUSE = 1.8; // seconds at each stop
const LANE = 0.26;

interface Seg {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  t0: number;
  dur: number;
  dx: number;
  dy: number;
  rev?: { d0: Pt; d1: Pt };
}
export interface Timeline {
  segs: Seg[];
  total: number;
}

const norm = (x: number, y: number): Pt => {
  const l = Math.hypot(x, y) || 1;
  return [x / l, y / l];
};

export function buildTimeline(r: RouteDef): Timeline {
  const loop: Pt[] = r.mode === 'loop' ? r.pts : [...r.pts, ...r.pts.slice(1, -1).reverse()];
  const n = loop.length;
  const out: { p: Pt; rev?: { d0: Pt; d1: Pt } }[] = [];
  for (let i = 0; i < n; i++) {
    const prev = loop[(i - 1 + n) % n];
    const cur = loop[i];
    const next = loop[(i + 1) % n];
    const d0 = norm(cur[0] - prev[0], cur[1] - prev[1]);
    const d1 = norm(next[0] - cur[0], next[1] - cur[1]);
    const n0: Pt = [-d0[1], d0[0]];
    const n1: Pt = [-d1[1], d1[0]];
    const dot = d0[0] * d1[0] + d0[1] * d1[1];
    if (dot < -0.95) {
      out.push({ p: [cur[0] + n0[0] * LANE, cur[1] + n0[1] * LANE] });
      out.push({ p: [cur[0] + n1[0] * LANE, cur[1] + n1[1] * LANE], rev: { d0, d1 } });
    } else {
      const k = LANE / (1 + (n0[0] * n1[0] + n0[1] * n1[1]));
      out.push({ p: [cur[0] + (n0[0] + n1[0]) * k, cur[1] + (n0[1] + n1[1]) * k] });
    }
  }
  const segs: Seg[] = [];
  let t = 0;
  for (let i = 0; i < out.length; i++) {
    const a = out[i].p;
    const nb = out[(i + 1) % out.length];
    const b = nb.p;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const [dx, dy] = norm(b[0] - a[0], b[1] - a[1]);
    const dur = nb.rev ? PAUSE : len / SPEED;
    segs.push({ ax: a[0], ay: a[1], bx: b[0], by: b[1], t0: t, dur, dx, dy, rev: nb.rev });
    t += dur;
  }
  return { segs, total: t };
}

export interface BikePose {
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
}

export function poseAt(tl: Timeline, time: number): BikePose {
  const tt = ((time % tl.total) + tl.total) % tl.total;
  let lo = 0;
  let hi = tl.segs.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (tl.segs[mid].t0 <= tt) lo = mid;
    else hi = mid - 1;
  }
  const s = tl.segs[lo];
  const f = s.dur ? (tt - s.t0) / s.dur : 0;
  const x = s.ax + (s.bx - s.ax) * f;
  const y = s.ay + (s.by - s.ay) * f;
  let dx = s.dx;
  let dy = s.dy;
  if (s.rev) [dx, dy] = f < 0.5 ? s.rev.d0 : s.rev.d1;
  const z = inRect(BRIDGE_DECK.r, x, y) ? BRIDGE_DECK.z : 0;
  return { x, y, z, dx, dy };
}

/** SVG path (world coords) of the outbound leg, for the glowing route line. */
export const routeD = (r: RouteDef) => r.pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');
