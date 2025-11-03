import generateId from '@neurodevs/generate-id'
import { assert, test } from '@neurodevs/node-tdd'
import { Position } from '@xyflow/react'
import React from 'react'

import { fakeHandleProps } from '../../testDoubles/FakeHandle.js'
import PreformattedNode, {
    setUseEffectPre,
    setUseUpdateNodeInternalsPre,
} from '../../ui/PreformattedNode.js'
import AbstractPackageTest from '../AbstractPackageTest.js'

export default class PreforamttedNodeTest extends AbstractPackageTest {
    private static element: React.ReactElement
    private static label = generateId()

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeHandleOnPre()

        setUseUpdateNodeInternalsPre(() => {
            return () => {}
        })

        this.element = this.createElement(PreformattedNode)
    }

    @test()
    protected static async canCreatePreformattedNode() {
        assert.isTruthy(this.element, 'Should create an instance!')
    }

    @test()
    protected static async rendersDivWithExpectedClassName() {
        const div = this.renderAndGetTopLevelDiv()

        assert.isEqual(
            div.className,
            'preformatted-node',
            'Should render div with className="preformatted-node"!'
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
    protected static async rendersElementWithPassedTable() {
        const div = this.renderAndGetTopLevelDiv()

        assert.isEqual(
            div.textContent,
            `Column 1Column 2${this.label}Data 2`,
            'Should pass label to element!'
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

        const actual = Array.from(div.children)

        assert.isEqualDeep(
            [actual[0], actual[2]],
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

        setUseUpdateNodeInternalsPre(useUpdateNodeInternals)

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

        setUseEffectPre(useEffect)

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
        setUseUpdateNodeInternalsPre(() => updateNodeInternals)

        const useEffect = (
            fn: React.EffectCallback,
            deps?: React.DependencyList
        ) => {
            passedDeps = deps
            fn()
        }

        setUseEffectPre(useEffect)

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
        setUseUpdateNodeInternalsPre(() => updateNodeInternals)

        this.render()

        assert.isEqual(
            passedId,
            this.id,
            'Should pass id to updateNodeInternals!'
        )
    }

    private static renderAndGetTopLevelDiv() {
        const { getByTestId } = this.render()
        return getByTestId('preformatted-node')
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
    private static readonly style = { color: 'red' }

    private static readonly table = (
        <table>
            <thead>
                <tr>
                    <th>Column 1</th>
                    <th>Column 2</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{this.label}</td>
                    <td>Data 2</td>
                </tr>
            </tbody>
        </table>
    )

    private static render() {
        return this.renderWithProvider(
            <PreformattedNode
                data={{
                    id: this.id,
                    preContents: this.table,
                    style: this.style,
                }}
            />
        )
    }
}
