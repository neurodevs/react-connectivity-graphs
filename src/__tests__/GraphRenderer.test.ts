import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import React from 'react'
import GraphRenderer from '../components/GraphRenderer'

export default class GraphRendererTest extends AbstractSpruceTest {
    private static element: React.ReactElement

    protected static async beforeEach() {
        await super.beforeEach()

        this.element = this.renderGraphRenderer()
    }

    @test()
    protected static async rendersGraphRendererElement() {
        assert.isTruthy(this.element, 'Should create a React element!')

        assert.isEqual(
            this.element.type,
            GraphRenderer,
            'Should render GraphRenderer component!'
        )
    }

    private static renderGraphRenderer() {
        return React.createElement(GraphRenderer)
    }
}
