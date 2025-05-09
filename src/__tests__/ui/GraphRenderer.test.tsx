import { test, assert } from '@sprucelabs/test-utils'
import { screen } from '@testing-library/react'
import React from 'react'
import ReactFlow, { Edge, Node } from 'reactflow'
import FakeReactFlow, {
    lastFakeReactFlowProps,
} from '../../testDoubles/ui/FakeReactFlow'
import FakeReactFlowProvider, {
    providerWasCreated,
} from '../../testDoubles/ui/FakeReactFlowProvider'
import GraphRenderer, {
    setProviderComponent,
    setReactFlowComponent,
} from '../../ui/GraphRenderer'
import RotatableNode from '../../ui/RotatableNode'
import AbstractPackageTest from '../AbstractPackageTest'

export default class GraphRendererTest extends AbstractPackageTest {
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
                nodeTypes: this.nodeTypes,
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

    @test()
    protected static async wrapsWithReactFlowProvider() {
        setProviderComponent(FakeReactFlowProvider)

        this.render()

        assert.isTruthy(
            providerWasCreated,
            'Should wrap with ReactFlowProvider!'
        )
    }

    @test()
    protected static async rendersBackground() {
        const background = this.renderAndGetBackground()

        assert.isTruthy(
            background,
            'Should render a background as child of ReactFlow!'
        )
    }

    private static createRenderer() {
        return this.createElement(GraphRenderer)
    }

    private static renderAndGetTopLevelDiv() {
        const { getByTestId } = this.render()
        return getByTestId('graph-renderer')
    }

    private static renderAndGetReactFlow() {
        const div = this.renderAndGetTopLevelDiv()
        return div.querySelector('.react-flow')
    }

    private static renderAndGetBackground() {
        const div = this.renderAndGetTopLevelDiv()
        return div.querySelector('.react-flow__background')
    }

    private static render(useFakeReactFlow = true) {
        const reactflow = useFakeReactFlow ? FakeReactFlow : ReactFlow

        setReactFlowComponent(reactflow)

        return this.renderWithProvider(
            <GraphRenderer
                nodes={this.oneFakeNode}
                edges={this.oneFakeEdge}
                onNodeClick={this.onNodeClick}
                onNodeMouseEnter={this.onNodeMouseEnter}
                onNodeMouseLeave={this.onNodeMouseLeave}
                onEdgeClick={this.onEdgeClick}
                onEdgeMouseEnter={this.onEdgeMouseEnter}
                onEdgeMouseLeave={this.onEdgeMouseLeave}
            />
        )
    }

    private static readonly onNodeClick = () => {}
    private static readonly onNodeMouseEnter = () => {}
    private static readonly onNodeMouseLeave = () => {}
    private static readonly onEdgeClick = () => {}
    private static readonly onEdgeMouseEnter = () => {}
    private static readonly onEdgeMouseLeave = () => {}

    private static readonly nodeTypes = {
        rotatableNode: RotatableNode,
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
