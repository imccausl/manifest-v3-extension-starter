import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import browser from 'webextension-polyfill'

const StorageType = {
    local: 'local',
    session: 'session',
    sync: 'sync',
} as const

type StorageType = (typeof StorageType)[keyof typeof StorageType]

function createStorageSetter<K extends string>(
    storageType: StorageType,
    key: K,
) {
    async function setStorage<T>(newValue: T) {
        return browser.storage[storageType].set({ [key]: newValue })
    }

    return setStorage
}

const storageQueryKey = <K>(storageType: StorageType, key: K) => [
    'storage',
    storageType,
    key,
]

const createUseStorageHook =
    (storageType: StorageType) =>
    <T, K extends string>(key: K) => {
        const queryClient = useQueryClient()
        const queryKey = storageQueryKey(storageType, key)
        const storageQuery = useQuery<T>({
            queryKey,
            queryFn: async () => {
                const data: Record<K, T> =
                    await browser.storage[storageType].get(key)
                return data[key]
            },
        })

        const setStorage = createStorageSetter(storageType, key)
        const { mutate } = useMutation({
            mutationFn: setStorage,

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey })
            },
        })

        return [storageQuery.data, mutate] as const
    }

export default {
    useLocalStorage: createUseStorageHook(StorageType.local),
    useSessionStorage: createUseStorageHook(StorageType.session),
    useSyncStorage: createUseStorageHook(StorageType.sync),
}
