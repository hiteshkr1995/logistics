import { useRef, useState, type KeyboardEvent, type ReactElement } from 'react';
import { IconArrow, IconBolt, IconCart, IconCheck, IconFork, IconHeart, IconStore } from '../ui/icons';
import { useOpenDialog } from '../ui/DialogProvider';
import { LogoMark } from '../ui/Logo';

interface Segment {
  id: string;
  label: string;
  icon: ReactElement;
  headline: string;
  points: string[];
  order: { from: string; to: string; item: string };
}

const SEGMENTS: Segment[] = [
  {
    id: 'ecommerce',
    label: 'E-commerce',
    icon: <IconCart />,
    headline: 'Same-day delivery your customers will notice.',
    points: ['Daily scheduled pickups from your warehouse', 'Same-day and next-day delivery across Berlin', 'Branded tracking links for every order'],
    order: { from: 'Warehouse · Moabit', to: 'Kollwitzstraße, Prenzlauer Berg', item: 'Online order' },
  },
  {
    id: 'restaurants',
    label: 'Restaurants',
    icon: <IconFork />,
    headline: 'Hot food, cold drinks, happy guests.',
    points: ['Insulated cargo boxes for hot and cold food', 'Dedicated riders during your busiest service', 'Simple hand-off at the counter'],
    order: { from: 'Kitchen · Kreuzberg', to: 'Boxhagener Platz, Friedrichshain', item: 'Dinner order' },
  },
  {
    id: 'retail',
    label: 'Retailers',
    icon: <IconStore />,
    headline: 'Turn your store into a delivery hub.',
    points: ['Ship-from-store for local customers', 'Click-and-deliver for in-store purchases', 'Returns collected straight from the doorstep'],
    order: { from: 'Store · Mitte', to: 'Bergmannstraße, Kreuzberg', item: 'In-store purchase' },
  },
  {
    id: 'local',
    label: 'Local businesses',
    icon: <IconHeart />,
    headline: 'Big-city logistics for neighbourhood shops.',
    points: ['Florists, pharmacies, bakeries and studios', 'Book in a few clicks — no complex setup', 'A local team you can actually call'],
    order: { from: 'Flower shop · Neukölln', to: 'Weserstraße, Neukölln', item: 'Bouquet' },
  },
];

const STATUS = ['Booked', 'Picked up', 'On the way', 'Delivered'];

export default function Business() {
  const [tab, setTab] = useState(0);
  const openDialog = useOpenDialog();
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const seg = SEGMENTS[tab];

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (tab + dir + SEGMENTS.length) % SEGMENTS.length;
    setTab(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <section id="business" className="section business" aria-labelledby="business-title">
      <div className="container">
        <div className="business__panel" data-reveal>
          <div className="business__copy">
            <span className="eyebrow">For business</span>
            <h2 id="business-title" className="h-section">Your Business Deserves Better Delivery.</h2>
            <div className="tabs" role="tablist" aria-label="Business type" onKeyDown={onKey}>
              {SEGMENTS.map((s, i) => (
                <button
                  key={s.id}
                  ref={(el) => (tabsRef.current[i] = el)}
                  type="button"
                  role="tab"
                  id={`tab-${s.id}`}
                  aria-selected={tab === i}
                  aria-controls="biz-panel"
                  tabIndex={tab === i ? 0 : -1}
                  className={`tab ${tab === i ? 'is-active' : ''}`}
                  onClick={() => setTab(i)}
                >
                  {s.icon}
                  {s.label}
                </button>
              ))}
            </div>
            <div id="biz-panel" role="tabpanel" aria-labelledby={`tab-${seg.id}`} className="business__tabpanel" key={seg.id}>
              <h3>{seg.headline}</h3>
              <ul>
                {seg.points.map((p) => (
                  <li key={p}>
                    <span><IconCheck /></span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <button type="button" className="btn btn--primary btn--lg" onClick={() => openDialog('team')}>
              Talk to Our Team <IconArrow />
            </button>
          </div>

          <div className="business__visual" aria-hidden="true">
            <div className="track-card" key={seg.id}>
              <div className="track-card__head">
                <LogoMark size={28} />
                <div>
                  <strong>{seg.order.item}</strong>
                  <span>Example delivery</span>
                </div>
                <span className="track-card__badge"><i className="live-dot" /> Live</span>
              </div>
              <div className="track-card__map">
                <svg viewBox="0 0 320 150">
                  <defs>
                    <pattern id="tc-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M24 0H0V24" fill="none" stroke="rgba(20,24,22,.07)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="320" height="150" fill="url(#tc-grid)" />
                  <path d="M-10 110 C 60 120, 110 60, 180 80 S 300 40, 340 60" stroke="#AEDBE7" strokeWidth="14" fill="none" />
                  <path className="tc-route" d="M40 118 L40 72 L150 72 L150 40 L276 40" pathLength={1} />
                  <circle cx="40" cy="118" r="7" fill="#141816" />
                  <circle cx="276" cy="40" r="9" fill="#0A7FC7" stroke="#fff" strokeWidth="3" />
                  <g className="tc-bike">
                    <circle r="10" fill="#fff" stroke="#0A7FC7" strokeWidth="3" />
                    <circle r="4" fill="#141816" />
                  </g>
                </svg>
              </div>
              <div className="track-card__addr">
                <div><span>From</span>{seg.order.from}</div>
                <div><span>To</span>{seg.order.to}</div>
              </div>
              <ol className="track-card__steps">
                {STATUS.map((s, i) => (
                  <li key={s} className={i < 3 ? 'is-done' : ''} style={{ ['--i' as string]: i }}>
                    <i />
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <div className="biz-float biz-float--a"><IconCheck /> Proof of delivery</div>
            <div className="biz-float biz-float--b"><IconBolt /> E-cargo bike</div>
          </div>
        </div>
      </div>
    </section>
  );
}
