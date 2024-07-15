import { ExtensionBroadcastChannel } from './utils'

import type { QueryClient } from '@tanstack/react-query'

export async function synchronizeQueryClient({
    queryClient,
    broadcastChannel = 'query-cache-broadcast-channel',
}: {
    queryClient: QueryClient
    broadcastChannel?: string
}) {
    let transaction = false

    const tx = (cb: () => void) => {
        transaction = true
        cb()
        transaction = false
    }

    const channel = new ExtensionBroadcastChannel(broadcastChannel)
    const queryCache = queryClient.getQueryCache()

    queryClient.getQueryCache().subscribe(async (queryEvent) => {
        if (transaction) return

        const {
            query: { queryHash, queryKey, state },
        } = queryEvent

        if (
            queryEvent.type === 'updated' &&
            queryEvent.action.type === 'success'
        ) {
            channel.postMessage({
                type: 'updated',
                queryHash,
                queryKey,
                state,
            })
        }

        if (queryEvent.type === 'removed') {
            channel.postMessage({
                type: 'removed',
                queryHash,
                queryKey,
            })
        }
    })

    channel.onmessage = (action: Record<string, any>) => {
        console.log('message handler', { action })
        if (!action.type) return

        tx(() => {
            const { type, queryHash, queryKey, state } = action

            if (type === 'updated') {
                const query = queryCache.get(queryHash)

                if (query) {
                    query.setState(state)
                    return
                }

                queryCache.build(
                    queryClient,
                    {
                        queryKey,
                        queryHash,
                    },
                    state,
                )
            } else if (type === 'removed') {
                const query = queryCache.get(queryHash)

                if (query) {
                    queryCache.remove(query)
                }
            }
        })
    }
}
