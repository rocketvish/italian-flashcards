import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_CARD } from '../utils/srs';

const STORAGE_KEY = 'srs_progress';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

/**
 * Tracks and persists per-word SRS progress in localStorage.
 * progress shape: { [wordId]: { ...DEFAULT_CARD fields } }
 * Status ('learning'|'reviewing'|'mastered') is set by processRating() in srs.js.
 */
export function useProgress() {
  const [progress, setProgress] = useState(loadFromStorage);

  useEffect(() => {
    saveToStorage(progress);
  }, [progress]);

  const getCard = useCallback(
    (wordId) => progress[wordId] ?? { ...DEFAULT_CARD },
    [progress]
  );

  // Merge updates into existing card
  const updateCard = useCallback((wordId, updates) => {
    setProgress((prev) => ({
      ...prev,
      [wordId]: { ...(prev[wordId] ?? { ...DEFAULT_CARD }), ...updates },
    }));
  }, []);

  // Restore a card to a previous snapshot exactly (used by undo)
  const restoreCard = useCallback((wordId, snapshot) => {
    setProgress((prev) => ({ ...prev, [wordId]: snapshot }));
  }, []);

  // Reset a single word back to "new" (removes its progress entry)
  const resetWord = useCallback((wordId) => {
    setProgress((prev) => {
      const next = { ...prev };
      delete next[wordId];
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setProgress({});
  }, []);

  const exportProgress = useCallback(() => {
    return JSON.stringify(progress, null, 2);
  }, [progress]);

  const importProgress = useCallback((json) => {
    try {
      const parsed = JSON.parse(json);
      setProgress(parsed);
      return true;
    } catch {
      return false;
    }
  }, []);

  const stats = {
    total:     Object.keys(progress).length,
    learning:  Object.values(progress).filter((c) => c.status === 'learning').length,
    reviewing: Object.values(progress).filter((c) => c.status === 'reviewing').length,
    mastered:  Object.values(progress).filter((c) => c.status === 'mastered').length,
  };

  return { progress, getCard, updateCard, restoreCard, resetWord, resetAll, exportProgress, importProgress, stats };
}
