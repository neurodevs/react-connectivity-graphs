import { test, assert } from '@sprucelabs/test-utils'
import { render } from '@testing-library/react'
import React from 'react'
import MultiNetworkRenderer from '../../ui/MultiNetworkRenderer'
import AbstractPackageTest from '../AbstractPackageTest'

export default class MultiNetworkRendererTest extends AbstractPackageTest {
    private static element: React.ReactElement

    protected static async beforeEach() {
        await super.beforeEach()

        this.element = this.createRenderer()
    }

    @test()
    protected static async createsMultiNetworkRendererElement() {
        assert.isTruthy(
            this.element,
            'Should create MultiNetworkRenderer element!'
        )
    }

    @test()
    protected static async rendersWithTopLevelDiv() {
        const div = this.renderAndGetTopLevelDiv()

        assert.isTruthy(div, 'Should render a div!')
    }

    @test()
    protected static async rendersDivWithExpectedClassName() {
        const div = this.renderAndGetTopLevelDiv()

        assert.isEqual(
            div.className,
            'multi-network-renderer',
            'Should render div with className="multi-network-renderer"!'
        )
    }

    private static createRenderer() {
        return this.createElement(MultiNetworkRenderer)
    }

    private static renderAndGetTopLevelDiv() {
        const { getByTestId } = this.render()
        return getByTestId('multi-network-renderer')
    }

    protected static render() {
        return render(<MultiNetworkRenderer />)
    }
}
