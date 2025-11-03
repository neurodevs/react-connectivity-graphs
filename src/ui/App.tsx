import React from 'react'

import { LateralFlowGraphProps } from '../ui/LateralFlowGraph.js'
import MultiGraphView, { MultiGraphViewProps } from './MultiGraphView.js'

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
            <ViewComponent numGraphs={9} />
        </div>
    )
}

export default App

// For test doubles

export let ViewComponent: React.FC<MultiGraphViewProps> = MultiGraphView

export function setViewComponent(component: React.FC<MultiGraphViewProps>) {
    ViewComponent = component
}
