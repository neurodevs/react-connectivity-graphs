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

        const graphRadius = 200

        const radiusBottomDegrees = 90
        const gapDegrees = 40
        const degreesPerSide = 180 - gapDegrees
        const degreesPerNode = degreesPerSide / (this.numNodes - 1)

        return this.simpleNodes.map((node, idx) => {
            const sign = onLeftSide ? 1 : -1
            const startDegrees = radiusBottomDegrees + (gapDegrees / 2) * sign
            const degrees = startDegrees + degreesPerNode * idx * sign
            const radians = (Math.PI * degrees) / 180

            const positionX = graphRadius * Math.cos(radians)
            const positionY = onLeftSide
                ? graphRadius * Math.sin(radians)
                : graphRadius * Math.sin(radians) - 36

            const sidedId = `${node.id}-${side}`

            return {
                ...node,
                id: sidedId,
                type: 'rotatableNode',
                position: { x: positionX, y: positionY },
                data: {
                    id: sidedId,
                    label: node.abbreviation,
                    sourcePosition: invertedSide,
                    targetPosition: invertedSide,
                    style: {
                        width: 500,
                        fontSize: '0.7em',
                        fontWeight: 100,
                        color: '#404040',
                        borderWidth: `0 ${onLeftSide ? '1px' : 0} 0 ${onLeftSide ? 0 : '1px'}`,
                        padding: `6px ${onLeftSide ? '12px' : 0} 6px ${onLeftSide ? 0 : '12px'}`,
                        borderStyle: 'solid',
                        borderColor: 'lightgray',
                        backgroundColor: '#eee',
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
