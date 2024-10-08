import AbstractSpruceTest, {
    test,
    assert,
    errorAssert,
} from '@sprucelabs/test-utils'
import LateralizedConnectivityGraph, {
    Graph,
    Network,
} from '../../LateralizedConnectivityGraph'

export default class LateralizedConnectivityGraphTest extends AbstractSpruceTest {
    private static instance: Graph

    protected static async beforeEach() {
        await super.beforeEach()
        this.instance = this.LateralizedConnectivityGraph()
    }

    @test()
    protected static async canCreateLateralizedConnectivityGraph() {
        assert.isTruthy(this.instance)
    }

    @test()
    protected static async throwsWithMissingRequiredOptions() {
        const err = assert.doesThrow(() => {
            // @ts-ignore
            LateralizedConnectivityGraph.Create()
        })
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['network'],
        })
    }

    private static get network() {
        return {} as Network
    }

    private static LateralizedConnectivityGraph(network = this.network) {
        return LateralizedConnectivityGraph.Create(network)
    }
}
