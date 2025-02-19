import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
} from '@sprucelabs/test-utils'
import LateralFlowGraph, {
    Edge,
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
    protected static async throwsWithEmptyNodesAndDefinedEdges() {
        const emptyNodes: Node[] = []
        const oneEdge = [{} as Edge]

        const err = assert.doesThrow(() => {
            LateralFlowGraph.Create({ nodes: emptyNodes, edges: oneEdge })
        })

        errorAssert.assertError(err, 'EDGES_WITHOUT_NODES', {
            numEdges: oneEdge.length,
        })
    }

    @test()
    protected static async renderJsxReturnsExpectedTemplate() {
        const jsx = this.renderJsx()

        assert.isEqual(jsx, this.expectedJsx, 'Should return JSX!')
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

    private static readonly expectedJsx = '<></>'

    private static LateralFlowGraph(options = this.network) {
        return LateralFlowGraph.Create(options)
    }
}
