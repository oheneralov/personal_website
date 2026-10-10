import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SpeakButton from './SpeakButton';
import TetrisBaskets from './TetrisBaskets';
import TetrisBoard from './TetrisBoard';
import TetrisHouse from './TetrisHouse';
import TETRIS_WORDS from '../data/tetris';
import playFailureSound from '../lib/sound';
import {
  BASE_FALL_MS,
  BASKET_COUNT,
  CORRECT_WORD_SCORE,
  HOUSE_PARTS,
  LEVEL_UP_MS,
  STREAK_FOR_BONUS,
  TETRIS_STATUS,
  WORD_RESULT,
  boardWithPiece,
  createTetris,
  dropIntoBasket,
  fallDelay,
  hardDrop,
  houseStage,
  movePiece,
  startNextLevel,
  startTetris,
  tetrisLevel,
  tick,
  togglePause,
} from '../lib/tetris';
import { wordType } from '../propTypes';

const moveLeft = (game) => movePiece(game, -1);
const moveRight = (game) => movePiece(game, 1);

const KEY_TRANSITIONS = {
  ArrowLeft: moveLeft,
  ArrowRight: moveRight,
  ArrowDown: tick,
  ' ': hardDrop,
  p: togglePause,
  P: togglePause,
};

const CONTROLS = [
  { label: 'Move left', symbol: '←', transition: moveLeft },
  { label: 'Move right', symbol: '→', transition: moveRight },
  { label: 'Move down', symbol: '↓', transition: tick },
  { label: 'Drop', symbol: '⤓', transition: hardDrop },
];

const REVIEW_NOTES = {
  [WORD_RESULT.CORRECT]: 'right basket',
  [WORD_RESULT.WRONG]: 'wrong basket',
};

