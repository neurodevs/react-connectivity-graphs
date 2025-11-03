import { test, assert } from '@neurodevs/node-tdd'
import { render, RenderResult, within } from '@testing-library/react'

import FakeMultiGraphView from '../../testDoubles/FakeMultiGraphView.js'
import App, { setViewComponent } from '../../ui/App.js'
import AbstractPackageTest from '../AbstractPackageTest.js'

export default class AppTest extends AbstractPackageTest {
    private static result: RenderResult

    private static app: HTMLElement
    private static container: HTMLElement

    protected static async beforeEach() {
        await super.beforeEach()

        setViewComponent(FakeMultiGraphView)

        this.result = this.render()

        this.app = this.result.getByTestId('app')
        this.container = within(this.app).getByTestId('graphs-container')
    }

    @test()
    protected static async rendersResult() {
        assert.isTruthy(this.result, 'App failed to render!')
    }

    @test()
    protected static async rendersApp() {
        assert.isTruthy(this.app, 'App container not found!')
    }

    @test()
    protected static async rendersAppContainerWithStyles() {
        const expected = {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0rem',
            justifyContent: 'center',
            alignItems: 'flex-start',
        }

        const style = window.getComputedStyle(this.app)

        const actual = {
            display: style.display,
            flexWrap: style.flexWrap,
            gap: style.gap,
            justifyContent: style.justifyContent,
            alignItems: style.alignItems,
        }

        assert.isEqualDeep(
            actual,
            expected,
            'App container should have correct styles!'
        )
    }

    @test()
    protected static async rendersMultiGraphView() {
        assert.isTruthy(this.container, 'MultiGraphView container not found!')
    }

    private static render() {
        return render(<App nodes={[]} edges={[]} />)
    }
}
