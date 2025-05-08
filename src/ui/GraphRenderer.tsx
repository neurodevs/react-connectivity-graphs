import React, { useMemo } from 'react'
import ReactFlow, {
    Edge,
    Node,
    NodeProps,
    NodeTypes,
    ReactFlowProps,
    ReactFlowProvider,
} from 'reactflow'
import RotatableNode from './RotatableNode'

export interface GraphRendererProps {
    nodes: Node[]
    edges: Edge[]
    onNodeClick?: () => void
    onNodeMouseEnter?: () => void
    onNodeMouseLeave?: () => void
    onEdgeClick?: () => void
    onEdgeMouseEnter?: () => void
    onEdgeMouseLeave?: () => void
}

const GraphRenderer: React.FC<GraphRendererProps> = ({
    nodes,
    edges,
    onNodeClick,
    onNodeMouseEnter,
    onNodeMouseLeave,
    onEdgeClick,
    onEdgeMouseEnter,
    onEdgeMouseLeave,
}) => {
    const nodeTypes = useMemoHook(() => ({ rotatableNode: RotatableNode }), [])

    return (
        <div className="graph-renderer" data-testid="graph-renderer">
            <ProviderComponent>
                <ReactFlowComponent
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodeClick={onNodeClick}
                    onNodeMouseEnter={onNodeMouseEnter}
                    onNodeMouseLeave={onNodeMouseLeave}
                    onEdgeClick={onEdgeClick}
                    onEdgeMouseEnter={onEdgeMouseEnter}
                    onEdgeMouseLeave={onEdgeMouseLeave}
                />
            </ProviderComponent>
        </div>
    )
}

export default GraphRenderer

export type GraphRendererNodeTypes = NodeTypes & {
    rotatableNode: React.FC<NodeProps>
}

export type NodeTypesFactory = () => GraphRendererNodeTypes

// For test doubles

export let ProviderComponent = ReactFlowProvider

export function setProviderComponent(
    component: React.FC<React.PropsWithChildren>
) {
    ProviderComponent = component
}

export let ReactFlowComponent: React.FC<ReactFlowProps> = ReactFlow

export function setReactFlowComponent(component: React.FC<ReactFlowProps>) {
    ReactFlowComponent = component
}

export let useMemoHook: (
    factory: NodeTypesFactory,
    deps: React.DependencyList
) => ReturnType<NodeTypesFactory> = useMemo

export function setUseMemoHook(hook: UseMemoHook) {
    useMemoHook = hook
}

export type UseMemoHook = (
    factory: NodeTypesFactory,
    deps: React.DependencyList
) => {
    rotatableNode: React.FC<NodeProps>
}
