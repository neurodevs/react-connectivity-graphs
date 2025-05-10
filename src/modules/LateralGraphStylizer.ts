import { SimpleEdge, SimpleNode } from './LateralFlowGraph'

export default class LateralGraphStylizer {
    public static Class?: GraphStylizerConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public enrich(nodes: SimpleNode[], edges: SimpleEdge[]) {
        return {
            nodes,
            edges,
        } as EnrichedGraph
    }
}

export interface GraphStylizer {
    enrich(nodes: SimpleNode[], edges: SimpleEdge[]): EnrichedGraph
}

export type GraphStylizerConstructor = new () => GraphStylizer

export interface EnrichedGraph {
    nodes: EnrichedNode[]
    edges: EnrichedEdge[]
}

export interface EnrichedNode extends SimpleNode {}

export interface EnrichedEdge extends SimpleEdge {}
