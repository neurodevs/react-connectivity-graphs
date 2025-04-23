import React from 'react'
import {
    Handle,
    NodeProps,
    Position,
    UpdateNodeInternals,
    useUpdateNodeInternals,
} from 'reactflow'

const RotatableNode: React.FC<NodeProps> = ({
    data,
    targetPosition = 'right' as Position,
    sourcePosition = 'left' as Position,
}) => {
    const targetHandle = createHandle('target', targetPosition)
    const sourceHandle = createHandle('source', sourcePosition)

    useUpdateNodeInternalsFn()

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

export let HandleComponent = Handle

export function setHandleComponent(handle: React.FC<any>) {
    HandleComponent = handle as unknown as typeof Handle
}

export let useUpdateNodeInternalsFn = useUpdateNodeInternals

export function setUseUpdateNodeInternals(fn: () => UpdateNodeInternals) {
    useUpdateNodeInternalsFn = fn
}

export let useEffect = React.useEffect

export function setUseEffect(
    fn: (effect: React.EffectCallback, deps?: React.DependencyList) => void
) {
    useEffect = fn
}
