/**
 * @hearmony/ui — App Principal
 *
 * Integra todos os componentes via AppProvider (SPEC-2.02, 3.01, 3.02, 3.03)
 */

import './index.css';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { ExplorationPage } from './pages/Exploration/ExplorationPage';
import { PracticePage } from './pages/Practice/PracticePage';

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function Header() {
  const location = useLocation();

  return (
    <header className="app-header">
      <div className="app-logo">
        <span className="logo-icon">🎵</span>
        <h1>Hearmony</h1>
      </div>
      
      <nav className="top-nav" aria-label="Navegação principal">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Exploração
        </Link>
        <Link to="/practice" className={`nav-link ${location.pathname === '/practice' ? 'active' : ''}`}>
          Prática
        </Link>
      </nav>

      <div style={{ fontSize: '0.78rem', color: 'rgba(240,242,245,0.4)', paddingRight: '16px' }}>
        Motor Harmônico v0.1
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// App Root
// ---------------------------------------------------------------------------

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<ExplorationPage />} />
            <Route path="/practice" element={<PracticePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
