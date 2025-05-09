import { GraphStylizer } from '../../modules/LateralGraphStylizer'

export default class FakeGraphStylizer implements GraphStylizer {
    public static numCallsToConstructor = 0

    public constructor() {
        FakeGraphStylizer.numCallsToConstructor++
    }

    public static resetTestDouble() {
        this.numCallsToConstructor = 0
    }
}
