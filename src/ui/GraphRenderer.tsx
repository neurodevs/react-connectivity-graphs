import {
    Controls,
    Edge,
    Node,
    ReactFlow,
    ReactFlowInstance,
    ReactFlowProps,
} from '@xyflow/react'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { EnrichedEdge, EnrichedNode } from '../exports'
import RotatableNode from './RotatableNode'

export interface GraphRendererProps {
    nodes: EnrichedNode[]
    edges: EnrichedEdge[]
    onNodeClick?: (event: any, node: Node) => void
    onNodeMouseEnter?: (event: any, node: Node) => void
    onNodeMouseLeave?: () => void
    onEdgeClick?: () => void
    onEdgeMouseEnter?: () => void
    onEdgeMouseLeave?: () => void
    minZoom?: number
    viewPadding?: number
    showControls?: boolean
}

export const highlightColor = 'dodgerblue'
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
    minZoom = 1,
    viewPadding = 0.2,
    showControls = false,
}) => {
    const [nodes, setNodes] = useState<EnrichedNode[]>(initialNodes)
    const [edges, setEdges] = useState<EnrichedEdge[]>(initialEdges)
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isToggleActive, setIsToggleActive] = useState(false)

    const disableHoverRef = useRef(false)

    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)

    const originalNodeStyles = useRef<HighlightNodeStyles>({})
    const originalEdgeStyles = useRef<HighlightEdgeStyles>({})

    const handleNodeClick = useCallbackNodeClick()
    const handleNodeMouseEnter = useCallbackNodeMouseEnter()
    const handleNodeMouseLeave = useCallbackNodeMouseLeave()

    useEffect(() => {
        if (rfInstance) {
            setTimeout(() => {
                void rfInstance.fitView({ padding: viewPadding, minZoom })
                setIsLoaded(true)
            }, 0)
        }
    }, [rfInstance])

    useEffect(() => {
        setNodes(initialNodes)
        setEdges(initialEdges)

        setOriginalNodeStyles()
        setOriginalEdgeStyles()
    }, [initialNodes, initialEdges])

    useEffect(() => {
        const color = isToggleActive ? 'dodgerblue' : '#ccc'

        setNodes((nodes) =>
            nodes.map((node) =>
                node.id === 'abbreviations-toggle'
                    ? {
                          ...node,
                          style: { ...node.style, color },
                          data: {
                              ...node.data,
                              style: {
                                  ...node.data?.style,
                                  color,
                              },
                          },
                      }
                    : node
            )
        )
    }, [isToggleActive])

    useEffect(() => {
        const highlightedNodes = highlightNodes()
        const highlightedEdges = highlightEdges()

        setNodes(highlightedNodes)
        setEdges(highlightedEdges)
    }, [hoveredId])

    return (
        <div
            className="graph-renderer"
            data-testid="graph-renderer"
            style={isLoaded ? {} : { display: 'none' }}
        >
            <ReactFlowComponent
                nodes={nodes as unknown as Node[]}
                edges={edges as unknown as Edge[]}
                nodeTypes={nodeTypes}
                onNodeClick={handleNodeClick}
                onNodeMouseEnter={handleNodeMouseEnter}
                onNodeMouseLeave={handleNodeMouseLeave}
                onEdgeClick={onEdgeClick}
                onEdgeMouseEnter={onEdgeMouseEnter}
                onEdgeMouseLeave={onEdgeMouseLeave}
                onInit={setRfInstance}
                panOnDrag={false}
                panOnScroll={false}
                zoomOnPinch={false}
                zoomOnScroll={false}
            />
            {showControls && <Controls />}
            {isToggleActive && (
                <div id="abbreviations-modal" data-testid="abbreviations-modal">
                    <table style={{ width: '100%', borderSpacing: '0.5rem' }}>
                        <tbody>
                            {nodes
                                .filter((node) => shouldInclude(node.id))
                                .sort((a, b) =>
                                    a.abbreviation.localeCompare(b.abbreviation)
                                )
                                .map((node) => (
                                    <tr
                                        key={node.id}
                                        data-testid={`row-${node.id}`}
                                    >
                                        <td>{node.abbreviation}</td>
                                        <td>{node.label}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )

    function shouldInclude(nodeId: string) {
        if (nodeId.includes('-')) {
            return (
                nodeId.includes('left') && !isNaN(Number(nodeId.split('-')[0]))
            )
        } else {
            return !isNaN(Number(nodeId))
        }
    }

    function setOriginalNodeStyles() {
        if (Object.keys(originalNodeStyles.current).length === 0) {
            for (const node of nodes) {
                const style = node.data.style as any

                originalNodeStyles.current[node.id] = {
                    color: style.color,
                    borderColor: style.borderColor,
                }
            }
        }
    }

    function setOriginalEdgeStyles() {
        if (Object.keys(originalEdgeStyles.current).length === 0) {
            for (const edge of edges) {
                const style = edge.style as any

                originalEdgeStyles.current[edge.id] = {
                    stroke: style.stroke,
                }
            }
        }
    }

    function useCallbackNodeClick() {
        return useCallback(
            (_: any, node: Node) => {
                disableHoverRef.current = !disableHoverRef.current

                const { id: nodeId } = node

                if (nodeId == 'abbreviations-toggle') {
                    setIsToggleActive(!isToggleActive)
                }
                onNodeClick?.(_, node)
            },
            [isToggleActive, onNodeClick]
        )
    }

    function useCallbackNodeMouseEnter() {
        return useCallback(
            (_: any, node: Node) => {
                const { id: nodeId } = node

                if (shouldIgnoreHoverForNode(nodeId)) {
                    return
                }
                if (disableHoverRef.current) {
                    return
                }
                if (hoveredId !== nodeId) {
                    setHoveredId(nodeId)
                }
                onNodeMouseEnter?.(_, node)
            },
            [hoveredId, onNodeMouseEnter]
        )
    }

    function useCallbackNodeMouseLeave() {
        return useCallback(
            (_: any, node: Node) => {
                const { id: nodeId } = node

                if (shouldIgnoreHoverForNode(nodeId)) {
                    return
                }
                if (disableHoverRef.current) {
                    return
                }
                if (hoveredId !== null) {
                    setHoveredId(null)
                }
                onNodeMouseLeave?.()
            },
            [hoveredId, onNodeMouseLeave]
        )
    }

    function highlightNodes() {
        return nodes.map((node) => {
            const shouldHighlight =
                hoveredId &&
                (node.id === hoveredId || isConnectedToHovered(node.id))

            const original = originalNodeStyles.current[node.id]

            const color = shouldHighlight ? highlightColor : original.color

            const borderColor = shouldHighlight
                ? highlightColor
                : original.borderColor

            return {
                ...node,
                style: {
                    ...node.style,
                    color,
                    borderColor,
                },
                data: {
                    ...node.data,
                    label: shouldHighlight ? node.label : node.abbreviation,
                    style: {
                        ...node.data.style!,
                        color,
                        borderColor,
                    },
                },
            }
        })
    }

    function isConnectedToHovered(nodeId: string) {
        return edges.some(
            (edge) =>
                (edge.source === hoveredId && edge.target === nodeId) ||
                (edge.target === hoveredId && edge.source === nodeId)
        )
    }

    function highlightEdges() {
        return edges.map((edge) => {
            const shouldHighlight =
                hoveredId &&
                (edge.source === hoveredId || edge.target === hoveredId)

            const original = originalEdgeStyles.current[edge.id]

            const stroke = shouldHighlight ? highlightColor : original.stroke

            return {
                ...edge,
                style: {
                    ...edge.style,
                    stroke,
                },
            }
        })
    }

    function shouldIgnoreHoverForNode(id: string) {
        return ['bottom-midline', 'top-midline'].includes(id)
    }
}

export default GraphRenderer

export type HighlightNodeStyles = Record<
    string,
    {
        color: string
        borderColor: string
    }
>

export type HighlightEdgeStyles = Record<
    string,
    {
        stroke: string
    }
>

// For test doubles

export let ReactFlowComponent: React.FC<ReactFlowProps> = ReactFlow

export function setReactFlowComponent(component: React.FC<ReactFlowProps>) {
    ReactFlowComponent = component
}
