import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import LateralFlowGraph, {
    GraphEdge,
    FlowGraphOptions,
    FlowGraph,
} from '../../modules/LateralFlowGraph'
import AbstractPackageTest from '../AbstractPackageTest'

export default class LateralFlowGraphTest extends AbstractPackageTest {
    private static instance: FlowGraph

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.LateralFlowGraph()
    }

    @test()
    protected static async createsLateralFlowGraphInstance() {
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

    private static get options() {
        return {
            nodes: [],
            edges: [],
        } as FlowGraphOptions
    }

    private static LateralFlowGraph(options = this.options) {
        return LateralFlowGraph.Create(options)
    }
}

export interface CallToCreateElement {
    type: string | React.FC
    props: React.Attributes & Record<string, any>
    children: React.ReactNode[]
}
