const FUR = '#8b5a2b';
const FUR_LIGHT = '#c9a071';
const INK = '#2b2b2b';

/** A whole sitting bear (the emoji is only a head). Decorative, like the rest of the scene. */
export default function GameBear() {
  return (
    <svg className="game__bear" viewBox="0 0 80 82" focusable="false">
      <g fill={FUR}>
        <circle cx="26" cy="9" r="7" />
        <circle cx="54" cy="9" r="7" />
        <ellipse cx="40" cy="54" rx="25" ry="24" />
        <ellipse cx="15" cy="50" rx="7" ry="13" transform="rotate(18 15 50)" />
        <ellipse cx="65" cy="50" rx="7" ry="13" transform="rotate(-18 65 50)" />
        <ellipse cx="24" cy="75" rx="11" ry="7" />
        <ellipse cx="56" cy="75" rx="11" ry="7" />
        <circle cx="40" cy="23" r="18" />
      </g>
      <g fill={FUR_LIGHT}>
        <circle cx="26" cy="9" r="3.5" />
        <circle cx="54" cy="9" r="3.5" />
        <ellipse cx="40" cy="58" rx="14" ry="15" />
        <ellipse cx="24" cy="76" rx="5" ry="3.5" />
        <ellipse cx="56" cy="76" rx="5" ry="3.5" />
        <ellipse cx="40" cy="29" rx="9" ry="7" />
      </g>
      <g fill={INK}>
        <circle cx="33" cy="19" r="1.9" />
        <circle cx="47" cy="19" r="1.9" />
        <ellipse cx="40" cy="25.5" rx="3.2" ry="2.3" />
      </g>
      <path d="M36 31 Q40 34 44 31" fill="none" stroke={INK} strokeWidth="1.4" />
    </svg>
  );
}
