import browser from 'webextension-polyfill'

type MessageCallback<T extends Record<string, unknown>> = (
    message: T,
    port: browser.Runtime.Port,
) => void

function isContentScript() {
    return !browser.tabs
}

export class ExtensionBroadcastChannel {
    readonly channel: string
    #port: browser.Runtime.Port | null = null
    #handler: MessageCallback<Record<string, unknown>> | null = null
    #tabId: number | null = null

    constructor(channel: string) {
        this.channel = channel
        console.log('creating channel', channel)
        this.#registerOnConnectListener()
    }

    async #connect() {
        const connectOptions = {
            name: this.channel,
        }

        if (!isContentScript() && !this.#tabId) {
            this.#tabId = await this.#getTabId()
        }

        if (!isContentScript()) {
            try {
                this.#port = browser.tabs.connect(this.#tabId!, connectOptions)
            } catch (e) {
                console.error(e)
            }
            return
        }

        try {
            this.#port = browser.runtime.connect(connectOptions)
        } catch (e) {
            console.error(e)
        }
    }

    async #getTabId() {
        if (isContentScript()) {
            return null
        }

        const tabs = await browser.tabs.query({
            active: true,
            currentWindow: true,
        })

        if (!tabs.length) {
            console.warn('No active tab found')
            return null
        }

        return tabs[0].id ?? null
    }

    set onmessage(cb: MessageCallback<Record<string, unknown>>) {
        if (this.#handler) {
            throw new Error('Handler already registered')
        }

        this.#handler = cb
        this.#registerMessageListener()
    }

    #registerMessageListener() {
        if (!this.#handler) {
            throw new Error('Handler is missing')
        }

        if (!this.#port) {
            console.log('no connection, establishing connection')
            this.#connect().then(() => {
                console.log('connected, registering message listener')
                if (!this.#handler) {
                    throw new Error('Handler is missing')
                }
                this.#port!.onMessage.addListener(this.#handler)
            })
            return
        }

        this.#port.onMessage.addListener(this.#handler)
    }

    #removeMessageListener() {
        if (this.#handler) {
            this.#port?.onMessage.removeListener(this.#handler)
            this.#handler = null
        }
    }

    #registerOnConnectListener() {
        const onConnectHandler = (port: browser.Runtime.Port) => {
            console.log('onConnectHandler', port)
            this.#port = port
            this.#registerMessageListener()
        }

        browser.runtime.onConnect.addListener(onConnectHandler)

        return () => {
            browser.runtime.onConnect.removeListener(onConnectHandler)
            this.#removeMessageListener()
        }
    }

    postMessage<T extends Record<string, unknown>>(message: T) {
        if (!this.#port) {
            console.log('no port, establishing connection')
            this.#connect().then(() => {
                console.log('connected, posting message')
                this.#port!.postMessage(message)
            })
            return
        }

        console.log('postMessage', { port: this.#port, message })

        this.#port.postMessage(message)
    }
}
