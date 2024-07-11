import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

import { ContentEntry } from './ContentEntry'

const queryClient = new QueryClient()

const rootElement = document.createElement('div')
rootElement.id = 'content-root'
document.body.prepend(rootElement)

const root = createRoot(rootElement)
root.render(
  <QueryClientProvider client={queryClient}>
    <ContentEntry />
  </QueryClientProvider>,
)
