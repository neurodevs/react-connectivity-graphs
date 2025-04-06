import AbstractSpruceTest from '@sprucelabs/test-utils'
import { JSDOM } from 'jsdom'

export default class AbstractDomTest extends AbstractSpruceTest {
    protected static jsdom: JSDOM

    protected static async beforeAll() {
        await super.beforeAll()

        this.jsdom = this.JSDOM()

        this.fakeGlobalWithJsdom()
    }

    private static fakeGlobalWithJsdom() {
        global.window = this.jsdom.window as any
        global.document = this.jsdom.window.document
        global.navigator = this.jsdom.window.navigator
        global.HTMLElement = this.jsdom.window.HTMLElement
        global.getComputedStyle = this.jsdom.window.getComputedStyle

        global.ResizeObserver = class {
            public observe() {}
            public unobserve() {}
            public disconnect() {}
        }

        global.SVGElement = this.jsdom.window.SVGElement
    }

    protected static async afterAll() {
        await super.afterAll()

        this.jsdom.window.close()
    }

    private static readonly html = '<!DOCTYPE html><html><body></body></html>'
    private static readonly url = 'http://localhost'

    private static JSDOM() {
        return new JSDOM(this.html, {
            url: this.url,
        })
    }
}
