import React from 'react'
import generateGraph from '../scripts/generateGraph'
import LateralFlowGraph, { LateralFlowGraphProps } from './LateralFlowGraph'

export interface MultiGraphViewProps {
    numNodes: number
}

const MultiGraphView: React.FC<MultiGraphViewProps> = ({ numNodes }) => {
    return (
        <div
            data-testid="graphs-container"
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                maxWidth: `calc(3 * 500px + 2 * 1rem)`,
            }}
        >
            {Array.from({ length: numNodes }, (_, i) =>
                generateGraphComponent(i + 1)
            )}
        </div>
    )
}

export default MultiGraphView

export function generateGraphComponent(numNodes: number) {
    return (
        <div
            key={numNodes}
            style={{
                height: 500,
                width: 500,
                border: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0rem',
            }}
            data-testid={`graph-${numNodes}`}
        >
            <GraphComponent
                {...(generateGraph(numNodes) as any)}
                viewPadding={10}
            />
        </div>
    )
}

// For test doubles

export let GraphComponent: React.FC<LateralFlowGraphProps> = LateralFlowGraph

export function setGraphComponentMultiView(
    component: React.FC<LateralFlowGraphProps>
) {
    GraphComponent = component
}
