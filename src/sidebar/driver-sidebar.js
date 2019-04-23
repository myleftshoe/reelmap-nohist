import React from 'react'
import Minibar from '../common/minibar';
import Filter from '../common/filter';
import Panes from '../panes/panes';
import { panes } from '../common/constants';
import GroupedByDriver from './grouped-by-driver';

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
                routes={state.routes}
                isFiltered={state.isFiltered}
                onDrop={dispatch('drop')}
                onMaximizeEnd={dispatch('maximize-end')}
                maxPaneId={state.maxPaneId}
            >
                {   // key prevents PoseGroup from animating all items on view change
                    items => <GroupedByDriver key={state.sortBy} items={items} sortBy={state.sortBy} />
                }
            </Panes>
        </>
    )
}