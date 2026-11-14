import type { ReactElement } from 'react';
import { LiquidBackdrop } from '../ui/LiquidBackdrop';
import { IconBolt, IconBuilding, IconCalendar, IconClock, IconLeaf, IconRoute } from '../ui/icons';

interface Service {
  icon: ReactElement;
  title: string;
  text: string;
  tag: string;
  featured?: boolean;
}

const SERVICES: Service[] = [
  { icon: <IconClock />, title: 'Same-Day Delivery', tag: 'Same day', text: 'Book in the morning, delivered across Berlin the same day — ideal for local orders and urgent parcels.' },
  { icon: <IconBolt />, title: 'Express Delivery', tag: 'Direct ride', text: 'A dedicated courier collects and rides straight to the destination. No detours, no batching.' },
  { icon: <IconBuilding />, title: 'Business Logistics', tag: 'For teams', text: 'Recurring pickups, multi-drop routes and one simple place to manage every delivery your team sends.' },
  { icon: <IconRoute />, title: 'Last-Mile Delivery', tag: 'To the door', text: 'From your warehouse or shop to your customer’s door — in every Kiez, down every side street.' },
  { icon: <IconCalendar />, title: 'Scheduled Deliveries', tag: 'Time windows', text: 'Choose the delivery window that suits your customers and plan recurring runs weeks ahead.' },
  { icon: <IconLeaf />, title: 'Sustainable Urban Delivery', tag: 'Zero tailpipe', text: 'Electric cargo bikes keep vans off narrow streets and deliver without exhaust fumes at the door.', featured: true },
];

export default function Services() {
  return (
    <section id="services" className="section services has-liquid" aria-labelledby="services-title">
      <LiquidBackdrop />
      <div className="container">
        <div className="section-head" data-reveal>
          <div>
            <span className="eyebrow">Our services</span>
            <h2 id="services-title" className="h-section">
              Every delivery,
              <br />
              <span className="text-brand">one clean network.</span>
            </h2>
          </div>
          <p className="lead">From a single envelope to daily business routes — pick the speed you need and we’ll handle the ride.</p>
        </div>
        <div className="svc-grid">
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className={`svc-card lg-card ${s.featured ? 'svc-card--featured' : ''}`}
              data-reveal
              data-glass
              style={{ ['--rd' as string]: `${(i % 3) * 0.08}s` }}
            >
              <span className="svc-card__top">
                <span className="svc-card__icon">{s.icon}</span>
                <span className="svc-card__tag">{s.tag}</span>
              </span>
              <h3 className="svc-card__title">{s.title}</h3>
              <p className="svc-card__text">{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
