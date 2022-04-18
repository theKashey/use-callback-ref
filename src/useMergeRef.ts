import * as React from 'react';

import { assignRef } from './assignRef';
import { ReactRef } from './types';
import { useCallbackRef } from './useRef';

/**
 * Merges two or more refs together providing a single interface to set their value
 * @param {RefObject|Ref} refs
 * @returns {MutableRefObject} - a new ref, which translates all changes to {refs}
 *
 * @see {@link mergeRefs} a version without buit-in memoization
 * @see https://github.com/theKashey/use-callback-ref#usemergerefs
 * @example
 * const Component = React.forwardRef((props, ref) => {
 *   const ownRef = useRef();
 *   const domRef = useMergeRefs([ref, ownRef]); // 👈 merge together
 *   return <div ref={domRef}>...</div>
 * }
 */
export function useMergeRefs<T>(refs: ReactRef<T>[], defaultValue?: T): React.MutableRefObject<T | null> {
  return useCallbackRef<T>(defaultValue, (newValue) => refs.forEach((ref) => assignRef(ref, newValue)));
}
