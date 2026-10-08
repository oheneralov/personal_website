import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LevelPage from './pages/LevelPage';
import NotFoundPage from './pages/NotFoundPage';
import UnitPage from './pages/UnitPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="level/:levelId" element={<LevelPage />} />
        <Route path="unit/:unitId" element={<UnitPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
