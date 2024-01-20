import React from 'react'
import { createRoot } from 'react-dom/client'

import { Popup } from './Popup'

const rootElement = document.createElement('div')
rootElement.id = 'popup-root'
document.body.appendChild(rootElement)

const root = createRoot(rootElement)

root.render(<Popup />)
