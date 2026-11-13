/**
 * Procedurally drawn canvas textures (no image assets needed).
 */
import * as THREE from 'three';
import { COLORS } from './palette';

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!] as const;
}

function tex(c: HTMLCanvasElement, opts: { repeat?: boolean; srgb?: boolean } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (opts.srgb !== false) t.colorSpace = THREE.SRGBColorSpace;
  if (opts.repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

/** One facade cell (0.5 × 0.5 world units): white wall with a window. Tinted by vertex colour. */
export function windowTexture() {
  const [c, g] = canvas(128, 128);
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, 128, 128);
  // subtle horizontal floor line
  g.fillStyle = 'rgba(0,0,0,0.05)';
  g.fillRect(0, 122, 128, 6);
  // window recess + glass
  g.fillStyle = '#C9CDD0';
  g.fillRect(34, 30, 60, 70);
  const glass = g.createLinearGradient(0, 34, 0, 96);
  glass.addColorStop(0, '#8FA7B8');
  glass.addColorStop(0.45, '#4C6273');
  glass.addColorStop(1, '#38495A');
  g.fillStyle = glass;
  g.fillRect(38, 34, 52, 62);
  g.fillStyle = 'rgba(255,255,255,0.35)';
  g.fillRect(38, 34, 52, 8);
  g.fillStyle = '#ffffff';
  g.fillRect(62, 34, 4, 62);
  g.fillStyle = 'rgba(0,0,0,0.08)';
  g.fillRect(30, 100, 68, 5);
  return tex(c, { repeat: true });
}

/**
 * Night-time emissive map: an 8×8 block of facade cells where roughly a
 * third of the windows glow warm (or TV-blue). Repeat = 1/8 so the pattern
 * varies across a facade.
 */
export function litWindowsTexture() {
  const [c, g] = canvas(1024, 1024);
  g.fillStyle = '#000';
  g.fillRect(0, 0, 1024, 1024);
  const rnd = mulberry(11);
  const tones = ['#FFC46B', '#FFD58C', '#FFE7B3', '#FFB65A', '#BFD8FF'];
  for (let cy = 0; cy < 8; cy++) {
    for (let cx = 0; cx < 8; cx++) {
      if (rnd() > 0.36) continue;
      g.fillStyle = tones[Math.floor(rnd() * tones.length)];
      g.globalAlpha = 0.55 + rnd() * 0.45;
      g.fillRect(cx * 128 + 38, cy * 128 + 34, 52, 62);
    }
  }
  g.globalAlpha = 1;
  const t = tex(c, { repeat: true });
  t.repeat.set(1 / 8, 1 / 8);
  return t;
}

/** Curtain-wall glass for office towers. */
export function glassTexture() {
  const [c, g] = canvas(64, 128);
  const grad = g.createLinearGradient(0, 0, 64, 0);
  grad.addColorStop(0, '#B9D3E2');
  grad.addColorStop(1, '#8EB0C6');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 128);
  g.fillStyle = 'rgba(255,255,255,0.55)';
  g.fillRect(0, 0, 64, 10);
  g.fillStyle = 'rgba(40,70,95,0.35)';
  g.fillRect(60, 0, 4, 128);
  return tex(c, { repeat: true });
}

/** Water: deeper towards the banks, with soft highlights. */
export function waterTexture() {
  const [c, g] = canvas(8, 128);
  const grad = g.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, '#1E6A9E');
  grad.addColorStop(0.18, '#2C87C4');
  grad.addColorStop(0.5, '#43A2DC');
  grad.addColorStop(0.82, '#2C87C4');
  grad.addColorStop(1, '#1E6A9E');
  g.fillStyle = grad;
  g.fillRect(0, 0, 8, 128);
  return tex(c);
}

/** Flowing light streaks drawn on top of the river. */
export function streakTexture() {
  const [c, g] = canvas(256, 64);
  g.clearRect(0, 0, 256, 64);
  const rnd = mulberry(7);
  for (let i = 0; i < 26; i++) {
    const x = rnd() * 256;
    const y = 6 + rnd() * 52;
    const w = 14 + rnd() * 40;
    g.fillStyle = `rgba(255,255,255,${0.18 + rnd() * 0.3})`;
    g.fillRect(x, y, w, 1.6);
  }
  return tex(c, { repeat: true });
}

/** Dashes running along a route ribbon (u = along the route). */
export function dashTexture() {
  const [c, g] = canvas(64, 16);
  g.clearRect(0, 0, 64, 16);
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.roundRect(4, 3, 26, 10, 5);
  g.fill();
  return tex(c, { repeat: true });
}

/** Radial glow (alpha), used for halos, zone fill. */
export function glowTexture(inner = 1, outer = 0) {
  const [c, g] = canvas(128, 128);
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, `rgba(255,255,255,${inner})`);
  grad.addColorStop(1, `rgba(255,255,255,${outer})`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return tex(c);
}

/** Service-zone disc: faint centre, brighter rim. */
export function zoneTexture() {
  const [c, g] = canvas(256, 256);
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255,255,255,0.10)');
  grad.addColorStop(0.8, 'rgba(255,255,255,0.18)');
  grad.addColorStop(0.97, 'rgba(255,255,255,0.55)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return tex(c);
}

/** Vertical fade for the light beam above the main hub. */
export function beamTexture() {
  const [c, g] = canvas(4, 128);
  const grad = g.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(0.7, 'rgba(255,255,255,0.35)');
  grad.addColorStop(1, 'rgba(255,255,255,0.9)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 128);
  return tex(c);
}

/** The ON-SPREE mark printed on delivery boxes and hub roofs. */
export function brandDecal() {
  const [c, g] = canvas(256, 256);
  g.fillStyle = COLORS.cream;
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = COLORS.brand;
  g.beginPath();
  g.moveTo(0, 150);
  g.bezierCurveTo(50, 122, 90, 178, 140, 150);
  g.bezierCurveTo(185, 126, 220, 170, 256, 148);
  g.lineTo(256, 256);
  g.lineTo(0, 256);
  g.fill();
  g.font = '800 64px "Inter Tight", Inter, sans-serif';
  g.textBaseline = 'alphabetic';
  g.fillStyle = COLORS.brand;
  g.fillText('ON', 40, 132);
  g.fillStyle = COLORS.cream;
  g.fillText('SPREE', 58, 214);
  return tex(c);
}

/** Text painted onto the ground plane. Returns texture + aspect ratio. */
export function labelTexture(text: string, color = '#ffffff', weight = 600) {
  const fontPx = 72;
  const [m, mg] = canvas(8, 8);
  void m;
  mg.font = `${weight} ${fontPx}px "JetBrains Mono", ui-monospace, monospace`;
  const spacing = fontPx * 0.32;
  const w = Math.ceil(mg.measureText(text).width + spacing * text.length + 24);
  const [c, g] = canvas(w, 104);
  g.font = mg.font;
  g.fillStyle = color;
  g.textBaseline = 'middle';
  let x = 12;
  for (const ch of text) {
    g.fillText(ch, x, 54);
    x += g.measureText(ch).width + spacing;
  }
  const t = tex(c);
  return { texture: t, aspect: w / 104 };
}

function mulberry(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
