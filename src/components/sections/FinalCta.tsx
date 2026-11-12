import { useOpenDialog } from '../ui/DialogProvider';
import { IconArrow } from '../ui/icons';
import { BikeSprite } from '../map/BikeSprite';
import { useReducedMotion } from '../../hooks/useMediaQuery';

const PATH = 'M-60 340 C 180 340, 220 220, 420 220 S 700 340, 880 260 S 1120 100, 1290 120';

export default function FinalCta() {
  const openDialog = useOpenDialog();
  const reduced = useReducedMotion();
  return (
    <section className="final" aria-labelledby="final-title">
      <div className="container">
        <div className="final__panel" data-reveal>
          <svg className="final__routes" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path id="final-path" d={PATH} className="final__route" />
            <path d="M-40 120 C 200 140, 300 40, 520 70 S 900 190, 1260 160" className="final__route-2" />
            <g transform={reduced ? 'translate(880 260)' : undefined}>
              {!reduced && (
                <animateMotion dur="16s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#final-path" />
                </animateMotion>
              )}
              <ellipse rx="46" ry="14" fill="rgba(10, 127, 199,.35)" />
              <g transform="scale(3.6)">
                <BikeSprite v="cargo" />
              </g>
            </g>
          </svg>
          <div className="final__content">
            <span className="eyebrow eyebrow--light">Start today</span>
            <h2 id="final-title">Ready to Move Something?</h2>
            <p>Let us take care of the delivery while you focus on what matters.</p>
            <button type="button" className="btn btn--primary btn--lg" onClick={() => openDialog('booking')}>
              Get Started <IconArrow />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
