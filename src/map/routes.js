import React from 'react'
import { colors } from '../common/constants';
import Route from './route';

function Routes({ routes, hidden = false, onRightClick }) {
    if (hidden) return null;
    return routes.map(({ key, value }) => {
        return <Route
            key={`Route.${key}`}
            id={`Route.${key}`}
            path={value.geometry || ''}
            color={colors[key]}
            onRightClick={() => onRightClick(key)}
        />
    }
    )
}

export default Routes;