import { useState } from 'react';
import { IconCheck, IconPin } from '../ui/icons';
import { LiquidBackdrop } from '../ui/LiquidBackdrop';
import { AREAS } from '../../config';

/* Simplified district shapes — relative positions follow the real city. */
const SHAPES: { district: string; label: string; d: string; at: [number, number] }[] = [
  { district: 'Charlottenburg-Wilmersdorf', label: 'Charlottenburg', d: 'M58 196 L150 160 L232 168 L246 222 L238 300 L186 342 L104 336 L52 286 Z', at: [148, 252] },
  { district: 'Mitte', label: 'Mitte', d: 'M232 168 L300 120 L352 140 L378 176 L366 238 L304 262 L246 222 Z', at: [308, 196] },
  { district: 'Pankow', label: 'Prenzlauer Berg', d: 'M352 140 L362 64 L446 54 L478 128 L420 170 L378 176 Z', at: [414, 116] },
  { district: 'Friedrichshain-Kreuzberg', label: 'Friedrichshain', d: 'M378 176 L420 170 L478 128 L540 178 L516 262 L436 280 L366 238 Z', at: [452, 220] },
  { district: 'Friedrichshain-Kreuzberg', label: 'Kreuzberg', d: 'M246 222 L304 262 L366 238 L436 280 L430 338 L328 360 L238 300 Z', at: [336, 304] },
  { district: 'Neukölln', label: 'Neukölln', d: 'M328 360 L430 338 L486 326 L508 432 L408 474 L336 438 Z', at: [418, 402] },
  { district: 'Tempelhof-Schöneberg', label: 'Schöneberg', d: 'M238 300 L328 360 L336 438 L270 456 L200 410 L186 342 Z', at: [262, 392] },
];

const SPREE = 'M600 300 C 560 290, 520 272, 486 262 C 440 248, 404 236, 376 214 C 352 194, 334 182, 300 176 C 262 170, 232 190, 196 196 C 150 204, 96 226, 30 228';

export default function Coverage() {
  const [active, setActive] = useState('Mitte');
  const current = AREAS.find((a) => a.district === active)!;

  return (
    <section id="coverage" className="section coverage has-liquid" aria-labelledby="coverage-title">
      <LiquidBackdrop />
      <div className="container coverage__grid">
        <div className="coverage__copy" data-reveal>
          <span className="eyebrow">Berlin coverage</span>
          <h2 id="coverage-title" className="h-section">
            Rooted in the Kiez.
            <br />
            <span className="text-brand">Riding across the city.</span>
          </h2>
          <p className="lead">These are the Berlin areas our riders cover today. Pick a district to see its neighbourhoods.</p>
          <div className="coverage__chips" role="group" aria-label="Choose a district">
            {AREAS.map((a) => (
              <button
                key={a.district}
                type="button"
                className={`chip lg-chip ${active === a.district ? 'is-active' : ''}`}
                aria-pressed={active === a.district}
                onClick={() => setActive(a.district)}
                onMouseEnter={() => setActive(a.district)}
              >
                {a.district}
              </button>
            ))}
          </div>
          <div className="coverage__info lg-card" data-glass aria-live="polite">
            <IconPin />
            <div>
              <strong>{current.district}</strong>
              <ul className="coverage__kieze">
                {current.kieze.map((k) => (
                  <li key={k}>
                    <IconCheck /> {k}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="coverage__mapwrap" data-reveal style={{ ['--rd' as string]: '0.1s' }}>
          <div className="coverage__tilt">
            <svg className="coverage__map" viewBox="24 30 560 470" role="img" aria-label={`Map of the Berlin areas ON-SPREE covers, ${current.district} highlighted`}>
              <defs>
                <pattern id="cov-dots" width="12" height="12" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="rgba(20,24,22,.12)" />
                </pattern>
              </defs>
              <rect width="600" height="520" rx="28" fill="url(#cov-dots)" />
              <path className="cov-ring" d="M150 120 C 230 70, 420 40, 520 110 C 590 160, 580 300, 520 380 C 460 460, 300 470, 210 420 C 120 370, 70 200, 150 120 Z" />
              {SHAPES.map((s) => (
                <path
                  key={s.label}
                  d={s.d}
                  className={`cov-d is-served ${active === s.district ? 'is-active' : ''}`}
                  onMouseEnter={() => setActive(s.district)}
                  onClick={() => setActive(s.district)}
                />
              ))}
              <ellipse cx="262" cy="200" rx="34" ry="13" className="cov-park" transform="rotate(-12 262 200)" />
              <path d={SPREE} className="cov-river" />
              {SHAPES.map((s) => (
                <text key={s.label} x={s.at[0]} y={s.at[1]} className={`cov-label ${active === s.district ? 'is-active' : ''}`} textAnchor="middle">
                  {s.label}
                </text>
              ))}
            </svg>
          </div>
          <ul className="coverage__legend">
            <li><i className="cl cl--served" /> Area we cover</li>
            <li><i className="cl cl--zone" /> Selected district</li>
            <li><i className="cl cl--ring" /> Ringbahn</li>
          </ul>
        </div>
      </div>

    </section>
  );
}
