import { Controls, Edge, Node, ReactFlow, ReactFlowProps } from '@xyflow/react'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import RotatableNode from './RotatableNode'

export interface GraphRendererProps {
    nodes: Node[]
    edges: Edge[]
    onNodeClick?: () => void
    onNodeMouseEnter?: (event: any, node: Node) => void
    onNodeMouseLeave?: () => void
    onEdgeClick?: () => void
    onEdgeMouseEnter?: () => void
    onEdgeMouseLeave?: () => void
}

export const nodeTypes = { rotatableNode: RotatableNode }

const GraphRenderer: React.FC<GraphRendererProps> = ({
    nodes: initialNodes,
    edges: initialEdges,
    onNodeClick,
    onNodeMouseEnter,
    onNodeMouseLeave,
    onEdgeClick,
    onEdgeMouseEnter,
    onEdgeMouseLeave,
}) => {
    const [nodes, setNodes] = useState<Node[]>(initialNodes)
    const [edges, setEdges] = useState<Edge[]>(initialEdges)
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    const originalStylesRef = useRef<HighlightableStyles>({})
    const handleNodeMouseEnter = useCallbackNodeMouseEnter()
    const handleNodeMouseLeave = useCallbackNodeMouseLeave()

    useEffect(() => {
        setNodes(initialNodes)
        setEdges(initialEdges)

        setOriginalStylesRef()
    }, [initialNodes, initialEdges])

    useEffect(() => {
        const styledNodes = applyHighlightableStyles()
        setNodes(styledNodes)
    }, [hoveredId])

    return (
        <div className="graph-renderer" data-testid="graph-renderer">
            <ReactFlowComponent
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodeClick={onNodeClick}
                onNodeMouseEnter={handleNodeMouseEnter}
                onNodeMouseLeave={handleNodeMouseLeave}
                onEdgeClick={onEdgeClick}
                onEdgeMouseEnter={onEdgeMouseEnter}
                onEdgeMouseLeave={onEdgeMouseLeave}
            />
            <Controls />
        </div>
    )

    function setOriginalStylesRef() {
        if (Object.keys(originalStylesRef.current).length === 0) {
            for (const node of nodes) {
                const style = node.data.style as any

                originalStylesRef.current[node.id] = {
                    color: style.color,
                    borderColor: style.borderColor,
                }
            }
        }
    }

    function useCallbackNodeMouseEnter() {
        return useCallback(
            (_: any, node: Node) => {
                const { id: nodeId } = node

                if (isMidlineNode(nodeId)) {
                    return
                }
                setHoveredId(nodeId)
                onNodeMouseEnter?.(_, node)
            },
            [onNodeMouseEnter]
        )
    }

    function useCallbackNodeMouseLeave() {
        return useCallback(
            (_: any, node: Node) => {
                const { id: nodeId } = node

                if (isMidlineNode(nodeId)) {
                    return
                }
                setHoveredId(null)
                onNodeMouseLeave?.()
            },
            [onNodeMouseLeave]
        )
    }

    function applyHighlightableStyles() {
        return nodes.map((node) => {
            const isHovered = node.id === hoveredId

            const original = originalStylesRef.current[node.id]
            const color = isHovered ? 'dodgerblue' : original.color
            const borderColor = isHovered ? 'dodgerblue' : original.borderColor

            return {
                ...node,
                style: {
                    ...node.style,
                    color,
                    borderColor,
                },
                data: {
                    ...node.data,
                    style: {
                        ...node.data.style!,
                        color,
                        borderColor,
                    },
                },
            }
        })
    }

    function isMidlineNode(id: string) {
        return ['bottom-midline', 'top-midline'].includes(id)
    }
}

export default GraphRenderer

export type HighlightableStyles = Record<
    string,
    {
        color?: string
        borderColor?: string
    }
>

// For test doubles

export let ReactFlowComponent: React.FC<ReactFlowProps> = ReactFlow

export function setReactFlowComponent(component: React.FC<ReactFlowProps>) {
    ReactFlowComponent = component
}
