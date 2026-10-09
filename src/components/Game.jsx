import { useState } from 'react';
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
import { encounterType } from '../propTypes';

export default function Game({ encounters = ENCOUNTERS, rng = Math.random }) {
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

  return (
    <section className="game">
      <div className="game__hud">
        <span className="game__lives" role="img" aria-label={`Lives: ${lives} of ${MAX_LIVES}`}>
          {'❤️'.repeat(lives)}
          {'🖤'.repeat(MAX_LIVES - lives)}
        </span>
        <ProgressBar value={cleared} max={total} label="Obstacles passed" />
      </div>

      <GameScene status={status} index={index} encounter={encounter} />

      {status === GAME_STATUS.READY && (
        <div className="game__dialogue">
          <p>
            Janek is walking home through the forest. Help him get past every obstacle by choosing
            the right Polish answer. Every wrong answer costs a heart — you have {MAX_LIVES}.
          </p>
          <p className="quiz__translation" lang="tl">
            Naglalakad pauwi si Janek sa gubat. Tulungan siyang malampasan ang bawat balakid sa
            pagpili ng tamang sagot sa Polish. Bawat maling sagot ay may katumbas na isang puso —
            mayroon kang {MAX_LIVES}.
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
          onChoose={(optionPl) => setGame((current) => chooseOption(current, optionPl))}
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
            <div>
              <p>
                <strong lang="pl">Dobrze!</strong> {encounter.success}
              </p>
              <p className="quiz__translation" lang="tl">
                {encounter.successTl}
              </p>
            </div>
            <button type="button" className="button" onClick={advance}>
              {index + 1 === total ? 'Go home' : 'Walk on'}
            </button>
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
            <p className="quiz__translation" lang="tl">
              Tagumpay! Nakauwi na si Janek.
            </p>
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
};
