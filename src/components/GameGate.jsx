import PropTypes from 'prop-types';

const STONE = '#c4beb1';
const STONE_DARK = '#a9a294';
const WOOD = '#7a4a26';

// x positions of the battlements along the top of the towers and the wall between them.
const TOWER_MERLONS = [0, 11, 22, 90, 101, 112];
const WALL_MERLONS = [34, 48, 62, 76];

/**
 * The town gate the guard stands in front of: two towers, a wall and an arched doorway whose
 * wooden doors swing `open` once the guard lets the boy through. Decorative scenery.
 */
export default function GameGate({ open }) {
  return (
    <svg className="game__gate" viewBox="0 0 120 120" focusable="false">
      <g fill={STONE_DARK}>
        {TOWER_MERLONS.map((x) => (
          <rect key={x} x={x} y="10" width="8" height="10" />
        ))}
      </g>
      <g fill={STONE}>
        {WALL_MERLONS.map((x) => (
          <rect key={x} x={x} y="32" width="9" height="9" />
        ))}
        <rect x="30" y="40" width="60" height="80" />
      </g>
      <g fill={STONE_DARK}>
        <rect x="0" y="19" width="30" height="101" />
        <rect x="90" y="19" width="30" height="101" />
      </g>
      <g fill="#2b2b2b">
        <rect x="12" y="40" width="6" height="14" rx="3" />
        <rect x="102" y="40" width="6" height="14" rx="3" />
      </g>

      {/* The doorway: dark when open, with the door leaves folded back against the arch. */}
      <path d="M42 120 V80 A18 18 0 0 1 78 80 V120 Z" fill="#33302b" />
      {open ? (
        <g fill={WOOD}>
          <rect x="42" y="74" width="5" height="46" />
          <rect x="73" y="74" width="5" height="46" />
        </g>
      ) : (
        <>
          <path d="M42 120 V80 A18 18 0 0 1 78 80 V120 Z" fill={WOOD} />
          <g stroke="#5a3519" strokeWidth="1.5">
            <line x1="60" y1="62" x2="60" y2="120" />
            <line x1="51" y1="65" x2="51" y2="120" />
            <line x1="69" y1="65" x2="69" y2="120" />
          </g>
        </>
      )}
    </svg>
  );
}

GameGate.propTypes = {
  open: PropTypes.bool.isRequired,
};
