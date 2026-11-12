/**
 * Hand-built isometric Berlin landmarks. Each export returns a depth-sorted
 * item ({ key, el }) so it can be painted in order with the generated city.
 */
import type { ReactElement } from 'react';
import { Box, Cyl, Dome, DomeRibs, P, Pyramid, U, ellR, faceE, faceS, topAt, type Shade } from './iso';
import { HUBS } from './world';
import { BikeSprite } from './BikeSprite';

export interface DrawItem {
  key: number;
  cy: number;
  el: ReactElement;
}

const SAND: Shade = { top: '#F5EBD2', left: '#E8D7B2', right: '#C9B58C' };
const SAND_D: Shade = { top: '#E9DCBE', left: '#D9C69E', right: '#B9A47A' };
const STONE: Shade = { top: '#EEE9DF', left: '#E0D9CB', right: '#BEB4A3' };
const GRANITE: Shade = { top: '#C99183', left: '#B47466', right: '#93584C' };
const BRICK: Shade = { top: '#D58A68', left: '#C46A47', right: '#9F4F31' };
const BRICK_D: Shade = { top: '#B86A4B', left: '#A65A3D', right: '#86452D' };
const CONCRETE: Shade = { top: '#F1F1EE', left: '#E1E2DF', right: '#C2C5C4' };
const ASPHALT: Shade = { top: '#CFCBC2', left: '#C46A47', right: '#9F4F31' };
const UBAHN: Shade = { top: '#FFE07A', left: '#F5C518', right: '#D4A80E' };
const PATINA = '#4E8A76';

const item = (x: number, y: number, el: ReactElement, bias = 0): DrawItem => ({ key: x + y + bias, cy: y, el });

/* ---------------- Brandenburger Tor ---------------- */
function Gate() {
  const x0 = 17.55;
  const x1 = 18.6;
  const y0 = 16.2;
  const y1 = 19.8;
  const cy = 18;
  const colTop = 2.0;
  const colY = [-1.62, -1.04, -0.44, 0.44, 1.04, 1.62].map((d) => cy + d);
  const cols: { x: number; y: number }[] = [];
  for (const x of [17.76, 18.4]) for (const y of colY) cols.push({ x, y });
  cols.sort((a, b) => a.x + a.y - (b.x + b.y));
  return (
    <g className="lm">
      <Box x0={x0 - 0.08} y0={y0 - 0.08} x1={x1 + 0.08} y1={y1 + 0.08} z1={0.18} c={SAND_D} />
      <Box x0={x0} y0={y0} x1={x1} y1={y0 + 0.34} z0={0.18} z1={colTop} c={SAND} />
      {cols.map((c, i) => (
        <Box key={i} x0={c.x - 0.1} y0={c.y - 0.1} x1={c.x + 0.1} y1={c.y + 0.1} z0={0.18} z1={colTop} c={SAND} />
      ))}
      <Box x0={x0} y0={y1 - 0.34} x1={x1} y1={y1} z0={0.18} z1={colTop} c={SAND} />
      <Box x0={x0} y0={y0} x1={x1} y1={y1} z0={colTop} z1={colTop + 0.48} c={SAND} />
      <g transform={faceE(x1)}>
        <rect x={y0} y={-(colTop + 0.16)} width={y1 - y0} height={0.06} fill="#B9A275" />
        {Array.from({ length: 24 }, (_, i) => (
          <rect key={i} x={y0 + 0.08 + i * 0.148} y={-(colTop + 0.38)} width={0.06} height={0.16} fill="#C7B289" />
        ))}
      </g>
      <g transform={faceS(y1)}>
        <rect x={x0} y={-(colTop + 0.16)} width={x1 - x0} height={0.06} fill="#C9B386" />
      </g>
      <Box x0={17.7} y0={16.95} x1={18.45} y1={19.05} z0={colTop + 0.48} z1={colTop + 0.95} c={SAND} />
      <Box x0={17.86} y0={17.62} x1={18.3} y1={18.38} z0={colTop + 0.95} z1={colTop + 1.08} c={SAND_D} />
      {/* Quadriga */}
      <g transform={`${faceE(18.16, colTop + 1.08)} scale(1.45)`} fill={PATINA} stroke="#3B6E5D" strokeWidth={0.012}>
        {[-0.28, -0.14, 0.14, 0.28].map((d) => {
          const x = 18 / 1.45 + d;
          return (
            <g key={d}>
              <ellipse cx={x} cy={-0.17} rx={0.07} ry={0.045} />
              <path d={`M${x - 0.05} -0.15 L${x - 0.055} -0.02 M${x + 0.05} -0.15 L${x + 0.055} -0.02`} stroke={PATINA} strokeWidth={0.025} />
              <path d={`M${x + 0.03} -0.2 L${x + 0.06} -0.31 L${x + 0.1} -0.3 L${x + 0.07} -0.18 Z`} />
            </g>
          );
        })}
        <rect x={18 / 1.45 - 0.07} y={-0.2} width={0.14} height={0.2} />
        <path d={`M${18 / 1.45 - 0.05} -0.2 L${18 / 1.45} -0.48 L${18 / 1.45 + 0.05} -0.2 Z`} />
        <circle cx={18 / 1.45} cy={-0.5} r={0.035} />
        <path d={`M${18 / 1.45 + 0.04} -0.36 L${18 / 1.45 + 0.09} -0.66`} stroke={PATINA} strokeWidth={0.02} />
        <circle cx={18 / 1.45 + 0.09} cy={-0.69} r={0.04} fill="none" stroke={PATINA} strokeWidth={0.02} />
      </g>
    </g>
  );
}

