import { memo, type ReactElement } from 'react';
import { Box, GROUND, P, U, ellR, topAt, type Shade } from './iso';
import { buildings, parkPaths, streets, trees, type Building, type Tree } from './cityGen';
import { landmarkItems, type DrawItem } from './Landmarks';
import {
  CANAL, CANAL_W, HUBS, ISLAND, PARKS, PLAZAS, RIVER, RIVER_W, SIEGES, STERN_R,
} from './world';

/* Building palettes: warm whites, sand, blush, sage, ochre, cool grey, glass, brick */
export const PALS: Shade[] = [
  { top: '#F7F4EE', left: '#EDE7DB', right: '#D3CBBB' },
  { top: '#F3EADB', left: '#EADDC6', right: '#CBBBA0' },
  { top: '#F4E6DC', left: '#EDD4C5', right: '#CFAF9C' },
  { top: '#E9EEEA', left: '#DDE4E0', right: '#BCC8C2' },
  { top: '#F5EDD5', left: '#EFE2BD', right: '#D2C092' },
  { top: '#EDEFF2', left: '#DDE2E8', right: '#B9C2CD' },
  { top: '#DDEAF0', left: '#B9D2DE', right: '#8FAFC2' },
  { top: '#C58A6C', left: '#B5725A', right: '#93583F' },
];
const ROOF = { terra: '#D99C80', green: '#B6D89B' };
const TREE_C = [
  ['#7CBF69', '#9BD385', '#5FA352'],
  ['#6DB35E', '#8DCB78', '#54984A'],
  ['#86C673', '#A6DA8F', '#69AC5B'],
  ['#74B866', '#97CF82', '#5B9E50'],
];

/* Map bounds in screen space (also used by the live layer and camera). */
export const VB = { x: -1000, y: -260, w: 2300, h: 1400 };

function windowPatterns() {
  const out: ReactElement[] = [];
  PALS.forEach((p, i) => {
    const glass = i === 6;
    const tile = (fill: string) =>
      glass ? (
        <>
          <rect width={0.5} height={0.5} fill={fill} />
          <rect y={0.36} width={0.5} height={0.07} fill="rgba(255,255,255,.38)" />
          <rect x={0.46} width={0.04} height={0.5} fill="rgba(60,90,110,.18)" />
        </>
      ) : (
        <>
          <rect width={0.5} height={0.5} fill={fill} />
          <rect x={0.15} y={0.14} width={0.2} height={0.22} rx={0.02} fill="rgba(58,70,82,.30)" />
          <rect x={0.15} y={0.14} width={0.2} height={0.05} fill="rgba(255,255,255,.35)" />
        </>
      );
    out.push(
      <pattern key={`s${i}`} id={`wS${i}`} width={0.5} height={0.5} patternUnits="userSpaceOnUse" patternTransform={`matrix(${U} ${U / 2} 0 ${U} 0 0)`}>
        {tile(p.left)}
      </pattern>,
      <pattern key={`e${i}`} id={`wE${i}`} width={0.5} height={0.5} patternUnits="userSpaceOnUse" patternTransform={`matrix(${-U} ${U / 2} 0 ${U} 0 0)`}>
        {tile(p.right)}
      </pattern>,
    );
  });
  return out;
}

function Defs() {
  return (
    <defs>
      {windowPatterns()}
      <linearGradient id="cylStone" x1="0" x2="1">
        <stop offset="0" stopColor="#F6EEDC" />
        <stop offset=".55" stopColor="#E2D4B4" />
        <stop offset="1" stopColor="#B9A886" />
      </linearGradient>
      <linearGradient id="cylConcrete" x1="0" x2="1">
        <stop offset="0" stopColor="#FAFAF8" />
        <stop offset=".5" stopColor="#E0E2E0" />
        <stop offset="1" stopColor="#A6ACAF" />
      </linearGradient>
      <linearGradient id="cylGold" x1="0" x2="1">
        <stop offset="0" stopColor="#FFE9A6" />
        <stop offset=".5" stopColor="#E9B640" />
        <stop offset="1" stopColor="#A87A1C" />
      </linearGradient>
      <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#FFF0B8" />
        <stop offset=".5" stopColor="#F0C350" />
        <stop offset="1" stopColor="#B88A22" />
      </linearGradient>
      <radialGradient id="domeCopper" cx=".35" cy=".3" r=".8">
        <stop offset="0" stopColor="#B5E0CD" />
        <stop offset=".5" stopColor="#74B39A" />
        <stop offset="1" stopColor="#3D7865" />
      </radialGradient>
      <radialGradient id="domeGlass" cx=".35" cy=".3" r=".8">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset=".45" stopColor="#CBE7F2" />
        <stop offset="1" stopColor="#7FAEC5" />
      </radialGradient>
      <radialGradient id="sphere" cx=".36" cy=".32" r=".75">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset=".35" stopColor="#E6E9EE" />
        <stop offset=".8" stopColor="#A9B1BC" />
        <stop offset="1" stopColor="#89919E" />
      </radialGradient>
    </defs>
  );
}

