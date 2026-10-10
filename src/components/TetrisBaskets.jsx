import PropTypes from 'prop-types';

/**
 * The baskets under the board, one below every lane, each titled with an English translation.
 * A basket is also a button: pressing it drops the falling block into that basket.
 */
export default function TetrisBaskets({ titles, disabled, onChoose }) {
  return (
    <div className="tetris__baskets">
      {titles.map((title, basket) => (
        <button
          key={title}
          type="button"
          className="tetris__basket"
          disabled={disabled}
          onClick={(event) => {
            // Hands the keyboard back to the game, so Space does not press this basket again.
            event.currentTarget.blur();
            onChoose(basket);
          }}
        >
          <span className="tetris__basket-title">{title}</span>
        </button>
      ))}
    </div>
  );
}

TetrisBaskets.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.string).isRequired,
  disabled: PropTypes.bool.isRequired,
  onChoose: PropTypes.func.isRequired,
};