/* ---------------- Reichstag ---------------- */
function Reichstag() {
  const x0 = 13.9;
  const x1 = 16.5;
  const y0 = 10.6;
  const y1 = 13;
  const h = 1.5;
  const towers: [number, number][] = [
    [x0, y0], [x1 - 0.6, y0], [x0, y1 - 0.6], [x1 - 0.6, y1 - 0.6],
  ];
  const portX = [14.7, 14.95, 15.2, 15.45, 15.7, 15.95];
  return (
    <g className="lm">
      <Box x0={x0} y0={y0} x1={x1} y1={y1} z1={h} c={STONE} fillL="url(#wS0)" fillR="url(#wE0)" />
      <g transform={faceS(y1)} fill="#CFC6B3">
        <rect x={x0 + 0.58} y={-h} width={0.04} height={h} />
        <rect x={x1 - 0.62} y={-h} width={0.04} height={h} />
      </g>
      {towers.map(([tx, ty], i) => (
        <Box key={i} x0={tx} y0={ty} x1={tx + 0.6} y1={ty + 0.6} z0={h} z1={h + 0.38} c={STONE} />
      ))}
      {/* Portico */}
      <Box x0={14.55} y0={y1} x1={16.1} y1={y1 + 0.32} z1={0.24} c={STONE} />
      {portX.map((x) => (
        <Box key={x} x0={x - 0.05} y0={y1 + 0.18} x1={x + 0.05} y1={y1 + 0.28} z0={0.24} z1={1.22} c={STONE} />
      ))}
      <Box x0={14.55} y0={y1} x1={16.1} y1={y1 + 0.32} z0={1.22} z1={1.4} c={STONE} />
      <g transform={faceS(y1 + 0.32)}>
        <polygon points="14.55,-1.4 16.1,-1.4 15.325,-1.78" fill="#E4DDCF" />
        <rect x={14.8} y={-1.33} width={1.05} height={0.04} fill="#9E9480" />
      </g>
      {/* Glass dome */}
      <Cyl x={15.2} y={11.8} r={0.52} z0={h} z1={h + 0.22} fill="url(#cylStone)" top="#E7E1D3" />
      <Dome x={15.2} y={11.8} r={0.52} z={h + 0.22} h={0.72} fill="url(#domeGlass)" />
      <DomeRibs x={15.2} y={11.8} r={0.52} z={h + 0.22} h={0.72} stroke="rgba(70,110,130,.55)" />
    </g>
  );
}

