import AbstractSpruceTest from '@sprucelabs/test-utils'
import { render } from '@testing-library/react'
import React from 'react'
import { ReactFlowProvider } from 'reactflow'

export default class AbstractPackageTest extends AbstractSpruceTest {
    protected static async beforeEach() {
        await super.beforeEach()
    }

    protected static renderWithProvider(element: React.ReactElement) {
        return render(<ReactFlowProvider>{element}</ReactFlowProvider>)
    }

    protected static get createElement() {
        return React.createElement
    }
}
