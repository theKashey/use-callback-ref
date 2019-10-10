import {ReactRef} from "./types";

export function assignRef<T>(ref: ReactRef<T>, value: T | null): ReactRef<T> {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref != null) {
    ref.current = value
  }
  return ref;
}