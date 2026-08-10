import { useCallback } from 'react';

export function useCardTilt<T extends HTMLElement>(ref: React.RefObject<T | null>, maxAngle = 10) {
  const setTransform = useCallback((x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    const base = el.dataset['flipped'] === 'true' ? 'rotateY(180deg)' : '';
    if (x === 0 && y === 0) {
      el.style.transform = base;
    } else {
      el.style.transform = `${base} rotateX(${(-y * maxAngle).toFixed(1)}deg) rotateY(${(x * maxAngle).toFixed(1)}deg)`;
    }
  }, [ref, maxAngle]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || el.dataset['flipped'] !== 'true') return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTransform(x, y);
  }, [ref, setTransform]);

  const onPointerLeave = useCallback(() => {
    setTransform(0, 0);
  }, [setTransform]);

  return { onPointerMove, onPointerLeave, setTransform };
}
