import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import StudyPage from './pages/StudyPage';
import ReviewPage from './pages/ReviewPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import { useWordLoader } from './hooks/useWordLoader';
import InstallPrompt from './components/InstallPrompt';

const DIRECTION_LABELS = { 'it-en': 'IT→EN', 'en-it': 'EN→IT', mixed: 'Mixed' };

function Header({ direction, setDirection, batchSize, setBatchSize }) {
  const location = useLocation();
  const PAGE_TITLES = {
    '/': 'Study',
    '/study': 'Study',
    '/review': 'Review',
    '/stats': 'Stats',
    '/settings': 'Settings',
  };
  const title = PAGE_TITLES[location.pathname] ?? 'Italian';

  function cycleDirection() {
    const order = ['it-en', 'en-it', 'mixed'];
    setDirection((d) => order[(order.indexOf(d) + 1) % order.length]);
  }

  const BATCH_OPTIONS = [5, 10, 15, 20];
  function cycleBatch() {
    setBatchSize((b) => {
      const i = BATCH_OPTIONS.indexOf(b);
      return BATCH_OPTIONS[(i + 1) % BATCH_OPTIONS.length];
    });
  }

  const isStudy = location.pathname === '/' || location.pathname === '/study';

  return (
    <header className="app-header">
      <h1 className="app-title">{title}</h1>
      {isStudy && (
        <div className="header-controls">
          <button className="control-btn" onClick={cycleDirection} title="Toggle direction">
            {DIRECTION_LABELS[direction]}
          </button>
          <button className="control-btn" onClick={cycleBatch} title="Batch size">
            {batchSize} cards
          </button>
        </div>
      )}
    </header>
  );
}

function BottomNav() {
  const navItems = [
    { to: '/study', label: 'Study', icon: '📚' },
    { to: '/review', label: 'Review', icon: '🔍' },
    { to: '/stats', label: 'Stats', icon: '📊' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
  ];
  return (
    <nav className="bottom-nav">
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}
        >
          <span className="nav-icon">{icon}</span>
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function AppInner() {
  const [direction, setDirection] = useState(
    () => localStorage.getItem('srs_direction') ?? 'it-en'
  );
  const [batchSize, setBatchSize] = useState(
    () => parseInt(localStorage.getItem('srs_batchSize') ?? '10', 10)
  );
  const [theme, setTheme] = useState(
    () => localStorage.getItem('srs_theme') ?? 'dark'
  );
  const { words, loading, error } = useWordLoader();

  useEffect(() => { localStorage.setItem('srs_direction', direction); }, [direction]);
  useEffect(() => { localStorage.setItem('srs_batchSize', String(batchSize)); }, [batchSize]);
  useEffect(() => {
    localStorage.setItem('srs_theme', theme);
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : '');
  }, [theme]);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading words…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>Failed to load words: {error}</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <InstallPrompt />
      <Header
        direction={direction}
        setDirection={setDirection}
        batchSize={batchSize}
        setBatchSize={setBatchSize}
      />
      <main className="app-main">
        <Routes>
          <Route index element={<StudyPage words={words} direction={direction} batchSize={batchSize} />} />
          <Route path="/study" element={<StudyPage words={words} direction={direction} batchSize={batchSize} />} />
          <Route path="/review" element={<ReviewPage words={words} />} />
          <Route path="/stats" element={<StatsPage words={words} />} />
          <Route
            path="/settings"
            element={
              <SettingsPage
                direction={direction}
                setDirection={setDirection}
                batchSize={batchSize}
                setBatchSize={setBatchSize}
                theme={theme}
                setTheme={setTheme}
              />
            }
          />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppInner />
    </HashRouter>
  );
}
