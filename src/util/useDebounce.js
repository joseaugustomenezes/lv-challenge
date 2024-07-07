import { useEffect, useRef, useState } from 'react';

export function useDebounce(cb, delay) {
  const [debounceValue, setDebounceValue] = useState();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      const handler = setTimeout(() => {
        setDebounceValue(cb);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [cb, delay]);
  return debounceValue;
}
