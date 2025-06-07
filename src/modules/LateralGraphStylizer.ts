import { SimpleEdge, SimpleNode } from '../types'
import { LateralizedEdge } from './LateralFlowGraph'

export default class LateralGraphStylizer {
    public static Class?: GraphStylizerConstructor

    private initialNodes!: SimpleNode[]
    private initialEdges!: LateralizedEdge[]

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }

    public lateralize(nodes: SimpleNode[], edges: LateralizedEdge[]) {
        this.initialNodes = nodes
        this.initialEdges = edges

        return {
            nodes: this.enrichedNodes,
            edges: this.enrichedEdges,
        } as EnrichedGraph
    }

    private get enrichedNodes() {
        return [
            ...this.mapSimpleNodes('left'),
            ...this.mapSimpleNodes('right'),
            ...this.hiddenNodes,
        ]
    }

    private mapSimpleNodes(side: 'left' | 'right') {
        const onLeftSide = side == 'left'
        const oppositeSide = this.opposite(side)
        const flex = onLeftSide ? 'flex-end' : 'flex-start'
        const sign = onLeftSide ? 1 : -1
        const startDegrees = this.bottomDegrees + this.halfDegrees * sign
        const degreesPerNode = this.degreesPerSide / (this.numNodes - 1)

        const sidedStyles = {
            borderWidth: `0 ${onLeftSide ? '1.5px' : 0} 0 ${onLeftSide ? 0 : '1.5px'}`,
            padding: `6px ${onLeftSide ? '12px' : 0} 6px ${onLeftSide ? 0 : '12px'}`,
            textAlign: onLeftSide ? 'right' : 'left',
            justifyContent: flex,
            WebkitJustifyContent: flex,
        }

        return this.initialNodes.map((node, idx) => {
            const degrees = startDegrees + degreesPerNode * idx * sign
            const radians = (Math.PI * degrees) / 180

            const positionX = this.graphRadius * Math.cos(radians)
            const positionY = this.graphRadius * Math.sin(radians)

            const rotationDegrees = onLeftSide ? degrees + 180 : degrees

            const { id: nodeId, abbreviation: nodeAbbreviation } = node
            const sidedId = `${nodeId}-${side}`

            const fixedPositionX = positionX.toFixed(1)
            const fixedPositionY = positionY.toFixed(1)

            const calculatedStyles = {
                ...sidedStyles,
                transform: `
                            translateX(${fixedPositionX}px) 
                            translateY(${fixedPositionY}px) 
                            rotate(${rotationDegrees}deg) 
                        `,
            }

            return {
                ...node,
                id: sidedId,
                type: 'rotatableNode',
                position: { x: positionX, y: positionY },
                data: {
                    id: sidedId,
                    label: nodeAbbreviation,
                    sourcePosition: oppositeSide,
                    targetPosition: oppositeSide,
                    style: {
                        ...this.defaultNodeStyle,
                        ...calculatedStyles,
                    },
                },
            }
        }) as EnrichedNode[]
    }

    private get defaultNodeStyle() {
        return {
            width: 500,
            fontFamily: 'sans-serif',
            fontSize: '0.9em',
            fontWeight: 100,
            color: '#777',
            borderStyle: 'solid',
            borderColor: '#888',
            backgroundColor: 'transparent',
        }
    }

    private get numNodes() {
        return this.initialNodes.length
    }

    private get enrichedEdges() {
        return [
            ...this.mapSimpleEdges('left'),
            ...this.mapSimpleEdges('right'),
            ...this.hiddenEdges,
        ]
    }

    private mapSimpleEdges(side: 'left' | 'right') {
        return this.initialEdges.flatMap((edge) => {
            switch (edge.side) {
                case 'ipsilateral':
                    return [this.lateralizeEdge(edge, side, side)]
                case 'contralateral':
                    return [
                        this.lateralizeEdge(edge, side, this.opposite(side)),
                    ]
                case 'bilateral':
                    return [
                        this.lateralizeEdge(edge, side, side),
                        this.lateralizeEdge(edge, side, this.opposite(side)),
                    ]
            }
        })
    }

    private opposite(side: string) {
        return side == 'left' ? 'right' : 'left'
    }

    private lateralizeEdge(
        edge: SimpleEdge,
        sourceSide: Side,
        targetSide: Side
    ) {
        const id = `${edge.id}-${sourceSide}-${targetSide}`
        const sourceId = `${edge.source}-${sourceSide}`
        const targetId = `${edge.target}-${targetSide}`

        const lateralizedEdge = {
            ...edge,
            id,
            source: sourceId,
            target: targetId,
        }

        return this.enrichEdge(lateralizedEdge)
    }

    private enrichEdge(edge: SimpleEdge) {
        return {
            ...edge,
            animated: true,
            style: {
                ...this.defaultEdgeStyle,
            },
        } as EnrichedEdge
    }

    private get defaultEdgeStyle() {
        return {
            stroke: 'lightgray',
            strokeWidth: 1.5,
        }
    }

    private get hiddenNodes() {
        return []
    }

    private get hiddenEdges() {
        return [this.enrichEdge(this.hiddenVerticalLine)]
    }

    private get bottomHiddenNode() {
        return {
            id: 'vertical-line-bottom',
            label: 'Vertical Line Bottom',
            abbreviation: 'VLB',
        } as SimpleNode
    }

    private get topHiddenNode() {
        return {
            id: 'vertical-line-top',
            label: 'Vertical Line Top',
            abbreviation: 'VLT',
        } as SimpleNode
    }

    private get hiddenVerticalLine() {
        return {
            id: 'vertical-line',
            source: this.bottomHiddenNode.id,
            target: this.topHiddenNode.id,
        } as SimpleEdge
    }

    private readonly graphRadius = 350
    private readonly bottomDegrees = 90
    private readonly gapDegrees = 40
    private readonly halfDegrees = this.gapDegrees / 2
    private readonly degreesPerSide = 180 - this.gapDegrees
}

export interface GraphStylizer {
    lateralize(nodes: SimpleNode[], edges: SimpleEdge[]): EnrichedGraph
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
    style: NodeStyle
}

export type NodeStyle = BaseNodeStyle & CalculatedNodeStyle & SidedNodeStyle

export interface BaseNodeStyle {
    width: number
    fontSize: string
    fontWeight: number
    color: string
    borderStyle: string
    borderColor: string
    backgroundColor: string
}

export interface SidedNodeStyle {
    borderWidth: string
    padding: string
    textAlign: string
    justifyContent: string
    WebkitJustifyContent: string
}

export interface CalculatedNodeStyle {
    transform: string
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
