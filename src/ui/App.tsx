import { ReactFlowProvider } from '@xyflow/react'
import React from 'react'
import { GraphRenderer, GraphRendererProps } from '../exports'

const App: React.FC<GraphRendererProps> = (props: GraphRendererProps) => {
    return (
        <div id="app" data-testid="app">
            <ProviderComponentApp>
                <RendererComponentApp {...props} />
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

export let RendererComponentApp: React.FC<GraphRendererProps> = GraphRenderer

export function setRendererComponentApp(
    component: React.FC<GraphRendererProps>
) {
    RendererComponentApp = component
}
