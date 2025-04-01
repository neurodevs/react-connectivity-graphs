import React from 'react'
import { GraphRendererProps } from '../components/GraphRenderer'

export let lastFakeGraphRendererProps: GraphRendererProps | undefined

const FakeGraphRenderer: React.FC<GraphRendererProps> = (
    props: GraphRendererProps
) => {
    lastFakeGraphRendererProps = props

    return (
        <div
            className="fake-graph-renderer"
            data-testid="fake-graph-renderer"
        />
    )
}

export default FakeGraphRenderer
