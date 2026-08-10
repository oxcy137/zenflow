interface TimerProps {
  elapsed: number;
  total: number;
  stepElapsed: number;
  stepDuration: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function Timer({ elapsed, total, stepElapsed, stepDuration }: TimerProps) {
  const progress = total > 0 ? elapsed / total : 0;
  const stepProgress = stepDuration > 0 ? stepElapsed / stepDuration : 0;

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: '3.2rem',
          fontWeight: 300,
          color: 'var(--white)',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.08em',
          textShadow: '0 2px 12px rgba(0,0,0,0.2)',
        }}
      >
        {formatTime(elapsed)}
      </div>
      <div
        style={{
          width: '100%',
          height: 3,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
          marginTop: 10,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--red-300), var(--red-400))',
            borderRadius: 2,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div
        style={{
          width: '100%',
          height: 2,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 1,
          marginTop: 6,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${stepProgress * 100}%`,
            height: '100%',
            background: 'rgba(255,255,255,0.25)',
            borderRadius: 1,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <div
        style={{
          fontSize: '0.78rem',
          color: 'rgba(255,255,255,0.4)',
          marginTop: 6,
          letterSpacing: '0.05em',
        }}
      >
        {formatTime(total - elapsed)} restantes
      </div>
    </div>
  );
}
