import { useEffect, type ReactNode } from 'react';
import { COMPANY } from '../config';
import type { LegalPage } from '../router';
import './pages.css';

const UPDATED = '13 November 2026';
const C = COMPANY;
const Mail = ({ to }: { to: string }) => <a href={`mailto:${to}`}>{to}</a>;

interface Section {
  id: string;
  title: string;
  body: ReactNode;
}
interface Doc {
  title: string;
  de: string;
  intro?: ReactNode;
  sections: Section[];
}

const address = (
  <p>
    {C.legalName}
    <br />
    {C.street}
    <br />
    {C.city}
    <br />
    Germany
  </p>
);

const DOCS: Record<LegalPage, Doc> = {
  /* ------------------------------------------------------------------ */
  imprint: {
    title: 'Imprint',
    de: 'Impressum',
    intro: <p>Information pursuant to § 5 Digitale-Dienste-Gesetz (DDG).</p>,
    sections: [
      { id: 'provider', title: 'Service provider', body: address },
      { id: 'represented', title: 'Represented by', body: <p>Managing director (Geschäftsführer): {C.managingDirector}</p> },
      {
        id: 'contact',
        title: 'Contact',
        body: (
          <p>
            Email: <Mail to={C.email} />
            <br />
            Phone: <a href={`tel:${C.phoneHref}`}>{C.phone}</a>
          </p>
        ),
      },
      { id: 'register', title: 'Commercial register', body: <p>Register court: {C.registerCourt}<br />Register number: {C.registerNumber}</p> },
      { id: 'vat', title: 'VAT ID', body: <p>VAT identification number pursuant to § 27a UStG: {C.vatId}</p> },
      {
        id: 'responsible',
        title: 'Responsible for content',
        body: <p>Responsible for editorial content pursuant to § 18(2) MStV: {C.managingDirector}, address as above.</p>,
      },
      {
        id: 'dispute',
        title: 'Consumer dispute resolution',
        body: <p>We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board (§ 36 VSBG).</p>,
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  privacy: {
    title: 'Privacy Policy',
    de: 'Datenschutzerklärung',
    intro: (
      <p>
        We take the protection of your personal data seriously. This policy explains what we process when you visit this website, contact us, apply as a rider or
        use our portals, and which rights you have under the EU General Data Protection Regulation (GDPR) and the German Federal Data Protection Act (BDSG).
      </p>
    ),
    sections: [
      { id: 'controller', title: '1. Controller', body: <>{address}<p>Email: <Mail to={C.privacyEmail} /> · Phone: <a href={`tel:${C.phoneHref}`}>{C.phone}</a></p></> },
      {
        id: 'dpo',
        title: '2. Data protection contact',
        body: <p>For any data protection question, email <Mail to={C.privacyEmail} />. [If a data protection officer is appointed, add their name and contact details here.]</p>,
      },
      {
        id: 'hosting',
        title: '3. Hosting and server log files',
        body: (
          <>
            <p>
              This website is hosted on GitHub Pages, provided by GitHub, Inc., 88 Colin P. Kelly Jr. St, San Francisco, CA 94107, USA. When you open the site,
              GitHub processes technical access data (IP address, date and time, requested page, browser and operating system, referrer) in server log files to
              deliver the website and keep it secure.
            </p>
            <p>
              Legal basis: Art. 6(1)(f) GDPR — our legitimate interest in a secure, reliable website. Data may be transferred to the USA; GitHub is certified
              under the EU-US Data Privacy Framework (adequacy decision, Art. 45 GDPR). For details see GitHub’s privacy statement.
            </p>
          </>
        ),
      },
      {
        id: 'cookies',
        title: '4. No cookies, no tracking',
        body: (
          <p>
            We do not use cookies, analytics or advertising trackers. The only thing we store on your device is your light/night mode choice, in your browser’s local
            storage, so the site remembers it (strictly necessary for a function you requested, § 25(2) no. 2 TDDDG). All fonts are hosted on our own server, and the 3D map of Berlin is rendered locally in your browser without any third-party map service. Therefore no
            consent banner is required (§ 25 TDDDG).
          </p>
        ),
      },
      {
        id: 'contact-data',
        title: '5. Contacting us',
        body: (
          <p>
            If you contact us by email, phone or the business enquiry form, we process the details you give us (e.g. name, company, email, phone, message) to answer
            your request. Legal basis: Art. 6(1)(b) GDPR for pre-contractual enquiries, otherwise Art. 6(1)(f) GDPR. We delete the data once your request is
            settled, unless statutory retention periods apply (e.g. 6 years for business letters under § 257 HGB).
          </p>
        ),
      },
      {
        id: 'applicants',
        title: '6. Applicant Privacy Notice (riders)',
        body: (
          <>
            <p>
              <b>What we collect.</b> When you apply as a rider we process: your legal name, email, German mobile number, Berlin district / postal area,
              preferred working language, self-declared right-to-work status, your confirmations that you hold (or have applied for) a tax ID, have health
              insurance, are 18 or older and will follow the StVO, your equipment preference, urban cycling experience, smartphone platform, engagement type,
              earliest start date, optional notes and your consent choices. We do <b>not</b> ask for documents, ID or tax numbers,
              photos, date of birth, nationality, health data or bank details at this stage.
            </p>
            <p>
              <b>Why and on what basis.</b> To review your application, contact you and decide whether to hire you — Art. 6(1)(b) GDPR together with Art. 88 GDPR
              and § 26 BDSG. Optional extras (talent pool, WhatsApp/SMS contact, rider newsletter) only with your consent, Art. 6(1)(a) GDPR, which you can withdraw
              at any time with effect for the future.
            </p>
            <p>
              <b>Who sees it.</b> Only the people at ON-SPREE involved in hiring, and service providers who host our application system under a data processing
              agreement (Art. 28 GDPR) on servers in the EU. [If rider data must be passed to a delivery platform partner, name the recipient and the legal basis
              here.] If you choose WhatsApp contact, WhatsApp Ireland Ltd. / Meta Platforms Inc. will process your number.
            </p>
            <p>
              <b>How long.</b> If we don’t hire you, we delete your application 6 months after our decision, so we can respond to possible legal claims (§ 15(4)
              AGG). With your talent-pool consent we keep it for 12 months. If we hire you, your data moves to your personnel file.
            </p>
            <p>
              <b>After an offer.</b> Before your first shift we need further data required by law (ID, residence permit where applicable, tax ID, social security
              number, health insurance, bank details). You will receive a separate employee privacy notice at that point.
            </p>
            <p>
              <b>Automated decisions.</b> We do not make hiring decisions solely by automated means (Art. 22 GDPR). Providing your data is voluntary, but without
              it we cannot consider your application.
            </p>
          </>
        ),
      },
      {
        id: 'portals',
        title: '7. Rider and business portals',
        body: (
          <p>
            When you log in to a portal we process your login details and the account data needed to provide the service (Art. 6(1)(b) GDPR) and security logs
            (Art. 6(1)(f) GDPR). [Add the portal provider, hosting location and retention periods before the portals go live.]
          </p>
        ),
      },
      {
        id: 'social',
        title: '8. Social media links',
        body: (
          <p>
            Our website links to our profiles on Instagram, LinkedIn and X. These are plain links — no data is sent to these networks until you click and visit them.
            Their own privacy policies then apply.
          </p>
        ),
      },
      {
        id: 'rights',
        title: '9. Your rights',
        body: (
          <>
            <p>You have the right to:</p>
            <ul>
              <li>access your data (Art. 15 GDPR)</li>
              <li>rectification (Art. 16) and erasure (Art. 17)</li>
              <li>restriction of processing (Art. 18) and data portability (Art. 20)</li>
              <li>object to processing based on legitimate interests (Art. 21)</li>
              <li>withdraw consent at any time, without affecting earlier processing (Art. 7(3))</li>
            </ul>
            <p>
              Email <Mail to={C.privacyEmail} /> to use any of these rights. You may also complain to a supervisory authority, for example the Berliner Beauftragte für
              Datenschutz und Informationsfreiheit, Alt-Moabit 59–61, 10555 Berlin.
            </p>
          </>
        ),
      },
      {
        id: 'security',
        title: '10. Security',
        body: <p>This site is served exclusively over encrypted HTTPS (TLS). We use technical and organisational measures to protect your data (Art. 32 GDPR).</p>,
      },
      { id: 'changes', title: '11. Changes', body: <p>We update this policy when our services or the law change. The current version is always available on this page.</p> },
    ],
  },

  /* ------------------------------------------------------------------ */
  terms: {
    title: 'Terms of Use',
    de: 'Nutzungsbedingungen',
    intro: <p>These terms apply to the use of this website and of the ON-SPREE rider and business portals.</p>,
    sections: [
      { id: 'operator', title: '1. Operator', body: <p>This website is operated by {C.legalName} ("ON-SPREE", "we"). See the <a href="#/imprint">Imprint</a> for details.</p> },
      {
        id: 'content',
        title: '2. Information only',
        body: (
          <p>
            The website presents ON-SPREE and its services for information purposes. Its content is not a binding offer. Contracts with businesses are concluded
            separately in writing.
          </p>
        ),
      },
      {
        id: 'applications',
        title: '3. Rider applications',
        body: (
          <p>
            Submitting an application does not create an employment relationship or a right to be hired. Employment only starts with a signed employment contract.
            Please provide accurate information.
          </p>
        ),
      },
      {
        id: 'accounts',
        title: '4. Portal accounts',
        body: (
          <p>
            Portal accounts are personal. Keep your login details confidential and tell us immediately at <Mail to={C.email} /> if you suspect misuse. We may suspend
            accounts that are used unlawfully or in breach of these terms.
          </p>
        ),
      },
      {
        id: 'ip',
        title: '5. Intellectual property',
        body: (
          <p>
            Texts, graphics, the 3D city illustration, logos and code on this website are protected by copyright and trademark law. You may not copy or reuse them
            without our written permission, except as allowed by law. See <a href="#/trademarks">Trademarks</a>.
          </p>
        ),
      },
      {
        id: 'liability',
        title: '6. Liability',
        body: (
          <p>
            We are liable without limitation for intent and gross negligence and for injury to life, body or health. For slight negligence we are only liable for
            breaches of essential obligations, limited to the typical, foreseeable damage. Liability under the Product Liability Act remains unaffected.
          </p>
        ),
      },
      {
        id: 'law',
        title: '7. Applicable law and jurisdiction',
        body: (
          <p>
            German law applies, excluding the UN Convention on Contracts for the International Sale of Goods. For merchants and legal entities under public law, the
            place of jurisdiction is Berlin. Mandatory consumer protection rules of your country of residence remain unaffected.
          </p>
        ),
      },
      { id: 'severability', title: '8. Final provisions', body: <p>If any provision is invalid, the remaining provisions stay valid. We may update these terms; the version published here applies.</p> },
    ],
  },

  /* ------------------------------------------------------------------ */
  legal: {
    title: 'Legal Notice',
    de: 'Rechtliche Hinweise',
    sections: [
      {
        id: 'content-liability',
        title: 'Liability for content',
        body: (
          <p>
            We create the content of this website with great care, but cannot guarantee that it is complete, accurate and up to date. As a service provider we are
            responsible for our own content under the general laws (§ 7(1) DDG). We are not obliged to monitor third-party information we transmit or store, or to
            investigate circumstances indicating illegal activity (§§ 8–10 DDG). Obligations to remove or block information under the general laws remain
            unaffected; liability only arises once we know of a specific infringement, and we will remove such content promptly.
          </p>
        ),
      },
      {
        id: 'links',
        title: 'Liability for links',
        body: (
          <p>
            Our website contains links to external websites over whose content we have no control. The respective provider is always responsible for linked
            content. We checked linked pages for legal violations when linking; if we become aware of an infringement we will remove the link immediately.
          </p>
        ),
      },
      {
        id: 'copyright',
        title: 'Copyright',
        body: (
          <p>
            Content and works created by ON-SPREE on this website are subject to German copyright law. Reproduction, editing, distribution or any use beyond the
            limits of copyright law require our written consent. Fonts used: Inter, Inter Tight and JetBrains Mono (SIL Open Font License). 3D rendering: three.js
            (MIT License).
          </p>
        ),
      },
      {
        id: 'claims',
        title: 'Statements about our service',
        body: (
          <p>
            Descriptions of service areas, shift patterns and equipment are general information and may change. Binding terms for riders are set out in the individual
            employment contract; binding terms for businesses in the individual service agreement.
          </p>
        ),
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  trademarks: {
    title: 'Trademarks',
    de: 'Marken',
    sections: [
      {
        id: 'own',
        title: 'Our marks',
        body: (
          <p>
            "ON-SPREE" and the ON-SPREE logo are trademarks of {C.legalName}. [Add the DPMA/EUIPO application or registration number once filed.] They may not be
            used without our prior written permission, in particular not in a way that suggests a business connection with us.
          </p>
        ),
      },
      {
        id: 'third',
        title: 'Third-party marks',
        body: (
          <p>
            Uber Eats, Wolt, Lieferando, Flink, Instagram, LinkedIn, X and other names mentioned on this website are trademarks of their respective owners. They are
            used only to identify those companies and their services. Their mention does not imply sponsorship or endorsement unless we state this explicitly.
          </p>
        ),
      },
      {
        id: 'report',
        title: 'Report misuse',
        body: <p>If you believe our marks are being misused, or that we infringe your rights, please contact <Mail to={C.email} />.</p>,
      },
    ],
  },
};

const ORDER: LegalPage[] = ['imprint', 'privacy', 'terms', 'legal', 'trademarks'];

export default function Legal({ page }: { page: LegalPage }) {
  const doc = DOCS[page];
  useEffect(() => {
    document.title = `${doc.title} — ON-SPREE`;
    return () => {
      document.title = 'ON-SPREE — Fast, sustainable e-bike delivery in Berlin';
    };
  }, [doc.title]);

  return (
    <div className="page page--legal">
      <div className="container legal">
        <nav className="legal__nav lg-glass" aria-label="Legal pages">
          {ORDER.map((p) => (
            <a key={p} href={`#/${p}`} className={p === page ? 'is-active' : ''} aria-current={p === page ? 'page' : undefined}>
              {DOCS[p].title}
            </a>
          ))}
        </nav>
        <article className="legal__doc lg-card">
          <header className="legal__head">
            <span className="eyebrow">{doc.de}</span>
            <h1 className="page__title">{doc.title}</h1>
            <p className="legal__meta">Last updated: {UPDATED}</p>
            {doc.intro}
          </header>
          {doc.sections.length > 3 && (
            <ol className="legal__toc" aria-label="Contents">
              {doc.sections.map((s) => (
                <li key={s.id}>
                  <button type="button" className="link-btn" onClick={() => document.getElementById(`s-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                    {s.title}
                  </button>
                </li>
              ))}
            </ol>
          )}
          {doc.sections.map((s) => (
            <section key={s.id} id={`s-${s.id}`} className="legal__section">
              <h2>{s.title}</h2>
              {s.body}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
