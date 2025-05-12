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
    protected static async returnsEnrichedNodes() {
        const { nodes } = this.instance.enrich(this.twoSimpleNodes, [])
        assert.isEqualDeep(nodes, this.enrichedNodes)
    }

    @test()
    protected static async returnsEnrichedEdges() {
        const { edges } = this.instance.enrich([], this.twoSimpleEdges)
        assert.isEqualDeep(edges, this.enrichedEdges)
    }

    private static enrichedNodes = this.stylizeNodes()
    private static enrichedEdges = this.stylizeEdges()

    private static stylizeNodes() {
        return this.twoSimpleNodes.map((node) => ({
            ...node,
            type: 'rotatableNode',
            position: { x: 100, y: 100 },
            data: {
                id: node.id,
                label: node.abbreviation,
                sourcePosition: 'left',
                targetPosition: 'right',
                style: {
                    width: 500,
                    fontSize: '0.7em',
                    fontWeight: 100,
                    color: '#404040',
                    borderStyle: 'solid',
                    borderColor: 'lightgray',
                    backgroundColor: '#eee',
                },
            },
        }))
    }

    private static stylizeEdges() {
        return this.twoSimpleEdges.map((edge) => ({
            ...edge,
            animated: true,
            style: {
                stroke: 'lightgray',
                strokeWidth: 0.5,
            },
        }))
    }

    protected static LateralGraphStylizer() {
        return LateralGraphStylizer.Create()
    }
}
