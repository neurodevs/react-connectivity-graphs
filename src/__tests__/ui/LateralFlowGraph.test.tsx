import { test, assert } from '@neurodevs/node-tdd'
import { render, RenderResult } from '@testing-library/react'

import FakeGraphRenderer, {
    lastFakeGraphRendererProps,
    resetFakeGraphRendererProps,
} from '../../testDoubles/FakeGraphRenderer.js'
import FakeReactFlowProvider, {
    providerWasCreated,
} from '../../testDoubles/FakeReactFlowProvider.js'
import { LateralizedEdge, SimpleEdge, SimpleNode } from '../../types.js'
import LateralFlowGraph, {
    EnrichedEdge,
    EnrichEdgeParams,
    EnrichedNode,
    EnrichNodeParams,
    IndividualNodeStyle,
    LateralFlowGraphProps,
    setProviderComponentOnGraph,
    setRendererComponentGraph,
    Side,
} from '../../ui/LateralFlowGraph.js'
import AbstractPackageTest from '../AbstractPackageTest.js'

export default class LateralFlowGraphTest extends AbstractPackageTest {
    private static result: RenderResult

    private static nodeWidth = '8rem'
    private static nodeWidthRem = 8 * 16
    private static gapDegrees = 40

    protected static async beforeEach() {
        await super.beforeEach()

        setRendererComponentGraph(FakeGraphRenderer)
        resetFakeGraphRendererProps()

        setProviderComponentOnGraph(FakeReactFlowProvider)

        this.result = this.render()
    }

    @test()
    protected static async createsLateralFlowGraphInstance() {
        assert.isTruthy(this.result, 'Should create an instance!')
    }

    @test()
    protected static async throwsOnEdgesWithoutNodes() {
        const zeroNodes: SimpleNode[] = []
        const oneEdge = [{} as LateralizedEdge]

        const err = assert.doesThrow(() => {
            this.render({ nodes: zeroNodes, edges: oneEdge })
        })

        assert.isTruthy(err, 'Should throw an error!')
    }

    @test()
    protected static async passesEnrichedNodesAndEdgesToGraphRenderer() {
        const { nodes, edges } = lastFakeGraphRendererProps ?? {}

        assert.isEqualDeep(
            { nodes, edges },
            { nodes: this.enrichedNodes, edges: this.enrichedEdges },
            'Should pass enriched graph to GraphRenderer!'
        )
    }

    @test()
    protected static async rendersWithProviderComponent() {
        assert.isTrue(
            providerWasCreated,
            'Should render with ReactFlowProvider!'
        )
    }

    @test()
    protected static async exposesViewPaddingPropAndPassesToGraphRenderer() {
        const viewPadding = Math.random()

        this.render({ viewPadding, ...this.options })

        assert.isEqual(
            lastFakeGraphRendererProps?.viewPadding,
            viewPadding,
            'Should pass viewPadding'
        )
    }

    private static get options() {
        return {
            nodes: this.simpleNodes,
            edges: this.lateralizedEdges,
        } as LateralFlowGraphProps
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

        const degreesAtBottom = 90
        const degreesPerSide = 180 - this.gapDegrees
        const degreesPerNode = degreesPerSide / (this.numNodes + 1)

        const radius = this.computeRadius(this.numNodes)

        return this.simpleNodes.map((node, idx) => {
            const sign = onLeftSide ? 1 : -1
            const startDegrees = degreesAtBottom + (this.gapDegrees / 2) * sign
            const degrees = startDegrees + degreesPerNode * (idx + 1) * sign
            const radians = (Math.PI * degrees) / 180

            const positionX = radius * Math.cos(radians) + 4
            const positionY = radius * Math.sin(radians) + 4

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
                        boxSizing: 'border-box',
                        height: '2.2rem',
                        fontFamily: 'sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 100,
                        color: '#777',
                        borderWidth: `0 ${onLeftSide ? '1.5px' : 0} 0 ${onLeftSide ? 0 : '1.5px'}`,
                        padding: '0.5rem',
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

    private static computeRadius(numNodes: number) {
        const degreesPerSide = 180 - this.gapDegrees
        const degreesPerNode = degreesPerSide / (numNodes + 1)
        const radiansPerNode = (Math.PI * degreesPerNode) / 180

        const pixelsBetweenNodes = 120 / (1 + Math.log2(numNodes + 1))

        return pixelsBetweenNodes / radiansPerNode
    }

    private static enrichNode(node: SimpleNode, params: EnrichNodeParams) {
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
                    ...this.defaultNodeStyle,
                    ...sidedStyles,
                    ...individualStyles,
                    ...overrideStyles,
                },
            },
        } as EnrichedNode
    }

    private static get defaultNodeStyle() {
        return {
            width: this.nodeWidth,
            boxSizing: 'border-box',
            height: '2.2rem',
            fontFamily: 'sans-serif',
            fontSize: '0.9em',
            fontWeight: 100,
            color: '#777',
            borderStyle: 'solid',
            borderColor: '#888',
            backgroundColor: 'transparent',
        }
    }

    private static get midlineNodes() {
        const sidedStyles = {
            width: '2rem',
            fontSize: '0.7rem',
            color: '#baedaf',
            borderWidth: '0',
            padding: '0',
            textAlign: 'center',
            justifyContent: 'center',
            WebkitJustifyContent: 'center',
            whiteSpace: 'pre',
        }

        const baseStyles = {
            positionX: 28,
            rotationDegrees: 0,
            sidedStyles,
        }

        const radius = this.computeRadius(this.numNodes)

        const midlineTopY = -radius + this.nodeWidthRem / 4
        const midlineBottomY = radius - this.nodeWidthRem / 4

        const topParams = {
            ...baseStyles,
            positionY: midlineTopY + 4,
            handlePosition: 'top',
        }

        const bottomParams = {
            ...baseStyles,
            positionY: midlineBottomY + 4,
            handlePosition: 'bottom',
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

        return this.enrichEdge(lateralizedEdge)
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

    private static get verticalMidlineEdge() {
        return {
            id: 'vertical-midline',
            source: this.topMidlineNode.id,
            target: this.bottomMidlineNode.id,
        } as SimpleEdge
    }

    private static opposite(side: Side) {
        return side === 'left' ? 'right' : 'left'
    }

    private static get numNodes() {
        return this.simpleNodes.length
    }

    private static render(options = this.options) {
        return render(<LateralFlowGraph {...options} />)
    }
}
