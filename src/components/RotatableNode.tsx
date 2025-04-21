import React from 'react'
import { Handle, Position } from 'reactflow'

let HandleComponent = Handle

export function setHandleComponent(handle: React.FC<any>) {
    HandleComponent = handle as unknown as typeof Handle
}

const RotatableNode: React.FC = () => {
    return (
        <div className="rotatable-node" data-testid="rotatable-node">
            <HandleComponent
                type="target"
                position={'left' as Position}
                isConnectable={false}
            ></HandleComponent>
        </div>
    )
}

export default RotatableNode