const polyD = (p: [number, number][]) => p.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');

function Ground() {
  const roadD = (w: number) =>
    streets
      .filter((s) => s.w === w)
      .map((s) => `M${s.a[0]} ${s.a[1]}L${s.b[0]} ${s.b[1]}`)
      .join('');
  const lanes = streets
    .filter((s) => s.lanes)
    .map((s) => {
      const o = s.w / 2 - 0.16;
      return s.a[0] === s.b[0]
        ? `M${s.a[0] - o} ${s.a[1]}L${s.b[0] - o} ${s.b[1]}M${s.a[0] + o} ${s.a[1]}L${s.b[0] + o} ${s.b[1]}`
        : `M${s.a[0]} ${s.a[1] - o}L${s.b[0]} ${s.b[1] - o}M${s.a[0]} ${s.a[1] + o}L${s.b[0]} ${s.b[1] + o}`;
    })
    .join('');
  const thin = roadD(0.9);
  const wide = roadD(1.3);
  return (
    <g transform={GROUND}>
      <rect x={-60} y={-60} width={200} height={180} fill="#ECE8DF" />
      {/* Parks & plazas */}
      {PARKS.map((p) => (
        <rect key={p.id} x={p.r.x0} y={p.r.y0} width={p.r.x1 - p.r.x0} height={p.r.y1 - p.r.y0} rx={0.35} fill="#C2E0A8" stroke="#ADD291" strokeWidth={0.12} />
      ))}
      <path d={parkPaths.map(([a, b]) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`).join('')} stroke="#F1E8D2" strokeWidth={0.26} strokeLinecap="round" fill="none" />
      <rect x={ISLAND.x0} y={ISLAND.y0} width={ISLAND.x1 - ISLAND.x0} height={ISLAND.y1 - ISLAND.y0} fill="#F2EEE5" />
      {PLAZAS.map((p, i) => (
        <rect key={i} x={p.x0} y={p.y0} width={p.x1 - p.x0} height={p.y1 - p.y0} rx={0.2} fill="#F7F4EC" stroke="#E2DBCB" strokeWidth={0.08} />
      ))}
      {HUBS.map((h) => (
        <rect key={h.id} x={h.cell.x0 + 0.5} y={h.cell.y0 + 0.5} width={h.cell.x1 - h.cell.x0 - 1} height={h.cell.y1 - h.cell.y0 - 1} rx={0.2} fill="#E4F4E9" stroke="#B9E5CA" strokeWidth={0.08} />
      ))}
      {/* Spree + Kupfergraben */}
      {[{ p: RIVER, w: RIVER_W }, { p: CANAL, w: CANAL_W }].map(({ p, w }, i) => (
        <g key={i} fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d={polyD(p)} stroke="#D2C9B6" strokeWidth={w + 0.34} />
          <path d={polyD(p)} stroke="#93CADB" strokeWidth={w} />
          <path d={polyD(p)} stroke="#AEDBE7" strokeWidth={w * 0.5} />
          <path d={polyD(p)} stroke="#E4F5F9" strokeWidth={0.06} strokeDasharray="0.5 1.6" />
        </g>
      ))}
      {/* Roads */}
      <g fill="none" strokeLinecap="square">
        <path d={thin} stroke="#CAC5BA" strokeWidth={1.04} />
        <path d={wide} stroke="#CAC5BA" strokeWidth={1.44} />
        <path d={thin} stroke="#D9D5CC" strokeWidth={0.9} />
        <path d={wide} stroke="#D9D5CC" strokeWidth={1.3} />
        <path d={lanes} stroke="#8EC5EA" strokeWidth={0.13} strokeLinecap="butt" />
        <path d={thin + wide} stroke="#F6F3EC" strokeWidth={0.05} strokeDasharray="0.32 0.42" strokeLinecap="butt" />
      </g>
      {/* Großer Stern */}
      <circle cx={SIEGES.x} cy={SIEGES.y} r={STERN_R} fill="none" stroke="#CAC5BA" strokeWidth={0.94} />
      <circle cx={SIEGES.x} cy={SIEGES.y} r={STERN_R} fill="none" stroke="#D9D5CC" strokeWidth={0.8} />
      <circle cx={SIEGES.x} cy={SIEGES.y} r={STERN_R - 0.32} fill="none" stroke="#8EC5EA" strokeWidth={0.1} />
      <circle cx={SIEGES.x} cy={SIEGES.y} r={1.12} fill="#C2E0A8" stroke="#F1E8D2" strokeWidth={0.12} />
    </g>
  );
}

function TreeEl({ t }: { t: Tree }) {
  const [x, y] = P(t.x, t.y, 0);
  const [rx] = ellR(t.r);
  const h = t.r * U * 1.25;
  const c = TREE_C[t.c];
  return (
    <g>
      <ellipse cx={x + rx * 0.35} cy={y + 1} rx={rx * 0.95} ry={rx * 0.42} fill="rgba(60,70,50,.16)" />
      <rect x={x - 0.8} y={y - h * 0.6} width={1.6} height={h * 0.6} fill="#8A6F55" />
      <ellipse cx={x} cy={y - h} rx={rx * 0.86} ry={rx * 0.8} fill={c[2]} />
      <ellipse cx={x - rx * 0.08} cy={y - h - rx * 0.12} rx={rx * 0.78} ry={rx * 0.7} fill={c[0]} />
      <ellipse cx={x - rx * 0.3} cy={y - h - rx * 0.36} rx={rx * 0.34} ry={rx * 0.28} fill={c[1]} />
    </g>
  );
}

function BuildingEl({ b }: { b: Building }) {
  const pal = PALS[b.pal];
  const c = b.roof === 'terra' || b.roof === 'green' ? { ...pal, top: ROOF[b.roof] } : pal;
  return (
    <g>
      <Box x0={b.x0} y0={b.y0} x1={b.x1} y1={b.y1} z1={b.z1} c={c} fillL={`url(#wS${b.pal})`} fillR={`url(#wE${b.pal})`} />
      {b.roof === 'solar' && (
        <g transform={topAt(b.z1)}>
          <rect x={b.x0 + 0.2} y={b.y0 + 0.2} width={(b.x1 - b.x0) * 0.55} height={(b.y1 - b.y0) * 0.45} fill="#4A6077" stroke="#9BB8CC" strokeWidth={0.03} />
        </g>
      )}
      {b.cap && <Box {...b.cap} z0={b.z1} z1={b.z1 + b.cap.h} c={pal} />}
    </g>
  );
}

function Objects() {
  const items: DrawItem[] = [
    ...buildings.map((b, i) => ({ key: (b.x0 + b.x1) / 2 + (b.y0 + b.y1) / 2, cy: (b.y0 + b.y1) / 2, el: <BuildingEl key={`b${i}`} b={b} /> })),
    ...trees.map((t, i) => ({ key: t.x + t.y, cy: t.y, el: <TreeEl key={`t${i}`} t={t} /> })),
    ...landmarkItems,
  ];
  items.sort((a, b) => a.key - b.key || a.cy - b.cy);
  return <g>{items.map((it) => it.el)}</g>;
}

/** The static, non-animated city. Rendered once and composited on its own layer. */
export const StaticMap = memo(function StaticMap() {
  return (
    <svg
      className="map-svg map-svg--static"
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      width={VB.w}
      height={VB.h}
      aria-hidden="true"
      focusable="false"
    >
      <Defs />
      <Ground />
      <Objects />
    </svg>
  );
});

