import React from 'react'
import { LateralFlowGraphProps } from '../exports'

export let lastFakeLateralFlowGraphProps: LateralFlowGraphProps | undefined

export const resetFakeLateralFlowGraphProps = () => {
    lastFakeLateralFlowGraphProps = undefined
}

const FakeLateralFlowGraph: React.FC<LateralFlowGraphProps> = (
    props: LateralFlowGraphProps
) => {
    lastFakeLateralFlowGraphProps = props

    return (
        <div
            className="fake-lateral-flow-graph"
            data-testid="fake-lateral-flow-graph"
        />
    )
}

export default FakeLateralFlowGraph
