import { assertOptions } from '@sprucelabs/schema'
import React from 'react'
import { ReactFlowProvider } from 'reactflow'
import SpruceError from '../errors/SpruceError'
import GraphRenderer from './GraphRenderer'

export default class LateralFlowGraph implements FlowGraph {
    public static Class?: FlowGraphConstructor
    public static GraphRenderer = GraphRenderer
    public static createElement = React.createElement

    private nodes: GraphNode[]
    private edges: GraphEdge[]
    private onNodeClick?: () => void
    private onNodeMouseEnter?: () => void
    private onNodeMouseLeave?: () => void
    private onEdgeClick?: () => void
    private onEdgeMouseEnter?: () => void
    private onEdgeMouseLeave?: () => void

    protected constructor(options: FlowGraphOptions) {
        const {
            nodes,
            edges,
            onNodeClick,
            onNodeMouseEnter,
            onNodeMouseLeave,
            onEdgeClick,
            onEdgeMouseEnter,
            onEdgeMouseLeave,
        } = options

        this.nodes = nodes
        this.edges = edges
        this.onNodeClick = onNodeClick
        this.onNodeMouseEnter = onNodeMouseEnter
        this.onNodeMouseLeave = onNodeMouseLeave
        this.onEdgeClick = onEdgeClick
        this.onEdgeMouseEnter = onEdgeMouseEnter
        this.onEdgeMouseLeave = onEdgeMouseLeave

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

    private createRenderer() {
        return this.createElement(this.GraphRenderer, this.graphRendererProps)
    }

    private get createElement() {
        return LateralFlowGraph.createElement
    }

    private get GraphRenderer() {
        return LateralFlowGraph.GraphRenderer
    }

    private get graphRendererProps() {
        return {
            nodes: [],
            edges: [],
            onNodeClick: this.onNodeClick,
            onNodeMouseEnter: this.onNodeMouseEnter,
            onNodeMouseLeave: this.onNodeMouseLeave,
            onEdgeClick: this.onEdgeClick,
            onEdgeMouseEnter: this.onEdgeMouseEnter,
            onEdgeMouseLeave: this.onEdgeMouseLeave,
        }
    }

    public render() {
        const renderer = this.createRenderer()
        return this.createElement(ReactFlowProvider, {}, renderer)
    }
}

export interface FlowGraph {
    render(): React.ReactElement
}

export type FlowGraphConstructor = new (options: FlowGraphOptions) => FlowGraph

export interface FlowGraphOptions {
    nodes: GraphNode[]
    edges: GraphEdge[]
    onNodeClick?: () => void
    onNodeMouseEnter?: () => void
    onNodeMouseLeave?: () => void
    onEdgeClick?: () => void
    onEdgeMouseEnter?: () => void
    onEdgeMouseLeave?: () => void
}

export interface GraphNode {}

export interface GraphEdge {}
