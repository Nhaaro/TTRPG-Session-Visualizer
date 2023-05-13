import { DependencyList, useCallback, useEffect } from 'react';

export const offset = new Date().getTimezoneOffset();

export function MS(minutes: number, seconds = 0): number {
  return 1000 * 60 * (minutes + seconds / 60); // X minutes
}
MS.day = 1000 * 60 * 60 * 24; // 24 day
MS.hour = 1000 * 60 * 60; // 1 hour

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
        if (currentIndex === setup.array.length) clearInterval(interval);
        else currentIndex = currentIndex + 1;
      }, 100);

      return () => {
        clearInterval(interval);
        reset?.();
      };
    }
  }, [setup.array, memoizedOnIterate, ...(setup.deps || [])]);
}
