/**
 * Side-view e-bike sprite (forward = +x, ground = y 0, units ≈ px).
 * It is sheared onto the isometric vertical plane of travel by the caller,
 * so one drawing works for every direction.
 *  - cargo: "long-john" e-cargo bike with a branded front box
 *  - rack:  e-bike with a branded insulated box on the rear rack
 */
export function BikeSprite({ v, rider = true }: { v: 'cargo' | 'rack'; rider?: boolean }) {
  if (v === 'cargo') {
    return (
      <g className="bk">
        <circle cx={-9} cy={-4} r={4} className="bk-wheel" />
        <circle cx={10} cy={-3.2} r={3.2} className="bk-wheel" />
        <path d="M-9 -4 L-3.5 -4 L0 -4 L10 -3.2 M-3.5 -4 L-5.6 -11.5 M-9 -4 L-5.6 -11.5 M-1 -4 L3.6 -15.5" className="bk-frame" />
        <rect x={-4.8} y={-9.4} width={3.6} height={1.8} rx={0.7} className="bk-batt" transform="rotate(-62 -3 -8.5)" />
        <rect x={0.8} y={-11.2} width={10.4} height={7} rx={1.2} className="bk-box" />
        <rect x={0.8} y={-11.2} width={10.4} height={1.6} rx={0.8} className="bk-box-lid" />
        <path d="M7.6 -8.3c-.5-.5-1.3-.7-2-.4-1 .4-.2 1.3.7 1.5.9.3 1.1 1 .3 1.4-.7.3-1.6 0-2-.5" className="bk-logo" />
        <path d="M2.4 -15.6 L5 -16.2" className="bk-frame" />
        {rider && (
          <g>
            <path d="M-5.4 -12 L-2.2 -7.6 L-1.2 -4.6" className="bk-leg" />
            <path d="M-5.4 -12.2 L-2.6 -18.6" className="bk-torso" />
            <path d="M-2.6 -18 L3 -15.8" className="bk-arm" />
            <circle cx={-1.6} cy={-21.2} r={2.4} className="bk-skin" />
            <path d="M-4.1 -21.4 a2.6 2.6 0 0 1 5.2 0 z" className="bk-helmet" />
          </g>
        )}
      </g>
    );
  }
  return (
    <g className="bk">
      <circle cx={-7.5} cy={-4} r={4} className="bk-wheel" />
      <circle cx={7.5} cy={-4} r={4} className="bk-wheel" />
      <path d="M-7.5 -4 L-1.5 -4 L4.5 -11 L-3.5 -11 L-1.5 -4 M-3.5 -11 L-4.3 -12.6 M4.5 -11 L7.5 -4 M4.5 -11 L5.4 -14.2 L7.2 -14.6 M-7.5 -4 L-4.3 -10.4" className="bk-frame" />
      <rect x={-0.4} y={-10.2} width={4} height={1.8} rx={0.7} className="bk-batt" transform="rotate(-49 1.6 -9.3)" />
      <rect x={-12.6} y={-18.4} width={8} height={7.6} rx={1.2} className="bk-box" />
      <rect x={-12.6} y={-18.4} width={8} height={1.6} rx={0.8} className="bk-box-lid" />
      <path d="M-6.8 -15c-.5-.5-1.3-.7-2-.4-1 .4-.2 1.3.7 1.5.9.3 1.1 1 .3 1.4-.7.3-1.6 0-2-.5" className="bk-logo" />
      {rider && (
        <g>
          <path d="M-3.6 -13 L0 -8.4 L-0.6 -4.4" className="bk-leg" />
          <path d="M-3.6 -13.2 L-0.6 -19.4" className="bk-torso" />
          <path d="M-0.6 -18.8 L5.2 -14.6" className="bk-arm" />
          <circle cx={0.4} cy={-22} r={2.4} className="bk-skin" />
          <path d="M-2.1 -22.2 a2.6 2.6 0 0 1 5.2 0 z" className="bk-helmet" />
        </g>
      )}
    </g>
  );
}
