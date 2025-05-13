import { SimpleEdge, SimpleNode } from './LateralFlowGraph'

export default class LateralGraphStylizer {
    public static Class?: GraphStylizerConstructor

    private simpleNodes!: SimpleNode[]
    private simpleEdges!: SimpleEdge[]

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public enrich(nodes: SimpleNode[], edges: SimpleEdge[]) {
        this.simpleNodes = nodes
        this.simpleEdges = edges

        return {
            nodes: this.enrichedNodes,
            edges: this.enrichedEdges,
        } as EnrichedGraph
    }

    private get enrichedNodes() {
        return [...this.mapSimpleNodes(), ...this.mapSimpleNodes()]
    }

    private mapSimpleNodes() {
        return this.simpleNodes.map((node) => ({
            ...node,
            type: 'rotatableNode',
            position: { x: 100, y: 100 },
            data: {
                id: node.id,
                label: node.abbreviation,
                sourcePosition: 'left',
                targetPosition: 'right',
                style: {
                    width: 500,
                    fontSize: '0.7em',
                    fontWeight: 100,
                    color: '#404040',
                    borderStyle: 'solid',
                    borderColor: 'lightgray',
                    backgroundColor: '#eee',
                },
            },
        })) as EnrichedNode[]
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

export interface EnrichedNode extends SimpleNode {
    type: string
    position: PositionXY
    data: EnrichedNodeData
}

export interface EnrichedNodeData {
    id: string
    label: string
    sourcePosition: string
    targetPosition: string
    style: EnrichedNodeStyle
}

export interface EnrichedNodeStyle {
    width: number
    fontSize: string
    fontWeight: number
    color: string
    borderStyle: string
    borderColor: string
    backgroundColor: string
}

export interface PositionXY {
    x: number
    y: number
}

export interface EnrichedEdge extends SimpleEdge {
    animated: boolean
    style: EnrichedEdgeStyle
}

export interface EnrichedEdgeStyle {
    stroke: string
    strokeWidth: number
}
