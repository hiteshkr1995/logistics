import { Suspense, lazy, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/sections/Services';
import HowItWorks from './components/sections/HowItWorks';
import Coverage from './components/sections/Coverage';
import WhyUs from './components/sections/WhyUs';
import Business from './components/sections/Business';
import FinalCta from './components/sections/FinalCta';
import Footer from './components/Footer';
import { DialogProvider } from './components/ui/DialogProvider';
import { useReveal } from './hooks/useReveal';
import { useGlassPointer } from './hooks/useGlassPointer';
import { routeKey, useRoute } from './router';
import './components/sections/sections.css';

const JoinRider = lazy(() => import('./pages/JoinRider'));
const Login = lazy(() => import('./pages/Login'));
const Legal = lazy(() => import('./pages/Legal'));

function Landing() {
  return (
    <>
      <Hero />
      <Services />
      <HowItWorks />
      <Coverage />
      <WhyUs />
      <Business />
      <FinalCta />
    </>
  );
}

export default function App() {
  const route = useRoute();
  const key = routeKey(route);
  useReveal(key);
  useGlassPointer();

  // Page routes start at the top; landing anchors scroll to their section.
  useEffect(() => {
    if (route.name !== 'home') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }
    if (route.anchor) {
      requestAnimationFrame(() => document.getElementById(route.anchor!)?.scrollIntoView());
    }
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <DialogProvider>
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>
      <Navbar route={route} />
      <main id="main" tabIndex={-1}>
        {route.name === 'home' ? (
          <Landing />
        ) : (
          <Suspense fallback={<div className="page-loading" aria-hidden="true" />}>
            {route.name === 'join' && <JoinRider />}
            {route.name === 'login' && <Login who={route.who} />}
            {route.name === 'legal' && <Legal page={route.page} />}
          </Suspense>
        )}
      </main>
      <Footer />
    </DialogProvider>
  );
}
