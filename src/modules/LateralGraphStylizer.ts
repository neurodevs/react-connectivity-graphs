import { GraphEdge, GraphNode } from './LateralFlowGraph'

export default class LateralGraphStylizer {
    public static Class?: GraphStylizerConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public enrich(nodes: GraphNode[], edges: GraphEdge[]) {
        return {
            nodes,
            edges,
        } as EnrichedGraph
    }
}

export interface GraphStylizer {
    enrich(nodes: GraphNode[], edges: GraphEdge[]): EnrichedGraph
}

export type GraphStylizerConstructor = new () => GraphStylizer

export interface EnrichedGraph {
    nodes: EnrichedNode[]
    edges: EnrichedEdge[]
}

export interface EnrichedNode extends GraphNode {}

export interface EnrichedEdge extends GraphEdge {}
