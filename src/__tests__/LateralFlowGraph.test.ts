import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
} from '@sprucelabs/test-utils'
import { ReactFlowProvider } from 'reactflow'
import GraphRenderer from '../components/GraphRenderer'
import LateralFlowGraph, {
    GraphEdge,
    FlowGraphOptions,
} from '../components/LateralFlowGraph'

export default class LateralFlowGraphTest extends AbstractSpruceTest {
    private static instance: SpyLateralFlowGraph
    private static callsToCreateElement: CallToCreateElement[] = []

    private static wasHitForCallbacks: {
        onNodeClick: boolean
    }

    protected static async beforeEach() {
        await super.beforeEach()

        LateralFlowGraph.Class = SpyLateralFlowGraph

        this.fakeCreateElement()

        this.wasHitForCallbacks = {
            onNodeClick: false,
        }

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

        assert.isTruthy(
            this.callForReactFlowProvider,
            'Should create a ReactFlowProvider element!'
        )
    }

    @test()
    protected static async rendersReactFlowProviderWithCorrectProps() {
        this.renderJsx()

        assert.isEqualDeep(
            this.callForReactFlowProvider?.props,
            {},
            'Should create a ReactFlowProvider element with correct props!'
        )
    }

    @test()
    protected static async rendersReactFlowProviderWithCorrectChildren() {
        this.renderJsx()

        const isChild = this.callForReactFlowProvider?.children?.some?.(
            (c) => c === this.callForGraphRenderer
        )

        assert.isTrue(
            isChild,
            'GraphRenderer should be a child of ReactFlowProvider!'
        )
    }

    @test()
    protected static async rendersGraphRendererWithCorrectType() {
        this.renderJsx()

        assert.isTruthy(
            this.callForGraphRenderer,
            'Should create a GraphRenderer element!'
        )
    }

    @test()
    protected static async passesOptionalOnNodeClickCallback() {
        this.renderJsx()

        const cb = this.instance.getOnNodeClick()
        cb?.()

        assert.isTruthy(
            this.wasHitForCallbacks.onNodeClick,
            'Should pass onNodeClick!'
        )
    }

    private static renderJsx() {
        return this.instance.render()
    }

    private static fakeCreateElement() {
        this.callsToCreateElement = []

        // @ts-ignore
        LateralFlowGraph.createElement = (
            type: string,
            props: object,
            ...children: React.ReactNode[]
        ) => {
            const element = { type, props, children }
            this.callsToCreateElement.push(element)
            return element
        }
    }

    private static get callForReactFlowProvider() {
        return this.callsToCreateElement.find(
            (call) => call.type === ReactFlowProvider
        )
    }

    private static get callForGraphRenderer() {
        return this.callsToCreateElement.find(
            (call) => call.type === GraphRenderer
        )
    }

    private static get options() {
        return {
            nodes: [],
            edges: [],
            onNodeClick: () => {
                this.wasHitForCallbacks.onNodeClick = true
            },
        } as FlowGraphOptions
    }

    private static LateralFlowGraph(options = this.options) {
        return LateralFlowGraph.Create(options) as SpyLateralFlowGraph
    }
}

export interface CallToCreateElement {
    type: string | React.FC
    props: object
    children: React.ReactNode[]
}

class SpyLateralFlowGraph extends LateralFlowGraph {
    public constructor(options: FlowGraphOptions) {
        super(options)
    }

    public getOnNodeClick() {
        return this.onNodeClick
    }
}
