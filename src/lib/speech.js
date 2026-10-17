export function canSpeak() {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
}

// Holds the utterance being spoken: some browsers drop an unreferenced one and never end it.
let currentUtterance = null;

/**
 * Reads Polish text aloud with the browser's built-in speech synthesis, when available. `pitch`
 * and `rate` let a story give its characters different voices; `onEnd` is called once the text
 * has been read. Returns whether the text is being read.
 */
export function speakPolish(text, { pitch = 1, rate = 0.9, onEnd } = {}) {
  if (!canSpeak()) {
    return false;
  }
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = 'pl-PL';
  utterance.pitch = pitch;
  utterance.rate = rate;
  if (onEnd) {
    utterance.onend = onEnd;
  }
  currentUtterance = utterance;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(currentUtterance);
  return true;
}

/** Silences whatever is being read aloud. */
export function stopSpeaking() {
  if (canSpeak()) {
    window.speechSynthesis.cancel();
  }
}
