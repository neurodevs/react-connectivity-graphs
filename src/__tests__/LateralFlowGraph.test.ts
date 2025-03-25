import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
} from '@sprucelabs/test-utils'
import React from 'react'
import LateralFlowGraph, {
    GraphEdge,
    FlowGraph,
    FlowGraphOptions,
} from '../components/LateralFlowGraph'

export default class LateralFlowGraphTest extends AbstractSpruceTest {
    private static instance: FlowGraph

    protected static async beforeEach() {
        await super.beforeEach()
        this.instance = this.LateralFlowGraph()
    }

    @test()
    protected static async canCreateLateralFlowGraph() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        const err = assert.doesThrow(() => {
            // @ts-ignore
            LateralFlowGraph.Create()
        })
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['nodes', 'edges'],
        })
    }

    @test()
    protected static async throwsOnEdgesWithoutNodes() {
        const zeroNodes: Node[] = []
        const oneEdge = [{} as GraphEdge]

        const err = assert.doesThrow(() => {
            LateralFlowGraph.Create({ nodes: zeroNodes, edges: oneEdge })
        })

        errorAssert.assertError(err, 'EDGES_WITHOUT_NODES', {
            numEdges: oneEdge.length,
        })
    }

    @test()
    protected static async renderJsxReturnsExpectedTemplate() {
        const jsx = this.renderJsx()

        assert.isEqualDeep(jsx, this.expectedJsx, 'Should return JSX!')
    }

    @test()
    protected static async renderJsxCreatesReactFlowProviderElement() {
        let passedName = ''

        // @ts-ignore
        LateralFlowGraph.createElement = (elementName: string) => {
            passedName = elementName
        }

        this.renderJsx()

        assert.isEqual(
            passedName,
            'ReactFlowProvider',
            'Should create a ReactFlowProvider element!'
        )
    }

    private static renderJsx() {
        return this.instance.renderJsx()
    }

    private static get network() {
        return {
            nodes: [],
            edges: [],
        } as FlowGraphOptions
    }

    private static readonly elementName = 'ReactFlowProvider'

    private static readonly expectedJsx = React.createElement(
        LateralFlowGraphTest.elementName
    )

    private static LateralFlowGraph(options = this.network) {
        return LateralFlowGraph.Create(options)
    }
}
