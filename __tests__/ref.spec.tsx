/**
 * @jest-environment jsdom
 */
/**
 * @fileoverview spec from https://github.com/agriffis/merge-refs-playground/blob/main/src/hooks/index.test.jsx
 */
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import React from 'react';
import {useEffect, useLayoutEffect, useRef, useState} from 'react'

import {useMergeRefs} from '../src'

test('works with zero refs', async () => {
    const TestMe = () => {
        const mergedRef = useMergeRefs<HTMLDivElement>([])

        return <div ref={mergedRef} data-testid="foo"/>
    }

    render(<TestMe/>)
    await screen.findByTestId('foo')
    // If we made it this far, we're good.
})

test('works with one ref', async () => {
    let current

    const TestMe = () => {
        const oneRef = useRef<HTMLDivElement>(null)
        const mergedRef = useMergeRefs([oneRef])

        useLayoutEffect(() => {
            current = oneRef.current
        })

        return <div ref={mergedRef} data-testid="foo"/>
    }

    render(<TestMe/>)

    const div = await screen.findByTestId('foo')
    expect(current).toBe(div)
})

test('works with two refs', async () => {
    let currents

    const TestMe = () => {
        const oneRef = useRef<HTMLDivElement>(null)
        const twoRef = useRef<HTMLDivElement>(null)
        const mergedRef = useMergeRefs([oneRef, twoRef])

        useLayoutEffect(() => {
            currents = [oneRef.current, twoRef.current]
        })

        return <div ref={mergedRef} data-testid="foo"/>
    }

    render(<TestMe/>)

    const div = await screen.findByTestId('foo')
    expect(currents).toEqual([div, div])
})

test('updates when ref moves to another element', async () => {
    let current:any;

    const TestMe = () => {
        const [n, setN] = useState(1)
        const oneRef = useRef<HTMLDivElement>(null)
        const mergedRef = useMergeRefs([oneRef])

        useLayoutEffect(() => {
            current = oneRef.current
        })

        return (
            <div data-testid="wrapper" onClick={() => setN(n => n + 1)}>
                <div ref={n === 1 ? mergedRef : undefined} data-testid="1"/>
                <div ref={n === 2 ? mergedRef : undefined} data-testid="2"/>
            </div>
        )
    }

    render(<TestMe/>)

    const wrapper = await screen.findByTestId('wrapper')
    const div1 = await screen.findByTestId('1')
    const div2 = await screen.findByTestId('2')
    expect(current).toBe(div1)
    expect(current).not.toBe(div2)
    fireEvent.click(wrapper)
    await waitFor(() => expect(current).toBe(div2))
    expect(current).not.toBe(div1)
})

test('updates when element appears', async () => {
    let current:any;

    const TestMe = () => {
        const [appeared, setAppeared] = useState(false)
        const oneRef = useRef<HTMLDivElement>(null)
        const mergedRef = useMergeRefs<HTMLDivElement>([oneRef])

        useLayoutEffect(() => {
            current = oneRef.current
        })

        return (
            <div onClick={() => setAppeared(true)} data-testid="wrapper">
                {!appeared ? null : <div ref={mergedRef} data-testid="foo"/>}
            </div>
        )
    }

    render(<TestMe/>)

    const wrapper = await screen.findByTestId('wrapper')
    expect(screen.queryByTestId('foo')).toBeNull()
    fireEvent.click(wrapper)

    const tada = await screen.findByTestId('foo')
    expect(current).toBe(tada)
})

test('updates when element disappears', async () => {
    let current:any;

    const TestMe = () => {
        const [disappeared, setDisappeared] = useState(false)
        const oneRef = useRef<HTMLDivElement>(null)
        const mergedRef = useMergeRefs<HTMLDivElement>([oneRef])

        useLayoutEffect(() => {
            current = oneRef.current
        })

        return disappeared ? null : (
            <div
                ref={mergedRef}
                data-testid="foo"
                onClick={() => setDisappeared(true)}
            />
        )
    }

    render(<TestMe/>)

    const tada = await screen.findByTestId('foo')
    expect(current).toBe(tada)
    fireEvent.click(tada)
    await waitFor(() => expect(screen.queryByTestId('foo')).toBeNull())
    expect(current).toBeNull()
})

test('handles adding new refs to the set', async () => {
    let currents:any;

    const TestMe = () => {
        const [clicked, setClicked] = useState(false)
        const oneRef = useRef<HTMLDivElement>(null)
        const twoRef = useRef<HTMLDivElement>(null)
        const mergedRef = useMergeRefs<HTMLDivElement>(!clicked ? [oneRef] : [oneRef, twoRef])

        useLayoutEffect(() => {
            currents = [oneRef.current, twoRef.current]
        })

        return (
            <div
                ref={mergedRef}
                data-testid="foo"
                onClick={() => setClicked(true)}
            />
        )
    }

    render(<TestMe/>)

    const div = await screen.findByTestId('foo')
    expect(currents).toEqual([div, null])
    fireEvent.click(div)
    await waitFor(() => expect(currents).toEqual([div, div]))
})

