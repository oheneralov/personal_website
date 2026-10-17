import RedHat from '../components/RedHat';

export default function RedHatPage() {
  return (
    <>
      <header className="page-header">
        <span className="badge">Game</span>
        <h1>Red Hat</h1>
        <p>
          Watch the famous tale of Little Red Riding Hood — <span lang="pl">Czerwony Kapturek</span>{' '}
          — told and voiced in simple Polish.
        </p>
      </header>
      <RedHat />
    </>
  );
}
