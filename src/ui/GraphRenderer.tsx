import {
    Background,
    Controls,
    Edge,
    Node,
    ReactFlow,
    ReactFlowProps,
    ReactFlowProvider,
} from '@xyflow/react'
import React from 'react'
import RotatableNode from './RotatableNode'

export interface GraphRendererProps {
    nodes: Node[]
    edges: Edge[]
    onNodeClick?: () => void
    onNodeMouseEnter?: () => void
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
    return (
        <div className="graph-renderer" data-testid="graph-renderer">
            <ProviderComponent>
                <ReactFlowComponent
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodeClick={onNodeClick}
                    onNodeMouseEnter={onNodeMouseEnter}
                    onNodeMouseLeave={onNodeMouseLeave}
                    onEdgeClick={onEdgeClick}
                    onEdgeMouseEnter={onEdgeMouseEnter}
                    onEdgeMouseLeave={onEdgeMouseLeave}
                />
                <Background />
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
