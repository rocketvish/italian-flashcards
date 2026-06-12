import { useSyncExternalStore, useCallback } from 'react';
import { DEFAULT_CARD } from '../utils/srs';
import { notifyCardDelete, notifyCardUpdate } from '../utils/syncManager';

const STORAGE_KEY = 'srs_progress';
const listeners = new Set();
let progressCache;

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

function getSnapshot() {
  if (!progressCache) progressCache = loadFromStorage();
  return progressCache;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setProgressStore(updater) {
  const prev = getSnapshot();
  const next = typeof updater === 'function' ? updater(prev) : updater;
  progressCache = next;
  saveToStorage(next);
  emitChange();
  return next;
}

export function getProgressSnapshot() {
  return getSnapshot();
}

export function replaceProgress(nextProgress) {
  setProgressStore(nextProgress ?? {});
}

/**
 * Tracks and persists per-word SRS progress in localStorage.
 * progress shape: { [wordId]: { ...DEFAULT_CARD fields } }
 * Status ('learning'|'reviewing'|'mastered') is set by processRating() in srs.js.
 */
export function useProgress() {
  const progress = useSyncExternalStore(subscribe, getSnapshot, () => ({}));

  const getCard = useCallback(
    (wordId) => progress[wordId] ?? { ...DEFAULT_CARD },
    [progress]
  );

  // Merge updates into existing card and notify sync
  const updateCard = useCallback((wordId, updates) => {
    let nextCard;
    setProgressStore((prev) => {
      nextCard = {
        ...(prev[wordId] ?? { ...DEFAULT_CARD }),
        updatedAt: new Date().toISOString(),
        ...updates,
      };
      return { ...prev, [wordId]: nextCard };
    });
    notifyCardUpdate(wordId, nextCard);
  }, []);

  // Restore a card to a previous snapshot exactly (used by undo)
  const restoreCard = useCallback((wordId, snapshot) => {
    const existedBefore = snapshot?.lastSeen || snapshot?.updatedAt || snapshot?.status !== 'new';
    if (!existedBefore) {
      setProgressStore((prev) => {
        const next = { ...prev };
        delete next[wordId];
        return next;
      });
      notifyCardDelete(wordId);
      return;
    }

    const nextSnapshot = { ...snapshot, updatedAt: new Date().toISOString() };
    setProgressStore((prev) => ({ ...prev, [wordId]: nextSnapshot }));
    notifyCardUpdate(wordId, nextSnapshot);
  }, []);

  // Reset a single word back to "new" (removes its progress entry)
  const resetWord = useCallback((wordId) => {
    setProgressStore((prev) => {
      const next = { ...prev };
      delete next[wordId];
      return next;
    });
    notifyCardDelete(wordId);
  }, []);

  const resetAll = useCallback(() => {
    const ids = Object.keys(getSnapshot());
    setProgressStore({});
    ids.forEach((id) => notifyCardDelete(id));
  }, []);

  const exportProgress = useCallback(() => {
    return JSON.stringify(progress, null, 2);
  }, [progress]);

  const importProgress = useCallback((json) => {
    try {
      const parsed = JSON.parse(json);
      setProgressStore(parsed);
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
