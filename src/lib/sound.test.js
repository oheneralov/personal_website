import { afterEach, describe, expect, it, vi } from 'vitest';
import playFailureSound from './sound';

function createFakeAudioContext() {
  const param = () => ({ setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() });
  const oscillator = { frequency: param(), connect: vi.fn(), start: vi.fn(), stop: vi.fn() };
  const gain = { gain: param(), connect: vi.fn() };
  const context = {
    state: 'suspended',
    currentTime: 2,
    destination: {},
    resume: vi.fn(),
    createOscillator: () => oscillator,
    createGain: () => gain,
  };
  return { context, oscillator, gain };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('playFailureSound', () => {
  // Runs first: once a context exists the module keeps reusing it.
  it('does nothing when the browser has no Web Audio support', () => {
    vi.stubGlobal('AudioContext', undefined);
    vi.stubGlobal('webkitAudioContext', undefined);

    expect(() => playFailureSound()).not.toThrow();
  });

  it('plays a short tone through the speakers', () => {
    const { context, oscillator, gain } = createFakeAudioContext();
    vi.stubGlobal(
      'AudioContext',
      vi.fn(() => context),
    );

    playFailureSound();

    expect(context.resume).toHaveBeenCalledOnce();
    expect(gain.connect).toHaveBeenCalledWith(context.destination);
    expect(oscillator.start).toHaveBeenCalledWith(2);
    expect(oscillator.stop.mock.calls[0][0]).toBeGreaterThan(2);
  });
});
