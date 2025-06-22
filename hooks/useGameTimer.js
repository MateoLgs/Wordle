// hooks/useGameTimer.js

import { useEffect, useRef, useState } from 'react';

export function useGameTimer({ mode, isActive, initialSeconds = 60, onTimeout, resetKey }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const timerRef = useRef();

  // Reset on new game or when resetKey changes
  useEffect(() => {
    setTimeLeft(initialSeconds);
    clearInterval(timerRef.current);
    if (isActive && mode === 'timed') {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            if (onTimeout) onTimeout();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [mode, isActive, initialSeconds, onTimeout, resetKey]);

  // Pause on unmount or when game ends
  useEffect(() => () => clearInterval(timerRef.current), []);

  return [timeLeft, setTimeLeft];
}
