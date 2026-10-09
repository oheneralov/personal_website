import { Link, NavLink, Outlet } from 'react-router-dom';
import { LEVELS } from '../data/course';
import { useProgress } from '../context/ProgressContext';

export default function Layout() {
  const { resetProgress } = useProgress();

  const handleReset = () => {
    // eslint-disable-next-line no-alert -- a native confirm is enough for this rare, destructive action
    if (window.confirm('Reset all your progress? This cannot be undone.')) {
      resetProgress();
    }
  };

  return (
    <div className="app">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand">
            <span className="brand__flag" aria-hidden="true" />
            Polski krok po kroku
          </Link>
          <nav aria-label="Main">
            <NavLink to="/" end>
              Home
            </NavLink>
            {LEVELS.map((level) => (
              <NavLink key={level.id} to={`/level/${level.id}`}>
                {level.name}
              </NavLink>
            ))}
            <NavLink to="/game">Game</NavLink>
          </nav>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container site-footer__inner">
          <span>Your progress is saved in this browser only.</span>
          <button type="button" className="link-button" onClick={handleReset}>
            Reset progress
          </button>
        </div>
      </footer>
    </div>
  );
}
