export const STORAGE_KEY = 'polish-course:progress';
export const PASS_PERCENT = 70;

const SCHEMA_VERSION = 1;
const EMPTY_UNIT = Object.freeze({ knownWords: [], bestPercent: 0, attempts: 0 });

export function createEmptyProgress() {
  return { version: SCHEMA_VERSION, units: {} };
}

/** localStorage can be missing or throw (privacy modes, blocked site data). */
export function getBrowserStorage() {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch (error) {
    if (error instanceof DOMException) {
      return null;
    }
    throw error;
  }
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeUnit(raw) {
  if (!isPlainObject(raw)) {
    return { ...EMPTY_UNIT };
  }
  const percent = Number.isFinite(raw.bestPercent) ? raw.bestPercent : 0;
  return {
    knownWords: Array.isArray(raw.knownWords)
      ? raw.knownWords.filter((word) => typeof word === 'string')
      : [],
    bestPercent: Math.min(100, Math.max(0, Math.round(percent))),
    attempts: Number.isInteger(raw.attempts) && raw.attempts > 0 ? raw.attempts : 0,
  };
}

/** Reads saved progress, falling back to an empty state when it is missing or corrupt. */
export function loadProgress(storage) {
  if (!storage) {
    return createEmptyProgress();
  }
  let parsed;
  try {
    parsed = JSON.parse(storage.getItem(STORAGE_KEY));
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof DOMException) {
      return createEmptyProgress();
    }
    throw error;
  }
  if (!isPlainObject(parsed) || !isPlainObject(parsed.units)) {
    return createEmptyProgress();
  }
  return {
    version: SCHEMA_VERSION,
    units: Object.fromEntries(
      Object.entries(parsed.units).map(([unitId, unit]) => [unitId, sanitizeUnit(unit)]),
    ),
  };
}

/** Returns false when the progress could not be persisted (no storage, or quota exceeded). */
export function saveProgress(storage, progress) {
  if (!storage) {
    return false;
  }
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (error) {
    if (error instanceof DOMException) {
      return false;
    }
    throw error;
  }
}

export function getUnitProgress(progress, unitId) {
  return progress.units[unitId] ?? EMPTY_UNIT;
}

export function isUnitCompleted(progress, unitId) {
  return getUnitProgress(progress, unitId).bestPercent >= PASS_PERCENT;
}

export function countCompletedUnits(progress, units) {
  return units.filter((unit) => isUnitCompleted(progress, unit.id)).length;
}

function updateUnit(progress, unitId, changes) {
  return {
    ...progress,
    units: {
      ...progress.units,
      [unitId]: { ...getUnitProgress(progress, unitId), ...changes },
    },
  };
}

export function toPercent(score, total) {
  return total > 0 ? Math.round((score / total) * 100) : 0;
}

export function recordQuizResult(progress, unitId, score, total) {
  const current = getUnitProgress(progress, unitId);
  return updateUnit(progress, unitId, {
    bestPercent: Math.max(current.bestPercent, toPercent(score, total)),
    attempts: current.attempts + 1,
  });
}

export function setWordKnown(progress, unitId, word, known) {
  const current = getUnitProgress(progress, unitId).knownWords;
  if (current.includes(word) === known) {
    return progress;
  }
  return updateUnit(progress, unitId, {
    knownWords: known ? [...current, word] : current.filter((other) => other !== word),
  });
}
