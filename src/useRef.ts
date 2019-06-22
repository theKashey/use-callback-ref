import {MutableRefObject, useRef} from 'react';

export function useCallbackRef<T>(initialValue: T, callback: (newValue: T, lastValue: T) => void): MutableRefObject<T> {
  const ref = useRef({
    // value
    value: initialValue,
    // last callback
    callback,
    // "memoized" public interface
    facade: {
      get current() {
        return ref.current.value;
      },
      set current(value) {
        const last = ref.current.value;
        if (last !== value) {
          ref.current.value = value;
          ref.current.callback(value, last);
        }
      }
    }
  });
  // update callback
  ref.current.callback = callback;

  return ref.current.facade;
}
