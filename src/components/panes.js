import React, { useState } from 'react'
import Pane from './pane';

export default function Panes(props) {

    const { panes, items, groupBy, children, isFiltered, onDrop, onMaximizeEnd, onOpenInNew } = props;

    const [_panes, setPanes] = useState(panes);
    const [maximizedPaneId, setMaximizedPaneId] = useState(null);

    function handleMaximize(id) {
        setMaximizedPaneId(id);
        // Wait for pane transition before triggering rerender
        setTimeout(() => onMaximizeEnd(id), 500);
    }

    return _panes.map((id) => {
        const paneItems = groupBy ? items.where(groupBy, id) : items;
        return (
            <Pane
                key={id}
                id={id}
                title={id}
                count={paneItems.count()}
                countColor={isFiltered && paneItems.count() ? '#FACF00' : null}
                onReorder={setPanes}
                maximized={maximizedPaneId}
                onDrop={onDrop}
                onMaximize={handleMaximize}
                onOpenInNew={onOpenInNew}
            >
                {children(paneItems.all())}
            </Pane>
        )
    })
}
