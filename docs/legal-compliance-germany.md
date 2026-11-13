# ON-SPREE: legal and compliance notes for Germany

*Prepared for the project manager, November 2026. These are working notes to brief your lawyer and tax adviser. They are not legal advice. Have them checked by a Fachanwalt für IT-Recht / Arbeitsrecht and your Steuerberater before launch. Figures marked ⚠︎ change regularly and should be re-checked.*

---

## 0. Summary: what to do before going live

| # | Action | Owner | Why |
|---|---|---|---|
| 1 | Use the full legal name **"ON-SPREE Logistics UG (haftungsbeschränkt)"** everywhere: site, emails, contracts, invoices | Founder | §5a GmbHG. Leaving out "(haftungsbeschränkt)" can make the managing director personally liable. |
| 2 | Fill in the **Impressum** with real data (address, managing director, HRB, register court, VAT ID) | Founder | §5 DDG. Fines up to €50,000, and competitors can send cease-and-desist letters (*Abmahnung*). |
| 3 | Finalise the **privacy policy**, including a section for rider applicants | Legal | GDPR Art. 13/14 |
| 4 | Keep the site **cookie-free**. Fonts are now self-hosted, and there's no analytics. Only add a consent banner if tracking is ever added. | Dev | §25 TDDDG; the Google Fonts ruling (LG München I) |
| 5 | Sign **data processing agreements** (AVV, Art. 28 GDPR) with every tool that touches rider data: form backend, applicant tracking system (ATS), email, cloud storage | Ops | GDPR Art. 28 |
| 6 | Decide how riders are **engaged**. Employing them (Minijob / part-time / full-time) is strongly recommended. | Founder + labour lawyer | Bogus self-employment risk; EU Platform Work Directive |
| 7 | Register with the **Berufsgenossenschaft** (accident insurance), and set up **Sofortmeldung** and ID-carrying rules | HR | §28a(4) SGB IV; §2a SchwarzArbG |
| 8 | Check every **right to work** before the first shift and keep a copy | HR | §4a(5) AufenthG |
| 9 | Review **marketing claims** ("zero-emission", "sustainable", "fastest") | Marketing | UWG; EU Empowering Consumers Directive, from 27 Sep 2026 |
| 10 | File the **"ON-SPREE" trademark** with the DPMA or EUIPO after a clearance search | Founder | Protects the brand |
| 11 | Get **written permission** before naming or showing Uber Eats on the site | Founder | Trademark law and the Uber partner terms |

---

## 1. Company form and naming

- **Legal form wording.** A UG must always show its legal form in full: *"Unternehmergesellschaft (haftungsbeschränkt)"* or *"UG (haftungsbeschränkt)"* (§5a(1) GmbHG). "ON SPREE Logistics UG" on its own is **not enough**.
  - The site now uses **ON-SPREE Logistics UG (haftungsbeschränkt)** as the legal name and **ON-SPREE** as the brand.
  - The registered name in the Handelsregister must match. If it was registered without the hyphen, either change the registration or use the registered spelling on all legal pages.
- **Business letters and emails** (§35a GmbHG) must show the legal form, registered seat, register court, HRB number and every managing director (Geschäftsführer). Put this in every email signature.
- **Other registrations:** Gewerbeanmeldung (Bezirksamt), Transparenzregister (beneficial owners), tax registration with the Finanzamt (Fragebogen zur steuerlichen Erfassung), and IHK membership (automatic).

## 2. Impressum (legal notice)

The legal basis is §5 Digitale-Dienste-Gesetz (**DDG**), which replaced §5 TMG on 14 May 2024. Editorial content (a blog, news) is also covered by §18(2) MStV.

The Impressum must be reachable in **two clicks or fewer** from every page, under a clear label ("Impressum" / "Legal notice"). Mandatory content:

