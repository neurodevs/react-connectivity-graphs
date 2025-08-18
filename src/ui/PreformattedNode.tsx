import React, {
    DependencyList,
    EffectCallback,
    CSSProperties,
    ReactElement,
    useEffect,
} from 'react'
import {
    Handle,
    HandleProps,
    Position,
    useUpdateNodeInternals,
    UpdateNodeInternals,
} from 'reactflow'

export interface PreformattedNodeProps {
    data: {
        id: string
        preContents: ReactElement
        style: CSSProperties
    }
}

const PreformattedNode: React.FC<PreformattedNodeProps> = ({ data }) => {
    function renderHandle(type: 'source' | 'target', position: Position) {
        return (
            <HandleComponentPre
                type={type}
                position={position}
                isConnectable={false}
            ></HandleComponentPre>
        )
    }

    const updateNodeInternals = useUpdateNodeInternalsPre()

    useEffectPre(() => {
        updateNodeInternals(data.id)
    }, [data.id, updateNodeInternals])

    return (
        <div
            className="preformatted-node"
            data-testid="preformatted-node"
            style={data.style}
        >
            {renderHandle('target', 'left' as Position)}
            <pre>{data.preContents}</pre>
            {renderHandle('source', 'right' as Position)}
        </div>
    )
}

export default PreformattedNode

// For test doubles

export let HandleComponentPre = Handle

export function setHandlePre(handle: React.FC<HandleProps>) {
    HandleComponentPre = handle as unknown as typeof Handle
}

export let useUpdateNodeInternalsPre = useUpdateNodeInternals

export function setUseUpdateNodeInternalsPre(fn: () => UpdateNodeInternals) {
    useUpdateNodeInternalsPre = fn
}

export let useEffectPre = useEffect

export function setUseEffectPre(
    fn: (effect: EffectCallback, deps?: DependencyList) => void
) {
    useEffectPre = fn
}
