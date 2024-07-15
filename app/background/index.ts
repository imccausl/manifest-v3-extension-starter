import { QueryClient } from '@tanstack/react-query'
import browser from 'webextension-polyfill'

import { fetchCurrentTab } from '../shared/clients'
import { synchronizeQueryClient } from '../shared/synchronizeQueryClient'

const queryClient = new QueryClient()
synchronizeQueryClient({ queryClient })

async function run() {
    const currentTab = await fetchCurrentTab(queryClient)
    console.log('Current tab', currentTab?.id)
}

run()

browser.runtime.onInstalled.addListener(() => {
    console.log('Extension installed')
})

browser.runtime.onMessage.addListener((message) => {
    console.log('Message received', message)
})
