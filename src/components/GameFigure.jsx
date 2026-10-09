import PropTypes from 'prop-types';

const SKIN = '#f2c29b';
const ANGRY_SKIN = '#f0a58a';
const INK = '#2b2b2b';

const VARIANTS = {
  boy: { shirt: '#e23d4f', trousers: '#2f5fa8', hair: '#6b4423' },
  man: { shirt: '#4f7a4a', trousers: '#4a4038', hair: '#3a2a1c' },
  guard: { shirt: '#b3262e', trousers: '#1f2c4d', hair: null },
};

const MOUTHS = {
  happy: 'M16 19 Q20 23 24 19',
  angry: 'M16 21 Q20 17.5 24 21',
  neutral: 'M17 20 L23 20',
};

function mouthFor(variant, angry) {
  if (angry) {
    return MOUTHS.angry;
  }
  return variant === 'guard' ? MOUTHS.neutral : MOUTHS.happy;
}

/**
 * A small full-body person drawn in SVG (emoji people are only heads). Decorative: it is always
 * rendered inside the aria-hidden game scene. Limbs carry class names so CSS can swing them.
 */
export default function GameFigure({ variant, angry = false }) {
  const { shirt, trousers, hair } = VARIANTS[variant];
  const skin = angry ? ANGRY_SKIN : SKIN;

  return (
    <svg className={`figure figure--${variant}`} viewBox="0 0 40 80" focusable="false">
      <g className="figure__leg figure__leg--left">
        <line x1="16" y1="48" x2="16" y2="72" stroke={trousers} strokeWidth="6" />
        <ellipse cx="17" cy="75" rx="5" ry="3" fill={INK} />
      </g>
      <g className="figure__leg figure__leg--right">
        <line x1="24" y1="48" x2="24" y2="72" stroke={trousers} strokeWidth="6" />
        <ellipse cx="25" cy="75" rx="5" ry="3" fill={INK} />
      </g>

      {angry ? (
        <>
          {/* One hand on the hip, the other shaking a fist. */}
          <polyline
            points="11,28 4,36 11,43"
            fill="none"
            stroke={shirt}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g className="figure__fist">
            <line x1="29" y1="28" x2="36" y2="15" stroke={shirt} strokeWidth="5" />
            <circle cx="36" cy="12" r="3.5" fill={skin} />
          </g>
        </>
      ) : (
        <>
          <g className="figure__arm figure__arm--left">
            <line x1="11" y1="28" x2="7" y2="44" stroke={shirt} strokeWidth="5" />
            <circle cx="7" cy="46" r="3" fill={skin} />
          </g>
          <g className="figure__arm figure__arm--right">
            <line x1="29" y1="28" x2="33" y2="44" stroke={shirt} strokeWidth="5" />
            <circle cx="33" cy="46" r="3" fill={skin} />
          </g>
        </>
      )}

      <rect x="11" y="24" width="18" height="27" rx="6" fill={shirt} />

      <circle cx="20" cy="13" r="10" fill={skin} />
      {hair ? (
        <path d="M10 13 A10 10 0 0 1 30 13 Q20 4 10 13 Z" fill={hair} />
      ) : (
        <>
          <rect x="10" y="1" width="20" height="8" rx="3" fill={trousers} />
          <line x1="9" y1="9" x2="31" y2="9" stroke={INK} strokeWidth="2" />
        </>
      )}
      <circle cx="16" cy="15" r="1.3" fill={INK} />
      <circle cx="24" cy="15" r="1.3" fill={INK} />
      {angry && (
        <g stroke={INK} strokeWidth="1.5">
          <line x1="13" y1="10.5" x2="18" y2="12.5" />
          <line x1="27" y1="10.5" x2="22" y2="12.5" />
        </g>
      )}
      <path d={mouthFor(variant, angry)} fill="none" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

GameFigure.propTypes = {
  variant: PropTypes.oneOf(Object.keys(VARIANTS)).isRequired,
  angry: PropTypes.bool,
};
