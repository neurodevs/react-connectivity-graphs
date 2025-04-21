import { assert, generateId, test } from '@sprucelabs/test-utils'
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

        this.setFakeHandle()

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
    protected static async rendersReactflowTargetHandle() {
        this.render()

        const { type } = fakeHandleProps[0] ?? {}
        assert.isEqual(type, 'target', 'Should render a target handle!')
    }

    @test()
    protected static async rendersTargetHandleAsNotConnectable() {
        this.render()

        const { isConnectable } = fakeHandleProps[0] ?? {}

        assert.isFalse(
            isConnectable,
            'Target handle should not be connectable!'
        )
    }

    @test()
    protected static async rendersTargetHandleWithPassedPosition() {
        this.render('right')

        const { position } = fakeHandleProps[0] ?? {}

        assert.isEqual(
            position,
            'right' as Position,
            'Should pass position to target handle!'
        )
    }

    @test()
    protected static async rendersElementWithPassedLabel() {
        const div = this.renderAndGetTopLevelDiv()

        assert.isEqual(
            div.textContent,
            this.label,
            'Should pass label to source handle!'
        )
    }

    @test()
    protected static async rendersReactflowSourceHandle() {
        this.render()

        const { type } = fakeHandleProps[1] ?? {}
        assert.isEqual(type, 'source', 'Should render a source handle!')
    }

    @test()
    protected static async rendersSourceHandleAsNotConnectable() {
        this.render()

        const { isConnectable } = fakeHandleProps[1] ?? {}

        assert.isFalse(
            isConnectable,
            'Source handle should not be connectable!'
        )
    }

    @test()
    protected static async rendersSourceHandleWithPassedPosition() {
        this.render('right')

        const { position } = fakeHandleProps[1] ?? {}

        assert.isEqual(
            position,
            'right' as Position,
            'Should pass position to source handle!'
        )
    }

    @test()
    protected static async rendersTargetHandleBeforeSource() {
        const div = this.renderAndGetTopLevelDiv()

        const targetHandle = div.querySelector('div[data-type="target"]')
        const sourceHandle = div.querySelector('div[data-type="source"]')

        const expectedOrder = [targetHandle, sourceHandle]

        assert.isEqualDeep(
            Array.from(div.children),
            expectedOrder,
            'Should render target handle before source!'
        )
    }

    private static setFakeHandle() {
        setHandleComponent(FakeHandle)
        resetFakeHandleProps()
    }

    private static renderAndGetTopLevelDiv() {
        const { getByTestId } = this.render()
        return getByTestId('rotatable-node')
    }

    private static readonly label = generateId()

    private static render(position = 'left') {
        return render(
            <ReactFlowProvider>
                {/* @ts-ignore - minimal props for tests */}
                <RotatableNode
                    data={{
                        label: this.label,
                    }}
                    targetPosition={position as Position}
                    sourcePosition={position as Position}
                />
            </ReactFlowProvider>
        )
    }
}
