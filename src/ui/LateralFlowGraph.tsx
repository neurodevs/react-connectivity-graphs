import { ReactFlowProvider } from '@xyflow/react'
import { ReactFlowProviderProps } from '@xyflow/react/dist/esm/components/ReactFlowProvider'
import React, { useMemo } from 'react'
import { LateralizedEdge, SimpleEdge, SimpleNode } from '../types'
import GraphRenderer, {
    CustomNodeTypes,
    GraphRendererProps,
} from './GraphRenderer'

export interface LateralFlowGraphProps {
    nodes: SimpleNode[]
    edges: LateralizedEdge[]
    viewPadding?: number
}

const LateralFlowGraph: React.FC<LateralFlowGraphProps> = ({
    nodes,
    edges,
    viewPadding,
}) => {
    const defaultNodeWidth = 0
    const gapDegrees = 40

    const topMidlineNode = {
        id: 'top-midline',
        label: 'Top Midline Node',
        abbreviation: 'L   R',
    } as SimpleNode

    const bottomMidlineNode = {
        id: 'bottom-midline',
        label: 'Bottom Midline Node',
        abbreviation: 'L   R',
    } as SimpleNode

    const abbreviationsToggleNode = {
        id: 'abbreviations-toggle',
        label: 'Abbreviations',
        abbreviation: 'Abbreviations',
    }

    const abbreviationsModalNode = {
        id: 'abbreviations-modal',
        label: 'Abbreviations Modal',
        abbreviation: 'abbreviations modal',
    } as SimpleNode

    const verticalMidlineEdge: SimpleEdge = {
        id: 'vertical-midline',
        source: bottomMidlineNode.id,
        target: topMidlineNode.id,
    }

    const defaultNodeStyle = {
        width: defaultNodeWidth,
        fontFamily: 'sans-serif',
        fontSize: '0.9em',
        fontWeight: 100,
        color: '#777',
        borderStyle: 'solid',
        borderColor: '#888',
        backgroundColor: 'transparent',
    }

    const { enrichedNodes, enrichedEdges } = useMemo(() => {
        throwIfEdgesAndZeroNodes()
        return enrichGraph()
    }, [nodes, edges])

    return (
        <ProviderComponent>
            <RendererComponentGraph
                nodes={enrichedNodes}
                edges={enrichedEdges}
                viewPadding={viewPadding}
            />
        </ProviderComponent>
    )

    function throwIfEdgesAndZeroNodes() {
        if (edges.length > 0 && nodes.length === 0) {
            throw new Error('Cannot create a graph with edges but no nodes!')
        }
    }

    function enrichGraph() {
        return {
            enrichedNodes: [
                ...mapSimpleNodes('left'),
                ...mapSimpleNodes('right'),
                ...getMidlineNodes(),
            ],
            enrichedEdges: [
                ...mapSimpleEdges('left'),
                ...mapSimpleEdges('right'),
                ...getMidlineEdges(),
            ],
        } as EnrichedGraph
    }

    function mapSimpleNodes(side: 'left' | 'right') {
        const onLeftSide = side == 'left'
        const oppositeSide = opposite(side)
        const sign = onLeftSide ? 1 : -1

        const degreesAtBottom = 90
        const degreesPerSide = 180 - gapDegrees
        const startDegrees = degreesAtBottom + (gapDegrees / 2) * sign
        const degreesPerNode = degreesPerSide / (nodes.length + 1)

        const radius = computeRadius(nodes.length)

        const flex = onLeftSide ? 'flex-end' : 'flex-start'

        const sidedStyles = {
            borderWidth: `0 ${onLeftSide ? '1.5px' : 0} 0 ${onLeftSide ? 0 : '1.5px'}`,
            padding: '0.5rem',
            textAlign: onLeftSide ? 'right' : 'left',
            justifyContent: flex,
            WebkitJustifyContent: flex,
        }

        return nodes.map((node, idx) => {
            const degrees = startDegrees + degreesPerNode * (idx + 1) * sign
            const radians = (Math.PI * degrees) / 180

            const positionX = radius * Math.cos(radians) - 4
            const positionY = radius * Math.sin(radians) - 4

            const rotationDegrees = onLeftSide ? degrees + 180 : degrees

            const sidedId = `${node.id}-${side}`

            const lateralizedNode = {
                ...node,
                id: sidedId,
            }

            return enrichNode(lateralizedNode, {
                positionX,
                positionY,
                rotationDegrees,
                handlePosition: oppositeSide,
                sidedStyles,
            })
        }) as EnrichedNode[]
    }

    function computeRadius(numNodes: number) {
        const pixelsBetweenNodes = 20
        const degreesPerSide = 180 - gapDegrees
        const degreesPerNode = degreesPerSide / (numNodes + 1)
        const radiansPerNode = (Math.PI * degreesPerNode) / 180

        return pixelsBetweenNodes / radiansPerNode
    }

    function mapSimpleEdges(side: 'left' | 'right') {
        return edges.flatMap((edge) => {
            switch (edge.side) {
                case 'ipsilateral':
                    return [lateralizeEdge(edge, side, side)]
                case 'contralateral':
                    return [lateralizeEdge(edge, side, opposite(side))]
                case 'bilateral':
                    return [
                        lateralizeEdge(edge, side, side),
                        lateralizeEdge(edge, side, opposite(side)),
                    ]
            }
        })
    }

    function lateralizeEdge(
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

        return enrichEdge(lateralizedEdge)
    }

    function getMidlineNodes() {
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

        const radius = computeRadius(nodes.length)
        const modalSize = getSquareSideLengthFromRadius(radius)

        const midlineTopY = -radius
        const midlineBottomY = radius

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

        const modalParams = {
            ...baseStyles,
            nodeType: 'tabularNode',
            positionX: -modalSize / 2,
            positionY: -modalSize / 2 + 3,
            sidedStyles: {
                ...sidedStyles,
                color: '#ccc',
                backgroundColor: 'red',
                fontSize: '0.6rem',
            },
            overrideStyles: {
                width: 2 * modalSize,
                height: 2 * modalSize,
                backgroundColor: '#fcfcfc',
                borderColor: '#ccc',
                borderWidth: '1px',
                borderRadius: '5%',
            },
        }

        return [
            enrichNode(bottomMidlineNode, bottomParams),
            enrichNode(topMidlineNode, topParams),
            enrichNode(abbreviationsToggleNode, toggleParams),
            enrichNode(abbreviationsModalNode, modalParams),
        ]
    }

    function getSquareSideLengthFromRadius(radius: number, scaleFactor = 0.9) {
        return scaleFactor * radius * Math.SQRT2
    }

    function getMidlineEdges() {
        return [
            enrichEdge(verticalMidlineEdge, {
                animated: false,
                type: 'straight',
                stroke: '#75ed5a',
                strokeWidth: 0.5,
            }),
        ]
    }

    function enrichNode(node: SimpleNode, params: EnrichNodeParams) {
        const {
            positionX,
            positionY,
            rotationDegrees,
            handlePosition,
            sidedStyles,
            overrideStyles = {},
            nodeType = 'rotatableNode',
        } = params

        const individualStyles: IndividualNodeStyle = {
            transform: `translateX(${positionX.toFixed(1)}px) translateY(${positionY.toFixed(1)}px) rotate(${rotationDegrees}deg)`,
        }

        return {
            ...node,
            type: nodeType,
            position: { x: positionX, y: positionY },
            style: {},
            data: {
                id: node.id,
                label: node.abbreviation,
                sourcePosition: handlePosition,
                targetPosition: handlePosition,
                style: {
                    ...defaultNodeStyle,
                    ...sidedStyles,
                    ...individualStyles,
                    ...overrideStyles,
                },
            },
        } as EnrichedNode
    }

    function enrichEdge(edge: SimpleEdge, params?: EnrichEdgeParams) {
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
                strokeWidth,
                stroke,
            },
        } as EnrichedEdge
    }

    function opposite(side: string) {
        return side == 'left' ? 'right' : 'left'
    }
}

