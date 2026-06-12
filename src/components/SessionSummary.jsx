export default function SessionSummary({ history, newLearned = 0, maxStreak = 0, priorityAnswered = 0, onRestart, onDone }) {
  const total = history.length;
  const correct = history.filter((h) => h.response !== 'again').length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const counts = history.reduce((acc, h) => {
    acc[h.response] = (acc[h.response] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="session-summary">
      <div className="summary-icon">🎉</div>
      <h2 className="summary-title">Session Complete</h2>
      <p className="summary-subtitle">You reviewed {total} card{total !== 1 ? 's' : ''}</p>

      <div className="summary-score">
        <span className="score-pct">{pct}%</span>
        <span className="score-label">correct</span>
      </div>

      {(newLearned > 0 || maxStreak > 1 || priorityAnswered > 0) && (
        <div className="summary-extras">
          {priorityAnswered > 0 && (
            <span className="summary-extra">⭐ {priorityAnswered} priority word{priorityAnswered !== 1 ? 's' : ''} reviewed</span>
          )}
          {newLearned > 0 && (
            <span className="summary-extra">{newLearned} new word{newLearned !== 1 ? 's' : ''} introduced</span>
          )}
          {maxStreak > 1 && (
            <span className="summary-extra">Best streak: {maxStreak}</span>
          )}
        </div>
      )}

      <div className="summary-breakdown">
        <div className="breakdown-item breakdown-easy">
          <span className="breakdown-count">{counts.easy ?? 0}</span>
          <span className="breakdown-label">Easy</span>
        </div>
        <div className="breakdown-item breakdown-good">
          <span className="breakdown-count">{counts.good ?? 0}</span>
          <span className="breakdown-label">Good</span>
        </div>
        <div className="breakdown-item breakdown-hard">
          <span className="breakdown-count">{counts.hard ?? 0}</span>
          <span className="breakdown-label">Hard</span>
        </div>
        <div className="breakdown-item breakdown-again">
          <span className="breakdown-count">{counts.again ?? 0}</span>
          <span className="breakdown-label">Again</span>
        </div>
      </div>

      <div className="summary-actions">
        <button className="btn btn-secondary" onClick={onRestart}>
          Study Again
        </button>
        <button className="btn btn-primary" onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  );
}