/* ---------------- Museum Island ---------------- */
function Dom() {
  const x0 = 29.5;
  const x1 = 32;
  const y0 = 14.5;
  const y1 = 17.5;
  const h = 1.5;
  const t: [number, number][] = [
    [x0, y0], [x1 - 0.6, y0], [x0, y1 - 0.6], [x1 - 0.6, y1 - 0.6],
  ];
  const cx = 30.75;
  const cy = 16;
  return (
    <g className="lm">
      <Box x0={x0} y0={y0} x1={x1} y1={y1} z1={h} c={STONE} fillL="url(#wS3)" fillR="url(#wE3)" />
      <g transform={faceS(y1)}>
        <rect x={30.25} y={-1.5} width={1} height={1.5} fill="#E9E3D7" />
        <path d="M30.45 0 L30.45 -0.75 A0.3 0.3 0 0 1 31.05 -0.75 L31.05 0 Z" fill="#8E8576" />
        <polygon points="30.2,-1.5 31.3,-1.5 30.75,-1.85" fill="#E4DCCC" />
      </g>
      {t.slice(0, 1).map(([tx, ty], i) => (
        <g key={i}>
          <Box x0={tx} y0={ty} x1={tx + 0.6} y1={ty + 0.6} z0={h} z1={h + 0.55} c={STONE} />
          <Dome x={tx + 0.3} y={ty + 0.3} r={0.26} z={h + 0.55} h={0.4} fill="url(#domeCopper)" />
        </g>
      ))}
      <Cyl x={cx} y={cy} r={0.88} z0={h} z1={h + 0.85} fill="url(#cylStone)" top="#E9E1CF" />
      <g opacity={0.5}>
        {[-0.72, -0.36, 0, 0.36, 0.72].map((k) => {
          const [sx, yTop] = P(cx, cy, h + 0.85);
          const [, yBot] = P(cx, cy, h);
          const [rx, ry] = ellR(0.88);
          const off = ry * Math.sqrt(1 - k * k);
          return <rect key={k} x={sx + k * rx - 1.3} y={yTop + off + 3} width={2.6} height={yBot - yTop - 6} fill="#A99D86" rx={1.2} />;
        })}
      </g>
      <Dome x={cx} y={cy} r={0.88} z={h + 0.85} h={1.2} fill="url(#domeCopper)" />
      <DomeRibs x={cx} y={cy} r={0.88} z={h + 0.85} h={1.2} stroke="rgba(40,90,72,.45)" />
      <Cyl x={cx} y={cy} r={0.17} z0={h + 2.02} z1={h + 2.35} fill="url(#cylStone)" top="#E9E1CF" />
      <Dome x={cx} y={cy} r={0.17} z={h + 2.35} h={0.2} fill="url(#domeCopper)" />
      <path d={`M${P(cx, cy, h + 2.55).join(' ')}v-9m-3 3h6`} transform="" stroke="#D9A93A" strokeWidth={1.2} fill="none" />
      {t.slice(1).map(([tx, ty], i) => (
        <g key={i}>
          <Box x0={tx} y0={ty} x1={tx + 0.6} y1={ty + 0.6} z0={h} z1={h + 0.55} c={STONE} />
          <Dome x={tx + 0.3} y={ty + 0.3} r={0.26} z={h + 0.55} h={0.4} fill="url(#domeCopper)" />
        </g>
      ))}
    </g>
  );
}

