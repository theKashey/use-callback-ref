import { assignRef } from './assignRef.ts';
import { createCallbackRef } from './createRef.ts';
import { ReactRef, RefObject } from './types.ts';

/**
 * Transforms one ref to another
 * @example
 * ```tsx
 * const ResizableWithRef = forwardRef((props, ref) =>
 *   <Resizable {...props} ref={transformRef(ref, i => i ? i.resizable : null)}/>
 * );
 * ```
 */
export function transformRef<T, K>(ref: ReactRef<K>, transformer: (original: T | null) => K): RefObject<T> {
  return createCallbackRef<T>((value) => assignRef(ref, transformer(value)));
}
