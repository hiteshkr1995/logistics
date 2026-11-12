import { useEffect, useState } from 'react';
import { Logo } from './ui/Logo';
import { IconClose, IconMenu } from './ui/icons';
import { useOpenDialog } from './ui/DialogProvider';
import './navbar.css';

export const NAV_LINKS = [
  { href: '#top', label: 'Home' },
  { href: '#services', label: 'Our Services' },
  { href: '#how', label: 'How It Works' },
  { href: '#coverage', label: 'Coverage' },
  { href: '#business', label: 'For Business' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#top');
  const openDialog = useOpenDialog();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`nav ${scrolled || open ? 'nav--solid' : ''} ${open ? 'nav--open' : ''}`}>
      <div className="nav__inner">
        <Logo />
        <nav className="nav__links" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className={active === l.href ? 'is-active' : ''} aria-current={active === l.href ? 'true' : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav__cta">
          <button type="button" className="btn btn--green btn--sm" onClick={() => openDialog('booking')}>
            Book a Delivery
          </button>
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
      <div id="mobile-menu" className="nav__sheet" hidden={!open}>
        <nav aria-label="Mobile">
          {NAV_LINKS.map((l, i) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ ['--i' as string]: i }}>
              {l.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="btn btn--green btn--lg"
          onClick={() => {
            setOpen(false);
            openDialog('booking');
          }}
        >
          Book a Delivery
        </button>
      </div>
    </header>
  );
}
