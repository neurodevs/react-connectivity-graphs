import { test, assert } from '@sprucelabs/test-utils'
import { act, fireEvent, screen } from '@testing-library/react'
import { ReactFlow, ReactFlowInstance, ReactFlowProvider } from '@xyflow/react'
import React from 'react'
import {
    EnrichedEdge,
    EnrichedNode,
    FakeReactFlow,
    GraphRenderer,
    lastFakeReactFlowProps,
    RotatableNode,
    setReactFlowComponent,
} from '../../exports'
import FakeReactFlowInstance from '../../testDoubles/FakeReactFlowInstance'
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
        fireEvent.mouseLeave(renderedNode)

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

        onInit?.(fakeRfInstance as any)

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
            div.style.display === 'none',
            'Should set "display: none" until isLoaded!'
        )

        lastFakeReactFlowProps?.onInit?.(new FakeReactFlowInstance() as any)
        await this.waitFiveMs()

        this.rerender()

        assert.isTrue(
            div.style.display !== 'none',
            'Should not set "display: none" after isLoaded!'
        )
    }

    @test()
    protected static async clickingToggleSetsColorToDodgerblue() {
        const { toggle } = this.renderAndClickToggle()
        const { color } = window.getComputedStyle(toggle)

        assert.isEqual(
            color,
            'rgb(30, 144, 255)',
            'Should render Abbreviations toggle as dodgerblue when clicked!'
        )
    }

    @test()
    protected static async clickingToggleOpensAbbreviationsModal() {
        const modal = this.renderAndGetAbbreviationsModal()

        assert.isTruthy(
            modal,
            'Should open Abbreviations modal when clicking toggle!'
        )
    }

    @test()
    protected static async abbreviationsModalListsAllNodes() {
        this.renderAndClickToggle()

        this.threeFakeNodes.forEach((node) => {
            const row = screen.getByTestId(`row-${node.id}`)

            assert.isEqual(
                row.textContent,
                `${node.abbreviation}${node.label}`,
                `Should render row for node ${node.id} in modal!`
            )
        })
    }

    @test()
    protected static async abbreviationsModalSortsAlphabetically() {
        this.renderAndClickToggle()

        const rows = screen.queryAllByTestId(/row-\d/)

        const ids = rows.map((row) =>
            row.getAttribute('data-testid')?.replace('row-', '')
        )

        assert.isEqualDeep(ids, ['1', '2', '3'])
    }

    @test()
    protected static async rendersAbbreviationsModalWithId() {
        const modal = this.renderAndGetAbbreviationsModal()

        assert.isEqual(
            modal.id,
            'abbreviations-modal',
            'Should render Abbreviations modal with id!'
        )
    }

    @test()
    protected static async nodeClickDisablesMouseEnter() {
        const { toggle } = this.renderAndClickToggle()

        act(() => {
            fireEvent.mouseEnter(toggle)
        })

        assert.isFalse(
            this.called.onNodeMouseEnter,
            'Should disable onNodeMouseEnter after node click!'
        )
    }

    @test()
    protected static async mouseEnterTwiceIsStillDisabled() {
        const { toggle } = this.renderAndClickToggle()

        act(() => {
            fireEvent.mouseEnter(toggle)
            fireEvent.mouseEnter(toggle)
        })

        assert.isFalse(
            this.called.onNodeMouseEnter,
            'Should disable onNodeMouseEnter until clicked again!'
        )
    }

    @test()
    protected static async nodeClickDisablesMouseLeave() {
        const { toggle } = this.renderAndClickToggle()

        act(() => {
            fireEvent.mouseLeave(toggle)
        })

        assert.isFalse(
            this.called.onNodeMouseLeave,
            'Should disable onNodeMouseLeave after node click!'
        )
    }

    @test()
    protected static async mouseLeaveTwiceIsStillDisabled() {
        const { toggle } = this.renderAndClickToggle()

        act(() => {
            fireEvent.mouseLeave(toggle)
            fireEvent.mouseLeave(toggle)
        })

        assert.isFalse(
            this.called.onNodeMouseLeave,
            'Should disable onNodeMouseLeave until clicked again!'
        )
    }

    @test()
    protected static async clickingTwiceEnablesMouseEnter() {
        const { toggle } = this.renderAndClickToggleTwice()

        act(() => {
            fireEvent.mouseEnter(toggle)
        })

        assert.isTrue(
            this.called.onNodeMouseEnter,
            'Should enable onNodeMouseEnter after two clicks!'
        )
    }

    @test()
    protected static async clickingTwiceEnablesMouseLeave() {
        const { toggle } = this.renderAndClickToggleTwice()

        act(() => {
            fireEvent.mouseLeave(toggle)
        })

        assert.isTrue(
            this.called.onNodeMouseLeave,
            'Should enable onNodeMouseLeave after two clicks!'
        )
    }

    @test()
    protected static async clickingTwiceResetsColorToOriginal() {
        this.renderAndClickToggleTwice()

        const toggle = screen.getByTestId('rf__node-abbreviations-toggle')
        const style = window.getComputedStyle(toggle)

        assert.isEqual(
            style.color,
            'rgb(204, 204, 204)',
            'Should reset color to original after clicking twice!'
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

    private static renderAndClickToggleTwice() {
        const nodes = this.renderAndClickToggle()
        const { toggle } = nodes

        act(() => {
            fireEvent.click(toggle)
        })

        return nodes
    }

    private static renderAndGetAbbreviationsModal() {
        this.renderAndClickToggle()
        return screen.getByTestId('abbreviations-modal')
    }

    private static renderAndClickToggle() {
        const nodes = this.renderWithMidlineNodes()
        const { toggle } = nodes

        act(() => {
            fireEvent.click(toggle)
        })

        return nodes
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
        const toggle = screen.getByTestId(`rf__node-${this.midlineNodes[2].id}`)

        return {
            midlineTop,
            midlineBottom,
            toggle,
        }
    }

    private static generateMidlineNodes() {
        // Undesirable coupling with LateralGraphStylizer
        const id1 = 'bottom-midline'
        const id2 = 'top-midline'
        const id3 = 'abbreviations-toggle'

        const midlineNode1 = this.generateFakeNode(id1)
        const midlineNode2 = this.generateFakeNode(id2)
        const midlineNode3 = this.generateFakeNode(id3)

        this.midlineNodes = [midlineNode1, midlineNode2, midlineNode3]
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
            this.generateFakeNode('1'),
            this.generateFakeNode('2'),
            this.generateFakeNode('3'),
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

    private static generateFakeNode(nodeId = '1', text?: string) {
        const label = `Node ${nodeId}`
        const abbreviation = `N${nodeId}`

        return {
            id: nodeId,
            position: { x: 0, y: 0 },
            label: text ?? label,
            abbreviation: text ?? abbreviation,
            style: {
                color: 'black',
                borderColor: 'black',
            },
            data: {
                id: nodeId,
                label: abbreviation,
                style: {
                    color: 'black',
                    borderColor: 'black',
                },
            },
        } as EnrichedNode
    }

    private static oneFakeNodes: EnrichedNode[] = [this.generateFakeNode()]

    private static twoFakeNodes: EnrichedNode[] = [
        this.generateFakeNode(),
        this.generateFakeNode('2'),
    ]

    private static threeFakeNodes: EnrichedNode[] = [
        this.generateFakeNode('1', 'A'),
        this.generateFakeNode('3', 'C'),
        this.generateFakeNode('2', 'B'),
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
