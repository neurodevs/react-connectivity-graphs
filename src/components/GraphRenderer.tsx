import React from 'react'
import ReactFlow from 'reactflow'

export interface GraphRendererProps {
    ReactFlowComponent?: React.ComponentType<any>
}

const GraphRenderer: React.FC<GraphRendererProps> = ({
    ReactFlowComponent = ReactFlow,
}) => {
    return (
        <div className="graph-renderer" data-testid="graph-renderer">
            <ReactFlowComponent />
        </div>
    )
}

export default GraphRenderer
