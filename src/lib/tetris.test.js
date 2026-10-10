import { describe, expect, it } from 'vitest';
import {
  BASE_FALL_MS,
  BASKET_COUNT,
  BLOCK_COLORS,
  BOARD_ROWS,
  CORRECT_WORD_SCORE,
  HOUSE_PARTS,
  STREAK_FOR_BONUS,
  TETRIS_STATUS,
  WORDS_PER_LEVEL,
  WORD_RESULT,
  boardWithPiece,
  createTetris,
  dropIntoBasket,
  fallDelay,
  hardDrop,
  houseStage,
  movePiece,
  startNextLevel,
  startTetris,
  tetrisLevel,
  tick,
  togglePause,
} from './tetris';
import { createSeededRng } from '../test/helpers';

const WORDS = [
  { pl: 'głowa', en: 'head' },
  { pl: 'kot', en: 'cat' },
  { pl: 'pies', en: 'dog' },
  { pl: 'dom', en: 'house' },
  { pl: 'woda', en: 'water' },
  { pl: 'chleb', en: 'bread' },
];

const BOTTOM = BOARD_ROWS - 1;
const SETTLED = { pl: 'ser', en: 'cheese', color: 'red' };

function playingGame(seed = 3) {
  return startTetris(createTetris(WORDS, createSeededRng(seed)));
}

function withPiece(game, row, lane) {
  return { ...game, piece: { ...game.piece, row, lane } };
}

/** Puts settled blocks into the given rows of one basket. */
function withBlocks(game, lane, rows) {
  const board = game.board.map((blocks, row) =>
    rows.includes(row) ? blocks.map((block, col) => (col === lane ? SETTLED : block)) : blocks,
  );
  return { ...game, board };
}

function countBlocks(board) {
  return board.flat().filter((block) => block !== null).length;
}

function rightBasket(game) {
  return game.options.indexOf(game.word.en);
}

function wrongBasket(game) {
  return game.options.findIndex((option) => option !== game.word.en);
}

describe('createTetris', () => {
  it('waits to be started with an empty board, a block and a word', () => {
    const game = createTetris(WORDS, createSeededRng(3));

    expect(game.status).toBe(TETRIS_STATUS.READY);
    expect(game.board).toHaveLength(BOARD_ROWS);
    expect(game.board[0]).toHaveLength(BASKET_COUNT);
    expect(countBlocks(game.board)).toBe(0);
    expect(game.piece.row).toBe(0);
    expect(game.piece.lane).toBeGreaterThanOrEqual(0);
    expect(game.piece.lane).toBeLessThan(BASKET_COUNT);
    expect(BLOCK_COLORS).toContain(game.piece.color);
    expect(WORDS).toContain(game.word);
    expect(game.review).toBeNull();
  });

  it('titles one basket with the right translation and the others with different ones', () => {
    const game = createTetris(WORDS, createSeededRng(3));

    expect(game.options).toHaveLength(BASKET_COUNT);
    expect(new Set(game.options).size).toBe(BASKET_COUNT);
    expect(game.options).toContain(game.word.en);
  });

  it.each([1, 2, 3, 4, 5, 6, 7, 8])('starts the block above a wrong basket (seed %i)', (seed) => {
    const game = createTetris(WORDS, createSeededRng(seed));

    expect(game.options[game.piece.lane]).not.toBe(game.word.en);
  });

  it('does nothing until the game is started', () => {
    const game = createTetris(WORDS, createSeededRng(3));

    expect(tick(game)).toBe(game);
    expect(movePiece(game, 1)).toBe(game);
    expect(hardDrop(game)).toBe(game);
    expect(dropIntoBasket(game, 0)).toBe(game);
  });
});

describe('boardWithPiece', () => {
  it('draws the falling block with its word where it is', () => {
    const game = withPiece(playingGame(), 4, 2);

    const rows = boardWithPiece(game);

    expect(rows[4][2]).toEqual({
      pl: game.word.pl,
      en: game.word.en,
      color: game.piece.color,
      falling: true,
    });
    expect(countBlocks(rows)).toBe(1);
    expect(countBlocks(game.board)).toBe(0);
  });
});

describe('movePiece', () => {
  it('moves the block over the neighbouring basket', () => {
    const game = withPiece(playingGame(), 0, 1);

    expect(movePiece(game, -1).piece.lane).toBe(0);
    expect(movePiece(game, 1).piece.lane).toBe(2);
  });

  it('stops the block at the edges of the board', () => {
    const atLeft = withPiece(playingGame(), 0, 0);
    const atRight = withPiece(playingGame(), 0, BASKET_COUNT - 1);

    expect(movePiece(atLeft, -1)).toBe(atLeft);
    expect(movePiece(atRight, 1)).toBe(atRight);
  });

  it('stops the block next to a basket that is filled higher than the block', () => {
    const game = withPiece(withBlocks(playingGame(), 1, [BOTTOM]), BOTTOM, 0);

    expect(movePiece(game, 1)).toBe(game);
  });
});

