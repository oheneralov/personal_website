const WALL = '#f3e2bd';
const ROOF = '#b5442f';
const WOOD = '#7a4a26';
const GLASS = '#bfe3f5';

/** The boy's house: decorative scenery behind the dragon and at the end of the journey. */
export default function GameHouse() {
  return (
    <svg className="game__house" viewBox="0 0 120 110" focusable="false">
      <rect x="82" y="12" width="12" height="28" fill="#8a4b3a" />
      <rect x="16" y="46" width="88" height="62" fill={WALL} stroke={WOOD} strokeWidth="1.5" />
      <polygon points="60,4 116,48 4,48" fill={ROOF} stroke="#8c3222" strokeWidth="1.5" />

      <rect x="51" y="68" width="20" height="40" rx="2" fill={WOOD} />
      <circle cx="67" cy="89" r="1.6" fill="#f0c94a" />

      <g fill={GLASS} stroke={WOOD} strokeWidth="2">
        <rect x="24" y="60" width="20" height="18" />
        <rect x="78" y="60" width="20" height="18" />
      </g>
      <g stroke={WOOD} strokeWidth="1.5">
        <line x1="34" y1="60" x2="34" y2="78" />
        <line x1="24" y1="69" x2="44" y2="69" />
        <line x1="88" y1="60" x2="88" y2="78" />
        <line x1="78" y1="69" x2="98" y2="69" />
      </g>
    </svg>
  );
}
