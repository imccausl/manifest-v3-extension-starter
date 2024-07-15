import React from 'react'

import { useCurrentTab } from '../../shared/clients'

export const Popup: React.FC = () => {
    const { data } = useCurrentTab()

    return (
        <div>
            <h1>Hello, world!</h1>
            {data ? <p>Current tab: {data.id}</p> : null}
        </div>
    )
}
