import { assertOptions } from '@sprucelabs/schema'
import SpruceError from '../errors/SpruceError'

export default class LateralFlowGraph implements FlowGraph {
    public static Class?: FlowGraphConstructor

    private nodes: GraphNode[]
    private edges: GraphEdge[]

    protected constructor(options: FlowGraphOptions) {
        const { nodes, edges } = options

        this.nodes = nodes
        this.edges = edges

        this.throwIfEdgesWithoutNodes()
    }

    public static Create(options: FlowGraphOptions) {
        assertOptions(options, ['nodes', 'edges'])
        return new (this.Class ?? this)(options)
    }

    private throwIfEdgesWithoutNodes() {
        if (this.nodes.length === 0 && this.edges.length > 0) {
            throw new SpruceError({
                code: 'EDGES_WITHOUT_NODES',
                numEdges: this.edges.length,
            })
        }
    }
    public renderJsx() {
        return '<></>'
    }
}

export interface FlowGraph {
    renderJsx(): string
}

export type FlowGraphConstructor = new () => FlowGraph

export interface FlowGraphOptions {
    nodes: GraphNode[]
    edges: GraphEdge[]
}

export interface GraphNode {}

export interface GraphEdge {}
