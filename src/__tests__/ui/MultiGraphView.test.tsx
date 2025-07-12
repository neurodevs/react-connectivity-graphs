import { test, assert } from '@sprucelabs/test-utils'
import { render, RenderResult, within } from '@testing-library/react'
import React from 'react'
import {
    FakeLateralFlowGraph,
    resetFakeLateralFlowGraphProps,
} from '../../exports'
import MultiGraphView, {
    setGraphComponentMultiView,
} from '../../ui/MultiGraphView'
import AbstractPackageTest from '../AbstractPackageTest'

export default class MultiGraphViewTest extends AbstractPackageTest {
    private static result: RenderResult

    private static container: HTMLElement
    private static graphs: HTMLElement[]

    protected static async beforeEach() {
        await super.beforeEach()

        setGraphComponentMultiView(FakeLateralFlowGraph)
        resetFakeLateralFlowGraphProps()

        this.result = this.render()

        this.container = this.result.getByTestId('graphs-container')
        this.graphs = within(this.container).getAllByTestId(/graph-\d+/)
    }

    @test()
    protected static async rendersResult() {
        assert.isTruthy(this.result, 'MultiGraphView failed to render!')
    }

    @test()
    protected static async rendersGraphsContainerForThreeFlexColumns() {
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
        return render(<MultiGraphView />)
    }
}
