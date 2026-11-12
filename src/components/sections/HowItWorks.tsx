const STEPS = [
  {
    n: '01',
    title: 'Book',
    text: 'Schedule your delivery online — add the pickup, the destination and a time that works for you.',
    art: (
      <svg viewBox="0 0 200 140" aria-hidden="true">
        <rect x="62" y="10" width="76" height="124" rx="14" fill="#141816" />
        <rect x="68" y="18" width="64" height="108" rx="9" fill="#F6F3EC" />
        <path d="M76 44h48M76 54h30" stroke="#D9D5CC" strokeWidth="5" strokeLinecap="round" />
        <rect x="76" y="66" width="48" height="26" rx="6" fill="#EAFBF1" />
        <path d="M84 80c6-8 14 6 22-2s10-4 12-6" stroke="#18B866" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="76" y="100" width="48" height="16" rx="8" fill="#2BD67B" className="hw-pulse" />
        <path d="M100 32c-4.5 0-8 3.3-8 7.4 0 5.6 8 12.6 8 12.6s8-7 8-12.6c0-4.1-3.5-7.4-8-7.4z" fill="#2BD67B" className="hw-bounce" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Collect',
    text: 'A Spur courier arrives on an electric cargo bike and picks up your parcel from your door or counter.',
    art: (
      <svg viewBox="0 0 200 140" aria-hidden="true">
        <ellipse cx="100" cy="122" rx="74" ry="8" fill="rgba(20,24,22,.08)" />
        <g className="hw-ride">
          <circle cx="58" cy="104" r="16" fill="none" stroke="#141816" strokeWidth="5" />
          <circle cx="146" cy="108" r="12" fill="none" stroke="#141816" strokeWidth="5" />
          <path d="M58 104h30l58 4M88 104 76 66M58 104l18-38M96 104l18-48" stroke="#2A302D" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="104" y="64" width="46" height="32" rx="6" fill="#2BD67B" stroke="#0E7F45" strokeWidth="2" />
          <path d="M132 76c-2-2-5.4-2.6-8-1.4-4 1.8-.8 5.2 2.8 6 3.6 1 4.4 4 1.2 5.6-2.8 1.2-6.4 0-8-2" stroke="#141816" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M76 64 88 40" stroke="#1B2124" strokeWidth="11" strokeLinecap="round" />
          <circle cx="92" cy="28" r="9" fill="#E8B996" />
          <path d="M82 27a10 10 0 0 1 20 0z" fill="#2BD67B" />
          <path d="M88 44l22 12" stroke="#23292B" strokeWidth="6" strokeLinecap="round" />
        </g>
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Deliver',
    text: 'Your package reaches its destination — and everyone can follow the ride with a live tracking link.',
    art: (
      <svg viewBox="0 0 200 140" aria-hidden="true">
        <path d="M40 128V58l60-40 60 40v70z" fill="#FFFFFF" stroke="#141816" strokeWidth="4" strokeLinejoin="round" />
        <rect x="86" y="80" width="28" height="48" rx="3" fill="#EEEAE0" stroke="#141816" strokeWidth="4" />
        <circle cx="107" cy="105" r="2.5" fill="#141816" />
        <g className="hw-drop">
          <path d="M120 96l22-11 22 11v24l-22 11-22-11z" fill="#2BD67B" stroke="#0E7F45" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M120 96l22 11 22-11M142 107v24" stroke="#0E7F45" strokeWidth="2.5" fill="none" />
        </g>
        <circle cx="160" cy="40" r="18" fill="#141816" />
        <path d="m151 40 6 6 12-12" stroke="#2BD67B" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="section how" aria-labelledby="how-title">
      <div className="container">
        <div className="section-head section-head--center" data-reveal>
          <div>
            <span className="eyebrow">How it works</span>
            <h2 id="how-title" className="h-section">Three steps. Zero hassle.</h2>
          </div>
        </div>
        <ol className="how__steps">
          <svg className="how__line" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 20 C 160 -10, 340 50, 500 20 S 840 -10, 1000 20" pathLength={1} />
          </svg>
          {STEPS.map((s, i) => (
            <li key={s.n} className="how__step" data-reveal style={{ ['--rd' as string]: `${i * 0.14}s` }}>
              <div className="how__art">{s.art}</div>
              <span className="how__num">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
