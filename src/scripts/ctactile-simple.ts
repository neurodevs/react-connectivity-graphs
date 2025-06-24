export default {
    nodes: [
        {
            id: '1',
            label: 'C-tactile receptor',
            abbreviation: 'CT-R',
        },
        {
            id: '2',
            label: 'Dorsal root ganglion',
            abbreviation: 'DRG',
        },
        {
            id: '3',
            label: 'Spinal cord lamina I/II',
            abbreviation: 'SpI/II',
        },
        {
            id: '4',
            label: 'Ventromedial posterior nucleus',
            abbreviation: 'VMpo',
        },
        {
            id: '5',
            label: 'Dorsal posterior insula',
            abbreviation: 'dpIC',
        },
        {
            id: '6',
            label: 'Mid insula',
            abbreviation: 'mIC',
        },
        {
            id: '7',
            label: 'Anterior insula',
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
}
