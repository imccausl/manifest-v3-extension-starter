import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Popup } from './Popup'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

const rootElement = document.createElement('div')
rootElement.id = 'popup-root'
document.body.appendChild(rootElement)

const root = createRoot(rootElement)

root.render(
  <QueryClientProvider client={queryClient}>
    <Popup />
  </QueryClientProvider>,
)
