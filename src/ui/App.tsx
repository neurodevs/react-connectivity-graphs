import React from 'react'
import LateralFlowGraph, { LateralFlowGraphProps } from '../ui/LateralFlowGraph'

const App: React.FC<LateralFlowGraphProps> = (props: LateralFlowGraphProps) => {
    return (
        <div id="app" data-testid="app">
            <GraphComponent {...props} />
        </div>
    )
}

export default App

// For test doubles

export let GraphComponent: React.FC<LateralFlowGraphProps> = LateralFlowGraph

export function setGraphComponent(component: React.FC<LateralFlowGraphProps>) {
    GraphComponent = component
}
