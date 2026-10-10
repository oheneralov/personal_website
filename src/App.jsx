import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AboutPage from './pages/AboutPage';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
import LevelPage from './pages/LevelPage';
import NotFoundPage from './pages/NotFoundPage';
import TetrisPage from './pages/TetrisPage';
import UnitPage from './pages/UnitPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="level/:levelId" element={<LevelPage />} />
        <Route path="unit/:unitId" element={<UnitPage />} />
        <Route path="game" element={<GamePage />} />
        <Route path="tetris" element={<TetrisPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
