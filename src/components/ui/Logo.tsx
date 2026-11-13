import { useId } from 'react';

/** Brand colours, mirrored from the ON SPREE logo. */
export const BRAND = { blue: '#0A7FC7', cream: '#EFEEE0', ink: '#0F1011' };

/**
 * App icon: the original "waterline" idea — cream sky over the Spree,
 * an "O" floating above the water and an "S" below it — redrawn with a
 * soft wave, rounded corners and a thin black frame as a nod to the
 * original badge.
 */
export function LogoMark({ size = 36 }: { size?: number }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`lm-${id}`}>
          <rect x="2.5" y="2.5" width="35" height="35" rx="9" />
        </clipPath>
      </defs>
      <rect width="40" height="40" rx="11.5" fill={BRAND.ink} />
      <g clipPath={`url(#lm-${id})`}>
        <rect width="40" height="40" fill={BRAND.cream} />
        <path d="M0 21.2C5.5 18.6 9.6 23.6 15.2 21.2S25.4 18.6 31 21.2 37 23 40 21.6V40H0Z" fill={BRAND.blue} />
      </g>
      <circle cx="14.2" cy="13.4" r="4.6" fill="none" stroke={BRAND.blue} strokeWidth="3.4" />
      <path
        d="M29.6 24.6c-.9-1.2-2.5-1.9-4.2-1.9-2.4 0-4 1.2-4 2.9 0 4 8.5 2.4 8.5 6.4 0 1.8-1.8 3-4.4 3-1.9 0-3.4-.7-4.4-1.9"
        fill="none"
        stroke={BRAND.cream}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Horizontal lockup for the navbar / footer. */
export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <a href="#top" className={`logo logo--${tone}`} aria-label="ON-SPREE Logistics — home">
      <LogoMark />
      <span className="logo__word">
        <span className="logo__on">ON</span>
        <span className="logo__dash" aria-hidden="true">-</span>
        <span className="logo__spree">SPREE</span>
      </span>
      <span className="logo__tag">Logistics</span>
    </a>
  );
}

/**
 * Full badge — the modernised version of the original logo:
 * "ON" rests on the waterline, "SPREE" sits in the river, both in the
 * opposite colour of the half they occupy.
 */
export function LogoBadge({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox="0 0 640 400" role="img" aria-label="ON SPREE Logistics">
      <defs>
        <clipPath id={`lb-${id}`}>
          <rect width="640" height="400" rx="44" />
        </clipPath>
      </defs>
      <g clipPath={`url(#lb-${id})`}>
        <rect width="640" height="400" fill={BRAND.cream} />
        <path d="M0 212C90 186 160 238 250 212S410 186 500 212 600 230 640 218V400H0Z" fill={BRAND.blue} />
        <path d="M0 236C90 210 160 262 250 236S410 210 500 236 600 254 640 242" fill="none" stroke={BRAND.cream} strokeOpacity=".25" strokeWidth="3" />
      </g>
      <text x="138" y="200" fill={BRAND.blue} fontFamily="'Inter Tight', Inter, sans-serif" fontWeight="800" fontSize="132" letterSpacing="-6">
        ON
      </text>
      <text x="236" y="318" fill={BRAND.cream} fontFamily="'Inter Tight', Inter, sans-serif" fontWeight="800" fontSize="132" letterSpacing="-6">
        SPREE
      </text>
    </svg>
  );
}
