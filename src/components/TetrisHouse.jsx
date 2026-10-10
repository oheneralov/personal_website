import PropTypes from 'prop-types';
import { HOUSE_PARTS } from '../lib/tetris';

const STONE = '#9a9fa6';
const WALL = '#f3e2bd';
const ROOF = '#b5442f';
const BRICK = '#8a4b3a';
const WOOD = '#7a4a26';
const GLASS = '#bfe3f5';
const SMOKE = '#b8bec6';

// The parts in the order they are built, one for every part in `HOUSE_PARTS`. The chimney is drawn
// before the roof, which covers its foot.
const PART_DRAWINGS = [
  <rect x="12" y="100" width="96" height="8" fill={STONE} stroke={WOOD} strokeWidth="1.5" />,
  <rect x="16" y="46" width="88" height="54" fill={WALL} stroke={WOOD} strokeWidth="1.5" />,
  <polygon points="60,4 116,48 4,48" fill={ROOF} stroke="#8c3222" strokeWidth="1.5" />,
  <>
    <rect x="51" y="64" width="20" height="36" rx="2" fill={WOOD} />
    <circle cx="67" cy="83" r="1.6" fill="#f0c94a" />
    <g fill={GLASS} stroke={WOOD} strokeWidth="2">
      <rect x="24" y="60" width="20" height="18" />
      <rect x="78" y="60" width="20" height="18" />
    </g>
  </>,
  <>
    <rect x="82" y="12" width="12" height="28" fill={BRICK} />
    <g fill={SMOKE}>
      <circle cx="90" cy="7" r="3" />
      <circle cx="96" cy="2" r="2" />
    </g>
  </>,
];
const DRAWING_ORDER = [0, 1, 4, 2, 3];

function caption(stage) {
  if (stage === 0) {
    return 'The family is waiting for their house.';
  }
  if (stage === HOUSE_PARTS.length) {
    return 'The house is finished — the family has a home!';
  }
  return `The house: ${stage} of ${HOUSE_PARTS.length} parts built.`;
}

/** The house the learner builds for a family: `stage` of its parts stand, one per completed level. */
export default function TetrisHouse({ stage }) {
  return (
    <figure className="tetris__house">
      <svg viewBox="0 0 120 110" focusable="false" aria-hidden="true">
        <line x1="0" y1="109" x2="120" y2="109" stroke={WOOD} strokeWidth="2" />
        {DRAWING_ORDER.filter((part) => part < stage).map((part) => (
          <g key={HOUSE_PARTS[part]} className="tetris__house-part">
            {PART_DRAWINGS[part]}
          </g>
        ))}
      </svg>
      <span className="tetris__family" aria-hidden="true">
        👨‍👩‍👧
      </span>
      <figcaption>{caption(stage)}</figcaption>
    </figure>
  );
}

TetrisHouse.propTypes = {
  stage: PropTypes.number.isRequired,
};
