/**
 * Assembles the full Berlin scene: lighting, city, landmarks, live layer
 * (moving bikes, glowing routes, service zone, hub beam, ground labels).
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildCity } from './city';
import { buildLandmarks } from './landmarks';
import { createBike, type BikeObject } from './bikes';
import { ribbon } from './geometry';
import { COLORS } from './palette';
import { beamTexture, dashTexture, labelTexture, zoneTexture } from './textures';
import { buildTimeline, poseAt, type Timeline } from '../map/routes';
import { DISTRICT_LABELS, EXTRA_DROPS, HUBS, LANDMARKS, MITTE_ZONE, ROUTES } from '../map/world';

export interface MarkerDef {
  id: string;
  kind: 'hub' | 'drop' | 'spot';
  title: string;
  sub: string;
  pos: THREE.Vector3;
}

export interface BerlinScene {
  scene: THREE.Scene;
  sun: THREE.DirectionalLight;
  markers: MarkerDef[];
  update: (t: number, animate: boolean) => void;
  /** Switch between daylight and night (moonlight, lit windows). */
  setNight: (night: boolean) => void;
  dispose: () => void;
}

export function buildScene(renderer: THREE.WebGLRenderer, opts: { compact: boolean; shadowSize: number }): BerlinScene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.sky);
  scene.fog = new THREE.Fog(COLORS.sky, 60, 150);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.42;
  pmrem.dispose();

  /* Lighting: warm sun from the west, cool sky fill */
  const hemi = new THREE.HemisphereLight('#FFF8EC', '#A9B5BF', 0.95);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#FFEFD6', 3.1);
  sun.position.set(-18, 34, 8);
  sun.target.position.set(27, 0, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(opts.shadowSize, opts.shadowSize);
  const sc = sun.shadow.camera;
  sc.left = -46; sc.right = 46; sc.top = 40; sc.bottom = -40; sc.near = 1; sc.far = 140;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.035;
  sun.shadow.radius = 3;
  scene.add(sun, sun.target);

  const city = buildCity();
  scene.add(city.group);
  const landmarks = buildLandmarks();
  scene.add(landmarks.group);

  /* Service zone around Mitte */
  const zone = new THREE.Group();
  zone.position.set(MITTE_ZONE.x, 0.06, MITTE_ZONE.y);
  const zoneFill = new THREE.Mesh(
    new THREE.CircleGeometry(MITTE_ZONE.r, 96),
    new THREE.MeshBasicMaterial({ color: COLORS.brand, map: zoneTexture(), transparent: true, depthWrite: false, opacity: 0.9 }),
  );
  zoneFill.rotation.x = -Math.PI / 2;
  const zoneRing = new THREE.Mesh(
    new THREE.RingGeometry(MITTE_ZONE.r - 0.09, MITTE_ZONE.r + 0.09, 160),
    new THREE.MeshBasicMaterial({ color: COLORS.brand, transparent: true, opacity: 0.85, depthTest: false }),
  );
  zoneRing.rotation.x = -Math.PI / 2;
  zoneRing.renderOrder = 5;
  const dashes = new THREE.Group();
  for (let i = 0; i < 72; i++) {
    const seg = new THREE.Mesh(
      new THREE.RingGeometry(MITTE_ZONE.r + 0.55, MITTE_ZONE.r + 0.68, 4, 1, (i / 72) * Math.PI * 2, (Math.PI * 2) / 72 / 2),
      zoneRing.material,
    );
    seg.rotation.x = -Math.PI / 2;
    seg.renderOrder = 5;
    dashes.add(seg);
  }
  zone.add(zoneFill, zoneRing, dashes);
  scene.add(zone);

  /* Light beam above Hub Mitte */
  const hm = HUBS[0].box;
  const beamMat = new THREE.MeshBasicMaterial({
    color: COLORS.brandLight, map: beamTexture(), transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
  });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 1.05, 10, 40, 1, true), beamMat);
  beam.position.set((hm.x0 + hm.x1) / 2, 5.9, (hm.y0 + hm.y1) / 2);
  const beamCore = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 10, 16, 1, true), beamMat);
  beamCore.position.copy(beam.position);
  scene.add(beam, beamCore);

  const labelMats: { mat: THREE.MeshBasicMaterial; zone: boolean }[] = [];
  /* Ground labels (district names) — painted over the city like a hologram */
  const labels = DISTRICT_LABELS.filter((d) => !opts.compact || d.compact);
  for (const d of [...labels, { x: MITTE_ZONE.x - 3.6, y: MITTE_ZONE.y + MITTE_ZONE.r - 1.4, text: 'SAME-DAY ZONE · MITTE' }]) {
    const zoneLabel = d.text.startsWith('SAME');
    const { texture, aspect } = labelTexture(d.text);
    const h = zoneLabel ? 0.75 : 1.25;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(h * aspect, h),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false, color: zoneLabel ? '#055A8F' : '#0F1011', opacity: zoneLabel ? 0.95 : 0.62 }),
    );
    labelMats.push({ mat: mesh.material as THREE.MeshBasicMaterial, zone: zoneLabel });
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(d.x + (h * aspect) / 2, 0.07, d.y);
    mesh.renderOrder = 4;
    scene.add(mesh);
  }

  /* Routes + bikes */
  const routes = ROUTES.filter((r) => !opts.compact || r.compact);
  const dashTex = dashTexture();
  const routeMeshes: { line: THREE.Mesh; total: number }[] = [];
  const glowMat = new THREE.MeshBasicMaterial({ color: COLORS.brand, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide });
  const lineMat = new THREE.MeshBasicMaterial({ color: COLORS.brand, side: THREE.DoubleSide });
  const flowMat = new THREE.MeshBasicMaterial({ color: '#ffffff', map: dashTex, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  for (const r of routes.filter((x) => x.show)) {
    const glow = new THREE.Mesh(ribbon(r.pts, 0.62, 0.075).geometry, glowMat);
    const { geometry, length } = ribbon(r.pts, 0.17, 0.085);
    const line = new THREE.Mesh(geometry, lineMat);
    const flow = new THREE.Mesh(ribbon(r.pts, 0.11, 0.09, 0.9).geometry, flowMat);
    glow.renderOrder = line.renderOrder = flow.renderOrder = 3;
    scene.add(glow, line, flow);
    routeMeshes.push({ line, total: geometry.getIndex()!.count });
    void length;
  }

  const bikes: { obj: BikeObject; tl: Timeline; offset: number; dist: number; last?: THREE.Vector3 }[] = [];
  for (const r of routes) {
    const tl = buildTimeline(r);
    for (const b of r.bikes) {
      const obj = createBike(b.v);
      scene.add(obj);
      bikes.push({ obj, tl, offset: b.phase * tl.total, dist: 0 });
    }
  }

  /* Markers (rendered as HTML by the component) */
  const markers: MarkerDef[] = [
    ...HUBS.map((h) => ({
      id: `hub-${h.id}`, kind: 'hub' as const, title: `ON-SPREE Hub · ${h.name}`, sub: 'Micro-hub & e-bike charging',
      pos: new THREE.Vector3((h.box.x0 + h.box.x1) / 2, 1.15, (h.box.y0 + h.box.y1) / 2),
    })),
    ...routes.filter((r) => r.show && r.dest && !r.dest.title.startsWith('Hub')).map((r) => {
      const [x, y] = r.pts[r.pts.length - 1];
      return { id: `drop-${r.id}`, kind: 'drop' as const, title: r.dest!.title, sub: r.dest!.sub, pos: new THREE.Vector3(x, 0.15, y) };
    }),
    ...(opts.compact ? [] : EXTRA_DROPS).map((d) => ({ id: `x-${d.title}`, kind: 'drop' as const, title: d.title, sub: d.sub, pos: new THREE.Vector3(d.x, 0.15, d.y) })),
    ...LANDMARKS.map((l) => ({ id: l.id, kind: 'spot' as const, title: l.title, sub: l.sub, pos: new THREE.Vector3(l.x, l.z + 0.35, l.y) })),
  ];

  const tmp = new THREE.Vector3();
  const update = (t: number, animate: boolean) => {
    city.tick(animate ? t : 0);
    if (animate) {
      dashTex.offset.x = -t * 0.9;
      dashes.rotation.y = t * 0.04;
      beamMat.opacity = 0.75 + Math.sin(t * 2) * 0.2;
      (zoneFill.material as THREE.MeshBasicMaterial).opacity = 0.75 + Math.sin(t * 1.3) * 0.15;
    }
    // routes draw in during the first seconds
    for (const r of routeMeshes) {
      const k = animate ? Math.min(1, Math.max(0, (t - 0.8) / 2.2)) : 1;
      r.line.geometry.setDrawRange(0, Math.floor((r.total * k) / 6) * 6);
    }
    const simT = animate ? t + 4 : 4;
    for (const b of bikes) {
      const p = poseAt(b.tl, simT + b.offset);
      tmp.set(p.x, p.z + 0.02, p.y);
      if (b.last) b.dist += tmp.distanceTo(b.last);
      b.obj.position.copy(tmp);
      b.obj.rotation.y = -Math.atan2(p.dy, p.dx);
      for (const w of b.obj.userData.wheels) w.rotation.z = -b.dist / (0.13 * 1.75);
      b.last = (b.last ?? new THREE.Vector3()).copy(tmp);
    }
  };

  const setNight = (night: boolean) => {
    const sky = night ? '#0B0F12' : COLORS.sky;
    (scene.background as THREE.Color).set(sky);
    (scene.fog as THREE.Fog).color.set(sky);
    hemi.color.set(night ? '#6E86A8' : '#FFF8EC');
    hemi.groundColor.set(night ? '#0E1318' : '#A9B5BF');
    hemi.intensity = night ? 0.6 : 0.95;
    sun.color.set(night ? '#A9C4F0' : '#FFEFD6');
    sun.intensity = night ? 0.85 : 3.1;
    scene.environmentIntensity = night ? 0.16 : 0.42;
    city.setNight(night);
    landmarks.setNight(night);
    for (const l of labelMats) {
      l.mat.color.set(l.zone ? (night ? '#7CC3EE' : '#055A8F') : night ? '#E8E6DA' : '#0F1011');
      l.mat.opacity = l.zone ? 0.95 : night ? 0.5 : 0.62;
    }
    beamMat.opacity = night ? 1 : 0.8;
  };

  const dispose = () => {
    env.dispose();
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.geometry.dispose();
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        mats.forEach((mat) => {
          (mat as THREE.MeshStandardMaterial).map?.dispose();
          mat.dispose();
        });
      }
    });
  };

  return { scene, sun, markers, update, setNight, dispose };
}