1. Full company name with legal form: *ON-SPREE Logistics UG (haftungsbeschränkt)*
2. A street address where legal documents can be served. **No PO box.** It may be left out of the footer (as requested), but it **must** be in the Impressum.
3. The managing director(s), with full names
4. Email, plus a second fast contact channel (a phone number or a contact form)
5. Register court and number, e.g. *Amtsgericht Charlottenburg, HRB …*
6. VAT ID (USt-IdNr., §27a UStG) if you have one, or your Wirtschafts-Identifikationsnummer
7. The person responsible for editorial content (§18(2) MStV), if you publish articles or news
8. The consumer dispute resolution statement (§36 VSBG), only if you have more than 10 employees **and** offer contracts or T&Cs to consumers
   - The EU Online Dispute Resolution platform was **shut down on 20 July 2025**, so the old "ODR link" is no longer required. Remove it if a template still includes it.

> The site now has an Impressum page with clearly marked placeholders: `[Street & no.]`, `[Managing director]`, `[HRB number]`, `[VAT ID]`.

## 3. Data protection (GDPR / DSGVO, BDSG, TDDDG)

### 3.1 Website

- **Privacy policy** (GDPR Art. 13). It must name:
  - the controller and their contact details, plus the data protection officer if you need one (see below)
  - each processing purpose and its legal basis
  - recipients and processors
  - any transfers to third countries
  - how long data is kept
  - the data subject rights (Art. 15–22) and how to withdraw consent
  - the right to complain to the supervisory authority: **Berliner Beauftragte für Datenschutz und Informationsfreiheit (BlnBDI)**
- **Hosting.** The site runs on **GitHub Pages** (GitHub Inc. / Microsoft, USA). GitHub logs visitors' IP addresses.
  - This has to be disclosed in the privacy policy (legal basis Art. 6(1)(f), with transfers under the EU-US Data Privacy Framework).
  - Once rider applications go live, consider EU hosting (e.g. Netlify EU, Hetzner or IONOS) to keep data in the EU.
- **Cookies and similar storage** (§25 TDDDG, formerly TTDSG, renamed 14 May 2024): anything that isn't strictly necessary needs **prior consent**.
  - The site sets no cookies and uses no tracking, so **no cookie banner is needed** right now.
  - If you add analytics (GA4, Meta Pixel, Hotjar …), you need a proper consent tool. "Reject all" must be as easy as "Accept all", and nothing may load before consent.
- **Google Fonts.** LG München I (20 Jan 2022, 3 O 17493/20) awarded damages against a site that loaded Google Fonts from Google's servers.
  - ✅ The fonts are now self-hosted, so no visitor data goes to Google.
- **Contact and enquiry forms.** Legal basis Art. 6(1)(b) (pre-contractual) or (f). Collect only what you need, and send data over HTTPS to an EU processor that has signed an AVV.
- **Data protection officer (DPO).** Mandatory under §38 BDSG once **20 or more people** regularly process personal data by automated means. That includes dispatchers and HR, but **not** riders just using the delivery app. You also need one if you do large-scale monitoring (live GPS tracking of riders may count). An external DPO costs roughly €100–300 a month.
- **Internal documentation:**
  - Record of processing activities (Art. 30)
  - Technical and organisational measures (Art. 32)
  - Data breach process: report to the BlnBDI **within 72 hours** (Art. 33)
  - Data protection impact assessment (DPIA, Art. 35) if you track riders' location or use algorithmic dispatching

### 3.2 Rider applicant data

See section 5 for the full field-by-field plan.

- **Legal basis:**
  - Processing an application → **Art. 6(1)(b) GDPR**, with Art. 88 / §26 BDSG.
  - Note: the CJEU ruling C-34/21 (30 Mar 2023) cast doubt on §26(1) BDSG as a stand-alone basis, so cite Art. 6(1)(b) as the main basis.
  - **No consent is needed to process the application itself.** Don't make it look as if the application depends on consent.
- **Things that DO need separate, optional consent** (each its own unticked box):
  - keeping the application in a **talent pool** after the job is filled (e.g. 12 months)
  - contact via **WhatsApp / SMS** (WhatsApp is a US service and needs its own disclosure)
  - newsletters or marketing; use double opt-in (§7 UWG)
