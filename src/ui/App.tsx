import React from 'react'
import generateGraph from '../scripts/generateGraph'
import LateralFlowGraph, { LateralFlowGraphProps } from '../ui/LateralFlowGraph'

const App: React.FC<LateralFlowGraphProps> = () => {
    return (
        <div
            id="app"
            data-testid="app"
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0rem',
                justifyContent: 'center',
                alignItems: 'flex-start',
            }}
        >
            <div
                data-testid="graphs-container"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    maxWidth: `calc(3 * 500px + 2 * 1rem)`,
                }}
            >
                {Array.from({ length: 9 }, (_, i) => wrap(i + 1))}
            </div>
        </div>
    )
}

function wrap(numNodes: number) {
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

export default App

// For test doubles

export let GraphComponent: React.FC<LateralFlowGraphProps> = LateralFlowGraph

export function setGraphComponent(component: React.FC<LateralFlowGraphProps>) {
    GraphComponent = component
}
