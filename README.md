use-callback-ref
---
> Keep in mind that useRef doesn't notify you when its content changes.
Mutating the .current property doesn't cause a re-render.
If you want to run some code when React attaches or detaches a ref to a DOM node, 
you may want to use ~~a callback ref instead~~ .... __useCallbackRef__ instead.

– [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html#useref)

# API
API is 99% compatible with React `createRef` and `useRef`, and just adds another argument - `callback`,
which would be called on __ref update__.

- (React.createRef) `createCallbackRef(callback)` - would call provided callback when ref is changed.
- (React.useRef) `useRef(initialValue, callback)` - would call provided callback when ref is changed.

- `callback` in both cases is `callback(newValue, oldValue)`. Callback would not be called if newValue and oldValue is the same.

```js
import {useRef, createRef, useState} from 'react';
import {useCallbackRef, createCallbackRef} from 'use-callback-ref';

const Component = () => {
  const [,forceUpdate] = useState();
  // I dont need callback when ref changes
  const ref = useRef(null); 
  
  // but sometimes - it could be what you need
  const anotherRef = useCallbackRef(null, () => forceUpdate());
  
  useEffect( () => {
    // now it's just possible
  }, [anotherRef.current]) // react to dom node change
}
```

# License
MIT
