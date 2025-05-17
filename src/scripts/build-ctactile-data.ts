import fs from 'fs'
import path from 'path'
import LateralFlowGraph from '../modules/LateralFlowGraph'

const graph = LateralFlowGraph.Create({
    nodes: [
        {
            id: '1',
            label: 'Calf C-Tactile Receptors',
            abbreviation: 'Calf CT',
        },
        {
            id: '4',
            label: 'Lumbar Dorsal Root Ganglia',
            abbreviation: 'Lumbar DRG',
        },
        {
            id: '7',
            label: 'Lumbar Spinal Lamina I/II',
            abbreviation: 'Lumbar SpI/II',
        },
        {
            id: '2',
            label: 'Forearm C-Tactile Receptors',
            abbreviation: 'Forearm CT',
        },
        {
            id: '5',
            label: 'Cervical Dorsal Root Ganglia',
            abbreviation: 'Cervical DRG',
        },
        {
            id: '8',
            label: 'Cervical Spinal Lamina I/II',
            abbreviation: 'Cervical SpI/II',
        },
        {
            id: '3',
            label: 'Cheek C-Tactile Receptors',
            abbreviation: 'Cheek CT',
        },
        {
            id: '6',
            label: 'Trigeminal Ganglia',
            abbreviation: 'Trigeminal G',
        },
        {
            id: '9',
            label: 'Spinal Trigeminal Nucleus, Caudal Part',
            abbreviation: 'Sp5C',
        },
        {
            id: '10',
            label: 'Parabrachaial Nuclei',
            abbreviation: 'PBN',
        },
        {
            id: '11',
            label: 'Ventromedial Posterior Nucleus of Thalamus',
            abbreviation: 'VMpo',
        },
        {
            id: '12',
            label: 'Ventromedial Basal Nucleus of Thalamus',
            abbreviation: 'VMb',
        },
        {
            id: '13',
            label: 'Insular Dorsal Fundus Posterior',
            abbreviation: 'Idfp',
        },
        {
            id: '14',
            label: 'Insular Dorsal Fundus anterior',
            abbreviation: 'Idfa',
        },
        {
            id: '15',
            label: 'Posterior Insular Cortex',
            abbreviation: 'post-IC',
        },
        {
            id: '16',
            label: 'Middle Insular Cortex',
            abbreviation: 'mid-IC',
        },
        {
            id: '17',
            label: 'Dorsal Anterior Insular Cortex',
            abbreviation: 'dAIC',
        },
        {
            id: '18',
            label: 'Ventral Anterior Insular Cortex',
            abbreviation: 'vAIC',
        },
        {
            id: '19',
            label: 'Anterior Midcingulate Cortex',
            abbreviation: 'aMCC',
        },
        {
            id: '20',
            label: 'Posterior Midcingulate Cortex',
            abbreviation: 'pMCC',
        },
    ],
    edges: [
        {
            id: 'e1-4',
            source: '1',
            target: '4',
            side: 'ipsilateral',
        },
        {
            id: 'e2-5',
            source: '2',
            target: '5',
            side: 'ipsilateral',
        },
        {
            id: 'e3-6',
            source: '3',
            target: '6',
            side: 'ipsilateral',
        },
        {
            id: 'e4-7',
            source: '4',
            target: '7',
            side: 'ipsilateral',
        },
        {
            id: 'e5-8',
            source: '5',
            target: '8',
            side: 'ipsilateral',
        },
        {
            id: 'e6-9',
            source: '6',
            target: '9',
            side: 'ipsilateral',
        },
        {
            id: 'e7-10',
            source: '7',
            target: '10',
            side: 'contralateral',
        },
        {
            id: 'e7-11',
            source: '7',
            target: '11',
            side: 'contralateral',
        },
        {
            id: 'e8-10',
            source: '8',
            target: '10',
            side: 'contralateral',
        },
        {
            id: 'e8-11',
            source: '8',
            target: '11',
            side: 'contralateral',
        },
        {
            id: 'e9-10',
            source: '7',
            target: '8',
            side: 'ipsilateral',
        },
        {
            id: 'e9-11',
            source: '9',
            target: '11',
            side: 'contralateral',
        },
        {
            id: 'e9-10',
            source: '9',
            target: '10',
            side: 'ipsilateral',
        },
        {
            id: 'e10-12',
            source: '10',
            target: '12',
            side: 'ipsilateral',
        },
        {
            id: 'e11-13',
            source: '11',
            target: '13',
            side: 'ipsilateral',
        },
        {
            id: 'e12-14',
            source: '12',
            target: '14',
            side: 'ipsilateral',
        },
        {
            id: 'e13-15',
            source: '13',
            target: '15',
            side: 'ipsilateral',
        },
        {
            id: 'e14-16',
            source: '14',
            target: '16',
            side: 'ipsilateral',
        },
        {
            id: 'e14-17',
            source: '14',
            target: '17',
            side: 'ipsilateral',
        },
        {
            id: 'e15-16',
            source: '15',
            target: '16',
            side: 'ipsilateral',
        },
        {
            id: 'e16-16',
            source: '16',
            target: '16',
            side: 'contralateral',
        },
        {
            id: 'e16-18',
            source: '16',
            target: '18',
            side: 'ipsilateral',
        },
        {
            id: 'e17-16',
            source: '17',
            target: '16',
            side: 'ipsilateral',
        },
        {
            id: 'e17-18',
            source: '17',
            target: '18',
            side: 'ipsilateral',
        },
        {
            id: 'e18-19',
            source: '18',
            target: '19',
            side: 'ipsilateral',
        },
        {
            id: 'e18-20',
            source: '18',
            target: '20',
            side: 'ipsilateral',
        },
        {
            id: 'e19-20',
            source: '19',
            target: '20',
            side: 'ipsilateral',
        },
    ],
})

const props = graph.toJson()

const outPath = path.join(process.cwd(), 'public/dist', 'ctactile-data.json')
fs.writeFileSync(outPath, JSON.stringify(props, null, 2))

console.log(`✅ Wrote graph props to ${outPath}`)
