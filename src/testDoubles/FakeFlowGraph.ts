import { FlowGraph, FlowGraphOptions, EnrichedGraph } from '../exports'

export default class FakeFlowGraph implements FlowGraph {
    public static callsToConstructor: FlowGraphOptions[] = []
    public static numCallsToRender = 0

    public constructor(options: FlowGraphOptions) {
        FakeFlowGraph.callsToConstructor.push(options)
    }

    public toJson() {
        FakeFlowGraph.numCallsToRender++
        return {} as EnrichedGraph
    }

    public static resetTestDouble() {
        FakeFlowGraph.callsToConstructor = []
        FakeFlowGraph.numCallsToRender = 0
    }
}
