import {
    type QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import browser from 'webextension-polyfill'

const StorageType = {
    local: 'local',
    session: 'session',
    sync: 'sync',
} as const

type StorageType = (typeof StorageType)[keyof typeof StorageType]

const storageQueryKey = <K>(storageType: StorageType, key: K) => [
    'storage',
    storageType,
    key,
]

const createQueryFn =
    <K extends string>(storageType: StorageType, key: K) =>
    async <T>() => {
        const data: Record<K, T> = await browser.storage[storageType].get(key)
        return data[key] as T
    }

function createMutationFn<K extends string>(storageType: StorageType, key: K) {
    async function setStorage<T>(newValue: T) {
        browser.storage[storageType].set({ [key]: newValue })
    }

    return setStorage
}

const createUseStorageHook =
    (storageType: StorageType) =>
    <T, K extends string>(key: K) => {
        const queryClient = useQueryClient()
        const queryKey = storageQueryKey(storageType, key)
        const queryFn = createQueryFn(storageType, key)
        const storageQuery = useQuery<T>({
            queryKey,
            queryFn,
        })

        const setStorage = createMutationFn(storageType, key)
        const { mutate } = useMutation({
            mutationFn: setStorage,

            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey })
            },
        })

        return [storageQuery.data, mutate] as const
    }

const createBackgroundStorageFunction =
    (storageType: StorageType) =>
    async <K extends string, T>({
        queryClient,
        storageKey,
    }: {
        queryClient: QueryClient
        storageKey: K
    }) => {
        const queryFn = createQueryFn(storageType, storageKey)
        const queryKey = storageQueryKey(storageType, storageKey)
        const mutationFn = createMutationFn(storageType, storageKey)

        const storage = await queryClient.fetchQuery<T>({ queryKey, queryFn })
        const setStorage = (newData: T) => {
            mutationFn(newData)
            queryClient.setQueryData(queryKey, newData)
        }

        return [storage, setStorage] as const
    }

export default {
    useLocalStorage: createUseStorageHook(StorageType.local),
    useSessionStorage: createUseStorageHook(StorageType.session),
    useSyncStorage: createUseStorageHook(StorageType.sync),
    backgroundLocalStorage: createBackgroundStorageFunction(StorageType.local),
    backgroundSessionStorage: createBackgroundStorageFunction(
        StorageType.session,
    ),
    backgroundSyncStorage: createBackgroundStorageFunction(StorageType.sync),
}
