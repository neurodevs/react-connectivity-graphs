import React from 'react'
import { LateralFlowGraphProps } from '../ui/LateralFlowGraph'
import MultiGraphView from './MultiGraphView'

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
            <ViewComponent />
        </div>
    )
}

export default App

// For test doubles

export let ViewComponent: React.FC = MultiGraphView

export function setViewComponent(component: React.FC) {
    ViewComponent = component
}
