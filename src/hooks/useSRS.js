import { useState, useCallback, useRef } from 'react';
import { processRating, isDue } from '../utils/srs';
import { useProgress } from './useProgress';

/**
 * Manages an active study session using SRS.
 *
 * Session order:
 *   1. Due review words sorted by most overdue (nextDue asc)
 *   2. New words (never seen) to fill remaining slots up to batchSize
 *
 * The session list is snapshotted once on mount (or after restart) so
 * answering cards doesn't scramble the order mid-session.
 */
export function useSRS(words, batchSize = 10) {
  const { getCard, updateCard, restoreCard } = useProgress();

  const sessionRef = useRef(null);
  const reviewCountRef = useRef(0);

  if (sessionRef.current === null && words.length > 0) {
    const due = words
      .filter((w) => { const c = getCard(w.id); return c.lastSeen && isDue(c); })
      .sort((a, b) => {
        const da = getCard(a.id).nextDue ?? '0000-00-00';
        const db = getCard(b.id).nextDue ?? '0000-00-00';
        return da < db ? -1 : da > db ? 1 : 0;
      });
    const newWords = words.filter((w) => !getCard(w.id).lastSeen);
    const slots = Math.max(0, batchSize - due.length);
    reviewCountRef.current = Math.min(due.length, batchSize);
    sessionRef.current = [...due, ...newWords.slice(0, slots)].slice(0, batchSize);
  }

  const sessionWords = sessionRef.current ?? [];
  const reviewCount = reviewCountRef.current;

  const [sessionHistory, setSessionHistory] = useState([]);
  const [prevCardStates, setPrevCardStates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  const currentWord = sessionWords[currentIndex] ?? null;

  const answer = useCallback(
    (response) => {
      if (!currentWord) return;
      const snapshot = getCard(currentWord.id);
      const updated = processRating(snapshot, response);
      updateCard(currentWord.id, updated);
      setSessionHistory((h) => [...h, { wordId: currentWord.id, response }]);
      setPrevCardStates((s) => [...s, { wordId: currentWord.id, snapshot }]);

      if (currentIndex + 1 >= sessionWords.length) {
        setSessionDone(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [currentWord, currentIndex, sessionWords.length, getCard, updateCard]
  );

  const undo = useCallback(() => {
    if (prevCardStates.length === 0 || currentIndex === 0) return;
    const last = prevCardStates[prevCardStates.length - 1];
    restoreCard(last.wordId, last.snapshot);
    setPrevCardStates((s) => s.slice(0, -1));
    setCurrentIndex((i) => i - 1);
    setSessionHistory((h) => h.slice(0, -1));
    setSessionDone(false);
  }, [prevCardStates, currentIndex, restoreCard]);

  const restart = useCallback(() => {
    sessionRef.current = null;
    reviewCountRef.current = 0;
    setCurrentIndex(0);
    setSessionHistory([]);
    setPrevCardStates([]);
    setSessionDone(false);
  }, []);

  // New words introduced this session = those at indices >= reviewCount that were answered
  const newWordsAnswered = sessionHistory.filter((_, i) => i >= reviewCount).length;

  // Highest consecutive correct streak this session
  let maxStreak = 0;
  let curStreak = 0;
  for (const h of sessionHistory) {
    if (h.response !== 'again') { curStreak++; maxStreak = Math.max(maxStreak, curStreak); }
    else curStreak = 0;
  }

  return {
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
    progress: sessionWords.length > 0 ? currentIndex / sessionWords.length : 0,
  };
}
