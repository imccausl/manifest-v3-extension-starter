import React from 'react'

import { useCurrentTab } from '../../shared/clients'

export const ContentEntry: React.FC = () => {
    const { data } = useCurrentTab()
    return (
        <div>
            <h1>Hello, content script World!</h1>
            {data ? <p>Current tab: {data.id}</p> : null}
        </div>
    )
}
