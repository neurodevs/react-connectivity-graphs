import { LateralizedEdge, SimpleEdge, SimpleNode } from '../exports'

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
            ...this.midlineNodes,
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
            padding: '0.5rem',
            textAlign: onLeftSide ? 'right' : 'left',
            justifyContent: flex,
            WebkitJustifyContent: flex,
        }

        return this.initialNodes.map((node, idx) => {
            const degrees = startDegrees + degreesPerNode * idx * sign
            const radians = (Math.PI * degrees) / 180

            const positionX = this.graphRadius * Math.cos(radians) - 4
            const positionY = this.graphRadius * Math.sin(radians) - 4

            const rotationDegrees = onLeftSide ? degrees + 180 : degrees

            const sidedId = `${node.id}-${side}`

            const lateralizedNode = {
                ...node,
                id: sidedId,
            }

            return this.enrichNode(lateralizedNode, {
                positionX,
                positionY,
                rotationDegrees,
                handlePosition: oppositeSide,
                sidedStyles,
            })
        }) as EnrichedNode[]
    }

    private enrichNode(node: SimpleNode, params: EnrichNodeParams) {
        const {
            positionX,
            positionY,
            rotationDegrees,
            handlePosition,
            sidedStyles,
        } = params

        const individualStyles: IndividualNodeStyle = {
            transform: `translateX(${positionX.toFixed(1)}px) translateY(${positionY.toFixed(1)}px) rotate(${rotationDegrees}deg)`,
        }

        return {
            ...node,
            type: 'rotatableNode',
            position: { x: positionX, y: positionY },
            style: {},
            data: {
                id: node.id,
                label: node.abbreviation,
                sourcePosition: handlePosition,
                targetPosition: handlePosition,
                style: {
                    ...this.defaultNodeStyle,
                    ...sidedStyles,
                    ...individualStyles,
                },
            },
        } as EnrichedNode
    }

    private get defaultNodeStyle() {
        return {
            width: this.defaultNodeWidth,
            fontFamily: 'sans-serif',
            fontSize: '0.9em',
            fontWeight: 100,
            color: '#777',
            borderStyle: 'solid',
            borderColor: '#888',
            backgroundColor: 'transparent',
        }
    }

    private defaultNodeWidth = 0

    private get numNodes() {
        return this.initialNodes.length
    }

    private get enrichedEdges() {
        return [
            ...this.mapSimpleEdges('left'),
            ...this.mapSimpleEdges('right'),
            ...this.midlineEdges,
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

    private enrichEdge(edge: SimpleEdge, params?: EnrichEdgeParams) {
        const {
            animated = true,
            type = 'default',
            stroke = 'lightgray',
            strokeWidth = 1.5,
        } = params || {}

        return {
            ...edge,
            type,
            animated,
            style: {
                ...this.defaultEdgeStyle,
                strokeWidth,
                stroke,
            },
        } as EnrichedEdge
    }

    private get defaultEdgeStyle() {
        return {}
    }

    private get midlineNodes() {
        const sidedStyles = {
            width: '1px',
            fontSize: '0.7rem',
            color: '#baedaf',
            borderWidth: '0',
            padding: '0',
            textAlign: 'center',
            justifyContent: 'center',
            WebkitJustifyContent: 'center',
        }

        const baseStyles = {
            positionX: 0,
            rotationDegrees: 0,
            sidedStyles,
        }

        const midlineTopY = -this.graphRadius * 1.1 + 1
        const midlineBottomY = this.graphRadius * 1.1 + 1

        const bottomParams = {
            ...baseStyles,
            positionY: midlineTopY,
            handlePosition: 'top',
        }

        const topParams = {
            ...baseStyles,
            positionY: midlineBottomY,
            handlePosition: 'bottom',
        }

        const toggleParams = {
            ...baseStyles,
            positionY: midlineBottomY + 10,
            handlePosition: 'top',
            sidedStyles: {
                ...sidedStyles,
                color: '#ccc',
                fontSize: '0.6rem',
            },
        }

        return [
            this.enrichNode(this.bottomMidlineNode, bottomParams),
            this.enrichNode(this.topMidlineNode, topParams),
            this.enrichNode(this.abbreviationsToggleNode, toggleParams),
        ]
    }

    private get topMidlineNode() {
        return {
            id: 'top-midline',
            label: 'Top Midline Node',
            abbreviation: 'L   R',
        } as SimpleNode
    }

    private get bottomMidlineNode() {
        return {
            id: 'bottom-midline',
            label: 'Bottom Midline Node',
            abbreviation: 'L   R',
        } as SimpleNode
    }

    private get abbreviationsToggleNode() {
        return {
            id: 'abbreviations-toggle',
            label: 'Abbreviations',
            abbreviation: 'Abbreviations',
        }
    }

    private get midlineEdges() {
        return [
            this.enrichEdge(this.verticalMidlineEdge, {
                animated: false,
                type: 'straight',
                stroke: '#75ed5a',
                strokeWidth: 0.5,
            }),
        ]
    }

    private get verticalMidlineEdge() {
        return {
            id: 'vertical-midline',
            source: this.bottomMidlineNode.id,
            target: this.topMidlineNode.id,
        } as SimpleEdge
    }

    private opposite(side: string) {
        return side == 'left' ? 'right' : 'left'
    }

    private readonly graphRadius = 70
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
    style: any
    data: EnrichedNodeData
}

export interface EnrichedNodeData {
    id: string
    label: string
    sourcePosition: string
    targetPosition: string
    style: NodeStyle
}

export type NodeStyle = BaseNodeStyle & SidedNodeStyle & IndividualNodeStyle

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
    textAlign: string
    justifyContent: string
    WebkitJustifyContent: string
}

export interface IndividualNodeStyle {
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

export interface EnrichNodeParams {
    positionX: number
    positionY: number
    rotationDegrees: number
    handlePosition: string
    sidedStyles: SidedNodeStyle
}

export interface EnrichEdgeParams {
    animated?: boolean
    type?: string
    stroke?: string
    strokeWidth?: number
}
