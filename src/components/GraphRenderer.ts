export default class GraphRenderer implements Renderer {
    public static Class?: RendererConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface Renderer {}

export type RendererConstructor = new () => Renderer
