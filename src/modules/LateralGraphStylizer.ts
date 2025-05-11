import { SimpleEdge, SimpleNode } from './LateralFlowGraph'

export default class LateralGraphStylizer {
    public static Class?: GraphStylizerConstructor

    private simpleEdges!: SimpleEdge[]

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public enrich(nodes: SimpleNode[], edges: SimpleEdge[]) {
        this.simpleEdges = edges

        return {
            nodes,
            edges: this.enrichedEdges,
        } as EnrichedGraph
    }

    private get enrichedEdges() {
        return this.simpleEdges.map((edge) => ({
            ...edge,
            animated: true,
            style: {
                stroke: 'lightgray',
                strokeWidth: 0.5,
            },
        })) as EnrichedEdge[]
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
