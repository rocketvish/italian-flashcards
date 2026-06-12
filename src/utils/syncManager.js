/**
 * Lightweight event bridge between useProgress and useSync.
 * Lets useProgress notify the sync layer about card updates
 * without prop drilling or React context.
 */
let _listener = null;
const DIRTY_KEY = 'srs_sync_dirty';
const DELETED_KEY = 'srs_sync_deleted';

function getSet(key) {
  try {
    return new Set(JSON.parse(localStorage.getItem(key) ?? '[]'));
  } catch {
    return new Set();
  }
}

function setStoredSet(key, value) {
  localStorage.setItem(key, JSON.stringify([...value]));
}

function markDirty(wordId) {
  if (!wordId) return;
  const deleted = getSet(DELETED_KEY);
  deleted.delete(wordId);
  setStoredSet(DELETED_KEY, deleted);

  const dirty = getSet(DIRTY_KEY);
  dirty.add(wordId);
  setStoredSet(DIRTY_KEY, dirty);
}

function markDeleted(wordId) {
  if (!wordId) return;
  const dirty = getSet(DIRTY_KEY);
  dirty.delete(wordId);
  setStoredSet(DIRTY_KEY, dirty);

  const deleted = getSet(DELETED_KEY);
  deleted.add(wordId);
  setStoredSet(DELETED_KEY, deleted);
}

export function registerUpdateListener(fn) {
  _listener = fn;
  return () => { _listener = null; };
}

export function notifyCardUpdate(wordId, card) {
  markDirty(wordId);
  _listener?.(wordId, card);
}

export function notifyCardDelete(wordId) {
  markDeleted(wordId);
  _listener?.(wordId, null);
}
