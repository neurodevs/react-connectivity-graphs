import AbstractSpruceTest, { generateId } from '@sprucelabs/test-utils'
import { render } from '@testing-library/react'
import React from 'react'
import { ReactFlowProvider } from 'reactflow'
import { SimpleEdge, SimpleNode } from '../modules/LateralFlowGraph'

export default class AbstractPackageTest extends AbstractSpruceTest {
    protected static simpleNodes: SimpleNode[] = this.generateSimpleNodes(2)
    protected static simpleEdges: SimpleEdge[] = this.generateSimpleEdges(2)

    protected static async beforeEach() {
        await super.beforeEach()
    }

    private static generateSimpleNodes(n: number) {
        return Array.from({ length: n }, () => this.generateSimpleNode())
    }

    protected static generateSimpleNode() {
        return {
            id: generateId(),
            label: generateId(),
            abbreviation: generateId(),
        } as SimpleNode
    }

    protected static generateSimpleEdges(n: number) {
        return Array.from({ length: n }, () => this.generateSimpleEdge())
    }

    protected static generateSimpleEdge() {
        return {
            id: generateId(),
            source: generateId(),
            target: generateId(),
        } as SimpleEdge
    }

    protected static renderWithProvider(element: React.ReactElement) {
        return render(<ReactFlowProvider>{element}</ReactFlowProvider>)
    }

    protected static get createElement() {
        return React.createElement
    }
}
