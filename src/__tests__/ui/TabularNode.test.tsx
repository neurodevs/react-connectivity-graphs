import { assert, generateId, test } from '@sprucelabs/test-utils'
import { Position } from '@xyflow/react'
import React from 'react'
import { fakeHandleProps } from '../../testDoubles/FakeHandle'
import TabularNode, {
    setUseEffectTabular,
    setUseUpdateNodeInternalsTabular,
} from '../../ui/TabularNode'
import AbstractPackageTest from '../AbstractPackageTest'

export default class TabularNodeTest extends AbstractPackageTest {
    private static element: React.ReactElement

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeHandleOnTabular()

        setUseUpdateNodeInternalsTabular(() => {
            return () => {}
        })

        this.element = this.createElement(TabularNode)
    }

    @test()
    protected static async canCreateTabularNode() {
        assert.isTruthy(this.element, 'Should create an instance!')
    }

    @test()
    protected static async rendersDivWithExpectedClassName() {
        const div = this.renderAndGetTopLevelDiv()

        assert.isEqual(
            div.className,
            'tabular-node',
            'Should render div with className="tabular-node"!'
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
        this.render()

        const { position } = fakeHandleProps[0] ?? {}

        assert.isEqual(
            position,
            'left' as Position,
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
        this.render()

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

        setUseUpdateNodeInternalsTabular(useUpdateNodeInternals)

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

        setUseEffectTabular(useEffect)

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
        setUseUpdateNodeInternalsTabular(() => updateNodeInternals)

        const useEffect = (
            fn: React.EffectCallback,
            deps?: React.DependencyList
        ) => {
            passedDeps = deps
            fn()
        }

        setUseEffectTabular(useEffect)

        this.render()

        assert.isEqualDeep(
            passedDeps,
            [this.id, updateNodeInternals],
            'Should pass correct deps to useEffect!'
        )
    }

    @test()
    protected static async passeIdToUpdateNodeInternals() {
        let passedId: string | string[] | undefined

        const updateNodeInternals = (id: string | string[]) => {
            passedId = id
        }
        setUseUpdateNodeInternalsTabular(() => updateNodeInternals)

        this.render()

        assert.isEqual(
            passedId,
            this.id,
            'Should pass id to updateNodeInternals!'
        )
    }

    private static renderAndGetTopLevelDiv() {
        const { getByTestId } = this.render()
        return getByTestId('tabular-node')
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

    private static readonly style = {
        color: 'red',
    }

    private static render() {
        return this.renderWithProvider(
            <TabularNode
                data={{
                    id: this.id,
                    label: this.label,
                    style: this.style,
                }}
            />
        )
    }
}
