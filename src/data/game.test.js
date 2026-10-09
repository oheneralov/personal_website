import { describe, expect, it } from 'vitest';
import ENCOUNTERS from './game';
import { MAX_LIVES } from '../lib/game';

describe('game content', () => {
  it('gives every obstacle a unique id', () => {
    const ids = ENCOUNTERS.map((encounter) => encounter.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes the angry men, the fire and the dragon', () => {
    expect(ENCOUNTERS.map((encounter) => encounter.id)).toEqual(
      expect.arrayContaining(['angry-man', 'angry-men', 'fire', 'dragon']),
    );
  });

  it.each(ENCOUNTERS)('obstacle $id has a picture', (encounter) => {
    expect(encounter.icon ?? encounter.figure).toBeTruthy();
  });

  it.each(ENCOUNTERS)('obstacle $id has correct and incorrect options', (encounter) => {
    const correct = encounter.options.filter((option) => option.correct);

    expect(correct.length).toBeGreaterThan(0);
    // Enough wrong answers for the obstacle to be a real choice.
    expect(encounter.options.length - correct.length).toBeGreaterThanOrEqual(MAX_LIVES - 1);
    expect(new Set(encounter.options.map((option) => option.pl)).size).toBe(
      encounter.options.length,
    );
  });

  it.each(ENCOUNTERS)(
    'obstacle $id has an English explanation for every Polish text',
    (encounter) => {
      expect(encounter.pl).toBeTruthy();
      expect(encounter.en).toBeTruthy();
      expect(encounter.situation).toBeTruthy();
      expect(encounter.success).toBeTruthy();
      encounter.options.forEach((option) => expect(option.en, option.pl).toBeTruthy());
    },
  );
});
