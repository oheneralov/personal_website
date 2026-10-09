import PropTypes from 'prop-types';

export const wordType = PropTypes.shape({
  pl: PropTypes.string.isRequired,
  en: PropTypes.string.isRequired,
  tl: PropTypes.string,
});

export const encounterType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  icon: PropTypes.string,
  figure: PropTypes.oneOf(['angry-man', 'angry-men', 'guard', 'river', 'bear', 'dragon']),
  pl: PropTypes.string.isRequired,
  en: PropTypes.string.isRequired,
  situation: PropTypes.string.isRequired,
  says: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      pl: PropTypes.string.isRequired,
      en: PropTypes.string.isRequired,
      correct: PropTypes.bool,
    }),
  ).isRequired,
  success: PropTypes.string.isRequired,
});

export const grammarType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  points: PropTypes.arrayOf(PropTypes.string).isRequired,
  table: PropTypes.shape({
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  }).isRequired,
});

export const unitType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  titleTl: PropTypes.string.isRequired,
  summaryTl: PropTypes.string.isRequired,
  vocabulary: PropTypes.arrayOf(wordType).isRequired,
  phrases: PropTypes.arrayOf(wordType).isRequired,
  grammar: grammarType.isRequired,
  exercises: PropTypes.arrayOf(
    PropTypes.shape({
      prompt: PropTypes.string.isRequired,
      promptTl: PropTypes.string,
      hint: PropTypes.string.isRequired,
      hintTl: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
      answer: PropTypes.string.isRequired,
    }),
  ).isRequired,
});
