import { ReactFlowProvider } from '@xyflow/react'
import React from 'react'
import { GraphRenderer, GraphRendererProps } from '../exports'

const App: React.FC<GraphRendererProps> = (props: GraphRendererProps) => {
    return (
        <div id="app" data-testid="app">
            <ProviderComponent>
                <GraphRendererComponent {...props} />
            </ProviderComponent>
        </div>
    )
}

export default App

// For test doubles

export let ProviderComponent = ReactFlowProvider

export function setProviderComponent(component: typeof ReactFlowProvider) {
    ProviderComponent = component
}

export let GraphRendererComponent: React.FC<GraphRendererProps> = GraphRenderer

export function setRendererComponent(component: React.FC<GraphRendererProps>) {
    GraphRendererComponent = component
}
