import { ReactRef, RefCallback } from './types';

/**
 * Unmemoized version of {@link useRefToCallback}
 * @see {@link useRefToCallback}
 * @param ref
 */
export function refToCallback<T>(ref: ReactRef<T>): RefCallback<T> {
  return (newValue) => {
    if (typeof ref === 'function') {
      ref(newValue);
    } else if (ref) {
      ref.current = newValue;
    }
  };
}

const nullCallback = (): any => null;
// lets maintain a weak ref to, well, ref :)
// not using `kashe` to keep this package small
const weakMem = new WeakMap<ReactRef<any>, RefCallback<any>>();

const weakMemoize = (ref: ReactRef<any>) => {
  const usedRef = ref || nullCallback;

  if (weakMem.has(usedRef)) {
    return weakMem.get(usedRef);
  }

  const cb = refToCallback(usedRef);
  weakMem.set(usedRef, cb);

  return cb;
};

/**
 * Transforms a given `ref` into `callback`.
 *
 * To transform `callback` into ref use {@link useCallbackRef|useCallbackRef(undefined, callback)}
 *
 * @param {ReactRef} ref
 * @returns {Function}
 *
 * @see https://github.com/theKashey/use-callback-ref#reftocallback
 *
 * @example
 * const ref = useRef(0);
 * const setRef = useRefToCallback(ref);
 * 👉 setRef(10);
 * ✅ ref.current === 10
 */
export function useRefToCallback<T>(ref: ReactRef<T>): RefCallback<T> {
  return weakMemoize(ref);
}
