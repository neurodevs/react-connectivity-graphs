import { assert, test } from '@sprucelabs/test-utils'
import { render } from '@testing-library/react'
import React from 'react'
import RotatableNode from '../../components/RotatableNode'
import AbstractPackageTest from '../AbstractPackageTest'

export default class RotatableNodeTest extends AbstractPackageTest {
    private static element: React.ReactElement

    protected static async beforeEach() {
        await super.beforeEach()

        this.element = this.createElement(RotatableNode)
    }

    @test()
    protected static async canCreateRotatableNode() {
        assert.isTruthy(this.element, 'Should create an instance!')
    }

    @test()
    protected static async rendersDivWithExpectedClassName() {
        const div = this.renderAndGetTopLevelDiv()

        assert.isEqual(
            div.className,
            'rotatable-node',
            'Should render div with className="rotatable-node"!'
        )
    }

    private static renderAndGetTopLevelDiv() {
        const { getByTestId } = this.render()
        return getByTestId('rotatable-node')
    }

    private static render() {
        return render(<RotatableNode />)
    }
}
