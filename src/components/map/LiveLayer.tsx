import { memo, useEffect, useMemo, useRef } from 'react';
import { GROUND, P } from './iso';
import { BikeSprite } from './BikeSprite';
import { buildTimeline, poseAt, routeD, type Timeline } from './routes';
import { VB } from './StaticMap';
import {
  DISTRICT_LABELS, EXTRA_DROPS, HUBS, LANDMARKS, MITTE_ZONE, ROUTES, type BikeVariant,
} from './world';

interface BikeInst {
  id: string;
  tl: Timeline;
  offset: number;
  v: BikeVariant;
}

const BIKE_SCALE = 0.72;

function Tip({ title, sub, y = -40 }: { title: string; sub: string; y?: number }) {
  const w = Math.max(title.length * 6.6, sub.length * 5.6) + 26;
  return (
    <g className="mk-tip" transform={`translate(0 ${y})`}>
      <rect x={-w / 2} y={-30} width={w} height={36} rx={10} className="mk-tip-bg" />
      <text x={0} y={-14} textAnchor="middle" className="mk-tip-title">
        {title}
      </text>
      <text x={0} y={-1} textAnchor="middle" className="mk-tip-sub">
        {sub}
      </text>
      <path d="M-5 6 L0 11 L5 6 Z" className="mk-tip-bg" />
    </g>
  );
}

function HubPin({ x, y, z, label, i }: { x: number; y: number; z: number; label: string; i: number }) {
  const [sx, sy] = P(x, y, z);
  return (
    <g className="mk mk-hub" transform={`translate(${sx} ${sy})`} tabIndex={0} role="img" aria-label={`Spur micro-hub, ${label}`} style={{ ['--d' as string]: `${0.9 + i * 0.12}s` }}>
      <g className="mk-pop">
        <ellipse className="mk-pulse" cx={0} cy={0} rx={14} ry={7} />
        <path d="M0 0 C-2 -5 -12 -10 -12 -21 A12 12 0 1 1 12 -21 C12 -10 2 -5 0 0Z" className="mk-hub-pin" />
        <circle cx={0} cy={-21} r={8.2} className="mk-hub-core" />
        <path d="M1.4 -26.4 L-3.2 -20 L0 -20 L-1.4 -15.6 L3.2 -22 L0 -22 Z" className="mk-hub-bolt" />
        <Tip title={`Spur Hub · ${label}`} sub="Micro-hub & e-bike charging" y={-42} />
      </g>
    </g>
  );
}

function DropPin({ x, y, title, sub, i }: { x: number; y: number; title: string; sub: string; i: number }) {
  const [sx, sy] = P(x, y, 0);
  return (
    <g className="mk mk-drop" transform={`translate(${sx} ${sy})`} tabIndex={0} role="img" aria-label={title} style={{ ['--d' as string]: `${1.3 + i * 0.1}s` }}>
      <g className="mk-pop">
        <ellipse className="mk-pulse" cx={0} cy={0} rx={11} ry={5.5} />
        <path d="M0 0 C-1.6 -4 -9 -7.5 -9 -15.5 A9 9 0 1 1 9 -15.5 C9 -7.5 1.6 -4 0 0Z" className="mk-drop-pin" />
        <path d="M-4 -17.6 L0 -19.6 L4 -17.6 L4 -13 L0 -11 L-4 -13 Z" className="mk-drop-box" />
        <path d="M-4 -17.6 L0 -15.6 L4 -17.6 M0 -15.6 L0 -11" className="mk-drop-line" />
        <Tip title={title} sub={sub} y={-30} />
      </g>
    </g>
  );
}

function Hotspot({ x, y, z, title, sub, i }: { x: number; y: number; z: number; title: string; sub: string; i: number }) {
  const [sx, sy] = P(x, y, z);
  return (
    <g className="mk mk-spot" transform={`translate(${sx} ${sy})`} tabIndex={0} role="img" aria-label={`${title} — ${sub}`} style={{ ['--d' as string]: `${0.6 + i * 0.1}s` }}>
      <g className="mk-pop">
        <circle r={9} className="mk-spot-ring" />
        <circle r={4.6} className="mk-spot-dot" />
        <Tip title={title} sub={sub} y={-12} />
      </g>
    </g>
  );
}

/**
 * Animated overlay: service zone, route lines, moving e-bikes, map pins.
 * Bike positions are written straight to the DOM in a rAF loop (no React
 * re-renders), and the loop pauses when the map is off-screen or the tab
 * is hidden. With reduced motion, bikes are placed once and stay still.
 */
