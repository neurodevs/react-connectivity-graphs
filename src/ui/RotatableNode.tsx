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
    function renderHandle(type: 'source' | 'target', position: Position) {
        return (
            <HandleComponent
                type={type}
                position={position}
                isConnectable={false}
            ></HandleComponent>
        )
    }

    const updateNodeInternals = useUpdateNodeInternalsFn()

    useEffect(() => {
        updateNodeInternals(data?.id)
    }, [data?.id, data?.style.transform, updateNodeInternals])

    return (
        <div className="rotatable-node" data-testid="rotatable-node">
            {renderHandle('target', targetPosition)}
            {data.label}
            {renderHandle('source', sourcePosition)}
        </div>
    )
}

export default RotatableNode

// For test doubles

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
