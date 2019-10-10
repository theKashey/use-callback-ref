import {ReactRef, RefObject} from "./types";
import {useCallbackRef} from "./useRef";
import {assignRef} from "./assignRef";

export function transformRef<T, K>(ref: ReactRef<K>, transformer: (original: T) => K): RefObject<T> {
  return useCallbackRef<T>(
    undefined,
    value => assignRef(ref, transformer(value))
  )
}