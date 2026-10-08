import { useState } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar';
import SpeakButton from './SpeakButton';
import { wordType } from '../propTypes';

export default function Flashcards({ words, knownWords, onMark }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const word = words[index];
  const isKnown = knownWords.includes(word.pl);

  const goTo = (nextIndex) => {
    setIndex((nextIndex + words.length) % words.length);
    setFlipped(false);
  };

  const mark = (known) => {
    onMark(word.pl, known);
    goTo(index + 1);
  };

  return (
    <section className="flashcards">
      <h2>Flashcards</h2>
      <ProgressBar value={knownWords.length} max={words.length} label="Words you know" />

      <div className="flashcard-wrap">
        <button
          type="button"
          className={`flashcard${flipped ? ' flashcard--flipped' : ''}`}
          onClick={() => setFlipped((current) => !current)}
          aria-label={flipped ? `${word.en}. Show Polish` : `${word.pl}. Show translation`}
        >
          <span className="flashcard__side">{flipped ? 'English' : 'Polish'}</span>
          <span className="flashcard__text" lang={flipped ? 'en' : 'pl'}>
            {flipped ? word.en : word.pl}
          </span>
          <span className="flashcard__hint">
            {isKnown ? '✓ You know this word · ' : ''}Tap to flip
          </span>
        </button>
        <div className="flashcard-wrap__speak">
          <SpeakButton text={word.pl} />
        </div>
      </div>

      <p className="flashcards__position">
        Card {index + 1} of {words.length}
      </p>

      <div className="button-row">
        <button type="button" className="button button--ghost" onClick={() => goTo(index - 1)}>
          ← Previous
        </button>
        <button type="button" className="button button--secondary" onClick={() => mark(false)}>
          Still learning
        </button>
        <button type="button" className="button" onClick={() => mark(true)}>
          I know it
        </button>
      </div>
    </section>
  );
}

Flashcards.propTypes = {
  words: PropTypes.arrayOf(wordType).isRequired,
  knownWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  onMark: PropTypes.func.isRequired,
};
