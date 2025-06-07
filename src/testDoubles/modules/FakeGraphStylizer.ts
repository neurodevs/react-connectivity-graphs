import {
    LateralizedEdge,
    SimpleEdge,
    SimpleNode,
} from '../../modules/LateralFlowGraph'
import LateralGraphStylizer, {
    GraphStylizer,
} from '../../modules/LateralGraphStylizer'

export default class FakeGraphStylizer implements GraphStylizer {
    public static numCallsToConstructor = 0
    public static callsToLateralize: CallToLateralize[] = []
    public realStylizer!: GraphStylizer

    public constructor() {
        FakeGraphStylizer.numCallsToConstructor++

        this.createRealStylizer()
    }

    private createRealStylizer() {
        const CurrentClass = LateralGraphStylizer.Class
        delete LateralGraphStylizer.Class

        this.realStylizer = LateralGraphStylizer.Create()

        LateralGraphStylizer.Class = CurrentClass
    }

    public lateralize(nodes: SimpleNode[], edges: LateralizedEdge[]) {
        FakeGraphStylizer.callsToLateralize.push({ nodes, edges })
        return this.realStylizer.lateralize(nodes, edges)
    }

    public static resetTestDouble() {
        this.numCallsToConstructor = 0
    }
}

export interface CallToLateralize {
    nodes: SimpleNode[]
    edges: SimpleEdge[]
}
