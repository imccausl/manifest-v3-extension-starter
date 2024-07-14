import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { createRoot } from 'react-dom/client'

import { synchronizeQueryClient } from '../shared/synchronizeQueryClient'

import { ContentEntry } from './ContentEntry'

const queryClient = new QueryClient()

const rootElement = document.createElement('div')
rootElement.id = 'content-root'
document.body.prepend(rootElement)

const root = createRoot(rootElement)
synchronizeQueryClient({ queryClient })
console.log('hello world')
root.render(
    <QueryClientProvider client={queryClient}>
        <ContentEntry />
    </QueryClientProvider>,
)
