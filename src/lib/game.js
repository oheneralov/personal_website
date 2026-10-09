import { shuffle } from './quiz';

export const MAX_LIVES = 3;

export const GAME_STATUS = {
  // The boy stands at the start of the path; nothing has been met yet.
  READY: 'ready',
  ENCOUNTER: 'encounter',
  // The current obstacle is solved and the boy waits to walk on.
  CLEARED: 'cleared',
  WON: 'won',
  LOST: 'lost',
};

/** Starts a new game with every obstacle's options shuffled. `rng` is injectable for tests. */
export function createGame(encounters, rng = Math.random) {
  return {
    encounters: encounters.map((encounter) => ({
      ...encounter,
      options: shuffle(encounter.options, rng),
    })),
    index: 0,
    lives: MAX_LIVES,
    status: GAME_STATUS.READY,
    // Polish texts of the wrong options already tried at the current obstacle.
    wrongChoices: [],
    firstTryCount: 0,
  };
}

/** Number of obstacles the boy has got past so far. */
export function countCleared(game) {
  const pastCurrent = game.status === GAME_STATUS.CLEARED || game.status === GAME_STATUS.WON;
  return game.index + (pastCurrent ? 1 : 0);
}

/**
 * Applies the learner's choice at the current obstacle. A correct option clears it; a wrong one
 * costs a life and ends the game when none are left. Choices outside an encounter, unknown
 * options and wrong options that were already tried leave the game unchanged.
 */
export function chooseOption(game, optionPl) {
  if (game.status !== GAME_STATUS.ENCOUNTER || game.wrongChoices.includes(optionPl)) {
    return game;
  }
  const option = game.encounters[game.index].options.find((candidate) => candidate.pl === optionPl);
  if (!option) {
    return game;
  }
  if (option.correct) {
    return {
      ...game,
      status: GAME_STATUS.CLEARED,
      firstTryCount: game.firstTryCount + (game.wrongChoices.length === 0 ? 1 : 0),
    };
  }
  const lives = game.lives - 1;
  return {
    ...game,
    lives,
    wrongChoices: [...game.wrongChoices, optionPl],
    status: lives === 0 ? GAME_STATUS.LOST : GAME_STATUS.ENCOUNTER,
  };
}

/** Walks the boy to the next obstacle, or home once the last one has been cleared. */
export function walkOn(game) {
  if (game.status === GAME_STATUS.READY) {
    return { ...game, status: GAME_STATUS.ENCOUNTER };
  }
  if (game.status !== GAME_STATUS.CLEARED) {
    return game;
  }
  if (game.index + 1 === game.encounters.length) {
    return { ...game, status: GAME_STATUS.WON };
  }
  return { ...game, index: game.index + 1, status: GAME_STATUS.ENCOUNTER, wrongChoices: [] };
}
