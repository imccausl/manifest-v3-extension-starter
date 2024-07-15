import { type QueryClient, useQuery } from '@tanstack/react-query'
import browser from 'webextension-polyfill'

const queryKey = ['currentTab']
const queryFn = async () => {
    const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
    })
    if (!tabs.length) return null
    return tabs[0]
}

export const fetchCurrentTab = (queryClient: QueryClient) => {
    return queryClient.fetchQuery({ queryKey, queryFn })
}

export const useCurrentTab = () => {
    return useQuery<browser.Tabs.Tab | null>({
        queryKey,
        queryFn,
    })
}
