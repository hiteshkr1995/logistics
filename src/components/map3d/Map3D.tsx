import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
import { buildScene, type MarkerDef } from './scene';
import { IconLocate, IconMinus, IconPlus } from '../ui/icons';
import type { MapLayout } from '../map/BerlinMap';
import './map3d.css';

interface View {
  target: THREE.Vector3;
  radius: number;
  phi: number; // polar angle from straight down
  theta: number; // azimuth (π/4 = viewing from the south-east)
}

/** Initial camera per layout. `shift` pushes the city right of the hero copy. */
function framing(layout: MapLayout, w: number, h: number): View & { shift: number } {
  const aspect = w / Math.max(h, 1);
  if (layout === 'compact') return { target: new THREE.Vector3(29.5, 0, 17.5), radius: 66 / Math.min(1, aspect * 1.6), phi: 0.92, theta: Math.PI / 4, shift: 0 };
  if (layout === 'stacked') return { target: new THREE.Vector3(28, 0, 19.5), radius: 70, phi: 0.92, theta: Math.PI / 4, shift: 0 };
  return { target: new THREE.Vector3(29.5, 0, 21.8), radius: 68 * Math.max(1, 1.55 / aspect), phi: 0.88, theta: Math.PI / 4, shift: 0.16 };
}

const LIMITS = { minR: 18, maxR: 120, minPhi: 0.3, maxPhi: 1.2, x0: 0, x1: 55, z0: 2, z1: 40 };
const ease = (k: number) => 1 - Math.pow(1 - k, 3);

