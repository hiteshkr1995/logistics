/**
 * Isometric (2:1 dimetric) projection helpers.
 *
 * World space: x → east, y → south, z → up, measured in "tiles".
 * Screen space: SVG user units (px at zoom 1).
 *
 * The ground plane projection is affine, so anything flat (roads, water,
 * parks, route lines, labels) can be drawn in world coordinates inside a
 * <g transform={GROUND}> group. Vertical faces use the faceS / faceE planes.
 */
import type { ReactNode } from 'react';

export const U = 18; // px per world tile

export type V2 = [number, number];

export const P = (x: number, y: number, z = 0): V2 => [(x - y) * U, ((x + y) * U) / 2 - z * U];

const r1 = (n: number) => Math.round(n * 10) / 10;

export const pts = (...ps: V2[]) => ps.map(([a, b]) => `${r1(a)},${r1(b)}`).join(' ');

const mtx = (a: number, b: number, c: number, d: number, e: number, f: number) =>
  `matrix(${a} ${b} ${c} ${d} ${r1(e)} ${r1(f)})`;

/** World ground plane (z = 0) → screen. */
export const GROUND = mtx(U, U / 2, -U, U / 2, 0, 0);
/** Horizontal plane at height z. Local coords = world (x, y). */
export const topAt = (z: number) => {
  const [e, f] = P(0, 0, z);
  return mtx(U, U / 2, -U, U / 2, e, f);
};
/** Vertical plane y = const (south-facing, left visible face). Local = (x, -z). */
export const faceS = (y: number, z = 0) => {
  const [e, f] = P(0, y, z);
  return mtx(U, U / 2, 0, U, e, f);
};
/** Vertical plane x = const (east-facing, right visible face). Local = (y, -z). */
export const faceE = (x: number, z = 0) => {
  const [e, f] = P(x, 0, z);
  return mtx(-U, U / 2, 0, U, e, f);
};

export interface Shade {
  top: string;
  left: string;
  right: string;
}

interface BoxProps {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  z0?: number;
  z1: number;
  c: Shade;
  /** Optional fills (e.g. window patterns) for the two visible walls. */
  fillL?: string;
  fillR?: string;
  children?: ReactNode;
}

/** An extruded axis-aligned box. Only the three faces visible from the SE are drawn. */
export function Box({ x0, y0, x1, y1, z0 = 0, z1, c, fillL, fillR, children }: BoxProps) {
  return (
    <>
      <polygon points={pts(P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1))} fill={fillL ?? c.left} />
      <polygon points={pts(P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1))} fill={fillR ?? c.right} />
      <polygon
        className="bx-top"
        points={pts(P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1))}
        fill={c.top}
      />
      {children}
    </>
  );
}

/** Screen-space radii of a ground circle of radius r. */
export const ellR = (r: number): V2 => [r * U * Math.SQRT2, (r * U * Math.SQRT2) / 2];

interface CylProps {
  x: number;
  y: number;
  r: number;
  z0: number;
  z1: number;
  fill: string;
  top?: string;
  className?: string;
}

/** Vertical cylinder. */
export function Cyl({ x, y, r, z0, z1, fill, top, className }: CylProps) {
  const [cx, yb] = P(x, y, z0);
  const [, yt] = P(x, y, z1);
  const [rx, ry] = ellR(r);
  return (
    <g className={className}>
      <path
        d={`M${r1(cx - rx)} ${r1(yt)}L${r1(cx - rx)} ${r1(yb)}A${r1(rx)} ${r1(ry)} 0 0 0 ${r1(cx + rx)} ${r1(yb)}L${r1(cx + rx)} ${r1(yt)}Z`}
        fill={fill}
      />
      {top && <ellipse cx={r1(cx)} cy={r1(yt)} rx={r1(rx)} ry={r1(ry)} fill={top} />}
    </g>
  );
}

/** Half-ellipsoid dome sitting at height z. */
export function Dome({ x, y, r, z, h, fill }: { x: number; y: number; r: number; z: number; h: number; fill: string }) {
  const [cx, cy] = P(x, y, z);
  const [rx, ry] = ellR(r);
  const hh = h * U;
  return (
    <path
      d={`M${r1(cx - rx)} ${r1(cy)}A${r1(rx)} ${r1(hh)} 0 0 1 ${r1(cx + rx)} ${r1(cy)}A${r1(rx)} ${r1(ry)} 0 0 1 ${r1(cx - rx)} ${r1(cy)}Z`}
      fill={fill}
    />
  );
}

/** Dome rib lines (meridians + one latitude) for glass / copper domes. */
export function DomeRibs({ x, y, r, z, h, stroke }: { x: number; y: number; r: number; z: number; h: number; stroke: string }) {
  const [cx, cy] = P(x, y, z);
  const [rx] = ellR(r);
  const hh = h * U;
  const ribs = [0.62, 0.25].map((k) => (
    <path
      key={k}
      d={`M${r1(cx - rx * k)} ${r1(cy + 0.5)}Q${r1(cx - rx * k * 0.92)} ${r1(cy - hh * 0.9)} ${r1(cx)} ${r1(cy - hh)}Q${r1(cx + rx * k * 0.92)} ${r1(cy - hh * 0.9)} ${r1(cx + rx * k)} ${r1(cy + 0.5)}`}
      fill="none"
      stroke={stroke}
      strokeWidth={0.6}
    />
  ));
  return (
    <g>
      {ribs}
      <path
        d={`M${r1(cx - rx * 0.86)} ${r1(cy - hh * 0.5)}Q${r1(cx)} ${r1(cy - hh * 0.5 + rx * 0.25)} ${r1(cx + rx * 0.86)} ${r1(cy - hh * 0.5)}`}
        fill="none"
        stroke={stroke}
        strokeWidth={0.6}
      />
    </g>
  );
}

/** Four-sided pyramid roof on a rectangle at height z. */
export function Pyramid({ x0, y0, x1, y1, z, h, c }: { x0: number; y0: number; x1: number; y1: number; z: number; h: number; c: Shade }) {
  const apex = P((x0 + x1) / 2, (y0 + y1) / 2, z + h);
  return (
    <>
      <polygon points={pts(P(x0, y1, z), P(x1, y1, z), apex)} fill={c.left} />
      <polygon points={pts(P(x1, y0, z), P(x1, y1, z), apex)} fill={c.right} />
    </>
  );
}
