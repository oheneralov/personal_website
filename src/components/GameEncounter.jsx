import PropTypes from 'prop-types';
import SpeakButton from './SpeakButton';
import { encounterType } from '../propTypes';

function optionClass(option, tried, finished) {
  if (tried) {
    return 'option game__option option--wrong';
  }
  return finished && option.correct ? 'option game__option option--correct' : 'option game__option';
}

/**
 * The dialogue shown under the picture when the boy meets an obstacle: what the obstacle says and
 * the Polish reactions to choose from. The English meaning of an option stays hidden until it
 * has been tried, or until the encounter is `finished`, so the learner reads the Polish first.
 */
export default function GameEncounter({ encounter, wrongChoices, finished, onChoose }) {
  return (
    <div className="game__dialogue">
      {encounter.says && (
        <p className="game__says">
          <span lang="pl">„{encounter.says}”</span>
          <SpeakButton text={encounter.says} />
        </p>
      )}

      <div className="game__choices">
        <p className="quiz__instruction">What do you do? Choose the right answer in Polish.</p>
        <div className="options">
          {encounter.options.map((option) => {
            const tried = wrongChoices.includes(option.pl);
            return (
              <button
                key={option.pl}
                type="button"
                className={optionClass(option, tried, finished)}
                disabled={tried || finished}
                onClick={() => onChoose(option.pl)}
              >
                <span lang="pl">{option.pl}</span>
                {(tried || finished) && <span className="game__meaning">{option.en}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

GameEncounter.propTypes = {
  encounter: encounterType.isRequired,
  wrongChoices: PropTypes.arrayOf(PropTypes.string).isRequired,
  finished: PropTypes.bool.isRequired,
  onChoose: PropTypes.func.isRequired,
};
