import { test, assert } from '@sprucelabs/test-utils'
import LateralGraphStylizer, {
    GraphStylizer,
} from '../../modules/LateralGraphStylizer'
import AbstractPackageTest from '../AbstractPackageTest'

export default class LateralGraphStylizerTest extends AbstractPackageTest {
    private static instance: GraphStylizer

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.LateralGraphStylizer()
    }

    @test()
    protected static async createsLateralGraphStylizer() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    @test()
    protected static async returnsEnrichedEdges() {
        const { edges } = this.instance.enrich([], this.simpleEdges)

        assert.isEqualDeep(edges, this.enrichedEdges)
    }

    private static readonly simpleEdges = [
        this.generateSimpleEdge(),
        this.generateSimpleEdge(),
    ]

    private static readonly enrichedEdges = this.simpleEdges.map((edge) => ({
        ...edge,
        animated: true,
        style: {
            stroke: 'lightgray',
            strokeWidth: 0.5,
        },
    }))

    protected static LateralGraphStylizer() {
        return LateralGraphStylizer.Create()
    }
}