function AltesMuseum() {
  const cols = Array.from({ length: 9 }, (_, i) => 27.95 + i * 0.17);
  return (
    <g className="lm">
      <Box x0={27.8} y0={12.3} x1={29.5} y1={13.8} z1={1.15} c={SAND} />
      <Box x0={28.3} y0={12.7} x1={29} y1={13.3} z0={1.15} z1={1.45} c={SAND} />
      <g transform={faceS(13.8)}>
        <rect x={27.85} y={-1.05} width={1.6} height={0.85} fill="#C9B58C" />
        {cols.map((x) => (
          <rect key={x} x={x} y={-1.05} width={0.07} height={0.85} fill="#F3E6C8" />
        ))}
      </g>
    </g>
  );
}

function Bode() {
  return (
    <g className="lm">
      <Box x0={30} y0={11.9} x1={32} y1={13.5} z1={1.35} c={STONE} fillL="url(#wS3)" fillR="url(#wE3)" />
      <Cyl x={31.6} y={12.3} r={0.32} z0={1.35} z1={1.6} fill="url(#cylStone)" top="#E9E1CF" />
      <Dome x={31.6} y={12.3} r={0.32} z={1.6} h={0.42} fill="url(#domeCopper)" />
    </g>
  );
}

function HumboldtForum() {
  return (
    <g className="lm">
      <Box x0={28.4} y0={18.7} x1={32} y1={20.5} z1={1.6} c={SAND} fillL="url(#wS4)" fillR="url(#wE4)" />
      <Cyl x={29.2} y={19.6} r={0.38} z0={1.6} z1={1.9} fill="url(#cylStone)" top="#EEE3CA" />
      <Dome x={29.2} y={19.6} r={0.38} z={1.9} h={0.55} fill="url(#domeCopper)" />
    </g>
  );
}

/* ---------------- Fernsehturm ---------------- */
function Fernsehturm() {
  const x = 37.5;
  const y = 16;
  const [bx, by] = P(x, y, 0.45);
  const [, ty] = P(x, y, 8.3);
  const rb = ellR(0.42)[0];
  const rt = ellR(0.26)[0];
  const [sx, sy] = P(x, y, 9.05);
  const R = 0.98 * U * 1.18;
  const [, a0] = P(x, y, 9.9);
  const [, a1] = P(x, y, 10.9);
  const [, a2] = P(x, y, 13.35);
  const segs = 6;
  return (
    <g className="lm lm-tv">
      <Cyl x={x} y={y} r={1.25} z0={0} z1={0.45} fill="url(#cylConcrete)" top="#F4F4F1" />
      <Cyl x={x} y={y} r={1.25} z0={0.12} z1={0.3} fill="#9AA6AE" />
      <ellipse cx={bx} cy={by} rx={rb * 1.6} ry={rb * 0.8} fill="#DADCD9" />
      <path d={`M${bx - rb} ${by} L${bx - rt} ${ty} L${bx + rt} ${ty} L${bx + rb} ${by} Z`} fill="url(#cylConcrete)" />
      {/* Sphere */}
      <circle cx={sx} cy={sy} r={R} fill="url(#sphere)" />
      <path d={`M${sx - R * 0.98} ${sy + 3} A${R} ${R * 0.24} 0 0 0 ${sx + R * 0.98} ${sy + 3}`} stroke="#5D6776" strokeWidth={4} fill="none" />
      <path d={`M${sx - R * 0.98} ${sy + 3} A${R} ${R * 0.24} 0 0 0 ${sx + R * 0.98} ${sy + 3}`} stroke="#8B95A4" strokeWidth={1} fill="none" transform="translate(0 -1.6)" />
      <ellipse cx={sx} cy={sy} rx={R * 0.55} ry={R} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={0.6} />
      <ellipse cx={sx} cy={sy - R * 0.45} rx={R * 0.88} ry={R * 0.2} fill="none" stroke="rgba(120,130,145,.35)" strokeWidth={0.6} />
      <path d={`M${sx - 3.4} ${a0} L${sx - 3.4} ${a1} L${sx + 3.4} ${a1} L${sx + 3.4} ${a0} Z`} fill="url(#cylConcrete)" />
      <ellipse cx={sx} cy={a1} rx={3.4} ry={1.7} fill="#ECEDEB" />
      {Array.from({ length: segs }, (_, i) => {
        const yA = a1 + ((a2 - a1) * i) / segs;
        const yB = a1 + ((a2 - a1) * (i + 1)) / segs;
        const w = 1.7 - i * 0.12;
        return <rect key={i} x={sx - w} y={yB} width={w * 2} height={yA - yB} fill={i % 2 ? '#F7F7F5' : '#E0453A'} />;
      })}
      <circle cx={sx} cy={a2} r={1.4} fill="#FF5B4F" className="lm-beacon" />
    </g>
  );
}

