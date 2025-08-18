import { FitViewOptions } from 'reactflow'

export default class FakeReactFlowInstance {
    public passedFitViewOptions?: FitViewOptions

    public fitView(options?: FitViewOptions) {
        this.passedFitViewOptions = options
    }
}
