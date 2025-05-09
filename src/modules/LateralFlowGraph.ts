import { assertOptions } from '@sprucelabs/schema'
import SpruceError from '../errors/SpruceError'
import LateralGraphStylizer, {
    EnrichedEdge,
    EnrichedGraph,
    EnrichedNode,
    GraphStylizer,
} from './LateralGraphStylizer'

export default class LateralFlowGraph implements FlowGraph {
    public static Class?: FlowGraphConstructor

    private nodes: GraphNode[]
    private edges: GraphEdge[]
    private stylizer: GraphStylizer
    private enrichedNodes!: EnrichedNode[]
    private enrichedEdges!: EnrichedEdge[]

    protected constructor(options: FlowGraphConstructorOptions) {
        const { nodes, edges, stylizer } = options

        this.nodes = nodes
        this.edges = edges
        this.stylizer = stylizer

        this.throwIfEdgesWithoutNodes()
        this.enrichNodesAndEdges()
    }

    public static Create(options: FlowGraphOptions) {
        assertOptions(options, ['nodes', 'edges'])

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
        throw new SpruceError({
            code: 'EDGES_WITHOUT_NODES',
            numEdges: this.numEdges,
        })
    }

    private get hasAtLeastOneEdge() {
        return this.numEdges > 0
    }

    private get numEdges() {
        return this.edges.length
    }

    private get hasZeroNodes() {
        return this.numNodes === 0
    }

    private get numNodes() {
        return this.nodes.length
    }

    private enrichNodesAndEdges() {
        const { nodes, edges } = this.stylizer.enrich(this.nodes, this.edges)

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
    nodes: GraphNode[]
    edges: GraphEdge[]
}

export interface FlowGraphConstructorOptions extends FlowGraphOptions {
    stylizer: GraphStylizer
}

export interface GraphNode {
    id: string
    label: string
    abbreviation: string
}

export interface GraphEdge {
    id: string
    source: string
    target: string
}
