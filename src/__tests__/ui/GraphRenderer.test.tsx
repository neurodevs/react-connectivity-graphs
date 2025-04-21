import { test, assert } from '@sprucelabs/test-utils'
import { render, screen } from '@testing-library/react'
import React from 'react'
import ReactFlow, { Edge, Node, ReactFlowProvider } from 'reactflow'
import FakeReactFlow, {
    lastFakeReactFlowProps,
} from '../../testDoubles/ui/FakeReactFlow'
import GraphRenderer, { NodeTypesFactory } from '../../ui/GraphRenderer'
import RotatableNode from '../../ui/RotatableNode'
import AbstractPackageTest from '../AbstractPackageTest'

export default class GraphRendererTest extends AbstractPackageTest {
    private static element: React.ReactElement
    private static useMemoPassedFactory?: NodeTypesFactory
    private static useMemoPassedDeps?: React.DependencyList

    protected static async beforeEach() {
        await super.beforeEach()

        this.clearFakeUseMemo()

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
    protected static async memoizesNodeTypesForEfficiency() {
        this.render()

        assert.isEqualDeep(
            this.useMemoPassedFactory?.(),
            this.nodeTypes,
            'Should memoize nodeTypes!'
        )
    }

    @test()
    protected static async memoizesNodeTypesWithEmptyDeps() {
        this.render()

        assert.isEqualDeep(
            this.useMemoPassedDeps,
            [],
            'Should memoize nodeTypes with empty deps!'
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

    private static render(useFakeReactFlow = true) {
        const reactFlowComponent = useFakeReactFlow ? FakeReactFlow : ReactFlow

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
                    ReactFlowComponent={reactFlowComponent}
                    useMemoHook={this.fakeUseMemo}
                />
            </ReactFlowProvider>
        )
    }

    private static clearFakeUseMemo() {
        this.useMemoPassedFactory = undefined
        this.useMemoPassedDeps = undefined
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

    private static readonly fakeUseMemo = (
        factory: NodeTypesFactory,
        deps: React.DependencyList
    ) => {
        this.useMemoPassedFactory = factory
        this.useMemoPassedDeps = deps

        return this.nodeTypes
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
