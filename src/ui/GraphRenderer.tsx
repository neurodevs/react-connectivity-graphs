import { Controls, Edge, Node, ReactFlow, ReactFlowProps } from '@xyflow/react'
import React, { useState, useCallback, useRef } from 'react'
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
    nodes,
    edges,
    onNodeClick,
    onNodeMouseEnter,
    onNodeMouseLeave,
    onEdgeClick,
    onEdgeMouseEnter,
    onEdgeMouseLeave,
}) => {
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    const originalStylesRef = useRef<HighlightableStyles>({})
    setOriginalStylesRefIfEmpty()

    const handleNodeMouseEnter = useCallbackNodeMouseEnter()
    const handleNodeMouseLeave = useCallbackNodeMouseLeave()

    const styledNodes = applyHighlightableStyles()

    return (
        <div className="graph-renderer" data-testid="graph-renderer">
            <ReactFlowComponent
                nodes={styledNodes}
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

    function setOriginalStylesRefIfEmpty() {
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

    function useCallbackNodeMouseLeave() {
        return useCallback(() => {
            setHoveredId(null)
            onNodeMouseLeave?.()
        }, [onNodeMouseLeave])
    }

    function useCallbackNodeMouseEnter() {
        return useCallback(
            (_: any, node: Node) => {
                setHoveredId(node.id)
                onNodeMouseEnter?.(_, node)
            },
            [onNodeMouseEnter]
        )
    }

    function applyHighlightableStyles() {
        return nodes.map((node) => {
            const original = originalStylesRef.current[node.id] ?? {}
            const isHovered = node.id === hoveredId

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
