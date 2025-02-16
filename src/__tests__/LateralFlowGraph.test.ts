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

    private static get network() {
        return {} as Network
    }

    private static LateralFlowGraph(network = this.network) {
        return LateralFlowGraph.Create(network)
    }
}