export default LateralFlowGraph

export interface EnrichedGraph {
    enrichedNodes: EnrichedNode[]
    enrichedEdges: EnrichedEdge[]
}

export interface EnrichedNode extends SimpleNode {
    type: string
    position: PositionXY
    style: TopLevelStyle
    data: EnrichedNodeData
}

export interface EnrichedNodeData {
    id: string
    label: string
    sourcePosition: string
    targetPosition: string
    style: NodeStyle
}

export interface TopLevelStyle {
    color?: string
    borderColor?: string
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
    sidedStyles: SidedNodeStyle
    handlePosition?: string
    overrideStyles?: React.CSSProperties
    nodeType?: keyof CustomNodeTypes
}

export interface EnrichEdgeParams {
    animated?: boolean
    type?: string
    stroke?: string
    strokeWidth?: number
}

// For test doubles

export let ProviderComponent: React.FC<ReactFlowProviderProps> =
    ReactFlowProvider

export function setProviderComponentOnGraph(
    component: React.FC<ReactFlowProviderProps>
) {
    ProviderComponent = component
}

export let RendererComponentGraph: React.FC<GraphRendererProps> = GraphRenderer

export function setRendererComponentGraph(
    component: React.FC<GraphRendererProps>
) {
    RendererComponentGraph = component
}
