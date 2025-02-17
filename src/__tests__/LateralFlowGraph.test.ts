import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
} from '@sprucelabs/test-utils'
import LateralFlowGraph, {
    FlowGraph,
    Network,
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
            parameters: ['network'],
        })
    }

    @test()
    protected static async renderJsxReturnsExpectedTemplate() {
        const jsx = this.render()

        assert.isEqual(jsx, this.expectedJsx, 'Should return JSX!')
    }

    private static render() {
        return this.instance.renderJsx()
    }

    private static get network() {
        return {} as Network
    }

    private static readonly expectedJsx = '<></>'

    private static LateralFlowGraph(network = this.network) {
        return LateralFlowGraph.Create(network)
    }
}
