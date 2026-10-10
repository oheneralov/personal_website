import { describe, expect, it } from 'vitest';
import TETRIS_WORDS from './tetris';
import { BASKET_COUNT } from '../lib/tetris';

describe('tetris words', () => {
  it('has enough words to offer wrong translations', () => {
    expect(TETRIS_WORDS.length).toBeGreaterThan(BASKET_COUNT);
  });

  it('has no two words with the same Polish text or the same English translation', () => {
    // A translation shared by two words would make a "wrong" option a correct answer.
    expect(new Set(TETRIS_WORDS.map((word) => word.pl)).size).toBe(TETRIS_WORDS.length);
    expect(new Set(TETRIS_WORDS.map((word) => word.en)).size).toBe(TETRIS_WORDS.length);
  });

  it('gives every word a single English phrase, so that it fits on a basket', () => {
    const dzienDobry = TETRIS_WORDS.find((word) => word.pl === 'dzień dobry');

    expect(dzienDobry.en).toBe('good morning');
    expect(TETRIS_WORDS.filter((word) => word.en.includes('/'))).toEqual([]);
  });
});
