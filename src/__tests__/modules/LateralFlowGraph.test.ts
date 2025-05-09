import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import { LateralNodeStylizer } from '../../exports'
import LateralFlowGraph, {
    GraphEdge,
    FlowGraphOptions,
    FlowGraph,
    GraphNode,
} from '../../modules/LateralFlowGraph'
import FakeNodeStylizer from '../../testDoubles/modules/FakeNodeStylizer'
import AbstractPackageTest from '../AbstractPackageTest'

export default class LateralFlowGraphTest extends AbstractPackageTest {
    private static instance: FlowGraph

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeNodeStylizer()

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

    @test()
    protected static async toJsonReturnsSerializedGraph() {
        const json = this.instance.toJson()

        assert.isEqualDeep(
            json,
            {
                nodes: this.nodes,
                edges: this.edges,
            },
            'Should return serialized graph!'
        )
    }

    @test()
    protected static async createsLateralNodeStylizerToEnrichNodes() {
        assert.isEqual(
            FakeNodeStylizer.numCallsToConstructor,
            1,
            'Should create a LateralNodeStylizer!'
        )
    }

    private static setFakeNodeStylizer() {
        LateralNodeStylizer.Class = FakeNodeStylizer
        FakeNodeStylizer.resetTestDouble()
    }

    private static get options() {
        return {
            nodes: this.nodes,
            edges: this.edges,
        } as FlowGraphOptions
    }

    private static readonly nodes: GraphNode[] = [{}]
    private static readonly edges: GraphEdge[] = [{}]

    private static LateralFlowGraph(options = this.options) {
        return LateralFlowGraph.Create(options)
    }
}

export interface CallToCreateElement {
    type: string | React.FC
    props: React.Attributes & Record<string, any>
    children: React.ReactNode[]
}
