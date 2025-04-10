import { FlowGraph, FlowGraphOptions } from '../components/LateralFlowGraph'

export default class FakeFlowGraph implements FlowGraph {
    public static callsToConstructor: FlowGraphOptions[] = []
    public static numCallsToRender = 0

    public constructor(options: FlowGraphOptions) {
        FakeFlowGraph.callsToConstructor.push(options)
    }

    public render() {
        FakeFlowGraph.numCallsToRender++
        return {} as React.ReactElement
    }

    public static resetTestDouble() {
        FakeFlowGraph.callsToConstructor = []
        FakeFlowGraph.numCallsToRender = 0
    }
}
