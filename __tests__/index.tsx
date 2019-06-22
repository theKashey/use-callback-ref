import * as React from 'react';
import {mount} from 'enzyme';
import {createCallbackRef, useCallbackRef} from "../src";

describe('Specs', () => {
  it('base - createRef', () => {
    const ref = React.createRef<HTMLDivElement>();
    mount(<div ref={ref}>test</div>);
    expect(ref.current).not.toBe(null);
  });

  it('shall work as createRef', () => {
    const spy = jest.fn();
    const ref = createCallbackRef<HTMLDivElement>(spy);
    mount(<div ref={ref}>test</div>);
    expect(spy).toBeCalledWith(ref.current, null);
    expect(ref.current).not.toBe(null);
  });

  it('shall work as useRef', () => {
    const spy = jest.fn();
    let counter = 0;
    const Test = () => {
      const x = counter++;
      const ref = useCallbackRef<HTMLDivElement>(null, () => spy(x));
      return <div key={x<2 ? '1' : '2'} ref={ref}>test</div>;
    };
    const wrapper = mount(<Test/>);
    expect(spy).toBeCalledWith(0);

    wrapper.setProps({x: 42});
    expect(spy).toBeCalledWith(0);

    wrapper.setProps({x: 24});
    expect(spy).toBeCalledWith(2);
  });
});
