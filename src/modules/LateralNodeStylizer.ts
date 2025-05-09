export default class LateralNodeStylizer {
    public static Class?: NodeStylizerConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}
export interface NodeStylizer {}

export type NodeStylizerConstructor = new () => NodeStylizer
