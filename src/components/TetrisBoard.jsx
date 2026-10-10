import PropTypes from 'prop-types';

function slotClass(block, lane) {
  if (!block) {
    // Every other lane is marked, so the lanes above the baskets can be told apart.
    return lane % 2 === 1 ? 'tetris__slot tetris__slot--shaded' : 'tetris__slot';
  }
  const falling = block.falling ? ' tetris__block--falling' : '';
  return `tetris__slot tetris__block tetris__block--${block.color}${falling}`;
}

/**
 * Draws the lanes above the baskets with their blocks. Every block shows its Polish word; with
 * `hideWords` the falling block is blank, which keeps a paused game from being a time to think.
 */
export default function TetrisBoard({ rows, hideWords = false }) {
  return (
    <div className="tetris__board" role="group" aria-label="Game board">
      {rows.flatMap((blocks, row) =>
        blocks.map((block, lane) => (
          <span
            // eslint-disable-next-line react/no-array-index-key -- a square is identified by its position
            key={`${row}-${lane}`}
            className={slotClass(block, lane)}
            lang={block ? 'pl' : undefined}
            title={block && !block.falling ? block.en : undefined}
          >
            {block && !(block.falling && hideWords) ? block.pl : null}
          </span>
        )),
      )}
    </div>
  );
}

TetrisBoard.propTypes = {
  // The block in every square of every row, or null for an empty square.
  rows: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        pl: PropTypes.string.isRequired,
        en: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        falling: PropTypes.bool,
      }),
    ),
  ).isRequired,
  hideWords: PropTypes.bool,
};
