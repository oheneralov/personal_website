import { shuffle } from './quiz';

// One basket per English translation offered for a word; the board has a lane above each.
export const BASKET_COUNT = 4;
// How many blocks fit into a lane, one on top of the other.
export const BOARD_ROWS = 12;
export const CORRECT_WORD_SCORE = 100;
// This many words in the right basket in a row remove the bottom row of blocks.
export const STREAK_FOR_BONUS = 3;
export const WORDS_PER_LEVEL = 10;
export const BASE_FALL_MS = 800;
// How long the congratulations are shown before the next level begins.
export const LEVEL_UP_MS = 4000;

// What the family's house is built of, in building order: every completed level adds a part.
export const HOUSE_PARTS = [
  'the foundation',
  'the walls',
  'the roof',
  'the door and the windows',
  'the chimney',
];

const MIN_FALL_MS = 120;
const FALL_SPEEDUP = 0.85;

// Yellow is left to the baskets.
export const BLOCK_COLORS = ['cyan', 'purple', 'green', 'red', 'blue'];

export const TETRIS_STATUS = {
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  // A level is complete; the game waits for `startNextLevel`.
  LEVEL_UP: 'level-up',
  OVER: 'over',
};

export const WORD_RESULT = {
  CORRECT: 'correct',
  WRONG: 'wrong',
};

function pick(items, rng) {
  return items[Math.floor(rng() * items.length)];
}

function emptyRows(count) {
  return Array.from({ length: count }, () => Array(BASKET_COUNT).fill(null));
}

/** Whether the falling block is on the board and not inside a settled block. */
function fits(board, piece) {
  return (
    piece.lane >= 0 &&
    piece.lane < BASKET_COUNT &&
    piece.row < BOARD_ROWS &&
    board[piece.row][piece.lane] === null
  );
}

/** Picks the next word (never the same one twice in a row) and the titles of the baskets. */
function drawWord(words, previous, rng) {
  const word = pick(
    words.filter((candidate) => candidate !== previous),
    rng,
  );
  const distractors = shuffle(
    words.filter((candidate) => candidate.en !== word.en),
    rng,
  )
    .slice(0, BASKET_COUNT - 1)
    .map((candidate) => candidate.en);
  return { word, options: shuffle([word.en, ...distractors], rng) };
}

/**
 * Brings in the next block with a new word and new basket titles. The block starts above a wrong
 * basket, so it never reaches the right one unless the learner steers it there.
 */
function spawnPiece(game, rng) {
  const { word, options } = drawWord(game.words, game.word, rng);
  const wrongLanes = options.flatMap((option, lane) => (option === word.en ? [] : [lane]));
  return {
    ...game,
    word,
    options,
    piece: { row: 0, lane: pick(wrongLanes, rng), color: pick(BLOCK_COLORS, rng) },
  };
}

/**
 * Creates a game that waits to be started. `words` are `{ pl, en }` pairs with unique English
 * translations; `rng` is injectable for tests.
 */
export function createTetris(words, rng = Math.random) {
  return spawnPiece(
    {
      words,
      // Rows of lanes, top row first; a square holds a settled block `{ pl, en, color }` or null.
      board: emptyRows(BOARD_ROWS),
      piece: null,
      // The word written on the falling block.
      word: null,
      // The titles of the baskets, left to right: English translations, one of them right.
      options: [],
      // The word of the block that landed last, kept so the learner can see its translation.
      review: null,
      status: TETRIS_STATUS.READY,
      score: 0,
      streak: 0,
      correctCount: 0,
      wrongCount: 0,
    },
    rng,
  );
}

export function tetrisLevel(game) {
  return 1 + Math.floor(game.correctCount / WORDS_PER_LEVEL);
}

/** How many parts of the house stand: one for every completed level, until it is finished. */
export function houseStage(game) {
  return Math.min(tetrisLevel(game) - 1, HOUSE_PARTS.length);
}

/** Milliseconds between two steps of the falling block; every level is a little faster. */
export function fallDelay(level, baseMs = BASE_FALL_MS) {
  return Math.max(MIN_FALL_MS, Math.round(baseMs * FALL_SPEEDUP ** (level - 1)));
}

