import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import React from 'react'
import MultiNetworkRenderer from '../../ui/MultiNetworkRenderer'

export default class MultiNetworkRendererTest extends AbstractSpruceTest {
    private static element: React.ReactElement

    protected static async beforeEach() {
        await super.beforeEach()

        this.element = this.MultiNetworkRenderer()
    }

    @test()
    protected static async createsMultiNetworkRendererElement() {
        assert.isTruthy(
            this.element,
            'Should create MultiNetworkRenderer element!'
        )
    }

    protected static MultiNetworkRenderer() {
        return <MultiNetworkRenderer />
    }
}
