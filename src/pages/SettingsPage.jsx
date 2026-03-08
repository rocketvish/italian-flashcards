import { useRef } from 'react';
import { useProgress } from '../hooks/useProgress';

export default function SettingsPage({ direction, setDirection, batchSize, setBatchSize, theme, setTheme }) {
  const { resetAll, exportProgress, importProgress } = useProgress();
  const fileRef = useRef(null);

  function handleExport() {
    const json = exportProgress();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `italian-flashcards-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const ok = importProgress(evt.target.result);
      alert(ok ? 'Progress imported successfully.' : 'Invalid file format.');
    };
    reader.readAsText(file);
  }

  function handleReset() {
    if (window.confirm('Reset all progress? This cannot be undone.')) {
      resetAll();
    }
  }

  return (
    <div className="page page-settings">
      <h1 className="page-title">Settings</h1>

      <section className="settings-section">
        <h2 className="settings-section-title">Study Direction</h2>
        <div className="settings-options">
          {['it-en', 'en-it', 'mixed'].map((d) => (
            <button
              key={d}
              className={`option-btn ${direction === d ? 'option-btn--active' : ''}`}
              onClick={() => setDirection(d)}
            >
              {d === 'it-en' ? 'IT → EN' : d === 'en-it' ? 'EN → IT' : 'Mixed'}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Batch Size</h2>
        <div className="settings-options">
          {[5, 10, 15, 20].map((n) => (
            <button
              key={n}
              className={`option-btn ${batchSize === n ? 'option-btn--active' : ''}`}
              onClick={() => setBatchSize(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Appearance</h2>
        <div className="settings-options">
          {[
            { value: 'dark',  label: '🌙 Dark' },
            { value: 'light', label: '☀️ Light' },
          ].map(({ value, label }) => (
            <button
              key={value}
              className={`option-btn ${theme === value ? 'option-btn--active' : ''}`}
              onClick={() => setTheme(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Data</h2>
        <div className="settings-data-buttons">
          <button className="btn btn-secondary" onClick={handleExport}>
            Export Progress
          </button>
          <button className="btn btn-secondary" onClick={() => fileRef.current?.click()}>
            Import Progress
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <button className="btn btn-danger" onClick={handleReset}>
            Reset All Progress
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">About</h2>
        <p className="settings-about">Italian Flashcards · SM-2 spaced repetition · v0.1.0</p>
        <a
          className="settings-github-link"
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub ↗
        </a>
      </section>
    </div>
  );
}
