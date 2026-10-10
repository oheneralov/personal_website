import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tetris from './Tetris';
import TETRIS_WORDS from '../data/tetris';
import {
  BASKET_COUNT,
  BOARD_ROWS,
  CORRECT_WORD_SCORE,
  HOUSE_PARTS,
  STREAK_FOR_BONUS,
  WORDS_PER_LEVEL,
} from '../lib/tetris';
import { createSeededRng } from '../test/helpers';

const SEED = 7;
// Long enough that no piece falls by itself during a test.
const NO_GRAVITY_MS = 600_000;
// Long enough to look at the congratulations, short enough to wait for the next level.
const LEVEL_UP_MS = 300;

afterEach(cleanup);

function renderTetris() {
  const user = userEvent.setup();
  const onWrongBasket = vi.fn();
  const { container } = render(
    <Tetris
      rng={createSeededRng(SEED)}
      baseFallMs={NO_GRAVITY_MS}
      levelUpMs={LEVEL_UP_MS}
      onWrongBasket={onWrongBasket}
    />,
  );
  return { user, container, onWrongBasket };
}

async function startTetris() {
  const rendered = renderTetris();
  await rendered.user.click(screen.getByRole('button', { name: 'Start' }));
  return rendered;
}

function fallingBlock(container) {
  return container.querySelector('.tetris__block--falling');
}

function currentWord(container) {
  const pl = fallingBlock(container).textContent;
  return TETRIS_WORDS.find((word) => word.pl === pl);
}

function baskets(container) {
  return [...container.querySelectorAll('.tetris__basket')];
}

function basketTitles(container) {
  return [...container.querySelectorAll('.tetris__basket-title')].map((title) => title.textContent);
}

function rightBasket(container) {
  return basketTitles(container).indexOf(currentWord(container).en);
}

function wrongBasket(container) {
  return (rightBasket(container) + 1) % BASKET_COUNT;
}

function stat(name) {
  return screen.getByText(name).closest('div').querySelector('dd').textContent;
}

function houseParts(container) {
  return container.querySelectorAll('.tetris__house-part');
}

function slots(container) {
  return [...container.querySelectorAll('.tetris__slot')];
}

/** Positions on the board (row by row) of the squares that hold a block. */
function blockPositions(container) {
  return slots(container).flatMap((slot, position) =>
    slot.classList.contains('tetris__block') ? [position] : [],
  );
}

function fallingPosition(container) {
  return slots(container).indexOf(fallingBlock(container));
}

/** The basket the falling block is above. */
function fallingBasket(container) {
  return fallingPosition(container) % BASKET_COUNT;
}

