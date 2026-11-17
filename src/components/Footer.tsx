import { LogoBadge } from './ui/Logo';
import { IconInstagram, IconLinkedIn, IconMail, IconPhone, IconX } from './ui/icons';
import { useOpenDialog } from './ui/DialogProvider';
import { COMPANY } from '../config';
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

/** Rendered twice: next to the logo on phones, in the legal bar elsewhere (CSS shows one). */
function Socials({ className }: { className: string }) {
  return (
    <ul className={`ft__social ${className}`} aria-label="Social media">
      {SOCIAL.map((s) => (
        <li key={s.label}>
          <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
            {s.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  const openDialog = useOpenDialog();

  return (
    <footer id="contact" className="ft" aria-labelledby="footer-title" data-nav-dark>
      <h2 id="footer-title" className="sr-only">Contact and site information</h2>
      <div className="container">
        <div className="ft__top">
          <a href="#top" className="ft__logo" aria-label={`${COMPANY.legalName} — back to top`}>
            <LogoBadge className="ft__badge" />
          </a>
          <Socials className="ft__social--top" />

          <nav className="ft__col" aria-labelledby="ft-riders">
            <h3 id="ft-riders">Riders</h3>
            <ul>
              <li><a href="#/join">Join as a rider</a></li>
              <li><a href="#/login/rider">Rider login</a></li>
            </ul>
          </nav>

          <nav className="ft__col" aria-labelledby="ft-business">
            <h3 id="ft-business">Business</h3>
            <ul>
              <li><button type="button" onClick={() => openDialog('team')}>Talk to our team</button></li>
              <li><a href="#/login/business">Business login</a></li>
            </ul>
          </nav>

          <div className="ft__col">
            <h3>Contact</h3>
            <ul className="ft__contact">
              <li><IconMail /><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
              <li><IconPhone /><a href={`tel:${COMPANY.phoneHref}`}>{COMPANY.phone}</a></li>
            </ul>
          </div>
        </div>

        <div className="ft__bottom">
          <p>© {new Date().getFullYear()} {COMPANY.legalName}</p>
          <ul className="ft__legal" aria-label="Legal">
            {LEGAL.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
          <Socials className="ft__social--bottom" />
        </div>
      </div>
    </footer>
  );
}
