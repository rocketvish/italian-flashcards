import { useState, useCallback } from 'react';

/**
 * Manages user-starred "priority" words.
 *
 * Storage: localStorage key 'srs_priority'
 * Shape: { [wordId]: { starredAt: ISO, correctStreak: number } }
 *
 * A word graduates out of priority after GRADUATE_STREAK consecutive correct answers.
 * The user can also manually remove priority via removePriority().
 */

const STORAGE_KEY = 'srs_priority';
const GRADUATE_STREAK = 7;

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); }
  catch { return {}; }
}

function save(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch { /* quota exceeded — silently fail */ }
}

export function usePriority() {
  const [priorities, setPriorities] = useState(load);

  const update = useCallback((fn) => {
    setPriorities((prev) => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  const addPriority = useCallback((wordId) => {
    update((p) => ({
      ...p,
      [wordId]: { starredAt: new Date().toISOString(), correctStreak: 0 },
    }));
  }, [update]);

  const removePriority = useCallback((wordId) => {
    update((p) => { const n = { ...p }; delete n[wordId]; return n; });
  }, [update]);

  const isPriority = useCallback((wordId) => !!priorities[wordId], [priorities]);

  const getPriorityWordIds = useCallback(
    () => new Set(Object.keys(priorities)),
    [priorities]
  );

  const recordCorrect = useCallback((wordId) => {
    update((p) => {
      if (!p[wordId]) return p;
      const streak = (p[wordId].correctStreak ?? 0) + 1;
      if (streak >= GRADUATE_STREAK) {
        const next = { ...p };
        delete next[wordId];
        return next;
      }
      return { ...p, [wordId]: { ...p[wordId], correctStreak: streak } };
    });
  }, [update]);

  const recordIncorrect = useCallback((wordId) => {
    update((p) => {
      if (!p[wordId]) return p;
      return { ...p, [wordId]: { ...p[wordId], correctStreak: 0 } };
    });
  }, [update]);

  const priorityCount = Object.keys(priorities).length;

  return {
    priorities,
    priorityCount,
    isPriority,
    getPriorityWordIds,
    addPriority,
    removePriority,
    recordCorrect,
    recordIncorrect,
  };
}
