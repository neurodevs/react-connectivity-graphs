import { assertOptions } from '@sprucelabs/schema'
import React from 'react'
import SpruceError from '../errors/SpruceError'

export default class LateralFlowGraph implements FlowGraph {
    public static Class?: FlowGraphConstructor
    public static createElement = React.createElement

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

    private get createElement() {
        return LateralFlowGraph.createElement
    }

    public renderJsx() {
        this.createElement('GraphRenderer')
        return this.createElement('ReactFlowProvider', {}, [])
    }
}

export interface FlowGraph {
    renderJsx(): React.ReactElement
}

export type FlowGraphConstructor = new (options: FlowGraphOptions) => FlowGraph

export interface FlowGraphOptions {
    nodes: GraphNode[]
    edges: GraphEdge[]
}

export interface GraphNode {}

export interface GraphEdge {}
