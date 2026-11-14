import { useOpenDialog } from '../ui/DialogProvider';
import { IconArrow } from '../ui/icons';
import { EBikeIllustration } from '../ui/EBikeIllustration';
import { useReducedMotion } from '../../hooks/useMediaQuery';

export default function FinalCta() {
  const openDialog = useOpenDialog();
  const reduced = useReducedMotion();
  return (
    <section id="start" className="final" aria-labelledby="final-title">
      <div className="container">
        <div className="final__panel" data-reveal data-nav-dark>
          <div className="final__glow" aria-hidden="true" />
          <div className="final__content">
            <span className="eyebrow eyebrow--light">Start today</span>
            <h2 id="final-title">Ready to Move Something?</h2>
            <p>Let us take care of the delivery while you focus on what matters.</p>
            <div className="final__ctas">
              <a href="#/join" className="btn btn--primary btn--lg">
                Join as a Rider <IconArrow />
              </a>
              <button type="button" className="btn btn--glass-dark btn--lg" onClick={() => openDialog('team')}>
                Talk to our team
              </button>
            </div>
          </div>
          <EBikeIllustration className="final__bike" animate={!reduced} />
        </div>
      </div>
    </section>
  );
}