export const LiveLayer = memo(function LiveLayer({ compact, reducedMotion }: { compact: boolean; reducedMotion: boolean }) {
  const routes = useMemo(() => ROUTES.filter((r) => !compact || r.compact), [compact]);
  const bikes = useMemo<BikeInst[]>(
    () =>
      routes.flatMap((r) => {
        const tl = buildTimeline(r);
        return r.bikes.map((b, i) => ({ id: `${r.id}-${i}`, tl, offset: b.phase * tl.total, v: b.v }));
      }),
    [routes],
  );
  const svgRef = useRef<SVGSVGElement>(null);
  const posRefs = useRef<(SVGGElement | null)[]>([]);
  const dirRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const place = (time: number) => {
      bikes.forEach((b, i) => {
        const p = poseAt(b.tl, time + b.offset);
        const [sx, sy] = P(p.x, p.y, p.z);
        posRefs.current[i]?.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)})`);
        const a = (p.dx - p.dy) * BIKE_SCALE;
        const bb = ((p.dx + p.dy) / 2) * BIKE_SCALE;
        dirRefs.current[i]?.setAttribute('transform', `matrix(${a.toFixed(3)} ${bb.toFixed(3)} 0 0.8 0 0)`);
      });
    };
    if (reducedMotion) {
      place(4);
      return;
    }
    let raf = 0;
    let visible = true;
    let last = performance.now();
    let clock = 4; // seconds of simulated time
    const tick = (now: number) => {
      clock += Math.min(0.1, (now - last) / 1000);
      last = now;
      place(clock);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
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
    if (svgRef.current) io.observe(svgRef.current);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    place(clock);
    start();
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [bikes, reducedMotion]);

  const [bx, by] = P(23.05, 24.3, 0.8);
  const [, beamTop] = P(23.05, 24.3, 9);
  const shown = routes.filter((r) => r.show);

  return (
    <svg
      ref={svgRef}
      className="map-svg map-svg--live"
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      width={VB.w}
      height={VB.h}
    >
      <defs>
        <radialGradient id="zoneFill">
          <stop offset="0" stopColor="#2BD67B" stopOpacity=".2" />
          <stop offset=".75" stopColor="#2BD67B" stopOpacity=".07" />
          <stop offset="1" stopColor="#2BD67B" stopOpacity=".22" />
        </radialGradient>
        <linearGradient id="beam" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stopColor="#2BD67B" stopOpacity=".55" />
          <stop offset="1" stopColor="#2BD67B" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="bikeHalo">
          <stop offset="0" stopColor="#2BD67B" stopOpacity=".45" />
          <stop offset="1" stopColor="#2BD67B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground-plane overlays: service zone, labels, route lines */}
      <g transform={GROUND} className="live-ground" aria-hidden="true">
        <circle cx={MITTE_ZONE.x} cy={MITTE_ZONE.y} r={MITTE_ZONE.r} fill="url(#zoneFill)" className="zone-fill" />
        <circle cx={MITTE_ZONE.x} cy={MITTE_ZONE.y} r={MITTE_ZONE.r} className="zone-ring" />
        <g>
          {!reducedMotion && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${MITTE_ZONE.x} ${MITTE_ZONE.y}`}
              to={`360 ${MITTE_ZONE.x} ${MITTE_ZONE.y}`}
              dur="90s"
              repeatCount="indefinite"
            />
          )}
          <circle cx={MITTE_ZONE.x} cy={MITTE_ZONE.y} r={MITTE_ZONE.r + 0.7} className="zone-dash" />
        </g>
        <text
          className="ground-label ground-label--zone"
          x={MITTE_ZONE.x - 5.6}
          y={MITTE_ZONE.y + MITTE_ZONE.r - 0.9}
        >
          SAME-DAY ZONE · MITTE
        </text>
        {DISTRICT_LABELS.filter((d) => !compact || d.compact).map((d) => (
          <text key={d.text} className="ground-label" x={d.x} y={d.y}>
            {d.text}
          </text>
        ))}
        {shown.map((r, i) => (
          <g key={r.id} className="route" style={{ ['--d' as string]: `${0.5 + i * 0.25}s` }}>
            <path d={routeD(r)} className="route-glow" />
            <path d={routeD(r)} className="route-line" pathLength={1} />
            <path d={routeD(r)} className="route-flow" />
          </g>
        ))}
      </g>

      {/* Light beam above Hub Mitte */}
      <g className="beam" aria-hidden="true">
        <path d={`M${bx - 16} ${by} L${bx - 9} ${beamTop} L${bx + 9} ${beamTop} L${bx + 16} ${by} Z`} fill="url(#beam)" />
        <path d={`M${bx - 4} ${by} L${bx - 2} ${beamTop} L${bx + 2} ${beamTop} L${bx + 4} ${by} Z`} fill="url(#beam)" />
      </g>

      {/* Bikes */}
      <g aria-hidden="true">
        {bikes.map((b, i) => (
          <g key={b.id} ref={(el) => (posRefs.current[i] = el)} className="bike">
            <ellipse cx={0} cy={0} rx={15} ry={7} fill="url(#bikeHalo)" />
            <ellipse cx={1} cy={0.5} rx={9} ry={3.4} fill="rgba(25,35,30,.22)" />
            <g ref={(el) => (dirRefs.current[i] = el)}>
              <g className="bike-bob" style={{ animationDelay: `${(i % 5) * -0.13}s` }}>
                <BikeSprite v={b.v} />
              </g>
            </g>
          </g>
        ))}
      </g>

      {/* Pins */}
      <g className="pins">
        {HUBS.map((h, i) => (
          <HubPin key={h.id} i={i} x={(h.box.x0 + h.box.x1) / 2} y={(h.box.y0 + h.box.y1) / 2} z={0.95} label={h.name} />
        ))}
        {shown
          .filter((r) => r.dest && !r.dest.title.startsWith('Hub'))
          .map((r, i) => {
            const [x, y] = r.pts[r.pts.length - 1];
            return <DropPin key={r.id} i={i} x={x} y={y} title={r.dest!.title} sub={r.dest!.sub} />;
          })}
        {!compact && EXTRA_DROPS.map((d, i) => <DropPin key={d.title} i={i + 3} {...d} />)}
        {LANDMARKS.map((l, i) => (
          <Hotspot key={l.id} i={i} x={l.x} y={l.y} z={l.z} title={l.title} sub={l.sub} />
        ))}
      </g>
    </svg>
  );
});

