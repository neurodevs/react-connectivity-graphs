import fs from 'fs'
import path from 'path'
import { LateralFlowGraph } from '../exports'

const graph = LateralFlowGraph.Create({
    nodes: [
        {
            id: '1',
            label: 'Calf C-Tactile Receptors',
            abbreviation: 'Calf CT',
        },
        {
            id: '7',
            label: 'Lumbar Spinal Lamina 1-2',
            abbreviation: 'Lumbar Sp1-2',
        },
        {
            id: '23',
            label: 'Calf Aß Receptors',
            abbreviation: 'Calf Aß',
        },
        {
            id: '24',
            label: 'Lumbar Spinal Lamina 3-5',
            abbreviation: 'Lumbar Sp3-5',
        },
        {
            id: '33',
            label: 'Lumbar Spinal Lamina 8-9',
            abbreviation: 'Lumbar Sp8-9',
        },
        {
            id: '2',
            label: 'Forearm C-Tactile Receptors',
            abbreviation: 'Forearm CT',
        },
        {
            id: '8',
            label: 'Cervical Spinal Lamina 1-2',
            abbreviation: 'Cervical Sp1-2',
        },
        {
            id: '25',
            label: 'Forearm Aß Receptors',
            abbreviation: 'Forearm Aß',
        },
        {
            id: '26',
            label: 'Cervical Spinal Lamina 3-5',
            abbreviation: 'Cervical Sp3-5',
        },
        {
            id: '34',
            label: 'Cervical Spinal Lamina 8-9',
            abbreviation: 'Cervical Sp8-9',
        },
        {
            id: '3',
            label: 'Cheek C-Tactile Receptors',
            abbreviation: 'Cheek CT',
        },
        {
            id: '9',
            label: 'Spinal Trigeminal Nucleus, Caudal Part',
            abbreviation: 'Sp5C',
        },
        {
            id: '27',
            label: 'Cheek Aß Receptors',
            abbreviation: 'Cheek Aß',
        },
        {
            id: '28',
            label: 'Principal Sensory Nucleus of Trigeminal Nerve',
            abbreviation: 'Pr5',
        },
        {
            id: '35',
            label: 'Facial Motor Nucleus',
            abbreviation: 'FMN',
        },
        {
            id: '10',
            label: 'Parabrachaial Nuclei',
            abbreviation: 'PBN',
        },
        {
            id: '11',
            label: 'Ventromedial Posterior Thalamic Nucleus',
            abbreviation: 'VMpo',
        },
        {
            id: '12',
            label: 'Ventromedial Basal Thalamic Nucleus',
            abbreviation: 'VMb',
        },
        {
            id: '13',
            label: 'Ventral Posterolateral Thalamic Nucleus',
            abbreviation: 'VPL',
        },
        {
            id: '14',
            label: 'Ventral Posteromedial Thalamic Nucleus',
            abbreviation: 'VPM',
        },
        {
            id: '21',
            label: 'Primary Somatosensory Cortex',
            abbreviation: 'S1',
        },
        {
            id: '22',
            label: 'Secondary Somatosensory Cortex',
            abbreviation: 'S2',
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
            id: '29',
            label: 'Presupplementary Motor Area',
            abbreviation: 'preSMA',
        },
        {
            id: '20',
            label: 'Posterior Midcingulate Cortex',
            abbreviation: 'pMCC',
        },
        {
            id: '30',
            label: 'Supplementary Motor Area',
            abbreviation: 'SMA',
        },
        {
            id: '31',
            label: 'Primary Motor Cortex',
            abbreviation: 'M1',
        },
    ],
    edges: [
        {
            id: 'e1-7',
            source: '1',
            target: '7',
            side: 'ipsilateral',
        },
        {
            id: 'e2-8',
            source: '2',
            target: '8',
            side: 'ipsilateral',
        },
        {
            id: 'e3-6',
            source: '3',
            target: '6',
            side: 'ipsilateral',
        },
        {
            id: 'e3-9',
            source: '3',
            target: '9',
            side: 'ipsilateral',
        },
        {
            id: 'e4-7',
            source: '4',
            target: '7',
            side: 'ipsilateral',
        },
        {
            id: 'e4-24',
            source: '4',
            target: '24',
            side: 'ipsilateral',
        },
        {
            id: 'e5-8',
            source: '5',
            target: '8',
            side: 'ipsilateral',
        },
        {
            id: 'e5-26',
            source: '5',
            target: '26',
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
            id: 'e7-8',
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
            id: 'e11-15',
            source: '11',
            target: '15',
            side: 'ipsilateral',
        },
        {
            id: 'e12-16',
            source: '12',
            target: '16',
            side: 'ipsilateral',
        },
        {
            id: 'e13-21',
            source: '13',
            target: '21',
            side: 'ipsilateral',
        },
        {
            id: 'e14-21',
            source: '14',
            target: '21',
            side: 'ipsilateral',
        },
        {
            id: 'e15-15',
            source: '15',
            target: '15',
            side: 'ipsilateral',
        },
        {
            id: 'e16-16',
            source: '16',
            target: '16',
            side: 'ipsilateral',
        },
        {
            id: 'e16-17',
            source: '16',
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
            id: 'e17-17',
            source: '17',
            target: '17',
            side: 'contralateral',
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
        {
            id: 'e19-29',
            source: '19',
            target: '29',
            side: 'ipsilateral',
        },
        {
            id: 'e20-30',
            source: '20',
            target: '30',
            side: 'ipsilateral',
        },
        {
            id: 'e21-22',
            source: '21',
            target: '22',
            side: 'ipsilateral',
        },
        {
            id: 'e21-31',
            source: '21',
            target: '31',
            side: 'ipsilateral',
        },
        {
            id: 'e22-16',
            source: '22',
            target: '16',
            side: 'ipsilateral',
        },
        {
            id: 'e23-24',
            source: '23',
            target: '24',
            side: 'ipsilateral',
        },
        {
            id: 'e24-13',
            source: '24',
            target: '13',
            side: 'contralateral',
        },
        {
            id: 'e25-26',
            source: '25',
            target: '26',
            side: 'ipsilateral',
        },
        {
            id: 'e26-13',
            source: '26',
            target: '13',
            side: 'contralateral',
        },
        {
            id: 'e27-6',
            source: '27',
            target: '6',
            side: 'ipsilateral',
        },
        {
            id: 'e27-28',
            source: '27',
            target: '28',
            side: 'ipsilateral',
        },
        {
            id: 'e28-14',
            source: '28',
            target: '14',
            side: 'contralateral',
        },
        {
            id: 'e29-30',
            source: '29',
            target: '30',
            side: 'ipsilateral',
        },
        {
            id: 'e30-31',
            source: '30',
            target: '31',
            side: 'ipsilateral',
        },
        {
            id: 'e31-33',
            source: '31',
            target: '33',
            side: 'contralateral',
        },
        {
            id: 'e31-34',
            source: '31',
            target: '34',
            side: 'contralateral',
        },
        {
            id: 'e31-35',
            source: '31',
            target: '35',
            side: 'contralateral',
        },
    ],
})

const props = graph.toJson()

const outPath = path.join(process.cwd(), 'public/dist', 'ctactile-data.json')
fs.writeFileSync(outPath, JSON.stringify(props, null, 2))

console.log(`✅ Wrote graph props to ${outPath}`)