/* ---------------- Siegessäule ---------------- */
function Siegessaeule() {
  const x = 9;
  const y = 18;
  const [vx, vy] = P(x, y, 4.88);
  const bands = [2.1, 3.0, 3.9];
  return (
    <g className="lm">
      <Box x0={x - 0.55} y0={y - 0.55} x1={x + 0.55} y1={y + 0.55} z1={0.5} c={GRANITE} />
      <Cyl x={x} y={y} r={0.46} z0={0.5} z1={1.05} fill="url(#cylStone)" top="#EADFC6" />
      {[-0.6, -0.2, 0.2, 0.6].map((k) => {
        const [cx, cy] = P(x, y, 0.95);
        const [rx] = ellR(0.46);
        return <rect key={k} x={cx + k * rx - 1.1} y={cy - 6} width={2.2} height={6.5} fill="#8F806A" opacity={0.7} rx={1} />;
      })}
      <Cyl x={x} y={y} r={0.27} z0={1.05} z1={4.72} fill="url(#cylStone)" />
      {bands.map((z) => (
        <Cyl key={z} x={x} y={y} r={0.3} z0={z} z1={z + 0.22} fill="url(#cylGold)" />
      ))}
      <Cyl x={x} y={y} r={0.36} z0={4.72} z1={4.88} fill="url(#cylStone)" top="#EFE6D0" />
      <g transform={`translate(${vx} ${vy})`} fill="url(#gold)" className="lm-victoria">
        <path d="M-3 0 L-1.6 -10 L1.6 -10 L3 0 Z" />
        <circle cx={0} cy={-12} r={1.7} />
        <path d="M-1 -9 C-6 -11 -8.5 -16 -6 -20 C-4.6 -16 -2.6 -12.4 0 -10.5 Z" />
        <path d="M1 -9 C6 -11 8.5 -16 6 -20 C4.6 -16 2.6 -12.4 0 -10.5 Z" />
        <path d="M1.2 -10 L4.6 -17" stroke="#D9A93A" strokeWidth={1.1} />
        <circle cx={5} cy={-17.8} r={1.5} fill="none" stroke="#E8B43C" strokeWidth={0.9} />
      </g>
    </g>
  );
}

