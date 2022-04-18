import { assignRef } from './assignRef';
import { ReactRef, RefObject } from './types';
import { useCallbackRef } from './useRef';

/**
 * Create a _lense_ on Ref, making it possible to transform ref value
 * @param {ReactRef} ref
 * @param {Function} transformer. 👉 Ref would be __NOT updated__ on `transformer` update.
 * @returns {RefObject}
 *
 * @see https://github.com/theKashey/use-callback-ref#usetransformref-to-replace-reactuseimperativehandle
 * @example
 *
 * const ResizableWithRef = forwardRef((props, ref) =>
 *  <Resizable {...props} ref={useTransformRef(ref, i => i ? i.resizable : null)}/>
 * );
 */
export function useTransformRef<T, K>(ref: ReactRef<K>, transformer: (original: T | null) => K): RefObject<T> {
  return useCallbackRef<T>(null, (value) => assignRef(ref, transformer(value)));
}
