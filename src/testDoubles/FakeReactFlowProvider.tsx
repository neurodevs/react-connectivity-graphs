import React from 'react'

export let providerWasCreated = false

export const resetProviderWasCreated = () => {
    providerWasCreated = false
}

const FakeReactFlowProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    providerWasCreated = true

    return (
        <div className="react-flow-provider" data-testid="react-flow-provider">
            {children}
        </div>
    )
}

export default FakeReactFlowProvider
