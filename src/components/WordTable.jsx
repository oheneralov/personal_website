import PropTypes from 'prop-types';
import SpeakButton from './SpeakButton';
import { wordType } from '../propTypes';

export default function WordTable({ caption, items }) {
  return (
    <table className="table">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Polish</th>
          <th scope="col">English</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.pl}>
            <td lang="pl">
              <strong>{item.pl}</strong> <SpeakButton text={item.pl} />
            </td>
            <td>{item.en}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

WordTable.propTypes = {
  caption: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(wordType).isRequired,
};
