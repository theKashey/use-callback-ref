import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import { createRef } from 'react';

import {
  refToCallback,
  useRefToCallback,
  createCallbackRef,
  mergeRefs,
  useTransformRef,
  useCallbackRef,
  useMergeRefs,
} from '../src';

configure({ adapter: new Adapter() });

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

      mount(<div ref={ref}>test</div>)
        .setProps({})
        .update();

      expect(spy).toBeCalledWith(ref.current, null);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(ref.current).not.toBe(null);
    });

    it('shall work as useRef', () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();
      let counter = 0;

      const Test = () => {
        const x = counter++;
        const ref = useCallbackRef<HTMLDivElement>(null, () => spy1(x));
        const mref = useMergeRefs([ref, spy2]);

        return (
          <div key={x < 2 ? '1' : '2'} ref={mref}>
            test
          </div>
        );
      };

      const wrapper = mount(<Test />);
      expect(spy1).toBeCalledWith(0);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).not.toBeCalledWith(null);
      expect(spy2).toHaveBeenCalledTimes(1);

      wrapper.setProps({ x: 42 });
      expect(spy1).toBeCalledWith(0);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).not.toBeCalledWith(null);

      wrapper.setProps({ x: 24 });
      expect(spy1).toBeCalledWith(2);
      expect(spy1).toHaveBeenCalledTimes(3);
      expect(spy2).toBeCalledWith(null);
    });
  });

  describe('mergeRef', () => {
    it('merges two refs', () => {
      const spy1 = jest.fn();
      const ref1 = createCallbackRef<HTMLDivElement>(spy1);
      const spy2 = jest.fn();
      const ref2 = createCallbackRef<HTMLDivElement>(spy2);
      const ref3 = createRef() as React.MutableRefObject<any>;
      const ref4 = jest.fn();

      const TestComponent = () => <div ref={mergeRefs([ref1, ref2, ref3, ref4])}>test</div>;

      mount(<TestComponent />);

      const ref = ref1.current;
      expect(ref).not.toBe(null);

      expect(spy1).toBeCalledWith(ref, null);
      expect(spy2).toBeCalledWith(ref, null);
      // expect(ref3.current).toBe(ref);
      expect(ref4).toBeCalledWith(ref);
    });

    it('ref equal', () => {
      const spy = jest.fn();
      const ref = createRef<HTMLDivElement>();
      let counter = 0;

      const Test = () => {
        const x = counter++;
        const mref = mergeRefs<HTMLDivElement>([spy, ref]);

        return (
          <div key={x < 1 ? '1' : '2'} ref={mref}>
            test
          </div>
        );
      };

      const wrapper = mount(<Test />);
      expect(spy).not.toBeCalledWith(null);
      expect(spy).toBeCalledWith(ref.current);
      expect(spy).toHaveBeenCalledTimes(1);

      wrapper.setProps({ x: 42 });
      expect(spy).toBeCalledWith(null);
      expect(spy).toBeCalledWith(ref.current);
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });

  describe('transformRef', () => {
    it('composite case', () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();
      const spy4 = jest.fn();

      const ref1 = createCallbackRef<HTMLDivElement>(spy1);
      const ref4t = createRef<HTMLDivElement>();

      const TestComponent = () => {
        const ref2 = createCallbackRef<string>(spy2);
        const ref3 = useTransformRef<HTMLDivElement, string>(ref2, (current) => current!.innerHTML);
        const ref4 = refToCallback<HTMLDivElement>(spy4);
        const ref4s = useRefToCallback<HTMLDivElement>(ref4t);

        return <div ref={useMergeRefs([ref1, ref3, ref4, ref4s])}>test</div>;
      };

      mount(<TestComponent />)
        .setProps({ x: 1 })
        .update();

      const ref = ref1.current;
      expect(ref).not.toBe(null);

      expect(spy1).toBeCalledWith(ref, null);
      expect(spy2).toBeCalledWith('test', null);
      expect(ref4t.current).toBe(ref);
      expect(spy4).toBeCalledWith(ref);
    });
  });

  describe('edge cases', () => {
    it('null provided to useRefToCallback', () => {
      expect(() => useRefToCallback(null)).not.toThrow();
      expect(useRefToCallback(null)).toBe(useRefToCallback(null));
      expect(() => useRefToCallback(null)(null)).not.toThrow();
    });

    it('merging null refs', () => {
      const ref1 = createRef();

      const TestComponent = () => {
        const ref = useMergeRefs([null, ref1]);
        ref.current = 'xx';

        return null;
      };

      mount(<TestComponent />);
      expect(ref1.current).toBe('xx');
    });
  });
});
