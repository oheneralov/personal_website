import Game from '../components/Game';

export default function GamePage() {
  return (
    <>
      <header className="page-header">
        <span className="badge">Game</span>
        <h1>The way home</h1>
        <p>Practise Polish in a short adventure: talk and act your way past every obstacle.</p>
      </header>
      <Game />
    </>
  );
}
