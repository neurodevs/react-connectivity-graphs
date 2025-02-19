import { SchemaRegistry } from '@sprucelabs/schema'
import { SpruceErrors } from '../errors.types'



const edgesWithoutNodesSchema: SpruceErrors.ReactConnectivityGraphs.EdgesWithoutNodesSchema  = {
	id: 'edgesWithoutNodes',
	namespace: 'ReactConnectivityGraphs',
	name: 'EDGES_WITHOUT_NODES',
	    fields: {
	            /** . */
	            'numEdges': {
	                type: 'number',
	                isRequired: true,
	                options: undefined
	            },
	    }
}

SchemaRegistry.getInstance().trackSchema(edgesWithoutNodesSchema)

export default edgesWithoutNodesSchema
