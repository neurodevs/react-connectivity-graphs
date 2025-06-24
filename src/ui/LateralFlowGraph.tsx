import React, { useMemo } from 'react'
import {
    GraphRenderer,
    GraphRendererProps,
    GraphStylizer,
    LateralGraphStylizer,
    LateralizedEdge,
    SimpleNode,
} from '../exports'

export interface LateralFlowGraphProps {
    nodes: SimpleNode[]
    edges: LateralizedEdge[]
}

const LateralFlowGraph: React.FC<LateralFlowGraphProps> = ({
    nodes,
    edges,
}) => {
    const { enrichedNodes, enrichedEdges } = useMemo(() => {
        if (edges.length > 0 && nodes.length === 0) {
            throw new Error('Cannot create a graph with edges but no nodes!')
        }

        const stylizer: GraphStylizer = LateralGraphStylizer.Create()

        const { nodes: enrichedNodes, edges: enrichedEdges } =
            stylizer.lateralize(nodes, edges)

        return { enrichedNodes, enrichedEdges }
    }, [nodes, edges])

    return (
        <RendererComponentGraph nodes={enrichedNodes} edges={enrichedEdges} />
    )
}

export default LateralFlowGraph

// For test doubles

export let RendererComponentGraph: React.FC<GraphRendererProps> = GraphRenderer

export function setRendererComponentGraph(
    component: React.FC<GraphRendererProps>
) {
    RendererComponentGraph = component
}
