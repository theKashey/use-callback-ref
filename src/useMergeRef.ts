import * as React from 'react';
import {useCallbackRef} from "./useRef";
import {assignRef} from "./assignRef";
import {ReactRef} from "./types";

export function useMergeRefs<T>(refs: ReactRef<T>[], defaultValue?: T): React.MutableRefObject<T | null> {
  return useCallbackRef<T>(defaultValue, newValue => (
    refs.forEach(ref => assignRef(ref, newValue))
  ));
}