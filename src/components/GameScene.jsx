import PropTypes from 'prop-types';
import GameBear from './GameBear';
import GameFigure from './GameFigure';
import GameGate from './GameGate';
import GameHouse from './GameHouse';
import GameRiver from './GameRiver';
import { GAME_STATUS } from '../lib/game';
import { encounterType } from '../propTypes';

// The people standing in the way, drawn as full figures.
const PEOPLE = {
  'angry-man': [{ variant: 'man', angry: true }],
  'angry-men': [
    { variant: 'man', angry: true },
    { variant: 'man', angry: true },
    { variant: 'man', angry: true },
  ],
  guard: [{ variant: 'guard', angry: false }],
};

// Flowers scattered over the field; the ones listed first grow behind the path.
const FLOWERS = [
  { icon: '🌼', left: '3%', bottom: '19%' },
  { icon: '🌷', left: '24%', bottom: '20%' },
  { icon: '🌸', left: '41%', bottom: '18%' },
  { icon: '🌼', left: '63%', bottom: '20%' },
  { icon: '🌷', left: '95%', bottom: '18%' },
  { icon: '🌸', left: '13%', bottom: '3%' },
  { icon: '🌼', left: '33%', bottom: '5%' },
  { icon: '🌷', left: '52%', bottom: '2%' },
  { icon: '🌼', left: '74%', bottom: '4%' },
  { icon: '🌸', left: '88%', bottom: '3%' },
];

/** Names the picture being shown, so the stylesheet can size and place its parts. */
function sceneName(status, encounter) {
  if (status === GAME_STATUS.READY) {
    return 'start';
  }
  return status === GAME_STATUS.WON ? 'home' : encounter.id;
}

function boyClass(status) {
  if (status === GAME_STATUS.READY) {
    return 'game__boy';
  }
  return status === GAME_STATUS.WON ? 'game__boy game__boy--home' : 'game__boy game__boy--walking';
}

function renderObstacle(encounter) {
  const people = PEOPLE[encounter.figure];
  if (people) {
    return people.map((person, position) => (
      // eslint-disable-next-line react/no-array-index-key -- a fixed list of identical figures
      <GameFigure key={position} variant={person.variant} angry={person.angry} />
    ));
  }
  if (encounter.figure === 'bear') {
    return <GameBear />;
  }
  if (encounter.figure === 'dragon') {
    return (
      <>
        <span className="game__flame">🔥</span>
        <span className="game__dragon">🐉</span>
      </>
    );
  }
  return encounter.icon;
}

/** Purely decorative picture of the path; everything it shows is also said in the dialogue. */
export default function GameScene({ status, index, encounter }) {
  const won = status === GAME_STATUS.WON;
  const met = status !== GAME_STATUS.READY && !won;
  const cleared = status === GAME_STATUS.CLEARED;
  const isRiver = encounter.figure === 'river';

  return (
    <div className={`game__scene game__scene--${sceneName(status, encounter)}`} aria-hidden="true">
      <span className="game__sun" />
      {FLOWERS.map((flower) => (
        <span
          key={`${flower.left}-${flower.bottom}`}
          className="game__flower"
          style={{ left: flower.left, bottom: flower.bottom }}
        >
          {flower.icon}
        </span>
      ))}
      {met && isRiver && <GameRiver crossed={cleared} />}
      {/* Scenery stays put when the obstacle in front of it is cleared. */}
      {met && encounter.figure === 'guard' && (
        <span className="game__scenery">
          <GameGate open={cleared} />
        </span>
      )}
      {(won || (met && encounter.figure === 'dragon')) && (
        <span className="game__scenery">
          <GameHouse />
        </span>
      )}
      {/* Keyed by obstacle so the walking animation replays on the way to each one. */}
      <span key={index} className={boyClass(status)}>
        <GameFigure variant="boy" />
      </span>
      {met && !isRiver && (
        <span
          key={`obstacle-${index}`}
          className={`game__obstacle${cleared ? ' game__obstacle--cleared' : ''}`}
        >
          {renderObstacle(encounter)}
        </span>
      )}
    </div>
  );
}

GameScene.propTypes = {
  status: PropTypes.oneOf(Object.values(GAME_STATUS)).isRequired,
  index: PropTypes.number.isRequired,
  encounter: encounterType.isRequired,
};
