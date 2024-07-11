import { useMutation, useQuery } from '@tanstack/react-query'
import browser from 'webextension-polyfill'

const createUseStorageHook =
    (storageType: 'local' | 'session' | 'sync') =>
    <T>(key: string) => {
        const storageQuery = useQuery<T>({
            queryKey: ['storage', storageType, key],
            queryFn: async () => {
                const data = await browser.storage[storageType].get(key)
                return data[key]
            },
        })

        const setStorage = useMutation<T, V>(
            async (newValue) => {
                await browser.storage[storageType].set({ [key]: newValue })
                return newValue
            },
            {
                onSuccess: (newValue) => {
                    storageQuery.setData(newValue)
                },
            },
        )
    }
