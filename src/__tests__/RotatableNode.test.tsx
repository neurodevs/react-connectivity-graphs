import AbstractSpruceTest, { assert, test } from '@sprucelabs/test-utils'
import React from 'react'
import RotatableNode from '../components/RotatableNode'

export default class RotatableNodeTest extends AbstractSpruceTest {
    private static element: React.ReactElement

    protected static async beforeEach() {
        await super.beforeEach()

        this.element = React.createElement(RotatableNode)
    }

    @test()
    protected static async canCreateRotatableNode() {
        assert.isTruthy(this.element, 'Should create an instance!')
    }
}
