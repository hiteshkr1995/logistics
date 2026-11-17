import { useEffect, useState } from 'react';
import { Logo } from './ui/Logo';
import { IconArrow, IconCheck, IconInstagram, IconLinkedIn, IconMail, IconPhone, IconX } from './ui/icons';
import { useOpenDialog } from './ui/DialogProvider';
import { useReducedMotion } from '../hooks/useMediaQuery';
import { AREAS, COMPANY } from '../config';
import './footer.css';

// Placeholder social profiles — replace with the real ON-SPREE accounts.
const SOCIAL = [
  { label: 'ON-SPREE on Instagram', href: 'https://www.instagram.com/', icon: <IconInstagram /> },
  { label: 'ON-SPREE on LinkedIn', href: 'https://www.linkedin.com/', icon: <IconLinkedIn /> },
  { label: 'ON-SPREE on X', href: 'https://x.com/', icon: <IconX /> },
];

const LEGAL = [
  { href: '#/privacy', label: 'Privacy Policy' },
  { href: '#/imprint', label: 'Imprint' },
  { href: '#/terms', label: 'Terms of Use' },
  { href: '#/legal', label: 'Legal Notice' },
  { href: '#/trademarks', label: 'Trademarks' },
];

const KIEZE = AREAS.flatMap((a) => a.kieze);

/** Live local time in Berlin, refreshed every 20 s. */
function useBerlinTime() {
  const fmt = () => new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setTime(fmt()), 20000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

function CopyEmail() {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  // Older or locked-down browsers: copy through a temporary, selected textarea.
  const legacyCopy = () => {
    const ta = document.createElement('textarea');
    ta.value = COMPANY.email;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  };

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(COMPANY.email);
      ok = true;
    } catch {
      ok = legacyCopy();
    }
    if (!ok) {
      // Leave the address selected so it can be copied by hand.
      const link = document.querySelector('.ft-mail a');
      const sel = window.getSelection();
      if (link && sel) {
        const range = document.createRange();
        range.selectNodeContents(link);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    setState(ok ? 'copied' : 'failed');
    window.setTimeout(() => setState('idle'), 2000);
  };

  return (
    <button type="button" className={`ft-copy is-${state}`} onClick={copy} aria-label={`Copy ${COMPANY.email}`}>
      {state === 'copied' ? <IconCheck /> : <span aria-hidden="true">{state === 'failed' ? 'Selected' : 'Copy'}</span>}
      <span className="sr-only" role="status">
        {state === 'copied' ? 'Email address copied' : state === 'failed' ? 'Copying is blocked here; the address is selected' : ''}
      </span>
    </button>
  );
}

/** The logo idea at full width: the city meets the Spree, and the page ends in the river. */
function RiverFinale({ animate }: { animate: boolean }) {
  const wave = (y: number, amp: number) => {
    // one long, seamlessly repeating wave (period 360) from x = 0 to 2880
    let d = `M0 ${y}`;
    for (let x = 0; x < 2880; x += 360) d += ` C${x + 90} ${y - amp} ${x + 180} ${y - amp} ${x + 180} ${y} S${x + 270} ${y + amp} ${x + 360} ${y}`;
    return d;
  };
  return (
    <div className="ft-river" aria-hidden="true">
      <svg className="ft-river__svg" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <g>
          {animate && <animateTransform attributeName="transform" type="translate" from="0 0" to="-1440 0" dur="22s" repeatCount="indefinite" />}
          <path d={`${wave(190, 16)} V400 H0 Z`} className="ft-river__water" />
        </g>
        <g>
          {animate && <animateTransform attributeName="transform" type="translate" from="-1440 0" to="0 0" dur="30s" repeatCount="indefinite" />}
          <path d={wave(212, 10)} className="ft-river__ripple" />
        </g>
        <g>
          {animate && <animateTransform attributeName="transform" type="translate" from="0 0" to="-1440 0" dur="16s" repeatCount="indefinite" />}
          <path d={wave(248, 8)} className="ft-river__ripple ft-river__ripple--deep" />
        </g>
      </svg>
      <span className="ft-river__on">ON</span>
      <span className="ft-river__spree">SPREE</span>
    </div>
  );
}

export default function Footer() {
  const openDialog = useOpenDialog();
  const reduced = useReducedMotion();
  const time = useBerlinTime();

  return (
    <footer id="contact" className="ft" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">Contact and site information</h2>

      <div className="ft__main" data-nav-dark>
        <div className="container">
          <div className="ft__top">
            <div className="ft__brand">
              <Logo tone="light" />
              <p className="ft__tagline">E-bike riders delivering across Berlin.</p>
              <div className="ft__clock" role="note" aria-label={`Local time in Berlin: ${time}`}>
                <span className="live-dot" aria-hidden="true" />
                <span>Berlin</span>
                <b>{time}</b>
              </div>
              <ul className="ft__social" aria-label="Social media">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                      {s.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ft__cards">
              <nav className="ft-card" aria-label="Riders">
                <span className="ft-card__kicker">01 · Riders</span>
                <a href="#/join" className="ft-link">Join as a rider <IconArrow /></a>
                <a href="#/login/rider" className="ft-link">Rider login <IconArrow /></a>
              </nav>
              <nav className="ft-card" aria-label="Business">
                <span className="ft-card__kicker">02 · Business</span>
                <button type="button" className="ft-link" onClick={() => openDialog('team')}>Talk to our team <IconArrow /></button>
                <a href="#/login/business" className="ft-link">Business login <IconArrow /></a>
              </nav>
              <div className="ft-card ft-card--contact">
                <div className="ft-card__head">
                  <span className="ft-card__kicker">03 · Contact</span>
                  <CopyEmail />
                </div>
                <div className="ft-mail">
                  <IconMail />
                  <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                </div>
                <a href={`tel:${COMPANY.phoneHref}`} className="ft-phone">
                  <IconPhone /> {COMPANY.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={`ft-ticker ${reduced ? 'is-static' : ''}`} aria-label="Areas we ride in">
          <div className="ft-ticker__track">
            {[0, 1].map((n) => (
              <ul key={n} aria-hidden={n === 1}>
                {KIEZE.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <RiverFinale animate={!reduced} />

      <div className="ft__bottom" data-nav-dark>
        <div className="container ft__bottom-row">
          <p>© {new Date().getFullYear()} {COMPANY.legalName}</p>
          <ul aria-label="Legal">
            {LEGAL.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
          <a href="#top" className="ft-top" aria-label="Back to top">
            <IconArrow />
          </a>
        </div>
      </div>
    </footer>
  );
}
