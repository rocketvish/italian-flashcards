import { useState } from 'react';
import FlashCard from './FlashCard';
import ProgressBar from './ProgressBar';

/**
 * Self-contained batch Quick Sort session.
 * Shows each word fully and lets the user make a binary decision:
 *   "Already Know This" → marks as mastered (30-day interval)
 *   "Need to Learn"     → enters learning queue (1-day interval)
 *
 * Props:
 *   batch        - array of word objects to sort
 *   direction    - 'it-en' | 'en-it' | 'mixed'
 *   totalWords   - total word count (for sorted X / total display)
 *   sortedSoFar  - how many words are already sorted (live count from parent)
 *   onSort(wordId, 'know' | 'learn') - called for each word decision
 *   onExit()     - called when user exits or batch completes
 */
export default function QuickSortSession({ batch, direction, totalWords, sortedSoFar, onSort, onExit }) {
  const [index, setIndex] = useState(0);
  const [knowCount, setKnowCount] = useState(0);
  const [learnCount, setLearnCount] = useState(0);
  const [done, setDone] = useState(false);

  function handle(decision) {
    const word = batch[index];
    onSort(word.id, decision);
    if (decision === 'know') setKnowCount((k) => k + 1);
    else setLearnCount((l) => l + 1);

    if (index + 1 >= batch.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (done) {
    const remaining = totalWords - sortedSoFar;
    return (
      <div className="page page-study">
        <div className="qs-summary">
          <div className="qs-summary-icon">⚡</div>
          <h2 className="qs-summary-title">Batch Complete!</h2>
          <p className="qs-summary-sub">You sorted {batch.length} words</p>

          <div className="qs-buckets">
            <div className="qs-bucket qs-bucket--know">
              <span className="qs-bucket-count">{knowCount}</span>
              <span className="qs-bucket-label">Already knew</span>
            </div>
            <div className="qs-bucket qs-bucket--learn">
              <span className="qs-bucket-count">{learnCount}</span>
              <span className="qs-bucket-label">To learn</span>
            </div>
          </div>

          <div className="qs-overall-progress">
            <div className="qs-overall-bar">
              <div
                className="qs-overall-fill"
                style={{ width: `${(sortedSoFar / totalWords) * 100}%` }}
              />
            </div>
            <p className="qs-overall-text">{sortedSoFar.toLocaleString()} / {totalWords.toLocaleString()} words sorted</p>
          </div>

          <div className="qs-summary-actions">
            {remaining > 0 && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIndex(0);
                  setKnowCount(0);
                  setLearnCount(0);
                  setDone(false);
                  onExit(); // parent will launch a new batch if user clicks Sort 50 again
                }}
              >
                Done
              </button>
            )}
            {remaining === 0 && (
              <button className="btn btn-primary" onClick={onExit}>All sorted!</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const word = batch[index];

  return (
    <div className="page page-study">
      <div className="qs-session-header">
        <div className="qs-session-meta">
          <span className="qs-batch-counter">{index + 1} / {batch.length} in batch</span>
          <span className="qs-sorted-counter">
            {sortedSoFar.toLocaleString()} / {totalWords.toLocaleString()} sorted
          </span>
        </div>
        <ProgressBar current={sortedSoFar} total={totalWords} label="" />
        <button className="qs-exit-btn" onClick={onExit}>
          Exit Quick Sort
        </button>
      </div>

      <div className="study-card-area">
        <FlashCard
          key={word.id}
          word={word}
          direction={direction}
          cardIndex={index}
        />
      </div>

      <div className="qs-answer-buttons">
        <button className="btn btn-qs-learn" onClick={() => handle('learn')}>
          Need to Learn
        </button>
        <button className="btn btn-qs-know" onClick={() => handle('know')}>
          Already Know This
        </button>
      </div>
    </div>
  );
}
