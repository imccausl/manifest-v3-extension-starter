import browser from 'webextension-polyfill'

browser.runtime.onInstalled.addListener(() => {
    console.log('Extension installed')
})

browser.runtime.onMessage.addListener((message) => {
    console.log('Message received', message)
})