/* ---------------- Oberbaumbrücke ---------------- */
function Oberbaum() {
  const y0 = 27.4;
  const y1 = 32.6;
  const vx0 = 45.6;
  const vx1 = 46.35;
  const arches = 7;
  const span = (y1 - y0 - 0.4) / arches;
  const upper = 16;
  const uspan = (y1 - y0 - 0.2) / upper;
  const tower = (ty: number) => (
    <g>
      <Box x0={vx0} y0={ty} x1={vx1 + 0.05} y1={ty + 0.62} z1={2.95} c={BRICK} />
      <g transform={faceE(vx1 + 0.05)} fill="#5A2B1B">
        <rect x={ty + 0.24} y={-2.55} width={0.14} height={0.38} rx={0.07} />
        <rect x={ty + 0.24} y={-1.95} width={0.14} height={0.3} rx={0.07} />
      </g>
      {[0, 1, 2].map((i) => (
        <Box key={i} x0={vx1 - 0.05} y0={ty + 0.04 + i * 0.2} x1={vx1 + 0.1} y1={ty + 0.16 + i * 0.2} z0={2.95} z1={3.1} c={BRICK_D} />
      ))}
      <Box x0={vx0 + 0.05} y0={ty + 0.06} x1={vx1} y1={ty + 0.56} z0={2.95} z1={3.08} c={BRICK_D} />
      <Pyramid x0={vx0 + 0.05} y0={ty + 0.06} x1={vx1} y1={ty + 0.56} z={3.08} h={0.55} c={BRICK_D} />
    </g>
  );
  return (
    <g className="lm">
      {/* Road deck */}
      <Box x0={44} y0={y0} x1={vx0} y1={y1} z1={0.6} c={ASPHALT} />
      <g transform={topAt(0.6)}>
        <line x1={44.8} y1={y0} x2={44.8} y2={y1} stroke="#F2EFE8" strokeWidth={0.05} strokeDasharray="0.3 0.3" />
        <line x1={44.25} y1={y0} x2={44.25} y2={y1} stroke="#8EDDB0" strokeWidth={0.12} />
        <line x1={45.35} y1={y0} x2={45.35} y2={y1} stroke="#8EDDB0" strokeWidth={0.12} />
      </g>
      {/* Brick viaduct with arcade + U-Bahn deck */}
      <Box x0={vx0} y0={y0} x1={vx1} y1={y1} z1={1.35} c={BRICK} />
      <g transform={faceE(vx1)}>
        {Array.from({ length: arches }, (_, i) => {
          const a = y0 + 0.2 + i * span;
          return (
            <path
              key={i}
              d={`M${a + 0.06} 0 L${a + 0.06} -0.18 A${span / 2 - 0.06} 0.3 0 0 1 ${a + span - 0.06} -0.18 L${a + span - 0.06} 0 Z`}
              fill="#5C7F8C"
            />
          );
        })}
        {Array.from({ length: upper }, (_, i) => {
          const a = y0 + 0.1 + i * uspan;
          return (
            <path
              key={i}
              d={`M${a + 0.06} -0.72 L${a + 0.06} -1.02 Q${a + uspan / 2} -1.22 ${a + uspan - 0.06} -1.02 L${a + uspan - 0.06} -0.72 Z`}
              fill="#6E3320"
            />
          );
        })}
        <rect x={y0} y={-0.62} width={y1 - y0} height={0.05} fill="#E7B79A" />
      </g>
      {/* U-Bahn train on the upper deck */}
      <Box x0={45.7} y0={27.7} x1={46.22} y1={29.05} z0={1.35} z1={1.78} c={UBAHN} />
      <g transform={faceE(46.22)}>
        {Array.from({ length: 5 }, (_, i) => (
          <rect key={i} x={27.82 + i * 0.25} y={-1.7} width={0.17} height={0.16} fill="#3E4A55" rx={0.03} />
        ))}
      </g>
      {tower(29.3)}
      {tower(30.4)}
    </g>
  );
}

/* ---------------- Potsdamer Platz & Alex ---------------- */
function Potsdamer() {
  return (
    <g className="lm">
      <Box x0={17.5} y0={23} x1={19} y1={24.5} z1={5} c={BRICK_D} fillL="url(#wS7)" fillR="url(#wE7)" />
      <Box x0={17.65} y0={23.15} x1={18.85} y1={24.35} z0={5} z1={5.4} c={BRICK_D} />
      <Box x0={19.4} y0={23} x1={20.5} y1={24.5} z1={5.5} c={STONE} fillL="url(#wS6)" fillR="url(#wE6)" />
      <Box x0={17.5} y0={25} x1={20.5} y1={26.5} z1={2.5} c={STONE} fillL="url(#wS6)" fillR="url(#wE6)" />
    </g>
  );
}

function AlexSlab() {
  return (
    <g className="lm">
      <Box x0={40.5} y0={14.5} x1={45} y1={17.5} z1={1} c={CONCRETE} fillL="url(#wS5)" fillR="url(#wE5)" />
      <Box x0={41} y0={14.5} x1={42.5} y1={17.5} z1={6.5} c={CONCRETE} fillL="url(#wS5)" fillR="url(#wE5)" />
    </g>
  );
}

