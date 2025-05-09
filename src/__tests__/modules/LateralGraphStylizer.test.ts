import { test, assert } from '@sprucelabs/test-utils'
import LateralGraphStylizer, {
    GraphStylizer,
} from '../../modules/LateralGraphStylizer'
import AbstractPackageTest from '../AbstractPackageTest'

export default class LateralGraphStylizerTest extends AbstractPackageTest {
    private static instance: GraphStylizer

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.LateralGraphStylizer()
    }

    @test()
    protected static async createsLateralGraphStylizer() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    protected static LateralGraphStylizer() {
        return LateralGraphStylizer.Create()
    }
}
