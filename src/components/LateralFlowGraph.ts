import { assertOptions } from '@sprucelabs/schema'

export default class LateralFlowGraph implements FlowGraph {
    public static Class?: FlowGraphConstructor

    protected constructor() {}

    public static Create(options: FlowGraphOptions) {
        assertOptions(options, ['nodes', 'edges'])
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

export interface FlowGraphOptions {
    nodes: Node[]
    edges: Edge[]
}

export interface Node {}

export interface Edge {}
