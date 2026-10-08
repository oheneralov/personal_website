import PropTypes from 'prop-types';

export const wordType = PropTypes.shape({
  pl: PropTypes.string.isRequired,
  en: PropTypes.string.isRequired,
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
  vocabulary: PropTypes.arrayOf(wordType).isRequired,
  phrases: PropTypes.arrayOf(wordType).isRequired,
  grammar: grammarType.isRequired,
  exercises: PropTypes.arrayOf(
    PropTypes.shape({
      prompt: PropTypes.string.isRequired,
      hint: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
      answer: PropTypes.string.isRequired,
    }),
  ).isRequired,
});
