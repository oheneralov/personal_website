import PropTypes from 'prop-types';

const FUR = '#26262b';
const BELLY = '#45454d';

/**
 * The black wolf, side on and facing left (towards the girl), on all four legs. With `nightcap` he
 * wears Grandma's cap. Decorative: it is always drawn inside the aria-hidden scene.
 */
export default function RedHatWolf({ nightcap = false }) {
  return (
    <svg className="figure figure--wolf" viewBox="0 0 100 62" focusable="false">
      <path d="M80 26 Q99 16 95 3 Q90 18 76 21 Z" fill={FUR} />
      <g stroke={FUR} strokeWidth="6" strokeLinecap="round">
        <line x1="72" y1="34" x2="74" y2="58" />
        <line x1="64" y1="36" x2="62" y2="58" />
        <line x1="40" y1="36" x2="38" y2="58" />
        <line x1="32" y1="34" x2="30" y2="58" />
      </g>
      <ellipse cx="54" cy="29" rx="27" ry="12" fill={FUR} />
      <ellipse cx="52" cy="35" rx="18" ry="5" fill={BELLY} />

      <path d="M30 22 L40 26 L36 36 L26 30 Z" fill={FUR} />
      <path d="M19 10 L23 -1 L28 10 Z" fill={FUR} />
      <path d="M26 11 L31 1 L34 13 Z" fill={FUR} />
      <ellipse cx="25" cy="20" rx="11" ry="9.5" fill={FUR} />
      <path d="M16 15 L0 21 L2 25 L16 27 Z" fill={FUR} />
      <circle cx="1.5" cy="22" r="2" fill="#000000" />
      <path d="M3 25 L15 26" stroke="#d9d9d9" strokeWidth="1" />
      <path d="M6 25.2 L7 28 L8 25.4 Z" fill="#ffffff" />
      <circle cx="21" cy="16" r="2" fill="#f4d03f" />
      <circle cx="21" cy="16" r="0.9" fill="#000000" />

      {nightcap && (
        <>
          <path d="M14 13 Q24 -2 36 12 Q26 8 14 13 Z" fill="#ffffff" stroke="#c9c9c9" />
          <circle cx="36" cy="12" r="2.6" fill="#ffffff" stroke="#c9c9c9" />
        </>
      )}
    </svg>
  );
}

RedHatWolf.propTypes = {
  nightcap: PropTypes.bool,
};
