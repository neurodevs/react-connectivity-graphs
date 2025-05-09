export default class LateralGraphStylizer {
    public static Class?: GraphStylizerConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}
export interface GraphStylizer {}

export type GraphStylizerConstructor = new () => GraphStylizer
