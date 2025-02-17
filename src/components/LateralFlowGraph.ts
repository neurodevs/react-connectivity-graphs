import { assertOptions } from '@sprucelabs/schema'

export default class LateralFlowGraph implements FlowGraph {
    public static Class?: FlowGraphConstructor

    protected constructor() {}

    public static Create(network: Network) {
        assertOptions({ network }, ['network'])
        return new (this.Class ?? this)()
    }

    public renderJsx() {
        return '<></>'
    }
}

export interface FlowGraph {
    renderJsx(): string
}

export type FlowGraphConstructor = new () => FlowGraph

export interface Network {}
