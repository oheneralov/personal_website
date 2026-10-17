import { describe, expect, it } from 'vitest';
import RED_HAT_SCENES, { SPEAKERS } from './redHat';

const LINES = RED_HAT_SCENES.flatMap((scene) => scene.lines);

describe('red hat tale', () => {
  it('has scenes with unique ids, each with at least one line', () => {
    expect(new Set(RED_HAT_SCENES.map((scene) => scene.id)).size).toBe(RED_HAT_SCENES.length);
    expect(RED_HAT_SCENES.every((scene) => scene.lines.length > 0)).toBe(true);
  });

  it('gives every line a known speaker, Polish text and an English translation', () => {
    LINES.forEach((line) => {
      expect(Object.keys(SPEAKERS)).toContain(line.speaker);
      expect(line.pl.trim()).not.toBe('');
      expect(line.en.trim()).not.toBe('');
    });
  });

  it('lets the girl meet the wolf and say what she sees', () => {
    expect(LINES).toContainEqual(
      expect.objectContaining({
        speaker: 'girl',
        pl: 'Oj, to jest wilk! Wilk jest czarny i duży.',
      }),
    );
  });
});
