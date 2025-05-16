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
        {
            id: '4',
            label: 'Node 4',
            abbreviation: 'N4',
        },
        {
            id: '5',
            label: 'Node 5',
            abbreviation: 'N5',
        },
        {
            id: '6',
            label: 'Node 6',
            abbreviation: 'N6',
        },
        {
            id: '7',
            label: 'Node 7',
            abbreviation: 'N7',
        },
        {
            id: '8',
            label: 'Node 8',
            abbreviation: 'N8',
        },
        {
            id: '9',
            label: 'Node 9',
            abbreviation: 'N9',
        },
        {
            id: '10',
            label: 'Node 10',
            abbreviation: 'N10',
        },
    ],
    edges: [
        {
            id: 'e1-2',
            source: '1',
            target: '2',
            side: 'ipsilateral',
        },
        {
            id: 'e2-3',
            source: '2',
            target: '3',
            side: 'ipsilateral',
        },
        {
            id: 'e3-4',
            source: '3',
            target: '4',
            side: 'ipsilateral',
        },
        {
            id: 'e4-5',
            source: '4',
            target: '5',
            side: 'ipsilateral',
        },
        {
            id: 'e5-6',
            source: '5',
            target: '6',
            side: 'ipsilateral',
        },
        {
            id: 'e6-7',
            source: '6',
            target: '7',
            side: 'ipsilateral',
        },
        {
            id: 'e7-8',
            source: '7',
            target: '8',
            side: 'ipsilateral',
        },
        {
            id: 'e8-9',
            source: '8',
            target: '9',
            side: 'ipsilateral',
        },
        {
            id: 'e9-10',
            source: '9',
            target: '10',
            side: 'ipsilateral',
        },
    ],
})

const props = graph.toJson()

const outPath = path.join(process.cwd(), 'public/dist', 'graph-data.json')
fs.writeFileSync(outPath, JSON.stringify(props, null, 2))

console.log(`✅ Wrote graph props to ${outPath}`)
