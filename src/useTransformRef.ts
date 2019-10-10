import {ReactRef, RefObject} from "./types";
import {useCallbackRef} from "./useRef";
import {assignRef} from "./assignRef";

export function useTransformRef<T, K>(ref: ReactRef<K>, transformer: (original: T) => K): RefObject<T> {
  return useCallbackRef<T>(
    undefined,
    value => assignRef(ref, transformer(value))
  )
}