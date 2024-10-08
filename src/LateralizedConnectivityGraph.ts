import { assertOptions } from '@sprucelabs/schema'

export default class LateralizedConnectivityGraph implements Graph {
    public static Class?: GraphConstructor

    protected constructor() {}

    public static Create(network: Network) {
        assertOptions({ network }, ['network'])
        return new (this.Class ?? this)()
    }
}

export interface Graph {}

export type GraphConstructor = new () => Graph

export interface Network {}
