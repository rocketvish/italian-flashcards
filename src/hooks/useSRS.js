import { useState, useCallback, useRef } from 'react';
import { processRating, isDue } from '../utils/srs';
import { useProgress } from './useProgress';
import { isPriorityWord } from '../utils/priority';

/**
 * Manages an active study session using SRS.
 *
 * Session order:
 *   1. User-starred priority words (force-included regardless of due date)
 *   2. Due review words sorted by system priority first, then most overdue
 *   3. New words (system priority first) to fill remaining slots up to batchSize
 *
 * The session list is snapshotted once on mount (or after restart).
 *
 * @param {object[]} words       - Full word list
 * @param {number}   batchSize   - Max cards per session
 * @param {Set}      priorityWordIds - User-starred word IDs (always appear first)
 */
export function useSRS(words, batchSize = 10, priorityWordIds = new Set()) {
  const { getCard, updateCard, restoreCard } = useProgress();

  const sessionRef = useRef(null);
  const reviewCountRef = useRef(0);
  const priorityCountRef = useRef(0);

  if (sessionRef.current === null && words.length > 0) {
    // 1. User-starred words — force-included regardless of due date, sorted by most overdue
    const starred = words
      .filter((w) => priorityWordIds.has(w.id))
      .sort((a, b) => {
        const da = getCard(a.id).nextDue ?? '0000-00-00';
        const db = getCard(b.id).nextDue ?? '0000-00-00';
        return da < db ? -1 : da > db ? 1 : 0;
      });

    // 2. Due words (not starred) — system priority words first, then by nextDue
    const due = words
      .filter((w) => {
        if (priorityWordIds.has(w.id)) return false;
        const c = getCard(w.id);
        return c.lastSeen && isDue(c);
      })
      .sort((a, b) => {
        const ap = isPriorityWord(a) ? 0 : 1;
        const bp = isPriorityWord(b) ? 0 : 1;
        if (ap !== bp) return ap - bp;
        const da = getCard(a.id).nextDue ?? '0000-00-00';
        const db = getCard(b.id).nextDue ?? '0000-00-00';
        return da < db ? -1 : da > db ? 1 : 0;
      });

    // 3. New words (not starred) — system priority words first
    const newWords = words
      .filter((w) => !priorityWordIds.has(w.id) && !getCard(w.id).lastSeen)
      .sort((a, b) => (isPriorityWord(b) ? 1 : 0) - (isPriorityWord(a) ? 1 : 0));

    const starredSlots = Math.min(starred.length, batchSize);
    const dueSlots = Math.min(due.length, batchSize - starredSlots);
    const newSlots = Math.max(0, batchSize - starredSlots - dueSlots);

    priorityCountRef.current = starredSlots;
    reviewCountRef.current = dueSlots;
    sessionRef.current = [
      ...starred.slice(0, starredSlots),
      ...due.slice(0, dueSlots),
      ...newWords.slice(0, newSlots),
    ];
  }

  const sessionWords = sessionRef.current ?? [];
  const reviewCount = reviewCountRef.current;
  const priorityCount = priorityCountRef.current;

  const [sessionHistory, setSessionHistory] = useState([]);
  const [prevCardStates, setPrevCardStates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  const currentWord = sessionWords[currentIndex] ?? null;

  const answer = useCallback(
    (response) => {
      if (!currentWord) return;
      const snapshot = getCard(currentWord.id);
      const updated = processRating(snapshot, response, isPriorityWord(currentWord));
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
    priorityCountRef.current = 0;
    setCurrentIndex(0);
    setSessionHistory([]);
    setPrevCardStates([]);
    setSessionDone(false);
  }, []);

  // New words introduced this session = those at indices >= (priorityCount + reviewCount) that were answered
  const newWordsAnswered = sessionHistory.filter(
    (_, i) => i >= priorityCount + reviewCount
  ).length;

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
    priorityCount,
    newWordsAnswered,
    maxStreak,
    answer,
    undo,
    restart,
    progress: sessionWords.length > 0 ? currentIndex / sessionWords.length : 0,
  };
}
