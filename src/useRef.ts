import { MutableRefObject, useState } from 'react';

export function useCallbackRef<T>(
  initialValue: T | null,
  callback: (newValue: T | null, lastValue: T | null) => void
): MutableRefObject<T | null> {
  const [ref] = useState(() => ({
    // value
    value: initialValue,
    // last callback
    callback,
    // "memoized" public interface
    facade: {
      get current() {
        return ref.value;
      },
      set current(value) {
        const last = ref.value;
        if (last !== value) {
          ref.value = value;
          ref.callback(value, last);
        }
      }
    }
  }));
  // update callback
  ref.callback = callback;

  return ref.facade;
}
