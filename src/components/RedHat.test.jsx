import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RedHat from './RedHat';
import RedHatScene from './RedHatScene';
import RED_HAT_SCENES, { SPEAKERS } from '../data/redHat';

// Short enough that the whole tale plays within a test.
const LINE_MS = 15;
const quickLines = () => LINE_MS;
const LINES = RED_HAT_SCENES.flatMap((scene) => scene.lines);

afterEach(cleanup);

function renderRedHat() {
  const speak = vi.fn();
  const stop = vi.fn();
  const rendered = render(<RedHat durationOf={quickLines} speak={speak} stop={stop} />);
  return { ...rendered, user: userEvent.setup(), speak, stop };
}

describe('RedHat', () => {
  it('waits for Start without saying anything', () => {
    const { speak } = renderRedHat();

    expect(screen.getByRole('button', { name: 'Start' })).toBeTruthy();
    expect(speak).not.toHaveBeenCalled();
  });

  it('shows and voices the first line in Polish with its translation after Start', async () => {
    const { user, speak } = renderRedHat();
    const [first] = LINES;

    await user.click(screen.getByRole('button', { name: 'Start' }));

    expect(screen.getByText(first.pl)).toBeTruthy();
    expect(screen.getByText(first.en)).toBeTruthy();
    expect(speak).toHaveBeenCalledWith(
      first.pl,
      expect.objectContaining({
        pitch: SPEAKERS[first.speaker].pitch,
        rate: SPEAKERS[first.speaker].rate,
      }),
    );
    expect(screen.queryByRole('button', { name: 'Start' })).toBeNull();
  });

  it('plays the whole tale by itself, scene by scene, and can be watched again', async () => {
    const { user, speak, container } = renderRedHat();

    await user.click(screen.getByRole('button', { name: 'Start' }));
    await waitFor(() => expect(container.querySelector('.red-hat__scene--wolf')).toBeTruthy(), {
      timeout: 5000,
    });
    await waitFor(() => expect(screen.getByText('Koniec!')).toBeTruthy(), { timeout: 5000 });

    expect(speak.mock.calls.map(([text]) => text)).toEqual(LINES.map((line) => line.pl));

    await user.click(screen.getByRole('button', { name: 'Watch again' }));

    expect(screen.getByText(LINES[0].pl)).toBeTruthy();
  });

  it('waits for a line to be read to the end before going on', async () => {
    let finishSpeech = null;
    const speak = vi.fn((text, { onEnd }) => {
      finishSpeech = onEnd;
      return true;
    });
    const user = userEvent.setup();
    render(<RedHat durationOf={quickLines} pauseMs={0} speak={speak} stop={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Start' }));
    // Far longer than the line's own duration, but its speech has not ended yet.
    await new Promise((resolve) => {
      setTimeout(resolve, LINE_MS * 10);
    });

    expect(screen.getByText(LINES[0].pl)).toBeTruthy();
    expect(speak).toHaveBeenCalledOnce();

    finishSpeech();

    await waitFor(() => expect(screen.getByText(LINES[1].pl)).toBeTruthy());
  });

  it('stops speaking when the page is left', () => {
    const { unmount, stop } = renderRedHat();

    unmount();

    expect(stop).toHaveBeenCalled();
  });

  it.each(RED_HAT_SCENES.map((scene) => scene.id))('draws the scene %s with the girl', (id) => {
    const { container } = render(<RedHatScene sceneId={id} speaker="girl" />);

    expect(container.querySelector(`.red-hat__scene--${id} .red-hat__girl`)).toBeTruthy();
  });

  it.each([
    ['home', 'mother'],
    ['wolf', 'wolf'],
    ['hunter', 'grandma'],
    ['hunter', 'hunter'],
  ])('draws the %s scene with the whole %s, not only a head', (id, figure) => {
    const { container } = render(<RedHatScene sceneId={id} />);

    expect(container.querySelector(`.red-hat__prop svg.figure--${figure}`)).toBeTruthy();
  });

  it('puts the sun over the outdoor scenes but not in the room', () => {
    const forest = render(<RedHatScene sceneId="forest" />);
    expect(forest.container.querySelector('.red-hat__sun')).toBeTruthy();
    forest.unmount();

    const room = render(<RedHatScene sceneId="bed" />);
    expect(room.container.querySelector('.red-hat__sun')).toBeNull();
  });

  it("lays the wolf on Grandma's bed and moves only him while he speaks", () => {
    const { container } = render(<RedHatScene sceneId="bed" speaker="wolf" />);
    const sleeper = container.querySelector('.red-hat__bed .red-hat__bed-sleeper');

    expect(sleeper.querySelector('svg.figure--wolf')).toBeTruthy();
    expect(sleeper.classList.contains('red-hat__speaking')).toBe(true);
    expect(container.querySelector('.red-hat__bed').closest('.red-hat__speaking')).toBeNull();
  });
});
