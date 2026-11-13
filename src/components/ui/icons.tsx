import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...p,
});

export const IconPlus = (p: P) => (<svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>);
export const IconMinus = (p: P) => (<svg {...base(p)}><path d="M5 12h14" /></svg>);
export const IconLocate = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="6.5" /><circle cx="12" cy="12" r="2" fill="currentColor" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></svg>
);
export const IconArrow = (p: P) => (<svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const IconArrowUpRight = (p: P) => (<svg {...base(p)}><path d="M7 17 17 7M8 7h9v9" /></svg>);
export const IconMenu = (p: P) => (<svg {...base(p)}><path d="M4 8h16M4 16h16" /></svg>);
export const IconClose = (p: P) => (<svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const IconCheck = (p: P) => (<svg {...base(p)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>);

export const IconClock = (p: P) => (<svg {...base(p)}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5M9 2.5h6" /></svg>);
export const IconBolt = (p: P) => (<svg {...base(p)}><path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12l1-8z" /></svg>);
export const IconBuilding = (p: P) => (
  <svg {...base(p)}><rect x="3.5" y="7" width="17" height="13.5" rx="2" /><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2M3.5 12.5h17M10.5 12.5v2h3v-2" /></svg>
);
export const IconRoute = (p: P) => (
  <svg {...base(p)}><circle cx="6" cy="18" r="2.5" /><path d="M8.5 18H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5" /><path d="M18 1.8c-1.7 0-3 1.2-3 2.8 0 2 3 4.4 3 4.4s3-2.4 3-4.4c0-1.6-1.3-2.8-3-2.8z" /></svg>
);
export const IconCalendar = (p: P) => (
  <svg {...base(p)}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4M9 15l2 2 4-4" /></svg>
);
export const IconLeaf = (p: P) => (<svg {...base(p)}><path d="M5 19.5C5 11 10.5 4.5 20 4.5c0 9.5-6.5 15-15 15z" /><path d="M5 19.5 13 11.5" /></svg>);
export const IconBike = (p: P) => (
  <svg {...base(p)}><circle cx="5.5" cy="16.5" r="3.5" /><circle cx="18.5" cy="16.5" r="3.5" /><path d="M5.5 16.5 9.5 9h6l3 7.5M9.5 9 8 6H6M15.5 9l1-2.5h2.5M12 16.5l-2.5-7.5" /></svg>
);
export const IconEye = (p: P) => (<svg {...base(p)}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></svg>);
export const IconSliders = (p: P) => (
  <svg {...base(p)}><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></svg>
);
export const IconPin = (p: P) => (<svg {...base(p)}><path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.4" /></svg>);
export const IconShield = (p: P) => (<svg {...base(p)}><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.3 7.5 9.5 4.3-1.2 7.5-4.9 7.5-9.5V6L12 3z" /><path d="m9 12 2 2 4-4" /></svg>);
export const IconBox = (p: P) => (
  <svg {...base(p)}><path d="M12 2.8 20.5 7v10L12 21.2 3.5 17V7L12 2.8z" /><path d="M3.5 7 12 11.2 20.5 7M12 11.2v10M7.8 4.9l8.5 4.3" /></svg>
);
export const IconPhone = (p: P) => (<svg {...base(p)}><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M10.5 18.5h3" /></svg>);
export const IconMail = (p: P) => (<svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" /></svg>);
export const IconStore = (p: P) => (
  <svg {...base(p)}><path d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0M5 11.5v8.5h14v-8.5M10 20v-5h4v5" /></svg>
);
export const IconCart = (p: P) => (<svg {...base(p)}><path d="M3 4h2.5l2.2 11h10.6L20.5 7.5H7" /><circle cx="9" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" /></svg>);
export const IconFork = (p: P) => (<svg {...base(p)}><path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.5 1-3.5 4-3.5 7.5 0 1.5 1 2.5 3.5 2.5" /></svg>);
export const IconSun = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" /></svg>
);
export const IconMoon = (p: P) => (<svg {...base(p)}><path d="M20 14.6A8.2 8.2 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6z" /></svg>);
export const IconHeart = (p: P) => (<svg {...base(p)}><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" /></svg>);

export const IconInstagram = (p: P) => (
  <svg {...base(p)}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" /></svg>
);
export const IconLinkedIn = (p: P) => (
  <svg {...base(p)}><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 10.5V16M8 7.8v.1M11.5 16v-3.2c0-1.4 1-2.3 2.2-2.3s2 .9 2 2.3V16M11.5 10.5V16" /></svg>
);
export const IconX = (p: P) => (<svg {...base(p)}><path d="M4.5 4.5 19.5 19.5M19.5 4.5l-6.2 6.9M10.7 13.1 4.5 19.5" /></svg>);
