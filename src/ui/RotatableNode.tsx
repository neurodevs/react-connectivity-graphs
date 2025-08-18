import React, {
    CSSProperties,
    DependencyList,
    EffectCallback,
    useEffect,
} from 'react'
import {
    Handle,
    HandleProps,
    Position,
    useUpdateNodeInternals,
    UpdateNodeInternals,
} from 'reactflow'

export interface RotatableNodeProps {
    data: {
        id: string
        label: string
        targetPosition: Position
        sourcePosition: Position
        style: CSSProperties
    }
}

const RotatableNode: React.FC<RotatableNodeProps> = ({ data }) => {
    function renderHandle(type: 'source' | 'target', position: Position) {
        return (
            <HandleComponentRotatable
                type={type}
                position={position}
                isConnectable={false}
            ></HandleComponentRotatable>
        )
    }

    const updateNodeInternals = useUpdateNodeInternalsRotatable()

    useEffectRotatable(() => {
        updateNodeInternals(data.id)
    }, [data.id, data.style.transform, updateNodeInternals])

    return (
        <div
            className="rotatable-node"
            data-testid="rotatable-node"
            aria-label={data.label}
            style={data.style}
        >
            {renderHandle('target', data.targetPosition)}
            {data.label}
            {renderHandle('source', data.sourcePosition)}
        </div>
    )
}

export default RotatableNode

// For test doubles

export let HandleComponentRotatable = Handle

export function setHandleComponentRotatable(handle: React.FC<HandleProps>) {
    HandleComponentRotatable = handle as unknown as typeof Handle
}

export let useUpdateNodeInternalsRotatable = useUpdateNodeInternals

export function setUseUpdateNodeInternalsRotatable(
    fn: () => UpdateNodeInternals
) {
    useUpdateNodeInternalsRotatable = fn
}

export let useEffectRotatable = useEffect

export function setUseEffectRotatable(
    fn: (effect: EffectCallback, deps?: DependencyList) => void
) {
    useEffectRotatable = fn
}
