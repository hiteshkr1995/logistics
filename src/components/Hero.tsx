import { Suspense, lazy, useCallback, useState } from 'react';
import type { MapLayout } from './map/BerlinMap';
import { useMediaQuery, useReducedMotion } from '../hooks/useMediaQuery';
import { useOpenDialog } from './ui/DialogProvider';
import { IconArrow, IconBike, IconClock, IconLeaf } from './ui/icons';
import './hero.css';

// The 3D map (three.js) loads as its own chunk; the illustrated SVG map is
// only fetched as a fallback when WebGL isn't available.
const Map3D = lazy(() => import('./map3d/Map3D'));
const BerlinMap = lazy(() => import('./map/BerlinMap'));

function MapLoading() {
  return (
    <div className="hero__loading" aria-hidden="true">
      <span className="live-dot" /> Loading Berlin…
    </div>
  );
}

export default function Hero() {
  const desktop = useMediaQuery('(min-width: 1024px)');
  const phone = useMediaQuery('(max-width: 639px)');
  const reducedMotion = useReducedMotion();
  const openDialog = useOpenDialog();
  const layout: MapLayout = desktop ? 'desktop' : phone ? 'compact' : 'stacked';
  const [webglFailed, setWebglFailed] = useState(false);
  const onFail = useCallback(() => setWebglFailed(true), []);

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__map">
        <Suspense fallback={<MapLoading />}>
          {webglFailed ? (
            <BerlinMap layout={layout} reducedMotion={reducedMotion} />
          ) : (
            <Map3D layout={layout} reducedMotion={reducedMotion} onFail={onFail} />
          )}
        </Suspense>
        <div className="hero__status glass" role="status">
          <span className="live-dot" aria-hidden="true" />
          <span>
            <strong>Delivering across Berlin</strong>
            <span className="hero__status-sub">E-cargo bike network</span>
          </span>
        </div>
        <div className="hero__legend glass" aria-hidden="true">
          <span><i className="lg lg--hub" />Micro-hub</span>
          <span><i className="lg lg--drop" />Drop-off</span>
          <span><i className="lg lg--route" />Live route</span>
          <span className="hero__legend-hint">Drag · Right-drag to rotate</span>
        </div>
      </div>

      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__content">
        <span className="hero__chip glass">
          <IconBike /> E-bike delivery · Made in Berlin
        </span>
        <h1 id="hero-title" className="hero__title">
          <span className="hero__line"><span>Berlin Moves.</span></span>
          <span className="hero__line"><span className="hero__accent">We Deliver.</span></span>
        </h1>
        <p className="hero__text">
          Fast, reliable and sustainable delivery solutions for businesses and people across Berlin. From local parcels to
          last-mile logistics, we keep your city moving.
        </p>
        <div className="hero__ctas">
          <button type="button" className="btn btn--primary btn--lg" onClick={() => openDialog('booking')}>
            Get a Delivery <IconArrow />
          </button>
          <button type="button" className="btn btn--ghost btn--lg" onClick={() => openDialog('partner')}>
            Become a Partner
          </button>
        </div>
        <ul className="hero__points" aria-label="Highlights">
          <li><IconClock /> Same-day &amp; express</li>
          <li><IconLeaf /> Zero-emission e-bikes</li>
          <li><IconBike /> Local Kiez couriers</li>
        </ul>
      </div>
    </section>
  );
}
