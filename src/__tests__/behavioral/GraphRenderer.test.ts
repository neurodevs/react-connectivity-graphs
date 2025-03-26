import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import GraphRenderer, { Renderer } from '../../components/GraphRenderer'

export default class GraphRendererTest extends AbstractSpruceTest {
    private static instance: Renderer

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.GraphRenderer()
    }

    @test()
    protected static async canCreateGraphRenderer() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    private static GraphRenderer() {
        return GraphRenderer.Create()
    }
}
