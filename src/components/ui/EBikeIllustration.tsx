import { LogoBadge } from './Logo';

/**
 * Detailed side-view of an ON-SPREE courier e-bike: mid-drive motor,
 * down-tube battery, hydraulic disc brakes, chain drive, mudguards,
 * lights, handlebar display, rear rack with an insulated delivery box.
 * Wheels spin and the road scrolls unless reduced motion is requested.
 */
const R = { x: 150, y: 262 }; // rear axle
const F = { x: 458, y: 262 }; // front axle
const BB = { x: 292, y: 278 }; // bottom bracket

function Wheel({ x, y, animate, dur }: { x: number; y: number; animate: boolean; dur: string }) {
  const spokes = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2;
    const off = (i % 2 ? 1 : -1) * 0.22; // tangential lacing
    return (
      <line
        key={i}
        x1={x + Math.cos(a + off) * 7}
        y1={y + Math.sin(a + off) * 7}
        x2={x + Math.cos(a) * 72}
        y2={y + Math.sin(a) * 72}
      />
    );
  });
  return (
    <g>
      <circle cx={x} cy={y} r={88} className="eb-tire" />
      <circle cx={x} cy={y} r={88} className="eb-tread" />
      <circle cx={x} cy={y} r={78} className="eb-rim" />
      <circle cx={x} cy={y} r={73} className="eb-rim-inner" />
      <g>
        {animate && <animateTransform attributeName="transform" type="rotate" from={`0 ${x} ${y}`} to={`360 ${x} ${y}`} dur={dur} repeatCount="indefinite" />}
        <g className="eb-spokes">{spokes}</g>
        <circle cx={x} cy={y} r={19} className="eb-rotor" />
        {Array.from({ length: 6 }, (_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return <circle key={i} cx={x + Math.cos(a) * 13} cy={y + Math.sin(a) * 13} r={2.4} className="eb-rotor-hole" />;
        })}
      </g>
      <circle cx={x} cy={y} r={8} className="eb-hub" />
      <circle cx={x} cy={y} r={3} className="eb-axle" />
    </g>
  );
}

