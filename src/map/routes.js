import React from 'react'
import { useStore } from 'outstated'
import driverStore from '../app/driver-store'
import Route from './route';

function Routes({ routes, hidden = false, showPaths }) {
    const drivers = useStore(driverStore);
    if (hidden) return null;
    return routes.map(({ key, value }) => {
        const { color } = drivers.get(key);
        return <Route
            key={`Route.${key}`}
            id={`Route.${key}`}
            showPath={showPaths}
            path={value.geometry || ''}
            color={color}
        />
    }
    )
}

export default Routes;