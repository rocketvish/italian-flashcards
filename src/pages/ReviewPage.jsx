import { useState } from 'react';
import WordInfo from '../components/WordInfo';
import ConjugationTable from '../components/ConjugationTable';
import { useProgress } from '../hooks/useProgress';

const STATUS_FILTERS = ['all', 'learning', 'reviewing', 'mastered'];
const POS_FILTERS = ['all', 'noun', 'verb', 'adjective', 'preposition', 'article', 'other'];

export default function ReviewPage({ words }) {
  const { getCard, resetWord } = useProgress();
  const [statusFilter, setStatusFilter] = useState('all');
  const [posFilter, setPosFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const filtered = words.filter((w) => {
    const card = getCard(w.id);
    // Words never seen have no lastSeen; treat as 'new' for filter purposes
    const status = card.lastSeen ? (card.status ?? 'learning') : 'new';

    if (statusFilter !== 'all' && status !== statusFilter) return false;

    const knownPos = ['noun', 'verb', 'adjective', 'preposition', 'article'];
    if (posFilter === 'other' && knownPos.includes(w.partOfSpeech)) return false;
    if (posFilter !== 'all' && posFilter !== 'other' && w.partOfSpeech !== posFilter) return false;

    if (search) {
      const q = search.toLowerCase();
      return w.italian.toLowerCase().includes(q) || w.english.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="page page-review">
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
              className={`filter-chip ${statusFilter === f ? 'filter-chip--active' : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
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
                  <span className={`status-dot status-dot--${dotStatus}`} />
                  <span className="word-item-chevron">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>
              {isOpen && (
                <div className="word-item-detail">
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
                  {seen && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => { resetWord(w.id); setExpanded(null); }}
                    >
                      Reset to New
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
