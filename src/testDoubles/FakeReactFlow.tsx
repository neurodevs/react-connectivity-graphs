import React from 'react'
import { Node, Edge } from 'reactflow'

interface FakeReactFlowProps {
    nodes: Node[]
    edges: Edge[]
}

export let lastFakeReactFlowProps: FakeReactFlowProps | undefined

const FakeReactFlow: React.FC<FakeReactFlowProps> = (props) => {
    lastFakeReactFlowProps = props

    return <div data-testid="fake-reactflow" />
}

export default FakeReactFlow
