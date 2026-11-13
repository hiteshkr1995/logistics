import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { IconCheck, IconClose } from './icons';
import { LogoMark } from './Logo';
import { COMPANY, ENDPOINTS } from '../../config';
import './dialog.css';

/** Only business enquiries use a dialog; riders have their own pages. */
export type DialogMode = 'team';

const DialogCtx = createContext<(mode: DialogMode) => void>(() => {});
export const useOpenDialog = () => useContext(DialogCtx);

function Field({ label, name, type = 'text', placeholder, required = true, autoComplete }: { label: string; name: string; type?: string; placeholder?: string; required?: boolean; autoComplete?: string }) {
  return (
    <label className="field">
      <span className="field__label">{label}{!required && <em> (optional)</em>}</span>
      <input className="field__input" name={name} type={type} placeholder={placeholder} required={required} autoComplete={autoComplete} />
    </label>
  );
}

type State = 'form' | 'sending' | 'sent' | 'offline' | 'error';

export function DialogProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<State>('form');

  const open = useCallback(() => {
    setState('form');
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

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ENDPOINTS.businessEnquiry) {
      setState('offline');
      return;
    }
    setState('sending');
    try {
      const res = await fetch(ENDPOINTS.businessEnquiry, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      setState(res.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  };

  const close = () => ref.current?.close();

  return (
    <DialogCtx.Provider value={open}>
      {children}
      <dialog ref={ref} className="dlg" aria-labelledby="dlg-title">
        <div className="dlg__card lg-glass lg-glass--strong">
          <button type="button" className="dlg__close" onClick={close} aria-label="Close dialog">
            <IconClose />
          </button>
          <div className="dlg__head">
            <LogoMark size={36} />
            <h2 id="dlg-title">Talk to our team</h2>
            {state === 'form' && <p>Tell us about your business and delivery needs — our Berlin team will get back to you.</p>}
          </div>

          {state === 'sent' && (
            <div className="dlg__done" role="status">
              <span className="dlg__done-icon"><IconCheck /></span>
              <h3>Message sent</h3>
              <p>Thanks — our Berlin team will reply by email.</p>
              <button type="button" className="btn btn--primary" onClick={close}>Done</button>
            </div>
          )}
          {(state === 'offline' || state === 'error') && (
            <div className="dlg__done" role="status">
              <h3>{state === 'offline' ? 'Online enquiries open soon' : 'Something went wrong'}</h3>
              <p>
                {state === 'offline'
                  ? 'Our enquiry form isn’t connected yet, so nothing was sent or stored. Please email us instead:'
                  : 'Your message could not be sent. Please try again or email us:'}{' '}
                <a href={`mailto:${COMPANY.businessEmail}`}>{COMPANY.businessEmail}</a>
              </p>
              <button type="button" className="btn btn--primary" onClick={close}>Close</button>
            </div>
          )}
          {(state === 'form' || state === 'sending') && (
            <form className="dlg__form" onSubmit={submit}>
              <div className="dlg__grid">
                <Field label="Your name" name="name" autoComplete="name" />
                <Field label="Work email" name="email" type="email" autoComplete="email" />
              </div>
              <div className="dlg__grid">
                <Field label="Company" name="company" autoComplete="organization" />
                <Field label="Phone" name="phone" type="tel" autoComplete="tel" required={false} />
              </div>
              <label className="field">
                <span className="field__label">Message <em>(optional)</em></span>
                <textarea className="field__input field__input--area" name="message" rows={3} placeholder="What do you need delivered, and how often?" />
              </label>
              <label className="check">
                <input type="checkbox" name="privacy" required />
                <span>
                  I have read the <a href="#/privacy" onClick={close}>privacy policy</a> and agree that ON-SPREE may use my details to answer this enquiry.
                </span>
              </label>
              <button type="submit" className="btn btn--primary btn--lg dlg__submit" disabled={state === 'sending'}>
                {state === 'sending' ? 'Sending…' : 'Send'}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </DialogCtx.Provider>
  );
}
