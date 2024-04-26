// @deno-types="npm:@types/react@^18.2"
import { MutableRefObject } from 'react';

import { assignRef } from './assignRef.ts';
import { createCallbackRef } from './createRef.ts';
import { ReactRef } from './types.ts';

/**
 * Merges two or more refs together providing a single interface to set their value
 * @param {RefObject|Ref} refs
 * @returns {MutableRefObject} - a new ref, which translates all changes to {refs}
 *
 * @see {@link useMergeRefs} to be used in ReactComponents
 * @example
 * const Component = React.forwardRef((props, ref) => {
 *   const ownRef = useRef();
 *   const domRef = mergeRefs([ref, ownRef]); // 👈 merge together
 *   return <div ref={domRef}>...</div>
 * }
 */
export function mergeRefs<T>(refs: ReactRef<T>[]): MutableRefObject<T | null> {
  return createCallbackRef<T>((newValue) => refs.forEach((ref) => assignRef(ref, newValue)));
}
