import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Game from './Game';
import ENCOUNTERS from '../data/game';
import { MAX_LIVES } from '../lib/game';
import { createSeededRng } from '../test/helpers';

const SEED = 11;
const [first] = ENCOUNTERS;

afterEach(cleanup);

function correctOption(encounter) {
  return encounter.options.find((option) => option.correct);
}

function wrongOptions(encounter) {
  return encounter.options.filter((option) => !option.correct);
}

/** Renders a game that walks on at once after a right answer, and starts it. */
async function startGame(walkOnDelayMs = 0) {
  const user = userEvent.setup();
  const onWrongAnswer = vi.fn();
  const { container } = render(
    <Game
      rng={createSeededRng(SEED)}
      walkOnDelayMs={walkOnDelayMs}
      onWrongAnswer={onWrongAnswer}
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Start walking' }));
  return { user, container, onWrongAnswer };
}

/** Answers the first `count` obstacles correctly, waiting each time for the boy to walk on. */
async function solveObstacles(user, count) {
  await ENCOUNTERS.slice(0, count).reduce(async (previous, encounter, position) => {
    await previous;
    await user.click(screen.getByRole('button', { name: correctOption(encounter).pl }));
    const next = ENCOUNTERS[position + 1];
    await screen.findByRole('heading', {
      name: next ? new RegExp(next.pl) : 'Success! Janek is home',
    });
  }, Promise.resolve());
}

describe('Game', () => {
  it('shows the first obstacle with its Polish options once the boy starts walking', async () => {
    await startGame();

    expect(screen.getByRole('heading', { name: new RegExp(first.pl) })).toBeTruthy();
    expect(screen.getByText(first.situation)).toBeTruthy();
    first.options.forEach((option) => {
      expect(screen.getByRole('button', { name: option.pl })).toBeTruthy();
    });
    expect(screen.queryByText(correctOption(first).en)).toBeNull();
  });

  it('draws the boy and the angry man as full-body figures', async () => {
    const user = userEvent.setup();
    const { container } = render(<Game rng={createSeededRng(SEED)} />);

    expect(container.querySelectorAll('.game__boy .figure--boy')).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Start walking' }));

    expect(container.querySelectorAll('.game__obstacle .figure--man')).toHaveLength(1);
  });

  it('draws the river with a boat when the boy reaches it', async () => {
    const riverIndex = ENCOUNTERS.findIndex((encounter) => encounter.id === 'river');
    const { user, container } = await startGame();

    await solveObstacles(user, riverIndex);

    expect(container.querySelectorAll('.game__river .game__boat')).toHaveLength(1);
    expect(container.querySelector('.game__obstacle')).toBeNull();
  });

  it('puts the boy in the boat when he crosses the river', async () => {
    const river = ENCOUNTERS.find((encounter) => encounter.id === 'river');
    const user = userEvent.setup();
    const rng = createSeededRng(SEED);
    const { container, rerender } = render(<Game rng={rng} walkOnDelayMs={0} />);
    await user.click(screen.getByRole('button', { name: 'Start walking' }));
    await solveObstacles(user, ENCOUNTERS.indexOf(river));
    // A long pause from here on keeps the crossing on screen for the assertions.
    rerender(<Game rng={rng} walkOnDelayMs={60_000} />);

    expect(container.querySelector('.game__boat .figure--boy')).toBeNull();
    expect(container.querySelectorAll('.game__boy .figure--boy')).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: correctOption(river).pl }));

    expect(container.querySelectorAll('.game__boat--crossed .figure--boy')).toHaveLength(1);
    expect(container.querySelector('.game__boy')).toBeNull();
  });

  it('shows a sun and flowers in the scene', () => {
    const { container } = render(<Game rng={createSeededRng(SEED)} />);

    expect(container.querySelectorAll('.game__sun')).toHaveLength(1);
    expect(container.querySelectorAll('.game__flower').length).toBeGreaterThan(0);
  });

  it('introduces the obstacle above the picture and offers the options below it', async () => {
    const { container } = render(<Game rng={createSeededRng(SEED)} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Start walking' }));
    const inOrder = [...container.querySelectorAll('h2, p, .game__scene, .option')];
    const position = (element) => inOrder.indexOf(element);
    const scene = position(container.querySelector('.game__scene'));

    expect(position(screen.getByRole('heading', { name: new RegExp(first.pl) }))).toBeLessThan(
      scene,
    );
    expect(position(screen.getByText(first.situation))).toBeLessThan(scene);
    expect(position(screen.getByRole('button', { name: first.options[0].pl }))).toBeGreaterThan(
      scene,
    );
  });

  it('does not show Filipino translations', async () => {
    const { container } = render(<Game rng={createSeededRng(SEED)} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Start walking' }));

    expect(container.querySelector('[lang="tl"]')).toBeNull();
  });

  it('takes a heart, plays the failure sound and reveals the meaning of a wrong option', async () => {
    const { user, onWrongAnswer } = await startGame();
    const [wrong] = wrongOptions(first);

    await user.click(screen.getByRole('button', { name: wrong.pl }));

    expect(onWrongAnswer).toHaveBeenCalledOnce();

    expect(
      screen.getByRole('img', { name: `Lives: ${MAX_LIVES - 1} of ${MAX_LIVES}` }),
    ).toBeTruthy();
    expect(screen.getByText('Not quite.')).toBeTruthy();
    expect(screen.getByText(wrong.en)).toBeTruthy();
    expect(screen.getByRole('button', { name: new RegExp(wrong.pl) }).disabled).toBe(true);
  });

  it('shows the result of a correct option without a failure sound', async () => {
    // A long pause keeps the result on screen for the assertions.
    const { user, onWrongAnswer } = await startGame(60_000);

    await user.click(screen.getByRole('button', { name: correctOption(first).pl }));

    expect(screen.getByText(new RegExp(first.success))).toBeTruthy();
    expect(
      screen.getByRole('progressbar', { name: 'Obstacles passed' }).getAttribute('aria-valuenow'),
    ).toBe('1');
    expect(onWrongAnswer).not.toHaveBeenCalled();
  });

  it('walks on to the next obstacle by itself after a correct option', async () => {
    const { user } = await startGame();

    await user.click(screen.getByRole('button', { name: correctOption(first).pl }));

    expect(await screen.findByRole('heading', { name: new RegExp(ENCOUNTERS[1].pl) })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Walk on' })).toBeNull();
  });

  it('ends the game when all hearts are lost and can be restarted', async () => {
    const { user } = await startGame();

    await wrongOptions(first)
      .slice(0, MAX_LIVES)
      .reduce(async (previous, option) => {
        await previous;
        await user.click(screen.getByRole('button', { name: option.pl }));
      }, Promise.resolve());

    expect(screen.getByText('Game over.')).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(screen.getByRole('button', { name: 'Start walking' })).toBeTruthy();
    expect(screen.getByRole('img', { name: `Lives: ${MAX_LIVES} of ${MAX_LIVES}` })).toBeTruthy();
  });

  it('brings the boy home when every obstacle is solved', async () => {
    const { user, container } = await startGame();

    await solveObstacles(user, ENCOUNTERS.length);

    expect(screen.getByRole('heading', { name: 'Success! Janek is home' })).toBeTruthy();
    expect(
      screen.getByText(
        `You solved ${ENCOUNTERS.length} of ${ENCOUNTERS.length} obstacles on the first try.`,
      ),
    ).toBeTruthy();
    expect(screen.getByText(/Sukces!/)).toBeTruthy();
    expect(container.querySelectorAll('.game__scene--home .game__house')).toHaveLength(1);
  });

  it.each([
    ['guard', '.game__gate'],
    ['bear', '.game__bear'],
    ['dragon', '.game__house'],
    ['dragon', '.game__flame'],
  ])('draws the %s scene with %s', async (id, selector) => {
    const targetIndex = ENCOUNTERS.findIndex((encounter) => encounter.id === id);
    const { user, container } = await startGame();

    await solveObstacles(user, targetIndex);

    expect(container.querySelectorAll(`.game__scene--${id} ${selector}`)).toHaveLength(1);
  });
});
