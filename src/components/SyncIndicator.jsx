const LABELS = {
  idle:    'Synced',
  syncing: 'Syncing…',
  error:   'Sync error',
  offline: 'Offline',
};

export default function SyncIndicator({ status }) {
  return (
    <div className={`sync-indicator sync-indicator--${status}`} title={LABELS[status]}>
      <span className="sync-dot" />
      <span className="sync-label">{LABELS[status]}</span>
    </div>
  );
}
