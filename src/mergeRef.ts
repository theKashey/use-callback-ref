import * as React from 'react';
import {useCallbackRef} from "./useRef";

type ReactRef<T> = (
  ((newValue: T | null) => void) |
  React.MutableRefObject<T | null>
  );

export function mergeRefs<T>(refs: ReactRef<T>[], defaultValue?: T): React.MutableRefObject<T | null> {
  return useCallbackRef<T>(defaultValue, newValue => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(newValue)
      } else if (ref != null) {
        ref.current = newValue
      }
    })
  });
}