import PropTypes from 'prop-types';
import { canSpeak, speakPolish } from '../lib/speech';

export default function SpeakButton({ text }) {
  if (!canSpeak()) {
    return null;
  }
  return (
    <button
      type="button"
      className="speak-button"
      aria-label={`Listen to "${text}"`}
      title="Listen"
      onClick={(event) => {
        // Keeps a click inside a flashcard from also flipping the card.
        event.stopPropagation();
        speakPolish(text);
      }}
    >
      <span aria-hidden="true">🔊</span>
    </button>
  );
}

SpeakButton.propTypes = {
  text: PropTypes.string.isRequired,
};
