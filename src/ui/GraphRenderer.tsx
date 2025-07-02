import {
    Controls,
    Edge,
    Node,
    ReactFlow,
    ReactFlowInstance,
    ReactFlowProps,
} from '@xyflow/react'
import React, {
    useState,
    useCallback,
    useRef,
    useEffect,
    MouseEvent,
} from 'react'
import { EnrichedEdge, EnrichedNode } from './LateralFlowGraph'
import RotatableNode from './RotatableNode'

export interface GraphRendererProps {
    nodes: EnrichedNode[]
    edges: EnrichedEdge[]
    onNodeClick?: (event: MouseEvent, node: Node) => void
    onNodeMouseEnter?: (event: MouseEvent, node: Node) => void
    onNodeMouseLeave?: (event: MouseEvent, node: Node) => void
    onEdgeClick?: (event: MouseEvent, edge: Edge) => void
    onEdgeMouseEnter?: (event: MouseEvent, edge: Edge) => void
    onEdgeMouseLeave?: (event: MouseEvent, edge: Edge) => void
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
    const [isLoaded, setIsLoaded] = useState(false)
    const [isToggleActive, setIsToggleActive] = useState(false)
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)

    const disableHoverRef = useRef(false)
    const originalNodeStylesRef = useRef<HighlightNodeStyles>({})
    const originalEdgeStylesRef = useRef<HighlightEdgeStyles>({})

    const handleNodeClick = useCallbackNodeClick()
    const handleNodeMouseEnter = useCallbackNodeMouseEnter()
    const handleNodeMouseLeave = useCallbackNodeMouseLeave()

    useEffect(() => {
        fitViewWithPadding()
    }, [rfInstance])

    useEffect(() => {
        setGraphAndOriginalStyles()
    }, [initialNodes, initialEdges])

    useEffect(() => {
        updateStyleOnToggle()
    }, [isToggleActive])

    useEffect(() => {
        updateStyleOnHover()
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

    function fitViewWithPadding() {
        if (rfInstance) {
            setTimeout(() => {
                void rfInstance.fitView({ padding: viewPadding, minZoom })
                setIsLoaded(true)
            }, 0)
        }
    }

    function setGraphAndOriginalStyles() {
        setNodes(initialNodes)
        setEdges(initialEdges)

        setOriginalNodeStyles()
        setOriginalEdgeStyles()
    }

    function setOriginalNodeStyles() {
        if (Object.keys(originalNodeStylesRef.current).length === 0) {
            for (const node of nodes) {
                const style = node.data.style

                originalNodeStylesRef.current[node.id] = {
                    color: style.color,
                    borderColor: style.borderColor,
                }
            }
        }
    }

    function setOriginalEdgeStyles() {
        if (Object.keys(originalEdgeStylesRef.current).length === 0) {
            for (const edge of edges) {
                const style = edge.style

                originalEdgeStylesRef.current[edge.id] = {
                    stroke: style.stroke,
                }
            }
        }
    }

    function updateStyleOnToggle() {
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
    }

    function updateStyleOnHover() {
        const highlightedNodes = highlightNodes()
        const highlightedEdges = highlightEdges()

        setNodes(highlightedNodes)
        setEdges(highlightedEdges)
    }

    function highlightNodes() {
        return nodes.map((node) => {
            const shouldHighlight =
                hoveredId &&
                (node.id === hoveredId || isConnectedToHovered(node.id))

            const original = originalNodeStylesRef.current[node.id]

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

            const original = originalEdgeStylesRef.current[edge.id]

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

    function useCallbackNodeClick() {
        return useCallback(
            (event: MouseEvent, node: Node) => {
                disableHoverRef.current = !disableHoverRef.current

                const { id: nodeId } = node

                if (nodeId == 'abbreviations-toggle') {
                    setIsToggleActive(!isToggleActive)
                }
                onNodeClick?.(event, node)
            },
            [isToggleActive, onNodeClick]
        )
    }

    function useCallbackNodeMouseEnter() {
        return useCallback(
            (event: MouseEvent, node: Node) => {
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
                onNodeMouseEnter?.(event, node)
            },
            [hoveredId, onNodeMouseEnter]
        )
    }

    function useCallbackNodeMouseLeave() {
        return useCallback(
            (event: MouseEvent, node: Node) => {
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
                onNodeMouseLeave?.(event, node)
            },
            [hoveredId, onNodeMouseLeave]
        )
    }

    function shouldIgnoreHoverForNode(nodeId: string) {
        return ['bottom-midline', 'top-midline'].includes(nodeId)
    }

    function shouldInclude(nodeId: string) {
        if (nodeId.includes('-')) {
            return (
                nodeId.includes('left') && !isNaN(Number(nodeId.split('-')[0]))
            )
        } else {
            return !isNaN(Number(nodeId))
        }
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