/** The board with the falling block (marked `falling`) drawn on it, for display. */
export function boardWithPiece(game) {
  const { row, lane, color } = game.piece;
  const rows = game.board.map((blocks) => [...blocks]);
  rows[row][lane] = { pl: game.word.pl, en: game.word.en, color, falling: true };
  return rows;
}

export function startTetris(game) {
  return game.status === TETRIS_STATUS.READY ? { ...game, status: TETRIS_STATUS.PLAYING } : game;
}

/** Begins the level the game has been waiting to start since the last one was completed. */
export function startNextLevel(game) {
  return game.status === TETRIS_STATUS.LEVEL_UP ? { ...game, status: TETRIS_STATUS.PLAYING } : game;
}

export function togglePause(game) {
  if (game.status === TETRIS_STATUS.PLAYING) {
    return { ...game, status: TETRIS_STATUS.PAUSED };
  }
  return game.status === TETRIS_STATUS.PAUSED ? { ...game, status: TETRIS_STATUS.PLAYING } : game;
}

/**
 * Moves the falling block `baskets` to the right (negative: to the left). It stays where it is at
 * the edge of the board and next to a basket filled higher than the block.
 */
export function movePiece(game, baskets) {
  if (game.status !== TETRIS_STATUS.PLAYING) {
    return game;
  }
  const piece = { ...game.piece, lane: game.piece.lane + baskets };
  return fits(game.board, piece) ? { ...game, piece } : game;
}

function removeBottomRow(board) {
  return [...emptyRows(1), ...board.slice(0, -1)];
}

/**
 * Lands the block in the basket below it. In the basket titled with the translation of its word
 * the block disappears and scores, and every `STREAK_FOR_BONUS`th right basket in a row removes
 * the bottom row; the block that completes a level stops the game until `startNextLevel`. In any
 * other basket the block stays, and a basket filled to the top ends the game.
 */
function landPiece(game, rng) {
  const { row, lane, color } = game.piece;
  const correct = game.options[lane] === game.word.en;
  const review = {
    pl: game.word.pl,
    en: game.word.en,
    result: correct ? WORD_RESULT.CORRECT : WORD_RESULT.WRONG,
  };
  if (correct) {
    const streak = game.streak + 1;
    const bonus = streak === STREAK_FOR_BONUS;
    const collected = {
      ...game,
      review,
      score: game.score + CORRECT_WORD_SCORE * tetrisLevel(game),
      correctCount: game.correctCount + 1,
      streak: bonus ? 0 : streak,
      board: bonus ? removeBottomRow(game.board) : game.board,
    };
    const levelUp = tetrisLevel(collected) > tetrisLevel(game);
    return spawnPiece(levelUp ? { ...collected, status: TETRIS_STATUS.LEVEL_UP } : collected, rng);
  }
  const board = game.board.map((blocks) => [...blocks]);
  board[row][lane] = { pl: game.word.pl, en: game.word.en, color };
  const landed = { ...game, board, review, streak: 0, wrongCount: game.wrongCount + 1 };
  return row === 0 ? { ...landed, status: TETRIS_STATUS.OVER } : spawnPiece(landed, rng);
}

/** One step of gravity: the block falls a row, or lands in its basket when it cannot. */
export function tick(game, rng = Math.random) {
  if (game.status !== TETRIS_STATUS.PLAYING) {
    return game;
  }
  const piece = { ...game.piece, row: game.piece.row + 1 };
  return fits(game.board, piece) ? { ...game, piece } : landPiece(game, rng);
}

/** Drops the falling block straight down into the basket below it. */
export function hardDrop(game, rng = Math.random) {
  if (game.status !== TETRIS_STATUS.PLAYING) {
    return game;
  }
  let { piece } = game;
  while (fits(game.board, { ...piece, row: piece.row + 1 })) {
    piece = { ...piece, row: piece.row + 1 };
  }
  return landPiece({ ...game, piece }, rng);
}

/**
 * Moves the falling block over the basket with the given index and drops it in. Nothing happens
 * when the block cannot get there because a basket is filled higher than the block.
 */
export function dropIntoBasket(game, basket, rng = Math.random) {
  if (game.status !== TETRIS_STATUS.PLAYING) {
    return game;
  }
  const piece = { ...game.piece, lane: basket };
  return fits(game.board, piece) ? hardDrop({ ...game, piece }, rng) : game;
}
