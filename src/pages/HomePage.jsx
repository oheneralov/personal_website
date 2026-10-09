import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { ALL_UNITS, LEVELS } from '../data/course';
import { useProgress } from '../context/ProgressContext';
import { countCompletedUnits, isUnitCompleted } from '../lib/progressStore';

export default function HomePage() {
  const { progress } = useProgress();
  const nextUnit = ALL_UNITS.find((unit) => !isUnitCompleted(progress, unit.id));
  const started = Object.keys(progress.units).length > 0;

  return (
    <>
      <section className="hero">
        <h1>Learn Polish, step by step</h1>
        <p className="hero__translation hero__translation--title" lang="tl">
          Matuto ng Polish, hakbang-hakbang
        </p>
        <p>
          A free course for English speakers. Two levels, sixteen units — vocabulary with audio,
          clear grammar notes, flashcards and quizzes.
        </p>
        <p className="hero__translation" lang="tl">
          Libreng kurso para sa mga nagsasalita ng Ingles. Dalawang antas, labing-anim na yunit —
          bokabularyo na may audio, malinaw na paliwanag sa gramatika, mga flashcard at pagsusulit.
        </p>
        {nextUnit ? (
          <Link className="button" to={`/unit/${nextUnit.id}`}>
            {started ? 'Continue' : 'Start learning'}: {nextUnit.title}
          </Link>
        ) : (
          <p className="hero__done">Gratulacje! You have completed every unit.</p>
        )}
      </section>

      <div className="card-grid card-grid--levels">
        {LEVELS.map((level) => (
          <Link key={level.id} className="card" to={`/level/${level.id}`}>
            <span className="badge">{level.name}</span>
            <h2>{level.title}</h2>
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
              label={`${level.name} units completed`}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
