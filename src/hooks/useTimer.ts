import { useState, useEffect, useCallback, useRef } from 'react';

interface TimerState {
  elapsed: number;
  total: number;
  isRunning: boolean;
  isPaused: boolean;
  currentStepIndex: number;
  stepElapsed: number;
}

export function useTimer(total: number) {
  const [state, setState] = useState<TimerState>({
    elapsed: 0,
    total,
    isRunning: false,
    isPaused: false,
    currentStepIndex: 0,
    stepElapsed: 0,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clear();
    setState(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
    }));
  }, [clear]);

  const pause = useCallback(() => {
    clear();
    setState(prev => ({ ...prev, isPaused: true }));
  }, [clear]);

  const resume = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: false }));
  }, []);

  const reset = useCallback(() => {
    clear();
    setState({
      elapsed: 0,
      total,
      isRunning: false,
      isPaused: false,
      currentStepIndex: 0,
      stepElapsed: 0,
    });
  }, [clear, total]);

  useEffect(() => {
    if (!state.isRunning || state.isPaused || state.elapsed >= state.total) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setState(prev => {
        const newElapsed = prev.elapsed + 1;
        const newStepElapsed = prev.stepElapsed + 1;
        if (newElapsed >= prev.total) {
          clear();
          return { ...prev, elapsed: prev.total, isRunning: false, stepElapsed: newStepElapsed };
        }
        return { ...prev, elapsed: newElapsed, stepElapsed: newStepElapsed };
      });
    }, 1000);
    return clear;
  }, [state.isRunning, state.isPaused, state.total, state.elapsed, clear]);

  const advanceStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStepIndex: prev.currentStepIndex + 1,
      stepElapsed: 0,
    }));
  }, []);

  return { state, start, pause, resume, reset, advanceStep };
}