describe('landing in a basket', () => {
  it('lets the block fall one row at a time', () => {
    const game = withPiece(playingGame(), 0, 1);

    expect(tick(game, createSeededRng(1)).piece.row).toBe(1);
  });

  it('collects a block that lands in the right basket and scores it', () => {
    const start = playingGame();
    const game = withPiece(start, BOTTOM, rightBasket(start));

    const next = tick(game, createSeededRng(1));

    expect(countBlocks(next.board)).toBe(0);
    expect(next.score).toBe(CORRECT_WORD_SCORE);
    expect(next.correctCount).toBe(1);
    expect(next.streak).toBe(1);
    expect(next.review).toEqual({
      pl: game.word.pl,
      en: game.word.en,
      result: WORD_RESULT.CORRECT,
    });
  });

  it('leaves a block with its word in a wrong basket and resets the streak', () => {
    const start = { ...playingGame(), streak: 2 };
    const lane = wrongBasket(start);
    const game = withPiece(start, BOTTOM, lane);

    const next = tick(game, createSeededRng(1));

    expect(next.board[BOTTOM][lane]).toEqual({
      pl: game.word.pl,
      en: game.word.en,
      color: game.piece.color,
    });
    expect(countBlocks(next.board)).toBe(1);
    expect(next.score).toBe(0);
    expect(next.streak).toBe(0);
    expect(next.wrongCount).toBe(1);
    expect(next.review.result).toBe(WORD_RESULT.WRONG);
    expect(next.status).toBe(TETRIS_STATUS.PLAYING);
  });

  it('brings in the next block with a new word above a wrong basket after a landing', () => {
    const game = withPiece(playingGame(), BOTTOM, 0);

    const next = tick(game, createSeededRng(1));

    expect(next.piece.row).toBe(0);
    expect(next.options[next.piece.lane]).not.toBe(next.word.en);
    expect(next.word).not.toBe(game.word);
    expect(next.options).toContain(next.word.en);
  });

  it('collects a block that lands on the blocks in the right basket', () => {
    const start = playingGame();
    const lane = rightBasket(start);
    const game = withPiece(withBlocks(start, lane, [BOTTOM]), BOTTOM - 1, lane);

    const next = tick(game, createSeededRng(1));

    expect(next.correctCount).toBe(1);
    expect(countBlocks(next.board)).toBe(1);
  });

  it('removes the bottom row when the streak is complete', () => {
    const start = { ...playingGame(), streak: STREAK_FOR_BONUS - 1 };
    const lane = rightBasket(start);
    const other = (lane + 1) % BASKET_COUNT;
    const game = withPiece(withBlocks(start, other, [BOTTOM - 1, BOTTOM]), 0, lane);

    const next = hardDrop(game, createSeededRng(1));

    expect(next.streak).toBe(0);
    expect(countBlocks(next.board)).toBe(1);
    expect(next.board[BOTTOM][other]).toBe(SETTLED);
  });

  it('scores more at a higher level', () => {
    const start = { ...playingGame(), correctCount: WORDS_PER_LEVEL };
    const game = withPiece(start, 0, rightBasket(start));

    expect(hardDrop(game, createSeededRng(1)).score).toBe(CORRECT_WORD_SCORE * 2);
  });

  it('ends the game when a wrong basket is filled to the top', () => {
    const start = playingGame();
    const lane = wrongBasket(start);
    const filledRows = Array.from({ length: BOARD_ROWS - 1 }, (_, index) => BOTTOM - index);
    const game = withPiece(withBlocks(start, lane, filledRows), 0, lane);

    const next = hardDrop(game, createSeededRng(1));

    expect(next.status).toBe(TETRIS_STATUS.OVER);
    expect(next.review.result).toBe(WORD_RESULT.WRONG);
    expect(countBlocks(next.board)).toBe(BOARD_ROWS);
    expect(tick(next)).toBe(next);
  });
});

describe('hardDrop', () => {
  it('drops the block onto the blocks of its basket', () => {
    const start = playingGame();
    const lane = wrongBasket(start);
    const game = withPiece(withBlocks(start, lane, [BOTTOM]), 0, lane);

    const next = hardDrop(game, createSeededRng(1));

    expect(next.board[BOTTOM - 1][lane].pl).toBe(game.word.pl);
    expect(next.board[BOTTOM][lane]).toBe(SETTLED);
  });
});

