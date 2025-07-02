import { ReactFlowProvider } from '@xyflow/react'
import React from 'react'
import LateralFlowGraph, { LateralFlowGraphProps } from '../ui/LateralFlowGraph'

const App: React.FC<LateralFlowGraphProps> = (props: LateralFlowGraphProps) => {
    return (
        <div id="app" data-testid="app">
            <ProviderComponentApp>
                <RendererComponent {...props} />
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

export let RendererComponent: React.FC<LateralFlowGraphProps> = LateralFlowGraph

export function setRendererComponent(
    component: React.FC<LateralFlowGraphProps>
) {
    RendererComponent = component
}
