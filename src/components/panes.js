import React, { useState } from 'react'
import ArrayX from '../utils/arrayx';
import Pane from './pane';

const panesArray = [
    ['CHA', { count: 22 }],
    ['DRK', { count: 33 }],
    ['SAM1', { count: 44 }],
    ['UNASSIGNED', { count: 0 }],
];

// const panes = new Map(panesArray);

export default function Panes({ panes, data, groupBy, children, isFiltered, onDrop }) {

    const [_panes, setPanes] = useState(panes);
    const [maximizedPaneId, setMaximizedPaneId] = useState(null);
    console.log(maximizedPaneId);

    return _panes.map((id) => {
        const paneData = data.filter(({ [groupBy]: value }) => value === id || !value);
        return (
            <Pane
                key={id}
                id={id}
                title={id}
                count={paneData.length}
                countColor={isFiltered && paneData.length ? '#FACF00' : null}
                onReorder={setPanes}
                // expanded={paneKey === driver}
                maximized={maximizedPaneId}
                // onDrop=  {(_, e) => handleDrop(_, paneKey, e)}
                onDrop={onDrop}
                // onMouseOver={() => selectDriver(paneKey)}
                onMaximize={setMaximizedPaneId}
            >
                {children(paneData)}
            </Pane>
        )
    })
}