export default function Tetris({
  words = TETRIS_WORDS,
  rng = Math.random,
  baseFallMs = BASE_FALL_MS,
  levelUpMs = LEVEL_UP_MS,
  onWrongBasket = playFailureSound,
}) {
  const [game, setGame] = useState(() => createTetris(words, rng));
  // The timer and the key handler outlive a render, so they read the latest game from here.
  const gameRef = useRef(game);

  const act = useCallback(
    (transition) => {
      const before = gameRef.current;
      gameRef.current = transition(before, rng);
      if (gameRef.current.wrongCount > before.wrongCount) {
        onWrongBasket();
      }
      setGame(gameRef.current);
    },
    [rng, onWrongBasket],
  );

  const chooseBasket = useCallback(
    (basket) => act((current, random) => dropIntoBasket(current, basket, random)),
    [act],
  );

  const { status, word, options, review } = game;
  const level = tetrisLevel(game);
  const started = status !== TETRIS_STATUS.READY;
  const playing = status === TETRIS_STATUS.PLAYING;
  const paused = status === TETRIS_STATUS.PAUSED;
  const levelUp = status === TETRIS_STATUS.LEVEL_UP;
  const builtParts = houseStage(game);
  // The level that has just been completed added a part, unless the house was finished before.
  const newPart = level - 1 === builtParts ? HOUSE_PARTS[builtParts - 1] : null;
  const fallsFaster = fallDelay(level, baseFallMs) < fallDelay(level - 1, baseFallMs);

  const restart = () => act(() => startTetris(createTetris(words, rng)));

  useEffect(() => {
    if (!playing) {
      return undefined;
    }
    const timer = setInterval(() => act(tick), fallDelay(level, baseFallMs));
    return () => clearInterval(timer);
  }, [playing, level, baseFallMs, act]);

  useEffect(() => {
    if (!levelUp) {
      return undefined;
    }
    const timer = setTimeout(() => act(startNextLevel), levelUpMs);
    return () => clearTimeout(timer);
  }, [levelUp, levelUpMs, act]);

  useEffect(() => {
    if (!playing && !paused) {
      return undefined;
    }
    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }
      const transition = KEY_TRANSITIONS[event.key];
      // The keys 1–4 drop the block into the basket with that number.
      const basket = Number(event.key) - 1;
      if (transition) {
        // Keeps the arrow keys and the space bar from scrolling the page.
        event.preventDefault();
        act(transition);
      } else if (event.key !== ' ' && basket >= 0 && basket < BASKET_COUNT) {
        event.preventDefault();
        chooseBasket(basket);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [playing, paused, act, chooseBasket]);

  const stats = [
    { pl: 'Wynik', en: 'Score', value: game.score },
    { pl: 'Poziom', en: 'Level', value: level },
    { pl: 'Słowa', en: 'Words', value: game.correctCount },
    { pl: 'Seria', en: 'Streak', value: `${game.streak} / ${STREAK_FOR_BONUS}` },
  ];

  return (
    <section className="tetris">
      <dl className="tetris__hud">
        {stats.map((stat) => (
          <div key={stat.en}>
            <dt>
              <span lang="pl">{stat.pl}</span> <span className="tetris__stat-en">{stat.en}</span>
            </dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="tetris__play">
        <div className="tetris__side">
          {!started && (
            <>
              <p>
                Every falling block has a Polish word on it, and each of the {BASKET_COUNT} baskets
                at the bottom is titled with an English translation. Steer the block into the basket
                with the right one — <span lang="pl">głowa</span> belongs in the basket “head”.
                There it disappears and scores, and {STREAK_FOR_BONUS} in a row remove the bottom
                row. In a wrong basket the block stays — the game ends when a basket is full. A
                block never starts above the right basket, so you always have to steer it.
              </p>
              <p>
                A family needs a house: every level you complete builds another part of it, and
                after {HOUSE_PARTS.length} levels it is finished.
              </p>
              <button type="button" className="button" onClick={() => act(startTetris)}>
                Start
              </button>
            </>
          )}

          {playing && (
            <p className="tetris__hint">
              Drop the falling block into the basket with the meaning of its word.
              <SpeakButton text={word.pl} />
            </p>
          )}

          {paused && (
            <div className="feedback tetris__paused">
              <p>
                <strong lang="pl">Pauza.</strong> The game is paused.
              </p>
            </div>
          )}

          <div aria-live="polite">
            {started && review && (
              <p className="tetris__review">
                Last word: <strong lang="pl">{review.pl}</strong> — {review.en}{' '}
                <span className={`tetris__review-note tetris__review-note--${review.result}`}>
                  ({REVIEW_NOTES[review.result]})
                </span>
              </p>
            )}
            {levelUp && (
              <div className="feedback feedback--correct tetris__level-up">
                <p>
                  <strong lang="pl">Gratulacje!</strong> Congratulations, you completed level{' '}
                  {level - 1}.{newPart && ` You built ${newPart} of the family’s house.`}
                  {newPart && builtParts === HOUSE_PARTS.length && ' The house is finished!'}
                </p>
                <p>
                  Level {level} is next: {fallsFaster && 'the blocks fall faster and '}every word in
                  the right basket scores {CORRECT_WORD_SCORE * level} points.
                </p>
                <div className="tetris__loading" role="progressbar" aria-label="Loading next level">
                  <span
                    className="tetris__loading-bar"
                    style={{ animationDuration: `${levelUpMs}ms` }}
                  />
                </div>
              </div>
            )}
            {status === TETRIS_STATUS.OVER && (
              <div className="feedback feedback--wrong">
                <p>
                  <strong lang="pl">Koniec gry!</strong> Game over: a basket is full. You scored{' '}
                  {game.score} points and put {game.correctCount}{' '}
                  {game.correctCount === 1 ? 'word' : 'words'} into the right basket.
                </p>
                <button type="button" className="button" onClick={restart}>
                  Play again
                </button>
              </div>
            )}
          </div>

          <TetrisHouse stage={builtParts} />
        </div>

        <div className="tetris__board-column">
          <div className="tetris__well">
            <TetrisBoard
              rows={started ? boardWithPiece(game) : game.board}
              hideWords={paused || levelUp}
            />
            {/* Like the word on the block, the titles are hidden while the game is not running. */}
            <TetrisBaskets
              titles={playing ? options : options.map((_, basket) => `Basket ${basket + 1}`)}
              disabled={!playing}
              onChoose={chooseBasket}
            />
          </div>
          <div className="tetris__controls">
            {CONTROLS.map((control) => (
              <button
                key={control.label}
                type="button"
                className="tetris__control"
                aria-label={control.label}
                title={control.label}
                disabled={!playing}
                onClick={(event) => {
                  // Hands the keyboard back to the game, so Space does not press this button again.
                  event.currentTarget.blur();
                  act(control.transition);
                }}
              >
                {control.symbol}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="button button--secondary"
            disabled={!playing && !paused}
            onClick={(event) => {
              event.currentTarget.blur();
              act(togglePause);
            }}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      <p className="tetris__keys">
        Keyboard: ← → choose a basket · ↓ down · Space drop · 1–{BASKET_COUNT} drop into that basket
        · P pause
      </p>
    </section>
  );
}

Tetris.propTypes = {
  words: PropTypes.arrayOf(wordType),
  rng: PropTypes.func,
  baseFallMs: PropTypes.number,
  levelUpMs: PropTypes.number,
  onWrongBasket: PropTypes.func,
};
