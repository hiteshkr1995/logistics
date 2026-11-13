import { useEffect, useState } from 'react';
import { Logo } from './ui/Logo';
import { IconClose, IconMenu, IconMoon, IconSun } from './ui/icons';
import { useTheme } from '../hooks/useTheme';
import type { Route } from '../router';
import './navbar.css';

export const NAV_LINKS = [
  { href: '#top', label: 'Home' },
  { href: '#services', label: 'Our Services' },
  { href: '#how', label: 'How It Works' },
  { href: '#coverage', label: 'Coverage' },
  { href: '#business', label: 'For Business' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar({ route }: { route: Route }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#top');
  const onHome = route.name === 'home';
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in view (landing page only)
  useEffect(() => {
    if (!onHome) return;
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (vis) setActive(`#${vis.target.id}`);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.2] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => setOpen(false), [route]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => onHome && active === href;

  return (
    <header className={`nav ${scrolled || open || !onHome ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__inner lg-glass" data-glass>
        <Logo />
        <nav className="nav__links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={isActive(l.href) ? 'is-active' : ''} aria-current={isActive(l.href) ? 'true' : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav__cta">
          <button
            type="button"
            className={`theme-toggle ${dark ? 'is-dark' : ''}`}
            onClick={toggle}
            aria-label={dark ? 'Switch to light mode' : 'Switch to night mode'}
            aria-pressed={dark}
            title={dark ? 'Light mode' : 'Night mode'}
          >
            <span className="theme-toggle__icon theme-toggle__icon--sun"><IconSun /></span>
            <span className="theme-toggle__icon theme-toggle__icon--moon"><IconMoon /></span>
          </button>
          <a href="#/login" className={`btn btn--glass btn--sm nav__login ${route.name === 'login' ? 'is-current' : ''}`}>
            Log in
          </a>
          <a href="#/join" className="btn btn--primary btn--sm nav__join">
            Join as a Rider
          </a>
          <button
            type="button"
            className="nav__burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="nav__sheet lg-glass" hidden={!open}>
        <nav aria-label="Mobile">
          {NAV_LINKS.map((l, i) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ ['--i' as string]: i }}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav__sheet-ctas">
          <a href="#/join" className="btn btn--primary btn--lg" onClick={() => setOpen(false)}>
            Join as a Rider
          </a>
          <a href="#/login" className="btn btn--glass btn--lg" onClick={() => setOpen(false)}>
            Log in
          </a>
        </div>
      </div>
    </header>
  );
}
