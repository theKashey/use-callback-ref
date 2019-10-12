import { ReactRef, RefObject } from './types';
import { assignRef } from './assignRef';
import { createCallbackRef } from './createRef';

export function transformRef<T, K>(
  ref: ReactRef<K>,
  transformer: (original: T) => K
): RefObject<T> {
  return createCallbackRef<T>(value => assignRef(ref, transformer(value)));
}
