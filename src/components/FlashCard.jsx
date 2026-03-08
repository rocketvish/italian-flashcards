import { useState } from 'react';
import WordInfo from './WordInfo';
import ConjugationTable from './ConjugationTable';

/**
 * direction: 'it-en' | 'en-it' | 'mixed' (mixed uses word index parity)
 */
export default function FlashCard({ word, direction = 'it-en', cardIndex = 0, onFlip }) {
  const [flipped, setFlipped] = useState(false);

  // Determine which side is front
  const showItalianFirst =
    direction === 'it-en' || (direction === 'mixed' && cardIndex % 2 === 0);

  const frontText = showItalianFirst ? word.italian : word.english;
  const backText = showItalianFirst ? word.english : word.italian;

  function handleFlip() {
    setFlipped((f) => {
      const next = !f;
      onFlip?.(next);
      return next;
    });
  }

  return (
    <div
      className={`flashcard ${flipped ? 'flashcard--flipped' : ''}`}
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleFlip() : null}
      aria-label={flipped ? 'Card flipped — showing answer' : 'Tap to reveal answer'}
    >
      <div className="flashcard-inner">
        {/* Front */}
        <div className="flashcard-face flashcard-front">
          <div className="flashcard-lang">{showItalianFirst ? 'IT' : 'EN'}</div>
          <div className="flashcard-word">{frontText}</div>
          <div className="flashcard-hint">tap to flip</div>
        </div>

        {/* Back */}
        <div className="flashcard-face flashcard-back">
          <div className="flashcard-lang">{showItalianFirst ? 'EN' : 'IT'}</div>
          <div className="flashcard-word">{backText}</div>
          <WordInfo word={word} />
          {word.conjugations && (
            <ConjugationTable
              conjugations={word.conjugations}
              irregularForms={word.irregularForms}
            />
          )}
        </div>
      </div>
    </div>
  );
}
