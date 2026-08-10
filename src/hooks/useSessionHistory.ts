import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'zenflow-sessions';

interface SessionRecord {
  id: string;
  meditationId: string;
  meditationTitle: string;
  date: string;
  duration: number;
  completed: boolean;
}

export function useSessionHistory() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSessions(JSON.parse(stored) as SessionRecord[]);
    } catch { /* ignore */ }
  }, []);

  const persist = useCallback((updated: SessionRecord[]) => {
    setSessions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addSession = useCallback((session: SessionRecord) => {
    persist([session, ...sessions]);
  }, [sessions, persist]);

  const clearHistory = useCallback(() => {
    persist([]);
  }, [persist]);

  const totalMinutes = sessions
    .filter(s => s.completed)
    .reduce((acc, s) => acc + s.duration, 0);

  const streak = (() => {
    if (sessions.length === 0) return 0;
    const sorted = [...sessions]
      .filter(s => s.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (sorted.length === 0) return 0;
    let count = 1;
    const today = new Date(sorted[0]!.date);
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i]!.date);
      const diff = (today.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff <= 1.5) {
        count++;
        today.setTime(prev.getTime());
      } else break;
    }
    return count;
  })();

  return { sessions, addSession, clearHistory, totalMinutes, streak };
}
