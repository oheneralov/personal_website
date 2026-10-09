import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GameEncounter from './GameEncounter';
import GameScene from './GameScene';
import ProgressBar from './ProgressBar';
import ENCOUNTERS from '../data/game';
import {
  GAME_STATUS,
  MAX_LIVES,
  chooseOption,
  countCleared,
  createGame,
  walkOn,
} from '../lib/game';
import playFailureSound from '../lib/sound';
import { encounterType } from '../propTypes';

// How long the success message stays up before the boy walks on by himself.
const WALK_ON_DELAY_MS = 2000;

export default function Game({
  encounters = ENCOUNTERS,
  rng = Math.random,
  walkOnDelayMs = WALK_ON_DELAY_MS,
  onWrongAnswer = playFailureSound,
}) {
  const [game, setGame] = useState(() => createGame(encounters, rng));

  const { status, index, lives, wrongChoices } = game;
  const total = game.encounters.length;
  const encounter = game.encounters[index];
  const cleared = countCleared(game);
  const inEncounter =
    status === GAME_STATUS.ENCOUNTER ||
    status === GAME_STATUS.CLEARED ||
    status === GAME_STATUS.LOST;

  const restart = () => setGame(createGame(encounters, rng));
  const advance = () => setGame(walkOn);

  const choose = (optionPl) => {
    const next = chooseOption(game, optionPl);
    if (next.lives < game.lives) {
      onWrongAnswer();
    }
    setGame(next);
  };

  // A right answer needs no further click: after a pause to read the result the boy walks on.
  useEffect(() => {
    if (status !== GAME_STATUS.CLEARED) {
      return undefined;
    }
    const timer = setTimeout(() => setGame(walkOn), walkOnDelayMs);
    return () => clearTimeout(timer);
  }, [status, index, walkOnDelayMs]);

  return (
    <section className="game">
      <div className="game__hud">
        <span className="game__lives" role="img" aria-label={`Lives: ${lives} of ${MAX_LIVES}`}>
          {'❤️'.repeat(lives)}
          {'🖤'.repeat(MAX_LIVES - lives)}
        </span>
        <ProgressBar value={cleared} max={total} label="Obstacles passed" />
      </div>

      {/* The obstacle is introduced above the picture; the choices follow below it. */}
      {inEncounter && (
        <div className="game__dialogue">
          <h2>
            <span lang="pl">{encounter.pl}</span>
            <span className="game__name-en"> — {encounter.en}</span>
          </h2>
          <p>{encounter.situation}</p>
        </div>
      )}

      <GameScene status={status} index={index} encounter={encounter} />

      {status === GAME_STATUS.READY && (
        <div className="game__dialogue">
          <p>
            Janek is walking home through the forest. Help him get past every obstacle by choosing
            the right Polish answer. Every wrong answer costs a heart — you have {MAX_LIVES}.
          </p>
          <button type="button" className="button" onClick={advance}>
            Start walking
          </button>
        </div>
      )}

      {inEncounter && (
        <GameEncounter
          encounter={encounter}
          wrongChoices={wrongChoices}
          finished={status !== GAME_STATUS.ENCOUNTER}
          onChoose={choose}
        />
      )}

      <div aria-live="polite">
        {status === GAME_STATUS.ENCOUNTER && wrongChoices.length > 0 && (
          <div className="feedback feedback--wrong">
            <p>
              <strong>Not quite.</strong> That costs a heart — try another answer.
            </p>
          </div>
        )}
        {status === GAME_STATUS.CLEARED && (
          <div className="feedback feedback--correct">
            <p>
              <strong lang="pl">Dobrze!</strong> {encounter.success}
            </p>
          </div>
        )}
        {status === GAME_STATUS.LOST && (
          <div className="feedback feedback--wrong">
            <p>
              <strong>Game over.</strong> You ran out of hearts after passing {cleared} of {total}{' '}
              obstacles.
            </p>
            <button type="button" className="button" onClick={restart}>
              Try again
            </button>
          </div>
        )}
        {status === GAME_STATUS.WON && (
          <div className="game__success">
            <p className="game__success-title" lang="pl">
              🏆 Sukces!
            </p>
            <h2>Success! Janek is home</h2>
            <p>
              You solved {game.firstTryCount} of {total} obstacles on the first try.
            </p>
            <button type="button" className="button" onClick={restart}>
              Play again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

Game.propTypes = {
  encounters: PropTypes.arrayOf(encounterType),
  rng: PropTypes.func,
  walkOnDelayMs: PropTypes.number,
  onWrongAnswer: PropTypes.func,
};
