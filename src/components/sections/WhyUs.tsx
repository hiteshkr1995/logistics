import { IconBike, IconEye, IconHeart, IconLeaf, IconShield, IconSliders } from '../ui/icons';

const BENEFITS = [
  { icon: <IconShield />, title: 'Fast & reliable', text: 'Couriers who know the Kiez, on routes planned around how Berlin really moves.' },
  { icon: <IconBike />, title: 'Electric-bike delivery', text: 'E-cargo bikes slip past traffic jams and stop right at the door — where vans can’t.' },
  { icon: <IconLeaf />, title: 'Eco-conscious logistics', text: 'Neighbourhood micro-hubs shorten every trip and cut emissions at the source.' },
  { icon: <IconEye />, title: 'Transparent experience', text: 'Live tracking links and clear status updates from pickup to doorstep.' },
  { icon: <IconSliders />, title: 'Flexible for business', text: 'One-off parcels or daily routes — plans that grow with your business.' },
  { icon: <IconHeart />, title: 'Local Berlin network', text: 'Built in Berlin, for Berlin, with hubs in the neighbourhoods we deliver to.' },
];

export default function WhyUs() {
  return (
    <section id="why" className="section why" aria-labelledby="why-title">
      <div className="why__glow" aria-hidden="true" />
      <div className="container">
        <div className="section-head" data-reveal>
          <div>
            <span className="eyebrow eyebrow--light">Why ON-SPREE</span>
            <h2 id="why-title" className="h-section">
              Delivery that feels
              <br />
              <span className="why__accent">as good as it moves.</span>
            </h2>
          </div>
          <p className="lead why__lead">Quiet, clean and quick — we built the delivery service we wanted for our own city.</p>
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
