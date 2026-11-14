/**
 * Company facts and integration endpoints in one place.
 * Items in [brackets] or on example.* domains are placeholders — replace
 * them with real data before launch (see docs/legal-compliance-germany.md).
 */
export const COMPANY = {
  brand: 'ON-SPREE',
  // §5a GmbHG: a UG must always show "(haftungsbeschränkt)" in full.
  legalName: 'ON-SPREE Logistics UG (haftungsbeschränkt)',
  shortLegalName: 'ON-SPREE Logistics UG',
  email: 'contact@onspree.com',
  ridersEmail: 'riders@onspree.example',
  businessEmail: 'business@onspree.example',
  privacyEmail: 'privacy@onspree.example',
  phone: '+49 30 0000 0000',
  phoneHref: '+493000000000',
  // Required in the Impressum only (not shown in the footer).
  street: '[Street & no.]',
  city: '10115 Berlin',
  managingDirector: '[Full name of managing director]',
  registerCourt: 'Amtsgericht Charlottenburg (Berlin)',
  registerNumber: 'HRB [number]',
  vatId: 'DE[000000000]',
};

/**
 * Backends are not connected yet. Set these at build time (Vite env vars)
 * to an EU-hosted endpoint covered by a data processing agreement (AVV).
 * While unset, forms say clearly that nothing is sent.
 */
export const ENDPOINTS = {
  riderApply: import.meta.env.VITE_RIDER_APPLY_ENDPOINT as string | undefined,
  businessEnquiry: import.meta.env.VITE_BUSINESS_ENQUIRY_ENDPOINT as string | undefined,
  riderPortal: import.meta.env.VITE_RIDER_PORTAL_URL as string | undefined,
  businessPortal: import.meta.env.VITE_BUSINESS_PORTAL_URL as string | undefined,
};

/** Berlin areas we ride in — used by the coverage section and the rider form. */
export const AREAS: { district: string; kieze: string[] }[] = [
  { district: 'Mitte', kieze: ['Mitte', 'Tiergarten', 'Moabit', 'Wedding', 'Gesundbrunnen'] },
  { district: 'Friedrichshain-Kreuzberg', kieze: ['Friedrichshain', 'Kreuzberg'] },
  { district: 'Pankow', kieze: ['Prenzlauer Berg', 'Pankow', 'Weißensee'] },
  { district: 'Charlottenburg-Wilmersdorf', kieze: ['Charlottenburg', 'Wilmersdorf', 'Westend'] },
  { district: 'Neukölln', kieze: ['Neukölln', 'Britz'] },
  { district: 'Tempelhof-Schöneberg', kieze: ['Schöneberg', 'Tempelhof'] },
];
