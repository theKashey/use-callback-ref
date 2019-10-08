import * as React from 'react';
import {createRef} from "react";
import {mount} from 'enzyme';
import {createCallbackRef, mergeRefs, useCallbackRef} from "../src";


describe('Specs', () => {
  describe('useCallbackRef', () => {
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
        return <div key={x < 2 ? '1' : '2'} ref={ref}>test</div>;
      };
      const wrapper = mount(<Test/>);
      expect(spy).toBeCalledWith(0);

      wrapper.setProps({x: 42});
      expect(spy).toBeCalledWith(0);

      wrapper.setProps({x: 24});
      expect(spy).toBeCalledWith(2);
    });
  });

  describe('mergeRef', () => {
    it("merges two refs", () => {
      const spy1 = jest.fn();
      const ref1 = createCallbackRef<HTMLDivElement>(spy1);
      const spy2 = jest.fn();
      const ref2 = createCallbackRef<HTMLDivElement>(spy2);
      const ref3 = createRef() as React.MutableRefObject<any>;
      const ref4 = jest.fn();

      const TestComponent = () => (
        <div
          ref={mergeRefs([
          ref1,
          ref2,
          ref3,
          ref4,
        ])}
        >test</div>
      );

      mount(<TestComponent />);

      const ref = ref1.current;
      expect(ref).not.toBe(null);

      expect(spy1).toBeCalledWith(ref, null);
      expect(spy2).toBeCalledWith(ref, null);
      expect(ref3.current).toBe(ref);
      expect(ref4).toBeCalledWith(ref);
    });
  });

});
