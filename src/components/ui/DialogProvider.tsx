import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { IconCheck, IconClose } from './icons';
import { LogoMark } from './Logo';
import './dialog.css';

export type DialogMode = 'booking' | 'partner' | 'team' | 'privacy' | 'terms' | 'imprint';

const DialogCtx = createContext<(mode: DialogMode) => void>(() => {});
export const useOpenDialog = () => useContext(DialogCtx);

const COPY: Record<DialogMode, { title: string; intro: string }> = {
  booking: { title: 'Get a delivery', intro: 'Tell us where the parcel starts and where it’s going. A Spur courier on an e-cargo bike will take it from there.' },
  partner: { title: 'Become a partner', intro: 'Ride with us as a courier, or plug your shop into the Spur network. Leave your details and we’ll reach out.' },
  team: { title: 'Talk to our team', intro: 'Tell us a little about your business and delivery needs — our Berlin team will get back to you.' },
  privacy: { title: 'Privacy Policy', intro: '' },
  terms: { title: 'Terms & Conditions', intro: '' },
  imprint: { title: 'Imprint', intro: '' },
};

function Field({ label, name, type = 'text', placeholder, required = true, autoComplete }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean; autoComplete?: string }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <input className="field__input" name={name} type={type} placeholder={placeholder} required={required} autoComplete={autoComplete} />
    </label>
  );
}

function Segmented({ name, legend, options }: { name: string; legend: string; options: string[] }) {
  return (
    <fieldset className="seg">
      <legend className="field__label">{legend}</legend>
      <div className="seg__row">
        {options.map((o, i) => (
          <label key={o} className="seg__opt">
            <input type="radio" name={name} value={o} defaultChecked={i === 0} />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function LegalBody({ mode }: { mode: DialogMode }) {
  return (
    <div className="dlg__legal">
      <p>
        This is placeholder {mode === 'privacy' ? 'privacy' : mode === 'terms' ? 'terms' : 'imprint'} content for the Spur landing page.
        Replace it with your reviewed legal text before going live.
      </p>
      <p>
        {mode === 'imprint'
          ? 'Spur Logistics GmbH (placeholder) · Musterstraße 1, 10115 Berlin · Register court: Amtsgericht Charlottenburg · HRB 000000.'
          : 'Under the GDPR you have the right to access, correct and delete the personal data we hold about you. Contact privacy@spur.example for any request.'}
      </p>
    </div>
  );
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<DialogMode>('booking');
  const [sent, setSent] = useState(false);

  const open = useCallback((m: DialogMode) => {
    setMode(m);
    setSent(false);
    ref.current?.showModal();
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClick = (e: MouseEvent) => {
      if (e.target === d) d.close();
    };
    d.addEventListener('click', onClick);
    return () => d.removeEventListener('click', onClick);
  }, []);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Front-end only for now: wire this to your booking / CRM endpoint.
    setSent(true);
  };

  const legal = mode === 'privacy' || mode === 'terms' || mode === 'imprint';
  const c = COPY[mode];

  return (
    <DialogCtx.Provider value={open}>
      {children}
      <dialog ref={ref} className="dlg" aria-labelledby="dlg-title">
        <div className="dlg__card">
          <button type="button" className="dlg__close" onClick={() => ref.current?.close()} aria-label="Close dialog">
            <IconClose />
          </button>
          <div className="dlg__head">
            <LogoMark size={36} />
            <h2 id="dlg-title">{c.title}</h2>
            {c.intro && !sent && <p>{c.intro}</p>}
          </div>

          {legal ? (
            <LegalBody mode={mode} />
          ) : sent ? (
            <div className="dlg__done" role="status">
              <span className="dlg__done-icon"><IconCheck /></span>
              <h3>Request received</h3>
              <p>Thanks — we’ve got your details. Someone from our Berlin team will contact you to confirm the next steps.</p>
              <button type="button" className="btn btn--green" onClick={() => ref.current?.close()}>Done</button>
            </div>
          ) : (
            <form className="dlg__form" onSubmit={submit}>
              {mode === 'booking' && (
                <>
                  <div className="dlg__grid">
                    <Field label="Pickup address" name="pickup" placeholder="e.g. Torstraße 1, Mitte" autoComplete="street-address" />
                    <Field label="Drop-off address" name="dropoff" placeholder="e.g. Oranienstraße 10, Kreuzberg" />
                  </div>
                  <Segmented name="size" legend="Parcel size" options={['Small', 'Medium', 'Large', 'Bulky']} />
                  <Segmented name="when" legend="When" options={['As soon as possible', 'Schedule a time']} />
                  <div className="dlg__grid">
                    <Field label="Your name" name="name" autoComplete="name" />
                    <Field label="Email" name="email" type="email" autoComplete="email" />
                  </div>
                </>
              )}
              {mode !== 'booking' && (
                <>
                  <div className="dlg__grid">
                    <Field label="Your name" name="name" autoComplete="name" />
                    <Field label="Email" name="email" type="email" autoComplete="email" />
                  </div>
                  {mode === 'partner' ? (
                    <Segmented name="type" legend="I’m interested as" options={['Courier', 'Business partner', 'Hub location']} />
                  ) : (
                    <Field label="Company" name="company" autoComplete="organization" />
                  )}
                  <label className="field">
                    <span className="field__label">Message <em>(optional)</em></span>
                    <textarea className="field__input field__input--area" name="message" rows={3} placeholder="What do you need delivered, and how often?" />
                  </label>
                </>
              )}
              <button type="submit" className="btn btn--green btn--lg dlg__submit">
                {mode === 'booking' ? 'Request delivery' : 'Send'}
              </button>
              <p className="dlg__fine">By sending this form you agree to be contacted about your request.</p>
            </form>
          )}
        </div>
      </dialog>
    </DialogCtx.Provider>
  );
}
