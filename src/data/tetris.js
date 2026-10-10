import { ALL_UNITS } from './course';

const ALTERNATIVES_SEPARATOR = ' / ';

// The words that fall in the Tetris game: the vocabulary of every unit of the course. A basket is
// too narrow for alternative translations ("good morning / good day"), so only the first is kept.
const TETRIS_WORDS = ALL_UNITS.flatMap((unit) => unit.vocabulary).map((word) => ({
  ...word,
  en: word.en.split(ALTERNATIVES_SEPARATOR)[0],
}));

export default TETRIS_WORDS;
