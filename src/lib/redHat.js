export const STORY_STATUS = {
  READY: 'ready',
  PLAYING: 'playing',
  FINISHED: 'finished',
};

// A line stays on screen long enough to be heard and read: a pause plus a little per character.
const LINE_BASE_MS = 1600;
const LINE_MS_PER_CHAR = 70;
// After a line has been read aloud, a short pause before the next one.
export const PAUSE_AFTER_SPEECH_MS = 600;
// How much longer than its duration a line waits for its speech to end before going on anyway.
export const SPEECH_TIMEOUT_MS = 10000;

/** Creates a story that waits to be started; its lines are those of all scenes, in order. */
export function createStory(scenes) {
  return {
    lines: scenes.flatMap((scene, sceneIndex) =>
      scene.lines.map((line) => ({ ...line, sceneIndex })),
    ),
    step: 0,
    status: STORY_STATUS.READY,
  };
}

/** Starts the story from its first line; it can also be watched again once it has finished. */
export function startStory(story) {
  return { ...story, step: 0, status: STORY_STATUS.PLAYING };
}

/** Goes on to the next line, or finishes the story after its last one. */
export function nextLine(story) {
  if (story.status !== STORY_STATUS.PLAYING) {
    return story;
  }
  if (story.step === story.lines.length - 1) {
    return { ...story, status: STORY_STATUS.FINISHED };
  }
  return { ...story, step: story.step + 1 };
}

export function currentLine(story) {
  return story.lines[story.step];
}

/** Milliseconds a line stays before the story goes on. */
export function lineDuration(line) {
  return LINE_BASE_MS + LINE_MS_PER_CHAR * line.pl.length;
}
