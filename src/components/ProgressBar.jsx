import PropTypes from 'prop-types';

export default function ProgressBar({ value, max, label }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="progress">
      <div
        className="progress__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress__text">
        {value} / {max}
      </span>
    </div>
  );
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};
