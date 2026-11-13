import { useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { AREAS, COMPANY, ENDPOINTS } from '../config';
import { IconArrow, IconBike, IconCheck, IconClock, IconHeart, IconPhone, IconShield } from '../components/ui/icons';
import { LiquidBackdrop } from '../components/ui/LiquidBackdrop';
import './pages.css';

const STEPS = ['About you', 'Eligibility', 'Availability', 'Bike & experience', 'Consent'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SHIFTS = ['Breakfast · 7–11', 'Lunch · 11–15', 'Afternoon · 15–18', 'Dinner · 18–22', 'Late · 22–01'];
const PLATFORMS = ['Uber Eats', 'Wolt', 'Lieferando', 'Flink', 'Other'];
const BEZIRKE = [
  'Mitte', 'Friedrichshain-Kreuzberg', 'Pankow', 'Charlottenburg-Wilmersdorf', 'Spandau', 'Steglitz-Zehlendorf',
  'Tempelhof-Schöneberg', 'Neukölln', 'Treptow-Köpenick', 'Marzahn-Hellersdorf', 'Lichtenberg', 'Reinickendorf', 'Outside Berlin',
];

/* ---------- small form primitives ---------- */
function Text({ label, name, type = 'text', required = true, autoComplete, placeholder, hint, ...rest }: {
  label: string; name: string; type?: string; required?: boolean; autoComplete?: string; placeholder?: string; hint?: string; min?: string; pattern?: string; inputMode?: 'tel' | 'email' | 'text';
}) {
  return (
    <label className="field">
      <span className="field__label">{label}{!required && <em> (optional)</em>}</span>
      <input className="field__input" name={name} type={type} required={required} autoComplete={autoComplete} placeholder={placeholder} {...rest} />
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  );
}

function Select({ label, name, options, required = true, placeholder = 'Please choose' }: { label: string; name: string; options: string[]; required?: boolean; placeholder?: string }) {
  return (
    <label className="field">
      <span className="field__label">{label}{!required && <em> (optional)</em>}</span>
      <select className="field__input" name={name} required={required} defaultValue="">
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Choice({ legend, name, options, type = 'radio', required = true, columns }: {
  legend: string; name: string; options: { value: string; label: ReactNode; sub?: string }[]; type?: 'radio' | 'checkbox'; required?: boolean; columns?: number;
}) {
  return (
    <fieldset className="choice" data-group={type === 'checkbox' && required ? name : undefined}>
      <legend className="field__label">{legend}{!required && <em> (optional)</em>}</legend>
      <div className="choice__grid" style={columns ? { ['--cols' as string]: columns } : undefined}>
        {options.map((o) => (
          <label key={o.value} className="choice__opt">
            <input type={type} name={name} value={o.value} required={type === 'radio' && required} />
            <span className="choice__box lg-chip">
              <span className="choice__tick" aria-hidden="true"><IconCheck /></span>
              <span>
                {o.label}
                {o.sub && <small>{o.sub}</small>}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Consent({ name, required, children }: { name: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="check">
      <input type="checkbox" name={name} value="yes" required={required} />
      <span>
        {children} {required ? <b className="check__req">Required</b> : <i className="check__opt">Optional</i>}
      </span>
    </label>
  );
}

type Phase = 'form' | 'sending' | 'sent' | 'offline' | 'error';

export default function JoinRider() {
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>('form');
  const [summary, setSummary] = useState<[string, string][]>([]);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const ref = useMemo(() => `OS-${Math.random().toString(36).slice(2, 7).toUpperCase()}`, []);

  /** Validate only the fields of the current step (including "pick at least one" groups). */
  const validateStep = (i: number) => {
    const form = formRef.current;
    if (!form) return false;
    const fs = form.querySelectorAll<HTMLFieldSetElement>('.join-step')[i];
    for (const g of fs.querySelectorAll<HTMLFieldSetElement>('fieldset[data-group]')) {
      const boxes = g.querySelectorAll<HTMLInputElement>('input[type=checkbox]');
      const any = Array.from(boxes).some((b) => b.checked);
      boxes[0].setCustomValidity(any ? '' : 'Please choose at least one option.');
    }
    const fields = Array.from(fs.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea'));
    const bad = fields.find((f) => !f.checkValidity());
    if (bad) {
      bad.reportValidity();
      bad.focus();
      return false;
    }
    return true;
  };

  const collect = () => {
    const fd = new FormData(formRef.current!);
    const data: Record<string, string | string[]> = {};
    for (const [k, v] of fd.entries()) {
      const val = String(v);
      if (k in data) data[k] = ([] as string[]).concat(data[k], val);
      else data[k] = val;
    }
    return data;
  };

  const next = () => {
    if (!validateStep(step)) return;
    if (step === STEPS.length - 2) {
      const d = collect();
      const show = (k: string) => (Array.isArray(d[k]) ? (d[k] as string[]).join(', ') : (d[k] as string) || '—');
      setSummary([
        ['Name', `${show('firstName')} ${show('lastName')}`],
        ['Email', show('email')],
        ['Phone', show('phone')],
        ['Right to work', show('workRight')],
        ['Job type', show('employment')],
        ['Hours / week', show('hours')],
        ['Days', show('days')],
        ['Shifts', show('shifts')],
        ['Areas', show('areas')],
        ['Start', show('startDate')],
        ['Bike', show('bike')],
        ['Smartphone', show('phoneOs')],
      ]);
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    requestAnimationFrame(() => document.getElementById('join-form-top')?.scrollIntoView({ block: 'start' }));
  };
  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    requestAnimationFrame(() => document.getElementById('join-form-top')?.scrollIntoView({ block: 'start' }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < STEPS.length - 1) return next();
    if (!validateStep(step)) return;
    // Not connected yet: say so honestly instead of pretending it was sent.
    if (!ENDPOINTS.riderApply) {
      setPhase('offline');
      return;
    }
    setPhase('sending');
    try {
      const res = await fetch(ENDPOINTS.riderApply, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...collect(), reference: ref, submittedAt: new Date().toISOString() }),
      });
      setPhase(res.ok ? 'sent' : 'error');
    } catch {
      setPhase('error');
    }
  };

  const kieze = AREAS.flatMap((a) => a.kieze);
  const done = phase === 'sent' || phase === 'offline' || phase === 'error';

  return (
    <div className="page page--join has-liquid">
      <LiquidBackdrop />
      <div className="container join">
        <aside className="join__intro">
          <span className="eyebrow">Riders wanted · Berlin</span>
          <h1 className="page__title">
            Ride with <span className="text-brand nowrap">ON-SPREE</span>
          </h1>
          <p className="lead">Deliver across Berlin on an e-bike. Apply in about five minutes — no documents needed yet.</p>

          <ul className="join__perks">
            <li className="lg-card" data-glass><IconClock /><div><strong>Flexible shifts</strong><span>Pick the days and times that fit your week.</span></div></li>
            <li className="lg-card" data-glass><IconBike /><div><strong>Company e-bike or your own</strong><span>Ride one of ours or bring your own pedelec.</span></div></li>
            <li className="lg-card" data-glass><IconShield /><div><strong>Proper employment</strong><span>Minijob, part-time or full-time — your choice.</span></div></li>
            <li className="lg-card" data-glass><IconHeart /><div><strong>English-speaking team</strong><span>German is welcome but not required.</span></div></li>
          </ul>

          <div className="join__req">
            <h2>What you need</h2>
            <ul>
              <li><IconCheck /> You are 18 or older</li>
              <li><IconCheck /> The right to work in Germany</li>
              <li><IconCheck /> A smartphone with mobile data</li>
              <li><IconCheck /> Confidence riding in city traffic</li>
            </ul>
          </div>

          <ol className="join__process">
            <li><b>1</b> Apply online</li>
            <li><b>2</b> Short phone call</li>
            <li><b>3</b> Onboarding &amp; safety briefing</li>
            <li><b>4</b> Your first shift</li>
          </ol>
        </aside>

        <section className="join__card lg-glass lg-glass--strong" aria-labelledby="join-title" id="join-form-top">
          {done && (
            <div className="join__done" role="status">
              {phase === 'sent' ? (
                <>
                  <span className="join__done-icon"><IconCheck /></span>
                  <h2 id="join-title">Application received</h2>
                  <p>Thanks! Your reference is <b>{ref}</b>. We’ll call or email you within a few working days to arrange a short chat.</p>
                </>
              ) : phase === 'offline' ? (
                <>
                  <h2 id="join-title">Online applications open soon</h2>
                  <p>
                    Our application system isn’t connected yet, so <b>nothing you entered has been sent or stored</b>. To apply today, email us at{' '}
                    <a href={`mailto:${COMPANY.ridersEmail}?subject=Rider%20application`}>{COMPANY.ridersEmail}</a> or call{' '}
                    <a href={`tel:${COMPANY.phoneHref}`}>{COMPANY.phone}</a>.
                  </p>
                </>
              ) : (
                <>
                  <h2 id="join-title">Something went wrong</h2>
                  <p>Your application could not be sent. Please try again, or email <a href={`mailto:${COMPANY.ridersEmail}`}>{COMPANY.ridersEmail}</a>.</p>
                </>
              )}
              <div className="join__done-ctas">
                {phase !== 'sent' && <button type="button" className="btn btn--glass" onClick={() => setPhase('form')}>Back to the form</button>}
                <a href="#top" className="btn btn--primary">Back to home</a>
              </div>
            </div>
          )}
          <div hidden={done}>
              <div className="join__head">
                <h2 id="join-title">Rider application</h2>
                <span className="join__count">Step {step + 1} of {STEPS.length}</span>
              </div>
              <ol className="stepper" aria-label="Application steps">
                {STEPS.map((s, i) => (
                  <li key={s} className={i < step ? 'is-done' : i === step ? 'is-current' : ''} aria-current={i === step ? 'step' : undefined}>
                    <span className="stepper__dot">{i < step ? <IconCheck /> : i + 1}</span>
                    <span className="stepper__label">{s}</span>
                  </li>
                ))}
              </ol>
              <div className="stepper__bar" aria-hidden="true"><span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>

              <form ref={formRef} className="join__form" onSubmit={submit} noValidate>
                {/* Step 1 */}
                <fieldset className="join-step" hidden={step !== 0}>
                  <legend className="sr-only">About you</legend>
                  <div className="form-grid">
                    <Text label="First name" name="firstName" autoComplete="given-name" />
                    <Text label="Last name" name="lastName" autoComplete="family-name" />
                    <Text label="Email" name="email" type="email" autoComplete="email" inputMode="email" />
                    <Text label="Mobile number" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+49 151 …" pattern="^[+0-9 ()\-]{7,20}$" />
                  </div>
                  <div className="form-grid">
                    <Select label="Where do you live?" name="residence" options={BEZIRKE} />
                    <Select label="Preferred language" name="language" options={['English', 'Deutsch', 'Other']} />
                  </div>
                </fieldset>

                {/* Step 2 */}
                <fieldset className="join-step" hidden={step !== 1}>
                  <legend className="sr-only">Eligibility</legend>
                  <Choice
                    legend="Your right to work in Germany"
                    name="workRight"
                    options={[
                      { value: 'EU/EEA/Swiss citizen', label: 'EU / EEA / Swiss citizen' },
                      { value: 'Residence permit allowing work', label: 'Residence permit that allows work' },
                      { value: 'Student residence permit', label: 'Student residence permit', sub: 'Limited working days per year' },
                      { value: 'Not yet / unsure', label: 'Not yet / I’m not sure', sub: 'We can’t start without it, but we’re happy to explain' },
                    ]}
                    columns={2}
                  />
                  <p className="form-note">Just tell us your status for now — we’ll check your documents in person at onboarding.</p>
                  <Choice
                    legend="What kind of job are you looking for?"
                    name="employment"
                    options={[
                      { value: 'Minijob', label: 'Minijob', sub: 'Up to the monthly Minijob limit' },
                      { value: 'Werkstudent', label: 'Working student', sub: 'Enrolled at a university' },
                      { value: 'Part-time', label: 'Part-time' },
                      { value: 'Full-time', label: 'Full-time' },
                    ]}
                    columns={2}
                  />
                  <div className="form-grid">
                    <Select label="German level" name="germanLevel" options={['None', 'Basic (A1–A2)', 'Good (B1–B2)', 'Fluent (C1+)', 'Native']} />
                    <Text label="Other languages" name="otherLanguages" required={false} placeholder="e.g. English, Turkish, Arabic" />
                  </div>
                </fieldset>

                {/* Step 3 */}
                <fieldset className="join-step" hidden={step !== 2}>
                  <legend className="sr-only">Availability</legend>
                  <Choice
                    legend="Hours per week"
                    name="hours"
                    options={[{ value: 'Up to 10', label: 'Up to 10' }, { value: '10–20', label: '10–20' }, { value: '20–30', label: '20–30' }, { value: '30–40', label: '30–40' }]}
                    columns={4}
                  />
                  <Choice legend="Which days can you ride?" name="days" type="checkbox" options={DAYS.map((d) => ({ value: d, label: d }))} columns={7} />
                  <Choice legend="Which shifts suit you?" name="shifts" type="checkbox" options={SHIFTS.map((s) => ({ value: s, label: s }))} columns={3} />
                  <Choice legend="Where would you like to ride?" name="areas" type="checkbox" options={kieze.map((k) => ({ value: k, label: k }))} columns={3} />
                  <div className="form-grid">
                    <Text label="Earliest start date" name="startDate" type="date" min={today} />
                  </div>
                </fieldset>

                {/* Step 4 */}
                <fieldset className="join-step" hidden={step !== 3}>
                  <legend className="sr-only">Bike and experience</legend>
                  <Choice
                    legend="Your bike"
                    name="bike"
                    options={[
                      { value: 'Company e-bike', label: 'I’d like a company e-bike' },
                      { value: 'Own pedelec', label: 'I have my own e-bike (pedelec, up to 25 km/h)' },
                      { value: 'Own bicycle', label: 'I have my own bicycle' },
                    ]}
                  />
                  <p className="form-note">For safety and legal reasons we can’t accept tuned e-bikes or S-pedelecs (45 km/h) on bike lanes.</p>
                  <Choice
                    legend="Your smartphone"
                    name="phoneOs"
                    options={[
                      { value: 'Android', label: 'Android', sub: 'Version 10 or newer' },
                      { value: 'iPhone', label: 'iPhone', sub: 'iOS 16 or newer' },
                      { value: 'None', label: 'I don’t have one yet' },
                    ]}
                    columns={3}
                  />
                  <Choice
                    legend="Delivery experience"
                    name="experience"
                    options={[
                      { value: 'None', label: 'None yet' },
                      { value: '<6 months', label: 'Under 6 months' },
                      { value: '6–12 months', label: '6–12 months' },
                      { value: '>1 year', label: 'Over a year' },
                    ]}
                    columns={4}
                  />
                  <Choice legend="Platforms you’ve delivered for" name="platforms" type="checkbox" required={false} options={PLATFORMS.map((p) => ({ value: p, label: p }))} columns={5} />
                  <div className="form-grid">
                    <Select label="How did you hear about us?" name="source" required={false} options={['Friend / referral', 'Instagram', 'TikTok', 'Job board', 'Google', 'Saw a rider', 'Other']} />
                    <Text label="Referral code" name="referral" required={false} placeholder="If a rider referred you" />
                  </div>
                </fieldset>

                {/* Step 5 */}
                <fieldset className="join-step" hidden={step !== 4}>
                  <legend className="sr-only">Review and consent</legend>
                  <div className="review lg-card">
                    <h3>Check your details</h3>
                    <dl>
                      {summary.map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <button type="button" className="link-btn" onClick={() => setStep(0)}>Edit details</button>
                  </div>

                  <div className="docs-note">
                    <IconShield />
                    <p>
                      <b>No documents now.</b> We only ask for your ID, residence permit (if applicable), tax ID, social security number, health insurance and bank details
                      after your interview, through our secure onboarding.
                    </p>
                  </div>

                  <div className="consents">
                    <Consent name="age" required>I am at least 18 years old.</Consent>
                    <Consent name="accurate" required>The information I have given is true and complete.</Consent>
                    <Consent name="rightToWork" required>
                      I understand I must show a valid ID and, if needed, a residence permit that allows me to work in Germany before my first shift.
                    </Consent>
                    <Consent name="privacy" required>
                      I have read the <a href="#/privacy" target="_blank" rel="noopener">Applicant Privacy Notice</a>. ON-SPREE processes my data to handle my
                      application (Art. 6(1)(b) GDPR) and deletes it 6 months after a rejection.
                    </Consent>
                    <Consent name="talentPool">
                      Keep my application in the ON-SPREE talent pool for 12 months so you can contact me about future openings.
                    </Consent>
                    <Consent name="messaging">You may contact me about my application via WhatsApp or SMS.</Consent>
                    <Consent name="newsletter">Send me occasional rider news by email (you’ll confirm by email; unsubscribe anytime).</Consent>
                    <p className="form-note">
                      Optional consents are voluntary and don’t affect your application. You can withdraw them at any time by emailing{' '}
                      <a href={`mailto:${COMPANY.privacyEmail}`}>{COMPANY.privacyEmail}</a>.
                    </p>
                  </div>
                </fieldset>

                <div className="join__nav">
                  {step > 0 ? (
                    <button type="button" className="btn btn--glass" onClick={back}>Back</button>
                  ) : (
                    <span className="join__time"><IconPhone /> Takes about 5 minutes</span>
                  )}
                  <button type="submit" className="btn btn--primary btn--lg" disabled={phase === 'sending'}>
                    {step < STEPS.length - 1 ? <>Continue <IconArrow /></> : phase === 'sending' ? 'Sending…' : <>Submit application <IconArrow /></>}
                  </button>
                </div>
              </form>
          </div>
        </section>
      </div>
    </div>
  );
}
