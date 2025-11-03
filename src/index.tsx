import React from 'react'
import ReactDOM from 'react-dom/client'

import props from './scripts/generateGraph.js'
import App from './ui/App.js'
import { LateralFlowGraphProps } from './ui/LateralFlowGraph.js'

async function main() {
    const root = ReactDOM.createRoot(document.getElementById('root')!)

    const expanded = { ...props, viewPadding: 2.5 } as LateralFlowGraphProps

    root.render(
        <React.StrictMode>
            <App {...expanded} />
        </React.StrictMode>
    )
}

main().catch((error) => {
    console.error('Error loading graph data:', error)
})
