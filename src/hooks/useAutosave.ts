import { useEffect, useRef } from 'react';

export function useAutosave(
  callback: () => void | Promise<void>,
  deps: unknown[],
  delay = 3000
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const timer = setTimeout(() => {
      savedCallback.current();
    }, delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}
