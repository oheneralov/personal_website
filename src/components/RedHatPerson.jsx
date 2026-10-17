import PropTypes from 'prop-types';

const SKIN = '#f2c29b';
const STOCKINGS = '#f5f0e6';
const INK = '#2b2b2b';

// Mum and Grandma wear long skirts; the hunter wears trousers, a hat and a beard.
const VARIANTS = {
  mother: { top: '#7b4fa0', skirt: '#9c6fc4', hair: '#6b4423' },
  grandma: { top: '#5b7fa8', skirt: '#3f5f86', hair: '#d4d4d4' },
  hunter: { top: '#4f7a4a', trousers: '#5a4632', hair: '#6b4423' },
};

function Legs({ skirt = null, trousers = null }) {
  if (skirt) {
    return (
      <>
        <line x1="16" y1="58" x2="16" y2="72" stroke={STOCKINGS} strokeWidth="4" />
        <line x1="24" y1="58" x2="24" y2="72" stroke={STOCKINGS} strokeWidth="4" />
        <ellipse cx="16" cy="75" rx="4.5" ry="3" fill={INK} />
        <ellipse cx="24" cy="75" rx="4.5" ry="3" fill={INK} />
        <path d="M12 40 L28 40 L34 62 L6 62 Z" fill={skirt} />
      </>
    );
  }
  return (
    <>
      <line x1="16" y1="46" x2="16" y2="72" stroke={trousers} strokeWidth="6" />
      <line x1="24" y1="46" x2="24" y2="72" stroke={trousers} strokeWidth="6" />
      <ellipse cx="17" cy="75" rx="5" ry="3" fill={INK} />
      <ellipse cx="25" cy="75" rx="5" ry="3" fill={INK} />
    </>
  );
}

Legs.propTypes = {
  skirt: PropTypes.string,
  trousers: PropTypes.string,
};

/**
 * A grown-up of the tale drawn full-body in SVG (emoji people are only heads). Decorative: it is
 * always drawn inside the aria-hidden scene.
 */
export default function RedHatPerson({ variant }) {
  const { top, skirt, trousers, hair } = VARIANTS[variant];

  return (
    <svg className={`figure figure--${variant}`} viewBox="0 0 40 80" focusable="false">
      {/* Mum's long hair falls behind her shoulders. */}
      {variant === 'mother' && <path d="M10 12 Q20 -1 30 12 L32 30 L8 30 Z" fill={hair} />}
      <Legs skirt={skirt} trousers={trousers} />
      <rect x="11" y="23" width="18" height="22" rx="6" fill={top} />
      <line x1="12" y1="27" x2="8" y2="43" stroke={top} strokeWidth="5" />
      <line x1="28" y1="27" x2="32" y2="43" stroke={top} strokeWidth="5" />
      <circle cx="8" cy="45" r="3" fill={SKIN} />
      <circle cx="32" cy="45" r="3" fill={SKIN} />

      <circle cx="20" cy="13" r="9.5" fill={SKIN} />
      {variant === 'mother' && <path d="M10.5 12 Q20 1 29.5 12 Q20 7 10.5 12 Z" fill={hair} />}
      {variant === 'grandma' && (
        <>
          <circle cx="20" cy="2.5" r="4" fill={hair} />
          <path d="M10.5 12 Q20 1 29.5 12 Q20 7 10.5 12 Z" fill={hair} />
          <g fill="none" stroke={INK} strokeWidth="1">
            <circle cx="16" cy="14" r="2.6" />
            <circle cx="24" cy="14" r="2.6" />
            <line x1="18.6" y1="14" x2="21.4" y2="14" />
          </g>
        </>
      )}
      {variant === 'hunter' && (
        <>
          <path d="M12 16 Q12 27 20 27 Q28 27 28 16 Q20 22 12 16 Z" fill={hair} />
          <rect x="7" y="6" width="26" height="3" rx="1.5" fill="#3e5a35" />
          <path d="M12 6 Q12 -1 20 -1 Q28 -1 28 6 Z" fill="#3e5a35" />
          <line x1="26" y1="3" x2="33" y2="-4" stroke="#c0392b" strokeWidth="1.6" />
        </>
      )}
      <circle cx="16" cy="14" r="1.2" fill={INK} />
      <circle cx="24" cy="14" r="1.2" fill={INK} />
      {variant !== 'hunter' && (
        <path d="M17 18 Q20 21 23 18" fill="none" stroke={INK} strokeWidth="1.3" />
      )}
    </svg>
  );
}

RedHatPerson.propTypes = {
  variant: PropTypes.oneOf(Object.keys(VARIANTS)).isRequired,
};
