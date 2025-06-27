import { test, assert } from '@sprucelabs/test-utils'
import { render, RenderResult } from '@testing-library/react'
import React from 'react'
import {
    LateralizedEdge,
    LateralFlowGraph,
    FakeGraphStylizer,
    LateralGraphStylizer,
    LateralFlowGraphProps,
    SimpleNode,
    lastFakeGraphRendererProps,
    setRendererComponentGraph,
    FakeGraphRenderer,
    resetFakeGraphRendererProps,
    FakeReactFlowProvider,
    providerWasCreated,
    setProviderComponentOnGraph,
} from '../../exports'
import AbstractPackageTest from '../AbstractPackageTest'

export default class LateralFlowGraphTest extends AbstractPackageTest {
    private static result: RenderResult

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeGraphStylizer()

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
    protected static async createsLateralGraphStylizerToEnrichNodes() {
        assert.isEqual(
            FakeGraphStylizer.numCallsToConstructor,
            1,
            'Should create a LateralGraphStylizer!'
        )
    }

    @test()
    protected static async enrichesNodesAndEdgesWithStylizer() {
        assert.isEqualDeep(
            FakeGraphStylizer.callsToLateralize[0],
            {
                nodes: this.simpleNodes,
                edges: this.lateralizedEdges,
            },
            'Should call enrich with nodes and edges!'
        )
    }

    @test()
    protected static async passesEnrichedNodesAndEdgesToGraphRenderer() {
        const stylizer = LateralGraphStylizer.Create()

        const { nodes, edges } = stylizer.lateralize(
            this.simpleNodes,
            this.lateralizedEdges
        )

        assert.isEqualDeep(
            lastFakeGraphRendererProps,
            {
                nodes,
                edges,
            },
            'Should return serialized graph!'
        )
    }

    @test()
    protected static async rendersWithProviderComponent() {
        assert.isTrue(
            providerWasCreated,
            'Should render with ReactFlowProvider!'
        )
    }

    private static get options() {
        return {
            nodes: this.simpleNodes,
            edges: this.lateralizedEdges,
        } as LateralFlowGraphProps
    }

    private static render(options = this.options) {
        return render(<LateralFlowGraph {...options} />)
    }
}
