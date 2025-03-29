import { test, assert } from '@sprucelabs/test-utils'
import { render } from '@testing-library/react'
import React from 'react'
import GraphRenderer from '../components/GraphRenderer'
import AbstractDomTest from './AbstractDomTest'

export default class GraphRendererTest extends AbstractDomTest {
    private static element: React.ReactElement

    protected static async beforeEach() {
        await super.beforeEach()

        this.element = this.createElement()
    }

    @test()
    protected static async createsGraphRendererElement() {
        assert.isTruthy(this.element, 'Should create a GraphRenderer element!')
    }

    @test()
    protected static async createsElementWithExpectedType() {
        assert.isEqual(
            this.element.type,
            GraphRenderer,
            'Should create GraphRenderer element with expected type!'
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
            'graph-renderer',
            'Should render div with className="graph-renderer"!'
        )
    }

    @test()
    protected static async rendersReactFlowAsChildOfDiv() {
        const div = this.renderAndGetTopLevelDiv()
        const reactFlow = div.querySelector('.react-flow')

        assert.isTruthy(reactFlow, 'Should render ReactFlow as child of div!')
    }

    private static renderAndGetTopLevelDiv() {
        const { getByTestId } = this.render()
        return getByTestId('graph-renderer')
    }

    private static createElement() {
        return React.createElement(GraphRenderer)
    }

    private static render() {
        return render(<GraphRenderer />)
    }
}
