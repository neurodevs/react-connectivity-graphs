import { SimpleEdge, SimpleNode } from '../../modules/LateralFlowGraph'
import LateralGraphStylizer, {
    GraphStylizer,
} from '../../modules/LateralGraphStylizer'

export default class FakeGraphStylizer implements GraphStylizer {
    public static numCallsToConstructor = 0
    public static callsToEnrich: CallToEnrich[] = []
    public realStylizer: GraphStylizer

    public constructor() {
        FakeGraphStylizer.numCallsToConstructor++

        delete LateralGraphStylizer.Class
        this.realStylizer = LateralGraphStylizer.Create()
    }

    public enrich(nodes: SimpleNode[], edges: SimpleEdge[]) {
        FakeGraphStylizer.callsToEnrich.push({ nodes, edges })
        return this.realStylizer.enrich(nodes, edges)
    }

    public static resetTestDouble() {
        this.numCallsToConstructor = 0
    }
}

export interface CallToEnrich {
    nodes: SimpleNode[]
    edges: SimpleEdge[]
}
