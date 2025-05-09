import { test, assert } from '@sprucelabs/test-utils'
import { render, RenderResult } from '@testing-library/react'
import React from 'react'
import FakeGraphRenderer, {
    lastFakeGraphRendererProps,
} from '../../testDoubles/ui/FakeGraphRenderer'
import App, { setGraphRendererComponent } from '../../ui/App'
import AbstractPackageTest from '../AbstractPackageTest'

export default class AppTest extends AbstractPackageTest {
    private static element: RenderResult

    protected static async beforeEach() {
        await super.beforeEach()

        this.element = this.render()
    }

    @test()
    protected static async rendersApp() {
        assert.isTruthy(this.element, 'App failed to render!')
    }

    @test()
    protected static async rendersGraphRendererWithProps() {
        setGraphRendererComponent(FakeGraphRenderer)

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
