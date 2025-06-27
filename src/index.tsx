import React from 'react'
import ReactDOM from 'react-dom/client'

import '@xyflow/react/dist/style.css'
import { App, LateralFlowGraphProps } from './exports'
import props from './scripts/ctactile-simple'

async function main() {
    const root = ReactDOM.createRoot(document.getElementById('root')!)

    root.render(
        <React.StrictMode>
            <App {...(props as LateralFlowGraphProps)} />
        </React.StrictMode>
    )
}

main().catch((error) => {
    console.error('Error loading graph data:', error)
})
