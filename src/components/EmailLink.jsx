import { useState } from 'react';
import PropTypes from 'prop-types';

const reverse = (text) => [...text].reverse().join('');

/**
 * Shows an email address only after the visitor asks for it. The address is passed in two
 * reversed halves and assembled on click, so it appears neither in the shipped source nor in the
 * rendered page that address-harvesting bots scan.
 */
export default function EmailLink({ reversedUser, reversedDomain }) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <button type="button" className="link-button" onClick={() => setRevealed(true)}>
        Show email
      </button>
    );
  }

  const address = `${reverse(reversedUser)}@${reverse(reversedDomain)}`;
  return <a href={`mailto:${address}`}>{address}</a>;
}

EmailLink.propTypes = {
  reversedUser: PropTypes.string.isRequired,
  reversedDomain: PropTypes.string.isRequired,
};