export function EBikeIllustration({ animate, className }: { animate: boolean; className?: string }) {
  const dur = '1.4s';
  return (
    <svg className={className} viewBox="0 0 640 380" role="img" aria-label="ON-SPREE courier e-bike with an insulated delivery box">
      <defs>
        <linearGradient id="eb-beam" x1="0" x2="1">
          <stop offset="0" stopColor="#FFF6D8" stopOpacity=".55" />
          <stop offset="1" stopColor="#FFF6D8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="eb-batt" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2A9BE0" />
          <stop offset="1" stopColor="#055A8F" />
        </linearGradient>
        <clipPath id="eb-box-clip">
          <rect x="92" y="30" width="144" height="128" rx="14" />
        </clipPath>
      </defs>

      {/* road + speed lines */}
      <ellipse cx="304" cy="352" rx="250" ry="10" className="eb-shadow" />
      <g className="eb-road">
        <line x1="-40" y1="352" x2="700" y2="352" />
        {animate && <animate attributeName="stroke-dashoffset" from="0" to="-60" dur="0.6s" repeatCount="indefinite" />}
      </g>
      <g className="eb-speed">
        {[70, 120, 200].map((y, i) => (
          <line key={y} x1={-20 - i * 40} y1={y} x2={60 - i * 40} y2={y}>
            {animate && <animate attributeName="x1" values={`${40 - i * 30};${-60 - i * 30}`} dur={`${0.9 + i * 0.2}s`} repeatCount="indefinite" />}
          </line>
        ))}
      </g>

      {/* headlight beam */}
      <path d="M452 150 L640 120 L640 214 Z" fill="url(#eb-beam)" className="eb-beamfx" />

      {/* mudguards (behind wheels' upper half) */}
      <path d={`M${R.x - 92} ${R.y - 18} A96 96 0 0 1 ${R.x + 70} ${R.y - 68}`} className="eb-fender" />
      <path d={`M${F.x - 74} ${F.y - 62} A96 96 0 0 1 ${F.x + 94} ${F.y - 10}`} className="eb-fender" />

      <Wheel x={R.x} y={R.y} animate={animate} dur={dur} />
      <Wheel x={F.x} y={F.y} animate={animate} dur={dur} />

      {/* rear rack */}
      <path d="M104 162 H244 M118 162 L150 262 M184 162 L150 262 M240 162 L252 146" className="eb-rack" />

      {/* chain + cassette */}
      <circle cx={R.x} cy={R.y} r={12} className="eb-cog" />
      <path d={`M${R.x} ${R.y - 12} L${BB.x} ${BB.y - 25} M${R.x} ${R.y + 12} L${BB.x} ${BB.y + 25}`} className="eb-chain" />

      {/* frame */}
      <path d={`M${BB.x} ${BB.y} L${R.x} ${R.y}`} className="eb-tube eb-tube--stay" />
      <path d={`M252 140 L${R.x} ${R.y}`} className="eb-tube eb-tube--stay" />
      <path d={`M${BB.x} ${BB.y} L248 118`} className="eb-tube" />
      <path d="M252 134 L418 128" className="eb-tube" />
      <path d={`M${BB.x} ${BB.y} L432 170`} className="eb-tube eb-tube--down" />
      <path d="M416 116 L434 176" className="eb-tube eb-tube--head" />
      <path d={`M432 170 Q452 214 ${F.x} ${F.y}`} className="eb-fork" />

      {/* integrated battery on the down tube */}
      <g transform="translate(356 226) rotate(-37.6)">
        <rect x="-62" y="-13" width="124" height="26" rx="12" fill="url(#eb-batt)" />
        <rect x="-54" y="-8" width="80" height="4" rx="2" fill="rgba(255,255,255,.45)" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={36 + i * 6} cy={5} r={1.8} className={i < 3 ? 'eb-led' : 'eb-led eb-led--off'} />
        ))}
      </g>

      {/* mid-drive motor */}
      <ellipse cx={BB.x + 4} cy={BB.y - 4} rx="33" ry="27" className="eb-motor" />
      <path d={`M${BB.x - 20} ${BB.y - 22} Q${BB.x + 8} ${BB.y - 34} ${BB.x + 30} ${BB.y - 14}`} className="eb-motor-hl" />
      {/* chainring + cranks */}
      <circle cx={BB.x} cy={BB.y} r={25} className="eb-ring" />
      <circle cx={BB.x} cy={BB.y} r={18} className="eb-ring-inner" />
      <g>
        {animate && <animateTransform attributeName="transform" type="rotate" from={`0 ${BB.x} ${BB.y}`} to={`360 ${BB.x} ${BB.y}`} dur="2.2s" repeatCount="indefinite" />}
        <line x1={BB.x} y1={BB.y} x2={BB.x + 26} y2={BB.y + 40} className="eb-crank" />
        <rect x={BB.x + 14} y={BB.y + 38} width="26" height="7" rx="2" className="eb-pedal" />
        <line x1={BB.x} y1={BB.y} x2={BB.x - 26} y2={BB.y - 40} className="eb-crank eb-crank--far" />
      </g>
      <circle cx={BB.x} cy={BB.y} r={5} className="eb-axle" />

      {/* kickstand */}
      <path d={`M${BB.x - 34} ${BB.y + 4} L${BB.x - 60} ${BB.y + 70}`} className="eb-kick" />

      {/* seatpost + saddle */}
      <path d="M248 118 L242 92" className="eb-post" />
      <path d="M206 92 C214 82 252 80 276 86 C272 94 246 98 226 98 Z" className="eb-saddle" />

      {/* stem, handlebar, grip, lever, display, bell */}
      <path d="M416 116 L424 96 L392 88" className="eb-bar" />
      <path d="M392 88 L372 92" className="eb-grip" />
      <path d="M398 92 L382 108" className="eb-lever" />
      <rect x="416" y="84" width="22" height="13" rx="3" className="eb-display" />
      <rect x="419" y="87" width="16" height="7" rx="1.5" className="eb-display-screen" />
      {/* lights */}
      <rect x="438" y="140" width="16" height="12" rx="4" className="eb-headlight" />
      <rect x="96" y="164" width="12" height="8" rx="2" className="eb-taillight" />
      {/* brake calipers */}
      <rect x={R.x + 10} y={R.y - 26} width="14" height="10" rx="3" className="eb-caliper" />
      <rect x={F.x - 26} y={F.y - 28} width="14" height="10" rx="3" className="eb-caliper" />

      {/* insulated delivery box on the rack, printed with the ON / SPREE badge */}
      <g className="eb-boxwrap">
        <g clipPath="url(#eb-box-clip)">
          <rect x="92" y="30" width="144" height="128" fill="#EFEEE0" />
          <rect x="92" y="125" width="144" height="33" fill="#0A7FC7" />
          <svg x="80" y="45" width="156" height="97.5" aria-hidden="true">
            <LogoBadge />
          </svg>
        </g>
        <rect x="92" y="30" width="144" height="128" rx="14" className="eb-box-edge" />
        <path d="M120 30 V22 Q120 16 126 16 H202 Q208 16 208 22 V30" className="eb-handle" />
      </g>
    </svg>
  );
}
