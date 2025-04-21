import React from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

let HandleComponent = Handle

export function setHandleComponent(handle: React.FC<any>) {
    HandleComponent = handle as unknown as typeof Handle
}

const RotatableNode: React.FC<NodeProps> = ({
    data,
    targetPosition = 'right' as Position,
    sourcePosition = 'left' as Position,
}) => {
    const targetHandle = createHandle('target', targetPosition)
    const sourceHandle = createHandle('source', sourcePosition)

    return (
        <div className="rotatable-node" data-testid="rotatable-node">
            {targetHandle}
            {data.label}
            {sourceHandle}
        </div>
    )

    function createHandle(type: 'source' | 'target', position: Position) {
        return (
            <HandleComponent
                type={type}
                position={position}
                isConnectable={false}
            ></HandleComponent>
        )
    }
}

export default RotatableNode
