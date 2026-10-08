/** Small deterministic PRNG (linear congruential) so shuffled quizzes are reproducible in tests. */
export function createSeededRng(seed = 1) {
  const MODULUS = 2 ** 32;
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % MODULUS;
    return state / MODULUS;
  };
}

export function createMemoryStorage(initial = {}) {
  const items = new Map(Object.entries(initial));
  return {
    getItem: (key) => (items.has(key) ? items.get(key) : null),
    setItem: (key, value) => {
      items.set(key, String(value));
    },
  };
}
