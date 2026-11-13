import { useState, type FormEvent } from 'react';
import { COMPANY, ENDPOINTS } from '../config';
import { IconArrow, IconBike, IconBuilding, IconEye } from '../components/ui/icons';
import { LiquidBackdrop } from '../components/ui/LiquidBackdrop';
import { LogoMark } from '../components/ui/Logo';
import { useOpenDialog } from '../components/ui/DialogProvider';
import './pages.css';

type Who = 'rider' | 'business';

const COPY: Record<Who, { title: string; sub: string; idLabel: string; portal?: string }> = {
  rider: {
    title: 'Rider login',
    sub: 'See your shifts, payslips and documents.',
    idLabel: 'Email or phone number',
    portal: ENDPOINTS.riderPortal,
  },
  business: {
    title: 'Business login',
    sub: 'Manage your account, invoices and contacts.',
    idLabel: 'Work email',
    portal: ENDPOINTS.businessPortal,
  },
};

function Chooser() {
  return (
    <div className="login-choose">
      <div className="login-choose__head">
        <LogoMark size={44} />
        <h1 className="page__title">Log in to ON-SPREE</h1>
        <p className="lead">Choose your account type.</p>
      </div>
      <div className="login-choose__grid">
        <a href="#/login/rider" className="login-tile lg-glass lg-glass--strong" data-glass>
          <span className="login-tile__icon"><IconBike /></span>
          <strong>I’m a rider</strong>
          <span>Shifts, earnings and onboarding documents</span>
          <span className="login-tile__go">Rider login <IconArrow /></span>
        </a>
        <a href="#/login/business" className="login-tile lg-glass lg-glass--strong" data-glass>
          <span className="login-tile__icon"><IconBuilding /></span>
          <strong>I’m a business</strong>
          <span>Account, invoices and team access</span>
          <span className="login-tile__go">Business login <IconArrow /></span>
        </a>
      </div>
      <p className="login-choose__new">
        New here? <a href="#/join">Apply as a rider</a> or <a href="#business">see what we do for businesses</a>.
      </p>
    </div>
  );
}

function LoginForm({ who }: { who: Who }) {
  const c = COPY[who];
  const openDialog = useOpenDialog();
  const [show, setShow] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    // No portal yet: never pretend a login happened.
    if (c.portal) {
      window.location.href = c.portal;
      return;
    }
    setNotice(
      who === 'rider'
        ? 'The rider portal opens soon. Your login is created during onboarding — we’ll email you when it’s ready.'
        : 'The business portal opens soon. Talk to our team and we’ll set up your account.',
    );
  };

  return (
    <div className="login">
      <a href="#/login" className="login__back">← All account types</a>
      <section className="login__card lg-glass lg-glass--strong" aria-labelledby="login-title">
        <div className="login__switch" role="tablist" aria-label="Account type">
          <a href="#/login/rider" role="tab" aria-selected={who === 'rider'} className={who === 'rider' ? 'is-active' : ''}>
            <IconBike /> Rider
          </a>
          <a href="#/login/business" role="tab" aria-selected={who === 'business'} className={who === 'business' ? 'is-active' : ''}>
            <IconBuilding /> Business
          </a>
        </div>
        <h1 id="login-title" className="login__title">{c.title}</h1>
        <p className="login__sub">{c.sub}</p>

        <form className="login__form" onSubmit={submit} noValidate>
          <label className="field">
            <span className="field__label">{c.idLabel}</span>
            <input className="field__input" name="id" type={who === 'business' ? 'email' : 'text'} autoComplete="username" required />
          </label>
          <label className="field">
            <span className="field__label">Password</span>
            <span className="pw">
              <input className="field__input" name="password" type={show ? 'text' : 'password'} autoComplete="current-password" required minLength={8} />
              <button type="button" className="pw__toggle" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
                <IconEye />
              </button>
            </span>
          </label>
          <div className="login__row">
            <label className="check check--inline">
              <input type="checkbox" name="remember" />
              <span>Keep me signed in</span>
            </label>
            <button
              type="button"
              className="link-btn"
              onClick={() => setNotice(`To reset your password, email ${who === 'rider' ? COMPANY.ridersEmail : COMPANY.businessEmail} from the address on your account.`)}
            >
              Forgot password?
            </button>
          </div>
          <button type="submit" className="btn btn--primary btn--lg login__submit">
            Log in <IconArrow />
          </button>
          {notice && <p className="login__notice" role="status">{notice}</p>}
        </form>

        <p className="login__foot">
          {who === 'rider' ? (
            <>Not riding with us yet? <a href="#/join">Apply as a rider</a></>
          ) : (
            <>No business account yet? <button type="button" className="link-btn" onClick={() => openDialog('team')}>Talk to our team</button></>
          )}
        </p>
      </section>
    </div>
  );
}

export default function Login({ who }: { who?: Who }) {
  return (
    <div className="page page--login has-liquid">
      <LiquidBackdrop />
      <div className="container">{who ? <LoginForm who={who} /> : <Chooser />}</div>
    </div>
  );
}
