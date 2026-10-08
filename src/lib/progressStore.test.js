import { describe, expect, it } from 'vitest';
import {
  STORAGE_KEY,
  countCompletedUnits,
  createEmptyProgress,
  getUnitProgress,
  isUnitCompleted,
  loadProgress,
  recordQuizResult,
  saveProgress,
  setWordKnown,
} from './progressStore';
import { createMemoryStorage } from '../test/helpers';

describe('loadProgress', () => {
  it('returns empty progress when nothing is stored', () => {
    expect(loadProgress(createMemoryStorage())).toEqual(createEmptyProgress());
  });

  it('returns empty progress when storage is unavailable', () => {
    expect(loadProgress(null)).toEqual(createEmptyProgress());
  });

  it('returns empty progress when the stored value is not valid JSON', () => {
    const storage = createMemoryStorage({ [STORAGE_KEY]: '{not json' });
    expect(loadProgress(storage)).toEqual(createEmptyProgress());
  });

  it('returns empty progress when the stored value has the wrong shape', () => {
    const storage = createMemoryStorage({ [STORAGE_KEY]: '["a1-1"]' });
    expect(loadProgress(storage)).toEqual(createEmptyProgress());
  });

  it('sanitizes malformed unit entries instead of trusting them', () => {
    const stored = {
      units: {
        'a1-1': { knownWords: ['tak', 5, null], bestPercent: 250, attempts: -2 },
        'a1-2': 'broken',
      },
    };
    const storage = createMemoryStorage({ [STORAGE_KEY]: JSON.stringify(stored) });

    const progress = loadProgress(storage);

    expect(progress.units['a1-1']).toEqual({ knownWords: ['tak'], bestPercent: 100, attempts: 0 });
    expect(progress.units['a1-2']).toEqual({ knownWords: [], bestPercent: 0, attempts: 0 });
  });

  it('round-trips progress written by saveProgress', () => {
    const storage = createMemoryStorage();
    const progress = recordQuizResult(createEmptyProgress(), 'a1-1', 9, 10);

    expect(saveProgress(storage, progress)).toBe(true);

    expect(loadProgress(storage)).toEqual(progress);
  });
});

describe('saveProgress', () => {
  it('reports failure when storage is unavailable', () => {
    expect(saveProgress(null, createEmptyProgress())).toBe(false);
  });

  it('reports failure instead of throwing when the quota is exceeded', () => {
    const storage = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException('full', 'QuotaExceededError');
      },
    };
    expect(saveProgress(storage, createEmptyProgress())).toBe(false);
  });
});

describe('recordQuizResult', () => {
  it('stores the score as a percentage and counts the attempt', () => {
    const progress = recordQuizResult(createEmptyProgress(), 'a1-1', 10, 13);
    expect(getUnitProgress(progress, 'a1-1')).toMatchObject({ bestPercent: 77, attempts: 1 });
  });

  it('keeps the best score when a later attempt is worse', () => {
    let progress = recordQuizResult(createEmptyProgress(), 'a1-1', 12, 13);
    progress = recordQuizResult(progress, 'a1-1', 3, 13);
    expect(getUnitProgress(progress, 'a1-1')).toMatchObject({ bestPercent: 92, attempts: 2 });
  });

  it('does not mutate the previous state or drop known words', () => {
    const before = setWordKnown(createEmptyProgress(), 'a1-1', 'tak', true);

    const after = recordQuizResult(before, 'a1-1', 13, 13);

    expect(getUnitProgress(before, 'a1-1').attempts).toBe(0);
    expect(getUnitProgress(after, 'a1-1').knownWords).toEqual(['tak']);
  });
});

describe('unit completion', () => {
  it('requires at least 70%', () => {
    const failed = recordQuizResult(createEmptyProgress(), 'a1-1', 9, 13);
    const passed = recordQuizResult(createEmptyProgress(), 'a1-1', 7, 10);

    expect(isUnitCompleted(failed, 'a1-1')).toBe(false);
    expect(isUnitCompleted(passed, 'a1-1')).toBe(true);
    expect(isUnitCompleted(passed, 'a1-2')).toBe(false);
  });

  it('counts completed units in a list', () => {
    let progress = recordQuizResult(createEmptyProgress(), 'a1-1', 10, 10);
    progress = recordQuizResult(progress, 'a1-2', 1, 10);

    expect(countCompletedUnits(progress, [{ id: 'a1-1' }, { id: 'a1-2' }, { id: 'a1-3' }])).toBe(1);
  });
});

describe('setWordKnown', () => {
  it('adds and removes a word', () => {
    const added = setWordKnown(createEmptyProgress(), 'a1-1', 'tak', true);
    const removed = setWordKnown(added, 'a1-1', 'tak', false);

    expect(getUnitProgress(added, 'a1-1').knownWords).toEqual(['tak']);
    expect(getUnitProgress(removed, 'a1-1').knownWords).toEqual([]);
  });

  it('returns the same state when nothing changes', () => {
    const progress = setWordKnown(createEmptyProgress(), 'a1-1', 'tak', true);
    expect(setWordKnown(progress, 'a1-1', 'tak', true)).toBe(progress);
  });
});
