import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  createEmptyProgress,
  getBrowserStorage,
  loadProgress,
  recordQuizResult,
  saveProgress,
  setWordKnown,
} from '../lib/progressStore';

const ProgressContext = createContext(null);

export function ProgressProvider({ children, storage = getBrowserStorage() }) {
  const [progress, setProgress] = useState(() => loadProgress(storage));

  useEffect(() => {
    saveProgress(storage, progress);
  }, [storage, progress]);

  const value = useMemo(
    () => ({
      progress,
      recordQuiz: (unitId, score, total) =>
        setProgress((current) => recordQuizResult(current, unitId, score, total)),
      markWord: (unitId, word, known) =>
        setProgress((current) => setWordKnown(current, unitId, word, known)),
      resetProgress: () => setProgress(createEmptyProgress()),
    }),
    [progress],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

ProgressProvider.propTypes = {
  children: PropTypes.node.isRequired,
  storage: PropTypes.shape({
    getItem: PropTypes.func.isRequired,
    setItem: PropTypes.func.isRequired,
  }),
};

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === null) {
    throw new Error('useProgress must be used inside a ProgressProvider');
  }
  return context;
}
