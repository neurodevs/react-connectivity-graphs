import { default as SchemaEntity } from '@sprucelabs/schema'
import * as SpruceSchema from '@sprucelabs/schema'





export declare namespace SpruceErrors.ReactConnectivityGraphs {

	
	export interface EdgesWithoutNodes {
		
			
			'numEdges': number
	}

	export interface EdgesWithoutNodesSchema extends SpruceSchema.Schema {
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

	export type EdgesWithoutNodesEntity = SchemaEntity<SpruceErrors.ReactConnectivityGraphs.EdgesWithoutNodesSchema>

}




