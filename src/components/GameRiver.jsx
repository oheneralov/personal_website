import PropTypes from 'prop-types';

// Ripple lines get longer towards the viewer, like the river itself.
const RIPPLES = [
  'M62 5 q5 -2.5 10 0 t10 0',
  'M100 9 q5 -2.5 10 0 t10 0',
  'M48 16 q7 -3 14 0 t14 0',
  'M104 20 q7 -3 14 0 t14 0',
  'M28 29 q9 -3.5 18 0 t18 0',
  'M92 31 q9 -3.5 18 0 t18 0',
  'M140 27 q7 -3 14 0 t14 0',
  'M56 38 q9 -3.5 18 0 t18 0',
];

/**
 * A wide river flowing across the field towards the viewer, with a boat waiting on the near
 * bank. Decorative, like the rest of the scene. The boat rows over once the river is `crossed`.
 */
export default function GameRiver({ crossed }) {
  return (
    <span className="game__river">
      <svg viewBox="0 0 200 42" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="game-river-water" x1="0" y1="0" x2="0" y2="1">
            <stop className="game__river-far" offset="0" />
            <stop className="game__river-near" offset="1" />
          </linearGradient>
        </defs>
        <path
          className="game__river-bank"
          d="M52 0 C44 14 22 28 0 42 L200 42 C180 28 158 14 150 0 Z"
        />
        <path
          fill="url(#game-river-water)"
          d="M58 0 C50 14 30 28 10 42 L190 42 C172 28 152 14 144 0 Z"
        />
        <g className="game__river-ripples">
          {RIPPLES.map((ripple) => (
            <path key={ripple} d={ripple} />
          ))}
        </g>
      </svg>
      <span className={`game__boat${crossed ? ' game__boat--crossed' : ''}`}>🛶</span>
    </span>
  );
}

GameRiver.propTypes = {
  crossed: PropTypes.bool.isRequired,
};
