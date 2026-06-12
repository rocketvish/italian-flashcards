import { useRef } from 'react';
import { useProgress } from '../hooks/useProgress';
import SyncIndicator from '../components/SyncIndicator';

const SYNC_STATUS_LABEL = {
  idle:    'All changes saved to cloud',
  syncing: 'Syncing…',
  error:   'Sync failed — tap to retry',
  offline: 'Offline — will sync when connected',
};

export default function SettingsPage({
  direction, setDirection, batchSize, setBatchSize, theme, setTheme,
  user, signInWithGoogle,
  syncStatus, lastSyncAt, syncNow,
}) {
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

  const lastSyncLabel = lastSyncAt
    ? new Date(lastSyncAt).toLocaleString()
    : 'Never';

  return (
    <div className="page page-settings">
      <h1 className="page-title">Settings</h1>

      {/* ── Account & Sync ─────────────────────────────── */}
      <section className="settings-section">
        <h2 className="settings-section-title">Account & Sync</h2>
        {user ? (
          <>
            <div className="sync-account-row">
              {user.user_metadata?.avatar_url && (
                <img
                  className="user-avatar user-avatar--lg"
                  src={user.user_metadata.avatar_url}
                  alt=""
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="sync-account-info">
                <span className="sync-account-name">
                  {user.user_metadata?.full_name ?? user.email}
                </span>
                <span className="sync-account-email">{user.email}</span>
              </div>
            </div>

            <div className="sync-status-row">
              <SyncIndicator status={syncStatus} />
              <span className="sync-status-text">{SYNC_STATUS_LABEL[syncStatus]}</span>
            </div>
            <p className="sync-last-sync">Last synced: {lastSyncLabel}</p>

            <div className="settings-data-buttons">
              <button className="btn btn-secondary" onClick={syncNow} disabled={syncStatus === 'syncing'}>
                Sync Now
              </button>
            </div>
          </>
        ) : (
          <div className="sync-guest">
            <p className="sync-guest-text">Sign in to sync progress across devices.</p>
            <button className="btn btn-google btn-google--sm" onClick={signInWithGoogle}>
              <svg className="google-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        )}
      </section>

      {/* ── Study Direction ────────────────────────────── */}
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

      {/* ── Batch Size ─────────────────────────────────── */}
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

      {/* ── Appearance ────────────────────────────────── */}
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

      {/* ── Data ──────────────────────────────────────── */}
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

      {/* ── About ─────────────────────────────────────── */}
      <section className="settings-section">
        <h2 className="settings-section-title">About</h2>
        <p className="settings-about">Italian Flashcards · SM-2 spaced repetition · v2.0.0</p>
        <a
          className="settings-github-link"
          href="https://github.com/rocketvish/italian-flashcards"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub ↗
        </a>
      </section>
    </div>
  );
}
