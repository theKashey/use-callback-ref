import * as React from 'react';
import {createCallbackRef} from "./createRef";
import {assignRef} from "./assignRef";
import {ReactRef} from "./types";

export function mergeRefs<T>(refs: ReactRef<T>[]): React.MutableRefObject<T | null> {
  return createCallbackRef<T>(newValue => (
    refs.forEach(ref => assignRef(ref, newValue))
  ));
}
