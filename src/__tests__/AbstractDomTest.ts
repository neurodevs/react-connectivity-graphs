import AbstractSpruceTest from '@sprucelabs/test-utils'
import { JSDOM } from 'jsdom'

export default class AbstractDomTest extends AbstractSpruceTest {
    protected static jsdom: JSDOM

    protected static async beforeAll() {
        await super.beforeAll()

        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
            url: 'http://localhost',
        })

        global.window = dom.window as any
        global.document = dom.window.document
        global.navigator = dom.window.navigator
        global.HTMLElement = dom.window.HTMLElement
        global.getComputedStyle = dom.window.getComputedStyle

        this.jsdom = dom
    }

    protected static async afterAll() {
        await super.afterAll()
        this.jsdom.window.close()
    }
}
