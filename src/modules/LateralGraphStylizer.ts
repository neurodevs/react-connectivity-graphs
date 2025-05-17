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
        return [...this.mapSimpleNodes('left'), ...this.mapSimpleNodes('right')]
    }

    private mapSimpleNodes(side: 'left' | 'right') {
        const onLeftSide = side == 'left'

        const invertedSide = onLeftSide ? 'right' : 'left'
        const flex = onLeftSide ? 'flex-end' : 'flex-start'

        const degreesPerNode = this.degreesPerSide / (this.numNodes - 1)

        return this.simpleNodes.map((node, idx) => {
            const sign = onLeftSide ? 1 : -1
            const startDegrees = this.bottomDegrees + this.halfDegrees * sign
            const degrees = startDegrees + degreesPerNode * idx * sign
            const radians = (Math.PI * degrees) / 180

            const positionX = this.graphRadius * Math.cos(radians)
            const positionY = this.graphRadius * Math.sin(radians)

            const sidedId = `${node.id}-${side}`

            return {
                ...node,
                id: sidedId,
                type: 'rotatableNode',
                position: { x: positionX, y: positionY },
                data: {
                    id: sidedId,
                    label: `${node.abbreviation}`,
                    sourcePosition: invertedSide,
                    targetPosition: invertedSide,
                    style: {
                        width: 500,
                        fontFamily: 'sans-serif',
                        fontSize: '0.9em',
                        fontWeight: 100,
                        color: '#777',
                        borderWidth: `0 ${onLeftSide ? '1.5px' : 0} 0 ${onLeftSide ? 0 : '1.5px'}`,
                        padding: `6px ${onLeftSide ? '12px' : 0} 6px ${onLeftSide ? 0 : '12px'}`,
                        borderStyle: 'solid',
                        borderColor: '#888',
                        backgroundColor: 'transparent',
                        textAlign: onLeftSide ? 'right' : 'left',
                        justifyContent: flex,
                        WebkitJustifyContent: flex,
                        transform: `
                            translateX(${positionX.toFixed(1)}px) 
                            translateY(${positionY.toFixed(1)}px) 
                            rotate(${onLeftSide ? degrees + 180 : degrees}deg) 
                        `,
                    },
                },
            }
        }) as EnrichedNode[]
    }

    private get numNodes() {
        return this.simpleNodes.length
    }

    private get enrichedEdges() {
        return [...this.mapSimpleEdges('left'), ...this.mapSimpleEdges('right')]
    }

    private mapSimpleEdges(side: 'left' | 'right') {
        return this.simpleEdges.flatMap((edge) => {
            switch (edge.side) {
                case 'ipsilateral':
                    return [this.enrichEdge(edge, side, side)]
                case 'contralateral':
                    return [this.enrichEdge(edge, side, this.opposite(side))]
                case 'bilateral':
                    return [
                        this.enrichEdge(edge, side, side),
                        this.enrichEdge(edge, side, this.opposite(side)),
                    ]
            }
        })
    }

    private enrichEdge(edge: SimpleEdge, sourceSide: Side, targetSide: Side) {
        return {
            ...edge,
            id: `${edge.id}-${sourceSide}-${targetSide}`,
            source: `${edge.source}-${sourceSide}`,
            target: `${edge.target}-${targetSide}`,
            animated: true,
            style: {
                stroke: 'lightgray',
                strokeWidth: 1.5,
            },
        } as EnrichedEdge
    }

    private opposite(side: string) {
        return side == 'left' ? 'right' : 'left'
    }

    private readonly graphRadius = 350
    private readonly bottomDegrees = 90
    private readonly gapDegrees = 40
    private readonly halfDegrees = this.gapDegrees / 2
    private readonly degreesPerSide = 180 - this.gapDegrees
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

export type Side = 'left' | 'right'
