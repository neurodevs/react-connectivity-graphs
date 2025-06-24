import { test, assert } from '@sprucelabs/test-utils'
import { SimpleEdge, SimpleNode } from 'types'
import LateralGraphStylizer, {
    EnrichedEdge,
    EnrichEdgeParams,
    EnrichedNode,
    EnrichNodeParams,
    GraphStylizer,
    IndividualNodeStyle,
    Side,
} from '../../ui/LateralGraphStylizer'
import AbstractPackageTest from '../AbstractPackageTest'

export default class LateralGraphStylizerTest extends AbstractPackageTest {
    private static instance: GraphStylizer
    private static graphRadius = 200
    private static nodeWidth = 500

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.LateralGraphStylizer()
    }

    @test()
    protected static async createsLateralGraphStylizer() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    @test()
    protected static async returnsEnrichedNodes() {
        const { nodes } = this.instance.lateralize(this.simpleNodes, [])
        assert.isEqualDeep(nodes, this.enrichedNodes)
    }

    @test()
    protected static async returnsEnrichedEdges() {
        const { edges } = this.instance.lateralize([], this.lateralizedEdges)
        assert.isEqualDeep(edges, this.enrichedEdges)
    }

    private static enrichedNodes = this.stylizeNodes()
    private static enrichedEdges = this.stylizeEdges()

    private static stylizeNodes() {
        return [
            ...this.mapSimpleNodes('left'),
            ...this.mapSimpleNodes('right'),
            ...this.midlineNodes,
        ]
    }

    private static mapSimpleNodes(side: 'left' | 'right' = 'left') {
        const onLeftSide = side == 'left'

        const invertedSide = onLeftSide ? 'right' : 'left'
        const flex = onLeftSide ? 'flex-end' : 'flex-start'

        const radiusBottomDegrees = 90
        const gapDegrees = 40
        const degreesPerSide = 180 - gapDegrees
        const degreesPerNode = degreesPerSide / (this.numNodes - 1)

        return this.simpleNodes.map((node, idx) => {
            const sign = onLeftSide ? 1 : -1
            const startDegrees = radiusBottomDegrees + (gapDegrees / 2) * sign
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
                style: {},
                data: {
                    id: sidedId,
                    label: `${node.abbreviation}`,
                    sourcePosition: invertedSide,
                    targetPosition: invertedSide,
                    style: {
                        width: this.nodeWidth,
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
                        transform: `translateX(${positionX.toFixed(1)}px) translateY(${positionY.toFixed(1)}px) rotate(${onLeftSide ? degrees + 180 : degrees}deg)`,
                    },
                },
            }
        }) as EnrichedNode[]
    }

    private static enrichNode(node: SimpleNode, params: EnrichNodeParams) {
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

    private static get defaultNodeStyle() {
        return {
            width: this.nodeWidth,
            fontFamily: 'sans-serif',
            fontSize: '0.9em',
            fontWeight: 100,
            color: '#777',
            borderStyle: 'solid',
            borderColor: '#888',
            backgroundColor: 'transparent',
        }
    }

    private static stylizeEdges() {
        return [
            ...this.mapSimpleEdges('left'),
            ...this.mapSimpleEdges('right'),
            this.enrichEdge(this.verticalMidlineEdge, this.enrichEdgeParams),
        ]
    }

    private static mapSimpleEdges(side: 'left' | 'right') {
        return this.lateralizedEdges.flatMap((edge) => {
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

    private static lateralizeEdge(
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

        return LateralGraphStylizerTest.enrichEdge(lateralizedEdge)
    }

    private static enrichEdge(edge: SimpleEdge, params?: EnrichEdgeParams) {
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
                stroke,
                strokeWidth,
            },
        } as EnrichedEdge
    }

    private static get enrichEdgeParams() {
        return {
            animated: false,
            type: 'straight',
            stroke: '#75ed5a',
            strokeWidth: 0.5,
        }
    }

    private static get midlineNodes() {
        const bottomParams = {
            positionX: 3,
            positionY: (-this.graphRadius * 2) / 5,
            rotationDegrees: 0,
            handlePosition: 'top',
            sidedStyles: {
                color: '#baedaf',
                borderWidth: '0',
                padding: '0',
                textAlign: 'center',
                justifyContent: 'center',
                WebkitJustifyContent: 'center',
            },
        }

        const topParams = {
            positionX: 3,
            positionY: (this.graphRadius * 2) / 5,
            rotationDegrees: 0,
            handlePosition: 'bottom',
            sidedStyles: {
                color: '#baedaf',
                borderWidth: '0',
                padding: '0',
                textAlign: 'center',
                justifyContent: 'center',
                WebkitJustifyContent: 'center',
            },
        }

        return [
            this.enrichNode(this.bottomMidlineNode, bottomParams),
            this.enrichNode(this.topMidlineNode, topParams),
        ]
    }

    private static get bottomMidlineNode() {
        return {
            id: 'bottom-midline',
            label: 'Bottom Midline Node',
            abbreviation: 'L   R',
        } as SimpleNode
    }

    private static get topMidlineNode() {
        return {
            id: 'top-midline',
            label: 'Top Midline Node',
            abbreviation: 'L   R',
        } as SimpleNode
    }

    private static get verticalMidlineEdge() {
        return {
            id: 'vertical-midline',
            source: this.bottomMidlineNode.id,
            target: this.topMidlineNode.id,
        } as SimpleEdge
    }

    private static opposite(side: Side) {
        return side === 'left' ? 'right' : 'left'
    }

    private static get numNodes() {
        return this.simpleNodes.length
    }

    protected static LateralGraphStylizer() {
        return LateralGraphStylizer.Create()
    }
}
