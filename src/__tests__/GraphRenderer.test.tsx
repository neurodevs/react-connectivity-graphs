import { test, assert } from '@sprucelabs/test-utils'
import { render } from '@testing-library/react'
import React from 'react'
import { Edge, Node } from 'reactflow'
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
        const reactFlow = this.renderAndGetReactFlow()

        assert.isTruthy(reactFlow, 'Should render ReactFlow as child of div!')
    }

    @test()
    protected static async passesPropsToReactFlow() {
        this.render()

        assert.isEqualDeep(
            lastFakeReactFlowProps,
            {
                nodes: this.oneFakeNode,
                edges: this.oneFakeEdge,
            },
            'Passed incorrect props to ReactFlow!'
        )
    }

    private static renderAndGetTopLevelDiv() {
        const { getByTestId } = this.render()
        return getByTestId('graph-renderer')
    }

    private static renderAndGetReactFlow() {
        const div = this.renderAndGetTopLevelDiv()
        return div.querySelector('.react-flow')
    }

    private static render() {
        return render(
            <GraphRenderer
                nodes={this.oneFakeNode}
                edges={this.oneFakeEdge}
                ReactFlowComponent={FakeReactFlow}
            />
        )
    }

    private static createElement() {
        return React.createElement(GraphRenderer)
    }

    private static readonly oneFakeNode = [{} as Node]
    private static readonly oneFakeEdge = [{} as Edge]
}
