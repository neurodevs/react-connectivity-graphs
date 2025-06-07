import { test, assert } from '@sprucelabs/test-utils'
import { SimpleEdge } from '../../modules/LateralFlowGraph'
import LateralGraphStylizer, {
    EnrichedEdge,
    EnrichedNode,
    GraphStylizer,
    Side,
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
        const { nodes } = this.instance.lateralize(this.simpleNodes, [])
        assert.isEqualDeep(nodes, this.enrichedNodes)
    }

    @test()
    protected static async returnsEnrichedEdges() {
        const { edges } = this.instance.lateralize([], this.simpleEdges)
        assert.isEqualDeep(edges, this.enrichedEdges)
    }

    private static enrichedNodes = this.stylizeNodes()
    private static enrichedEdges = this.stylizeEdges()

    private static stylizeNodes() {
        return [...this.mapSimpleNodes('left'), ...this.mapSimpleNodes('right')]
    }

    private static mapSimpleNodes(side: 'left' | 'right' = 'left') {
        const onLeftSide = side == 'left'

        const invertedSide = onLeftSide ? 'right' : 'left'
        const flex = onLeftSide ? 'flex-end' : 'flex-start'

        const graphRadius = 350

        const radiusBottomDegrees = 90
        const gapDegrees = 40
        const degreesPerSide = 180 - gapDegrees
        const degreesPerNode = degreesPerSide / (this.numNodes - 1)

        return this.simpleNodes.map((node, idx) => {
            const sign = onLeftSide ? 1 : -1
            const startDegrees = radiusBottomDegrees + (gapDegrees / 2) * sign
            const degrees = startDegrees + degreesPerNode * idx * sign
            const radians = (Math.PI * degrees) / 180

            const positionX = graphRadius * Math.cos(radians)
            const positionY = graphRadius * Math.sin(radians)

            const sidedId = `${node.id}-${side}`

            return {
                ...node,
                id: sidedId,
                type: 'rotatableNode',
                position: { x: positionX, y: positionY },
                data: {
                    id: sidedId,
                    label: `${node.abbreviation}`,
                    sourcePosition: invertedSide,
                    targetPosition: invertedSide,
                    style: {
                        width: 500,
                        fontFamily: 'sans-serif',
                        fontSize: '0.9em',
                        fontWeight: 100,
                        color: '#777',
                        borderWidth: `0 ${onLeftSide ? '1.5px' : 0} 0 ${onLeftSide ? 0 : '1.5px'}`,
                        padding: `6px ${onLeftSide ? '12px' : 0} 6px ${onLeftSide ? 0 : '12px'}`,
                        borderStyle: 'solid',
                        borderColor: '#888',
                        backgroundColor: 'transparent',
                        textAlign: onLeftSide ? 'right' : 'left',
                        justifyContent: flex,
                        WebkitJustifyContent: flex,
                        transform: `
                            translateX(${positionX.toFixed(1)}px) 
                            translateY(${positionY.toFixed(1)}px) 
                            rotate(${onLeftSide ? degrees + 180 : degrees}deg) 
                        `,
                    },
                },
            }
        }) as EnrichedNode[]
    }

    private static stylizeEdges() {
        return [...this.mapSimpleEdges('left'), ...this.mapSimpleEdges('right')]
    }

    private static mapSimpleEdges(side: 'left' | 'right') {
        return this.simpleEdges.flatMap((edge) => {
            switch (edge.side) {
                case 'ipsilateral':
                    return [this.enrichEdge(edge, side, side)]
                case 'contralateral':
                    return [this.enrichEdge(edge, side, this.opposite(side))]
                case 'bilateral':
                    return [
                        this.enrichEdge(edge, side, side),
                        this.enrichEdge(edge, side, this.opposite(side)),
                    ]
            }
        })
    }

    private static enrichEdge(
        edge: SimpleEdge,
        sourceSide: Side,
        targetSide: Side
    ) {
        return {
            ...edge,
            id: `${edge.id}-${sourceSide}-${targetSide}`,
            source: `${edge.source}-${sourceSide}`,
            target: `${edge.target}-${targetSide}`,
            animated: true,
            style: {
                stroke: 'lightgray',
                strokeWidth: 1.5,
            },
        } as EnrichedEdge
    }

    private static opposite(side: Side) {
        return side === 'left' ? 'right' : 'left'
    }

    private static get numNodes() {
        return this.simpleNodes.length
    }

    protected static LateralGraphStylizer() {
        return LateralGraphStylizer.Create()
    }
}
