import {RefObject} from "react";

export function createCallbackRef<T>(callback: (value: T) => any):RefObject<T> {
  let current: T | null = null;

  return {
    get current() {
      return current;
    },
    set current(value: T) {
      current = value;
      callback(value);
    }
  }
}