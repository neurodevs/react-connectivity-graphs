import { assert, generateId, test } from '@sprucelabs/test-utils'
import React from 'react'
import { Position } from 'reactflow'
import { fakeHandleProps } from '../../testDoubles/FakeHandle'
import RotatableNode, {
    setUseEffectRotatable,
    setUseUpdateNodeInternalsRotatable,
} from '../../ui/RotatableNode'
import AbstractPackageTest from '../AbstractPackageTest'

export default class RotatableNodeTest extends AbstractPackageTest {
    private static element: React.ReactElement

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeHandleOnRotatable()

        setUseUpdateNodeInternalsRotatable(() => {
            return () => {}
        })

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
        this.render('left')

        const { type } = fakeHandleProps[0] ?? {}
        assert.isEqual(type, 'target', 'Should render a target handle!')
    }

    @test()
    protected static async rendersTargetHandleAsNotConnectable() {
        this.render('left')

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
            'Should pass label to element!'
        )
    }

    @test()
    protected static async rendersElementWithAriaLabel() {
        const div = this.renderAndGetTopLevelDiv()

        assert.isEqual(
            div.ariaLabel,
            this.label,
            'Should pass aria-label to element!'
        )
    }

    @test()
    protected static async rendersElementWithPassedStyle() {
        const div = this.renderAndGetTopLevelDiv()

        assert.isEqualDeep(
            this.extractInlineStyles(div.style),
            this.style,
            'Should pass style to element!'
        )
    }

    @test()
    protected static async rendersReactflowSourceHandle() {
        this.render('left')

        const { type } = fakeHandleProps[1] ?? {}
        assert.isEqual(type, 'source', 'Should render a source handle!')
    }

    @test()
    protected static async rendersSourceHandleAsNotConnectable() {
        this.render('left')

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

    @test()
    protected static async updatesNodeInternalsToAllowRotation() {
        let calledUseUpdateNodeInternals = false

        const useUpdateNodeInternals = () => {
            calledUseUpdateNodeInternals = true
            return () => {}
        }

        setUseUpdateNodeInternalsRotatable(useUpdateNodeInternals)

        this.render()

        assert.isTrue(
            calledUseUpdateNodeInternals,
            'Should call useUpdateNodeInternals()!'
        )
    }

    @test()
    protected static async usesEffectToUpdateNodeInternalsForRotation() {
        let calledUseEffect = false

        const useEffect = (fn: React.EffectCallback) => {
            calledUseEffect = true
            fn()
        }

        setUseEffectRotatable(useEffect)

        this.render()

        assert.isTrue(
            calledUseEffect,
            'Should call useEffect() to update node internals!'
        )
    }

    @test()
    protected static async passesCorrectDepsToUseEffect() {
        let passedDeps: React.DependencyList | undefined

        const updateNodeInternals = () => {}
        setUseUpdateNodeInternalsRotatable(() => updateNodeInternals)

        const useEffect = (
            fn: React.EffectCallback,
            deps?: React.DependencyList
        ) => {
            passedDeps = deps
            fn()
        }

        setUseEffectRotatable(useEffect)

        this.render()

        assert.isEqualDeep(
            passedDeps,
            [this.id, this.transform, updateNodeInternals],
            'Should pass correct deps to useEffect!'
        )
    }

    @test()
    protected static async passeIdToUpdateNodeInternals() {
        let passedId: string | string[] | undefined

        const updateNodeInternals = (id: string | string[]) => {
            passedId = id
        }
        setUseUpdateNodeInternalsRotatable(() => updateNodeInternals)

        this.render()

        assert.isEqual(
            passedId,
            this.id,
            'Should pass id to updateNodeInternals!'
        )
    }

    private static renderAndGetTopLevelDiv() {
        const { getByTestId } = this.render('left')
        return getByTestId('rotatable-node')
    }

    private static extractInlineStyles(style: CSSStyleDeclaration) {
        const result: Record<string, string> = {}

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < style.length; i++) {
            const key = style[i]
            result[key] = style.getPropertyValue(key)
        }

        return result
    }

    private static readonly id = generateId()
    private static readonly label = generateId()
    private static readonly transform = generateId()

    private static readonly style = {
        transform: this.transform,
    }

    private static render(position: 'left' | 'right' = 'left') {
        return this.renderWithProvider(
            <RotatableNode
                data={{
                    id: this.id,
                    label: this.label,
                    style: this.style,
                    targetPosition: position as Position,
                    sourcePosition: position as Position,
                }}
            />
        )
    }
}
