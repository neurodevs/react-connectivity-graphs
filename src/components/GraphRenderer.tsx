import React from 'react'
import ReactFlow from 'reactflow'

export interface GraphRendererProps {}

const GraphRenderer: React.FC<GraphRendererProps> = () => {
    return (
        <div className="graph-renderer" data-testid="graph-renderer">
            <ReactFlow />
        </div>
    )
}

export default GraphRenderer
