import { test, assert } from '@sprucelabs/test-utils'
import { render, RenderResult } from '@testing-library/react'
import React from 'react'
import FakeGraphRenderer, {
    lastFakeGraphRendererProps,
} from '../../testDoubles/FakeGraphRenderer'
import { providerWasCreated } from '../../testDoubles/FakeReactFlowProvider'
import App, { setRendererComponent } from '../../ui/App'
import AbstractPackageTest from '../AbstractPackageTest'

export default class AppTest extends AbstractPackageTest {
    private static element: RenderResult

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeReactFlowProvider()
        setRendererComponent(FakeGraphRenderer)

        this.element = this.render()
    }

    @test()
    protected static async rendersApp() {
        assert.isTruthy(this.element, 'App failed to render!')
    }

    @test()
    protected static async wrapsWithReactFlowProvider() {
        this.render()

        assert.isTruthy(
            providerWasCreated,
            'Should wrap with ReactFlowProvider!'
        )
    }

    @test()
    protected static async rendersGraphRendererWithProps() {
        this.render()

        assert.isTruthy(
            lastFakeGraphRendererProps,
            'Should render GraphRenderer with props!'
        )
    }

    private static render() {
        return render(<App nodes={[]} edges={[]} />)
    }
}
