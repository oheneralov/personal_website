import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ProgressBar from './ProgressBar';
import { ANSWER_RESULT, buildQuiz, evaluateAnswer } from '../lib/quiz';
import { PASS_PERCENT, toPercent } from '../lib/progressStore';
import { unitType } from '../propTypes';

const POLISH_LETTERS = ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'];

const FEEDBACK = {
  [ANSWER_RESULT.CORRECT]: 'Correct!',
  [ANSWER_RESULT.CLOSE]: 'Correct — but watch the Polish letters.',
  [ANSWER_RESULT.WRONG]: 'Not quite.',
};

function optionClass(option, question, response, answered) {
  if (!answered) {
    return 'option';
  }
  if (option === question.answer) {
    return 'option option--correct';
  }
  return option === response ? 'option option--wrong' : 'option';
}

export default function Quiz({ unit, onComplete, rng = Math.random }) {
  const [questions, setQuestions] = useState(() => buildQuiz(unit, rng));
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const inputRef = useRef(null);

  const total = questions.length;
  const answered = result !== null;

  const submit = (value) => {
    const outcome = evaluateAnswer(questions[index], value);
    setResponse(value);
    setResult(outcome);
    if (outcome !== ANSWER_RESULT.WRONG) {
      setScore((current) => current + 1);
    }
  };

  const next = () => {
    if (index + 1 === total) {
      onComplete(score, total);
    }
    setIndex(index + 1);
    setResponse('');
    setResult(null);
  };

  const restart = () => {
    setQuestions(buildQuiz(unit, rng));
    setIndex(0);
    setResponse('');
    setResult(null);
    setScore(0);
  };

  const insertLetter = (letter) => {
    setResponse((current) => current + letter);
    inputRef.current?.focus();
  };

  if (index >= total) {
    const percent = toPercent(score, total);
    const passed = percent >= PASS_PERCENT;
    return (
      <section className="quiz quiz--finished">
        <h2>{passed ? 'Brawo! Unit passed' : 'Keep practising'}</h2>
        <p className="quiz__score">{percent}%</p>
        <p>
          You answered {score} of {total} questions correctly.{' '}
          {passed
            ? 'This unit is now marked as completed.'
            : `You need ${PASS_PERCENT}% to complete the unit.`}
        </p>
        <button type="button" className="button" onClick={restart}>
          Try again
        </button>
      </section>
    );
  }

  const question = questions[index];
  const inputId = `quiz-answer-${question.id}`;

  return (
    <section className="quiz">
      <h2>Quiz</h2>
      <ProgressBar value={index} max={total} label="Quiz progress" />

      <p className="quiz__instruction">{question.instruction}</p>
      <p className="quiz__translation" lang="tl">
        {question.instructionTl}
      </p>
      <p className="quiz__prompt">{question.prompt}</p>
      {question.promptTl && (
        <p className="quiz__translation" lang="tl">
          {question.promptTl}
        </p>
      )}
      {question.hint && <p className="quiz__hint">{question.hint}</p>}
      {question.hintTl && (
        <p className="quiz__translation" lang="tl">
          {question.hintTl}
        </p>
      )}

      {question.kind === 'choice' ? (
        <div className="options">
          {question.options.map((option) => (
            <button
              key={option}
              type="button"
              className={optionClass(option, question, response, answered)}
              disabled={answered}
              onClick={() => submit(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <form
          className="typing"
          onSubmit={(event) => {
            event.preventDefault();
            if (!answered && response.trim() !== '') {
              submit(response);
            }
          }}
        >
          <label htmlFor={inputId}>
            Your answer
            <input
              id={inputId}
              ref={inputRef}
              type="text"
              lang="pl"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              value={response}
              readOnly={answered}
              onChange={(event) => setResponse(event.target.value)}
            />
          </label>
          {!answered && (
            <>
              <div className="letters" aria-label="Polish letters">
                {POLISH_LETTERS.map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    className="letters__key"
                    onClick={() => insertLetter(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>
              <button type="submit" className="button" disabled={response.trim() === ''}>
                Check
              </button>
            </>
          )}
        </form>
      )}

      <div aria-live="polite">
        {answered && (
          <div className={`feedback feedback--${result}`}>
            <p>
              <strong>{FEEDBACK[result]}</strong>
              {result !== ANSWER_RESULT.CORRECT && (
                <>
                  {' '}
                  Correct answer: <span lang="pl">{question.answer}</span>
                </>
              )}
            </p>
            <button type="button" className="button" onClick={next}>
              {index + 1 === total ? 'See result' : 'Next question'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

Quiz.propTypes = {
  unit: unitType.isRequired,
  onComplete: PropTypes.func.isRequired,
  rng: PropTypes.func,
};
