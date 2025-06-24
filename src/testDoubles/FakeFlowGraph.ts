import { LateralFlowGraphProps, EnrichedGraph } from '../exports'

export default class FakeFlowGraph {
    public static callsToConstructor: LateralFlowGraphProps[] = []
    public static numCallsToRender = 0

    public constructor(options: LateralFlowGraphProps) {
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
