/**
 * Geometry helpers. Many small shapes are accumulated into a few big
 * BufferGeometries so the whole city renders in a handful of draw calls.
 *
 * Axes: world x → three X, world y (south) → three Z, height → three Y.
 */
import * as THREE from 'three';
import type { Pt } from '../map/world';

type V = [number, number, number];

export class Builder {
  pos: number[] = [];
  nor: number[] = [];
  uv: number[] = [];
  col: number[] = [];
  private c = new THREE.Color();

  /** Triangle; vertex order is fixed automatically so the face points along `hint`. */
  tri(a: V, b: V, c: V, hint: V, color: string, uvs?: [number, number][]) {
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    let n: V = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
    let verts = [a, b, c];
    let tuv = uvs;
    if (n[0] * hint[0] + n[1] * hint[1] + n[2] * hint[2] < 0) {
      verts = [a, c, b];
      tuv = uvs ? [uvs[0], uvs[2], uvs[1]] : undefined;
      n = [-n[0], -n[1], -n[2]];
    }
    const l = Math.hypot(n[0], n[1], n[2]) || 1;
    this.c.set(color);
    verts.forEach((v, i) => {
      this.pos.push(v[0], v[1], v[2]);
      this.nor.push(n[0] / l, n[1] / l, n[2] / l);
      this.col.push(this.c.r, this.c.g, this.c.b);
      const t = tuv ? tuv[i] : [0, 0];
      this.uv.push(t[0], t[1]);
    });
  }

  quad(a: V, b: V, c: V, d: V, hint: V, color: string, uvs?: [number, number][]) {
    this.tri(a, b, c, hint, color, uvs && [uvs[0], uvs[1], uvs[2]]);
    this.tri(a, c, d, hint, color, uvs && [uvs[0], uvs[2], uvs[3]]);
  }

  /** Flat horizontal rectangle at height y. */
  rect(x0: number, z0: number, x1: number, z1: number, y: number, color: string) {
    this.quad([x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1], [0, 1, 0], color);
  }

  /**
   * Extruded box. Walls get UVs measured in facade cells (`cell` world
   * units) so a repeating window texture lines up floor by floor.
   */
  box(x0: number, z0: number, x1: number, z1: number, y0: number, y1: number, wall: string, roof?: string, cell = 0.5, roofTarget?: Builder) {
    const u = (a: number, b: number, off: number): [number, number][] => [
      [(off) / cell, y0 / cell], [(off + Math.abs(b - a)) / cell, y0 / cell],
      [(off + Math.abs(b - a)) / cell, y1 / cell], [off / cell, y1 / cell],
    ];
    this.quad([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [0, 0, 1], wall, u(x0, x1, x0));
    this.quad([x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [0, 0, -1], wall, u(x0, x1, x0));
    this.quad([x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [1, 0, 0], wall, u(z0, z1, z0));
    this.quad([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [-1, 0, 0], wall, u(z0, z1, z0));
    (roofTarget ?? this).rect(x0, z0, x1, z1, y1, roof ?? wall);
  }

  /** Pitched (gable) roof with the ridge along the longer side. */
  gable(x0: number, z0: number, x1: number, z1: number, y: number, h: number, color: string, gableColor: string) {
    if (x1 - x0 >= z1 - z0) {
      const zm = (z0 + z1) / 2;
      this.quad([x0, y, z0], [x1, y, z0], [x1, y + h, zm], [x0, y + h, zm], [0, 1, -1], color);
      this.quad([x0, y, z1], [x1, y, z1], [x1, y + h, zm], [x0, y + h, zm], [0, 1, 1], color);
      this.tri([x0, y, z0], [x0, y, z1], [x0, y + h, zm], [-1, 0, 0], gableColor);
      this.tri([x1, y, z0], [x1, y, z1], [x1, y + h, zm], [1, 0, 0], gableColor);
    } else {
      const xm = (x0 + x1) / 2;
      this.quad([x0, y, z0], [x0, y, z1], [xm, y + h, z1], [xm, y + h, z0], [-1, 1, 0], color);
      this.quad([x1, y, z0], [x1, y, z1], [xm, y + h, z1], [xm, y + h, z0], [1, 1, 0], color);
      this.tri([x0, y, z0], [x1, y, z0], [xm, y + h, z0], [0, 0, -1], gableColor);
      this.tri([x0, y, z1], [x1, y, z1], [xm, y + h, z1], [0, 0, 1], gableColor);
    }
  }

  /** Flat strip along a 2D segment (e.g. a road), at height y. */
  strip(a: Pt, b: Pt, w: number, y: number, color: string, extend = 0) {
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const l = Math.hypot(dx, dz) || 1;
    const ux = dx / l;
    const uz = dz / l;
    const nx = -uz * (w / 2);
    const nz = ux * (w / 2);
    const ax = a[0] - ux * extend;
    const az = a[1] - uz * extend;
    const bx = b[0] + ux * extend;
    const bz = b[1] + uz * extend;
    this.quad([ax + nx, y, az + nz], [bx + nx, y, bz + nz], [bx - nx, y, bz - nz], [ax - nx, y, az - nz], [0, 1, 0], color);
  }

  build(withUV = false) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    if (withUV) g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.computeBoundingSphere();
    return g;
  }
}

/**
 * Ribbon along a polyline (rivers, routes). u runs along the line in
 * world units / uScale, v runs 0→1 across it.
 */
export function ribbon(pts: Pt[], width: number, y: number, uScale = 1) {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  let dist = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    if (i > 0) dist += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    let d0x = p[0] - prev[0];
    let d0z = p[1] - prev[1];
    let d1x = next[0] - p[0];
    let d1z = next[1] - p[1];
    const l0 = Math.hypot(d0x, d0z) || 1;
    const l1 = Math.hypot(d1x, d1z) || 1;
    d0x /= l0; d0z /= l0; d1x /= l1; d1z /= l1;
    if (i === 0) { d0x = d1x; d0z = d1z; }
    if (i === pts.length - 1) { d1x = d0x; d1z = d0z; }
    let nx = -(d0z + d1z);
    let nz = d0x + d1x;
    const nl = Math.hypot(nx, nz) || 1;
    nx /= nl; nz /= nl;
    const cos = nx * -d1z + nz * d1x;
    const m = Math.min(2.2, 1 / Math.max(0.35, cos));
    const hw = (width / 2) * m;
    pos.push(p[0] + nx * hw, y, p[1] + nz * hw, p[0] - nx * hw, y, p[1] - nz * hw);
    uv.push(dist / uScale, 1, dist / uScale, 0);
    if (i > 0) {
      const a = (i - 1) * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  // make sure normals point up regardless of winding
  const n = g.getAttribute('normal');
  for (let i = 0; i < n.count; i++) n.setXYZ(i, 0, 1, 0);
  return { geometry: g, length: dist };
}
