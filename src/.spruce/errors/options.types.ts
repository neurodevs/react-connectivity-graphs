import { SpruceErrors } from "#spruce/errors/errors.types"
import { ErrorOptions as ISpruceErrorOptions} from "@sprucelabs/error"

export interface EdgesWithoutNodesErrorOptions extends SpruceErrors.ReactConnectivityGraphs.EdgesWithoutNodes, ISpruceErrorOptions {
	code: 'EDGES_WITHOUT_NODES'
}

type ErrorOptions =  | EdgesWithoutNodesErrorOptions 

export default ErrorOptions
