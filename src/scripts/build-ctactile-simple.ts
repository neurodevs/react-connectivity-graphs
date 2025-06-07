import fs from 'fs'
import path from 'path'
import LateralFlowGraph from '../modules/LateralFlowGraph'

const graph = LateralFlowGraph.Create({
    nodes: [
        {
            id: '1',
            label: 'C-Tactile Receptor',
            abbreviation: 'CT-R',
        },
        {
            id: '2',
            label: 'Dorsal Root Ganglion',
            abbreviation: 'DRG',
        },
        {
            id: '3',
            label: 'Spinal Cord Lamina I/II',
            abbreviation: 'SpI/II',
        },
        {
            id: '4',
            label: 'Ventromedial Posterior Nucleus of Thalamus',
            abbreviation: 'VMpo',
        },
        {
            id: '5',
            label: 'Posterior Insular Cortex',
            abbreviation: 'pIC',
        },
        {
            id: '6',
            label: 'Middle Insular Cortex',
            abbreviation: 'mIC',
        },
        {
            id: '7',
            label: 'Anterior Insular Cortex',
            abbreviation: 'aIC',
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
            side: 'contralateral',
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
    ],
})

const props = graph.toJson()

const outPath = path.join(process.cwd(), 'public/dist', 'ctactile-simple.json')
fs.writeFileSync(outPath, JSON.stringify(props, null, 2))

console.log(`✅ Wrote graph props to ${outPath}`)
