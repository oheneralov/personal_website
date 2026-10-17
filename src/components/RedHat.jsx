import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import RedHatScene from './RedHatScene';
import SpeakButton from './SpeakButton';
import RED_HAT_SCENES, { SPEAKERS } from '../data/redHat';
import {
  PAUSE_AFTER_SPEECH_MS,
  SPEECH_TIMEOUT_MS,
  STORY_STATUS,
  createStory,
  currentLine,
  lineDuration,
  nextLine,
  startStory,
} from '../lib/redHat';
import { speakPolish, stopSpeaking } from '../lib/speech';

/**
 * Plays the tale of Little Red Riding Hood: after Start, every line is shown and read aloud in
 * Polish, and the story goes on by itself once the line has been read. The learner only watches.
 */
export default function RedHat({
  scenes = RED_HAT_SCENES,
  durationOf = lineDuration,
  pauseMs = PAUSE_AFTER_SPEECH_MS,
  speak = speakPolish,
  stop = stopSpeaking,
}) {
  const [story, setStory] = useState(() => createStory(scenes));
  const { status, step } = story;
  const playing = status === STORY_STATUS.PLAYING;
  const line = currentLine(story);

  useEffect(() => {
    if (!playing) {
      return undefined;
    }
    let active = true;
    let timer = null;
    const goOnAfter = (ms) => {
      clearTimeout(timer);
      timer = setTimeout(() => setStory(nextLine), ms);
    };
    const { pitch, rate } = SPEAKERS[line.speaker];
    // The next line starts only when this one has been read to the end; starting it earlier
    // would cut this one off. A speech cancelled because the story moved on does not count.
    const spoken = speak(line.pl, {
      pitch,
      rate,
      onEnd: () => active && goOnAfter(pauseMs),
    });
    // Without a voice the line stays for its duration; with one, this is the fallback in case the
    // browser never reports the end of the speech.
    goOnAfter(spoken ? durationOf(line) + SPEECH_TIMEOUT_MS : durationOf(line));
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [playing, line, speak, durationOf, pauseMs]);

  // Leaving the page silences the tale.
  useEffect(() => stop, [stop]);

  const started = status !== STORY_STATUS.READY;
  const scene = scenes[started ? line.sceneIndex : 0];
  const speaker = SPEAKERS[line.speaker];

  return (
    <section className="red-hat">
      <p className="red-hat__scene-title">
        {started
          ? `Scene ${line.sceneIndex + 1} of ${scenes.length}: ${scene.title}`
          : 'Czerwony Kapturek — Little Red Riding Hood'}
      </p>

      <RedHatScene sceneId={scene.id} speaker={playing ? line.speaker : null} />

      {!started && (
        <div className="red-hat__intro">
          <p>
            Sit back and watch: Little Red Riding Hood takes a basket to her grandmother, meets the
            wolf in the forest and says what she sees — all in Polish, with English below. Turn on
            your sound to hear every line.
          </p>
          <button type="button" className="button" onClick={() => setStory(startStory)}>
            Start
          </button>
        </div>
      )}

      <div aria-live="polite">
        {playing && (
          <div className="red-hat__dialogue">
            <p className="red-hat__speaker">
              <span lang="pl">{speaker.pl}</span>{' '}
              <span className="red-hat__speaker-en">{speaker.en}</span>
            </p>
            <p className="red-hat__line">
              <span lang="pl">{line.pl}</span>
              <SpeakButton text={line.pl} />
            </p>
            <p className="red-hat__translation">{line.en}</p>
          </div>
        )}
        {status === STORY_STATUS.FINISHED && (
          <div className="feedback feedback--correct">
            <p>
              <strong lang="pl">Koniec!</strong> You watched the whole tale of Little Red Riding
              Hood.
            </p>
            <button type="button" className="button" onClick={() => setStory(startStory)}>
              Watch again
            </button>
          </div>
        )}
      </div>

      {started && (
        <p className="red-hat__progress">
          Line {step + 1} of {story.lines.length}
        </p>
      )}
    </section>
  );
}

RedHat.propTypes = {
  scenes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      lines: PropTypes.arrayOf(
        PropTypes.shape({
          speaker: PropTypes.oneOf(Object.keys(SPEAKERS)).isRequired,
          pl: PropTypes.string.isRequired,
          en: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }),
  ),
  durationOf: PropTypes.func,
  pauseMs: PropTypes.number,
  speak: PropTypes.func,
  stop: PropTypes.func,
};
