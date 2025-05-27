import {
    Controls,
    Edge,
    Node,
    ReactFlow,
    ReactFlowProps,
    ReactFlowProvider,
} from '@xyflow/react'
import React, { useState, useCallback, useRef } from 'react'
import RotatableNode from './RotatableNode'

export interface GraphRendererProps {
    nodes: Node[]
    edges: Edge[]
    onNodeClick?: () => void
    onNodeMouseEnter?: (event: any, node: Node) => void
    onNodeMouseLeave?: () => void
    onEdgeClick?: () => void
    onEdgeMouseEnter?: () => void
    onEdgeMouseLeave?: () => void
}

export const nodeTypes = { rotatableNode: RotatableNode }

const GraphRenderer: React.FC<GraphRendererProps> = ({
    nodes,
    edges,
    onNodeClick,
    onNodeMouseEnter,
    onNodeMouseLeave,
    onEdgeClick,
    onEdgeMouseEnter,
    onEdgeMouseLeave,
}) => {
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    const originalStylesRef = useRef<
        Record<string, { color?: string; borderColor?: string }>
    >({})

    if (Object.keys(originalStylesRef.current).length === 0) {
        for (const node of nodes) {
            const style = node.data.style as any

            originalStylesRef.current[node.id] = {
                color: style.color,
                borderColor: style.borderColor,
            }
        }
    }

    const handleNodeEnter = useCallback(
        (_: any, node: Node) => {
            setHoveredId(node.id)
            onNodeMouseEnter?.(_, node)
        },
        [onNodeMouseEnter]
    )

    const handleNodeLeave = useCallback(() => {
        setHoveredId(null)
        onNodeMouseLeave?.()
    }, [onNodeMouseLeave])

    const styledNodes = nodes.map((node) => {
        const original = originalStylesRef.current[node.id] ?? {}
        const isHovered = node.id === hoveredId

        const color = isHovered ? 'dodgerblue' : original.color
        const borderColor = isHovered ? 'dodgerblue' : original.borderColor

        return {
            ...node,
            style: {
                ...node.style,
                color,
                borderColor,
            },
            data: {
                ...node.data,
                style: {
                    ...node.data.style!,
                    color,
                    borderColor,
                },
            },
        }
    })

    return (
        <div className="graph-renderer" data-testid="graph-renderer">
            <ProviderComponent>
                <ReactFlowComponent
                    nodes={styledNodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodeClick={onNodeClick}
                    onNodeMouseEnter={handleNodeEnter}
                    onNodeMouseLeave={handleNodeLeave}
                    onEdgeClick={onEdgeClick}
                    onEdgeMouseEnter={onEdgeMouseEnter}
                    onEdgeMouseLeave={onEdgeMouseLeave}
                />
                <Controls />
            </ProviderComponent>
        </div>
    )
}

export default GraphRenderer

// For test doubles
export let ProviderComponent = ReactFlowProvider
export function setProviderComponent(component: typeof ReactFlowProvider) {
    ProviderComponent = component
}

export let ReactFlowComponent: React.FC<ReactFlowProps> = ReactFlow
export function setReactFlowComponent(component: React.FC<ReactFlowProps>) {
    ReactFlowComponent = component
}
