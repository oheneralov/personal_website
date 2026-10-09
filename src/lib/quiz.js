const PL_TO_EN_COUNT = 4;
const EN_TO_PL_COUNT = 3;
const TYPING_COUNT = 2;
const DISTRACTOR_COUNT = 3;

// Every instruction is shown in English with its Filipino (Tagalog) translation underneath.
const INSTRUCTIONS = {
  plToEn: {
    instruction: 'What does this mean in English?',
    instructionTl: 'Ano ang ibig sabihin nito sa Ingles?',
  },
  enToPl: {
    instruction: 'How do you say this in Polish?',
    instructionTl: 'Paano ito sasabihin sa Polish?',
  },
  grammar: { instruction: 'Choose the correct form.', instructionTl: 'Piliin ang tamang anyo.' },
  typing: { instruction: 'Type this in Polish.', instructionTl: 'I-type ito sa Polish.' },
};

export const ANSWER_RESULT = {
  CORRECT: 'correct',
  // Right word, but typed without the Polish diacritics.
  CLOSE: 'close',
  WRONG: 'wrong',
};

/** Returns a shuffled copy (Fisher–Yates). `rng` is injectable so tests are deterministic. */
export function shuffle(items, rng = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildVocabularyQuestion(word, vocabulary, direction, rng) {
  const [from, to] = direction === 'pl-en' ? ['pl', 'en'] : ['en', 'pl'];
  const distractors = shuffle(
    vocabulary.filter((other) => other !== word),
    rng,
  )
    .slice(0, DISTRACTOR_COUNT)
    .map((other) => other[to]);

  return {
    id: `${direction}:${word.pl}`,
    kind: 'choice',
    ...(direction === 'pl-en' ? INSTRUCTIONS.plToEn : INSTRUCTIONS.enToPl),
    prompt: word[from],
    // Only English prompts get a translation; a Polish prompt is the thing being learnt.
    promptTl: direction === 'pl-en' ? null : word.tl,
    hint: null,
    hintTl: null,
    options: shuffle([word[to], ...distractors], rng),
    answer: word[to],
  };
}

/**
 * Builds a unit quiz: vocabulary recognition in both directions, the unit's grammar
 * exercises, then a couple of words the learner has to type in Polish.
 */
export function buildQuiz(unit, rng = Math.random) {
  const words = shuffle(unit.vocabulary, rng);
  const plToEn = words.slice(0, PL_TO_EN_COUNT);
  const enToPl = words.slice(PL_TO_EN_COUNT, PL_TO_EN_COUNT + EN_TO_PL_COUNT);
  const typed = words.slice(
    PL_TO_EN_COUNT + EN_TO_PL_COUNT,
    PL_TO_EN_COUNT + EN_TO_PL_COUNT + TYPING_COUNT,
  );

  return [
    ...plToEn.map((word) => buildVocabularyQuestion(word, unit.vocabulary, 'pl-en', rng)),
    ...enToPl.map((word) => buildVocabularyQuestion(word, unit.vocabulary, 'en-pl', rng)),
    ...unit.exercises.map((exercise) => ({
      id: `grammar:${exercise.prompt}:${exercise.answer}`,
      kind: 'choice',
      ...INSTRUCTIONS.grammar,
      prompt: exercise.prompt,
      promptTl: exercise.promptTl ?? null,
      hint: exercise.hint,
      hintTl: exercise.hintTl,
      options: shuffle(exercise.options, rng),
      answer: exercise.answer,
    })),
    ...typed.map((word) => ({
      id: `type:${word.pl}`,
      kind: 'typing',
      ...INSTRUCTIONS.typing,
      prompt: word.en,
      promptTl: word.tl,
      hint: null,
      hintTl: null,
      options: [],
      answer: word.pl,
    })),
  ];
}

function normalize(text) {
  return text
    .trim()
    .toLocaleLowerCase('pl')
    .replace(/[.!?]+$/, '')
    .replace(/\s+/g, ' ');
}

function stripDiacritics(text) {
  // "ł" has no Unicode decomposition, so it needs to be replaced explicitly.
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ł/g, 'l');
}

export function checkTypedAnswer(input, answer) {
  const given = normalize(input);
  const expected = normalize(answer);
  if (given === expected) {
    return ANSWER_RESULT.CORRECT;
  }
  if (given !== '' && stripDiacritics(given) === stripDiacritics(expected)) {
    return ANSWER_RESULT.CLOSE;
  }
  return ANSWER_RESULT.WRONG;
}

export function evaluateAnswer(question, response) {
  if (question.kind === 'typing') {
    return checkTypedAnswer(response, question.answer);
  }
  return response === question.answer ? ANSWER_RESULT.CORRECT : ANSWER_RESULT.WRONG;
}
