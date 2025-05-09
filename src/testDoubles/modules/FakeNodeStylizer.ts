import { NodeStylizer } from '../../exports'

export default class FakeNodeStylizer implements NodeStylizer {
    public static numCallsToConstructor = 0

    public constructor() {
        FakeNodeStylizer.numCallsToConstructor++
    }

    public static resetTestDouble() {
        this.numCallsToConstructor = 0
    }
}
