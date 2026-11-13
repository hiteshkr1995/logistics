/**
 * Ground, streets, water, parks, generated buildings and trees.
 * Geography & generation are shared with the SVG fallback map.
 */
import * as THREE from 'three';
import { Builder, ribbon } from './geometry';
import { COLORS, FACADES, ROOFS, TREE_GREENS } from './palette';
import { glassTexture, litWindowsTexture, streakTexture, waterTexture, windowTexture } from './textures';
import { buildings, parkPaths, streets, trees } from '../map/cityGen';
import {
  CANAL, CANAL_W, CORE, HUBS, ISLAND, PARKS, PLAZAS, RIVER, RIVER_W, SIEGES, STERN_R, inRect,
} from '../map/world';

const H = 0.92; // building height scale (world tiles)

export interface CityParts {
  group: THREE.Group;
  /** called every frame with elapsed seconds */
  tick: (t: number) => void;
  setNight: (night: boolean) => void;
}

function std(color: string | undefined, opts: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0, ...opts });
}

export function buildCity(): CityParts {
  const group = new THREE.Group();

  /* ---------------- Ground & flat layers ---------------- */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(420, 420), std(COLORS.ground));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(27, 0, 20);
  ground.receiveShadow = true;
  group.add(ground);

  const flat = new Builder();
  // City plates (sidewalk-coloured blocks) so roads read as roads
  for (const p of PARKS) flat.rect(p.r.x0, p.r.y0, p.r.x1, p.r.y1, 0.012, COLORS.park);
  flat.rect(ISLAND.x0, ISLAND.y0, ISLAND.x1, ISLAND.y1, 0.01, COLORS.island);
  for (const p of PLAZAS) flat.rect(p.x0, p.y0, p.x1, p.y1, 0.014, COLORS.plaza);
  for (const h of HUBS) flat.rect(h.cell.x0 + 0.5, h.cell.y0 + 0.5, h.cell.x1 - 0.5, h.cell.y1 - 0.5, 0.014, COLORS.hubYard);
  for (const [a, b] of parkPaths) flat.strip(a, b, 0.26, 0.02, COLORS.path);

  // Streets: sidewalk band, asphalt, bike lanes, centre dashes
  for (const s of streets) flat.strip(s.a, s.b, s.w + 0.42, 0.016, COLORS.sidewalk, 0.21);
  for (const s of streets) flat.strip(s.a, s.b, s.w, 0.022, COLORS.asphalt, s.w / 2);
  for (const s of streets) {
    if (s.lanes) {
      const o = s.w / 2 - 0.15;
      const v = s.a[0] === s.b[0];
      for (const sign of [-1, 1]) {
        const a: [number, number] = v ? [s.a[0] + o * sign, s.a[1]] : [s.a[0], s.a[1] + o * sign];
        const b: [number, number] = v ? [s.b[0] + o * sign, s.b[1]] : [s.b[0], s.b[1] + o * sign];
        flat.strip(a, b, 0.14, 0.027, COLORS.bikeLane);
      }
    }
    // dashed centre line
    const len = Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]);
    const ux = (s.b[0] - s.a[0]) / len;
    const uz = (s.b[1] - s.a[1]) / len;
    for (let d = 0.9; d < len - 0.9; d += 0.8) {
      flat.strip([s.a[0] + ux * d, s.a[1] + uz * d], [s.a[0] + ux * (d + 0.38), s.a[1] + uz * (d + 0.38)], 0.05, 0.027, COLORS.marking);
    }
  }
  // Zebra crossings at intersections inside the core city
  const arms = new Map<string, Set<string>>();
  const key = (x: number, y: number) => `${x},${y}`;
  for (const s of streets) {
    if (s.w > 1) continue;
    const v = s.a[0] === s.b[0];
    const [lo, hi] = v ? (s.a[1] < s.b[1] ? [s.a, s.b] : [s.b, s.a]) : s.a[0] < s.b[0] ? [s.a, s.b] : [s.b, s.a];
    const add = (p: [number, number], dir: string) => {
      const k = key(p[0], p[1]);
      if (!arms.has(k)) arms.set(k, new Set());
      arms.get(k)!.add(dir);
    };
    add(lo, v ? 'S' : 'E');
    add(hi, v ? 'N' : 'W');
  }
  for (const [k, dirs] of arms) {
    const [x, y] = k.split(',').map(Number);
    if (!inRect(CORE, x, y) || dirs.size < 3) continue;
    for (const d of dirs) {
      const ax = d === 'E' ? 1 : d === 'W' ? -1 : 0;
      const az = d === 'S' ? 1 : d === 'N' ? -1 : 0;
      for (let i = -2; i <= 2; i++) {
        const cx = x + ax * 0.85 + (az !== 0 ? i * 0.17 : 0);
        const cz = y + az * 0.85 + (ax !== 0 ? i * 0.17 : 0);
        const hx = az !== 0 ? 0.045 : 0.2;
        const hz = ax !== 0 ? 0.045 : 0.2;
        flat.rect(cx - hx, cz - hz, cx + hx, cz + hz, 0.029, COLORS.marking);
      }
    }
  }
  // Großer Stern roundabout
  const flatMesh = new THREE.Mesh(flat.build(), std(undefined, { vertexColors: true }));
  flatMesh.receiveShadow = true;
  group.add(flatMesh);

  const ring = new THREE.Mesh(new THREE.RingGeometry(STERN_R - 0.45, STERN_R + 0.45, 64), std(COLORS.asphalt));
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(SIEGES.x, 0.03, SIEGES.y);
  ring.receiveShadow = true;
  const island = new THREE.Mesh(new THREE.CircleGeometry(STERN_R - 0.45, 48), std(COLORS.park));
  island.rotation.x = -Math.PI / 2;
  island.position.set(SIEGES.x, 0.034, SIEGES.y);
  island.receiveShadow = true;
  group.add(ring, island);

  /* ---------------- The Spree ---------------- */
  const waterMat = new THREE.MeshStandardMaterial({ map: waterTexture(), roughness: 0.16, metalness: 0.08, envMapIntensity: 1.3 });
  const streakTex = streakTexture();
  const streakMat = new THREE.MeshBasicMaterial({ map: streakTex, transparent: true, depthWrite: false, opacity: 0.8 });
  for (const [pts, w] of [[RIVER, RIVER_W], [CANAL, CANAL_W]] as const) {
    const bank = new THREE.Mesh(ribbon(pts, w + 0.4, 0.024).geometry, std(COLORS.bank, { side: THREE.DoubleSide }));
    bank.receiveShadow = true;
    const water = new THREE.Mesh(ribbon(pts, w, 0.032).geometry, waterMat);
    water.material.side = THREE.DoubleSide;
    water.receiveShadow = true;
    const streaks = new THREE.Mesh(ribbon(pts, w * 0.8, 0.036, 6).geometry, streakMat);
    streaks.material.side = THREE.DoubleSide;
    group.add(bank, water, streaks);
  }

  /* ---------------- Buildings ---------------- */
  const walls = new Builder();
  const glass = new Builder();
  const roofs = new Builder();
  for (const b of buildings) {
    const h = b.z1 * H;
    const facade = FACADES[Math.abs(b.pal * 3 + Math.round(b.x0 * 2) + Math.round(b.y0 * 5)) % FACADES.length];
    const isGlass = b.pal === 6;
    const target = isGlass ? glass : walls;
    const pitched = b.roof === 'terra' && Math.min(b.x1 - b.x0, b.y1 - b.y0) <= 1.6;
    const roofColor = b.roof === 'green' ? ROOFS.green : b.roof === 'solar' ? ROOFS.flat : b.roof === 'terra' ? ROOFS.terra : ROOFS.flat;
    target.box(b.x0, b.y0, b.x1, b.y1, 0, h, isGlass ? '#ffffff' : facade, roofColor, 0.5, roofs);
    if (pitched) {
      roofs.gable(b.x0, b.y0, b.x1, b.y1, h, 0.42, ROOFS.terra, facade);
    } else {
      // parapet lip
      const t = 0.06;
      roofs.box(b.x0, b.y0, b.x1, b.y0 + t, h, h + 0.08, facade, facade);
      roofs.box(b.x0, b.y1 - t, b.x1, b.y1, h, h + 0.08, facade, facade);
      roofs.box(b.x0, b.y0, b.x0 + t, b.y1, h, h + 0.08, facade, facade);
      roofs.box(b.x1 - t, b.y0, b.x1, b.y1, h, h + 0.08, facade, facade);
      if (b.roof === 'solar') {
        const sx = (b.x1 - b.x0) * 0.6;
        const sz = (b.y1 - b.y0) * 0.5;
        roofs.box(b.x0 + 0.2, b.y0 + 0.2, b.x0 + 0.2 + sx, b.y0 + 0.2 + sz, h, h + 0.05, ROOFS.solar, ROOFS.solar);
      }
      if (b.cap) roofs.box(b.cap.x0, b.cap.y0, b.cap.x1, b.cap.y1, h, h + b.cap.h, facade, ROOFS.flat);
    }
  }
  const winTex = windowTexture();
  const wallMat = std(undefined, { vertexColors: true, map: winTex, roughness: 0.85, emissive: '#000000', emissiveMap: litWindowsTexture() });
  const wallMesh = new THREE.Mesh(walls.build(true), wallMat);
  const glassMesh = new THREE.Mesh(glass.build(true), std('#ffffff', { map: glassTexture(), roughness: 0.25, metalness: 0.35, envMapIntensity: 1.2 }));
  const roofMesh = new THREE.Mesh(roofs.build(), std(undefined, { vertexColors: true }));
  for (const m of [wallMesh, glassMesh, roofMesh]) {
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
  }

  /* ---------------- Trees (instanced) ---------------- */
  const canopyGeo = new THREE.IcosahedronGeometry(1, 2);
  const trunkGeo = new THREE.CylinderGeometry(0.045, 0.065, 1, 6);
  trunkGeo.translate(0, 0.5, 0);
  const canopy = new THREE.InstancedMesh(canopyGeo, std(undefined, { roughness: 0.95, flatShading: true }), trees.length);
  const trunk = new THREE.InstancedMesh(trunkGeo, std(COLORS.trunk), trees.length);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const color = new THREE.Color();
  trees.forEach((t, i) => {
    const r = t.r * 1.05;
    const trunkH = 0.35 + r * 0.5;
    q.setFromEuler(new THREE.Euler(0, (i * 1.7) % Math.PI, 0));
    m4.compose(p.set(t.x, 0.02, t.y), q, s.set(1, trunkH, 1));
    trunk.setMatrixAt(i, m4);
    m4.compose(p.set(t.x, trunkH + r * 0.82, t.y), q, s.set(r, r * 1.12, r));
    canopy.setMatrixAt(i, m4);
    canopy.setColorAt(i, color.set(TREE_GREENS[(t.c + i) % TREE_GREENS.length]));
  });
  for (const m of [canopy, trunk]) {
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
  }


  return {
    group,
    tick: (t: number) => {
      streakTex.offset.x = -t * 0.035;
    },
    setNight: (night: boolean) => {
      wallMat.emissive.set(night ? '#FFFFFF' : '#000000');
      wallMat.emissiveIntensity = night ? 1.15 : 0;
      waterMat.color.set(night ? '#4F6E88' : '#FFFFFF');
      streakMat.opacity = night ? 0.45 : 0.8;
    },
  };
}
