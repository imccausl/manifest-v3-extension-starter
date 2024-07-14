import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { createRoot } from 'react-dom/client'

import { synchronizeQueryClient } from '../shared/synchronizeQueryClient'

import { Popup } from './Popup'

export const queryClient = new QueryClient()
synchronizeQueryClient({ queryClient })

const rootElement = document.createElement('div')
rootElement.id = 'popup-root'
document.body.appendChild(rootElement)

const root = createRoot(rootElement)

root.render(
    <QueryClientProvider client={queryClient}>
        <Popup />
    </QueryClientProvider>,
)
