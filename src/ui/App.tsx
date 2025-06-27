import { ReactFlowProvider } from '@xyflow/react'
import React from 'react'
import { LateralFlowGraph, LateralFlowGraphProps } from '../exports'

const App: React.FC<LateralFlowGraphProps> = (props: LateralFlowGraphProps) => {
    return (
        <div id="app" data-testid="app">
            <ProviderComponentApp>
                <GraphComponent {...props} />
            </ProviderComponentApp>
        </div>
    )
}

export default App

// For test doubles

export let ProviderComponentApp = ReactFlowProvider

export function setProviderComponentApp(component: typeof ReactFlowProvider) {
    ProviderComponentApp = component
}

export let GraphComponent: React.FC<LateralFlowGraphProps> = LateralFlowGraph

export function setGraphComponent(component: React.FC<LateralFlowGraphProps>) {
    GraphComponent = component
}