- **Retention:** delete rejected applications **6 months** after the decision. That covers the AGG claim period (2 months under §15(4) AGG, plus 3 months to sue under §61b ArbGG). Keep them longer only with talent-pool consent.
- **Never ask at the application stage:**
  - photo, nationality, religion, marital status, pregnancy, health or disability (AGG and GDPR Art. 9)
  - copies of ID or residence permits; collect these at the **contract stage**
  - IBAN, tax ID, social security number or health insurance
  - a criminal record certificate (*Führungszeugnis*): generally not justified for food couriers (Art. 10 GDPR)
- **Fair job ads (AGG):** use the "(m/w/d)" / "(m/f/d)" wording. Don't use age limits like "young team". German skills may only be required where the job genuinely needs them.

## 4. Engaging riders (employment law)

### 4.1 Employee or freelancer?

- **Recommendation: employ riders.** Freelance riders who are given shifts, zones and instructions are very likely **bogus self-employed** (*Scheinselbstständigkeit*, §7 SGB IV).
  - Consequences: back payment of social security for up to 4 years (30 if intentional), criminal liability for the managing director (§266a StGB), and loss of the Uber partnership.
  - BAG ruling of 1 Dec 2020 (9 AZR 102/20): even app-based "crowdworkers" can be employees.
  - If you're unsure, ask the DRV for a status determination (*Statusfeststellungsverfahren*, §7a SGB IV).
- **EU Platform Work Directive (EU) 2024/2831** must be transposed by **2 December 2026**. It brings:
  - a legal presumption of employment for platform workers
  - transparency rules on algorithmic management (dispatch, ratings, deactivation)
  - human review of automated decisions

  Build your processes with this in mind from day one.

### 4.2 Pay and working time ⚠︎

- **Statutory minimum wage:** **€13.90/hour from 1 Jan 2026** and **€14.60/hour from 1 Jan 2027** (MiLoG, Mindestlohnkommission decision of June 2025).
  - Tips don't count towards it.
  - Pay per order is only allowed if every hour still reaches the minimum.
- **Minijob earnings limit:** **€603/month in 2026**. It rises with the minimum wage, so re-check it each January.
- **Working time** (ArbZG): a maximum of 8 hours a day (10 if averaged out), a 30-minute break after 6 hours, and 11 hours' rest between shifts.
  - You must **record all working time** (BAG, 13 Sep 2022, 1 ABR 22/21).
  - For Minijobbers and the "Schwarzarbeit" sectors, records must start, end and total each day, and be kept 2 years (§17 MiLoG).
- **Bikes and phones:** the **employer must provide** a roadworthy bike and a smartphone with a data plan, **or pay fair compensation** for the rider's own (BAG, 10 Nov 2021, 5 AZR 334/21). Put this in the contract. The rider form asks whether the rider wants an e-bike provided.

### 4.3 Contracts and registrations

- **Written terms** (Nachweisgesetz):
  - Since 2025, many employers may hand out terms in text form (email).
  - But the **transport and logistics sector is listed in §2a SchwarzArbG**, and for those sectors **written, wet-ink terms remain the safe choice**. Hand them over on day one.
- **Sofortmeldung** (§28a(4) SGB IV): register every rider with social security **at the latest when they start work**. This applies to the transport and logistics sector.
- **ID-carrying duty** (§2a SchwarzArbG): riders must carry their ID while working, and you must tell them so **in writing**.
- **Accident insurance:** register with the responsible **Berufsgenossenschaft** (typically **BG Verkehr**) within one week of founding the company or hiring the first employee.
- **Health and safety** (ArbSchG §5):
  - a written risk assessment covering traffic, weather, heavy loads and night shifts
  - safety briefings, documented and signed
  - helmet, high-visibility clothing and rain gear
  - regular bike inspections
- **Right to work** (§4a AufenthG):
  - Check the original documents **before the first shift**, and keep a copy for the whole employment.
  - EU, EEA and Swiss citizens don't need a permit.
  - Students from outside the EU may work **140 full or 280 half days a year** (§16b AufenthG).
  - Illegal employment can cost **up to €500,000**.