describe('dropIntoBasket', () => {
  it('moves the block over the chosen basket and drops it in', () => {
    const start = playingGame();
    const lane = rightBasket(start);
    const game = withPiece(start, 0, (lane + 2) % BASKET_COUNT);

    const next = dropIntoBasket(game, lane, createSeededRng(1));

    expect(next.correctCount).toBe(1);
    expect(next.review.pl).toBe(game.word.pl);
  });

  it('does nothing when the block cannot reach the basket', () => {
    const game = withPiece(withBlocks(playingGame(), 3, [BOTTOM]), BOTTOM, 0);

    expect(dropIntoBasket(game, 3)).toBe(game);
  });

  it('ignores baskets that do not exist', () => {
    const game = playingGame();

    expect(dropIntoBasket(game, -1)).toBe(game);
    expect(dropIntoBasket(game, BASKET_COUNT)).toBe(game);
  });
});

describe('togglePause', () => {
  it('pauses and resumes the game', () => {
    const paused = togglePause(playingGame());

    expect(paused.status).toBe(TETRIS_STATUS.PAUSED);
    expect(tick(paused)).toBe(paused);
    expect(dropIntoBasket(paused, 0)).toBe(paused);
    expect(togglePause(paused).status).toBe(TETRIS_STATUS.PLAYING);
  });

  it('does not start or revive a game', () => {
    const ready = createTetris(WORDS, createSeededRng(3));
    const over = { ...playingGame(), status: TETRIS_STATUS.OVER };

    expect(togglePause(ready)).toBe(ready);
    expect(togglePause(over)).toBe(over);
  });
});

describe('levels', () => {
  it('goes up a level for every ten words in the right basket', () => {
    expect(tetrisLevel({ correctCount: 0 })).toBe(1);
    expect(tetrisLevel({ correctCount: WORDS_PER_LEVEL - 1 })).toBe(1);
    expect(tetrisLevel({ correctCount: WORDS_PER_LEVEL })).toBe(2);
  });

  it('stops the game when the last word of a level lands in the right basket', () => {
    const start = { ...playingGame(), correctCount: WORDS_PER_LEVEL - 1 };
    const game = withPiece(start, 0, rightBasket(start));

    const next = hardDrop(game, createSeededRng(1));

    expect(next.status).toBe(TETRIS_STATUS.LEVEL_UP);
    expect(tetrisLevel(next)).toBe(2);
    expect(tick(next)).toBe(next);
    expect(movePiece(next, 1)).toBe(next);
    expect(togglePause(next)).toBe(next);
  });

  it('keeps playing after a right basket that does not complete a level', () => {
    const start = { ...playingGame(), correctCount: WORDS_PER_LEVEL - 2 };
    const game = withPiece(start, 0, rightBasket(start));

    expect(hardDrop(game, createSeededRng(1)).status).toBe(TETRIS_STATUS.PLAYING);
  });

  it('does not go up a level for a block in a wrong basket', () => {
    const start = { ...playingGame(), correctCount: WORDS_PER_LEVEL - 1 };
    const game = withPiece(start, 0, wrongBasket(start));

    expect(hardDrop(game, createSeededRng(1)).status).toBe(TETRIS_STATUS.PLAYING);
  });

  it('plays the next level once it is started', () => {
    const waiting = { ...playingGame(), status: TETRIS_STATUS.LEVEL_UP };
    const playing = playingGame();

    expect(startNextLevel(waiting).status).toBe(TETRIS_STATUS.PLAYING);
    expect(startNextLevel(playing)).toBe(playing);
  });

  it('builds one part of the house for every completed level until it is finished', () => {
    const afterLevels = (levels) => houseStage({ correctCount: WORDS_PER_LEVEL * levels });

    expect(houseStage({ correctCount: WORDS_PER_LEVEL - 1 })).toBe(0);
    expect(afterLevels(1)).toBe(1);
    expect(afterLevels(HOUSE_PARTS.length)).toBe(HOUSE_PARTS.length);
    expect(afterLevels(HOUSE_PARTS.length + 3)).toBe(HOUSE_PARTS.length);
  });

  it('falls faster at higher levels, down to a limit', () => {
    expect(fallDelay(1)).toBe(BASE_FALL_MS);
    expect(fallDelay(2)).toBeLessThan(fallDelay(1));
    expect(fallDelay(100)).toBe(fallDelay(200));
    expect(fallDelay(100)).toBeGreaterThan(0);
  });
});
