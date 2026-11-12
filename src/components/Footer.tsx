import { Logo, LogoBadge } from './ui/Logo';
import { IconInstagram, IconLinkedIn, IconMail, IconPhone, IconPin, IconX } from './ui/icons';
import { useOpenDialog } from './ui/DialogProvider';
import { NAV_LINKS } from './Navbar';
import './footer.css';

const SERVICES = ['Same-Day Delivery', 'Express Delivery', 'Business Logistics', 'Last-Mile Delivery', 'Scheduled Deliveries', 'Sustainable Delivery'];

// Placeholder social profiles — replace with the real ON-SPREE accounts.
const SOCIAL = [
  { label: 'ON-SPREE on Instagram', href: 'https://www.instagram.com/', icon: <IconInstagram /> },
  { label: 'ON-SPREE on LinkedIn', href: 'https://www.linkedin.com/', icon: <IconLinkedIn /> },
  { label: 'ON-SPREE on X', href: 'https://x.com/', icon: <IconX /> },
];

export default function Footer() {
  const openDialog = useOpenDialog();
  return (
    <footer id="contact" className="footer" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">Contact and site information</h2>
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo tone="light" />
            <p>ON-SPREE is Berlin’s e-cargo-bike delivery network — fast, reliable and sustainable logistics for businesses and people across the city.</p>
            <ul className="footer__social" aria-label="Social media">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer__col" aria-label="Footer navigation">
            <h3>Company</h3>
            <ul>
              {NAV_LINKS.slice(0, 5).map((l) => (
                <li key={l.href}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </nav>

          <div className="footer__col">
            <h3>Services</h3>
            <ul>
              {SERVICES.map((s) => (
                <li key={s}><a href="#services">{s}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3>Business enquiries</h3>
            <ul>
              <li><button type="button" onClick={() => openDialog('team')}>Talk to our team</button></li>
              <li><button type="button" onClick={() => openDialog('partner')}>Become a partner</button></li>
              <li><button type="button" onClick={() => openDialog('partner')}>Ride with ON-SPREE</button></li>
              <li><a href="#business">Solutions for business</a></li>
            </ul>
          </div>

          <address className="footer__col footer__contact">
            <h3>Contact</h3>
            <ul>
              <li><IconMail /><a href="mailto:hallo@onspree.example">hallo@onspree.example</a></li>
              <li><IconPhone /><a href="tel:+493000000000">+49 30 0000 0000</a></li>
              <li><IconPin /><span>Musterstraße 1<br />10115 Berlin</span></li>
            </ul>
          </address>
        </div>

        <div className="footer__badge">
          <LogoBadge className="footer__badge-svg" />
          <p>ON SPREE Logistics UG · Berlin</p>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} ON SPREE Logistics UG. All rights reserved.</p>
          <ul>
            <li><button type="button" onClick={() => openDialog('privacy')}>Privacy Policy</button></li>
            <li><button type="button" onClick={() => openDialog('terms')}>Terms &amp; Conditions</button></li>
            <li><button type="button" onClick={() => openDialog('imprint')}>Imprint</button></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
