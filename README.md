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

# API
## useRef API
API is 99% compatible with React `createRef` and `useRef`, and just adds another argument - `callback`,
which would be called on __ref update__.

- `createCallbackRef(callback)` - (aka React.createRef) would call provided callback when ref is changed.
- `useRef(initialValue, callback)` - (aka React.useRef)would call provided callback when ref is changed.

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

💡 You can use `useCallbackRef` to convert RefObject into RefCallback, creating bridges between the old and the new code
```js
// some old component
const onRefUpdate = (newValue) => {...}
const refObject = useCallbackRef(null, onRefUpdate);
// ...
<SomeNewComponent ref={refObject}/>
```

## Additional API
### mergeRefs
`mergeRefs(refs: arrayOfRefs, [defaultValue]):ReactMutableRef` - merges a few refs together

```js
import React from 'react'
import {mergeRefs} from 'use-callback-ref'

const MergedComponent = React.forwardRef(function Example(props, ref) {
  const localRef = React.useRef()
  return <div ref={mergeRefs([localRef, ref])} />
})
```

> based on https://github.com/smooth-code/react-merge-refs, just exposes RefObject, instead of callback

When developing low level UI components, it is common to have to use a local ref but also support an external one using React.forwardRef. Natively, React does not offer a way to set two refs inside the ref property. This is the goal of this small utility.



# License
MIT
