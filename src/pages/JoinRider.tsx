import { useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { COMPANY, ENDPOINTS } from '../config';
import { IconArrow, IconBike, IconCheck, IconClock, IconHeart, IconPhone, IconShield } from '../components/ui/icons';
import { LiquidBackdrop } from '../components/ui/LiquidBackdrop';
import './pages.css';

/* ---------- Spec: ON-SPREE Logistics rider onboarding (4 stages) ---------- */
const STAGES = ['Personal & contact', 'Work eligibility', 'E-bike & road', 'Shifts & submit'];

const DISTRICTS = [
  'Mitte / Tiergarten (10115, 10117, 10178)',
  'Friedrichshain-Kreuzberg (10243, 10997)',
  'Prenzlauer Berg / Pankow (10405, 10437)',
  'Charlottenburg-Wilmersdorf (10585, 10623)',
  'Neukölln (12043, 12049)',
  'Schöneberg / Tempelhof (10777, 12101)',
  'Wedding / Moabit (13347, 10551)',
  'Spandau / Reinickendorf (13581, 13403)',
];
const LANGUAGES = ['Bilingual (English & German)', 'English', 'German (Deutsch)'];
const WORK_RIGHTS = [
  'EU / EEA / Swiss Citizen (Unlimited Work Right)',
  'German Opportunity Card (Chancenkarte)',
  'German Residence Permit (Aufenthaltstitel mit Erwerbstätigkeit)',
  'German Student Visa (140 full / 280 half days compliant)',
  'Other Valid Official Work Authorization',
];
const EQUIPMENT = [
  'Use an ON-SPREE Company E-Bike (Provided, with insulated cargo box)',
  'Ride My Own Road-Legal Pedelec (StVO Certified)',
];
const CYCLING = ['Experienced City Cyclist (Daily Urban Rider)', 'Moderate Urban Rider', 'New to Berlin Bike Lanes'];
const PHONES = ['Apple iOS (iPhone)', 'Android (Samsung, Google Pixel, etc.)'];
const ENGAGEMENT = [
  { value: 'Full-Time (Festanstellung)', label: 'Full-Time', sub: 'Festanstellung' },
  { value: 'Part-Time (Teilzeit)', label: 'Part-Time', sub: 'Teilzeit' },
  { value: 'Minijob (Geringfügige Beschäftigung)', label: 'Minijob', sub: 'Geringfügige Beschäftigung' },
];
const WINDOWS = [
  { value: 'Lunch Service', label: 'Lunch Service' },
  { value: 'Afternoon Courier Block', label: 'Afternoon Courier Block' },
  { value: 'Dinner Peak', label: 'Dinner Peak' },
  { value: 'Weekend Shifts', label: 'Weekend Shifts' },
];
const NEXT_STEPS = [
  { title: 'Document verification', text: 'Our fleet coordination desk checks your ID, right to work, tax ID and health insurance.' },
  { title: 'Hub safety & equipment briefing', text: 'A safety and equipment briefing at our central Berlin depot, where you collect your gear.' },
  { title: 'Uber Eats fleet portal activation', text: 'We activate your account in the Uber Eats dedicated fleet portal so you can start riding.' },
];

/** Fields shown in the post-submission dossier, grouped by stage. */
const DOSSIER: { stage: string; rows: [string, string][] }[] = [
  { stage: STAGES[0], rows: [['Full legal name', 'name'], ['Email', 'email'], ['Mobile', 'phone'], ['District / postal code', 'district'], ['Working language', 'language']] },
  { stage: STAGES[1], rows: [['Right to work', 'workRight'], ['Steuer-ID', 'taxId'], ['Health insurance', 'healthInsurance'], ['Age 18+', 'age']] },
  { stage: STAGES[2], rows: [['Equipment', 'equipment'], ['Urban cycling', 'cycling'], ['Smartphone', 'smartphone'], ['StVO acknowledgement', 'stvo']] },
  { stage: STAGES[3], rows: [['Engagement', 'engagement'], ['Delivery windows', 'windows'], ['Earliest start', 'startDate'], ['Notes', 'notes'], ['GDPR', 'gdpr'], ['Talent pool', 'talentPool']] },
];

/* ---------- form primitives ---------- */
function Text({ label, name, type = 'text', required = true, hint, ...rest }: {
  label: string; name: string; type?: string; required?: boolean; hint?: string; autoComplete?: string; placeholder?: string;
  min?: string; pattern?: string; inputMode?: 'tel' | 'email' | 'text'; defaultValue?: string; title?: string;
}) {
  return (
    <label className="field">
      <span className="field__label">{label}{!required && <em> (optional)</em>}</span>
      <input className="field__input" name={name} type={type} required={required} {...rest} />
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  );
}

function Select({ label, name, options, defaultValue = '' }: { label: string; name: string; options: string[]; defaultValue?: string }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <select className="field__input" name={name} required defaultValue={defaultValue}>
        {!defaultValue && <option value="" disabled>Please choose</option>}
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Chips({ legend, name, options, type, hint }: {
  legend: string; name: string; options: { value: string; label: string; sub?: string }[]; type: 'radio' | 'checkbox'; hint?: string;
}) {
  return (
    <fieldset className="choice" data-group={type === 'checkbox' ? name : undefined}>
      <legend className="field__label">{legend}</legend>
      {hint && <span className="field__hint">{hint}</span>}
      <div className="choice__grid" style={{ ['--cols' as string]: options.length > 3 ? 2 : options.length }}>
        {options.map((o) => (
          <label key={o.value} className="choice__opt">
            <input type={type} name={name} value={o.value} required={type === 'radio'} />
            <span className="choice__box lg-chip">
              <span className="choice__tick" aria-hidden="true"><IconCheck /></span>
              <span>{o.label}{o.sub && <small>{o.sub}</small>}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Check({ name, required = true, title, children }: { name: string; required?: boolean; title?: string; children: ReactNode }) {
  return (
    <label className="check check--card">
      <input type="checkbox" name={name} value="Confirmed" required={required} />
      <span>
        {title && <strong>{title} </strong>}
        {children} {required ? <b className="check__req">Required</b> : <i className="check__opt">Optional</i>}
      </span>
    </label>
  );
}

type Phase = 'form' | 'sending' | 'sent' | 'offline' | 'error';

export default function JoinRider() {
  const formRef = useRef<HTMLFormElement>(null);
  const [stage, setStage] = useState(0);
  const [phase, setPhase] = useState<Phase>('form');
  const [data, setData] = useState<Record<string, string>>({});
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const ref = useMemo(() => `OSL-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`, []);
  const done = phase === 'sent' || phase === 'offline' || phase === 'error';

  /** Validate the fields of one stage (including "choose at least one" chip groups). */
  const validateStage = (i: number) => {
    const form = formRef.current;
    if (!form) return false;
    const fs = form.querySelectorAll<HTMLFieldSetElement>('.join-step')[i];
    for (const g of fs.querySelectorAll<HTMLFieldSetElement>('fieldset[data-group]')) {
      const boxes = g.querySelectorAll<HTMLInputElement>('input[type=checkbox]');
      boxes[0].setCustomValidity(Array.from(boxes).some((b) => b.checked) ? '' : 'Please choose at least one option.');
    }
    const phone = fs.querySelector<HTMLInputElement>('input[name=phone]');
    if (phone) phone.setCustomValidity(/^\+49[\d\s]{8,16}$/.test(phone.value.trim()) ? '' : 'Please enter a German mobile number starting with +49.');
    const bad = Array.from(fs.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')).find((f) => !f.checkValidity());
    if (bad) {
      bad.reportValidity();
      bad.focus();
      return false;
    }
    return true;
  };

  const collect = () => {
    const fd = new FormData(formRef.current!);
    const out: Record<string, string> = {};
    for (const [k, v] of fd.entries()) out[k] = out[k] ? `${out[k]}, ${v}` : String(v);
    out.name = `${out.firstName ?? ''} ${out.lastName ?? ''}`.trim();
    return out;
  };

  const go = (i: number) => {
    setStage(i);
    requestAnimationFrame(() => document.getElementById('join-form-top')?.scrollIntoView({ block: 'start' }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStage(stage)) return;
    if (stage < STAGES.length - 1) return go(stage + 1);
    const payload = collect();
    setData(payload);
    setSubmittedAt(new Date());
    // Not connected yet: show the dossier, but say clearly that nothing was sent.
    if (!ENDPOINTS.riderApply) {
      setPhase('offline');
      return;
    }
    setPhase('sending');
    try {
      const res = await fetch(ENDPOINTS.riderApply, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...payload, reference: ref, submittedAt: new Date().toISOString() }),
      });
      setPhase(res.ok ? 'sent' : 'error');
    } catch {
      setPhase('error');
    }
  };

  return (
    <div className="page page--join has-liquid">
      <LiquidBackdrop />
      <div className="container join">
        <aside className="join__intro">
          <span className="eyebrow">Rider onboarding · Berlin</span>
          <h1 className="page__title">
            Ride with <span className="text-brand nowrap">ON-SPREE</span>
          </h1>
          <p className="lead">Deliver across Berlin on an e-bike as part of the ON-SPREE fleet. Four short stages, about five minutes — no documents needed yet.</p>

          <ul className="join__perks">
            <li className="lg-card" data-glass><IconClock /><div><strong>Choose your windows</strong><span>Lunch, afternoon, dinner peak or weekends.</span></div></li>
            <li className="lg-card" data-glass><IconBike /><div><strong>Company e-bike or your own</strong><span>Ours come with an insulated cargo box.</span></div></li>
            <li className="lg-card" data-glass><IconShield /><div><strong>Proper employment</strong><span>Full-time, part-time or Minijob.</span></div></li>
            <li className="lg-card" data-glass><IconHeart /><div><strong>Bilingual team</strong><span>English and German spoken.</span></div></li>
          </ul>

          <div className="join__req">
            <h2>What you need</h2>
            <ul>
              <li><IconCheck /> Age 18+ and the right to work in Germany</li>
              <li><IconCheck /> A Steuer-ID (or applied for one)</li>
              <li><IconCheck /> German health insurance</li>
              <li><IconCheck /> An iPhone or Android smartphone</li>
            </ul>
          </div>
        </aside>

        <section className="join__card lg-glass lg-glass--strong" aria-labelledby="join-title" id="join-form-top">
          {done && (
            <div className="dossier" role="status">
              <div className="dossier__head">
                <div>
                  <span className="eyebrow">Applicant dossier</span>
                  <h2 id="join-title">{phase === 'sent' ? 'Application submitted' : phase === 'offline' ? 'Your application summary' : 'Submission failed'}</h2>
                </div>
                <span className={`dossier__status dossier__status--${phase}`}>
                  {phase === 'sent' ? 'Submitted' : phase === 'offline' ? 'Not sent' : 'Error'}
                </span>
              </div>

              {phase === 'offline' && (
                <p className="dossier__alert">
                  Online applications open soon. <b>This summary has not been sent or stored.</b> To apply today, email{' '}
                  <a href={`mailto:${COMPANY.ridersEmail}?subject=Rider%20application`}>{COMPANY.ridersEmail}</a> or call{' '}
                  <a href={`tel:${COMPANY.phoneHref}`}>{COMPANY.phone}</a>.
                </p>
              )}
              {phase === 'error' && (
                <p className="dossier__alert">
                  We couldn’t send your application. Please try again, or email <a href={`mailto:${COMPANY.ridersEmail}`}>{COMPANY.ridersEmail}</a>.
                </p>
              )}

              <dl className="dossier__meta">
                <div><dt>Reference</dt><dd>{ref}</dd></div>
                <div><dt>Date</dt><dd>{submittedAt?.toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</dd></div>
              </dl>

              {DOSSIER.map((g) => (
                <section key={g.stage} className="dossier__group">
                  <h3>{g.stage}</h3>
                  <dl>
                    {g.rows.map(([label, key]) => (
                      <div key={key}>
                        <dt>{label}</dt>
                        <dd>{data[key] || (key === 'talentPool' ? 'Not given' : '—')}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}

              <h3 className="dossier__next-title">Next steps</h3>
              <ol className="dossier__next">
                {NEXT_STEPS.map((s, i) => (
                  <li key={s.title}>
                    <b>{i + 1}</b>
                    <div><strong>{s.title}</strong><span>{s.text}</span></div>
                  </li>
                ))}
              </ol>

              <div className="join__done-ctas">
                {phase !== 'sent' && <button type="button" className="btn btn--glass" onClick={() => setPhase('form')}>Edit application</button>}
                <button type="button" className="btn btn--glass" onClick={() => window.print()}>Print summary</button>
                <a href="#top" className="btn btn--primary">Back to home</a>
              </div>
            </div>
          )}

          <div hidden={done}>
            <div className="join__head">
              <h2 id={done ? undefined : 'join-title'}>Rider onboarding</h2>
              <span className="join__count">Stage {stage + 1} of {STAGES.length}</span>
            </div>
            <ol className="stepper stepper--4" aria-label="Onboarding stages">
              {STAGES.map((s, i) => (
                <li key={s} className={i < stage ? 'is-done' : i === stage ? 'is-current' : ''} aria-current={i === stage ? 'step' : undefined}>
                  <span className="stepper__dot">{i < stage ? <IconCheck /> : i + 1}</span>
                  <span className="stepper__label">{s}</span>
                </li>
              ))}
            </ol>
            <div className="stepper__bar" aria-hidden="true"><span style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }} /></div>

            <form ref={formRef} className="join__form" onSubmit={submit} noValidate>
              {/* Stage 1 — Personal & Contact Profile */}
              <fieldset className="join-step" hidden={stage !== 0}>
                <legend className="join-step__title">Personal &amp; contact profile</legend>
                <div className="form-grid">
                  <Text label="First name (legal)" name="firstName" autoComplete="given-name" />
                  <Text label="Last name (legal)" name="lastName" autoComplete="family-name" />
                </div>
                <Text
                  label="Email address"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
                  title="Please enter a valid email address, e.g. name@example.com"
                />
                <Text
                  label="German mobile number"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  defaultValue="+49 "
                  hint="Must start with +49"
                />
                <div className="form-grid">
                  <Select label="Current Berlin district / postal code" name="district" options={DISTRICTS} />
                  <Select label="Preferred working language" name="language" options={LANGUAGES} defaultValue={LANGUAGES[0]} />
                </div>
              </fieldset>

              {/* Stage 2 — Work Eligibility & Berlin Readiness */}
              <fieldset className="join-step" hidden={stage !== 1}>
                <legend className="join-step__title">Work eligibility &amp; Berlin readiness</legend>
                <Select label="Legal right-to-work status in Germany" name="workRight" options={WORK_RIGHTS} />
                <p className="form-note">Just tell us your status for now — documents are checked at the verification step.</p>
                <div className="consents">
                  <span className="field__label">Mandatory statutory verification</span>
                  <Check name="taxId" title="German Tax ID (Steuer-ID):">
                    I hold, or have applied for, an 11-digit tax ID from the Bundeszentralamt für Steuern.
                  </Check>
                  <Check name="healthInsurance" title="German health insurance (Krankenkasse):">
                    I have active coverage with a statutory or private provider (e.g. TK, AOK, Barmer).
                  </Check>
                  <Check name="age" title="Minimum age:">I am at least 18 years old.</Check>
                </div>
              </fieldset>

              {/* Stage 3 — E-Bike & Road Readiness */}
              <fieldset className="join-step" hidden={stage !== 2}>
                <legend className="join-step__title">E-bike &amp; road readiness</legend>
                <Select label="Equipment preference" name="equipment" options={EQUIPMENT} />
                <Select label="Urban cycling experience" name="cycling" options={CYCLING} />
                <Select label="Smartphone platform for the Uber Eats courier app" name="smartphone" options={PHONES} />
                <div className="consents">
                  <span className="field__label">Road safety</span>
                  <Check name="stvo" title="German StVO acknowledgement:">
                    I will follow German road traffic regulations (StVO), cycle-lane rules and pedestrians’ right of way.
                  </Check>
                </div>
              </fieldset>

              {/* Stage 4 — Shift Preferences & Regulatory Submission */}
              <fieldset className="join-step" hidden={stage !== 3}>
                <legend className="join-step__title">Shift preferences &amp; submission</legend>
                <Chips legend="Engagement classification" name="engagement" type="radio" options={ENGAGEMENT} />
                <Chips legend="Preferred delivery windows" name="windows" type="checkbox" options={WINDOWS} hint="Choose all that apply." />
                <div className="form-grid">
                  <Text label="Earliest available start date" name="startDate" type="date" min={today} />
                </div>
                <label className="field">
                  <span className="field__label">Notes for the fleet coordinator <em>(optional)</em></span>
                  <textarea className="field__input field__input--area" name="notes" rows={3} maxLength={500} placeholder="Hub preferences, questions, anything we should know" />
                </label>
                <div className="consents">
                  <Check name="gdpr" title="Data protection:">
                    I agree to the processing of my candidate data pursuant to Art. 6(1)(b) GDPR and § 26 BDSG, as described in the{' '}
                    <a href="#/privacy" target="_blank" rel="noopener">Applicant Privacy Notice</a>. Rejected applications are deleted after 6 months.
                  </Check>
                  <Check name="talentPool" required={false}>
                    Keep my application in the ON-SPREE talent pool for 12 months for future openings. I can withdraw this at any time.
                  </Check>
                </div>
              </fieldset>

              <div className="join__nav">
                {stage > 0 ? (
                  <button type="button" className="btn btn--glass" onClick={() => go(stage - 1)}>Back</button>
                ) : (
                  <span className="join__time"><IconPhone /> Takes about 5 minutes</span>
                )}
                <button type="submit" className="btn btn--primary btn--lg" disabled={phase === 'sending'}>
                  {stage < STAGES.length - 1 ? <>Continue <IconArrow /></> : phase === 'sending' ? 'Submitting…' : <>Submit application <IconArrow /></>}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
