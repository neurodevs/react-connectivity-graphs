import fs from 'fs'
import path from 'path'
import LateralFlowGraph from '../modules/LateralFlowGraph'

const graph = LateralFlowGraph.Create({
    nodes: [
        {
            id: '1',
            label: 'Node 1',
            abbreviation: 'N1',
        },
        {
            id: '2',
            label: 'Node 2',
            abbreviation: 'N2',
        },
        {
            id: '3',
            label: 'Node 3',
            abbreviation: 'N3',
        },
    ],
    edges: [
        {
            id: 'e1-2',
            source: '1',
            target: '2',
        },
        {
            id: 'e2-3',
            source: '2',
            target: '3',
        },
    ],
})

const props = graph.toJson()

const outPath = path.join(process.cwd(), 'public/dist', 'graph-data.json')
fs.writeFileSync(outPath, JSON.stringify(props, null, 2))

console.log(`✅ Wrote graph props to ${outPath}`)
