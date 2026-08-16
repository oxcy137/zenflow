import { useCallback, useEffect, useState } from 'react';

const KEY = 'fab-menu-rotation';
const ROTATION_EVENT = 'menu-rotation';

export function useMenuRotation() {
  const [rotation, setRotationState] = useState(() => {
    try { return parseInt(localStorage.getItem(KEY) ?? '0', 10); } catch { return 0; }
  });

  useEffect(() => {
    const sync = () => {
      try { setRotationState(parseInt(localStorage.getItem(KEY) ?? '0', 10)); } catch { setRotationState(0); }
    };
    window.addEventListener(ROTATION_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(ROTATION_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const setRotation = useCallback((val: number) => {
    const v = Math.max(-180, Math.min(180, val));
    setRotationState(v);
    localStorage.setItem(KEY, String(v));
    window.dispatchEvent(new Event(ROTATION_EVENT));
  }, []);

  return { rotation, setRotation };
}
