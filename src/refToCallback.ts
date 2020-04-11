import {ReactRef, RefCallback} from './types';
import {useRef, useState} from 'react';

export function refToCallback<T>(ref: ReactRef<T>): RefCallback<T> {
  return newValue => {
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

export function useRefToCallback<T>(ref: ReactRef<T>): RefCallback<T> {
  return weakMemoize(ref);
}