- **Minimum age:** 18. Young people under the JArbSchG face strict limits on hours and night work.
- **Works council:** if one is formed, GPS tracking and app-based performance data need its agreement (§87(1) no. 6 BetrVG).

### 4.4 E-bikes on Berlin roads

- **Pedelecs** (assistance up to 25 km/h, motor ≤ 250 W, only while pedalling) count legally as bicycles. Riders need no licence, number plate or insurance, and may use bike lanes.
- **S-pedelecs** (up to 45 km/h) are motor vehicles. They need an insurance plate and at least an AM licence, and are **not allowed on bike lanes**.
- **Tuned e-bikes are illegal.** They void insurance and could expose the company to liability. Ban tuning in the contract and check bikes regularly.
- Riders may **not** use their phones while riding (§23 StVO). Phones must be mounted.

## 5. Rider data: what to collect, when and why

| Stage | Data | Required? | Legal basis | Retention |
|---|---|---|---|---|
| **Application** (website form) | First and last name, email, mobile number | Yes | Art. 6(1)(b) | 6 months after rejection; transfers to the personnel file if hired |
| | Preferred Berlin areas, availability (days, shifts, hours), preferred start date | Yes | Art. 6(1)(b) | as above |
| | Type of job (Minijob / part-time / full-time / working student) | Yes | Art. 6(1)(b) | as above |
| | Right to work in Germany: **self-declared category only, no document** | Yes | Art. 6(1)(b), §4a AufenthG | as above |
| | Confirmation of age 18+ (a checkbox, **not** date of birth) | Yes | Art. 6(1)(b) | as above |
| | Confirmations that a Steuer-ID is held or applied for, health insurance is active, and the rider will follow the StVO: **yes/no only, never the numbers** | Yes (per the onboarding spec) | Art. 6(1)(b) | as above |
| | Own e-bike / own bicycle / e-bike provided; smartphone OS | Yes | Art. 6(1)(b) (bike and phone ruling) | as above |
| | Languages, delivery experience, platforms worked on | Optional | Art. 6(1)(b) | as above |
| | How they heard about you, referral code | Optional | Art. 6(1)(f) | as above |
| | Talent pool, WhatsApp/SMS contact, newsletter | **Separate opt-in** | Art. 6(1)(a) consent | until withdrawn / 12 months |
| **Offer and contract** | Home address, date of birth, ID or passport (seen and copied), residence title (copy required) | Yes | Art. 6(1)(b), (c); §4a(5) AufenthG | while employed + 3 years; the residence permit copy for the whole employment |
| | Tax ID (Steuer-ID), tax class, social security number, health insurance, IBAN | Yes | Art. 6(1)(c), payroll law | payroll records: 6 years (§41 EStG); accounting vouchers: 8–10 years (§147 AO) |
| | Other jobs (needed to check Minijob limits) | Yes, for Minijobs | Art. 6(1)(c) | as payroll |
| | Emergency contact | Optional, by consent | Art. 6(1)(a) | while employed |
| | Clothing and helmet size | Yes | Art. 6(1)(b) | while employed |
| **While working** | Shifts and working time records | Yes | Art. 6(1)(c), §17 MiLoG | at least 2 years |
| | GPS **only during shifts**, for dispatch and safety; no hidden performance profiles | Only if needed | Art. 6(1)(b)/(f); DPIA; works council | as short as possible (e.g. 30–90 days) |
| | Accident and incident reports | Yes | Art. 6(1)(c) (BG reporting) | 5+ years |

**Security when collecting rider data:**

- Collect it through an **EU-hosted applicant tracking system** (ATS), e.g. Personio, softgarden, JOIN or Recruitee, or through an EU form backend.
- Avoid email attachments.
- Uploads must be encrypted.
- Give access only to the hiring team.
- Sign an **AVV** with every provider.
- Applicants should be able to delete their application from a link in the confirmation email, or by writing to you.

**Uber Eats (fleet partner set-up):** clarify with Uber in writing:

- which rider data you must pass to Uber
- whether Uber acts as an independent controller, a processor or a joint controller (Art. 26)
- how riders are told about this (it goes into the applicant privacy notice)