test('handles nulling refs removed from the set', async () => {
    let currents:any;

    const TestMe = () => {
        const [clicked, setClicked] = useState(false)
        const oneRef = useRef<HTMLDivElement>(null)
        const twoRef = useRef<HTMLDivElement>(null)
        const mergedRef = useMergeRefs<HTMLDivElement>(clicked ? [oneRef] : [oneRef, twoRef])

        useLayoutEffect(() => {
            currents = [oneRef.current, twoRef.current]
        })

        return (
            <div
                ref={mergedRef}
                data-testid="foo"
                onClick={() => setClicked(true)}
            />
        )
    }

    render(<TestMe/>)

    const div = await screen.findByTestId('foo')
    expect(currents).toEqual([div, div])
    fireEvent.click(div)
    await waitFor(() => expect(currents).toEqual([div, null]))
})

// https://github.com/gregberge/react-merge-refs/issues/5#issuecomment-736587365
test('protects sub-refs from null-then-value flip-flop', async () => {
    const mockCallbackRef = jest.fn()

    const TestMe = () => {
        const [clicked, setClicked] = useState(false)
        const extraRef = useRef<HTMLDivElement>(null)
        const mergedRef = useMergeRefs<HTMLDivElement>(
            !clicked ? [mockCallbackRef] : [mockCallbackRef, extraRef],
        )

        return (
            <div
                ref={mergedRef}
                data-testid="foo"
                onClick={() => setClicked(true)}
            />
        )
    }

    render(<TestMe/>)

    const div = await screen.findByTestId('foo')
    expect(mockCallbackRef.mock.calls).toEqual([[div]])
    fireEvent.click(div)
    // If hook doesn't protect, this will be [[div], [null], [div]]
    expect(mockCallbackRef.mock.calls).toEqual([[div]])
})

// https://github.com/gregberge/react-merge-refs/issues/5#issuecomment-736587365
test('returns a stable ref over sub-ref updates', async () => {
    const seen = new Set()

    const TestMe = () => {
        const [rerender, setRerender] = useState(false)
        const oneRef = useRef<HTMLDivElement>(null)
        const twoRef = useRef<HTMLDivElement>(null)
        const mergedRef = useMergeRefs<HTMLDivElement>(!rerender ? [oneRef] : [oneRef, twoRef])
        seen.add(mergedRef)
        useEffect(() => setRerender(true), [])

        return <div>{rerender && <div ref={mergedRef} data-testid="foo"/>}</div>
    }

    render(<TestMe/>)
    await screen.findByTestId('foo')
    expect(seen.size).toEqual(1)
})

// https://github.com/gregberge/react-merge-refs/issues/5#issuecomment-736417057
test('updates before layout effects', async () => {
    const seen:any[] = []

    const TestMe = () => {
        const [rerender, setRerender] = useState(false)
        const oneRef = useRef<HTMLDivElement>(null)

        // the only way to do something before layout effects is to define our one "before"
        const mergedRef = useMergeRefs<HTMLDivElement>(rerender ? [oneRef] : [])

        useLayoutEffect(() => {
            seen.push(oneRef.current)
            setRerender(true)
        })

        return <div ref={mergedRef} data-testid="foo"/>
    }

    render(<TestMe/>)

    const div = await screen.findByTestId('foo')
    await waitFor(() => expect(seen).toContain(div))
    // Failure here is [undefined, undefined]
    expect(seen).toEqual([null, div])
})

test('returns a gettable ref', async () => {
    let oneRef:any, mergedRef:any;

    const TestMe = () => {
        oneRef = useRef<HTMLDivElement>(null)
        mergedRef = useMergeRefs<HTMLDivElement>([oneRef])

        return <div ref={mergedRef}/>
    }

    render(<TestMe/>)
    expect(mergedRef.current).toBe(oneRef.current)
})

test('returns a settable ref', async () => {
    let oneRef:any, mergedRef:any;

    const TestMe = () => {
        oneRef = useRef<HTMLDivElement>(null)
        mergedRef = useMergeRefs<HTMLDivElement>([oneRef])

        useLayoutEffect(() => {
            mergedRef.current = 42
        }, [])

        return <div/>
    }

    render(<TestMe/>)
    expect(oneRef.current).toBe(42)
})