import LateralFlowGraph, {
    FlowGraphOptions,
} from '../components/LateralFlowGraph'

export default class SpyLateralFlowGraph extends LateralFlowGraph {
    public constructor(options: FlowGraphOptions) {
        super(options)
    }

    public getOnNodeClick() {
        return this.onNodeClick
    }

    public getOnNodeMouseEnter() {
        return this.onNodeMouseEnter
    }

    public getOnNodeMouseLeave() {
        return this.onNodeMouseLeave
    }

    public getOnEdgeCallback() {
        return this.onEdgeClick
    }
}
