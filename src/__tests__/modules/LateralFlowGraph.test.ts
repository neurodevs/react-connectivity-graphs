import { test, assert, errorAssert, generateId } from '@sprucelabs/test-utils'
import LateralFlowGraph, {
    GraphEdge,
    FlowGraphOptions,
    FlowGraph,
    GraphNode,
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
        const zeroNodes: GraphNode[] = []
        const oneEdge = [{} as GraphEdge]

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
                nodes: this.nodes,
                edges: this.edges,
            },
            'Should call enrich with nodes and edges!'
        )
    }

    @test()
    protected static async toJsonReturnsEnrichedGraph() {
        const stylizer = LateralGraphStylizer.Create()

        const json = this.instance.toJson()

        const { nodes: enrichedNodes, edges: enrichedEdges } = stylizer.enrich(
            this.nodes,
            this.edges
        )

        assert.isEqualDeep(
            json,
            {
                nodes: enrichedNodes,
                edges: enrichedEdges,
            },
            'Should return serialized graph!'
        )
    }

    private static generateNode() {
        return {
            id: generateId(),
            label: generateId(),
            abbreviation: generateId(),
        }
    }

    private static generateEdge() {
        return {
            id: generateId(),
            source: this.nodes[0].id,
            target: this.nodes[1].id,
        }
    }

    private static setFakeGraphStylizer() {
        LateralGraphStylizer.Class = FakeGraphStylizer
        FakeGraphStylizer.resetTestDouble()
    }

    private static get options() {
        return {
            nodes: this.nodes,
            edges: this.edges,
        } as FlowGraphOptions
    }

    private static readonly nodes: GraphNode[] = [
        this.generateNode(),
        this.generateNode(),
    ]
    private static readonly edges: GraphEdge[] = [this.generateEdge()]

    private static LateralFlowGraph(options = this.options) {
        return LateralFlowGraph.Create(options)
    }
}

export interface CallToCreateElement {
    type: string | React.FC
    props: React.Attributes & Record<string, any>
    children: React.ReactNode[]
}
