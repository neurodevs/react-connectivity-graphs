import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import { render, screen } from '@testing-library/react'
import React from 'react'
import ReactFlow, { Edge, Node, ReactFlowProvider } from 'reactflow'
import GraphRenderer from '../components/GraphRenderer'
import FakeReactFlow, {
    lastFakeReactFlowProps,
} from '../testDoubles/FakeReactFlow'

export default class GraphRendererTest extends AbstractSpruceTest {
    private static element: React.ReactElement

    protected static async beforeEach() {
        await super.beforeEach()

        this.element = this.createRenderer()
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
                onNodeClick: this.onNodeClick,
                onNodeMouseEnter: this.onNodeMouseEnter,
                onNodeMouseLeave: this.onNodeMouseLeave,
                onEdgeClick: this.onEdgeClick,
                onEdgeMouseEnter: this.onEdgeMouseEnter,
                onEdgeMouseLeave: this.onEdgeMouseLeave,
            },
            'Passed incorrect props to ReactFlow!'
        )
    }

    @test()
    protected static async rendersOneNodeOnScreen() {
        this.render(false)

        const renderedNodes = screen.queryAllByTestId(/rf__node-\d/)

        assert.isEqual(
            renderedNodes.length,
            1,
            'Should render one node on screen!'
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

    private static render(useFake = true) {
        return render(
            <ReactFlowProvider>
                <GraphRenderer
                    nodes={this.oneFakeNode}
                    edges={this.oneFakeEdge}
                    onNodeClick={this.onNodeClick}
                    onNodeMouseEnter={this.onNodeMouseEnter}
                    onNodeMouseLeave={this.onNodeMouseLeave}
                    onEdgeClick={this.onEdgeClick}
                    onEdgeMouseEnter={this.onEdgeMouseEnter}
                    onEdgeMouseLeave={this.onEdgeMouseLeave}
                    ReactFlowComponent={useFake ? FakeReactFlow : ReactFlow}
                />
            </ReactFlowProvider>
        )
    }

    private static readonly onNodeClick = () => {}
    private static readonly onNodeMouseEnter = () => {}
    private static readonly onNodeMouseLeave = () => {}
    private static readonly onEdgeClick = () => {}
    private static readonly onEdgeMouseEnter = () => {}
    private static readonly onEdgeMouseLeave = () => {}

    private static createRenderer() {
        return React.createElement(GraphRenderer)
    }

    private static readonly oneFakeNode: Node[] = [
        {
            id: '1',
            position: { x: 0, y: 0 },
            data: {},
        },
    ]

    private static readonly oneFakeEdge: Edge[] = [{} as Edge]
}
