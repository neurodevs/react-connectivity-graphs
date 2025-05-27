import {
    Controls,
    Edge,
    Node,
    ReactFlow,
    ReactFlowProps,
    ReactFlowProvider,
} from '@xyflow/react'
import React, { useState, useCallback } from 'react'
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

    const handleNodeEnter = useCallback(
        (_: any, node: Node) => {
            setHoveredId(node.id)
            onNodeMouseEnter?.(_, node)
        },
        [onNodeMouseEnter]
    )

    const styledNodes = nodes.map((node) => {
        if (node.id === hoveredId) {
            return {
                ...node,
                style: {
                    ...node.style,
                    color: 'dodgerblue',
                    borderColor: 'dodgerblue',
                },
                data: {
                    ...node.data,
                    style: {
                        ...node.data.style!,
                        color: 'dodgerblue',
                        borderColor: 'dodgerblue',
                    },
                },
            }
        }
        return node
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
                    onNodeMouseLeave={onNodeMouseLeave}
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
