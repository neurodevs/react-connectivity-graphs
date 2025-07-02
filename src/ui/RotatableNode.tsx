import {
    Handle,
    HandleProps,
    Position,
    useUpdateNodeInternals,
} from '@xyflow/react'
import { UpdateNodeInternals } from '@xyflow/system'
import React from 'react'

export interface RotatableNodeProps {
    data: {
        id: string
        label: string
        targetPosition: Position
        sourcePosition: Position
        style: React.CSSProperties
    }
}

const RotatableNode: React.FC<RotatableNodeProps> = ({ data }) => {
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

export let HandleComponent = Handle

export function setHandleComponent(handle: React.FC<HandleProps>) {
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
