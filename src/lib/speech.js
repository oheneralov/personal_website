export function canSpeak() {
  return (
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    'SpeechSynthesisUtterance' in window
  );
}

/** Reads Polish text aloud with the browser's built-in speech synthesis, when available. */
export function speakPolish(text) {
  if (!canSpeak()) {
    return;
  }
  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = 'pl-PL';
  utterance.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