export default function Map3D({ layout, reducedMotion, onFail }: { layout: MapLayout; reducedMotion: boolean; onFail: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const api = useRef<{ zoom: (f: number) => void; rotate: (d: number) => void; reset: () => void; pan: (dx: number, dz: number) => void } | null>(null);
  const [markers, setMarkers] = useState<MarkerDef[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch {
      onFail();
      return;
    }
    const small = window.matchMedia('(max-width: 1023px)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.6 : 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'm3d__canvas';
    wrap.prepend(renderer.domElement);

    let disposed = false;
    const camera = new THREE.PerspectiveCamera(28, 1, 0.5, 400);
    const controls = new MapControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.085;
    controls.screenSpacePanning = false;
    controls.minDistance = LIMITS.minR;
    controls.maxDistance = LIMITS.maxR;
    controls.minPolarAngle = LIMITS.minPhi;
    controls.maxPolarAngle = LIMITS.maxPhi;
    controls.rotateSpeed = 0.55;
    controls.zoomSpeed = 0.8;
    renderer.domElement.style.touchAction = 'pan-y'; // keep page scrolling on phones

    // Plain mouse-wheel scrolls the page; ctrl/⌘ + wheel (and trackpad pinch) zooms the map.
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) e.stopPropagation();
    };
    wrap.addEventListener('wheel', onWheel, { capture: true });

    let frame = { ...framing(layout, wrap.clientWidth, wrap.clientHeight) };
    const scene = buildScene(renderer, { compact: layout === 'compact', shadowSize: small ? 2048 : 4096 });
    setMarkers(scene.markers);

    const sph = new THREE.Spherical();
    const place = (v: View) => {
      sph.set(v.radius, v.phi, v.theta);
      camera.position.setFromSpherical(sph).add(v.target);
      controls.target.copy(v.target);
      camera.lookAt(v.target);
    };
    const current = (): View => {
      const off = camera.position.clone().sub(controls.target);
      sph.setFromVector3(off);
      return { target: controls.target.clone(), radius: sph.radius, phi: sph.phi, theta: sph.theta };
    };

    // Camera tweens (buttons, reset, entrance fly-in)
    let tween: { from: View; to: View; t0: number; dur: number } | null = null;
    const animateTo = (to: View, dur = 700) => {
      if (reducedMotion) {
        place(to);
        controls.update();
        return;
      }
      tween = { from: current(), to, t0: performance.now(), dur };
    };

    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      if (frame.shift) camera.setViewOffset(w, h, -w * frame.shift, 0, w, h);
      else camera.clearViewOffset();
      camera.updateProjectionMatrix();
    };
    let touched = false;
    const ro = new ResizeObserver(() => {
      const prev = frame;
      frame = framing(layout, wrap.clientWidth, wrap.clientHeight);
      resize();
      if (!touched && !tween) place(frame);
      else frame = { ...frame, target: prev.target };
    });
    ro.observe(wrap);
    resize();

    // Entrance: fly in from high above
    if (reducedMotion) place(frame);
    else {
      place({ ...frame, radius: frame.radius * 1.9, phi: 0.38, theta: frame.theta + 0.9 });
      tween = { from: current(), to: frame, t0: performance.now() + 150, dur: 2600 };
    }
    controls.addEventListener('start', () => {
      touched = true;
      tween = null;
    });

    api.current = {
      zoom: (f) => {
        touched = true;
        const v = current();
        animateTo({ ...v, radius: THREE.MathUtils.clamp(v.radius * f, LIMITS.minR, LIMITS.maxR) });
      },
      rotate: (d) => {
        touched = true;
        const v = current();
        animateTo({ ...v, theta: v.theta + d });
      },
      pan: (dx, dz) => {
        touched = true;
        const v = current();
        const k = v.radius / 40;
        const fwd = new THREE.Vector3(-Math.sin(v.theta), 0, -Math.cos(v.theta));
        const right = new THREE.Vector3(Math.cos(v.theta), 0, -Math.sin(v.theta));
        const t = v.target.clone().addScaledVector(right, dx * k).addScaledVector(fwd, dz * k);
        animateTo({ ...v, target: t }, 400);
      },
      reset: () => {
        touched = false;
        animateTo(framing(layout, wrap.clientWidth, wrap.clientHeight), 900);
      },
    };

    // Render loop — paused when off-screen or the tab is hidden
    let visible = true;
    let raf = 0;
    const clock = new THREE.Clock();
    let elapsed = 0;
    const proj = new THREE.Vector3();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.1);
      elapsed += dt;
      if (tween) {
        const k = THREE.MathUtils.clamp((performance.now() - tween.t0) / tween.dur, 0, 1);
        const e = ease(k);
        const a = tween.from;
        const b = tween.to;
        let dTheta = b.theta - a.theta;
        dTheta = Math.atan2(Math.sin(dTheta), Math.cos(dTheta));
        place({
          target: a.target.clone().lerp(b.target, e),
          radius: a.radius + (b.radius - a.radius) * e,
          phi: a.phi + (b.phi - a.phi) * e,
          theta: a.theta + dTheta * e,
        });
        if (k >= 1) tween = null;
      } else {
        controls.update();
      }
      // keep the camera over the city
      const t = controls.target;
      const cx = THREE.MathUtils.clamp(t.x, LIMITS.x0, LIMITS.x1);
      const cz = THREE.MathUtils.clamp(t.z, LIMITS.z0, LIMITS.z1);
      if (cx !== t.x || cz !== t.z || t.y !== 0) {
        const d = new THREE.Vector3(cx - t.x, -t.y, cz - t.z);
        t.add(d);
        camera.position.add(d);
      }
      const dist = camera.position.distanceTo(t);
      const fog = scene.scene.fog as THREE.Fog;
      fog.near = dist * 1.05;
      fog.far = dist * 2.4;
      scene.sun.position.set(t.x - 45, 70, t.z + 18);
      scene.sun.target.position.copy(t);

      scene.update(elapsed, !reducedMotion);
      renderer.render(scene.scene, camera);

      // project HTML markers
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      for (const m of scene.markers) {
        const el = markerRefs.current.get(m.id);
        if (!el) continue;
        proj.copy(m.pos).project(camera);
        const x = (proj.x * 0.5 + 0.5) * w;
        const y = (-proj.y * 0.5 + 0.5) * h;
        const hidden = proj.z > 1 || x < -40 || x > w + 40 || y < -40 || y > h + 40;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        el.style.visibility = hidden ? 'hidden' : 'visible';
      }
    };
    const start = () => {
      if (!raf && visible && !document.hidden && !disposed) {
        clock.getDelta();
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(wrap);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    start();
    requestAnimationFrame(() => setReady(true));

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      wrap.removeEventListener('wheel', onWheel, { capture: true });
      controls.dispose();
      scene.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      api.current = null;
    };
  }, [layout, reducedMotion, onFail]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || !api.current) return;
    const a = api.current;
    const keys: Record<string, () => void> = {
      ArrowLeft: () => a.pan(-4, 0),
      ArrowRight: () => a.pan(4, 0),
      ArrowUp: () => a.pan(0, 4),
      ArrowDown: () => a.pan(0, -4),
      '+': () => a.zoom(0.78),
      '=': () => a.zoom(0.78),
      '-': () => a.zoom(1.28),
      q: () => a.rotate(Math.PI / 4),
      e: () => a.rotate(-Math.PI / 4),
      '0': () => a.reset(),
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };

  return (
    <div className={`m3d m3d--${layout} ${ready ? 'is-ready' : ''}`}>
      <div
        ref={wrapRef}
        className="m3d__viewport"
        tabIndex={0}
        role="region"
        aria-roledescription="interactive 3D map"
        aria-label="3D map of Berlin showing ON-SPREE e-bike couriers riding between micro-hubs and drop-offs past the Brandenburg Gate, Reichstag, Berlin Cathedral, TV Tower, Victory Column and Oberbaum Bridge. Drag to pan, right-drag or two fingers to rotate, ctrl plus scroll to zoom. Keyboard: arrows pan, plus and minus zoom, Q and E rotate, 0 resets."
        onKeyDown={onKey}
      >
        <div className="m3d__pins">
          {markers.map((m, i) => (
            <button
              key={m.id}
              type="button"
              ref={(el) => {
                if (el) markerRefs.current.set(m.id, el);
                else markerRefs.current.delete(m.id);
              }}
              className={`pin pin--${m.kind}`}
              style={{ ['--d' as string]: `${2.2 + i * 0.07}s` }}
              aria-label={`${m.title} — ${m.sub}`}
            >
              <span className="pin__icon" aria-hidden="true">
                {m.kind === 'hub' && (
                  <svg viewBox="0 0 24 24"><path d="M13.4 3 6 13.4h5.2L10.4 21 18 10.6h-5.2z" /></svg>
                )}
                {m.kind === 'drop' && (
                  <svg viewBox="0 0 24 24"><path d="M12 3.5 19.5 7.3v9.4L12 20.5l-7.5-3.8V7.3z M4.5 7.3 12 11.1l7.5-3.8 M12 11.1v9.4" /></svg>
                )}
              </span>
              <span className="pin__tip" aria-hidden="true">
                <strong>{m.title}</strong>
                <em>{m.sub}</em>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="m3d__tiltshift" aria-hidden="true" />
      <div className="m3d__controls" role="group" aria-label="Map controls">
        <button type="button" className="glass-btn" onClick={() => api.current?.zoom(0.78)} aria-label="Zoom in"><IconPlus /></button>
        <div className="m3d__rotate">
          <button type="button" className="glass-btn" onClick={() => api.current?.rotate(Math.PI / 4)} aria-label="Rotate map left">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" className="glass-btn" onClick={() => api.current?.rotate(-Math.PI / 4)} aria-label="Rotate map right">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <button type="button" className="glass-btn" onClick={() => api.current?.zoom(1.28)} aria-label="Zoom out"><IconMinus /></button>
        <button type="button" className="glass-btn" onClick={() => api.current?.reset()} aria-label="Reset map view"><IconLocate /></button>
      </div>
    </div>
  );
}
