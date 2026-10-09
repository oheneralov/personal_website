const FAILURE_SECONDS = 0.4;

// Browsers limit how many audio contexts a page may open, so one is created lazily and reused.
let audioContext = null;

function getAudioContext() {
  if (typeof window === 'undefined') {
    return null;
  }
  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }
  audioContext ??= new AudioContextClass();
  return audioContext;
}

/**
 * Plays a short falling buzz for a wrong answer. The tone is synthesised with the Web Audio API,
 * so no audio file is needed; it does nothing where Web Audio is unavailable.
 */
export default function playFailureSound() {
  const context = getAudioContext();
  if (!context) {
    return;
  }
  if (context.state === 'suspended') {
    context.resume();
  }
  const start = context.currentTime;
  const end = start + FAILURE_SECONDS;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(300, start);
  oscillator.frequency.exponentialRampToValueAtTime(110, end);
  gain.gain.setValueAtTime(0.18, start);
  gain.gain.exponentialRampToValueAtTime(0.001, end);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(end);
}
