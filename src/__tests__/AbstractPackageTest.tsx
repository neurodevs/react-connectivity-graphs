import AbstractSpruceTest, { generateId } from '@sprucelabs/test-utils'
import { render } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import React from 'react'
import {
    FakeReactFlowProvider,
    resetProviderWasCreated,
    LateralGraphStylizer,
    FakeGraphStylizer,
    setHandleComponent,
    FakeHandle,
    resetFakeHandleProps,
    LateralizedEdge,
    setProviderComponent,
    SimpleEdge,
    SimpleNode,
    FakeGraphRenderer,
    setRendererComponent,
    resetFakeGraphRendererProps,
} from '../exports'

export default class AbstractPackageTest extends AbstractSpruceTest {
    protected static simpleNodes: SimpleNode[] = this.generateSimpleNodes(2)

    protected static simpleEdges: SimpleEdge[] = [
        this.generateSimpleEdge(0),
        this.generateSimpleEdge(1),
    ]

    protected static async beforeEach() {
        await super.beforeEach()
    }

    protected static setFakeReactFlowProvider() {
        setProviderComponent(FakeReactFlowProvider as typeof ReactFlowProvider)
        resetProviderWasCreated()
    }

    protected static setFakeGraphRenderer() {
        setRendererComponent(FakeGraphRenderer)
        resetFakeGraphRendererProps()
    }

    protected static setFakeGraphStylizer() {
        LateralGraphStylizer.Class = FakeGraphStylizer
        FakeGraphStylizer.resetTestDouble()
    }

    protected static setFakeHandle() {
        setHandleComponent(FakeHandle)
        resetFakeHandleProps()
    }

    protected static generateSimpleNodes(n: number) {
        return Array.from({ length: n }, () => this.generateSimpleNode())
    }

    protected static generateSimpleNode() {
        return {
            id: generateId(),
            label: generateId(),
            abbreviation: generateId(),
        } as SimpleNode
    }

    protected static generateSimpleEdge(idx: 0 | 1) {
        const sourceNodeIdx = idx === 0 ? 0 : 1
        const sourceId = this.simpleNodes[sourceNodeIdx].id

        const targetNodeIdx = idx === 0 ? 1 : 0
        const targetId = this.simpleNodes[targetNodeIdx].id

        return {
            id: generateId(),
            source: sourceId,
            target: targetId,
        } as SimpleEdge
    }

    protected static get lateralizedEdges() {
        return this.simpleEdges.map((edge) => ({
            ...edge,
            side: 'ipsilateral',
        })) as LateralizedEdge[]
    }

    protected static renderWithProvider(element: React.ReactElement) {
        return render(<ReactFlowProvider>{element}</ReactFlowProvider>)
    }

    protected static get createElement() {
        return React.createElement
    }
}
