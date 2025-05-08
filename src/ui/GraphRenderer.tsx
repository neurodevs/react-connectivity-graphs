import React, { useMemo, DependencyList } from 'react'
import ReactFlow, {
    Edge,
    Node,
    NodeProps,
    NodeTypes,
    ReactFlowProvider,
} from 'reactflow'
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
    ReactFlowComponent?: React.ComponentType
    useMemoHook?: (factory: NodeTypesFactory, deps: DependencyList) => NodeTypes
}

const GraphRenderer: React.FC<GraphRendererProps> = ({
    nodes,
    edges,
    onNodeClick,
    onNodeMouseEnter,
    onNodeMouseLeave,
    onEdgeClick,
    onEdgeMouseEnter,
    onEdgeMouseLeave,
    ReactFlowComponent = ReactFlow,
    useMemoHook = useMemo,
}) => {
    const nodeTypes = useMemoHook(() => ({ rotatableNode: RotatableNode }), [])

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
            </ProviderComponent>
        </div>
    )
}

export default GraphRenderer

export interface GraphRendererNodeTypes {
    rotatableNode: React.FC<NodeProps>
}

export type NodeTypesFactory = () => GraphRendererNodeTypes

// For test doubles

export let ProviderComponent = ReactFlowProvider

export function setProviderComponent(component: React.FC) {
    ProviderComponent = component
}
