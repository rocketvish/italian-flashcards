import { useState } from 'react';
import WordInfo from '../components/WordInfo';
import ConjugationTable from '../components/ConjugationTable';
import { useProgress } from '../hooks/useProgress';
import { usePriority } from '../hooks/usePriority';

const STATUS_FILTERS = ['all', 'starred', 'learning', 'reviewing', 'mastered'];
const POS_FILTERS = ['all', 'noun', 'verb', 'adjective', 'preposition', 'article', 'other'];

export default function ReviewPage({ words }) {
  const { getCard, resetWord } = useProgress();
  const { isPriority, addPriority, removePriority, priorities } = usePriority();

  const [statusFilter, setStatusFilter] = useState('all');
  const [posFilter, setPosFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const filtered = words.filter((w) => {
    const card = getCard(w.id);
    const status = card.lastSeen ? (card.status ?? 'learning') : 'new';

    if (statusFilter === 'starred') {
      if (!isPriority(w.id)) return false;
    } else if (statusFilter !== 'all' && status !== statusFilter) {
      return false;
    }

    const knownPos = ['noun', 'verb', 'adjective', 'preposition', 'article'];
    if (posFilter === 'other' && knownPos.includes(w.partOfSpeech)) return false;
    if (posFilter !== 'all' && posFilter !== 'other' && w.partOfSpeech !== posFilter) return false;

    if (search) {
      const q = search.toLowerCase();
      return w.italian.toLowerCase().includes(q) || w.english.toLowerCase().includes(q);
    }
    return true;
  });

  function toggleStar(e, wordId) {
    e.stopPropagation();
    if (isPriority(wordId)) removePriority(wordId);
    else addPriority(wordId);
  }

  const starredCount = Object.keys(priorities).length;

  return (
    <div className="page page-review">
      {/* Priority words section — shown when there are starred words */}
      {starredCount > 0 && statusFilter !== 'starred' && (
        <div className="priority-section-header" onClick={() => setStatusFilter('starred')}>
          <span className="priority-section-icon">⭐</span>
          <span className="priority-section-text">
            {starredCount} Priority Word{starredCount !== 1 ? 's' : ''}
          </span>
          <span className="priority-section-link">View all →</span>
        </div>
      )}

      <div className="review-filters">
        <input
          className="search-input"
          placeholder="Search words…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-row">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-chip ${statusFilter === f ? 'filter-chip--active' : ''} ${f === 'starred' ? 'filter-chip--starred' : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f === 'starred' ? '⭐ Starred' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="filter-row">
          {POS_FILTERS.map((f) => (
            <button
              key={f}
              className={`filter-chip ${posFilter === f ? 'filter-chip--active' : ''}`}
              onClick={() => setPosFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="review-count">{filtered.length} word{filtered.length !== 1 ? 's' : ''}</div>

      <ul className="word-list">
        {filtered.map((w) => {
          const card = getCard(w.id);
          const seen = !!card.lastSeen;
          const dotStatus = seen ? (card.status ?? 'learning') : 'new';
          const isOpen = expanded === w.id;
          const starred = isPriority(w.id);
          const starStreak = priorities[w.id]?.correctStreak ?? 0;

          return (
            <li key={w.id} className="word-item">
              <button
                className="word-item-header"
                onClick={() => setExpanded(isOpen ? null : w.id)}
              >
                <div className="word-item-main">
                  <span className="word-italian">{w.italian}</span>
                  <span className="word-english">{w.english}</span>
                </div>
                <div className="word-item-meta">
                  <button
                    className={`star-btn ${starred ? 'star-btn--active' : ''}`}
                    onClick={(e) => toggleStar(e, w.id)}
                    title={starred ? `Remove priority (${starStreak}/7 correct)` : 'Add to priority'}
                    aria-label={starred ? 'Remove priority' : 'Set priority'}
                  >
                    {starred ? '★' : '☆'}
                  </button>
                  <span className={`status-dot status-dot--${dotStatus}`} />
                  <span className="word-item-chevron">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>
              {isOpen && (
                <div className="word-item-detail">
                  {starred && (
                    <div className="priority-streak-row">
                      <span className="priority-streak-label">Priority streak:</span>
                      <span className="priority-streak-pips">
                        {Array.from({ length: 7 }, (_, i) => (
                          <span key={i} className={`streak-pip ${i < starStreak ? 'streak-pip--filled' : ''}`} />
                        ))}
                      </span>
                      <span className="priority-streak-count">{starStreak}/7</span>
                    </div>
                  )}
                  <WordInfo word={w} />
                  {w.conjugations && (
                    <ConjugationTable
                      conjugations={w.conjugations}
                      irregularForms={w.irregularForms}
                    />
                  )}
                  <div className="word-item-srs">
                    {seen ? (
                      <>
                        <span>Correct: {card.timesCorrect ?? 0}</span>
                        <span>Interval: {card.interval ?? 0}d</span>
                        <span>Next: {card.nextDue ?? '—'}</span>
                      </>
                    ) : (
                      <span>Never studied</span>
                    )}
                  </div>
                  <div className="word-item-actions">
                    <button
                      className={`btn btn-sm ${starred ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={(e) => toggleStar(e, w.id)}
                    >
                      {starred ? '★ Remove priority' : '☆ Set priority'}
                    </button>
                    {seen && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => { resetWord(w.id); setExpanded(null); }}
                      >
                        Reset to New
                      </button>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
