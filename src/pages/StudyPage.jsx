import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlashCard from '../components/FlashCard';
import ProgressBar from '../components/ProgressBar';
import SessionSummary from '../components/SessionSummary';
import UndoButton from '../components/UndoButton';
import ReportErrorButton from '../components/ReportErrorButton';
import QuickSortSession from '../components/QuickSortSession';
import { useSRS } from '../hooks/useSRS';
import { usePriority } from '../hooks/usePriority';
import { useProgress } from '../hooks/useProgress';

const QUICK_SORT_BATCH = 50;

export default function StudyPage({ words, direction, batchSize }) {
  const navigate = useNavigate();

  // Priority (starred) words
  const { isPriority, getPriorityWordIds, recordCorrect, recordIncorrect } = usePriority();
  const priorityWordIds = getPriorityWordIds();
  const priorityWordsList = words.filter((w) => isPriority(w.id));

  // Progress (for computing sorted count & quick sort updates)
  const { getCard, updateCard } = useProgress();

  // SRS session
  const {
    currentWord,
    sessionWords,
    currentIndex,
    sessionDone,
    sessionHistory,
    priorityCount,
    newWordsAnswered,
    maxStreak,
    answer,
    undo,
    restart,
  } = useSRS(words, batchSize, priorityWordIds);

  // Quick Sort state
  const [quickSortMode, setQuickSortMode] = useState(false); // in-session toggle
  const [quickSortBatch, setQuickSortBatch] = useState(null); // batch mode

  // Computed sort progress (live, updates with each card touched)
  const sortedCount = words.filter((w) => !!getCard(w.id).lastSeen).length;
  const unsortedCount = words.length - sortedCount;

  // ── Handlers ────────────────────────────────────────────────────────────

  function handleAnswer(response) {
    if (currentWord && isPriority(currentWord.id)) {
      if (response === 'again') recordIncorrect(currentWord.id);
      else recordCorrect(currentWord.id);
    }
    answer(response);
  }

  function launchQuickSort() {
    const batch = words.filter((w) => !getCard(w.id).lastSeen).slice(0, QUICK_SORT_BATCH);
    if (batch.length > 0) setQuickSortBatch(batch);
  }

  function handleQuickSortWord(wordId, decision) {
    const todayStr = new Date().toISOString().split('T')[0];
    if (decision === 'know') {
      updateCard(wordId, {
        interval: 30, status: 'mastered', easeFactor: 2.5,
        streak: 1, timesCorrect: 1, timesIncorrect: 0,
        lastSeen: todayStr,
        nextDue: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      });
    } else {
      updateCard(wordId, {
        interval: 1, status: 'learning', easeFactor: 2.5,
        streak: 0, timesCorrect: 0, timesIncorrect: 0,
        lastSeen: todayStr,
        nextDue: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      });
    }
  }

  // ── Quick Sort batch mode (full-screen takeover) ─────────────────────────

  if (quickSortBatch) {
    return (
      <QuickSortSession
        batch={quickSortBatch}
        direction={direction}
        totalWords={words.length}
        sortedSoFar={sortedCount}
        onSort={handleQuickSortWord}
        onExit={() => setQuickSortBatch(null)}
      />
    );
  }

  // ── Session summary ──────────────────────────────────────────────────────

  if (sessionDone) {
    return (
      <div className="page page-study">
        <SessionSummary
          history={sessionHistory}
          newLearned={newWordsAnswered}
          maxStreak={maxStreak}
          priorityAnswered={priorityCount}
          onRestart={restart}
          onDone={() => navigate('/review')}
        />
      </div>
    );
  }

  // ── Empty state (nothing due) ────────────────────────────────────────────

  if (!currentWord) {
    return (
      <div className="page page-study page-empty">
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h2>Nothing due!</h2>
          <p>All caught up. Come back later for more reviews.</p>

          {unsortedCount > 0 && (
            <div className="qs-empty-prompt">
              <p className="qs-empty-text">
                {unsortedCount.toLocaleString()} words not yet sorted
              </p>
              <button className="btn btn-primary" onClick={launchQuickSort}>
                ⚡ Sort {Math.min(QUICK_SORT_BATCH, unsortedCount)} Words
              </button>
              <p className="qs-empty-progress">
                {sortedCount.toLocaleString()} / {words.length.toLocaleString()} sorted
              </p>
            </div>
          )}

          <button className="btn btn-secondary" onClick={() => navigate('/review')}>
            Browse words
          </button>
        </div>
      </div>
    );
  }

  // ── Normal study session ─────────────────────────────────────────────────

  return (
    <div className="page page-study">
      {/* Priority words banner */}
      {priorityWordsList.length > 0 && (
        <div className="priority-banner">
          <span className="priority-banner-icon">⭐</span>
          <span className="priority-banner-text">
            {priorityWordsList.length} priority word{priorityWordsList.length !== 1 ? 's' : ''} in queue
          </span>
          <span className="priority-banner-words">
            {priorityWordsList.slice(0, 3).map((w) => w.italian).join(', ')}
            {priorityWordsList.length > 3 ? ` +${priorityWordsList.length - 3}` : ''}
          </span>
        </div>
      )}

      <div className="study-header">
        <ProgressBar
          current={currentIndex}
          total={sessionWords.length}
          label={`Card ${currentIndex + 1} of ${sessionWords.length}`}
        />
        <div className="study-header-right">
          <UndoButton onUndo={undo} disabled={sessionHistory.length === 0} />
          {unsortedCount > 0 && (
            <button
              className={`qs-toggle-btn ${quickSortMode ? 'qs-toggle-btn--on' : ''}`}
              onClick={() => setQuickSortMode((m) => !m)}
              title={quickSortMode ? 'Quick Sort: ON — tap to turn off' : 'Quick Sort: OFF — tap to turn on'}
            >
              ⚡ {quickSortMode ? 'ON' : 'OFF'}
            </button>
          )}
        </div>
      </div>

      <div className="study-card-area">
        <FlashCard
          key={currentWord.id}
          word={currentWord}
          direction={direction}
          cardIndex={currentIndex}
          isPriority={isPriority(currentWord.id)}
        />
      </div>

      {quickSortMode ? (
        <div className="qs-answer-buttons">
          <button className="btn btn-qs-learn" onClick={() => handleAnswer('learn')}>
            Need to Learn
          </button>
          <button className="btn btn-qs-know" onClick={() => handleAnswer('know')}>
            Already Know This
          </button>
        </div>
      ) : (
        <div className="answer-buttons">
          <button className="btn btn-again" onClick={() => handleAnswer('again')}>Again</button>
          <button className="btn btn-hard"  onClick={() => handleAnswer('hard')} >Hard</button>
          <button className="btn btn-good"  onClick={() => handleAnswer('good')} >Good</button>
          <button className="btn btn-easy"  onClick={() => handleAnswer('easy')} >Easy</button>
        </div>
      )}

      <div className="study-footer">
        {unsortedCount > 0 && (
          <button className="qs-sort-link" onClick={launchQuickSort}>
            ⚡ Sort {Math.min(QUICK_SORT_BATCH, unsortedCount)} unsorted words
            <span className="qs-sort-progress">
              {sortedCount.toLocaleString()}/{words.length.toLocaleString()}
            </span>
          </button>
        )}
        <ReportErrorButton word={currentWord} />
      </div>
    </div>
  );
}
