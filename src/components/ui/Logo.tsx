export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="9" fill="#2BD67B" />
      <path
        d="M21.6 10.4C20.4 8.9 18.4 8 16.1 8c-3.3 0-5.7 1.8-5.7 4.3 0 5.7 11.8 3.3 11.8 9.3 0 2.6-2.6 4.4-6 4.4-2.4 0-4.4-.8-5.8-2.4"
        fill="none"
        stroke="#141816"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle cx="21.6" cy="10.4" r="2.3" fill="#141816" />
    </svg>
  );
}

export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <a href="#top" className={`logo logo--${tone}`} aria-label="Spur — back to top">
      <LogoMark />
      <span className="logo__word">spur</span>
      <span className="logo__tag">Berlin</span>
    </a>
  );
}
