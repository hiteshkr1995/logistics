import { useCallback, useEffect, useRef, type KeyboardEvent } from 'react';
import { StaticMap, VB } from './StaticMap';
import { LiveLayer } from './LiveLayer';
import { P, U } from './iso';
import { IconLocate, IconMinus, IconPlus } from '../ui/icons';
import './map.css';

export type MapLayout = 'desktop' | 'stacked' | 'compact';

interface Cam {
  x: number;
  y: number;
  s: number;
}

/** Initial framing per layout: which world point sits where, and at what zoom. */
function framing(layout: MapLayout, vw: number, vh: number) {
  if (layout === 'compact') return { wx: 30, wy: 19.5, fx: 0.48, fy: 0.46, s: Math.min(1, Math.max(0.62, (vw / 430) * 0.86)) };
  if (layout === 'stacked') return { wx: 25.5, wy: 18.5, fx: 0.5, fy: 0.52, s: Math.min(1.05, Math.max(0.66, vw / 1050)) };
  return { wx: 25.8, wy: 19.6, fx: 0.69, fy: 0.55, s: Math.min(1.6, Math.max(0.8, Math.min(vw / 1440, vh / 860) * 1.1)) };
}

// Keep the viewport centre over the city (screen-space bounds, in px).
const BOUNDS = { x0: -30 * U - VB.x, x1: 46 * U - VB.x, y0: 4 * U - VB.y, y1: 44 * U - VB.y };

