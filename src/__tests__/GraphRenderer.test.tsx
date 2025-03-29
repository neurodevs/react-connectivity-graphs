import { test, assert } from '@sprucelabs/test-utils'
import { render } from '@testing-library/react'
import React from 'react'
import ReactFlow from 'reactflow'
import GraphRenderer from '../components/GraphRenderer'
import FakeReactFlow, {
    lastFakeReactFlowProps,
} from '../testDoubles/FakeReactFlow'
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
        const reactFlow = this.renderAndGetReactFlow(false)

        assert.isTruthy(reactFlow, 'Should render ReactFlow as child of div!')
    }

    @test()
    protected static async passesPropsToReactFlow() {
        this.render()

        assert.isEqualDeep(
            lastFakeReactFlowProps,
            {
                nodes: [],
                edges: [],
            },
            'Passed incorrect props to ReactFlow!'
        )
    }

    private static renderAndGetTopLevelDiv(useFake = true) {
        const { getByTestId } = this.render(useFake)
        return getByTestId('graph-renderer')
    }

    private static renderAndGetReactFlow(useFake = true) {
        const div = this.renderAndGetTopLevelDiv(useFake)
        return div.querySelector('.react-flow')
    }

    private static render(useFake = true) {
        const Component = useFake ? FakeReactFlow : ReactFlow
        return render(<GraphRenderer ReactFlowComponent={Component} />)
    }

    private static createElement() {
        return React.createElement(GraphRenderer)
    }
}
