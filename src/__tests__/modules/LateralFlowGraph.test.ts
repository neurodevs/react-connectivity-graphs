import { test, assert, errorAssert } from '@sprucelabs/test-utils'
import LateralFlowGraph, {
    SimpleEdge,
    FlowGraphOptions,
    FlowGraph,
    SimpleNode,
} from '../../modules/LateralFlowGraph'
import LateralGraphStylizer from '../../modules/LateralGraphStylizer'
import FakeGraphStylizer from '../../testDoubles/modules/FakeGraphStylizer'
import AbstractPackageTest from '../AbstractPackageTest'

export default class LateralFlowGraphTest extends AbstractPackageTest {
    private static instance: FlowGraph

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeGraphStylizer()

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
        const zeroNodes: SimpleNode[] = []
        const oneEdge = [{} as SimpleEdge]

        const err = assert.doesThrow(() => {
            LateralFlowGraph.Create({ nodes: zeroNodes, edges: oneEdge })
        })

        errorAssert.assertError(err, 'EDGES_WITHOUT_NODES', {
            numEdges: oneEdge.length,
        })
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
            FakeGraphStylizer.callsToEnrich[0],
            {
                nodes: this.simpleNodes,
                edges: this.simpleEdges,
            },
            'Should call enrich with nodes and edges!'
        )
    }

    @test()
    protected static async toJsonReturnsEnrichedGraph() {
        const json = this.instance.toJson()

        const stylizer = LateralGraphStylizer.Create()

        const { nodes, edges } = stylizer.enrich(
            this.simpleNodes,
            this.simpleEdges
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

    private static setFakeGraphStylizer() {
        LateralGraphStylizer.Class = FakeGraphStylizer
        FakeGraphStylizer.resetTestDouble()
    }

    private static get options() {
        return {
            nodes: this.simpleNodes,
            edges: this.simpleEdges,
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
