// @ts-types="@types/react"
import * as React from 'react';

import { assignRef } from './assignRef.ts';
import { ReactRef } from './types.ts';
import { useCallbackRef } from './useRef.ts';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

const currentValues = new WeakMap<any, ReactRef<any>[]>();

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
  const callbackRef = useCallbackRef<T>(defaultValue || null, (newValue) =>
    refs.forEach((ref) => assignRef(ref, newValue))
  );

  // handle refs changes - added or removed
  useIsomorphicLayoutEffect(() => {
    const oldValue = currentValues.get(callbackRef);

    if (oldValue) {
      const prevRefs = new Set(oldValue);
      const nextRefs = new Set(refs);
      const current = callbackRef.current;

      prevRefs.forEach((ref) => {
        if (!nextRefs.has(ref)) {
          assignRef(ref, null);
        }
      });

      nextRefs.forEach((ref) => {
        if (!prevRefs.has(ref)) {
          assignRef(ref, current);
        }
      });
    }

    currentValues.set(callbackRef, refs);
  }, [refs]);

  return callbackRef;
}
