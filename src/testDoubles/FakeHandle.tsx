import React from 'react'
import { HandleProps } from 'reactflow'

export interface TestIdProps {
    testId?: string
}

const FakeHandle: React.FC<HandleProps & TestIdProps> = ({ type, testId }) => {
    return <div data-testid={testId ?? `${type}-handle`} />
}

export default FakeHandle
