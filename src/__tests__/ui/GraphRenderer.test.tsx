import { test, assert } from '@sprucelabs/test-utils'
import { fireEvent, screen } from '@testing-library/react'
import { Edge, Node, ReactFlow, ReactFlowProvider } from '@xyflow/react'
import React from 'react'
import FakeReactFlow, {
    lastFakeReactFlowProps,
} from '../../testDoubles/ui/FakeReactFlow'
import GraphRenderer, { setReactFlowComponent } from '../../ui/GraphRenderer'
import RotatableNode from '../../ui/RotatableNode'
import AbstractPackageTest from '../AbstractPackageTest'

export default class GraphRendererTest extends AbstractPackageTest {
    private static element: React.ReactElement
    private static called: WasCalledByCallbacks

    protected static async beforeEach() {
        await super.beforeEach()

        this.called = {
            onNodeClick: false,
            onNodeMouseEnter: false,
            onNodeMouseLeave: false,
            onEdgeClick: false,
            onEdgeMouseEnter: false,
            onEdgeMouseLeave: false,
        }

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

        const { nodes, edges, nodeTypes } = lastFakeReactFlowProps as any

        assert.isEqualDeep(
            { nodes, edges, nodeTypes },
            {
                nodes: this.oneFakeNodes,
                edges: this.oneFakeEdges,
                nodeTypes: this.nodeTypes,
            },
            'Passed incorrect props to ReactFlow!'
        )
    }

