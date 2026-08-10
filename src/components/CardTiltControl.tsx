import { useState, useRef, useCallback } from 'react';

interface CardTiltControlProps {
  onTilt: (x: number, y: number) => void;
  onClose: () => void;
  open: boolean;
  style?: React.CSSProperties;
}

export function CardTiltControl({ onTilt, onClose, open, style }: CardTiltControlProps) {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = rect.width / 2;
    let dx = (e.clientX - cx) / radius;
    let dy = (e.clientY - cy) / radius;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 1) { dx /= dist; dy /= dist; }
    setKnobPos({ x: dx, y: dy });
    onTilt(dx, dy);
  }, [onTilt]);

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
    setKnobPos({ x: 0, y: 0 });
    onTilt(0, 0);
  }, [onTilt]);

  if (!open) return null;

  return (
    <div style={{
      position: 'absolute', zIndex: 1000,
      ...style,
    }}>
      <div
        ref={joystickRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          width: 80, height: 80, borderRadius: '50%', position: 'relative',
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.25)',
          cursor: 'grab',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: -8, right: -8, zIndex: 10,
            width: 22, height: 22, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '12px',
            lineHeight: 1,
            padding: 0,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div
          style={{
            width: 24, height: 24, borderRadius: '50%',
            position: 'absolute',
            left: `calc(50% + ${knobPos.x * 24}px)`,
            top: `calc(50% + ${knobPos.y * 24}px)`,
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255,255,255,0.85)',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
            transition: dragging.current ? 'none' : 'left 0.2s ease, top 0.2s ease',
          }}
        />
      </div>
    </div>
  );
}
