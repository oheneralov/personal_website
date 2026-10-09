import { afterEach, describe, expect, it } from 'vitest';
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

async function startGame() {
  const user = userEvent.setup();
  render(<Game rng={createSeededRng(SEED)} />);
  await user.click(screen.getByRole('button', { name: 'Start walking' }));
  return user;
}

describe('Game', () => {
  it('shows the first obstacle with its Polish options once the boy starts walking', async () => {
    await startGame();

    expect(screen.getByRole('heading', { name: new RegExp(first.pl) })).toBeTruthy();
    expect(screen.getByText(first.situation).nextElementSibling.textContent).toBe(
      first.situationTl,
    );
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
    const user = userEvent.setup();
    const { container } = render(<Game rng={createSeededRng(SEED)} />);
    await user.click(screen.getByRole('button', { name: 'Start walking' }));

    await ENCOUNTERS.slice(0, riverIndex).reduce(async (previous, encounter) => {
      await previous;
      await user.click(screen.getByRole('button', { name: correctOption(encounter).pl }));
      await user.click(screen.getByRole('button', { name: 'Walk on' }));
    }, Promise.resolve());

    expect(container.querySelectorAll('.game__river .game__boat')).toHaveLength(1);
    expect(container.querySelector('.game__obstacle')).toBeNull();
  });

  it('shows a sun and flowers in the scene', () => {
    const { container } = render(<Game rng={createSeededRng(SEED)} />);

    expect(container.querySelectorAll('.game__sun')).toHaveLength(1);
    expect(container.querySelectorAll('.game__flower').length).toBeGreaterThan(0);
  });

  it('takes a heart and reveals the meaning of a wrong option', async () => {
    const user = await startGame();
    const [wrong] = wrongOptions(first);

    await user.click(screen.getByRole('button', { name: wrong.pl }));

    expect(
      screen.getByRole('img', { name: `Lives: ${MAX_LIVES - 1} of ${MAX_LIVES}` }),
    ).toBeTruthy();
    expect(screen.getByText('Not quite.')).toBeTruthy();
    expect(screen.getByText(wrong.en)).toBeTruthy();
    expect(screen.getByRole('button', { name: new RegExp(wrong.pl) }).disabled).toBe(true);
  });

  it('clears the obstacle after a correct option and walks on to the next one', async () => {
    const user = await startGame();

    await user.click(screen.getByRole('button', { name: correctOption(first).pl }));

    expect(screen.getByText(new RegExp(first.success))).toBeTruthy();
    expect(
      screen.getByRole('progressbar', { name: 'Obstacles passed' }).getAttribute('aria-valuenow'),
    ).toBe('1');

    await user.click(screen.getByRole('button', { name: 'Walk on' }));

    expect(screen.getByRole('heading', { name: new RegExp(ENCOUNTERS[1].pl) })).toBeTruthy();
  });

  it('ends the game when all hearts are lost and can be restarted', async () => {
    const user = await startGame();

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
    const user = userEvent.setup();
    const { container } = render(<Game rng={createSeededRng(SEED)} />);
    await user.click(screen.getByRole('button', { name: 'Start walking' }));

    await ENCOUNTERS.reduce(async (previous, encounter, position) => {
      await previous;
      await user.click(screen.getByRole('button', { name: correctOption(encounter).pl }));
      const isLast = position === ENCOUNTERS.length - 1;
      await user.click(screen.getByRole('button', { name: isLast ? 'Go home' : 'Walk on' }));
    }, Promise.resolve());

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
    const user = userEvent.setup();
    const { container } = render(<Game rng={createSeededRng(SEED)} />);
    await user.click(screen.getByRole('button', { name: 'Start walking' }));

    await ENCOUNTERS.slice(0, targetIndex).reduce(async (previous, encounter) => {
      await previous;
      await user.click(screen.getByRole('button', { name: correctOption(encounter).pl }));
      await user.click(screen.getByRole('button', { name: 'Walk on' }));
    }, Promise.resolve());

    expect(container.querySelectorAll(`.game__scene--${id} ${selector}`)).toHaveLength(1);
  });
});
