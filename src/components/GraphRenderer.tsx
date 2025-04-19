import React, { useMemo } from 'react'
import ReactFlow, { Edge, Node } from 'reactflow'
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
    ReactFlowComponent?: React.ComponentType<any>
    useMemoFn?: (factory: () => void, deps: React.DependencyList) => void
}

export interface GraphRendererNodeTypes {
    rotatableNode: React.FC<typeof RotatableNode>
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
    useMemoFn = useMemo,
}) => {
    const nodeTypes = {
        rotatableNode: RotatableNode,
    }

    useMemoFn(() => {
        return nodeTypes
    }, [])

    return (
        <div className="graph-renderer" data-testid="graph-renderer">
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
        </div>
    )
}

export default GraphRenderer
