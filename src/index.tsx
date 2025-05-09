import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './ui/App'
import { GraphRendererProps } from './ui/GraphRenderer'

import 'index.css'

async function main() {
    const res = await fetch('/dist/graph-data.json')
    const props: GraphRendererProps = await res.json()

    const root = ReactDOM.createRoot(document.getElementById('root')!)

    root.render(
        <React.StrictMode>
            <App {...props} />
        </React.StrictMode>
    )
}

main().catch((error) => {
    console.error('Error loading graph data:', error)
})
