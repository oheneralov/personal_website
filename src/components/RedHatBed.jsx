import PropTypes from 'prop-types';

const WOOD = '#7a4a26';
const SHEET = '#fbf7ef';
const QUILT = '#c0504d';

/**
 * Grandma's bed with whoever lies in it (`children`) on the mattress, head on the pillow and the
 * quilt pulled over the rest. The bed is drawn rather than an emoji, so that the sleeper lies
 * exactly on it. Decorative: it is always drawn inside the aria-hidden scene.
 */
export default function RedHatBed({ speaking = false, children }) {
  return (
    <span className="red-hat__bed">
      <svg viewBox="0 0 160 90" focusable="false">
        <rect x="2" y="8" width="11" height="80" rx="3" fill={WOOD} />
        <rect x="148" y="38" width="10" height="50" rx="3" fill={WOOD} />
        <rect x="8" y="58" width="146" height="14" fill={WOOD} />
        <rect x="12" y="46" width="138" height="14" rx="3" fill={SHEET} />
        <rect x="14" y="36" width="32" height="14" rx="7" fill={SHEET} stroke="#ddd3c0" />
      </svg>
      <span className={`red-hat__bed-sleeper${speaking ? ' red-hat__speaking' : ''}`}>
        {children}
      </span>
      <svg className="red-hat__bed-quilt" viewBox="0 0 160 90" focusable="false">
        <path d="M44 38 Q96 30 150 40 L150 64 L44 64 Z" fill={QUILT} />
        <path d="M60 37 L60 64 M84 34 L84 64 M108 34 L108 64 M132 37 L132 64" stroke="#a33e3b" />
      </svg>
    </span>
  );
}

RedHatBed.propTypes = {
  speaking: PropTypes.bool,
  children: PropTypes.node.isRequired,
};
