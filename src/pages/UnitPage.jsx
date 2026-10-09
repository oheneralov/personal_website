import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import NotFoundPage from './NotFoundPage';
import Flashcards from '../components/Flashcards';
import GrammarSection from '../components/GrammarSection';
import Quiz from '../components/Quiz';
import WordTable from '../components/WordTable';
import { findUnit } from '../data/course';
import { useProgress } from '../context/ProgressContext';
import { getUnitProgress, isUnitCompleted } from '../lib/progressStore';
import { unitType } from '../propTypes';

// Study material on the first row, practice activities on the second.
const TAB_ROWS = [
  {
    id: 'study',
    tabs: [
      { id: 'learn', label: 'Vocabulary' },
      { id: 'grammar', label: 'Grammar' },
    ],
  },
  {
    id: 'practice',
    tabs: [
      { id: 'flashcards', label: 'Flashcards' },
      { id: 'quiz', label: 'Quiz' },
    ],
  },
];

function UnitContent({ unit, levelId, levelName, nextUnit = null }) {
  const [activeTab, setActiveTab] = useState(TAB_ROWS[0].tabs[0].id);
  const { progress, recordQuiz, markWord } = useProgress();
  const unitProgress = getUnitProgress(progress, unit.id);
  const completed = isUnitCompleted(progress, unit.id);

  return (
    <>
      <header className="page-header">
        <Link className="back-link" to={`/level/${levelId}`}>
          ← {levelName} units
        </Link>
        <span className="card__eyebrow">
          {levelName} · Unit {unit.number}
        </span>
        <h1>{unit.title}</h1>
        <p className="translation translation--title" lang="tl">
          {unit.titleTl}
        </p>
        <p>{unit.summary}</p>
        <p className="translation" lang="tl">
          {unit.summaryTl}
        </p>
      </header>

      {completed && (
        <p className="banner">
          ✓ Completed with a best score of {unitProgress.bestPercent}%.{' '}
          {nextUnit ? (
            <Link to={`/unit/${nextUnit.id}`}>Next unit: {nextUnit.title} →</Link>
          ) : (
            'That was the last unit — gratulacje!'
          )}
        </p>
      )}

      <div className="tabs" role="tablist" aria-label="Unit sections">
        {TAB_ROWS.map((row) => (
          <div key={row.id} className="tabs__row" role="presentation">
            {row.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls="unit-panel"
                className={`tabs__tab${activeTab === tab.id ? ' tabs__tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div id="unit-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="panel">
        {activeTab === 'learn' && (
          <section>
            <h2>Vocabulary</h2>
            <WordTable caption="Words" items={unit.vocabulary} />
            <WordTable caption="Useful phrases" items={unit.phrases} />
          </section>
        )}
        {activeTab === 'grammar' && <GrammarSection grammar={unit.grammar} />}
        {activeTab === 'flashcards' && (
          <Flashcards
            words={unit.vocabulary}
            knownWords={unitProgress.knownWords}
            onMark={(word, known) => markWord(unit.id, word, known)}
          />
        )}
        {activeTab === 'quiz' && (
          <Quiz unit={unit} onComplete={(score, total) => recordQuiz(unit.id, score, total)} />
        )}
      </div>
    </>
  );
}

UnitContent.propTypes = {
  unit: unitType.isRequired,
  levelId: PropTypes.string.isRequired,
  levelName: PropTypes.string.isRequired,
  nextUnit: unitType,
};

export default function UnitPage() {
  const { unitId } = useParams();
  const found = findUnit(unitId);

  if (!found) {
    return <NotFoundPage />;
  }

  // Keyed by unit so tab, flashcard and quiz state reset when moving to another unit.
  return (
    <UnitContent
      key={found.unit.id}
      unit={found.unit}
      levelId={found.level.id}
      levelName={found.level.name}
      nextUnit={found.nextUnit}
    />
  );
}
