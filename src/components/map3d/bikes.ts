/**
 * Low-poly electric delivery bikes in ON-SPREE livery.
 * Local axes: +x forward, +y up. Scaled up ("hero scale") so they read
 * clearly from the aerial camera.
 */
import * as THREE from 'three';
import { COLORS } from './palette';
import { brandDecal, glowTexture } from './textures';

let shared: ReturnType<typeof makeShared> | null = null;
function makeShared() {
  const decal = brandDecal();
  return {
    tire: new THREE.MeshStandardMaterial({ color: '#141516', roughness: 0.7 }),
    frame: new THREE.MeshStandardMaterial({ color: '#23292C', roughness: 0.45, metalness: 0.4 }),
    battery: new THREE.MeshStandardMaterial({ color: COLORS.brand, roughness: 0.4 }),
    box: [
      new THREE.MeshStandardMaterial({ color: COLORS.cream, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ color: COLORS.cream, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ color: COLORS.brand, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ color: COLORS.brand, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ map: decal, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ map: decal, roughness: 0.55 }),
    ],
    jacket: new THREE.MeshStandardMaterial({ color: COLORS.brand, roughness: 0.75 }),
    pants: new THREE.MeshStandardMaterial({ color: '#1C2124', roughness: 0.8 }),
    skin: new THREE.MeshStandardMaterial({ color: '#E2B08C', roughness: 0.7 }),
    helmet: new THREE.MeshStandardMaterial({ color: COLORS.cream, roughness: 0.35 }),
    halo: new THREE.MeshBasicMaterial({ color: COLORS.brand, map: glowTexture(), transparent: true, opacity: 0.85, depthWrite: false }),
    wheel: new THREE.TorusGeometry(0.13, 0.03, 8, 22),
    hub: new THREE.CylinderGeometry(0.03, 0.03, 0.05, 8),
  };
}

function rod(mat: THREE.Material, a: THREE.Vector3, b: THREE.Vector3, r = 0.018) {
  const len = a.distanceTo(b);
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 6), mat);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  return m;
}

export interface BikeObject extends THREE.Group {
  userData: { wheels: THREE.Mesh[] };
}

export function createBike(variant: 'cargo' | 'rack', rider = true): BikeObject {
  if (!shared) shared = makeShared();
  const S = shared;
  const g = new THREE.Group() as BikeObject;
  const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);
  const wheels: THREE.Mesh[] = [];

  const rearX = variant === 'cargo' ? -0.32 : -0.27;
  const frontX = variant === 'cargo' ? 0.38 : 0.27;
  for (const x of [rearX, frontX]) {
    const w = new THREE.Mesh(S.wheel, S.tire);
    w.position.set(x, 0.13, 0);
    wheels.push(w);
    g.add(w);
  }
  const bb = v(-0.04, 0.16);
  const seat = v(-0.12, 0.46);
  const head = v(0.16, 0.5);
  g.add(rod(S.frame, v(rearX, 0.13), bb), rod(S.frame, bb, seat), rod(S.frame, v(rearX, 0.13), seat));
  g.add(rod(S.frame, bb, head, 0.022), rod(S.frame, seat.clone().add(v(0, 0.02)), head));
  g.add(rod(S.frame, head, v(frontX, 0.13)));
  g.add(rod(S.frame, head, v(0.15, 0.6)), rod(S.frame, v(0.15, 0.6, -0.11), v(0.15, 0.6, 0.11), 0.014));
  const batt = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.06), S.battery);
  batt.position.set(0.05, 0.31, 0);
  batt.rotation.z = 0.95;
  g.add(batt);
  if (variant === 'cargo') {
    g.add(rod(S.frame, bb, v(0.3, 0.14), 0.02));
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.26, 0.3), S.box);
    box.position.set(0.18, 0.33, 0);
    g.add(box);
  } else {
    g.add(rod(S.frame, seat, v(rearX - 0.04, 0.36)));
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), S.box);
    box.position.set(rearX - 0.02, 0.53, 0);
    g.add(box);
  }

  if (rider) {
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.2, 4, 8), S.jacket);
    torso.position.set(-0.04, 0.66, 0);
    torso.rotation.z = -0.55;
    g.add(torso);
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), S.skin);
    skull.position.set(0.06, 0.86, 0);
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.078, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), S.helmet);
    helmet.position.set(0.055, 0.87, 0);
    g.add(skull, helmet);
    for (const z of [-0.07, 0.07]) {
      g.add(rod(S.jacket, v(0.02, 0.76, z * 0.8), v(0.15, 0.6, z * 1.4), 0.022));
      g.add(rod(S.pants, v(-0.12, 0.48, z * 0.7), v(-0.02, 0.3, z), 0.03));
      g.add(rod(S.pants, v(-0.02, 0.3, z), v(-0.04, 0.16, z * 1.2), 0.026));
    }
  }

  const halo = new THREE.Mesh(new THREE.CircleGeometry(0.7, 32), S.halo);
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.035;
  halo.renderOrder = 2;
  g.add(halo);

  g.traverse((o) => {
    if ((o as THREE.Mesh).isMesh && o !== halo) {
      o.castShadow = true;
    }
  });
  g.scale.setScalar(1.75);
  g.userData.wheels = wheels;
  return g;
}
