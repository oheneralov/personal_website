import Tetris from '../components/Tetris';

export default function TetrisPage() {
  return (
    <>
      <header className="page-header">
        <span className="badge">Game</span>
        <h1>Guess the word</h1>
        <p>
          Drop every falling Polish word into the basket with its English translation. Help a family
          build a house: each time you pass a level, a little more of it is built, until it is
          finished.
        </p>
      </header>
      <Tetris />
    </>
  );
}
