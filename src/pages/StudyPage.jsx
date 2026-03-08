import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FlashCard from '../components/FlashCard';
import ProgressBar from '../components/ProgressBar';
import SessionSummary from '../components/SessionSummary';
import UndoButton from '../components/UndoButton';
import ReportErrorButton from '../components/ReportErrorButton';
import { useSRS } from '../hooks/useSRS';

export default function StudyPage({ words, direction, batchSize }) {
  const navigate = useNavigate();
  const {
    currentWord,
    sessionWords,
    currentIndex,
    sessionDone,
    sessionHistory,
    reviewCount,
    newWordsAnswered,
    maxStreak,
    answer,
    undo,
    restart,
  } = useSRS(words, batchSize);

  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state whenever the card changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  if (sessionDone) {
    return (
      <div className="page page-study">
        <SessionSummary
          history={sessionHistory}
          newLearned={newWordsAnswered}
          maxStreak={maxStreak}
          onRestart={restart}
          onDone={() => navigate('/review')}
        />
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="page page-study page-empty">
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h2>Nothing due!</h2>
          <p>All caught up. Come back later for more reviews.</p>
          <button className="btn btn-primary" onClick={() => navigate('/review')}>
            Browse words
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-study">
      <div className="study-header">
        <ProgressBar
          current={currentIndex}
          total={sessionWords.length}
          label={`Card ${currentIndex + 1} of ${sessionWords.length}`}
        />
        <UndoButton onUndo={undo} disabled={sessionHistory.length === 0} />
      </div>

      <div className="study-card-area">
        <FlashCard
          key={currentWord.id}
          word={currentWord}
          direction={direction}
          cardIndex={currentIndex}
          onFlip={setIsFlipped}
        />
      </div>

      <div className="answer-buttons">
        <button className="btn btn-again" onClick={() => answer('again')} disabled={!isFlipped}>Again</button>
        <button className="btn btn-hard"  onClick={() => answer('hard')}  disabled={!isFlipped}>Hard</button>
        <button className="btn btn-good"  onClick={() => answer('good')}  disabled={!isFlipped}>Good</button>
        <button className="btn btn-easy"  onClick={() => answer('easy')}  disabled={!isFlipped}>Easy</button>
      </div>

      <div className="study-footer">
        <ReportErrorButton word={currentWord} />
      </div>
    </div>
  );
}
