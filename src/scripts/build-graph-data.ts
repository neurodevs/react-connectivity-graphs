import fs from 'fs'
import path from 'path'
import LateralFlowGraph from '../modules/LateralFlowGraph'

const graph = LateralFlowGraph.Create({
    nodes: [
        {
            id: '1',
            type: 'rotatableNode',
            data: { label: 'Node 1' },
            position: { x: 100, y: 100 },
            style: {
                width: 500,
                fontSize: '0.7em',
                fontWeight: 100,
                color: '#404040',
                borderStyle: 'solid',
                borderColor: 'lightgray',
                borderWidth: `1px`,
                padding: `6px`,
                backgroundColor: '#eee',
            },
        },
        {
            id: '2',
            type: 'rotatableNode',
            data: { label: 'Node 2' },
            position: { x: 200, y: 200 },
            style: {
                width: 500,
                fontSize: '0.7em',
                fontWeight: 100,
                color: '#404040',
                borderStyle: 'solid',
                borderColor: 'lightgray',
                borderWidth: `1px`,
                padding: `6px`,
                backgroundColor: '#eee',
            },
        },
    ],
    edges: [
        {
            id: 'e1-2',
            source: '1',
            target: '2',
            style: {
                stroke: 'lightgray',
                strokeWidth: 0.5,
            },
        },
        {
            id: 'e2-1',
            source: '2',
            target: '1',
            style: {
                stroke: 'lightgray',
                strokeWidth: 0.5,
            },
        },
    ],
})

const props = graph.toJson()

const outPath = path.join(process.cwd(), 'public/dist', 'graph-data.json')
fs.writeFileSync(outPath, JSON.stringify(props, null, 2))

console.log(`✅ Wrote graph props to ${outPath}`)
