import { useState, useCallback, useEffect } from 'react';
import type { Meditation } from '@/types';
import { meditations } from '@/data/meditations';

const STORAGE_KEY = 'zenflow-unlocked';

function loadUnlocked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveUnlocked(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function useUnlockSystem(totalPoints: number) {
  const [unlocked, setUnlocked] = useState<Set<string>>(loadUnlocked);

  useEffect(() => { saveUnlocked(unlocked); }, [unlocked]);

  const isUnlocked = useCallback((m: Meditation) => {
    if (localStorage.getItem('zenflow-client-mode') === 'false') return true;
    const premium = !!localStorage.getItem('zenflow-premium');
    if (premium) return true;
    if (unlocked.has(m.id)) return true;
    if (m.pointsRequired === 0) return true;
    return false;
  }, [unlocked]);

  const canUnlock = useCallback((m: Meditation) => {
    if (isUnlocked(m)) return false;
    if (m.premium) return false;
    const required = m.pointsRequired ?? Infinity;
    return totalPoints >= required;
  }, [totalPoints, isUnlocked]);

  const unlock = useCallback((id: string) => {
    setUnlocked(prev => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const autoUnlock = useCallback(() => {
    for (const m of meditations) {
      if (m.premium) continue;
      if (m.pointsRequired === undefined || m.pointsRequired === 0) continue;
      if (totalPoints >= m.pointsRequired) {
        setUnlocked(prev => {
          if (prev.has(m.id)) return prev;
          const next = new Set(prev);
          next.add(m.id);
          return next;
        });
      }
    }
  }, [totalPoints]);

  return { isUnlocked, canUnlock, unlock, autoUnlock, unlocked };
}
