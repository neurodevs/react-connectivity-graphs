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

    private simpleNodes: SimpleNode[]
    private simpleEdges: SimpleEdge[]
    private stylizer: GraphStylizer
    private enrichedNodes!: EnrichedNode[]
    private enrichedEdges!: EnrichedEdge[]

    protected constructor(options: FlowGraphConstructorOptions) {
        const { nodes, edges, stylizer } = options

        this.simpleNodes = nodes
        this.simpleEdges = edges
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
        return this.simpleEdges.length
    }

    private get hasZeroNodes() {
        return this.numNodes === 0
    }

    private get numNodes() {
        return this.simpleNodes.length
    }

    private enrichNodesAndEdges() {
        const { nodes, edges } = this.stylizer.enrich(
            this.simpleNodes,
            this.simpleEdges
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
    edges: SimpleEdge[]
}

export interface FlowGraphConstructorOptions extends FlowGraphOptions {
    stylizer: GraphStylizer
}

export interface SimpleNode {
    id: string
    label: string
    abbreviation: string
}

export interface SimpleEdge {
    id: string
    source: string
    target: string
    side: 'ipsilateral' | 'contralateral' | 'bilateral'
}
