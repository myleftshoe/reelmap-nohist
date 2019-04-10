import React from 'react'
import Minibar from '../components/minibar';
import Filter from '../components/filter';
import Panes from '../panes/panes';
import Group from '../group/group';
import { panes } from '../constants';
import groupBy2 from '../utils/groupby2';

export default function DriverSidebar(props) {
    const { state, dispatch } = props;
    return (
        <>
            <Minibar>
                <Filter onChange={state.setFilter} />
                {/* <Minibar.Button onClick={() => setSortBy('City,PostalCode')}>location_city</Minibar.Button>
                <Minibar.Button onClick={() => setSortBy('PostalCode,City')}>local_post_office</Minibar.Button>
                <Minibar.Button onClick={() => setSortBy([])}>format_list_numbered</Minibar.Button> */}
            </Minibar>
            <Panes
                panes={panes}
                groupBy={'Driver'}
                items={state.filteredItems}
                isFiltered={state.isFiltered}
                onDrop={dispatch('drop')}
                onMaximizeEnd={dispatch('maximize-end')}
            // onOpenInNew={openInNew}
            >
                {items => {
                    const groupedItems = groupBy2(items, state.groupBy);
                    const groupKeys = Object.keys(groupedItems);
                    return groupKeys.map(groupKey =>
                        <Group
                            key={groupKey}
                            id={groupKey.split(',')[0]}
                            type={state.groupBy.split(',')[0]}
                            items={groupedItems[groupKey]}
                            content={groupKey}
                            // onHeaderClick={dispatch('GroupHeaderClick')}
                            onItemClick={state.setSelectedMarkerId}
                            activeItemId={state.selectedMarkerId}
                            flatten={groupKey === 'undefined'}
                            count={groupedItems[groupKey].length}
                            expanded={state.isFiltered}
                            filter={state.filter}
                        />
                    )
                }}
            </Panes>
        </>
    )
}