import {RefObject} from "react";

export function createCallbackRef<T>(callback: (newValue: T, lastValue: T | null) => any): RefObject<T> {
  let current: T | null = null;

  return {
    get current() {
      return current;
    },
    set current(value: T) {
      const last = current;
      if (last !== value) {
        current = value;
        callback(value, last);
      }
    }
  }
}