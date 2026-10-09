import Game from '../components/Game';

export default function GamePage() {
  return (
    <>
      <header className="page-header">
        <span className="badge">Game</span>
        <h1>The way home</h1>
        <p className="translation translation--title" lang="tl">
          Ang daan pauwi
        </p>
        <p>Practise Polish in a short adventure: talk and act your way past every obstacle.</p>
        <p className="translation" lang="tl">
          Magsanay ng Polish sa isang maikling pakikipagsapalaran: lampasan ang bawat balakid sa
          pamamagitan ng tamang salita at kilos.
        </p>
      </header>
      <Game />
    </>
  );
}
