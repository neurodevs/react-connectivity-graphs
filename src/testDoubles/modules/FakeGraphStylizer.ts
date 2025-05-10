import { SimpleEdge, SimpleNode } from '../../modules/LateralFlowGraph'
import {
    EnrichedGraph,
    GraphStylizer,
} from '../../modules/LateralGraphStylizer'

export default class FakeGraphStylizer implements GraphStylizer {
    public static numCallsToConstructor = 0
    public static callsToEnrich: CallToEnrich[] = []

    public constructor() {
        FakeGraphStylizer.numCallsToConstructor++
    }

    public enrich(nodes: SimpleNode[], edges: SimpleEdge[]) {
        FakeGraphStylizer.callsToEnrich.push({ nodes, edges })
        return {} as EnrichedGraph
    }

    public static resetTestDouble() {
        this.numCallsToConstructor = 0
    }
}

export interface CallToEnrich {
    nodes: SimpleNode[]
    edges: SimpleEdge[]
}
