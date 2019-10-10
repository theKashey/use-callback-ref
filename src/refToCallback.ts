import {ReactRef, RefCallback} from "./types";
import {useRef} from "react";

export function refToCallback<T>(ref: ReactRef<T>): RefCallback<T> {
  return newValue => {
    if (typeof ref === 'function') {
      ref(newValue)
    } else if (ref != null) {
      ref.current = newValue
    }
  }
}

export function useRefToCallback<T>(ref: ReactRef<T>): RefCallback<T> {
  return useRef(refToCallback(ref)).current;
}