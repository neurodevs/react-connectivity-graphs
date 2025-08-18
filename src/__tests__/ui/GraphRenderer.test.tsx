import { test, assert } from '@sprucelabs/test-utils'
import { act, fireEvent, screen } from '@testing-library/react'
import { ReactFlow, ReactFlowInstance, ReactFlowProvider } from '@xyflow/react'
import React from 'react'
import FakeReactFlow, {
    lastFakeReactFlowProps,
} from '../../testDoubles/FakeReactFlow'
import FakeReactFlowInstance from '../../testDoubles/FakeReactFlowInstance'
import GraphRenderer, { setReactFlowComponent } from '../../ui/GraphRenderer'
import { EnrichedEdge, EnrichedNode } from '../../ui/LateralFlowGraph'
import PreformattedNode from '../../ui/PreformattedNode'
import RotatableNode from '../../ui/RotatableNode'
import AbstractPackageTest from '../AbstractPackageTest'

export default class GraphRendererTest extends AbstractPackageTest {
    private static element: React.ReactElement
    private static called: WasCalledByCallbacks
    private static readonly highlightStrColor = 'dodgerblue'
    private static readonly highlightRgbColor = 'rgb(30, 144, 255)'
    private static midlineNodes: EnrichedNode[] = []

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

        const { nodes, edges, nodeTypes } = lastFakeReactFlowProps ?? {}

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
                name: 'onNodeMouseEnter',
                callback: onNodeMouseEnter,
            },
            {
                name: 'onNodeMouseLeave',
                callback: onNodeMouseLeave,
            },
            {
                name: 'onNodeClick',
                callback: onNodeClick,
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
        this.render({ useFakeReactFlow: false })

        const renderedNodes = screen.queryAllByTestId(/rf__node-\d/)

        assert.isEqual(
            renderedNodes.length,
            1,
            'Should render one node on screen!'
        )
    }

    @test()
    protected static async doesNotRenderControlsByDefault() {
        const control = this.renderAndGetControls()
        assert.isFalsy(control, 'Should not render controls by default!')
    }

    @test()
    protected static async providesOptionToEnableControls() {
        const control = this.renderAndGetControls({ showControls: true })

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
            this.highlightRgbColor,
            `Should set node color to ${this.highlightStrColor} on hover!`
        )
    }

    @test()
    protected static async highlightsNodeBorderColorOnMouseEnter() {
        const style = this.renderFireMouseEnterAndGetStyle()

        assert.isEqual(
            style.borderColor,
            this.highlightStrColor,
            `Should set node borderColor to ${this.highlightStrColor} on hover!`
        )
    }

    @test()
    protected static async decreasesFontSizeOnMouseEnter() {
        const style = this.renderFireMouseEnterAndGetStyle()

        assert.isEqual(
            style.fontSize,
            '0.8rem',
            `Should set node fontSize to 0.8rem on hover!`
        )
    }

    @test()
    protected static async increasesFontSizeOnMouseLeave() {
        const node = this.renderAndFireMouseEnter()

        this.fireMouseLeave(node)

        const style = window.getComputedStyle(node)

        assert.isEqual(
            style.fontSize,
            '0.9rem',
            `Should set node fontSize to 0.9rem off hover!`
        )
    }

    @test()
    protected static async disablesPanOnDrag() {
        this.render()

        assert.isFalse(
            lastFakeReactFlowProps?.panOnDrag as boolean,
            'Should set panOnDrag to false on ReactFlow!'
        )
    }

    @test()
    protected static async disablesPanOnScroll() {
        this.render()

        assert.isFalse(
            lastFakeReactFlowProps?.panOnScroll as boolean,
            'Should set panOnScroll to false on ReactFlow!'
        )
    }

    @test()
    protected static async disablesZoomOnPinch() {
        this.render()

        assert.isFalse(
            lastFakeReactFlowProps?.zoomOnPinch as boolean,
            'Should set zoomOnPinch to false on ReactFlow!'
        )
    }

    @test()
    protected static async disablesZoomOnScroll() {
        this.render()

        assert.isFalse(
            lastFakeReactFlowProps?.zoomOnScroll as boolean,
            'Should set zoomOnScroll to false on ReactFlow!'
        )
    }

    @test()
    protected static async unhighlightsNodeColorOnMouseLeaveToOriginalColor() {
        const renderedNode = this.renderAndFireMouseEnter()

        act(() => {
            fireEvent.mouseLeave(renderedNode)
        })

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
        this.rerender()

        const renderedNodes = screen.queryAllByTestId(/rf__node-\d/)

        assert.isEqual(
            renderedNodes.length,
            2,
            'Should render two nodes on screen after rerender!'
        )
    }

    @test()
    protected static async updatesEdgesWhenInitialEdgesChange() {
        this.rerender(true)

        const renderedEdges = screen.queryAllByTestId(/^rf__edge-/)

        assert.isEqual(
            renderedEdges.length,
            2,
            'Should render two edges on screen after rerender!'
        )
    }

    @test()
    protected static async doesNotUseOnNodeMouseEnterOnMidlineNodes() {
        const { midlineTop, midlineBottom } = this.renderWithMidlineNodes()

        act(() => {
            fireEvent.mouseEnter(midlineTop)
            fireEvent.mouseEnter(midlineBottom)
        })

        assert.isFalse(
            this.called.onNodeMouseEnter,
            'Should not call onNodeMouseEnter for midline nodes!'
        )
    }

    @test()
    protected static async doesNotUseOnNodeMouseLeaveOnMidlineNodes() {
        const { midlineTop, midlineBottom } = this.renderWithMidlineNodes()

        act(() => {
            fireEvent.mouseLeave(midlineTop)
            fireEvent.mouseLeave(midlineBottom)
        })

        assert.isFalse(
            this.called.onNodeMouseLeave,
            'Should not call onNodeMouseLeave for midline nodes!'
        )
    }

    @test()
    protected static async highlightsConnectedNodesOnMouseEnter() {
        this.renderThreeNodesFireMouseEnter()

        const node2 = screen.getByTestId('rf__node-2')
        const node3 = screen.getByTestId('rf__node-3')

        const style2 = window.getComputedStyle(node2)
        const style3 = window.getComputedStyle(node3)

        assert.isTrue(
            style2.color === this.highlightRgbColor &&
                style3.color === this.highlightRgbColor &&
                style2.borderColor === this.highlightStrColor &&
                style3.borderColor === this.highlightStrColor,
            'Should highlight connected nodes color on mouse enter!'
        )
    }

    @test.skip('No edge data-testid in test env')
    protected static async highlightsConnectedEdgesOnMouseEnter() {
        this.renderThreeNodesFireMouseEnter()

        const edges = screen.getAllByTestId(/^rf__edge/)

        const style1 = window.getComputedStyle(edges[0])
        const style2 = window.getComputedStyle(edges[1])

        assert.isTrue(
            style1.stroke === this.highlightRgbColor &&
                style2.stroke === this.highlightRgbColor,
            `Should highlight connected edges color on mouse enter!\n\nstyle1.stroke: ${style1.stroke}\n\nstyle2.stroke:${style2.stroke}`
        )
    }

    @test()
    protected static async highlightSwapsAbbreviationForLabelInNodes() {
        this.renderThreeNodesFireMouseEnter()

        const node1 = screen.getByTestId('rf__node-1')
        const node2 = screen.getByTestId('rf__node-2')
        const node3 = screen.getByTestId('rf__node-3')

        assert.isTrue(
            node1.textContent?.includes('Node 1') &&
                node2.textContent?.includes('Node 2') &&
                node3.textContent?.includes('Node 3'),
            'Should render label when highlighted!'
        )
    }

    @test()
    protected static async unhighlightSwapsLabelForAbbreviationInNodes() {
        const renderedNode = this.renderThreeNodesFireMouseEnter()

        this.fireMouseLeave(renderedNode)

        const node1 = screen.getByTestId('rf__node-1')
        const node2 = screen.getByTestId('rf__node-2')
        const node3 = screen.getByTestId('rf__node-3')

        assert.isTrue(
            node1.textContent?.includes('N1') &&
                node2.textContent?.includes('N2') &&
                node3.textContent?.includes('N3'),
            'Should render abbreviation when not highlighted!'
        )
    }

    @test()
    protected static async fitsViewOnInitialRender() {
        this.render()

        const { onInit } = lastFakeReactFlowProps ?? {}
        assert.isFunction(onInit, 'Should pass onInit callback to ReactFlow!')

        const fakeRfInstance = new FakeReactFlowInstance()

        onInit?.(fakeRfInstance as ReactFlowInstance)

        await new Promise((resolve) => setTimeout(resolve, 5))

        this.rerender()

        assert.isEqualDeep(
            fakeRfInstance.passedFitViewOptions,
            {
                padding: 0.2,
                minZoom: 1,
            },
            'Should pass fitView options to ReactFlow instance!'
        )
    }

    @test()
    protected static async setsDisplayNoneUntilIsLoaded() {
        const div = this.renderAndGetTopLevelDiv()

        assert.isTrue(
            div.style.visibility === 'hidden',
            'Should set "visibility: hidden" until isLoaded!'
        )

        lastFakeReactFlowProps?.onInit?.(
            new FakeReactFlowInstance() as ReactFlowInstance
        )
        await this.waitFiveMs()

        this.rerender()

        assert.isTrue(
            div.style.display !== 'none',
            'Should not set "visibility: hidden" after isLoaded!'
        )
    }

    @test()
    protected static async exposesMinZoomProp() {
        const expected = Math.random()

        this.render({ minZoom: expected })

        const fake = await this.simulateRfInstance()

        assert.isEqual(
            fake.passedFitViewOptions?.minZoom,
            expected,
            'Should pass minZoom prop!'
        )
    }

    @test()
    protected static async exposesViewPaddingProp() {
        const expected = Math.random()

        this.render({ viewPadding: expected })

        const fake = await this.simulateRfInstance()

        assert.isEqual(
            fake.passedFitViewOptions?.padding,
            expected,
            'Should pass viewPadding prop!'
        )
    }

    private static async simulateRfInstance() {
        const fake = new FakeReactFlowInstance()

        const { onInit } = lastFakeReactFlowProps ?? {}
        onInit?.(fake as ReactFlowInstance)
        await this.waitFiveMs()

        return fake
    }

    private static renderWithMidlineNodes() {
        this.generateMidlineNodes()

        setReactFlowComponent(ReactFlow)

        this.renderWithProvider(
            <GraphRenderer
                nodes={[...this.threeFakeNodes, ...this.midlineNodes]}
                edges={this.oneFakeEdges}
                onNodeMouseEnter={this.onNodeMouseEnter}
                onNodeMouseLeave={this.onNodeMouseLeave}
            />
        )

        const midlineTop = screen.getByTestId(
            `rf__node-${this.midlineNodes[0].id}`
        )
        const midlineBottom = screen.getByTestId(
            `rf__node-${this.midlineNodes[1].id}`
        )

        return {
            midlineTop,
            midlineBottom,
        }
    }

    private static generateMidlineNodes() {
        // Undesirable coupling with LateralGraphStylizer
        const id1 = 'bottom-midline'
        const id2 = 'top-midline'

        const midlineNode1 = this.generateEnrichedNode(id1)
        const midlineNode2 = this.generateEnrichedNode(id2)

        this.midlineNodes = [midlineNode1, midlineNode2]
    }

    private static createRenderer() {
        return this.createElement(GraphRenderer)
    }

    private static renderAndGetReactFlow() {
        const div = this.renderAndGetTopLevelDiv()
        return div.querySelector('.react-flow')
    }

    private static renderAndGetControls(options?: RenderOptions) {
        const div = this.renderAndGetTopLevelDiv(options)
        return div.querySelector('.react-flow__controls')
    }

    private static renderAndGetTopLevelDiv(options?: RenderOptions) {
        const { getByTestId } = this.render(options)
        return getByTestId('graph-renderer')
    }

    private static renderThreeNodesFireMouseEnter() {
        const nodes = [
            this.generateEnrichedNode('1'),
            this.generateEnrichedNode('2'),
            this.generateEnrichedNode('3'),
        ]

        const edges = [
            this.generateFakeEdge('e1-2'),
            this.generateFakeEdge('e3-1'),
        ]

        return this.renderAndFireMouseEnter(nodes, edges)
    }

    private static renderFireMouseEnterAndGetStyle() {
        const renderedNode = this.renderAndFireMouseEnter()
        return window.getComputedStyle(renderedNode)
    }

    private static renderAndFireMouseEnter(
        nodes?: EnrichedNode[],
        edges?: EnrichedEdge[]
    ) {
        this.render({ useFakeReactFlow: false, nodes, edges })

        const renderedNode = screen.getByTestId('rf__node-1')

        act(() => {
            fireEvent.mouseEnter(renderedNode)
        })

        return renderedNode
    }

    private static fireMouseLeave(renderedNode: HTMLElement) {
        act(() => {
            fireEvent.mouseLeave(renderedNode)
        })
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
        preformattedNode: PreformattedNode,
    }

    private static oneFakeNodes: EnrichedNode[] = [this.generateEnrichedNode()]

    private static twoFakeNodes: EnrichedNode[] = [
        this.generateEnrichedNode(),
        this.generateEnrichedNode('2'),
    ]

    private static generateFakeEdge(edgeId = 'e1-2') {
        const [source, target] = edgeId.replace(/^e/, '').split('-')

        return {
            id: edgeId,
            source,
            target,
            style: {
                stroke: 'black',
            },
        } as EnrichedEdge
    }

    private static oneFakeEdges: EnrichedEdge[] = [this.generateFakeEdge()]

    private static twoFakeEdges: EnrichedEdge[] = [
        this.generateFakeEdge(),
        this.generateFakeEdge('e2-1'),
    ]

    private static async waitFiveMs() {
        await new Promise((resolve) => setTimeout(resolve, 5))
    }

    private static render(options?: RenderOptions) {
        const {
            useFakeReactFlow = true,
            nodes,
            edges,
            minZoom,
            viewPadding,
            showControls,
        } = options ?? {}

        const reactflow = useFakeReactFlow ? FakeReactFlow : ReactFlow

        setReactFlowComponent(reactflow)

        return this.renderWithProvider(
            <GraphRenderer
                nodes={nodes ?? this.oneFakeNodes}
                edges={edges ?? this.oneFakeEdges}
                onNodeClick={this.onNodeClick}
                onNodeMouseEnter={this.onNodeMouseEnter}
                onNodeMouseLeave={this.onNodeMouseLeave}
                onEdgeClick={this.onEdgeClick}
                onEdgeMouseEnter={this.onEdgeMouseEnter}
                onEdgeMouseLeave={this.onEdgeMouseLeave}
                minZoom={minZoom}
                viewPadding={viewPadding}
                showControls={showControls}
            />
        )
    }

    private static rerender(
        useFakeReactFlow = false,
        nodes?: EnrichedNode[],
        edges?: EnrichedEdge[]
    ) {
        const { rerender } = this.render({ useFakeReactFlow, nodes, edges })

        rerender?.(
            <ReactFlowProvider>
                <GraphRenderer
                    nodes={nodes ?? this.twoFakeNodes}
                    edges={edges ?? this.twoFakeEdges}
                />
            </ReactFlowProvider>
        )
    }
}

export interface RenderOptions {
    useFakeReactFlow?: boolean
    nodes?: EnrichedNode[]
    edges?: EnrichedEdge[]
    minZoom?: number
    viewPadding?: number
    showControls?: boolean
}

export interface WasCalledByCallbacks {
    onNodeClick: boolean
    onNodeMouseEnter: boolean
    onNodeMouseLeave: boolean
    onEdgeClick: boolean
    onEdgeMouseEnter: boolean
    onEdgeMouseLeave: boolean
}
