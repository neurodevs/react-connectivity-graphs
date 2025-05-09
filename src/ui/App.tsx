import React from 'react'
import GraphRenderer, { GraphRendererProps } from './GraphRenderer'

const App: React.FC<GraphRendererProps> = (props: GraphRendererProps) => {
    return (
        <div id="app" data-testid="app">
            <div>Hello connectivity!</div>
            <GraphRendererComponent {...props} />
        </div>
    )
}

export default App

// For test doubles

export let GraphRendererComponent: React.FC<GraphRendererProps> = GraphRenderer

export function setGraphRendererComponent(
    component: React.FC<GraphRendererProps>
) {
    GraphRendererComponent = component
}