export default function BerlinMap({ layout, reducedMotion }: { layout: MapLayout; reducedMotion: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cam = useRef<Cam>({ x: 0, y: 0, s: 1 });
  const base = useRef(1);
  const touched = useRef(false);
  const animTimer = useRef<number>();

  const apply = useCallback(
    (animate = false) => {
      const st = stageRef.current;
      const wrap = wrapRef.current;
      if (!st || !wrap) return;
      const { width: vw, height: vh } = wrap.getBoundingClientRect();
      const c = cam.current;
      // clamp the viewport centre into the city bounds
      const cx = Math.min(BOUNDS.x1, Math.max(BOUNDS.x0, (vw / 2 - c.x) / c.s));
      const cy = Math.min(BOUNDS.y1, Math.max(BOUNDS.y0, (vh / 2 - c.y) / c.s));
      c.x = vw / 2 - cx * c.s;
      c.y = vh / 2 - cy * c.s;
      if (animate && !reducedMotion) {
        st.classList.add('is-animating');
        window.clearTimeout(animTimer.current);
        animTimer.current = window.setTimeout(() => st.classList.remove('is-animating'), 520);
      } else {
        st.classList.remove('is-animating');
      }
      st.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0) scale(${c.s.toFixed(4)})`;
    },
    [reducedMotion],
  );

  const reset = useCallback(
    (animate = false) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const { width: vw, height: vh } = wrap.getBoundingClientRect();
      const f = framing(layout, vw, vh);
      const [sx, sy] = P(f.wx, f.wy);
      base.current = f.s;
      cam.current = { s: f.s, x: vw * f.fx - (sx - VB.x) * f.s, y: vh * f.fy - (sy - VB.y) * f.s };
      apply(animate);
    },
    [layout, apply],
  );

  const zoomAt = useCallback(
    (factor: number, ax?: number, ay?: number, animate = true) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const { width: vw, height: vh } = wrap.getBoundingClientRect();
      const c = cam.current;
      const px = ax ?? vw / 2;
      const py = ay ?? vh / 2;
      const s = Math.min(base.current * 2.6, Math.max(base.current * 0.72, c.s * factor));
      c.x = px - ((px - c.x) * s) / c.s;
      c.y = py - ((py - c.y) * s) / c.s;
      c.s = s;
      touched.current = true;
      apply(animate);
    },
    [apply],
  );

  // Initial framing + keep framing on resize (until the user has explored)
  useEffect(() => {
    reset(false);
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => (touched.current ? apply(false) : reset(false)));
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [reset, apply]);

  // Drag to pan, pinch to zoom, ctrl/⌘ + wheel (trackpad pinch) to zoom
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const pointers = new Map<number, { x: number; y: number }>();
    let dragging = false;
    let pinchDist = 0;
    let vx = 0;
    let vy = 0;
    let lastT = 0;
    let inertia = 0;

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      cancelAnimationFrame(inertia);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      }
      lastT = performance.now();
      vx = vy = 0;
    };
    const move = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      if (!dragging && Math.hypot(dx, dy) < 4 && pointers.size === 1) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (!dragging) {
        dragging = true;
        wrap.classList.add('is-dragging');
        try {
          wrap.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      touched.current = true;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const r = wrap.getBoundingClientRect();
        if (pinchDist) zoomAt(d / pinchDist, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, false);
        pinchDist = d;
        return;
      }
      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      vx = dx / dt;
      vy = dy / dt;
      lastT = now;
      cam.current.x += dx;
      cam.current.y += dy;
      apply(false);
    };
    const up = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchDist = 0;
      if (pointers.size === 0 && dragging) {
        dragging = false;
        wrap.classList.remove('is-dragging');
        if (!reducedMotion && performance.now() - lastT < 80) {
          let ivx = vx * 16;
          let ivy = vy * 16;
          const step = () => {
            ivx *= 0.92;
            ivy *= 0.92;
            cam.current.x += ivx;
            cam.current.y += ivy;
            apply(false);
            if (Math.hypot(ivx, ivy) > 0.3) inertia = requestAnimationFrame(step);
          };
          inertia = requestAnimationFrame(step);
        }
      }
    };
    const wheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const r = wrap.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0045), e.clientX - r.left, e.clientY - r.top, false);
    };
    wrap.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    wrap.addEventListener('wheel', wheel, { passive: false });
    return () => {
      cancelAnimationFrame(inertia);
      wrap.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      wrap.removeEventListener('wheel', wheel);
    };
  }, [apply, zoomAt, reducedMotion]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const step = 80;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [step, 0],
      ArrowRight: [-step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    };
    if (moves[e.key]) {
      e.preventDefault();
      cam.current.x += moves[e.key][0];
      cam.current.y += moves[e.key][1];
      touched.current = true;
      apply(true);
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      zoomAt(1.3);
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      zoomAt(1 / 1.3);
    } else if (e.key === '0') {
      e.preventDefault();
      touched.current = false;
      reset(true);
    }
  };

  return (
    <div className={`bmap bmap--${layout}`}>
      <div
        ref={wrapRef}
        className="bmap__viewport"
        tabIndex={0}
        role="region"
        aria-roledescription="interactive map"
        aria-label="Illustrated map of Berlin showing Spur e-bike couriers riding between micro-hubs, drop-offs and landmarks such as the Brandenburg Gate, Reichstag, Berlin Cathedral, TV Tower, Victory Column and Oberbaum Bridge. Drag or use arrow keys to pan, plus and minus to zoom, 0 to reset."
        onKeyDown={onKey}
      >
        <div ref={stageRef} className="bmap__stage" style={{ width: VB.w, height: VB.h }}>
          <StaticMap />
          <LiveLayer compact={layout === 'compact'} reducedMotion={reducedMotion} />
        </div>
      </div>
      <div className="bmap__haze" aria-hidden="true" />
      <div className="bmap__controls" role="group" aria-label="Map controls">
        <button type="button" className="glass-btn" onClick={() => zoomAt(1.3)} aria-label="Zoom in">
          <IconPlus />
        </button>
        <button type="button" className="glass-btn" onClick={() => zoomAt(1 / 1.3)} aria-label="Zoom out">
          <IconMinus />
        </button>
        <button
          type="button"
          className="glass-btn"
          onClick={() => {
            touched.current = false;
            reset(true);
          }}
          aria-label="Reset map view"
        >
          <IconLocate />
        </button>
      </div>
    </div>
  );
}
