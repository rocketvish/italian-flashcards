import { useState } from 'react';
import WordInfo from './WordInfo';
import ConjugationTable from './ConjugationTable';
import PronounTable from './PronounTable';
import NounDetails from './NounDetails';

/**
 * Splits "the (masculine singular, before s+cons)" into
 * { core: "the", note: "masculine singular · before s+cons" }
 * Returns { core: text, note: null } when there are no parentheticals.
 */
function parseTranslation(text) {
  const match = text?.match(/^(.+?)\s*\((.+)\)$/);
  if (!match) return { core: text, note: null };
  return {
    core: match[1].trim(),
    note: match[2].replace(/,\s*/g, ' · '),
  };
}

/**
 * direction: 'it-en' | 'en-it' | 'mixed' (mixed uses word index parity)
 */
export default function FlashCard({ word, direction = 'it-en', cardIndex = 0, isPriority = false }) {
  const [flipped, setFlipped] = useState(false);

  const showItalianFirst =
    direction === 'it-en' || (direction === 'mixed' && cardIndex % 2 === 0);

  // Parse English side; Italian words are always plain
  const englishParsed = parseTranslation(word.english);

  const front = showItalianFirst
    ? { text: word.italian, note: null }
    : { text: englishParsed.core, note: englishParsed.note };

  const back = showItalianFirst
    ? { text: englishParsed.core, note: englishParsed.note }
    : { text: word.italian, note: null };

  function handleFlip() {
    setFlipped((f) => !f);
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
          <div className="flashcard-lang">
            {showItalianFirst ? 'IT' : 'EN'}
            {isPriority && <span className="flashcard-priority-badge" title="Priority word">⭐</span>}
          </div>
          <div className="flashcard-word">{front.text}</div>
          {front.note && <div className="flashcard-word-note">{front.note}</div>}
          <div className="flashcard-hint">tap to flip</div>
        </div>

        {/* Back */}
        <div className="flashcard-face flashcard-back">
          <div className="flashcard-lang">
            {showItalianFirst ? 'EN' : 'IT'}
            {isPriority && <span className="flashcard-priority-badge" title="Priority word">⭐</span>}
          </div>
          <div className="flashcard-word">{back.text}</div>
          {back.note && <div className="flashcard-word-note">{back.note}</div>}
          <WordInfo word={word} />
          {word.conjugations && (
            <ConjugationTable
              conjugations={word.conjugations}
              irregularForms={word.irregularForms}
            />
          )}
          {word.partOfSpeech === 'pronoun' && (
            <PronounTable word={word} />
          )}
          {word.partOfSpeech === 'noun' && (
            <NounDetails word={word} />
          )}
        </div>
      </div>
    </div>
  );
}
