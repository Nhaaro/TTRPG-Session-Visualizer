import { DependencyList, useCallback, useEffect } from 'react';

export const offset = new Date().getTimezoneOffset();

export function MS(minutes: number, seconds = 0): number {
  return 1000 * 60 * (minutes + seconds / 60); // X minutes
}
MS.day = 1000 * 60 * 60 * 24; // 24 day
MS.hour = 1000 * 60 * 60; // 1 hour

export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
export function isValidHtml(str: string): boolean {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<!DOCTYPE html><html><head></head><body>${str}</body></html>`, 'text/html');
    return !!doc.querySelectorAll('*')[3];
  } catch (e) {
    return false;
  }
}

export function useArrayIterator<T, D extends DependencyList>(
  setup: { array: T[]; deps?: D },
  onIterate: (index: number, item: T, deps: D) => void,
  reset?: () => void
) {
  const memoizedOnIterate = useCallback(onIterate, setup.deps || []);

  useEffect(() => {
    let currentIndex = 0;

    if (setup.array.length) {
      const interval = setInterval(() => {
        const currentItem = setup.array[currentIndex];
        if (currentItem) memoizedOnIterate(currentIndex, currentItem, setup.deps || ([] as unknown as D));
        if (currentIndex !== setup.array.length) currentIndex = currentIndex + 1;
        else clearInterval(interval);
      }, 10);

      return () => {
        clearInterval(interval);
        reset?.();
      };
    }
  }, [setup.array, memoizedOnIterate, ...(setup.deps || [])]);
}
