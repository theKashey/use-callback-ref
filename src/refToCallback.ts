import { ReactRef, RefCallback } from './types';
import { useRef, useState } from 'react';

export function refToCallback<T>(ref: ReactRef<T>): RefCallback<T> {
  return newValue => {
    if (typeof ref === 'function') {
      ref(newValue);
    } else if (ref != null) {
      ref.current = newValue;
    }
  };
}

// lets maintain a weak ref to, well, ref :)
// not using `kashe` to keep this package small
const weakMem = new WeakMap<ReactRef<any>, RefCallback<any>>();
const weakMemoize = (ref: ReactRef<any>) => {
  if (weakMem.has(ref)) {
    return weakMem.get(ref);
  }
  const cb = refToCallback(ref);
  weakMem.set(ref, cb);
  return cb;
};

export function useRefToCallback<T>(ref: ReactRef<T>): RefCallback<T> {
  return weakMemoize(ref);
}
