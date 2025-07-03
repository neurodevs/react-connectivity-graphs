import AbstractSpruceTest, { generateId } from '@sprucelabs/test-utils'
import { render } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import React from 'react'
import FakeHandle, { resetFakeHandleProps } from '../testDoubles/FakeHandle'
import FakeReactFlow, {
    resetFakeReactFlowProps,
} from '../testDoubles/FakeReactFlow'
import FakeReactFlowProvider, {
    resetProviderWasCreated,
} from '../testDoubles/FakeReactFlowProvider'
import { SimpleNode, SimpleEdge, LateralizedEdge } from '../types'
import { setProviderComponentApp } from '../ui/App'
import { setReactFlowComponent } from '../ui/GraphRenderer'
import { EnrichedNode } from '../ui/LateralFlowGraph'
import { setHandlePre } from '../ui/PreformattedNode'
import { setHandleComponentRotatable } from '../ui/RotatableNode'

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
        setProviderComponentApp(
            FakeReactFlowProvider as typeof ReactFlowProvider
        )
        resetProviderWasCreated()
    }

    protected static setFakeReactFlow() {
        setReactFlowComponent(FakeReactFlow)
        resetFakeReactFlowProps()
    }

    protected static setFakeHandleOnRotatable() {
        setHandleComponentRotatable(FakeHandle)
        resetFakeHandleProps()
    }

    protected static setFakeHandleOnPre() {
        setHandlePre(FakeHandle)
        resetFakeHandleProps()
    }

    protected static formatNodeTestId(nodeId: string) {
        return `rf__node-${nodeId}`
    }

    protected static generateSimpleNodes(n: number) {
        return Array.from({ length: n }, () => this.generateSimpleNode())
    }

    protected static threeFakeNodes: EnrichedNode[] = [
        this.generateEnrichedNode('1', 'Node 1'),
        this.generateEnrichedNode('2', 'Node 2'),
        this.generateEnrichedNode('3', 'Node 3'),
    ]

    protected static generateEnrichedNode(nodeId = '1', text?: string) {
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
