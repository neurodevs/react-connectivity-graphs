import { GraphEdge, GraphNode } from '../../modules/LateralFlowGraph'
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

    public enrich(nodes: GraphNode[], edges: GraphEdge[]) {
        FakeGraphStylizer.callsToEnrich.push({ nodes, edges })
        return {} as EnrichedGraph
    }

    public static resetTestDouble() {
        this.numCallsToConstructor = 0
    }
}

export interface CallToEnrich {
    nodes: GraphNode[]
    edges: GraphEdge[]
}
