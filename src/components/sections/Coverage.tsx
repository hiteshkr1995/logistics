import { useState } from 'react';
import { IconPin } from '../ui/icons';

interface District {
  id: string;
  name: string;
  d: string;
  label: [number, number];
  blurb: string;
  hub?: [number, number];
}

/* Simplified district shapes — relative positions follow the real city. */
const DISTRICTS: District[] = [
  { id: 'charlottenburg', name: 'Charlottenburg', d: 'M58 196 L150 160 L232 168 L246 222 L238 300 L186 342 L104 336 L52 286 Z', label: [148, 252], blurb: 'Boutiques along Ku’damm, offices and quiet residential streets.', hub: [176, 214] },
  { id: 'mitte', name: 'Mitte', d: 'M232 168 L300 120 L352 140 L378 176 L366 238 L304 262 L246 222 Z', label: [308, 196], blurb: 'Same-day heartland around Unter den Linden, Museum Island and Alex.', hub: [330, 214] },
  { id: 'prenzlauer', name: 'Prenzlauer Berg', d: 'M352 140 L362 64 L446 54 L478 128 L420 170 L378 176 Z', label: [414, 116], blurb: 'Cafés, family homes and a high density of doorstep deliveries.', hub: [404, 86] },
  { id: 'friedrichshain', name: 'Friedrichshain', d: 'M378 176 L420 170 L478 128 L540 178 L516 262 L436 280 L366 238 Z', label: [452, 220], blurb: 'Studios, startups and nightlife east of the Spree.', hub: [478, 200] },
  { id: 'kreuzberg', name: 'Kreuzberg', d: 'M246 222 L304 262 L366 238 L436 280 L430 338 L328 360 L238 300 Z', label: [336, 304], blurb: 'Restaurants, independent shops and busy Kiez streets.', hub: [380, 320] },
  { id: 'neukoelln', name: 'Neukölln', d: 'M328 360 L430 338 L486 326 L508 432 L408 474 L336 438 Z', label: [418, 402], blurb: 'Fast-growing neighbourhood with a strong local retail scene.' },
];

const SPREE = 'M600 300 C 560 290, 520 272, 486 262 C 440 248, 404 236, 376 214 C 352 194, 334 182, 300 176 C 262 170, 232 190, 196 196 C 150 204, 96 226, 30 228';

export default function Coverage() {
  const [active, setActive] = useState('mitte');
  const current = DISTRICTS.find((d) => d.id === active)!;

  return (
    <section id="coverage" className="section coverage" aria-labelledby="coverage-title">
      <div className="container coverage__grid">
        <div className="coverage__copy" data-reveal>
          <span className="eyebrow">Berlin coverage</span>
          <h2 id="coverage-title" className="h-section">
            Rooted in the Kiez.
            <br />
            <span className="text-brand">Riding across the city.</span>
          </h2>
          <p className="lead">
            Micro-hubs inside the neighbourhoods we serve keep every ride short. Pick a district to see how we deliver there.
          </p>
          <div className="coverage__chips" role="group" aria-label="Choose a neighbourhood">
            {DISTRICTS.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`chip ${active === d.id ? 'is-active' : ''}`}
                aria-pressed={active === d.id}
                onClick={() => setActive(d.id)}
                onMouseEnter={() => setActive(d.id)}
                onFocus={() => setActive(d.id)}
              >
                {d.name}
              </button>
            ))}
          </div>
          <div className="coverage__info" aria-live="polite">
            <IconPin />
            <div>
              <strong>{current.name}</strong>
              <p>{current.blurb}</p>
            </div>
          </div>
        </div>

        <div className="coverage__mapwrap" data-reveal style={{ ['--rd' as string]: '0.1s' }}>
          <div className="coverage__tilt">
            <svg className="coverage__map" viewBox="24 30 560 470" role="img" aria-label={`Map of ON-SPREE delivery zones in Berlin, ${current.name} highlighted`}>
              <defs>
                <pattern id="cov-dots" width="12" height="12" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" fill="rgba(20,24,22,.12)" />
                </pattern>
              </defs>
              <rect width="600" height="520" rx="28" fill="url(#cov-dots)" />
              <path className="cov-ring" d="M150 120 C 230 70, 420 40, 520 110 C 590 160, 580 300, 520 380 C 460 460, 300 470, 210 420 C 120 370, 70 200, 150 120 Z" />
              {DISTRICTS.map((d) => (
                <path
                  key={d.id}
                  d={d.d}
                  className={`cov-d ${active === d.id ? 'is-active' : ''}`}
                  onMouseEnter={() => setActive(d.id)}
                  onClick={() => setActive(d.id)}
                />
              ))}
              <ellipse cx="262" cy="200" rx="34" ry="13" className="cov-park" transform="rotate(-12 262 200)" />
              <path d={SPREE} className="cov-river" />
              {DISTRICTS.map((d) => (
                <text key={d.id} x={d.label[0]} y={d.label[1]} className={`cov-label ${active === d.id ? 'is-active' : ''}`} textAnchor="middle">
                  {d.name}
                </text>
              ))}
              {DISTRICTS.filter((d) => d.hub).map((d) => (
                <g key={d.id} transform={`translate(${d.hub![0]} ${d.hub![1]})`} className="cov-hub">
                  <circle r="11" className="cov-hub-ring" />
                  <circle r="6" />
                </g>
              ))}
              <g transform="translate(300 176)" className="cov-star">
                <circle r="4" />
              </g>
            </svg>
          </div>
          <ul className="coverage__legend">
            <li><i className="cl cl--zone" /> Delivery zone</li>
            <li><i className="cl cl--hub" /> Micro-hub</li>
            <li><i className="cl cl--ring" /> Ringbahn</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
