import {ReactRef, RefCallback} from "./types";

export function retToCallback<T>(ref: ReactRef<T>): RefCallback<T> {
  return newValue => {
    if (typeof ref === 'function') {
      ref(newValue)
    } else if (ref != null) {
      ref.current = newValue
    }
  }
}