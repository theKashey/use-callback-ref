import * as React from 'react';

export type RefCallback<T> = (newValue: T | null) => void;
export type RefObject<T> = React.MutableRefObject<T | null>;

export type ReactRef<T> = RefCallback<T> | RefObject<T>;
