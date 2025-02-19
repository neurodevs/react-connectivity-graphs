import { buildErrorSchema } from '@sprucelabs/schema'

export default buildErrorSchema({
    id: 'edgesWithoutNodes',
    name: 'EDGES_WITHOUT_NODES',
    fields: {
        numEdges: {
            type: 'number',
            isRequired: true,
        },
    },
})
