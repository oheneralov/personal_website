import { describe, expect, it } from 'vitest';
import { GAME_STATUS, MAX_LIVES, chooseOption, countCleared, createGame, walkOn } from './game';
import { createSeededRng } from '../test/helpers';

const ENCOUNTERS = [
  {
    id: 'fire',
    options: [{ pl: 'woda', correct: true }, { pl: 'drewno' }, { pl: 'wiatr' }, { pl: 'papier' }],
  },
  {
    id: 'dragon',
    options: [{ pl: 'woda', correct: true }, { pl: 'zapałki' }, { pl: 'ogon' }, { pl: 'krzyk' }],
  },
];

function startedGame() {
  return walkOn(createGame(ENCOUNTERS, createSeededRng(5)));
}

describe('createGame', () => {
  it('starts at the first obstacle with full lives', () => {
    const game = createGame(ENCOUNTERS, createSeededRng(5));

    expect(game.status).toBe(GAME_STATUS.READY);
    expect(game.index).toBe(0);
    expect(game.lives).toBe(MAX_LIVES);
    expect(countCleared(game)).toBe(0);
  });

  it('shuffles the options without changing or mutating them', () => {
    const game = createGame(ENCOUNTERS, createSeededRng(5));

    expect(ENCOUNTERS[0].options[0].pl).toBe('woda');
    game.encounters.forEach((encounter, position) => {
      expect(encounter.options).toHaveLength(ENCOUNTERS[position].options.length);
      expect(encounter.options).toEqual(expect.arrayContaining(ENCOUNTERS[position].options));
    });
  });
});

describe('chooseOption', () => {
  it('clears the obstacle and counts a first-try success for a correct option', () => {
    const game = chooseOption(startedGame(), 'woda');

    expect(game.status).toBe(GAME_STATUS.CLEARED);
    expect(game.lives).toBe(MAX_LIVES);
    expect(game.firstTryCount).toBe(1);
    expect(countCleared(game)).toBe(1);
  });

  it('takes a life for a wrong option and keeps the obstacle open', () => {
    const game = chooseOption(startedGame(), 'drewno');

    expect(game.status).toBe(GAME_STATUS.ENCOUNTER);
    expect(game.lives).toBe(MAX_LIVES - 1);
    expect(game.wrongChoices).toEqual(['drewno']);
  });

  it('does not count a first-try success after a wrong option', () => {
    const game = chooseOption(chooseOption(startedGame(), 'drewno'), 'woda');

    expect(game.status).toBe(GAME_STATUS.CLEARED);
    expect(game.firstTryCount).toBe(0);
  });

  it('does not charge twice for the same wrong option', () => {
    const once = chooseOption(startedGame(), 'drewno');

    expect(chooseOption(once, 'drewno')).toBe(once);
  });

  it('ends the game when the last life is lost', () => {
    const game = ['drewno', 'wiatr', 'papier'].reduce(chooseOption, startedGame());

    expect(game.status).toBe(GAME_STATUS.LOST);
    expect(game.lives).toBe(0);
    expect(chooseOption(game, 'woda')).toBe(game);
  });

  it('ignores unknown options and choices made outside an encounter', () => {
    const started = startedGame();
    const ready = createGame(ENCOUNTERS, createSeededRng(5));

    expect(chooseOption(started, 'nie ma')).toBe(started);
    expect(chooseOption(ready, 'woda')).toBe(ready);
  });
});

describe('walkOn', () => {
  it('moves to the next obstacle and forgets the earlier wrong choices', () => {
    const cleared = chooseOption(chooseOption(startedGame(), 'drewno'), 'woda');

    const game = walkOn(cleared);

    expect(game.status).toBe(GAME_STATUS.ENCOUNTER);
    expect(game.index).toBe(1);
    expect(game.wrongChoices).toEqual([]);
    expect(game.lives).toBe(MAX_LIVES - 1);
  });

  it('wins the game after the last obstacle', () => {
    const lastCleared = chooseOption(walkOn(chooseOption(startedGame(), 'woda')), 'woda');

    const game = walkOn(lastCleared);

    expect(game.status).toBe(GAME_STATUS.WON);
    expect(game.firstTryCount).toBe(2);
    expect(countCleared(game)).toBe(2);
  });

  it('does not skip an obstacle that is still unsolved', () => {
    const started = startedGame();

    expect(walkOn(started)).toBe(started);
  });
});
