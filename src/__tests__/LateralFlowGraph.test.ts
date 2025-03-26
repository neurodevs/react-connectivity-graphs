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
    private static passedType?: string
    private static passedProps?: object
    private static passedChildren?: React.ReactNode[]

    protected static async beforeEach() {
        await super.beforeEach()

        this.fakeCreateElement()

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
    protected static async rendersReactFlowProviderWithCorrectType() {
        this.renderJsx()

        assert.isEqual(
            this.passedType,
            'ReactFlowProvider',
            'Should create a ReactFlowProvider element with correct type!'
        )
    }

    @test()
    protected static async rendersReactFlowProviderWithCorrectProps() {
        this.renderJsx()

        assert.isEqualDeep(
            this.passedProps,
            {},
            'Should create a ReactFlowProvider element with correct props!'
        )
    }

    @test()
    protected static async rendersReactFlowProviderWithCorrectChildren() {
        this.renderJsx()

        assert.isEqualDeep(
            this.passedChildren,
            [],
            'Should create a ReactFlowProvider element with correct children!'
        )
    }

    private static fakeCreateElement() {
        this.passedType = undefined
        this.passedProps = undefined
        this.passedChildren = undefined

        // @ts-ignore
        LateralFlowGraph.createElement = (
            type: string,
            props: object,
            children: React.ReactNode[]
        ) => {
            this.passedType = type
            this.passedProps = props
            this.passedChildren = children
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
