import React from 'react'
import Sidebar from './sidebar';
import Minibar from './minibar';
import Filter from './filter';
import Panes from './panes';
import Group from './group';
import { panes } from '../constants';

export default function DriverSidebar(props) {
    const { state, dispatch } = props;
    return (
        <Sidebar.Content>
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
                    // const groupedItems = groupBy2(items, state.groupBy);
                    const groupedItems = dispatch('group-items')({ items, by: state.groupBy });
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
        </Sidebar.Content>
    )
}