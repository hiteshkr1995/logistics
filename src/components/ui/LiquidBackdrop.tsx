/**
 * Slow-moving, blurred colour blobs placed behind a section so the
 * liquid-glass cards on top have something to refract. Purely decorative.
 */
export function LiquidBackdrop({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <div className={`liquid liquid--${tone}`} aria-hidden="true">
      <span className="liquid__blob liquid__blob--a" />
      <span className="liquid__blob liquid__blob--b" />
      <span className="liquid__blob liquid__blob--c" />
    </div>
  );
}
