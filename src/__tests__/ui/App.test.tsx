import { test, assert } from '@sprucelabs/test-utils'
import React from 'react'
import AbstractPackageTest from '../AbstractPackageTest'
import App from '../../App'

export default class AppTest extends AbstractPackageTest {
    private static element: React.ReactElement

    protected static async beforeEach() {
        await super.beforeEach()

        this.element = this.renderApp()
    }

    
    @test()
    protected static async rendersApp() {
        assert.isTruthy(this.element, 'App failed to render!')
    }

    private static renderApp() {
        return <App />
    }

}