/* ---------------- Spur micro-hubs ---------------- */
const HUB_SHADE: Shade = { top: '#CFF2DD', left: '#FBFBF8', right: '#E3E5E0' };

function HubBuilding({ i }: { i: number }) {
  const { box: b } = HUBS[i];
  const h = 0.8;
  const parked = [0, 1, 2].map((k) => P(b.x0 + 0.5 + k * 0.55, b.y1 + 0.55, 0));
  return (
    <g className="lm">
      <Box x0={b.x0} y0={b.y0} x1={b.x1} y1={b.y1} z1={h} c={HUB_SHADE} />
      <g transform={faceS(b.y1)}>
        <rect x={b.x0} y={-0.66} width={b.x1 - b.x0} height={0.12} fill="#2BD67B" />
        <rect x={b.x0 + 0.3} y={-0.45} width={0.9} height={0.45} fill="#2D3431" />
        <text x={b.x0 + 1.45} y={-0.18} fontSize={0.28} fontWeight={800} fill="#141816" fontFamily="Inter Tight, Inter, sans-serif">
          SPUR HUB
        </text>
      </g>
      <g transform={faceE(b.x1)}>
        <rect x={b.y0} y={-0.66} width={b.y1 - b.y0} height={0.12} fill="#22B868" />
        {[0.3, 0.9, 1.5].map((o) => (
          <rect key={o} x={b.y0 + o} y={-0.45} width={0.35} height={0.25} fill="#9EC3CF" />
        ))}
      </g>
      <g transform={topAt(h)}>
        {Array.from({ length: 3 }, (_, k) => (
          <rect key={k} x={b.x0 + 0.3 + k * 0.62} y={b.y0 + 0.3} width={0.5} height={b.y1 - b.y0 - 0.6} fill="#3F566B" stroke="#8FB2C9" strokeWidth={0.03} />
        ))}
        <circle cx={b.x1 - 0.55} cy={(b.y0 + b.y1) / 2} r={0.36} fill="#2BD67B" />
        <path
          d={`M${b.x1 - 0.42} ${(b.y0 + b.y1) / 2 - 0.15}c-.1-.12-.3-.16-.45-.06-.25.16.02.33.17.37.2.06.33.2.18.34-.15.13-.4.08-.5-.05`}
          fill="none"
          stroke="#141816"
          strokeWidth={0.06}
          strokeLinecap="round"
        />
      </g>
      {parked.map(([px, py], k) => (
        <g key={k} transform={`translate(${px} ${py}) matrix(0.62 0.31 0 0.78 0 0)`}>
          <BikeSprite v={k % 2 ? 'rack' : 'cargo'} rider={false} />
        </g>
      ))}
    </g>
  );
}

/* ---------------- Assemble ---------------- */
export const landmarkItems: DrawItem[] = [
  item(18.05, 18, <Gate key="gate" />),
  item(15.2, 11.8, <Reichstag key="reichstag" />),
  item(30.75, 16, <Dom key="dom" />),
  item(28.65, 13.05, <AltesMuseum key="altes" />),
  item(31, 12.7, <Bode key="bode" />),
  item(30.2, 19.6, <HumboldtForum key="humboldt" />),
  item(37.5, 16, <Fernsehturm key="tv" />, 1.5),
  item(9, 18, <Siegessaeule key="sieges" />, 1),
  item(45.15, 30, <Oberbaum key="oberbaum" />, 1),
  item(19, 24.75, <Potsdamer key="potsdamer" />),
  item(42.75, 16, <AlexSlab key="alex" />),
  ...HUBS.map((h, i) => item((h.box.x0 + h.box.x1) / 2, (h.box.y0 + h.box.y1) / 2, <HubBuilding key={h.id} i={i} />)),
];

