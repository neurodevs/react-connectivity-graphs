import React from 'react'
import { HandleProps } from 'reactflow'

export interface TestableProps {
    'data-testid'?: string
}

type FakeHandleProps = HandleProps & TestableProps

export let fakeHandleProps: FakeHandleProps[] = []

export function resetFakeHandleProps() {
    fakeHandleProps = []
}

const FakeHandle: React.FC<FakeHandleProps> = (props) => {
    fakeHandleProps.push(props)

    const { type, id, 'data-testid': testId } = props

    return (
        <div
            data-testid={testId ?? `${type}-handle`}
            data-type={type}
            data-id={id}
        />
    )
}

export default FakeHandle
