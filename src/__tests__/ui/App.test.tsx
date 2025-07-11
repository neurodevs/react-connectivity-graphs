import { test, assert } from '@sprucelabs/test-utils'
import { render, RenderResult } from '@testing-library/react'
import React from 'react'

import FakeLateralFlowGraph, {
    lastFakeLateralFlowGraphProps,
    resetFakeLateralFlowGraphProps,
} from '../../testDoubles/FakeLateralFlowGraph'
import App, { setGraphComponent } from '../../ui/App'
import AbstractPackageTest from '../AbstractPackageTest'

export default class AppTest extends AbstractPackageTest {
    private static element: RenderResult

    protected static async beforeEach() {
        await super.beforeEach()

        setGraphComponent(FakeLateralFlowGraph)
        resetFakeLateralFlowGraphProps()

        this.element = this.render()
    }

    @test()
    protected static async rendersApp() {
        assert.isTruthy(this.element, 'App failed to render!')
    }

    @test()
    protected static async rendersLateralFlowGraphWithProps() {
        this.render()

        assert.isTruthy(
            lastFakeLateralFlowGraphProps,
            'Should render GraphRenderer with props!'
        )
    }

    private static render() {
        return render(<App nodes={[]} edges={[]} />)
    }
}
