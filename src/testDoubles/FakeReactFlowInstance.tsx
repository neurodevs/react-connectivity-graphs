import { FitViewOptions } from '@xyflow/react'

export default class FakeReactFlowInstance {
    public passedFitViewOptions?: FitViewOptions

    public fitView(options?: FitViewOptions) {
        this.passedFitViewOptions = options
    }
}
