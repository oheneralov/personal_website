import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { ProgressProvider } from './context/ProgressContext';
import './styles.css';

// HashRouter keeps deep links working on any static host, with no server rewrites.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </HashRouter>
  </StrictMode>,
);
