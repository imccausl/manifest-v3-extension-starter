import { useQuery } from '@tanstack/react-query'
import browser from 'webextension-polyfill'

export const useCurrentTab = () => {
    return useQuery<browser.Tabs.Tab | null>({
        queryKey: ['currentTab'],
        queryFn: async () => {
            const tabs = await browser.tabs.query({
                active: true,
                currentWindow: true,
            })
            if (!tabs.length) return null
            return tabs[0]
        },
    })
}
