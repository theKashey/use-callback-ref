/**
 * @jest-environment jsdom
 */
import {render} from '@testing-library/react'
import * as React from 'react';
import {createRef} from 'react';

import {
    refToCallback,
    useRefToCallback,
    createCallbackRef,
    mergeRefs,
    useTransformRef,
    useCallbackRef,
    useMergeRefs,
} from '../src';

describe('Specs', () => {
    describe('useCallbackRef', () => {
        it('base - createRef', () => {
            const ref = React.createRef<HTMLDivElement>();
            render(<div ref={ref}>test</div>);
            expect(ref.current).not.toBe(null);
        });

        it('shall work as createRef', () => {
            const spy = jest.fn();
            const ref = createCallbackRef<HTMLDivElement>(spy);

            const {rerender} = render(<div ref={ref}>test</div>);
            rerender(<div ref={ref} data-any>test</div>)

            expect(spy).toBeCalledWith(ref.current, null);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(ref.current).not.toBe(null);
        });

        it('shall work as useRef', () => {
            const spy1 = jest.fn();
            const spy2 = jest.fn();
            let counter = 0;

            const Test = (_props:any) => {
                const x = counter++;
                const ref = useCallbackRef<HTMLDivElement>(null, () => spy1(x));
                const mref = useMergeRefs([ref, spy2]);

                return (
                    <div key={x < 2 ? '1' : '2'} ref={mref}>
                        test
                    </div>
                );
            };

            const {rerender} = render(<Test/>);
            expect(spy1).toBeCalledWith(0);
            expect(spy1).toHaveBeenCalledTimes(1);
            expect(spy2).not.toBeCalledWith(null);
            expect(spy2).toHaveBeenCalledTimes(1);

            rerender(<Test x={42}/>);
            expect(spy1).toBeCalledWith(0);
            expect(spy1).toHaveBeenCalledTimes(1);
            expect(spy2).not.toBeCalledWith(null);

            rerender(<Test x={24}/>);
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

            render(<TestComponent/>);

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

            const Test = (_props:any) => {
                const x = counter++;
                const mref = mergeRefs<HTMLDivElement>([spy, ref]);

                return (
                    <div key={x < 1 ? '1' : '2'} ref={mref}>
                        test
                    </div>
                );
            };

            const {rerender} = render(<Test/>);
            expect(spy).not.toBeCalledWith(null);
            expect(spy).toBeCalledWith(ref.current);
            expect(spy).toHaveBeenCalledTimes(1);

            rerender(<Test x={42}/>);
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

            const TestComponent = (_props:any) => {
                const ref2 = createCallbackRef<string>(spy2);
                const ref3 = useTransformRef<HTMLDivElement, string>(ref2, (current) => current ? current!.innerHTML : 'empty');
                const ref4 = refToCallback<HTMLDivElement>(spy4);
                const ref4s = useRefToCallback<HTMLDivElement>(ref4t);

                return <div ref={useMergeRefs([ref1, ref3, ref4, ref4s])}>test</div>;
            };

            const {rerender} = render(<TestComponent />)
            rerender(<TestComponent x={1}/>);

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

            render(<TestComponent/>);
            expect(ref1.current).toBe('xx');
        });

        it('updating refs on the fly', () => {
            const ref1 = createRef();
            const ref2 = createRef();

            const TestComponent = ({r}: { r: React.RefObject<any> }) => {
                const ref = useMergeRefs([null, r]);
                ref.current = 'xx';

                return null;
            };

            const {rerender} = render(<TestComponent r={ref1}/>);
            expect(ref1.current).toBe('xx');

            rerender(<TestComponent r={ref2}/>);
            expect(ref1.current).toBe(null);
            expect(ref2.current).toBe('xx');
        });
    });
});
