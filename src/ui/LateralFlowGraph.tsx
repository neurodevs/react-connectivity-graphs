import { ReactFlowProvider } from '@xyflow/react'
import { ReactFlowProviderProps } from '@xyflow/react/dist/esm/components/ReactFlowProvider'
import React, { useMemo } from 'react'
import {
    GraphRendererProps,
    GraphStylizer,
    LateralGraphStylizer,
    LateralizedEdge,
    SimpleNode,
} from '../exports'
import GraphRenderer from './GraphRenderer'

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
        <ProviderComponent>
            <RendererComponentGraph
                nodes={enrichedNodes}
                edges={enrichedEdges}
            />
        </ProviderComponent>
    )
}

export default LateralFlowGraph

// For test doubles

export let ProviderComponent: React.FC<ReactFlowProviderProps> =
    ReactFlowProvider

export function setProviderComponentOnGraph(
    component: React.FC<ReactFlowProviderProps>
) {
    ProviderComponent = component
}

export let RendererComponentGraph: React.FC<GraphRendererProps> = GraphRenderer

export function setRendererComponentGraph(
    component: React.FC<GraphRendererProps>
) {
    RendererComponentGraph = component
}
