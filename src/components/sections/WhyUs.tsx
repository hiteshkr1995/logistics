import { IconBike, IconCheck, IconEye, IconHeart, IconPin, IconShield } from '../ui/icons';

const BENEFITS = [
  { icon: <IconCheck />, title: 'A real contract', text: 'Full-time, part-time or Minijob — proper employment, not a freelance gig.' },
  { icon: <IconBike />, title: 'Company e-bike provided', text: 'Ride a maintained e-bike with an insulated cargo box, or bring your own pedelec.' },
  { icon: <IconPin />, title: 'Ride in your own Kiez', text: 'Tell us your district or postal code when you apply and ride the Berlin area you know best.' },
  { icon: <IconShield />, title: 'Safety comes first', text: 'A safety and equipment briefing before your first ride, plus gear that keeps you seen.' },
  { icon: <IconHeart />, title: 'Bilingual Berlin team', text: 'English and German spoken by a local team you can actually reach.' },
  { icon: <IconEye />, title: 'Simple onboarding', text: 'Apply online in four short steps; we check your documents once, then you’re on the road.' },
];

export default function WhyUs() {
  return (
    <section id="why" className="section why" aria-labelledby="why-title" data-nav-dark>
      <div className="why__glow" aria-hidden="true" />
      <div className="container">
        <div className="section-head" data-reveal>
          <div>
            <span className="eyebrow eyebrow--light">Why ride with ON-SPREE</span>
            <h2 id="why-title" className="h-section">
              A job that feels
              <br />
              <span className="why__accent">as good as it moves.</span>
            </h2>
          </div>
          <p className="lead why__lead">We built the rider job we’d want ourselves: fair, safe and organised by people who know Berlin.</p>
        </div>
        <ul className="why__grid">
          {BENEFITS.map((b, i) => (
            <li key={b.title} className="why__card" data-reveal style={{ ['--rd' as string]: `${(i % 3) * 0.08}s` }}>
              <span className="why__icon">{b.icon}</span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
