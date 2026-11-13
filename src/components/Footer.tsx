import { Logo } from './ui/Logo';
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

export default function Footer() {
  const openDialog = useOpenDialog();
  return (
    <footer id="contact" className="footer" aria-labelledby="footer-title" data-nav-dark>
      <h2 id="footer-title" className="sr-only">Contact and site information</h2>
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo tone="light" />
            <p>E-bike riders delivering across Berlin.</p>
            <ul className="footer__social" aria-label="Social media">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="lg-glass-dark">
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer__col" aria-label="Riders">
            <h3>Riders</h3>
            <ul>
              <li><a href="#/join">Join as a rider</a></li>
              <li><a href="#/login/rider">Rider login</a></li>
            </ul>
          </nav>

          <nav className="footer__col" aria-label="Business">
            <h3>Business</h3>
            <ul>
              <li><button type="button" onClick={() => openDialog('team')}>Talk to our team</button></li>
              <li><a href="#/login/business">Business login</a></li>
            </ul>
          </nav>

          <div className="footer__col footer__contact">
            <h3>Contact</h3>
            <ul>
              <li><IconMail /><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
              <li><IconPhone /><a href={`tel:${COMPANY.phoneHref}`}>{COMPANY.phone}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} {COMPANY.legalName}</p>
          <ul aria-label="Legal">
            {LEGAL.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
