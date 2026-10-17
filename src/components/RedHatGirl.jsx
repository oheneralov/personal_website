const SKIN = '#f2c29b';
const HOOD = '#d0202f';
const DRESS = '#2f5fa8';
const WICKER = '#b07a3c';
const INK = '#2b2b2b';

/**
 * Little Red Riding Hood in her red hood and cape, with the basket for Grandma. Decorative: it is
 * always drawn inside the aria-hidden scene. The legs carry the `figure__leg` classes, so the walk
 * swings them like the legs of the other figures.
 */
export default function RedHatGirl() {
  return (
    <svg className="figure figure--girl" viewBox="0 0 40 80" focusable="false">
      <path d="M9 22 L31 22 L36 58 L4 58 Z" fill={HOOD} />
      <g className="figure__leg figure__leg--left">
        <line x1="16" y1="50" x2="16" y2="72" stroke="#f5f0e6" strokeWidth="5" />
        <ellipse cx="17" cy="75" rx="5" ry="3" fill={INK} />
      </g>
      <g className="figure__leg figure__leg--right">
        <line x1="24" y1="50" x2="24" y2="72" stroke="#f5f0e6" strokeWidth="5" />
        <ellipse cx="25" cy="75" rx="5" ry="3" fill={INK} />
      </g>
      <path d="M13 24 L27 24 L31 54 L9 54 Z" fill={DRESS} />
      <line x1="13" y1="28" x2="9" y2="43" stroke={SKIN} strokeWidth="4" />
      <line x1="27" y1="28" x2="32" y2="40" stroke={SKIN} strokeWidth="4" />

      <path d="M28 41 Q34 32 40 41" fill="none" stroke={WICKER} strokeWidth="2" />
      <rect x="27" y="41" width="14" height="9" rx="2" fill={WICKER} />
      <rect x="29" y="40" width="10" height="2.5" fill="#f5f0e6" />

      <circle cx="20" cy="13" r="12" fill={HOOD} />
      <circle cx="20" cy="14.5" r="8.5" fill={SKIN} />
      <circle cx="17" cy="14" r="1.2" fill={INK} />
      <circle cx="23" cy="14" r="1.2" fill={INK} />
      <path d="M17 18 Q20 21 23 18" fill="none" stroke={INK} strokeWidth="1.3" />
    </svg>
  );
}
