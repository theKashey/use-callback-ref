import { assignRef } from './assignRef';
import { createCallbackRef } from './createRef';
import { ReactRef, RefObject } from './types';

export function transformRef<T, K>(ref: ReactRef<K>, transformer: (original: T) => K): RefObject<T> {
  return createCallbackRef<T>((value) => assignRef(ref, transformer(value)));
}
