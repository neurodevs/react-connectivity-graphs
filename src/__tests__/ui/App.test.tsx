import { test, assert } from '@sprucelabs/test-utils'
import { render, RenderResult, within } from '@testing-library/react'
import React from 'react'

import FakeLateralFlowGraph, {
    lastFakeLateralFlowGraphProps,
    resetFakeLateralFlowGraphProps,
} from '../../testDoubles/FakeLateralFlowGraph'
import App, { setGraphComponent } from '../../ui/App'
import AbstractPackageTest from '../AbstractPackageTest'

export default class AppTest extends AbstractPackageTest {
    private static result: RenderResult

    private static app: HTMLElement
    private static container: HTMLElement
    private static graphs: HTMLElement[]

    protected static async beforeEach() {
        await super.beforeEach()

        setGraphComponent(FakeLateralFlowGraph)
        resetFakeLateralFlowGraphProps()

        this.result = this.render()

        this.app = this.result.getByTestId('app')
        this.container = within(this.app).getByTestId('graphs-container')
        this.graphs = within(this.container).getAllByTestId(/graph-\d+/)
    }

    @test()
    protected static async rendersResult() {
        assert.isTruthy(this.result, 'App failed to render!')
    }

    @test()
    protected static async rendersLateralFlowGraphWithProps() {
        this.render()

        assert.isTruthy(
            lastFakeLateralFlowGraphProps,
            'Should render GraphRenderer with props!'
        )
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
    protected static async rendersGraphsInContainerForThreeFlexColumns() {
        assert.isTruthy(this.container, 'Graphs container not found!')
    }

    @test()
    protected static async rendersGraphsContainerWithStyles() {
        const expected = {
            display: 'flex',
            flexWrap: 'wrap',
            maxWidth: `calc(3 * 500px + 2 * 1rem)`,
        }

        const style = window.getComputedStyle(this.container)

        const actual = {
            display: style.display,
            flexWrap: style.flexWrap,
            maxWidth: style.maxWidth,
        }

        assert.isEqualDeep(
            actual,
            expected,
            'Graphs container should have correct styles!'
        )
    }

    @test()
    protected static async rendersNineGraphs() {
        assert.isLength(this.graphs, 9, 'Should render nine graphs!')
    }

    @test()
    protected static async rendersGraphsWithStyles() {
        this.graphs.forEach((graph, index) => {
            const expected = {
                height: '500px',
                width: '500px',
                border: '1px solid rgb(221, 221, 221)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0rem',
            }

            const style = window.getComputedStyle(graph)

            const actual = {
                height: style.height,
                width: style.width,
                border: style.border,
                display: style.display,
                alignItems: style.alignItems,
                justifyContent: style.justifyContent,
                margin: style.margin,
            }

            assert.isEqualDeep(
                actual,
                expected,
                `Graph ${index + 1} should have correct styles!`
            )
        })
    }

    private static render() {
        return render(<App nodes={[]} edges={[]} />)
    }
}
