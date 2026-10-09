import { Link, useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';
import ProgressBar from '../components/ProgressBar';
import { findLevel } from '../data/course';
import { useProgress } from '../context/ProgressContext';
import { countCompletedUnits, getUnitProgress, isUnitCompleted } from '../lib/progressStore';

function unitStatus(progress, unit) {
  if (isUnitCompleted(progress, unit.id)) {
    return {
      label: `Completed · best ${getUnitProgress(progress, unit.id).bestPercent}%`,
      done: true,
    };
  }
  const { attempts, knownWords, bestPercent } = getUnitProgress(progress, unit.id);
  if (attempts > 0) {
    return { label: `In progress · best ${bestPercent}%`, done: false };
  }
  return { label: knownWords.length > 0 ? 'In progress' : 'Not started', done: false };
}

export default function LevelPage() {
  const { levelId } = useParams();
  const { progress } = useProgress();
  const level = findLevel(levelId);

  if (!level) {
    return <NotFoundPage />;
  }

  return (
    <>
      <header className="page-header">
        <span className="badge">{level.name}</span>
        <h1>{level.title}</h1>
        <p className="translation translation--title" lang="tl">
          {level.titleTl}
        </p>
        <p>{level.description}</p>
        <p className="translation" lang="tl">
          {level.descriptionTl}
        </p>
        <ProgressBar
          value={countCompletedUnits(progress, level.units)}
          max={level.units.length}
          label="Units completed"
        />
      </header>

      <ol className="card-grid unit-list">
        {level.units.map((unit) => {
          const status = unitStatus(progress, unit);
          return (
            <li key={unit.id}>
              <Link className={`card${status.done ? ' card--done' : ''}`} to={`/unit/${unit.id}`}>
                <span className="card__eyebrow">Unit {unit.number}</span>
                <h2>{unit.title}</h2>
                <p className="translation translation--title" lang="tl">
                  {unit.titleTl}
                </p>
                <p>{unit.summary}</p>
                <p className="translation" lang="tl">
                  {unit.summaryTl}
                </p>
                <span className="card__status">
                  {status.done ? '✓ ' : ''}
                  {status.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