    @test()
    protected static async passesCallbacksToReactFlow() {
        this.render()

        const {
            onNodeClick,
            onNodeMouseEnter,
            onNodeMouseLeave,
            onEdgeClick,
            onEdgeMouseEnter,
            onEdgeMouseLeave,
        } = lastFakeReactFlowProps ?? {}

        const callbacks = [
            {
                name: 'onNodeClick',
                callback: onNodeClick,
            },
            {
                name: 'onNodeMouseEnter',
                callback: onNodeMouseEnter,
            },
            {
                name: 'onNodeMouseLeave',
                callback: onNodeMouseLeave,
            },
            {
                name: 'onEdgeClick',
                callback: onEdgeClick,
            },
            {
                name: 'onEdgeMouseEnter',
                callback: onEdgeMouseEnter,
            },
            {
                name: 'onEdgeMouseLeave',
                callback: onEdgeMouseLeave,
            },
        ]

        callbacks.forEach((cb) => {
            const { callback, name } = cb

            // @ts-ignore
            callback?.({}, this.oneFakeEdges[0])

            assert.isTruthy(
                this.called[name as keyof WasCalledByCallbacks],
                `Callback ${name} should have been called!`
            )
        })
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
    protected static async rendersControls() {
        const control = this.renderAndGetControls()

        assert.isTruthy(
            control,
            'Should render controls as child of ReactFlow!'
        )
    }

    @test()
    protected static async highlightsNodeColorOnMouseEnter() {
        const style = this.renderFireMouseEnterAndGetStyle()

        assert.isEqual(
            style.color,
            'rgb(30, 144, 255)',
            'Should set node color to dodgerblue on hover!'
        )
    }

    @test()
    protected static async highlightsNodeBorderColorOnMouseEnter() {
        const style = this.renderFireMouseEnterAndGetStyle()

        assert.isEqual(
            style.borderColor,
            'dodgerblue',
            'Should set node borderColor to dodgerblue on hover!'
        )
    }

    @test()
    protected static async unhighlightsNodeColorOnMouseLeaveToOriginalColor() {
        const renderedNode = this.renderAndFireMouseEnter()
        fireEvent.mouseLeave(renderedNode)

        const style = window.getComputedStyle(renderedNode)

        assert.isEqual(
            style.color,
            'rgb(0, 0, 0)',
            'Should set node color to black on mouse leave!'
        )

        assert.isEqual(
            style.borderColor,
            'black',
            'Should set node borderColor to black on mouse leave!'
        )
    }

    @test()
    protected static async updatesNodesWhenInitialNodesChange() {
        this.rerenderWithTwoNodesAndEdges()

        const renderedNodes = screen.queryAllByTestId(/rf__node-\d/)

        assert.isEqual(
            renderedNodes.length,
            2,
            'Should render two nodes on screen after rerender!'
        )
    }

    @test()
    protected static async updatesEdgesWhenInitialEdgesChange() {
        this.rerenderWithTwoNodesAndEdges(true)

        const renderedEdges = screen.queryAllByTestId(/^rf__edge-/)

        assert.isEqual(
            renderedEdges.length,
            2,
            'Should render two edges on screen after rerender!'
        )
    }

    @test()
    protected static async doesNotUseOnNodeMouseEnterOnMidlineNodes() {
        // Undesirable coupling with LateralGraphStylizer
        const id1 = 'bottom-midline'
        const id2 = 'top-midline'

        const midlineNode1 = this.generateFakeNode(id1)
        const midlineNode2 = this.generateFakeNode(id2)

        const nodes = [midlineNode1, midlineNode2]

        setReactFlowComponent(ReactFlow)

        this.renderWithProvider(
            <GraphRenderer
                nodes={nodes}
                edges={this.oneFakeEdges}
                onNodeMouseEnter={this.onNodeMouseEnter}
            />
        )

        const renderedNode1 = screen.getByTestId(`rf__node-${id1}`)
        fireEvent.mouseEnter(renderedNode1)

        const renderedNode2 = screen.getByTestId(`rf__node-${id2}`)
        fireEvent.mouseEnter(renderedNode2)

        assert.isFalse(
            this.called.onNodeMouseEnter,
            'Should not call onNodeMouseEnter for midline nodes!'
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

    private static renderAndGetControls() {
        const div = this.renderAndGetTopLevelDiv()
        return div.querySelector('.react-flow__controls')
    }

    private static renderFireMouseEnterAndGetStyle() {
        const renderedNode = this.renderAndFireMouseEnter()
        return window.getComputedStyle(renderedNode)
    }

    private static renderAndFireMouseEnter() {
        this.render(false)

        const renderedNode = screen.getByTestId('rf__node-1')
        fireEvent.mouseEnter(renderedNode)

        return renderedNode
    }

    private static render(useFakeReactFlow = true) {
        const reactflow = useFakeReactFlow ? FakeReactFlow : ReactFlow

        setReactFlowComponent(reactflow)

        return this.renderWithProvider(
            <GraphRenderer
                nodes={this.oneFakeNodes}
                edges={this.oneFakeEdges}
                onNodeClick={this.onNodeClick}
                onNodeMouseEnter={this.onNodeMouseEnter}
                onNodeMouseLeave={this.onNodeMouseLeave}
                onEdgeClick={this.onEdgeClick}
                onEdgeMouseEnter={this.onEdgeMouseEnter}
                onEdgeMouseLeave={this.onEdgeMouseLeave}
            />
        )
    }

    private static rerenderWithTwoNodesAndEdges(useFakeReactFlow = false) {
        const { rerender } = this.render(useFakeReactFlow)

        rerender?.(
            <ReactFlowProvider>
                <GraphRenderer
                    nodes={this.twoFakeNodes}
                    edges={this.twoFakeEdges}
                />
            </ReactFlowProvider>
        )
    }

    private static readonly onNodeClick = () => {
        this.called.onNodeClick = true
    }

    private static readonly onNodeMouseEnter = () => {
        this.called.onNodeMouseEnter = true
    }

    private static readonly onNodeMouseLeave = () => {
        this.called.onNodeMouseLeave = true
    }

    private static readonly onEdgeClick = () => {
        this.called.onEdgeClick = true
    }

    private static readonly onEdgeMouseEnter = () => {
        this.called.onEdgeMouseEnter = true
    }

    private static readonly onEdgeMouseLeave = () => {
        this.called.onEdgeMouseLeave = true
    }

    private static readonly nodeTypes = {
        rotatableNode: RotatableNode,
    }

    private static generateFakeNode(nodeId = '1'): Node {
        return {
            id: nodeId,
            position: { x: 0, y: 0 },
            style: {
                color: 'black',
                borderColor: 'black',
            },
            data: {
                id: nodeId,
                style: {
                    color: 'black',
                    borderColor: 'black',
                },
            },
        }
    }

    private static oneFakeNodes: Node[] = [this.generateFakeNode()]

    private static twoFakeNodes: Node[] = [
        this.generateFakeNode(),
        this.generateFakeNode('2'),
    ]

    private static generateFakeEdge(edgeId = 'e1-2'): Edge {
        return {
            id: edgeId,
            source: edgeId == 'e1-2' ? '1' : '2',
            target: edgeId == 'e1-2' ? '2' : '1',
        } as Edge
    }

    private static oneFakeEdges: Edge[] = [this.generateFakeEdge()]

    private static twoFakeEdges: Edge[] = [
        this.generateFakeEdge(),
        this.generateFakeEdge('e2-1'),
    ]
}

export interface WasCalledByCallbacks {
    onNodeClick: boolean
    onNodeMouseEnter: boolean
    onNodeMouseLeave: boolean
    onEdgeClick: boolean
    onEdgeMouseEnter: boolean
    onEdgeMouseLeave: boolean
}
