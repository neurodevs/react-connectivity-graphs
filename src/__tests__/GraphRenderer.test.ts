import { test, assert } from '@sprucelabs/test-utils'
import React from 'react'
import GraphRenderer from '../components/GraphRenderer'
import AbstractDomTest from './AbstractDomTest'

export default class GraphRendererTest extends AbstractDomTest {
    private static element: React.ReactElement

    protected static async beforeEach() {
        await super.beforeEach()

        this.element = this.createGraphRendererElement()
    }

    @test()
    protected static async createsGraphRendererElement() {
        assert.isTruthy(this.element, 'Should create a React element!')
    }

    @test()
    protected static async createsElementWithExpectedType() {
        assert.isEqual(
            this.element.type,
            GraphRenderer,
            'Should render GraphRenderer component!'
        )
    }

    private static createGraphRendererElement() {
        return React.createElement(GraphRenderer)
    }
}
