import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react'
import React from 'react'

const RotatableNode: React.FC<any> = ({ data }) => {
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
    }, [data?.id, data?.style?.transform, updateNodeInternals])

    return (
        <div
            className="rotatable-node"
            data-testid="rotatable-node"
            aria-label={data?.label}
            style={{ ...data.style, pointerEvents: 'auto' }}
        >
            {renderHandle('target', data.targetPosition)}
            {data.label}
            {renderHandle('source', data.sourcePosition)}
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

export function setUseUpdateNodeInternals(fn: () => any) {
    useUpdateNodeInternalsFn = fn
}

export let useEffect = React.useEffect

export function setUseEffect(
    fn: (effect: React.EffectCallback, deps?: React.DependencyList) => void
) {
    useEffect = fn
}
