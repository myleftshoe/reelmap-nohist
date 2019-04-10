import React from 'react'
import { colors } from '../common/constants';
import Route from './route';

function Routes({ paths, hidden = false, onRightClick }) {
    if (hidden) return null;
    return paths.map(({ path, driver }) =>
        <Route
            key={`Route.${driver}`}
            id={`Route.${driver}`}
            path={path}
            color={colors[driver]}
            onRightClick={() => onRightClick(driver)}
        />
    )
}

export default Routes;