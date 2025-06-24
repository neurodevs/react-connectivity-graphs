import { test, assert } from '@sprucelabs/test-utils'
import {
    FlowGraph,
    LateralizedEdge,
    LateralFlowGraph,
    FakeGraphStylizer,
    LateralGraphStylizer,
    FlowGraphOptions,
    SimpleNode,
    AbstractPackageTest,
} from '../../exports'

export default class LateralFlowGraphTest extends AbstractPackageTest {
    private static instance: FlowGraph

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeReactFlowProvider()
        this.setFakeGraphStylizer()

        this.instance = this.LateralFlowGraph()
    }

    @test()
    protected static async createsLateralFlowGraphInstance() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    @test()
    protected static async throwsOnEdgesWithoutNodes() {
        const zeroNodes: SimpleNode[] = []
        const oneEdge = [{} as LateralizedEdge]

        const err = assert.doesThrow(() => {
            LateralFlowGraph.Create({ nodes: zeroNodes, edges: oneEdge })
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
    protected static async toJsonReturnsEnrichedGraph() {
        const json = this.instance.toJson()

        const stylizer = LateralGraphStylizer.Create()

        const { nodes, edges } = stylizer.lateralize(
            this.simpleNodes,
            this.lateralizedEdges
        )

        assert.isEqualDeep(
            json,
            {
                nodes,
                edges,
            },
            'Should return serialized graph!'
        )
    }

    private static get options() {
        return {
            nodes: this.simpleNodes,
            edges: this.lateralizedEdges,
        } as FlowGraphOptions
    }

    private static LateralFlowGraph(options = this.options) {
        return LateralFlowGraph.Create(options)
    }
}
