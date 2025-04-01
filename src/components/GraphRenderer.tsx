import React from 'react'
import ReactFlow, { Edge, Node } from 'reactflow'

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
}

const GraphRenderer: React.FC<GraphRendererProps> = ({
    nodes,
    edges,
    ReactFlowComponent = ReactFlow,
}) => {
    return (
        <div className="graph-renderer" data-testid="graph-renderer">
            <ReactFlowComponent nodes={nodes} edges={edges} />
        </div>
    )
}

export default GraphRenderer
