import React, { useState } from 'react'
import Pane from './pane';
import { theme } from '../common/constants';
import Duration from '../utils/duration';

export default function Panes(props) {

    const { panes, items, routes, groupBy, children, isFiltered, onDrop, onMaximizeEnd, maxPaneId } = props;
    const [_panes, setPanes] = useState(panes);

    return _panes.map((id) => {
        const paneItems = groupBy ? items.where(groupBy, id) : items;
        const { start, end } = routes.get(id) || {};
        let info = '';
        if (start && end)
            info = `${Duration(start).format()} - ${Duration(end).format()}`
        return (
            <Pane
                key={id}
                id={id}
                title={id}
                count={paneItems.count()}
                info={info}
                countColor={isFiltered && paneItems.count() && theme.badgeColor}
                onReorder={setPanes}
                maximized={maxPaneId}
                onDrop={onDrop}
                onMaximize={onMaximizeEnd}
            >
                {children(paneItems.all())}
            </Pane>
        )
    })
}
