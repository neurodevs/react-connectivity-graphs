import { ReactFlowProps } from '@xyflow/react'
import React from 'react'

export let lastFakeReactFlowProps: ReactFlowProps | undefined

const FakeReactFlow: React.FC<ReactFlowProps> = (props) => {
    lastFakeReactFlowProps = props

    return (
        <div className="react-flow" data-testid="fake-reactflow">
            {props.nodes!.map((n) => (
                <div key={n.id} data-testid={`rf__node-${n.id}`} />
            ))}
            {props.edges!.map((e) => (
                <div key={e.id} data-testid={`rf__edge-${e.id}`} />
            ))}
        </div>
    )
}

export default FakeReactFlow
