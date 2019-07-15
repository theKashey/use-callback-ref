<div align="center">
  <h1>🤙 use-callback-ref 📞</h1>
  <br/>
  Hey! Your ref just got changed!
  <br/>
    <a href="https://www.npmjs.com/package/kashe">
      <img src="https://img.shields.io/npm/v/use-callback-ref.svg?style=flat-square" />
    </a>
    <a href="https://travis-ci.org/theKashey/use-callback-ref">
       <img alt="Travis" src="https://img.shields.io/travis/theKashey/use-callback-ref/master.svg?style=flat-square">
    </a>
    <a href="https://bundlephobia.com/result?p=use-callback-ref">
      <img src="https://img.shields.io/bundlephobia/minzip/use-callback-ref.svg" alt="bundle size">
    </a> 
</div>

---

> Keep in mind that useRef doesn't notify you when its content changes.
Mutating the .current property doesn't cause a re-render.
If you want to run some code when React attaches or detaches a ref to a DOM node, 
you may want to use ~~a callback ref instead~~ .... __useCallbackRef__ instead.

– [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html#useref)

Read more about pattern - https://dev.to/thekashey/the-same-useref-but-it-will-callback-8bo

# API
API is 99% compatible with React `createRef` and `useRef`, and just adds another argument - `callback`,
which would be called on __ref update__.

#### createCallbackRef - to replace aka React.createRef
- `createCallbackRef(callback)` -  would call provided `callback` when ref is changed.

#### useCallbackRef - to replace aka React.useRef
- `useCallbackRef(initialValue, callback)` - would call provided `callback` when ref is changed.

> `callback` in both cases is `callback(newValue, oldValue)`. Callback would not be called if newValue and oldValue is the same.

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

