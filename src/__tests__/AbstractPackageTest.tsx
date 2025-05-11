import AbstractSpruceTest, { generateId } from '@sprucelabs/test-utils'
import { render } from '@testing-library/react'
import React from 'react'
import { ReactFlowProvider } from 'reactflow'

export default class AbstractPackageTest extends AbstractSpruceTest {
    protected static async beforeEach() {
        await super.beforeEach()
    }

    protected static generateSimpleNode() {
        return {
            id: generateId(),
            label: generateId(),
            abbreviation: generateId(),
        }
    }

    protected static generateSimpleEdge() {
        return { id: generateId(), source: generateId(), target: generateId() }
    }

    protected static renderWithProvider(element: React.ReactElement) {
        return render(<ReactFlowProvider>{element}</ReactFlowProvider>)
    }

    protected static get createElement() {
        return React.createElement
    }
}
