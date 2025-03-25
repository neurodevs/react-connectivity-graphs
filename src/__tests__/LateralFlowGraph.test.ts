import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
} from '@sprucelabs/test-utils'
import LateralFlowGraph, {
    GraphEdge,
    FlowGraph,
    FlowGraphOptions,
} from '../components/LateralFlowGraph'

export default class LateralFlowGraphTest extends AbstractSpruceTest {
    private static instance: FlowGraph
    private static passedName: string

    protected static async beforeEach() {
        await super.beforeEach()

        this.fakeCreateElement()

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
    protected static async renderJsxCreatesReactFlowProviderElement() {
        this.renderJsx()

        assert.isEqual(
            this.passedName,
            'ReactFlowProvider',
            'Should create a ReactFlowProvider element!'
        )
    }

    private static fakeCreateElement() {
        this.passedName = ''

        // @ts-ignore
        LateralFlowGraph.createElement = (elementName: string) => {
            this.passedName = elementName
        }
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

    private static LateralFlowGraph(options = this.network) {
        return LateralFlowGraph.Create(options)
    }
}
