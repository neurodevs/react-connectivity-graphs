import {
    Handle,
    HandleProps,
    Position,
    useUpdateNodeInternals,
} from '@xyflow/react'
import { UpdateNodeInternals } from '@xyflow/system'
import React from 'react'

export interface TabularNodeProps {
    data: {
        id: string
        label: string
        style: React.CSSProperties
    }
}

const TabularNode: React.FC<TabularNodeProps> = ({ data }) => {
    function renderHandle(type: 'source' | 'target', position: Position) {
        return (
            <HandleComponentTabular
                type={type}
                position={position}
                isConnectable={false}
            ></HandleComponentTabular>
        )
    }

    const updateNodeInternals = useUpdateNodeInternalsTabular()

    useEffectTabular(() => {
        updateNodeInternals(data.id)
    }, [data.id, updateNodeInternals])

    return (
        <div
            className="tabular-node"
            data-testid="tabular-node"
            aria-label={data.label}
            style={data.style}
        >
            {renderHandle('target', 'left' as Position)}
            {data.label}
            {renderHandle('source', 'right' as Position)}
        </div>
    )
}

export default TabularNode

// For test doubles

export let HandleComponentTabular = Handle

export function setHandleTabular(handle: React.FC<HandleProps>) {
    HandleComponentTabular = handle as unknown as typeof Handle
}

export let useUpdateNodeInternalsTabular = useUpdateNodeInternals

export function setUseUpdateNodeInternalsTabular(
    fn: () => UpdateNodeInternals
) {
    useUpdateNodeInternalsTabular = fn
}

export let useEffectTabular = React.useEffect

export function setUseEffectTabular(
    fn: (effect: React.EffectCallback, deps?: React.DependencyList) => void
) {
    useEffectTabular = fn
}
