import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);
    // Missing cleanup: previous timers are never cancelled.
    return () => {
      clearTimeout(timer);
    }
  }, [value, delay]);

  return debounced;
}
