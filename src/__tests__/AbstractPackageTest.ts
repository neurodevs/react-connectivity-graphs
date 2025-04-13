import AbstractSpruceTest from '@sprucelabs/test-utils'
import React from 'react'

export default class AbstractPackageTest extends AbstractSpruceTest {
    protected static async beforeEach() {
        await super.beforeEach()
    }

    protected static get createElement() {
        return React.createElement
    }
}
