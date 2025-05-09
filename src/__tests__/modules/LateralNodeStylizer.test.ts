import { test, assert } from '@sprucelabs/test-utils'
import LateralNodeStylizer, {
    NodeStylizer,
} from '../../modules/LateralNodeStylizer'
import AbstractPackageTest from '../AbstractPackageTest'

export default class LateralNodeStylizerTest extends AbstractPackageTest {
    private static instance: NodeStylizer

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.LateralNodeStylizer()
    }

    @test()
    protected static async createsLateralNodeStylizer() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    protected static LateralNodeStylizer() {
        return LateralNodeStylizer.Create()
    }
}
