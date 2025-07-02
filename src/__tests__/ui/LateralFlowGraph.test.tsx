import { test, assert } from '@sprucelabs/test-utils'
import { render, RenderResult } from '@testing-library/react'
import React from 'react'
import FakeGraphRenderer, {
    lastFakeGraphRendererProps,
    resetFakeGraphRendererProps,
} from '../../testDoubles/FakeGraphRenderer'
import FakeReactFlowProvider, {
    providerWasCreated,
} from '../../testDoubles/FakeReactFlowProvider'
import { LateralizedEdge, SimpleEdge, SimpleNode } from '../../types'
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
} from '../../ui/LateralFlowGraph'
import AbstractPackageTest from '../AbstractPackageTest'

export default class LateralFlowGraphTest extends AbstractPackageTest {
    private static result: RenderResult
    private static gapDegrees = 40
    private static nodeWidth = 0

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

            const positionX = radius * Math.cos(radians) - 4 // = 0.5rem = 16 px / 4 ?
            const positionY = radius * Math.sin(radians) - 4

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
        const pixelsBetweenNodes = 20
        const degreesPerSide = 180 - this.gapDegrees
        const degreesPerNode = degreesPerSide / (numNodes + 1)
        const radiansPerNode = (Math.PI * degreesPerNode) / 180

        return pixelsBetweenNodes / radiansPerNode
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

    private static get midlineNodes() {
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

        const radius = this.computeRadius(this.numNodes)

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

        return [
            this.enrichNode(this.bottomMidlineNode, bottomParams),
            this.enrichNode(this.topMidlineNode, topParams),
            this.enrichNode(this.abbreviationsToggleNode, toggleParams),
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

    private static get abbreviationsToggleNode() {
        return {
            id: 'abbreviations-toggle',
            label: 'Abbreviations',
            abbreviation: 'Abbreviations',
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

    private static render(options = this.options) {
        return render(<LateralFlowGraph {...options} />)
    }
}
