import { assert, test } from '@sprucelabs/test-utils'
import React from 'react'
import RotatableNode from '../../components/RotatableNode'
import AbstractPackageTest from '../AbstractPackageTest'

export default class RotatableNodeTest extends AbstractPackageTest {
    private static element: React.ReactElement

    protected static async beforeEach() {
        await super.beforeEach()

        this.element = this.createElement(RotatableNode)
    }

    @test()
    protected static async canCreateRotatableNode() {
        assert.isTruthy(this.element, 'Should create an instance!')
    }
}