describe('Tetris', () => {
  it('explains the game and shows an empty board with four baskets before it starts', () => {
    const { container } = renderTetris();

    expect(screen.getByRole('button', { name: 'Start' })).toBeTruthy();
    expect(slots(container)).toHaveLength(BASKET_COUNT * BOARD_ROWS);
    expect(blockPositions(container)).toEqual([]);
    expect(baskets(container)).toHaveLength(BASKET_COUNT);
    expect(baskets(container).every((basket) => basket.disabled)).toBe(true);
  });

  it('starts with an empty plot for the house of the family', () => {
    const { container } = renderTetris();

    expect(houseParts(container)).toHaveLength(0);
    expect(screen.getByText('The family is waiting for their house.')).toBeTruthy();
  });

  it('writes a Polish word on the falling block and titles four baskets with translations', async () => {
    const { container } = await startTetris();

    const word = currentWord(container);
    expect(word).toBeTruthy();
    expect(blockPositions(container)).toEqual([fallingPosition(container)]);
    expect(new Set(basketTitles(container)).size).toBe(BASKET_COUNT);
    expect(basketTitles(container)).toContain(word.en);
  });

  it('shows the word only on its block', async () => {
    const { container } = await startTetris();
    const { pl } = currentWord(container);

    expect(screen.getAllByText(pl)).toEqual([fallingBlock(container)]);
  });

  it('collects the block and scores when the right basket is pressed', async () => {
    const { user, container, onWrongBasket } = await startTetris();
    const word = currentWord(container);

    await user.click(baskets(container)[rightBasket(container)]);

    expect(stat('Score')).toBe(String(CORRECT_WORD_SCORE));
    expect(stat('Words')).toBe('1');
    expect(stat('Streak')).toBe(`1 / ${STREAK_FOR_BONUS}`);
    // Only the next block is on the board: the collected one is gone.
    expect(blockPositions(container)).toEqual([fallingPosition(container)]);
    expect(container.querySelector('.tetris__review').textContent).toContain(
      `${word.pl} — ${word.en} (right basket)`,
    );
    expect(currentWord(container)).not.toBe(word);
    expect(onWrongBasket).not.toHaveBeenCalled();
  });

  it('leaves the block with its word in a wrong basket and plays the failure sound', async () => {
    const { user, container, onWrongBasket } = await startTetris();
    const word = currentWord(container);
    const basket = wrongBasket(container);

    await user.click(baskets(container)[basket]);

    expect(onWrongBasket).toHaveBeenCalledOnce();
    expect(stat('Score')).toBe('0');
    const settled = slots(container)[BASKET_COUNT * (BOARD_ROWS - 1) + basket];
    expect(settled.textContent).toBe(word.pl);
    expect(settled.classList.contains('tetris__block--falling')).toBe(false);
    expect(blockPositions(container)).toHaveLength(2);
    expect(container.querySelector('.tetris__review').textContent).toContain(
      `${word.pl} — ${word.en} (wrong basket)`,
    );
  });

  it('drops the block into a basket with the number keys', async () => {
    const { user, container } = await startTetris();

    await user.keyboard(String(rightBasket(container) + 1));

    expect(stat('Score')).toBe(String(CORRECT_WORD_SCORE));
  });

  it('steers the block to a basket with the arrow keys and drops it with the space bar', async () => {
    const { user, container } = await startTetris();
    const from = fallingBasket(container);
    const target = rightBasket(container);
    const steps = Math.abs(target - from);

    await user.keyboard((target < from ? '{ArrowLeft}' : '{ArrowRight}').repeat(steps));

    expect(fallingBasket(container)).toBe(target);

    await user.keyboard(' ');

    expect(stat('Words')).toBe('1');
  });

  it('moves the block with the on-screen buttons', async () => {
    const { user, container } = await startTetris();
    const before = fallingPosition(container);

    await user.click(screen.getByRole('button', { name: 'Move down' }));

    expect(fallingPosition(container)).toBe(before + BASKET_COUNT);
  });

  it('freezes the game and hides the word and the basket titles while it is paused', async () => {
    const { user, container } = await startTetris();
    const before = fallingPosition(container);
    const { pl } = currentWord(container);
    const titles = basketTitles(container);

    await user.click(screen.getByRole('button', { name: 'Pause' }));
    await user.keyboard('{ArrowDown}1');

    expect(screen.getByText('Pauza.')).toBeTruthy();
    expect(screen.queryByText(pl)).toBeNull();
    expect(basketTitles(container)).not.toEqual(titles);
    expect(fallingPosition(container)).toBe(before);

    await user.click(screen.getByRole('button', { name: 'Resume' }));
    await user.keyboard('{ArrowDown}');

    expect(fallingBlock(container).textContent).toBe(pl);
    expect(basketTitles(container)).toEqual(titles);
    expect(fallingPosition(container)).toBe(before + BASKET_COUNT);
  });

  it('congratulates on a completed level and waits before starting the next one', async () => {
    const { user, container } = await startTetris();

    const dropRight = async (remaining) => {
      if (remaining === 0) {
        return;
      }
      await user.keyboard(String(rightBasket(container) + 1));
      await dropRight(remaining - 1);
    };
    await dropRight(WORDS_PER_LEVEL);

    expect(screen.getByText('Gratulacje!')).toBeTruthy();
    expect(container.querySelector('.tetris__level-up').textContent).toContain(
      `Level 2 is next: the blocks fall faster and every word in the right basket scores ${CORRECT_WORD_SCORE * 2} points.`,
    );
    expect(container.querySelector('.tetris__level-up').textContent).toContain(
      `You built ${HOUSE_PARTS[0]} of the family’s house.`,
    );
    expect(houseParts(container)).toHaveLength(1);
    expect(screen.getByText(`The house: 1 of ${HOUSE_PARTS.length} parts built.`)).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: 'Loading next level' })).toBeTruthy();
    expect(stat('Level')).toBe('2');
    // The next block waits without its word, and nothing can be played yet.
    expect(fallingBlock(container).textContent).toBe('');
    expect(baskets(container).every((basket) => basket.disabled)).toBe(true);
    expect(screen.getByRole('button', { name: 'Pause' }).disabled).toBe(true);
    const waitingAt = fallingPosition(container);
    await user.keyboard('{ArrowDown}');
    expect(fallingPosition(container)).toBe(waitingAt);

    await waitFor(() => expect(screen.queryByText('Gratulacje!')).toBeNull());

    expect(currentWord(container)).toBeTruthy();
    expect(baskets(container).every((basket) => basket.disabled)).toBe(false);
    await user.keyboard(String(rightBasket(container) + 1));
    expect(stat('Words')).toBe(String(WORDS_PER_LEVEL + 1));
  });

  it('ends when a basket is full and can be played again', async () => {
    const { user, container } = await startTetris();

    // Every block goes into a wrong basket until one of them is full.
    const dropWrong = async (remaining) => {
      if (remaining === 0 || screen.queryByText('Koniec gry!')) {
        return;
      }
      await user.keyboard(String(wrongBasket(container) + 1));
      await dropWrong(remaining - 1);
    };
    await dropWrong(BASKET_COUNT * BOARD_ROWS);

    expect(screen.getByText('Koniec gry!')).toBeTruthy();
    expect(baskets(container).every((basket) => basket.disabled)).toBe(true);
    expect(screen.getByRole('button', { name: 'Pause' }).disabled).toBe(true);

    await user.click(screen.getByRole('button', { name: 'Play again' }));

    expect(screen.queryByText('Koniec gry!')).toBeNull();
    expect(blockPositions(container)).toEqual([fallingPosition(container)]);
    expect(currentWord(container)).toBeTruthy();
    expect(stat('Score')).toBe('0');
  });
});
