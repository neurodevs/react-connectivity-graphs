import React from 'react'
import { MultiGraphViewProps } from '../exports.js'

export let lastFakeMultiGraphViewProps: MultiGraphViewProps | null = null

const FakeMultiGraphView: React.FC<MultiGraphViewProps> = (
    props: MultiGraphViewProps
) => {
    lastFakeMultiGraphViewProps = props
    return <div data-testid="graphs-container" />
}

export default FakeMultiGraphView