Don't upload riders' documents to platforms that don't need them.

## 6. Marketing, claims and consumer law

- **Misleading advertising** (UWG §5): "fastest", "most reliable" and "best in Berlin" need proof. The site avoids unprovable numbers.
- **Environmental claims:** the **EU Empowering Consumers for the Green Transition Directive (2024/825)** applies from **27 September 2026**.
  - It **bans generic environmental claims** ("eco-friendly", "green", "climate-neutral") unless you can prove recognised excellent environmental performance.
  - Prefer concrete, provable statements: "deliveries by pedelec, no exhaust emissions at the point of delivery" rather than "zero-emission" or "eco-conscious".
  - ⚠︎ **Recommendation:** soften the "Zero-emission e-bikes" and "Eco-conscious logistics" wording before 27 Sep 2026. Your lawyer should confirm the final wording.
- **Prices** (PAngV): if you ever show prices to consumers, show total prices including VAT.
- **Accessibility** (BFSG): in force since **28 June 2025** for consumer e-commerce services.
  - Micro-enterprises (fewer than 10 staff and ≤ €2m turnover) offering services are exempt, and a recruiting/B2B site is mostly outside its scope.
  - Still, follow **WCAG 2.1 AA**: the site already has a keyboard-usable map, focus styles, reduced-motion support and labelled forms.
- **Language:** an English-only site is allowed. A **German version of the legal pages** is strongly recommended, because Berlin courts and the BlnBDI work in German.

## 7. Trademarks and third-party brands

- Run a **clearance search** before investing in the brand: DPMAregister, EUIPO eSearch and TMview, for "ON-SPREE", "On Spree" and similar marks in class 39 (transport and delivery).
- File a word mark (and the logo as a figurative mark) with the **DPMA** (Germany, from about €290 for 3 classes) or the **EUIPO** (EU-wide, from €850).
  - Suggested classes: **39** (courier and delivery services), **35** (logistics management), **9/42** (apps, if you build any).
- Use **™** until the mark is registered and **®** only after registration. Using ® before then is misleading (UWG).
- **Uber Eats:** "Uber" and "Uber Eats" are Uber's trademarks.
  - Don't use their logos or colours without written permission under your partner agreement.
  - Plain factual statements such as "our riders deliver on the Uber Eats platform" are generally fine, but check what your Uber fleet-partner contract allows.
  - Don't suggest an endorsement or joint venture.
- **Fonts and images:** Inter, Inter Tight and JetBrains Mono are under the SIL Open Font License, so commercial use is fine. All map art and icons are original.

## 8. Website legal pages: what's on the site now

| Page | Route | Status |
|---|---|---|
| Privacy Policy, including the applicant privacy notice | `#/privacy` | Draft; placeholders to fill in |
| Imprint (Impressum) | `#/imprint` | Placeholders: address, managing director, HRB, VAT ID |
| Terms of Use (website and portals) | `#/terms` | Draft |
| Legal Notice (liability, links, copyright) | `#/legal` | Draft |
| Trademarks | `#/trademarks` | Draft; update once the mark is filed |

All forms (rider application, rider and business login, business enquiry) are **front-end only**. They tell the user honestly that nothing is sent yet. Before connecting them:

1. Choose an EU-hosted backend or ATS and sign the AVV.
2. Set `VITE_RIDER_APPLY_ENDPOINT` (and the other endpoints) at build time.
3. Finalise the applicant privacy notice.
4. Test that deletion requests and the 6-month auto-deletion work.

---

*Sources to verify against: GmbHG §§5a, 35a · DDG §5 · MStV §18 · DSGVO / GDPR · BDSG §§26, 38 · TDDDG §25 · MiLoG · ArbZG · NachwG · SGB IV §§7, 7a, 28a · SchwarzArbG §2a · AufenthG §§4a, 16b · AGG · ArbGG §61b · UWG · Directive (EU) 2024/825 · Directive (EU) 2024/2831 · BFSG · VSBG §36 · MarkenG.*
