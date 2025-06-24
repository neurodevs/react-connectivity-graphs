import { SimpleNode, SimpleEdge } from '../types'
import LateralGraphStylizer, {
    EnrichedEdge,
    EnrichedGraph,
    EnrichedNode,
    GraphStylizer,
} from './LateralGraphStylizer'

export default class LateralFlowGraph implements FlowGraph {
    public static Class?: FlowGraphConstructor

    private initialNodes: SimpleNode[]
    private initialEdges: LateralizedEdge[]
    private stylizer: GraphStylizer
    private enrichedNodes!: EnrichedNode[]
    private enrichedEdges!: EnrichedEdge[]

    protected constructor(options: FlowGraphConstructorOptions) {
        const { nodes, edges, stylizer } = options

        this.initialNodes = nodes
        this.initialEdges = edges
        this.stylizer = stylizer

        this.throwIfEdgesWithoutNodes()
        this.enrichNodesAndEdges()
    }

    public static Create(options: FlowGraphOptions) {
        const stylizer = this.LateralGraphStylizer()
        return new (this.Class ?? this)({ stylizer, ...options })
    }

    private throwIfEdgesWithoutNodes() {
        if (this.hasEdgesWithoutNodes) {
            this.throwEdgesWithoutNodes()
        }
    }

    private get hasEdgesWithoutNodes() {
        return this.hasAtLeastOneEdge && this.hasZeroNodes
    }

    private throwEdgesWithoutNodes() {
        throw new Error('Cannot create a graph with edges but no nodes!')
    }

    private get hasAtLeastOneEdge() {
        return this.numEdges > 0
    }

    private get numEdges() {
        return this.initialEdges.length
    }

    private get hasZeroNodes() {
        return this.numNodes === 0
    }

    private get numNodes() {
        return this.initialNodes.length
    }

    private enrichNodesAndEdges() {
        const { nodes, edges } = this.stylizer.lateralize(
            this.initialNodes,
            this.initialEdges
        )

        this.enrichedNodes = nodes
        this.enrichedEdges = edges
    }

    public toJson() {
        return {
            nodes: this.enrichedNodes,
            edges: this.enrichedEdges,
        }
    }

    private static LateralGraphStylizer() {
        return LateralGraphStylizer.Create()
    }
}

export interface FlowGraph {
    toJson(): EnrichedGraph
}

export type FlowGraphConstructor = new (options: FlowGraphOptions) => FlowGraph

export interface FlowGraphOptions {
    nodes: SimpleNode[]
    edges: LateralizedEdge[]
}

export interface FlowGraphConstructorOptions extends FlowGraphOptions {
    stylizer: GraphStylizer
}

export interface LateralizedEdge extends SimpleEdge {
    side: 'ipsilateral' | 'contralateral' | 'bilateral'
}
