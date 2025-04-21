import React from 'react'
import { ReactFlowProps } from 'reactflow'

export let lastFakeReactFlowProps: ReactFlowProps | undefined

const FakeReactFlow: React.FC<ReactFlowProps> = (props) => {
    lastFakeReactFlowProps = props

    return <div className="react-flow" data-testid="fake-reactflow" />
}

export default FakeReactFlow
