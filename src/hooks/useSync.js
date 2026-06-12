import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { registerUpdateListener } from '../utils/syncManager';
import { getProgressSnapshot, replaceProgress } from './useProgress';

const DIRTY_KEY     = 'srs_sync_dirty';
const DELETED_KEY   = 'srs_sync_deleted';
const LAST_SYNC_KEY = 'srs_last_sync';
const BATCH_SIZE    = 500;

// ── localStorage helpers ──────────────────────────────────────────────────────
function getProgress() {
  return getProgressSnapshot();
}
function getDirty() {
  try { return new Set(JSON.parse(localStorage.getItem(DIRTY_KEY) ?? '[]')); } catch { return new Set(); }
}
function setDirty(s) { localStorage.setItem(DIRTY_KEY, JSON.stringify([...s])); }
function getDeleted() {
  try { return new Set(JSON.parse(localStorage.getItem(DELETED_KEY) ?? '[]')); } catch { return new Set(); }
}
function setDeleted(s) { localStorage.setItem(DELETED_KEY, JSON.stringify([...s])); }
function getLastSyncKey(userId) { return `${LAST_SYNC_KEY}:${userId}`; }

// ── Shape converters ──────────────────────────────────────────────────────────
function cardToRow(userId, wordId, card) {
  return {
    user_id:         userId,
    word_id:         wordId,
    status:          card.status          ?? 'new',
    interval:        card.interval        ?? 0,
    ease_factor:     card.easeFactor      ?? 2.5,
    streak:          card.streak          ?? 0,
    times_correct:   card.timesCorrect    ?? 0,
    times_incorrect: card.timesIncorrect  ?? 0,
    last_seen:       card.lastSeen        ?? null,
    next_due:        card.nextDue         ?? null,
    updated_at:      card.updatedAt       ?? new Date().toISOString(),
  };
}

function rowToCard(row) {
  return {
    status:          row.status,
    interval:        row.interval,
    easeFactor:      row.ease_factor,
    streak:          row.streak,
    timesCorrect:    row.times_correct,
    timesIncorrect:  row.times_incorrect,
    lastSeen:        row.last_seen,
    nextDue:         row.next_due,
    updatedAt:       row.updated_at,
  };
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useSync(user) {
  const [status,     setStatus]     = useState('idle');
  const [lastSyncAt, setLastSyncAt] = useState(null);
  const busyRef   = useRef(false);
  const userRef   = useRef(user);

  useEffect(() => {
    userRef.current = user;
    setLastSyncAt(user?.id ? localStorage.getItem(getLastSyncKey(user.id)) : null);
  }, [user]);

  const sync = useCallback(async () => {
    const userId = userRef.current?.id;
    if (!userId) return;
    if (!navigator.onLine) { setStatus('offline'); return; }
    if (busyRef.current)   return;

    busyRef.current = true;
    setStatus('syncing');

    try {
      // 1. Pull from Supabase
      const { data: rows, error: pullErr } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);
      if (pullErr) throw pullErr;

      // 2. Merge: newest updated_at wins, while remembering local rows that
      // Supabase is missing or that are newer locally so sync can self-heal.
      const deleted = getDeleted();
      const local = { ...getProgress() };
      const remoteRows = (rows ?? []).filter((row) => !deleted.has(row.word_id));
      const remoteById = new Map(remoteRows.map((row) => [row.word_id, row]));
      const missingRemoteIds = [];
      const localNewerIds = [];

      for (const [wordId, localCard] of Object.entries(local)) {
        const remoteRow = remoteById.get(wordId);
        if (!remoteRow) {
          missingRemoteIds.push(wordId);
          continue;
        }
        if ((localCard?.updatedAt ?? '') > (remoteRow.updated_at ?? '')) {
          localNewerIds.push(wordId);
        }
      }

      for (const row of remoteRows) {
        const localCard = local[row.word_id];
        const localTime = localCard?.updatedAt ?? '';
        if ((row.updated_at ?? '') > localTime) {
          local[row.word_id] = rowToCard(row);
        }
      }
      replaceProgress(local);

      // 3. Push dirty cards, all cards on this user's first sync, and any
      // local rows the remote lacks or has older data for.
      const lastSyncKey = getLastSyncKey(userId);
      const isFirstSync = !localStorage.getItem(lastSyncKey);
      const dirty       = getDirty();
      const idsToPush   = [
        ...(isFirstSync ? Object.keys(local) : [...dirty].filter((id) => local[id])),
        ...missingRemoteIds,
        ...localNewerIds,
      ].filter((id, index, ids) => local[id] && !deleted.has(id) && ids.indexOf(id) === index);

      const idsToDelete = [...deleted];

      if (idsToDelete.length > 0) {
        for (let i = 0; i < idsToDelete.length; i += BATCH_SIZE) {
          const batch = idsToDelete.slice(i, i + BATCH_SIZE);
          const { error: deleteErr } = await supabase
            .from('user_progress')
            .delete()
            .eq('user_id', userId)
            .in('word_id', batch);
          if (deleteErr) throw deleteErr;
        }
        setDeleted(new Set());
      }

      if (idsToPush.length > 0) {
        for (let i = 0; i < idsToPush.length; i += BATCH_SIZE) {
          const batch = idsToPush.slice(i, i + BATCH_SIZE)
            .map((id) => cardToRow(userId, id, local[id]));
          const { error: pushErr } = await supabase
            .from('user_progress')
            .upsert(batch, { onConflict: 'user_id,word_id' });
          if (pushErr) throw pushErr;
        }
        setDirty(new Set());
      } else if (idsToDelete.length > 0) {
        setDirty(new Set());
      }

      const now = new Date().toISOString();
      localStorage.setItem(getLastSyncKey(userId), now);
      setLastSyncAt(now);
      setStatus('idle');
    } catch (err) {
      console.error('[Sync] error:', err);
      setStatus('error');
    } finally {
      busyRef.current = false;
    }
  }, []); // stable reference — reads everything from refs / localStorage

  // Sync on login / user change
  useEffect(() => {
    if (user) sync();
    else      setStatus('idle');
  }, [user, sync]);

  // Listen for card updates (debounced 1.5 s)
  useEffect(() => {
    if (!user) return;
    let timer;
    const unreg = registerUpdateListener(() => {
      clearTimeout(timer);
      timer = setTimeout(sync, 1500);
    });
    return () => { unreg(); clearTimeout(timer); };
  }, [user, sync]);

  // Online / offline
  useEffect(() => {
    const onOnline  = () => sync();
    const onOffline = () => setStatus('offline');
    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online',  onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [sync]);

  return { status, lastSyncAt, syncNow: sync };
}
