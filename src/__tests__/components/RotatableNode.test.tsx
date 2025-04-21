import { assert, test } from '@sprucelabs/test-utils'
import { render } from '@testing-library/react'
import React from 'react'
import { Position, ReactFlowProvider } from 'reactflow'
import RotatableNode, {
    setHandleComponent,
} from '../../components/RotatableNode'
import FakeHandle, {
    fakeHandleProps,
    resetFakeHandleProps,
} from '../../testDoubles/FakeHandle'
import AbstractPackageTest from '../AbstractPackageTest'

export default class RotatableNodeTest extends AbstractPackageTest {
    private static element: React.ReactElement

    protected static async beforeEach() {
        await super.beforeEach()

        setHandleComponent(FakeHandle)
        resetFakeHandleProps()

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

    @test()
    protected static async rendersTargetHandle() {
        this.render()

        const { type } = fakeHandleProps[0] ?? {}
        assert.isEqual(type, 'target', 'Should render a target handle!')
    }

    @test()
    protected static async rendersReactflowTargetHandleWithCorrectPosition() {
        this.render()

        const { isConnectable } = fakeHandleProps[0] ?? {}

        assert.isFalse(
            isConnectable,
            'Target handle should not be connectable!'
        )
    }

    @test()
    protected static async rendersTargetHandleWithCorrectPosition() {
        this.render('right')

        const { position } = fakeHandleProps[0] ?? {}

        assert.isEqual(
            position,
            'right' as Position,
            'Should pass position to target handle!'
        )
    }

    @test()
    protected static async rendersSourceHandle() {
        this.render()

        const { type } = fakeHandleProps[0] ?? {}
        assert.isEqual(type, 'target', 'Should render a target handle!')
    }

    private static renderAndGetTopLevelDiv() {
        const { getByTestId } = this.render()
        return getByTestId('rotatable-node')
    }

    private static render(targetPosition = 'left') {
        return render(
            <ReactFlowProvider>
                {/* @ts-ignore - minimal props for tests */}
                <RotatableNode targetPosition={targetPosition as Position} />
            </ReactFlowProvider>
        )
    }
}
