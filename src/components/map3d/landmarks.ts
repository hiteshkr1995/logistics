/**
 * Berlin landmarks built from primitives: Brandenburger Tor, Reichstag,
 * Berliner Dom, Fernsehturm, Siegessäule, Oberbaumbrücke — plus museums,
 * Potsdamer Platz towers and the ON-SPREE micro-hubs.
 * Positions match the shared world data (x → X, y → Z, z → Y).
 */
import * as THREE from 'three';
import { Builder } from './geometry';
import { COLORS } from './palette';
import { brandDecal, glassTexture, litWindowsTexture, windowTexture } from './textures';
import { HUBS } from '../map/world';
import { createBike } from './bikes';

type Mat = THREE.Material;

const std = (color: string, o: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, ...o });

export function buildLandmarks() {
  const group = new THREE.Group();
  const M = {
    sand: std(COLORS.sand),
    sandDark: std(COLORS.sandDark),
    stone: std(COLORS.stone),
    granite: std(COLORS.granite),
    brick: std(COLORS.brick, { roughness: 0.9 }),
    brickDark: std(COLORS.brickDark, { roughness: 0.9 }),
    concrete: std(COLORS.concrete, { roughness: 0.7 }),
    patina: std(COLORS.patina, { roughness: 0.55, metalness: 0.25 }),
    gold: std(COLORS.gold, { roughness: 0.28, metalness: 1 }),
    dark: std('#3B4652', { roughness: 0.4, metalness: 0.3 }),
    glass: new THREE.MeshPhysicalMaterial({ color: '#D7ECF7', roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.55, envMapIntensity: 1.6 }),
    rib: new THREE.MeshBasicMaterial({ color: '#6E8796', wireframe: true, transparent: true, opacity: 0.6 }),
    sphere: std('#DCE1E7', { roughness: 0.22, metalness: 0.85, envMapIntensity: 1.4 }),
    red: std('#D9473C', { roughness: 0.6 }),
    white: std('#F4F4F1', { roughness: 0.6 }),
    beacon: new THREE.MeshBasicMaterial({ color: '#FF5A4D' }),
    ubahn: std(COLORS.ubahn, { roughness: 0.5 }),
    asphalt: std(COLORS.asphalt),
    lane: std(COLORS.bikeLane),
    hubWall: std('#FBFBF7', { roughness: 0.7 }),
    brand: std(COLORS.brand, { roughness: 0.5 }),
    decal: new THREE.MeshStandardMaterial({ map: brandDecal(), roughness: 0.6 }),
    solar: std('#33465C', { roughness: 0.3, metalness: 0.4 }),
    glassTower: new THREE.MeshStandardMaterial({ map: glassTexture(), roughness: 0.2, metalness: 0.4, envMapIntensity: 1.3 }),
  };

  const add = (geo: THREE.BufferGeometry, mat: Mat, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  };
  const box = (x0: number, z0: number, x1: number, z1: number, y0: number, y1: number, mat: Mat) =>
    add(new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0), mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  const cyl = (x: number, z: number, r: number, y0: number, y1: number, mat: Mat, rTop = r, seg = 32) =>
    add(new THREE.CylinderGeometry(rTop, r, y1 - y0, seg), mat, x, (y0 + y1) / 2, z);
  const dome = (x: number, z: number, r: number, y: number, h: number, mat: Mat, seg = 32) => {
    const m = add(new THREE.SphereGeometry(r, seg, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat, x, y, z);
    m.scale.y = h / r;
    return m;
  };

  // Facades with real window rows are batched into one textured mesh
  const facades = new Builder();
  const facadeRoofs = new Builder();
  const fbox = (x0: number, z0: number, x1: number, z1: number, y0: number, y1: number, color: string) =>
    facades.box(x0, z0, x1, z1, y0, y1, color, color, 0.5, facadeRoofs);

  /* ---------- Brandenburger Tor ---------- */
  {
    const x0 = 17.55, x1 = 18.6, z0 = 16.2, z1 = 19.8, top = 2.0;
    box(x0 - 0.08, z0 - 0.08, x1 + 0.08, z1 + 0.08, 0, 0.18, M.sandDark);
    for (const x of [17.76, 18.4]) for (const d of [-1.62, -1.04, -0.44, 0.44, 1.04, 1.62]) cyl(x, 18 + d, 0.1, 0.18, top, M.sand, 0.09, 14);
    box(x0, z0, x1, z0 + 0.34, 0.18, top, M.sand);
    box(x0, z1 - 0.34, x1, z1, 0.18, top, M.sand);
    box(x0, z0, x1, z1, top, top + 0.48, M.sand);
    box(x0 - 0.02, z0 - 0.02, x1 + 0.02, z1 + 0.02, top + 0.3, top + 0.36, M.sandDark);
    box(17.7, 16.95, 18.45, 19.05, top + 0.48, top + 0.95, M.sand);
    box(17.86, 17.62, 18.3, 18.38, top + 0.95, top + 1.08, M.sandDark);
    // Quadriga
    const qy = top + 1.08;
    for (const dz of [-0.36, -0.13, 0.13, 0.36]) {
      box(17.98, 18 + dz - 0.06, 18.3, 18 + dz + 0.06, qy + 0.12, qy + 0.26, M.patina);
      box(18.25, 18 + dz - 0.04, 18.34, 18 + dz + 0.04, qy + 0.22, qy + 0.42, M.patina);
      for (const lx of [18.02, 18.24]) box(lx - 0.02, 18 + dz - 0.03, lx + 0.02, 18 + dz + 0.03, qy, qy + 0.14, M.patina);
    }
    box(17.84, 17.82, 18.04, 18.18, qy, qy + 0.24, M.patina);
    cyl(17.95, 18, 0.06, qy + 0.24, qy + 0.62, M.patina, 0.03, 10);
    add(new THREE.SphereGeometry(0.05, 12, 8), M.patina, 17.95, qy + 0.68, 18);
    cyl(18.02, 18.06, 0.012, qy + 0.3, qy + 0.95, M.patina, 0.012, 6);
    const wreath = add(new THREE.TorusGeometry(0.06, 0.015, 6, 16), M.patina, 18.02, qy + 0.98, 18.06);
    wreath.rotation.y = Math.PI / 2;
  }

  /* ---------- Reichstag ---------- */
  {
    const x0 = 13.9, x1 = 16.5, z0 = 10.6, z1 = 13, h = 1.5;
    fbox(x0, z0, x1, z1, 0, h, '#ECE6D8');
    for (const [tx, tz] of [[x0 - 0.05, z0 - 0.05], [x1 - 0.6, z0 - 0.05], [x0 - 0.05, z1 - 0.6], [x1 - 0.6, z1 - 0.6]]) {
      fbox(tx, tz, tx + 0.65, tz + 0.65, 0, h + 0.4, '#E6DFD0');
    }
    box(14.55, z1, 16.1, z1 + 0.34, 0, 0.24, M.stone);
    for (const x of [14.7, 14.95, 15.2, 15.45, 15.7, 15.95]) cyl(x, z1 + 0.22, 0.06, 0.24, 1.22, M.stone, 0.055, 12);
    box(14.55, z1, 16.1, z1 + 0.34, 1.22, 1.42, M.stone);
    const ped = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(1.55, 0), new THREE.Vector2(0.775, 0.38)]);
    const pg = new THREE.ExtrudeGeometry(ped, { depth: 0.34, bevelEnabled: false });
    add(pg, M.stone, 14.55, 1.42, z1);
    cyl(15.2, 11.8, 0.55, h, h + 0.22, M.stone, 0.55, 40);
    dome(15.2, 11.8, 0.55, h + 0.22, 0.75, M.glass, 40);
    const ribs = new THREE.Mesh(new THREE.SphereGeometry(0.555, 16, 6, 0, Math.PI * 2, 0, Math.PI / 2), M.rib);
    ribs.position.set(15.2, h + 0.22, 11.8);
    ribs.scale.y = 0.75 / 0.555;
    group.add(ribs);
  }

  /* ---------- Museum Island: Berliner Dom & museums ---------- */
  {
    const x0 = 29.5, x1 = 32, z0 = 14.5, z1 = 17.5, h = 1.5, cx = 30.75, cz = 16;
    fbox(x0, z0, x1, z1, 0, h, '#E8E3D7');
    for (const [tx, tz] of [[x0, z0], [x1 - 0.6, z0], [x0, z1 - 0.6], [x1 - 0.6, z1 - 0.6]]) {
      fbox(tx - 0.04, tz - 0.04, tx + 0.64, tz + 0.64, 0, h + 0.6, '#E3DDCF');
      cyl(tx + 0.3, tz + 0.3, 0.22, h + 0.6, h + 0.72, M.stone, 0.22, 20);
      dome(tx + 0.3, tz + 0.3, 0.24, h + 0.72, 0.38, M.patina, 24);
      cyl(tx + 0.3, tz + 0.3, 0.05, h + 1.06, h + 1.24, M.patina, 0.03, 8);
    }
    // portal on the south front
    box(30.2, z1, 31.3, z1 + 0.18, 0, h + 0.12, M.stone);
    const arch = new THREE.Shape();
    arch.moveTo(0, 0); arch.lineTo(0, 0.7); arch.absarc(0.3, 0.7, 0.3, Math.PI, 0, true); arch.lineTo(0.6, 0); arch.lineTo(0, 0);
    add(new THREE.ShapeGeometry(arch), M.dark, 30.45, 0, z1 + 0.185);
    // drum with columns, main dome, lantern, cross
    cyl(cx, cz, 0.9, h, h + 0.88, M.stone, 0.9, 48);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      cyl(cx + Math.cos(a) * 0.93, cz + Math.sin(a) * 0.93, 0.045, h + 0.05, h + 0.82, M.sandDark, 0.045, 8);
    }
    cyl(cx, cz, 0.97, h + 0.82, h + 0.9, M.sandDark, 0.97, 48);
    dome(cx, cz, 0.92, h + 0.9, 1.22, M.patina, 48);
    for (let i = 0; i < 12; i++) {
      const rib = add(new THREE.TorusGeometry(0.92, 0.012, 4, 32, Math.PI / 2), M.gold, cx, h + 0.9, cz);
      rib.rotation.y = (i / 12) * Math.PI * 2;
      rib.scale.y = 1.22 / 0.92;
    }
    cyl(cx, cz, 0.17, h + 2.08, h + 2.4, M.stone, 0.17, 16);
    dome(cx, cz, 0.18, h + 2.4, 0.2, M.patina, 16);
    box(cx - 0.015, cz - 0.015, cx + 0.015, cz + 0.015, h + 2.58, h + 2.95, M.gold);
    box(cx - 0.08, cz - 0.015, cx + 0.08, cz + 0.015, h + 2.82, h + 2.85, M.gold);

    // Altes Museum with colonnade
    fbox(27.8, 12.3, 29.5, 13.8, 0, 1.15, '#EDE2C8');
    box(28.3, 12.7, 29, 13.3, 1.15, 1.45, M.sand);
    for (let i = 0; i < 9; i++) cyl(27.95 + i * 0.17, 13.92, 0.045, 0.1, 1.08, M.sand, 0.04, 8);
    box(27.82, 13.8, 29.5, 14.02, 1.05, 1.15, M.sand);
    // Bode-Museum
    fbox(30, 11.9, 32, 13.5, 0, 1.35, '#E9E4D8');
    cyl(31.6, 12.3, 0.32, 1.35, 1.6, M.stone, 0.32, 24);
    dome(31.6, 12.3, 0.33, 1.6, 0.42, M.patina, 24);
    // Humboldt Forum
    fbox(28.4, 18.7, 32, 20.5, 0, 1.6, '#EDE3CB');
    cyl(29.2, 19.6, 0.38, 1.6, 1.9, M.sand, 0.38, 24);
    dome(29.2, 19.6, 0.39, 1.9, 0.55, M.patina, 24);
  }

  /* ---------- Fernsehturm ---------- */
  {
    const x = 37.5, z = 16;
    cyl(x, z, 1.3, 0, 0.18, M.concrete, 1.3, 48);
    cyl(x, z, 1.15, 0.18, 0.5, M.dark, 1.15, 48);
    cyl(x, z, 1.25, 0.5, 0.6, M.concrete, 1.25, 48);
    cyl(x, z, 0.44, 0.6, 8.3, M.concrete, 0.27, 32);
    add(new THREE.SphereGeometry(1.02, 48, 32), M.sphere, x, 9.05, z);
    const band = add(new THREE.CylinderGeometry(1.0, 0.97, 0.24, 48, 1, true), M.dark, x, 8.88, z);
    band.castShadow = false;
    const band2 = add(new THREE.CylinderGeometry(0.93, 0.86, 0.12, 48, 1, true), M.dark, x, 8.6, z);
    band2.castShadow = false;
    cyl(x, z, 0.21, 9.95, 10.95, M.concrete, 0.19, 16);
    const segs = 6;
    for (let i = 0; i < segs; i++) {
      const y0 = 10.95 + (i * 2.4) / segs;
      cyl(x, z, 0.095 - i * 0.008, y0, y0 + 2.4 / segs, i % 2 ? M.white : M.red, 0.09 - i * 0.008, 10);
    }
    const beacon = add(new THREE.SphereGeometry(0.07, 10, 8), M.beacon, x, 13.4, z);
    beacon.castShadow = false;
  }

  /* ---------- Siegessäule ---------- */
  {
    const x = 9, z = 18;
    box(x - 0.55, z - 0.55, x + 0.55, z + 0.55, 0, 0.5, M.granite);
    cyl(x, z, 0.44, 0.5, 0.58, M.sandDark, 0.44, 32);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      cyl(x + Math.cos(a) * 0.4, z + Math.sin(a) * 0.4, 0.035, 0.58, 1.02, M.sand, 0.035, 8);
    }
    cyl(x, z, 0.3, 0.58, 1.02, M.dark, 0.3, 24);
    cyl(x, z, 0.47, 1.02, 1.1, M.sandDark, 0.47, 32);
    cyl(x, z, 0.28, 1.1, 4.72, M.sand, 0.25, 24);
    for (const y of [2.1, 3.0, 3.9]) cyl(x, z, 0.3, y, y + 0.22, M.gold, 0.29, 24);
    cyl(x, z, 0.34, 4.72, 4.88, M.sandDark, 0.34, 24);
    // Victoria
    cyl(x, z, 0.12, 4.88, 5.48, M.gold, 0.05, 12);
    add(new THREE.SphereGeometry(0.06, 12, 8), M.gold, x, 5.55, z);
    for (const side of [-1, 1]) {
      const wing = add(new THREE.BoxGeometry(0.03, 0.42, 0.22), M.gold, x - 0.06, 5.42, z + side * 0.12);
      wing.rotation.x = side * 0.5;
    }
    cyl(x + 0.05, z - 0.06, 0.012, 5.2, 5.86, M.gold, 0.012, 6);
    add(new THREE.TorusGeometry(0.06, 0.016, 6, 16), M.gold, x + 0.05, 5.9, z - 0.06);
  }

  /* ---------- Oberbaumbrücke ---------- */
  {
    const z0 = 27.4, z1 = 32.6, len = z1 - z0;
    // Lower road deck with seven arches over the Spree (extruded brick)
    const deck = new THREE.Shape();
    deck.moveTo(0, -0.3); deck.lineTo(len, -0.3); deck.lineTo(len, 0.6); deck.lineTo(0, 0.6); deck.lineTo(0, -0.3);
    const span = (len - 0.4) / 7;
    for (let i = 0; i < 7; i++) {
      const a = 0.2 + i * span + 0.07;
      const w = span - 0.14;
      const hole = new THREE.Path();
      hole.moveTo(a, -0.25); hole.lineTo(a, 0.12); hole.absarc(a + w / 2, 0.12, w / 2, Math.PI, 0, true); hole.lineTo(a + w, -0.25); hole.lineTo(a, -0.25);
      deck.holes.push(hole);
    }
    const dg = new THREE.ExtrudeGeometry(deck, { depth: 2.3, bevelEnabled: false });
    dg.rotateY(-Math.PI / 2);
    add(dg, M.brick, 46.3, 0, z0);
    box(44, z0, 45.6, z1, 0.6, 0.62, M.asphalt);
    for (const x of [44.25, 45.35]) box(x - 0.07, z0, x + 0.07, z1, 0.62, 0.63, M.lane);
    // Upper U-Bahn viaduct with arcade
    const arc = new THREE.Shape();
    arc.moveTo(0, 0); arc.lineTo(len, 0); arc.lineTo(len, 0.75); arc.lineTo(0, 0.75); arc.lineTo(0, 0);
    const n = 16;
    const us = (len - 0.2) / n;
    for (let i = 0; i < n; i++) {
      const a = 0.1 + i * us + 0.05;
      const w = us - 0.1;
      const hole = new THREE.Path();
      hole.moveTo(a, 0.08); hole.lineTo(a, 0.38); hole.quadraticCurveTo(a + w / 2, 0.62, a + w, 0.38); hole.lineTo(a + w, 0.08); hole.lineTo(a, 0.08);
      arc.holes.push(hole);
    }
    const ag = new THREE.ExtrudeGeometry(arc, { depth: 0.7, bevelEnabled: false });
    ag.rotateY(-Math.PI / 2);
    add(ag, M.brick, 46.3, 0.6, z0);
    box(45.6, z0, 46.3, z1, 1.35, 1.42, M.brickDark);
    // Twin towers
    for (const tz of [29.35, 30.6]) {
      box(45.6, tz, 46.4, tz + 0.65, 0, 2.95, M.brick);
      box(45.55, tz - 0.05, 46.45, tz + 0.7, 2.95, 3.08, M.brickDark);
      for (const [cx, cz] of [[45.6, tz], [46.32, tz], [45.6, tz + 0.57], [46.32, tz + 0.57]]) box(cx, cz, cx + 0.08, cz + 0.08, 3.08, 3.2, M.brickDark);
      const roof = add(new THREE.ConeGeometry(0.5, 0.65, 4), M.brickDark, 46, 3.4, tz + 0.325);
      roof.rotation.y = Math.PI / 4;
      box(46.4, tz + 0.25, 46.41, tz + 0.4, 1.8, 2.5, M.dark);
    }
    // U-Bahn train
    box(45.68, 27.7, 46.22, 29.1, 1.42, 1.86, M.ubahn);
    box(46.225, 27.85, 46.23, 29.0, 1.6, 1.74, M.dark);
  }

  /* ---------- Potsdamer Platz & Alexanderplatz ---------- */
  fbox(17.5, 23, 19, 24.5, 0, 5, '#A86F53');
  box(17.65, 23.15, 18.85, 24.35, 5, 5.4, M.brickDark);
  add(new THREE.BoxGeometry(1.1, 5.5, 1.5), M.glassTower, 19.95, 2.75, 23.75);
  add(new THREE.BoxGeometry(3, 2.5, 1.5), M.glassTower, 19, 1.25, 25.75);
  fbox(40.5, 14.5, 45, 17.5, 0, 1, '#E4E6E6');
  fbox(41, 14.5, 42.5, 17.5, 1, 6.5, '#E9EBEB');

  /* ---------- ON-SPREE micro-hubs ---------- */
  const hubBikes: THREE.Object3D[] = [];
  HUBS.forEach((h) => {
    const b = h.box;
    const hh = 0.85;
    box(b.x0, b.y0, b.x1, b.y1, 0, hh, M.hubWall);
    box(b.x0 - 0.02, b.y0 - 0.02, b.x1 + 0.02, b.y1 + 0.02, hh - 0.2, hh - 0.08, M.brand);
    box(b.x0 + 0.3, b.y1, b.x0 + 1.2, b.y1 + 0.02, 0, 0.5, M.dark);
    // roof: solar strips + logo decal
    for (let i = 0; i < 3; i++) box(b.x0 + 0.25 + i * 0.6, b.y0 + 0.25, b.x0 + 0.75 + i * 0.6, b.y1 - 0.25, hh, hh + 0.05, M.solar);
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), M.decal);
    logo.rotation.x = -Math.PI / 2;
    logo.position.set(b.x1 - 0.55, hh + 0.01, (b.y0 + b.y1) / 2);
    group.add(logo);
    for (let k = 0; k < 3; k++) {
      const bike = createBike(k % 2 ? 'rack' : 'cargo', false);
      bike.position.set(b.x0 + 0.5 + k * 0.62, 0.02, b.y1 + 0.55);
      bike.rotation.y = Math.PI / 2 + 0.25;
      group.add(bike);
      hubBikes.push(bike);
    }
    // charging posts
    for (let k = 0; k < 3; k++) box(b.x0 + 0.72 + k * 0.62, b.y1 + 0.18, b.x0 + 0.78 + k * 0.62, b.y1 + 0.24, 0, 0.32, M.brand);
  });

  const facMat = new THREE.MeshStandardMaterial({ vertexColors: true, map: windowTexture(), roughness: 0.85, emissive: '#000000', emissiveMap: litWindowsTexture() });
  const fac = new THREE.Mesh(facades.build(true), facMat);
  const facRoof = new THREE.Mesh(facadeRoofs.build(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 }));
  for (const m of [fac, facRoof]) {
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
  }

  const setNight = (night: boolean) => {
    facMat.emissive.set(night ? '#FFFFFF' : '#000000');
    facMat.emissiveIntensity = night ? 1.1 : 0;
    M.beacon.color.set(night ? '#FF3B30' : '#FF5A4D');
    (M.decal as THREE.MeshStandardMaterial).emissive.set(night ? '#2A3A48' : '#000000');
  };

  return { group, setNight };
}
