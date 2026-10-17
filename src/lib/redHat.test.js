import { describe, expect, it } from 'vitest';
import {
  STORY_STATUS,
  createStory,
  currentLine,
  lineDuration,
  nextLine,
  startStory,
} from './redHat';

const SCENES = [
  {
    id: 'home',
    title: 'At home',
    lines: [
      { speaker: 'mother', pl: 'Idź do babci.', en: 'Go to Grandma.' },
      { speaker: 'girl', pl: 'Dobrze!', en: 'All right!' },
    ],
  },
  { id: 'wolf', title: 'The wolf', lines: [{ speaker: 'wolf', pl: 'Cześć!', en: 'Hi!' }] },
];

function finishedStory() {
  return nextLine(nextLine(nextLine(startStory(createStory(SCENES)))));
}

describe('red hat story', () => {
  it('waits to be started with the lines of all scenes in order', () => {
    const story = createStory(SCENES);

    expect(story.status).toBe(STORY_STATUS.READY);
    expect(story.lines.map((line) => line.pl)).toEqual(['Idź do babci.', 'Dobrze!', 'Cześć!']);
    expect(story.lines.map((line) => line.sceneIndex)).toEqual([0, 0, 1]);
  });

  it('does not go on before it is started', () => {
    const story = createStory(SCENES);

    expect(nextLine(story)).toBe(story);
  });

  it('goes through the lines one by one into the next scene', () => {
    const story = nextLine(nextLine(startStory(createStory(SCENES))));

    expect(story.status).toBe(STORY_STATUS.PLAYING);
    expect(currentLine(story)).toMatchObject({ pl: 'Cześć!', sceneIndex: 1 });
  });

  it('finishes after the last line and stays finished', () => {
    const story = finishedStory();

    expect(story.status).toBe(STORY_STATUS.FINISHED);
    expect(nextLine(story)).toBe(story);
  });

  it('starts again from the first line once it has finished', () => {
    const story = startStory(finishedStory());

    expect(story.status).toBe(STORY_STATUS.PLAYING);
    expect(currentLine(story).pl).toBe('Idź do babci.');
  });

  it('keeps a longer line on screen for longer', () => {
    expect(lineDuration({ pl: 'Babciu, jakie masz duże zęby!' })).toBeGreaterThan(
      lineDuration({ pl: 'Oj!' }),
    );
  });
});
