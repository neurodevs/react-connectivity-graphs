import React from 'react'

interface FakeReactFlowProps {
    nodes?: unknown[]
}

export let lastFakeReactFlowProps: FakeReactFlowProps | undefined

const FakeReactFlow: React.FC<FakeReactFlowProps> = (props) => {
    lastFakeReactFlowProps = props

    return <div data-testid="fake-reactflow" />
}

export default FakeReactFlow
